; (function ($) {
    if ($.fn.complibObtainment == null) {
        $.fn.complibObtainment = {};

    }
    $.fn.complibObtainment = function () {
        var obtainmentDetailObj = $("#DetailObtianment");
        var obtainmentSearchObj = $("#ObtianmentWFGrid");
        var obtainmentDetailWorkFlowObj = $("#ObtianmentWFDetails");
        var obtianmentDetailModals = $("#ObtainmentDetailModals");
        var itemsChecked = 0;
        var selectedRequests = new Array();
        var selectedRows = new Array();
        //var radioButtonSelected = "Group";
        var obtainmentObject = {
            controls: {
                grids: { GridRequests: "#gdRequests", GridSupplierNotes: "#gdSupplierNotes", GridDetailRequests: "#gdDetailRequests" },
                buttons: {
                    ClearRequestSearchButton: "#clearRequestSearchBtn",
                    SearchRequestsButton: "#searchRequestBtn",
                    SaveSearchSettings: "#saveSearchSettingsBtn",
                    ActionLoadModal: "#actionLoadModalBtn",
                    FollowUpSaveButton: "#btnSaveFollowUp",
                    FollowUpCancelButton: "#btnCancelFollowUp"
                },
                textBoxes: {
                    NumberOfItemsTextBox: "#numberOfItems",
                    FollowUpNotes: "#txtFollowUpNotes"

                },
                dateTime: { NextStepDueDate: "#dteNextStepDueDate" },
                dropdownlists: {
                    TeamsDropDownList: "#ddlTeams",
                    PrefLangDropDownList: "#ddlDocumentLanguage",
                    DocumentTypeDropDownList: "#ddlDocumentType",
                    LockTypeDropDownList: "#ddlLockType",
                    OSAssignedToId: "#ddlAssignedToId",
                    NextStepDropDownList: "#ddlNextStep",
                    ActionsDropDownList: "#ddlAction",
                    NextStepsDropDownList: "#ddlNextSteps"

                }
            }
        }
        var actionModals = { FollowUp: "#mdlFollowUp", ViewHistory: "#mdlViewHistory" };
        var controllerCalls = {
            SearchRequests: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SearchObtainmentRequests",
            SaveSearchSettings: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveSearchSettings",
            SaveFollowUpRequests: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainmentWorkItemAction",
            ObtainmentWorkItemLoadHistory: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/ObtainmentWorkItemLoadHistoryContent"

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
                NoActionSelected: "No action has been selected",
                RequestsCouldNotBeSaved: "Requests could not be saved",
                RequestsCouldNotBeAssigned: "Requests could not be assigned",
                GeneralError: "Error Occurred"
            }
        };

        var loadRequestsPlugin = function() {
            initializeMultiSelectCheckboxes(obtainmentDetailWorkFlowObj);
        }

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
            var drpTeams = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.TeamsDropDownList).data("kendoDropDownList");
            var drpLanguage = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.PrefLangDropDownList).data("kendoDropDownList");
            var drpDocType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.DocumentTypeDropDownList).data("kendoDropDownList");
            var drpNextStep = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.NextStepDropDownList).data("kendoDropDownList");

            obtainmentWorkLoadSearchResultModel.TeamID = drpTeams.value() == "" ? 0 : drpTeams.value();
            obtainmentWorkLoadSearchResultModel.DocumentLanguageId = drpLanguage.value() == "" ? 0 : drpLanguage.value();            
            obtainmentWorkLoadSearchResultModel.DocumentTypeId = drpDocType.value() == "" ? 0 : drpDocType.value();            
            obtainmentWorkLoadSearchResultModel.NextStepId = drpNextStep.value() == "" ? 0: drpNextStep.value();

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

        obtainmentDetailWorkFlowObj.on("click", obtainmentObject.controls.buttons.ActionLoadModal, function () {
            var ddlActions = $(obtainmentObject.controls.dropdownlists.ActionsDropDownList).data("kendoDropDownList");

            if ($(obtainmentObject.controls.textBoxes.NumberOfItemsTextBox).val().length == 0) {
                $(this).displayError(messages.errorMessages.NoItemsSelected);
                return;
            }

            if (ddlActions.value() == "") {
                $(this).displayError(messages.errorMessages.NoActionSelected);
                return;
            }

            if (ddlActions.value() == "1050")
                ShowActionModals(actionModals.FollowUp);


        });

        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.FollowUpCancelButton, function () {
            $(actionModals.FollowUp).toggleModal();
        });

        
        obtianmentDetailModals.on("click", obtainmentObject.controls.buttons.FollowUpSaveButton, function () {
            var ddlNextSteps = $(obtainmentObject.controls.dropdownlists.NextStepsDropDownList).data("kendoDropDownList");
            var ddlActions = $(obtainmentObject.controls.dropdownlists.ActionsDropDownList).data("kendoDropDownList");
            var dteDateAssigned = $(obtainmentObject.controls.dateTime.NextStepDueDate).data("kendoDatePicker");
            if ($(obtainmentObject.controls.textBoxes.NumberOfItemsTextBox).val().length == 0) {
                $(actionModals.FollowUp).toggleModal();
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {
                if (ddlNextSteps.value() != "") {
                    var data = {};
                    data['ObtainmentWorkItemIDs'] = selectedRequests;
                    data['ObtainmentActionLkpID'] = ddlActions.value();
                    data['NextObtainmentStepLkpID'] = ddlNextSteps.value();
                    data['Notes'] = $(obtainmentObject.controls.textBoxes.FollowUpNotes).val();
                    data['NextObtainmentStepDueDate'] = dteDateAssigned.value();
                    SaveFollowUpRequests(controllerCalls.SaveFollowUpRequests, data, actionModals.FollowUp);
                } else {
                    $(actionModals.FollowUp).toggleModal();
                    $(this).displayError(messages.errorMessages.NoProductSelected);
                }
            }
        });

        //Does search and displays search results 
        obtainmentSearchObj.on("click", obtainmentObject.controls.buttons.SearchRequestsButton, function () {
            var obtainmentWorkLoadSearchResultModel = {};

            var drpTeams = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.TeamsDropDownList).data("kendoDropDownList");
            var drpLang = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.PrefLangDropDownList).data("kendoDropDownList");
            var drpDocType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.DocumentTypeDropDownList).data("kendoDropDownList");
            var drpLockType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.LockTypeDropDownList).data("kendoDropDownList");
            var drpAssignedToType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.OSAssignedToId).data("kendoDropDownList");
            var drpNextStep = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.NextStepDropDownList).data("kendoDropDownList");

            //create requestSearchModel to be passed to the controller
            obtainmentWorkLoadSearchResultModel.TeamID = drpTeams.value() == "" ? 0 : drpTeams.value();
            obtainmentWorkLoadSearchResultModel.DocumentLanguageId = drpLang.value() == "" ? 0 : drpLang.value();
            obtainmentWorkLoadSearchResultModel.DocumentTypeId = drpDocType.value() == "" ? 0 : drpDocType.value();            
            obtainmentWorkLoadSearchResultModel.LockTypeId = drpLockType.value() == "" ? 0 : drpLockType.value();
            obtainmentWorkLoadSearchResultModel.AssignedToId = drpAssignedToType.value() == "" ? 0 : drpAssignedToType.value();
            obtainmentWorkLoadSearchResultModel.NextStepId = drpNextStep.value() == "" ? 0 : drpNextStep.value();

            obtainmentWorkLoadSearchResultModel.HasFilter = obtainmentWorkLoadSearchResultModel.TeamID
                + obtainmentWorkLoadSearchResultModel.DocumentLanguageId
                + obtainmentWorkLoadSearchResultModel.DocumentTypeId
                + obtainmentWorkLoadSearchResultModel.LockTypeId
                + obtainmentWorkLoadSearchResultModel.AssignedToId
                + obtainmentWorkLoadSearchResultModel.NextStepId;

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
                    error: function () {
                        $(this).displayError(messages.errorMessages.GeneralError);
                    }
                });
            }
            else
                $(this).displayError(messages.errorMessages.SelectFilter);
        });

        obtainmentSearchObj.on("click", obtainmentObject.controls.buttons.ClearRequestSearchButton, function () {
            var drpTeams = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.TeamsDropDownList).data("kendoDropDownList");
            var drpLang = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.PrefLangDropDownList).data("kendoDropDownList");
            var drpDocType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.DocumentTypeDropDownList).data("kendoDropDownList");
            var drpLockType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.LockTypeDropDownList).data("kendoDropDownList");
            var drpAssignedToType = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.OSAssignedToId).data("kendoDropDownList");
            var drpNextStep = $("#divSearchSection " + obtainmentObject.controls.dropdownlists.NextStepDropDownList).data("kendoDropDownList");
            drpTeams.select(0);
            drpLang.select(0);
            drpDocType.select(0);
            drpLockType.select(0);
            drpAssignedToType.select(0);
            drpNextStep.select(0);
       });
       
        //Display Modal Pop Up for History of Requests
        obtainmentDetailWorkFlowObj.on("click", ".showHistory", function (e) {
           e.preventDefault();
            $.ajax({
                url: controllerCalls.ObtainmentWorkItemLoadHistory,
                type: 'POST',
                cache: false,
                data: { obtainmentWorkID: this.id, supplierId:null },
                success: function (result) {
                    $("#dvRequestItemHistory").html(result);
                    $(actionModals.ViewHistory).displayModal();
                   
                },
                error:function() {
                    $(this).displayError(messages.errorMessages.GeneralError);
                }
            });

            });

        $(actionModals.ViewHistory).on('shown.bs.modal', function() {
            $(document).off('focusin.modal');
        });

        obtainmentDetailWorkFlowObj.on("click", ".showHistorySupplier", function (e) {
            e.preventDefault();
            $.ajax({
            url: controllerCalls.ObtainmentWorkItemLoadHistory,
                type: 'POST',
                cache: false,
            data: { obtainmentWorkID: null, supplierId:this.id  },
                success: function (result) {
                    $("#dvRequestItemHistory").html(result);
                    $(actionModals.ViewHistory).displayModal();
            },
            error: function() {
                    $(this).displayError(messages.errorMessages.GeneralError);
            }
            });
        });

        function ShowActionModals(mdlObj) {
            $(mdlObj).displayModal();
        }

        function DisableEnableButtons(enable) {
            $(obtainmentObject.controls.buttons.SearchRequestsButton).enableControl(enable);
            $(obtainmentObject.controls.buttons.ClearRequestSearchButton).enableControl(enable);
            $(obtainmentObject.controls.buttons.SaveSearchSettings).enableControl(enable);
        };

        //function RenderSwitch() {
        //    $("[name='" + obtainmentObject.controls.checkSwitch.RequestLocked + "']").bootstrapSwitch();
        //};

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
                            selectedRequests.push(this["ObtainmentWorkID"]);
                            itemsChecked++;
                        } else {
                            var index = selectedRequests.indexOf(this["ObtainmentWorkID"]);
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
                                selectedRequests.push(this["ObtainmentWorkID"]);
                                itemsChecked++;
                            } else {
                                var index = selectedRequests.indexOf(this["ObtainmentWorkID"]);
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
            $(obtainmentObject.controls.textBoxes.NumberOfItemsTextBox).text("(" + numberOfItems + ")").val(numberOfItems).trigger("change");
        }

        function SaveFollowUpRequests(strUrl, dataArray, modalId) {
            if (selectedRequests.length > 0) {
                $.ajax({
                    url: strUrl,
                    data: JSON.stringify(dataArray),
                    type: "POST",
                    contentType: 'application/json; charset=utf-8',
                    beforeSend: function () {
                        kendo.ui.progress(obtainmentDetailWorkFlowObj, true);
                    },
                    error: function () {
                        $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);
                    },
                    success: function (successData) {
                        if (successData.success == true) {
                            kendo.ui.progress(obtainmentDetailWorkFlowObj, false);
                            var grid = $(obtainmentObject.controls.grids.GridDetailRequests).data("kendoGrid");
                            grid.dataSource.read();
                            if (modalId != null)
                                $(modalId).hideModal();
                            $(this).savedSuccessFully(messages.successMessages.Saved);
                        } else
                            $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);

                    },
                    done: function () {
                        $(this).savedSuccessFully(messages.successMessages.Saved);
                    }
                });
            }
        }

        return {
            loadRequests: loadRequests,
            loadRequestsPlugin: loadRequestsPlugin,
            loadSupplierNotes: loadSupplierNotes,
            //RenderSwitch: RenderSwitch,
            //onAssignedToChange: onAssignedToChange
        };
    };
})(jQuery);
