; (function ($) {
    if ($.fn.complibObtainment == null) {
        $.fn.complibObtainment = {};

    }
    $.fn.complibObtainment = function () {
        var obtainmentDetailObj = $("#DetailObtianment");
        var obtainmentSearchObj = $("#ObtianmentWFGrid");
        //var itemsChecked = 0;
        //var selectedRequests = new Array();
        //var selectedRows = new Array();
        //var radioButtonSelected = "Group";
        var obtainmentObject = {
            controls: {
                grids: { GridRequests: "#gdRequests", GridSupplierNotes: "#gdSupplierNotes" },
                buttons: {
                    ClearRequestSearchButton: "#clearRequestSearchBtn",
                    SearchRequestsButton: "#searchRequestBtn",
                    SaveSearchSettings: "#saveSearchSettingsBtn"
                },
                textBoxes: {
                },
                dropdownlists: {
                    GroupsDropDownList: "#ddlGroups",
                    PrefLangDropDownList: "#ddlDocumentLanguage",
                    DocumentTypeDropDownList: "#ddlDocumentType",
                    LockTypeDropDownList: "#ddlLockType",
                }
            }
        }

        var controllerCalls = {
            SearchRequests: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SearchObtainmentRequests",
            SaveSearchSettings: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveSearchSettings"
        };
        var messages = {
            successMessages: { Saved: "Saved Successful" },
            confirmationMessages: { UnAssigneRequests: "unassign these request item(s)", AssignRequests: "assign these request item(s)" },
            errorMessages: {
                SelectGroup: "Please select a group to assign request item(s)",
                UserRequiredToAssign: "User required to assign selected request item(s)",
                SelectFilter: "A filter must be selected to execute a search",
                NoItemsSelected: "No items have been selected",
                NoRowSelected: "No row selected",
                RequestsCouldNotBeSaved: "Requests could not be saved",
                RequestsCouldNotBeAssigned: "Requests could not be assigned",
                GeneralError: "Error Occurred"
            }
        };

        var loadRequests = function () {
            var grid = $(obtainmentObject.controls.grids.GridRequests).data("kendoGrid");
            grid.dataSource.read();
        };

        var loadSupplierNotes = function() {
            var grid = $(obtainmentObject.controls.grids.GridSupplierNotes).data("kendoGrid");
            grid.dataSource.read();
        }

        obtainmentSearchObj.on("click", obtainmentObject.controls.buttons.SaveSearchSettings, function () {
            var obtainmentWorkLoadSearchResultModel = {};
            var drpGroups = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.GroupsDropDownList).data("kendoDropDownList");
            var drpLanguage = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.PrefLangDropDownList).data("kendoDropDownList");
            var drpDocType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.DocumentTypeDropDownList).data("kendoDropDownList");

            obtainmentWorkLoadSearchResultModel.GroupID = drpGroups.value() == "" ? 0 : drpGroups.value();
            obtainmentWorkLoadSearchResultModel.DocumentLanguageId = drpLanguage.value() == "" ? 0 : drpLanguage.value();            
            obtainmentWorkLoadSearchResultModel.DocumentTypeId = drpDocType.value() == "" ? 0 : drpDocType.value();            

            //if (drpGroups.value() != "") {

            //} else
            //    $(this).displayError(messages.errorMessages.SelectFilter);
            DisableEnableButtons(false);
            $.ajax({
                url: controllerCalls.SaveSearchSettings,
                type: 'POST',
                cache: false,
                data: { settingsProfile: JSON.stringify(obtainmentWorkLoadSearchResultModel) },
                success: function (successData) {
                    if (successData.success == true) {
                        DisableEnableButtons(true);
                        $(this).savedSuccessFully(messages.successMessages.Saved);
                    }
                },
                error: function (xhr, textStatus, error) {
                    $(this).displayError(error);
                }
            });
        });



        //Does search and displays search results 
        obtainmentSearchObj.on("click", obtainmentObject.controls.buttons.SearchRequestsButton, function () {
            var obtainmentWorkLoadSearchResultModel = {};

            var drpGroups = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.GroupsDropDownList).data("kendoDropDownList");
            var drpLang = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.PrefLangDropDownList).data("kendoDropDownList");
            var drpDocType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.DocumentTypeDropDownList).data("kendoDropDownList");
            var drpLockType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.LockTypeDropDownList).data("kendoDropDownList");

            //create requestSearchModel to be passed to the controller
            obtainmentWorkLoadSearchResultModel.GroupID = drpGroups.value() == "" ? 0 : drpGroups.value();
            obtainmentWorkLoadSearchResultModel.DocumentLanguageId = drpLang.value() == "" ? 0 : drpLang.value();
            obtainmentWorkLoadSearchResultModel.DocumentTypeId = drpDocType.value() == "" ? 0 : drpDocType.value();            
            obtainmentWorkLoadSearchResultModel.LockTypeId = drpLockType.value() == "" ? 0 : drpLockType.value();

            obtainmentWorkLoadSearchResultModel.HasFilter = obtainmentWorkLoadSearchResultModel.GroupID + obtainmentWorkLoadSearchResultModel.DocumentLanguageId + obtainmentWorkLoadSearchResultModel.DocumentTypeId + obtainmentWorkLoadSearchResultModel.LockTypeId;

            if (obtainmentWorkLoadSearchResultModel.HasFilter > 0) {
                DisableEnableButtons(false);

                kendo.ui.progress(obtainmentDetailObj, true);
                $.ajax({
                    url: controllerCalls.SearchRequests,
                    type: 'POST',
                    cache: false,
                    data: { searchCriteria: JSON.stringify(obtainmentWorkLoadSearchResultModel) },
                    success: function (data) {
                        obtainmentDetailObj.html(data);
                        DisableEnableButtons(true);
                    },
                    error: function (xhr, textStatus, error) {
                        $(this).savedSuccessFully(messages.successMessages.Saved);
                    }
                });
            }
            else
                $(this).displayError(messages.errorMessages.SelectFilter);
        });


        function DisableEnableButtons(enable) {
            $(obtainmentObject.controls.buttons.SearchRequestsButton).enableControl(enable);
            $(obtainmentObject.controls.buttons.ClearRequestSearchButton).enableControl(enable);
            $(obtainmentObject.controls.buttons.SaveSearchSettings).enableControl(enable);
        };

        function RenderSwitch() {
            $("[name='" + obtainmentObject.controls.checkSwitch.RequestLocked + "']").bootstrapSwitch();
        };

        return {
            loadRequests: loadRequests,
            loadSupplierNotes: loadSupplierNotes,
            RenderSwitch: RenderSwitch
        };
    };
})(jQuery);
