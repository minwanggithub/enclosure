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
                noticeDetailSection: function () { return $("#divNotificationDetail"); },
                noticePopUpSection: function () { return $("#divNotificationModalPopup"); }
            },

            containers: {
                NewNotification: "#pnlNewNotification",
                NotificationModalPopup: "#NotificationModalPopup"
            },

            controls: {
                grids: {
                    GridSearchNoticeBatch: "#gdSearchNoticeBatch"
                },

                buttons: {
                    ClearRequestSearchButton: "#clearRequestSearchBtn",
                    SearchRequestsButton: "#searchRequestBtn",
                    EditSave: "#btnEditSaveNotification",
                    EditCancel: "#btnEditCancelNotification"
                },
                
                dropdownlists: {
                    ObtainmentTypeDropDownList: "#mltDdlObtainmentType",
                    ObtainmentEditTypeDropDownList: "#mltDdlEditObtainmentType",
                    EditNextStep: "#ddlEditNextStep",
                    EditEmailTemplate: "#ddlEditEmailTemplate",
                    EditNoticeStatus: "#ddlEditNoticeStatus",

                },
                
                textbox: {
                    AccountId: "#txtEditAccountId",
                    NoticeBatchId: "#txtEditNoticeBatchId"
                },

                datepickers: {
                    EditScheduledDate: "#dteEditScheduledDate"
                },

                
            },

            observable: {
                NextStepId: "NextStepId",
                ObtainmentList: "ObtainmentList",                
                ObtainmentIndex: "ObtainmentIndex",
                AccountIdArray: "AccountIdArray",
                EmailTemplateId: "EmailTemplateId",
                NotificationStatusId: "NotificationStatusId",
                ScheduledDate: "ScheduledDate",
                ActualSendDate: "ActualSendDate",
            },
            
            
            window: {
                NotificationPopUpWindow: "#notificationPopUpWindow"
            },

         
        }
        
                
        var controllerCalls = {
            SearchNoticfication: GetEnvironmentLocation() + "/Operations/Notification/SearchNotification",
            LoadNotificationTemplate: GetEnvironmentLocation() + "/Operations/Notification/LoadNotificationTemplate",
            SaveNotificationTemplate: GetEnvironmentLocation() + "/Operations/Notification/SaveNotificationTemplate",
        };

        var messages = {
            successMessages: {
                Saved: "Saved Successful",
                SuperEmailDirection: "<br/><b>Please follow <a href='*'>this link</a> to submit your document. </b> <br/><br/>"
            },            
            errorMessages: {
                SearchFailure: "Search failure",
                NoCriteria: "A filter must be seelcted to execute a search.",
                LoadNewNotificationFailure: "Can't not load new notification template."
            }
        };
        
        var SearchBind = function () {
            viewModel = kendo.observable({
                NextStepId: 0,
                ObtainmentList: null,
                ObtainmentIndex: null,
                AccountIdArray: "",
                EmailTemplateId: 0,
                NotificationStatusId: 0,
                ScheduledDate: null,
                ActualSendDate: null,

                HasCriteria: function (e) {
                    var fieldCheck = (this.get(UIObject.observable.NextStepId) > 0 
                                        || (this.get(UIObject.observable.ObtainmentList)).length > 0
                                        || this.get(UIObject.observable.AccountIdArray) != ""
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
                        var nofield = this.HasCriteria();
                        if (!this.HasCriteria()) {
                            $(this).displayError(messages.errorMessages.NoCriteria);
                        }
                        else {
                            kendo.ui.progress(UIObject.sections.searchResultSection(), true);
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
                        e.preventDefault();
                        this.set(UIObject.observable.NextStepId, 0);
                        this.set(UIObject.observable.ObtainmentList, null);
                        this.set(UIObject.observable.AccountId,"");
                        this.set(UIObject.observable.EmailTemplateId, 0);
                        this.set(UIObject.observable.NotificationStatusId, 0);
                        this.set(UIObject.observable.ScheduledDate, null);
                        this.set(UIObject.observable.ActualSendDate, null);
                        $("#divSearchSection " + UIObject.controls.dropdownlists.ObtainmentTypeDropDownList).data("kendoMultiSelect").value([]);

                        debugger;
                        var searchResultGrid = $(UIObject.controls.grids.GridSearchNoticeBatch).data("kendoGrid");
                        if (searchResultGrid.dataSource.total() != 0) {
                            searchResultGrid.dataSource.filter([]);
                            searchResultGrid.dataSource.data([]);
                        }
                        //if ((null != noticeGrid()) && (noticeGrid().dataSource.total() > 0))
                        //    noticeGrid().dataSource.data([]);
                },

                AddNewClick: function (e) {
                    //e.preventDefault();
                    //This is for embedding
                    var container = $(UIObject.containers.NewNotification);
                    if (container.length > 0) container.show(500);



                    //var buttonElement = $(e.currentTarget);

                    //Dynamically load the popup
                   // $(this).ajaxCall(controllerCalls.LoadNewNotification, { noticeBatchId: 0 })
                   //             .success(function (data) {
                   //                 UIObject.sections.noticeDetailSection().html(data);
                   //                 displayNotificationPopUp();
                   //             }).error(
                   //             function () {
                   //                 $(this).displayError(errorMessages.LoadNewNotificationFailure);
                    //});


                    //LoadNotificationPopUp(0);
                    //$("#ddlEditNextStep").data("kendoDropDownList").select(2);
                    //if (displayNotificationPopUp) {
                    //    //displaySupplierPopUp(function (data) {});  //With Call back
                    //    displayNotificationPopUp();
                    //}

                },
            });
            kendo.bind(UIObject.sections.searchSection(), viewModel);
        };

        function SearchNotification(searchCriteria)
        {
            $(this).ajaxCall(controllerCalls.SearchNoticfication, { searchCriteria: searchCriteria })
                                 .success(function (data) {
                                     UIObject.sections.searchResultSection().html(data);
                                 }).error(
                                 function () {
                                     $(this).displayError(errorMessages.SearchFailure);
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
                    alert("save");
                }
            });

            kendo.bind(UIObject.sections.noticeDetailSection(), viewModel);

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
        };


        var LoadNotificationPopUp = function (noticeBatchId) {
            $(this).ajaxCall(controllerCalls.LoadNotificationTemplate, { noticeBatchId: noticeBatchId })
                         .success(function (data) {
                             //alert(UIObject.sections.noticeDetailSection().html());
                             UIObject.sections.noticeDetailSection().html(data);
                             //alert(UIObject.sections.noticeDetailSection().html());
                         }).error(
                         function () {
                             $(this).displayError(errorMessages.LoadNewNotificationFailure);
                         });
        };

        var InitializePopUpDetailDynamic = function () {
            //var container = $("#divNotificationModalPopup");
            //UIObject.buttons.EditCancel, onEditCancelButtonClick);

            $(UIObject.controls.buttons.EditCancel).click(function () { onEditCancelButtonClick(); });
            $(UIObject.controls.buttons.EditSave).click(function () { onEditSaveButtonClick(); });
        };


        function onEditCancelButtonClick(e) {
            hideNotificationPopUp();
        };


        function onEditSaveButtonClick(e) {
            debugger;
            var noticeModel = {
                NoticeBatchId: Number($(UIObject.controls.textbox.NoticeBatchId).val()),
                NextStepId: Number($(UIObject.controls.dropdownlists.EditNextStep).data("kendoDropDownList").value()),
                NotificationStatusId: Number($(UIObject.controls.dropdownlists.EditNoticeStatus).data("kendoDropDownList").value()),
                EmailTemplateId: Number($(UIObject.controls.dropdownlists.EditEmailTemplate).data("kendoDropDownList").value()),
                ScheduledDate: $(UIObject.controls.datepickers.EditScheduledDate).data("kendoDatePicker").value(),                
                ObtainmentList: $(UIObject.controls.dropdownlists.ObtainmentEditTypeDropDownList).data("kendoMultiSelect").value(),
                AccountIdArray: Number($(UIObject.controls.textbox.AccountId).val()),

                MissingRequired: function () {
                    return (this.NextStepId == 0) || (this.NotificationStatusId == 0)
                        || (this.EmailTemplateId == 0) || (this.ScheduledDate == null)                        
                        || (this.ObtainmentList.length == 0);
                }
            };
            if (noticeModel.MissingRequired()) {
                $(this).displayError(messages.errorMessages.NoCriteria);
            }
            else {
                kendo.ui.progress(UIObject.sections.searchResultSection(), true);
                $(this).ajaxCall(controllerCalls.SaveNotificationTemplate, { searchCriteria: JSON.stringify(noticeModel) })
                       .success(function (data) {
                           if (data.success){
                               $(this).savedSuccessFully(data.message);
                               hideNotificationPopUp();
                               noticeModel.NoticeBatchId = Number(data.Id);
                               SearchNotification(JSON.stringify(noticeModel));
                           }
                       }).error(
                       function () {
                           $(this).displayError(errorMessages.SearchFailure);
                       });
                kendo.ui.progress(UIObject.sections.searchResultSection(), false);
            }
        };


        var InitializeNotificationPopUpDetail = function () {
            editModel = kendo.observable({
                NoticeBatchId: 0,
                NextStepId: 0,
                ObtainmentList: null,
                ObtainmentIndex: null,
                AccountId: "",
                EmailTemplateId: 0,
                NotificationStatusId: 0,
                ScheduledDate: null,
                ActualSendDate: null,

                RequiredCheck: function (e) {
                    var fieldCheck = (this.get(UIObject.observable.NextStepId) > 0 
                                        && (this.get(UIObject.observable.ObtainmentIndex)).length > 0                                        
                                        && this.get(UIObject.observable.EmailTemplateId) > 0                                        
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

        function hideNotificationPopUp() {
            var notificationModal = $(UIObject.window.NotificationPopUpWindow);
            if (notificationModal.length > 0) {                
                //notificationModal.data("kendoWindow").close();
                notificationModal.data("kendoWindow").destroy();
            }
        };


        return {
            SearchBind: SearchBind,
            onNewNotificationPanelActivate: onNewNotificationPanelActivate,
            InitializeSearchResultGrid: InitializeSearchResultGrid,
            InitializeNotificationPopUpDetail: InitializeNotificationPopUpDetail,
            LoadNotificationPopUp: LoadNotificationPopUp,
            InitializePopUpDetailDynamic: InitializePopUpDetailDynamic,
            displayNotificationPopUp: displayNotificationPopUp
        };
    };
})(jQuery);
