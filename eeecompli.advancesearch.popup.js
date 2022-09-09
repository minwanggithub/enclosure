﻿/*
 * jQuery Advance Search : Universal Advance Search PopUp 
 *
 * Contribute: Min Wang
 *
 * @Date: Sept 2022  
 *
 */

if(jQuery) (function($,kdo) {
    var searchWinPop,adPopUpSearchCtl,thisGrid,trigger,triggerId,adTarget;

    const PopUpType={
        Supplier_PopUp: 0,
        Document_PopUp: 1
    };


    var Settings={
        division: {
            SharedControlDiv: "#SharedAdvanceSearchPopUpDiv"
        },
        dataattr: {
            /*   SharedTarget: "data-adsearch-shared-target",*/
            SupplierSearchPopUp: "data-adsearch-supplier-target",
            DocumentSearchPopUp: "data-adsearch-document-target",
            LoadSupplierTarget: "data-adsearch-supplier-load-target",
            //TargetDisabled: "data-adsearch-supplier-target-disabled"
        },
        window: {
            AdvanceSearchWindow: "AdvanceSearchWindow",
            AdvanceSearchWindowTitlePrefix: "Advanced Search For ",
            AdvanceSearchControl: "AdvanceSearch"
        },
        windowtitle: ["Supplier","Document"],
        windowsize: ["1024px","1300px"],
        windowwide: [false,true],
        grid: {             // Consider shared memory for future development
            PopUpSupplierSearchSharedGrid: "PopUpSupplierSearchSharedGrid",
            PopUpSupplierSearchCommonSharedGrid: "PopUpSupplierSearchCommonSharedGrid"
        },
        gridtemplate: [
            "",
            ""
        ],
        gridmodel: {
            id: "CompanyId",
            fields: {
                "CompanyId": { type: "integer" },
                //"Duns": { type: "string" },
                "Name": { type: "string" },
                "Alias": { type: "string" },
                "ParentCompanyName": { type: "string" },
                "CreatedBy": { type: "string" },
                "CreatedDate": { type: "datetime" },
                "LastUpdateBy": { type: "string" },
                "LastUpdate": { type: "datetime" }
            }
        },
        columndef: [
            [
                { field: "CompanyId",title: "ID" },
                //{ field: "Duns", template: "#= (Duns > 0)? Duns:'' #"},
                { field: "Name" },
                { field: "Alias" },
                { field: "ParentCompanyName",title: "Parent to Redirect" },
                { field: "CreatedBy",title: "CreatedBy|Date",template: "#=CreatedBy#@#= kendo.toString(kendo.parseDate(CreatedDate), 'MM/dd/yyyy')#" },
                { field: "UpdateBy",title: "UpdateBy|Date",template: "#=LastUpdateBy#@#= kendo.toString(kendo.parseDate(LastUpdate), 'MM/dd/yyyy')#" }
            ],
            [
                { field: "",width: 30,template: "#= generateTipRevisionLink(data, this)#" },
                { field: "ReferenceId",title: "Document ID" },
                { field: "RevisionTitle",title: "Title" },
                { field: "SupplierName",title: "Mfr ID",template: "#= getCompanyTemplate(SupplierId, SupplierName)#" },
                { field: "TBD_SupplierName",title: "Supplier ID",template: "#= getCompanyTemplate(TBD_SupplierId, TBD_SupplierName)#" },
                { field: "LanguageDescription",title: "Language" },
                { field: "Discontinued",title: "Discontinued" },
                { field: "ContainerTypeDescription",title: "Container" },
                { field: "DocumentTypeDescription",title: "Type" },
                { field: "RevisionDate",title: "Revision Date",template: "#= kendo.toString(kendo.parseDate(RevisionDate), 'MM/dd/yyyy')#" },
                { field: "DocumentIdentification",title: "SDS #" },
                { field: "JurisdictionDescription",title: "JurisdictionDS #" },
            ]
        ],
        columndatasource: [],
        controller: {
            GetAdvanceSearchAjaxResult: [
                "/Operations/Company/GetAdvanceSearchSupplierAjaxResult",
                "/Operations/Document/GetDocumentResult",
            ],
            LoadCompanyDetail: "/Operations/Company/LoadSingleSupplier?supplierId=",
            LoadDocumentDetail: "/Operations/Document/LoadDocumentDetails?",
            LoadDocumentRevisionDetail: "/Operations/Document/LoadRevisionForDocumentIdAlt?",
        },
        message: {
            LoadSupplierDetailError: "An error occurred displaying the selected company. Please review you selection and try again."
        },
        requestpopup: PopUpType.Supplier_PopUp     //Default to supplier search
    };

    //var gridColumnDefinition=[
    //    [
    //        { field: "CompanyId",title: "ID" },
    //        //{ field: "Duns", template: "#= (Duns > 0)? Duns:'' #"},
    //        { field: "Name" },
    //        { field: "Alias" },
    //        { field: "ParentCompanyName",title: "Parent to Redirect" },
    //        { field: "CreatedBy",title: "CreatedBy|Date",template: "#=CreatedBy#@#= kendo.toString(kendo.parseDate(CreatedDate), 'MM/dd/yyyy')#" },
    //        { field: "UpdateBy",title: "UpdateBy|Date",template: "#=LastUpdateBy#@#= kendo.toString(kendo.parseDate(LastUpdate), 'MM/dd/yyyy')#" }
    //    ],
    //    [
    //        { field: "ReferenceId",title: "Document ID" },
    //        { field: "RevisionId",title: "Title" },
    //    ]
    //];

    $.extend($.fn,{
        advancedsearchpopup: function(method,data) {
            switch(method) {
                //case 'show':    //Replaced with attribute automation
                //    CreateAdvancePopUp(null, $(this));
                //    return $(this);
                case 'hide':
                    Hide();
                    return $(this);
                case 'attach':
                    return $(this).attr(Settings.dataattr.Target,data);
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
        if(searchWinPop!=='undefined') {
            searchWinPop.center().open();
            //searchWinPop.data("kendoWindow").center().open();
            //searchWinPop.parent().find(".k-window-action").css("visibility", "hidden");
        }
    };

    function onClose() {

    }

    function extractCriteria(e) {
        //var triggerId=$(trigger.attr('id'));
        var advnaceSearchCtl=$("#"+triggerId.selector).data(Settings.window.AdvanceSearchControl);
        if(typeof advnaceSearchCtl==='undefined') {
            return {
                searchCriteria: {}
            };
        }
        return {
            searchCriteria: advnaceSearchCtl.MappedCriterias()

        };
    }

    function ReCenterDialog(e) {
        searchWinPop.center();
    }

    function detailInit(e) {
        var detailRow=e.detailRow;
        detailRow.find(".documentDetailTabstrip").kendoTabStrip({
            animation: {
                open: { effects: "fadeIn" }
            },
            contentLoad: ReCenterDialog,
            contentUrls: [
                {
                    url: GetEnvironmentLocation()+Settings.controller.LoadDocumentDetail,
                    cache: true,
                    method: "POST",
                    data: {
                        documentId: e.data.ReferenceId,
                        revisionId: e.data.RevisionId,
                        readOnlyFields: true
                    }
                },
                {
                    url: GetEnvironmentLocation()+Settings.controller.LoadDocumentRevisionDetail,
                    cache: true,
                    method: "POST",
                    data: {
                        documentId: e.data.ReferenceId,
                        latestRevisionOnly: true
                    }
                }
            ]
        });
    }

    function onAdvanedSearchCallBack(e) {
        thisGrid.data("kendoGrid").dataSource.read();
    }

    function CreateSearchGrid(target) {
        //var triggerId=$(trigger.attr('id'));
        var anyAdvanceSearchPopUpCtlFor="anyAdvanceSearchPopUpCtlFor_"+triggerId.selector;
        var anyAdvanceSearchPopUpCtlSearchBtnFor="searchAnyBtnFor_"+triggerId.selector;
        var anyAdvanceSearchPopUpCtlClearBtnFor="clearAnyBtnFor_"+triggerId.selector;

        thisGrid=target.kendoGrid({
            toolbar: kendo.template(
                "<div class='pull-left'>"+
                "<fieldset style='margin:0px 5px 20px 10px;border-radius: 8px;'>"+
                "<legend>Advanced Search</legend>"+
                "<div id='"+anyAdvanceSearchPopUpCtlFor+"'></div>"+
                "</fieldset>"+
                "</div>"+
                "<div class='pull-right' style='margin-top: 5px;'>"+
                "<button id='"+anyAdvanceSearchPopUpCtlSearchBtnFor+"' class='k-button btn btn-small'><span class='k-icon k-i-search'/>&nbsp;Search</button>"+
                "<button id='"+anyAdvanceSearchPopUpCtlClearBtnFor+"' class='k-button btn btn-small'><span class='k-icon k-i-refresh'></span>&nbsp;Clear</button>"+
                "</div>"
            ),
            dataSource: {
                type: "aspnetmvc-ajax",
                transport: {
                    read: {
                        url: GetEnvironmentLocation()+Settings.controller.GetAdvanceSearchAjaxResult[Settings.requestpopup],
                        data: extractCriteria
                    }
                },
                schema: {
                    data: "Data",
                    //model: Settings.gridmodel,
                    total: function(response) {
                        if(typeof response.Data!=='undefined')
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
            autoBind: false, //This will stop the inital data loading
            pageable: {
                alwaysVisible: true,
                previousNext: true,
                //refresh: true,
                pageSizes: [10,20,50],
                buttonCount: 10
            },
            detailTemplate: kendo.template(Settings.gridtemplate[Settings.requestpopup]),
            detailInit: detailInit,
            dataBound: function(e) {
                if(Settings.gridtemplate[Settings.requestpopup]!="")                  //Decide if the detail template will be applied or not
                {
                    this.expandRow(this.tbody.find("tr.k-master-row").first());
                    return;
                }

                var items=e.sender.items();
                items.each(function() {
                    var row=$(this);
                    var dataItem=e.sender.dataItem(row);
                    if(!dataItem.hasChildren) {
                        row.find(".k-hierarchy-cell").html("");
                    }

                })
            },
            requestStart: function(e) {
                kendo.ui.progress(thisGrid,true);
                //Or kendo.ui.progress($("#" + target.attr('id').kendoGrid()), false);
            },
            requestEnd: function(e) {
                kendo.ui.progress(thisGrid,false);
            },
            columns: Settings.columndef[Settings.requestpopup]               //Settings.columndef[Settings.requestpopup]  
        });

        var columnDataSource=Settings.columndatasource[Settings.requestpopup];
        var adDiv=thisGrid.find("#"+anyAdvanceSearchPopUpCtlFor);
        columnDataSource.read().then(function() {
            advanceSearchDataSource.Operators.read().then(function() {
                adPopUpSearchCtl=adDiv.advancedsearch({
                    selectedColumnDataSource: columnDataSource.view(),
                    selectedOperatorDataSource: advanceSearchDataSource.Operators.view(),
                    searchCallBack: onAdvanedSearchCallBack,
                    selectedDataSourceUrl: GetEnvironmentLocation()+"/svc/",
                    ExtendWidth: Settings.windowwide[Settings.requestpopup],
                    EnableLog: false
                });
                $("#"+triggerId.selector).data(Settings.window.AdvanceSearchControl,adPopUpSearchCtl);
            });
        });

        //thisGrid.find(".k-grid-toolbar").on("click", ".k-pager-refresh", function (e) {
        thisGrid.find("#"+anyAdvanceSearchPopUpCtlSearchBtnFor).on("click",function(e) {
            e.preventDefault();
            thisGrid.data("kendoGrid").dataSource.read();
        });

        thisGrid.find("#"+anyAdvanceSearchPopUpCtlClearBtnFor).on("click",function(e) {
            e.preventDefault();
            $("#"+triggerId.selector).data(Settings.window.AdvanceSearchControl).ClearData();

            if(thisGrid.data("kendoGrid").dataSource.total()===0) {
                return;
            }

            thisGrid.data("kendoGrid").dataSource.filter([]);
            thisGrid.data("kendoGrid").dataSource.data([]);
        });


        thisGrid.on('dblclick','tbody tr[data-uid]',function(e) {
            //thisGrid.editRow($(e.target).closest('tr'));
            e.stopPropagation();

            var rowElement=this;
            var row=$(rowElement);
            var grid=thisGrid.getKendoGrid();
            var dItem=grid.dataItem($(this));
            var callBackText='';
            
            if(dItem!==null) {
                if(Settings.requestpopup==PopUpType.Supplier_PopUp) {
                    callBackText=dItem.CompanyId+", "+dItem.Name
                }
                else if(Settings.requestpopup==PopUpType.Document_PopUp) {
                    callBackText=dItem.ReferenceId+", "+dItem.RevisionTitle
                }
                //alert(adTarget.length);
                if(typeof adTarget[0]!='undefined') {
                    //Standard event trigger without custom action for document ad search
                    trigger.trigger("onselect",dItem);

                    //Customized events
                    if(adTarget[0].nodeName.toLowerCase()==='span'||adTarget[0].nodeName.toLowerCase()==='text') {
                        adTarget.text(callBackText);
                        adTarget.trigger("withchange");          //$('#element').trigger('myevent', 'my_custom_parameter');
                    }
                    else {
                        adTarget.val(callBackText);
                        adTarget.trigger("change");
                    }
                }
                else if(dItem!==null&&typeof eval(adTarget.selector)==="function") {         //if ($.isFunction(adTarget[0])) {
                    var functionCall=eval(adTarget.selector);
                    functionCall(dItem);
                }
            }


            Hide();
        });
    }

    function CreateAnyAdvanceSearchPopUp() {
        //Make sure not previously created
        var cacheWindow=$("#"+triggerId.selector).data(Settings.window.AdvanceSearchWindow);
        if(typeof cacheWindow!=='undefined') {  //Show the window if already exists
            searchWinPop=cacheWindow;
            Show();
            return;
        }


        var popDiv=$("<div id='PopUpSearchDivFor_"+triggerId.selector+"' class='ad-popup-target'></div>");
        var anySearchGridDiv=$("<div id='AnyPopUpSearchGridFor_"+triggerId.selector+"'></div>");

        popDiv.append(anySearchGridDiv);

        //Config grid based on the PopUp Type
        CreateSearchGrid(anySearchGridDiv);

        //Width took original document PopUp size 1300px
        searchWinPop=popDiv.kendoWindow({
            width: Settings.windowsize[Settings.requestpopup],
            title: Settings.window.AdvanceSearchWindowTitlePrefix+Settings.windowtitle[Settings.requestpopup],                      //Target type specific
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

        $("#"+triggerId.selector).data(Settings.window.AdvanceSearchWindow,searchWinPop);

        Show();
    }


    function CreateSupplierAdvanceSearchPopUp(event,object) {
        trigger=event? $(this):object;
        triggerId=$(trigger.attr('id'));
        adTarget=$(trigger.attr(Settings.dataattr.SupplierSearchPopUp));                       //Target type specific
        Settings.requestpopup=PopUpType.Supplier_PopUp;
        InitializeDataSource();
        CreateAnyAdvanceSearchPopUp();
    }

    function CreateDocumentAdvanceSearchPopUp(event,object) {
        trigger=event? $(this):object;
        triggerId=$(trigger.attr('id'));
        adTarget=$(trigger.attr(Settings.dataattr.DocumentSearchPopUp));                       //Target type specific
        Settings.requestpopup=PopUpType.Document_PopUp;

        //Verfy required template and functions
        //if(typeof generateTipRevisionLink==="function") {
        //    alert("generateTipRevisionLink funciton detected");
        //}
        //else {
        //    alert("missing generateTipRevisionLink funciton");
        //    return;
        //}

        InitializeDataSource();
        //Need to check adTarget type
        //$("#"+triggerId.selector).on('onselect',eval(adTarget.selector));                      //Target for button only
        CreateAnyAdvanceSearchPopUp();
    }


    function LoadPopUpTemplate() {
        var script=document.createElement('script');
        script.src=''; //put whatever javascript you like here
        script.type='text/javascript';
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    function LoadSearchItemDetail(event,object) {
        trigger=event? $(this):object;
        //var triggerId=$(trigger.attr('id'));
        adTarget=$(trigger.attr(Settings.dataattr.LoadTarget));

        var supplierId=parseInt(adTarget.val());
        if(typeof supplierId==='undefined'||isNaN(supplierId)||supplierId==='')
            kendo.alert(Settings.message.LoadSupplierDetailError);
        else {
            var url=GetEnvironmentLocation()+Settings.controller.LoadCompanyDetail+supplierId;
            window.open(url,"_blank");
        }
    }

    function Hide() {
        searchWinPop.close();
    }


    //Static datasource only available at runtime
    function InitializeDataSource() {
        Settings.columndatasource.push(advanceSearchDataSource.SupplierSearchColumn);
        Settings.columndatasource.push(advanceSearchDataSource.DocumentSearchColumn);
    }

    $(document).on('click','['+Settings.dataattr.SupplierSearchPopUp+']',CreateSupplierAdvanceSearchPopUp);
    $(document).on('click','['+Settings.dataattr.DocumentSearchPopUp+']',CreateDocumentAdvanceSearchPopUp);
    //$(document).on('click','['+Settings.dataattr.LoadTarget+']',LoadSearchItemDetail);
    //$(document).on('click','['+Settings.dataattr.SharedTarget+']',CreateAdvanceSearchSharedPopUp);

    return {
        Show: Show
    };
})(jQuery,kendo);

