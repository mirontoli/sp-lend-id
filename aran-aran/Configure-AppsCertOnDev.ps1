# Develop provider hosted app on a single server development environment
# http://ranvijaysingh.blogspot.se/2013/04/develop-provider-hosted-app-on-single.html
# make sure App Management Service and User Profile Service are started (e.g. through Central Admin)
 
# add sp snap-in
if(-not(gsnp | ? { $_.Name -eq "Microsoft.SharePoint.PowerShell"})) { asnp Microsoft.SharePoint.PowerShell }

# Create certs
$makecert = "C:\Program Files\Microsoft Office Servers\15.0\Tools\makecert.exe"
$certmgr = "C:\Program Files\Microsoft Office Servers\15.0\Tools\certmgr.exe"
 
# define variables
$domain = "apps.com"
$outputDirectory = "C:\certificates"
if (!(Test-Path $outputDirectory)) {
    mkdir $outputDirectory
}
$publicCertificatePath = Join-Path $outputDirectory "$domain.cer"
$privateCertificatePath = Join-Path $outputDirectory "$domain.pfx"
 
Write-Host "Creating .cer certificate file..."
& $makecert -r -pe -n "CN=$domain" -b 01/01/2012 -e 01/01/2022 -eku 1.3.6.1.5.5.7.3.1 -ss my -sr localMachine -sky exchange -sy 12 -sp "Microsoft RSA SChannel Cryptographic Provider" $publicCertificatePath
 
Write-Host "Registering certificates with IIS..."
& $certmgr /add $publicCertificatePath /s /r localMachine root
 
# get certificate to obtain thumbprint
$publicCertificate = Get-PfxCertificate -FilePath $publicCertificatePath
$publicCertificateThumbprint = $publicCertificate.Thumbprint
gci Cert:\\LocalMachine\my | ? { $_.Thumbprint -eq $publicCertificateThumbprint } `
    | % { 
            Write-Host "... exporting private key for certificate (*.pfk)"
            $privateCertificateByteArray = $_.Export("PFX", "Password1")
            [System.IO.File]::WriteAllBytes($privateCertificatePath, $privateCertificateByteArray)
            Write-Host " Certificate exported" -ForegroundColor Gray
        }
 
 
 
# add sp snap-in
if(-not(gsnp | ? { $_.Name -eq "Microsoft.SharePoint.PowerShell"})) { asnp Microsoft.SharePoint.PowerShell }
 
# Client id generated using Visual Studio
# Make sure all letters are lowercase
# e.g. 2713b0af-3994-48a6-8fa0-c2073931a739
$appId = [system.guid]::newguid().tostring()
Write-Host -ForegroundColor Magenta "Please note the app id (issuer id): $appId"
 
$spurl = "http://dev"
 
$spweb = Get-SPWeb $spurl
 
$realm = Get-SPAuthenticationRealm -ServiceContext $spweb.Site
 
$certificate = Get-PfxCertificate $publicCertificatePath
 
$fullAppIdentifier = $appId + '@' + $realm 
 
New-SPTrustedSecurityTokenIssuer -Name "High Trust Sample App" -Certificate $certificate -RegisteredIssuerName $fullAppIdentifier
 
$appPrincipal = Register-SPAppPrincipal -NameIdentifier $fullAppIdentifier -Site $spweb -DisplayName "High Trust Sample App"
 
# Turn off SSL requirement on your Development machine: 
# http://msdn.microsoft.com/en-us/library/fp179901.aspx
 
$serviceConfig = Get-SPSecurityTokenServiceConfig
$serviceConfig.AllowOAuthOverHttp = $true
$serviceConfig.Update()