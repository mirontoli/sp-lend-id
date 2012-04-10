Import-Module C:\code\sp-lend-id\taprat\cmdlet\sp-lend-id.taprat\bin\Debug\sp-lend-id.patrat.dll
Get-Module
Get-DemoNames
 #should output
 
 #Tolle
 #Sinan
 #Frissan
 #Ekan
 
 
$props = @{"Test" = "SPLENDID" }
Enable-SPFeatureWithProperties -Identity "b5eef7d1-f46f-44d1-b53e-410f62032846" -Url "http://dev" -Properties $props