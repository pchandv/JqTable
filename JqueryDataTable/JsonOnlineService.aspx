<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JsonOnlineService.aspx.cs" Inherits="JqueryDataTable.JsonOnlineService" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
      <script src="Scripts/jquery-2.2.0.js"></script>
     <script src="Scripts/bootstrap.js"></script>
     <link href="Content/bootstrap.css" rel="stylesheet" />
    <script src="JqTable.js"></script>
    <link href="JqTable.css" rel="stylesheet" />
     
     <script>
         $(document).ready(function () {
             $('#ts').JqTable({
                 Pageable: true,
                 IsServerPaging: true,
                 ServerPagingUrl: "http://localhost:49301/JsonOnlineService.aspx/Paging",
                 ServerPagingdata: "PageIndex",
                 IsSortable: true,
                 IsheaderDropdownList: true,
                 PageSize: 4,
                 TotalPages:3
             });

             //$('#ts').JqTable({
             //    Header: ["Album Id", "ID", "Title", "URL", "ThumbNail Url"],
             //    url: "https://jsonplaceholder.typicode.com/photos",
             //    Pageable: true,
             //    IsSortable: true,
             //    IsheaderDropdownList: true,
             //    IsSearchAble: true,
             //    HideColumns: ["albumId", "id"]
             //});

         });
     
         </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
     <div id="ts" >
   
        </div>
    </div>
    </form>
</body>
</html>
