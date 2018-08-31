<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ExampleJsonTable.aspx.cs" Inherits="JqueryDataTable.ExampleJsonTable" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="Scripts/jquery-2.2.0.js"></script>
     <script src="Scripts/bootstrap.js"></script>
    <script src="JqTable.js"></script>
    <link href="Content/bootstrap.css" rel="stylesheet" />
    <link href="JqTable.css" rel="stylesheet" />
  <%--  <script src="JqTable.min.js"></script>--%>
    <script>
        $(document).ready(function () {

            $('#Example').JqTable({
                Header: ["Id", "First Name","Last Name","Gender","Age","First","Last","Gen","Age"],
                //Header: ['PirmaryID', 'Name', 'Last', "F", 'Gen', 'Ag', 'Last', 'Gen', 'Ag'],
                url: "http://localhost:49301/Jquery_DataTable.aspx/getemp",
                surl: "http://localhost:49301/Jquery_DataTable.aspx/dsave",
                sdata:"s",
                type: "POST",
                border: '0px',
                tableCss: 'table',
                Editable: true,
                //IsheaderDropdownList: true,
                durl: "http://localhost:49301/Jquery_DataTable.aspx/DeleteRecord",
                ddata: "empDelete",
                primaryKey: "Id",
                IsSortable:true
            });
        });




    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
     <div id="Example" >
   
        </div>
    </div>
    </form>
</body>
</html>
