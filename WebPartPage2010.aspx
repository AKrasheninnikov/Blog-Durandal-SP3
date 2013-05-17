<%-- _lcid="1033" _version="14.0.4762" _dal="1" --%>
<%-- _LocalBinding --%>

<%@ page language="C#" masterpagefile="~masterurl/default.master" inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=14.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>

<%@ register tagprefix="SharePoint" namespace="Microsoft.SharePoint.WebControls" assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ register tagprefix="Utilities" namespace="Microsoft.SharePoint.Utilities" assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ import namespace="Microsoft.SharePoint" %>
<%@ assembly name="Microsoft.Web.CommandUI, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ register tagprefix="WebPartPages" namespace="Microsoft.SharePoint.WebPartPages" assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:content contentplaceholderid="PlaceHolderPageTitle" runat="server">
	<SharePoint:ListItemProperty Property="BaseName" maxlength="40" runat="server"/>
</asp:content>
<asp:content contentplaceholderid="PlaceHolderPageTitleInTitleArea" runat="server">
	<WebPartPages:WebPartZone runat="server" title="loc:TitleBar" id="TitleBar" AllowLayoutChange="false" AllowPersonalization="false"/>
</asp:content>
<asp:content contentplaceholderid="PlaceHolderTitleAreaClass" runat="server">
  <style type="text/css">
    Div.ms-titleareaframe
    {
      height: 100%;
    }

    .ms-pagetitleareaframe table
    {
      background: none;
    }
  </style>
</asp:content>
<asp:content contentplaceholderid="PlaceHolderAdditionalPageHead" runat="server">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
	<meta name="GENERATOR" content="Microsoft SharePoint" />
	<meta name="ProgId" content="SharePoint.WebPartPage.Document" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="CollaborationServer" content="SharePoint Team Web Site" />
	
    <!-- Development CSS files start -->
    <link rel="stylesheet" type="text/css" href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css">
    <link rel="stylesheet" type="text/css" href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-responsive.min.css">
    <link rel="stylesheet" type="text/css" href="//netdna.bootstrapcdn.com/font-awesome/3.0.2/css/font-awesome.css">

    <link rel="stylesheet" href="Content/toastr.css"  />
    <link rel="stylesheet" href="Content/durandal.css" type="text/css"/>
    <link rel="stylesheet" href="Content/app.css" type="text/css"/>
    <!-- Development CSS files end -->

	
	<script type="text/javascript">
	  // <![CDATA[
	  var navBarHelpOverrideKey = "WSSEndUser";
	  // ]]>
	</script>
	  <SharePoint:UIVersionedContent ID="WebPartPageHideQLStyles" UIVersion="4" runat="server">
		<ContentTemplate>
<style type="text/css">
  body #s4-leftpanel
  {
    display: none;
  }

  .s4-ca
  {
    margin-left: 0px;
  }
</style>
		</ContentTemplate>
	</SharePoint:UIVersionedContent>
</asp:content>
<asp:content contentplaceholderid="PlaceHolderSearchArea" runat="server">
	<SharePoint:DelegateControl runat="server"
		ControlId="SmallSearchInputBox" />
</asp:content>
<asp:content contentplaceholderid="PlaceHolderLeftActions" runat="server">
</asp:content>
<asp:content contentplaceholderid="PlaceHolderPageDescription" runat="server">
	<SharePoint:ProjectProperty Property="Description" runat="server"/>
</asp:content>
<asp:content contentplaceholderid="PlaceHolderBodyRightMargin" runat="server">
	<div height="100%" class="ms-pagemargin"><img src="/_layouts/images/blank.gif" width="10" height="1" alt="" /></div>
</asp:content>
<asp:content contentplaceholderid="PlaceHolderPageImage" runat="server"></asp:content>
<asp:content contentplaceholderid="PlaceHolderNavSpacer" runat="server"></asp:content>
<asp:content contentplaceholderid="PlaceHolderLeftNavBar" runat="server"></asp:content>
<asp:content contentplaceholderid="PlaceHolderMain" runat="server">
		<table cellpadding="4" cellspacing="0" border="0" width="100%">
				<tr>
					<td id="_invisibleIfEmpty" name="_invisibleIfEmpty" valign="top" width="100%"> <WebPartPages:WebPartZone runat="server" Title="loc:FullPage" ID="FullPage" FrameType="TitleBarOnly"/>
						<div id="applicationHost">
              <div class="splash">
                <div class="message">
                  Durandal SP3 Demo
                </div>
                <i class="icon-spinner icon-2x icon-spin active"></i>
              </div>
						</div>
					</td>
				</tr>
				<script type="text/javascript" language="javascript">if (typeof (MSOLayout_MakeInvisibleIfEmpty) == "function") { MSOLayout_MakeInvisibleIfEmpty(); }</script>
		</table>
		
	<!-- JS files start -->
		<!-- JSON support for older browser e.g. <IE8 -->
		<script type="text/javascript">window.JSON || document.write('<script src="//cdnjs.cloudflare.com/ajax/libs/json2/20121008/json2.js"><\/script>')</script>
		
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/2013.01/jquery.SPServices-2013.01.min.js"></script>
        <script src="//ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/sammy.js/0.7.4/sammy.min.js"></script>

        <script src="Scripts/toastr.js"></script>
    <!-- Development JS files start -->    
    
    <script type="text/javascript" src="app/main-built.js"></script>
	
</asp:content>
