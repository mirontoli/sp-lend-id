# add sp snap-in
if(-not(gsnp | ? { $_.Name -eq "Microsoft.SharePoint.PowerShell"})) { asnp Microsoft.SharePoint.PowerShell }
 
#define variables
$appPoolAccount = "takana\sp_apppool"
$domain = "apps.com"
$prefix = "app"
$rootSite = "http://dev"
 
function Start-ServiceInstance($Name) {
  $svcInst = Get-SPServiceInstance | ? { $_.TypeName -eq $Name }
  if ($svcInst.Status -ne "Online") {
      Start-SPServiceInstance -Identity $svcInst.Id  | Out-Null
      for($i = 0; $i -lt 10; $i++)
      {
          $svcInst = Get-SPServiceInstance | ? { $_.TypeName -eq $Name }
          if ($svcInst.Status -eq "Online") {
              break
          }
      }
  }
}
 
# Start Services needed for the App development
Start-ServiceInstance -Name "Microsoft SharePoint Foundation Subscription Settings Service"
Start-ServiceInstance -Name "App Management Service"
 
# get application pool managed account
$account = Get-SPManagedAccount $appPoolAccount
 
# create app pool: Subscription settings
$appPoolSubSvc = New-SPServiceApplicationPool -Name SettingsServiceAppPool -Account $account
 
# create service application: Subscription Settings
$appSubSvc = New-SPSubscriptionSettingsServiceApplication -ApplicationPool $appPoolSubSvc -Name SettingsServiceApp -DatabaseName SP2013_Subscription_Settings
 
# screate proxy: Subscription Settings
$proxySubSvc = New-SPSubscriptionSettingsServiceApplicationProxy -ServiceApplication $appSubSvc
 
# create app pool: App Management
$appPoolAppSvc = New-SPServiceApplicationPool -Name AppServiceAppPool -Account $account
 
# create service application: App Management
$appAppSvc = New-SPAppManagementServiceApplication -ApplicationPool $appPoolAppSvc -Name AppServiceApp -DatabaseName SP2013_App_Management
 
# create proxy: App Management
$proxyAppSvc = New-SPAppManagementServiceApplicationProxy -ServiceApplication $appAppSvc
 
# Define app domain
set-spappdomain $domain
 
# Define app prefix
Set-SPAppSiteSubscriptionName -name $prefix -confirm:0
 
# Enable SideLoading to be able to install apps from remote  computer:
Enable-SPFeature e374875e-06b6-11e0-b0fa-57f5dfd72085 –url $rootSite
 
 
function Stop-DefaultWebSite() {
    # function is taken from autospinstaller
    # http://autospinstaller.codeplex.com/SourceControl/latest#AutoSPInstallerFunctions.ps1
    $queryOS = Gwmi Win32_OperatingSystem
    $queryOS = $queryOS.Version
    Try
    {
        If ($queryOS.Contains("6.0")) # Win2008
        {
            If (!(Get-PSSnapin WebAdministration -ErrorAction SilentlyContinue))
            {
                If (!(Test-Path $env:ProgramFiles\IIS\PowerShellSnapin\IIsConsole.psc1))
                {
                    Start-Process -Wait -NoNewWindow -FilePath msiexec.exe -ArgumentList "/i `"$env:SPbits\PrerequisiteInstallerFiles\iis7psprov_x64.msi`" /passive /promptrestart"
                }
                Add-PSSnapin WebAdministration
            }
        }
        Else # Win2008R2 or Win2012
        {
            Import-Module WebAdministration
        }
    }
    Catch
    {
        Throw " - Could not load IIS Administration module."
 
    }
 
    $defaultWebsite = Get-Website | Where-Object {$_.Name -eq "Default Web Site" -or $_.ID -eq 1 -or $_.physicalPath -eq "%SystemDrive%\inetpub\wwwroot"} # Try different ways of identifying the Default Web Site, in case it has a different name (e.g. localized installs)
    Write-Host -ForegroundColor White " - Checking $($defaultWebsite.Name)..." -NoNewline
    if ($defaultWebsite.State -ne "Stopped")
    {
        Write-Host -ForegroundColor White "Stopping..." -NoNewline
        $defaultWebsite | Stop-Website
        if ($?) {Write-Host -ForegroundColor White "Done."}
    }
    else {Write-Host -ForegroundColor White "Already stopped."}
}
 
# Stop the default web site in IIS
Stop-DefaultWebSite
 
# Some other instructions
Write-Warning "Don't forget to add $domain into your local sites in IE"