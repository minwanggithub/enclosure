; (function ($) {
    if ($.fn.complibNotification == null) {
        $.fn.complibNotification = {};

    }
    $.fn.complibNotification = function () {
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

        var UIObject = {
            sections: {
                searchSection: function () { return $("#divSearchSection"); },
                noticeDetailGridSection: function () { return $("#NotificationDetail"); }
            },

            controls: {
                grids: {
                    GridRequests: "#gdRequests", GridSupplierNotes: "#gdSupplierNotes", GridDetailRequests: "#gdDetailRequests"
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
                    
                
                },
                labels: { ContactName: "#lblContactName" },
                checkBox: { LiveCall: "#chkLiveCall", IncludeInboundResponses: "#chkOnlyWithInboundResponses" }
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

        var obtainmentWorkLoadSearchResultModel = {
            TeamID: 0,
            DocumentLanguageId: 0,
            DocumentTypeId: 0,
            LockTypeId: 0,
            AssignedToId: 0,
            NextStepId0: 0,
            IncludeInboundResponse: false
        };

        var obtainmentMultipleWorkItemActionModel = {            
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
        
        var loadRequests = function () {
            var grid = $(obtainmentObject.controls.grids.GridRequests).data("kendoGrid");
            grid.dataSource.read();
        };


        var getSearchCriteria = function () {
            //var container = $(documentElementSelectors.containers.DocumentSearch);
            //return getContainerSearchCriteria(container);
            return null;
        };


        var SearchBind = function () {
            viewModel = kendo.observable({
                NoticeNumber: "",
                SupplierNameAndId: "",
                SupplierId: 0,
                SupplierName: "",
                ShowCollapse: "none",
                ResponseStatusId: "0",
                ExistingInboundResponseId: 0,

                SearchClick: function (e) {
                    e.preventDefault();
                    var noticeModel = {
                        NextStepId: $("#divSearchSection " + UIObject.controls.dropdownlists.NextStepDropDownList).data("kendoDropDownList").value(),
                        NotificationStatusId: $("#divSearchSection " + UIObject.controls.dropdownlists.NoticeStatus).data("kendoDropDownList").value(),
                        EmailTemplateId: $("#divSearchSection " + UIObject.controls.dropdownlists.EmailTemplateDropDownList).data("kendoDropDownList").value(),
                        ScheduledDate: $(UIObject.controls.dateTime.ScheduledDate).data("kendoDatePicker").value(),
                        ActualSendDate: $(UIObject.controls.dateTime.ActualSendDate).data("kendoDatePicker").value(),
                        ObtainmentList: $("#divSearchSection " + UIObject.controls.dropdownlists.ObtainmentTypeDropDownList).data("kendoMultiSelect").value(),
                        AccountId: $("#divSearchSection " + UIObject.controls.textBoxes.AccountId).val(),
                        NoCriteria: function()
                        {
                            return (this.NextStepId == "") && (this.NotificationStatusId == "")
                                && (this.EmailTemplateId == "") && (this.ScheduledDate == null)
                                && (this.ActualSendDate == null) && (this.AccountId == "")
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
                                   UIObject.sections.noticeDetailGridSection().html(data);
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
                    
                    //var inboundGrid = UIObject.controls.grids.InboundResponse;
                    //if ((null != inboundGrid()) && (inboundGrid().dataSource.total() > 0))
                    //    inboundGrid().dataSource.data([]);
                },
            });
            kendo.bind(UIObject.sections.searchSection(), viewModel);
        }

        return {
            SearchBind: SearchBind,
            loadRequests: loadRequests,
            getSearchCriteria: getSearchCriteria
        };
    };
})(jQuery);
