sp-lend-id.taprat
=================
Taprat is an powershell cmdlet for activating sharepoint features with the ability of specifiing properties. 
The idea is from 
[Per Jacobsen's answer](http://sharepoint.stackexchange.com/questions/33416/activate-feature-in-powershell-and-specify-custom-properties/33418#33418) 
on SharePoint.StackExchange. The detailed description of the implementation can be found on my blog.

This cmdlet can be in two different ways: as a module (per session) or as a pssnapin.

Installation as a module
========================
Download the dll from the install directory in Taprat. In PowerShell Go to the folder where you dropped the sp-lend-id.taprat.dll and import the module:
    Import-Module .\sp-lend-id.taprat.dll

Installation as a pssnapin
==========================
With a pssnapin you install it more or less permanently. To do so download the install/sp-lend-id.taprat.dll and in PowerShell go to the folder where it is.
Then run these commands:

    Set-Alias installutil $env:windir\Microsoft.NET\Framework64\v2.0.50727\installutil.exe
    installutil .\sp-lend-id.taprat.dll

The script can be found in install directory. So you can simply drag-n-drop the install-pssnapin.ps1 into a powershell window 
(after your have navigated to the folder where sp-lend-id.taprat.dll is).

After the pssnapin is installed, you can add it to your session:
    Add-PSSnapin sp-lend-id.taprat

Usage
=====
When the cmdlet is loaded (after importing it as a module, or installing and adding it as pssnapin), just create properties as a hashtable:

    $properties = @{"Test" = "SPLENDID", "Title" = "Taprat" }

Copy your feature's guid. In the test project, it is: `b5eef7d1-f46f-44d1-b53e-410f62032846` and then run:

    Enable-SPFeatureWithProperties -Identity "b5eef7d1-f46f-44d1-b53e-410f62032846" -Url "http://dev" -Properties $properties

The script can be found in install folder as well.