﻿; (function ($) {

    if ($.fn.obtainmentAdmin == null) {
        $.fn.obtainmentAdmin = {};

    }
    $.fn.obtainmentAdmin = function () {

        var currentUser = "LOGGEDINUSER";

        // initialize 
        var obtSearchObj = $("#ObtainmentWFPanel");                             // panel container
        var obtAdvancedSearchObj = $("#ObtainmentAdminSearchOptions");          // advanced search options
        var obtDetailObj = $("#ObtainmentAdminWFGrid");

        var workflowSearchObj = $("#ObtainmentWFPanel");                        // panel container
        var workflowAdvancedSearchObj = $("#ObtainmentAdvancedSearchOptions");  // advanced search options
        var workflowDetailObj = $("#ObtainmentWFGrid");                         // grid container 

        var selectedIds = {};                                                   // ids of selected rows
        var gridIds = {};                                                       // traversed ids with selection state

        var itemsChecked = 0;
        var selectedRequests = new Array();         // ids selected in the grid
        var preSelectedRequests = new Array();      // ids in previously sent email
        var selectedRows = new Array();
        var radioButtonSelected = "Group";

        var obtainmentObjects = {

            controls: {

                buttons: {
                    AddAdvancedSearchOption: "#btnAddCriteria",                     // save settings (not implemented)
                    RemoveAdvancedSearchOption: "#btnDeleteCriteria",               // remove settings (not implemented)
                    ClearObtainmentAdminBtn: "#clearObtainmentAdminBtn",        // clear advanced search options
                    SearchObtainmentAdminBtn: "#searchObtainmentAdminBtn",      // search as per advanced options

                    SendToObtainmentBtn: "#btnSendToObtainment",                    // bulk action
                    SendFirstEmail: "#btnSendFirstEmail",                           // bulk action
                    SendSecondEmail: "#btnSendSecondEmail",                         // bulk action
                    LogPhoneCall: "#btnLogPhoneCall",                               // bulk action
                    MatchToDocumentBtn: "#btnMatchToDocument",                      // bulk action
                    MakeCustomerActionBtn: "#btnMakeCustomerActionItem",            // bulk action
                    UnAssignFromButton: "#btnUnAssignFrom",
                    AssignToButton: "#btnAssignTo",
                    AssignMeButton: "#btnAssignMe",
                    UnAssignButton: "#btnUnAssign",
                    SaveAssignButton: "#btnSaveAssign",
                    ObtainmentSideMenuButton: "#btnObtainment",
                    CustomerActionSideMenuButton: "#btnCustomerAction",
                    SaveObtainmentButton: "#btnSaveObtainment",
                    SaveCustomerActionButton: "#btnSaveCustomerAction",
                    SearchSupplierButton: "#searchSupplierIdBtn",                   // bring up supplier search
                    CancelSupplierSearch: "#btnCancelSupplierSearch",               // exit supplier search
                },

                grids: {
                    GridRequests: "#gdSearchObtainment",
                    SearchSupplierNewGrid: "#gdSearchSupplierNew"
                },

                dateTime: {
                },

                dropdownlists: {
                    GroupsDropDownList: "#ddlGroups",
                    CustomerActionDropDownList: "#selCustomerAction",
                },

                textBoxes: {
                    IndividualTextBox: "#txtIndividual",
                    NotesTextBox: "#txtNotes",
                    ProductIdTextBox: "#txtProductId",
                    SearchSupplierIdTextBox: "#txtSearchSupplierId",
                },

                checkboxes: {
                },

                sideMenus: { SideBarWorkLoad: "#eeeSideBarWorkLoad" },

                labels: {
                    NotesLabel: "#lblNotes",
                    PendingNotesLabel: "#lblPendingNotes"
                },

            }

        }

        var actionModals = {
            Resolve: "#mdlResolve",
            Obtainment: "#mdlObtainment",
            CustomerAction: "#mdlCustomerAction",
        };

        var kendoWindows = {
        };

        var controllerCalls = {
            SearchRequestsCriteria: GetEnvironmentLocation() + "/Administration/Obtainment/GetSearchCriteria",
            SearchRequests: GetEnvironmentLocation() + "/Administration/Obtainment/SearchRequests",
            SaveAssignedItems: GetEnvironmentLocation() + "/Administration/Obtainment/SaveAssignedItems",
            SaveObtainment: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainment",
            SaveActionRequests: GetEnvironmentLocation() + "/Administration/Obtainment/SaveCustomerActionRequests",
            SupplierSearch: GetEnvironmentLocation() + "/Operations/ObtainmentSettings/PlugInSupplierSearch",
        };


        var messages = {

            instructionMessages: {
            },

            successMessages: { Saved: "Saved Successful" },
            confirmationMessages: {
                UnAssigneRequests: "unassign these request item(s)",
                AssignRequests: "assign these request item(s)",
                MatchDocuments: "match these request item(s)",
                SendToObtainment: "send the request item(s) to obtainment",
                SendFirstEmail: "send the request item(s) for obtainment by the first email",
                SendSecondEmail: "send the request item(s) to obtainment by a second email",
                LogPhoneCall: "log a phone call for the request item(s)",
                AssignRequests:"set a customer action for the request item(s)"

            },
            errorMessages: {
                UserRequiredToAssign: "User required to assign selected request item(s)",
                SelectFilter: "A filter must be selected to execute a search",
                NoItemsSelected: "No items have been selected",
                NoCustomerActionSelected: "No customer action has been specified",
                NoPendingActionSelected: "No action has been specified",
                NoRowSelected: "No row selected",
                RequestsCouldNotBeSaved: "Requests could not be saved",
                RequestsCouldNotBeAssigned: "Requests could not be assigned",
                GeneralError: "Error Occurred",
                SelectedStateForSqlError: "Selected State is only for SQL Search",
                SelectedStateForEsError: "Selected State is only for Elastic Search"
            }
        };

        // query model
        var obtainmentAdminSearchModel = {
            Criterias: []
        };

        // side action menus
        function enableAssignUnAssignButtons() {

        }

        function disableSideMenuItems() {
            $("#eeeSideBarWorkLoad").find("[id^=btn]").each(function (i, v) {
                $(v).enableControl(false);
                $(v).addClass("disabled-link");
            });
        }

        function enableSideMenuItems() {
            $("#eeeSideBarWorkLoad").find("[id^=btn]").each(function (i, v) {
                $(v).enableControl(true);
                $(v).removeClass("disabled-link");
            });
        }

        // get cross reference results
        var doObtainmentSearch = function (initial) {

            // prevent another search being executed
            disableButtons();

            var url = controllerCalls.SearchRequests
            var searchCriteria = getAdvancedSearchCriteria();

            if (searchCriteria.Criterias != null) {
                if (Array.from(searchCriteria.Criterias).map((v, i) => v.FieldName).indexOf("State") >= 0) {
                    $("#defaultSearch").html("");
                }
                else {
                    $("#defaultSearch").html("Displaying all non-complete cross reference requests.");
                }
            }

            if (!initial) searchCriteria = JSON.stringify(getAdvancedSearchCriteria());

            $(this).ajaxCall(controllerCalls.SearchRequests, { searchCriteria: searchCriteria })
                .success(function (data) {
                    obtDetailObj.html(data);
                    enableButtons();
                }).error(
                    function () {
                        enableButtons();
            });
        };

        // ---------------------------------  BUTTONS AND MENUS    

        disableButtons = function () {

        };

        enableButtons = function () {

        };

        getGridIds = function () {
            return gridIds;
        }

        // final call handled by "Save"
        batchAssignWorkItems = function () {

            var _gridIds = getGridIds();

            // no items selected ?
            if (Object.keys(_gridIds).length == 0) {
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {

                var message = 'Are you sure you would like to ' + messages.confirmationMessages.AssignRequests + '?';
                var args = { message: message, header: 'Confirm Requests Selected' };
                DisplayConfirmationModal(args, function () {
                    $(actionModals.Assign).displayModal();    
                }, function () {
                    // do nothing
                });
                
            }

        }

        // confirm and unassign work items
        batchUnassignWorkItems = function () {

            var _gridIds = getGridIds();

            // no items selected ?
            if (Object.keys(_gridIds).length == 0) {
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {
                // display confirmation dialog
                var message = 'Are you sure you would like to ' + messages.confirmationMessages.UnAssigneRequests + '?';
                var args = { message: message, header: 'Confirm Requests Selected' };
                DisplayConfirmationModal(args, function ()
                {
                    batchAssignUnassignWorkItems(false, null, null);
                }, function ()
                {
                    // do nothing
                });
            }

        }

        // controller call to assign/unassign work items
        batchAssignUnassignWorkItems = function (isAssign, assignedTo, completeCallback) {

            var data = {};

            data['ids'] = selectedIds;
            data["searchCriteria"] = $("#SearchCriteria").val();
            data["isAssign"] = isAssign;
            data["assignedTo"] = (isAssign ? assignedTo : null);

            var url = controllerCalls.SaveAssignedItems;

            $(this).ajaxJSONCall(url, JSON.stringify(data))
                .success(function (successData) {

                    debugger;

                    if (successData.success === true) {

                        // find all grids on the page by locating the master check control

                        obtDetailObj.find(".chkMasterMultiSelect").each((i, v) => {

                            // uncheck the master control
                            $(v).prop('checked', false);

                            // unselect all identifiers in view
                            var grid = $(v).parents('.k-grid:first').data().kendoGrid;
                            
                            // data source
                            $(grid.dataSource.view()).each(function (_i, _v) {

                                // locate row
                                var row = grid.table.find("[data-uid=" + _v.uid + "]");

                                // locate checkbox
                                $(row).find(".chkMultiSelect").prop("checked", false);

                                // set row state
                                $(row).removeClass("k-state-selected");

                            });

                            // reset identifiers
                            selectedIds = [];
                            gridIds = [];

                        });

                        return true;


                        // un check all selected rows

                        // update the assigned to value for all grids

                        // no need to refresh ?

                        // Uncheck the master select checkbox if checked
                        //var checkbox = $(grid.element).find('.chkMasterMultiSelect');
                        //if (checkbox && checkbox.is(':checked'))
                        //    checkbox.attr('checked', false);


                        //grid = $(targetGridSelector).data("kendoGrid");
                        //grid.dataSource.read();

                    } else
                    {
                        $(this).displayError(messages.errorMessages.GeneralError);
                    }
                })
                .error(function () { $(this).displayError(messages.errorMessages.RequestsCouldNotBeAssigned); })
                .complete(function (compData) {

                    kendo.ui.progress(obtDetailObj, false);
                    $(this).savedSuccessFully(messages.successMessages.Saved);
                    if (completeCallback)
                        completeCallback(compData);
                });
        }

        batchAssignUnassign = function (message, url, isAssign, assignTo, completeCallback) {

            var _gridIds = getGridIds();

            // no items selected ?
            if (Object.keys(_gridIds).length == 0) {
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {

                // display confirmation dialog
                var message = 'Are you sure you would like to ' + messages.confirmationMessages.AssignRequests + '?';
                var args = { message: message, header: 'Confirm Requests Selected' };
                DisplayConfirmationModal(args, function () {
                    batchAssignUnassign(false, null, null);
                }, function () {
                    // do nothing
                });
            }

            return false;

        };

        getSelectedCategories = function () {
            var list = $(obtainmentObjects.controls.dropdownlists.CategoriesDropDownList).data("kendoMultiSelect").value();
            return list.join(",");
        };

        // clear search 
        obtSearchObj.on("click", obtainmentObjects.controls.buttons.ClearObtainmentAdminBtn, function () {

            // release all kendo controls
            $("#advancedSearchContainerTable").find("[data-role='datepicker']").each((i, v) => {
                $(v).data("kendoDatePicker").destroy();
            });

            // remove all criteria
            $("#advancedSearchContainerTable").find("select[id^='drpFields_']").map((i, v) => {

                // if first one, set to default choice.
                if (i == 0) {
                    $(v).data("kendoDropDownList").value("AccountID");
                    $(v).data("kendoDropDownList").trigger("change");
                }
                else {
                    $(v).closest("[id^=row]").remove();
                }

            });

            // display init
            init(null);

        });

        // clear search 
        obtSearchObj.on("click", obtainmentObjects.controls.buttons.SearchObtainmentAdminBtn, function () {
            doObtainmentSearch();
        });

        // customer notes action
        obtSearchObj.on("change", obtainmentObjects.controls.dropdownlists.CustomerActionDropDownList, function () {

            var txtNotes = $(obtainmentObjects.controls.textBoxes.NotesTextBox);
            var selNotes = $(obtainmentObjects.controls.dropdownlists.CustomerActionDropDownList).data("kendoDropDownList");

            $(obtainmentObjects.controls.labels.NotesLabel).css("display", "inline");
            $(obtainmentObjects.controls.textBoxes.NotesTextBox).css("display", "inline");

            // already entered text
            var txtCustomerAction = txtNotes.val();
            var emptyCustomerAction = (txtCustomerAction.replace(/ /g, "") == "");

            // selected customer action
            var selCustomerAction = selNotes.text();
            if (selCustomerAction == "Select One") selCustomerAction = "";

            // content already in text
            if (!emptyCustomerAction) {

                var edited = true;
                $(selNotes.dataSource.view()).each(function () {
                    console.log("Comparing with" + this.Text);
                    if (this.Text == txtCustomerAction) edited = false;
                });

                // if edited, prompt user for change confirmation.
                if (edited) {

                    var message = messages.confirmationMessages.OverwriteComments;
                    var args = { message: message, header: 'Confirm comment overwrite.' };

                    DisplayConfirmationModal(args, function () {
                        $(obtainmentObjects.controls.textBoxes.NotesTextBox).val(selCustomerAction);
                    }, function () {
                        // do nothing
                    });

                }
                else
                    $(obtainmentObjects.controls.textBoxes.NotesTextBox).val(selCustomerAction);

            }
            else {
                $(obtainmentObjects.controls.textBoxes.NotesTextBox).val(selCustomerAction);
            }

        });

        // ---------------------------------------- ADVANCED SEARCH OPTIONS ---------------------------------------- 

        // ADD ADVANCED SEARCH OPTION
        obtSearchObj.on("click", obtainmentObjects.controls.buttons.AddAdvancedSearchOption, function () {

            // conditions
            var conditions = $("#advancedSearchContainerTable > div[id=row]").size();
            
            if (true) {

                var url = controllerCalls.SearchRequestsCriteria;
                $.post(url, function (data) {
                    $("#advancedSearchContainerTable").append(data);
                });

            }

        })

        // REMOVE ADVANCED SEARCH OPTION - all except the first are removable
        obtSearchObj.on("click", obtainmentObjects.controls.buttons.RemoveAdvancedSearchOption, function (e) {
            $(e.target).closest("[id^=row]").remove();
        })

        obtSearchObj.on("change", obtainmentObjects.controls.dropdownlists.SearchCriteriaOption, function (e) {
            
        })

        function handleAdvancedSearchOption(e) {

            // the fields control and unique id
            var ctrl = "#" + this.element.attr("id");
            var id = ctrl.substr(ctrl.lastIndexOf("_"));

            // field selected value
            var optionTag = $(ctrl).data("kendoDropDownList");
            var option = optionTag.value().toUpperCase();

            // free text fields
            var textField = ctrl.replace("drpFields", "txtFreeField");
            var textField1 = ctrl.replace("drpFields", "txtFreeField_1");

            // destroy any date pickers that may have been created by a previous action
            var datePickers = $("#advancedSearchContainerTable").find("[data-role='datepicker'][id$='" + id + "']");
            if (datePickers.size() > 0) {
                $(textField).data("kendoDatePicker").destroy();
                $(textField1).data("kendoDatePicker").destroy();
            }

            // destroy any multi select drop downs

            // re-create controls
            $("#dvFreeText" + id).empty();

            var html = '<input type="text" id="txtFreeField_@id" style="width:100px;visibility:hidden" />' +
                '<input type="text" id="txtFreeField_1_@id" style="width:100px;visibility:hidden" />';

            html = html.replace(/_@id/g, id);
            var textParent = $("#dvFreeText" + id).html(html);
            textParent.hide();

            // hide condition, enable as required
            var condition = "#dvDropDownCondition" + id;
            $(condition).css({ visibility: 'hidden' });

            var conditionDropDown = "#drpContains" + id;
            $(conditionDropDown).data("kendoDropDownList").value("");

            // hide all selects           
            $("#advancedSearchContainerTable").find("select[id$=" + id + "]").map((i, v) => {
                var id = $(v).attr("id");
                if (id.toLowerCase().indexOf("dropdown") >= 0) {
                    var enclosure = "#" + id.replace("drp", "dv");
                    $(enclosure).hide();
                }
            });

            // "DATEOBTSTARTEDRANGE", "DATEXREFSTARTEDRANGE"

            if (["DATEASSIGNEDRANGE", "DATECREATEDRANGE"].indexOf(option) >= 0) {
                // convert to date pickers
                $(textField).css({ visibility: '', width: "100px" });
                $(textField1).css({ visibility: '', width: "100px" });
                $(textField).kendoDatePicker();
                $(textField1).kendoDatePicker();
                textParent.show();
            }
            else if (["ACCOUNTID", "DOCUMENTID"].indexOf(option) >= 0) {
                $(textField).css({ visibility: '', width: "100px" });
                textParent.show();
            }
            else if (["ACCOUNTNAME", "PRODUCTNAME", "MANUFACTURERNAME", "ASSIGNEDTO"].indexOf(option) >= 0) {
                $(textField1).css({ width: "0px" });
                $(textField).css({ visibility: '', width: "200px" });
                $(condition).css({ visibility: '' });
                textParent.show();
            }
            else {

                var ddid = "#dvDropDown_" + optionTag.text().replace(/ /g, "") + id;
                $(ddid).show();
            }

        }

        getAdvancedSearchCriteria = function () {

            var criteria = [];

            $("#advancedSearchContainerTable").find("select[id^='drpFields_']").map((i, v) => {

                var searchFor = null;

                var timeId = $(v).attr("id").split("_").reverse()[0];

                var ddlFields = "#drpFields_" + timeId;

                var textFieldId = "#txtFreeField_" + timeId;
                var textField1Id = "#txtFreeField_1_" + timeId;

                var criteriaField = $("#drpFields_" + timeId).data("kendoDropDownList");        // always has a value
                var containsDropDown = $("#drpContains_" + timeId).data("kendoDropDownList");   // always has a value

                console.log(i + " " + $(v).attr("id"));

                var fieldDropDown = $("#drpDropDown_" + criteriaField.text().replace(/ /g, "") + "_" + timeId).data("kendoDropDownList");
                

                // criteria definition
                var fieldName = criteriaField.value();
                var whereOperator = containsDropDown.value();
                var searchFor = $(textFieldId).val().replace(/ /g, "");

                var criteriaFieldName = criteriaField.value().toUpperCase();

                var errors = [];

                if (["DATEASSIGNEDRANGE", "DATECREATEDRANGE"].indexOf(criteriaFieldName) >= 0) {

                    var offset = (new Date()).getTimezoneOffset();

                    var behind = (offset < 0);
                    offset = Math.abs(offset);

                    var minutes = offset % 60;
                    var hours = (offset - minutes) / 60;

                    var offsetHM = (behind ? "-" : "+") + hours + ":" + minutes;

                    var fromDate = $(textFieldId).val().replace(/ /g, "");
                    var toDate = $(textField1Id).val().replace(/ /g, "");

                    whereOperator = "Date Range";

                    try {
                        fromDate = (new Date(fromDate)).toISOString().split('T')[0];
                    }
                    catch (e)
                    {
                        fromDate = null;
                    }

                    try
                    {
                        toDate = new Date(toDate).toISOString().split('T')[0];
                    }
                    catch (e)
                    {
                        toDate = null;
                    }

                    // prefixed with offset in minutes
                    searchFor = offsetHM + "|" + fromDate + "|" + toDate;

                    if (fromDate == null && toDate == null)
                    {
                        searchFor = null;  
                        whereOperator = "Exact Match";
                    }

                }
                else if (["ACCOUNTID", "DOCUMENTID"].indexOf(criteriaFieldName) >= 0) {
                    whereOperator = "Exact Match";
                    searchFor = $(textFieldId).val();
                }
                else if (["ACCOUNTNAME", "PRODUCTNAME", "MANUFACTURERNAME", "ASSIGNEDTO"].indexOf(criteriaFieldName) >= 0) {
                    searchFor = $(textFieldId).val()
                }
                else {
                    whereOperator = "Exact Match";
                    searchFor = fieldDropDown.value();
                }

                criteria.push({
                    FieldName: fieldName,
                    WhereOperator: whereOperator,
                    SearchFor: searchFor
                });

            });

            var data = new Object();
            data.Criterias = criteria;

            return data;

        }

        // ---------------------------------  UTILITY FUNCTIONS

        function changesSavedSuccessfully() {
            $(this).savedSuccessFully(messages.successMessages.ChangesSavedSuccessfully);
        }

        // ---- 

        //Show Supplier
        obtSearchObj.on("click", obtainmentObjects.controls.buttons.SearchSupplierButton, function () {
            // var activeSupplier = "txtSearchSupplierId";
            $("#supplierSearchWindow").data("kendoWindow").center().open();
            $(actionModals.Obtainment).toggleModal();
        });

        // ---------------------------------  ASSIGN - UNASSIGN FUNCTIONS

        obtDetailObj.on("change", "input[name=GroupIndividual]:radio", function () {
            radioButtonSelected = $(this).val();
            if ($(this).val() === "Group") {
                $(obtainmentObjects.controls.dropdownlists.GroupsDropDownList).closest(".k-widget").show();
                $(obtainmentObjects.controls.textBoxes.IndividualTextBox).closest(".k-widget").hide();
                $(obtainmentObjects.controls.textBoxes.IndividualTextBox).data("kendoAutoComplete").value("");
            }
            else {
                $(obtainmentObjects.controls.textBoxes.IndividualTextBox).closest(".k-widget").show();
                $(obtainmentObjects.controls.dropdownlists.GroupsDropDownList).closest(".k-widget").hide();
            }
        });

        obtDetailObj.on("click", obtainmentObjects.controls.buttons.SaveAssignButton, function (e) {

            e.preventDefault();
            var userName = $(obtainmentObjects.controls.textBoxes.IndividualTextBox).data("kendoAutoComplete");
            var selectedValue;
            if (radioButtonSelected === "Group") {

                var ddlGroups = $(obtainmentObjects.controls.dropdownlists.GroupsDropDownList).data("kendoDropDownList");

                selectedValue = ddlGroups.text();
                if (ddlGroups.select() == 0) selectedValue = "";


            } else
                selectedValue = userName.value();

            debugger;

            // valid group or name check
            if (selectedValue.replace(/ /g, "").length > 0) {

                // assign 
                batchAssignUnassignWorkItems(true, selectedValue, function () {
                    $(actionModals.Assign).hideModal();
                });

            }
            else {

                $(actionModals.Assign).hideModal();
                var errorMessage;

                if ($("input[name=GroupIndividual]:radio").val() === "Group")
                    errorMessage = messages.errorMessages.SelectGroup;
                else
                    errorMessage = messages.errorMessages.UserRequiredToAssign;

                $(this).displayError(errorMessage);
            }

        });

        // --------------------------------- GRID ACTIONS

        function handleKendoGridEvents(e) { // TESTED

            var grid = e.sender;
            $(grid.dataSource.view()).each(function (i, v) {

                // locate row
                var row = grid.table.find("[data-uid=" + v.uid + "]");

                // row preselected ?
                var checked = (gridIds[v.RequestWorkItemID] == true);

                // locate checkbox
                $(row).find(".chkMultiSelect").prop("checked", checked);

                // set row state
                $(row).addClass(checked ? "k-state-selected" : "").removeClass(checked ? "" : "k-state-selected");

            });

        }

        function getSelectedIdsBySortOrder() {

            var _selectedIds = [];

            var grid = $(obtainmentObjects.controls.grids.GridRequests).data("kendoGrid");
            $(grid.dataSource.view()).each(function (i, v) {

                // locate row
                var row = grid.table.find("[data-uid=" + v.uid + "]");

                // selected ?
                var selected = $(row).hasClass("k-state-selected");

                if (selected) _selectedIds.push(v.RequestWorkItemID);

            });

            // alert(_selectedIds);
            return _selectedIds;

        }

        function enableAssignUnAssignButtons(state) {

        }

        function doPostGridRowAction() {

            disableSideMenuItems();
            enableAssignUnAssignButtons(false);

            selectedIds = [];
            Object.keys(gridIds).forEach(function (v, i) {
                console.log(v, i);
                if (gridIds[v]) selectedIds.push(parseInt(v));
            });

            console.log(selectedIds);

            if (selectedIds.length > 0) {
                enableAssignUnAssignButtons(true);
                enableSideMenuItems();
            }

        }

        confirmMatchToDocument = function () {

            var _gridIds = getGridIds();

            // no items selected ?
            if (Object.keys(_gridIds).length == 0) {
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {

                // display confirmation dialog
                var message = 'Are you sure you would like to ' + messages.confirmationMessages.MatchDocuments + '?';
                var args = { message: message, header: 'Confirm Requests Selected' };
                DisplayConfirmationModal(args, function () {
                    batchAssignUnassign(false, null, null);
                }, function () {
                    // do nothing
                });
            }

            return false;
        }

        confirmSendToObtainment = function () {

            var _gridIds = getGridIds();

            // no items selected ?
            if (Object.keys(_gridIds).length == 0) {
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {

                // display confirmation dialog
                var message = 'Are you sure you would like to ' + messages.confirmationMessages.SendToObtainment + '?';
                var args = { message: message, header: 'Confirm Requests Selected' };
                DisplayConfirmationModal(args, function () {
                    $(actionModals.Obtainment).displayModal();
                }, function () {
                    // do nothing
                });
            }

            return false;

        }

        confirmFirstEmail = function () {

            var _gridIds = getGridIds();

            // no items selected ?
            if (Object.keys(_gridIds).length == 0) {
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {

                // display confirmation dialog
                var message = 'Are you sure you would like to ' + messages.confirmationMessages.SendFirstEmail + '?';
                var args = { message: message, header: 'Confirm Requests Selected' };
                DisplayConfirmationModal(args, function () {
                    $(actionModals.Obtainment).displayModal();
                }, function () {
                    // do nothing
                });
            }

            return false;

        }

        confirmSecondEmail = function () {

            var _gridIds = getGridIds();

            // no items selected ?
            if (Object.keys(_gridIds).length == 0) {
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {

                // display confirmation dialog
                var message = 'Are you sure you would like to ' + messages.confirmationMessages.SendSecondEmail + '?';
                var args = { message: message, header: 'Confirm Requests Selected' };
                DisplayConfirmationModal(args, function () {
                    $(actionModals.Obtainment).displayModal();
                }, function () {
                    // do nothing
                });
            }

            return false;

        }

        confirmLogPhoneCall = function () {

            var _gridIds = getGridIds();

            // no items selected ?
            if (Object.keys(_gridIds).length == 0) {
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {

                // display confirmation dialog
                var message = 'Are you sure you would like to ' + messages.confirmationMessages.LogPhoneCall + '?';
                var args = { message: message, header: 'Confirm Requests Selected' };
                DisplayConfirmationModal(args, function () {
                    $(actionModals.Obtainment).displayModal();
                }, function () {
                    // do nothing
                });
            }

            return false;

        }

        confirmCustomerAction = function () {

            var _gridIds = getGridIds();
            $(crossReferenceObjects.controls.textBoxes.NotesTextBox).val("");

            // no items selected ?
            if (Object.keys(_gridIds).length == 0) {
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {

                // display confirmation dialog
                var message = 'Are you sure you would like to ' + messages.confirmationMessages.AssignRequests + '?';
                var args = { message: message, header: 'Confirm Requests Selected' };
                DisplayConfirmationModal(args, function () {
                    $(actionModals.CustomerAction).displayModal();
                }, function () {
                    // do nothing
                });
            }

            return false;

        }

        saveCustomerAction = function () {

            // no items selected ?
            if ((selectedIds || []).length > 0) {

                var selCustomerAction = $(obtainmentObjects.controls.textBoxes.NotesTextBox).val();

                if (selCustomerAction.replace(/ /g, '').length > 0) {

                    var data = {};
                    data['ids'] = selectedIds;
                    data['customerAction'] = "Customer Action";
                    data['notes'] = selCustomerAction;

                    SaveRequest(controllerCalls.SaveActionRequests, data, actionModals.CustomerAction);
                    
                } else {

                    // indicate no customer selected
                    $(this).displayError(messages.errorMessages.NoCustomerActionSelected);

                }

            }

        }

        function Remove(str, startIndex) {
            return str.substr(0, startIndex);
        }

        saveSendToObtainment = function () {

            // safety
            if ((selectedIds || []).length > 0) {

                // if a supplier id was selected
                if ($(obtainmentObjects.controls.textBoxes.SearchSupplierIdTextBox).val().length > 0) {

                    var data = {};
                    data['ids'] = selectedRequests;
                    data['supplierId'] = Remove($(obtainmentObjects.controls.textBoxes.SearchSupplierIdTextBox).val(),
                        $(obtainmentObjects.controls.textBoxes.SearchSupplierIdTextBox).val().indexOf(","));

                    //SaveRequest(controllerCalls.SaveObtainment, data, actionModals.Obtainment);

                } else {

                    $(actionModals.Obtainment).toggleModal();
                    $(this).displayError(messages.errorMessages.NoSupplierSelected);

                }

            }

        }

        function SaveRequest(strUrl, dataArray, modalId, callback) {
            if (selectedIds.length > 0) {
                kendo.ui.progress(obtDetailObj, true);
                $(this).ajaxJSONCall(strUrl, JSON.stringify(dataArray))
                    .success(function (successData) {
                        
                        if (successData.success === true) {

                            // display message and hide modal
                            $(this).savedSuccessFully(messages.successMessages.Saved);
                            if (modalId != null) $(modalId).hideModal();                         

                        } else {
                            if (successData.message)
                                $(this).displayError(successData.message);
                            else
                                $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);
                        }

                        if (callback != null) callback(successData);

                    })
                    .error(function () {
                        $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);
                    })
                    .done(function () {

                        // stop progress indicator
                        kendo.ui.progress(obtDetailObj, false);

                        // update the grids
                        
                    });

            }
        }

        var loadRequests = function () {

            // bind grid
            var grid = $(obtainmentObjects.controls.grids.GridRequests).data("kendoGrid");
            grid.dataSource.read();

            selectedIds = {};
            gridIds = {}; 

            // disable all options
            disableSideMenuItems();

            // show the slide out tab
            $(obtainmentObjects.controls.sideMenus.SideBarWorkLoad).sidemenu().show();

            // default to group
            $(obtainmentObjects.controls.textBoxes.IndividualTextBox).closest(".k-widget").hide();

            // assign event handlers for assign/un-assign
            obtDetailObj.on("click", obtainmentObjects.controls.buttons.UnAssignFromButton, function (e) {
                batchUnassignWorkItems();
            });

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.AssignToButton, function (e) {
                batchAssignWorkItems();
            });

            // bulk operation confirmations
            obtDetailObj.on("click", obtainmentObjects.controls.buttons.SendToObtainmentBtn, function (e) {
                confirmSendToObtainment();
            });

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.SendFirstEmail, function (e) {
                confirmSendFirstEmail();
            });

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.SendSecondEmail, function (e) {
                confirmSendSecondEmail();
            });

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.LogPhoneCall, function (e) {
                confirmLogPhoneCall();
            });

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.MatchToDocumentBtn, function (e) {
                confirmMatchToDocument();
            });

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.MakeCustomerActionBtn, function (e) {
                confirmCustomerAction();
            });

            // bulk operation updates

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.SaveObtainmentButton, function (e) {
                saveSendToObtainment();
            });

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.SaveCustomerActionButton, function (e) {
                saveCustomerAction();
            });

        };

        function obtainmentSelSupplier(supplierSearchDialog) {

            return;

            var grid = $(obtainmentObjects.controls.grids.SearchSupplierNewGrid).data("kendoGrid");
            if (grid.dataSource.total() === 0) {
                $(this).displayError(messages.errorMessages.NoRowSelected);
                return;
            }
            var data = grid.dataItem(grid.select());
            if (data == null) {
                $(this).displayError(messages.errorMessages.NoRowSelected);
                return;
            }

            $(obtainmentObjects.controls.textBoxes.ProductIdTextBox).val(data.id + "," + data.Name);

            supplierSearchDialog.data("kendoWindow").close();
            $(actionModals.Obtainment).displayModal();

        }

        var loadSupplierPlugIn = function () {

            $.post(controllerCalls.SupplierSearch, { supplierId: 0 }, function (data) {
                $("#dgSupplierPlugIn").html(data);
            });

            var supplierSearchDialog = $("#supplierSearchWindow");

            $(obtainmentObjects.controls.buttons.CancelSupplierSearch).click(function () {
                supplierSearchDialog.data("kendoWindow").close();
                //DisableSideMenuItems();
                //EnableSideMenuItem(xreferenceObject.controls.buttons.ObtainmentSideMenuButton);
                $(actionModals.Obtainment).displayModal();
            });

            $('#dgSupplierPlugIn').on('dblclick', 'table tr', function () {
                obtainmentSelSupplier(supplierSearchDialog);
            });

            //This is for Supplier plugIn
            $("#searchSupplierIdSelect").click(function () {
                alert("Selected");
                obtainmentSelSupplier(supplierSearchDialog);
            });

        }

        $(obtDetailObj).on("click", ".chkMultiSelect", function () { // TESTED

            // master select state
            var checked = $(this).is(':checked');

            // get grid
            var grid = $(this).parents('.k-grid:first').data().kendoGrid;

            // grid row
            var row = $(this).closest("[data-uid]");

            // set row state
            $(row).addClass(checked ? "k-state-selected" : "").removeClass(checked ? "" : "k-state-selected");

            // set state of row
            gridIds[grid.dataItem(row).RequestWorkItemID] = checked;

            // after select actions
            doPostGridRowAction();

        });

        $(obtDetailObj).on("click", ".chkMasterMultiSelect", function () {

            // master select state
            var checked = $(this).is(':checked');

            // get grid
            var grid = $(this).parents('.k-grid:first').data().kendoGrid;

            var dataSource = grid.dataSource;

            // iterate through rows in view and set/un selection state
            $(grid.dataSource.view()).each(function (i, v) {

                // locate row
                var row = grid.table.find("[data-uid=" + v.uid + "]");

                // locate checkbox
                var selector = $(row).find(".chkMultiSelect");

                if (selector.size() != 0) {

                    $(selector).prop("checked", checked);

                    // set row state
                    $(row).addClass(checked ? "k-state-selected" : "").removeClass(checked ? "" : "k-state-selected");

                    // flag selection state
                    gridIds[grid.dataItem(row).RequestWorkItemID] = checked;
                }

            });

            // after select actions
            doPostGridRowAction();

        });

        function SubError(errorMessage) {
            var message = errorMessage;
            $('#errorReport').find('.modal-body').html(message);
            $("#errorReport").modal({
                backdrop: true,
                keyboard: true
            }).css({
                width: 'auto',
                'margin-left': function () {
                    return -($(this).width() / 2); //auto size depending on the message
                }
            });
        }

        // UTILITY FUNCTION
        function getQueryVariable(variable) {
            var query = window.location.search.substring(1);

            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
        }

        function init() {
            // not implemented
        }

        function onDataBound() {
           // not implemented
        }

        function onDetailDataBound(sender) {

            // highlight rows selected
            var grid = sender.sender;
            var pageData = grid.dataSource.view();

            pageData.forEach((v, i) => {

                // see if the RequestWorkItemID for the row is in the selected list.
                // if yes, highlight the row.

                var row = grid.table.find("[data-uid=" + v.uid + "]");
                $(row).removeClass("k-state-selected");

                var checked = gridIds[grid.dataItem(row).RequestWorkItemID];
                if (checked) {
                    $(row).addClass("k-state-selected");
                    var selector = $(row).find(".chkMultiSelect");
                    $(selector).prop("checked", checked);
                }

            });

        }

        function onResponseDetailExpand() {
            // not implemented
        }

        function hotKeyDisplay() {
            // not implemented
        }

        return {

            init: init,
            getAdvancedSearchCriteria: getAdvancedSearchCriteria,
            handleAdvancedSearchOption: handleAdvancedSearchOption,
            loadRequests: loadRequests,
            handleKendoGridEvents: handleKendoGridEvents,
            showError: SubError,
            onDataBound: onDataBound,
            onDetailDataBound: onDetailDataBound,
            onResponseDetailExpand: onResponseDetailExpand,
            enableAssignUnAssignButtons: enableAssignUnAssignButtons,
            hotKeyDisplay: hotKeyDisplay,
            loadSupplierPlugIn: loadSupplierPlugIn

        };
    };
})(jQuery);