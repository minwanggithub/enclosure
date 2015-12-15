; (function ($) {
    if ($.fn.complibNotification == null) {
        $.fn.complibNotification = {};

    }
    $.fn.complibNotification = function () {
        //Local variables

        var UIObject = {
            sections: {
                searchSection: function () { return $("#divSearchSection"); },
                searchResultSection: function () { return $("#divSearchResult"); }
            },

            containers: {
                NewNotification: "#pnlNewNotification",
            },

            controls: {
                grids: {
                    GridRequests: "#gdRequests"
                },
                buttons: {
                    ClearRequestSearchButton: "#clearRequestSearchBtn",
                    SearchRequestsButton: "#searchRequestBtn",
                },
                textBoxes: {
                    AccountId: "#txtAccountId"
                },
                dateTime: {
                    ScheduledDate: "#dteScheduledDate",
                    ActualSendDate: "#dteScheduledSendDate"
                },
                dropdownlists: {
                    NextStepDropDownList: "#ddlNextStep",
                    ObtainmentTypeDropDownList: "#mltDdlObtainmentType",
                    EmailTemplateDropDownList: "#ddlEmailTemplate",
                    NoticeStatus: "#ddlNoticeStatus"
                    
                
                }                                
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

                SearchClick: function (e) {
                    e.preventDefault();
                    var noticeModel = {
                        NextStepId: Number($("#divSearchSection " + UIObject.controls.dropdownlists.NextStepDropDownList).data("kendoDropDownList").value()),
                        NotificationStatusId: Number($("#divSearchSection " + UIObject.controls.dropdownlists.NoticeStatus).data("kendoDropDownList").value()),
                        EmailTemplateId: Number($("#divSearchSection " + UIObject.controls.dropdownlists.EmailTemplateDropDownList).data("kendoDropDownList").value()),
                        ScheduledDate: $(UIObject.controls.dateTime.ScheduledDate).data("kendoDatePicker").value(),
                        ActualSendDate: $(UIObject.controls.dateTime.ActualSendDate).data("kendoDatePicker").value(),
                        ObtainmentList: $("#divSearchSection " + UIObject.controls.dropdownlists.ObtainmentTypeDropDownList).data("kendoMultiSelect").value(),
                        AccountId: Number($("#divSearchSection " + UIObject.controls.textBoxes.AccountId).val()),
                        NoCriteria: function () {
                            return (this.NextStepId == 0) && (this.NotificationStatusId == 0)
                                && (this.EmailTemplateId == 0) && (this.ScheduledDate == null)
                                && (this.ActualSendDate == null) && (this.AccountId == 0)
                                && (this.ObtainmentList.length == 0);
                        }
                    };

                    if (noticeModel.NoCriteria()) {
                        $(this).displayError(messages.errorMessages.NoCriteria);
                    }
                    else {
                        kendo.ui.progress(UIObject.sections.noticeDetailGridSection(), true);
                        $(this).ajaxCall(controllerCalls.SearchNoticfication, { searchCriteria: JSON.stringify(noticeModel) })
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

                    $("#divSearchSection " + UIObject.controls.dropdownlists.NextStepDropDownList).data("kendoDropDownList").select(0);
                    $("#divSearchSection " + UIObject.controls.dropdownlists.ObtainmentTypeDropDownList).data("kendoMultiSelect").value([]);
                    $("#divSearchSection " + UIObject.controls.dropdownlists.EmailTemplateDropDownList).data("kendoDropDownList").select(0);
                    $("#divSearchSection " + UIObject.controls.textBoxes.AccountId).val('');
                    $("#divSearchSection " + UIObject.controls.dropdownlists.NoticeStatus).data("kendoDropDownList").select(0);
                    $("#divSearchSection " + UIObject.controls.dateTime.ScheduledDate).data("kendoDatePicker").value('');
                    $("#divSearchSection " + UIObject.controls.dateTime.ActualSendDate).data("kendoDatePicker").value('');

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

        return {
            SearchBind: SearchBind,
            onNewNotificationPanelActivate: onNewNotificationPanelActivate
        };
    };
})(jQuery);
