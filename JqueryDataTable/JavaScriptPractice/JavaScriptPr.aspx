<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JavaScriptPr.aspx.cs" Inherits="JqueryDataTable.JavaScriptPractice.JavaScriptPr" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <script>
        var Employee = function (FirstName,LastName) {
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.GetFullName = function () {
                return this.FirstName + this.LastName;
            };
        };



    </script>


</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    </div>
    </form>
</body>
</html>
