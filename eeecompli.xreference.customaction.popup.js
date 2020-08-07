/*
 * Custom Action for XReference
 * Contribute: Min Wang
 * @Date: June 2020 
 * XReference Scren shares lots of model dialog, due to the introdutionof NO SDS required letter with different
 * fields set and being seperated
 */

if (jQuery) (function ($, kdo) {

    var thisPopUpWindow, trigger, customActionObservableModel, targetGrid;
    var selectedRequests = new Array();
    var anyRequestResolvedStatus = false;
    var requestSupplierIds = new Array();
    var obtainmentInProgressRequestExists = false;
    var nonSDSDocumentType = false;

    var Settings = {
        text: {
            WindowTitle: "Custom Action"
        },
        division: {
            SharedControlDiv: "#SharedAdvanceSearchPopUpDiv"
        },
        dataattr: {
            Target: "data-xreference-customaction"
        },
        window: {
            CustomActionWindow: "CustomActionWindow"
        },
        controller: {
            GetAdvanceSearchSupplierAjaxResult: "/Operations/Company/GetAdvanceSearchSupplierAjaxResult",
            LookUpSupplierOnKeyEnter: GetEnvironmentLocation() + "/Operations/Company/LookUpSupplierOnKeyEnter",
            SaveCustomAction: GetEnvironmentLocation() + "/Operations/XReference/SaveCustomerActionRequests"
        },
        datasource: {
            customActionDataSource: new kendo.data.DataSource({
                transport: {
                    read: {
                        url: GetEnvironmentLocation() + "/svc/GetCustomActionTypeLookUp",
                        type: "POST",
                        contentType: "application/json"
                    }
                }
            })
        },
        message: {
            RequestsCouldNotBeSaved: "Requests could not be saved",
            CustomActionSavedSucessfuly: "Custom ction saved sucessfuly!"
        }
        
    };



    function Show() {
        if (thisPopUpWindow !== 'undefined') {
            thisPopUpWindow.center().open();
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
        var advnaceSearchCtl = $("#" + triggerId.selector).data("AdvanceSearch");

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

    function getModelViewObservable() {
        return kdo.observable({
            selectedCustomActionIndex: -1,
            customActionId: 0,
            customNotes: "",
            customNotesAltered: false,
            supplierIdAndNameValue: "",
            isSupplierIdNameVisiable: false,
            silbingSupplierId: 0,

            //change: onCustomActionChange, 
            //onCustomActionChange: function (e) {
            //    var dataItem = e.sender.dataItem();
            //},

            onCustomNotesChange: function (e) {
               
            },
            
            onCustomActionSelect: function (e) {
                var dashIndex = e.dataItem.Text.indexOf("-");

                if (dashIndex === -1) {
                    this.set("customActionId", 0);
                    this.set("customNotes", "");
                    this.set("customNotesAltered", false);
                    return;
                }

                var actionNumber = e.dataItem.Text.substr(0, dashIndex - 1);
                var noSequenceNote = e.dataItem.Text.split(" ").slice(2).join(" ");
                var thatObservable = this;

          
                if (actionNumber == "47") {
                    if (obtainmentInProgressRequestExists === true) {
                        //this.set("isSupplierIdNameVisiable", false);
                        kendo.alert("Some selected request(s) is in obtainment. Please add the document needed to the product shell.");
                        e.preventDefault();
                        return;
                    }

                    if (selectedRequests.length > 1) {
                        kendo.alert("Custom Action 47 can only apply to single request. Please use Cross Reference on the Administration Page for batch.");
                        e.preventDefault();
                        return;
                    }

                    if (anyRequestResolvedStatus) {
                        kendo.alert("Selected Cross Reference request has already resolved and can not apply custom action 47 again.");
                        e.preventDefault();
                        return;
                    }

                    if (nonSDSDocumentType) {
                        kendo.alert("Custom Action 47 can only apply to SDS request.");
                        e.preventDefault();
                        return;
                    }
                }
                //else {
                //    this.set("isSupplierIdNameVisiable", false);
                //}

                this.set("customActionId", actionNumber);

                if (this.get("customNotes") == "")
                    this.set("customNotesAltered", false);

                if (this.get("customNotesAltered") === true) {
                    kendo.confirm("Do you want to overwrite the notes?")
                        .done(function () {
                            thatObservable.set("customNotes", noSequenceNote);
                            thatObservable.set("customNotesAltered", false);
                        })
                        .fail(function () {
                            return;
                        });
                }
                else {
                    this.set("customNotes", noSequenceNote);
                    this.set("customNotesAltered", false);
                }

              
            },

            onSupplierIDAndNameKeyPress: function (e) {
                var thatObservable = this;
                if (e.keyCode == 13 || (e.ctrlKey && e.keyCode == 86)) {
                    var supplierIdOnly = this.get("supplierIdAndNameValue");
                    if ($.isNumeric(supplierIdOnly)) {
                        e.preventDefault();
                        var url = Settings.controller.LookUpSupplierOnKeyEnter;

                        $.post(url, {
                            supplierInfo: supplierIdOnly
                        }, function (data) {
                            if (data !== "") {
                                thatObservable.set("supplierIdAndNameValue", data);
                                thatObservable.set("silbingSupplierId", data.split(",")[0]);
                            }
                            else
                                thatObservable.set("supplierIdAndNameValue", data);
                        });
                    } else {
                        kendo.alert("Supplier Id must be numeric!");
                    }
                }
            },

            onCloseClick: function (e) {
                e.stopPropagation();
                e.preventDefault();
                thisPopUpWindow.close();
            },

            onResolveClick: function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (this.get("selectedCustomActionIndex") === -1) {
                    kendo.alert("Custom action required!");
                    return;
                }

                var customData = {};
                customData['ids'] = selectedRequests;
                customData['customerAction'] = "Customer Action";
                customData['notes'] = this.get("customNotes");
                customData['siblingSupplierId'] = this.get("silbingSupplierId");
                customData['actionId'] = this.get("customActionId");

                $(this).ajaxJSONCall(Settings.controller.SaveCustomAction, JSON.stringify(customData))
                    .success(function (successData) {
                        if (successData.success === true) {
                            $(this).savedSuccessFully(Settings.message.CustomActionSavedSucessfuly);
                        } else {
                            if (successData.message)
                               kendo.alert(successData.message);
                            else
                                kendo.alert(Settings.message.RequestsCouldNotBeSaved);
                        }
                    })
                    .error(function () {
                        kendo.alert(Settings.message.RequestsCouldNotBeSaved);
                    })
                    .done(function () {
                        //kendo.ui.progress(xreferenceDetailObj, false);
                        targetGrid.dataSource.read();
                    });

                thisPopUpWindow.close();
            },
            customActionDataSource: Settings.datasource.customActionDataSource
        });
    }

    function CreateCustomActionPopUp(event, object) {
        trigger = event ? $(this) : object;
        var triggerId = $(trigger.attr('id'));
        var gridTarget = $(trigger.attr('data-xreference-customaction'));
        var triggerStatus = $("#" + triggerId.selector).attr('disabled');

        //Make sure it's qualified for display
        if (triggerStatus == 'disabled')
            return;

        //Initialize 
        anyRequestResolvedStatus = false;
        nonSDSDocumentType = false;

        //Check the selected entry, in theory there should be at least one, otherwise the menu should disabled and won't come here
        targetGrid = $(gridTarget.selector).data("kendoGrid");

        if (targetGrid._data.length > 0) {
            $.each(targetGrid._data, function () {
                //this['IsSelected'] = checked;
                if (this['IsSelected']) {
                    selectedRequests.push(this["RequestWorkItemID"]);
                    if (this["SupplierID"] > 0 )
                        requestSupplierIds.push(this["SupplierID"]);
                    //Check and status XType
                    if (this["XType"] === "Obtainment" && this["Status"] === "In Progress")
                    {
                        obtainmentInProgressRequestExists = true;
                    }
                    if (this["Status"] === "Resolved") {
                        anyRequestResolvedStatus = true;
                    }
                    if (this["DocumentTypeLkpId"] !== 3) {
                        nonSDSDocumentType = true;
                    }
                }
                //else {
                //    var index = selectedRequests.indexOf(this["RequestWorkItemID"]);
                //    if (index > -1)
                //        selectedRequests.splice(index, 1);
                //}
            });
        }

        //Make sure not previously created, we don't do any cache for this particular case
        //var cacheWindow = $("#" + triggerId.selector).data(Settings.window.CustomActionWindow);
        //if (typeof cacheWindow !== 'undefined') {  //Show the window if already exists
        //    Show();
        //    return;
        //}

        var popDiv = $("<div id='CustomActionMainDivFor_" + triggerId.selector + "' class='custom-popup-target'></div>");
        var contentDiv = "<div class='custom-content'/>";
        var windowFootDiv = "<div class='window-footer' style='position:absolute;bottom:0;display:block;width:95%;margin-top:100px;padding:19px 0 20px;text-align:right;border-top:1px solid #e5e5e5;'><button id='customActionPopCloseBtn' type='button' class='k-button' data-bind='click: onCloseClick'>Cancel</button><button id='customActionPopResolveBtn' data-bind='click: onResolveClick' type='button' class='k-primary k-button'style='margin-left: 5px;'>Resolve</button></div>";

        //var supplierSearchGridDiv = $("<div id='PopUpSupplierSearchGridFor_" + triggerId.selector + "'></div>");
        //var template = kendo.template("<div id='box'>#= firstName #</div>");
        //var data = { firstName: "This is Todd content" };
        //var templateResult = $(template(data));
        //$("#example").html(result); //display the result

        var template = kendo.template(
            "<div id='divGeneralSection'><table>" +
            "<tr>" +
            "<td style='min-width:80px;'><label style='font-weight:bold'>Action:</label></td>" +
            "<td><input id='ddlCustomAction' data-role='dropdownlist' data-auto-bind='true' data-text-field='Text' data-value-field='Value' data-option-label='Select One' data-bind='value: selectedCustomActionIndex, source: customActionDataSource, events: {select: onCustomActionSelect }' style='min-width:906px;'/></td>"  +
            "</tr>" +
            "<tr>" +
            "<td style='min-width:80px;'><label style='font-weight:bold'>Notes:</label></td>" +
            "<td><textarea rows='3' cols='150' data-bind='value: customNotes' style='min-width:891px;'></textarea></td>" +
            "</tr>" +
            "<tr>" +
            "<td style='min-width:80px;'><label style='font-weight:bold' data-bind='visible: isSupplierIdNameVisiable'>Supplier Id:</label></td>" +
            "<td><input type='text' id='customSupplierIdAndName' data-value-update='keypress' data-bind='value: supplierIdAndNameValue, visible: isSupplierIdNameVisiable, events: {keypress: onSupplierIDAndNameKeyPress }' style='min-width:890px;'/>" +
            "</td>" +
            "</tr>" +
            "</table></div>");

        var templateResult = $(template({}));
        popDiv.append(contentDiv, [templateResult, windowFootDiv]);
        

        customActionObservableModel = getModelViewObservable();
        if (requestSupplierIds.length > 0) {
            customActionObservableModel.set("silbingSupplierId", requestSupplierIds[0]);
            var url = Settings.controller.LookUpSupplierOnKeyEnter;
            $.post(url, {
                supplierInfo: requestSupplierIds[0]
            }, function (data) {
                customActionObservableModel.set("supplierIdAndNameValue", data);
            });
            //customActionObservableModel.set("supplierIdAndNameValue", requestSupplierIds[0]);
        }
        kdo.bind(popDiv, customActionObservableModel);


        //TextArea change binding not defined or working
        customActionObservableModel.bind("change", function (e) {
            //console.log(e.field, "=", this.get(e.field));
            if (e.field === 'customNotes') {
                customActionObservableModel.set("customNotesAltered", true);
            }
        });

        thisPopUpWindow = popDiv.kendoWindow({
            width: "1024px",
            title: Settings.text.WindowTitle,
            modal: true,
            visible: false,
            resizable: false,
            actions: [
                //"Pin",
                "Minimize",
                "Maximize",
                "Close"
            ],
            height: 270,
            close: onClose
        }).data("kendoWindow");

        //thisPopUpWindow.content("show this");

        //popDiv.find("#customActionPopCloseBtn").click(function (e) {
        //    e.preventDefault();
        //    thisPopUpWindow.close();
        //});

        //popDiv.find("#customActionPopResolveBtn").click(function (e) {
        //    e.preventDefault();
        //    thisPopUpWindow.close();
        //});

        //Do cache
        //$("#" + triggerId.selector).data(Settings.window.CustomActionWindow, thisPopUpWindow);

        Show();
    }

    function Hide() {
        thisWindow.close();
    }

    $(document).on('click', '[data-xreference-customaction]', CreateCustomActionPopUp);   

    return {
        Show: Show
    };
})(jQuery, kendo);

