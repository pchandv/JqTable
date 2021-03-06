﻿/// <reference path="Scripts/jquery-2.2.0.js" />
/*
1.Header:Define the custom Headers and should match the exactly jsonHeader length--->Example:Header:["FirstName","LastName"] 
2.url:Provide the Service Url for getting list of records from database or DataSource
3.sUrl:Provide the Service Url for Saving the record-(data will be returned in terms of model)
4.sdata:Provide Save method input parameter Name
example-->SaveRecords(EmployeeClass Emp) ---->sdata:"Emp"
5.durl:Provide the Service Url for Deleting the record
6.ddata:Parameter Name
7.tableCss:Provide the CssClass
8.Pageable: set true,to enable Paging for JqTable
9.Editable:set true,to enable Edit functionality for Jqtable
10.PrimaryKey:provide the Primary key that should match jsondata 
11.Issortable:set true,to enable sort functionality
12.IsSearchAble:set true,to enable Search functionality in JqTable
13.Search:by default,the search box is empty
14.Content Type: by default it is set to Json type
15.border:by default it is set to 1px and can be editable

16.MultiHeaderNames:to enable multiheader pass a value as shown below (HeaderName as Key and Colspan)--
Note:MultiHeaderNames Not working properly 
Example:
$('#ts').JqTable({
     Header: ['PirmaryID', 'Name', 'Last', "F", 'Gen', 'Ag', 'Last', 'Gen', 'Ag'],
     url: "http://localhost:49301/Jquery_DataTable.aspx/getemp",
     surl: "http://localhost:49301/Jquery_DataTable.aspx/dsave",
     sdata:"s",
     type: "POST",
     border: '0px',
     tableCss: 'table',
     Editable: true,
     IsheaderDropdownList: true,
     durl: "http://localhost:49301/Jquery_DataTable.aspx/DeleteRecord",
     ddata: "empDelete",
     Pageable: true
     primaryKey: "Id"
     MultiHeaderNames: [{ "Primay Key": "1", "User Name": "4", "Users Name": "4" }]
});

17.IsheaderDropdownList:set to true, to enable Dropdown sort functionlality
Example:
 $('#ts').JqTable({
                 Header: ["Album Id","ID","Title","URL","ThumbNail Url"],
                 url: "https://jsonplaceholder.typicode.com/photos",
                 Pageable: true,
                 IsSortable: true,
                 IsheaderDropdownList: true,
                 IsSearchAble: true,
                 HideColumns: ["albumId", "id"]
             });
18.HideColumns:To hide the columns in the Jqtable,Provide the ColumnNames  that matchs with Json data
19.JsondataProperty: Provide the property name which contains array of list or records
20.IsServerPaging:Set to true to make server side paging
21.ServerPagingUrl:Provide web service URL
22.ServerPagingdata:Provide the Parameter Name for WebService -example:PageIndexId
23.PageSize:Provide the Page size 
24.TotalPages:Provide the Number of pages you want to display
example:
 $('#ts').JqTable({
                 Pageable: true,
                 IsServerPaging: true,
                 ServerPagingUrl: "http://localhost:49301/JsonOnlineService.aspx/Paging",
                 ServerPagingdata: "PageIndex",
                 PageSize: 4,
                 TotalPages:3
             });




*/
var CurrentPageIndex = 1;
var Global_JsonData;
var Global_HeaderFromJson = [];
var settings;
var table;
var HeaderNamesFromJson = [];
var dropdownListSelectedValues = [];
var TotalPages;
var colSpanForNoreCords;
(function () {
    $.fn.JqTable = function (options) {
        settings = $.extend({
            //dJson: [],
            Header: [],
            border: '0px solid #ffffff',
            type: "GET",
            url: "",
            sdata: "",
            surl: "",
            durl: "",
            ddata: "",
            contentType: "application/json; charset=utf-8",
            search: "",
            tableCss: '',
            Editable: false,
            Pageable: false,
            IsheaderDropdownList: false,
            primaryKey: "",
            IsSortable: false,
            MultiHeaderNames: [],
            IsSearchAble: false,
            HideColumns: [],
            IsServerPaging: false,
            ServerPagingUrl: "",
            ServerPagingdata: "",
            JsondataProperty: "d",
            PageSize: 10,
            TotalPages:0
        }, options);
        //1.Initialization Event
        Get_JsonData();
        if (Array.isArray(Global_JsonData)) {
            if (settings.IsServerPaging) {
                TotalPages = settings.TotalPages;
            } else {
                TotalPages = Math.round(Global_JsonData.length / 10);
            }
            

        }
        //2.Get Header Names from Json
        Get_HeaderNamesFromJson();
        //3.Create Search Box
        if (settings.IsSearchAble) {
            Generate_SearchBox(this);
        }
        //4.Create Table
        CreateTable();
        //5.Create Header into Table
        if (!settings.IsServerPaging) {
            $('#tbl thead').remove();
            CreateHeader();
        }

       // CreateHeader();
        //6.GenerateRows from JsonData
        GenerateRows(Global_JsonData, CurrentPageIndex);
        //7.Search Event Fired based on the text entered by user
        $('#searchtxt').on("input", function () {
            //--------Search----------------------------

            var txt = $('#searchtxt').val();
            var FilteredObjects = [];
            if (txt != "") {
                var listOfSelected = [];
                $.each(Global_JsonData, function (i, value) {
                    delete value.__type;
                    var array = $.map(value, function (v, index_j) {
                        return [v];
                    });

                    $.each(array, function (index_i, valueOfEle) {
                        var vvalue = valueOfEle.toString();

                        if (vvalue.toLowerCase().indexOf(txt.toLowerCase()) >= 0)
                        { listOfSelected.push(i); return; }
                    });



                });
                var uniqueofSelected = [];
                $.each(listOfSelected, function (i, el) {
                    if ($.inArray(el, uniqueofSelected) === -1) uniqueofSelected.push(el);
                });

                $.each(uniqueofSelected, function (index, Value) {
                    FilteredObjects.push(Global_JsonData[Value]);
                });

                if (FilteredObjects.length != 0) {
                    $('#tbl tbody').remove();
                    GenerateRows(FilteredObjects, 1);
                }
            } else {
                $('#tbl tbody').remove();
                GenerateRows(Global_JsonData, CurrentPageIndex);
                // GenerateTable(JsonData, settings, table, CurrentPageIndex);
            }
        });

        var divEnclosed = $('<div></div>');
        divEnclosed.addClass("DivEnclosed");
        divEnclosed.append(table);
        this.append(divEnclosed);
        this.addClass("PluginCss");
        return this;
    }
    //---------------------------Life Cycle Events------------------------------------------------------
    //-Common Methods--First Event--Ajax call-----------------------------
    function Get_JsonData() {
        // var JsonD;
        if (!settings.IsServerPaging) {
            TotalPages = settings.TotalPages;

            $.ajax({
                type: settings.type,
                url: settings.url,
                async: false,
                contentType: settings.contentType,
                success: function (data) {
                    //console.log(data.d);
                    if (data.hasOwnProperty(settings.JsondataProperty)) {

                        Global_JsonData = data[settings.JsondataProperty];
                    }
                    else if (Array.isArray(data)) {
                        Global_JsonData = data;
                    }
                },
                error: function (xhr, x, p) {
                    console.log(xhr.responseText);
                    console.log(x.toString());
                }
            });
        } else {

            $.ajax({
                type: "POST",
                url: settings.ServerPagingUrl,
                async: false,
                dataType: 'json',
                contentType: settings.contentType,
                data: "{" + settings.ServerPagingdata + ":" + JSON.stringify(CurrentPageIndex) + "} ",
                success: function (data) {
                    //console.log(data.d);
                    if (data.hasOwnProperty(settings.JsondataProperty)) {
                        Global_JsonData = data[settings.JsondataProperty];
                    }
                    else if (Array.isArray(data)) {
                        Global_JsonData = data;

                    }
                    JsonPaging(Global_JsonData, CurrentPageIndex);
                },
                error: function (xhr, x, p) {
                    console.log(xhr.responseText);
                    console.log(x.toString());
                }
            });

        }
        // return JsonD;
    }
    //Second Event
    //------Json Header from JsonObject--------------------------------
    function Get_HeaderNamesFromJson() {
        // var HeaderNamesFromJson;
        $.each(Global_JsonData, function (i, value) {
            delete value.__type;
            Global_HeaderFromJson = $.map(value, function (value, index) {
                return [index];
            });
            return;
        });
        // return HeaderNamesFromJson;
    }
    //Third Event-------------------------
    function Generate_SearchBox(jq) {
        var s = "<div><div style='float:right;padding: 0.6%;'><label class='lblSearch'>Search </label>&nbsp<input id='searchtxt' type='text' class='srch'></div></div>";
        jq.append(s);
    }
    //FOurthEvent
    function CreateTable() {
        table = $('<table id="tbl"></table>').addClass(settings.tableCss);
    }
    //5.HeaderEvent
    function CreateHeader() {
        //---------------------------------------------------------------
        $("#tbl thead").remove();
        //Header from Json
        var JsonHeader = Global_HeaderFromJson;
        var JsonData = Global_JsonData;
        var TheadRow = $('<thead></thead>').addClass("HeaderCss");
        var headerRow = $('<tr></tr>');
        if (settings.MultiHeaderNames.length != 0) {
            var MainHeaderRow = $('<tr></tr>');

            var array = settings.MultiHeaderNames;//[{ "Primay Key": "1", "User Name": "4", "Users Name": "4" }];
            $.each(array, function (i, v) {
                console.log(i);

                $.each(v, function (ii, vv) {
                    var Cell = $("<th></th>");
                    console.log(ii + ":" + vv);
                    Cell.append(ii);
                    Cell.attr("colspan", vv)
                    MainHeaderRow.append(Cell);
                });
            });





            TheadRow.append(MainHeaderRow);
        }



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

                var ColFlag = true;
                $.each(settings.HideColumns, function (id, vlue) {
                    if (Global_HeaderFromJson[index] == vlue) {
                        ColFlag = false;
                    }
                });

                if (ColFlag) {
                    var cell = $('<th></th>');//.text(value);
                    var headerColumnClass = Global_HeaderFromJson[index];
                    cell.addClass(headerColumnClass);
                    if (settings.IsheaderDropdownList == true) {
                        var drp = GenerateDropDownList(index, JsonData);
                        var HeaderDrp = $("<div></div>");
                        cell.append(HeaderDrp.append(drp));
                    }
                    if (settings.IsSortable) {
                        var SortKey;
                        $.each(Global_HeaderFromJson, function (jindex, jvalue) {
                            if (index == jindex) {
                                SortKey = jvalue;
                            }

                        });
                        var sortLink = $('<a id="' + value + '" sortOrderAsc="false" SortKey="' + SortKey + '">' + value + '</a> <br>').click(function () {

                            var bSort = $(this).attr('sortOrderAsc');
                            var bSortKey = $(this).attr('SortKey');
                            JsonData.sort(dynamicSort(bSortKey, bSort));
                            $('#tbl tbody').remove();
                            GenerateRows(JsonData, CurrentPageIndex);
                            if (bSort === "true") {
                                $(this).attr('sortOrderAsc', false);
                            } else {
                                $(this).attr('sortOrderAsc', true);
                            }
                            return false;
                        });
                        cell.append(sortLink);
                    } else {
                        var HeaderName = $('<div><label>' + value + '</div>');
                        HeaderName.css("text-align", "center");
                        cell.append(HeaderName);
                    }
                    headerRow.append(cell);
                    if (settings.Editable && array.length - 1 == index) {
                        var ActionCell = $('<th><label class="HeaderLabel">Action<label></th>');
                        ActionCell.addClass("ActioncellClass");
                        headerRow.append(ActionCell);
                    }
                }
            });

        } else {
            $.each(settings.Header, function (index, value) {
                var ColFlag = true;
                $.each(settings.HideColumns, function (id, vlue) {
                    if (Global_HeaderFromJson[index] == vlue) {
                        ColFlag = false;
                    }
                });

                if (ColFlag) {
                    var cell = $('<th></th>');//.text(value);

                    if (settings.IsheaderDropdownList == true) {
                        var drp = GenerateDropDownList(index, JsonData);
                        var HeaderDrp = $("<div></div>");
                        cell.append(HeaderDrp.append(drp));
                    }
                    if (settings.IsSortable) {
                        var SortKey;
                        $.each(Global_HeaderFromJson, function (jindex, jvalue) {
                            if (index == jindex) {
                                SortKey = jvalue;
                            }

                        });
                        var sortLink = $('<a id="' + value + '" sortOrderAsc="false" SortKey="' + SortKey + '">' + value + '</a> <br>').click(function () {

                            var bSort = $(this).attr('sortOrderAsc');
                            var bSortKey = $(this).attr('SortKey');
                            JsonData.sort(dynamicSort(bSortKey, bSort));
                            $('#tbl tbody').remove();
                            GenerateRows(JsonData, CurrentPageIndex);
                            if (bSort === "true") {
                                $(this).attr('sortOrderAsc', false);
                            } else {
                                $(this).attr('sortOrderAsc', true);
                            }
                            return false;
                        });
                        cell.append(sortLink);
                    } else {
                        var HeaderName = $('<div class="HeaderLabel">' + value + '</div>');
                        HeaderName.css("text-align", "center");
                        cell.append(HeaderName);
                    }

                    headerRow.append(cell);

                    if (settings.Editable && settings.Header.length - 1 == index) {
                        var ActionCell = $('<th><label class="HeaderLabel">Action<label></th>');
                        headerRow.append(ActionCell);
                    }
                }
            });
        }
        TheadRow.append(headerRow);
        table.append(TheadRow);
    }
    //6.RowEvent
    function GenerateRows(JsonDataOriginalOrFiltered, PageId) {

        if (settings.IsServerPaging) {
            $('#tbl thead').remove();
            CreateHeader();
        }

        $('#tbl tbody').remove();
        $('#tbl tfoot').remove();
        var tbody = $('<tbody></tbody>');
        if (!Array.isArray(JsonDataOriginalOrFiltered)) {
            var colspan;
            if (settings.Editable) {
                colspan = settings.Header.length + 1;
            } else {
                colspan = settings.Header.length;
            }
            //colSpanForNoreCords = colspan;
            tbody.append($("<tr ><td  colspan='" + colspan + "' style='text-align: center;'><label>No Records Found</label></td></tr>"));
            table.append(tbody);
            return;
        }

        // var JsonData = PageIndexChanged_SliceJson(JsonDataOriginalOrFiltered, PageId);
        if (settings.Pageable) {
            var JsonData = PageIndexChanged_SliceJson(JsonDataOriginalOrFiltered, PageId);
        } else {
            var JsonData = JsonDataOriginalOrFiltered;
        }

        table.attr('border', settings.border);

        var flag = false;
        //--Records from Json-------------------------------------------
        // var row = $('<tr></tr>').addClass("HeaderCss");




        $.each(JsonData, function (i, value) {
            if (flag)
            { return; }

            var row = $('<tr></tr>').addClass("rowCss");
            delete value.__type;
            //            if (JsonData.length > 1) {
            var array = $.map(value, function (value, index) {
                return [value];
            });
            $.each(array, function (index, value) {
                var ColFlag = true;
                $.each(settings.HideColumns, function (id, vlue) {
                    if (Global_HeaderFromJson[index] == vlue) {
                        ColFlag = false;
                    }
                });

                if (ColFlag) {
                    var cell = CreateCell(i, index, value);
                    if (settings.Editable) {
                        var TxtBox = CreateTextBox(i, index, value);
                        cell.append(TxtBox);
                    }
                    var ColumnClass = Global_HeaderFromJson[index];
                    cell.addClass(ColumnClass);
                    row.append(cell);
                    IsEditable(array, i, index, row);
                }
            });
            //}
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
            //        var cell = CreateCell(i, index, value);
            //        var TxtBox = CreateTextBox(i, index, value);
            //        cell.append(TxtBox);
            //        row.append(cell);
            //        IsEditable(array, i, index, row);
            //    });
            //}
            tbody.append(row);


        });

        table.append(tbody);
        if (settings.Pageable) {
            CreateFooter(JsonDataOriginalOrFiltered);

        }
        //if (settings.IsServerPaging) {
        //    $('#tbl thead').remove();
        //    CreateHeader();
        //}
        //table.append(Tfoot);
    }
    //Sorting Based on the property Name
    function dynamicSort(property, asc) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        var res;
        if (asc == "true") {

            return function (a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        } else {
            return function (a, b) {
                var result = (b[property] < a[property]) ? -1 : (b[property] > a[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }

    }
    //Paging based on PageId
    function JsonPaging(Json, pageId) {
        GenerateRows(Json, pageId);
    }
    //Array of Distinct records based on the propertyName
    //Pick Column Values Unique from Json
    function PickDistinctColDatafromJson(Property, JsonData) {
        var DistinctArray = [];

        $.each(JsonData, function (Index, ValueOfElement) {
            if ($.inArray(ValueOfElement[Property], DistinctArray) == -1) DistinctArray.push(ValueOfElement[Property]);
        });
        return DistinctArray;

    }
    //Filters the Data based on the dropdownList selected value
    function SearchOnSelected_DropDownlist(SearchValue, JsonData) {

        var txt = SearchValue;
        var FilteredObjects = [];
        if (txt != "0") {
            var listOfSelected = [];
            $.each(JsonData, function (i, value) {
                delete value.__type;
                var array = $.map(value, function (v, index_j) {
                    return [v];
                });

                $.each(array, function (index_i, valueOfEle) {
                    var vvalue = valueOfEle.toString();

                    if (vvalue.toLowerCase().indexOf(txt.toLowerCase()) >= 0)
                    { listOfSelected.push(i); return; }
                });



            });
            var uniqueofSelected = [];
            $.each(listOfSelected, function (i, el) {
                if ($.inArray(el, uniqueofSelected) === -1) uniqueofSelected.push(el);
            });

            $.each(uniqueofSelected, function (index, Value) {
                FilteredObjects.push(JsonData[Value]);
            });

            if (FilteredObjects.length != 0) {
                $('#tbl tbody').remove();
                GenerateRows(FilteredObjects, 1);
            }
            //else {
            //    $('#tbl tbody').remove();
            //    //var array=
            //    GenerateTable(JsonData, settings, table);
            //}

        } else {
            $('#tbl tbody').remove();
            GenerateRows(Global_JsonData, CurrentPageIndex);
        }


    }
    //------------------------------------------------------------------------------------
    //-------------------------------Controls Generation+Events---------------------------------------------
    function GenerateDropDownList(index, JsonData) {
        var DropdownList = $('<select />').on("change", function () {
            SearchOnSelected_DropDownlist($(this).val(), JsonData);
            //alert($(this).val());
        });
        DropdownList.addClass("btn btn-primary dropdown-toggle");
        var colName = Global_HeaderFromJson[index];
        //Default
        $('<option />', { value: "0", text: "--Select--" }).appendTo(DropdownList);
        var UniqueRecordsFromJsonBasedOnProperty = PickDistinctColDatafromJson(colName, JsonData);
        $.each(UniqueRecordsFromJsonBasedOnProperty, function (i, v) {
            $('<option />', { value: v, text: v }).appendTo(DropdownList);
        });

        return DropdownList;
    }
    function CreateEditButton(i, j, Length) {
        var Editbutton = $('<button id="Edit_' + i + "_" + j + '"">Edit</button>').click(function () {
            // alert('#Save_' + i + '_' + index);
            $(this).css("display", "none");
            $("#Delete_" + i + '_' + j).css("display", "none");
            $('#Save_' + i + '_' + j).css("display", "");
            //$('#Save_' + i + '_' + j).css("float", "left");
            $('#Cancel_' + i + '_' + j).css("display", "");
            // $('#Cancel_' + i + '_' + j).css("float", "left");
            $('#Cancel_' + i + '_' + j).css("margin-left", "2px");

            //for (var k = 0; k < Length; k++) {

            //}

            $.each(Global_HeaderFromJson, function (k, Value) {
                if (Value != settings.primaryKey) {
                    $('#txtbox_' + i + "_" + k).css("display", "");
                    $('#par_' + i + "_" + k).css("display", "none");
                }
            });
            return false;
        });
        return Editbutton;
    }
    function CreateSaveButton(i, index) {
        var Savebutton = $('<button id="Save_' + i + "_" + index + '" style="display: none;">Save</button>').click(function () {

            var em = {};
            $.each(Global_HeaderFromJson, function (indexOfJsonHeader, ValueofJsonHeader) {
                if (ValueofJsonHeader == settings.primaryKey) {
                    var FieldValue = $('#par_' + i + "_" + indexOfJsonHeader).text();
                } else {
                    var FieldValue = $('#txtbox_' + i + "_" + indexOfJsonHeader).val();
                }

                em[ValueofJsonHeader] = FieldValue;
                $('#par_' + i + "_" + indexOfJsonHeader).val(FieldValue);
            });
            var JsonStringified = JSON.stringify(em);

            var successFlag = false;
            $.ajax({
                type: "POST",
                url: settings.surl,
                async: false,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: "{" + settings.sdata + ":" + JsonStringified + "} ",
                success: function (data) {
                    console.log("saved Successfully");
                    successFlag = true;
                },
                error: function (xhr, x, p) {
                    console.log('something went wrong, please try again');
                }
            });

            if (successFlag) {
                for (var j = 0; j < array.length; j++) {
                    $('#txtbox_' + i + "_" + j).css("display", "none");
                    $('#par_' + i + "_" + j).css("display", "");

                }
            }

            $(this).css("display", "none");
            $('#Cancel_' + i + '_' + index).css("display", "none");
            $('#Edit_' + i + '_' + index).css("display", "");
            //$('#Edit_' + i + '_' + index).css("float", "left");
            $("#Delete_" + i + '_' + j).css("display", "");


            return false;
        });

        return Savebutton;
    }
    function CreateCancelButton(i, index, Length) {
        var Cancelbutton = $('<button id="Cancel_' + i + "_" + index + '" style="display: none;">Cancel</button>').click(function () {
            //alert("Cancel Button");
            $(this).css("display", "none");
            $('#Save_' + i + '_' + index).css("display", "none");
            $('#Edit_' + i + '_' + index).css("display", "");
            // $('#Edit_' + i + '_' + index).css("float", "left");
            $("#Delete_" + i + '_' + index).css("display", "");

            for (var j = 0; j < Length; j++) {
                $('#txtbox_' + i + "_" + j).css("display", "none");
                $('#par_' + i + "_" + j).css("display", "");

            }

            return false;
        });
        return Cancelbutton;
    }

    function CreateDeleteButton(i, j, index) {
        var DeleteButton = $('<button id="Delete_' + i + "_" + j + '" style="margin-left:2px;">Delete</button>').click(function () {

            //var em = {};
            //var FieldValue;
            //$.each(Global_HeaderFromJson, function (indexOfJsonHeader, ValueofJsonHeader) {
            //    FieldValue = $('#par_' + i + "_" + indexOfJsonHeader).text();
            //    return false;
            //    //em[ValueofJsonHeader] = FieldValue;
            //    //$('#par_' + i + "_" + j).val(FieldValue);
            //});
            //var JsonStringified = FieldValue;// JSON.stringify(em[0].Id);

            var em = {};
            $.each(Global_HeaderFromJson, function (indexOfJsonHeader, ValueofJsonHeader) {
                var FieldValue = $('#par_' + i + "_" + indexOfJsonHeader).text();
                em[ValueofJsonHeader] = FieldValue;
            });
            var JsonStringified = JSON.stringify(em);


            var successFlag = false;
            $.ajax({
                type: "POST",
                url: settings.durl,
                async: false,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: "{" + settings.ddata + ":" + JsonStringified + "} ",
                success: function (data) {
                    console.log("Deleted Successfully");
                    // console.log("Id "+FieldValue);
                    successFlag = true;
                },
                error: function (xhr, x, p) {
                    console.log('something went wrong, please try again');
                }
            });

            if (successFlag) {
                Get_JsonData();
                TotalPages = Math.round(Global_JsonData.length / 10);
                CreateHeader();
                GenerateRows(Global_JsonData, CurrentPageIndex);

            }

            //$(this).css("display", "none");
            //$('#Cancel_' + i + '_' + index).css("display", "none");
            //$('#Edit_' + i + '_' + index).css("display", "");
            //$('#Edit_' + i + '_' + index).css("float", "left");



            return false;
        });

        return DeleteButton;
    }

    function CreateTextBox(i, index, value) {
        var TxtBox = $('<input id="txtbox_' + i + "_" + index + '" value="' + value + '"style="display: none;width: 100%; ">');
        if (Global_HeaderFromJson[index] == settings.primaryKey) {
            //console.log(Global_HeaderFromJson[index] + " " + settings.primaryKey);
            TxtBox = "";
        }

        //if(





        return TxtBox;
    }
    function CreateGoToPageTextBox() {
        var div = $('<div id="currentPage"><label> Current Page</label> </div>');

        var TxtBox = $('<input type="number" id="GoToPage" value=' + CurrentPageIndex + ' min="' + 1 + '" max="' + TotalPages + '" />').on("input", function () {
            CurrentPageIndex = $(this).val();
            // if (!settings.IsServerPaging) {
            if (!isNaN(CurrentPageIndex) && CurrentPageIndex <= TotalPages) {
                //  JsonPaging(Global_JsonData, CurrentPageIndex);
                if (settings.IsServerPaging) {

                    $.ajax({
                        type: "POST",
                        url: settings.ServerPagingUrl,
                        async: false,
                        dataType: 'json',
                        contentType: settings.contentType,
                        data: "{" + settings.ServerPagingdata + ":" + JSON.stringify(CurrentPageIndex) + "} ",
                        success: function (data) {
                            //console.log(data.d);
                            if (data.hasOwnProperty(settings.JsondataProperty)) {
                                Global_JsonData = data[settings.JsondataProperty];
                            }
                            else if (Array.isArray(data)) {
                                Global_JsonData = data;

                            }
                            JsonPaging(Global_JsonData, CurrentPageIndex);
                        },
                        error: function (xhr, x, p) {
                            console.log(xhr.responseText);
                            console.log(x.toString());
                        }
                    });

                } else {
                    JsonPaging(Global_JsonData, CurrentPageIndex);
                }


                $('#Error').css("display", "none");
            } else {
                $('#Error').css("display", "");
            }
            // }

            //alert(CurrentPageIndex);
        });
        //div.css("margin-left", "40%");
        //div.css("width", "50%");
        div.addClass("CurrentPage");

        var Warning = $("<label id='Error' style='color:red;margin-left: 2px;display:none'>Value Must be Less than " + TotalPages + "</label>");

        var PageCountLabel = $('<span style="float:right;padding: 4.1px;"> <label> Total Pages :</label>' + TotalPages + '</span>');

        //TxtBox.append(span);
        TxtBox.addClass("GoToPage");

        div.append(TxtBox);
        div.append(Warning);
        div.append(PageCountLabel);
        return div;
    }
    function CreateCell(i, index, value) {

        var shortenValue;
        //if (!$.isNumeric(value) && value != null && value != "") {

        //    //Change 10 value if want to display morethan 10 characters
        //    if (value.length >= 10) {
        //        shortenValue = value;//value.substring(0, 10) + "......";
        //    } else {
        //        shortenValue = value;
        //    }
        //} else {
        //    if (value != null) {
        shortenValue = value;
        //    } else {
        //        shortenValue = "";
        //    }
        //}
        var cell = $('<td ><p id="par_' + i + "_" + index + '" title="' + value + '">' + shortenValue + '</p></td>').append();
        return cell;
    }
    function CreateFooter(JsonD) {
        //For occupying the enter row for footer template
        var colspan;
        if (settings.Editable) {
            colspan = Global_HeaderFromJson.length + 1;
        } else {
            colspan = Global_HeaderFromJson.length;
        }
        colSpanForNoreCords = colspan;
        var Tfoot = $('<tfoot></tfoot>');
        var TfootRow = $('<tr></tr>');
        var TfootCell = $('<td colspan="' + colspan + '"></td>');


        var NoOfRecords = JsonD.length;
        var NoOfPages = Math.round(NoOfRecords / 10);
        if (NoOfPages == 1) {
            NoOfPages = 0;
        }
        if (NoOfPages != 0 && settings.IsServerPaging == false) {
            //&& NoOfPages >= 3) {
            //for (var i = 1; i <= NoOfPages; i++) {
            //    var PageLink = CreatePageLink(JsonD, i);
            //    TfootCell.append(PageLink);
            //    TfootRow.append(TfootCell);
            //}
            //if (true) {
            var div = $('<div></div>');
            var NextPageButton = NextPage(JsonD, 1);
            div.append(NextPageButton);

            //    TfootCell.append(NextPageButton);


            // TfootCell.append(GotoBox);

            var PreviousPageButton = PreviousPage(JsonD, 1);
            div.append(PreviousPageButton);
            var GotoBox = CreateGoToPageTextBox();
            div.append(GotoBox);
            TfootCell.append(div);
            TfootRow.append(TfootCell);


            //}



            //TfootCell.append(PageCountLabel);
            TfootRow.append(TfootCell);

            //TfootRow.append(TfootCell);

        }
        if (settings.IsServerPaging) {
            var div = $('<div></div>');
            var NextPageButton = NextPage(JsonD, 1);
            div.append(NextPageButton);

            //    TfootCell.append(NextPageButton);


            // TfootCell.append(GotoBox);

            var PreviousPageButton = PreviousPage(JsonD, 1);
            div.append(PreviousPageButton);
            var GotoBox = CreateGoToPageTextBox();
            div.append(GotoBox);
            TfootCell.append(div);
            TfootRow.append(TfootCell);


            //}



            //TfootCell.append(PageCountLabel);
            TfootRow.append(TfootCell);


        }

        Tfoot.append(TfootRow);
        table.append(Tfoot);
    }
    function PageIndexChanged_SliceJson(Json, PageId) {
        //var NextPage = 10 * PageId;
        var PageSize = parseInt(settings.PageSize);
        var NextPage = PageSize * PageId;
        var FirstPage = Math.abs(NextPage - PageSize);
        if (settings.IsServerPaging) {
            if (Json.length == PageSize) {
                var SlicedJsonData = Json;
            } else {
                var SlicedJsonData = Json.slice(FirstPage, NextPage);
            }
        } else {
            var SlicedJsonData = Json.slice(FirstPage, NextPage);
        }

        return SlicedJsonData;
    }


    function CreatePageLink(JsonD, i) {
        var PageLink = $('<a id="' + i + '">' + i + '</a>').click(function () {
            CurrentPageIndex = $(this).text();
            JsonPaging(JsonD, CurrentPageIndex);
            return false;
        });
        PageLink.addClass("anchor_page");
        return PageLink;
    }

    function NextPage(JsonD, i) {
        var PageLink = $('<button id="Next">Next</button>').click(function () {
            if (CurrentPageIndex == TotalPages) {
                $(this).css("display", "none");
            } else {
                CurrentPageIndex = Number(CurrentPageIndex) + Number(1);
                CallServerPaging(JsonD, CurrentPageIndex);
                $("#Previous").css("display", "");
            }
            return false;
        });
        if (CurrentPageIndex == TotalPages) {
            PageLink.css("display", "none");
        }
        PageLink.addClass("NextPrevious");
        return PageLink;
    }

    function PreviousPage(JsonD, i) {
        var PageLink = $('<button id="Previous">Previous</button>').click(function () {
            CurrentPageIndex = $('#GoToPage').val();

            if (CurrentPageIndex == 1) {
                $(this).css("display", "none");
            } else {
                CurrentPageIndex = Number(CurrentPageIndex) - Number(1);
                // JsonPaging(JsonD, CurrentPageIndex);
                CallServerPaging(JsonD, CurrentPageIndex);

                $("#Next").css("display", "");
            }


            return false;
        });
        if (CurrentPageIndex == 1) {
            PageLink.css("display", "none");
        }
        PageLink.addClass("NextPrevious");
        return PageLink;
    }



    //---------------------------------Checking --------------------
    function IsEditable(array, i, index, row) {
        if (settings.Editable && array.length - 1 == index) {

            //var EditCell = $('<td><input type="button" id="btnEdit_' + i + '" value="Edit" /></td>');
            var Editbutton = CreateEditButton(i, index, array.length);
            var Deletebutton = CreateDeleteButton(i, index, array.length);
            var Savebutton = CreateSaveButton(i, index);
            var Cancelbutton = CreateCancelButton(i, index, array.length);
            var EditCell = $('<td></td>').append(Editbutton);
            EditCell.append(Savebutton);
            EditCell.append(Cancelbutton);
            EditCell.append(Deletebutton);
            EditCell.addClass("ActioncellClass");
            row.append(EditCell);
        }
        row;
    }

    //Server Events-----------------------------------------------------
    function CallServerPaging(JsonD, CurrentPageIndex) {
        if (!settings.IsServerPaging) {
            JsonPaging(JsonD, CurrentPageIndex);
        } else {
            //Server Paging Event Fires Here
            $.ajax({
                type: "POST",
                url: settings.ServerPagingUrl,
                async: false,
                dataType: 'json',
                contentType: settings.contentType,
                data: "{" + settings.ServerPagingdata + ":" + JSON.stringify(CurrentPageIndex) + "} ",
                success: function (data) {
                    //console.log(data.d);
                    if (data.hasOwnProperty(settings.JsondataProperty)) {
                        Global_JsonData = data[settings.JsondataProperty];
                        //alert(data["d"]);
                    }
                    else if (Array.isArray(data)) {
                        Global_JsonData = data;

                    }
                    JsonPaging(Global_JsonData, CurrentPageIndex);
                },
                error: function (xhr, x, p) {
                    console.log(xhr.responseText);
                    console.log(x.toString());
                }
            });
            // CreateGoToPageTextBox()
        }
    }
})(jQuery());

