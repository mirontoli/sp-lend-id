# Install an app in a usual way on your single development machine
# find the domain of the new app
Get-SPAppInstance -Web "http://dev" | Select LaunchUrl
# It can be like: http://app-9547f9ac923527.apps.com/QRCodeAppforSharePoint
 
# Open hosts file
$hosts = "$env:systemroot\system32\drivers\etc\hosts"
$loopback = "127.0.0.1"
 
# Add this to your loopback ip:
 
ac $hosts ("`t$loopback`t" + "app-9547f9ac923527.apps.com")
 
# Or just open host file in NotePad : C:\Windows\system32\drivers\etc\hosts
# and add this line manually
# 127.0.0.1 app-9547f9ac923527.apps.co