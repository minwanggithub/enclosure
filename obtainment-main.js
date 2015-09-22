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
        var selectedRequests = new Array();         // ids selected in the grid
        var preSelectedRequests = new Array();      // ids in previously sent email
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
                    LogWebSearchSaveButton: "#btnSaveLogWebSearch",
                    FollowUpCancelButton: "#btnCancelFollowUp",
                    LogWebSearchCancelButton: "#btnCancelLogWebSearch",
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
                    ObtainmentActionNotesCloseRequest: "#txtObtainmentActionNotesCloseRequest",
                    ObtainmentEmailRecepients: "#txtObtainmentEmailSendEmailTo",
                    ObtainmentEmailSubject: "#txtObtainmentEmailSendEmailSubject",
                    NoticeNumberSearch: "#NoticeNumber",
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
                    InternalNotes: "#ddlInternalNotes",
                    CloseRequestCustomerActionsDropDownList: "#ddlCustomerActions",
                    CloseRequestReasonCode: "#ddlReasonCode",
                    SupplierContactList: "#ddlSupplierContactList"
                },
                labels: {ContactName: "#lblContactName"},
                checkBox: { LiveCall: "#chkLiveCall", IncludeInboundResponses: "#chkOnlyWithInboundResponses" }
            }
        }
        var actionModals = { FollowUp: "#mdlFollowUp", LogWebSearch: "#mdlLogWebSearch", LogPhoneCall: "#mdlLogPhoneCall", SendEmail: "#mdlSendEmail", FlagDiscontinued: "#mdlFlagDiscontinued", NotRequired: "#mdlNotRequired", CloseRequest: "#mdlCloseRequest", ViewHistory: "#mdlViewHistory", AccountInfo: "#mdlViewAccount"
        };
        var kendoWindows = {ViewHistory: "#supplierSearchWindow", ViewAccount: "#accountSearchWindow" };
        var controllerCalls = {
            SearchRequests: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SearchObtainmentRequests",
            SaveSearchSettings: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveSearchSettings",
            SaveObtainmentWorkItemAction: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentWorkItemAction",
            ObtainmentWorkItemLoadHistory: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/ObtainmentWorkItemLoadHistoryContent",
            SendEmail: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SendEmail",
            GenerateNoticeNum: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GenerateNoticeNum",
            RetrieveSentEmail: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/RetrieveSentEmail",
            GetNoticeNumberAndNethubLinks: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetNoticeNumberAndNethubLinks",
            GetObtainmentAccountInfo: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetObtainmentAccountInfo",
            SaveEmailAttachment: GetEnvironmentLocation() + "/Operations/ObtainmentWorkflow/SaveEmailAttachment",
            RemoveEmailAttachment: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveEmailAttachment",
            GetContactList: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetContactList",
            GetContactPhoneList: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetContactPhoneList",

    };
        var nextStepsValues = { Empty: "", WebSearch: "1", FirstAutomatedEmail: "2", SecondAutomatedEmail: "3", FirstPhoneCall: "4", FollowUpPhoneCall: "5", Completed: "6" };
        var obtainmentActions = { Empty: "",CustomerAction:"8", ConfirmAsCurrent:"7",FlagNotRequired:"6",FlagDiscontinued:"5", SetFollowUp: "4", SendEmail: "3", LogWebSearch: "2", LogPhoneCall: "1" };
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
                NoPhoneSelected : "No contact phone has been selected",
                GeneralError: "Error Occurred",
                EmailPartsMissing: "Email must have subject and body.",
                CannotGenerateNoticeNumber: "Cannot generate notice number",
                ResponseReceived: "A notice number is associated with one or several request(s) that are being processed",
                UnderCoonstruction: "This option is still under construction.",
                CannotRetrieveSentEmail: "Unable to retrieve sent email.",
            }
        };

        var obtainmentWorkLoadSearchResultModel = {
            TeamID:0,
            DocumentLanguageId:0,
            DocumentTypeId:0,
            LockTypeId : 0,
            AssignedToId:0,
            NextStepId0: 0,
            IncludeInboundResponse: false
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
            obtainmentWorkLoadSearchResultModel.IncludeInboundResponse = $(obtainmentObject.controls.checkBox.IncludeInboundResponses).is(":checked");
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
            $(obtainmentObject.controls.textBoxes.NoticeNumberSearch).val('');
            $(obtainmentObject.controls.checkBox.IncludeInboundResponses).removeAttr('checked');
        });

        obtainmentSearchObj.on("click", obtainmentObject.controls.checkBox.IncludeInboundResponses, function() {
            $(obtainmentObject.controls.buttons.SearchRequestsButton).click();
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
            obtainmentWorkLoadSearchResultModel.NoticeNumber = $(obtainmentObject.controls.textBoxes.NoticeNumberSearch).val();
            obtainmentWorkLoadSearchResultModel.IncludeInboundResponse = $(obtainmentObject.controls.checkBox.IncludeInboundResponses).is(":checked");

            obtainmentWorkLoadSearchResultModel.HasFilter = obtainmentWorkLoadSearchResultModel.TeamID
                + obtainmentWorkLoadSearchResultModel.DocumentLanguageId
                + obtainmentWorkLoadSearchResultModel.DocumentTypeId
                + obtainmentWorkLoadSearchResultModel.LockTypeId
                + obtainmentWorkLoadSearchResultModel.AssignedToId
                + obtainmentWorkLoadSearchResultModel.NextStepId
                + (obtainmentWorkLoadSearchResultModel.NoticeNumber != "") ? "1" : "0";

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

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.LogWebSearchCancelButton, function () {
            $(actionModals.LogWebSearch).toggleModal();
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

            // destroy the uploader control 
            //$("#files").data("kendoUpload").destroy();
            //$(".upload-section").html('<input autocomplete="off" multiple="multiple" data-role="upload" id="files" name="files" type="file">');

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

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.LogWebSearchSaveButton, function () {
            SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "LogWebSearch", actionModals.LogWebSearch);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.LogPhoneCallSaveButton, function () {
            SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "PhoneCall", actionModals.LogPhoneCall);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.CloseRequestSaveButton, function () {
            if($("#dvCustomerAction").is(":visible"))
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "CustomerAction", actionModals.CloseRequest);
            else
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

       obtainmentDetailWorkFlowObj.on("click", ".showAccount", function (e) {
            e.preventDefault();
            ShowAccount(this.id, null);
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

        function ShowAccount(obtainmentWorkId) {
             $(this).ajaxCall(controllerCalls.GetObtainmentAccountInfo, { obtainmentWorkID: obtainmentWorkId })
               .success(function(data) {
                   $("#dvAccountInformation").html(data);
                   $(kendoWindows.ViewAccount).data("kendoWindow").center().open();
                   $("div.k-widget.k-window").css("top", "20px");
                   }).error(function() {
                   $(this).displayError(messages.errorMessages.GeneralError);
                   });
        }

        function SetNextStepForSendEmail(nextStepValue, actionName, contacts) {

            var ddlNextSteps = $(obtainmentObject.controls.dropdownlists.NextStepsDropDownList + actionName).data("kendoDropDownList");
            ddlNextSteps.value(nextStepValue);
            $(obtainmentObject.controls.textBoxes.ObtainmentEmailRecepients).val(contacts.Email);

        }

        function SetNextStep(nextStepValue, actionName, enable) {
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

        function PopulateEmailActionModal(data, resend) {

            if (data != null) {

                // reset all upload state
                fUploadlib.initialize(data.files);

                // set up notice number
                $('#txtNoticeNum').val("Notice Number: " + data.noticeNumber);

                // set up subject
                $("#txtObtainmentEmailSendEmailSubject").val(data.subject);

                // reset the email body and re-initialize the kendo editor
                var editor = $("#txtObtainmentEmailSendEmailBody").data("kendoEditor");
                editor.value(data.body);
                
                try {

                    // destroy and create the kendo upload control each time.
                    // the control may not have been created yet.
                    $("#files").data("kendoUpload").destroy();

                    // force clean up the mark up added by kendo 
                    $(".upload-section").html('<input autocomplete="off" multiple="multiple" data-role="upload" id="files" name="files" type="file">');


                } catch (e)
                {

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
                    "files" : data.files
                });

                // re-set NETHUB links
                $("#txtObtainmentEmailNethubLinks").val("No NETHUB links to add.");

                if (data.links != null && data.links.length > 0) {

                    var text = "Nethub links for the following products will be added to the outgoing email - ";
                    for (var i = 0; i < data.links.length; i++) {
                        text += data.links[i];
                        if (i < data.links.length - 1) text += ", ";
                    }

                    $("#txtObtainmentEmailNethubLinks").val(text);

                }


                // change caption as needed
                $("#mdlSendEmail").find("#myModalLabel").html(resend ? "Resend Email" : "Send Email");


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
               
                    var owid = location.search.substring(1).split('&')[1].split('=')[1];
                    var companyid = owid.split('-')[0];
                 
                    $(this).ajaxCall(controllerCalls.GetContactList, { supplierid: companyid })
                        .success(function(data) {
                            //update contact list
                            $("#ddlSupplierContactList").kendoDropDownList({
                                "dataSource": data,
                                "dataTextField": "Text",
                                "autoBind": false,
                                "dataValueField": "Value",
                                "optionLabel": "Select",
                                "change": onChangeContactName,
                           });

                            var ddlContactList = $(obtainmentObject.controls.dropdownlists.SupplierContactList).data("kendoDropDownList");
                            ddlContactList.value(selectedItem.SupplierContactName);
                            
                        })
                        .error(function() {
                            $(this).displayError(messages.errorMessages.GeneralError);
                        });
                    
                    var contactgrid = $(obtainmentObject.controls.grids.GridSupplier).data("kendoGrid");
                    var selectedItem = contactgrid.dataItem(contactgrid.select());
                    if (selectedItem != null) {

                        var phoneContactGrid = $(obtainmentObject.controls.grids.GridContactPhone).data("kendoGrid");
                        phoneContactGrid.dataSource.read();
                        phoneContactGrid.refresh();
                        SetNextStep(nextStepsValues.FollowUpPhoneCall, "PhoneCall", true);
                        $(actionModals.LogPhoneCall).displayModal();
                    } else
                        $(this).displayError(messages.errorMessages.NoContactSelcted);
                    break;

                case obtainmentActions.LogWebSearch:
                    SetNextStep(nextStepsValues.FirstAutomatedEmail, "LogWebSearch", true);
                    $(actionModals.LogWebSearch).displayModal();
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
                        cdata.owid = $("#hdnOwid").val().replace("Owid: ","");
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

                                if (data != '') {

                                    // defaults
                                    data.subject = "";
                                    data.body = "";
                                    data.files = [];

                                    // set the next step
                                    SetNextStepForSendEmail(nextStepsValues.FirstAutomatedEmail, "SendEmail", selectedItems);

                                    // set up the form
                                    PopulateEmailActionModal(data, false);

                                    // display upload interface
                                    $(actionModals.SendEmail).displayModal();

                                }
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
                    $("#dvCustomerAction").hide();
                    $("#lblTitle").text("Confirm as Current");
                    $(actionModals.CloseRequest).displayModal();
                    break;

                case obtainmentActions.CustomerAction:
                    SetNextStep(nextStepsValues.Completed, "CloseRequest", false);
                    $("#lblTitle").text("Customer Action");
                    $("#dvCustomerAction").show();
                    $(actionModals.CloseRequest).displayModal();
                    break;
            }
        }

        function onChangeContactName() {
         
            var owid = location.search.substring(1).split('&')[1].split('=')[1];
            var companyid = owid.split('-')[0];
            var ddlContactList = $(obtainmentObject.controls.dropdownlists.SupplierContactList).data("kendoDropDownList");
            var contactName = ddlContactList._selectedValue;
            
            $(this).ajaxCall(controllerCalls.GetContactPhoneList, { supplierid: companyid, contactname: contactName })
                .success(function (result) {
                    var phoneContactGrid = $(obtainmentObject.controls.grids.GridContactPhone).data("kendoGrid");
                    phoneContactGrid.dataSource.data(result);
                });
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

            // ensure that the email has contact, subject and message body. without these a
            // email may not be sent out

            var valid = true;

            if ($(obtainmentObject.controls.textBoxes.ObtainmentEmailRecepients).val().length == 0 ||
                $(obtainmentObject.controls.textBoxes.ObtainmentEmailSubject).val().length == 0 ||
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

                    // differentiate between email resends/sends
                    var owiIds = (preSelectedRequests == null ? selectedRequests : preSelectedRequests);
                    obtainmentMultipleWorkItemActionModel.ObtainmentWorkItemIDs = owiIds;

                    obtainmentMultipleWorkItemActionModel.ObtainmentActionLkpID = ddlActions.value();
                    obtainmentMultipleWorkItemActionModel.NextObtainmentStepLkpID = ddlNextSteps.value();
                    obtainmentMultipleWorkItemActionModel.NextObtainmentStepDueDate = dteDateAssigned.value();

                    // send email specific

                    var contactsGrid = $(obtainmentObject.controls.grids.GridContactEmail).data("kendoGrid");
                    var contact = contactsGrid.dataItem(contactsGrid.select());
                    //console.log(contact);

                    obtainmentActionSendEmailModel.Recepients = $(obtainmentObject.controls.textBoxes.ObtainmentEmailRecepients).val() + "|" + contact.CompanyContactEmailId;
                    obtainmentActionSendEmailModel.Cc = null;
                    obtainmentActionSendEmailModel.Subject = $(obtainmentObject.controls.textBoxes.ObtainmentEmailSubject).val();
                    obtainmentActionSendEmailModel.NoticeNumber = $(obtainmentObject.controls.textBoxes.NoticeNumber).val();
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
            var customerAction = false;
            if (actionName == "CustomerAction") {
                actionName = "CloseRequest";
                customerAction = true;
            }
                
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
                        if (selectedPhoneItem != null) {
                            obtainmentMultipleWorkItemActionModel.ObtianActionLogPhoneCallModel = FillPhoneCall(selectedPhoneItem);
                        } else {
                            $(modalId).toggleModal();
                            $(this).displayError(messages.errorMessages.NoPhoneSelected);
                            return;
                        }
                    }

                    if (customerAction) actionName = "CustomerAction";

                    if (actionName == "CloseRequest" || actionName == "CustomerAction")
                        obtainmentMultipleWorkItemActionModel.ObtainmentActionCloseRequest = FillCloseRequest(actionName);

                    
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

        function FillCloseRequest(actionName) {
            var strCustomerAction = "";
            var ddlCustomerActions = $(obtainmentObject.controls.dropdownlists.CloseRequestCustomerActionsDropDownList).data("kendoDropDownList");
            obtainmentActionCloseRequest.CustomerActionsId = ddlCustomerActions.value();
            obtainmentActionCloseRequest.ReasonCodeId = $(obtainmentObject.controls.dropdownlists.CloseRequestReasonCode).val() != "" ? $(obtainmentObject.controls.dropdownlists.CloseRequestReasonCode).val() : null;
            if (actionName == "CustomerAction")
                strCustomerAction = "Customer Action:" + ddlCustomerActions.text() + "\n" + "Reason Code:" + obtainmentActionCloseRequest.ReasonCode + "\n";
            obtainmentMultipleWorkItemActionModel.Notes = strCustomerAction + $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesCloseRequest).val();
            return obtainmentActionCloseRequest;
            }

        function FillPhoneCall(selectedPhoneItem) {
            obtainmentActionLogPhoneCallModel.LiveCall = $(obtainmentObject.controls.checkBox.LiveCall).val();
            obtainmentActionLogPhoneCallModel.CompanyContactId = selectedPhoneItem.CompanyContactId;
            obtainmentActionLogPhoneCallModel.CompanyContactPhoneId = selectedPhoneItem.CompanyContactPhoneId;
            obtainmentActionLogPhoneCallModel.InternalNotesLkpId = $(obtainmentObject.controls.dropdownlists.InternalNotes).val()!=""?$(obtainmentObject.controls.dropdownlists.InternalNotes).val():null;
            return obtainmentActionLogPhoneCallModel;
        }

        function loadSentEmail(obtainmentWorkItemId) {

            try {

                // at least one contact must be selected.
                var contactsGrid = $(obtainmentObject.controls.grids.GridContactEmail).data("kendoGrid");
                var selectedItems = contactsGrid.dataItem(contactsGrid.select());
                console.log(selectedItems);

                if (selectedItems != null) {

                    // url to invoke for existing email definition
                    var strUrl = controllerCalls.RetrieveSentEmail;

                    var data = new Object();
                    data.obtainmentWorkItemId = obtainmentWorkItemId;

                    $.ajax({
                        url: strUrl,
                        data: JSON.stringify(data),
                        type: "POST",
                        contentType: 'application/json; charset=utf-8',
                        error: function() {
                            $(this).displayError(messages.errorMessages.CannotRetrieveSentEmail);
                        },
                        success: function(response, status, xhr) {

                            // status OK
                            if (xhr.status == "200") {

                                if (data != null) {

                                    // set the next step
                                    SetNextStepForSendEmail(nextStepsValues.FirstAutomatedEmail, "SendEmail", selectedItems);

                                    // set up the form
                                    PopulateEmailActionModal(response.data, true);

                                    // display upload interface
                                    $(actionModals.SendEmail).displayModal();

                                }

                            } 

                        },
                        done: function() {
                            $(this).savedSuccessFully(messages.successMessages.Saved);
                        }
                    });

                } else {

                    // contact must be selected
                    $(this).displayError(messages.errorMessages.NoContactSelcted);


                }

            } catch (e) {

                // contact must be selected
                $(this).displayError(messages.errorMessages.NoContactSelcted);

            }

        }

        return {
            loadRequests: loadRequests,
            loadRequestsPlugin: loadRequestsPlugin,
            loadSupplierNotes: loadSupplierNotes,
            onDdlDataBound: onDdlDataBound,
            loadSentEmail : loadSentEmail
        };
    };
})(jQuery);
