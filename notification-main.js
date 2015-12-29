﻿; (function ($) {
    if ($.fn.complibNotification == null) {
        $.fn.complibNotification = {};

    }
    $.fn.complibNotification = function () {
        //Local variables
        var notificatonAttachments = [];

        var UIObject = {
            sections: {
                searchSection: function () { return $("#divSearchSection"); },
                searchResultSection: function () { return $("#divSearchResult"); },
                noticeDetailSection: function () { return $("#divNotificationDetail"); },
                noticePopUpSection: function () { return $("#divNotificationModalPopup"); },
                existFileSection: function () { return $("#divExistFileSection"); },
                embedFileUploadSection: function () { return $("#NotificationAttachFiles"); }
            },

            containers: {
                NewNotification: "#pnlNewNotification",
                NotificationModalPopup: "#NotificationModalPopup"
            },

            controls: {
                grids: {
                    GridSearchNoticeBatch: "#gdSearchNoticeBatch",
                    GridNotificationAttachment: "#gdNotificationAttachment"
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
            SaveExistingNotificationAttachment: GetEnvironmentLocation() + "/Operations/Notification/SaveExistingNotificationAttachment",
            LoadNotificationAttachmentGrid: GetEnvironmentLocation() + "/Operations/Notification/LoadNotificationAttachmentGrid",
            DeleteNotificationAttachment: GetEnvironmentLocation() + "/Operations/Notification/DeleteAttachment",
            DeleteNotificationBatch: GetEnvironmentLocation() + "/Operations/Notification/DeleteNotificationBatch"
        };

        var messages = {
            successMessages: {
                Saved: "Saved Successful",
                SuperEmailDirection: "<br/><b>Please follow <a href='*'>this link</a> to submit your document. </b> <br/><br/>"
            },            
            warningMessages:{
                confirmAttachmentDelete : "Are you sure you want to delete the selected item?"
            },
            errorMessages: {
                SearchFailure: "Search failure",
                NoCriteria: "Filters must be selcted to execute a search.",
                MissingRequiredFields: "All required fields must be filled.",
                ScheduledDateError: "Scheduled date has to be greater than today's date.",
                LoadNewNotificationFailure: "Can't not load new notification template.",
                DeleteAttachmentFailure: "Can't not delete attachment ",
                SaveAttachmentFailure: "Can't not save attachment ",
                ReasonForNotAllowChange: "Batch can't be modified if the status is Sent or Ready to Send.",
                ReasonForNotAllowDelete: "Batch can't be deleted because the status is Sent."
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
                SearchClick : function (e) {
                        //e.preventDefault();
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
                    //e.preventDefault();
                        this.set(UIObject.observable.NextStepId, 0);
                        this.set(UIObject.observable.ObtainmentList, null);
                        this.set(UIObject.observable.AccountIdArray,"");
                        this.set(UIObject.observable.EmailTemplateId, 0);
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


                    LoadNotificationPopUp(0);
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
                    alert("save");
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
                             UIObject.sections.noticeDetailSection().html(data);
                         }).error(
                         function () {
                             $(this).displayError(errorMessages.LoadNewNotificationFailure);
                         });
        };

        var LoadNotificationAttachmentGrid = function (noticeBatchId) {
            $(this).ajaxCall(controllerCalls.LoadNotificationAttachmentGrid, { noticeBatchId: noticeBatchId })
                         .success(function (data) {
                             UIObject.sections.existFileSection().html(data);
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
            var noticeModel = {
                NoticeBatchId: Number($(UIObject.controls.textbox.NoticeBatchId).val()),
                NextStepId: Number($(UIObject.controls.dropdownlists.EditNextStep).data("kendoDropDownList").value()),
                NotificationStatusId: Number($(UIObject.controls.dropdownlists.EditNoticeStatus).data("kendoDropDownList").value()),
                EmailTemplateId: Number($(UIObject.controls.dropdownlists.EditEmailTemplate).data("kendoDropDownList").value()),
                ScheduledDate: $(UIObject.controls.datepickers.EditScheduledDate).data("kendoDatePicker").value(),                
                ObtainmentList: $(UIObject.controls.dropdownlists.ObtainmentEditTypeDropDownList).data("kendoMultiSelect").value(),
                AccountIdArray: $(UIObject.controls.textbox.AccountId).val(),
                NotificationAttachment: [],

                MissingRequired: function () {
                    return (this.NextStepId == 0) || (this.NotificationStatusId == 0)
                        || (this.EmailTemplateId == 0) || (this.ScheduledDate == null)                        
                        || (this.ObtainmentList.length == 0);
                },

                InvalidSchedueDate: function () {
                    var today = new Date();
                    var selectedDate = new Date(noticeModel.ScheduledDate);
                    return (selectedDate <= today);
                },

                DisallowInformationChange: function () {
                    return (noticeModel.NotificationStatusId == 3 || noticeModel.NotificationStatusId == 4);
                }
            };
            
            //Add this attachment to model
            if (noticeModel.MissingRequired()) {
                $(this).displayError(messages.errorMessages.NoCriteria);
                return;
            };
            
            if (noticeModel.InvalidSchedueDate()) {
                $(this).displayError(messages.errorMessages.ScheduledDateError);
                return;
            };
            
            if (noticeModel.DisallowInformationChange()){
                $(this).displayError(messages.errorMessages.ReasonForNotAllowChange);
                return;
            };

            noticeModel.NotificationAttachment = notificatonAttachments;

            kendo.ui.progress(UIObject.sections.searchResultSection(), true);
            $(this).ajaxCall(controllerCalls.SaveNotificationTemplate, { searchCriteria: JSON.stringify(noticeModel) })
                    .success(function (data) {
                        if (data.success){
                            $(this).savedSuccessFully(data.message);
                            hideNotificationPopUp();
                            noticeModel.NoticeBatchId = Number(data.Id);
                            if (data.isNew)
                                SearchNotification(JSON.stringify(noticeModel));
                            else {
                                var searchResultGrid = $(UIObject.controls.grids.GridSearchNoticeBatch).data("kendoGrid");
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
                header: 'Confirm Attachment Deleteion',
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
        };

        //http://blog.raselahmmed.com/kendo-ui-image-upload-and-instant-preview-in-aspnet-mvc/
        function onUploadSuccess(e) {
            debugger;
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
            if (displayUploadModal) {
                //var container = $(this).parents(documentElementSelectors.containers.DocumentNewRevisionDetails + ":first");
                //if (container.length > 0) {
                //    var documentId = container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentId).val();
                var revisionId = 0;
                var documentId = 0;

                    displayUploadModal(function () {
                        return { documentId: documentId, revisionId: revisionId };
                    }, function (data) {
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
                        
                        
                        //var parentContainer = $(documentElementSelectors.containers.DocumentNewRevisionDetailsExact + documentId);
                        //var attachmentGrid = (parentContainer.length > 0) ? parentContainer.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid') : null;
                        //if (attachmentGrid) {
                        //    for (var i = 0; i < data.length; i++) {
                        //        attachmentGrid.dataSource.add({
                        //            DocumentInfoId: 0,
                        //            DocumentId: documentId,
                        //            RevisionId: revisionId,
                        //            DocumentInfoDescription: '',
                        //            DocumentElink: data[i].elink,
                        //            FileName: data[i].filename,
                        //            PhysicalPath: data[i].physicalPath
                        //        });
                        //    }
                        //}

                    }, false);
            }
            else
               displayError(documentMessages.errors.DocumentRevisionAttachmentData);            
        };

        return {
            SearchBind: SearchBind,
            onNewNotificationPanelActivate: onNewNotificationPanelActivate,
            InitializeSearchResultGrid: InitializeSearchResultGrid,
            LoadNotificationAttachmentGrid: LoadNotificationAttachmentGrid,
            InitializeNotificationPopUpDetail: InitializeNotificationPopUpDetail,
            LoadNotificationPopUp: LoadNotificationPopUp,
            InitializePopUpDetailDynamic: InitializePopUpDetailDynamic,
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
            onGridBound: onGridBound
        };
    };
})(jQuery);
