<#
.Synopsis
	Use Pull-Documents to copy the entire document library to disk
.Description
	This script iterates recursively over all directories and files in a document library and writes binary data to the disk
	The structure is kept as in the Document library
	It is mainly written for SharePoint 2007, but it works even in SharePoint 2010
.Example
	Pull-Document -Url http://dev -Library "Shared Documents"
.Notes
	Name: Pull-Documents.ps1
	Author: Anatoly Mironov
	Last Edit: 2012-12-03
	Keywords: SPList, Documents, Files, SPDocumentLibrary
.Links
	http://sharepointkunskap.wordpress.com
	http://www.bool.se
.Inputs
	None
.Outputs
	None
#Requires -Version 1.0
#>
[CmdletBinding()]
Param(
[Parameter(Mandatory=$true)][System.String]$Url = $(Read-Host -prompt "Web Url"),
[Parameter(Mandatory=$true)][System.String]$Library = $(Read-Host -prompt "Document Library")
)
[void][System.Reflection.Assembly]::LoadWithPartialName("Microsoft.SharePoint")

$site = new-object microsoft.sharepoint.spsite($Url)
$web = $site.OpenWeb()
$site.Dispose()

$folder = $web.GetFolder($Library)
$folder # must output it otherwise "doesn't exist" in 2007

if(!$folder.Exists){
	Write-Error "The document library cannot be found"
	$web.Dispose()
	return
}

$directory = $pwd.Path

$rootDirectory = Join-Path $pwd $folder.Name

if (Test-Path $rootDirectory) {
	Write-Error "The folder $Library in the current directory already exists, please remove it"
	$web.Dispose()
	return
}

#progress variables
$global:counter = 0
$global:total = 0
#recursively count all files to pull
function count($folder) {
	if ($folder.Name -ne "Forms") {
		$global:total += $folder.Files.Count
		$folder.SubFolders | Foreach { count $_ }
	}
}
write "counting files, please wait..."
count $folder
write "files count $global:total"

function progress($path) {
	$global:counter++
	$percent = $global:counter / $global:total * 100
	write-progress -activity "Pulling documents from $Library" -status $path -PercentComplete $percent
}

#Write file to disk
function Save ($file, $directory) {
	$data = $file.OpenBinary()
	$path = Join-Path $directory $file.Name
	progress $path
	[System.IO.File]::WriteAllBytes($path, $data)
}

#Forms folder doesn't need to be copied
$formsDirectory = Join-Path $rootDirectory "Forms"

function Pull($folder, [string]$directory) {
	$directory = Join-Path $directory $folder.Name
	if ($directory -eq $formsDirectory) {
		return
	}
	mkdir $directory | out-null
	
	$folder.Files | Foreach { Save $_ $directory }

	$folder.Subfolders | Foreach { Pull $_ $directory }
}

Write "Copying files recursively"
Pull $folder $directory

$web.Dispose()