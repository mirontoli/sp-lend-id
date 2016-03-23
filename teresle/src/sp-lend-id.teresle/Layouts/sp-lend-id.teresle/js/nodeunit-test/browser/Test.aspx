<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Test.aspx.cs" Inherits="sp_lend_id.teresle.Test" DynamicMasterPageFile="~masterurl/default.master" %>

<asp:Content ID="PageHead" 
    ContentPlaceHolderID="PlaceHolderAdditionalPageHead" 
    runat="server">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script src="nodeunit.js"></script>
    <script src="../../CustomerModel.js"></script>
    <script src="TestCustomerModel.js"></script>
</asp:Content>

<asp:Content ID="Main" 
    ContentPlaceHolderID="PlaceHolderMain" 
    runat="server">
    <div id="nodeunit_wrapper">
        <script>
            function test() {
                nodeunit.run({
                    'suite1': customer_model_test
                });
            }

            jQuery(document).on({
                ready: test
            });
        </script>
    </div>
</asp:Content>

<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
sp-lend-id Test
</asp:Content>

<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server" >
sp-lend-id Test
</asp:Content>
