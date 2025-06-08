# JqTable

This project contains a simple ASP.NET WebForms application demonstrating a custom jQuery table plugin. The plugin is defined in `JqTable.js` and provides features such as paging, sorting and inline editing of JSON data.

## Getting started

1. Open `JqueryDataTable.sln` in Visual Studio 2012 or later.
2. Restore NuGet packages if prompted (`packages` folder is included).
3. Run the `ExampleJsonTable.aspx` page to see the table in action.

## Project layout

- **JqueryDataTable/** – WebForms application containing pages and scripts.
- **Json.txt** – Example JSON data used by the table.

The main plugin script lives in `JqueryDataTable/JqTable.js` and can be used outside of this example project.

## Notes

Sample data for the table is generated in `Jquery_DataTable.aspx.cs` by the `GetEmp` web method.
