; (function ($) {
    if ($.fn.compliDocumentAlt == null) {
        $.fn.compliDocumentAlt = {};
    }

    $.fn.compliDocumentAlt = function () {

        /******************************** Enclosure Variables ********************************/
        var documentAjaxSettings = {
            actions: {
                CreateMultipleNameNumbers: "NamesNumbers_Multiple_Create",
                DeleteDocumentFile: "DeleteDocumentFile",
                GetStatusAction: "GetStatusAction",
                LoadUnknownManufacturer: "LoadUnknownManufacturer",
                LookUpSupplierOnKeyEnter: "LookUpSupplierOnKeyEnter",
                RemoveRevisionAttachment: "RemoveAttachmentAlt",
                SaveDocumentRevisionAttachments: "SaveDocumentRevisionAttachments"
            },
            contenttype: {
                Json: "application/json; charset=utf-8"
            },
            controllers: {
                Company: "Company",
                Document: "Document"
            },
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
                DocumentDetailsCancel: "[id^=btnDocumentCancel_]",
                DocumentDetailsSave: "[id^=btnDocumentSave_]",
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
                DocumentSearchClear: "#clearDocumentBtn",
                DocumentSearchSearch: "#searchDocumentBtn",
                DocumentSearchSearchSupplier: "#searchSupplierIdBtn",
            },
            checkboxes: {
                DocumentDetailsIsMsdsNotRequired: "[id^=IsMsdsNotRequired_]",
                DocumentDetailsIsObsolete: "[id^=IsObsolete_]",
                DocumentDetailsIsPublic: "[id^=IsPublic_]",
                DocumentRevisionDetailsBestImageAvailable: "[id^=BestImageAvailable_]",
                DocumentSearchIncludeDeleted: "#chkIncludeDeletedDocument",
                DocumentSearchLatestRevision: "#chkLatestRevision",
            },
            containers: {
                CreatedMessage: "#CreatedMessage",
                DocumentMain: "#DocumentMainContainer",
                DocumentSearch: "#divSearchSection",
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
                NewDocument: "#pnlNewDocument"
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
                DocumentDetailsStatus: "[id^=DocumentStatusId_]",
                DocumentRevisionDetailsDocumentSource: "[id^=DocumentSourceId_]",
                DocumentRevisionMultipleNameNumbersType: "#selNameType",
                DocumentSearchContainerType: "#ddlDocumentContainer",
                DocumentSearchDocumentType: "#ddlDocumentType",
                DocumentSearchDropDownLists: "[data-role=dropdownlist]",
                DocumentSearchLanguage: "#ddlDocumentLanguage",
                DocumentSearchPhysicalState: "#ddlDocumentPhysicalState",
                DocumentSearchRegion: "#ddlDocumentRegion",
                DocumentSearchStatus: "#DocumentStatusId"
            },
            general: {
                DirtyFields: "input[data-is-dirty=true]",
                DocumentLastUpdatePopOver: "[id^=doc-I-Info-]",
                DocumentRevisionLastUpdatePopOver: "[id^=rev-I-Info-]",
                DocumentSearchOptions: "input[name=radiogroupTitleSearchOption]",
            },
            grids: {
                DocumentContainerComponents: "#gdContainerComponents_",
                DocumentNotes: "#gdDocumentNotes_",
                DocumentRevision: "[id^=gdDocumentRevisions_]",
                DocumentRevisionAttachments: "[id^=gdRevisionFileInfoDetail_]",
                DocumentRevisionNameNumbers: "#gdRevisionNameNumber_",
                DocumentSearch: "#gdSearchDocument",
                DocumentStatusHistory: "#gdSupplierStatusHistory_",
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
                DocumentSearchDocumentId: "#txtSearchDocumentId",
                DocumentSearchPartNumber: "#txtSearchPartNumber",
                DocumentSearchRevisionTitle: "#txtRevisionTitle",
                DocumentSearchSupplierId: "#txtSearchSupplierId",
                DocumentSearchUPC: "#txtSearchUPC",
            }
        };

        var documentMessages = {
            errors: {
                CompanyViewError: "An error occurred displaying the selected company. Please review you selection and try again.",
                ConfirmationDateFuture: "Invalid confirmation date, it can't be a future date.",
                ConfirmationDateGreaterThanRevisionDate: "Invalid confirmation date, it must be greater than or equal to revision date.",
                DocumentRevisionAttachment: "An error occurred uploading the revision attachment(s). Please try again.",
                DocumentRevisionAttachmentData: "An error occurred retrieving information to save the revision attachment. Please try again.",
                DocumentRevisionAttachmentDelete: "An error occurred deleting the selected revision attachment.",
                DocumentRevisionAttachmentDescriptionUpdate: "An error occurred updating the attachment description.",
                DocumentRevisionAttachmentPopUp: "An error occurred displaying the upload popup. Please contact your administrator.",
                DocumentRevisionKitAttachments: "A kit can only have on cover sheet, please move the existing on first.",
                DocumentRevisionMultipleNameNumbers: "An error occurred saving the revision's name number values.",
                DocumentRevisionMultipleNameNumbersRequiredInformation: "Alias Type and Aliases are required.",
                RevisionDateFuture: "Invalid revision date, it can't be a future date.",
                Error: "Error",
                SaveDocumentError: "Saving the document could not be completed. Please review your changes and try again.",
                SaveDocumentRevisionError: "Save the document revision could not be completed. Please review your changes and try again.",
            },
            modals: {
                DocumentDiscardChangesHeader: "Discard Document Changes",
                DocumentDiscardChangesMessage: "You are going to discard your document changes. Are you sure you would like to continue?",
                DocumentRevisionDeleteAttachmentHeader: "Delete Attachment Confirmation",
                DocumentRevisionDeleteAttachmentMessage: "Are you sure you want to delete this file?",
                DocumentRevisionDiscardChangesHeader: "Discard Revision Changes",
                DocumentRevisionDiscardChangesMessage: "You are going to discard your revision changes. Are you sure you would like to continue?",
            },
            success: {
                DocumentRevisionAttachmentsSaved: "Attachments Saved",
                DocumentRevisionMultipleNameNumbersSaved: "Items Saved Successful",
                DocumentRevisionSaved: "Revision Saved",
                DocumentSaved: "Document Saved",
            }
        };

        var keyCodeValues = {
            Enter: 13,
            V: 86
        }

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

        function clearContainerDirtyFlags(container, changeLayoutFunc) {
            if (container) {
                container.find('input[data-is-dirty=true]').each(function () {
                    var element = this;
                    if (element.getAttribute('type') == 'checkbox' || element.getAttribute('type') == 'radio')
                        element.defaultChecked = element.checked;
                    else
                        element.defaultValue = element.value;

                    element.removeAttribute('data-is-dirty');
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

        function extractCompanyId(value) {
            if (value) {
                var parts = value.split(',');
                if (parts.length > 0) {
                    var convertedValue = parseInt(parts[0]);
                    return isNaN(convertedValue) ? null : convertedValue;
                }
            }

            return null;
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
            if (controller && action) {
                return "../" + controller + "/" + action;
            }

            return null;
        }

        function isContainerFieldsDirty(container) {
            var isDirty = container ? container.find(documentElementSelectors.general.DirtyFields).length > 0 : false;
            return isDirty;
        }

        function onDisabledButtonClick(e) {
            e.preventDefault();
        }

        function onInputFieldChange(e) {
            var element = $(e.currentTarget);
            var defaultValue = element.is(':checkbox, :radio') ? element[0].defaultChecked : element[0].defaultValue;
            var currentValue = element.is(':checkbox, :radio') ? element[0].checked : element.val();
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

        /******************************** Search Methods ********************************/
        function performDocumentSearch() {
            var searchGrid = $(documentElementSelectors.grids.DocumentSearch).data('kendoGrid');
            if (searchGrid && searchGrid.dataSource)
                searchGrid.dataSource.read();
        }

        function onCompanyIdFieldKeyUp(e) {
            if (onKeyPressEnter) {
                onKeyPressEnter(e, function () {
                    var companyId = e.target.value;
                    if (IsNumeric && IsNumeric(companyId)) {

                        var url = generateActionUrl(documentAjaxSettings.controllers.Company, documentAjaxSettings.actions.LookUpSupplierOnKeyEnter);
                        $.post(url, { supplierInfo: companyId }, function (data) {
                            $(e.target).val(data);
                        });
                    }
                });
            }
        }

        function onDocumentSearchAddNewBtnClick(e) {
            e.preventDefault();

            var container = $(documentElementSelectors.containers.NewDocument);
            if (container.length > 0) container.show(500);
        }

        function onDocumentSearchClearBtnClick(e) {
            e.preventDefault();

            $(documentElementSelectors.containers.DocumentSearch).find(documentElementSelectors.dropdownlists.DocumentSearchDropDownLists).each(function () {
                var ddl = $(this).data("kendoDropDownList");
                if (ddl != undefined) {
                    ddl.select(0);
                }
            });

            $(documentElementSelectors.checkboxes.DocumentSearchIncludeDeleted).prop('checked', false);
            $(documentElementSelectors.checkboxes.DocumentSearchLatestRevision).prop('checked', true);
            $(documentElementSelectors.textboxes.DocumentSearchDocumentId).val('');
            $(documentElementSelectors.textboxes.DocumentSearchPartNumber).val('');
            $(documentElementSelectors.textboxes.DocumentSearchRevisionTitle).val('');
            $(documentElementSelectors.textboxes.DocumentSearchSupplierId).val('');

            var searchGrid = $(documentElementSelectors.grids.DocumentSearch).data('kendoGrid');
            if (searchGrid && searchGrid.dataSource) {
                searchGrid.dataSource.data([]);
                searchGrid.dataSource.filter([]);
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

        var getDocumentSearchCriteria = function (e) {
            var result = {
                ContainerTypeId: $(documentElementSelectors.dropdownlists.DocumentSearchContainerType).val(),
                DocumentLanguageId: $(documentElementSelectors.dropdownlists.DocumentSearchLanguage).val(),
                DocumentRegionId: $(documentElementSelectors.dropdownlists.DocumentSearchRegion).val(),
                DocumentStatusId: $(documentElementSelectors.dropdownlists.DocumentSearchStatus).val(),
                DocumentTypeId: $(documentElementSelectors.dropdownlists.DocumentSearchDocumentType).val(),
                IncludeDeletedDocument: $(documentElementSelectors.checkboxes.DocumentSearchIncludeDeleted).is(":checked"),
                LatestRevisionOnly: $(documentElementSelectors.checkboxes.DocumentSearchLatestRevision).is(":checked"),
                PartNumber: $(documentElementSelectors.textboxes.DocumentSearchPartNumber).val(),
                PhysicalStateId: $(documentElementSelectors.dropdownlists.DocumentSearchPhysicalState).val(),
                ReferenceId: $(documentElementSelectors.textboxes.DocumentSearchDocumentId).val(),
                RevisionTitle: $(documentElementSelectors.textboxes.DocumentSearchRevisionTitle).val(),
                SearchOption: $(documentElementSelectors.general.DocumentSearchOptions + ":checked").val(),
                SupplierId: extractCompanyId($(documentElementSelectors.textboxes.DocumentSearchSupplierId).val()),
                UPC: $(documentElementSelectors.textboxes.DocumentSearchUPC).val(),
            };

            return result;
        };

        var panelbarActivatedAlt = function () {
            var documentSearchContainer = $(documentElementSelectors.containers.DocumentSearch);
            if (documentSearchContainer.length == 0) return;

            documentSearchContainer.on('click', documentElementSelectors.buttons.DocumentSearchAddNew, onDocumentSearchAddNewBtnClick);
            documentSearchContainer.on('click', documentElementSelectors.buttons.DocumentSearchClear, onDocumentSearchClearBtnClick);
            documentSearchContainer.on('click', documentElementSelectors.buttons.DocumentSearchSearch, onDocumentSearchSearchBtnClick);

            documentSearchContainer.on('keyup', documentElementSelectors.textboxes.DocumentSearchDocumentId, onDocumentSearchFieldKeyUp);
            documentSearchContainer.on('keyup', documentElementSelectors.textboxes.DocumentSearchPartNumber, onDocumentSearchFieldKeyUp);
            documentSearchContainer.on('keyup', documentElementSelectors.textboxes.DocumentSearchRevisionTitle, onDocumentSearchFieldKeyUp);
            documentSearchContainer.on('keyup', documentElementSelectors.textboxes.DocumentSearchSupplierId, onCompanyIdFieldKeyUp);
            documentSearchContainer.on('keyup', documentElementSelectors.textboxes.DocumentSearchUPC, onDocumentSearchFieldKeyUp);
        };

        var readonlyPanelbarActivatedAlt = function () {

        };

        /******************************** New Document Methods ********************************/
        function onNewDocumentCancelBtnClick(e) {

        }

        function onNewDocumentSaveBtnClick(e) {

        }

        /******************************** Document Methods ********************************/
        function checkDocumentDetailsDirtyStatus(container) {
            changeContainerButtonDirtyStatusLayout(container, documentElementSelectors.buttons.DocumentDetailsSave, documentElementSelectors.buttons.DocumentDetailsCancel, onDocumentDetailsSaveBtnClick);
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
                    DocumentStatusId: form.find(documentElementSelectors.dropdownlists.DocumentDetailsStatus).val(),
                    DocumentTypeId: form.find(documentElementSelectors.dropdownlists.DocumentDetailsDocumentType).val(),
                    IsMsdsNotRequired: form.find(documentElementSelectors.checkboxes.DocumentDetailsIsMsdsNotRequired).is(":checked"),
                    IsObsolete: form.find(documentElementSelectors.checkboxes.DocumentDetailsIsObsolete).is(":checked"),
                    IsPublic: form.find(documentElementSelectors.checkboxes.DocumentDetailsIsPublic).is(":checked"),
                    StateNotes: form.find(documentElementSelectors.hidden.DocumentDetailsStatusNotes).val(),
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
                        clearContainerDirtyFlags(form, checkDocumentDetailsDirtyStatus);

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

            // Multiple name numbers
            container = $(documentElementSelectors.containers.DocumentRevisionMultipleNameNumbers);
            if (container.length > 0) {
                container.on('click', documentElementSelectors.buttons.DocumentRevisionMultipleNameNumbersSave, onDocumentRevisionMultipleNameNumbersSaveBtnClick);
                container.on('keyup', documentElementSelectors.textboxes.DocumentRevisionMultipleNameNumbers, onDocumentRevisionMultipleNameNumbersKeyUp);
            }

            // Add new document
        };

        /******************************** Revision Methods ********************************/
        function checkDocumentRevisionDirtyStatus(container) {
            var isExistingRevision = container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionId).val() != "0";
            changeContainerButtonDirtyStatusLayout(container, documentElementSelectors.buttons.DocumentRevisionDetailsSave, documentElementSelectors.buttons.DocumentRevisionDetailsCancel, onDocumentRevisionSaveBtnClick, isExistingRevision);
        }

        function setDocumentRevisionDetailsDefaultValues(container) {

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
                    ManufacturerId: extractCompanyId(container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsManufacturerId).val()),
                    RevisionDate: container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsRevisionDate).val(),
                    RevisionId: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionId).val(),
                    RevisionTitle: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionTitle).val(),
                    SupplierId: extractCompanyId(container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsSupplierId).val()),
                    VerifyDate: container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsVerifyDate).val(),
                };

                return result;
            }

            return null;
        }

        function getCompanyTextFieldSibling(buttonElement) {
            if (buttonElement) {
                var siblingSelector = documentElementSelectors.textboxes.DocumentRevisionDetailsSupplierId;
                if (buttonElement.is(documentElementSelectors.buttons.DocumentRevisionDetailsManufacturerSearch) ||
                    buttonElement.is(documentElementSelectors.buttons.DocumentRevisionDetailsManufacturerView) ||
                    buttonElement.is(documentElementSelectors.buttons.DocumentRevisionDetailsSetUnknownManufacturer))
                    siblingSelector = documentElementSelectors.textboxes.DocumentRevisionDetailsManufacturerId;

                return siblingSelector;
            }

            return null;
        }

        function onDocumentNewRevisionDetailsAddAttachmentBtnClick(e) {
            e.preventDefault();

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
                                    FileName: data[i].filename
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
                        clearContainerDirtyFlags(container, checkDocumentRevisionDirtyStatus);
                        container.hide(500);
                    });

                } else
                    container.hide(500);
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
                    $.ajax({
                        type: "POST",
                        url: generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.RemoveRevisionAttachment),
                        data: {
                            filenames: [dataItem.FileName],
                            documentId: dataItem.DocumentId,
                            revisionId: dataItem.RevisionId
                        },
                        success: function () {
                            attachmentGrid.dataSource.remove(dataItem);
                        },
                        error: function () {
                            displayError(documentMessages.errors.DocumentRevisionAttachmentDelete);
                        }
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
                setDocumentRevisionDetailsDefaultValues(newRevisionContainer);
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

            var attachmentGrid = $(this).parents(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
            var dataItem = attachmentGrid ? attachmentGrid.dataItem(attachmentGrid.select()) : null;
            if (dataItem) {
                displayConfirmationModal(settings, function () {
                    $.ajax({
                        type: "POST",
                        url: generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.DeleteDocumentFile),
                        data: { DocumentInfoId: dataItem.DocumentInfoId },
                        success: function (data) {
                            var errorMessage = parseErrorMessage(data);
                            if (errorMessage)
                                displayError(errorMessage);
                            else {
                                attachmentGrid.dataSource.read();
                            }
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
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].length > 0) texts.push($.trim(lines[i]));
            }

            var data = {};
            data['documentId'] = container.find(documentElementSelectors.hidden.DocumentRevisionNameNumberDocument).val();
            data['revisionId'] = container.find(documentElementSelectors.hidden.DocumentRevisionNameNumberRevision).val();
            data['aliasTypeId'] = nameNumberType;
            data['aliasesText'] = texts;

            $.ajax({
                url: generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.CreateMultipleNameNumbers),
                data: JSON.stringify(data),
                type: "POST",
                contentType: documentAjaxSettings.contenttype.Json,
                error: function () {
                    displayError(documentMessages.errors.DocumentRevisionMultipleNameNumbers);
                },
                success: function (successData) {
                    if (successData.success == true) {
                        container.modal('hide');
                        var nameNumberGrid = $(documentElementSelectors.grids.DocumentRevisionNameNumbers + data.revisionId).data("kendoGrid");
                        if (nameNumberGrid) nameNumberGrid.dataSource.read();

                    } else
                        displayError(documentMessages.errors.DocumentRevisionMultipleNameNumbers);
                },
                complete: function (compData) {
                    displayCreatedMessage(documentMessages.success.DocumentRevisionMultipleNameNumbersSaved);
                }
            });
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
                        buttonElement.siblings(siblingSelector + ":first").val(companyInfo);
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
            var companyId = extractCompanyId(companyFieldValue);
            if (companyId && generateLocationUrl) {
                var url = generateLocationUrl("Operations/Company/LoadSingleSupplier?supplierId=" + companyId);
                window.open(url, "_blank");
            } else
                displayError(documentMessages.errors.CompanyViewError);
        }

        function onDocumentRevisionDetailsAddAttachmentBtnClick(e) {
            e.preventDefault();

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

                                $.ajax({
                                    type: "POST",
                                    url: generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.SaveDocumentRevisionAttachments),
                                    data: {
                                        filenames: data.map(function (item) { return item.filename; }),
                                        documentId: documentId,
                                        revisionId: revisionId,
                                        isNewRevision: false
                                    },
                                    error: function () {
                                        displayError(documentMessages.errors.DocumentRevisionAttachment);
                                        deferred.reject();
                                    },
                                    success: function (result) {

                                        if (result.message == "Error" || result.success == false) {
                                            displayError(documentMessages.errors.DocumentRevisionAttachment);
                                            deferred.reject();
                                        } else {
                                            var attachmentGrid = container.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
                                            if (attachmentGrid)
                                                attachmentGrid.dataSource.read();

                                            displayCreatedMessage(documentMessages.success.DocumentRevisionAttachmentsSaved);
                                            deferred.resolve();
                                        }
                                    }
                                });
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
            e.preventDefault();

            var form = $(e.currentTarget).parents(documentElementSelectors.containers.DocumentRevisionDetailsForm + ":first");
            var formData = getDocumentRevisionDetailsData(form);
            if (formData) {
                var url = form.attr("action");
                $.ajax({
                    url: url,
                    data: formData,
                    type: "POST",
                    success: function (data) {
                        var errorMessage = parseErrorMessage(data);
                        if (!errorMessage) {
                            displayCreatedMessage(documentMessages.success.DocumentRevisionSaved);
                            clearContainerDirtyFlags(form, checkDocumentRevisionDirtyStatus);

                            if (formData.RevisionId == 0) {
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

                                var attachmentGrid = form.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
                                if (attachmentGrid && attachmentGrid.dataSource) {
                                    attachmentGrid.dataSource.data([]);
                                    attachmentGrid.dataSource.filter([]);
                                }
                                
                            } else {
                                var lastUpdatePopOver = form.find(documentElementSelectors.general.DocumentRevisionLastUpdatePopOver);
                                if (lastUpdatePopOver.length > 0)
                                    lastUpdatePopOver.data('popover').options.content = data.LastUpdatedDescription;
                            }

                        } else
                            displayError(errorMessage);
                    },
                    error: function (data) {
                        displayError(documentMessages.errors.SaveDocumentRevisionError);
                    }
                });
            } else
                displayError(documentMessages.errors.SaveDocumentRevisionError);
        }

        function onDocumentRevisionSetUnknownCompanyBtnClick(e) {
            e.preventDefault();

            var buttonElement = $(e.currentTarget);
            var siblingField = getCompanyTextFieldSibling(buttonElement);
            if (!siblingField) return;

            var url = generateActionUrl(documentAjaxSettings.controllers.Document, documentAjaxSettings.actions.LoadUnknownManufacturer);
            $.ajax({
                url: url,
                type: 'POST',
                cache: false,
                success: function (data) {
                    if (data != '') {
                        buttonElement.siblings(siblingField + ":first").val(data);
                    }
                },
                error: function (xhr, textStatus, error) {
                    displayError(error);
                }
            });
        }

        var onDocumentRevisionAttachmentSave = function (e) {

            // When revision id is 0 the controller is not hit, we force this action to occur here
            if (e.model.RevisionId == 0) {
                var attachment = {
                    DocumentId: e.model.DocumentId,
                    DocumentInfoDescription: e.model.DocumentInfoDescription,
                    DocumentInfoId: e.model.DocumentInfoId,
                    FileName: e.model.FileName,
                    RevisionId: e.model.RevisionId,
                };

                var url = "../Document/UpdateDocumentInfoDescriptionAlt";
                $.ajax({
                    type: "POST",
                    url: url,
                    data: attachment,
                    error: function () {
                        displayError(documentMessages.errors.DocumentRevisionAttachmentDescriptionUpdate);
                    },
                    success: function (data) {
                        var errorMessage = parseErrorMessage(data);
                        if (errorMessage) displayError(errorMessage);
                    }
                });
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
                    if (kDatePicker)
                        kDatePicker.value(sDateEntered);
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

        function onDocumentNoteEditSave(e) {

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

        var onDocumentNoteChange = function (e) {
            var documentId = extractReferenceId(this.element.attr('id'));
            var dataItem = this.dataItem(this.select());
            var text = dataItem ? dataItem.Notes : '';
            displayDocumentNote(documentId, text);
        };

        var onDocumentNoteDataBound = function (e) {
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

        var onDocumentContainerClassificationTypeChange = function (e) {
            var documentId = extractReferenceId(this.element.attr('id'));
            if (documentId) {
                var componentGrid = $(documentElementSelectors.grids.DocumentContainerComponents + documentId).data('kendoGrid');
                if (componentGrid) {
                    componentGrid.dataSource.read();
                }
            }
        };

        var onDocumentContainerClassificationTypeRequestStart = function (e) {
            if (e.type == 'read') {
                var documentId = extractDocumentIdFromRequestUrl(this.transport.options.read.url);
                var containerType = $(documentElementSelectors.containers.DocumentDetailsFormExact + documentId).find(documentElementSelectors.dropdownlists.DocumentDetailsContainerType).val();
                this.transport.options.read.data = { containerTypeId: containerType };
            }
        };

        var onDocumentContainerComponentDataBound = function (e) {
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

        var onDocumentStatusHistoryChange = function (e) {
            var documentId = extractReferenceId(this.element.attr('id'));
            var dataItem = this.dataItem(this.select());
            var text = dataItem ? dataItem.Notes : '';
            displayDocumentStatusNote(documentId, text);
        };

        var onDocumentStatusHistoryDataBound = function (e) {
            var documentId = extractReferenceId(this.element.attr('id'));
            displayDocumentStatusNote(documentId, '');
        };

        return {
            getDocumentSearchCriteria: getDocumentSearchCriteria,
            initializeDocumentComponents: initializeDocumentComponents,
            onDocumentContainerClassificationTypeChange: onDocumentContainerClassificationTypeChange,
            onDocumentContainerClassificationTypeRequestStart: onDocumentContainerClassificationTypeRequestStart,
            onDocumentContainerComponentDataBound: onDocumentContainerComponentDataBound,
            onDocumentContainerComponentsRequestStart: onDocumentContainerComponentsRequestStart,
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
            panelbarActivatedAlt: panelbarActivatedAlt,
            readonlyPanelbarActivatedAlt: readonlyPanelbarActivatedAlt,
        };
    };

    $(function () { });

})(jQuery);