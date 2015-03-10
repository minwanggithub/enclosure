;
(function($) {
    if ($.fn.complibIndexing == null) {
        $.fn.complibIndexing = {};
    }

    $.fn.complibIndexing = function() {
        var indexingDetailObj = $("#DetailIndexing");
        var indexingSearchObj = $("#IndexingGrid");
        var itemsChecked = 0;
        var selectedRequests = new Array();
        var selectedRows = new Array();
        var radioButtonSelected = "Group";
        var indexingObject = {
            controls: {
               grids: {
                     GridIndexingRequests: "#gdIndexingRequests"
                },
                buttons: {
                    SearchRequestsButton: "#searchRequestBtn",
                    ClearRequestSearchButton: "#clearRequestSearchBtn",
                    UnAssignFromButton: "#btnUnAssignFrom",
                    AssignToButton: "#btnAssignTo",
                    AssignMeButton: "#btnAssignMe",
                    UnAssignButton: "#btnUnAssign",
                    SaveAssignButton: "#btnSaveAssign"
                },
                textBoxes: {
                    IndividualTextBox: "#txtIndividual",
                    NumberOfItemsTextBox: "#numberOfItems"
                },
                hiddenControls: {
                    Access: "#hdnAccess",
                    SearchCriteria: "#SearchCriteria"
                },
                dropdownLists: {
                    GroupsDropDownList: "#ddlGroups",
                    StateDropDownList: "#ddlStatus",
                    DaysDropDownList: "#ddlDays",
                    IndexingLevelDropDownList: "#ddlIndexingLevels"
                    //FieldsDropDownList : "drpFields",
                    //ContainsDropDownList: "drpContains",
                    //LanguageDropDownList: "drpLanguage",
                    //DocumentTypeDropDownList: "drpDocumentType",
                    //CountryDropDownList: "drpCountry",
                    //YesNoDropDownList: "selYesNo"
                    },
                dateTime: { DateAssigned: "#DateAssigned" },
                labels: {},
                sideMenus: {}
            }
        }
        var criteriaCondition = { Contains: 0, ExactMatch: 1, StartsWith: 2, EndsWith: 3 };
        var controllerCalls = {
            SearchRequests: GetEnvironmentLocation() + "/Operations/Indexing/SearchIndexingRequests",
            SaveAssignedItems: GetEnvironmentLocation() + "/Operations/Indexing/SaveAssignedItems",
        };
        var actionModals = {
            Assign: "#mdlAssign"
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

        /******************** Public Functions **************************************************/
        // General indexation methods
        var loadRequestsPlugin = function () {
            initializeMultiSelectCheckboxes(indexingDetailObj);
            AttachAssignClickEvents();
        };
       
        var loadRequests = function () {
            var grid = $(indexingObject.controls.grids.GridIndexingRequests).data("kendoGrid");
            grid.dataSource.read();
            $(indexingObject.controls.textBoxes.IndividualTextBox).closest(".k-widget").hide();
        };

       /********************** Events *********************************************************/

        //Does search and displays search results 
        indexingSearchObj.on("click", indexingObject.controls.buttons.SearchRequestsButton, function () {
           var indexingSearchModel = {};
            var numberOfRows = $('div #row').length;
            var initialRow = 0;
            var drpIndexingLevels = $("#divSearchSection " + indexingObject.controls.dropdownLists.IndexingLevelDropDownList).data("kendoDropDownList");
            var dteDateAssigned = $("#divSearchSection " + indexingObject.controls.dateTime.DateAssigned).data("kendoDatePicker");
            var drpStatus = $("#divSearchSection " + indexingObject.controls.dropdownLists.StateDropDownList).data("kendoDropDownList");
            var drpDays = $("#divSearchSection " + indexingObject.controls.dropdownLists.DaysDropDownList).data("kendoDropDownList");

            //create requestSearchModel to be passed to the controller
            indexingSearchModel.DateAssigned = dteDateAssigned.value() == "" ? null : dteDateAssigned.value();
            indexingSearchModel.StateId = drpStatus.value() == "" ? null : drpStatus.value();
            indexingSearchModel.DaysSelected = drpDays.value() == "" ? null : drpDays.value();
            indexingSearchModel.IndexingLevelsId = drpIndexingLevels.value() == "" ? null : drpIndexingLevels.value();

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

            if (dteDateAssigned.value() != null || drpStatus.value() != "" || drpDays.value() != "" || drpIndexingLevels.valueOf() > 0 || criteriaList.length > 0) {
                $(indexingObject.controls.buttons.SearchRequestsButton).enableControl(false);
                $(indexingObject.controls.buttons.ClearRequestSearchButton).enableControl(false);
                indexingSearchModel.Criterias = criteriaList;
                kendo.ui.progress(indexingDetailObj, true);
                //var url = controllerCalls.SearchRequests;
                $.ajax({
                    url: controllerCalls.SearchRequests,
                    type: 'POST',
                    cache: false,
                    data: { searchCriteria: JSON.stringify(indexingSearchModel) },
                    success: function(data) {
                        indexingDetailObj.html(data);
                        $(indexingObject.controls.buttons.SearchRequestsButton).enableControl(true);
                        $(indexingObject.controls.buttons.ClearRequestSearchButton).enableControl(true);
                    },
                    error: function (xhr, textStatus, error) {
                        $(this).displayError(error);
                    }
            });
            } else
                $(this).displayError(messages.errorMessages.SelectFilter);
        });

            
            indexingDetailObj.on("change", "input[name=GroupIndividual]:radio", function () {
            radioButtonSelected = $(this).val();
            if ($(this).val() == "Group") {
                $(indexingObject.controls.dropdownLists.GroupsDropDownList).closest(".k-widget").show();
                $(indexingObject.controls.textBoxes.IndividualTextBox).closest(".k-widget").hide();
                $(indexingObject.controls.textBoxes.IndividualTextBox).data("kendoAutoComplete").value("");
                }
                else {
                $(indexingObject.controls.textBoxes.IndividualTextBox).data("kendoAutoComplete").value("");
                $(indexingObject.controls.textBoxes.IndividualTextBox).closest(".k-widget").show();
                $(indexingObject.controls.dropdownLists.GroupsDropDownList).closest(".k-widget").hide();
            }
        });

        indexingDetailObj.on("click", indexingObject.controls.buttons.SaveAssignButton, function (e) {
            e.preventDefault();
            var userName = $(indexingObject.controls.textBoxes.IndividualTextBox).data("kendoAutoComplete");
            var selectedValue;
            if (radioButtonSelected == "Group") {
                var ddlGroups = $(indexingObject.controls.dropdownlists.GroupsDropDownList).data("kendoDropDownList");
                selectedValue = ddlGroups.text();
            } else
                selectedValue = userName.value();


            if (selectedValue.length > 0)
                batchDeleteObjects(indexingObject.controls.grids.GridIndexingRequests, messages.confirmationMessages.AssignRequests, controllerCalls.SaveAssignedItems, null, true, selectedValue);
            else {
                $(actionModals.Assign).hideModal();
                var errorMessage;

                if ($("input[name=GroupIndividual]:radio").val() == "Group")
                    errorMessage = messages.errorMessages.SelectGroup;
                else
                    errorMessage = messages.errorMessages.UserRequiredToAssign;

                $(this).displayError(errorMessage);
            }
        });

        /******************************* Internal Functions *********************************************/
        function AttachAssignClickEvents() {
            if ($(indexingObject.controls.hiddenControls.Access).val() == "Admin") {
                AssignUnassignRequest(indexingObject.controls.buttons.UnAssignFromButton, indexingObject.controls.grids.GridIndexingRequests, messages.confirmationMessages.UnAssigneRequests, controllerCalls.SaveAssignedItems, false, "x u");
                AssignUnassignRequest(indexingObject.controls.buttons.AssignToButton, indexingObject.controls.grids.GridIndexingRequests, messages.confirmationMessages.AssignRequests, controllerCalls.SaveAssignedItems, true, "x a");
            }
        }

       
        function AssignUnassignRequest(btnObj, gridObj, message, url, isAssigned, keyCombination) {
            indexingDetailObj.on("click", btnObj, function (e) {
                e.preventDefault();
                $(indexingObject.controls.textBoxes.IndividualTextBox).data("kendoAutoComplete").value("");
                if(isAssigned)
                    batchDeleteObjects(gridObj, message, url, null, isAssigned);
                else
                    batchDeleteObjects(gridObj, message, url, null, isAssigned, null);
            });
            // Mousetrap.bind(keyCombination, function () { $("#" + btnObj).click(); });
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
                            selectedRequests.push(this["RequestWorkItemID"]);
                            itemsChecked++;
                        } else {
                            var index = selectedRequests.indexOf(this["RequestWorkItemID"]);
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
                                selectedRequests.push(this["RequestWorkItemID"]);
                                itemsChecked++;
                            } else {
                                var index = selectedRequests.indexOf(this["RequestWorkItemID"]);
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
            $(indexingObject.controls.textBoxes.NumberOfItemsTextBox).text("(" + numberOfItems + ")").val(numberOfItems).trigger("change");
        }

        function batchDeleteObjects(targetGrid, objName, url, data, isAssign, assignTo, completeCallback) {

            if (!targetGrid || !objName || !url)
                return false;

            var grid = $(targetGrid).data("kendoGrid");
            if (grid && grid.dataSource._total > 0) {
                var selectedIds = new Array();
                $.each(grid.dataSource.data(), function () {
                    if (this.IsSelected == true)
                        selectedIds.push(this.id);
                });

                if (selectedIds.length == 0) {
                    $(this).displayError(messages.errorMessages.NoItemsSelected);
                    return false;
                }

                if (isAssign)
                    $(actionModals.Assign).displayModal();

                if (!data)
                        data = {};

                    data['ids'] = selectedIds;
                    data["searchCriteria"] = $(indexingObject.controls.hiddenControls.SearchCriteria).val();
                    data["isAssign"] = isAssign;

                    if (typeof (assignTo) != "undefined") {
                        data["assignedTo"] = assignTo;
                        $(actionModals.Assign).hideModal();
                        var args = { message: 'Are you sure you would like to ' + objName + '?', header: 'Confirm Requests Selected' };
                        DisplayConfirmationModal(args, function () {
                            $.ajax({
                                url: url,
                                data: JSON.stringify(data),
                                type: "POST",
                                contentType: 'application/json; charset=utf-8',
                                beforeSend: function () {
                                    kendo.ui.progress(indexingDetailObj, true);
                                },
                                error: function () {
                                    $(this).displayError(messages.errorMessages.RequestsCouldNotBeAssigned);
                                },
                                success: function (successData) {

                                    if (successData.success == true) {

                                        // Uncheck the master select checkbox if checked
                                        var checkbox = $(grid.element).find('.chkMasterMultiSelect');
                                        if (checkbox && checkbox.is(':checked'))
                                            checkbox.attr('checked', false);
                                        grid = $(targetGrid).data("kendoGrid");
                                        grid.dataSource.read();
                                        $(this).savedSuccessFully(messages.successMessages.Saved);
                                    } else
                                        $(this).displayError(messages.errorMessages.GeneralError);
                                },
                                complete: function (compData) {
                                    kendo.ui.progress(indexingDetailObj, false);
                                    if (completeCallback)
                                        completeCallback(compData);
                                }
                            });
                        });
                } 
            }
            return false;
        };

        


        return {
            loadRequestsPlugin: loadRequestsPlugin,
            loadRequests: loadRequests
        };
    };
})(jQuery);