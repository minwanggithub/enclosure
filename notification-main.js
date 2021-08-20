; (function ($) {
    if ($.fn.complibNotification == null) {
        $.fn.complibNotification = {};

    }
    $.fn.complibNotification = function () {
        //Local variables
        var notificatonAttachments = [];
        var itemsChecked = 0;
        var selectedRequests = new Array();         // ids selected in the grid
        var selectedRows = new Array();

        var UIObject = {
            sections: {
                searchSection: function() { return $("#divSearchSection"); },
                searchResultSection: function() { return $("#divSearchResult"); },
                noticeDetailSection: function() { return $("#divNotificationDetail"); },
                noticePopUpSection: function() { return $("#divNotificationModalPopup"); },
                existFileSection: function() { return $("#divExistFileSection"); },
                embedFileUploadSection: function() { return $("#NotificationAttachFiles"); }
            },

            containers: {
                NewNotification: "#pnlNewNotification",
                NotificationModalPopup: "#NotificationModalPopup",
                NotificationGrid: "#NotificationGrid",
                NotificationModalPopupDiv: "#divNotificationModalPopup",
            },

            controls: {
                grids: {
                    GridSearchNoticeBatch: "#gdSearchNoticeBatch",
                    GridNotificationAttachment: "#gdNotificationAttachment",
                    GridNotificationBatchItems: "#gdNoticeBatchItems",
                },

                buttons: {
                    ClearRequestSearchButton: "#clearRequestSearchBtn",
                    SearchRequestsButton: "#searchRequestBtn",
                    EditSave: "#btnEditSaveNotification",
                    EditCancel: "#btnEditCancelNotification",
                    RemoveNotificationBatchItemsButton: "#btnRemoveItems",
                    SendNotificationImmediatelyButton: "#btnSendNotification"
                },

                dropdownlists: {
                    ObtainmentTypeDropDownList: "#mltDdlObtainmentType",
                    ObtainmentEditTypeDropDownList: "#mltDdlEditObtainmentType",
                    EditNextStep: "#ddlEditNextStep",
                    EditEmailTemplate: "#ddlEditEmailTemplate",
                    EditNoticeStatus: "#ddlEditNoticeStatus",
                    ObtainmentState: "#ddlObtainmentState",
                    OverrideNextStep: "#ddlOverrideNextStep",
                    CustomerAction: "#ddlCustomerAction",
                    ObtainmentAction: "#ddlObtainmentAction",
                    Teams: "#ddlTeams",
                },

                textbox: {
                    AccountId: "#txtEditAccountId",
                    NoticeBatchId: "#txtEditNoticeBatchId",
                    NumberOfItemsTextBox: "#numberOfItems",
                    EmailSubject: "#txtEditEmailSubject",
                    SummaryRecipient:"#txtEditSummaryRecipient"
                },

                checkbox: {
                    AllSDS: "#AllSDS",
                    AllNonSDS: "#AllNonSDS",
                },

                datepickers: {
                    EditScheduledDate: "#dteEditScheduledDate",
                    NoticeDueDateFrom: "#dteNoticeDueDateFrom",
                    NoticeDueDateTo: "#dteNoticeDueDateTo"
                },

                div: {
                    EmailTemplateBodyDiv: "#emailTemplateBody",
                    CustomerActionDiv:"#dvnoticeCustomerAction",
                }

            },

            observable: {
                NextStepId: "NextStepId",
                ObtainmentList: "ObtainmentList",
                ObtainmentIndex: "ObtainmentIndex",
                AccountIdArray: "AccountIdArray",
                EmailTemplateId: "EmailTemplateId",
                EmailSubject: "EmailSubject",
                NotificationStatusId: "NotificationStatusId",
                ScheduledDate: "ScheduledDate",
                ActualSendDate: "ActualSendDate",
                ObtainmentState: "ObtainmentState",
                NoticeBatchId:"NoticeBatchId"
            },


            window: {
                NotificationPopUpWindow: "#notificationPopUpWindow"
            },

            notificationModals: { EmailTemplatePreview: "#mdlEmailTemplatePreview" }
    }
        
                
        var controllerCalls = {
            SearchNoticfication: GetEnvironmentLocation() + "/Operations/Notification/SearchNotification",
            LoadNotificationTemplate: GetEnvironmentLocation() + "/Operations/Notification/LoadNotificationTemplate",
            SaveNotificationTemplate: GetEnvironmentLocation() + "/Operations/Notification/SaveNotificationTemplate",
            ReDefineNotificationTemplate: GetEnvironmentLocation() + "/Operations/Notification/ReDefineNotificationTemplate",
            SaveExistingNotificationAttachment: GetEnvironmentLocation() + "/Operations/Notification/SaveExistingNotificationAttachment",
            LoadNotificationAttachmentGrid: GetEnvironmentLocation() + "/Operations/Notification/LoadNotificationAttachmentGrid",
            DeleteNotificationAttachment: GetEnvironmentLocation() + "/Operations/Notification/DeleteAttachment",
            DeleteNotificationBatch: GetEnvironmentLocation() + "/Operations/Notification/DeleteNotificationBatch",
            EmailTemplatePreview: GetEnvironmentLocation() + "/Configuration/EmailTemplate/Preview",
            FinalMergedEmail: GetEnvironmentLocation() + "/Operations/Notification/FinalMergedEmail",
            RemoveNoticeBatchItems: GetEnvironmentLocation() + "/Operations/Notification/RemoveNoticeBatchItems",
            SendNotificationImmediately: GetEnvironmentLocation() + "/Operations/Notification/SendNotificationImmediately",
            AddNewBatchAttachments: GetEnvironmentLocation() + "/Operations/Notification/AddNewBatchAttachments",
            RemoveNewBatchAttachments: GetEnvironmentLocation() + "/Operations/Notification/RemoveAttachmentsAlt",
            Load_SDS_NonSDS_Obtainment_Type_Ids: GetEnvironmentLocation() + "/Operations/Notification/LoadObtainmentTypeSdsAndNonSdsIds",
        };

        var messages = {
            successMessages: {
                Saved: "Saved Successful",
                NotificationQueuedForProcessing: "Notice batch queued for immediate processing.",
                SuperEmailDirection: "<br/><b>Please follow <a href='*'>this link</a> to submit your document. </b> <br/><br/>"
            },            
            warningMessages:{
                confirmAttachmentDelete: "Are you sure you want to delete the selected item(s)?",
                PromptForInformationChange: "Batch is ready to Send. If you modify any related informtion, the batch will be regenerated. Are you sure?",
                confirmImmediateNotificationSend : "Are you sure you want the notification to be sent immediately ?"
            },
            errorMessages: {
                SearchFailure: "Search failure",
                NoCriteria: "Filters must be selected to execute a search.",
                MissingRequiredFields: "All required fields must be filled.",
                ScheduledDateError: "Scheduled date has to be greater than today's date.",
                LoadNewNotificationFailure: "Cannot load new notification template.",
                DeleteAttachmentFailure: "Cannot delete attachment ",
                SaveAttachmentFailure: "Cannot save attachment ",
                ReasonForNotAllowChange: "Batch can't be modified if the status is Sent.",                
                ReasonForNotAllowDelete: "Batch can't be deleted because the status is Sent.",                
                LoadEmailPreviewError: "Unable to load email template preview.",
                NoItemsSelected: "No items have been selected",
                EmailSubjectMissing: "Email subject missing.",
                MissingNoticeNumber: "Notice number token missing from email subject line.",
                MissingSummaryRecipient: "Notice summary recipient is required.",
                SingleAccountRequired: "A single Account must be specified for Notifications for 'All Steps'.",
                CustomAction47NotAvailable: "Custom Action 47 is not available at this moment for bulk notices.",
                NoCustomerActionSelected: "No customer action has been selected.",
                CustomerActionRequired: "Customer action required.",
                Load_SDS_NonSDS_Obtainment_Type_Failure:"Cannot load obtainment type's for selecting all SDS and Non SDS."
            }
        };
        
        var searchBind = function () {
            var viewModel = kendo.observable({
                NextStepId: -1,
                ObtainmentList: null,
                ObtainmentIndex: null,
                AccountIdArray: "",
                EmailTemplateId: 0,
                NotificationStatusId: -1,
                ScheduledDate: null,
                ActualSendDate: null,
                EmailSubject: "",
                NoticeBatchId:"",

                HasCriteria: function (e) {
                    var fieldCheck = (this.get(UIObject.observable.NextStepId) >= 0
                        || (this.get(UIObject.observable.ObtainmentList)).length > 0
                        || this.get(UIObject.observable.AccountIdArray) !== ""
                        || this.get(UIObject.observable.EmailTemplateId) > 0
                        || this.get(UIObject.observable.NotificationStatusId) > 0
                        || this.get(UIObject.observable.ScheduledDate) != null
                        || this.get(UIObject.observable.EmailSubject) !== ""
                        || this.get(UIObject.observable.NoticeBatchId) !== ""
                        || this.get(UIObject.observable.ActualSendDate) != null);
                    return fieldCheck;
                },

                SearchClick: function (e) {
                   
                    //e.preventDefault();
                    this.set(UIObject.observable.ObtainmentList, ($("#divSearchSection " +
                        UIObject.controls.dropdownlists.ObtainmentTypeDropDownList).data("kendoMultiSelect").value()).map(function (item) {
                        return parseInt(item, 10);
                    }));
                    var nofield = this.HasCriteria();
                    if (!this.HasCriteria()) {
                        $(this).displayError(messages.errorMessages.NoCriteria);
                    }
                    else {
                        kendo.ui.progress(UIObject.sections.searchResultSection(), true);
                           
                        //need to verify that dropdowns are set back to 0 instead of empty string if not selected this causes a Object Reference Exception
                        if (this.NextStepId == "")
                            this.NextStepId = -1;

                        if (this.EmailTemplateId == "")
                            this.EmailTemplateId = 0;

                        if (this.NotificationStatusId == "")
                            this.NotificationStatusId = 0;

                        this.EmailSubject = decodeURIComponent(this.EmailSubject);
                        if (this.NoticeBatchId == "")
                            this.NoticeBatchId = 0;
                        SearchNotification(JSON.stringify(this));
                        //$(this).ajaxCall(controllerCalls.SearchNoticfication, { searchCriteria: JSON.stringify(this) })
                        //       .success(function (data) {
                        //           UIObject.sections.searchResultSection().html(data);
                        //       }).error(
                        //       function () {
                        //           $(this).displayError(errorMessages.SearchFailure);
                        //       });
                    }
                },

                ClearClick: function (e) {
                    //e.preventDefault();
                    this.set(UIObject.observable.NextStepId, -1);
                    this.set(UIObject.observable.ObtainmentList, null);
                    this.set(UIObject.observable.AccountIdArray,"");
                    this.set(UIObject.observable.EmailTemplateId, 0);
                    this.set(UIObject.observable.EmailSubject, "");
                    this.set(UIObject.observable.NoticeBatchId, "");
                    this.set(UIObject.observable.NotificationStatusId, 0);
                    this.set(UIObject.observable.ScheduledDate, null);
                    this.set(UIObject.observable.ActualSendDate, null);
                    $("#divSearchSection " + UIObject.controls.dropdownlists.ObtainmentTypeDropDownList).data("kendoMultiSelect").value([]);

                    var searchResultGrid = $(UIObject.controls.grids.GridSearchNoticeBatch).data("kendoGrid");
                    if (searchResultGrid != null && searchResultGrid.dataSource.total() != 0) {
                        //searchResultGrid.dataSource.filter([]);
                        searchResultGrid.dataSource.data([]);
                        //searchResultGrid.dataSource.read();
                    }
                    //if ((null != noticeGrid()) && (noticeGrid().dataSource.total() > 0))
                    //    noticeGrid().dataSource.data([]);
                },

                AddNewClick: function (e) {

                    //e.preventDefault();
                    //This is for embedding
                    var container = $(UIObject.containers.NewNotification);
                    if (container.length > 0) container.show(500);

                    LoadNotificationPopUp(0);

                }
            });
            kendo.bind(UIObject.sections.searchSection(), viewModel);
        };

        $(UIObject.containers.NotificationGrid).on("click", UIObject.controls.buttons.SendNotificationImmediatelyButton, function () {

            var args = {
                header: 'Confirm Immediate Notification Send',
                message: messages.warningMessages.confirmImmediateNotificationSend
            };

            var noticeBatchId = SearchCriteria().batchId;
            
            DisplayConfirmationModal(args, function () {
                $(this).ajaxCall(controllerCalls.SendNotificationImmediately, { noticeBatchId: noticeBatchId })
                    .success(function (data) {

                        $(this).savedSuccessFully(messages.successMessages.NotificationQueuedForProcessing);
                        $(UIObject.controls.buttons.SendNotificationImmediatelyButton).hide();

                    }).error(function () {
                        $(this).displayError("Send Notification Failed");
                    });
            });

            return false;
        });

        $(UIObject.containers.NotificationGrid).on("click", UIObject.controls.buttons.RemoveNotificationBatchItemsButton, function () {
            var args = {
                header: 'Confirm Notification Remove Batch Items',
                message: messages.warningMessages.confirmAttachmentDelete
            };
           
            if (typeof selectedRequests !== 'undefined' && selectedRequests.length > 0) {
                DisplayConfirmationModal(args, function () {
                    $(this).ajaxCall(controllerCalls.RemoveNoticeBatchItems, { ids: selectedRequests })
                        .success(function() {
                            LoadNotificationBatchItems();
                        }).error(
                            function() {
                                $(this).displayError(messages.errorMessages.SearchFailure);
                            });
                });
            } else
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            return false;
        });

        var onOverrideNextStep = function () {
            var nextStepvalue = $(UIObject.controls.dropdownlists.OverrideNextStep).data("kendoDropDownList").text();
            if (nextStepvalue == 'Completed') {
                $(UIObject.controls.dropdownlists.ObtainmentAction).data("kendoDropDownList").enable(true);
            }
            else {
                $(UIObject.controls.dropdownlists.ObtainmentAction).data("kendoDropDownList").enable(false);
                $(UIObject.controls.dropdownlists.ObtainmentAction).data("kendoDropDownList").value("");
                $(UIObject.controls.div.CustomerActionDiv).css({ display: 'none' });
            }
        };

        var onCustomerActionObtainmentAction = function () {
            var nextStepvalue = $(UIObject.controls.dropdownlists.ObtainmentAction).data("kendoDropDownList").text();
            if (nextStepvalue == 'Customer Action') {
                $(UIObject.controls.div.CustomerActionDiv).css({ display: 'block' });
                $(UIObject.controls.dropdownlists.CustomerAction).data("kendoDropDownList").value("3E has been unsuccessful in multiple attempts to obtain the requested document(s) with the manufacturer information provided. Thank you.");
            }
            else {
                $(UIObject.controls.div.CustomerActionDiv).css({ display: 'none' });
            }
        };

        // customer notes action
        var onCustomerAction = function () {
            var selNotes = $(UIObject.controls.dropdownlists.CustomerAction).data("kendoDropDownList");
            // selected customer action
            var selCustomerAction = selNotes.text();
            if (selCustomerAction == "Select One") selCustomerAction = "";

            var dashIndex = selCustomerAction.indexOf("-");
            var actionNumber = selCustomerAction.substr(0, dashIndex - 1);

            if (actionNumber === "47") {
                alert(messages.errorMessages.CustomAction47NotAvailable);
                selNotes.select(0);
                
                return false;
            }
            
        };

        // display Obtainment action dropdown
        function onOverrideNextStepDataBound() {
            var nextStepvalue = $(UIObject.controls.dropdownlists.OverrideNextStep).data("kendoDropDownList").text();
            if (nextStepvalue == 'Completed') {
                $(UIObject.controls.dropdownlists.ObtainmentAction).data("kendoDropDownList").enable(true);
            }
            else {
                $(UIObject.controls.dropdownlists.ObtainmentAction).data("kendoDropDownList").enable(false);
                $(UIObject.controls.div.CustomerActionDiv).css({ display: 'none' });
            }
        }

        // display customer action dropdown
        function onObtainmentActionDataBound() {
            var nextStepvalue = $(UIObject.controls.dropdownlists.ObtainmentAction).data("kendoDropDownList").text();
            if (nextStepvalue == 'Customer Action') {
                $(UIObject.controls.div.CustomerActionDiv).css({ display: 'block' });
            }
            else {
                $(UIObject.controls.div.CustomerActionDiv).css({ display: 'none' });
            }
        }



        function SearchNotification(searchCriteria) {
            $(this).ajaxCall(controllerCalls.SearchNoticfication, { searchCriteria: searchCriteria })
                                 .success(function (data) {
                                     UIObject.sections.searchResultSection().html(data);
                                 }).error(
                                 function () {
                                     $(this).displayError(messages.errorMessages.SearchFailure);
                                 });
        }

        var onNewNotificationPanelActivate = function () {
            viewModel = kendo.observable({
                CancelClick: function (e) {
                    e.preventDefault();
                    var container = $(UIObject.containers.NewNotification);
                    if (container.length > 0) container.hide();
                },
                SaveClick: function (e) {
                    e.preventDefault();
                    kendo.alert("save");
                }
            });

            kendo.bind(UIObject.sections.noticeDetailSection(), viewModel);
        };

        var InitializeSearchResultGrid = function () {
            //InitializeSearch();
        };


        var LoadNotificationPopUp = function (noticeBatchId) {
            $(this).ajaxCall(controllerCalls.LoadNotificationTemplate, { noticeBatchId: noticeBatchId })
                         .success(function (data) {
                             notificatonAttachments =[];
                             UIObject.sections.noticeDetailSection().html(data);
                         }).error(
                         function () {
                                 $(this).displayError(messages.errorMessages.LoadNewNotificationFailure);
                         });
        };

        var LoadNotificationAttachmentGrid = function (noticeBatchId) {
            $(this).ajaxCall(controllerCalls.LoadNotificationAttachmentGrid, { noticeBatchId: noticeBatchId })
                         .success(function (data) {
                             UIObject.sections.existFileSection().html(data);
                         }).error(
                         function () {
                                 $(this).displayError(messages.errorMessages.LoadNewNotificationFailure);
                         });
        };
        var sDS_NonSDS_Obtainment_Type_Ids = undefined;
        var Load_SDS_NonSDS_Obtainment_Type_Ids = function () {
            $(this).ajaxCall(controllerCalls.Load_SDS_NonSDS_Obtainment_Type_Ids, {  })
                .success(function (data) {
                    sDS_NonSDS_Obtainment_Type_Ids = data;
                    //UIObject.sections.existFileSection().html(data);
                }).error(
                    function (e) {
                        $(this).displayError(messages.errorMessages.Load_SDS_NonSDS_Obtainment_Type_Failure);
                    });
        };

        var chk_AllSds_Change = function (e) {
            if (sDS_NonSDS_Obtainment_Type_Ids) {
                var sdsIds = sDS_NonSDS_Obtainment_Type_Ids.ObtainmentTypeSdsIds;
                var multiSelect = $("#mltDdlEditObtainmentType").data("kendoMultiSelect");
                var selectedValues = multiSelect._old.map(String);

                for (var i = 0; i < multiSelect.dataSource.data().length; i++) {
                    var item = multiSelect.dataSource.data()[i];
                    if (sdsIds.filter(id => id == +item.Value).length) {
                        if (e.checked) {
                            if (selectedValues.filter(id => id == item.Value).length == 0) {
                                selectedValues.push(item.Value);
                            }
                        }
                        else {
                            selectedValues.splice(selectedValues.indexOf(item.Value), 1);
                        }
                    }

                }
                multiSelect.value(selectedValues);
                multiSelect.trigger("change");
            }
        }
        var chk_AllNonSDS_Change = function (e) {
            if (sDS_NonSDS_Obtainment_Type_Ids) {
                var nonSdsIds = sDS_NonSDS_Obtainment_Type_Ids.ObtainmentTypeNonSdsIds;
                var multiSelect = $("#mltDdlEditObtainmentType").data("kendoMultiSelect");
                var selectedValues = multiSelect._old.map(String);

                for (var i = 0; i < multiSelect.dataSource.data().length; i++) {
                    var item = multiSelect.dataSource.data()[i];
                    if (nonSdsIds.filter(id => id == +item.Value).length) {
                        if (e.checked) {
                            if (selectedValues.filter(id => id == item.Value).length == 0) {
                                selectedValues.push(item.Value);
                            }
                        }
                        else {
                            selectedValues.splice(selectedValues.indexOf(item.Value), 1);
                        }
                    }

                }
                multiSelect.value(selectedValues);
                multiSelect.trigger("change");
            }
        }
        var mltDdlEditObtainmentType_deselect = function (e) {
            var deselectId = e.dataItem.Value;
            var chkSDS = $(UIObject.controls.checkbox.AllSDS).prop("checked");
            var chkNonSDS = $(UIObject.controls.checkbox.AllNonSDS).prop("checked");
            var nonSdsIds = sDS_NonSDS_Obtainment_Type_Ids.ObtainmentTypeNonSdsIds;
            var SdsIds = sDS_NonSDS_Obtainment_Type_Ids.ObtainmentTypeSdsIds;
            if (chkNonSDS && nonSdsIds.filter(id => id == +deselectId).length) {
                $(UIObject.controls.checkbox.AllNonSDS).prop('checked', false);
            }
            else if (chkSDS && SdsIds.filter(id => id == +deselectId).length) {
                $(UIObject.controls.checkbox.AllSDS).prop('checked', false);
            }

        }
        var InitializePopUpDetailDynamic = function () {
            //var container = $("#divNotificationModalPopup");
            //UIObject.buttons.EditCancel, onEditCancelButtonClick);

            $(UIObject.controls.buttons.EditCancel).click(function () { onEditCancelButtonClick(); });
            $(UIObject.controls.buttons.EditSave).click(function () { onEditSaveButtonClick(); });

            // hide condition, enable as required
            $(UIObject.controls.div.CustomerActionDiv).css({ display: 'none' });
            $(UIObject.controls.dropdownlists.ObtainmentAction).data("kendoDropDownList").enable(false);

            $(UIObject.controls.dropdownlists.OverrideNextStep).change(function () { onOverrideNextStep(); });
            $(UIObject.controls.dropdownlists.CustomerAction).change(function () { onCustomerAction(); });
            $(UIObject.controls.dropdownlists.OverrideNextStep).data("kendoDropDownList").bind("dataBound", onOverrideNextStepDataBound);


            $(UIObject.controls.dropdownlists.ObtainmentAction).change(function () { onCustomerActionObtainmentAction(); });
            $(UIObject.controls.dropdownlists.ObtainmentAction).data("kendoDropDownList").bind("dataBound", onObtainmentActionDataBound);
            //onCustomerActionObtainmentAction
            //setTimeout(
            //    function () {
            //        var nextStepvalue = $(UIObject.controls.dropdownlists.OverrideNextStep).data("kendoDropDownList").text();
            //        if (nextStepvalue == 'Customer Action') {
            //            $(UIObject.controls.div.CustomerActionDiv).css({ visibility: '' });
            //        }
            //    }, 3000);
        };

       
       
      

       

      


        var LoadNotificationBatchItems = function()
        {
            var grid = $(UIObject.controls.grids.GridNotificationBatchItems).data("kendoGrid");
            grid.dataSource.read();
            initializeMultiSelectCheckboxes($("#NotificationGrid"));
        }

        function onEditCancelButtonClick(e) {
            hideNotificationPopUp();
        };


        function onEditSaveButtonClick(e) {
            var noticeModel = {
                NoticeBatchId: Number($(UIObject.controls.textbox.NoticeBatchId).val()),
                NextStepId: Number($(UIObject.controls.dropdownlists.EditNextStep).data("kendoDropDownList").value()),
                NotificationStatusId: Number($(UIObject.controls.dropdownlists.EditNoticeStatus).data("kendoDropDownList").value()),
                EmailTemplateId: Number($(UIObject.controls.dropdownlists.EditEmailTemplate).data("kendoDropDownList").value()),
                EmailSubject: $(UIObject.controls.textbox.EmailSubject).val(),
                ScheduledDate: $(UIObject.controls.datepickers.EditScheduledDate).data("kendoDatePicker").value(),                
                ObtainmentList: $(UIObject.controls.dropdownlists.ObtainmentEditTypeDropDownList).data("kendoMultiSelect").value(),
                AccountIdArray: $(UIObject.controls.textbox.AccountId).val(),
                ObtainmentState: Number($(UIObject.controls.dropdownlists.ObtainmentState).data("kendoDropDownList").value()),
                NotificationAttachment: [],
                SummaryRecipient: $(UIObject.controls.textbox.SummaryRecipient).val(),
                NextObtainmentStepLkpId: Number($(UIObject.controls.dropdownlists.OverrideNextStep).data("kendoDropDownList").value()),
                ObtainmentActionLkpId: Number($(UIObject.controls.dropdownlists.ObtainmentAction).data("kendoDropDownList").value()),
                CustomerAction: $(UIObject.controls.dropdownlists.CustomerAction).data("kendoDropDownList").text(),
                ObtainmentNotes: $(UIObject.controls.dropdownlists.CustomerAction).data("kendoDropDownList").value(),

                NextObtainmentStepDueDateFrom: $(UIObject.controls.datepickers.NoticeDueDateFrom).data("kendoDatePicker").value(),
                NextObtainmentStepDueDateTo: $(UIObject.controls.datepickers.NoticeDueDateTo).data("kendoDatePicker").value(),
                CompanyFilterTeamId: +($(UIObject.controls.dropdownlists.Teams).data("kendoDropDownList").value())==-1?null: Number($(UIObject.controls.dropdownlists.Teams).data("kendoDropDownList").value()),

                AllSDS: $(UIObject.controls.checkbox.AllSDS).prop("checked"),
                AllNonSDS: $(UIObject.controls.checkbox.AllNonSDS).prop("checked"),

                MissingRequired: function () {
                    var nextStepValid = true;
                    var customerActionvalid = true;

                    var nextStepvalue = $(UIObject.controls.dropdownlists.ObtainmentAction).data("kendoDropDownList").text();
                    if (nextStepvalue == 'Customer Action') {
                        if (this.ObtainmentNotes == -1)
                            customerActionvalid = false;
                    }

                    if (this.NextStepId == -1)
                        nextStepValid = false;
                    else if (this.NextStepId == 0 && (noticeModel.AccountIdArray.trim() == "" ||
                                                      noticeModel.AccountIdArray.indexOf(",") >= 0))
                        nextStepValid = false;

                    return (!nextStepValid) || (this.NotificationStatusId == 0)
                        || (this.EmailTemplateId == 0) || (this.ScheduledDate == null)
                        || (this.EmailSubject == "")
                        || (this.SummaryRecipient == "")
                        || (this.ObtainmentList.length == 0 || (!customerActionvalid));
                },

                InvalidSchedueDate: function () {
                    var today = new Date();
                    var selectedDate = new Date(noticeModel.ScheduledDate);
                    return (selectedDate <= today);
                },

                DisallowInformationChangeAfterSent: function () {
                    return (noticeModel.NotificationStatusId == 4);
                },

                ConfirmOnInformationChange: function () {
                    return (noticeModel.NotificationStatusId == 3);
                },

                MissingNoticeNumber : function() {
                    var subject = (this.EmailSubject + "").toUpperCase();
                    return (subject.indexOf("||NOTICENUMBER||") < 0);
                }

            };

            //alert(JSON.stringify(noticeModel));

            //Add this attachment to model
            if (noticeModel.MissingRequired()) {
    
                // single account required
                if (noticeModel.NextStepId == 0 && (noticeModel.AccountIdArray.trim() == "" ||
                                                    noticeModel.AccountIdArray.indexOf(",") >= 0))
                    $(this).displayError(messages.errorMessages.SingleAccountRequired);
                else 
                    $(this).displayError(messages.errorMessages.MissingRequiredFields);
                return;
            };
            
            if (noticeModel.InvalidSchedueDate()) {
                $(this).displayError(messages.errorMessages.ScheduledDateError);
                return;
            };
            
            if (noticeModel.DisallowInformationChangeAfterSent()) {
                $(this).displayError(messages.errorMessages.ReasonForNotAllowChange);
                return;
            };

            if (noticeModel.ConfirmOnInformationChange()) {
                var args = {
                    header: 'Confirm to regenerate batch on information change',
                    message: messages.warningMessages.PromptForInformationChange
                };
                           
                DisplayConfirmationModal(args, function () {
                    kendo.ui.progress(UIObject.sections.searchResultSection(), true);
                    $(this).ajaxCall(controllerCalls.ReDefineNotificationTemplate, { searchCriteria: JSON.stringify(noticeModel) })
                            .success(function (data) {
                                if (data.success) {
                                    $(this).savedSuccessFully(data.message);
                                    hideNotificationPopUp();
                                    noticeModel.NoticeBatchId = Number(data.Id);
                                    if (data.isNew) {
                                        noticeModel.EmailSubject = decodeURIComponent(noticeModel.EmailSubject);
                                        SearchNotification(JSON.stringify(noticeModel));
                                    } else {
                                        var searchResultGrid =
                                            $(UIObject.controls.grids.GridSearchNoticeBatch).data("kendoGrid");
                                        if (searchResultGrid != null && searchResultGrid.dataSource.total() != 0) {
                                            searchResultGrid.dataSource.filter([]);
                                            searchResultGrid.dataSource.data([]);
                                        }
                                    }
                                }
                                else {

                                    // were emails valid ?
                                    if (!data.areEmailsValid) {
                                        $(this).displayError("Invalid notification email(s).");
                                        return;
                                    }

                                    $(this).displayError(data.message);
                                }
                            }).error(
                            function () {
                                $(this).displayError(errorMessages.SearchFailure);
                            });
                    kendo.ui.progress(UIObject.sections.searchResultSection(), false);
                });
                return;
            };

            if (noticeModel.MissingNoticeNumber()) {
                $(this).displayError(messages.errorMessages.MissingNoticeNumber);
                return;
            };



            noticeModel.NotificationAttachment = notificatonAttachments;

            kendo.ui.progress(UIObject.sections.searchResultSection(), true);
            $(this).ajaxCall(controllerCalls.SaveNotificationTemplate, { searchCriteria: JSON.stringify(noticeModel) })
                    .success(function (data) {
                        if (data.success) {

                            // were emails valid ?
                            if (!data.areEmailsValid) {
                                $(this).displayError("Invalid notification email(s).");
                                return;
                            }

                            $(this).savedSuccessFully(data.message);
                            hideNotificationPopUp();
                            noticeModel.NoticeBatchId = Number(data.Id);
                            if (data.isNew) {
                                noticeModel.EmailSubject = decodeURIComponent(noticeModel.EmailSubject);
                                noticeModel.ObtainmentList = [];
                                SearchNotification(JSON.stringify(noticeModel));
                            } else {
                                var searchResultGrid = $(UIObject.controls.grids.GridSearchNoticeBatch)
                                    .data("kendoGrid");
                                if (searchResultGrid != null && searchResultGrid.dataSource.total() != 0) {
                                    searchResultGrid.dataSource.filter([]);
                                    searchResultGrid.dataSource.data([]);
                                }
                            }
                        }
                        else {
                            $(this).displayError(data.message);
                        }
                    }).error(
                    function () {
                        $(this).displayError(errorMessages.SearchFailure);
                    });
            kendo.ui.progress(UIObject.sections.searchResultSection(), false);
            
        };


        var InitializeNotificationPopUpDetail = function () {
            editModel = kendo.observable({
                NoticeBatchId: "",
                NextStepId: 0,
                ObtainmentList: null,
                ObtainmentIndex: null,
                AccountId: "",
                EmailTemplateId: 0,
                EmailSubject : "",
                NotificationStatusId: 0,
                ScheduledDate: null,
                ActualSendDate: null,

                RequiredCheck: function (e) {
                    var fieldCheck = (this.get(UIObject.observable.NextStepId) > 0 
                                        && (this.get(UIObject.observable.ObtainmentIndex)).length > 0                                        
                                        && this.get(UIObject.observable.EmailTemplateId) > 0
                                        && this.get(UIObject.observable.EmailSubject) != ""
                                        && this.get(UIObject.observable.NoticeBatchId) != ""
                                        && this.get(UIObject.observable.ScheduledDate) != null);
                                        
                    return fieldCheck;
                },

                CancelClick: function (e) {
                    e.preventDefault();
                    hideNotificationPopUp();
                },
                SaveClick: function (e) {
                    e.preventDefault();
                    if (!this.RequiredCheck()) {
                        $(this).displayError(messages.errorMessages.NoCriteria);
                    }
                }
            });
            
            kendo.bind(UIObject.sections.noticePopUpSection(), editModel);
        };

        var displayNotificationPopUp = function (callbackfunc) {
            //debugger;
            //var notificationModal = $(UIObject.window.NotificationPopUpWindow).data("kendoWindow")({
            //    //width: "300px",
            //    close: function (e) {
            //        $(this.element).empty();
            //    }
            //});
            //notificationModal.center().open();;
            
            var notificationModal = $(UIObject.window.NotificationPopUpWindow);
            if (notificationModal.length > 0) {
                notificationModal.data("kendoWindow").center();
                notificationModal.data("kendoWindow").open();
            }
        };


        function DifferentiateNewOrEdit(noticeBtachId)
        {
            if (noticeBtachId > 0)
            {
                var embedFileUpload = UIObject.sections.embedFileUploadSection().parent();
                if (embedFileUpload.length > 0)
                    embedFileUpload.hide();
                notificationLib.LoadNotificationAttachmentGrid(noticeBtachId);
            }
            else{
                $(".k-button.k-upload-button").show();
                UIObject.sections.existFileSection().hide();
            }
        };

        function hideNotificationPopUp() {
            var notificationModal = $(UIObject.window.NotificationPopUpWindow);
            if (notificationModal.length > 0) {                
                //notificationModal.data("kendoWindow").close();
                notificationModal.data("kendoWindow").destroy();
            }
        };


        function EditNotification(e) {
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            LoadNotificationPopUp(dataItem.NoticeBatchId);

        };

        function DeleteNotificationBatch(e) {
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            
            if (dataItem.NotificationStatusId == 4)
            {
                $(this).displayError(messages.errorMessages.ReasonForNotAllowDelete);
                return;
            }

            var args = {
                header: 'Confirm Notification Definition Deletion',
                message: messages.warningMessages.confirmAttachmentDelete
            };
            DisplayConfirmationModal(args, function () {
                $(this).ajaxCall(controllerCalls.DeleteNotificationBatch, { noticeBatchId: dataItem.NoticeBatchId })
                                .success(function (data) {
                                    //data.noticeBatchId                                    
                                    var searchGrid = $(UIObject.controls.grids.GridSearchNoticeBatch).data("kendoGrid");
                                    if (searchGrid != null) {
                                        var rawData = searchGrid.dataSource.data();
                                        var length = rawData.length;
                                        var item, index;
                                        for (index = length - 1; index >= 0; index--)
                                        {
                                            item = rawData[index];
                                            if (item.NoticeBatchId == data.Id)
                                                searchGrid.dataSource.remove(item);
                                        }
                                    }
                                }).error(
                                function () {
                                    $(this).displayError(messages.errorMessages.DeleteAttachmentFailure);
                                });
            });

        };

        function DeleteAttachment(e) {
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var args = {
                header: 'Confirm Attachment Deletion',
                message: messages.warningMessages.confirmAttachmentDelete
            };

            var NoticeBatchAttachmentId = dataItem.NoticeBatchAttachmentId;
            DisplayConfirmationModal(args, function () {                
                $(this).ajaxCall(controllerCalls.DeleteNotificationAttachment, { noticeBatchAttachmentId: NoticeBatchAttachmentId })
                                .success(function (data) {
                                    var attachmentGrid = $(UIObject.controls.grids.GridNotificationAttachment).data("kendoGrid");
                                    if (attachmentGrid != null) {
                                        attachmentGrid.dataSource.page(1);
                                        attachmentGrid.dataSource.read();
                                    }
                                }).error(
                                function () {
                                    $(this).displayError(messages.errorMessages.DeleteAttachmentFailure);
                                });
            });

        };

        function onUploadSelect(e) {
            var isvalidFile = true;
            $.each(e.files, function (index, value) {
                //var fileExtension = ['.htm', '.html'];
                var fileExtension = ['.txt', '.doc', '.docx', '.xls', '.xlsx', '.tif', '.tiff', '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.bmp', '.gif', '.pdf'];
                if ($.inArray(value.extension, fileExtension) == -1) {
                    e.preventDefault();
                    //displayError("HTML files are not allowed")
                    $(this).displayError("Only these files are allowed: .txt, .doc, .docx, .xls, .xlsx, .tif, .tiff, .ppt, .pptx, .jpg, .jpeg, .png, .bmp, .gif ,.pdf")
                    isvalidFile = false;
                }
                if (isvalidFile == false) {
                    return false;
                }                
            });
        };

        //http://blog.raselahmmed.com/kendo-ui-image-upload-and-instant-preview-in-aspnet-mvc/
        function onUploadSuccess(e) {
            var responseObject = jQuery.parseJSON(e.XMLHttpRequest.responseText);
            //notificatonAttachments.push(responseTxt);

            if (responseObject.AttchmentOperation == 1) {

                var attachment = {
                    OriginalFileName : responseObject.OriginalFileName,
                    MappedFileName : responseObject.MappedFileName
                };
                notificatonAttachments.push(attachment);
            }            
        };

        function onWindowOpen()
        {
        };

        function onWindowClose() {
            hideNotificationPopUp();
        };


        function onGridBound(e) {
            $(".k-grid-Edit").find("span").addClass("k-icon k-edit");
            $(".k-grid-Delete").find("span").addClass("k-icon k-delete");
            $(".k-grid-View").find("span").addClass("k-icon km-view");
        };

        function onAddNewFileBtnClick(e) {

            // reset the kendo upload ajax call handler
            $("#files").data("kendoUpload").options.async.saveUrl = controllerCalls.AddNewBatchAttachments;
            $("#files").data("kendoUpload").options.async.removeUrl = controllerCalls.RemoveNewBatchAttachments;

            if (displayUploadModal) {
                var notictBatchId = 0;                
                    displayUploadModal(

                    /* argsCallbackFunc */
                    function () {
                        return { noticeBatchId: notictBatchId};
                        },

                    /* callbackFunc */    
                    function (data) {
                        var attachmentMapping = [];
                        var item, index;
                        for (index = 0; index < data.length; index++) {
                            item = data[index];
                            var attachment = {
                                OriginalFileName: item.filename,
                                MappedFileName: item.physicalPath
                            };
                            attachmentMapping.push(attachment);
                        }
                        var attachmentModel = new Object();
                        attachmentModel.NoticeBatchId = $(UIObject.controls.textbox.NoticeBatchId).val();
                        attachmentModel.NotificationAttachment = attachmentMapping;
                        $(this).ajaxCall(controllerCalls.SaveExistingNotificationAttachment, { searchCriteria: JSON.stringify(attachmentModel) })
                            .success(function (data) {
                                var attachmentGrid = $(UIObject.controls.grids.GridNotificationAttachment).data("kendoGrid");
                                if (attachmentGrid != null) {
                                    attachmentGrid.dataSource.page(1);
                                    attachmentGrid.dataSource.read();
                                }
                            
                        }).error(
                        function () {
                            $(this).displayError(messages.errorMessages.SaveAttachmentFailure);
                        });
                        },
                        /* clearCacheOnConfirm */ false);
            }
            else
               displayError(documentMessages.errors.DocumentRevisionAttachmentData);            
        };

        var PreviewEmail = function (id) {
            $(UIObject.notificationModals.EmailTemplatePreview).toggleModal();
            $(this).ajaxCall(controllerCalls.EmailTemplatePreview, { emailTemplateId: id })
                .success(function (data) {
                    $(UIObject.controls.div.EmailTemplateBodyDiv).html(decodeURIComponent(data.message));
                }).error(
                    function () {
                        $(this).displayError(messages.errorMessages.LoadEmailPreviewError);
                    });
        };

       var PreviewMergedEmail = function (emailTemplateId, noticeBatchDetailId, companyId) {
           $(UIObject.notificationModals.EmailTemplatePreview).toggleModal();

           //$(this).ajaxCall(controllerCalls.LoadNotificationTemplate, { noticeBatchId: 0 })
           $(this).ajaxCall(controllerCalls.FinalMergedEmail, { emailTemplateId: emailTemplateId, noticeBatchDetailId: noticeBatchDetailId, companyId: companyId })
                       .success(function (data) {
                           $(UIObject.controls.div.EmailTemplateBodyDiv).html(decodeURIComponent(data.EmailRender) + "<hr class='style-dash'><br>" + data.ItemRender);
                       }).error(
                       function (e) {
                           $(this).displayError(e);
                       });
       }

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
                           selectedRequests.push(this["NoticeBatchDetailId"]);
                           itemsChecked++;
                       } else {
                           var index = selectedRequests.indexOf(this["NoticeBatchDetailId"]);
                           if (index > -1)
                               selectedRequests.splice(index, 1);
                       }
                       
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
                               selectedRequests.push(this["NoticeBatchDetailId"]);
                               itemsChecked++;
                           } else {
                               var index = selectedRequests.indexOf(this["NoticeBatchDetailId"]);
                               if (index > -1)
                                   selectedRequests.splice(index, 1);
                           }
                          
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
           $(UIObject.controls.textbox.NumberOfItemsTextBox).text("(" + numberOfItems + ")").val(numberOfItems).trigger("change");
       }

        return {
            SearchBind: searchBind,
            onNewNotificationPanelActivate: onNewNotificationPanelActivate,
            InitializeSearchResultGrid: InitializeSearchResultGrid,
            LoadNotificationAttachmentGrid: LoadNotificationAttachmentGrid,
            InitializeNotificationPopUpDetail: InitializeNotificationPopUpDetail,
            LoadNotificationPopUp: LoadNotificationPopUp,
            InitializePopUpDetailDynamic: InitializePopUpDetailDynamic,
            LoadNotificationBatchItems: LoadNotificationBatchItems,
            PreviewEmail: PreviewEmail,
            PreviewMergedEmail:PreviewMergedEmail,
            displayNotificationPopUp: displayNotificationPopUp,
            EditNotification: EditNotification,
            DifferentiateNewOrEdit:DifferentiateNewOrEdit,
            DeleteAttachment: DeleteAttachment,
            onAddNewFileBtnClick: onAddNewFileBtnClick,
            DeleteNotificationBatch: DeleteNotificationBatch,
            onUploadSelect: onUploadSelect,
            onUploadSuccess: onUploadSuccess,
            onWindowClose: onWindowClose,
            onWindowOpen: onWindowOpen,
            onGridBound: onGridBound,
            Load_SDS_NonSDS_Obtainment_Type_Ids: Load_SDS_NonSDS_Obtainment_Type_Ids,
            chk_AllSds_Change: chk_AllSds_Change,
            chk_AllNonSDS_Change: chk_AllNonSDS_Change,
            mltDdlEditObtainmentType_deselect: mltDdlEditObtainmentType_deselect
        };
    };
})(jQuery);

