; (function ($) {

    if ($.fn.crossReferenceAdmin == null) {
        $.fn.crossReferenceAdmin = {};

    }
    $.fn.crossReferenceAdmin = function () {

        var currentUser = "LOGGEDINUSER";

        // initialize 
        var craSearchObj = $("#CrossRefernceWFPanel");                          // panel container
        var craAdvancedSearchObj = $("#CrossReferenceAdminSearchOptions");      // advanced search options
        var craDetailObj = $("#CrossReferenceAdminWFGrid");

        var workflowSearchObj = $("#IndexationWFPanel");                        // panel container
        var workflowAdvancedSearchObj = $("#IndexationAdvancedSearchOptions");  // advanced search options
        var workflowDetailObj = $("#IndexationWFGrid");                         // grid container 

        var selectedIds = {};                                                   // ids of selected rows
        var gridIds = {};                                                       // traversed ids with selection state

        var itemsChecked = 0;
        var selectedRequests = new Array();         // ids selected in the grid
        var preSelectedRequests = new Array();      // ids in previously sent email
        var selectedRows = new Array();
        var radioButtonSelected = "Group";

        var crossReferenceObjects = {

            controls: {

                buttons: {
                    AddAdvancedSearchOption: "#btnAddCriteria",                     // save settings (not implemented)
                    RemoveAdvancedSearchOption: "#btnDeleteCriteria",               // remove settings (not implemented)
                    ClearCrossReferenceAdminBtn: "#clearCrossReferenceAdminBtn",    // clear advanced search options
                    SearchCrossReferenceAdminBtn: "#searchCrossReferenceAdminBtn",  // search as per advanced options
                    SendToObtainmentBtn: "#btnSendToObtainment",                    // bulk action
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
                    ResolveActionButton: "#btnSaveResolve",                         // resolve the selected work items
                },

                grids: {
                    GridRequests: "#gdSearchCrossReference",
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
            Assign:"#mdlAssign"
        };

        var kendoWindows = {
        };

        var controllerCalls = {
            SearchRequestsCriteria: GetEnvironmentLocation() + "/Administration/CrossReference/GetSearchCriteria",
            SearchRequests: GetEnvironmentLocation() + "/Administration/CrossReference/SearchRequests",
            SaveAssignedItems: GetEnvironmentLocation() + "/Administration/CrossReference/SaveAssignedItems",
            SaveObtainment: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainment",
            SaveActionRequests: GetEnvironmentLocation() + "/Administration/CrossReference/SaveCustomerActionRequests",
            SupplierSearch: GetEnvironmentLocation() + "/Operations/ObtainmentSettings/PlugInSupplierSearch",
            ResolveRequests: GetEnvironmentLocation() + "/Administration/CrossReference/ResolveRequests",
        };


        var messages = {

            instructionMessages: {
            },

            successMessages: { Saved: "Saved Successful" },
            confirmationMessages: {
                UnAssigneRequests: "unassign these request item(s)",
                AssignRequests: "assign these request item(s)",
                MatchDocuments: "match a document these request item(s)",
                SendToObtainment: "send the request item(s) to obtainment",
                AssignRequests: "set a customer action for the request item(s)",
                OverwriteComments: "overwrite previously entered user action comment"

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
                SelectedStateForEsError: "Selected State is only for Elastic Search",
                NoProductIdSpecified: "No product id has been specified to resolve requests with",

            }
        };

        // query model
        var crossReferenceAdminSearchModel = {
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
        var doCrossReferenceSearch = function (initial) {

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
                    craDetailObj.html(data);
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
                        reloadGrids();
                        return true;
                    } else
                    {
                        $(this).displayError(messages.errorMessages.GeneralError);
                    }
                })
                .error(function () { $(this).displayError(messages.errorMessages.RequestsCouldNotBeAssigned); })
                .complete(function (compData) {

                    kendo.ui.progress(craDetailObj, false);
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
            var list = $(crossReferenceObjects.controls.dropdownlists.CategoriesDropDownList).data("kendoMultiSelect").value();
            return list.join(",");
        };

        // clear search 
        craSearchObj.on("click", crossReferenceObjects.controls.buttons.ClearCrossReferenceAdminBtn, function () {

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
        craSearchObj.on("click", crossReferenceObjects.controls.buttons.SearchCrossReferenceAdminBtn, function () {
            doCrossReferenceSearch();
        });

        // customer notes action
        craSearchObj.on("change", crossReferenceObjects.controls.dropdownlists.CustomerActionDropDownList, function () {

            var txtNotes = $(crossReferenceObjects.controls.textBoxes.NotesTextBox);
            var selNotes = $(crossReferenceObjects.controls.dropdownlists.CustomerActionDropDownList).data("kendoDropDownList");

            $(crossReferenceObjects.controls.labels.NotesLabel).css("display", "inline");
            $(crossReferenceObjects.controls.textBoxes.NotesTextBox).css("display", "inline");

            // already entered text
            var txtCustomerAction = txtNotes.val();
            var emptyCustomerAction = (txtCustomerAction.replace(/ /g, "") == "");

            // "fix" selected customer action
            var selCustomerAction = selNotes.text();
            if (selCustomerAction == "Select One") selCustomerAction = "";
            selCustomerAction = selCustomerAction.split(" ").slice(2).join(" ");
            
            // content already in text
            if (!emptyCustomerAction) {

                var edited = true;
                $(selNotes.dataSource.view()).each(function () {
                    var note = this.Text.split(" ").slice(2).join(" ");
                    if (note == txtCustomerAction) edited = false;
                });

                // if edited, prompt user for change confirmation.
                if (edited) {

                    var message = messages.confirmationMessages.OverwriteComments;
                    var args = { message: message, header: 'Confirm comment overwrite.' };

                    DisplayConfirmationModal(args, function () {
                        $(crossReferenceObjects.controls.textBoxes.NotesTextBox).val(selCustomerAction);
                    }, function () {
                        // do nothing
                    });

                }
                else
                    $(crossReferenceObjects.controls.textBoxes.NotesTextBox).val(selCustomerAction);

            }
            else {
                $(crossReferenceObjects.controls.textBoxes.NotesTextBox).val(selCustomerAction);
            }

        });

        // ---------------------------------------- ADVANCED SEARCH OPTIONS ---------------------------------------- 

        // ADD ADVANCED SEARCH OPTION
        craSearchObj.on("click", crossReferenceObjects.controls.buttons.AddAdvancedSearchOption, function () {

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
        craSearchObj.on("click", crossReferenceObjects.controls.buttons.RemoveAdvancedSearchOption, function (e) {
            $(e.target).closest("[id^=row]").remove();
        })

        craSearchObj.on("change", crossReferenceObjects.controls.dropdownlists.SearchCriteriaOption, function (e) {
            
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
        craSearchObj.on("click", crossReferenceObjects.controls.buttons.SearchSupplierButton, function () {
            // var activeSupplier = "txtSearchSupplierId";
            $("#supplierSearchWindow").data("kendoWindow").center().open();
            $(actionModals.Obtainment).toggleModal();
        });

        // ---------------------------------  ASSIGN - UNASSIGN FUNCTIONS

        craDetailObj.on("change", "input[name=GroupIndividual]:radio", function () {
            radioButtonSelected = $(this).val();
            if ($(this).val() === "Group") {
                $(crossReferenceObjects.controls.dropdownlists.GroupsDropDownList).closest(".k-widget").show();
                $(crossReferenceObjects.controls.textBoxes.IndividualTextBox).closest(".k-widget").hide();
                $(crossReferenceObjects.controls.textBoxes.IndividualTextBox).data("kendoAutoComplete").value("");
            }
            else {
                $(crossReferenceObjects.controls.textBoxes.IndividualTextBox).closest(".k-widget").show();
                $(crossReferenceObjects.controls.dropdownlists.GroupsDropDownList).closest(".k-widget").hide();
            }
        });

        craDetailObj.on("click", crossReferenceObjects.controls.buttons.SaveAssignButton, function (e) {

            e.preventDefault();
            var userName = $(crossReferenceObjects.controls.textBoxes.IndividualTextBox).data("kendoAutoComplete");
            var selectedValue;
            if (radioButtonSelected === "Group") {

                var ddlGroups = $(crossReferenceObjects.controls.dropdownlists.GroupsDropDownList).data("kendoDropDownList");

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

            var grid = $(crossReferenceObjects.controls.grids.GridRequests).data("kendoGrid");
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
                                        
                }, function () {
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
                    $(actionModals.Resolve).displayModal();
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

                var selCustomerAction = $(crossReferenceObjects.controls.textBoxes.NotesTextBox).val();

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

        resolveCrossReference = function () {

            // safety
            if ((selectedIds || []).length > 0) {

                var productId = parseInt($(crossReferenceObjects.controls.textBoxes.ProductIdTextBox).val());

                // product id is valid integer
                if (!(isNaN(productId) || productId < 0)) {

                    var data = {};
                    data['ids'] = selectedIds;
                    data['productId'] = productId;

                    // make a call to resolve requests
                    SaveRequest(controllerCalls.ResolveRequests, data, actionModals.Resolve);

                } else {

                    $(actionModals.Resolve).toggleModal();
                    $(this).displayError(messages.errorMessages.NoProductIdSpecified);

                }

            }

        }

        function reloadGrids() {

            craDetailObj.find(".chkMasterMultiSelect").each((i, v) => {

                // uncheck the master control
                $(v).prop('checked', false);

                // unselect all identifiers in view
                var grid = $(v).parents('.k-grid:first').data().kendoGrid;

                var rowsSelected = false;

                // data source
                $(grid.dataSource.view()).each(function (_i, _v) {

                    // locate row
                    var row = grid.table.find("[data-uid=" + _v.uid + "]");

                    if ($(row).find(".chkMultiSelect").is(":checked")) rowsSelected = true;

                    // locate checkbox
                    $(row).find(".chkMultiSelect").prop("checked", false);

                    // set row state
                    $(row).removeClass("k-state-selected");

                });

                // reset identifiers
                selectedIds = [];
                gridIds = [];

                if (rowsSelected) grid.dataSource.read();

            });
        }

        function SaveRequest(strUrl, dataArray, modalId, callback) {

            if (selectedIds.length > 0) {

                kendo.ui.progress(craDetailObj, true);
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
                        kendo.ui.progress(craDetailObj, false);
                        reloadGrids();
                        
                    });

            }

            kendo.ui.progress(craDetailObj, false);
        }

        var loadRequests = function () {

            // bind grid
            var grid = $(crossReferenceObjects.controls.grids.GridRequests).data("kendoGrid");
            grid.dataSource.read();

            selectedIds = {};
            gridIds = {}; 

            // disable all options
            disableSideMenuItems();

            // show the slide out tab
            $(crossReferenceObjects.controls.sideMenus.SideBarWorkLoad).sidemenu().show();

            // default to group
            $(crossReferenceObjects.controls.textBoxes.IndividualTextBox).closest(".k-widget").hide();

            // assign event handlers for assign/un-assign
            craDetailObj.on("click", crossReferenceObjects.controls.buttons.UnAssignFromButton, function (e) {
                batchUnassignWorkItems();
            });

            craDetailObj.on("click", crossReferenceObjects.controls.buttons.AssignToButton, function (e) {
                batchAssignWorkItems();
            });

            // bulk operation confirmations

            craDetailObj.on("click", crossReferenceObjects.controls.buttons.SendToObtainmentBtn, function (e) {
                confirmSendToObtainment();
            });

            craDetailObj.on("click", crossReferenceObjects.controls.buttons.MatchToDocumentBtn, function (e) {
                confirmMatchToDocument();
            });

            craDetailObj.on("click", crossReferenceObjects.controls.buttons.MakeCustomerActionBtn, function (e) {
                confirmCustomerAction();
            });

            // bulk operation updates
            craDetailObj.on("click", crossReferenceObjects.controls.buttons.ResolveActionButton, function (e) {
                resolveCrossReference();
            });

            craDetailObj.on("click", crossReferenceObjects.controls.buttons.SaveCustomerActionButton, function (e) {
                saveCustomerAction();
            });

        };

        function obtainmentSelSupplier(supplierSearchDialog) {

            var grid = $(crossReferenceObjects.controls.grids.SearchSupplierNewGrid).data("kendoGrid");
            if (grid.dataSource.total() === 0) {
                $(this).displayError(messages.errorMessages.NoRowSelected);
                return;
            }
            var data = grid.dataItem(grid.select());
            if (data == null) {
                $(this).displayError(messages.errorMessages.NoRowSelected);
                return;
            }

            $(crossReferenceObjects.controls.textBoxes.ProductIdTextBox).val(data.id + "," + data.Name);

            supplierSearchDialog.data("kendoWindow").close();
            $(actionModals.Obtainment).displayModal();

        }

        var loadSupplierPlugIn = function () {

            $.post(controllerCalls.SupplierSearch, { supplierId: 0 }, function (data) {
                $("#dgSupplierPlugIn").html(data);
            });

            var supplierSearchDialog = $("#supplierSearchWindow");

            $(crossReferenceObjects.controls.buttons.CancelSupplierSearch).click(function () {
                supplierSearchDialog.data("kendoWindow").close();
                //DisableSideMenuItems();
                //EnableSideMenuItem(xreferenceObject.controls.buttons.ObtainmentSideMenuButton);
                $(actionModals.Obtainment).displayModal();
            });

            $('#dgSupplierPlugIn').on('dblclick', 'table tr', function () {
                obtainmentSelSupplier(supplierSearchDialog);
            });

            // supplier search plugin
            $("#searchSupplierIdSelect").click(function () {
                obtainmentSelSupplier(supplierSearchDialog);
            });

        }

        $(craDetailObj).on("click", ".chkMultiSelect", function () { // TESTED

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

        $(craDetailObj).on("click", ".chkMasterMultiSelect", function () {

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