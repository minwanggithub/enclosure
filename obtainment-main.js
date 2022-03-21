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
        var hasNoticeNumbers = new Array();//changed to array from bool by hitesh
        var hasNonSDS = new Array();//changed to array from bool by hitesh
        var hasRevision = new Array();//changed to array from bool by hitesh
        var hasRevisionCount = new Array();//changed to array from bool by hitesh
        var selectedRows = new Array();
        var useSeparateCustomerAction = true;

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
                    btnSaveConfirmNotAvailable: "#btnSaveConfirmNotAvailable",
                    SentToProcessingSaveButton: "#btnSaveSentToProcessing",
                    SentToProcessingCancelButton: "#btnCancelSentToProcessing",
                    AwaitingSupplierResponseSaveButton: "#btnSaveAwaitingSupplierResponse",
                    AwaitingSupplierResponseCancelButton: "#btnCancelAwaitingSupplierResponse"

                },
                textBoxes: {
                    AccountId: "#txtAccountId",
                    NumberOfItemsTextBox: "#numberOfItems",
                    ObtainmentActionNotes: "#txtObtainmentActionNotes",
                    ObtainmentEmailRecepients: "#txtObtainmentEmailSendEmailTo",
                    ObtainmentEmailSubject: "#txtObtainmentEmailSendEmailSubject",
                    NoticeNumberSearch: "#NoticeNumber",
                    NoticeNumber: "#txtNoticeNum",
                    ObtainmentEmailBody: "#txtObtainmentEmailSendEmailBody",
                    SuperEmailSubject: "#txtSuperEmailSubject",
                    SuperObtainmentEmailBody: "#txtSuperEmailBody",
                    SupplierId: "#txtSupplierId",
                    NotificationRecepient: "#txtNotificationRecepient",
                    SupplierSiblingId: "#txtObtainmentCASupplierIDName_CloseRequest",
                    ObtainmentActionNotesLogExternalEmail: "#txtObtainmentActionNotesLogExternalEmail",
                    ObtainmentActionNotesLogWebSearch: "#txtObtainmentActionNotesLogWebSearch",
                    ObtainmentActionNotesFollowUp: "#txtObtainmentActionNotesFollowUp",
                    ObtainmentActionNotesPhoneCall: "#txtObtainmentActionNotesPhoneCall",
                    ObtainmentActionNotesFlagDiscontinued: "#txtObtainmentActionNotesFlagDiscontinued",
                    ObtainmentActionNotesNotRequired: "#txtObtainmentActionNotesNotRequired",
                    ObtainmentActionNotesCloseRequest: "#txtObtainmentActionNotesCloseRequest",
                    ObtainmentActionNotesConfirmNotAvailable: "#txtObtainmentActionNotesConfirmNotAvailable",
                    ObtainmentActionNotesSentToProcessing: "#txtObtainmentActionNotesSentToProcessing",
                    ObtainmentActionNotesAwaitingSupplierResponse: "#txtObtainmentActionNotesAwaitingSupplierResponse"
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
                    EmailTargets: "#ddlEmailTarget",
                    CompletedObtainmentActionsDropDownList: "#ddlObtainmentAction",
                    CompletedCustomerActionDropDownList: "#ddlCustomerAction",

                    ObtainmentTypeDropDownList: "#ddlObtainmentType",
                    DaysInProgressConditionDropDownList: "#ddlDaysInProgressCondition",
                    DaysInProgressNumberDropDownList: "#ddlDaysInProgressNumber",
                    AttemptsDropDownList: "#ddlAttempts",
                    
                },
                labels: {
                    ContactName: "#lblContactName",
                    lblNotes: "#lblNotes"
                },
                checkBox: {
                    LiveCall: "#chkLiveCall",
                    IncludeInboundResponses: "#chkOnlyWithInboundResponses",
                    InsertProductsList: "#chkInsertProductsList",
                    InsertSuppliersLink: "#chkInsertSuppliersLink",
                    PreviewEmail: "#chkPreviewEmail"
                },
                div: {
                    CustomerActionDiv: "#dvObtainmentCustomerAction",
                },
                radioButtons: {
                    CategoriesMatchGroup: "mltCategoriesMatchGroup"
                },
                multiSelectLists: {
                    CategoriesMultiSelect: "#mltCategories",
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
            SuperMail: "#superEmailWindow",
            ConfirmNotAvailable: "#mdlConfirmNotAvailable",
            SentToProcessing: "#mdlSentToProcessing",
            AwaitingSupplierResponse: "#mdlAwaitingSupplierResponse"
        };

        var kendoWindows = { ViewHistory: "#supplierSearchWindow", ViewAccount: "#accountSearchWindow" };
        var controllerCalls = {
            SearchRequests: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SearchObtainmentRequests",
            SaveSearchSettings: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveSearchSettings",
            SaveObtainmentWorkItemAction_ConfirmCurrent: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentAction_ConfirmCurrent",
            SaveObtainmentWorkItemAction_LogPhoneCall: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentAction_LogPhoneCall",
            SaveObtainmentWorkItemAction_LogWebSearch: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentAction_LogWebSearch",
            SaveObtainmentAction_SetFollowUp: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentAction_SetFollowUp",
            SaveObtainmentAction_LogExternalEmail: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentAction_LogExternalEmail",
            SaveObtainmentAction_FlagDiscontinued: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentAction_FlagDiscontinued",
            SaveObtainmentAction_FlagNotRequired: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentAction_FlagNotRequired",
            SaveObtainmentAction_ConfirmNotAvailable: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentAction_ConfirmNotAvailable",
            SaveObtainmentAction_AwaitingSupplierResponse: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentAction_AwaitingSupplierResponse",
            SaveObtainmentAction_SendToProcessing: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentAction_SendToProcessing",
            SaveObtainmentAction_SendEmail: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentAction_SendEmail",
            SaveObtainmentAction_CustomerAction: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentAction_CustomerAction",

            SaveObtainmentWorkItemAction: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentWorkItemAction",
            SaveLogExternalEmailAction: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveLogExternalEmailAction",
            ObtainmentWorkItemLoadHistory: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/ObtainmentWorkItemLoadHistoryContent",
            SendEmail: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SendEmail",
            SendSuperEmail: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SendSuperEmail",
            GenerateNoticeNum: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GenerateNoticeNum",
            RetrieveSentEmail: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/RetrieveSentEmail",
            GetNoticeNumberAndNethubLinks: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetNoticeNumberAndNethubLinks",
            GetObtainmentAccountInfo: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetObtainmentAccountInfo",
            GetObtainmentActionAttemptsTableList: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetObtainmentActionAttemptsTableList",
            SaveEmailAttachment: GetEnvironmentLocation() + "/Operations/ObtainmentWorkflow/SaveEmailAttachment",
            RemoveEmailAttachment: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveEmailAttachment",
            GetContactList: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetContactList",
            GetContactPhoneList: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetContactPhoneList",
            GetSupplierPortalUrl: GetEnvironmentLocation() + "/Operations/Company/GetCompliSupplierPortalUrl",
            SaveConfirmNotAvailable: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveConfirmNotAvailable",
            CheckWorkItemStatus: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetObtainmentWorkItemItemStatus",
            GetSiblingCountWithObtainmentList: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/GetSiblingCountWithObtainmentList"
        };
        var nextStepsValues = { Empty: "", WebSearch: "1", FirstAutomatedEmail: "2", SecondAutomatedEmail: "3", FirstPhoneCall: "4", FollowUpPhoneCall: "5", Completed: "6", AwaitingSupplierResponse: "9", SentToProcessing: "10" };
        var obtainmentActions = { Empty: "", SentToProcessing: "12", AwaitingSupplierResponse: "11", LogExternalEmail: "10", ConfirmNotAvailable: "9", CustomerAction: "8", ConfirmAsCurrent: "7", FlagNotRequired: "6", FlagDiscontinued: "5", SetFollowUp: "4", SendEmail: "3", LogWebSearch: "2", LogPhoneCall: "1" };
        var messages = {
            instructionMessages: {

                SupplierPortalEmailInstruction: "<br/>Please follow ||SupplierPortal(this link)|| to submit your document for the following products:<br/><br/>||ProductsList||<br/>",
                RevisionSDSEmailInstruction: "<br/><b>Please provide updated SDS documents for the following:</b><br/><br/>||ProductsList|| <br/><br/>",
                NewSDSEmailInstruction: "<br/><b>Please provide SDS documents for the following:</b><br/><br/>||ProductsList|| <br/><br/>",

                //[vikas 10Feb2022 start] Changes for adding warning message while sending super email when [inb. Response received] is 'yes'.
                NotifySuperEmailForInboundResps: 'Obtainment work items having inbound response already received will automatically skipped while processing.'
                //[vikas 10Feb2022 end] Changes for adding warning message while sending super email when [inb. Response received] is 'yes'.

            },
            successMessages: {
                Saved: "Saved Successful",
                SuperEmailDirection: "<br/><b>Please follow <a href='*'>this link</a> to submit your document. </b> <br/><br/>"
            },
            confirmationMessages: {
                UnAssigneRequests: "unassign these request item(s)",
                AssignRequests: "assign these request item(s)",
                OverwriteComments: "Overwrite previous customer action comments?",
                SiblingCascadingConfirmTitle: "Sibling Cascading Warning",
                SiblingCascadingConfirmMessage: "This action will be applied to {0} siblings. Do you wish to proceed?",
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
                NoNonSDSSubstitutionToken: "A ||SupplierPortal(link text)|| token is mandatory in the super email body.",
                NoSDSSubstitutionToken: "A ||ProductsList|| token is mandatory in the SDS super email body.",
                EmailBodyMissing: "Email body is missing.",
                NextStepMissing: "Obtainment next step has not been selected.",
                OneOrMoreSelectionsNotRevisions: "One or more of the selected item(s) are new obtainment. The Confirm as Current action can only be performed on Revisions.<br/>Remove any new obtainment requests selected and perform the action again.",
                DiscontinuedActionForRevisionOnly: "One or more of the selected item(s) are new obtainment. The Flag Discontinued action can only be performed on Revisions.<br/>Remove any new obtainment requests selected and perform the action again.",
                FlagNotRequiredActionForRevisionOnly: "One or more of the selected item(s) are new obtainment. The Flag Not Required action can only be performed on Revisions.<br/>Remove any new obtainment requests selected and perform the action again.",
                InvalidSubstitutionTokens: "Invalid or incorrect substitution tokens. ",
                NotificationRecepientMissing: "Super email notification recipient missing.",
                NoObtainmentWorkItemSelected: "No obtainment work item has been selected selected.",
                HasEmbeddedKeywords: "Email body has illegal keyword(s).",
                SubjectHasEmbeddedKeywords: "Email subject has illegal keyword(s).",
                AlreadyResolved: "This request is already completed, go to PID to see further details.",
                CustomAction47NotAvailable: "Custom Action 47 is not available at this moment from here.",
                ObtainmentActionMissing: "Obtainment action has not been selected.",
                CustomerActionMissing: "No customer action has been selected",
                OneOrMoreSelectionsAreCompleted: "One or more of the selected item(s) are listed with a Completed next step. Obtainment actions cannot be performed on these requests.<br/>"+
                                                    "Remove any Completed next step obtainment requests selected and perform the action again."
            }
        };

        var obtainmentWorkLoadSearchResultModel = {
            TeamID: 0,
            ContactPreferredLanguageId: 0,
            DocumentTypeId: 0,
            LockTypeId: 0,
            AssignedToId: 0,
            NextStepId: 0,
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
            ObtainmentActionCloseRequest: null,
            siblingSupplierId: 0,
            AdditionalObtainmentActionLkpID: null,
            AdditionalNotes: null
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

            var drpObtainmentType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.ObtainmentTypeDropDownList).data("kendoDropDownList");
            var drpDaysInProgressCondition = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.DaysInProgressConditionDropDownList).data("kendoDropDownList");
            var drpDaysInProgressNumber = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.DaysInProgressNumberDropDownList).data("kendoDropDownList");
            var drpAttempts= $("#divSearchSection " + obtainmentObject.controls.dropdownlists.AttemptsDropDownList).data("kendoDropDownList");
            var drpCategories = $("#divSearchSection " + obtainmentObject.controls.multiSelectLists.CategoriesMultiSelect).data("kendoMultiSelect");
            //$("#divSearchSection " + obtainmentObject.controls.dropdownlists.CategoriesDropDownList).data("kendoDropDownList");

            var strCategoryValue = drpCategories.value();
            var intCategoryValue = 0;

            // get the criteria selections
            for (var indexCategory = 0; indexCategory < strCategoryValue.length; indexCategory++)
                intCategoryValue += parseInt(strCategoryValue[indexCategory]);

            // hack for now
            var categoryCondition = $("#divSearchSection [name=" + obtainmentObject.controls.radioButtons.CategoriesMatchGroup + "]:checked").val();
            if (categoryCondition == "OR") intCategoryValue = -intCategoryValue;

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

            obtainmentWorkLoadSearchResultModel.ObtainmentType = drpObtainmentType.value() == "" ? 0 : drpObtainmentType.value();
            obtainmentWorkLoadSearchResultModel.DaysInProgressCondition = drpDaysInProgressCondition.value() == "" ? 0 : drpDaysInProgressCondition.value();
            obtainmentWorkLoadSearchResultModel.DaysInProgress = drpDaysInProgressNumber.value() == "" ? 0 : drpDaysInProgressNumber.value();
            obtainmentWorkLoadSearchResultModel.Attempts = drpAttempts.value() == "" ? 0 : drpAttempts.value();
            obtainmentWorkLoadSearchResultModel.Category = intCategoryValue === 0 ? "" : intCategoryValue;


            obtainmentWorkLoadSearchResultModel.HasFilter = obtainmentWorkLoadSearchResultModel.TeamID
                + obtainmentWorkLoadSearchResultModel.ContactPreferredLanguageId
                + obtainmentWorkLoadSearchResultModel.DocumentTypeId
                + obtainmentWorkLoadSearchResultModel.LockTypeId
                + obtainmentWorkLoadSearchResultModel.AssignedToId
                + obtainmentWorkLoadSearchResultModel.NextStepId
                + (obtainmentWorkLoadSearchResultModel.NoticeNumber != "") ? "1" : "0"
                + obtainmentWorkLoadSearchResultModel.AccountId
                + obtainmentWorkLoadSearchResultModel.ObtainmentType
                + obtainmentWorkLoadSearchResultModel.DaysInProgressCondition
                + obtainmentWorkLoadSearchResultModel.DaysInProgress
                + obtainmentWorkLoadSearchResultModel.Attempts
                + obtainmentWorkLoadSearchResultModel.Category;

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

            //Nitin-10/21/2020:TRECOMPLI-3990 Obtainment- Email pop-up tab function (In case of Super Email)
            $(".k-tool-group .k-tool,.k-tool-group .k-colorpicker").attr("tabindex", - 1);
            // ---- reset event handlers 
            $(obtainmentObject.controls.buttons.btnCancelSuperEmailButton).off("click");
            $(obtainmentObject.controls.buttons.btnSendSuperEmailButton).off("click");
            $(obtainmentObject.controls.dropdownlists.EmailTargets).data("kendoDropDownList").unbind("change");

            // ---- wire modal close
            $(obtainmentObject.controls.buttons.btnCancelSuperEmailButton).click(function () {
                // $(actionModals.SuperMail).toggleModal();
                $(actionModals.SuperMail).data('kendoWindow').close();
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
                        // $(actionModals.SuperMail).show();
                        //  $('#superEmailWindow').data('kendoWindow').open();
                        //  $(this).off('hidden.bs.modal'); // Remove the 'on' event binding
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


                //--Start-- Changes for adding warning message while sending super email when [inb. Response received] is 'yes'.
                //if (hasInboundResponses) {
                //    $("#hasInboundResponses").show();
                //    $("#superEmailSupplier").parent().parent().nextAll().hide();
                //    var url = GetEnvironmentLocation() + '/Operations/ObtainmentResponse/InboundResponse?supplierId=' + obtainment.supplierId + "&supplierName=" + obtainment.supplierName;
                //    $("#linkToInboundResponse").attr("href", url);
                //}
                //else {
                //    $("#hasNoInboundResponses").show();
                //    $("#btnSendSuperEmail").show();
                //    $("#superEmailSupplier").parent().parent().nextAll().show();
                //}
                $("#hasNoInboundResponses").show();
                $("#btnSendSuperEmail").show();
                $("#superEmailSupplier").parent().parent().nextAll().show();
                //--End-- Changes for adding warning message while sending super email when [inb. Response received] is 'yes'.

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

                //[vikas 10Feb2022 start] Changes for adding warning message while sending super email when [inb. Response received] is 'yes'.


                //Uncomment this below section if warning message is not needed.
                //----No Warning message code start-------
                    //// display
                    //$(actionModals.SuperMail).data('kendoWindow').center();
                    //$(actionModals.SuperMail).data('kendoWindow').open();
                    //// Nitin-TRECOMPLI-3990: Obtainment- Email pop-up tab function
                    //setTimeout(function () {
                    //    $(actionModals.SuperMail).attr("tabindex", -1).focus();
                    //    $(actionModals.SuperMail).removeAttr("tabindex");

                    //}, 1000);

                    //// $(actionModals.SuperMail).displayModal();
                //----No Warning message code end-------

                //----Warning message code start-------
                if (hasInboundResponses) {

                    var prompt = {};
                    prompt.header = "Warning";
                    prompt.message = messages.instructionMessages.NotifySuperEmailForInboundResps;

                    DisplayErrorMessageInPopUp(prompt, function () {
                         _displaySuperEmailPopup();
                    });

                }
                else {
                    _displaySuperEmailPopup()
                }
                function _displaySuperEmailPopup() {
                    // display 
                    $(actionModals.SuperMail).data('kendoWindow').center();
                    $(actionModals.SuperMail).data('kendoWindow').open();
                    // Nitin-TRECOMPLI-3990: Obtainment- Email pop-up tab function
                    setTimeout(function () {
                        $(actionModals.SuperMail).attr("tabindex", -1).focus();
                        $(actionModals.SuperMail).removeAttr("tabindex");

                    }, 1000);

                // $(actionModals.SuperMail).displayModal();
                }
                //----Warning message code end-------

                //[vikas 10Feb2022 end] Changes for adding warning message while sending super email when [inb. Response received] is 'yes'.

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
            if (useSeparateCustomerAction)
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentAction_LogExternalEmail, "LogExternalEmail", actionModals.LogExternalEmail);
            else
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

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.SentToProcessingCancelButton, function () {
            $(actionModals.SentToProcessing).toggleModal();
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.AwaitingSupplierResponseCancelButton, function () {
            $(actionModals.AwaitingSupplierResponse).toggleModal();
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.NotRequiredCancelButton, function () {
            $(actionModals.NotRequired).toggleModal();
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.CloseRequestCancelButton, function () {
            $(actionModals.CloseRequest).toggleModal();
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.FollowUpSaveButton, function () {
            if (useSeparateCustomerAction)
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentAction_SetFollowUp, "FollowUp", actionModals.FollowUp);
            else
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "FollowUp", actionModals.FollowUp);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.LogWebSearchSaveButton, function () {
            if (useSeparateCustomerAction)
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction_LogWebSearch, "LogWebSearch", actionModals.LogWebSearch);
            else
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "LogWebSearch", actionModals.LogWebSearch);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.LogPhoneCallSaveButton, function () {
            if (useSeparateCustomerAction)
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction_LogPhoneCall, "PhoneCall", actionModals.LogPhoneCall);
            else
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "PhoneCall", actionModals.LogPhoneCall);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.CloseRequestSaveButton, function () {
            if ($("#dvCustomerAction").is(":visible")) {
                if (useSeparateCustomerAction)
                    SaveObtainmentNextSteps(controllerCalls.SaveObtainmentAction_CustomerAction, "CustomerAction", actionModals.CloseRequest);
                else
                    SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "CustomerAction", actionModals.CloseRequest);
            }
            else {
                if (useSeparateCustomerAction)
                    SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction_ConfirmCurrent, "CloseRequest", actionModals.CloseRequest);
                else
                    SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "CloseRequest", actionModals.CloseRequest);
            }
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.SendEmailButton, function () {
            if (useSeparateCustomerAction)
                SendEmailAndSaveObtainmentNextStep(controllerCalls.SaveObtainmentAction_SendEmail, actionModals.SendEmail);
            else
                SendEmailAndSaveObtainmentNextStep(controllerCalls.SendEmail, actionModals.SendEmail);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.FlagDiscontinuedSaveButton, function () {
            if (useSeparateCustomerAction)
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentAction_FlagDiscontinued, "FlagDiscontinued", actionModals.FlagDiscontinued);
            else
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "FlagDiscontinued", actionModals.FlagDiscontinued);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.SentToProcessingSaveButton, function () {
            if (useSeparateCustomerAction)
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentAction_SendToProcessing, "SentToProcessing", actionModals.SentToProcessing);
            else
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "SentToProcessing", actionModals.SentToProcessing);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.AwaitingSupplierResponseSaveButton, function () {
            if (useSeparateCustomerAction)
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentAction_AwaitingSupplierResponse, "AwaitingSupplierResponse", actionModals.AwaitingSupplierResponse);
            else
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "AwaitingSupplierResponse", actionModals.AwaitingSupplierResponse);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.NotRequiredSaveButton, function () {
            if (useSeparateCustomerAction)
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentAction_FlagNotRequired, "NotRequired", actionModals.NotRequired);
            else
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "NotRequired", actionModals.NotRequired);
        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.btnSaveConfirmNotAvailable, function () {
            if (useSeparateCustomerAction)
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentAction_ConfirmNotAvailable, "ConfirmNotAvailable", actionModals.ConfirmNotAvailable);
            else
                SaveObtainmentNextSteps(controllerCalls.SaveObtainmentWorkItemAction, "ConfirmNotAvailable", actionModals.ConfirmNotAvailable);
        });

        obtianmentDetailModals.on("change", obtainmentObject.controls.dropdownlists.CloseRequestCustomerActionsDropDownList, function (e) {
            var txtNotes = $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesCloseRequest);
            var selNotes = $(obtainmentObject.controls.dropdownlists.CloseRequestCustomerActionsDropDownList).data("kendoDropDownList");

            $(obtainmentObject.controls.labels.NotesLabel).css("display", "inline");
            $(obtainmentObject.controls.textBoxes.NotesTextBox).css("display", "inline");

            // already entered text
            var txtCustomerAction = txtNotes.val();
            var emptyCustomerAction = (txtCustomerAction.replace(/ /g, "") == "");
            var customActionIndex = -1;

            // "fix" selected customer action
            var selCustomerAction = selNotes.text();
            if (selCustomerAction == "Select One")
                selCustomerAction = "";
            else {
                customActionIndex = selCustomerAction.split(" ")[0];
                selCustomerAction = selCustomerAction.split(" ").slice(2).join(" ");
            }

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

            if (customActionIndex == "47") {
                //if (selectedRequests.length > 1) { 
                //    kendo.alert("Custom Action 47 can only apply to single request. Please use Obtainment Administration Page for batch.");
                //    selNotes.select(0);
                //    txtNotes.val("");
                //    return;
                //}

                if (hasNonSDS.length > 0) {
                    kendo.alert("Custom Action 47 applies to SDS document type only. Remove non SDS document types and perform action again.");
                    selNotes.select(0);
                    txtNotes.val("");
                    return;
                }

                if (hasRevisionCount.length > 0) {
                    kendo.alert("One or more of the selected item(s) are revisions. The customer action 47 can onlv be performed on new obtainment. Remove anv revision obtainment request selected and perform the action again.");
                    selNotes.select(0);
                    txtNotes.val("");
                    return;
                }
            }

            //if (customActionIndex == "47") {
            //    $("#lblObtainmentCASupplierId_CloseRequest").show();
            //    $("#txtObtainmentCASupplierIDName_CloseRequest").show();
            //}
            //else {
            //    $("#lblObtainmentCASupplierId_CloseRequest").hide();
            //    $("#txtObtainmentCASupplierIDName_CloseRequest").hide();
            //}
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

        //obtianmentDetailModals.on("change", obtainmentObject.controls.dropdownlists.NextStepsDropDownList +'FollowUp', function () {

        //    var ddlObtainmentAction = $(obtainmentObject.controls.dropdownlists.CompletedObtainmentActionsDropDownList + actionName).data("kendoDropDownList");
        //    if (ddlObtainmentAction.text()=="Completed")
        //        ddlObtainmentAction.enable(enable);
        //    else
        //        ddlObtainmentAction.enable(false);
        //});

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

                    //$(actionModals.SuperMail).toggleModal();
                    $(actionModals.SuperMail).data('kendoWindow').close();

                    DisplayErrorMessageInPopUp(prompts, function () {
                        //  $(actionModals.SuperMail).toggleModal();
                        $(actionModals.SuperMail).data('kendoWindow').close();
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
            SetAdditionalObtainmentActionForComplete(actionName);
        }

        function SetNextStep(nextStepValue, actionName, enable) {
            var ddlNextSteps = $(obtainmentObject.controls.dropdownlists.NextStepsDropDownList + actionName).data("kendoDropDownList");
            var dteDateAssigned = $(obtainmentObject.controls.dateTime.NextStepDueDate + actionName).data("kendoDatePicker");
            ddlNextSteps.value(nextStepValue);
            ddlNextSteps.enable(enable);
            dteDateAssigned.enable(enable);
            SetAdditionalObtainmentActionForComplete(actionName);
        }
        function SetAdditionalObtainmentActionForComplete(actionName) {
            var ddlObtainmentAction = $(obtainmentObject.controls.dropdownlists.CompletedObtainmentActionsDropDownList + actionName).data("kendoDropDownList");
            $(obtainmentObject.controls.dropdownlists.NextStepsDropDownList + actionName).change(function () { onNextStep(actionName); });
            $(obtainmentObject.controls.dropdownlists.CompletedObtainmentActionsDropDownList + actionName).change(function () { onCompletedObtainmentAction(actionName); });
            $(obtainmentObject.controls.dropdownlists.CompletedCustomerActionDropDownList + actionName).change(function () { onCompletedCustomerAction(actionName); });
            var ddlCustomerAction = $(obtainmentObject.controls.dropdownlists.CompletedCustomerActionDropDownList + actionName).data("kendoDropDownList");
            if (ddlObtainmentAction != null) {
                ddlObtainmentAction.enable(false);
                ddlObtainmentAction.select(0);
                ddlCustomerAction.select(0);
                $(obtainmentObject.controls.div.CustomerActionDiv + '_' + actionName).css({ display: 'none' });
            }
        }
        var onNextStep = function (actionName) {
            debugger;
            var ddlObtainmentAction = $(obtainmentObject.controls.dropdownlists.CompletedObtainmentActionsDropDownList + actionName).data("kendoDropDownList");
            var ddlCustomerAction = $(obtainmentObject.controls.dropdownlists.CompletedCustomerActionDropDownList + actionName).data("kendoDropDownList");
            var nextStepvalue = $(obtainmentObject.controls.dropdownlists.NextStepsDropDownList + actionName).data("kendoDropDownList").text();
            if (nextStepvalue == 'Completed') {
                ddlObtainmentAction.enable(true);
            }
            else {
                ddlObtainmentAction.enable(false);
            }
            $(obtainmentObject.controls.div.CustomerActionDiv + '_' + actionName).css({ display: 'none' });
            ddlObtainmentAction.select(0);
            ddlCustomerAction.select(0);
        };
        var onCompletedObtainmentAction = function (actionName) {
            debugger;
            var ddlobtainmentAction = $(obtainmentObject.controls.dropdownlists.CompletedObtainmentActionsDropDownList + actionName).data("kendoDropDownList");
            var obtainmentAction = $(obtainmentObject.controls.dropdownlists.CompletedObtainmentActionsDropDownList + actionName).data("kendoDropDownList").text();
            var ddlCustomerAction = $(obtainmentObject.controls.dropdownlists.CompletedCustomerActionDropDownList + actionName).data("kendoDropDownList");
            if (obtainmentAction == 'Customer Action') {
                $(obtainmentObject.controls.div.CustomerActionDiv + '_' + actionName).css({ display: 'block' });
                ddlCustomerAction.value("3E has been unsuccessful in multiple attempts to obtain the requested document(s) with the manufacturer information provided. Thank you.");
            }
            else {
                $(obtainmentObject.controls.div.CustomerActionDiv + '_' + actionName).css({ display: 'none' });
                ddlCustomerAction.select(0);

                var newSelected = false;
                var grid = $("#gdDetailRequests").data("kendoGrid");
                $.each(grid._data, function () {
                    if (this['IsSelected']) {
                        if ((this['OWType']).toUpperCase().indexOf("NEW") >= 0) {
                            newSelected = true;
                        }
                    }
                });
                if (newSelected) {
                    if (ddlobtainmentAction.value() == obtainmentActions.ConfirmAsCurrent) {
                        kendo.alert(messages.errorMessages.OneOrMoreSelectionsNotRevisions);
                    }
                    if (ddlobtainmentAction.value() == obtainmentActions.FlagDiscontinued) {
                        kendo.alert(messages.errorMessages.DiscontinuedActionForRevisionOnly);
                    }
                    ddlobtainmentAction.select(0);
                    return false;
                }

            }
        };
        var onCompletedCustomerAction = function (actionName) {
            var ddlCustomerAction = $(obtainmentObject.controls.dropdownlists.CompletedCustomerActionDropDownList + actionName).data("kendoDropDownList");
            // selected customer action
            var selCustomerAction = ddlCustomerAction.text();
            if (selCustomerAction == "Select One") selCustomerAction = "";

            var dashIndex = selCustomerAction.indexOf("-");
            var actionNumber = selCustomerAction.substr(0, dashIndex - 1);

            if (actionNumber === "47") {
                kendo.alert(messages.errorMessages.CustomAction47NotAvailable);
                ddlCustomerAction.select(0);
                return false;
            }
        };

        function SetNextStepForSendToProcessingandAwaitSuppRes(nextStepValue, actionName, enable) {
            var ddlNextSteps = $(obtainmentObject.controls.dropdownlists.NextStepsDropDownList + actionName).data("kendoDropDownList");
            var dteDateAssigned = $(obtainmentObject.controls.dateTime.NextStepDueDate + actionName).data("kendoDatePicker");
            ddlNextSteps.value(nextStepValue);
            ddlNextSteps.enable(enable);
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
            var anyCompletedRecordSelected = false;
            var grid = $("#gdDetailRequests").data("kendoGrid");
            $.each(grid._data, function () {
                if (this['IsSelected']) {
                    if (this.Step.toLowerCase() == 'completed') {
                        anyCompletedRecordSelected = true;
                    }
                    if ((this['OWType']).toUpperCase().indexOf("NEW") >= 0) {
                        newSelected = true;
                    }
                }
            });

            var isConfirmAsCurrent_New = (ddlActions.value() == obtainmentActions.ConfirmAsCurrent && newSelected);
            var isFlagDiscontinue_New = (ddlActions.value() == obtainmentActions.FlagDiscontinued && newSelected);
            var isFlagNotRequired_New = (ddlActions.value() == obtainmentActions.FlagNotRequired && newSelected);

            

            if (isConfirmAsCurrent_New) {
                kendo.alert(messages.errorMessages.OneOrMoreSelectionsNotRevisions + (anyCompletedRecordSelected ? "<br/><br/>" +messages.errorMessages.OneOrMoreSelectionsAreCompleted:""));
                return;
            }
            else if (isFlagDiscontinue_New) {
                kendo.alert(messages.errorMessages.DiscontinuedActionForRevisionOnly + (anyCompletedRecordSelected ? "<br/><br/>" +messages.errorMessages.OneOrMoreSelectionsAreCompleted : ""));
                return;
            }
            else if (isFlagNotRequired_New) {
                kendo.alert(messages.errorMessages.FlagNotRequiredActionForRevisionOnly + (anyCompletedRecordSelected ? "<br/><br/>" +messages.errorMessages.OneOrMoreSelectionsAreCompleted : ""));
                return;
            }

            if (anyCompletedRecordSelected) {
                kendo.alert(messages.errorMessages.OneOrMoreSelectionsAreCompleted);
                return;
            }


            switch (ddlActions.value()) {
                case obtainmentActions.LogExternalEmail:
                    SetNextStep(nextStepsValues.Empty, "LogExternalEmail", true);
                    //$(obtainmentObject.controls.textBoxes.ObtainmentActionNotesLogExternalEmail).val('');
                    $(actionModals.LogExternalEmail).displayModal();
                    break;
                case obtainmentActions.SetFollowUp:
                    SetNextStep(nextStepsValues.FirstPhoneCall, "FollowUp", true);
                    //$(obtainmentObject.controls.textBoxes.ObtainmentActionNotesFollowUp).val('');
                    $(actionModals.FollowUp).displayModal();
                    break;
                case obtainmentActions.LogPhoneCall:
                    //$(obtainmentObject.controls.textBoxes.ObtainmentActionNotesPhoneCall).val('');
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
                                    "optionLabel": "Select",
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
                    //$(obtainmentObject.controls.textBoxes.ObtainmentActionNotesLogWebSearch).val('');
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
                                        // Nitin-TRECOMPLI-3990: Obtainment- Email pop-up tab function
                                        setTimeout(function () {
                                            $("#mdlSendEmail").attr("tabindex", -1).focus();
                                            $("#mdlSendEmail").removeAttr("tabindex");
                                        }, 1000);
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
                    $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesFlagDiscontinued).val('');
                    $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesFlagDiscontinued).hide();
                    $(obtainmentObject.controls.labels.lblNotes).hide();
                    $(actionModals.FlagDiscontinued).displayModal();
                    break;

                case obtainmentActions.FlagNotRequired:
                    SetNextStep(nextStepsValues.Completed, "NotRequired", false);
                    //$(obtainmentObject.controls.textBoxes.ObtainmentActionNotesNotRequired).val('');
                    $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesNotRequired).hide();
                    $(obtainmentObject.controls.labels.lblNotes).hide();
                    $(actionModals.NotRequired).displayModal();
                    break;

                case obtainmentActions.ConfirmAsCurrent:
                    SetNextStep(nextStepsValues.Completed, "CloseRequest", false);
                    //$(obtainmentObject.controls.textBoxes.ObtainmentActionNotesCloseRequest).val('');
                    $("#dvCustomerAction").hide();
                    $("#lblTitle").text("Confirm as Current");
                    $(actionModals.CloseRequest).displayModal();
                    break;

                case obtainmentActions.CustomerAction:
                    SetNextStep(nextStepsValues.Completed, "CloseRequest", false);
                    $("#lblTitle").text("Customer Action");
                    $("#dvCustomerAction").show();
                    $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesCloseRequest).val("");
                    $(obtainmentObject.controls.dropdownlists.CloseRequestCustomerActionsDropDownList).data("kendoDropDownList").select(0);
                    $(actionModals.CloseRequest).displayModal();
                    break;

                case obtainmentActions.ConfirmNotAvailable:
                    SetNextStep(nextStepsValues.Completed, "ConfirmNotAvailable", false);
                    //$(obtainmentObject.controls.textBoxes.ObtainmentActionNotesConfirmNotAvailable).val("");
                    $("#lblTitle").text("Confirm not available");
                    $("#dvConfirmNotAvailable").show();
                    $(obtainmentObject.controls.dropdownlists.ConfirmNotAvailableDropDownList).data("kendoDropDownList").select(0);
                    $(actionModals.ConfirmNotAvailable).displayModal();
                    break;

                case obtainmentActions.AwaitingSupplierResponse:
                    SetNextStepForSendToProcessingandAwaitSuppRes(nextStepsValues.AwaitingSupplierResponse, "AwaitingSupplierResponse", false);
                    $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesAwaitingSupplierResponse).val('');
                    $(actionModals.AwaitingSupplierResponse).displayModal();
                    break;

                case obtainmentActions.SentToProcessing:
                    SetNextStepForSendToProcessingandAwaitSuppRes(nextStepsValues.SentToProcessing, "SentToProcessing", false);
                    $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesSentToProcessing).val('');
                    $(actionModals.SentToProcessing).displayModal();

                    var guid = $("td[id^='ppcFiles_']").attr("id").replace("ppcFiles_", "");
                    removePPCAttachments(guid, "ALL");
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

        //This functionality is updated in new method, can be removed after discussion
        function initializeMultiSelectCheckboxesold(obj) {
            obj.on("mouseup MSPointerUp", ".chkMultiSelect", function (e) {
                selectedRequests = new Array();
                hasNonSDS = false;
                hasRevision = false;
                hasRevisionCount = 0;

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
                            if (this['OWType'] === 'Revision') {
                                hasRevisionCount++;
                            }
                        } else {
                            var index = selectedRequests.indexOf(this["ObtainmentWorkID"]);
                            if (index > -1) {
                                selectedRequests.splice(index, 1);
                                if (this['OWType'] === 'Revision') {
                                    hasRevisionCount--;
                                }
                            }
                        }

                        if (this['IsSelected'] && this['NoticeNumber'] != null)
                            hasNoticeNumbers = true;

                        if (this['IsSelected'] && this['NoticeNumber'] != null)
                            hasNoticeNumbers = true;

                        if (!this['IsSelected'] && this['DocumentType'] != 'SDS')
                            hasNonSDS = true;

                        if (!this['IsSelected'] && this['OWType'] === 'Revision')
                            hasRevision = true;

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
                hasNonSDS = false;
                hasRevision = false;
                itemsChecked = 0;
                hasRevisionCount = 0;

                if (grid) {
                    var kgrid = grid.data().kendoGrid;
                    if (kgrid._data.length > 0) {
                        $.each(kgrid._data, function () {
                            this['IsSelected'] = checked;
                            if (this['IsSelected']) {
                                selectedRequests.push(this["ObtainmentWorkID"]);
                                if (this['OWType'] === 'Revision') {
                                    hasRevisionCount++;
                                }
                            } else {
                                var index = selectedRequests.indexOf(this["ObtainmentWorkID"]);
                                if (index > -1) {
                                    selectedRequests.splice(index, 1);
                                    if (this['OWType'] === 'Revision') {
                                        hasRevisionCount--;
                                    }
                                }
                            }

                            if (this['IsSelected'] && this['NoticeNumber'] != null)
                                hasNoticeNumbers = true;

                            if (!this['IsSelected'] && this['NoticeNumber'] != null)
                                hasNoticeNumbers = false;

                            if (!this['IsSelected'] && this['DocumentType'] != 'SDS')
                                hasNonSDS = true;

                            if (!this['IsSelected'] && this['OWType'] === 'Revision')
                                hasRevision = true;
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

        function initializeMultiSelectCheckboxes(obj) {
            obj.on("mouseup MSPointerUp", ".chkMultiSelect", function (e) {
                /*commented by hitesh*/
                //selectedRequests = new Array();
                //hasNonSDS = false;
                //hasRevision = false;
                //hasRevisionCount = 0;
                var checked = $(this).is(':checked');
                if (checked) {
                    $(".chkMasterMultiSelect")[0].checked = false;
                }
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
                                var obtItemIndex = selectedRequests.indexOf(dataItem["ObtainmentWorkID"]);
                                if (obtItemIndex > -1)
                                    selectedRequests.splice(obtItemIndex, 1);
                                if (dataItem['OWType'] === 'Revision') {
                                    var indx = hasRevisionCount.indexOf(dataItem["ObtainmentWorkID"]);
                                    if (indx > -1)
                                        hasRevisionCount.splice(indx, 1);
                                }
                                if (dataItem['NoticeNumber'] != null) {
                                    var indx = hasNoticeNumbers.indexOf(dataItem["ObtainmentWorkID"]);
                                    if (indx > -1)
                                        hasNoticeNumbers.splice(indx, 1);
                                }
                                if (dataItem['DocumentType'] != 'SDS') {
                                    var indx = hasNonSDS.indexOf(dataItem["ObtainmentWorkID"]);
                                    if (indx > -1)
                                        hasNonSDS.splice(indx, 1);
                                }
                                grid.find('tr[data-uid="' + dataItem["uid"] + '"]').removeClass('k-state-selected');
                            } else {

                                selectedRows.push(selectedRow.attr('data-uid'));
                                grid.find('tr[data-uid="' + dataItem["uid"] + '"]').addClass('k-state-selected');
                                selectedRequests.push(dataItem["ObtainmentWorkID"]);
                                if (dataItem['OWType'] === 'Revision') {
                                    hasRevisionCount.push(dataItem["ObtainmentWorkID"]);
                                }
                                if (dataItem['NoticeNumber'] != null) {
                                    hasNoticeNumbers.push(dataItem["ObtainmentWorkID"]);
                                }
                                if (dataItem['DocumentType'] != 'SDS') {
                                    hasNonSDS.push(dataItem["ObtainmentWorkID"]);
                                }

                            }


                        }
                    }
                    itemsChecked = 0;
                    if (!checked) {
                        var allSelceted = true;
                        $.each(kgrid._data, function () {
                            if (!this['IsSelected']) {
                                $(".chkMasterMultiSelect")[0].checked = false;
                                allSelceted = false;
                                return false;
                            }
                        });
                        if (allSelceted) {
                            $(".chkMasterMultiSelect")[0].checked = true;
                        }
                    }
                    itemsChecked = selectedRequests.length;
                    UpdateNumberOfItemsChecked(itemsChecked);
                    e.stopImmediatePropagation();
                }

            });
            obj.on("click", ".chkMasterMultiSelect", function () {
                var checked = $(this).is(':checked');
                var grid = $(this).parents('.k-grid:first');
                //selectedRequests = new Array();
                //hasNonSDS = false;
                //hasRevision = false;
                //itemsChecked = 0;
                //hasRevisionCount = 0;
                if (grid) {
                    var kgrid = grid.data().kendoGrid;
                    if (kgrid._data.length > 0) {
                        $.each(kgrid._data, function () {
                            this['IsSelected'] = checked;
                            if (this['IsSelected']) {
                                var index = selectedRequests.indexOf(this["ObtainmentWorkID"]);
                                if (index < 0) {
                                    selectedRequests.push(this["ObtainmentWorkID"]);
                                    if (this['OWType'] === 'Revision') {
                                        var indx = hasRevisionCount.indexOf(this["ObtainmentWorkID"]);
                                        if (indx < 0) {
                                            hasRevisionCount.push(this["ObtainmentWorkID"]);
                                        }
                                    }
                                    if (this['NoticeNumber'] != null) {
                                        var indx = hasNoticeNumbers.indexOf(this["ObtainmentWorkID"]);
                                        if (indx < 0) {
                                            hasNoticeNumbers.push(this["ObtainmentWorkID"]);
                                        }
                                    }
                                    if (this['DocumentType'] != 'SDS') {
                                        var indx = hasNonSDS.indexOf(this["ObtainmentWorkID"]);
                                        if (indx < 0) {
                                            hasNonSDS.push(this["ObtainmentWorkID"]);
                                        }
                                    }
                                }

                            } else {
                                var index = selectedRequests.indexOf(this["ObtainmentWorkID"]);
                                if (index > -1) {
                                    selectedRequests.splice(index, 1);

                                    if (this['OWType'] === 'Revision') {
                                        var indx = hasRevisionCount.indexOf(this["ObtainmentWorkID"]);
                                        if (indx > -1)
                                            hasRevisionCount.splice(indx, 1);
                                    }
                                    if (this['NoticeNumber'] != null) {
                                        var indx = hasNoticeNumbers.indexOf(this["ObtainmentWorkID"]);
                                        if (indx > -1)
                                            hasNoticeNumbers.splice(indx, 1);
                                    }
                                    if (this['DocumentType'] != 'SDS') {
                                        var indx = hasNonSDS.indexOf(this["ObtainmentWorkID"]);
                                        if (indx > -1)
                                            hasNonSDS.splice(indx, 1);
                                    }
                                }
                            }
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

        //This method is just for debugging purpose
        $("#showSelected").click(function () {
            alert("Number Of Selcted Items Are : " + selectedRequests.length + " \n" + selectedRequests.join(","));
        })

        function UpdateNumberOfItemsChecked(numberOfItems) {

            if (numberOfItems > 0)
                $(obtainmentObject.controls.textBoxes.NumberOfItemsTextBox).text("(" + numberOfItems + ")").val(numberOfItems).trigger("change");
            else {

                // clear out number of items selected
                $(obtainmentObject.controls.textBoxes.NumberOfItemsTextBox).val("").trigger("change");

                // remove any previously selected rows
                while (selectedRows.length > 0) selectedRows.pop();

                // clean this out too
                while (selectedRequests.length > 0) selectedRequests.pop();

                // clean has notice number history
                while (hasNoticeNumbers.length > 0) hasNoticeNumbers.pop();

                // clean has non SDS  history
                while (hasNonSDS.length > 0) hasNonSDS.pop();

                // clean has revision  history
                while (hasRevisionCount.length > 0) hasRevisionCount.pop();

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

        function onCustomActionSupplierIdEnter(e) {
            if (e.keyCode == 13 || (e.ctrlKey && e.keyCode == 86)) {
                var senderTarget = $(e.currentTarget);
                if (IsNumeric(senderTarget.val())) {
                    e.preventDefault();
                    //var url = '@Url.Action("LookUpSupplierOnKeyEnter", "Company", new {Area = "Operations"})';
                    var url = GetEnvironmentLocation() + "/Operations/Company/LookUpSupplierOnKeyEnter";
                    var supplierId = senderTarget.val();

                    $.post(url, {
                        supplierInfo: supplierId
                    }, function (data) {
                        senderTarget.val(data);
                    });
                }
            }
        }

        var onLoadChanged = function (e) {
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

            var grid = $("#gdRequests").data("kendoGrid");
            var current_NewObtainmentCount = 0;
            var current_RevisionObtainmentCount = 0;
            var rows = grid.dataSource.view();
            for (var i = 0; i <= rows.length; i++) {
                if (rows[i] != undefined) {
                    current_NewObtainmentCount += rows[i].NewObtainmentCount;
                    current_RevisionObtainmentCount += rows[i].RevisionObtainmentCount;
                }

            }
            $('#current_NewObtainmentCount').html(current_NewObtainmentCount);
            $('#current_RevisionObtainmentCount').html(current_RevisionObtainmentCount);

        };

        var onObtainmentReqeustDetailDataBound = function (e) {
            $('.progress-value').tooltip({
                //delay: 100,
                showAfter: 50,
                //tooltipClass: "progress-value-tooltip-styling",
                //placement: "bottom",
                title: GetObtainmentWorkItemDueDiligence,
                html: true
            });
            var grid = $(obtainmentObject.controls.grids.GridDetailRequests).data("kendoGrid");
            var allSelceted = true;
            $.each(grid._data, function () {
                if (!this['IsSelected']) {
                    $(".chkMasterMultiSelect")[0].checked = false;
                    allSelceted = false;
                    return false;
                }
            });
            if (allSelceted) {
                $(".chkMasterMultiSelect")[0].checked = true;
            }
        };


        function GetObtainmentWorkItemDueDiligence() {
            var id = this.id;
            var split_id = id.split('_');
            var owiItemId = split_id[1];

            var ddHistory = "";
            $.ajax({
                type: 'GET',
                dataType: 'json',
                cache: false,
                async: false,
                url: controllerCalls.GetObtainmentActionAttemptsTableList,
                data: { obtainmentWorkItemID: owiItemId },
                success: function (result, textStatus, jqXHR) {
                    ddHistory = result.ddHistory;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $(this).displayError(messages.errorMessages.GeneralError);
                }
            });

            return ddHistory;
        }


        function SendEmailAndSaveObtainmentNextStep(strUrl, modalId) {
            if (!validateCompleteObtainmentActionsBeforeSave("SendEmail"))
                return;
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

                    // add items to model if next step is Completed (by Nitin)
                    addAdditionalObtainmentActionsDetailsForCompletedNextStep(actionName);
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
            if (!validateCompleteObtainmentActionsBeforeSave(actionName))
                return;

            var customerAction = false;
            var closeRequest = (actionName == "CloseRequest");

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

                    // add items to model if next step is Completed (by Nitin)
                    addAdditionalObtainmentActionsDetailsForCompletedNextStep(actionName);

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
                    if (actionName == "CloseRequest" || actionName == "CustomerAction") {

                        obtainmentMultipleWorkItemActionModel.ObtainmentActionCloseRequest = FillCloseRequest(actionName);
                        if (closeRequest) obtainmentMultipleWorkItemActionModel.CustomActionIndex = 0;

                    }

                    // if this is a customer action - make sure that a note has been entered.
                    if (customerAction) {
                        if (obtainmentMultipleWorkItemActionModel.Notes.replace(/g/, "").length == 0) {
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

                    if (actionName == "SentToProcessing") {

                        if ((obtainmentMultipleWorkItemActionModel.Notes + "").trim() == "") {
                            kendo.alert("Sent to processing notes are required.");
                            return;
                        }

                        if ($("td[id^='ppcFiles_']").html().indexOf("removePPCAttachments") < 0) {
                            kendo.alert("The selected items can not be sent to processing without files.");
                            return;
                        }

                        obtainmentMultipleWorkItemActionModel.Reference = $("#ppcFilesReference").val();
                        obtainmentMultipleWorkItemActionModel.OWID = GetOWID().owid;

                    } else {
                        obtainmentMultipleWorkItemActionModel.Reference = null;
                    }

                    if (actionName == "FlagDiscontinued" || actionName == "NotRequired") {
                        var url = controllerCalls.GetSiblingCountWithObtainmentList;
                        $(this).ajaxJSONCall(url, JSON.stringify(obtainmentMultipleWorkItemActionModel))
                            .success(function (result) {
                                if ((result.siblingCount - selectedRequests.length) > 0) {
                                    $("<div/>").kendoConfirm({
                                        title: messages.confirmationMessages.SiblingCascadingConfirmTitle,
                                        content: messages.confirmationMessages.SiblingCascadingConfirmMessage.format(result.siblingCount - selectedRequests.length),
                                        actions: [
                                            {
                                                text: 'Confirm',
                                                primary: true,
                                                action: function (e) {
                                                    ExecuteSaveObtainmentNextSteps(modalId, strUrl, obtainmentMultipleWorkItemActionModel)
                                                },
                                            },
                                            {
                                                text: 'Cancel',
                                                action: function (e) {
                                                },
                                            }
                                        ]
                                    }).data("kendoConfirm").open().center();
                                }
                                else
                                    ExecuteSaveObtainmentNextSteps(modalId, strUrl, obtainmentMultipleWorkItemActionModel)
                            }).error(function () {
                                $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);
                            });
                        return;
                    }

                    if (selectedRequests.length > 0) {
                        ExecuteSaveObtainmentNextSteps(modalId, strUrl, obtainmentMultipleWorkItemActionModel)
                    }
                }
                else {
                    $(modalId).toggleModal();
                    $(this).displayError(messages.errorMessages.NoStepSelected);
                }
            }
        }

        function ExecuteSaveObtainmentNextSteps(modalId, strUrl, obtainmentMultipleWorkItemActionModel) {
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

        function FillCloseRequest(actionName) {
            var strCustomerAction = "";
            var ddlCustomerActions = $(obtainmentObject.controls.dropdownlists.CloseRequestCustomerActionsDropDownList).data("kendoDropDownList");
            var ddlReasonCodes = $(obtainmentObject.controls.dropdownlists.CloseRequestReasonCode).data("kendoDropDownList");

            // customer action
            obtainmentActionCloseRequest.CustomerActionsId = ddlCustomerActions.text().substring(0, ddlCustomerActions.text().indexOf("-") - 1);
            obtainmentMultipleWorkItemActionModel.CustomActionIndex = obtainmentActionCloseRequest.CustomerActionsId;
            // customer reason code text
            obtainmentActionCloseRequest.ReasonCodeId = $(obtainmentObject.controls.dropdownlists.CloseRequestReasonCode).val();
            if (obtainmentActionCloseRequest.ReasonCodeId == "") obtainmentActionCloseRequest.ReasonCodeId = null;
            var reasonCode = ddlReasonCodes.text();

            //thatObservable.set("silbingSupplierId", data.split(",")[0]);
            var supplierSiblingInfo = $(obtainmentObject.controls.textBoxes.SupplierSiblingId).val();
            if (supplierSiblingInfo.replace(/g/, "").length > 0) {
                obtainmentMultipleWorkItemActionModel.siblingSupplierId = supplierSiblingInfo.split(",")[0];
            }

            //          if (actionName == "CustomerAction") {
            //              strCustomerAction = "Customer Action: " + ddlCustomerActions.value() + "<br>" + "Reason Code:" + ddlReasonCodes.text() + "<br>Notes:";
            //          }

            obtainmentMultipleWorkItemActionModel.Notes = strCustomerAction + $(obtainmentObject.controls.textBoxes.ObtainmentActionNotesCloseRequest).val();

            // null out anything other than close request
            obtainmentMultipleWorkItemActionModel.ObtainmentActionLogPhoneCallModel = null;
            obtainmentMultipleWorkItemActionModel.ObtainmentActionSendEmailModel = null;

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
                                    // Nitin-TRECOMPLI-3990: Obtainment- Email pop-up tab function
                                    setTimeout(function () {
                                        $(actionModals.SendEmail).attr("tabindex", -1).focus();
                                        $(actionModals.SendEmail).removeAttr("tabindex");
                                    }, 1000);

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
                    responses: responses,
                    status: true
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
                    return "<a onclick='obtainmentLib.AddRevisionPage(" + OSourceId + "," + ObtainmentWorkItemID + ")' title='Add Revision',  target='_blank' style='cursor:pointer' class='3ecomplibuttontoggle'>" + "<span class='icon-plus' style='cursor:pointer;'></a>";
                }
            }
            else if (OWType == "New") {
                if (NextObtainmentStepLkpID == "6") {
                    return "<a href='../../Configuration/ProductManager/ConfigProduct?productid=" + ProductId + "' title='View Product Detail',  target='_blank' class='3ecomplibuttontoggle'>" + "<span class='icon-eye-open' style='cursor: hand;'></a>";
                } else {
                    //Commented and updated  by hitesh on 4/27/2021 for ticket TRECOMPLI-4212 to check if item resolved
                    //return "<a href='../Document/AddNewDocument?productid=" + ProductId + "&sid=" + SupplierId + "&obtainmentWorkItemID=" + ObtainmentWorkItemID + "' title='Add Document',  target='_blank'>" + "<span class='icon-plus' style='cursor: hand;'></a>";
                    return "<a onclick='obtainmentLib.AddDocumentPage(" + ProductId + "," + SupplierId + "," + ObtainmentWorkItemID + ")' title='Add Document',  target='_blank' style='cursor:pointer'>" + "<span class='icon-plus' style='cursor: hand;'></a>";
                }
            }
            else {
                //Due to old data obtainmentworkitem records not able to identify OWType, in that case display product page.
                return "<a href='../../Configuration/ProductManager/ConfigProduct?productid=" + ProductId + "' title='View Product Detail',  target='_blank'>" + "<span class='icon-eye-open' style='cursor: hand;'></a>";
            }
        }

        /*
         * Created BY Hitesh on 4/27/2021
         * This function open a new page for adding Revision only if item not resolved          
         */
        function AddRevisionPage(OSourceId, ObtainmentWorkItemID) {
            $(this).ajaxCall(controllerCalls.CheckWorkItemStatus, { ObtainmentWorkItemID: ObtainmentWorkItemID })
                .success(function (data) {
                    if (data.nextSteplkpID == 6) {
                        kendo.alert(messages.errorMessages.AlreadyResolved);
                        $(obtainmentObject.controls.grids.GridDetailRequests).data("kendoGrid").dataSource.read()
                    }
                    else {
                        var val = "../Document/RevisonObtainmentDocument?rorid=" + OSourceId + "&obtainmentWorkItemID=" + ObtainmentWorkItemID;
                        window.open(val, '_blank');
                    }
                })
        }
        /*
         * Created BY Hitesh on 4/27/2021
         * This function open a new page for adding new document only if item not resolved
    
         */
        function AddDocumentPage(ProductId, SupplierId, ObtainmentWorkItemID) {
            $(this).ajaxCall(controllerCalls.CheckWorkItemStatus, { ObtainmentWorkItemID: ObtainmentWorkItemID })
                .success(function (data) {
                    if (data.nextSteplkpID == 6) {
                        kendo.alert(messages.errorMessages.AlreadyResolved);
                        $(obtainmentObject.controls.grids.GridDetailRequests).data("kendoGrid").dataSource.read()
                    }
                    else {
                        var val = "../Document/AddNewDocument?productid=" + ProductId + "&supplierid=" + SupplierId + "&obtainmentWorkItemID=" + ObtainmentWorkItemID;
                        window.open(val, '_blank');
                    }
                })
        }

        function displayMessageAlert(message) {
            var prompt = {};
            prompt.header = "Message";
            prompt.message = message;

            DisplayErrorMessageInPopUp(prompt, function () {
                // do nothing
            });
        }
        function uploadPPCAttachments(ctrl, guid) {
            var isvalidFile = true;
            $.each(ctrl.files, function (index, value) {
                //var fileExtension = ['.htm', '.html'];
                var fileExtension = ['.txt', '.doc', '.docx', '.xls', '.xlsx', '.tif', '.tiff', '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.bmp', '.gif', '.pdf'];
                var splitStr = value.name.split('.');
                if (value.name.length && $.inArray('.' + splitStr[splitStr.length - 1].toLowerCase(), fileExtension) == -1) {
                    //ctrl.preventDefault();
                    //displayMessageAlert("HTML files are not allowed")
                    displayMessageAlert("Only these files are allowed: .txt, .doc, .docx, .xls, .xlsx, .tif, .tiff, .ppt, .pptx, .jpg, .jpeg, .png, .bmp, .gif, .pdf")
                    isvalidFile = false;
                }
                if (isvalidFile == false) {
                    return false;
                }
            });
            var maxSizeForEachSingleFile_MB = 20;
            var maxFilesSize_MB = 25;
            var maxFilesCount = 100;
            var files = ctrl.files;
            if (files.length > 0 && isvalidFile) {
                var TotalFileSize = 0;
                var TotalFileCount = 0;
                var myEle = document.getElementById("id_paperClipAttachments_totalSize");
                if (myEle) {
                    TotalFileSize = +myEle.value;
                    TotalFileCount=(+(document.getElementById("id_paperClipAttachments_Count").value))
                }
                
                if ((files.length + TotalFileCount) > maxFilesCount) {
                    displayMessageAlert("Number of files cannot exceed " + maxFilesCount + ", please remove the necessary file(s).");
                    return ;
                }

                if (window.FormData !== undefined) {
                    var _size = 0;
                    var data = new FormData();
                    for (var x = 0; x < files.length; x++) {                        
                        data.append("file" + x, files[x]);
                        _size += files[x].size;
                    }
                    if (_size > (maxSizeForEachSingleFile_MB * 1024 * 1024)) {

                        displayMessageAlert("One or more files are larger than " + maxSizeForEachSingleFile_MB + "MB, please remove these file(s).");

                        return;
                    }
                    if ((_size + TotalFileSize) <= (maxFilesSize_MB * 1024 * 1024)) {

                        $.ajax({
                            type: "POST",
                            url: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/UploadPPCFiles?guid=" + guid,
                            contentType: false,
                            processData: false,
                            data: data,
                            success: function (result) {
                                $("#ppcFiles_" + guid).html(result);
                                return;
                            },
                            error: function (xhr, status, p3, p4) {
                                var err = "Error " + " " + status + " " + p3 + " " + p4;
                                if (xhr.responseText && xhr.responseText[0] == "{")
                                    err = JSON.parse(xhr.responseText).Message;
                                console.log(err);
                                return;
                            }
                        });
                    }
                    else {
                        displayMessageAlert("Total file size cannot exceed " + maxFilesSize_MB + " MB, please remove the necessary file(s).");
                        return;
                    }
                } else {
                    alert("This browser doesn't support HTML5 file uploads!");
                    return;
                }
            }


        }

        function removePPCAttachments(guid, fileName) {

            $.ajax({
                type: "POST",
                url: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/RemovePPCFile?guid=" + guid + "&fileName=" + fileName,
                contentType: false,
                processData: false,
                data: {},
                success: function (result) {
                    $("#ppcFiles_" + guid).html(result);
                    return;
                },
                error: function (xhr, status, p3, p4) {
                    var err = "Error " + " " + status + " " + p3 + " " + p4;
                    if (xhr.responseText && xhr.responseText[0] == "{")
                        err = JSON.parse(xhr.responseText).Message;
                    console.log(err);
                    return;
                }
            });

        }
        function addAdditionalObtainmentActionsDetailsForCompletedNextStep(actionName) {
            if (actionName == 'LogExternalEmail' || actionName == 'FollowUp' || actionName == 'LogWebSearch' || actionName == 'PhoneCall' || actionName == 'SendEmail') {
                var ddlobtainmentAction = $(obtainmentObject.controls.dropdownlists.CompletedObtainmentActionsDropDownList + actionName).data("kendoDropDownList");
                var obtainmentAction = ddlobtainmentAction.text();
                var ddlCustomerAction = $(obtainmentObject.controls.dropdownlists.CompletedCustomerActionDropDownList + actionName).data("kendoDropDownList");

                var nextStepvalue = $(obtainmentObject.controls.dropdownlists.NextStepsDropDownList + actionName).data("kendoDropDownList").text();
                if (nextStepvalue == 'Completed') {
                    obtainmentMultipleWorkItemActionModel.AdditionalObtainmentActionLkpID = ddlobtainmentAction.value();
                    obtainmentMultipleWorkItemActionModel.AdditionalNotes = ddlCustomerAction.text();
                }
            }
        }
        function validateCompleteObtainmentActionsBeforeSave(actionName) {
            if (actionName == 'LogExternalEmail' || actionName == 'FollowUp' || actionName == 'LogWebSearch' || actionName == 'PhoneCall' || actionName == 'SendEmail') {
                var ddlobtainmentAction = $(obtainmentObject.controls.dropdownlists.CompletedObtainmentActionsDropDownList + actionName).data("kendoDropDownList");
                var obtainmentAction = ddlobtainmentAction.text();
                var ddlCustomerAction = $(obtainmentObject.controls.dropdownlists.CompletedCustomerActionDropDownList + actionName).data("kendoDropDownList");

                var nextStepvalue = $(obtainmentObject.controls.dropdownlists.NextStepsDropDownList + actionName).data("kendoDropDownList").text();
                if (nextStepvalue == 'Completed') {
                    if (obtainmentAction == 'Select One') {
                        kendo.alert(messages.errorMessages.ObtainmentActionMissing);
                        return false;
                    }
                    else if (ddlobtainmentAction.value() == obtainmentActions.CustomerAction) {
                        if (ddlCustomerAction.value() == -1) {
                            kendo.alert(messages.errorMessages.CustomerActionMissing);
                            return false;
                        }
                    }
                    else {
                        var newSelected = false;
                        var grid = $("#gdDetailRequests").data("kendoGrid");
                        $.each(grid._data, function () {
                            if (this['IsSelected']) {
                                if ((this['OWType']).toUpperCase().indexOf("NEW") >= 0) {
                                    newSelected = true;
                                }
                            }
                        });
                        if (newSelected) {
                            if (ddlobtainmentAction.value() == obtainmentActions.ConfirmAsCurrent) {
                                kendo.alert(messages.errorMessages.OneOrMoreSelectionsNotRevisions);
                            }
                            if (ddlobtainmentAction.value() == obtainmentActions.FlagDiscontinued) {
                                kendo.alert(messages.errorMessages.DiscontinuedActionForRevisionOnly);
                            }
                            ddlobtainmentAction.select(0);
                            return false;
                        }
                    }
                }
            }
            return true;
        }
        return {
            loadRequests: loadRequests,
            loadRequestsPlugin: loadRequestsPlugin,
            loadSupplierNotes: loadSupplierNotes,
            onDdlDataBound: onDdlDataBound,
            onLoadChange: onLoadChanged,
            onCustomActionSupplierIdEnter: onCustomActionSupplierIdEnter,
            onObtainmentReqeustDataBound: onObtainmentReqeustDataBound,
            onObtainmentReqeustDetailDataBound: onObtainmentReqeustDetailDataBound,
            loadSentEmail: loadSentEmail,
            selectedSuperMailSupplierId: selectedSuperMailSupplierId,
            ObtainmentDetailRoute: ObtainmentDetailRoute,
            AddRevisionPage: AddRevisionPage,
            AddDocumentPage: AddDocumentPage,
            uploadPPCAttachments: uploadPPCAttachments,
            removePPCAttachments: removePPCAttachments

        };
    };
})(jQuery);
//Nitin-10/21/2020:TRECOMPLI-3990 Obtainment- Email pop-up tab function (tab Index will not go to HTML Editor buttons)
$(document).ready(function () {
    $(".k-tool-group .k-tool,.k-tool-group .k-colorpicker").attr("tabindex", - 1);
});
