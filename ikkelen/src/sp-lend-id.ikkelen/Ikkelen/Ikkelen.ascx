<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Control Language="C#" AutoEventWireup="true" 
    CodeBehind="Ikkelen.ascx.cs" Inherits="sp_lend_id.ikkelen.Ikkelen.Ikkelen" %>
<link rel="stylesheet" href="/sp-lend-id/ikkelen.css"/>
<script type="text/javascript" 
    src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" 
    src="/sp-lend-id/ikkelen.js"></script>
<div data-role="notification-area"></div>
<input type="button" data-role="clickMe" value="Click me to show a notification"/>
<script type="text/javascript">
    ikkelen(jQuery, "<%= this.ClientID %>");
</script>
