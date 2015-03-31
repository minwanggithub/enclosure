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
                grids: { GridRequests: "#gdRequests" },
                buttons: {
                    ClearRequestSearchButton: "#clearRequestSearchBtn",
                    SearchRequestsButton: "#searchRequestBtn",
                    SaveSearchSettings: "#saveSearchSettingsBtn"
                },
                textBoxes: {
                },
                dropdownlists: {
                    GroupsDropDownList: "#ddlGroups"
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

        obtainmentSearchObj.on("click", obtainmentObject.controls.buttons.SaveSearchSettings, function() {
            var obtainmentWorkLoadSearchResultModel = {};
            var drpGroups = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.GroupsDropDownList).data("kendoDropDownList");
            obtainmentWorkLoadSearchResultModel.GroupID = drpGroups.value() == "" ? 0 : drpGroups.value();
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
           var numberOfRows = $('div #row').length;
           var initialRow = 0;
           var drpGroups = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.GroupsDropDownList).data("kendoDropDownList");

           //create requestSearchModel to be passed to the controller
           obtainmentWorkLoadSearchResultModel.GroupID = drpGroups.value() == "" ? null : drpGroups.value();

           var criteriaList = [];

           //create filter array
           //for (var indexRows = 0; indexRows < numberOfRows; indexRows++) {
           //    initialRow++;
           //    var drpFields = $("div #row #middle #" + xreferenceObject.controls.dropdownlists.FieldsDropDownList + "_" + initialRow).data("kendoDropDownList");
           //    var drpCriteria = $("div #row #right #" + xreferenceObject.controls.dropdownlists.ContainsDropDownList + "_" + initialRow).data("kendoDropDownList");
           //    var criteria = {};
           //    criteria.FieldName = drpFields.value();
           //    criteria.WhereOperator = drpCriteria.text();
           //    var valueAssigned;
           //    if ($("div #row #right #" + xreferenceObject.controls.textBoxes.FreeFieldTextBox + "_" + initialRow).is(":hidden")) {
           //        if (drpFields.text() == "Language") {
           //            var drpLanguage = $("div #row #right #" + xreferenceObject.controls.dropdownlists.LanguageDropDownList + "_" + initialRow).data("kendoDropDownList");
           //            var language = drpLanguage.value();
           //            criteria.SearchFor = language.replace("flag-", "");
           //        }


           //        if (drpFields.text() == "Document Type") {
           //            var drpDocType = $("div #row #right #" + xreferenceObject.controls.dropdownlists.DocumentTypeDropDownList + "_" + initialRow).data("kendoDropDownList");
           //            criteria.SearchFor = drpDocType.value();
           //        }


           //        if (drpFields.text() == "Country") {
           //            var drpCountry = $("div #row #right  #" + xreferenceObject.controls.dropdownlists.CountryDropDownList + "_" + initialRow).data("kendoDropDownList");
           //            criteria.SearchFor = drpCountry.value();
           //        }

           //        if (criteria.SearchFor.length > 0)
           //            criteriaList.push(criteria);

           //    } else {
           //        valueAssigned = $("div #row #" + xreferenceObject.controls.textBoxes.FreeFieldTextBox + "_" + initialRow).val();
           //        criteria.SearchFor = valueAssigned;

           //        if (valueAssigned.length > 0)
           //            criteriaList.push(criteria);
           //    }

           //}

          
           if (drpGroups.value() != "" || criteriaList.length > 0) {
               DisableEnableButtons(false);
               //obtainmentWorkLoadSearchResultModel.Criterias = criteriaList;
               kendo.ui.progress(obtainmentDetailObj, true);
               //var url = controllerCalls.SearchRequests;
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
                       $(this).displayError(error);
                   },
                   done: function () {
                       $(this).savedSuccessFully(messages.successMessages.Saved);
                   }
               });
           } else
               $(this).displayError(messages.errorMessages.SelectFilter);
       });

        function DisableEnableButtons(enable) {
            $(obtainmentObject.controls.buttons.SearchRequestsButton).enableControl(enable);
            $(obtainmentObject.controls.buttons.ClearRequestSearchButton).enableControl(enable);
            $(obtainmentObject.controls.buttons.SaveSearchSettings).enableControl(enable);
        }

       return {
           loadRequests: loadRequests
       };
    };
})(jQuery);