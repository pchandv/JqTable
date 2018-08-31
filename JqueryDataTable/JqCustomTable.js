/// <reference path="Scripts/jquery-2.2.0.js" />


(function () {
    $.fn.jqCustomTable = function (options) {
        var settings = $.extend({
            //dJson: [],
            Header: ["Report Name"],
            border: '1px',
            type: "GET",
            url: "",
            contentType: "application/json; charset=utf-8",
            search: "",
            tableCss: '',
            Editable: false,
            jdata:[]

        }, options);

        var table = $('<table id="tbl"></table>').addClass(settings.tableCss);
        
        //---Ajax call-----------------------------
        var JsonData=settings.jdata;
        $.ajax({
            type: settings.type,
            url: settings.url,
            async: false,
            contentType: settings.contentType,
            dataType:"json",
            success: function (data) {
                JsonData = data.d;
            },
            error: function (xhr, x, p) {
                console.log(xhr.error.toString());
                console.log(x.toString());
            }
        });

        //-------------------------


        //Header from Json

        var headerRow = $('<thead><tr></tr></thead>').addClass("HeaderCss");
        if (settings.Header.length === 0) {

            var array = [];

            $.each(JsonData, function (i, value) {
                delete value.__type;
                array = $.map(value, function (value, index) {
                    return [index];
                });
                return;
            });

            $.each(array, function (index, value) {
                var cell = $('<th></th>').text(value);
                headerRow.append(cell);
                if (settings.Editable && array.length - 1 == index) {
                    var ActionCell = $('<th>Action</th>');
                    headerRow.append(ActionCell);
                }
            });

        } else {
            $.each(settings.Header, function (index, value) {
                var cell = $('<th></th>').text(value);
                headerRow.append(cell);

                if (settings.Editable && settings.Header.length - 1 == index) {
                    var ActionCell = $('<th>Action</th>');
                    headerRow.append(ActionCell);
                }

            });
        }
        table.append(headerRow);


        GenerateTable(JsonData, settings, table);


        this.append(table);
        return this;
    }

    function GenerateTable(JsonData, settings, table) {

        table.attr('border', settings.border);
        //--Records from Json-------------------------------------------
        var row = $('<tr></tr>').addClass("HeaderCss");
        var tbody = $('<tbody></tbody>');
        $.each(JsonData, function (i, value) {
            var row = $('<tr></tr>').addClass("rowCss");
            delete value.__type;
          //  if (JsonData.length > 1) {
                var array = $.map(value, function (value, index) {
                    return [value];
                });
                $.each(array, function (index, value) {
                    var cell;
                    if(index!=0){
                        cell = $('<td  cellIndex ="' + i + "_" + index + '"><p id="par_' + i + "_" + index + '">' + value + '</p></td>').append();
                    }
                    if(array.length-1===index){
                        var deleteLink = $('<a>x</a>').click(function () {
                            alert('tr[rowIndex_' + i + '_' + index + ']');
                            $('tr[rowIndex_' + i + '_' + index + ']').remove();
                        });
                        cell.append(deleteLink);
                    }

                    row.append(cell);
                });
          //  }
            //else {
            //    var array = [];
            //    $.each(JsonData, function (i, value) {
            //        //delete value.__type;
            //        array = $.map(value, function (value, index) {
            //            return [value];
            //        });
            //        //return;
            //    });

            //    //var array = JsonData;
            //    flag = true;
            //    $.each(array, function (index, value) {
            //        if (index != 0) {
            //            var cell = $('<td  cellIndex ="' + i + "_" + index + '"><p id="par_' + i + "_" + index + '">' + value + '</p></td>').append();
            //        }
            //        if (array.length - 1 === index) {
            //            var deleteLink = $('<a>x</a>').click(function () {
            //                alert("You clicked me" + JsonData[i].firstName);
            //            });
            //            cell.append(deleteLink);
            //        }


            //        var cell = $('<td  cellIndex ="' + i + "_" + index + '"><p id="par_' + i + "_" + index + '">' + value + '</p></td>').append();
            //        cell.append(TxtBox);
            //        row.append(cell);
            //        var an = $('<a>Hello</a>');
            //        row.append(an);

            //    });
            //}
            tbody.append(row);

        });
        table.append(tbody);
    }



})(jQuery());

