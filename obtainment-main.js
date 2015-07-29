; (function ($) {
    if ($.fn.complibObtainment == null) {
        $.fn.complibObtainment = {};

    }
    $.fn.complibObtainment = function () {
        var obtainmentDetailObj = $("#DetailObtianment");
        var obtainmentSearchObj = $("#ObtianmentWFGrid");
        var obtainmentDetailWorkFlowObj = $("#ObtianmentWFDetails");
        var obtianmentDetailModals = $("#ObtainmentDetailModals");
        var itemsChecked = 0;
        var selectedRequests = new Array();
        var hasNoticeNumbers = false;
        var selectedRows = new Array();

        var obtainmentObject = {
            controls: {
                grids: {
                    GridRequests: "#gdRequests", GridSupplierNotes: "#gdSupplierNotes", GridDetailRequests: "#gdDetailRequests",
                    GridContactPhone: "#gdContactPhoneObtainment", GridSupplier: "#DetailSupplier #gdSupplierContacts",
                    GridContactEmail: "#DetailSupplier #gdContactEmail"
            },
                buttons: {
                    ClearRequestSearchButton: "#clearRequestSearchBtn",
                    SearchRequestsButton: "#searchRequestBtn",
                    SaveSearchSettings: "#saveSearchSettingsBtn",
                    ActionLoadModal: "#actionLoadModalBtn",
                    FollowUpSaveButton: "#btnSaveFollowUp",
                    FollowUpCancelButton: "#btnCancelFollowUp",
                    LogPhoneCallSaveButton: "#btnSavePhoneCall",
                    LogPhoneCallCancelButton: "#btnCancelPhoneCall",
                    SendEmailButton: "#btnSendEmail",
                    SendEmailCancelButton: "#btnCancelSendEmail",
                    FlagDiscontinuedSaveButton: "#btnSaveFlagDiscontinued",
                    FlagDiscontinuedCancelButton: "#btnCancelFlagDiscontinued",
                    NotRequiredSaveButton: "#btnSaveNotRequired",
                    NotRequiredCancelButton: "#btnCancelNotRequired",
                    CloseRequestSaveButton: "#btnSaveCloseRequest",
                    CloseRequestCancelButton: "#btnCancelCloseRequest"
                },
                textBoxes: {
                    NumberOfItemsTextBox: "#numberOfItems",
                    ObtainmentActionNotes: "#txtObtainmentActionNotes",
                    ObtainmentEmailRecepients: "#txtObtainmentEmailSendEmailTo",
                    ObtainmentEmailSubject: "#txtObtainmentEmailSendEmailSubject",
                    NoticeNumber: "#txtNoticeNum",
                    ObtainmentEmailBody: "#txtObtainmentEmailSendEmailBody"                    
                },
                dateTime: { NextStepDueDate: "#dteNextStepDueDate" },
                dropdownlists: {
                    TeamsDropDownList: "#ddlTeams",
                    PrefLangDropDownList: "#ddlDocumentLanguage",
                    DocumentTypeDropDownList: "#ddlDocumentType",
                    LockTypeDropDownList: "#ddlLockType",
                    OSAssignedToId: "#ddlAssignedToId",
                    NextStepDropDownList: "#ddlNextStep",
                    ActionsDropDownList: "#ddlAction",
                    NextStepsDropDownList: "#ddlNextSteps",
                    InternalNotes : "#ddlInternalNotes",
                    CloseRequestCustomerActionsDropDownList: "#ddlCustomerActions",
                    CloseRequestReasonCode: "#ddlReasonCode"
                },
                labels: {ContactName: "#lblContactName"},
                checkBox:{LiveCall:"#chkLiveCall"}
            }
        }
        var actionModals = { FollowUp: "#mdlFollowUp", LogPhoneCall:"#mdlLogPhoneCall", SendEmail: "#mdlSendEmail", FlagDiscontinued:"#mdlFlagDiscontinued", NotRequired:"#mdlNotRequired", CloseRequest:"#mdlCloseRequest", ViewHistory: "#mdlViewHistory" };
        var kendoWindows = { ViewHistory: "#supplierSearchWindow" };
        var controllerCalls = {
            SearchRequests: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SearchObtainmentRequests",
            SaveSearchSettings: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveSearchSettings",
            SaveObtainmentWorkItemAction: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentWorkItemAction",
            ObtainmentWorkItemLoadHistory: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/ObtainmentWorkItemLoadHistoryContent",
            SendEmail: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SendEmail",
            GenerateNoticeNum: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GenerateNoticeNum",
            GetNoticeNumberAndNethubLinks: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetNoticeNumberAndNethubLinks"

    };
        var nextStepsValues = { Empty: "", WebSearch: "1", FirstAutomatedEmail: "2", SecondAutomatedEmail: "3", FirstPhoneCall: "4", FollowUpPhoneCall: "5", Completed: "6" };
        var obtainmentActions = { Empty: "",ConfirmAsCurrent:"7",FlagNotRequired:"6",FlagDiscontinued:"5", SetFollowUp: "4", SendEmail: "3", LogWebSearch: "2", LogPhoneCall: "1" };
        var messages = {
            successMessages: { Saved: "Saved Successful" },
            confirmationMessages: { UnAssigneRequests: "unassign these request item(s)", AssignRequests: "assign these request item(s)" },
            errorMessages: {
                SelectGroup: "Please select a group to assign request item(s)",
                UserRequiredToAssign: "User required to assign selected request item(s)",
                SelectFilter: "A filter must be selected to execute a search",
                NoItemsSelected: "No items have been selected",
                NoRowSelected: "No row selected",
                NoActionSelected: "No action has been selected",
                RequestsCouldNotBeSaved: "Requests could not be saved",
                RequestsCouldNotBeAssigned: "Requests could not be assigned",
                NoContactSelcted: "No contact has been selected from Contact Information",
                NoPhoneSelected : "No conatact phone has been selected",
                GeneralError: "Error Occurred",
                EmailPartsMissing: "Email must have subject and body.",
                CannotGenerateNoticeNumber: "Cannot generate notice number",
                ResponseReceived: "A notice number is associated with one or several request(s) that are being processed",
                UnderCoonstruction: "This option is still under construction."
            }
        };

        var obtainmentWorkLoadSearchResultModel = {
            TeamID:0,
            DocumentLanguageId:0,
            DocumentTypeId:0,
            LockTypeId : 0,
            AssignedToId:0,
            NextStepId0:0
        };

        var obtainmentMultipleWorkItemActionModel = {
            OWID: null,
            ObtainmentWorkItemIDs: null,
            ObtainmentActionLkpID: null,
            NextObtainmentStepLkpID: null,
            Notes: null,
            NextObtainmentStepDueDate: null,
            ObtainmentActionLogPhoneCallModel: null,
            ObtainmentActionSendEmailModel: null,
            ObtainmentActionCloseRequest: null
        };

        var obtainmentActionLogPhoneCallModel = {
            LiveCall: false,
            CompanyContactId: null,
            CompanyContactPhoneId: null,
            InternalNotesLkpId:null
        };

        var obtainmentActionCloseRequest = {
            ReasonCodeId: null,
            CustomerActionsId: null
        };

        var obtainmentActionSendEmailModel = {
            Recepients:null,
            Cc:null,
            Subject:null,
            Body: null,
            Files :null

        };

        var loadRequestsPlugin = function() {
            initializeMultiSelectCheckboxes(obtainmentDetailWorkFlowObj);
        }

        var loadRequests = function () {
            var grid = $(obtainmentObject.controls.grids.GridRequests).data("kendoGrid");
            grid.dataSource.read();
        };

        var loadSupplierNotes = function() {
            var grid = $(obtainmentObject.controls.grids.GridSupplierNotes).data("kendoGrid");
            grid.dataSource.read();
        }


        obtainmentSearchObj.on("click", obtainmentObject.controls.buttons.SaveSearchSettings, function () {
            var drpTeams = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.TeamsDropDownList).data("kendoDropDownList");
            var drpLanguage = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.PrefLangDropDownList).data("kendoDropDownList");
            var drpDocType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.DocumentTypeDropDownList).data("kendoDropDownList");
            var drpLockType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.LockTypeDropDownList).data("kendoDropDownList");
            var drpAssignedToType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.OSAssignedToId).data("kendoDropDownList");
            var drpNextStep = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.NextStepDropDownList).data("kendoDropDownList");

            obtainmentWorkLoadSearchResultModel.TeamID = drpTeams.value() == "" ? 0 : drpTeams.value();
            obtainmentWorkLoadSearchResultModel.DocumentLanguageId = drpLanguage.value() == "" ? 0 : drpLanguage.value();            
            obtainmentWorkLoadSearchResultModel.DocumentTypeId = drpDocType.value() == "" ? 0 : drpDocType.value();
            obtainmentWorkLoadSearchResultModel.LockTypeId = drpLockType.value() == "" ? 0 : drpLockType.value();
            obtainmentWorkLoadSearchResultModel.AssignedToId = drpAssignedToType.value() == "" ? 0 : drpAssignedToType.value();
            obtainmentWorkLoadSearchResultModel.NextStepId = drpNextStep.value() == "" ? 0 : drpNextStep.value();
            
            DisableEnableButtons(false);
            
            $(this).ajaxCall(controllerCalls.SaveSearchSettings, { settingsProfile: JSON.stringify(obtainmentWorkLoadSearchResultModel) })
               .success(function (successData) {
                    if (successData.success == true) {
                        DisableEnableButtons(true);
                        $(this).savedSuccessFully(messages.successMessages.Saved);
                    }
                }).error(function (error) {
                    $(this).displayError(error);
            });
        });

        obtainmentSearchObj.on("click", obtainmentObject.controls.buttons.ClearRequestSearchButton, function () {
            var drpTeams = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.TeamsDropDownList).data("kendoDropDownList");
            var drpLang = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.PrefLangDropDownList).data("kendoDropDownList");
            var drpDocType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.DocumentTypeDropDownList).data("kendoDropDownList");
            var drpLockType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.LockTypeDropDownList).data("kendoDropDownList");
            var drpAssignedToType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.OSAssignedToId).data("kendoDropDownList");
            var drpNextStep = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.NextStepDropDownList).data("kendoDropDownList");
            drpTeams.select(0);
            drpLang.select(0);
            drpDocType.select(0);
            drpLockType.select(0);
            drpAssignedToType.select(0);
            drpNextStep.select(0);
        });

        obtainmentSearchObj.on("click", obtainmentObject.controls.buttons.SearchRequestsButton, function () {
         
            var drpTeams = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.TeamsDropDownList).data("kendoDropDownList");
            var drpLang = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.PrefLangDropDownList).data("kendoDropDownList");
            var drpDocType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.DocumentTypeDropDownList).data("kendoDropDownList");
            var drpLockType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.LockTypeDropDownList).data("kendoDropDownList");
            var drpAssignedToType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.OSAssignedToId).data("kendoDropDownList");
            var drpNextStep = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.NextStepDropDownList).data("kendoDropDownList");

            //create requestSearchModel to be passed to the controller
            obtainmentWorkLoadSearchResultModel.TeamID = drpTeams.value() == "" ? 0 : drpTeams.value();
            obtainmentWorkLoadSearchResultModel.DocumentLanguageId = drpLang.value() == "" ? 0 : drpLang.value();
            obtainmentWorkLoadSearchResultModel.DocumentTypeId = drpDocType.value() == "" ? 0 : drpDocType.value();
            obtainmentWorkLoadSearchResultModel.LockTypeId = drpLockType.value() == "" ? 0 : drpLockType.value();
            obtainmentWorkLoadSearchResultModel.AssignedToId = drpAssignedToType.value() == "" ? 0 : drpAssignedToType.value();
            obtainmentWorkLoadSearchResultModel.NextStepId = drpNextStep.value() == "" ? 0 : drpNextStep.value();

            obtainmentWorkLoadSearchResultModel.HasFilter = obtainmentWorkLoadSearchResultModel.TeamID
                + obtainmentWorkLoadSearchResultModel.DocumentLanguageId
                + obtainmentWorkLoadSearchResultModel.DocumentTypeId
                + obtainmentWorkLoadSearchResultModel.LockTypeId
                + obtainmentWorkLoadSearchResultModel.AssignedToId
                + obtainmentWorkLoadSearchResultModel.NextStepId;

            if (obtainmentWorkLoadSearchResultModel.HasFilter > 0) {
                DisableEnableButtons(false);

                kendo.ui.progress(obtainmentDetailObj, true);
                $(this).ajaxCall(controllerCalls.SearchRequests, {searchCriteria: JSON.stringify(obtainmentWorkLoadSearchResultModel) })
                    .success(function(data) {
                        obtainmentDetailObj.html(data);
                        DisableEnableButtons(true);
                    }).error(
                    function() {
                        $(this).displayError(messages.errorMessages.GeneralError);
                    });
            }
            else
                $(this).displayError(messages.errorMessages.SelectFilter);
        });


     
        obtainmentDetailWorkFlowObj.on("click", obtainmentObject.controls.buttons.ActionLoadModal, function () {
            if (hasNoticeNumbers)
                $(this).displayError(messages.errorMessages.ResponseReceived);
            else
                ShowActionModals();
        });


        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.FollowUpCancelButton, function () {
            $(actionModals.FollowUp).toggleModal();
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.LogPhoneCallCancelButton, function () {
            $(actionModals.LogPhoneCall).toggleModal();
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.SendEmailCancelButton, function () {

            // if there are attachments OR if the form has been edited, confirm
            // abandon action with the user.

            fUploadlib.abandonAttachments(function(action) {
                if (action.abandon) {

                    var files = action.attachments;
                    console.log(files);

                    // remove all attachments

                    // TODO: see if form has been edited
                    $(actionModals.SendEmail).toggleModal();
                }
            });

        });
        
        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.FlagDiscontinuedCancelButton, function () {
            $(actionModals.FlagDiscontinued).toggleModal();
            });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.NotRequiredCancelButton, function () {
            $(actionModals.NotRequired).toggleModal();
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.CloseRequestCancelButton, function () {
            $(actionModals.CloseRequest).toggleModal();
        });
        
        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.FollowUpSaveButton, function () {
            SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "FollowUp", actionModals.FollowUp);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.LogPhoneCallSaveButton, function () {
            SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "PhoneCall", actionModals.LogPhoneCall);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.CloseRequestSaveButton, function () {            
            SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "CloseRequest", actionModals.CloseRequest);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.SendEmailButton, function () {
            SendEmailAndSaveObtainmentNextStep(controllerCalls.SendEmail, actionModals.SendEmail);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.FlagDiscontinuedSaveButton, function () {
            SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "FlagDiscontinued", actionModals.FlagDiscontinued);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.NotRequiredSaveButton, function () {
            SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "NotRequired", actionModals.NotRequired);
        });

        obtainmentDetailWorkFlowObj.on("click", ".showHistory", function (e) {
            e.preventDefault();
            ShowHistory(this.id,null);
        });
       
        obtainmentDetailWorkFlowObj.on("click", ".showHistorySupplier", function (e) {
             e.preventDefault();
             ShowHistory(null, this.id);
        });

        function ShowHistory(obtainmentWorkId, supplierId) {
            $(this).ajaxCall(controllerCalls.ObtainmentWorkItemLoadHistory, { obtainmentWorkID: obtainmentWorkId, supplierId: supplierId })
               .success(function(data) {
                   $("#dvRequestItemHistory").html(data);
                   $(kendoWindows.ViewHistory).data("kendoWindow").center().open();
                   $("div.k-widget.k-window").css("top", "20px");
               }).error(function () {
                   $(this).displayError(messages.errorMessages.GeneralError);
               });
        }

        function SetNextStepForSendEmail(nextStepValue, actionName, contacts) {

            var ddlNextSteps = $(obtainmentObject.controls.dropdownlists.NextStepsDropDownList + actionName).data("kendoDropDownList");
            ddlNextSteps.value(nextStepValue);

            var emailIds = []; 
            //for (var i = 0; contacts != null && i < contacts.length; i++) {
              //  emailIds.push(contacts[i].Email);
            //}

            $(obtainmentObject.controls.textBoxes.ObtainmentEmailRecepients).val(/*emailIds.join(";")*/ contacts.Email);

        }

        function SetNextStep(nextStepValue, actionName,enable) {
            var ddlNextSteps = $(obtainmentObject.controls.dropdownlists.NextStepsDropDownList + actionName).data("kendoDropDownList");
            var dteDateAssigned = $(obtainmentObject.controls.dateTime.NextStepDueDate + actionName).data("kendoDatePicker");
            ddlNextSteps.value(nextStepValue);
            ddlNextSteps.enable(enable);
            dteDateAssigned.enable(enable);
        }

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

        function ShowActionModals() {
           
             var ddlActions = $(obtainmentObject.controls.dropdownlists.ActionsDropDownList).data("kendoDropDownList");

            if ($(obtainmentObject.controls.textBoxes.NumberOfItemsTextBox).val().length == 0) {
                $(this).displayError(messages.errorMessages.NoItemsSelected);
                return;
                }

            if (ddlActions.value() == obtainmentActions.Empty) {
                $(this).displayError(messages.errorMessages.NoActionSelected);
                return;
            }

            switch (ddlActions.value()) {

                case obtainmentActions.SetFollowUp:
                    SetNextStep(nextStepsValues.FirstPhoneCall, "FollowUp", true);
                    $(actionModals.FollowUp).displayModal();
                    break;

                case obtainmentActions.LogPhoneCall:
                    var contactgrid = $(obtainmentObject.controls.grids.GridSupplier).data("kendoGrid");
                    var selectedItem = contactgrid.dataItem(contactgrid.select());
                    if (selectedItem != null) {
                        var phoneContactGrid = $(obtainmentObject.controls.grids.GridContactPhone).data("kendoGrid");
                        phoneContactGrid.dataSource.read();
                        phoneContactGrid.refresh();
                        SetNextStep(nextStepsValues.FollowUpPhoneCall, "PhoneCall", true);
                        $(actionModals.LogPhoneCall).displayModal();
                        $(obtainmentObject.controls.labels.ContactName).text(selectedItem.SupplierContactName);
                } else
                        $(this).displayError(messages.errorMessages.NoContactSelcted);
                    break;

                case obtainmentActions.LogWebSearch:
                    SetNextStep(nextStepsValues.WebSearch,"", true);
                    //$(actionModals.FollowUp).displayModal();
                    break;

                case obtainmentActions.SendEmail:

                    // ---- ARINDAM

                try {

                    // at least one contact must be selected.
                  
                    var contactsGrid = $(obtainmentObject.controls.grids.GridContactEmail).data("kendoGrid");
                    var selectedItems = contactsGrid.dataItem(contactsGrid.select());
                    console.log(selectedItems);

                    if (selectedItems != null) {

                        // url to invoke for notice number 
                        var strUrl = controllerCalls.GetNoticeNumberAndNethubLinks;

                       

                        var cdata = new Object();
                        cdata.owid = getQueryVariable("owid");
                        cdata.ids = selectedRequests.join(",");

                        console.log(cdata);

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

                                if (data != '') {

                                    // set the next step
                                    SetNextStepForSendEmail(nextStepsValues.FirstAutomatedEmail, "SendEmail", selectedItems);

                                    // reset all upload state
                                    fUploadlib.initialize();

                                    // set up the notice number
                                    $('#txtNoticeNum').val("Notice Number: " + data.noticeNumber);

                                    // clear textboxes
                                    $("#txtObtainmentEmailSendEmailBody").val("");
                                    $("#txtObtainmentEmailSendEmailSubject").val("");

                                    var text = "Nethub links for the following products will be added to the outgoing email :";
                                    var html = "<table>";

                                    // display the product and document types for which links will be sent out
                                    for (var i = 0; i < data.products.length; i++) {
                                        text += data.products[i] + "(" + data.documents[i] + ")";
                                        if (i < data.products.length - 1) text += ", ";
                                        html += "<tr><td>" + data.products[i] + "</td><td>" + data.documents[i] + "</td></tr>";
                                    }

                                    html += "</table>";

                                    $("#txtObtainmentEmailNethubLinks").val(text);

                                

                                    // display upload interface
                                    $(actionModals.SendEmail).displayModal();

                                }
                            },
                            done: function () {
                                $(this).savedSuccessFully(messages.successMessages.Saved);
                            }
                        });

                        //var strUrl = controllerCalls.GenerateNoticeNum;
                        // pass in the ids to generate the links
                        //$(this).ajaxCall(strUrl)
                        //    .success(function (data) {
                        //        if (data != '') {

                        //            // set the next step
                        //            SetNextStepForSendEmail(nextStepsValues.FirstAutomatedEmail, "SendEmail", selectedItems);

                        //            // reset all upload state
                        //            fUploadlib.initialize();

                        //            // set up the notice number
                        //            $('#txtNoticeNum').val("Notice Number: " + data.noticeNumber);

                        //            // clear textboxes
                        //            $("#txtObtainmentEmailSendEmailBody").val("");
                        //            $("#txtObtainmentEmailSendEmailSubject").val("");

                        //            // display upload interface
                        //            $(actionModals.SendEmail).displayModal();
                                    
                        //        }
                        //    })
                        //    .error(function () {
                        //        $(this).displayError(messages.errorMessages.CannotGenerateNoticeNumber);
                        //    });

                    }

                } catch (e) {

                    // contact must be selected
                        $(this).displayError(messages.errorMessages.NoContactSelcted);

                }

                    break;

                case obtainmentActions.FlagDiscontinued:
                    SetNextStep(nextStepsValues.Completed, "FlagDiscontinued", false);
                    $(actionModals.FlagDiscontinued).displayModal();
                    break;

                case obtainmentActions.FlagNotRequired:
                    SetNextStep(nextStepsValues.Completed, "NotRequired", false);
                    $(actionModals.NotRequired).displayModal();
                    break;

                case obtainmentActions.ConfirmAsCurrent:
                    SetNextStep(nextStepsValues.Completed, "CloseRequest", false);
                    $(actionModals.CloseRequest).displayModal();
                    break;
            }
        }

        function DisableEnableButtons(enable) {
            $(obtainmentObject.controls.buttons.SearchRequestsButton).enableControl(enable);
            $(obtainmentObject.controls.buttons.ClearRequestSearchButton).enableControl(enable);
            $(obtainmentObject.controls.buttons.SaveSearchSettings).enableControl(enable);
        };

        function initializeMultiSelectCheckboxes(obj) {
            obj.on("mouseup MSPointerUp", ".chkMultiSelect", function (e) {
                selectedRequests = new Array();
                var checked = $(this).is(':checked');
                var grid = $(this).parents('.k-grid:first');
                if (grid) {
                    var kgrid = grid.data().kendoGrid;
                    var selectedRow = $(this).parent().parent();
                    var dataItem = kgrid.dataItem($(this).closest('tr'));
                    if (dataItem) {
                        dataItem.set('IsSelected', !checked);
                        if (selectedRow.length > 0) {
                            if ($(this).is(':checked')) {
                                var indexUid = selectedRows.indexOf(selectedRow.attr('data-uid'));
                                if (indexUid > -1)
                                    selectedRows.splice(indexUid, 1);
                            } else
                                selectedRows.push(selectedRow.attr('data-uid'));
                        }
                    }

                    itemsChecked = 0;
                    $.each(kgrid._data, function () {
                        if (this['IsSelected']) {
                            selectedRequests.push(this["ObtainmentWorkID"]);
                            itemsChecked++;
                        } else {
                            var index = selectedRequests.indexOf(this["ObtainmentWorkID"]);
                            if (index > -1)
                                selectedRequests.splice(index, 1);
                        }
                        
                        if (this['IsSelected'] && this['NoticeNumber'] != null)
                            hasNoticeNumbers = true;

                        if (!this['IsSelected'] && this['NoticeNumber'] != null)
                            hasNoticeNumbers = false;

                        if (selectedRows.indexOf(this["uid"]) > -1)
                            grid.find('tr[data-uid="' + this["uid"] + '"]').addClass('k-state-selected');
                        else
                            grid.find('tr[data-uid="' + this["uid"] + '"]').removeClass('k-state-selected');
                    });

                    UpdateNumberOfItemsChecked(itemsChecked);
                    e.stopImmediatePropagation();
                }

            });

            obj.on("click", ".chkMasterMultiSelect", function () {
                var checked = $(this).is(':checked');
                var grid = $(this).parents('.k-grid:first');
                selectedRequests = new Array();
                itemsChecked = 0;

                if (grid) {
                    var kgrid = grid.data().kendoGrid;
                    if (kgrid._data.length > 0) {
                        $.each(kgrid._data, function () {
                            this['IsSelected'] = checked;
                            if (this['IsSelected']) {
                                selectedRequests.push(this["ObtainmentWorkID"]);
                                itemsChecked++;
                            } else {
                                var index = selectedRequests.indexOf(this["ObtainmentWorkID"]);
                                if (index > -1)
                                    selectedRequests.splice(index, 1);
                            }

                            if (this['IsSelected'] && this['NoticeNumber'] != null)
                                hasNoticeNumbers = true;

                            if (!this['IsSelected'] && this['NoticeNumber'] != null)
                                hasNoticeNumbers = false;
                        });
                        kgrid.refresh();
                        UpdateNumberOfItemsChecked(itemsChecked);

                        $('tr', grid).each(function () {
                            var tr = $(this);
                            var cked = $('.chkMultiSelect', tr).is(':checked');
                            if (cked)
                                tr.addClass('k-state-selected');
                            else
                                tr.removeClass('k-state-selected');
                        });
                    } else {
                        return false;
                    }
                }

            });
        }

        function UpdateNumberOfItemsChecked(numberOfItems) {
            $(obtainmentObject.controls.textBoxes.NumberOfItemsTextBox).text("(" + numberOfItems + ")").val(numberOfItems).trigger("change");
        }

        function onDdlDataBound(e)
        {
            $(".unsupport").parent().click(false);
        }

        function SendEmailAndSaveObtainmentNextStep(strUrl, modalId) {

            // determine that there is at least one email to address, a subject and a email body

            var valid = true;

            // contact mandatory
            if ($(obtainmentObject.controls.textBoxes.ObtainmentEmailRecepients).val().length == 0 ||
                $(obtainmentObject.controls.textBoxes.ObtainmentEmailSubject).val().length == 0 ||
               // $(obtainmentObject.controls.textBoxes.NoticeNumber).val().length <= 15 ||
                $(obtainmentObject.controls.textBoxes.ObtainmentEmailBody).val().length == 0) {

                $(modalId).toggleModal();
                $(this).displayError(messages.errorMessages.EmailPartsMissing);
                valid = false;

            }

            if (valid) {

                var actionName = "SendEmail";
                var ddlNextSteps = $(obtainmentObject.controls.dropdownlists.NextStepsDropDownList + actionName).data("kendoDropDownList");
                //console.log("DDLNS:" + obtainmentObject.controls.dropdownlists.NextStepsDropDownList + actionName);
                var ddlActions = $(obtainmentObject.controls.dropdownlists.ActionsDropDownList).data("kendoDropDownList");
                var dteDateAssigned = $(obtainmentObject.controls.dateTime.NextStepDueDate + actionName).data("kendoDatePicker");

                if (ddlNextSteps.value() != "") {

                    // common
                    obtainmentMultipleWorkItemActionModel.OWID = getQueryVariable("owid");
                    obtainmentMultipleWorkItemActionModel.ObtainmentWorkItemIDs = selectedRequests;
                    obtainmentMultipleWorkItemActionModel.ObtainmentActionLkpID = ddlActions.value();
                    obtainmentMultipleWorkItemActionModel.NextObtainmentStepLkpID = ddlNextSteps.value();
                    obtainmentMultipleWorkItemActionModel.NextObtainmentStepDueDate = dteDateAssigned.value();

                    // send email specific

                    var contactsGrid = $(obtainmentObject.controls.grids.GridContactEmail).data("kendoGrid");
                    var contact = contactsGrid.dataItem(contactsGrid.select());
                    //console.log(contact);

                    obtainmentActionSendEmailModel.Recepients = $(obtainmentObject.controls.textBoxes.ObtainmentEmailRecepients).val() + "|" + contact.CompanyContactEmailId;
                    obtainmentActionSendEmailModel.Cc = null;
                    obtainmentActionSendEmailModel.Subject = $(obtainmentObject.controls.textBoxes.NoticeNumber).val() + " " + $(obtainmentObject.controls.textBoxes.ObtainmentEmailSubject).val();
                    obtainmentActionSendEmailModel.Body = $(obtainmentObject.controls.textBoxes.ObtainmentEmailBody).val();
                    obtainmentActionSendEmailModel.Files = fUploadlib.getAttachments();

                    obtainmentMultipleWorkItemActionModel.ObtainmentActionSendEmailModel = obtainmentActionSendEmailModel;
                    
                    $.ajax({
                        url: strUrl,
                        data: JSON.stringify(obtainmentMultipleWorkItemActionModel),
                        type: "POST",
                        contentType: 'application/json; charset=utf-8',
                        beforeSend: function() {
                            kendo.ui.progress(obtainmentDetailWorkFlowObj, true);
                        },
                        error: function() {
                            $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);
                        },
                        success: function(successData) {
                            if (successData.success == true) {
                                kendo.ui.progress(obtainmentDetailWorkFlowObj, false);
                                var grid = $(obtainmentObject.controls.grids.GridDetailRequests).data("kendoGrid");
                                grid.dataSource.read();
                                if (modalId != null)
                                    $(modalId).hideModal();
                                $(this).savedSuccessFully(messages.successMessages.Saved);
                            } else
                                $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);

                        },
                        done: function() {
                            $(this).savedSuccessFully(messages.successMessages.Saved);
                        }
                    });
                }

            }
        }

        function SaveObtainmentNextSteps(strUrl, actionName, modalId) {
            if ($(obtainmentObject.controls.textBoxes.NumberOfItemsTextBox).val().length == 0) {
                $(modalId).toggleModal();
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {
                var ddlNextSteps = $(obtainmentObject.controls.dropdownlists.NextStepsDropDownList + actionName).data("kendoDropDownList");
                var ddlActions = $(obtainmentObject.controls.dropdownlists.ActionsDropDownList).data("kendoDropDownList");
                var dteDateAssigned = $(obtainmentObject.controls.dateTime.NextStepDueDate + actionName).data("kendoDatePicker");
                if (ddlNextSteps.value() != "") {
                    obtainmentMultipleWorkItemActionModel.ObtainmentWorkItemIDs = selectedRequests;
                    obtainmentMultipleWorkItemActionModel.ObtainmentActionLkpID = ddlActions.value();
                    obtainmentMultipleWorkItemActionModel.NextObtainmentStepLkpID = ddlNextSteps.value();
                    obtainmentMultipleWorkItemActionModel.Notes = $(obtainmentObject.controls.textBoxes.ObtainmentActionNotes + actionName).val();
                    obtainmentMultipleWorkItemActionModel.NextObtainmentStepDueDate = dteDateAssigned.value();
                    if (actionName == "PhoneCall") {
                        var contactPhonegrid = $(obtainmentObject.controls.grids.GridContactPhone).data("kendoGrid");
                        var selectedPhoneItem = contactPhonegrid.dataItem(contactPhonegrid.select());
                        if (selectedPhoneItem != null)
                            obtainmentMultipleWorkItemActionModel.ObtianActionLogPhoneCallModel = FillPhoneCall(selectedPhoneItem);
                        else {
                            $(modalId).toggleModal();
                            $(this).displayError(messages.errorMessages.NoPhoneSelected);
                            return;
                        }
                    }
                   
                    if (actionName == "CloseRequest")
                        obtainmentMultipleWorkItemActionModel.ObtainmentActionCloseRequest = FillCloseRequest();

                    
                    if (selectedRequests.length > 0) {
                        $(this).ajaxJSONCall(strUrl, JSON.stringify(obtainmentMultipleWorkItemActionModel))
                         .success(function (successData) {
                             if (successData.success == true) {
                                 kendo.ui.progress(obtainmentDetailWorkFlowObj, false);
                                 var grid = $(obtainmentObject.controls.grids.GridDetailRequests).data("kendoGrid");
                                 grid.dataSource.read();
                                 if (modalId != null)
                                     $(modalId).hideModal();
                                 $(this).savedSuccessFully(messages.successMessages.Saved);
                             } else
                                 $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);
                         }).error(function () {
                             $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);
                         });
                    }
                } else {
                    $(modalId).toggleModal();
                    $(this).displayError(messages.errorMessages.NoProductSelected);
                }
            }
        }

        function FillCloseRequest() {
            var ddlCustomerActions = $(obtainmentObject.controls.dropdownlists.CloseRequestCustomerActionsDropDownList).data("kendoDropDownList");
            obtainmentActionCloseRequest.CustomerActionsId = ddlCustomerActions.value();
            obtainmentActionCloseRequest.ReasonCodeId = $(obtainmentObject.controls.dropdownlists.CloseRequestReasonCode).val() !=""?$(obtainmentObject.controls.dropdownlists.CloseRequestReasonCode).val(): null;
            obtainmentMultipleWorkItemActionModel.Notes = "Customer Action:" +ddlCustomerActions.text() + "\n" + "Reason Code:" +obtainmentActionCloseRequest.ReasonCode + "\n" + $(obtainmentObject.controls.textBoxes.ObtainmentActionNotes + "CloseRequest").val();
            return obtainmentActionCloseRequest;
            }

        function FillPhoneCall(selectedPhoneItem) {
            obtainmentActionLogPhoneCallModel.LiveCall = $(obtainmentObject.controls.checkBox.LiveCall).val();
            obtainmentActionLogPhoneCallModel.CompanyContactId = selectedPhoneItem.CompanyContactId;
            obtainmentActionLogPhoneCallModel.CompanyContactPhoneId = selectedPhoneItem.CompanyContactPhoneId;
            obtainmentActionLogPhoneCallModel.InternalNotesLkpId = $(obtainmentObject.controls.dropdownlists.InternalNotes).val()!=""?$(obtainmentObject.controls.dropdownlists.InternalNotes).val():null;
            return obtainmentActionLogPhoneCallModel;
        }

        return {
            loadRequests: loadRequests,
            loadRequestsPlugin: loadRequestsPlugin,
            loadSupplierNotes: loadSupplierNotes,
            onDdlDataBound: onDdlDataBound
        };
    };
})(jQuery);
