<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Jquery_DataTable.aspx.cs" Inherits="JqueryDataTable.JqueryDataTable" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
  
    <%--<script src="Scripts/jquery-2.2.0.js"></script>
      <script src="Scripts/bootstrap.js"></script>--%>


     <script src="Scripts/jquery-2.2.0.js"></script>

    <script src="Scripts/bootstrap.js"></script>

    <script src="JqTable.js"></script>
    <script src="JqCustomTable.js"></script>
    <link href="Content/bootstrap.css" rel="stylesheet" />
    <link href="JqTable.css" rel="stylesheet" />
   
  <%--  <script src="JqTable.min.js"></script>--%>
    <script>
        $(document).ready(function () {
            
            //var returnData;
            //var table = $('<table></table>').addClass('foo');
            //$.ajax({
            //    type: "POST",
            //    url: "http://localhost:49301/Jquery_DataTable.aspx/getemp",
            //    async: false,
            //   // dataType: 'json',
            //   contentType: "application/json; charset=utf-8",
            //    success: function (data) {
            //        returnData = data.d;
            //    },
            //    error: function (xhr,x,p) {
            //        alert();
            //    }
            //});
            ////returnData.sort(dynamicSort("Id"));
           
           

                
            ////$.each(returnData, function (i, value) {
            ////    var row = $('<tr></tr>');
            ////    delete value.__type;
            ////    var array = $.map(value, function (value, index) {
            ////        return [value];
            ////    });
            ////    $.each(array, function (index, value) {
            ////        if (index == 3) {
            ////            var url = '<a href="' + value + '">X</a>';
            ////            var cell = $('<td></td>').append(url);
            ////        } else {
            ////            var cell = $('<td></td>').text(value);
            ////        }
            ////        row.append(cell);
            ////    });
            ////    table.append(row);
            ////});
            //////----------------------------

            ////$('#tst').append(table);
            //////--------------------

            //function dynamicSort(property) {
            //    var sortOrder = 1;
            //    if (property[0] === "-") {
            //        sortOrder = -1;
            //        property = property.substr(1);
            //    }
            //    return function (a, b) {
            //        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            //        return result * sortOrder;
            //    }
            //}

            ////var jso

            $.getJSON("/jsonss.json", function (data) {
                console.log(data);
            });

            $('#ts').JqTable({
                // Header: ['PirmaryID', 'Name', 'Last', "F", 'Gen', 'Ag', 'Last', 'Gen', 'Ag'],
               // Header:["Display","Url"],
               //  url: "/jsonss.json",
                url: "http://localhost:49301/Jquery_DataTable.aspx/getemp",
              //  surl: "http://localhost:49301/Jquery_DataTable.aspx/dsave",
             //   sdata:"s",
               type: "POST",
                border: '0px',
                tableCss: 'table',
                Editable: true,
              IsheaderDropdownList: true,
              //  durl: "http://localhost:49301/Jquery_DataTable.aspx/DeleteRecord",
                ddata: "empDelete",
               // Pageable: true
                primaryKey:"Id"
               // MultiHeaderNames: [{ "Primay Key": "1", "User Name": "4", "Users Name": "4" }]
            });
            
            var table = document.getElementById("tbl");
            var header = table.createTHead();
            var row = header.insertRow(0);
            var cell = row.insertCell(0);
           // cell.innerHTML = "<b>This is a table header</b>";

            //var txt='[{"firstName":"John", "lastName":"Doe"},{"firstName":"Anna", "lastName":"Smith"}, {"firstName":"Peter", "lastName":"Jones"}]';
            //$("#tst").jqCustomTable({
            //    jdata:JSON.parse(txt)
            //});








          });
       



    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div id="tst">

   
        </div>
        <div id="ts" >
   
        </div>
        
    </form>
</body>
</html>
