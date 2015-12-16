; (function ($) {
    if ($.fn.complibNotification == null) {
        $.fn.complibNotification = {};

    }
    $.fn.complibNotification = function () {
        //Local variables

        var UIObject = {
            sections: {
                searchSection: function () { return $("#divSearchSection"); },
                searchResultSection: function () { return $("#divSearchResult"); },
                noticeDetailSection: function () { return $("#divNotificationDetail"); }
            },

            containers: {
                NewNotification: "#pnlNewNotification",
            },

            controls: {
                grids: {
                    GridSearchNoticeBatch: "#gdSearchNoticeBatch"
                },

                buttons: {
                    ClearRequestSearchButton: "#clearRequestSearchBtn",
                    SearchRequestsButton: "#searchRequestBtn",
                },
                
                dropdownlists: {
                    ObtainmentTypeDropDownList: "#mltDdlObtainmentType"
                }
            },

            observable: {
                NextStepId: "NextStepId",
                ObtainmentList: "ObtainmentList",                
                ObtainmentIndex: "ObtainmentIndex",
                AccountId: "AccountId",
                EmailTemplateId: "EmailTemplateId",
                NotificationStatusId: "NotificationStatusId",
                ScheduledDate: "ScheduledDate",
                ActualSendDate: "ActualSendDate",
            }
        }
                
        var controllerCalls = {
            SearchNoticfication: GetEnvironmentLocation() + "/Operations/Notification/SearchNotification",
        };

        var messages = {
            successMessages: {
                Saved: "Saved Successful",
                SuperEmailDirection: "<br/><b>Please follow <a href='*'>this link</a> to submit your document. </b> <br/><br/>"
            },            
            errorMessages: {
                NoCriteria: "A filter must be seelcted to execute a search."
            }
        };
        
        var SearchBind = function () {
            viewModel = kendo.observable({
                NextStepId: 0,
                ObtainmentList: null,
                ObtainmentIndex: null,
                AccountId: "",
                EmailTemplateId: 0,
                NotificationStatusId: 0,
                ScheduledDate: null,
                ActualSendDate: null,

                HasCriteria: function (e) {
                    var fieldCheck = (this.get(UIObject.observable.NextStepId) > 0 
                                        || (this.get(UIObject.observable.ObtainmentList)).length > 0
                                        || this.get(UIObject.observable.AccountId) != ""
                                        || this.get(UIObject.observable.EmailTemplateId) > 0
                                        || this.get(UIObject.observable.NotificationStatusId) > 0
                                        || this.get(UIObject.observable.ScheduledDate) != null
                                        || this.get(UIObject.observable.ActualSendDate) != null)
                    return fieldCheck;
                },
                SearchClick: function (e) {
                        e.preventDefault();
                        this.set(UIObject.observable.ObtainmentList, ($("#divSearchSection " + UIObject.controls.dropdownlists.ObtainmentTypeDropDownList).data("kendoMultiSelect").value()).map(function (item) {
                            return parseInt(item, 10);
                        }));

                        
                        //var submitModel = JSON.stringify(this);
                        //var noticeModel = {
                        //    NextStepId: this.get(UIObject.observable.NextStepId),
                        //    NotificationStatusId: Number($("#divSearchSection " + UIObject.controls.dropdownlists.NoticeStatus).data("kendoDropDownList").value()),
                        //    EmailTemplateId: Number($("#divSearchSection " + UIObject.controls.dropdownlists.EmailTemplateDropDownList).data("kendoDropDownList").value()),
                        //    ScheduledDate: $(UIObject.controls.dateTime.ScheduledDate).data("kendoDatePicker").value(),
                        //    ActualSendDate: $(UIObject.controls.dateTime.ActualSendDate).data("kendoDatePicker").value(),
                        //    ObtainmentList: $("#divSearchSection " + UIObject.controls.dropdownlists.ObtainmentTypeDropDownList).data("kendoMultiSelect").value(),
                        //    AccountId: Number($("#divSearchSection " + UIObject.controls.textBoxes.AccountId).val()),
                        //    NoCriteria: function () {
                        //        return (this.NextStepId == 0) && (this.NotificationStatusId == 0)
                        //            && (this.EmailTemplateId == 0) && (this.ScheduledDate == null)
                        //            && (this.ActualSendDate == null) && (this.AccountId == 0)
                        //            && (this.ObtainmentList.length == 0);
                        //    }
                        //};

                        var nofield = this.HasCriteria();
                        if (!this.HasCriteria()) {
                            $(this).displayError(messages.errorMessages.NoCriteria);
                        }
                        else {
                            kendo.ui.progress(UIObject.sections.searchResultSection(), true);
                            $(this).ajaxCall(controllerCalls.SearchNoticfication, { searchCriteria: JSON.stringify(this) })
                                   .success(function (data) {
                                       UIObject.sections.searchResultSection().html(data);
                                   }).error(
                                   function () {
                                       $(this).displayError(UIObject.errorMessage.GeneralError);
                                   });
                        }
                    },

                ClearClick: function (e) {
                        e.preventDefault();
                        this.set(UIObject.observable.NextStepId, 0);
                        this.set(UIObject.observable.ObtainmentList, null);
                        this.set(UIObject.observable.AccountId,"");
                        this.set(UIObject.observable.EmailTemplateId, 0);
                        this.set(UIObject.observable.NotificationStatusId, 0);
                        this.set(UIObject.observable.ScheduledDate, null);
                        this.set(UIObject.observable.ActualSendDate, null);
                        $("#divSearchSection " + UIObject.controls.dropdownlists.ObtainmentTypeDropDownList).data("kendoMultiSelect").value([]);

                        //var noticeGrid = UIObject.controls.grids.NoticeBatch;
                        //if ((null != noticeGrid()) && (noticeGrid().dataSource.total() > 0))
                        //    noticeGrid().dataSource.data([]);
                },

                AddNewClick: function (e) {
                        e.preventDefault();
                        var container = $(UIObject.containers.NewNotification);
                        if (container.length > 0) container.show(500);
                },
            });
            kendo.bind(UIObject.sections.searchSection(), viewModel);
        };

        var onNewNotificationPanelActivate = function () {
            viewModel = kendo.observable({
                CancelClick: function (e) {
                    e.preventDefault();
                    var container = $(UIObject.containers.NewNotification);
                    if (container.length > 0) container.hide();
                },
                SaveClick: function (e) {
                    e.preventDefault();
                    alert("save");
                }
            });

            kendo.bind(UIObject.sections.noticeDetailSection(), viewModel);

            //$(documentElementSelectors.buttons.DocumentNewDocumentSave).on("click", onDisabledButtonClick);

            //$(documentElementSelectors.containers.NewDocument).on('change', 'input', onNewDocumentFieldChange);
            //$(documentElementSelectors.containers.NewDocument).on('click', documentElementSelectors.buttons.DocumentRevisionDetailsAddAttachment, onNewDocumentAddAttachmentBtnClick);
            //$(documentElementSelectors.containers.NewDocument).on('click', documentElementSelectors.buttons.DocumentRevisionDetailsDeleteAttachment, onDocumentNewRevisionDetailsDeleteAttachmentBtnClick);

            // If we are within the popup window display the panel
            //var addNewDocumentPopUp = $(documentElementSelectors.containers.NewDocument).parents(documentElementSelectors.containers.NewDocumentPopUp);
            //if (addNewDocumentPopUp.length > 0) {
            //    $(documentElementSelectors.containers.NewDocument).show(500);
            //    $(documentElementSelectors.buttons.DocumentNewDocumentCancel).on("click", onNewDocumentPopUpCancelBtnClick);
            //} else {
            //    $(documentElementSelectors.buttons.DocumentNewDocumentCancel).on("click", onNewDocumentCancelBtnClick);
            //}
        };

        var InitializeSearchResultGrid = function () {

            //InitializeSearch();

            //// wire up event handlers
            //UIObject.sections.responseDetailGridSection().on("change", UIObject.controls.dropdownlists.ResponseStatusAll, onDdlResponseStatusesChange);
            //UIObject.sections.responseDetailGridSection().on("click", UIObject.controls.buttons.CancelResponseAll, onBtnResponseCancelClick);
            //UIObject.sections.responseDetailGridSection().on("click", UIObject.controls.buttons.SaveResponseAll, onDisabledButtonClick);
            //UIObject.sections.responseDetailGridSection().on("click", "#" + UIObject.controls.labels.UnprocessedResponsesCount, onUnprocessedResponseLabelClick);
            //UIObject.sections.responseDetailGridSection().on("click", UIObject.controls.buttons.ResendObtainmentEmail, onBtnResendObtainmentEmailClick);

        };

        return {
            SearchBind: SearchBind,
            onNewNotificationPanelActivate: onNewNotificationPanelActivate,
            InitializeSearchResultGrid: InitializeSearchResultGrid
        };
    };
})(jQuery);
