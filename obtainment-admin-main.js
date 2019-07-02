; (function ($) {

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
                    ClearObtainmentAdminBtn: "#clearObtainmentAdminBtn",            // clear advanced search options
                    SearchObtainmentAdminBtn: "#searchObtainmentAdminBtn",          // search as per advanced options

                    SendToObtainmentBtn: "#btnSendToObtainment",                    // bulk action
                    SendFirstEmail: "#btnSendFirstEmail",                           // bulk action
                    SendSecondEmail: "#btnSendSecondEmail",                         // bulk action
                    LogPhoneCall: "#btnLogPhone",                                   // bulk action
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
                    CancelPhoneCall: "#btnCancelPhoneCall",
                    SavePhoneCall: "#btnSavePhoneCall",
                    CancelSuperEmail: "#btnCancelSuperEmail",
                    SendSuperEmail: "#btnSendSuperEmail",
                },

                grids: {
                    GridRequests: "#gdSearchObtainment",
                    SearchSupplierNewGrid: "#gdSearchSupplierNew",
                    SupplierContactsGrid: "#gdSupplierContacts",
                    SupplierContactEmailGrid: "#gdContactEmail",
                    SupplierContactPhoneGrid: "",
                    ContactPhoneObtainment: "#gdContactPhoneObtainment",
                    ContactPhone: "#gdContactPhone"
                },

                dateTime: {
                    NextStepDueDatePhoneCall: "#dteNextStepDueDatePhoneCall",
                    SuperEmailNextStepDueDate: "#dteSuperEmailNextStepDueDate",

                },

                dropdownlists: {
                    GroupsDropDownList: "#ddlGroups",
                    CustomerActionDropDownList: "#selCustomerAction",
                    SupplierContactsList: "#ddlSupplierContactList",
                    NextStepsPhoneCall: "#ddlNextStepsPhoneCall",
                    InternalNotes: "#ddlInternalNotes",
                    SuperEmailNextStep: "#ddlSuperEmailNextStep",
                    EmailTargets: "#ddlEmailTarget"

                },

                textBoxes: {
                    IndividualTextBox: "#txtIndividual",
                    NotesTextBox: "#txtNotes",
                    ProductIdTextBox: "#txtProductId",
                    SearchSupplierIdTextBox: "#txtSearchSupplierId",
                    SupplierContactName: "#SupplierContactName",
                    SupplierContactId: "#SupplierContactId",
                    SupplierContactPhone: "#SupplierContactPhone",
                    SupplierContactPhoneId: "#SupplierContactPhoneId",
                    ObtainmentActionNotesPhoneCall: "#txtObtainmentActionNotesPhoneCall",
                    ObtainmentInternalNotes: "#txtInternalNotes",
                    SupplierName: "#SupplierName",
                    NotificationRecepient: "#txtNotificationRecepient",
                    SuperEmailSubject: "#txtSuperEmailSubject",
                    SuperEmailBody: "#txtSuperEmailBody",
                    SuperEmailId: "#txtSuperEmailId",


                },

                checkboxes: {
                    LiveCall: "#chkLiveCall",
                    InsertProductsList: "#chkInsertProductsList",
                    InsertSuppliersLink: "#chkInsertSuppliersLink",
                    IsPreview: "#chkIsPreview"
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
            LogPhoneCall: "#mdlLogPhoneCall",
            SendEmail: "#mdlSendSuperEmail",
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
            SupplierDetail: GetEnvironmentLocation() + "/Administration/Obtainment/GetSupplierDetail",
            SaveObtainmentWorkItemAction: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentWorkItemAction",
            AreObtainmentsForSDSDocuments: GetEnvironmentLocation() + "/Administration/Obtainment/AreObtainmentsForSDSDocuments",
            ValidateObtainmentsForEmail: GetEnvironmentLocation() + "/Administration/Obtainment/ValidateObtainmentsForEmail",
            ValidateObtainmentsForDocumentId: GetEnvironmentLocation() + "/Administration/Obtainment/ValidateObtainmentsForDocumentId",
            SendSuperEmail: GetEnvironmentLocation() + "/Administration/Obtainment/SendSuperEmail",

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
                SelectedStateForEsError: "Selected State is only for Elastic Search",
                NoSupplierContactSelected: "No supplier contact has been selected",
                NoSupplierContactPhone: "A phone for the supplier contact phone has not been selected",
                NoSupplierContactEmail: "An email for the supplier contact phone has not been selected",
                SelectGroup: "Please select a group to assign request item(s)",
                UserRequiredToAssign: "User required to assign selected request item(s)",
                SelectFilter: "A filter must be selected to execute a search",
                NoItemsSelected: "No items have been selected",
                NoRowSelected: "No row selected",
                NoStepSelected: "Invalid Next Step",
                NoActionSelected: "No action has been selected",
                RequestsCouldNotBeSaved: "Requests could not be saved",
                RequestsCouldNotBeAssigned: "Requests could not be assigned",
                NoContactSelcted: "No contact has been selected from Contact Information",
                NoPhoneSelected: "No contact phone has been selected",
                GeneralError: "Error Occurred",
                EmailPartsMissing: "Email must have subject, body and the ||ProductsList|| placement token.",
                EmailAddressMissing: "Email address needs to be selected",
                CannotGenerateNoticeNumber: "Cannot generate notice number",
                ResponseReceived: "A notice number is associated with one or several request(s) that are being processed",
                UnderCoonstruction: "This option is still under construction.",
                CannotRetrieveSentEmail: "Unable to retrieve sent email.",
                NoCustomerActionNotesProvided: "Customer action notes required.",
                NoConfirmNotAvailableActionNotesProvided: "Confirm not available action notes required.",
                NoNoticeNumberInSuperEmailSubject: "A ||NoticeNumber|| token is mandatory in the super email subject.",
                SuperEmailTargetNotSelected: "The targeted Obtainment type must be specified for a Email.",
                NoNonSDSSubstitutionToken: "A ||SupplierPortal(link text)|| token is mandatory in the email body.",
                NoSDSSubstitutionToken: "A ||ProductsList|| token is mandatory in the SDS email body.",
                EmailBodyMissing: "Email body is missing.",
                NextStepMissing: "Obtainment next step has not been selected.",
                OneOrMoreSelectionsNotRevisions: "One or more of the selected item(s) are not valid. The 'Save as Current' action can only be perfromed on Revisions.",
                InvalidSubstitutionTokens: "Invalid or incorrect substitution tokens. ",
                NotificationRecepientMissing: "Super email notification recipient missing.",
                NoObtainmentWorkItemSelected: "No obtainment work item has been selected selected.",
                HasEmbeddedKeywords: "Email body has illegal keyword(s)."
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
                var checked = (gridIds[v.ObtainmentWorkItemId] == true);

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

                if (selected) _selectedIds.push(v.ObtainmentWorkItemId);

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

        function PopulateEmailActionModal(data, resend) {

            if (data != null) {

                // reset all upload state
                fUploadlib.initialize(data.files);

                // set up notice number
                $('#txtNoticeNum').val("Notice Number: " + data.noticeNumber);

                // set up subject
                $("#txtObtainmentEmailSendEmailSubject").val(data.subject);

                $("#txtObtainmentEmailSendEmailTo").val(data.emailTo);
                $("#txtObtainmentEmailSendEmailTo").attr({readonly:"readonly"});

                debugger;

                // set the check boxes
                $(obtainmentObjects.controls.checkboxes.InsertProductsList).removeAttr("checked");
                $(obtainmentObjects.controls.checkboxes.InsertSuppliersLink).removeAttr("checked");
                $("[for='" + obtainmentObjects.controls.checkboxes.InsertSuppliersLink.replace("#", "") + "']").css({ "opacity": "1" });

                $(obtainmentObjects.controls.checkboxes.InsertSuppliersLink).removeAttr("disabled");

                if (data.sdsObtainments) {
                    $(obtainmentObjects.controls.checkboxes.InsertProductsList).prop("checked", true);

                    $(obtainmentObjects.controls.checkboxes.InsertSuppliersLink).prop("disabled", true);
                    $("[for='" + obtainmentObjects.controls.checkboxes.InsertSuppliersLink.replace("#", "") + "']").css({ "opacity": ".5" });
                }

                if (!data.sdsObtainments) {
                    $(obtainmentObjects.controls.checkboxes.InsertSuppliersLink).prop("checked", true);
                }

                // reset the email body and re-initialize the kendo editor
                var editor = $("#txtObtainmentEmailSendEmailBody").data("kendoEditor");
                editor.value(data.body);

                try {

                    // destroy and create the kendo upload control each time.
                    // the control may not have been created yet.
                    $("#files").data("kendoUpload").destroy();

                    // force clean up the mark up added by kendo 
                    $(".upload-section").html('<input autocomplete="off" multiple="multiple" data-role="upload" id="files" name="files" type="file">');


                } catch (e) {

                }

                // set selections - note the grid is not updated                    
                preSelectedRequests = data.ids;
                if (!resend) preSelectedRequests = null;

                $("#files").kendoUpload({
                    "success": fUploadlib.onFileUploadSuccess,
                    "select": fUploadlib.onFileUploadSelect,
                    "error": fUploadlib.onFileUploadError,
                    "upload": fUploadlib.onFileUploadUpload,
                    "remove": fUploadlib.onFileUploadRemove,
                    "localization": { "select": "Attach file" },
                    "async": {
                        "saveUrl": controllerCalls.SaveEmailAttachment,
                        "autoUpload": true,
                        "removeUrl": controllerCalls.RemoveEmailAttachment
                    },
                    "files": data.files
                });

                // re-set 
                //$("#txtObtainmentEmailNethubLinks").val("No NETHUB links to add.");
                $("#txtObtainmentEmailNethubLinks").val("");

                if (data.links != null && data.links.length > 0) {

                    var text = "Nethub links for the following products will replace the ||ProductsList|| token : ";
                    if (data.sdsObtainments) text = "The following list of products will replace the ||ProductsList|| token :"

                    for (var i = 0; i < data.links.length; i++) {
                        text += data.links[i];
                        if (i < data.links.length - 1) text += ", ";
                    }

                    if (!data.sdsObtainments) text += ". Use the ||SupplierPortal(link text)|| token to provide a link to the supplier portal.";

                    $("#txtObtainmentEmailNethubLinks").val(text);

                }

                // change caption as needed
                $("#mdlSendEmail").find("#myModalLabel").html(resend ? "Resend Email" : "Send Email");

            }
        }

        $(obtainmentObjects.controls.buttons.SendSuperEmail).click(function () {

                // -- email target
                var emailTarget = $(obtainmentObjects.controls.dropdownlists.EmailTargets).val();
                var hasTarget = !(emailTarget == '' || emailTarget == 'Select One')

                // recepient selected ?
                var recepient = $(obtainmentObjects.controls.dropdownlists.SuperEmailRecepient).val();
                var hasRecepient = !(recepient == '' || recepient == 'Select One')

                // next step selected ?
                var nextStep = $(obtainmentObjects.controls.dropdownlists.SuperEmailNextStep).val();
                var hasNextStep = !(nextStep == '' || nextStep == 'Select One')

                // notice number selected ?
                var subject = $(obtainmentObjects.controls.textBoxes.SuperEmailSubject).val() + "";
                var hasNoticeNumber = (subject.toUpperCase().indexOf("||NOTICENUMBER||") >= 0);

                // email body
                var body = $(obtainmentObjects.controls.textBoxes.SuperEmailBody).data("kendoEditor").value() + "";
                var hasBody = (body.trimRight() != "");

                // email preview mode ?
                var isPreview = $(obtainmentObjects.controls.checkboxes.PreviewEmail).is(":checked");

                // notification
                var notificationRecepient = ($(obtainmentObjects.controls.textBoxes.NotificationRecepient).val() + "");
                var hasNotificationRecepient = (notificationRecepient.trimRight() != "");

                // do not allow Supplier Links if SDS Obtainment

                var sdsObtainment = (emailTarget != "1");

                // supplier portal mandatory for Non SDS super email
                var linksOrProductsToken = true;
                if (!sdsObtainment) {
                    var regex = /\|\|SUPPLIERPORTAL\([a-zA-Z\s0-9]+?\)\|\|/;
                    linksOrProductsToken = regex.test(body);
                }

                // embedded URL test
                var hasKeywords = (body.toUpperCase().indexOf("NETHUB") >= 0);

                // validation
                if (!hasTarget || !hasRecepient || !hasNoticeNumber || !hasBody || !hasNextStep || !hasNotificationRecepient || hasKeywords) {

                    //$(actionModals.SuperMail).hide();
                    $("#errorReport").on('hidden', function () {
                        $(actionModals.SuperMail).show();
                        $(this).off('hidden.bs.modal'); // Remove the 'on' event binding
                    })

                    var message = "Please correct the following issue(s): <br><br>";

                    if (!hasTarget) message += messages.errorMessages.SuperEmailTargetNotSelected + "<br>";
                    if (!hasRecepient) message += messages.errorMessages.EmailAddressMissing + "<br>";
                    if (!hasNoticeNumber) message += messages.errorMessages.NoNoticeNumberInSuperEmailSubject + "<br>";
                    if (!hasBody) message += messages.errorMessages.EmailBodyMissing + "<br>";
                    if (!hasNextStep) message += messages.errorMessages.NextStepMissing + "<br>";
                    if (!hasNotificationRecepient) message += messages.errorMessages.NotificationRecepientMissing + "<br>";
                    if (hasKeywords) messages.errorMessages.HasEmbeddedKeywords + "<br>";

                    SubError(message);

                }
                else {

                    // deliver with ids
                    DeliverSuperMain(emailTarget, getSupplierAndContactId().supplierId, Object.keys(getGridIds()));

                }
        });

        function DeliverSuperMain(emailTarget, supplierId, ids) {

            var model = {}

            // super email model
            model.Recepients = $(obtainmentObjects.controls.textBoxes.SuperEmailId).val();
            model.Subject = $(obtainmentObjects.controls.textBoxes.SuperEmailSubject).val();
            model.MessageBody = $(obtainmentObjects.controls.textBoxes.SuperEmailBody).data("kendoEditor").value() + "";
            model.SupplierId = supplierId;
            model.NextStepId = $(obtainmentObjects.controls.dropdownlists.SuperEmailNextStep).val();
            model.DueDate = ($(obtainmentObjects.controls.dateTime.SuperEmailNextStepDueDate).data("kendoDatePicker").value() + "").substring(0, 10);
            model.AddProductsList = $(obtainmentObjects.controls.checkboxes.InsertProductsList.replace("#", ".")).is(":checked");
            model.AddSupplierPortalLink = $(obtainmentObjects.controls.checkboxes.InsertSuppliersLink.replace("#", ".")).is(":checked");
            model.NotificationRecepient = $(obtainmentObjects.controls.textBoxes.NotificationRecepient).val();
            model.PreviewEmail = $(obtainmentObjects.controls.checkboxes.PreviewEmail).is(":checked");
            model.EmailTarget = emailTarget;

            $(this).ajaxCall(controllerCalls.SendSuperEmail, { model : model, ids : ids })
                .success(function (data) {

                })
                .complete(function () {
                    if (model.PreviewEmail) {

                        $(actionModals.SuperMail).toggleModal();
                        ShowMessage("The super email request has been queued for processing.<br>" +
                            "A preview summary will be emailed to " + model.NotificationRecepient + " upon completion.");
                    } else {

                        $(actionModals.SuperMail).toggleModal();
                        ShowMessage("The email request has been queued for processing.<br>" +
                            "A summary will be emailed to " + model.NotificationRecepient + " upon completion.<br>");

                        // reset fields
                        $(obtainmentObjects.controls.checkboxes.PreviewEmail).prop("checked", true);

                    }

                });

        }


        // SUPER EMAIL BUTTON CLICK HANDLER
        obtSearchObj.on("click", obtainmentObjects.controls.buttons.SendSuperEmail, function () {

            // ---- reset event handlers 
            $(obtainmentObjects.controls.buttons.CancelSuperEmailButton).off("click");
            $(obtainmentObjects.controls.buttons.SendSuperEmailButton).off("click");
            $(obtainmentObjects.controls.dropdownlists.EmailTargets).data("kendoDropDownList").unbind("change");

            // ---- wire modal close
            $(obtainmentObjects.controls.buttons.btnCancelSuperEmailButton).click(function () {
                $(actionModals.SuperMail).toggleModal();
            });

            // ---- wire email target
            $(obtainmentObjects.controls.dropdownlists.EmailTargets).data("kendoDropDownList").bind("change", function () {

                // determine which target was selected 1 = non-sds, 2 = sds
                var emailTarget = $(obtainmentObject.controls.dropdownlists.EmailTargets).val();

                // reset product options
                $(obtainmentObjects.controls.checkBox.InsertProductsList.replace("#", ".")).prop("checked", false);
                $(obtainmentObjects.controls.checkBox.InsertProductsList.replace("#", ".")).prop("disabled", true);
                $("[for='" + obtainmentObjects.controls.checkBox.InsertProductsList.replace("#", "") + "']").css({ "opacity": ".5" });

                // reset supplier options
                $(obtainmentObjects.controls.checkBox.InsertSuppliersLink.replace("#", ".")).prop("checked", false);
                $(obtainmentObjects.controls.checkBox.InsertSuppliersLink.replace("#", ".")).prop("disabled", true);
                $("[for='" + obtainmentObjects.controls.checkBox.InsertSuppliersLink.replace("#", "") + "']").css({ "opacity": ".5" });

                // SDS
                if (emailTarget == "2") {

                    // enable product list option
                    $(obtainmentObjects.controls.checkBox.InsertProductsList.replace("#", ".")).prop("disabled", false);
                    $(obtainmentObjects.controls.checkBox.InsertProductsList.replace("#", ".")).prop("checked", true);

                    $("[for='" + obtainmentObjects.controls.checkBox.InsertProductsList.replace("#", "") + "']").css({ "opacity": "1" });

                }
                // Non-SDS
                else if (emailTarget == "1") {

                    // default
                    $(obtainmentObjects.controls.checkBox.InsertProductsList.replace("#", ".")).prop("checked", true);
                    $(obtainmentObjects.controls.checkBox.InsertSuppliersLink.replace("#", ".")).prop("checked", true);

                    $(obtainmentObjects.controls.checkBox.InsertProductsList.replace("#", ".")).prop("disabled", false);
                    $(obtainmentObjects.controls.checkBox.InsertSuppliersLink.replace("#", ".")).prop("disabled", false);

                    $("[for='" + obtainmentObjects.controls.checkBox.InsertProductsList.replace("#", "") + "']").css({ "opacity": "1" });
                    $("[for='" + obtainmentObjects.controls.checkBox.InsertSuppliersLink.replace("#", "") + "']").css({ "opacity": "1" });

                }

            });

            // ---- wire super email send
            

        });

        function confirmSendEmail(first) {

            try {

                // verify that a contact has been selected.
                debugger;
                // at least one contact must be selected.
                var grid = $(obtainmentObjects.controls.grids.SupplierContactEmailGrid).data("kendoGrid");
                var selection = grid.select();
                var data = grid.dataItem(grid.select());

                var emailTo = data.Email;

                console.log(data);

                var selectedItems = Object.keys(getGridIds());

                if (selectedItems == null || selectedItems.length == 0) {
                    $(this).displayError(messages.errorMessages.NoItemsSelected);
                    return;
                }

                if (selectedItems != null) {

                    // url to invoke for notice number 
                    var strUrl = controllerCalls.AreObtainmentsForSDSDocuments;
                    var cdata = new Object();
                    cdata.ids = selectedItems;
                    cdata.firstEmail = first;

                    $.ajax({

                        url: strUrl,
                        data: JSON.stringify(cdata),
                        type: "POST",
                        contentType: 'application/json; charset=utf-8',
                        error: function () {
                            $(this).displayError(messages.errorMessages.CannotGenerateNoticeNumber);
                        },
                        success: function (data) {

                            console.log(data);

                            // set up email controls

                            $("#superEmailSupplier").html($(obtainmentObjects.controls.textBoxes.SupplierName).val());  // maufacturer name
                            $(obtainmentObjects.controls.textBoxes.SuperEmailId).val(emailTo);                          // who the email is going out to
                            $(obtainmentObjects.controls.textBoxes.SuperEmailSubject).val("");                          // clean up subject



                            //// valid selections ?
                            //if (!data.success) {
                            //    $(this).displayError(data.message);
                            //    return;
                            //}

                            //if (data != '') {

                            //    // defaults
                            //    data.subject = "";
                            //    data.body = "";
                            //    data.emailTo = emailTo;
                            //    data.files = [];

                            //    // set the next step
                            //    //SetNextStepForSendEmail(nextStepsValues.FirstAutomatedEmail, "SendEmail", selectedItems);

                            //    // set up the form
                            PopulateEmailActionModal(data, false);

                                // display upload interface
                            $(actionModals.SendEmail).displayModal();



                            //}
                        },
                        done: function () {
                            $(this).savedSuccessFully(messages.successMessages.Saved);
                        }
                    });

                }

            } catch (e) {

                // contact must be selected
                $(this).displayError(messages.errorMessages.NoContactSelcted);

            }
        }

        function saveSendEmailAction() {

        }

        function savePhoneCall() {

            // get values
            var liveCall = $(obtainmentObjects.controls.checkboxes.LiveCall).is(":checked");
            var internalNotes = $(obtainmentObjects.controls.dropdownlists.InternalNotes).val();
            var notes = $(obtainmentObjects.controls.textBoxes.ObtainmentActionNotesPhoneCall).val();
            var nextStep = $(obtainmentObjects.controls.dropdownlists.NextStepsPhoneCall).data("kendoDropDownList").value();
            var nextStepDueDate = $(obtainmentObjects.controls.dateTime.NextStepDueDatePhoneCall).data("kendoDatePicker").value();

            // see if phone selected
            var grid = $(obtainmentObjects.controls.grids.ContactPhone).data("kendoGrid");
            var data = grid.dataItem(grid.select());

            var contactPhoneId = data.CompanyContactPhoneId;

            // validate selections

            // make call to save phone call details

            var model = {}

            model.ObtainmentWorkItemIDs = Object.keys(getGridIds());    // selected ids
            model.ObtainmentActionLkpID = 1;                            // phone call
            model.NextObtainmentStepLkpID = nextStep;                   // next step
            model.Notes = notes;                                        // notes
            model.NextObtainmentStepDueDate = nextStepDueDate;          // next step due date

            var phoneCallModel = {};

            phoneCallModel.LiveCall = $(obtainmentObjects.controls.checkboxes.LiveCall).is(":checked");
            phoneCallModel.CompanyContactId = getSupplierAndContactId().supplierContactId;
            phoneCallModel.CompanyContactPhoneId = contactPhoneId;
            phoneCallModel.InternalNotesLkpId = $(obtainmentObjects.controls.dropdownlists.InternalNotes).val() != "" ? $(obtainmentObjects.controls.dropdownlists.InternalNotes).val() : null;

            model.ObtianActionLogPhoneCallModel = phoneCallModel;

            $(this).ajaxJSONCall(controllerCalls.SaveObtainmentWorkItemAction, JSON.stringify(model))
                .success(function (successData) {
                    if (successData.success == true) {

                        //kendo.ui.progress(obtainmentDetailWorkFlowObj, false);
                        $(actionModals.LogPhoneCall).hideModal();
                        $(this).savedSuccessFully(messages.successMessages.Saved);

                    } else
                        $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);
                }).error(function () {
                    $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);
                });

        }

        function confirmLogPhoneCall() {

            var _gridIds = getGridIds();

            // no items selected ?
            if (Object.keys(_gridIds).length == 0) {
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {

                // is any contact selected ?
                // is a phone number active ?

                var selection = getSupplierAndContactId();
                if (selection.supplierContactId == 0) {
                    $(this).displayError(messages.errorMessages.NoSupplierContactSelected);
                    return;
                }

                // locate the contact name from the contacts grid
                var grid = $(obtainmentObjects.controls.grids.SupplierContactsGrid).data("kendoGrid");
                var data = grid.dataItem(grid.select());

                console.log(data);

                $(obtainmentObjects.controls.textBoxes.SupplierContactName).val(data.SupplierContactName);
                $(obtainmentObjects.controls.textBoxes.SupplierContactId).val(data.SupplierContactId);

                // see if phone selected
                grid = $(obtainmentObjects.controls.grids.ContactPhone).data("kendoGrid");
                data = grid.dataItem(grid.select());

                if (data != null) {

                    // clean up
                    if (isNaN(data.InternationalDialingCode)) data.InternationalDialingCode = 0;
                    if (isNaN(data.CityOrAreaCode)) data.CityOrAreaCode = 0;
                    if (isNaN(data.InternationalDialingCode)) data.InternationalDialingCode = 0;

                    /*CityOrAreaCode: 203
                    CompanyContactId: 115860
                    CompanyContactPhoneId: 164489
                    CountryLkpId: null
                    Extension: 0
                    InternationalDialingCode: 0
                    LocalNumber: 9124344
                    SelectPhoneTypeId: null
                    dirty: false*/

                    var phone = "";
                    if (data.InternationalDialingCode != 0) phone += "(" + data.InternationalDialingCode + ")";
                    if (data.CityOrAreaCode != 0) phone += "" + data.CityOrAreaCode + "-";
                    phone += data.LocalNumber;
                    
                    $(obtainmentObjects.controls.textBoxes.SupplierContactPhone).val(phone);
                    $(obtainmentObjects.controls.textBoxes.SupplierContactPhoneId).val(data.CompanyContactPhoneId);
                }
                else {
                    $(this).displayError(messages.errorMessages.NoSupplierContactPhone);
                    return;
                }

                $(actionModals.LogPhoneCall).displayModal();

            }

            return false;

        }

        confirmCustomerAction = function () {

            var _gridIds = getGridIds();
            $(obtainmentObjects.controls.textBoxes.NotesTextBox).val("");

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

        confirmLogPhoneCallAction = function () {

            var _gridIds = getGridIds();
            

            // no items selected ?
            if (Object.keys(_gridIds).length == 0) {
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {

                // display confirmation dialog
                var message = 'Are you sure you would like to ' + messages.confirmationMessages.AssignRequests + '?';
                var args = { message: message, header: 'Confirm Requests Selected' };
                DisplayConfirmationModal(args, function () {
                    $(actionModals.LogPhoneCall).displayModal();
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
                confirmSendEmail(true);
            });

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.SendSecondEmail, function (e) {
                confirmSendEmail(false);
            });

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.LogPhoneCall, function (e) {
                confirmLogPhoneCall();
            });

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.MatchToDocumentBtn, function (e) {
                confirmMatchToDocument();
            });

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.MakeCustomerActionBtn, function (e) {
                alert("");
                confirmCustomerAction();
            });

            // bulk operation updates

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.SaveObtainmentButton, function (e) {
                saveSendToObtainment();
            });

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.SaveCustomerActionButton, function (e) {
                saveCustomerAction();
            });

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.CancelPhoneCall, function (e) {
                $(actionModals.LogPhoneCall).hideModal();
            });

            obtDetailObj.on("click", obtainmentObjects.controls.buttons.SavePhoneCall, function (e) {
                savePhoneCall();
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
            gridIds[grid.dataItem(row).ObtainmentWorkItemId] = checked;

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
                    gridIds[grid.dataItem(row).ObtainmentWorkItemId] = checked;
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

        function onDataBound(sender) {

            ////$("#SupplierInformationPanel").hide();
            ////$("#SupplierInformationPanel").html("");

            ////$('#DetailSupplier').html("");

            //var grid = sender.sender;
            //var supplierIds = Array.from(grid.dataSource.data()).filter(e => e.SupplierID != null).map(e => e.SupplierID);
            //var distinctIds = new Set(supplierIds);
            
            //if (distinctIds.size == 1) {

            //    var supplierId = supplierIds[0];

            //    $("#SupplierId").val(supplierId);

            //    $.post(controllerCalls.SupplierDetail, {
            //        supplierId: supplierId
            //    }, function (data) {
            //        //$("#SupplierInformationPanel").show();
            //        var panelBar = $("#SupplierInformationPanel").data("kendoPanelBar");
            //        // reload the panel bar
            //        panelBar.reload("> .k-item");
            //    });

            //}
            
        }

        function onDetailDataBound(sender) {

            // highlight rows selected
            var grid = sender.sender;
            var pageData = grid.dataSource.view();

            pageData.forEach((v, i) => {

                // see if the ObtainmentWorkItemId for the row is in the selected list.
                // if yes, highlight the row.

                var row = grid.table.find("[data-uid=" + v.uid + "]");
                $(row).removeClass("k-state-selected");

                var checked = gridIds[grid.dataItem(row).ObtainmentWorkItemId];
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

        var gdSupplierContacts_Change = function (e) {
            e.preventDefault();
            var data = this.dataItem(this.select());

            // required by phone and email
            $("#ReadOnlySupplierId").val(data.SupplierId);
            $("#ReadOnlySupplierContactId").val(data.SupplierContactId);

            //var url = '@Url.Action("GetSupplierContactDetail", "Company")';
            var url = GetEnvironmentLocation() +  "/Administration/Obtainment/GetSupplierContactDetail";
            $.post(url, { supplierId: data.SupplierId, supplierContactId: data.SupplierContactId }, function (result) {
                $("#CompanyContactDetailResult").html($(result));
            });
        };

        var getSupplierId = function () {
            var supplierId = parseInt($("#ReadOnlySupplierId").val());
            return isNaN(supplierId) ? 0 : supplierId;
        }

        var getSupplierContactId = function () {
            var supplierContactId = parseInt($("#ReadOnlySupplierContactId").val());
            return { supplierContactId: isNaN(supplierContactId) ? 0 : supplierContactId };
        }

        var getSupplierAndContactId = function () {
            var supplierId = parseInt($("#ReadOnlySupplierId").val());
            var supplierContactId = parseInt($("#ReadOnlySupplierContactId").val());

            //alert("here");

            return {
                supplierContactId: isNaN(supplierContactId) ? 0 : supplierContactId,
                supplierId: isNaN(supplierId) ? 0 : supplierId
            };
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
            loadSupplierPlugIn: loadSupplierPlugIn,
            gdSupplierContacts_Change: gdSupplierContacts_Change,
            getSupplierId: getSupplierId,
            getSupplierAndContactId: getSupplierAndContactId

        };
    };
})(jQuery);