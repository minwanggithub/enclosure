; (function ($) {

    if ($.fn.complibIndexationWorkflow == null) {
        $.fn.complibIndexationWorkflow = {};

    }
    $.fn.complibIndexationWorkflow = function () {

        var currentUser = "LOGGEDINUSER";

        // initialize 
        var workflowSearchObj = $("#IndexationWFPanel");                        // panel container
        var workflowAdvancedSearchObj = $("#IndexationAdvancedSearchOptions");  // advanced search options
        var workflowDetailObj = $("#IndexationWFGrid");                         // grid container 

        var selectedIds = {};                                                   // ids of selected rows
        var gridIds = {};                                                       // traversed ids with selection state

        var workflowDetailWorkFlowObj = $("#ObtianmentWFDetails");
        var workflowDetailModals = $("#ObtainmentDetailModals");

        var itemsChecked = 0;
        var selectedRequests = new Array();         // ids selected in the grid
        var preSelectedRequests = new Array();      // ids in previously sent email
        var selectedRows = new Array();

        var obtainmentObject = {
            controls: {

                buttons: {
                    ClearRequestSearchButton: "#clearIndexingWorkflowBtn",      // resets search
                    SearchRequestsButton: "#searchIndexingWorkflowBtn",         // do the search
                    SaveSearchSettings: "#saveSearchSettingsBtn",               // save settings (not implemented)
                    AddAdvancedSearchOption: "#btnAddCriteria",                 // save settings (not implemented)
                    RemoveAdvancedSearchOption: "#btnDeleteCriteria",           // remove settings (not implemented)
                    AssignToButton: "#btnAssignTo",
                    AssignMeButton: "#btnAssignMe",
                    UnAssignButton: "#btnUnAssignFrom",
                    SaveAssignButton: "#btnSaveAssign",
                    StartWorkflow: "#btnStartIndexing"
                },

                grids: {
                    GridRequests: "#gdRequests"
                },

                dateTime: {
                    FromDate: "#dteDateFrom",
                    ToDate: "#dteDateTo"
                },

                dropdownlists: {
                    StateDropDownList: "#ddlState",
                    IndexingLevelDropDownList: "#ddlIndexingLevel",
                    CategoriesDropDownList: "#mltCategories",
                    SearchCriteriaOption: "drpFields_",
                    SearchCriteriaLanguage: "drpLanguage_",
                    GroupsDropDownList: "#ddlGroups",

                },

                textBoxes: {

                    IndividualTextBox: "#txtIndividual",
                    NotesTextBox: "#txtNotes",
                    PendingNotesTextBox: "#txtPendingNotes",
                    FreeFieldTextBox: "#txtFreeField",
                    ProductIdTextBox: "#txtProductId",
                    NumberOfItemsTextBox: "#numberOfItems",
                    SearchSupplierIdTextBox: "#txtSearchSupplierId",
                    RemoveWorkLoadTextBox: "#txtRemoveWorkLoadNotes",
                    OnHoldWorkLoadTextBox: "#txtOnHoldWorkLoadNotes",
                    RemoveOnHoldWorkLoadTextBox: "#txtRemoveOnHoldWorkLoadNotes"

                },

                checkboxes : {
                    CurrentRevisionOnly: "#chkCurrentRevisionOnly"
                },
                sideMenus: { SideBarWorkLoad: "#eeeSideBarWorkLoad" }


            }

        }

        var actionModals = {
            Resolve: "#mdlResolve",
            Obtainment: "#mdlObtainment",
            Pending: "#mdlPending",
            CustomerAction: "#mdlCustomerAction",
            RemoveWorkLoad: "#mdlRemove",
            Assign: "#mdlAssign",
            ViewHistory: "#mdlViewHistory",
            OnHold: "#mdlOnHold",
            RemoveOnHold: "#mdlRemoveOnHold"
        };

        var kendoWindows = { ViewHistory: "#supplierSearchWindow", ViewAccount: "#accountSearchWindow" };
        var controllerCalls = {

            SearchIndexationWorkflowContent: GetEnvironmentLocation() + "/Operations/IndexationWorkFlow/SearchIndexationWorkflowContent",
            SearchRequestsCriteria: GetEnvironmentLocation() + "/Operations/IndexationWorkFlow/GetSearchCriteria",
            SearchRequests: GetEnvironmentLocation() + "/Operations/IndexationWorkFlow/SearchRequests",
            AllocateSelectedItems: GetEnvironmentLocation() + "/Operations/IndexationWorkFlow/AllocateSelectedItems",
            StartIndexingWorkflow: GetEnvironmentLocation() + "/Operations/IndexationWorkFlow/StartIndexingWorkflow",
            IndexationWorkflowHistory: GetEnvironmentLocation() + "/Operations/IndexationWorkFlow/IndexationWorkflowHistory",

        };

        var nextStepsValues = { Empty: "", WebSearch: "1", FirstAutomatedEmail: "2", SecondAutomatedEmail: "3", FirstPhoneCall: "4", FollowUpPhoneCall: "5", Completed: "6" };
        var obtainmentActions = { Empty: "", LogExternalEmail: "10", ConfirmNotAvailable: "9", CustomerAction: "8", ConfirmAsCurrent: "7", FlagNotRequired: "6", FlagDiscontinued: "5", SetFollowUp: "4", SendEmail: "3", LogWebSearch: "2", LogPhoneCall: "1" };

        var messages = {

            instructionMessages: {
                SupplierPortalEmailInstruction: "<br/>Please follow ||SupplierPortal(this link)|| to submit your document for the following products:<br/><br/>||ProductsList||<br/>",
                RevisionSDSEmailInstruction: "<br/><b>Please provide updated SDS documents for the following:</b><br/><br/>||ProductsList|| <br/><br/>",
                NewSDSEmailInstruction: "<br/><b>Please provide SDS documents for the following:</b><br/><br/>||ProductsList|| <br/><br/>"
            },

            successMessages: {
                Saved: "Saved Successful",
                ChangesSavedSuccessfully: "Changes Saved Successfully",
                SuperEmailDirection: "<br/><b>Please follow <a href='*'>this link</a> to submit your document. </b> <br/><br/>"
            },

            confirmationMessages: { UnAssigneRequests: "unassign these request item(s)", AssignRequests: "assign these request item(s)" },
            errorMessages: {
                NoWorkItemsSelected: "No workload items have been selected to assign/un-assign.",
                NoUserOrGroupSelected: "A group or user must be selected to assign workload items to.",
                SelectGroup: "Please select a group to assign request item(s)",
                UnAssignWorkloadItemsFailed: "Un-assigning of user/group to selected workload items failed.",
                AssignWorkloadItemsFailed: "Assigning of user/group to selected workload items failed.",
                WorkflowStartForOneSelectedItemOnly: "Workflow for only one work item can be started at a time.",
                WorkflowCompleted: "This indexation workflow item has already been completed.",
                OneOrMoreIndexationWorkflowItemsMustBeSelected: "One or more indexation workflow items must be selected",
                NoIndexingWorkloadAvailable: "No indexing workload available.",
            }
        };

        var indexationWorkLoadSearchModel = {
            StateId: 0,
            IndexingLevelId: 0,
            CategoryIds: "",
            DateFrom: null,
            DateTo:null,
            CurrentRevisionOnly: false, 
            Criterias: []
        };


        var obtainmentActionCloseRequest = {
            ReasonCodeId: null,
            CustomerActionsId: null
        };

        init = function(user) {
            
            // add any initialization code

        }

        // 

        function disableSideMenuItems() {
            $("#eeeSideBarWorkLoad").find("[id^=btn]").each(function (i, v) {
                $(v).enableControl(false);
                $(v).addClass("disabled-link");
            });
        }

        function enableSideMenuItems() {
            $("#eeeSideBarWorkLoad").find("[id^=btnStart]").each(function (i, v) {
                $(v).enableControl(true);
                $(v).removeClass("disabled-link");
            });
        }

        function enableAssignUnAssignButtons(enable) {

        }



        var loadRequests = function () {

            // bind grid
            var grid = $(obtainmentObject.controls.grids.GridRequests).data("kendoGrid");
            grid.dataSource.read();

            // disable slide-out menu options
            disableSideMenuItems();
            enableAssignUnAssignButtons(false);

            // show the slide out tab
            $(obtainmentObject.controls.sideMenus.SideBarWorkLoad).sidemenu().show();

            // set ASSIGN/UNASSIGN default to GROUP
            $(obtainmentObject.controls.textBoxes.IndividualTextBox).closest(".k-widget").hide();
        };

        var loadSupplierNotes = function () {
            var grid = $(obtainmentObject.controls.grids.GridSupplierNotes).data("kendoGrid");
            grid.dataSource.read();
        }

        // ---------------------------------  BUTTONS AND MENUS    

        disableButtons = function () { };
        enableButtons = function () { };

        getSelectedCategories = function () {
            var list = $(obtainmentObject.controls.dropdownlists.CategoriesDropDownList).data("kendoMultiSelect").value();
            return list.join(",");
        };

        // clear search 
        workflowSearchObj.on("click", obtainmentObject.controls.buttons.ClearRequestSearchButton, function () {

            // reload the search section
            var url = controllerCalls.SearchIndexationWorkflowContent;
            $.post(url, function (data) {
                $("#divSearchSection").html(data, function () {
                    // perform any cleanup
                });
            });

        });

        // clear search 
        workflowSearchObj.on("click", obtainmentObject.controls.buttons.StartWorkflow, function () {

            var ids = (selectedIds || []);
            debugger;

            if (ids.length == 0) {
                $(this).displayError(messages.errorMessages.OneOrMoreIndexationWorkflowItemsMustBeSelected);
            }
            else {

                // this call "installs" the list of selected indexation workflow items.
                // the call validates assignment and returns the first available indexing record.

                // start workflow
                $(this).ajaxCall(controllerCalls.StartIndexingWorkflow, { ids: selectedIds })
                .success(function (data) {

                    if (!data.Navigable) {

                        // something happened. workload no longer assigne to user or some such thing
                        // happened.

                        $(this).displayError(messages.errorMessages.NoIndexingWorkloadAvailable);

                    } else {

                        // http://compliweb01.dev.local/Complicore/Operations/Indexation/Indexation?documentId=5609770&revisionId=8123721

                        var url = window.location.href.split("/");
                        url[url.length - 1] = "Indexation/Indexation?navigation=" + data.GUID + "&offset=" + data.IndexationId +
                                                "&documentId=" + data.DocumentId + "&revisionId=" + data.RevisionId;
                        window.open(url.join("/"), "_blank").focus();

                    }

                }).error(
                function () {

                });

            }

        });

        // clear search 
        workflowSearchObj.on("click", obtainmentObject.controls.buttons.SearchRequestsButton, function () {

            disableButtons();

            // generate the search request
            indexationWorkLoadSearchModel.StateId = null;
            indexationWorkLoadSearchModel.IndexingLevelId = null;
            
            var selValue = $(obtainmentObject.controls.dropdownlists.StateDropDownList).data("kendoDropDownList").value();
            if (selValue != "") indexationWorkLoadSearchModel.StateId = (selValue.toLowerCase() == "true" ? 0 : 1);

            selValue = $(obtainmentObject.controls.dropdownlists.IndexingLevelDropDownList).data("kendoDropDownList").value();
            if (selValue != "") indexationWorkLoadSearchModel.IndexingLevelId = (selValue.toLowerCase() == "gold" ? 0 : 1);

            indexationWorkLoadSearchModel.CurrentRevisionOnly = $(obtainmentObject.controls.checkboxes.CurrentRevisionOnly).is(":checked");

            indexationWorkLoadSearchModel.Criterias = getAdvancedSearchCriteria();
            indexationWorkLoadSearchModel.CategoryIds = getSelectedCategories();

            // validate

            // get the data

            // reload the search section
            var url = controllerCalls.SearchRequests
            var searchCriteria = JSON.stringify(indexationWorkLoadSearchModel);

            $(this).ajaxCall(controllerCalls.SearchRequests, { searchCriteria: searchCriteria })
            .success(function (data) {
                workflowDetailObj.html(data);
                enableButtons();

            }).error(
            function () {

                enableButtons();

            });

        });

        // ---- ADVANCED SEARCH OPTIONS

        // ADD ADVANCED SEARCH OPTION
        workflowSearchObj.on("click", obtainmentObject.controls.buttons.AddAdvancedSearchOption, function () {

            // 
            var conditions = $("#advancedSearchContainerTable > div[id=row]").size();

            if (conditions < 8) {

                var url = controllerCalls.SearchRequestsCriteria;
                $.post(url, function (data) {
                    $("#advancedSearchContainerTable").append(data);
                });

            }

        })

        // REMOVE ADVANCED SEARCH OPTION - all except the first are removable
        workflowSearchObj.on("click", obtainmentObject.controls.buttons.RemoveAdvancedSearchOption, function (e) {
            $(e.target).closest("[id=row]").remove();
        })

        workflowSearchObj.on("change", obtainmentObject.controls.dropdownlists.SearchCriteriaOption, function (e) {
            alert("--- ");
        })

        function handleAdvancedSearchOption(e) {

            // if the user has selected language, present the list of language options
            // TESTED

            var ctrl = "#" + this.element.attr("id");

            var textField = ctrl.replace("drpFields", "txtFreeField");
            var languageDropDown = ctrl.replace("drpFields", "dvDropDown");

            if (this.value().toLowerCase() == "languageid") {
                $(textField).hide();
                $(languageDropDown).show();
            }
            else {
                $(languageDropDown).hide();
                $(textField).show();
            }

        }

        getAdvancedSearchCriteria = function () {

            var criteria = [];
            $("#advancedSearchContainerTable div[id=row]").each(function (i, v) {

                var fieldName = $($(v).find("select[id^='drpFields_']")[0]).kendoDropDownList();
                var whereOperator = $($(v).find("select[id^='drpContains_']")[0]).kendoDropDownList();
                var searchFor = $($(v).find("select[id^='drpDropDown_']")[0]).kendoDropDownList();
                var searchForFreeField = $(v).find("input[id^='txtFreeField_']")[0];

                var searchForValue = ($(searchForFreeField).is(":visible") ? $(searchForFreeField).val() : searchFor.val());
                if (searchForValue.replace(/ /g, "") != "") {
                    criteria.push({
                        FieldName: fieldName.val(),
                        WhereOperator: whereOperator.val(),
                        SearchFor: searchForValue
                    });
                }

            });

            return criteria;

        }

        // ---------------------------------  UTILITY FUNCTIONS

        function changesSavedSuccessfully() {
            $(this).savedSuccessFully(messages.successMessages.ChangesSavedSuccessfully);
        }

        // ---------------------------------  WORKLOAD ASSIGNMENT/UN-ASSIGNMENT

        // switch between group and user name
        workflowDetailObj.on("change", "input[name=GroupIndividual]:radio", function () {
            radioButtonSelected = $(this).val();
            if ($(this).val() === "Group") {
                $(obtainmentObject.controls.dropdownlists.GroupsDropDownList).closest(".k-widget").show();
                $(obtainmentObject.controls.textBoxes.IndividualTextBox).closest(".k-widget").hide();
                $(obtainmentObject.controls.textBoxes.IndividualTextBox).data("kendoAutoComplete").value("");
            }
            else {
                $(obtainmentObject.controls.textBoxes.IndividualTextBox).closest(".k-widget").show();
                $(obtainmentObject.controls.dropdownlists.GroupsDropDownList).closest(".k-widget").hide();
            }
        });

        function allocateUsersOrGroup(allocate, userOrGroup, callback) {

            // request
            var data = {
                searchCriteria: $("#SearchCriteria").val(),
                ids: selectedIds || [],
                allocate: allocate,
                userOrGroup: userOrGroup
            };

            // AJAX in progress
            kendo.ui.progress(workflowDetailObj, true);
            
            $(this).ajaxJSONCall(controllerCalls.AllocateSelectedItems, JSON.stringify(data))
                .success(function (successData) {

                    // AJAX call done
                    kendo.ui.progress(workflowDetailObj, false);

                    // evaluate response
                    if (successData.success === true) {

                        // reset selected ids
                        selectedIds = [];

                        // reset master select and rebind grid
                        var grid = $(obtainmentObject.controls.grids.GridRequests).data("kendoGrid");
                        var checkbox = $(grid.element).find('.chkMasterMultiSelect');
                        checkbox.prop("checked", false);
                        grid.dataSource.read();

                        // let the caller know, the work is done
                        if (callback) callback();

                    } else {

                        // AJAX call done
                        kendo.ui.progress(workflowDetailObj, false);

                        // select speccifi message
                        var msg = message.errorMessage.AssignWorkloadItemsFailed;
                        if (!allocate) msg = message.errorMessage.UnAssignWorkloadItemsFailed;

                        $(this).displayError(message);
                    }
                })
                .error(function () {
                    // AJAX call done.
                    kendo.ui.progress(workflowDetailObj, false);
                    $(this).displayError(messages.errorMessages.RequestsCouldNotBeAssigned);
                })
                .complete(function (compData) {
                    kendo.ui.progress(workflowDetailObj, false);
                });
        }

        function onItemsSelectedAndConfirmed(prompt, callback) {

            // if items have not been selected, do nothing
            if (Object.keys(selectedIds).length == 0) {
                $(this).displayError(messages.errorMessages.NoWorkItemsSelected);
            }
            else {

                var args = {
                    message: 'Are you sure you would like to ' + prompt + ' ?',
                    header: 'Confirm selected request action.'
                };

                DisplayConfirmationModal(args, function () { callback() });

            }

        }

        // UNASSIGN SELECTED WORKFLOW ITEMS
        workflowDetailObj.on("click", obtainmentObject.controls.buttons.AssignMeButton, function (e) {
            e.preventDefault();
            onItemsSelectedAndConfirmed(messages.confirmationMessages.AssignRequests, function () {
                allocateUsersOrGroup(false, currentUser, changesSavedSuccessfully);
            });
        })

        // UNASSIGN SELECTED WORKFLOW ITEMS
        workflowDetailObj.on("click", obtainmentObject.controls.buttons.UnAssignButton, function (e) {
            e.preventDefault();
            onItemsSelectedAndConfirmed(messages.confirmationMessages.UnAssigneRequests, function () {
                allocateUsersOrGroup(false, null, changesSavedSuccessfully);
            });
        })

        // ASSIGN SELECTED WORKFLOW ITEMS
        workflowDetailObj.on("click", obtainmentObject.controls.buttons.AssignToButton, function (e) {
            e.preventDefault();
            onItemsSelectedAndConfirmed(messages.confirmationMessages.AssignRequests, function(){
                $(actionModals.Assign).displayModal();
            });
        })

        // PROCESS ASSIGN SELECTED ITEMS TO USER OR GROUP
        workflowDetailObj.on("click", obtainmentObject.controls.buttons.SaveAssignButton, function (e) {

            // prevent navigation
            e.preventDefault();

            // user name or group
            var acUserName = $(obtainmentObject.controls.textBoxes.IndividualTextBox).data("kendoAutoComplete");
            var ddlGroups = $(obtainmentObject.controls.dropdownlists.GroupsDropDownList).data("kendoDropDownList");

            // selection
            var groupSelected = ($("input[name=GroupIndividual]:checked").val().toLowerCase() === "group");
            var selectedValue = (groupSelected ? ddlGroups.text() : acUserName.value());

            // user/group must be selected
            if (selectedValue.replace(/ /g, "") === "") {
                $(this).displayError(messages.errorMessages.NoUserOrGroupSelected);
            }
            else {
                allocateUsersOrGroup(true, selectedValue, function () {
                    $(actionModals.Assign).hideModal();
                    changesSavedSuccessfully();
                });
            }

        });

        // --------------------------------- END OF ASSIGNMENT/UN-ASSIGNMENT

        // --------------------------------- GRID ACTIONS

        function handleKendoGridEvents(e) { // TESTED

            var grid = e.sender;
            $(grid.dataSource.view()).each(function (i, v) {

                // locate row
                var row = grid.table.find("[data-uid=" + v.uid + "]");

                // row preselected ?
                var checked = (gridIds[v.IndexingWorkItemID] == true);

                // locate checkbox
                $(row).find(".chkMultiSelect").prop("checked", checked);

                // set row state
                $(row).addClass(checked ? "k-state-selected" : "").removeClass(checked ? "" : "k-state-selected");

            });

        }

        // DISPLAY HISTORY
        workflowDetailObj.on("click", ".showHistory", function (e) {

            e.preventDefault();

            // locate grid
            var grid = $(obtainmentObject.controls.grids.GridRequests).data("kendoGrid");

            // locate row
            $(this).closest("[data-uid]");

            var revisionId = grid.dataItem($(this).closest("[data-uid]")).IndexingWorkItemID;

            $(this).ajaxCall(controllerCalls.IndexationWorkflowHistory, { indexingWorkItemID: IndexingWorkItemID })
                   .success(function (result) {
                       $("#dvIndexationWorkflowHistory").html(result);
                   }).done(function () {
                       $(actionModals.ViewHistory).displayModal();
                   });
        });

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

        $(workflowDetailObj).on("click", ".chkMultiSelect", function () { // TESTED

            // master select state
            var checked = $(this).is(':checked');

            // get grid
            var grid = $(this).parents('.k-grid:first').data().kendoGrid;

            // grid row
            var row = $(this).closest("[data-uid]");

            // set row state
            $(row).addClass(checked ? "k-state-selected" : "").removeClass(checked ? "" : "k-state-selected");

            // set state of row
            gridIds[grid.dataItem(row).IndexingWorkItemID] = checked;

            // after select actions
            doPostGridRowAction();

        });

        $(workflowDetailObj).on("click", ".chkMasterMultiSelect", function () {

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
                $(row).find(".chkMultiSelect").prop("checked", checked);

                // set row state
                $(row).addClass(checked ? "k-state-selected" : "").removeClass(checked ? "" : "k-state-selected");

                // flag selection state
                gridIds[grid.dataItem(row).IndexingWorkItemID] = checked;

            });

            // after select actions
            doPostGridRowAction();

        });

        // --------------------------------- END OF GRID ACTIONS

        //// SAVE WORKFLOW
        //workflowSearchObj.on("click", obtainmentObject.controls.buttons.SaveSearchSettings, function () {

        //    //var drpTeams = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.TeamsDropDownList).data("kendoDropDownList");
        //    //var drpLanguage = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.PrefLangDropDownList).data("kendoDropDownList");
        //    //var drpDocType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.DocumentTypeDropDownList).data("kendoDropDownList");
        //    //var drpLockType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.LockTypeDropDownList).data("kendoDropDownList");
        //    //var drpAssignedToType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.OSAssignedToId).data("kendoDropDownList");
        //    //var drpNextStep = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.NextStepDropDownList).data("kendoDropDownList");

        //    //obtainmentWorkLoadSearchResultModel.TeamID = drpTeams.value() == "" ? 0 : drpTeams.value();
        //    //obtainmentWorkLoadSearchResultModel.ContactPreferredLanguageId = drpLanguage.value() == "" ? 0 : drpLanguage.value();
        //    //obtainmentWorkLoadSearchResultModel.DocumentTypeId = drpDocType.value() == "" ? 0 : drpDocType.value();
        //    //obtainmentWorkLoadSearchResultModel.LockTypeId = drpLockType.value() == "" ? 0 : drpLockType.value();
        //    //obtainmentWorkLoadSearchResultModel.AssignedToId = drpAssignedToType.value() == "" ? 0 : drpAssignedToType.value();
        //    //obtainmentWorkLoadSearchResultModel.NextStepId = drpNextStep.value() == "" ? 0 : drpNextStep.value();
        //    //obtainmentWorkLoadSearchResultModel.IncludeInboundResponse = $(obtainmentObject.controls.checkBox.IncludeInboundResponses).is(":checked");
        //    //DisableEnableButtons(false);

        //    //$(this).ajaxCall(controllerCalls.SaveSearchSettings, { settingsProfile: JSON.stringify(obtainmentWorkLoadSearchResultModel) })
        //    //   .success(function (successData) {
        //    //       if (successData.success == true) {
        //    //           DisableEnableButtons(true);
        //    //           $(this).savedSuccessFully(messages.successMessages.Saved);
        //    //       }
        //    //   }).error(function (error) {
        //    //       $(this).displayError(error);
        //    //   });
        //});


        //workflowSearchObj.on("click", obtainmentObject.controls.checkBox.IncludeInboundResponses, function () {
        //    $(obtainmentObject.controls.buttons.SearchRequestsButton).click();
        //});

        // SEARCH WORKFLOW
        //workflowSearchObj.on("click", obtainmentObject.controls.buttons.SearchRequestsButton, function () {

        //    //var drpTeams = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.TeamsDropDownList).data("kendoDropDownList");
        //    //var drpLang = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.PrefLangDropDownList).data("kendoDropDownList");
        //    //var drpDocType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.DocumentTypeDropDownList).data("kendoDropDownList");
        //    //var drpLockType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.LockTypeDropDownList).data("kendoDropDownList");
        //    //var drpAssignedToType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.OSAssignedToId).data("kendoDropDownList");
        //    //var drpNextStep = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.NextStepDropDownList).data("kendoDropDownList");

        //    ////create requestSearchModel to be passed to the controller
        //    //obtainmentWorkLoadSearchResultModel.TeamID = drpTeams.value() == "" ? 0 : drpTeams.value();
        //    //obtainmentWorkLoadSearchResultModel.ContactPreferredLanguageId = drpLang.value() == "" ? 0 : drpLang.value();
        //    //obtainmentWorkLoadSearchResultModel.DocumentTypeId = drpDocType.value() == "" ? 0 : drpDocType.value();
        //    //obtainmentWorkLoadSearchResultModel.LockTypeId = drpLockType.value() == "" ? 0 : drpLockType.value();
        //    //obtainmentWorkLoadSearchResultModel.AssignedToId = drpAssignedToType.value() == "" ? 0 : drpAssignedToType.value();
        //    //obtainmentWorkLoadSearchResultModel.NextStepId = drpNextStep.value() == "" ? 0 : drpNextStep.value();
        //    //obtainmentWorkLoadSearchResultModel.NoticeNumber = $(obtainmentObject.controls.textBoxes.NoticeNumberSearch).val();
        //    //obtainmentWorkLoadSearchResultModel.SupplierId = $(obtainmentObject.controls.textBoxes.SupplierId).val();
        //    //obtainmentWorkLoadSearchResultModel.AccountId = $(obtainmentObject.controls.textBoxes.AccountId).val();
        //    //obtainmentWorkLoadSearchResultModel.IncludeInboundResponse = $(obtainmentObject.controls.checkBox.IncludeInboundResponses).is(":checked");


        //    //obtainmentWorkLoadSearchResultModel.HasFilter = obtainmentWorkLoadSearchResultModel.TeamID
        //    //    + obtainmentWorkLoadSearchResultModel.ContactPreferredLanguageId
        //    //    + obtainmentWorkLoadSearchResultModel.DocumentTypeId
        //    //    + obtainmentWorkLoadSearchResultModel.LockTypeId
        //    //    + obtainmentWorkLoadSearchResultModel.AssignedToId
        //    //    + obtainmentWorkLoadSearchResultModel.NextStepId
        //    //    + (obtainmentWorkLoadSearchResultModel.NoticeNumber != "") ? "1" : "0"
        //    //    + obtainmentWorkLoadSearchResultModel.AccountId;

        //    //if (obtainmentWorkLoadSearchResultModel.HasFilter > 0 || obtainmentWorkLoadSearchResultModel.SupplierId > 0) {
        //    //    DisableEnableButtons(false);

        //    //    kendo.ui.progress(obtainmentDetailObj, true);
        //    //    $(this).ajaxCall(controllerCalls.SearchRequests, { searchCriteria: JSON.stringify(obtainmentWorkLoadSearchResultModel) })
        //    //        .success(function (data) {
        //    //            obtainmentDetailObj.html(data);
        //    //            DisableEnableButtons(true);
        //    //        }).error(
        //    //        function () {
        //    //            $(this).displayError(messages.errorMessages.GeneralError);
        //    //        });
        //    //}
        //    //else
        //    //    $(this).displayError(messages.errorMessages.SelectFilter);
        //});

        //workflowSearchObj.on("click", obtainmentObject.controls.buttons.SuperSupplierEmailButton, function () {

        //    //var supplierId = $(obtainmentObject.controls.textBoxes.SupplierId).val();
        //    //var emailTarget = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.EmailTargets).data("kendoDropDownList").value();
        //    //var emailTargetText = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.EmailTargets).data("kendoDropDownList").text();

        //    //if (emailTarget == "") emailTarget = "0";

        //    //if (emailTarget == "0") {
        //    //    $(this).displayError(messages.errorMessages.SuperEmailTargetNotSelected);
        //    //    return;
        //    //}

        //    //// get portal data
        //    //$(this).ajaxCall(controllerCalls.GetSupplierPortalUrl, { supplierId: supplierId })
        //    //        .success(function (successData) {
        //    //            SetSuperEmailDefault(successData, emailTarget, emailTargetText);
        //    //        }).error(function (error) {
        //    //            $(this).displayError(error);
        //    //        });
        //});



        //workflowSearchObj.on("input propertychange paste keyup", obtainmentObject.controls.textBoxes.SupplierId, function (e1) {
        //    //var code = (e1.keyCode ? e1.keyCode : e1.which);
        //    //if (code == 13) //Search only on enter
        //    //    $(obtainmentObject.controls.buttons.SearchRequestsButton).click();

        //    ////$(obtainmentObject.controls.buttons.SuperSupplierEmailButton).enableControl(false);
        //    //if ($(obtainmentObject.controls.textBoxes.SupplierId).val() == "") {
        //    //    $(obtainmentObject.controls.buttons.SuperSupplierEmailButton).enableControl(false);
        //    //    $(obtainmentObject.controls.dropdownlists.EmailTargets).enableControl(false);
        //    //    $("#divSearchSection " + obtainmentObject.controls.dropdownlists.EmailTargets).data("kendoDropDownList").enable(false);
        //    //}

        //});

        ////obtainmentDetailWorkFlowObj.on("click", ".showHistory", function (e) {
        ////    e.preventDefault();
        ////    ShowHistory(this.id, null);
        ////});

        ////obtainmentDetailWorkFlowObj.on("click", ".showHistorySupplier", function (e) {
        ////    e.preventDefault();
        ////    ShowHistory(null, this.id);
        ////});

        ////obtainmentDetailWorkFlowObj.on("click", ".showAccount", function (e) {
        ////    e.preventDefault();
        ////    ShowAccount(this.id, null);
        ////});



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

        // SHOW HISTORY
        function ShowHistory(obtainmentWorkId, supplierId) {
            //$(this).ajaxCall(controllerCalls.ObtainmentWorkItemLoadHistory, { obtainmentWorkID: obtainmentWorkId, supplierId: supplierId })
            //   .success(function (data) {
            //       $("#dvRequestItemHistory").html(data);
            //       $(kendoWindows.ViewHistory).data("kendoWindow").center().open();
            //       $("div.k-widget.k-window").css("top", "20px");
            //   }).error(function () {
            //       $(this).displayError(messages.errorMessages.GeneralError);
            //   });
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


        return {

            init:init,
            handleAdvancedSearchOption: handleAdvancedSearchOption,
            loadRequests: loadRequests,
            handleKendoGridEvents: handleKendoGridEvents
            

            //loadRequests: loadRequests,
            //loadRequestsPlugin: loadRequestsPlugin,
            //loadSupplierNotes: loadSupplierNotes,
            //onDdlDataBound: onDdlDataBound,
            //onLoadChange: onLoadChanged,
            //onObtainmentReqeustDataBound: onObtainmentReqeustDataBound,
            //loadSentEmail: loadSentEmail,
            //selectedSuperMailSupplierId: selectedSuperMailSupplierId,
            //ObtainmentDetailRoute: ObtainmentDetailRoute
        };
    };
})(jQuery);