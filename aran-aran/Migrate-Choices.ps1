<#
.Synopsis
    Use MigrateChoices.ps1 to migrate choices from a field to managed metadata. The source can be a contenttype field
    from SharePoint 2010 or from SharePoint 2013. 
.Description
    This script uses client object model to get the list items from the old environment. Then it uses the Server Object Model to create new terms
    and termsets (if needed) in the new environment. 
    This script doesn't override anything. The reason why we use it, is that importing feature isnt easy
    It creates a new, instead of adding new terms to old ones. It is very hard to create an csv file for that purpose.
.Example
    MigrateChoices.ps1 -Source http://sp2010.contoso.com -Target https://sp2013.contoso.com
.Notes
    Name: MigrateChoices.ps1
    Author: Anatoly Mironov
    Last Edit: 2013-09-04
    Keywords: CSOM, Field, FieldChoice, Metadata, Termset
.Links
    http://chuvash.eu
.Inputs
    The script takes Source parameter, it is url for the root web in the Source Site Collection
    The script takes Target parameter, it is url for the root web in the Target Site Collection
.Outputs
    None
#Requires -Version 2.0
#>
[CmdletBinding()]
Param(
[Parameter(Mandatory=$true)][System.String]$Source = $(Read-Host -prompt "Source site Url"),
[Parameter(Mandatory=$true)][System.String]$Target = $(Read-Host -prompt "Target site Url"),
[Parameter(Mandatory=$false)][System.String]$TermGroupName = "My group",
[Parameter(Mandatory=$false)][System.String]$TermGroupId,
[Parameter(Mandatory=$false)][System.String]$TermSetName = "My termset",
[Parameter(Mandatory=$false)][System.String]$TermSetId,
[Parameter(Mandatory=$false)][System.String]$FieldName = $(Read-Host -prompt "Field Choice Name")
)

if(-not(gsnp | ? { $_.Name -eq "Microsoft.SharePoint.PowerShell"})) { asnp Microsoft.SharePoint.PowerShell }

# try to instantiate the target site, if it fails, then it does not run in the right environment
$targetSite = get-spsite $Target

# predefined termset guids:
$guids = @{
        "group" = if ($TermGroupId) {New-Object system.guid $TermGroupId } else { [system.guid]::NewGuid() }
        "termset" = if ($TermSetId) {New-Object system.guid $TermSetId } else { [system.guid]::NewGuid() }
        }
        

function GetChoices() {
    $ctx = New-Object Microsoft.SharePoint.Client.ClientContext($Source)
    $field = $ctx.Web.Fields.GetByInternalNameOrTitle($FieldName)
    $ctx.Load($field)
    $ctx.ExecuteQuery()
    return ([xml]$field.SchemaXml).Field.Choices.Choice
}

function New-Term {
[CmdletBinding()]
Param(
[Parameter(Mandatory=$true)][Microsoft.SharePoint.Taxonomy.TermSetItem]$parent,
[Parameter(Mandatory=$true)][System.String]$name
)
    if (!$parent) {
        throw new-object System.ArgumentException $parent
    }
    if (!$name) {
        throw new-object System.ArgumentException $name
    }
    $term = $parent[$name]
    if (!$term) {
        $parent.CreateTerm($name, 1033) | out-null
    }
}

$taxSession = Get-SPTaxonomySession -Site $targetSite
$termStore = $taxSession.DefaultSiteCollectionTermStore

$group = $termstore.Groups[$TermGroupName]
if (!$group) {
    $group = $termStore.CreateGroup($TermGroupName, $guids.group)
}

$termSet = $group.TermSets[$TermsetName]
if (!$termset) {
	$termset = $group.CreateTermSet($SecurityClassificationTermSetName, $guids.termset, 1033)
}

GetChoices | % { New-Term $termSet $_ }
$termStore.CommitAll()
$targetSite.Dispose()
write-host -ForegroundColor Green "The term sets have been created"

