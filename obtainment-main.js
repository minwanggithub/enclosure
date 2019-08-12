; (function ($) {
    if ($.fn.complibObtainment == null) {
        $.fn.complibObtainment = {};

    }
    $.fn.complibObtainment = function () {
        var obtainmentDetailObj = $("#DetailObtianment");
        var obtainmentSearchObj = $("#ObtianmentWFGrid");
        var obtainmentDetailWorkFlowObj = $("#ObtianmentWFDetails");
        var obtianmentDetailModals = $("#ObtainmentDetailModals");
        var obtainmentSuperEmailModal = $("#SuperMailPopUpModal");
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
                    CancelLogExternalEmailButton: "#btnCancelLogExternalEmail",
                    LogExternalEmailSaveButton: "#btnSaveExternalEmail",
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
                    CloseRequestCancelButton: "#btnCancelCloseRequest",
                    SuperSupplierEmailButton: "#btnSuperMail",
                    btnCancelSuperEmailButton: "#btnCancelSuperEmail",
                    btnSendSuperEmailButton: "#btnSendSuperEmail",
                    btnCancelConfirmNotAvailable: "#btnCancelConfirmNotAvailable",
                    btnSaveConfirmNotAvailable: "#btnSaveConfirmNotAvailable"

                },
                textBoxes: {
                    AccountId: "#txtAccountId",
                    NumberOfItemsTextBox: "#numberOfItems",
                    ObtainmentActionNotes: "#txtObtainmentActionNotes",
                    ObtainmentActionNotesCloseRequest: "#txtObtainmentActionNotesCloseRequest",
                    ObtainmentEmailRecepients: "#txtObtainmentEmailSendEmailTo",
                    ObtainmentEmailSubject: "#txtObtainmentEmailSendEmailSubject",
                    NoticeNumberSearch: "#NoticeNumber",
                    NoticeNumber: "#txtNoticeNum",
                    ObtainmentEmailBody: "#txtObtainmentEmailSendEmailBody",
                    SuperEmailSubject: "#txtSuperEmailSubject",
                    SuperObtainmentEmailBody: "#txtSuperEmailBody",
                    SupplierId: "#txtSupplierId",
                    NotificationRecepient: "#txtNotificationRecepient",
                    ObtainmentActionNotesConfirmNotAvailable:"#txtObtainmentActionNotesConfirmNotAvailable"
                    
                },
                dateTime: {
                    NextStepDueDate: "#dteNextStepDueDate",
                    SuperEmailNextStepDueDate: "#dteSuperEmailNextStepDueDate"
                },
                dropdownlists: {
                    TeamsDropDownList: "#ddlTeams",
                    PrefLangDropDownList: "#ddlContactPreferredLanguage",
                    DocumentTypeDropDownList: "#ddlDocumentType",
                    LockTypeDropDownList: "#ddlLockType",
                    OSAssignedToId: "#ddlAssignedToId",
                    NextStepDropDownList: "#ddlNextStep",
                    ActionsDropDownList: "#ddlAction",
                    NextStepsDropDownList: "#ddlNextSteps",
                    InternalNotes: "#ddlInternalNotes",
                    CloseRequestCustomerActionsDropDownList: "#ddlCustomerActions",
                    ConfirmNotAvailableDropDownList: "#ddlConfirmNotAvailable",
                    CloseRequestReasonCode: "#ddlReasonCode",
                    SupplierContactList: "#ddlSupplierContactList",
                    SuperEmailRecepient: "#ddlSuperEmail",
                    SuperEmailNextStep: "#ddlSuperEmailNextStep",
                    EmailTargets: "#ddlEmailTarget"
                },
                labels: { ContactName: "#lblContactName" },
                checkBox: {
                    LiveCall: "#chkLiveCall",
                    IncludeInboundResponses: "#chkOnlyWithInboundResponses",
                    InsertProductsList: "#chkInsertProductsList",
                    InsertSuppliersLink: "#chkInsertSuppliersLink",
                    PreviewEmail: "#chkPreviewEmail"
                }
            }
        }
        var actionModals = {
            FollowUp: "#mdlFollowUp",
            LogExternalEmail: "#mdlLogExternalEmail",
            LogWebSearch: "#mdlLogWebSearch",
            LogPhoneCall: "#mdlLogPhoneCall",
            SendEmail: "#mdlSendEmail",
            FlagDiscontinued: "#mdlFlagDiscontinued",
            NotRequired: "#mdlNotRequired",
            CloseRequest: "#mdlCloseRequest",
            ViewHistory: "#mdlViewHistory",
            AccountInfo: "#mdlViewAccount",
            SuperMail: "#mdlSuperEmail",
            ConfirmNotAvailable: "#mdlConfirmNotAvailable"
        };

        var kendoWindows = { ViewHistory: "#supplierSearchWindow", ViewAccount: "#accountSearchWindow" };
        var controllerCalls = {
            SearchRequests: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SearchObtainmentRequests",
            SaveSearchSettings: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveSearchSettings",
            SaveObtainmentWorkItemAction: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentWorkItemAction",
            SaveLogExternalEmailAction: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveLogExternalEmailAction",
            ObtainmentWorkItemLoadHistory: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/ObtainmentWorkItemLoadHistoryContent",
            SendEmail: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SendEmail",
            SendSuperEmail: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SendSuperEmail",
            GenerateNoticeNum: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GenerateNoticeNum",
            RetrieveSentEmail: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/RetrieveSentEmail",
            GetNoticeNumberAndNethubLinks: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetNoticeNumberAndNethubLinks",
            GetObtainmentAccountInfo: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetObtainmentAccountInfo",
            SaveEmailAttachment: GetEnvironmentLocation() + "/Operations/ObtainmentWorkflow/SaveEmailAttachment",
            RemoveEmailAttachment: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveEmailAttachment",
            GetContactList: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetContactList",
            GetContactPhoneList: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetContactPhoneList",
            GetSupplierPortalUrl: GetEnvironmentLocation() + "/Operations/Company/GetCompliSupplierPortalUrl",
            SaveConfirmNotAvailable: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveConfirmNotAvailable",

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
                SuperEmailDirection: "<br/><b>Please follow <a href='*'>this link</a> to submit your document. </b> <br/><br/>"
            },
            confirmationMessages: {
                UnAssigneRequests: "unassign these request item(s)",
                AssignRequests: "assign these request item(s)",
                OverwriteComments: "Overwrite previous customer action comments?"
            },
            errorMessages: {
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
                SuperEmailTargetNotSelected: "The targeted Obtainment type must be specified for a Super Email.",
                NoNonSDSSubstitutionToken:"A ||SupplierPortal(link text)|| token is mandatory in the super email body.",
                NoSDSSubstitutionToken: "A ||ProductsList|| token is mandatory in the SDS super email body.",
                EmailBodyMissing: "Email body is missing.",
                NextStepMissing: "Obtainment next step has not been selected.",
                OneOrMoreSelectionsNotRevisions: "One or more of the selected item(s) are not valid. The 'Save as Current' action can only be performed on Revisions.",
                DiscontinuedActionForRevisionOnly: "One or more of the selected item(s) are new obtainment. The 'Flag Discontinued' action can only be performed on Revisions.",
                InvalidSubstitutionTokens: "Invalid or incorrect substitution tokens. ",
                NotificationRecepientMissing: "Super email notification recipient missing.",
                NoObtainmentWorkItemSelected: "No obtainment work item has been selected selected.",
                HasEmbeddedKeywords: "Email body has illegal keyword(s).",
                SubjectHasEmbeddedKeywords: "Email subject has illegal keyword(s).",
            }
        };

        var obtainmentWorkLoadSearchResultModel = {
            TeamID: 0,
            ContactPreferredLanguageId: 0,
            DocumentTypeId: 0,
            LockTypeId: 0,
            AssignedToId: 0,
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
            InternalNotesLkpId: null
        };

        var obtainmentActionCloseRequest = {
            ReasonCodeId: null,
            CustomerActionsId: null
        };

        var obtainmentActionSendEmailModel = {
            Recepients: null,
            Cc: null,
            Subject: null,
            Body: null,
            Files: null,
            AddSupplierPortalLink: null,
            AddProductsList: null
        };

        var superEmailModel = {
            Recepients: null,
            Subject: null,
            MessageBody: null,            
            SupplierId: null,
            NextStepId: null,
            DueDate: null,
            NotificationRecepient: null
        };

        var loadRequestsPlugin = function () {
            initializeMultiSelectCheckboxes(obtainmentDetailWorkFlowObj);
        }

        var loadRequests = function () {
            var grid = $(obtainmentObject.controls.grids.GridRequests).data("kendoGrid");
            grid.dataSource.read();
        };

        var loadSupplierNotes = function () {
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
            obtainmentWorkLoadSearchResultModel.ContactPreferredLanguageId = drpLanguage.value() == "" ? 0 : drpLanguage.value();
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
            $(obtainmentObject.controls.textBoxes.AccountId).val('');
            $(obtainmentObject.controls.textBoxes.SupplierId).val('');
            $(obtainmentObject.controls.checkBox.IncludeInboundResponses).removeAttr('checked');

            // Super Email Button emabled by default.
            //$(obtainmentObject.controls.buttons.SuperSupplierEmailButton).enableControl(false);
            //$(obtainmentObject.controls.dropdownlists.EmailTargets).enableControl(false);
            //var ddl = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.EmailTargets).data("kendoDropDownList");
            //ddl.value(null);
            //ddl.enable(false);

        });

        obtainmentSearchObj.on("click", obtainmentObject.controls.checkBox.IncludeInboundResponses, function () {
            $(obtainmentObject.controls.buttons.SearchRequestsButton).click();
        });



        obtainmentSearchObj.on("click", obtainmentObject.controls.buttons.SearchRequestsButton, function () {

            //Based on TRECOMPLI-1302, if supplier Id has value, then it will clear the rest filter and do super mail
            //Above function was overwritten by TRECOMPLI-2385
            //var supplierFilter = $(obtainmentObject.controls.textBoxes.SupplierId).val();
            //if (supplierFilter != "")
            //{
            //    $(obtainmentObject.controls.buttons.ClearRequestSearchButton).click();
            //    $(obtainmentObject.controls.textBoxes.SupplierId).val(supplierFilter);
            //}


            var drpTeams = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.TeamsDropDownList).data("kendoDropDownList");
            var drpLang = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.PrefLangDropDownList).data("kendoDropDownList");
            var drpDocType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.DocumentTypeDropDownList).data("kendoDropDownList");
            var drpLockType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.LockTypeDropDownList).data("kendoDropDownList");
            var drpAssignedToType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.OSAssignedToId).data("kendoDropDownList");
            var drpNextStep = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.NextStepDropDownList).data("kendoDropDownList");

            //create requestSearchModel to be passed to the controller
            obtainmentWorkLoadSearchResultModel.TeamID = drpTeams.value() == "" ? 0 : drpTeams.value();
            obtainmentWorkLoadSearchResultModel.ContactPreferredLanguageId = drpLang.value() == "" ? 0 : drpLang.value();
            obtainmentWorkLoadSearchResultModel.DocumentTypeId = drpDocType.value() == "" ? 0 : drpDocType.value();
            obtainmentWorkLoadSearchResultModel.LockTypeId = drpLockType.value() == "" ? 0 : drpLockType.value();
            obtainmentWorkLoadSearchResultModel.AssignedToId = drpAssignedToType.value() == "" ? 0 : drpAssignedToType.value();
            obtainmentWorkLoadSearchResultModel.NextStepId = drpNextStep.value() == "" ? 0 : drpNextStep.value();
            obtainmentWorkLoadSearchResultModel.NoticeNumber = $(obtainmentObject.controls.textBoxes.NoticeNumberSearch).val();
            obtainmentWorkLoadSearchResultModel.SupplierId = $(obtainmentObject.controls.textBoxes.SupplierId).val();
            obtainmentWorkLoadSearchResultModel.AccountId = $(obtainmentObject.controls.textBoxes.AccountId).val();
            obtainmentWorkLoadSearchResultModel.IncludeInboundResponse = $(obtainmentObject.controls.checkBox.IncludeInboundResponses).is(":checked");


            obtainmentWorkLoadSearchResultModel.HasFilter = obtainmentWorkLoadSearchResultModel.TeamID
                + obtainmentWorkLoadSearchResultModel.ContactPreferredLanguageId
                + obtainmentWorkLoadSearchResultModel.DocumentTypeId
                + obtainmentWorkLoadSearchResultModel.LockTypeId
                + obtainmentWorkLoadSearchResultModel.AssignedToId
                + obtainmentWorkLoadSearchResultModel.NextStepId
                + (obtainmentWorkLoadSearchResultModel.NoticeNumber != "") ? "1" : "0"
                + obtainmentWorkLoadSearchResultModel.AccountId;

            if (obtainmentWorkLoadSearchResultModel.HasFilter > 0 || obtainmentWorkLoadSearchResultModel.SupplierId > 0) {
                DisableEnableButtons(false);

                kendo.ui.progress(obtainmentDetailObj, true);
                $(this).ajaxCall(controllerCalls.SearchRequests, { searchCriteria: JSON.stringify(obtainmentWorkLoadSearchResultModel) })
                    .success(function (data) {
                        obtainmentDetailObj.html(data);
                        DisableEnableButtons(true);
                    }).error(
                    function () {
                        $(this).displayError(messages.errorMessages.GeneralError);
                    });
            }
            else
                $(this).displayError(messages.errorMessages.SelectFilter);
        });

        function getOWIDFromGrid() {

            // determine if a row has been selected in the search grid.
            var resultsGrid = $(obtainmentObject.controls.grids.GridRequests).data("kendoGrid");
            var selectedItems = resultsGrid.dataItem(resultsGrid.select());

            if (selectedItems != null) {
                return selectedItems.ObtainmentWorkItemID;
            }

            return null;

        }

        // SUPER EMAIL BUTTON CLICK HANDLER
        obtainmentSearchObj.on("click", obtainmentObject.controls.buttons.SuperSupplierEmailButton, function () {

            // ---- reset event handlers 
            $(obtainmentObject.controls.buttons.btnCancelSuperEmailButton).off("click");
            $(obtainmentObject.controls.buttons.btnSendSuperEmailButton).off("click");
            $(obtainmentObject.controls.dropdownlists.EmailTargets).data("kendoDropDownList").unbind("change");

            // ---- wire modal close
            $(obtainmentObject.controls.buttons.btnCancelSuperEmailButton).click(function () {
                $(actionModals.SuperMail).toggleModal();
            });

            // ---- wire email target
            $(obtainmentObject.controls.dropdownlists.EmailTargets).data("kendoDropDownList").bind("change", function () {

                // determine which target was selected 1 = non-sds, 2 = sds
                var emailTarget = $(obtainmentObject.controls.dropdownlists.EmailTargets).val();

                // reset product options
                $(obtainmentObject.controls.checkBox.InsertProductsList.replace("#", ".")).prop("checked", false);
                $(obtainmentObject.controls.checkBox.InsertProductsList.replace("#", ".")).prop("disabled", true);
                $("[for='" + obtainmentObject.controls.checkBox.InsertProductsList.replace("#", "") + "']").css({ "opacity": ".5" });

                // reset supplier options
                $(obtainmentObject.controls.checkBox.InsertSuppliersLink.replace("#", ".")).prop("checked", false);
                $(obtainmentObject.controls.checkBox.InsertSuppliersLink.replace("#", ".")).prop("disabled", true);
                $("[for='" + obtainmentObject.controls.checkBox.InsertSuppliersLink.replace("#", "") + "']").css({ "opacity": ".5" });

                // SDS
                if (emailTarget == "2") {

                    // enable product list option
                    $(obtainmentObject.controls.checkBox.InsertProductsList.replace("#", ".")).prop("disabled", false);
                    $(obtainmentObject.controls.checkBox.InsertProductsList.replace("#", ".")).prop("checked", true);

                    $("[for='" + obtainmentObject.controls.checkBox.InsertProductsList.replace("#", "") + "']").css({ "opacity": "1" });

                }
                // Non-SDS
                else if (emailTarget == "1") {

                    // default
                    $(obtainmentObject.controls.checkBox.InsertProductsList.replace("#", ".")).prop("checked", true);
                    $(obtainmentObject.controls.checkBox.InsertSuppliersLink.replace("#", ".")).prop("checked", true);

                    $(obtainmentObject.controls.checkBox.InsertProductsList.replace("#", ".")).prop("disabled", false);
                    $(obtainmentObject.controls.checkBox.InsertSuppliersLink.replace("#", ".")).prop("disabled", false);

                    $("[for='" + obtainmentObject.controls.checkBox.InsertProductsList.replace("#", "") + "']").css({ "opacity": "1" });
                    $("[for='" + obtainmentObject.controls.checkBox.InsertSuppliersLink.replace("#", "") + "']").css({ "opacity": "1" });

                }

            });

            // ---- wire super email send
            $(obtainmentObject.controls.buttons.btnSendSuperEmailButton).click(function () {

                // -- email target
                var emailTarget = $(obtainmentObject.controls.dropdownlists.EmailTargets).val();
                var hasTarget = !(emailTarget == '' || emailTarget == 'Select One')

                // recepient selected ?
                var recepient = $(obtainmentObject.controls.dropdownlists.SuperEmailRecepient).val();
                var hasRecepient = !(recepient == '' || recepient == 'Select One')

                // next step selected ?
                var nextStep = $(obtainmentObject.controls.dropdownlists.SuperEmailNextStep).val();
                var hasNextStep = !(nextStep == '' || nextStep == 'Select One')

                // notice number selected ?
                var subject = $(obtainmentObject.controls.textBoxes.SuperEmailSubject).val() + "";
                var hasNoticeNumber = (subject.toUpperCase().indexOf("||NOTICENUMBER||") >= 0);

                // email body
                var body = $(obtainmentObject.controls.textBoxes.SuperObtainmentEmailBody).data("kendoEditor").value() + "";
                var hasBody = (body.trimRight() != "");

                // email preview mode ?
                var isPreview = $(obtainmentObject.controls.checkBox.PreviewEmail).is(":checked");

                // notification
                var notificationRecepient = ($(obtainmentObject.controls.textBoxes.NotificationRecepient).val() + "");
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
                var emailBodyHasKeywords = (body.toUpperCase().indexOf("NETHUB") >= 0);
                var emailSubjectHasKeywords = (subject.toUpperCase().indexOf("NETHUB") >= 0);

                // validation
                if (!hasTarget || !hasRecepient || !hasNoticeNumber || !hasBody || !hasNextStep || !hasNotificationRecepient
                        || emailBodyHasKeywords || emailSubjectHasKeywords) {

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
                    if (emailBodyHasKeywords) message += messages.errorMessages.HasEmbeddedKeywords + "<br>";
                    if (emailSubjectHasKeywords) message += messages.errorMessages.SubjectHasEmbeddedKeywords + "<br>";

                    var prompt = {};
                    prompt.header = "Invalid or incomplete email definition.";
                    prompt.message = message;

                    DisplayErrorMessageInPopUp(prompt, function () {
                        // do nothing
                    });

                }
                else {

                    DeliverSuperMain(emailTarget);

                }
            });


            // row clicked on
            var obtainment = selectedSuperMailSupplierId();
            console.log(obtainment);

            // minimum data available
            if (obtainment != null && obtainment.supplierId != null) {

                $("#superEmailSupplier").text(obtainment.supplierName);

                var hasInboundResponses = (obtainment.responses == "Yes");
                
                // hide all controls
                $("#hasNoInboundResponses").hide();
                $("#hasInboundResponses").hide();
                $("#btnSendSuperEmail").hide();

                if (hasInboundResponses) {

                    $("#hasInboundResponses").show();
                    $("#superEmailSupplier").parent().parent().nextAll().hide();

                    var url = GetEnvironmentLocation() + '/Operations/ObtainmentResponse/InboundResponse?supplierId=' + obtainment.supplierId + "&supplierName=" + obtainment.supplierName;
                    $("#linkToInboundResponse").attr("href", url);
                    
                }
                else {

                    $("#hasNoInboundResponses").show();
                    $("#btnSendSuperEmail").show();
                    $("#superEmailSupplier").parent().parent().nextAll().show();

                }

                // ---- reset all controls

                // reload email contacts
                $(obtainmentObject.controls.dropdownlists.SuperEmailRecepient).data("kendoDropDownList").dataSource.read();
                $(obtainmentObject.controls.dropdownlists.SuperEmailRecepient).data("kendoDropDownList").value(-1);
                $(obtainmentObject.controls.dropdownlists.EmailTargets).data("kendoDropDownList").value(-1);

                // reset controls of the super email
                $(obtainmentObject.controls.textBoxes.SuperEmailSubject).val("");
                $(obtainmentObject.controls.textBoxes.SuperObtainmentEmailBody).data("kendoEditor").value("");
                $(obtainmentObject.controls.dropdownlists.SuperEmailNextStep).data("kendoDropDownList").value(-1);

                // disable product and supplier link and list inserts
                $(obtainmentObject.controls.checkBox.InsertProductsList.replace("#", ".")).prop("checked", false);
                $(obtainmentObject.controls.checkBox.InsertProductsList.replace("#", ".")).prop("disabled", true);
                $("[for='" + obtainmentObject.controls.checkBox.InsertProductsList.replace("#", "") + "']").css({ "opacity": ".5" });

                $(obtainmentObject.controls.checkBox.InsertSuppliersLink.replace("#", ".")).prop("checked", false);
                $(obtainmentObject.controls.checkBox.InsertSuppliersLink.replace("#", ".")).prop("disabled", true);
                $("[for='" + obtainmentObject.controls.checkBox.InsertSuppliersLink.replace("#", "") + "']").css({ "opacity": ".5" });

                // display 
                $(actionModals.SuperMail).displayModal();


            }
            else {
                $(this).displayError(messages.errorMessages.NoObtainmentWorkItemSelected);
            }


        });

        obtainmentSearchObj.on("input propertychange paste keyup", obtainmentObject.controls.textBoxes.SupplierId, function (e1) {

            // <Enter> pressed ?
            var code = (e1.keyCode ? e1.keyCode : e1.which);

            if (code == 13) {
                $(obtainmentObject.controls.buttons.SearchRequestsButton).click();
            }

            //if ($(obtainmentObject.controls.textBoxes.SupplierId).val() == "") {
            //    $(obtainmentObject.controls.buttons.SuperSupplierEmailButton).enableControl(false);
            //    //$(obtainmentObject.controls.dropdownlists.EmailTargets).enableControl(false);
            //    //$("#divSearchSection " + obtainmentObject.controls.dropdownlists.EmailTargets).data("kendoDropDownList").enable(false);
            //}

        });

        obtainmentDetailWorkFlowObj.on("click", obtainmentObject.controls.buttons.ActionLoadModal, function () {            
            //if (hasNoticeNumbers)
            //    $(this).displayError(messages.errorMessages.ResponseReceived);
            //else
                ShowActionModals();
        });


        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.FollowUpCancelButton, function () {
            $(actionModals.FollowUp).toggleModal();
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.CancelLogExternalEmailButton, function () {
            $(actionModals.LogExternalEmail).toggleModal();
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.LogExternalEmailSaveButton, function () {
            SaveObtainmentNextSteps(controllerCalls.SaveLogExternalEmailAction, "LogExternalEmail", actionModals.LogExternalEmail);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.btnCancelConfirmNotAvailable, function () {
            $(actionModals.ConfirmNotAvailable).toggleModal();

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

            fUploadlib.abandonAttachments(function (action) {
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
            if ($("#dvCustomerAction").is(":visible"))
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

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.btnSaveConfirmNotAvailable, function () {
            SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "ConfirmNotAvailable", actionModals.ConfirmNotAvailable);
        });

        
        obtianmentDetailModals.on("change", obtainmentObject.controls.dropdownlists.CloseRequestCustomerActionsDropDownList, function () {

            var txtNotes = $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesCloseRequest);
            var selNotes = $(obtainmentObject.controls.dropdownlists.CloseRequestCustomerActionsDropDownList).data("kendoDropDownList");
            
            $(obtainmentObject.controls.labels.NotesLabel).css("display", "inline");
            $(obtainmentObject.controls.textBoxes.NotesTextBox).css("display", "inline");

            // already entered text
            var txtCustomerAction = txtNotes.val();
            var emptyCustomerAction = (txtCustomerAction.replace(/ /g, "") == "");

            // "fix" selected customer action
            var selCustomerAction = selNotes.text();
            if (selCustomerAction == "Select One")
                selCustomerAction = "";
            else
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
                        $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesCloseRequest).val(selCustomerAction);
                    }, function () {
                        // do nothing
                    });

                }
                else
                    $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesCloseRequest).val(selCustomerAction);

            }
            else {
                $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesCloseRequest).val(selCustomerAction);
            }


        });

        obtianmentDetailModals.on("change", obtainmentObject.controls.dropdownlists.ConfirmNotAvailableDropDownList, function () {

            var txtNotes = $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesConfirmNotAvailable);
            var selNotes = $(obtainmentObject.controls.dropdownlists.ConfirmNotAvailableDropDownList).data("kendoDropDownList");

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
                        $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesConfirmNotAvailable).val(selCustomerAction);
                    }, function () {
                        // do nothing
                    });

                }
                else
                    $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesConfirmNotAvailable).val(selCustomerAction);

            }
            else {
                $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesConfirmNotAvailable).val(selCustomerAction);
            }


        });

        obtainmentDetailWorkFlowObj.on("click", ".showHistory", function (e) {
            e.preventDefault();
            ShowHistory(this.id, null);
        });

        obtainmentDetailWorkFlowObj.on("click", ".showHistorySupplier", function (e) {
            e.preventDefault();
            ShowHistory(null, this.id);
        });

        obtainmentDetailWorkFlowObj.on("click", ".showAccount", function (e) {
            e.preventDefault();
            ShowAccount(this.id, null);
        });

        obtainmentDetailWorkFlowObj.on("dblclick", '.k-state-selected', function (e) {

            var grid = $(obtainmentObject.controls.grids.GridDetailRequests).data("kendoGrid");
            var x = grid.dataItem(grid.select());

            var url = GetEnvironmentLocation() + "/Operations/XReference/XReferenceMain?productId=" + x.ProductID;
            window.open(url, '_blank');

        });

        var enableSuperEmail = function () {
            var drpTeams = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.TeamsDropDownList).data("kendoDropDownList");
            var drpLang = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.PrefLangDropDownList).data("kendoDropDownList");
            var drpDocType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.DocumentTypeDropDownList).data("kendoDropDownList");
            var noticeNumber = $("#divSearchSection " + obtainmentObject.controls.textBoxes.NoticeNumberSearch).val();
            var drpLockType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.LockTypeDropDownList).data("kendoDropDownList");
            var drpAssignedToType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.OSAssignedToId).data("kendoDropDownList");
            var drpNextStep = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.NextStepDropDownList).data("kendoDropDownList");
            var accountId = $("#divSearchSection " + obtainmentObject.controls.textBoxes.AccountId).val();
            var includeInboundReceived = $("#divSearchSection " + obtainmentObject.controls.checkBox.IncludeInboundResponses).is(":checked");

            //create requestSearchModel to be passed to the controller
            var hasValue = (drpTeams.value() == "") &&
                (drpLang.value() == "") &&
                (drpDocType.value() == "") &&
                (drpLockType.value() == "") &&
                (drpAssignedToType.value() == "") &&
                (drpNextStep.value() == "") &&
                (noticeNumber == "") &&
                (accountId == "") &&
                !includeInboundReceived;
            return hasValue;
        }

        function parse_URL(url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length,
                        i = 0,
                        s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        }

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

        function ShowMessage(message) {
            SubError(message);
        }

        var superEmailSendInProgress = false;

        function DeliverSuperMain(emailTarget) {

            // super email model
            superEmailModel.Recepients = $(obtainmentObject.controls.dropdownlists.SuperEmailRecepient).val()
            superEmailModel.Subject = $(obtainmentObject.controls.textBoxes.SuperEmailSubject).val();            
            superEmailModel.MessageBody = $(obtainmentObject.controls.textBoxes.SuperObtainmentEmailBody).data("kendoEditor").value() + "";
            superEmailModel.SupplierId = $(obtainmentObject.controls.textBoxes.SupplierId).val();
            superEmailModel.NextStepId = $(obtainmentObject.controls.dropdownlists.SuperEmailNextStep).val();
            superEmailModel.DueDate = ($(obtainmentObject.controls.dateTime.SuperEmailNextStepDueDate).data("kendoDatePicker").value() + "").substring(0, 10);
            superEmailModel.AddProductsList = $(obtainmentObject.controls.checkBox.InsertProductsList.replace("#", ".")).is(":checked");
            superEmailModel.AddSupplierPortalLink = $(obtainmentObject.controls.checkBox.InsertSuppliersLink.replace("#", ".")).is(":checked");
            superEmailModel.NotificationRecepient = $(obtainmentObject.controls.textBoxes.NotificationRecepient).val();
            superEmailModel.PreviewEmail = $(obtainmentObject.controls.checkBox.PreviewEmail).is(":checked");

            superEmailModel.EmailTarget = emailTarget;

            $(this).ajaxCall(controllerCalls.SendSuperEmail, superEmailModel)
                .success(function (data) {

                })
                .complete(function () {

                    var prompts = {};

                    prompts.header = "Super Email Queued.";
                    
                    if (superEmailModel.PreviewEmail) {
                        prompts.message = "The super email request has been queued for processing.<br>" +
                            "A preview summary will be emailed to " + superEmailModel.NotificationRecepient + " upon completion.";
                    } else {


                        prompts.message = "The super email request has been queued for processing.<br>" +
                            "A summary will be emailed to " + superEmailModel.NotificationRecepient + " upon completion.<br>";

                        // reset fields
                        $(obtainmentObject.controls.checkBox.PreviewEmail).prop("checked", true);

                    }

                    $(actionModals.SuperMail).toggleModal();

                    DisplayErrorMessageInPopUp(prompts, function () {
                        $(actionModals.SuperMail).toggleModal();
                    });

                });

        }

        function ShowHistory(obtainmentWorkId, supplierId) {
            $(this).ajaxCall(controllerCalls.ObtainmentWorkItemLoadHistory, { obtainmentWorkID: obtainmentWorkId, supplierId: supplierId })
               .success(function (data) {
                   $("#dvRequestItemHistory").html(data);
                   $(kendoWindows.ViewHistory).data("kendoWindow").center().open();
                   $("div.k-widget.k-window").css("top", "20px");
               }).error(function () {
                   $(this).displayError(messages.errorMessages.GeneralError);
               });
        }

        function ShowAccount(obtainmentWorkId) {
            $(this).ajaxCall(controllerCalls.GetObtainmentAccountInfo, { obtainmentWorkID: obtainmentWorkId })
              .success(function (data) {
                  $("#dvAccountInformation").html(data);
                  $(kendoWindows.ViewAccount).data("kendoWindow").center().open();
                  $("div.k-widget.k-window").css("top", "20px");
              }).error(function () {
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
                
                // set the check boxes
                $(obtainmentObject.controls.checkBox.InsertProductsList).removeAttr("checked");
                $(obtainmentObject.controls.checkBox.InsertSuppliersLink).removeAttr("checked");
                $("[for='" + obtainmentObject.controls.checkBox.InsertSuppliersLink.replace("#", "") + "']").css({ "opacity": "1" });

                $(obtainmentObject.controls.checkBox.InsertSuppliersLink).removeAttr("disabled");
                
                if (data.sdsObtainments) {
                    $(obtainmentObject.controls.checkBox.InsertProductsList).prop("checked", true);

                    $(obtainmentObject.controls.checkBox.InsertSuppliersLink).prop("disabled", true);
                    $("[for='" + obtainmentObject.controls.checkBox.InsertSuppliersLink.replace("#", "") + "']").css({ "opacity": ".5" });
                }

                if (!data.sdsObtainments) {
                    $(obtainmentObject.controls.checkBox.InsertSuppliersLink).prop("checked", true);
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


        function ShowActionModals() {

            // clear text
            $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesConfirmNotAvailable).val("");
            $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesCloseRequest).val("");

            var ddlActions = $(obtainmentObject.controls.dropdownlists.ActionsDropDownList).data("kendoDropDownList");

            if ($(obtainmentObject.controls.textBoxes.NumberOfItemsTextBox).val().replace(/ /g, "").length == 0) {
                $(this).displayError(messages.errorMessages.NoItemsSelected);
                return;
            }

            if (ddlActions.value() == obtainmentActions.Empty) {
                $(this).displayError(messages.errorMessages.NoActionSelected);
                return;
            }

            var newSelected = false;
            var grid = $("#gdDetailRequests").data("kendoGrid");
            $.each(grid._data, function () {
                if (this['IsSelected']) {
                    if ((this['OWType']).toUpperCase().indexOf("NEW") >= 0) {
                        newSelected = true;
                    }
                }
            });

            if (ddlActions.value() == obtainmentActions.ConfirmAsCurrent && newSelected) {
                    $(this).displayError(messages.errorMessages.OneOrMoreSelectionsNotRevisions);
                    return;
            }
            if (ddlActions.value() == obtainmentActions.FlagDiscontinued && newSelected) {
                $(this).displayError(messages.errorMessages.DiscontinuedActionForRevisionOnly);
                return;
            }

            switch (ddlActions.value()) {
                case obtainmentActions.LogExternalEmail:
                    SetNextStep(nextStepsValues.Empty, "LogExternalEmail", true);
                    $(actionModals.LogExternalEmail).displayModal();
                    break;
                case obtainmentActions.SetFollowUp:
                    SetNextStep(nextStepsValues.FirstPhoneCall, "FollowUp", true);
                    $(actionModals.FollowUp).displayModal();
                    break;
                case obtainmentActions.LogPhoneCall:
                    var owid = $("#hdnOwid").val().replace("Owid: ", "");
                    var companyid = owid.split('-')[0];
                    var contactgrid = $(obtainmentObject.controls.grids.GridSupplier).data("kendoGrid");

                    try {

                        var selectedItem = contactgrid.dataItem(contactgrid.select());

                        $(this).ajaxCall(controllerCalls.GetContactList, { supplierid: companyid })
                            .success(function (data) {
                                //update contact list
                                $("#ddlSupplierContactList").kendoDropDownList({
                                    "dataSource": data,
                                    "dataTextField": "Text",
                                    "autoBind": false,
                                    "dataValueField": "Value",
                                    "optionLabel" : "Select",
                                    "change": onChangeContactName,
                                });

                                if (selectedItem != null) {
                                    var ddlContactList = $(obtainmentObject.controls.dropdownlists.SupplierContactList).data("kendoDropDownList");
                                    ddlContactList.value(selectedItem.SupplierContactName);
                                }

                            })
                            .error(function () {
                                $(this).displayError(messages.errorMessages.GeneralError);
                            });


                        if (selectedItem != null) {
                            var phoneContactGrid = $(obtainmentObject.controls.grids.GridContactPhone).data("kendoGrid");
                            phoneContactGrid.dataSource.read();
                            phoneContactGrid.refresh();
                            SetNextStep(nextStepsValues.FollowUpPhoneCall, "PhoneCall", true);
                            $(actionModals.LogPhoneCall).displayModal();

                        } else
                            $(this).displayError(messages.errorMessages.NoContactSelcted);

                    }
                    catch (e) {
                        $(this).displayError(messages.errorMessages.NoContactSelcted);
                    }

                    break;

                case obtainmentActions.LogWebSearch:
                    SetNextStep(nextStepsValues.FirstAutomatedEmail, "LogWebSearch", true);
                    $(actionModals.LogWebSearch).displayModal();
                    break;

                case obtainmentActions.SendEmail:

                    try {

                        // at least one contact must be selected.
                        var contactsGrid = $(obtainmentObject.controls.grids.GridContactEmail).data("kendoGrid");
                        var selectedItems = contactsGrid.dataItem(contactsGrid.select());

                        if (selectedItems == null || selectedItems.length == 0) {
                            $(this).displayError(messages.errorMessages.NoContactSelcted);
                            break;
                        }

                        if (selectedItems != null) {

                            // url to invoke for notice number 
                            var strUrl = controllerCalls.GetNoticeNumberAndNethubLinks;
                            var cdata = new Object();
                            cdata.owid = $("#hdnOwid").val().replace("Owid: ", "");
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

                                    // valid selections ?
                                    if (!data.success) {
                                        $(this).displayError(data.message);
                                        return;
                                    }

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

                case obtainmentActions.ConfirmNotAvailable:
                    SetNextStep(nextStepsValues.Completed, "ConfirmNotAvailable", false);
                    $("#lblTitle").text("Confirm not available");
                    $("#dvConfirmNotAvailable").show();
                    $(actionModals.ConfirmNotAvailable).displayModal();
                    break;
               }
        }

        function onChangeContactName() {

            var owid = $("#hdnOwid").val().replace("Owid: ", "");
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

                    itemsChecked = selectedRequests.length;
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

                itemsChecked = selectedRequests.length;
                UpdateNumberOfItemsChecked(itemsChecked);

            });

            
        }

        function UpdateNumberOfItemsChecked(numberOfItems) {
            
            if (numberOfItems > 0)
                $(obtainmentObject.controls.textBoxes.NumberOfItemsTextBox).text("(" + numberOfItems + ")").val(numberOfItems).trigger("change");
            else
            {

                // clear out number of items selected
                $(obtainmentObject.controls.textBoxes.NumberOfItemsTextBox).val("").trigger("change");

                // remove any previously selected rows
                while (selectedRows.length > 0) selectedRows.pop();

                // clean this out too
                while (selectedRequests.length > 0) selectedRequests.pop();

                // un-select highlighted rows
                var grid = $(".chkMasterMultiSelect").parents('.k-grid:first');
                $('tr', grid).each(function () {
                    var tr = $(this);
                    tr.removeClass('k-state-selected');
                });

                // clear out master selector
                $(".chkMasterMultiSelect").prop("checked", false);
                
            }
        }

        function onDdlDataBound(e) {
            $(".unsupport").parent().click(false);
        }

        var onLoadChanged =  function (e) {
            var count = $("#gdRequests").data("kendoGrid").dataSource.total();
            //alert(count);

            var enable = (count > 0 && $(obtainmentObject.controls.textBoxes.SupplierId).val() != "");
            //$(obtainmentObject.controls.buttons.SuperSupplierEmailButton).enableControl(enable);
            //$(obtainmentObject.controls.dropdownlists.EmailTargets).enableControl(enable);
            //$("#divSearchSection " + obtainmentObject.controls.dropdownlists.EmailTargets).data("kendoDropDownList").enable(enable);
        }

        var onObtainmentReqeustDataBound = function (e) {
            var count = $("#gdRequests").data("kendoGrid").dataSource.total();
            var enable = (count > 0 && $(obtainmentObject.controls.textBoxes.SupplierId).val() != "") && enableSuperEmail();

            //$(obtainmentObject.controls.buttons.SuperSupplierEmailButton).enableControl(enable);
            //$(obtainmentObject.controls.dropdownlists.EmailTargets).enableControl(enable);
            //$("#divSearchSection " + obtainmentObject.controls.dropdownlists.EmailTargets).data("kendoDropDownList").enable(enable);
            
        }

        function SendEmailAndSaveObtainmentNextStep(strUrl, modalId) {

            // disable button after first click, re-enable after process completes    
            $(obtainmentObject.controls.buttons.SendEmailButton).css("visibility", "hidden");

            var valid = true;

            var body = $(obtainmentObject.controls.textBoxes.ObtainmentEmailBody).val();

            if ($(obtainmentObject.controls.textBoxes.ObtainmentEmailRecepients).val().length == 0 ||
                $(obtainmentObject.controls.textBoxes.ObtainmentEmailSubject).val().length == 0 ||
                $(obtainmentObject.controls.textBoxes.ObtainmentEmailBody).val().length == 0) {

                // flag as invalid
                valid = false;

                // display validation message
                $(this).displayError(messages.errorMessages.EmailPartsMissing);

                // make availabe again
                $(obtainmentObject.controls.buttons.SendEmailButton).css("visibility", "");

            }

            var body = $(obtainmentObject.controls.textBoxes.ObtainmentEmailBody).val();
            var subject = $(obtainmentObject.controls.textBoxes.ObtainmentEmailSubject).val();

            if (valid) {

                if ((body + "").toUpperCase().indexOf("NETHUB") >= 0) {
                    $(this).displayError(messages.errorMessages.HasEmbeddedKeywords);
                    valid = false;

                    // make availabe again
                    $(obtainmentObject.controls.buttons.SendEmailButton).css("visibility", "");

                }
            }

            if (valid) {

                if ((subject + "").toUpperCase().indexOf("NETHUB") >= 0) {
                    $(this).displayError(messages.errorMessages.SubjectHasEmbeddedKeywords);
                    valid = false;

                    // make availabe again
                    $(obtainmentObject.controls.buttons.SendEmailButton).css("visibility", "");

                }
            }


            if (valid) {

                if (body.indexOf("||") >= 0) {

                    var suppregex = /\|\|SUPPLIERPORTAL\([a-zA-Z\s0-9]+?\)\|\|/;
                    var productsRegex = /\|\|PRODUCTSLIST\|\|/;

                    // replace all matching tokens and then test for errors
                    var bodyCopy = body.toUpperCase();

                    bodyCopy = bodyCopy.replace(/\|\|SUPPLIERPORTAL\([a-zA-Z\s0-9]+?\)\|\|/g, "");
                    bodyCopy = bodyCopy.replace(/\|\|PRODUCTSLIST\|\|/g, "");

                    if (bodyCopy.indexOf("||") >= 0 && (!suppregex.test(bodyCopy) || !productsRegex.test(bodyCopy))) {
                        $(this).displayError(messages.errorMessages.InvalidSubstitutionTokens);
                        valid = false;
                    }

                }

                // make availabe again
                $(obtainmentObject.controls.buttons.SendEmailButton).css("visibility", "");

            }

            if (valid) {

                var actionName = "SendEmail";
                var ddlNextSteps = $(obtainmentObject.controls.dropdownlists.NextStepsDropDownList + actionName).data("kendoDropDownList");
                //console.log("DDLNS:" + obtainmentObject.controls.dropdownlists.NextStepsDropDownList + actionName);
                var ddlActions = $(obtainmentObject.controls.dropdownlists.ActionsDropDownList).data("kendoDropDownList");
                var dteDateAssigned = $(obtainmentObject.controls.dateTime.NextStepDueDate + actionName).data("kendoDatePicker");

                if (ddlNextSteps.value() != "") {

                    // common
                    obtainmentMultipleWorkItemActionModel.OWID = GetOWID().owid;//getQueryVariable("owid");
                    //console.log(obtainmentMultipleWorkItemActionModel.OWID);

                    // differentiate between email resends/sends
                    var owiIds = (preSelectedRequests == null ? selectedRequests : preSelectedRequests);
                    obtainmentMultipleWorkItemActionModel.ObtainmentWorkItemIDs = owiIds;

                    obtainmentMultipleWorkItemActionModel.ObtainmentActionLkpID = ddlActions.value();
                    obtainmentMultipleWorkItemActionModel.NextObtainmentStepLkpID = ddlNextSteps.value();
                    obtainmentMultipleWorkItemActionModel.NextObtainmentStepDueDate = dteDateAssigned.value();

                    // send email specific

                    var contactsGrid = $(obtainmentObject.controls.grids.GridContactEmail).data("kendoGrid");
                    var contact = contactsGrid.dataItem(contactsGrid.select());

                    // set up payload
                    obtainmentActionSendEmailModel.Recepients = $(obtainmentObject.controls.textBoxes.ObtainmentEmailRecepients).val() + "|" + contact.CompanyContactEmailId;
                    obtainmentActionSendEmailModel.Cc = null;
                    obtainmentActionSendEmailModel.Subject = $(obtainmentObject.controls.textBoxes.ObtainmentEmailSubject).val();
                    obtainmentActionSendEmailModel.NoticeNumber = $(obtainmentObject.controls.textBoxes.NoticeNumber).val();
                    obtainmentActionSendEmailModel.Body = $(obtainmentObject.controls.textBoxes.ObtainmentEmailBody).val();
                    obtainmentActionSendEmailModel.Files = fUploadlib.getAttachments();
                    obtainmentActionSendEmailModel.AddProductsList = $(obtainmentObject.controls.checkBox.InsertProductsList.replace("#", ".")).is(":checked");
                    obtainmentActionSendEmailModel.AddSupplierPortalLink = $(obtainmentObject.controls.checkBox.InsertSuppliersLink.replace("#", ".")).is(":checked");
                    obtainmentMultipleWorkItemActionModel.ObtainmentActionSendEmailModel = obtainmentActionSendEmailModel;

                    $.ajax({
                        url: strUrl,
                        data: JSON.stringify(obtainmentMultipleWorkItemActionModel),
                        type: "POST",
                        contentType: 'application/json; charset=utf-8',
                        beforeSend: function () {
                            kendo.ui.progress(obtainmentDetailWorkFlowObj, true);
                        },
                        error: function () {

                            // display error 
                            $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);
                            $(obtainmentObject.controls.buttons.SendEmailButton).css("visibility", "");
                        },
                        success: function (successData) {

                            if (successData.success == true) {
                                kendo.ui.progress(obtainmentDetailWorkFlowObj, false);
                                var grid = $(obtainmentObject.controls.grids.GridDetailRequests).data("kendoGrid");

                                grid.dataSource.read();
                                while (selectedRequests.length > 0) selectedRequests.pop();
                                UpdateNumberOfItemsChecked(0);

                                if (modalId != null)
                                    $(modalId).hideModal();
                                $(this).savedSuccessFully(messages.successMessages.Saved);
                            } else
                                $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);

                            // done
                            if (modalId != null) $(modalId).hideModal();
                            $(obtainmentObject.controls.buttons.SendEmailButton).css("visibility", "");

                        },
                        done: function () {

                            $(this).savedSuccessFully(messages.successMessages.Saved);

                            // done
                            if (modalId != null) $(modalId).hideModal();
                            $(obtainmentObject.controls.buttons.SendEmailButton).css("visibility", "");

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

                    // set values
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

                    // if this is a customer action - make sure that a note has been entered.
                    // no saving without a note.

                    if (customerAction) {

                        var closingNotes = $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesCloseRequest).val() + "";
                        if (closingNotes.replace(/g/, "").length == 0) {
                            $(this).displayError(messages.errorMessages.NoCustomerActionNotesProvided);
                            return;
                        }

                    }

                    if (actionName == "ConfirmNotAvailable") {

                        var closingNotes = $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesConfirmNotAvailable).val() + "";
                        if (closingNotes.replace(/g/, "").length == 0) {
                            $(this).displayError(messages.errorMessages.NoConfirmNotAvailableActionNotesProvided);
                            return;
                        }

                    }

                    if (selectedRequests.length > 0) {
                        $(this).ajaxJSONCall(strUrl, JSON.stringify(obtainmentMultipleWorkItemActionModel))
                         .success(function (successData) {
                             if (successData.success == true) {
                                 kendo.ui.progress(obtainmentDetailWorkFlowObj, false);
                                 var grid = $(obtainmentObject.controls.grids.GridDetailRequests).data("kendoGrid");

                                 grid.dataSource.read();

                                 while (selectedRequests.length > 0) selectedRequests.pop();
                                 UpdateNumberOfItemsChecked(0);

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
                    $(this).displayError(messages.errorMessages.NoStepSelected);
                }
            }
        }

        function FillCloseRequest(actionName) {

            var strCustomerAction = "";

            var ddlCustomerActions = $(obtainmentObject.controls.dropdownlists.CloseRequestCustomerActionsDropDownList).data("kendoDropDownList");
            var ddlReasonCodes = $(obtainmentObject.controls.dropdownlists.CloseRequestReasonCode).data("kendoDropDownList");

            // customer action
            obtainmentActionCloseRequest.CustomerActionsId = ddlCustomerActions.text().substring(0, ddlCustomerActions.text().indexOf("-") - 1);

            // customer reason code text
            obtainmentActionCloseRequest.ReasonCodeId = $(obtainmentObject.controls.dropdownlists.CloseRequestReasonCode).val();
            if (obtainmentActionCloseRequest.ReasonCodeId == "") obtainmentActionCloseRequest.ReasonCodeId = null;
            var reasonCode = ddlReasonCodes.text();

//          if (actionName == "CustomerAction") {
//              strCustomerAction = "Customer Action: " + ddlCustomerActions.value() + "<br>" + "Reason Code:" + ddlReasonCodes.text() + "<br>Notes:";
//          }

            obtainmentMultipleWorkItemActionModel.Notes = strCustomerAction + $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesCloseRequest).val();

            // null out anything other than close request
            obtainmentMultipleWorkItemActionModel.ObtainmentActionLogPhoneCallModel = null;
            obtainmentMultipleWorkItemActionModel.ObtainmentActionSendEmailModel= null;

            return obtainmentActionCloseRequest;
        }

        function FillPhoneCall(selectedPhoneItem) {
            obtainmentActionLogPhoneCallModel.LiveCall = $(obtainmentObject.controls.checkBox.LiveCall).val();
            obtainmentActionLogPhoneCallModel.CompanyContactId = selectedPhoneItem.CompanyContactId;
            obtainmentActionLogPhoneCallModel.CompanyContactPhoneId = selectedPhoneItem.CompanyContactPhoneId;
            obtainmentActionLogPhoneCallModel.InternalNotesLkpId = $(obtainmentObject.controls.dropdownlists.InternalNotes).val() != "" ? $(obtainmentObject.controls.dropdownlists.InternalNotes).val() : null;


            obtainmentActionLogPhoneCallModel.ObtainmentActionSendEmailModel = null;
            obtainmentActionLogPhoneCallModel.ObtainmentActionCloseRequest = null;

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
                        error: function () {
                            $(this).displayError(messages.errorMessages.CannotRetrieveSentEmail);
                        },
                        success: function (response, status, xhr) {

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
                        done: function () {
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

        function selectedSuperMailSupplierId() {

            var supplierId = null;
            var supplierName = null;
            var responses = null;

            try {

                // determine if a row has been selected in the search grid.
                var resultsGrid = $(obtainmentObject.controls.grids.GridRequests).data("kendoGrid");
                var selectedItems = resultsGrid.dataItem(resultsGrid.select());

                if (selectedItems != null) {
                    supplierId = selectedItems.ObtainmentWorkItemID.split("-")[0];
                    supplierName = selectedItems.SupplierName;
                    responses = selectedItems.InboundNoticeNumber;
                }

                return {
                    supplierId: supplierId,
                    supplierName: supplierName,
                    responses: responses
                    };

            } catch (e) {

                return null;

            }
        }

        function ObtainmentDetailRoute(OWType, OSourceId, ProductId, NextObtainmentStepLkpID, ObtainmentWorkItemID, SupplierId) {
            if (OWType == "Revision") {
                if (NextObtainmentStepLkpID == "6") {
                    return "<a href='../Document/RevisonObtainmentDocument?rorid=" + OSourceId + "' title='View Revision Detail',  target='_blank'>" + "<span class='icon-eye-open' style='cursor: hand;'></a>";
                } else {
                    //return "<a href='../Document/AddNewRevision?id=" + OSourceId + "&obtainmentWorkItemID=" + ObtainmentWorkItemID + "' title='Add Revision',  target='_blank'>" + "<span class='icon-plus' style='cursor: hand;'></a>";
                    return "<a href='../Document/RevisonObtainmentDocument?rorid=" + OSourceId + "&obtainmentWorkItemID=" + ObtainmentWorkItemID + "' title='Add Revision',  target='_blank'>" + "<span class='icon-plus' style='cursor: hand;'></a>";
                }                
            }
            else if (OWType == "New") {
                if (NextObtainmentStepLkpID == "6") {
                    return "<a href='../../Configuration/ProductManager/ConfigProduct?productid=" + ProductId + "' title='View Product Detail',  target='_blank'>" + "<span class='icon-eye-open' style='cursor: hand;'></a>";
                } else {
                    return "<a href='../Document/AddNewDocument?productid=" + ProductId + "&sid=" + SupplierId + "&obtainmentWorkItemID=" + ObtainmentWorkItemID + "' title='Add Document',  target='_blank'>" + "<span class='icon-plus' style='cursor: hand;'></a>";
                }                
            }
            else {
                //Due to old data obtainmentworkitem records not able to identify OWType, in that case display product page.
                return "<a href='../../Configuration/ProductManager/ConfigProduct?productid=" + ProductId + "' title='View Product Detail',  target='_blank'>" + "<span class='icon-eye-open' style='cursor: hand;'></a>";
            }
        }

        return {
            loadRequests: loadRequests,
            loadRequestsPlugin: loadRequestsPlugin,
            loadSupplierNotes: loadSupplierNotes,
            onDdlDataBound: onDdlDataBound,
            onLoadChange: onLoadChanged,
            onObtainmentReqeustDataBound: onObtainmentReqeustDataBound,
            loadSentEmail: loadSentEmail,
            selectedSuperMailSupplierId: selectedSuperMailSupplierId,
            ObtainmentDetailRoute: ObtainmentDetailRoute
        };
    };
})(jQuery);
