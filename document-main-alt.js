; (function ($) {
    if ($.fn.compliDocumentAlt == null) {
        $.fn.compliDocumentAlt = {};
    }

    $.fn.compliDocumentAlt = function () {

        /******************************** Enclosure Variables ********************************/
        var documentAjaxSettings = {
            actions: {
                AddNewDocument: "AddNewDocument",
                CreateMultipleNameNumbers: "NamesNumbers_Multiple_Create",
                DeleteDocumentFile: "DeleteDocumentFile",
                GetStatusAction: "GetStatusAction",
                LoadUnknownManufacturer: "LoadUnknownManufacturer",
                LookUpSupplierOnKeyEnter: "LookUpSupplierOnKeyEnter",
                OpenWindowVariable: "OpenWindowVariable",
                RemoveDocumentContainerComponent: "RemoveDocumentContainerComponent",
                RemoveRevisionAttachment: "RemoveAttachmentAlt",
                SaveDocumentContainerComponent: "SaveDocumentContainerComponent",
                SaveDocumentRevisionAttachments: "SaveDocumentRevisionAttachments",
                UpdateDocumentInfoDescription: "UpdateDocumentInfoDescriptionAlt",
                ClearSessionVariablesDocument: "ClearSessionsVariables",
                GetSupplierName: "GetSupplierName",
                VerifyProductManufacturer : "VerifyProductManufacturer"
            },
            contenttype: {
                Json: "application/json; charset=utf-8"
            },
            controllers: {
                Company: "Company",
                Document: "Document",
                Home: "Home"
            },
            directory: {
                Operations: "Operations"
            }
        };

        var documentElements = {
            BlankListItem: "<li style='display:none'>",
            DocumentNoteRequiredNotes: "<li class='notes-required'>Document - Notes is required</li>",
            DocumentNoteRequiredNoteType: "<li class='note-type-required'>Document - Type is required</li>",
        };

        var documentElementClasses = {
            CancelIcon: 'k-i-cancel',
            DisabledButtonLink: 'disabled-link',
            RefreshIcon: 'k-i-refresh',
        };

        var documentElementSelectors = {
            buttons: {
                DocumentAddContainerComponents: "[id^=btnAddContainerComponent_]",
                DocumentDeleteContainerComponent: ".document-container-delete",
                DocumentDetailsCancel: "[id^=btnDocumentCancel_]",
                DocumentDetailsSave: "[id^=btnDocumentSave_]",
                DocumentNewDocumentCancel: "#btnNewDocumentCancel",
                DocumentNewDocumentSave: "#btnNewDocumentSave",
                DocumentRevisionAddMultipleNameNumbers: ".rev-multinamenum-add",
                DocumentRevisionAddNewRevision: "[id^=btnAddDocumentRevision_]",
                DocumentRevisionDetailsAddAttachment: "[id^=addNewFilesBtn_]",
                DocumentRevisionDetailsDeleteAttachment: ".revision-attachment-delete",
                DocumentRevisionDetailsCancel: "[id^=btnDocumentRevisionCancel_]",
                DocumentRevisionDetailsManufacturerSearch: "[id^=revisionMfgIdBtn_]",
                DocumentRevisionDetailsManufacturerView: "[id^=viewRevisionManufacturerIdBtn_]",
                DocumentRevisionDetailsSave: "[id^=btnDocumentRevisionSave_]",
                DocumentRevisionDetailsSetUnknownManufacturer: "[id^=btnSetUnknownMfg_]",
                DocumentRevisionDetailsSupplierSearch: "[id^=revisionSupplierIdBtn_]",
                DocumentRevisionDetailsSupplierView: "[id^=viewRevisionSupplierIdBtn_]",
                DocumentRevisionMultipleNameNumbersSave: "#btnSaveMultipleNames",
                DocumentSearchAddNew: "#addNewDocumentBtn",
                DocumentRevisionNewFile: "[id^=addNewFilesBtn_New]",
                DocumentSearchClear: "#clearDocumentBtn",
                DocumentSearchPopUpCancel: "#btnCancelDocumentSearch",
                DocumentSearchPopUpSelect: "#searchDocumentIdSelect",
                DocumentSearchSearch: "#searchDocumentBtn",
                DocumentSearchSearchSupplier: "#searchSupplierIdBtn",
                DocumentLinkToAllMfrProduct: "#btnAssociatedMfrAllProducts_"
            },
            checkboxes: {
                DocumentDetailsIsMsdsNotRequired: "[id^=IsMsdsNotRequired_]",
                DocumentDetailsIsObsolete: "[id^=IsObsolete_]",
                DocumentDetailsIsPublic: "[id^=IsPublic_]",
                DocumentRevisionDetailsBestImageAvailable: "[id^=BestImageAvailable_]",
                DocumentSearchIncludeDeleted: "[id^=chkIncludeDeletedDocument]",
                DocumentSearchLatestRevision: "[id^=chkLatestRevision]",
            },
            containers: {
                CreatedMessage: "#CreatedMessage",
                DocumentMain: "#DocumentMainContainer",
                DocumentSearch: "#divSearchSection",
                DocumentSearchPopUp: "#documentSearchWindow",
                DocumentDetailsForm: "[id^=frmDocument_]",
                DocumentDetailsFormExact: "#frmDocument_",
                DocumentDetailsTab: "[id^=tbDocumentDetail_]",
                DocumentNewRevisionDetails: "[id^=pnlNewRevision_]",
                DocumentNewRevisionDetailsExact: "#pnlNewRevision_",
                DocumentNotes: "#DocumentNotesText_",
                DocumentRevisionDetailsForm: "[id^=frmDocumentRevision_]",
                DocumentRevisionDetails: "[id^=pnlRevisionDetail_]",
                DocumentRevisionMultipleNameNumbers: "#mdlMultipleNames",
                DocumentStatusHistory: "#StatusNotesText_",
                NewDocument: "#pnlNewDocument",
                NewDocumentForm: "#frmNewDocument",
                NewDocumentPopUp: ".add-new-document-popup",
                NewRevision: "#pnlNewRevision",
                NewRevisionPopUp: ".add-new-revision-popup",
                SupplierSearchPopUp: "#supplierSearchWindow"
            },
            datepickers: {
                DocumentRevisionDetailsRevisionDate: "[id^=RevisionDate_]",
                DocumentRevisionDetailsVerifyDate: "[id^=VerifyDate_]"
            },
            dropdownlists: {
                DocumentContainerClassificationType: "#ClassificationType_",
                DocumentDetailsContainerTypeExact: "#ContainerTypeId_",
                DocumentDetailsContainerType: "[id^=ContainerTypeId_]",
                DocumentDetailsDocumentType: "[id^=DocumentTypeId_]",
                DocumentDetailsLanguage: "[id^=DocumentLanguageId_]",
                DocumentDetailsJurisdiction: "[id^=DocumentJurisdictionId_]",
                DocumentDetailsStatus: "[id^=DocumentStatusId_]",
                DocumentRevisionDetailsDocumentSource: "[id^=DocumentSourceId_]",
                DocumentRevisionMultipleNameNumbersType: "#selNameType",
                DocumentSearchContainerType: "[id^=ddlDocumentContainer]",
                DocumentSearchDocumentType: "[id^=ddlDocumentType]",
                DocumentSearchDropDownLists: "[data-role=dropdownlist]",
                DocumentSearchLanguage: "[id^=ddlDocumentLanguage]",
                DocumentSearchPhysicalState: "[id^=ddlDocumentPhysicalState]",
                DocumentSearchRegion: "[id^=ddlDocumentRegion]",
                DocumentSearchStatus: "[id^=ddlDocumentStatus]",
                DocumentSearchDateRange: "[id^=ddlDateRange]",
            },
            general: {
                DirtyFields: "input[data-is-dirty=true]",
                DocumentLastUpdatePopOver: "[id^=doc-I-Info-]",
                DocumentRevisionLastUpdatePopOver: "[id^=rev-I-Info-]",
                DocumentSearchOptions: "input[name=radiogroupTitleSearchOption]",
                DocumentDateSearchOptions: "input[name=radiogroupDateSearchOption]",
                DocumentPartNumSearchOptions: "input[name=radiogroupPartNumSearchOption]",
                DocumentUPCSearchOptions: "input[name=radiogroupUPCSearchOption]",
            },
            grids: {
                DocumentContainerComponents: "#gdContainerComponents_",
                DocumentNotes: "#gdDocumentNotes_",
                DocumentRevision: "[id^=gdDocumentRevisions_]",
                DocumentRevisionAttachments: "[id^=gdRevisionFileInfoDetail_]",
                DocumentFromInboundResponse: "#gdDocumentFromInboundResponse",
                DocumentRevisionNameNumbers: "#gdRevisionNameNumber_",
                DocumentSearch: "#gdSearchDocument",
                DocumentSearchPopUp: "#gdSearchDocumentPopUp",
                DocumentStatusHistory: "#gdSupplierStatusHistory_",
                DocumentProduct: "#gdDocumentProduct_",
                NonDocumentProduct: "#gdNonDocumentProduct_"
            },
            hidden: {
                DocumentDetailsStatusNotes: "[id^=hdnStatusNotes_]",
                DocumentRevisionNameNumberDocument: "#hdnMultipleNameDocument",
                DocumentRevisionNameNumberRevision: "#hdnMultipleNameRevision"
            },
            radiobuttons: {
                DocumentRevisionDetailsIsBadImage: "[id^=IsBadImage_]",
                DocumentRevisionDetailsIsGoodImage: "[id^=IsGoodImage_]",
            },
            textboxes: {
                DocumentDetailsDocumentId: "[id^=DocumentId_]",
                DocumentNotes: "#Notes",
                DocumentRevisionDetailsDocumentId: "[id^=RevisionDocumentId_]",
                DocumentRevisionDetailsDocumentIdentification: "[id^=DocumentIdentification_]",
                DocumentRevisionDetailsDocumentVersion: "[id^=DocumentVersion_]",
                DocumentRevisionDetailsRevisionId: "[id^=RevisionId_]",
                DocumentRevisionDetailsManufacturerId: "[id^=txtManufacturerId_]",
                DocumentRevisionDetailsRevisionTitle: "[id^=RevisionTitle_]",
                DocumentRevisionDetailsSupplierId: "[id^=txtSupplierId_]",
                DocumentRevisionMultipleNameNumbers: "#txtNamesNumbers",
                DocumentSearchDocumentId: "[id^=txtSearchDocumentId]",
                DocumentSearchPartNumber: "[id^=txtSearchPartNumber]",
                DocumentSearchRevisionTitle: "[id^=txtRevisionTitle]",
                DocumentSearchSupplierId: "[id^=txtSearchSupplierId]",
                DocumentSearchUPC: "[id^=txtSearchUPC]",
                DocumentSearchDateRangeFrom: "[id^=txtDateRangeFrom]",
                DocumentSearchDateRangeTo: "[id^=txtDateRangeTo]",
                DocumentShowAllResults: "[id^=ShowAllResults]",
            }
        };

        var controllerCalls = {
            RemoveProductDocumentsWithoutCheckDuplicate: GetEnvironmentLocation() + "/Configuration/ProductManager/RemoveProductDocumentsWithoutCheckDuplicate",
            AssociateDocumentToAllManufacturerProducts: GetEnvironmentLocation() + "/Configuration/ProductManager/AssociateDocumentAllItsManufacturerProducts",
            IsManufacturerProductionSelectionValid: GetEnvironmentLocation() + "/Operations/Document/IsManufacturerProductionSelectionValid"
        }

        var documentMessages = {
            errors: {
                AddNewDocumentPopup: "An error occured displaying the add new document screen. Please container you adminstrator.",
                AddNewRevisionPopup: "An error occured displaying the add new revision screen. Please container you adminstrator.",
                CompanyViewError: "An error occurred displaying the selected company. Please review you selection and try again.",
                ConfirmationDateFuture: "Invalid confirmation date, it can't be a future date.",
                ConfirmationDateGreaterThanRevisionDate: "Invalid confirmation date, it must be greater than or equal to revision date.",
                DocumentContainerComponentDelete: "An error occurred deleting the selected container component.",
                DocumentRevisionAttachment: "An error occurred uploading the revision attachment(s). Please try again.",
                DocumentRevisionAttachmentData: "An error occurred retrieving information to save the revision attachment. Please try again.",
                DocumentRevisionAttachmentDelete: "An error occurred deleting the selected revision attachment.",
                DocumentRevisionAttachmentDescriptionUpdate: "An error occurred updating the attachment description.",
                DocumentRevisionAttachmentPopUp: "An error occurred displaying the upload popup. Please contact your administrator.",
                DocumentRevisionKitAttachments: "A kit can only have on cover sheet, please move the existing on first.",
                DocumentRevisionMultipleNameNumbers: "An error occurred saving the revision's name number values.",
                DocumentRevisionMultipleNameNumbersRequiredInformation: "Alias Type and Aliases are required.",
                Error: "Error",
                RevisionDateFuture: "Invalid revision date, it can't be a future date.",
                SaveDocumentError: "Saving the document could not be completed. Please review your changes and try again.",
                SaveDocumentContainerComponent: "Saving the document container component could not be complete. Please try again.",
                SaveDocumentRevisionError: "Save the document revision could not be completed. Please review your changes and try again.",
                SaveNewDocumentAttachmentError: "New documents cannot be created without an attachment. Add an attachment and please try again.",
                SaveNewDocumentError: "Save the new document could not be completed. Please review you changes and try again.",
                SaveNewDocumentRevisionAttachmentError: "New revisions cannot be created without an attachment. Add an attachment and please try again."
            },
            modals: {
                GeneralConfirm: "Confirmation Required",
                DocumentDeleteContainerComponentHeader: "Delete Container Component Confirmation",
                DocumentDeleteContainerComponentMessage: "Are you sure you want to delete this container component?",
                DocumentDiscardChangesHeader: "Discard Document Changes",
                DocumentDiscardChangesMessage: "You are going to discard your document changes. Are you sure you would like to continue?",
                DocumentNewDocumentDiscardChangesHeader: "Discard New Document Changes",
                DocumentNewDocumentDiscardChangesMessage: "You are going to discard your document changes. Are you sure you would like to continue?",
                DocumentRevisionDeleteAttachmentHeader: "Delete Attachment Confirmation",
                DocumentRevisionDeleteAttachmentMessage: "Are you sure you want to delete this file?",
                DocumentRevisionDiscardChangesHeader: "Discard Revision Changes",
                DocumentRevisionDiscardChangesMessage: "You are going to discard your revision changes. Are you sure you would like to continue?",
                SaveRevisionWothoutAttachment: "Are you sure you want to save revision without attachment?"
            },
            success: {
                DocumentRevisionAttachmentsSaved: "Attachments Saved",
                DocumentRevisionMultipleNameNumbersSaved: "Items Saved Successful",
                DocumentRevisionSaved: "Revision Saved",
                DocumentSaved: "Document Saved",
            },
            warnings: {
                DocumentRevisionAttachments: "Reminder: No attachment has been provided for this document.",
                UnlinkDocumentFromProudct: "Are you sure you want to remove the above document from ths product?",
                LinkDocumentToAllMfrProudct: "Are you sure you want to link the above document to all product(s) from it's Manufacturer in the list below?",
                InvalidManufacturerSelection : "Invalid Manufacturer Selection. Proceed nevertheless ?"
            }
        };

        var keyCodeValues = {
            Enter: 13,
            V: 86
        };

        /******************************** Local Methods ********************************/
        function changeContainerButtonDirtyStatusLayout(container, saveSelector, cancelSelector, saveFunc, changeCancelBtn) {
            if (container != null && container.length > 0) {
                var saveBtn = container.find(saveSelector);
                var cancelBtn = container.find(cancelSelector);
                if (saveBtn.length > 0 && cancelBtn.length > 0) {
                    var containerDirty = isContainerFieldsDirty(container);
                    var cancelBtnAddClass = containerDirty == true ? documentElementClasses.CancelIcon : documentElementClasses.RefreshIcon;
                    var cancelBtnRemoveClass = containerDirty == true ? documentElementClasses.RefreshIcon : documentElementClasses.CancelIcon;
                    var cancelBtnText = containerDirty == true ? 'Cancel' : 'Reload';
                    var saveBtnAddClass = containerDirty == true ? null : documentElementClasses.DisabledButtonLink;
                    var saveBtnFunc = containerDirty == true ? saveFunc : onDisabledButtonClick;
                    var saveBtnRemoveClass = containerDirty == true ? documentElementClasses.DisabledButtonLink : null;

                    saveBtn.off('click');
                    saveBtn.on('click', saveBtnFunc);
                    saveBtn.removeClass(saveBtnRemoveClass);
                    saveBtn.addClass(saveBtnAddClass);

                    if (changeCancelBtn == true) {
                        var cancelBtnParts = $.parseHTML(cancelBtn.html());
                        $(cancelBtnParts[0]).removeClass(cancelBtnRemoveClass).addClass(cancelBtnAddClass);
                        cancelBtnParts[1] = cancelBtnText;
                        cancelBtn.html(cancelBtnParts[0].outerHTML + cancelBtnParts[1]);
                    }
                }
            }
        }

        function clearContainerDirtyFlags(container, setValueFunc, changeLayoutFunc) {
            if (container) {

                container.find('input[data-is-dirty=true]').each(function () {
                    var field = this;
                    if (setValueFunc) setValueFunc(field);

                    field.removeAttribute('data-is-dirty');
                });

                if (changeLayoutFunc) changeLayoutFunc(container);
            }
        }

        function displayConfirmationModal(settings, yesFunc, noFunc) {
            if (DisplayConfirmationModal)
                DisplayConfirmationModal(settings, yesFunc, noFunc);
            else {
                var confirmResult = confirm(settings.message);
                if (confirmResult == true && yesFunc)
                    yesFunc();
                else if (confirmResult == false && noFunc)
                    noFunc();
            }
        }

        function displayCreatedMessage(message) {
            $(documentElementSelectors.containers.CreatedMessage).fadeIn(500).delay(1000).fadeOut(400).html(message);
        }

        function displayError(message) {
            if (onDisplayError)
                onDisplayError(message);
            else
                alert(message);
        }

        function extractReferenceId(value) {
            if (value) {
                var parts = value.split('_');
                if (parts.length >= 2) {
                    var convertedValue = parseInt(parts[parts.length - 1]);
                    return isNaN(convertedValue) ? null : convertedValue;
                }
            }

            return null;
        }

        function generateActionUrl(controller, action) {
            if (controller && action)
                return "../" + controller + "/" + action;

            return null;
        }

        function isContainerFieldsDirty(container) {
            var isDirty = container ? container.find(documentElementSelectors.general.DirtyFields).length > 0 : false;
            return isDirty;
        }

        function onCompanyIdFieldKeyUp(e) {
            if (onKeyPressEnter) {
                onKeyPressEnter(e, function () {
                    var companyId = e.target.value;
                    if (IsNumeric && IsNumeric(companyId)) {

                        if (generateLocationUrl) {
                            var requestUrl = documentAjaxSettings.directory.Operations + "/" + documentAjaxSettings.controllers.Company + "/" + documentAjaxSettings.actions.LookUpSupplierOnKeyEnter;
                            requestUrl = generateLocationUrl(requestUrl);
                            $.post(requestUrl, { supplierInfo: companyId }, function (data) {
                                $(e.target).val(data);
                            });
                        }
                    }
                });
            }
        }

        function onDisabledButtonClick(e) {
            e.preventDefault();
        }

        function onInputFieldChange(e) {
            var element = $(e.currentTarget);
            var defaultValue = element.is(':checkbox, :radio') ? element[0].defaultChecked : element[0].defaultValue;

            var currentValue = null;
            if (element.is(':checkbox, :radio'))
                currentValue = element[0].checked;
            else if (element.data('kendoDropDownList')) {
                var ddl = element.data('kendoDropDownList');
                currentValue = ddl.value() && ddl.value().length > 0 ? ddl.value() : "0";
            } else
                currentValue = element.val();

            if (defaultValue != currentValue)
                element.attr('data-is-dirty', true);
            else
                element.removeAttr('data-is-dirty');
        }

        function parseErrorMessage(data) {

            var errorMessage = '';
            if (data && data.Errors) {

                var keys = Object.keys(data.Errors);
                for (var idx = 0; idx < keys.length; idx++) {
                    var errorobj = data.Errors[keys[idx]];
                    if (errorobj.errors && errorobj.errors.length > 0) {
                        errorMessage = errorobj.errors[0];
                        break;
                    }
                }
            }

            return errorMessage;
        }

        function revertContainerFieldValues(container, changeLayoutFunc) {
            clearContainerDirtyFlags(container, revertFieldValue, changeLayoutFunc);
        }

        function revertFieldValue(field) {
            if (field.getAttribute('type') == 'checkbox')
                field.checked = field.defaultChecked;
            else if (field.getAttribute('type') == 'radio') {
                $(field).parents('form').find('input[name="' + field.getAttribute('name') + '"]').each(function (index, data) {
                    data.checked = data.defaultChecked;
                });

            } else if (field.getAttribute('data-role') == 'dropdownlist') {
                var ddl = $(field).data('kendoDropDownList');
                if (ddl) {

                    var fieldDefault = field.defaultValue.length == 0 ? "0" : field.defaultValue;
                    ddl.select(function (dataItem) {
                        var dvalue = dataItem.Value.length == 0 ? "0" : dataItem.Value;
                        return dvalue == fieldDefault;
                    });

                    ddl.trigger("change");
                }
            } else
                field.value = field.defaultValue;
        }

        function setContainerFieldDefaultValues(container, changeLayoutFunc) {
            clearContainerDirtyFlags(container, setFieldDefaultValue, changeLayoutFunc);
        }

        function setFieldDefaultValue(field) {
            if (field.getAttribute('type') == 'checkbox' || field.getAttribute('type') == 'radio')
                field.defaultChecked = field.checked;
            else
                field.defaultValue = field.value;
        }

        /******************************** Search Methods ********************************/
        function clearDocumentSearchFields(container) {
            if (container && container.length > 0) {
                container.find(documentElementSelectors.dropdownlists.DocumentSearchDropDownLists).each(function () {
                    var ddl = $(this).data("kendoDropDownList");
                    if (ddl != undefined) {
                        ddl.select(0);
                    }
                });

                container.find(documentElementSelectors.checkboxes.DocumentSearchIncludeDeleted).prop('checked', false);
                container.find(documentElementSelectors.checkboxes.DocumentSearchLatestRevision).prop('checked', true);
                container.find(documentElementSelectors.textboxes.DocumentSearchDocumentId).val('');
                container.find(documentElementSelectors.textboxes.DocumentSearchPartNumber).val('');
                container.find(documentElementSelectors.textboxes.DocumentSearchRevisionTitle).val('');
                container.find(documentElementSelectors.textboxes.DocumentSearchSupplierId).val('');
                container.find(documentElementSelectors.textboxes.DocumentSearchUPC).val('');
                container.find(documentElementSelectors.textboxes.DocumentSearchDateRangeFrom).val('');
                container.find(documentElementSelectors.textboxes.DocumentSearchDateRangeTo).val('');


            }
        }

        function getContainerSearchCriteria(container) {

            if (container && container.length > 0) {
                var result =
                {
                    ContainerTypeId: container.find(documentElementSelectors.dropdownlists.DocumentSearchContainerType).val(),
                    DocumentLanguageId: container.find(documentElementSelectors.dropdownlists.DocumentSearchLanguage).val(),
                    DocumentRegionId: container.find(documentElementSelectors.dropdownlists.DocumentSearchRegion).val(),
                    DocumentStatusId: container.find(documentElementSelectors.dropdownlists.DocumentSearchStatus).val(),
                    DocumentTypeId: container.find(documentElementSelectors.dropdownlists.DocumentSearchDocumentType).val(),
                    IncludeDeletedDocument: container.find(documentElementSelectors.checkboxes.DocumentSearchIncludeDeleted).is(":checked"),
                    LatestRevisionOnly: container.find(documentElementSelectors.checkboxes.DocumentSearchLatestRevision).is(":checked"),
                    PartNumber: container.find(documentElementSelectors.textboxes.DocumentSearchPartNumber).val(),
                    PartNumberSearchOption:container.find(documentElementSelectors.general.DocumentPartNumSearchOptions + ":checked").val(), 
                    PhysicalStateId: container.find(documentElementSelectors.dropdownlists.DocumentSearchPhysicalState).val(),
                    ReferenceId: container.find(documentElementSelectors.textboxes.DocumentSearchDocumentId).val(),
                    RevisionTitle: container.find(documentElementSelectors.textboxes.DocumentSearchRevisionTitle).val(),
                    SearchOption: container.find(documentElementSelectors.general.DocumentSearchOptions + ":checked").val(),
                    SupplierId: extractCompanyIdFromTemplate ? extractCompanyIdFromTemplate(container.find(documentElementSelectors.textboxes.DocumentSearchSupplierId).val()) : null,
                    UPC: container.find(documentElementSelectors.textboxes.DocumentSearchUPC).val(),
                    UPCSearchOption: container.find(documentElementSelectors.general.DocumentUPCSearchOptions + ":checked").val(),
                    DateRangeFrom: container.find(documentElementSelectors.textboxes.DocumentSearchDateRangeFrom).val(),
                    DateRangeTo: container.find(documentElementSelectors.textboxes.DocumentSearchDateRangeTo).val(),
                    DateSearchOption: container.find(documentElementSelectors.general.DocumentDateSearchOptions + ":checked").val(),
                    ShowAllResults: container.find(documentElementSelectors.textboxes.DocumentShowAllResults).val(),
                };

                var dateRange = container.find(documentElementSelectors.dropdownlists.DocumentSearchDateRange).val();
                if (dateRange != "Custom") {
                    result.DateRangeFrom = "";
                    result.DateRangeTo = dateRange;
                }

                // reset to false immediately
                container.find(documentElementSelectors.textboxes.DocumentShowAllResults).val("false");
                return result;
            }

            return null;
            }

        function performDocumentSearch() {
            
            var searchGrid = $(documentElementSelectors.grids.DocumentSearch).data('kendoGrid');
            searchGrid.dataSource.data([]);
            searchGrid.dataSource.page(1);
        }

        function onDocumentSearchAddNewBtnClick(e) {
            e.preventDefault();

            var container = $(documentElementSelectors.containers.NewDocument);
            if (container.length > 0) container.show(500);
        }

        function onDocumentSearchClearBtnClick(e) {
            e.preventDefault();

            var container = $(documentElementSelectors.containers.DocumentSearch);
            clearDocumentSearchFields(container);

            var searchGrid = $(documentElementSelectors.grids.DocumentSearch).data('kendoGrid');
            if (searchGrid && searchGrid.dataSource) {
                searchGrid.dataSource.data([]);
            }
        }

        function onDocumentSearchFieldKeyUp(e) {
            if (onKeyPressEnter)
                onKeyPressEnter(e, performDocumentSearch);
        }

        function onDocumentSearchSearchBtnClick(e) {
            e.preventDefault();
            
            performDocumentSearch();
        }

        function onDocumentSearchSearchSupplierBtnClick(e) {
            e.preventDefault();

            var buttonElement = $(e.currentTarget);
            if (displaySupplierPopUp) {
                displaySupplierPopUp(function (data) {

                    var siblingSelector = getCompanyTextFieldSibling(buttonElement);
                    if (siblingSelector) {
                        var companyInfo = getCompanyTemplate ? getCompanyTemplate(data.CompanyId, data.Name) : data.CompanyId + ', ' + data.Name;
                        buttonElement.siblings(siblingSelector + ":first").val(companyInfo).trigger('change');
                    }
                });
            }
        }

        var getDocumentSearchCriteria = function () {
            var container = $(documentElementSelectors.containers.DocumentSearch);
            return getContainerSearchCriteria(container);
            };

        var onDocumentMainPanelActivate = function () {
            this.element.on('click', documentElementSelectors.buttons.DocumentSearchAddNew, onDocumentSearchAddNewBtnClick);
            this.element.on('click', documentElementSelectors.buttons.DocumentSearchClear, onDocumentSearchClearBtnClick);
            this.element.on('click', documentElementSelectors.buttons.DocumentSearchSearch, onDocumentSearchSearchBtnClick);

            this.element.on('keyup', documentElementSelectors.textboxes.DocumentSearchDocumentId, onDocumentSearchFieldKeyUp);
            this.element.on('keyup', documentElementSelectors.textboxes.DocumentSearchPartNumber, onDocumentSearchFieldKeyUp);
            this.element.on('keyup', documentElementSelectors.textboxes.DocumentSearchRevisionTitle, onDocumentSearchFieldKeyUp);
            this.element.on('keyup', documentElementSelectors.textboxes.DocumentSearchSupplierId, onCompanyIdFieldKeyUp);
            this.element.on('keyup', documentElementSelectors.textboxes.DocumentSearchUPC, onDocumentSearchFieldKeyUp);

            $(documentElementSelectors.grids.DocumentSearch).show(500);
        };

        var onDocumentMainPanelActivateReadOnly = function () {
            // TODO: Add code to modify the UI to be read only
            $(documentElementSelectors.grids.DocumentSearch).show(500);
        };

        var onDisplayNewDocumentPopUp = function(pKey) {
            displayAddNewDocumentPopUp(pKey);
        }

        /******************************** Search Methods (Pop-Up) ********************************/
        function displayAddNewDocumentPopUp(pKey) {

            if (generateLocationUrl) {
                var url = documentAjaxSettings.controllers.Home + '/' + documentAjaxSettings.actions.OpenWindowVariable;
                var locationUrl = generateLocationUrl(url);
                var data = { key: 'newDocOpened', value: true };

                $(this).ajaxCall(locationUrl, data)
                    .success(function () {
                        var requestWindowHeight = 1024;
                        var requestWindowWidth = 1280;
                        var requestUrl = documentAjaxSettings.directory.Operations + "/" + documentAjaxSettings.controllers.Document + "/" + documentAjaxSettings.actions.AddNewDocument;
                        if ($(this).getQueryStringParameterByName("docGuid")) {
                            if ($(this).getQueryStringParameterByName("inboundResponseid")) {
                                requestUrl = generateLocationUrl(requestUrl + "/?nnumber=" + $(this).getQueryStringParameterByName("nnumber") + "&docGuid=" + $(this).getQueryStringParameterByName("docGuid") + "&sid=" + $(this).getQueryStringParameterByName("sid")) + "&inboundResponseid=" + $(this).getQueryStringParameterByName("inboundResponseid") +"&productid="+pKey;
                            } else {
                                requestUrl = generateLocationUrl(requestUrl + "/?nnumber=" + $(this).getQueryStringParameterByName("nnumber") + "&docGuid=" + $(this).getQueryStringParameterByName("docGuid") + "&sid=" + $(this).getQueryStringParameterByName("sid"));
                            }
                        }
                        else
                            requestUrl = generateLocationUrl(requestUrl);

                        var requestWindow = window.open(requestUrl, "_newDocumentPopUp", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + requestWindowWidth + ', height=' + requestWindowHeight);
                        requestWindow.onload = function () {
                            var doc = this.document;
                            $(doc.body).find("#mainMenu").hide();
                        }

                        window.onbeforeunload = function (evt) {
                            if (typeof evt == "undefined") evt = window.event;
                            if (evt) requestWindow.close();
                        }

                    })
                    .error(function () {displayError(documentMessages.errors.AddNewDocumentPopUp);});

            } else
                displayError(documentMessages.errors.AddNewDocumentPopUp);
        }

        function performDocumentSearchPopUp() {
            var container = $(documentElementSelectors.containers.DocumentSearchPopUp);
            var grid = container.find(documentElementSelectors.grids.DocumentSearchPopUp).data('kendoGrid');
            if (grid && grid.dataSource) {
                
                if (grid.dataSource.view().length > 0) { 
                    grid.dataSource.page(1);
                }
                grid.dataSource.read();
            }
        }

        function onDocumentSearchPopUpAddNewDocumentBtnClick() {
            displayAddNewDocumentPopUp();
        }

        function onDocumentSearchPopUpClearBtnClick(e) {
            e.preventDefault();

            var container = $(documentElementSelectors.containers.DocumentSearchPopUp);
            clearDocumentSearchFields(container);

            var grid = container.find(documentElementSelectors.grids.DocumentSearchPopUp).data('kendoGrid');
            if (grid && grid.dataSource) {
                grid.dataSource.data([]);
            }
        }

        function onDocumentSearchPopUpFieldKeyUp(e) {
            if (onKeyPressEnter)
                onKeyPressEnter(e, performDocumentSearchPopUp);
        }

        function onDocumentSearchPopUpSearchBtnClick(e) {
            e.preventDefault();
            performDocumentSearchPopUp();
        }

        function onDocumentSearchPopUpSupplierSearchBtnClick(e) {
            e.preventDefault();

            var buttonElement = $(e.currentTarget);
            if (displaySupplierPopUp) {
                displaySupplierPopUp(function (data) {

                    var siblingSelector = getCompanyTextFieldSibling(buttonElement);
                    if (siblingSelector) {
                        var companyInfo = getCompanyTemplate ? getCompanyTemplate(data.CompanyId, data.Name) : data.CompanyId + ', ' + data.Name;
                        buttonElement.siblings(siblingSelector + ":first").val(companyInfo).trigger('change');
                    }
                });
            }
        }

        var getDocumentSearchPopUpCriteria = function() {
            var container = $(documentElementSelectors.containers.DocumentSearchPopUp);
            return getContainerSearchCriteria(container);
        };

        var initializeDocumentSearchPopup = function () {
            var documentSearchPopUp = $(documentElementSelectors.containers.DocumentSearchPopUp);
            if (documentSearchPopUp.length == 0) return;

            // Populate plugin section
            documentSearchPopUp.on('click', documentElementSelectors.buttons.DocumentSearchAddNew, onDocumentSearchPopUpAddNewDocumentBtnClick);
            documentSearchPopUp.on('click', documentElementSelectors.buttons.DocumentSearchClear, onDocumentSearchPopUpClearBtnClick);
            documentSearchPopUp.on('click', documentElementSelectors.buttons.DocumentSearchSearch, onDocumentSearchPopUpSearchBtnClick);
            documentSearchPopUp.on('click', documentElementSelectors.buttons.DocumentSearchSearchSupplier, onDocumentSearchPopUpSupplierSearchBtnClick);

            documentSearchPopUp.on('keyup', documentElementSelectors.textboxes.DocumentSearchDocumentId, onDocumentSearchPopUpFieldKeyUp);
            documentSearchPopUp.on('keyup', documentElementSelectors.textboxes.DocumentSearchPartNumber, onDocumentSearchPopUpFieldKeyUp);
            documentSearchPopUp.on('keyup', documentElementSelectors.textboxes.DocumentSearchRevisionTitle, onDocumentSearchPopUpFieldKeyUp);
            documentSearchPopUp.on('keyup', documentElementSelectors.textboxes.DocumentSearchSupplierId, onCompanyIdFieldKeyUp);
            documentSearchPopUp.on('keyup', documentElementSelectors.textboxes.DocumentSearchUPC, onDocumentSearchPopUpFieldKeyUp);
        };

        var initializeProductAssociation = function (did) {
            $(documentElementSelectors.buttons.DocumentLinkToAllMfrProduct + did).click(function (e) {
                e.preventDefault();
                DisplayConfirmationModal({ message: documentMessages.warnings.LinkDocumentToAllMfrProudct, header: 'Confirm to link document to all products' }, function () {
                    kendo.ui.progress($(documentElementSelectors.grids.NonDocumentProduct + did), true);
                    $.post(controllerCalls.AssociateDocumentToAllManufacturerProducts, { documentId: did }, function (data) {

                        if (!data.Success) {
                            $(this).displayError(data.Message);
                            return;
                        }

                        var gProudct = $(documentElementSelectors.grids.DocumentProduct + did).data("kendoGrid");

                        if (gProudct.dataSource.view().length > 0) {
                            gProudct.dataSource.page(1);
                        }
                        gProudct.dataSource.read();

                        var gNonProduct = $(documentElementSelectors.grids.NonDocumentProduct + did).data("kendoGrid");

                        if (gNonProduct.dataSource.view().length > 0) {
                            gNonProduct.dataSource.page(1);
                        }
                        gNonProduct.dataSource.read();

                        kendo.ui.progress($(documentElementSelectors.grids.NonDocumentProduct + did), false);
                    });
                });
            });
        };

        /******************************** New Document Methods ********************************/
        function cancelNewDocumentForm(callbackFunc, clearFields, clearAttachments) {

            var container = $(documentElementSelectors.containers.NewDocument);
            if (isContainerFieldsDirty(container) == true) {

                var settings = {
                    message: documentMessages.modals.DocumentNewDocumentDiscardChangesMessage,
                    header: documentMessages.modals.DocumentNewDocumentDiscardChangesHeader,
                };

                displayConfirmationModal(settings, function () {

                    if(clearFields == true)
                        revertContainerFieldValues(container, checkNewDocumentDirtyStatus);

                    var formData = {
                        files: getDocumentRevisionAttachments(container),
                        documentId: 0,
                        revisionId: 0
                    };

                    $.ajax({
                        type: 'POST',
                        url: generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.RemoveRevisionAttachment),
                        data: formData,
                        beforeSend: function () {
                            if(clearAttachments == true)
                                clearDocumentRevisionAttachments(container);
                        }
                    });

                    if (callbackFunc) callbackFunc();
                });

            } else {
                if (callbackFunc) callbackFunc();
            }
        }

        function checkNewDocumentDirtyStatus() {
            var container = $(documentElementSelectors.containers.NewDocument);
            var addNewDocumentPopUp = $(documentElementSelectors.containers.NewDocument).parents(documentElementSelectors.containers.NewDocumentPopUp);
            var saveBtnFunc = (addNewDocumentPopUp.length > 0) ? onNewDocumentPopUpSaveBtnClick : onNewDocumentSaveBtnClick;
            changeContainerButtonDirtyStatusLayout(container, documentElementSelectors.buttons.DocumentNewDocumentSave, documentElementSelectors.buttons.DocumentNewDocumentCancel, saveBtnFunc);
        }

        function getNewDocumentData() {
            var container = $(documentElementSelectors.containers.NewDocument);
            if (container.length > 0) {
                var result = {
                    BestImageAvailable: container.find(documentElementSelectors.checkboxes.DocumentRevisionDetailsBestImageAvailable).is(":checked"),
                    ContainerTypeId: container.find(documentElementSelectors.dropdownlists.DocumentDetailsContainerType).val(),
                    JurisdictionId: container.find(documentElementSelectors.dropdownlists.DocumentDetailsJurisdiction).val(),
                    DocumentIdentification: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentIdentification).val(),
                    DocumentSourceId: container.find(documentElementSelectors.dropdownlists.DocumentRevisionDetailsDocumentSource).val(),
                    DocumentTypeId: container.find(documentElementSelectors.dropdownlists.DocumentDetailsDocumentType).val(),
                    DocumentVersion: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentVersion).val(),
                    IsBadImage: container.find(documentElementSelectors.radiobuttons.DocumentRevisionDetailsIsBadImage).is(":checked"),
                    IsGoodImage: container.find(documentElementSelectors.radiobuttons.DocumentRevisionDetailsIsGoodImage).is(":checked"),
                    IsMsdsNotRequired: container.find(documentElementSelectors.checkboxes.DocumentDetailsIsMsdsNotRequired).is(":checked"),
                    IsObsolete: container.find(documentElementSelectors.checkboxes.DocumentDetailsIsObsolete).is(":checked"),
                    IsPublic: container.find(documentElementSelectors.checkboxes.DocumentDetailsIsPublic).is(":checked"),
                    LanguageId: container.find(documentElementSelectors.dropdownlists.DocumentDetailsLanguage).val(),
                    ManufacturerId: null,
                    RevisionDate: container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsRevisionDate).val(),
                    RevisionId: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionId).val(),
                    RevisionTitle: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionTitle).val(),
                    SupplierId: null,
                    VerifyDate: container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsVerifyDate).val(),
                };

                if (extractCompanyIdFromTemplate) {
                    result.ManufacturerId = extractCompanyIdFromTemplate(container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsManufacturerId).val());
                    result.SupplierId = extractCompanyIdFromTemplate(container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsSupplierId).val());
                }

                return result;
            }

            return null;
        }

        function closeNewDocument() {
            var container = $(documentElementSelectors.containers.NewDocument);
            if (container.length > 0) container.hide(500);
        }

        function closeNewDocumentPopUp() {
            this.window.close();
        }

        function saveNewDocumentRevisionToDatabase(callbackFunc, clearFields, clearAttachments) {
            var formData = null;
            var url = "";
            var form = $(documentElementSelectors.containers.NewDocumentForm);
            if ($(this).getQueryStringParameterByName("docGuid") == "") {
                formData = {
                    model: getNewDocumentData(),
                    attachments: getDocumentRevisionAttachments(form)
                };
            } else {
                formData = {
                    model: getNewDocumentData(),
                    docGuidId: $(this).getQueryStringParameterByName("docGuid")
                };
            }

            if (formData.model) {
                if (formData.attachments != null) {
                    if (formData.attachments.length == 0 && $(this).getQueryStringParameterByName("docGuid") == "") {
                        if (formData.model.ContainerTypeId != 2) {
                            displayError(documentMessages.errors.SaveNewDocumentAttachmentError);
                            return false;
                        }
                    }
                }

                url = form.attr('action');

                $(this).ajaxCall(url, formData)
                    .success(function(data) {
                        var errorMessage = parseErrorMessage(data);
                        if (!errorMessage) {

                            if (clearFields == true)
                                revertContainerFieldValues(form, checkNewDocumentDirtyStatus);

                            if (clearAttachments == true)
                                clearDocumentRevisionAttachments(form);

                            if (callbackFunc) callbackFunc(data.DocumentId);

                        } else
                            displayError(errorMessage);
                    })
                    .error(function() {displayError(documentMessages.errors.SaveNewDocumentError);});
            }else
                displayError(documentMessages.errors.SaveNewDocumentError);
        }

        function saveNewDocument(documentId) {
            displayCreatedMessage(documentMessages.success.DocumentSaved);

            var container = $(documentElementSelectors.containers.DocumentSearch);
            if (container.length > 0) {
                clearDocumentSearchFields(container);
                container.find(documentElementSelectors.textboxes.DocumentSearchDocumentId).val(documentId);

                var grid = $(documentElementSelectors.containers.DocumentMain).find(documentElementSelectors.grids.DocumentSearch).data('kendoGrid');
                if (grid) {
                    grid.bind("dataBound", function addNewDocumentDataBound() {
                        var documentRow = grid.wrapper.find('tr.k-master-row:first');
                        grid.select(documentRow);
                        grid.expandRow(documentRow);
                        grid.unbind("dataBound", addNewDocumentDataBound);
                    });

                    grid.dataSource.read();
                }
            }

            closeNewDocument();
        }

        function saveNewDocumentPopUp(documentId) {
            if ($(this).getQueryStringParameterByName("docGuid") == "") {
                if (window.opener) {

                    var parentSearchWindow = $(window.opener.document).find(documentElementSelectors.containers.DocumentSearchPopUp);
                    if (parentSearchWindow.length > 0) {
                        parentSearchWindow.find(documentElementSelectors.buttons.DocumentSearchClear).trigger('click');
                        parentSearchWindow.find(documentElementSelectors.textboxes.DocumentSearchDocumentId).val(documentId);
                        parentSearchWindow.find(documentElementSelectors.buttons.DocumentSearchSearch).click();
                    }
                }
            } else parent.window.opener.location.reload();

            closeNewDocumentPopUp();
        }

        function onNewDocumentAddAttachmentBtnClick(e) {
            e.preventDefault();

            if ($(e.currentTarget).hasClass('k-state-disabled')) {
                return false;
            }

            if (displayUploadModal) {
                var documentId = 0;
                var revisionId = 0;

                displayUploadModal(function () {
                    return { documentId: documentId, revisionId: revisionId };
                }, function (data) {
                    var container = $(documentElementSelectors.containers.NewDocument);
                    var attachmentGrid = (container.length > 0) ? container.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid') : null;
                    if (attachmentGrid) {
                        for (var i = 0; i < data.length; i++) {
                            attachmentGrid.dataSource.add({
                                DocumentInfoId: 0,
                                DocumentId: documentId,
                                RevisionId: revisionId,
                                DocumentInfoDescription: '',
                                DocumentElink: data[i].elink,
                                OriginalFileName: data[i].filename,
                                FileName: data[i].filename,
                                PhysicalPath: data[i].physicalPath
                            });
                        }
                    }

                }, false);

            } else
                displayError(documentMessages.errors.DocumentRevisionAttachmentPopUp);
        }

        function onNewDocumentCancelBtnClick(e) {

            e.preventDefault();
            cancelNewDocumentForm(closeNewDocument, true, true);
        }

        function onNewDocumentFieldChange(e) {
            onInputFieldChange(e);
            checkNewDocumentDirtyStatus();
        }

        function onNewDocumentPopUpCancelBtnClick(e) {
            e.preventDefault();
            cancelNewDocumentForm(closeNewDocumentPopUp);
        }

        function onNewDocumentPopUpSaveBtnClick(e) {

            e.preventDefault();
            if ($(this).getQueryStringParameterByName("productid") != "") {
                var formData = getNewDocumentData();
                var data = new Object();
                data.manufacturerId = formData.ManufacturerId;
                data.productId = $(this).getQueryStringParameterByName("productid");
                $(this).syncAjaxCall(controllerCalls.IsManufacturerProductionSelectionValid, data)
                    .success(function(response) {
                        var valid = true;
                        if (!response.IsValid) valid = confirm("The selected manufacturer does not correspond to the product. Continue ?");
                        if (valid) saveNewDocumentRevisionToDatabase(saveNewDocumentPopUp);
                    })
                    .error(function() {});
            } else
                saveNewDocumentRevisionToDatabase(saveNewDocumentPopUp);

        }

        function isManufacturerSelectionValid() {

            var formData = getNewDocumentData();

            var data = new Object();
            data.manufacturerId = formData.ManufacturerId;
            data.productId = $(this).getQueryStringParameterByName("productid");
            $(this).syncAjaxCall(controllerCalls.IsManufacturerProductionSelectionValid, data)
                .success(function (response) {
                    console.log(response);

                    if (!response.IsValid) return confirm("The selected manufacturer does not correspond to the product. Continue ?");
                    saveNewDocumentRevisionToDatabase(saveNewDocumentPopUp);
                    if (response.IsValid) return true;
                    if (!response.IsValid) return confirm("The selected manufacturer does not correspond to the product. Continue ?");

                })
                .error(function() {});
        }

        function onNewDocumentSaveBtnClick(e) {

            e.preventDefault();
            saveNewDocumentRevisionToDatabase(saveNewDocument, true, true);
        }

        var onNewDocumentPanelActivate = function () {

            $(documentElementSelectors.buttons.DocumentNewDocumentSave).on("click", onDisabledButtonClick);

            $(documentElementSelectors.containers.NewDocument).on('change', 'input', onNewDocumentFieldChange);
            $(documentElementSelectors.containers.NewDocument).on('click', documentElementSelectors.buttons.DocumentRevisionDetailsAddAttachment, onNewDocumentAddAttachmentBtnClick);
            $(documentElementSelectors.containers.NewDocument).on('click', documentElementSelectors.buttons.DocumentRevisionDetailsDeleteAttachment, onDocumentNewRevisionDetailsDeleteAttachmentBtnClick);

            // If we are within the popup window display the panel
            var addNewDocumentPopUp = $(documentElementSelectors.containers.NewDocument).parents(documentElementSelectors.containers.NewDocumentPopUp);
            if (addNewDocumentPopUp.length > 0) {
                $(documentElementSelectors.containers.NewDocument).show(500);
                $(documentElementSelectors.buttons.DocumentNewDocumentCancel).on("click", onNewDocumentPopUpCancelBtnClick);
            } else {
                $(documentElementSelectors.buttons.DocumentNewDocumentCancel).on("click", onNewDocumentCancelBtnClick);
            }
        };

        function getTodayDate() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!

            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            return mm + '/' + dd + '/' + yyyy;

        }

        var onNewRevisionPanelActivate = function (e) {

            var documentId = location.search.substring(1).split('&')[1].split('=')[1];
            var supplierId = location.search.substring(1).split('&')[2].split('=')[1];

            $(this).ajaxCall(generateActionUrl("../../" + documentAjaxSettings.controllers.Company, documentAjaxSettings.actions.GetSupplierName), {supplierId: supplierId})
            .success(function (result) {
                if (result.message == "Error" || result.success == false) {
                    $("[id*=txtSupplierId_" + documentId + "]").val(supplierId);
                    $("[id*=txtManufacturerId_" + documentId + "]").val(supplierId);
                } else {
                    $("[id*=txtSupplierId_" + documentId + "]").val(supplierId + ', ' + result);
                    $("[id*=txtManufacturerId_" + documentId + "]").val(supplierId + ', ' + result);
               }
           })
           .error(function () {
               $("[id*=txtSupplierId_" + documentId + "]").val(supplierId);
               $("[id*=txtManufacturerId_" + documentId + "]").val(supplierId);
           });


            $("[id*=btnDocumentRevisionSave_" + documentId + "]").removeClass('disabled-link');
            $("[id*=btnDocumentRevisionSave_" + documentId + "]").on("click", onDocRevSaveForInboundResponseBtnClick);
            $("[id*=btnDocumentRevisionCancel_" + documentId + "]").on("click", onDocNewRevDetailsCancelForInboundResponseBtnClick);
            $("[id*=btnSetUnknownMfg_" + documentId + "]").hide();
            $("[id*=revisionMfgIdBtn_" + documentId + "]").hide();
            $("[id*=revisionSupplierIdBtn_" + documentId + "]").hide();
            $("[id*=viewRevisionManufacturerIdBtn_" + documentId + "]").on("conlick", onDocumentRevisionCompanyViewBtnClick);
            $("[id*=viewRevisionSupplierIdBtn_" + documentId + "]").on("click", onDocumentRevisionCompanyViewBtnClick);
            $("[id*=txtSupplierId_" + documentId + "]").val(supplierId);
            $("[id*=txtManufacturerId_" + documentId + "]").val(supplierId);
            $("[id*=RevisionDate_" + documentId + "]").val(getTodayDate());
            $("[id*=VerifyDate_" + documentId + "]").val(getTodayDate());

            // If we are within the popup window display the panel
            var addNewRevisionPopUp = $(documentElementSelectors.containers.NewRevision).parents(documentElementSelectors.containers.NewRevisionPopUp);
            if (addNewRevisionPopUp.length > 0) {
                $(documentElementSelectors.containers.NewRevision).show(500);
            }
        };


        /******************************** Document Methods ********************************/
        function checkDocumentDetailsDirtyStatus(container) {
            changeContainerButtonDirtyStatusLayout(container, documentElementSelectors.buttons.DocumentDetailsSave, documentElementSelectors.buttons.DocumentDetailsCancel, onDocumentDetailsSaveBtnClick, true);
        }

        function checkDocumentStatus(form, documentId) {

            if (!form && documentId) {
                form = $(documentElementSelectors.containers.DocumentDetailsFormExact + documentId);
            }

            var formData = getDocumentDetailsData(form, documentId);
            if (formData) {

                // First check if a status change needs to display a notes popup
                var url = generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.GetStatusAction);
                $.post(url, formData, function (data) {

                    if (data.displayMessage) {

                        if (data.statusError == true)
                            displayError(data.displayMessage);
                        else {

                            if (displayStatusNoteConfirmation) {
                                displayStatusNoteConfirmation(data, function (eval) {
                                    formData.StatusNotes = eval.modalNotes;
                                    saveDocumentDetails(form, formData);
                                });
                            }
                        }
                    } else
                        saveDocumentDetails(form, formData);
                });
            }
        }

        function getDocumentDetailsData(form, documentId) {
            if (!form && documentId) {
                form = $(documentElementSelectors.containers.DocumentDetailsFormExact + documentId);
            }

            if (form && form.length > 0) {
                var result = {
                    ContainerTypeId: form.find(documentElementSelectors.dropdownlists.DocumentDetailsContainerType).val(),
                    DocumentId: form.find(documentElementSelectors.textboxes.DocumentDetailsDocumentId).val(),
                    DocumentLanguageId: form.find(documentElementSelectors.dropdownlists.DocumentDetailsLanguage).val(),
                    DocumentJurisdictionId: form.find(documentElementSelectors.dropdownlists.DocumentDetailsJurisdiction).val(),
                    DocumentStatusId: form.find(documentElementSelectors.dropdownlists.DocumentDetailsStatus).val(),
                    DocumentTypeId: form.find(documentElementSelectors.dropdownlists.DocumentDetailsDocumentType).val(),
                    IsMsdsNotRequired: form.find(documentElementSelectors.checkboxes.DocumentDetailsIsMsdsNotRequired).is(":checked"),
                    IsObsolete: form.find(documentElementSelectors.checkboxes.DocumentDetailsIsObsolete).is(":checked"),
                    IsPublic: form.find(documentElementSelectors.checkboxes.DocumentDetailsIsPublic).is(":checked"),
                    StatusNotes: form.find(documentElementSelectors.hidden.DocumentDetailsStatusNotes).val(),
                };

                return result;
            }

            return null;
        }

        function saveDocumentDetails(form, formData) {

            if (form && formData) {
                var url = form.attr('action');
                $.post(url, formData, function (data) {

                    // Attempt to get error message
                    var errorMessage = parseErrorMessage(data);
                    if (!errorMessage) {
                        displayCreatedMessage(documentMessages.success.DocumentSaved);

                        var lastUpdatePopOver = form.find(documentElementSelectors.general.DocumentLastUpdatePopOver);
                        if (lastUpdatePopOver.length > 0)
                            lastUpdatePopOver.data('popover').options.content = data.LastUpdatedDescription;

                        // Check if the status history table needs to be repopulated
                        var documentStatusDdl = form.find(documentElementSelectors.dropdownlists.DocumentDetailsStatus);
                        if (documentStatusDdl.length > 0 && documentStatusDdl[0].defaultValue != documentStatusDdl.val()) {
                            var statusGrid = $(documentElementSelectors.grids.DocumentStatusHistory + formData.DocumentId).data('kendoGrid');
                            if (statusGrid) {
                                statusGrid.dataSource.read();
                                displayDocumentStatusNote(formData.DocumentId, '');
                            }
                        }

                        form.find(documentElementSelectors.hidden.DocumentDetailsStatusNotes).val('');
                        setContainerFieldDefaultValues(form, checkDocumentDetailsDirtyStatus);

                    } else
                        displayError(errorMessage);
                });
            }
        }

        function onDocumentDetailsCancelBtnClick(e) {
            e.preventDefault();

            var tabContainer = $(e.currentTarget).parents(documentElementSelectors.containers.DocumentDetailsTab + '.k-tabstrip').data('kendoTabStrip');
            var documentDetailsForm = $(e.currentTarget).parents(documentElementSelectors.containers.DocumentDetailsForm);
            if (tabContainer && documentDetailsForm.length > 0) {

                if (isContainerFieldsDirty(documentDetailsForm) == true) {

                    var settings = {
                        message: documentMessages.modals.DocumentDiscardChangesMessage,
                        header: documentMessages.modals.DocumentDiscardChangesHeader,
                    };

                    displayConfirmationModal(settings, function () {
                        tabContainer.reload(tabContainer.element.find('li[aria-selected=true]:first'));
                    });

                } else {
                    tabContainer.reload(tabContainer.element.find('li[aria-selected=true]:first'));
                }
            }
        }

        function onDocumentDetailsFieldChange(e) {
            onInputFieldChange(e);

            var element = $(e.currentTarget);
            checkDocumentDetailsDirtyStatus(element.parents(documentElementSelectors.containers.DocumentDetailsForm + ":first"));
        }

        function onDocumentDetailsSaveBtnClick(e) {
            e.preventDefault();

            var documentId = extractReferenceId(e.currentTarget.getAttribute('id'));
            var form = $(documentElementSelectors.containers.DocumentDetailsFormExact + documentId);
            if (form.length > 0) {
                checkDocumentStatus(form, documentId);
            } else
                displayError(documentMessages.errors.SaveDocumentError);
        }

        var initializeDocumentComponents = function () {
            var container = $(documentElementSelectors.containers.DocumentMain);
            if (container.length == 0) return;

            // Document
            container.on('change', documentElementSelectors.containers.DocumentDetailsForm + ' input', onDocumentDetailsFieldChange);
            container.on('click', documentElementSelectors.buttons.DocumentDetailsSave, onDisabledButtonClick);
            container.on('click', documentElementSelectors.buttons.DocumentDetailsCancel, onDocumentDetailsCancelBtnClick);
            container.on('click', documentElementSelectors.buttons.DocumentSearchSearchSupplier, onDocumentSearchSearchSupplierBtnClick);

            // Revision
            container.on('change', documentElementSelectors.containers.DocumentRevisionDetailsForm + ' input', onDocumentRevisionFieldChange);
            container.on('click', documentElementSelectors.buttons.DocumentRevisionAddMultipleNameNumbers, onDocumentRevisionAddMultipleNameNumbersBtnClick);
            container.on('click', documentElementSelectors.buttons.DocumentRevisionAddNewRevision, onDocumentRevisionAddNewRevisionBtnClick);
            container.on('click', documentElementSelectors.buttons.DocumentRevisionDetailsSave, onDisabledButtonClick);
            container.on('click', documentElementSelectors.buttons.DocumentRevisionDetailsManufacturerSearch, onDocumentRevisionCompanySearchBtnClick);
            container.on('click', documentElementSelectors.buttons.DocumentRevisionDetailsManufacturerView, onDocumentRevisionCompanyViewBtnClick);
            container.on('click', documentElementSelectors.buttons.DocumentRevisionDetailsSetUnknownManufacturer, onDocumentRevisionSetUnknownCompanyBtnClick);
            container.on('click', documentElementSelectors.buttons.DocumentRevisionDetailsSupplierSearch, onDocumentRevisionCompanySearchBtnClick);
            container.on('click', documentElementSelectors.buttons.DocumentRevisionDetailsSupplierView, onDocumentRevisionCompanyViewBtnClick);
            container.on('click', documentElementSelectors.containers.DocumentNewRevisionDetails + ' ' + documentElementSelectors.buttons.DocumentRevisionDetailsAddAttachment, onDocumentNewRevisionDetailsAddAttachmentBtnClick);
            container.on('click', documentElementSelectors.containers.DocumentNewRevisionDetails + ' ' + documentElementSelectors.buttons.DocumentRevisionDetailsCancel, onDocumentNewRevisionDetailsCancelBtnClick);
            container.on('click', documentElementSelectors.containers.DocumentNewRevisionDetails + ' ' + documentElementSelectors.buttons.DocumentRevisionDetailsDeleteAttachment, onDocumentNewRevisionDetailsDeleteAttachmentBtnClick);
            container.on('click', documentElementSelectors.containers.DocumentRevisionDetails + ' ' + documentElementSelectors.buttons.DocumentRevisionDetailsAddAttachment, onDocumentRevisionDetailsAddAttachmentBtnClick);
            container.on('click', documentElementSelectors.containers.DocumentRevisionDetails + ' ' + documentElementSelectors.buttons.DocumentRevisionDetailsCancel, onDocumentRevisionDetailsCancelBtnClick);
            container.on('click', documentElementSelectors.containers.DocumentRevisionDetails + ' ' + documentElementSelectors.buttons.DocumentRevisionDetailsDeleteAttachment, onDocumentRevisionDetailsDeleteAttachmentBtnClick);
            container.on('keyup', documentElementSelectors.textboxes.DocumentRevisionDetailsManufacturerId, onCompanyIdFieldKeyUp);
            container.on('keyup', documentElementSelectors.textboxes.DocumentRevisionDetailsSupplierId, onCompanyIdFieldKeyUp);

            // Containers
            container.on('click', documentElementSelectors.buttons.DocumentAddContainerComponents, onDocumentAddContainerComponentsBtnClick);
            container.on('click', documentElementSelectors.buttons.DocumentDeleteContainerComponent, onDocumentDeleteContainerComponentBtnClick);

            // Multiple name numbers
            container = $(documentElementSelectors.containers.DocumentRevisionMultipleNameNumbers);
            if (container.length > 0) {
                container.on('click', documentElementSelectors.buttons.DocumentRevisionMultipleNameNumbersSave, onDocumentRevisionMultipleNameNumbersSaveBtnClick);
                container.on('keyup', documentElementSelectors.textboxes.DocumentRevisionMultipleNameNumbers, onDocumentRevisionMultipleNameNumbersKeyUp);
            }
        };

        /******************************** Revision Methods ********************************/
        function checkDocumentRevisionDirtyStatus(container) {
            var isExistingRevision = container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionId).val() != "0";
            changeContainerButtonDirtyStatusLayout(container, documentElementSelectors.buttons.DocumentRevisionDetailsSave, documentElementSelectors.buttons.DocumentRevisionDetailsCancel, onDocumentRevisionSaveBtnClick, isExistingRevision);
        }

        function clearDocumentRevisionAttachments(container) {
            if (container) {
                var grid = container.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
                if (grid && grid.dataSource) {
                    grid.dataSource.data([]);
                    container.find(documentElementSelectors.buttons.DocumentRevisionNewFile).removeClass('k-state-disabled');
                }
            }
        }

        function getCompanyTextFieldSibling(buttonElement) {
            if (buttonElement) {
                var siblingSelector = documentElementSelectors.textboxes.DocumentRevisionDetailsSupplierId;
                if (buttonElement.is(documentElementSelectors.buttons.DocumentRevisionDetailsManufacturerSearch) ||
                    buttonElement.is(documentElementSelectors.buttons.DocumentRevisionDetailsManufacturerView) ||
                    buttonElement.is(documentElementSelectors.buttons.DocumentRevisionDetailsSetUnknownManufacturer))
                    siblingSelector = documentElementSelectors.textboxes.DocumentRevisionDetailsManufacturerId;
                else if (buttonElement.is(documentElementSelectors.buttons.DocumentSearchSearchSupplier))
                    siblingSelector = documentElementSelectors.textboxes.DocumentSearchSupplierId;

                return siblingSelector;
            }

            return null;
        }

        function getDocumentRevisionAttachments(container) {
            var gridContainer = $(this).getQueryStringParameterByName("docGuid") != "" ? container.find(documentElementSelectors.grids.DocumentFromInboundResponse).data('kendoGrid') : container.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
            var grid = container && container.length > 0 ? gridContainer : null;
            if (grid && grid.dataSource) {

                var items = [];
                var gridData = grid.dataSource.data();
                for (var i = 0; i < gridData.length; i++) {
                    items.push({ DocumentId: gridData[i].DocumentId, RevisionId: gridData[i].RevisionId, PhysicalPath: gridData[i].PhysicalPath });

                }

                return items;
            }
        }

        function getDocRevAttachmentsForInboundResponse(container, documentId, revisionId) {
            var gridContainer = $(this).getQueryStringParameterByName("docGuid") != "" ? container.find(documentElementSelectors.grids.DocumentFromInboundResponse).data('kendoGrid') : container.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
            var grid = container && container.length > 0 ? gridContainer : null;

            if (grid && grid.dataSource) {

                var items = [];
                var gridData = grid.dataSource.data();
                for (var i = 0; i < gridData.length; i++) {
                    items.push({
                        DocumentId: documentId,
                        RevisionId: revisionId,
                        PhysicalPath: '',
                        DocumentDBGuidId: $(this).getQueryStringParameterByName("docGuid"),
                        OriginalFileName: gridData[i].OriginalFileName
                    });
                }

                return items;
            }
        }

        function getDocumentRevisionDetailsData(container, documentId, revisionId) {

            if (!container && documentId & revisionId) {
                container = ((revisionId || 0) == 0) ? $(documentElementSelectors.containers.DocumentNewRevision + documentId) : $(documentElementSelectors.containers.DocumentRevision + documentId);
            }

            if (container && container.length > 0) {
                var result = {
                    BestImageAvailable: container.find(documentElementSelectors.checkboxes.DocumentRevisionDetailsBestImageAvailable).is(":checked"),
                    DocumentId: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentId).val(),
                    DocumentIdentification: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentIdentification).val(),
                    DocumentSourceId: container.find(documentElementSelectors.dropdownlists.DocumentRevisionDetailsDocumentSource).val(),
                    DocumentVersion: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentVersion).val(),
                    IsBadImage: container.find(documentElementSelectors.radiobuttons.DocumentRevisionDetailsIsBadImage).is(":checked"),
                    IsGoodImage: container.find(documentElementSelectors.radiobuttons.DocumentRevisionDetailsIsGoodImage).is(":checked"),
                    ManufacturerId: null,
                    RevisionDate: container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsRevisionDate).val(),
                    RevisionId: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionId).val(),
                    RevisionTitle: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionTitle).val(),
                    SupplierId: null,
                    VerifyDate: container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsVerifyDate).val(),
                };

                if (extractCompanyIdFromTemplate) {
                    result.ManufacturerId = extractCompanyIdFromTemplate(container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsManufacturerId).val());
                    result.SupplierId = extractCompanyIdFromTemplate(container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsSupplierId).val());
                }

                return result;
            }

            return null;
        }

        function getDocRevDetailsDataForInboundResponse(container, documentId, revisionId) {

         if (!container && documentId & revisionId) {
                container =((revisionId || 0) == 0) ? $(documentElementSelectors.containers.DocumentNewRevision +documentId): $(documentElementSelectors.containers.DocumentRevision +documentId);
         }

                if (container && container.length > 0) {
                    var result = {
                        BestImageAvailable: container.find(documentElementSelectors.checkboxes.DocumentRevisionDetailsBestImageAvailable).is(":checked"),
                        DocumentId: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentId).val(),
                        DocumentIdentification: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentIdentification).val(),
                        DocumentSourceId: container.find(documentElementSelectors.dropdownlists.DocumentRevisionDetailsDocumentSource).val(),
                        DocumentVersion: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentVersion).val(),
                        IsBadImage: container.find(documentElementSelectors.radiobuttons.DocumentRevisionDetailsIsBadImage).is(":checked"),
                        IsGoodImage: container.find(documentElementSelectors.radiobuttons.DocumentRevisionDetailsIsGoodImage).is(":checked"),
                        ManufacturerId: null,
                        RevisionDate: container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsRevisionDate).val(),
                        RevisionId: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionId).val(),
                        RevisionTitle: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionTitle).val(),
                        DocumentDBGuidId: $(this).getQueryStringParameterByName("docGuid"),
                        SupplierId: null,
                        VerifyDate: container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsVerifyDate).val(),
               };

               if (extractCompanyIdFromTemplate) {
                    result.ManufacturerId = extractCompanyIdFromTemplate(container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsManufacturerId).val());
                    result.SupplierId = extractCompanyIdFromTemplate(container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsSupplierId).val());
                }

                return result;
                }

            return null;
        }

        function onDocumentNewRevisionDetailsAddAttachmentBtnClick(e) {
            e.preventDefault();

            if ($(e.currentTarget).hasClass('k-state-disabled')) {
                return false;
            }

            if (displayUploadModal) {

                var container = $(this).parents(documentElementSelectors.containers.DocumentNewRevisionDetails + ":first");
                if (container.length > 0) {
                    var documentId = container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentId).val();
                    var revisionId = 0;

                    displayUploadModal(function () {
                        return { documentId: documentId, revisionId: revisionId };
                    }, function (data) {
                        var parentContainer = $(documentElementSelectors.containers.DocumentNewRevisionDetailsExact + documentId);
                        var attachmentGrid = (parentContainer.length > 0) ? parentContainer.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid') : null;
                        if (attachmentGrid) {
                            for (var i = 0; i < data.length; i++) {
                                attachmentGrid.dataSource.add({
                                    DocumentInfoId: 0,
                                    DocumentId: documentId,
                                    RevisionId: revisionId,
                                    DocumentInfoDescription: '',
                                    DocumentElink: data[i].elink,
                                    OriginalFileName: data[i].filename,
                                    FileName: data[i].filename,
                                    PhysicalPath: data[i].physicalPath
                                });
                            }
                        }

                    }, false);
                } else
                    displayError(documentMessages.errors.DocumentRevisionAttachmentData);


            } else
                displayError(documentMessages.errors.DocumentRevisionAttachmentPopUp);
        }

        function onDocumentNewRevisionDetailsCancelBtnClick(e) {
            e.preventDefault();

            var container = $(e.currentTarget).parents('ul' + documentElementSelectors.containers.DocumentNewRevisionDetails + ':first');
            if (container.length > 0) {

                if (isContainerFieldsDirty(container) == true) {
                    var settings = {
                        message: documentMessages.modals.DocumentRevisionDiscardChangesMessage,
                        header: documentMessages.modals.DocumentRevisionDiscardChangesHeader,
                    };

                    displayConfirmationModal(settings, function () {
                        revertContainerFieldValues(container, checkDocumentRevisionDirtyStatus);
                        container.hide(500);
                    });

                } else
                    container.hide(500);
            }
        }

        function onDocNewRevDetailsCancelForInboundResponseBtnClick(e) {
            e.preventDefault();
            window.opener = self;

            var container = $(e.currentTarget).parents('ul[id^=pnlNewRevision]');
            if (container.length > 0) {

                if (isContainerFieldsDirty(container) == true) {
                    var settings = {
                        message: documentMessages.modals.DocumentRevisionDiscardChangesMessage,
                        header: documentMessages.modals.DocumentRevisionDiscardChangesHeader,
                    };

                    displayConfirmationModal(settings, function() {
                        revertContainerFieldValues(container, checkDocumentRevisionDirtyStatus);
                        window.close();
                    });
                } else {
                    window.close();
                }
            }
        }

        function onDocumentNewRevisionDetailsDeleteAttachmentBtnClick(e) {
            e.preventDefault();

            var settings = {
                message: documentMessages.modals.DocumentRevisionDeleteAttachmentMessage,
                header: documentMessages.modals.DocumentRevisionDeleteAttachmentHeader
            };

            var attachmentGrid = $(this).parents(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
            var dataItem = attachmentGrid ? attachmentGrid.dataItem($(e.currentTarget).parents('[data-uid]')) : null;
            if (dataItem) {

                displayConfirmationModal(settings, function () {
                    $(this).ajaxCall(generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.RemoveRevisionAttachment), {
                            files: [{ FileName: dataItem.FileName, PhysicalPath: dataItem.PhysicalPath }],
                            documentId: dataItem.DocumentId,
                            revisionId: dataItem.RevisionId,
                        })
                        .success(function (data) {
                            var errorMessage = parseErrorMessage(data);
                            if (errorMessage)
                                displayError(errorMessage);
                            else {
                                attachmentGrid.dataSource.remove(dataItem);
                                //only one attachment allowed for the Single container. After remove this file, should allow add file.
                                if (dataItem.DocumentId == 0) {
                                    $('#addNewFilesBtn_New').removeClass('k-state-disabled');
                                }
                            }
                        })
                        .error(function () {
                            displayError(documentMessages.errors.DocumentRevisionAttachmentDelete);
                        });
                });
            } else
                displayError(documentMessages.errors.DocumentRevisionAttachmentDelete);
        }

        function onDocumentRevisionAddNewRevisionBtnClick(e) {
            e.preventDefault();
          
            var documentId = extractReferenceId(e.currentTarget.getAttribute('id'));
            var newRevisionContainer = $(documentElementSelectors.containers.DocumentNewRevisionDetailsExact + documentId);
            if (newRevisionContainer.length > 0) {
                setDocumentRevisionDetailsDefaultValues(newRevisionContainer, documentId);
                newRevisionContainer.show(650);
            }
        }

        function onDocumentRevisionAddMultipleNameNumbersBtnClick(e) {
            e.preventDefault();

            var container = $(e.currentTarget).parents(documentElementSelectors.containers.DocumentRevisionDetails + ":first");
            if (container.length == 0) return;

            var revisionId = container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionId).val();
            var documentId = container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentId).val();
            var modalContainer = $(documentElementSelectors.containers.DocumentRevisionMultipleNameNumbers);
            if (modalContainer.length > 0 && revisionId) {
                modalContainer.find(documentElementSelectors.hidden.DocumentRevisionNameNumberDocument).val(documentId);
                modalContainer.find(documentElementSelectors.hidden.DocumentRevisionNameNumberRevision).val(revisionId);
                modalContainer.find(documentElementSelectors.textboxes.DocumentRevisionMultipleNameNumbers).val('');
                modalContainer.find(documentElementSelectors.dropdownlists.DocumentRevisionMultipleNameNumbersType).data('kendoDropDownList').select(0);

                modalContainer.modal({
                    backdrop: true,
                    keyboard: true
                }).css(
                {
                    'margin-left': function () {
                        return -($(this).width() / 2);
                    }
                });
            }
        }

        function onDocumentRevisionDetailsDeleteAttachmentBtnClick(e) {

            e.preventDefault();

            var settings = {
                message: documentMessages.modals.DocumentRevisionDeleteAttachmentMessage,
                header: documentMessages.modals.DocumentRevisionDeleteAttachmentHeader
            };
            var attachmentGridParent = $(this).parents(documentElementSelectors.grids.DocumentRevisionAttachments);
            var attachmentGrid = attachmentGridParent.data('kendoGrid');

            var dataItem = attachmentGrid ? attachmentGrid.dataItem(attachmentGrid.select()) : null;
            if (dataItem) {
                displayConfirmationModal(settings, function () {

                    $(this).ajaxCall(generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.DeleteDocumentFile), { DocumentInfoId: dataItem.DocumentInfoId })
                        .success(function(data) {
                            var errorMessage = parseErrorMessage(data);
                            if (errorMessage)
                                displayError(errorMessage);
                            else {

                                attachmentGrid.bind("dataBound", function attachmentWarning() {
                                    attachmentGrid.unbind("dataBound", attachmentWarning);

                                    var currentGrid = this;

                                    if (!currentGrid.dataSource || currentGrid.dataSource.data().length == 0)
                                        displayError(documentMessages.warnings.DocumentRevisionAttachments);

                                    if (currentGrid.dataSource.data().length == 0)
                                        $('[id*=addNewFilesBtn]', attachmentGridParent).removeClass('k-state-disabled');
                                });
                                attachmentGrid.dataSource.read();
                            }
                        });
                });
            } else
                displayError(documentMessages.errors.DocumentRevisionAttachmentDelete);
        }

        function onDocumentRevisionMultipleNameNumbersSaveBtnClick(e) {
            e.preventDefault();
           
            var container = $(e.currentTarget).parents('.modal:first');
            var nameNumbers = container.find(documentElementSelectors.textboxes.DocumentRevisionMultipleNameNumbers).val();
            var nameNumberType = container.find(documentElementSelectors.dropdownlists.DocumentRevisionMultipleNameNumbersType).val();

            if (!nameNumbers || !nameNumberType) {
                container.modal('hide');
                displayError(documentMessages.errors.DocumentRevisionMultipleNameNumbersRequiredInformation);
                return;
            }

            var texts = [];
            var lines = nameNumbers.split(/\n/);
            for (var i = 0; i < lines.length; i++)
                if (lines[i].length > 0) texts.push($.trim(lines[i]));

            var data = {};
            data['documentId'] = container.find(documentElementSelectors.hidden.DocumentRevisionNameNumberDocument).val();
            data['revisionId'] = container.find(documentElementSelectors.hidden.DocumentRevisionNameNumberRevision).val();
            data['aliasTypeId'] = nameNumberType;
            data['aliasesText'] = texts;

            $(this).ajaxJSONCall(generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.CreateMultipleNameNumbers), JSON.stringify(data))
                .success(function (successData) {
                    if (successData.success == true) {
                        container.modal('hide');
                        var nameNumberGrid = $(documentElementSelectors.grids.DocumentRevisionNameNumbers + data.revisionId).data("kendoGrid");
                        if (nameNumberGrid) nameNumberGrid.dataSource.read();

                    } else
                        displayError(documentMessages.errors.DocumentRevisionMultipleNameNumbers);
                })
                .error(function () {displayError(documentMessages.errors.DocumentRevisionMultipleNameNumbers);})
                .complete(function () {displayCreatedMessage(documentMessages.success.DocumentRevisionMultipleNameNumbersSaved);});
        }

        function onDocumentRevisionMultipleNameNumbersKeyUp(e) {
            if (e.keyCode == keyCodeValues.Enter || (e.ctrlKey && e.keyCode == keyCodeValues.V)) {
                var arr = e.currentTarget.value.split("\n");
                var arrDistinct = new Array();
                $(arr).each(function (index, item) {
                    if (item.length > 0) {
                        if ($.inArray(item, arrDistinct) == -1)
                            arrDistinct.push(item);
                    }
                });

                e.currentTarget.value = "";
                $(arrDistinct).each(function (index, item) {
                    e.currentTarget.value = e.currentTarget.value + item + "\n";
                });
            }
        }

        function onDocumentRevisionCompanySearchBtnClick(e) {

            e.preventDefault();

            var buttonElement = $(e.currentTarget);
            if (displaySupplierPopUp) {
                displaySupplierPopUp(function (data) {

                    var siblingSelector = getCompanyTextFieldSibling(buttonElement);
                    if (siblingSelector) {
                        var companyInfo = getCompanyTemplate ? getCompanyTemplate(data.CompanyId, data.Name) : data.CompanyId + ', ' + data.Name;
                        buttonElement.siblings(siblingSelector + ":first").val(companyInfo).trigger('change');
                    }
                });
            }
        }

        function onDocumentRevisionCompanyViewBtnClick(e) {

            e.preventDefault();

            var buttonElement = $(e.currentTarget);
            var siblingField = getCompanyTextFieldSibling(buttonElement);
            if (!siblingField) return;

            var companyFieldValue = buttonElement.siblings(siblingField + ":first").val();
            var companyId = extractCompanyIdFromTemplate ? extractCompanyIdFromTemplate(companyFieldValue) : null;
            if (companyId && generateLocationUrl) {
                var url = generateLocationUrl("Operations/Company/LoadSingleSupplier?supplierId=" + companyId);
                window.open(url, "_blank");
            } else
                displayError(documentMessages.errors.CompanyViewError);
        }

        function onDocumentRevisionDetailsAddAttachmentBtnClick(e) {

            e.preventDefault();

            if ($(e.currentTarget).hasClass('k-state-disabled')) {
                return false;
            }

            if (displayUploadModal) {

                var container = $(this).parents(documentElementSelectors.containers.DocumentRevisionDetails + ":first");
                if (container.length > 0) {
                    var documentId = container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentId).val();
                    var revisionId = extractReferenceId(this.getAttribute('id'));

                    displayUploadModal(function () {
                        return { documentId: documentId, revisionId: revisionId };
                    }, function (data) {
                        var deferred = $.Deferred();

                        setTimeout(function () {

                            var containerType = $(documentElementSelectors.dropdownlists.DocumentDetailsContainerTypeExact + documentId).val();
                            if (containerType == "2" && data.length > 1) {
                                displayError(documentMessages.errors.DocumentRevisionKitAttachments);
                                deferred.reject();

                            } else {
                                $(this).ajaxCall(generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.SaveDocumentRevisionAttachments), {
                                        files: data.map(function(item) { return { FileName: item.filename, PhysicalPath: item.physicalPath, DocumentId: documentId, RevisionId: revisionId }; }),
                                        documentId: documentId,
                                        revisionId: revisionId,
                                        isNewRevision: false
                                    })
                                    .success(function (result) {
                                        if (result.message == "Error" || result.success == false) {
                                            displayError(documentMessages.errors.DocumentRevisionAttachment);
                                            deferred.reject();
                                        } else {
                                            var attachmentGrid = container.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
                                            if (attachmentGrid)
                                                attachmentGrid.dataSource.read();

                                            displayCreatedMessage(documentMessages.success.DocumentRevisionAttachmentsSaved);
                                            deferred.resolve();

                                            $(e.currentTarget).addClass('k-state-disabled');
                                        }
                                    })
                                    .error(function () {
                                        displayError(documentMessages.errors.DocumentRevisionAttachment);
                                        deferred.reject();
                                    });
                                //$.ajax({
                                //    type: "POST",
                                //    url: generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.SaveDocumentRevisionAttachments),
                                //    data: {
                                //        files: data.map(function (item) { return { FileName: item.filename, PhysicalPath: item.physicalPath, DocumentId: documentId, RevisionId: revisionId }; } ),
                                //        documentId: documentId,
                                //        revisionId: revisionId,
                                //        isNewRevision: false
                                //    },
                                //    error: function () {
                                //        displayError(documentMessages.errors.DocumentRevisionAttachment);
                                //        deferred.reject();
                                //    },
                                //    success: function (result) {

                                //        if (result.message == "Error" || result.success == false) {
                                //            displayError(documentMessages.errors.DocumentRevisionAttachment);
                                //            deferred.reject();
                                //        } else {
                                //            var attachmentGrid = container.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
                                //            if (attachmentGrid)
                                //                attachmentGrid.dataSource.read();

                                //            displayCreatedMessage(documentMessages.success.DocumentRevisionAttachmentsSaved);
                                //            deferred.resolve();

                                //            $(e.currentTarget).addClass('k-state-disabled');
                                //        }
                                //    }
                                //});
                            }

                        }, 750);

                        return deferred.promise();
                    });

                } else
                    displayError(documentMessages.errors.DocumentRevisionAttachmentData);

            } else
                displayError(documentMessages.errors.DocumentRevisionAttachmentPopUp);
        }

        function onDocumentRevisionDetailsCancelBtnClick(e) {
            e.preventDefault();

            var container = $(e.currentTarget).parents('ul' + documentElementSelectors.containers.DocumentRevisionDetails + ':first').data('kendoPanelBar');
            if (container) {

                if (isContainerFieldsDirty(container.element) == true) {
                    var settings = {
                        message: documentMessages.modals.DocumentRevisionDiscardChangesMessage,
                        header: documentMessages.modals.DocumentRevisionDiscardChangesHeader,
                    };

                    displayConfirmationModal(settings, function () {
                        container.reload(container.element.find('li:first'));
                    });

                } else
                    container.reload(container.element.find('li:first'));
            }
        }

        function onDocumentRevisionFieldChange(e) {
            onInputFieldChange(e);

            var element = $(e.currentTarget);
            checkDocumentRevisionDirtyStatus(element.parents(documentElementSelectors.containers.DocumentRevisionDetailsForm + ":first"));
        }

        function onDocumentRevisionSaveBtnClick(e) {
            if ($(e.currentTarget).hasClass('k-state-disabled')) {
                return false;
            }            
            e.preventDefault();

            var form = $(e.currentTarget).parents(documentElementSelectors.containers.DocumentRevisionDetailsForm + ":first");
            var formData = {
                model: getDocumentRevisionDetailsData(form),
                attachments: getDocumentRevisionAttachments(form)
            };

            if (formData.model) {
                //Make sure the new revision is bigger than the latest revision
                var newRevisionDate = new Date(formData.model.RevisionDate);
                var revListGrid = $("#gdDocumentRevisions_" + formData.model.DocumentId).data('kendoGrid');
                var availalbeRevisions = revListGrid.dataSource.data();
                var quitPost = false;
                $.each(availalbeRevisions, function (i, row) {                    
                    var previousRevisionDate = new Date(row.RevisionDate);
                    if (newRevisionDate <= previousRevisionDate) {
                        displayError("Invalid Revision Date. Revision date has to be greater than the latest revision date.");
                        quitPost = true;
                        return false;
                    }                    
                });

                if (quitPost)
                    return false;

                if (formData.model.RevisionId == 0 && formData.attachments.length == 0) {
                    displayError(documentMessages.errors.SaveNewDocumentRevisionAttachmentError);
                    return false;
                }

                //Prevent continus click
                $(e.currentTarget).addClass('k-state-disabled');

                var url = form.attr("action");
                $(this).ajaxCall(url, formData)
                    .success(function (data) {
                        var errorMessage = parseErrorMessage(data);
                        if (!errorMessage) {
                            displayCreatedMessage(documentMessages.success.DocumentRevisionSaved);
                            setContainerFieldDefaultValues(form, checkDocumentRevisionDirtyStatus);

                            if (formData.model.RevisionId == 0) {
                                form.parents('ul' + documentElementSelectors.containers.DocumentNewRevisionDetails).hide(500);
                                var revisionTab = form.parents(documentElementSelectors.containers.DocumentDetailsTab + ':first');
                                if (revisionTab.length > 0) {
                                    var revisionGrid = revisionTab.find(documentElementSelectors.grids.DocumentRevision).data('kendoGrid');
                                    if (revisionGrid) {
                                        revisionGrid.dataSource.bind("change", function newRevisionRead() {
                                            revisionGrid.expandRow(revisionGrid.wrapper.find('tr.k-master-row:first'));
                                            revisionGrid.dataSource.unbind("change", newRevisionRead);
                                        });
                                        revisionGrid.dataSource.read();
                                    }
                                }
                                clearDocumentRevisionAttachments(form);

                            } else {
                                var lastUpdatePopOver = form.find(documentElementSelectors.general.DocumentRevisionLastUpdatePopOver);
                                if (lastUpdatePopOver.length > 0)
                                    lastUpdatePopOver.data('popover').options.content = data.LastUpdatedDescription;
                            }

                        } else
                            displayError(errorMessage);
                    })
                    .error(function() { displayError(documentMessages.errors.SaveDocumentRevisionError); });
            } else
                displayError(documentMessages.errors.SaveDocumentRevisionError);
        }

        function onDocRevSaveForInboundResponseBtnClick(e) {
            e.preventDefault();
            var documentId = location.search.substring(1).split('&')[1].split('=')[1];
            var form = $(e.currentTarget).parents(documentElementSelectors.containers.DocumentRevisionDetailsForm + ":first");

            var formData = {
                inboundResponseId : $(this).getQueryStringParameterByName("inboundresponseid"),
                model: getDocRevDetailsDataForInboundResponse(form, documentId, 0),
                attachments: getDocRevAttachmentsForInboundResponse(form, documentId, 0)
            };

            if (formData.model) {

                var url = form.attr("action");

                if (formData.attachments.length > 0) {

                    $(this).ajaxCall(url, formData)
                    .success(function(data) {
                        var errorMessage = parseErrorMessage(data);
                        if(!errorMessage) {
                            parent.window.opener.location.reload();
                            window.close();
                            } else
                            displayError(errorMessage);
                            })
                    .error(function() {
                        displayError(documentMessages.errors.SaveDocumentRevisionError);
                    });

                    return;

                 }

                // if there are no attachments, prompt for a save confirmation
                if (formData.attachments.length == 0) {

                    var settings = {
                        header: documentMessages.modals.GeneralConfirm,
                        message: documentMessages.modals.SaveRevisionWothoutAttachment,
                    };

                    // no attachment
                    proceedWithSave = false;
                    displayConfirmationModal(settings, function () {

                        $(this).ajaxCall(url, formData)
                        .success(function(data) {
                            var errorMessage = parseErrorMessage(data);
                            if (!errorMessage) {
                                parent.window.opener.location.reload();
                                window.close();
                            } else
                                displayError(errorMessage);
                            })
                        .error(function () {
                            displayError(documentMessages.errors.SaveDocumentRevisionError);
                        });

                    });

                }



            } else {
                // something wrong with the form data
                displayError(documentMessages.errors.SaveDocumentRevisionError);
            }
        }

        function onDocumentRevisionSetUnknownCompanyBtnClick(e) {
            e.preventDefault();

            var buttonElement = $(e.currentTarget);
            var siblingField = getCompanyTextFieldSibling(buttonElement);
            if (!siblingField) return;

            var url = generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.LoadUnknownManufacturer);
            $(this).ajaxCall(url)
                .success(function (data) {
                    if (data != '') {
                        var supplierField = buttonElement.siblings(siblingField + ":first");
                        supplierField.val(data).trigger('change');
                    }
                })
                .error(function(xhr, textStatus, error) { displayError(error); });
        }


        function setDocumentRevisionDetailsDefaultValues(container, documentId) {
            if (container && container.length > 0) {
                container.find(documentElementSelectors.checkboxes.DocumentRevisionDetailsBestImageAvailable).prop("checked", false);
                container.find(documentElementSelectors.checkboxes.DocumentRevisionDetailsDocumentVersion).val('');
                container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsRevisionDate).val('');
                container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsVerifyDate).val('');
                container.find(documentElementSelectors.radiobuttons.DocumentRevisionDetailsIsBadImage).prop("checked", false);
                container.find(documentElementSelectors.radiobuttons.DocumentRevisionDetailsIsGoodImage).prop("checked", false);
                container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentIdentification).val('');
                container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentVersion).val('');
                container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsManufacturerId).val('');
                container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionTitle).val('');
                container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsSupplierId).val('');
                container.find(documentElementSelectors.buttons.DocumentRevisionNewFile).removeClass('k-state-disabled');
                var pnl = documentElementSelectors.containers.DocumentNewRevisionDetailsExact.substr(1, documentElementSelectors.containers.DocumentNewRevisionDetailsExact.length - 1) + documentId;
                $(documentElementSelectors.buttons.DocumentRevisionDetailsAddAttachment, $("[id*=" + pnl + "]")).removeClass("k-state-disabled");
            }
        }

        var onDocumentRevisionAttachmentSave = function (e) {

            // When revision id is 0 the controller is not hit, we force this action to occur here
            if (e.model.RevisionId == 0) {
                var attachment = {
                    DocumentId: e.model.DocumentId,
                    DocumentInfoDescription: e.model.DocumentInfoDescription,
                    DocumentInfoId: e.model.DocumentInfoId,
                    FileName: e.model.FileName,
                    PhysicalPath: e.model.PhysicalPath,
                    RevisionId: e.model.RevisionId,
                };

                // alert(JSON.stringyfy(attachment));

                $(this).ajaxCall(generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.UpdateDocumentInfoDescription),attachment)
                    .success(function (data) {
                        var errorMessage = parseErrorMessage(data);
                        if (errorMessage) displayError(errorMessage);
                    })
                    .error(function () {displayError(documentMessages.errors.DocumentRevisionAttachmentDescriptionUpdate);});
            }
        };

        var onDocumentRevisionConfirmationDateChange = function (e) {
            if (this.value() == null || this.value().length <= 0)
                return;

            var sDateEntered = kendo.toString(this.value(), 'd');
            var now = new Date();
            var dateEntered = new Date(sDateEntered);
            if (dateEntered > now) {
                displayError(documentMessages.errors.ConfirmationDateFuture);
                $(e.sender.element).val('');
                return;
            }

            var parentContainer = $(e.sender.element).parents("form");
            if (parentContainer.length > 0) {
                var revisionDate = new Date(parentContainer.find(documentElementSelectors.datepickers.DocumentRevisionDetailsRevisionDate).val());
                if (dateEntered < revisionDate) {
                    displayError(documentMessages.errors.ConfirmationDateGreaterThanRevisionDate);
                    $(e.sender.element).val('');
                    return;
                }
            }
        };

        var onDocumentRevisionNameNumberGridEdit = function (e) {
            var update = $(e.container).parent().find(".k-grid-update");
            var cancel = $(e.container).parent().find(".k-grid-cancel");
            $(update).attr('title', 'Save');
            $(cancel).attr('title', 'Cancel');
        };

        var onDocumentRevisionNameNumberGridSave = function (e) {
            var editClass = "tr.k-grid-edit-row.k-state-selected";
            var dataItem = e.sender.tbody.find(editClass);
            dataItem.closest("tr").removeClass("k-state-selected").addClass("k-active");
        };

        var onDocumentRevisionRevisionDateChange = function (e) {
            var sDateEntered = kendo.toString(this.value(), 'd');
            if (sDateEntered == null) return;
            var now = new Date();
            var dateEntered = new Date(sDateEntered);
            if (dateEntered > now) {
                displayError(documentMessages.errors.RevisionDateFuture);
                $(e.sender.element).val('');
                return;
            }

            // As per request by Ops if the date is today automatically set the confirm date to today's date as well
            var todaysDate = kendo.toString(kendo.date.today(), 'd');
            if (todaysDate == sDateEntered) {

                var parentContainer = $(e.sender.element).parents("form");
                if (parentContainer.length > 0) {
                    var kDatePicker = parentContainer.find(documentElementSelectors.datepickers.DocumentRevisionDetailsVerifyDate).data('kendoDatePicker');
                    if (kDatePicker) {
                        kDatePicker.value(sDateEntered);
                        kDatePicker.element.trigger("change");
                    }
                }
            }
        };

        /******************************** Notes Methods ********************************/
        function displayDocumentNote(documentId, message) {
            if (documentId) {
                var container = $(documentElementSelectors.containers.DocumentNotes + documentId);
                if (container.length > 0) container.html(message);
            }
        }

        function onDocumentNoteEditSave() {

            var validationSummary = $('div.validation-summary-valid.validationSummary ul');
            if (validationSummary.length == 0) return;

            validationSummary.find('li').remove();

            if ($("#Notes").val().length == 0)
                validationSummary.append(documentElements.DocumentNoteRequiredNotes);
            else
                validationSummary.find('li').remove(".notes-required");

            if ($("#NoteTypeId").val().length == 0)
                validationSummary.append(documentElements.DocumentNoteRequiredNoteType);
            else
                validationSummary.find('li').remove(".note-type-required");

            validationSummary.append(documentElements.BlankListItem);
        }

        function onDocumentNoteEditCancel(e) {
            e.preventDefault();

            var noteGrid = $(documentElementSelectors.grids.DocumentNotes + e.data.documentId).data("kendoGrid");
            if (noteGrid) {
                var dataItem = noteGrid.dataItem(noteGrid.select());
                noteGrid.dataSource.read();

                if (dataItem) {
                    var uid = noteGrid.dataSource.get(dataItem.id).uid;
                    noteGrid.select('tr[data-uid="' + uid + '"]');
                }
            }
        }

        var onDocumentNoteChange = function () {
            var documentId = extractReferenceId(this.element.attr('id'));
            var dataItem = this.dataItem(this.select());
            var text = dataItem ? dataItem.Notes : '';
            displayDocumentNote(documentId, text);
        };

        var onDocumentNoteDataBound = function () {
            var documentId = extractReferenceId(this.element.attr('id'));
            displayDocumentNote(documentId, '');
        };

        var onDocumentNoteEdit = function (e) {
            var cancel = $(e.container).parent().find(".k-grid-cancel");
            var title = $(e.container).parent().find(".k-window-title");
            var update = $(e.container).parent().find(".k-grid-update");

            $(title).html(e.model.DocumentNoteId > 0 ? 'Edit' : 'Create');
            $(update).attr(e.model.DocumentNoteId > 0 ? 'Update' : 'Create');
            $(cancel).attr('Cancel');

            var htmlParts = $.parseHTML($(update).html());
            $(update).html(htmlParts.length == 0 ? '' : htmlParts[0].outerHTML);

            htmlParts = $.parseHTML($(cancel).html());
            $(cancel).html(htmlParts.length == 0 ? '' : htmlParts[0].outerHTML);

            update.on("click", onDocumentNoteEditSave);
            cancel.on("click", { documentId: e.model.DocumentId }, onDocumentNoteEditCancel);

            $(e.container).find(documentElementSelectors.textboxes.DocumentNotes)
                .kendoEditor({ encoded: false })
                .end()
                .width(645)
                .height(500)
                .data("kendoWindow")
                .center()
                .element
                .find('.k-edit-form-container')
                .width(620)
                .height(475);
        };

        /******************************** Containers Methods ********************************/
        function extractDocumentIdFromRequestUrl(url) {
            if (url) {
                var documentIdString = "documentId=";
                var index = url.indexOf(documentIdString) + documentIdString.length;
                if (index > 0 && index < url.length) {
                    var documentId = url.substring(index);
                    return documentId ? documentId : null;
                }
            }

            return null;
        }

        function onDocumentAddContainerComponentsBtnClick(e) {
            e.preventDefault();
            var currentDocumentId = extractReferenceId(this.getAttribute('id'));

            if (displayDocumentPopUp) {
                displayDocumentPopUp(function (data) {
                    var ddl = $(documentElementSelectors.dropdownlists.DocumentContainerClassificationType + currentDocumentId).data('kendoDropDownList');
                    var classificationTypeId = ddl ? ddl.value() : "";
                    var classificationTypeText = ddl ? ddl.text() : "";

                    var model = {
                        ChildDocumentId: classificationTypeText.indexOf("Parents") >= 0 ? currentDocumentId : data.ReferenceId,
                        ClassificationTypeId: classificationTypeId,
                        ParentDocumentId: classificationTypeText.indexOf("Parents") >= 0 ? data.ReferenceId : currentDocumentId,
                    };

                    $(this).ajaxCall(generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.SaveDocumentContainerComponent), model)
                        .success(function (result) {
                            var errorMessage = parseErrorMessage(result);
                            if (errorMessage)
                                displayError(errorMessage);
                            else
                                refreshDocumentContainersGrid(ddl.element.attr('id'));
                        })
                        .error(function () {displayError(documentMessages.errors.SaveDocumentContainerComponent);});
                });
            }
        }

        function onDocumentDeleteContainerComponentBtnClick() {
            var currentRow = $(this).parents('tr[role="row"]');
            var grid = $(this).parents('.k-grid:first').data('kendoGrid');
            var dataItem = grid ? grid.dataItem(currentRow) : null;
            if (dataItem) {

                var settings = {
                    header: documentMessages.modals.DocumentDeleteContainerComponentHeader,
                    message: documentMessages.modals.DocumentDeleteContainerComponentMessage,
                };

                displayConfirmationModal(settings, function() {

                    var data = {
                        ChildDocumentId: dataItem.ChildDocumentId,
                        ContainerTypeId: dataItem.ContainerTypeId,
                        KitGroupContainerId: dataItem.KitGroupContainerId,
                        ParentDocumentId: dataItem.ParentDocumentId,
                    };

                    $(this).ajaxCall(generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.RemoveDocumentContainerComponent),data)
                        .success(function (result) {
                            var errorMessage = parseErrorMessage(result);
                            if (errorMessage)
                                displayError(errorMessage);
                            else
                                refreshDocumentContainersGrid(grid.element.attr('id'));
                        })
                        .error(function () {displayError(documentMessages.errors.DocumentContainerComponentDelete);});
                });
            }
        }

        function refreshDocumentContainersGrid(documentHtmlId) {
            var documentId = extractReferenceId(documentHtmlId);
            if (documentId) {
                var componentGrid = $(documentElementSelectors.grids.DocumentContainerComponents + documentId).data('kendoGrid');
                if (componentGrid) {
                    componentGrid.dataSource.read();
                }
            }
        }

        var onDocumentContainerClassificationTypeChange = function () {
            refreshDocumentContainersGrid(this.element.attr('id'));
        };

        var onDocumentContainerClassificationTypeDataBound = function () {
            refreshDocumentContainersGrid(this.element.attr('id'));
        };

        var onDocumentContainerClassificationTypeRequestStart = function (e) {
            if (e.type == 'read') {
                var documentId = extractDocumentIdFromRequestUrl(this.transport.options.read.url);
                var containerType = $(documentElementSelectors.containers.DocumentDetailsFormExact + documentId).find(documentElementSelectors.dropdownlists.DocumentDetailsContainerType).val();
                this.transport.options.read.data = { containerTypeId: containerType };
            }
        };

        var onDocumentContainerComponentDataBound = function () {
            // TODO: Method kept for the meantime since I forgot what was here to begin with
        };

        var onDocumentContainerComponentsRequestStart = function (e) {
            if (e.type == 'read') {
                var documentId = extractDocumentIdFromRequestUrl(this.transport.options.read.url);
                var classificationType = $(documentElementSelectors.dropdownlists.DocumentContainerClassificationType + documentId).val();
                this.transport.options.read.data = { classificationType: classificationType };
            }
        };

        /******************************** Status Notes Methods ********************************/
        function displayDocumentStatusNote(documentId, message) {
            if (documentId) {
                var container = $(documentElementSelectors.containers.DocumentStatusHistory + documentId);
                if (container.length > 0) container.html(message);
            }
        }

        var onDocumentStatusHistoryChange = function () {
            var documentId = extractReferenceId(this.element.attr('id'));
            var dataItem = this.dataItem(this.select());
            var text = dataItem ? dataItem.Notes : '';
            displayDocumentStatusNote(documentId, text);
        };

        var onDocumentStatusHistoryDataBound = function () {
            var documentId = extractReferenceId(this.element.attr('id'));
            displayDocumentStatusNote(documentId, '');
        };

        var UnlinkDocFromProudct = function (e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var pid = dataItem.id;

            //dataItem.IsSelected = true;
            var targetId = e.delegateTarget.id;
            var did = targetId.substring(targetId.indexOf("_") + 1, targetId.length);

            DisplayConfirmationModal({ message: documentMessages.warnings.UnlinkDocumentFromProudct, header: 'Confirm to remove document from product' }, function () {
                $.post(controllerCalls.RemoveProductDocumentsWithoutCheckDuplicate, { productId: pid, documentId: did }, function (data) {
                    if (!data.Success) {
                        $(this).displayError(data.Message);
                        return;
                    }
                    //Remove the row instead of refresh grid, it's much faster
                    var gView = $("#" + targetId).data("kendoGrid");
                    gView.removeRow($(dataItem)); //just gives alert message
                    gView.dataSource.remove(dataItem); //removes it actually from the grid

                    var gNonProduct = $(documentElementSelectors.grids.NonDocumentProduct + did).data("kendoGrid");
                    gNonProduct.dataSource.page(1);
                    gNonProduct.dataSource.read();

                });
            });
        };

        var afterSaveNameNumber = function (e) {
        
            if (e.response.success == false) {
                $(this).displayError(e.response.message);
                $('#gdRevisionNameNumber_' + e.response.revisionId).data('kendoGrid').dataSource.read();
                return;
            }
        };

        var confirmFullSearchResultLoad = function(e){

            DisplayConfirmationModal({ message: e.errors, header: 'Confirm search result display' }, function () {

                var container = $(documentElementSelectors.containers.DocumentMain);
                container.find(documentElementSelectors.textboxes.DocumentShowAllResults).val("true");
                $("#gdSearchDocument").data("kendoGrid").dataSource.read();

            });

        }

        return {
            getDocumentSearchCriteria: getDocumentSearchCriteria,
            getDocumentSearchPopUpCriteria: getDocumentSearchPopUpCriteria,
            initializeDocumentComponents: initializeDocumentComponents,
            initializeDocumentSearchPopup: initializeDocumentSearchPopup,
            initializeProductAssociation: initializeProductAssociation,
            onDocumentContainerClassificationTypeChange: onDocumentContainerClassificationTypeChange,
            onDocumentContainerClassificationTypeDataBound: onDocumentContainerClassificationTypeDataBound,
            onDocumentContainerClassificationTypeRequestStart: onDocumentContainerClassificationTypeRequestStart,
            onDocumentContainerComponentDataBound: onDocumentContainerComponentDataBound,
            onDocumentContainerComponentsRequestStart: onDocumentContainerComponentsRequestStart,
            onDocumentMainPanelActivate: onDocumentMainPanelActivate,
            onDocumentMainPanelActivateReadOnly: onDocumentMainPanelActivateReadOnly,
            onDocumentNoteChange: onDocumentNoteChange,
            onDocumentNoteDataBound: onDocumentNoteDataBound,
            onDocumentNoteEdit: onDocumentNoteEdit,
            onDocumentRevisionAttachmentSave: onDocumentRevisionAttachmentSave,
            onDocumentRevisionConfirmationDateChange: onDocumentRevisionConfirmationDateChange,
            onDocumentRevisionRevisionDateChange: onDocumentRevisionRevisionDateChange,
            onDocumentRevisionNameNumberGridEdit: onDocumentRevisionNameNumberGridEdit,
            onDocumentRevisionNameNumberGridSave: onDocumentRevisionNameNumberGridSave,
            onDocumentStatusHistoryChange: onDocumentStatusHistoryChange,
            onDocumentStatusHistoryDataBound: onDocumentStatusHistoryDataBound,
            onNewDocumentPanelActivate: onNewDocumentPanelActivate,
            onNewRevisionPanelActivate: onNewRevisionPanelActivate,
            onDisplayNewDocumentPopUp: onDisplayNewDocumentPopUp,
            UnlinkDocFromProudct: UnlinkDocFromProudct,
            afterSaveNameNumber: afterSaveNameNumber,
            confirmFullSearchResultLoad: confirmFullSearchResultLoad
        };
    };

    $(function () { });

})(jQuery);