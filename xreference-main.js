; (function ($) {
    if ($.fn.complibXReference == null) {
        $.fn.complibXReference = {};

    }
    $.fn.complibXReference = function () {
        var xreferenceDetailObj = $("#DetailXreference");
        var xreferenceSearchObj = $("#XReferenceGrid");
        var itemsChecked = 0;
        var newRequestCount = 0;
        var onHoldCount = 0;
        var requestSearchModel = {};
        var selectedRequests = new Array();
        var selectedRows = new Array(); 
        var radioButtonSelected = "Group";
        var silbingSupplierId = 0;

        var xreferenceObject = {
            controls: {
                grids: { GridRequests: "#gdRequests", SearchSupplierNewGrid: "#gdSearchSupplierNew" },
                buttons: {
                    CancelSupplierSearch: "#btnCancelSupplierSearch",
                    ObtainmentSideMenuButton: "#btnObtainment",
                    NotFoundSideMenuButton: "#btnNotFound",
                    ResolveSideMenuButton: "#btnResolve",
                    OnHoldSideMenuButton: "#btnOnHold",
                    RemoveHoldSideMenuButton: "#btnRemoveHold",
                    CustomerActionSideMenuButton: "#btnCustomerAction",
                    PendingSideMenuButton: "#btnPending",
                    QCFailSideMenuButton: "#btnQC",
                    UnAssignFromButton: "#btnUnAssignFrom",
                    AssignToButton: "#btnAssignTo",
                    AssignMeButton: "#btnAssignMe",
                    UnAssignButton: "#btnUnAssign",
                    ClearRequestSearchButton: "#clearRequestSearchBtn",
                    SaveAssignButton: "#btnSaveAssign",
                    SearchSupplierButton: "#searchSupplierIdBtn",
                    SearchRequestsButton: "#searchRequestBtn",
                    SaveResolveButton: "#btnSaveResolve",
                    SaveObtainmentButton: "#btnSaveObtainment",
                    SaveCustomerActionButton: "#btnSaveCustomerAction",
                    SavePendingButton: "#btnSavePending",
                    SaveQCFailButton: "#btnSaveQC",
                    SaveRemoveWorkLoad: "#btnSaveRemoveWorkLoad",
                    RemoveRequestsButton: "#btnRemoveRequests",
                    SaveOnHoldWorkLoadButton: "#btnSaveOnHoldWorkLoad",
                    SaveRemoveOnHoldWorkLoadButton: "#btnSaveRemoveOnHoldWorkLoad"
                },
                radioButtons: {
                    CategoriesMatchGroup: "mltCategoriesMatchGroup"
                },
                textBoxes: {
                    IndividualTextBox: "#txtIndividual",
                    NotesTextBox: "#txtNotes",
                    PendingNotesTextBox: "#txtPendingNotes",
                    FreeFieldTextBox: "#txtFreeField",
                    ProductIdTextBox: "#txtProductId",
                    NumberOfItemsTextBox: "#numberOfItems",
                    SearchSupplierIdTextBox: "#txtSearchSupplierId",
                    RemoveWorkLoadTextBox: "#txtRemoveWorkLoadNotes",
                    OnHoldWorkLoadTextBox: "#txtOnHoldWorkLoadNotes",
                    RemoveOnHoldWorkLoadTextBox: "#txtRemoveOnHoldWorkLoadNotes",
                    txtCASupplierIDName: "#txtCASupplierIDName"
                },
                dropdownlists: {
                    GroupsDropDownList: "#ddlGroups",
                    CustomerActionDropDownList: "#selCustomerAction",
                    PendingDropDownList: "#selPending",
                    StateDropDownList: "#ddlStatus",
                    DaysDropDownList: "#ddlDays",
                    FieldsDropDownList: "#drpFields",
                    ContainsDropDownList: "#drpContains",
                    LanguageDropDownList: "#drpLanguage",
                    DocumentTypeDropDownList: "#drpDocumentType",
                    CountryDropDownList: "#drpCountry",
                    YesNoDropDownList: "#selYesNo"
                },
                multiSelectLists: { CategoriesMultiSelect: "#mltCategories" },
                dateTime: { DateAssigned: "#DateAssigned", DateCreated: "#DateCreated" },
                labels: {
                    NotesLabel: "#lblNotes",
                    PendingNotesLabel: "#lblPendingNotes",
                    PhysicalState: "#lblPhysicalState",
                    lblXRefSource: "#lblXRefSource"
                },
                sideMenus: { SideBarWorkLoad: "#eeeSideBarWorkLoad" }
            }
        };
        var criteriaCondition = { Contains: 0, ExactMatch: 1, StartsWith: 2, EndsWith: 3 };
        var controllerCalls = {
            GetGroupUsers: GetEnvironmentLocation() + "/Operations/Configuration/RequestManager/GetGroupUsers",
            SupplierSearch: GetEnvironmentLocation() + "/Operations/ObtainmentSettings/PlugInSupplierSearch",
            SaveAssignedItems: GetEnvironmentLocation() + "/Operations/XReference/SaveAssignedItems",
            SearchXReferenceContent: GetEnvironmentLocation() + "/Operations/XReference/SearchXReferenceContent",
            SearchRequests: GetEnvironmentLocation() + "/Operations/XReference/SearchRequests",
            ResolveRequests: GetEnvironmentLocation() + "/Operations/XReference/ResolveRequests",
            SaveObtainment: GetEnvironmentLocation() + "/Operations/ObtainmentWorkFlow/SaveObtainment",
            SaveNotFound: GetEnvironmentLocation() + "/Operations/XReference/SaveNotFound",
            SaveActionRequests: GetEnvironmentLocation() + "/Operations/XReference/SaveCustomerActionRequests",
            SavePendingRequests: GetEnvironmentLocation() + "/Operations/XReference/SavePendingRequests",
            RequestWorkLoadHistory: GetEnvironmentLocation() + "/Operations/Xreference/RequestWorkLoadHistory",
            SaveRemoveWorkLoad: GetEnvironmentLocation() + "/Operations/Xreference/SaveRemoveWorkLoad"
        };
        var actionModals = { Resolve: "#mdlResolve", Obtainment: "#mdlObtainment", Pending: "#mdlPending", CustomerAction: "#mdlCustomerAction", RemoveWorkLoad: "#mdlRemove", Assign: "#mdlAssign", ViewHistory: "#mdlViewHistory", OnHold: "#mdlOnHold", RemoveOnHold: "#mdlRemoveOnHold" };
        var messages = {
            successMessages: { Saved: "Saved Successful" },
            confirmationMessages: {
                UnAssigneRequests: "unassign these request item(s)",
                AssignRequests: "assign these request item(s)",
                OverwriteComments: "Overwrite previous customer action comments?",
                CrossReferenceResolutionStateMismatch: "The physical state of the selected product does not match the physical state of one or more of the cross reference requests.<br>" +
                  "Proceed with the match ?"
            },
            errorMessages: {
                SelectGroup: "Please select a group to assign request item(s)",
                UserRequiredToAssign: "User required to assign selected request item(s)",
                SelectFilter: "A filter must be selected to execute a search",
                NoItemsSelected: "No items have been selected",
                NoProductSelected: "Invalid Product",
                NoSupplierSelected: "No supplier has been selected",
                NoCustomerActionSelected: "No customer action has been specified",
                NoPendingActionSelected: "No action has been specified",
                NoRowSelected: "No row selected",
                RequestsCouldNotBeSaved: "Requests could not be saved",
                RequestsCouldNotBeAssigned: "Requests could not be assigned",
                RemoveWorkLoadNotes: "Please type in a reason to remove item(s) from workload",
                OnHoldWorkLoadNotes: "Please type in a reason to hold or remove the item(s) frmo workload",
                GeneralError: "Error Occurred",
                SelectedStateForSqlError: "Selected State is only for SQL Search",
                SelectedStateForEsError: "Selected State is only for Elastic Search"
            }
        };

        // General indexation methods
        var loadRequestsPlugin = function () {
            initializeMultiSelectCheckboxes(xreferenceDetailObj);
        };

        var loadMyRequestsPlugin = function () {
            initializeMultiSelectCheckboxes(xreferenceSearchObj);
        };

        var IsReadOnlyMode = function () {
            return ($("#SearchPanel").find("span.icon-lock.icon-white").length === 1);
        };

        //Foreign script from suppplier not being in this module
        var gdGroupsChange = function () {
            var selectedData = this.dataItem(this.select());
            var groupId = selectedData.GroupID;
            var url = controllerCalls.GetGroupUsers;
            $.post(url, {
                groupId: groupId
            }, function (result) {
                $("#GroupUsersDetail").html($(result));
            });

        };

        var loadRequests = function () {
            var grid = $(xreferenceObject.controls.grids.GridRequests).data("kendoGrid");
            grid.dataSource.read();
            $(xreferenceObject.controls.textBoxes.IndividualTextBox).closest(".k-widget").hide();
            $(xreferenceObject.controls.sideMenus.SideBarWorkLoad).sidemenu().show();
            //$("#atlwdg-trigger").css({ top: '100px' });
            DisableSideMenuItems();
        };

        var loadSupplierPlugIn = function () {
            $.post(controllerCalls.SupplierSearch, { supplierId: 0 }, function (data) {
                $("#dgSupplierPlugIn").html(data);
            });
            var supplierSearchDialog = $("#supplierSearchWindow");

            $(xreferenceObject.controls.buttons.CancelSupplierSearch).click(function () {
                supplierSearchDialog.data("kendoWindow").close();
                DisableSideMenuItems();
                //EnableSideMenuItem(xreferenceObject.controls.buttons.ObtainmentSideMenuButton);
                $(actionModals.Obtainment).displayModal();
            });

            $('#dgSupplierPlugIn').on('dblclick', 'table tr', function () {
                obtainmentSelSupplier(supplierSearchDialog);
            });

            //This is for Supplier plugIn
            $("#searchSupplierIdSelect").click(function () {
                obtainmentSelSupplier(supplierSearchDialog);
            });

        };

        var hotKeyDisplay = function (btnObj, mdlObj) {

            var xrefModals = [actionModals.Resolve, actionModals.Obtainment, actionModals.Pending, actionModals.CustomerAction, actionModals.RemoveWorkLoad];
            for (var i = 0; i < xrefModals.length; i++) {
                if (mdlObj !== xrefModals[i])
                    $(xrefModals[i]).hideModal();
            }

            if (btnObj === xreferenceObject.controls.buttons.ResolveSideMenuButton)
                $("#hdnDialogOpen").val("resolveOpen");


            DisableSideMenuItems();
            EnableSideMenuItem(btnObj);
            $(mdlObj).displayModal();
        };

        //Assgn and Unassign Request and saves them
        if ($("#hdnAccess").val() === "Admin") {
            AssignUnassignRequest(xreferenceObject.controls.buttons.UnAssignFromButton, xreferenceObject.controls.grids.GridRequests, messages.confirmationMessages.UnAssigneRequests, controllerCalls.SaveAssignedItems, false, "x u");
            AssignUnassignRequest(xreferenceObject.controls.buttons.AssignToButton, xreferenceObject.controls.grids.GridRequests, messages.confirmationMessages.AssignRequests, controllerCalls.SaveAssignedItems, true, "x a");
        } else {
            AssignUnassignRequest(xreferenceObject.controls.buttons.AssignMeButton, xreferenceObject.controls.grids.GridRequests, messages.confirmationMessages.AssignRequests, controllerCalls.SaveAssignedItems, true, "x a");
            AssignUnassignRequest(xreferenceObject.controls.buttons.UnAssignButton, xreferenceObject.controls.grids.GridRequests, messages.confirmationMessages.UnAssigneRequests, controllerCalls.SaveAssignedItems, false, "x u");
        };


        xreferenceSearchObj.on("click", xreferenceObject.controls.buttons.ClearRequestSearchButton, function () {
            var url = controllerCalls.SearchXReferenceContent;
            $.post(url, function (data) {
                $("#divSearchSection").html(data);
            });
        });


        xreferenceDetailObj.on("change", "input[name=GroupIndividual]:radio", function () {
            radioButtonSelected = $(this).val();
            if ($(this).val() === "Group") {
                $(xreferenceObject.controls.dropdownlists.GroupsDropDownList).closest(".k-widget").show();
                $(xreferenceObject.controls.textBoxes.IndividualTextBox).closest(".k-widget").hide();
                $(xreferenceObject.controls.textBoxes.IndividualTextBox).data("kendoAutoComplete").value("");
            }
            else {
                $(xreferenceObject.controls.textBoxes.IndividualTextBox).closest(".k-widget").show();
                $(xreferenceObject.controls.dropdownlists.GroupsDropDownList).closest(".k-widget").hide();
            }
        });

        xreferenceDetailObj.on("click", xreferenceObject.controls.buttons.SaveAssignButton, function (e) {
            e.preventDefault();
            var userName = $(xreferenceObject.controls.textBoxes.IndividualTextBox).data("kendoAutoComplete");
            var selectedValue;
            if (radioButtonSelected === "Group") {
                var ddlGroups = $(xreferenceObject.controls.dropdownlists.GroupsDropDownList).data("kendoDropDownList");
                selectedValue = ddlGroups.text();
            } else
                selectedValue = userName.value();


            if (selectedValue.length > 0)
                batchDeleteObjects(xreferenceObject.controls.grids.GridRequests, messages.confirmationMessages.AssignRequests, controllerCalls.SaveAssignedItems, null, true, selectedValue);
            else {
                $(actionModals.Assign).hideModal();
                var errorMessage;

                if ($("input[name=GroupIndividual]:radio").val() === "Group")
                    errorMessage = messages.errorMessages.SelectGroup;
                else
                    errorMessage = messages.errorMessages.UserRequiredToAssign;

                $(this).displayError(errorMessage);
            }

        });

        //clears search results
        xreferenceSearchObj.on("click", xreferenceObject.controls.buttons.ClearRequestSearchButton, function () {
            xreferenceDetailObj.html("");
        });

        //Show Supplier
        xreferenceSearchObj.on("click", xreferenceObject.controls.buttons.SearchSupplierButton, function () {
            // var activeSupplier = "txtSearchSupplierId";
            $("#supplierSearchWindow").data("kendoWindow").center().open();
            $(actionModals.Obtainment).toggleModal();
        });

        //Toggle Customer Action Option for Notes
        xreferenceSearchObj.on("change", xreferenceObject.controls.dropdownlists.CustomerActionDropDownList, function () {

            var txtNotes = $(xreferenceObject.controls.textBoxes.NotesTextBox);
            var selNotes = $(xreferenceObject.controls.dropdownlists.CustomerActionDropDownList).data("kendoDropDownList");

            $(xreferenceObject.controls.labels.NotesLabel).css("display", "inline");
            $(xreferenceObject.controls.textBoxes.NotesTextBox).css("display", "inline");

            // already entered text
            var txtCustomerAction = txtNotes.val();
            var emptyCustomerAction = (txtCustomerAction.replace(/ /g, "") == "");

            // "fix" selected customer action
            var selCustomerAction = selNotes.text();
            if (selCustomerAction == "Select One") selCustomerAction = "";
            selCustomerAction = selCustomerAction.split(" ").slice(2).join(" ");

            // content already in text
            if (!emptyCustomerAction) {

                var edited = true;
                $(selNotes.dataSource.view()).each(function () {
                    var note = this.Text.split(" ").slice(2).join(" ");
                    if (note == txtCustomerAction) edited = false;
                });

                // if edited, prompt user for change confirmation.
                if (edited) {

                    var message = messages.confirmationMessages.OverwriteComments;
                    var args = { message: message, header: 'Confirm comment overwrite.' };

                    DisplayConfirmationModal(args, function () {
                        $(xreferenceObject.controls.textBoxes.NotesTextBox).val(selCustomerAction);
                    }, function () {
                        // do nothing
                    });

                }
                else
                    $(xreferenceObject.controls.textBoxes.NotesTextBox).val(selCustomerAction);

            }
            else {
                $(xreferenceObject.controls.textBoxes.NotesTextBox).val(selCustomerAction);
            }

        });

        //Toggle Pending Option for Notes
        xreferenceSearchObj.on("change", xreferenceObject.controls.dropdownlists.PendingDropDownList, function () {
            var selPending = $(xreferenceObject.controls.dropdownlists.PendingDropDownList).data("kendoDropDownList");
            if (selPending.text() === "Other") {
                $(xreferenceObject.controls.labels.PendingNotesLabel).css("display", "inline");
                $(xreferenceObject.controls.textBoxes.PendingNotesTextBox).css("display", "inline");
            } else {
                $(xreferenceObject.controls.labels.PendingNotesLabel).css("display", "none");
                $(xreferenceObject.controls.textBoxes.PendingNotesTextBox).css("display", "none");
            }
        });

        //Does search and displays search results 
        xreferenceSearchObj.on("click", xreferenceObject.controls.buttons.SearchRequestsButton, function (e) {
            var numberOfRows = $('div #row').length;
            var initialRow = 0;
            var mltCategories = $("#divSearchSection " + xreferenceObject.controls.multiSelectLists.CategoriesMultiSelect).data("kendoMultiSelect");
            var dteDateAssigned = $("#divSearchSection " + xreferenceObject.controls.dateTime.DateAssigned).data("kendoDatePicker");
            var dteDateCreated = $("#divSearchSection " + xreferenceObject.controls.dateTime.DateCreated).data("kendoDatePicker");
            var drpStatus = $("#divSearchSection " + xreferenceObject.controls.dropdownlists.StateDropDownList).data("kendoDropDownList");
            var drpDays = $("#divSearchSection " + xreferenceObject.controls.dropdownlists.DaysDropDownList).data("kendoDropDownList");

            var strCategoryValue = mltCategories.value();
            var intCategoryValue = 0;

            // get the criteria selections
            for (var indexCategory = 0; indexCategory < strCategoryValue.length; indexCategory++)
                intCategoryValue += parseInt(strCategoryValue[indexCategory]);

            // hack for now
            var categoryCondition = $("#divSearchSection [name=" + xreferenceObject.controls.radioButtons.CategoriesMatchGroup + "]:checked").val();
            if (categoryCondition == "OR") intCategoryValue = -intCategoryValue;

            //create requestSearchModel to be passed to the controller
            requestSearchModel.DateAssigned = dteDateAssigned.value() === "" ? null : dteDateAssigned.value();
            requestSearchModel.DateCreated = dteDateCreated.value() === "" ? null : dteDateCreated.value();
            requestSearchModel.StatusId = drpStatus.value() === "" ? null : drpStatus.value();
            requestSearchModel.DaysSelected = drpDays.value() === "" ? null : drpDays.value();
            requestSearchModel.Category = intCategoryValue === 0 ? null : intCategoryValue;

            var criteriaList = [];
            selectedSupplierNameOperator = 0;
            selectedSupplierName = "";
            selectedSupplierId = 0;      
            //create filter array
            for (var indexRows = 0; indexRows < numberOfRows; indexRows++) {
                initialRow++;
                var drpFields = $("div #row #middle " + xreferenceObject.controls.dropdownlists.FieldsDropDownList + "_" + initialRow).data("kendoDropDownList");
                var drpCriteria = $("div #row #right " + xreferenceObject.controls.dropdownlists.ContainsDropDownList + "_" + initialRow).data("kendoDropDownList");
                var criteria = {};
                criteria.FieldName = drpFields.value();
                criteria.WhereOperator = drpCriteria.text();
                criteria.SearchOperator = drpCriteria.value();

                var valueAssigned;
                if ($("div #row #right " + xreferenceObject.controls.textBoxes.FreeFieldTextBox + "_" + initialRow).is(":hidden")) {
                    if (drpFields.text() === "Language") {
                        var drpLanguage = $("div #row #right " + xreferenceObject.controls.dropdownlists.LanguageDropDownList + "_" + initialRow).data("kendoDropDownList");
                        var language = drpLanguage.value();
                        criteria.SearchFor = language.replace("flag-", "");
                    }


                    if (drpFields.text() === "Document Type") {
                        var drpDocType = $("div #row #right " + xreferenceObject.controls.dropdownlists.DocumentTypeDropDownList + "_" + initialRow).data("kendoDropDownList");
                        criteria.SearchFor = drpDocType.value();
                    }


                    if (drpFields.text() === "Country") {
                        var drpCountry = $("div #row #right  " + xreferenceObject.controls.dropdownlists.CountryDropDownList + "_" + initialRow).data("kendoDropDownList");
                        criteria.SearchFor = drpCountry.value();
                    }

                    if (criteria.SearchFor == null) {
                        criteria.SearchFor = $("div #row #right " + xreferenceObject.controls.textBoxes.FreeFieldTextBox + "_" + initialRow).val();
                    }

                    if (criteria.SearchFor.length > 0)
                        criteriaList.push(criteria);

                } else {
                    valueAssigned = $("div #row " + xreferenceObject.controls.textBoxes.FreeFieldTextBox + "_" + initialRow).val().replace(/'/g, "''");
                    criteria.SearchFor = valueAssigned;

                    if (valueAssigned.length > 0)
                        criteriaList.push(criteria);
                }
            }

            if (dteDateAssigned.value() != null || dteDateCreated.value() != null || drpStatus.value() !== "" || drpDays.value() !== "" || intCategoryValue != 0 || criteriaList.length > 0) {
                //add filter array to requestSearchModel
                $(xreferenceObject.controls.buttons.SearchRequestsButton).enableControl(false);
                $(xreferenceObject.controls.buttons.ClearRequestSearchButton).enableControl(false);
                requestSearchModel.Criterias = criteriaList;
                kendo.ui.progress(xreferenceDetailObj, true);
                $(this).ajaxCall(controllerCalls.SearchRequests, { searchCriteria: JSON.stringify(requestSearchModel) })
                    .success(function (data) {
                        xreferenceDetailObj.html(data);                        
                    }).done(function () {
                        $(xreferenceObject.controls.buttons.SearchRequestsButton).enableControl(true);
                        $(xreferenceObject.controls.buttons.ClearRequestSearchButton).enableControl(true);
                    });
            } else
                $(this).displayError(messages.errorMessages.SelectFilter);
        });

        function resolveRequests() {
            var data = {};
            data['ids'] = selectedRequests;
            data['productId'] = $(xreferenceObject.controls.textBoxes.ProductIdTextBox).val();
            data['sourceFrom'] = $(xreferenceObject.controls.labels.lblXRefSource)[0].innerText;
            SaveRequest(controllerCalls.ResolveRequests, data, actionModals.Resolve);
        }

        //Save Request to be Resolved
        xreferenceSearchObj.on("click", xreferenceObject.controls.buttons.SaveResolveButton, function () {
            if ($(xreferenceObject.controls.textBoxes.NumberOfItemsTextBox).val().length === 0) {
                $(actionModals.Resolve).toggleModal();
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {

                if ($(xreferenceObject.controls.textBoxes.ProductIdTextBox).val().length > 0 && $("#lblProductName").text().length > 0 && $("#lblSupplierName").text().length > 0) {

                    // prompt for confirmation if the physical state requested in the xref and the
                    // product selected do not match.
                    var states = [];
                    var physicalState = $(xreferenceObject.controls.labels.PhysicalState).text();
                    
                    // get the physical states of the selected rows
                    var grid = $(xreferenceObject.controls.grids.GridRequests).data("kendoGrid").dataSource.view();
                    Array.from(grid).forEach(i => {
                        if (selectedRequests.indexOf(i.RequestWorkItemID) >= 0 && i.PhysicalState != null) {
                            states.push(i.PhysicalState);
                        }
                    });

                    if (Array.from(states).some(e => e != physicalState)) {

                        var message = messages.confirmationMessages.CrossReferenceResolutionStateMismatch;
                        var args = { message: message, header: 'Confirm cross reference resolution.' };

                        _DisplayConfirmationModal(args, function () {
                            resolveRequests();
                        }, function () {
                            // do nothing
                        });
                    }
                    else {
                        resolveRequests();
                    }

                } else {
                    $(actionModals.Resolve).toggleModal();
                    $(this).displayError(messages.errorMessages.NoProductSelected);
                }
            }
        });

        //Not Found
        xreferenceSearchObj.on("click", xreferenceObject.controls.buttons.NotFoundSideMenuButton, function () {
            $(this).displayError("This feature has been obsolted based on the TRECOMPLI-1271");
            //if ($(xreferenceObject.controls.textBoxes.NumberOfItemsTextBox).val() == "") {
            //    $(this).displayError(messages.errorMessages.NoItemsSelected);
            //} else {
            //    var data = {};
            //    data['ids'] = selectedRequests;
            //    var args = { message: 'Are you sure you would like to proceed?', header: 'Save Not Found Items'};
            //    DisplayConfirmationModal(args, function () {
            //        SaveRequest(controllerCalls.SaveNotFound, data, null);
            //    });
            //}
        });

        //Save Request for Obtainment
        xreferenceSearchObj.on("click", xreferenceObject.controls.buttons.SaveObtainmentButton, function () {

            if ($(xreferenceObject.controls.textBoxes.NumberOfItemsTextBox).val().length === 0 || $(xreferenceObject.controls.textBoxes.NumberOfItemsTextBox).val() === "0" || $(xreferenceObject.controls.textBoxes.NumberOfItemsTextBox).val() === "") {
                $(actionModals.Obtainment).toggleModal();
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {
                if ($(xreferenceObject.controls.textBoxes.SearchSupplierIdTextBox).val().length > 0) {
                    var data = {};
                    data['ids'] = selectedRequests;
                    data['supplierId'] = Remove($(xreferenceObject.controls.textBoxes.SearchSupplierIdTextBox).val(), $(xreferenceObject.controls.textBoxes.SearchSupplierIdTextBox).val().indexOf(","));
                    SaveRequest(controllerCalls.SaveObtainment, data, actionModals.Obtainment);
                } else {
                    $(actionModals.Obtainment).toggleModal();
                    $(this).displayError(messages.errorMessages.NoSupplierSelected);
                }
            }

        });

        //Save Request for Customer Action
        xreferenceSearchObj.on("click", xreferenceObject.controls.buttons.SaveCustomerActionButton, function () {
            if ($(xreferenceObject.controls.textBoxes.NumberOfItemsTextBox).val() === "") {

                $(actionModals.CustomerAction).toggleModal();
                $(this).displayError(messages.errorMessages.NoItemsSelected);

            } else {
                var selCustomerActionCtl = $(xreferenceObject.controls.dropdownlists.CustomerActionDropDownList).data("kendoDropDownList");
                var actionId = selCustomerActionCtl.selectedIndex;
                //if (selCustomerAction.text().length > 0 || $(xreferenceObject.controls.textBoxes.NotesTextBox).text().length > 0) {

                var selCustomerAction = $(xreferenceObject.controls.textBoxes.NotesTextBox).val();

                if (selCustomerAction.replace(/ /g, "").length > 0) {
                    var data = {};
                    data['ids'] = selectedRequests;
                    data['customerAction'] = "Customer Action";
                    data['notes'] = selCustomerAction;
                    data['siblingSupplierId'] = silbingSupplierId;
                    data['actionId'] = actionId;
                    SaveRequest(controllerCalls.SaveActionRequests, data, actionModals.CustomerAction);
                } else {
                    $(actionModals.CustomerAction).toggleModal();
                    $(this).displayError(messages.errorMessages.NoCustomerActionSelected);
                }
            }

        });

        //Save Request for Pending Action
        xreferenceSearchObj.on("click", xreferenceObject.controls.buttons.SavePendingButton, function () {
            if ($(xreferenceObject.controls.textBoxes.NumberOfItemsTextBox).val() === "") {
                $(actionModals.Pending).toggleModal();
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {
                var selPending = $(xreferenceObject.controls.dropdownlists.PendingDropDownList).data("kendoDropDownList");
                var selYesNo = $(xreferenceObject.controls.dropdownlists.YesNoDropDownList).data("kendoDropDownList");
                if (selPending.text().length > 0 || $(xreferenceObject.controls.textBoxes.PendingNotesTextBox).text().length > 0) {
                    var data = {};
                    data['ids'] = selectedRequests;
                    data['keepInWorkload'] = selYesNo.value();
                    data['pendingAction'] = selPending.text();
                    data['notes'] = $(xreferenceObject.controls.textBoxes.PendingNotesTextBox).text();
                    SaveRequest(controllerCalls.SavePendingRequests, data, actionModals.Pending);
                } else {
                    $(actionModals.Pending).toggleModal();
                    $(this).displayError(messages.errorMessages.NoPendingActionSelected);
                }
            }

        });

        //Save Request for QC Action
        //xreferenceSearchObj.on("click", "#btnSaveQC", function () {
        //    if ($("#numberOfItems").val() == "") {
        //        HideModal("mdlQC");
        //        onDisplayError("No items have been selected for customer action");
        //    } else {
        //        var selQC = $("#selQC").data("kendoDropDownList");
        //        if (selQC.text().length > 0 || $("#txtQCNotes").text().length > 0) {
        //            var data = {};
        //            data['ids'] = selectedRequests;
        //            data['qcStatus'] = selQC.value();
        //            data['notes'] = $("#txtQCNotes").text();
        //            SaveRequest("../XReference/SaveQCRequests", data, "mdlQC");
        //        } else {
        //            HideModal("mdlQC");
        //            onDisplayError("No action has been specified");
        //        }
        //    }

        //});


        xreferenceSearchObj.on("click", xreferenceObject.controls.buttons.SaveRemoveWorkLoad, function (e) {
            e.preventDefault();
            if ($(xreferenceObject.controls.textBoxes.NumberOfItemsTextBox).val() === "") {
                $(actionModals.RemoveWorkLoad).toggleModal();
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {
                if ($(xreferenceObject.controls.textBoxes.RemoveWorkLoadTextBox).val().length > 0) {
                    var data = {};
                    data['ids'] = selectedRequests;
                    data['notes'] = $(xreferenceObject.controls.textBoxes.RemoveWorkLoadTextBox).val();
                    SaveRequest(controllerCalls.SaveRemoveWorkLoad, data, actionModals.RemoveWorkLoad);
                } else {
                    $(actionModals.RemoveWorkLoad).toggleModal();
                    $(this).displayError(messages.errorMessages.RemoveWorkLoadNotes);
                }
            }
        });

        xreferenceSearchObj.on("click", xreferenceObject.controls.buttons.SaveOnHoldWorkLoadButton, function (e) {
            e.preventDefault();
            if ($(xreferenceObject.controls.textBoxes.NumberOfItemsTextBox).val() === "") {
                $(actionModals.OnHold).toggleModal();
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {
                if ($(xreferenceObject.controls.textBoxes.OnHoldWorkLoadTextBox).val().length > 0) {
                    var data = {
                    };
                    data['ids'] = selectedRequests;
                    data['customerAction'] = "On Hold";
                    data['notes'] = $(xreferenceObject.controls.textBoxes.OnHoldWorkLoadTextBox).val();
                    SaveRequest(controllerCalls.SaveActionRequests, data, actionModals.OnHold);
                } else {
                    $(actionModals.OnHold).toggleModal();
                    $(this).displayError(messages.errorMessages.OnHoldWorkLoadNotes);
                }
            }
        });


        xreferenceSearchObj.on("click", xreferenceObject.controls.buttons.SaveRemoveOnHoldWorkLoadButton, function (e) {
            e.preventDefault();
            if ($(xreferenceObject.controls.textBoxes.NumberOfItemsTextBox).val() === "") {
                $(actionModals.RemoveOnHold).toggleModal();
                $(this).displayError(messages.errorMessages.NoItemsSelected);
            } else {
                if ($(xreferenceObject.controls.textBoxes.RemoveOnHoldWorkLoadTextBox).val().length > 0) {
                    var data = {
                    };
                    data['ids'] = selectedRequests;
                    data['customerAction'] = "Remove On Hold";
                    data['notes'] = $(xreferenceObject.controls.textBoxes.RemoveOnHoldWorkLoadTextBox).val();
                    SaveRequest(controllerCalls.SaveActionRequests, data, actionModals.RemoveOnHold);
                } else {
                    $(actionModals.RemoveOnHold).toggleModal();
                    $(this).displayError(messages.errorMessages.OnHoldWorkLoadNotes);
                }
            }
        });



        //Display Modal Pop Up for History of Requests
        xreferenceSearchObj.on("click", ".showHistory", function (e) {
            e.preventDefault();
            $(this).ajaxCall(controllerCalls.RequestWorkLoadHistory, { requestWorkItemID: this.id })
                   .success(function (result) {
                       $("#dvRequestItemHistory").html(result);
                   }).done(function () {
                       $(actionModals.ViewHistory).displayModal();
                   });
        });

        //changes the controls on the criteria from dropdowns to text inputs depending on selection
        $(document).on("change", "select", function () {
            //only execute this code if the dropdownlist is other than the dropdownlist on grid for paging
            var drpContains;
            if (this.id.length > 0) {

                if (this.id.toLowerCase() == "mltcategories") return;

                var elementId = $(this).attr("id");
                var ddlName = $(this).attr("id").substring(0, elementId.indexOf("_"));
                var index = elementId.substring(elementId.indexOf("_") + 1);
                drpContains = $(xreferenceObject.controls.dropdownlists.ContainsDropDownList + "_" + index).data("kendoDropDownList");
                if ($(this).val() === "Language" || $(this).val() === "DocumentType" || $(this).val() === "Country") {
                    $(xreferenceObject.controls.textBoxes.FreeFieldTextBox + "_" + index).hide();
                    var drpDownList = window.CreateDropDown($(this).val().toLowerCase(), index);
                    //create dropdown in html form first and added to it's corresponding div
                    drpContains.select(criteriaCondition.ExactMatch);
                    drpContains.enable(false);
                    $("#dvDropDown_" + index).html(drpDownList);
                    //transform select to kendo dropdown
                    $("#drp" + $(this).val() + "_" + index).kendoDropDownList();
                    $("#dvDropDown_" + index).css("display", "inline");
                    return;
                }
                if ($(this).get(0).id.startsWith("drpLanguage") || $(this).get(0).id.startsWith("drpDocumentType") || $(this).get(0).id.startsWith("drpCountry")) {
                    //skip all the events
                }

                else if ($(this).val().toLowerCase().endsWith("id") && !($(this).val().toLowerCase().endsWith("clientproductid"))) {
                    drpContains.select(criteriaCondition.ExactMatch);
                    drpContains.enable(false);                    
                    $(document).on('keyup', xreferenceObject.controls.textBoxes.FreeFieldTextBox + "_" + index,            
                        function () {
                            this.value = this.value.replace(/[^0-9$,]/g, '');
                   });
                }
                else if ($(this).val().toLowerCase().endsWith("clientproductid")) {
                    drpContains.select(criteriaCondition.ExactMatch);
                    drpContains.enable(false);
                    $(document).on('keyup', xreferenceObject.controls.textBoxes.FreeFieldTextBox + "_" + index,
                        function () {
                            this.value = this.value;
                        });
                }
                
                else if (!$.isNumeric($(this).val())) {
                    drpContains.select(criteriaCondition.Contains);
                    drpContains.enable(true);
                    $(document).off('keyup', xreferenceObject.controls.textBoxes.FreeFieldTextBox + "_" + index);                    
                }

                if (ddlName === xreferenceObject.controls.dropdownlists.FieldsDropDownList.replace("#", "")) {
                    $(xreferenceObject.controls.textBoxes.FreeFieldTextBox + "_" + index).show();
                    $(xreferenceObject.controls.textBoxes.FreeFieldTextBox + "_" + index).val("");
                    $("#dvDropDown_" + index).css("display", "none");                    
                }
            }

        });

        function Remove(str, startIndex) {
            return str.substr(0, startIndex);
        }

        function obtainmentSelSupplier(supplierSearchDialog) {
            var grid = $(xreferenceObject.controls.grids.SearchSupplierNewGrid).data("kendoGrid");
            if (grid.dataSource.total() === 0) {
                $(this).displayError(messages.errorMessages.NoRowSelected);
                return;
            }
            var data = grid.dataItem(grid.select());
            if (data == null) {
                $(this).displayError(messages.errorMessages.NoRowSelected);
                return;
            }
            $(xreferenceObject.controls.textBoxes.ProductIdTextBox).val(data.id + "," + data.Name);

            supplierSearchDialog.data("kendoWindow").close();
            $(actionModals.Obtainment).displayModal();
        }

        function SaveRequest(strUrl, dataArray, modalId) {
            if (selectedRequests.length > 0) {
                kendo.ui.progress(xreferenceDetailObj, true);
                $(this).ajaxJSONCall(strUrl, JSON.stringify(dataArray))
                    .success(function (successData) {
                        if (modalId != null)
                            $(modalId).hideModal();

                        if (successData.success === true) {
                            $(this).savedSuccessFully(messages.successMessages.Saved);
                        } else {
                            if (successData.message)
                                $(this).displayError(successData.message);
                            else
                                $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);
                        }
                    })
                    .error(function () {
                        $(this).displayError(messages.errorMessages.RequestsCouldNotBeSaved);
                    })
                    .done(function () {
                        kendo.ui.progress(xreferenceDetailObj, false);
                        var grid = $(xreferenceObject.controls.grids.GridRequests).data("kendoGrid");
                        grid.dataSource.read();
                    });
                //kendo.ui.progress(xreferenceDetailObj, false);
                //var grid = $(xreferenceObject.controls.grids.GridRequests).data("kendoGrid");
                //grid.dataSource.read();
            }
        }

        function AssignUnassignRequest(btnObj, gridObj, message, url, isAssigned, keyCombination) {
            xreferenceDetailObj.on("click", btnObj, function (e) {
                e.preventDefault();
                if (isAssigned)
                    batchDeleteObjects(gridObj, message, url, null, isAssigned);
                else
                    batchDeleteObjects(gridObj, message, url, null, isAssigned, null);
            });
            // Mousetrap.bind(keyCombination, function () { $("#" + btnObj).click(); });
        }


        xreferenceDetailObj.on('hide', actionModals.Resolve, function () {
            EnableSideMenuItems();
        });
        xreferenceDetailObj.on('hide', actionModals.Obtainment, function () {
            EnableSideMenuItems();
        });
        xreferenceDetailObj.on('hide', actionModals.Pending, function () {
            EnableSideMenuItems();
        });
        xreferenceDetailObj.on('hide', actionModals.CustomerAction, function () {
            EnableSideMenuItems();
        });
        xreferenceDetailObj.on('hide', actionModals.QCFail, function () {
            EnableSideMenuItems();
        });

        function DisableSideMenuItems() {
            $(xreferenceObject.controls.buttons.ResolveSideMenuButton).enableControl(false);
            xreferenceSearchObj.off("click", xreferenceObject.controls.buttons.ResolveSideMenuButton);
            //$("#" + xreferenceObject.controls.buttons.ObtainmentSideMenuButton).attr("disabled", "disabled");
            //xreferenceSearchObj.off("click", "#" + xreferenceObject.controls.buttons.ObtainmentSideMenuButton);
            //$(xreferenceObject.controls.buttons.NotFoundSideMenuButton).addClass("disabled-link");
            //$(xreferenceObject.controls.buttons.NotFoundSideMenuButton).enableControl(false);
            //xreferenceSearchObj.off("click", xreferenceObject.controls.buttons.NotFoundSideMenuButton);

            //$(xreferenceObject.controls.buttons.PendingSideMenuButton).enableControl(false);
            //xreferenceSearchObj.off("click", xreferenceObject.controls.buttons.PendingSideMenuButton);
            $(xreferenceObject.controls.buttons.CustomerActionSideMenuButton).enableControl(false);
            xreferenceSearchObj.off("click", xreferenceObject.controls.buttons.CustomerActionSideMenuButton);
            $(xreferenceObject.controls.buttons.RemoveRequestsButton).enableControl(false);
            xreferenceSearchObj.off("click", xreferenceObject.controls.buttons.RemoveRequestsButton);
            $(xreferenceObject.controls.buttons.QCFailSideMenuButton).enableControl(false);
            xreferenceSearchObj.off("click", xreferenceObject.controls.buttons.QCFailSideMenuButton);

            $(xreferenceObject.controls.buttons.OnHoldSideMenuButton).enableControl(false);
            //$(xreferenceObject.controls.buttons.OnHoldSideMenuButton).addClass("disabled-link");
            xreferenceSearchObj.off("click", xreferenceObject.controls.buttons.OnHoldSideMenuButton);

            $(xreferenceObject.controls.buttons.RemoveHoldSideMenuButton).enableControl(false);
            //$(xreferenceObject.controls.buttons.RemoveHoldSideMenuButton).addClass("disabled-link");
            xreferenceSearchObj.off("click", xreferenceObject.controls.buttons.RemoveHoldSideMenuButton);
        }

        function EnableSideMenuItems() {
            $(xreferenceObject.controls.buttons.ResolveSideMenuButton).enableControl(true);
            ShowDisplayModal(xreferenceObject.controls.buttons.ResolveSideMenuButton, actionModals.Resolve);

            $(xreferenceObject.controls.buttons.CustomerActionSideMenuButton).enableControl(true);
            //ShowDisplayModal(xreferenceObject.controls.buttons.CustomerActionSideMenuButton, actionModals.CustomerAction);

            $(xreferenceObject.controls.buttons.RemoveRequestsButton).enableControl(true);
            ShowDisplayModal(xreferenceObject.controls.buttons.RemoveRequestsButton, actionModals.RemoveWorkLoad);

            $(xreferenceObject.controls.buttons.OnHoldSideMenuButton).enableControl(true);
            //$(xreferenceObject.controls.buttons.OnHoldSideMenuButton).removeClass("disabled-link");
            ShowDisplayModal(xreferenceObject.controls.buttons.OnHoldSideMenuButton, actionModals.OnHold);
           
            $(xreferenceObject.controls.buttons.RemoveHoldSideMenuButton).enableControl(true);
            //$(xreferenceObject.controls.buttons.RemoveHoldSideMenuButton).removeClass("disabled-link");
            ShowDisplayModal(xreferenceObject.controls.buttons.RemoveHoldSideMenuButton, actionModals.RemoveOnHold);
        }

        function EnableSideMenuItem(btnObj) {
            $(btnObj).enableControl(true);
        }

        function DisableSideMenuItem(btnObj) {
            $(btnObj).enableControl(false);
            xreferenceSearchObj.off("click", btnObj);
        }

        function HotKeyDisplayModal(btnObj, mdlObj) {
            if (btnObj === xreferenceObject.controls.buttons.ResolveSideMenuButton)
                $("#hdnDialogOpen").val("resolveOpen");

            if (btnObj === xreferenceObject.controls.buttons.CustomerActionSideMenuButton) {
                //$(xreferenceObject.controls.labels.NotesLabel).css("display", "none");
                //$(xreferenceObject.controls.textBoxes.NotesTextBox).css("display", "none");
            }

            //Obsolete this feature based on the TRECOMPLI-1271
            //if (btnObj == xreferenceObject.controls.buttons.PendingSideMenuButton) {
            //    $(xreferenceObject.controls.labels.PendingNotesLabel).css("display", "none");
            //    $(xreferenceObject.controls.textBoxes.PendingNotesTextBox).css("display", "none");
            //}

            DisableSideMenuItems();
            EnableSideMenuItem(btnObj);
            $(mdlObj).displayModal();

        }

        function ShowDisplayModal(btnObj, mdlObj) {
            xreferenceSearchObj.on("click", btnObj, function (e) {
                e.preventDefault();

                if (btnObj == xreferenceObject.controls.buttons.ResolveSideMenuButton)
                    $("#hdnDialogOpen").val("resolveOpen");


                if (btnObj === xreferenceObject.controls.buttons.CustomerActionSideMenuButton) {
                    //$(xreferenceObject.controls.labels.NotesLabel).css("display", "none");
                    //$(xreferenceObject.controls.textBoxes.NotesTextBox).css("display", "none");
                    IdentifyRequests();
                }

                //Obsolete this feature based on the TRECOMPLI-1271
                //if (btnObj == xreferenceObject.controls.buttons.PendingSideMenuButton) {
                //    $(xreferenceObject.controls.labels.PendingNotesLabel).css("display", "none");
                //    $(xreferenceObject.controls.textBoxes.PendingNotesTextBox).css("display", "none");
                //}

                DisableSideMenuItems();
                EnableSideMenuItem(btnObj);
                $(mdlObj).displayModal();

            });
        }


        xreferenceSearchObj.on("change", xreferenceObject.controls.textBoxes.NumberOfItemsTextBox, function () {
            if (itemsChecked > 0) {
                EnableSideMenuItems();
                if (selectedRequests.length !== newRequestCount)
                    DisableSideMenuItem(xreferenceObject.controls.buttons.OnHoldSideMenuButton);
                if (selectedRequests.length !== onHoldCount)
                    DisableSideMenuItem(xreferenceObject.controls.buttons.RemoveHoldSideMenuButton);
            } else
                DisableSideMenuItems();


            ////If not supervisor, then disable exit
            //var item = selectedRows.length;


            //var grid = $(xreferenceObject.controls.grids.GridRequests).data("kendoGrid");
            //    //var dataItem = $("#Grid").data("kendoGrid").dataSource.get(itemID);
            //    //var row = $("#Grid").data("kendoGrid").tbody.find("tr[data-uid='" +dataItem.uid + "']");
            ////var row = grid.tbody.find("tr[data-uid='" + selectedRows[0]+ "']");

            //var row = grid.tbody.find("tr[data-uid='" + selectedRows[0]+ "']");

            //var dataitem = grid.dataItem(row);


        });

        function DoLookUpSupplierOnKeyEnter(cntrlid) {
            var url = '../Company/LookUpSupplierOnKeyEnter';
            var supplierInfo = $(cntrlid).val();
            $.post(url, { supplierInfo: supplierInfo }, function (data) {
                $(cntrlid).val(data);
            });
        }

        function initializeMultiSelectCheckboxes(obj) {

            obj.on(/*"mouseup MSPointerUp"*/ "click", ".chkMultiSelect", function (e) {

                selectedRequests = new Array();
                var checked = $(this).is(':checked');
                var grid = $(this).parents('.k-grid:first');
                if (grid) {
                    var kgrid = grid.data().kendoGrid;
                    var selectedRow = $(this).parent().parent();
                    var dataItem = kgrid.dataItem($(this).closest('tr'));
                    if (dataItem) {

                        dataItem.set('IsSelected', checked);
                        if (selectedRow.length > 0) {

                            //if ($(this).is(':checked')) {
                            if (!checked) {

                                $("#hdnSupplierName").val("").trigger('change');
                                $("#hdnProductName").val("").trigger('change');
                                $("#hdnProductPartNumber").val("").trigger('change');
                                $("#hdnPhysicalState").val("").trigger('change');
                                $("#hdnSupplier").val("").trigger('change');
                                $("#lblProductName").text("");
                                $("#lblSupplierName").text("");
                                $("#lblSupplierName").text("");
                                
                                var indexUid = selectedRows.indexOf(selectedRow.attr('data-uid'));
                                if (indexUid > -1)
                                    selectedRows.splice(indexUid, 1);

                            } else {

                                if (dataItem["ProductName"] !== $("#hdnProductName").val() || dataItem["SupplierID"] !== $("#hdnSupplier").val() ) {
                                    $("#hdnSupplierName").val(dataItem["SupplierName"]).trigger('change');
                                    $("#hdnProductName").val(dataItem["ProductName"]).trigger('change');
                                    $("#hdnProductPartNumber").val(dataItem["ProductPartNumber"]).trigger('change');
                                    $("#hdnPhysicalState").val(dataItem["PhysicalState"]).trigger('change');
                                    $("#hdnSupplier").val(dataItem["SupplierID"]).trigger('change');
                                    
                                }

                                selectedRows.push(selectedRow.attr('data-uid'));
                            }

                            if (typeof performXrefProductSearch != "undefined")
                                performXrefProductSearch(checked);

                        }
                    }

                    itemsChecked = 0;
                    newRequestCount = 0;
                    onHoldCount = 0;
                    $.each(kgrid._data, function () {
                        if (this['IsSelected']) {
                            selectedRequests.push(this["RequestWorkItemID"]);
                            itemsChecked++;
                            LogHoldStatus(this['Status']);
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
                onHoldCount = 0;
                itemsChecked = 0;

                if (grid) {
                    var kgrid = grid.data().kendoGrid;
                    if (kgrid._data.length > 0) {
                        $.each(kgrid._data, function () {
                            LogHoldStatus(this['Status']);
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
                    } else
                        return false;
                }

                // if 
                if (typeof performXrefProductSearch != "undefined")
                    performXrefProductSearch(false);

            });
        }

        function batchDeleteObjects(targetGrid, objName, url, data, isAssign, assignTo, completeCallback) {

            if (!targetGrid || !objName || !url)
                return false;

            var targetGridSelector = targetGrid;
            var grid = $(targetGridSelector).data("kendoGrid");
            if (grid && grid.dataSource._total > 0) {
                var selectedIds = new Array();
                $.each(grid.dataSource.data(), function () {
                    if (this.IsSelected === true)
                        selectedIds.push(this.id);
                });

                if (selectedIds.length === 0) {
                    $(this).displayError(messages.errorMessages.NoItemsSelected);
                    return false;
                }

                if (isAssign)
                    $(actionModals.Assign).displayModal();

                if (!data)
                    data = {};

                data['ids'] = selectedIds;
                data["searchCriteria"] = $("#SearchCriteria").val();
                data["isAssign"] = isAssign;

                if (typeof (assignTo) != "undefined") {
                    data["assignedTo"] = assignTo;
                    $(actionModals.Assign).hideModal();

                    var args = { message: 'Are you sure you would like to ' + objName + '?', header: 'Confirm Requests Selected' };
                    _DisplayConfirmationModal(args, function () {

                        $(this).ajaxJSONCall(url, JSON.stringify(data))
                            .success(function (successData) {
                                if (successData.success === true) {
                                    // Uncheck the master select checkbox if checked
                                    var checkbox = $(grid.element).find('.chkMasterMultiSelect');
                                    if (checkbox && checkbox.is(':checked'))
                                        checkbox.attr('checked', false);


                                    grid = $(targetGridSelector).data("kendoGrid");
                                    grid.dataSource.read();
                                } else
                                    $(this).displayError(messages.errorMessages.GeneralError);
                            })
                            .error(function () { $(this).displayError(messages.errorMessages.RequestsCouldNotBeAssigned); })
                            .complete(function (compData) {

                                kendo.ui.progress(xreferenceDetailObj, false);
                                $(this).savedSuccessFully(messages.successMessages.Saved);
                                if (completeCallback)
                                    completeCallback(compData);
                            });
                    });
                }

            }
            return false;
        };

        function UpdateNumberOfItemsChecked(numberOfItems) {
            if (numberOfItems === 0)
                $("#hdnSupplier").val("").trigger('change');

            $(xreferenceObject.controls.textBoxes.NumberOfItemsTextBox).text("(" + numberOfItems + ")").val(numberOfItems).trigger("change");
        }


        function LogHoldStatus(status) {
            if (status === 'New Request')
                newRequestCount++;

            if (status === 'On Hold')
                onHoldCount++;
        }

        var IdentifyRequests = function () {
            $(xreferenceObject.controls.textBoxes.txtCASupplierIDName).val("");
            if (selectedRequests.length == 1) {
                var dataItem = $(xreferenceObject.controls.grids.GridRequests).data("kendoGrid").dataSource.get(selectedRequests[0]);
                if (dataItem.SupplierID != 0) {
                    silbingSupplierId = dataItem.SupplierID;
                    $(xreferenceObject.controls.textBoxes.txtCASupplierIDName).val(silbingSupplierId);
                    DoLookUpSupplierOnKeyEnter($(xreferenceObject.controls.textBoxes.txtCASupplierIDName));
                }
            }
            else {
                silbingSupplierId = 0;
            }
        };

        var IdentifyCustomSupplier = function (supplierId) {
            silbingSupplierId = supplierId;
        };
        
        var OngdRequestDataBound = function (e) {
            resizeGridToWindow(e);
        };

        return {
            loadRequestsPlugin: loadRequestsPlugin,
            loadMyRequestsPlugin: loadMyRequestsPlugin,
            loadRequests: loadRequests,
            loadSupplierPlugIn: loadSupplierPlugIn,
            IsReadOnlyMode: IsReadOnlyMode,
            gdGroupsChange: gdGroupsChange,
            hotKeyDisplay: hotKeyDisplay,
            IdentifyRequests: IdentifyRequests,
            IdentifyCustomSupplier : IdentifyCustomSupplier,
            OngdRequestDataBound: OngdRequestDataBound
        };
    };
})(jQuery);

