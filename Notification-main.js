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

        var obtainmentObject = {
            controls: {
                grids: {
                    GridRequests: "#gdRequests", GridSupplierNotes: "#gdSupplierNotes", GridDetailRequests: "#gdDetailRequests"
                },
                buttons: {
                    ClearRequestSearchButton: "#clearRequestSearchBtn",
                    SearchRequestsButton: "#searchRequestBtn",
                    SaveSearchSettings: "#saveSearchSettingsBtn"
                },
                textBoxes: {
                    AccountId: "#txtAccountId",
                    NumberOfItemsTextBox: "#numberOfItems"

                },
                dateTime: {
                    NextStepDueDate: "#dteNextStepDueDate",
                    SuperEmailNextStepDueDate: "#dteSuperEmailNextStepDueDate"
                },
                dropdownlists: {
                    NextStepDropDownList: "#ddlNextStep",
                
                },
                labels: { ContactName: "#lblContactName" },
                checkBox: { LiveCall: "#chkLiveCall", IncludeInboundResponses: "#chkOnlyWithInboundResponses" }
            }
        }
                
        var controllerCalls = {
            SearchRequests: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SearchObtainmentRequests",        
        };

        var messages = {
            successMessages: {
                Saved: "Saved Successful",
                SuperEmailDirection: "<br/><b>Please follow <a href='*'>this link</a> to submit your document. </b> <br/><br/>"
            },
            confirmationMessages: { UnAssigneRequests: "unassign these request item(s)", AssignRequests: "assign these request item(s)" },
            errorMessages: {
                SelectGroup: "Please select a group to assign request item(s)",
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
        
        var loadRequests = function () {
            var grid = $(obtainmentObject.controls.grids.GridRequests).data("kendoGrid");
            grid.dataSource.read();
        };


        var getSearchCriteria = function () {
            //var container = $(documentElementSelectors.containers.DocumentSearch);
            //return getContainerSearchCriteria(container);
            return null;
        };
  
        return {
            SearchBind: SearchBind,
            loadRequests: loadRequests,
            getSearchCriteria: getSearchCriteria
        };
    };
})(jQuery);
