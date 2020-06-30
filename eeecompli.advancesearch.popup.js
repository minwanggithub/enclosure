/*
 * jQuery Advance Search : Advance Search Builder PopUp
 *
 * Contribute: Min Wang
 *
 * @Date: May 2020  Covid19 Period
 *
 */

if (jQuery) (function ($, kdo) {
    var searchWinPop, adPopUpSearchCtl, trigger, adTarget;

    var Settings = {
        division: {
            SharedControlDiv: "#SharedAdvanceSearchPopUpDiv"
        },
        dataattr: {
            SharedTarget: "data-adsearch-shared-target",
            Target: "data-adsearch-target",
            TargetDisabled: "data-adsearch-target-disabled"
        },
        window: {
            AdvanceSearchWindow: "AdvanceSearchWindow",
            AdvanceSearchWindowTitle: "Advanced Supplier Search",
            AdvanceSearchControl: "AdvanceSearch"
        },
        grid: {
            PopUpSupplierSearchSharedGrid: "PopUpSupplierSearchSharedGrid",
            PopUpSupplierSearchCommonSharedGrid: "PopUpSupplierSearchCommonSharedGrid"
        },
        controller: {
            GetAdvanceSearchSupplierAjaxResult: "/Operations/Company/GetAdvanceSearchSupplierAjaxResult"
        }
    };

    $.extend($.fn, {
        advancedsearchpopup: function (method, data) {
            switch (method) {
                case 'show':
                    CreateAdvancePopUp(null, $(this));
                    return $(this);
                case 'hide':
                    Hide();
                    return $(this);
                case 'attach':
                    return $(this).attr(Settings.dataattr.Target, data);
                case 'detach':
                    Hide();
                    return $(this).removeAttr(Settings.dataattr.Target);
                case 'disable':
                    return $(this).addClass(Settings.dataattr.TargetDisabled);
                case 'enable':
                    Hide();
                    return $(this).removeClass(Settings.dataattr.TargetDisabled);
            }

        }
    });

    function Show() {
        if (searchWinPop !== 'undefined') {
            searchWinPop.center().open();
            //searchWinPop.data("kendoWindow").center().open();
            //searchWinPop.parent().find(".k-window-action").css("visibility", "hidden");
        }
    };

    function onClose() {
       
    }

    function extractSupplierCriteria(e) {
        var supplierSearchModel = {};
        var SearchOperator = 'SearchOperator';

        var triggerId = $(trigger.attr('id'));
        var advnaceSearchCtl = $("#" + triggerId.selector).data(Settings.window.AdvanceSearchControl);

        if (typeof advnaceSearchCtl === 'undefined') {  //Show the window if already exists
            return {
                supplierSearchCriteria: JSON.stringify(supplierSearchModel)
            };
        }

        var searchCriteria = advnaceSearchCtl.DataSource();
        $.each(searchCriteria, function (index, row) {
            var selectedColumn = row.columnDataSource[row.selectedColumn - 1];

            if (selectedColumn.Type === 'integer') {
                supplierSearchModel[selectedColumn.ColumnMap] = row.enteredDataFieldValue;
            }
            else if (selectedColumn.Type === 'text') {
                supplierSearchModel[selectedColumn.ColumnMap] = row.enteredDataFieldValue;
                supplierSearchModel[selectedColumn.ColumnMap + SearchOperator] = row.selectedOperator;
            }
            else if (selectedColumn.Type === 'lookup') {
                supplierSearchModel[selectedColumn.ColumnMap] = row.selectedDataLookupIndex;
            }
        });

        return {
            supplierSearchCriteria: JSON.stringify(supplierSearchModel)
        };
    }

    function CreateSearchGrid(target, trigger) {
        var triggerId = $(trigger.attr('id'));
        var supplierAdvanceSearchPopUpCtlFor = "supplierAdvanceSearchPopUpCtlFor_" + triggerId.selector;
        var supplierAdvanceSearchPopUpCtlSearchBtnFor = "searchSupplierBtnFor_" + triggerId.selector;
        var supplierAdvanceSearchPopUpCtlClearBtnFor = "clearSupplierBtnFor_" + triggerId.selector;
        
        var thisGrid = target.kendoGrid({
            toolbar: kendo.template(
                "<div class='pull-left'>" +
                "<fieldset style='margin:0px 5px 20px 10px;border-radius: 8px;'>" +
                "<legend>Advanced Search</legend>" +
                "<div id='" + supplierAdvanceSearchPopUpCtlFor + "'></div>" +
                "</fieldset>" + 
                "</div>" + 
                "<div class='pull-right' style='margin-top: 5px;'>" +
                "<button id='" + supplierAdvanceSearchPopUpCtlSearchBtnFor + "' class='k-button btn btn-small'><span class='k-icon k-i-search'/>&nbsp;Search</button>" +
                "<button id='" + supplierAdvanceSearchPopUpCtlClearBtnFor + "' class='k-button btn btn-small'><span class='k-icon k-i-refresh'></span>&nbsp;Clear</button>" +
                "</div>"
            ),
            dataSource: {
                type: "aspnetmvc-ajax",
                transport: {
                    read: {
                        url: GetEnvironmentLocation() + Settings.controller.GetAdvanceSearchSupplierAjaxResult,
                        data: extractSupplierCriteria
                    }
                },
                schema: {
                    data: "Data",
                    model: {
                        id: "CompanyId",
                        fields: {
                            "CompanyId": { type: "integer" },
                            "Duns": { type: "string" },
                            "Name": { type: "string" },
                            "Alias": { type: "string" },
                            "CreatedBy": { type: "string" },
                            "CreatedDate": { type: "datetime" },
                            "LastUpdateBy": { type: "string" },
                            "LastUpdate": { type: "datetime" }
                        }
                    },
                    total: function (response) {
                        if (typeof response.Data !== 'undefined')
                            return response.Data.length;
                        else
                            return 0;
                    }
                },
                pageSize: 10
                //serverPaging: false,
                //serverSorting: true,
            },
            //height: 550,
            filterable: true,
            sortable: true,
            autoBind: false, //This will stop the inital loading of data
            pageable: {
                alwaysVisible: true,
                previousNext: true,
                //refresh: true,
                pageSizes: [10, 20, 50],
                buttonCount: 10
            },
            requestStart: function (e) {
                kendo.ui.progress(thisGrid, true);
                //Or kendo.ui.progress($("#" + target.attr('id').kendoGrid()), false);
            },
            requestEnd: function (e) {
                kendo.ui.progress(thisGrid, false);
            },
            columns: [
                { field: "CompanyId", title: "ID" },
                { field: "Duns", template: "#= (Duns > 0)? Duns:'' #"},
                { field: "Name" },
                { field: "Alias" },
                { field: "CreatedBy", title: "CreatedBy|Date", template: "#=CreatedBy#@#= kendo.toString(kendo.parseDate(CreatedDate), 'MM/dd/yyyy')#" },
                { field: "UpdateBy", title: "UpdateBy|Date", template: "#=LastUpdateBy#@#= kendo.toString(kendo.parseDate(LastUpdate), 'MM/dd/yyyy')#" }
                
                
            ]
            //dataBound: function (e) {
            //    setTimeout(function () {
            //        e.sender.wrapper.find('.k-pager-wrap.k-grid-pager > a').removeClass('k-state-disabled');
            //    });
            //}
        });

        var adDiv = thisGrid.find("#" + supplierAdvanceSearchPopUpCtlFor);
        advanceSearchDataSource.SupplierSearchColumn.read().then(function () {
            advanceSearchDataSource.Operators.read().then(function () {
                adPopUpSearchCtl = adDiv.advancedsearch({
                    //Using dynamic data source extracted from database
                    selectedColumnDataSource: advanceSearchDataSource.SupplierSearchColumn.view(),
                    selectedOperatorDataSource: advanceSearchDataSource.Operators.view(),
                    selectedDataSourceUrl: GetEnvironmentLocation() + "/svc/",
                    EnableLog: false
                });
                $("#" + triggerId.selector).data(Settings.window.AdvanceSearchControl, adPopUpSearchCtl);
            });
        });

        //thisGrid.find(".k-grid-toolbar").on("click", ".k-pager-refresh", function (e) {
        thisGrid.find("#" + supplierAdvanceSearchPopUpCtlSearchBtnFor).on("click", function (e) {
            e.preventDefault();
            thisGrid.data("kendoGrid").dataSource.read();
        });

        thisGrid.find("#" + supplierAdvanceSearchPopUpCtlClearBtnFor).on("click", function (e) {
            e.preventDefault();
            $("#" + triggerId.selector).data(Settings.window.AdvanceSearchControl).ClearData();
            
            if (thisGrid.data("kendoGrid").dataSource.total() === 0) {
                return;
            }

            thisGrid.data("kendoGrid").dataSource.filter([]);
            thisGrid.data("kendoGrid").dataSource.data([]);
        });


        thisGrid.on('dblclick', 'tbody tr[data-uid]', function (e) {
            //thisGrid.editRow($(e.target).closest('tr'));
            e.stopPropagation();

            var rowElement = this;
            var row = $(rowElement);
            var grid = thisGrid.getKendoGrid();
            var dItem = grid.dataItem($(this));

            if (dItem !== null) {
                if (adTarget[0].nodeName.toLowerCase() === 'span') {
                    adTarget.text(dItem.id + ", " + dItem.Name);
                    adTarget.trigger("withchange");
                }
                else {
                    adTarget.val(dItem.id + ", " + dItem.Name);
                    adTarget.trigger("change");
                }
            }
            Hide();

            //if (row.hasClass("k-state-selected")) {

            //    var selected = grid.select();

            //    selected = $.grep(selected, function (x) {
            //        var itemToRemove = grid.dataItem(row);
            //        var currentItem = grid.dataItem(x);

            //        return (itemToRemove.OrderID != currentItem.OrderID);
            //    });

            //    grid.clearSelection();

            //    grid.select(selected);

            //} else {
            //    grid.select(row);
            //}
        });
    }


    //Non Shared PopUp
    //function CreateAdvanceSearchPopUp(event, object) {
    //    trigger = event ? $(this) : object;
    //    var triggerId = $(trigger.attr('id'));
    //    adTarget = $(trigger.attr('data-adsearch-target'));

    //    //Make sure not previously created
    //    var cacheWindow = $("#" + triggerId.selector).data("AdvanceSearchWindow");
    //    if (typeof cacheWindow !== 'undefined') {  //Show the window if already exists
    //        Show();
    //        return;
    //    }

    //    var popDiv = $("<div id='PopUpSeachDivFor_" + triggerId.selector + "' class='ad-popup-target'></div>");
    //    var supplierSearchGridDiv = $("<div id='PopUpSupplierSearchGridFor_" + triggerId.selector + "'></div>");

    //    popDiv.append(supplierSearchGridDiv);
    //    CreateSearchGrid(supplierSearchGridDiv, trigger);


    //    searchWinPop = popDiv.kendoWindow({
    //        width: "1024px",
    //        title: "Advanced Supplier Search",
    //        visible: false,
    //        actions: [
    //            //"Pin",
    //            "Minimize",
    //            "Maximize",
    //            "Close"
    //        ],
    //        close: onClose
    //    }).data("kendoWindow");

    //    $("#" + triggerId.selector).data("AdvanceSearchWindow", searchWinPop);

    //    Show();
    //}

    function CreateAdvanceSearchPopUp(event, object) {
        trigger = event ? $(this) : object;
        var triggerId = $(trigger.attr('id'));
        adTarget = $(trigger.attr(Settings.dataattr.Target));

        //Make sure not previously created
        var cacheWindow = $("#" + triggerId.selector).data(Settings.window.AdvanceSearchWindow);
        if (typeof cacheWindow !== 'undefined') {  //Show the window if already exists
            searchWinPop = cacheWindow;
            Show();
            return;
        }

        var popDiv = $("<div id='PopUpSeachDivFor_" + triggerId.selector + "' class='ad-popup-target'></div>");
        var supplierSearchGridDiv = $("<div id='PopUpSupplierSearchGridFor_" + triggerId.selector + "'></div>");

        popDiv.append(supplierSearchGridDiv);
        CreateSearchGrid(supplierSearchGridDiv, trigger);


        searchWinPop = popDiv.kendoWindow({
            width: "1024px",
            title: Settings.window.AdvanceSearchWindowTitle,
            modal: true,
            visible: false,
            actions: [
                //"Pin",
                "Minimize",
                "Maximize",
                "Close"
            ],
            close: onClose
        }).data("kendoWindow");

        $("#" + triggerId.selector).data(Settings.window.AdvanceSearchWindow, searchWinPop);

        Show();
    }


    //Having issue to extract data for shared control right now
    function CreateAdvanceSearchSharedPopUp(event, object) {
        trigger = event ? $(this) : object;
        var triggerId = $(trigger.attr('id'));
        adTarget = $(trigger.attr(Settings.dataattr.Target));

        if ($(Settings.division.SharedControlDiv).length === 0) {
            kendo.alert("Missing shared hosting div. Can not host search control.");
            return;
        }

        //Make sure not previously created, since this is a shared control then looking for common div
        var popDiv = $(Settings.division.SharedControlDiv);
        var cacheWindow = popDiv.data(Settings.window.AdvanceSearchWindow);
        if (typeof cacheWindow !== 'undefined') {  //Show the window if already exists
            Show();
            return;
        }

        var supplierSearchGridDiv = $("<div id='" + Settings.grid.PopUpSupplierSearchCommonSharedGrid + "'></div>");
        popDiv.append(supplierSearchGridDiv);

        //Since it's shared control, the shared search control is no longer stored inside the trigger, stored in the popDiv
        CreateSearchGrid(supplierSearchGridDiv, popDiv);

        searchWinPop = popDiv.kendoWindow({
            width: "1024px",
            title: Settings.window.AdvanceSearchWindowTitle,
            visible: false,
            actions: [
                //"Pin",
                "Minimize",
                "Maximize",
                "Close"
            ],
            close: onClose
        }).data("kendoWindow");

        popDiv.data(Settings.window.AdvanceSearchWindow, searchWinPop);

        Show();
    }


    function Hide() {
        searchWinPop.close();
    }

    $(document).on('click', '[' + Settings.dataattr.Target + ']', CreateAdvanceSearchPopUp);   
    $(document).on('click', '[' + Settings.dataattr.SharedTarget +']', CreateAdvanceSearchSharedPopUp);  

    return {
        Show: Show
    };
})(jQuery, kendo);

