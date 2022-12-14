; (function($) {
    if($.fn.compliDocumentAlt==null) {
        $.fn.compliDocumentAlt={};
    }

    $.fn.compliDocumentAlt=function() {

        var attachingFileFor=null;
        var activeComponentId;

        /******************************** Enclosure Variables ********************************/
        var documentAjaxSettings={
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
                ReplaceDocumentRevisionAttachments: "ReplaceDocumentRevisionAttachments",
                UpdateDocumentInfoDescription: "UpdateDocumentInfoDescriptionAlt",
                ClearSessionVariablesDocument: "ClearSessionsVariables",
                GetSupplierName: "GetSupplierName",
                VerifyProductManufacturer: "VerifyProductManufacturer",
                RepublishCurrentRevision: "RepublishCurrentRevision",
                ResetNameNumbersInSession: "ResetNameNumbersInSession",
                GetDocumentTypeInJson: "GetDocumentTypeLookUp"
            },
            contenttype: {
                Json: "application/json; charset=utf-8"
            },
            controllers: {
                Company: "Company",
                Document: "Document",
                Home: "Home",
                Svc: "Svc"
            },
            directory: {
                Operations: "Operations"
            }
        };

        var documentElements={
            BlankListItem: "<li style='display:none'>",
            DocumentNoteRequiredNotes: "<li class='notes-required'>Document - Notes is required</li>",
            DocumentNoteRequiredNoteType: "<li class='note-type-required'>Document - Type is required</li>",
        };

        var documentElementClasses={
            CancelIcon: 'k-i-cancel',
            DisabledButtonLink: 'disabled-link',
            RefreshIcon: 'k-i-refresh',
        };

        var documentElementSelectors={
            advancedControl: {
                AdvancedSearchCtrlData: "AdvanceSearch",
                AdvancedDocumentSearchCtrl: "#documentAdvancedSearchCtrl"
            },
            buttons: {
                DocumentAddContainerComponents: "[id^=btnAddContainerComponent_]",
                DocumentDeleteContainerComponent: ".document-container-delete",
                DocumentDetailsCancel: "[id^=btnDocumentCancel_]",
                DocumentDetailsSave: "[id^=btnDocumentSave_]",
                DocumentDetailsRepublish: "[id^=btnDocumentRepublish_]",
                DocumentNewDocumentCancel: "#btnNewDocumentCancel",
                DocumentNewDocumentSave: "#btnNewDocumentSave",
                DocumentRevisionAddMultipleNameNumbers: ".rev-multinamenum-add",
                DocumentAddMultipleNameNumbers: ".doc-multinamenum-add",
                DocumentRevisionAddNewRevision: "[id^=btnAddDocumentRevision_]",
                DocumentRevisionDetailsAddAttachment: "[id^=addNewFilesBtn_]",
                DocumentRevisionDetailsReplaceAttachment: "[id^=replaceOldFilesBtn_]",
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
                DocumentSearchAdvancedSearchAddNew: "#ad_AddNewDocumentBtn",
                DocumentSearchAdvancedSearchSaveSearch: "#ad_SaveDocumentSearchSettingsBtn",
                DocumentRevisionNewFile: "[id^=addNewFilesBtn_New]",
                DocumentSearchClear: "#clearDocumentBtn",
                DocumentSerachAdvancedSearchClear: "#ad_ClearDocumentBtn",
                DocumentSearchPopUpCancel: "#btnCancelDocumentSearch",
                DocumentSearchPopUpSelect: "#searchDocumentIdSelect",
                DocumentSearchSearch: "#searchDocumentBtn",
                DocumentSearchAdvancedSearch: "#ad_SearchDocumentBtn",
                DocumentSearchSearchSupplier: "#searchDocSupplierIdBtn",   //Replace with ADSupplierSearch
                DocumentSearchSearchManufacturer: "#searchDocManufacturerIdBtn",
                DocumentSearchRevisionDetailsSupplierView: "[id^=viewSearchRevisionSupplierIdBtn]",
                DocumentSearchRevisionDetailsManufacturerView: "[id^=viewSearchRevisionManufacturerIdBtn]",
                DocumentLinkToAllMfrProduct: "#btnAssociatedMfrAllProducts_",
                DocumentAddSibling: "#btnSibling_",
                ConflictingFileUploadClose: "#btnConflictingFileUploadClose",
                CancelReplaceForSelectedRevisions: "#btnCancelReplaceForSelectedRevisions",
                SaveReplaceForSelectedRevisions: "#btnSaveReplaceForSelectedRevisions",
                CreateProduct: "#btnCreateProduct_"
            },
            checkboxes: {
                DocumentDetailsIsMsdsNotRequired: "[id^=IsMsdsNotRequired_]",
                DocumentDetailsIsObsolete: "[id^=IsObsolete_]",
                DocumentDetailsIsPublic: "[id^=IsPublic_]",
                DocumentRevisionDetailsBestImageAvailable: "[id^=BestImageAvailable_]",
                DocumentSearchIncludeDeleted: "[id^=chkIncludeDeletedDocument]",
                DocumentSearchLatestRevision: "[id^=chkLatestRevision]",
                DocumentSearchSupplierIdCheckBox: "[id^=rdMfgId]",
                DocumentIsExposureScenario: "[id^=IsExposureScenario_]"

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
                DocumentNewDocument: "[id^=pnlNewDocument-]",
                DocumentRevisionMultipleNameNumbers: "#mdlMultipleNames",
                ConflictingFileUpload: "mdlConflicingFileUpload",
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
                DocumentRevisionDetailsVerifyDate: "[id^=VerifyDate_]",
                DocumentRevisionDate_New: "#RevisionDate_New",
                DocumentVerifyDate_New: "#VerifyDate_New",
                DocumentRevisionDate_Revision: "#RevisionDate_",
                DocumentVerifyDate_Revision: "#VerifyDate_",
                EpochDateTime: "[id^=EpochLastUpdate_]",
                EpochDateTimeNew: "#EpochLastUpdate_New",
            },
            dropdownlists: {
                DocumentContainerClassificationType: "#ClassificationType_",
                DocumentDetailsContainerTypeExact: "#ContainerTypeId_",
                DocumentDetailsContainerType: "[id^=ContainerTypeId_]",
                DocumentDetailsDocumentTypeExact: "#DocumentTypeId_",
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
  /*              DocumentSearchDateRange: "[id^=ddlDateRange]",*/
                DocumentSupplierNameOperatorDropdown: "[id^=btnDocSupplierNameOperatorDropdown]",
                DocumentManufacturerNameOperatorDropdown: "[id^=btnDocManufacturerNameOperatorDropdown]",

            },
            general: {
                DirtyFields: "input[data-is-dirty=true]",
                DocumentLastUpdatePopOver: "[id^=doc-I-Info-]",
                DocumentRevisionLastUpdatePopOver: "[id^=rev-I-Info-]"
                //DocumentSearchOptions: "input[name=radiogroupTitleSearchOption]",
                //DocumentDateSearchOptions: "input[name=radiogroupDateSearchOption]",
                //DocumentPartNumSearchOptions: "input[name=radiogroupPartNumSearchOption]",
                //DocumentUPCSearchOptions: "input[name=radiogroupUPCSearchOption]",
                //DocumentSupplierNameSearchOptions: "input[name=radiogroupSupplierNameSearchOption]",
                //DocumentManufacturerNameSearchOptions: "input[name=radiogroupManufacturerNameSearchOption]",
                //DocumentAliasSearchOptions: "input[name=radiogroupAliasSearchOption]",
            },
            grids: {
                DocumentContainerComponents: "#gdContainerComponents_",
                DocumentNotes: "#gdDocumentNotes_",
                DocumentRevision: "[id^=gdDocumentRevisions_]",
                DocumentRevisionAttachments: "[id^=gdRevisionFileInfoDetail_]",
                DocumentFromInboundResponse: "#gdDocumentFromInboundResponse",
                DocumentRevisionNameNumbers: "#gdRevisionNameNumber_",
                DocumentSearch: "#gdSearchDocument",
               /* DocumentSearchPopUp: "#gdSearchDocumentPopUp",*/
                DocumentStatusHistory: "#gdSupplierStatusHistory_",
                DocumentProduct: "#gdDocumentProduct_",
                NonDocumentProduct: "#gdNonDocumentProduct_",
                DocumentSibling: "#gdDocumentSibling_",
                DocumentStatusHistory: "#gdSupplierStatusHistory_",
                ProductAliasGrid: "#gdProductAlias_",
            },
            hidden: {
                DocumentDetailsStatusNotes: "[id^=hdnStatusNotes_]",
                DocumentRevisionNameNumberDocument: "#hdnMultipleNameDocument",
                DocumentRevisionNameNumberRevision: "#hdnMultipleNameRevision",
                DocumentRevisionDetailsRevisionObtainmentWorkitemId: "[id^=RevisionObtainmentWorkitemId_]",
                DocumentRevisionNameNumberSession: "#hdnNameNumberSession"
            },
            radiobuttons: {
                DocumentRevisionDetailsIsBadImage: "[id^=IsBadImage_]",
                DocumentRevisionDetailsIsGoodImage: "[id^=IsGoodImage_]",
                DocumentRevisionDetailsReplicateIndexationData: "[id^=ReplicateIndexationData_]",
                DocumentRevisionDetailsAutomateIndexationData: "[id^=AutomateIndexationData_]",
            },
            image: {
                MsdsOcrImageNew: "#MsdsOcr_New",
                MsdsOcrImage: "[id^=MsdsOcr_]",
                EmojiHappy_New: "#EmojiHappy_New",
                EmojiSad_New: "#EmojiSad_New",
                EmojiConfuse_New: "#EmojiConfuse_New",
                MsdsOcrImageRevision: "#MsdsOcr_Revision",
                EmojiHappy_Revision: "#EmojiHappy_Revision",
                EmojiSad_Revision: "#EmojiSad_Revision",
                EmojiConfuse_Revision: "#EmojiConfuse_Revision"
            },
            textboxes: {
                DocumentDetailsDocumentId: "[id^=DocumentId_]",
                DocumentNotes: "#Notes",
                DocumentRevisionDetailsDocumentId: "[id^=RevisionDocumentId_]",
                DocumentRevisionDetailsDocumentIdentification: "[id^=DocumentIdentification_]",
                DocumentRevisionDetailsDocumentVersion: "[id^=DocumentVersion_]",
                DocumentRevisionDetailsRevisionId: "[id^=RevisionId_]",
                DocumentRevisionDetailsCloneOfRevisionId: "[id^=CloneOfRevisionId_]",
                DocumentRevisionDetailsManufacturerId: "[id^=txtManufacturerId_]",
                DocumentRevisionDetailsRevisionTitle: "[id^=RevisionTitle_]",
                DocumentRevisionDetailsSupplierId: "[id^=txtSupplierId_]",
                DocumentRevisionMultipleNameNumbers: "#txtNamesNumbers",
                DocumentSearchDocumentId: "[id^=txtSearchDocumentId]",
                DocumentSearchPartNumber: "[id^=txtSearchPartNumber]",
                DocumentSearchRevisionTitle: "[id^=txtRevisionTitle]",
                DocumentSearchDocumentAlias: "[id^=txtDocumentAlias]",
                DocumentSearchSupplierId: "[id^=txtSearchSupplierId]",
                DocumentSearchSupplierName: "[id^=txtDocSearchSupplierName]",
                DocumentSearchManufacturerId: "[id^=txtSearchManufacturerId]",
                DocumentSearchManufacturerName: "[id^=txtDocSearchManufacturerName]",
                DocumentSearchUPC: "[id^=txtSearchUPC]",
                DocumentShowAllResults: "[id^=ShowAllResults]",
                DocumentAssociatedProduct: "#lblTotalAssociatedProduct_",
                DocumentType: "#hdnDocAssoMfrAllProducts_",
                DocumentUnAssociatedProduct: "#lblTotalUnAssociatedProduct_",
                DocumentSearchResultTotal: "#lblDocumentSearchResultTotal",
                DocumentSearchFiltering: "#lblDocumentSearchFilter",
                DocumentExposureScenarioStartingPage: "[id^=ExposureScenarioStartingPage_]",
                DocumentRevisionTitle_New: "#RevisionTitle_New",
                DocumentIdentification_New: "#DocumentIdentification_New",
                DocumentVersion_New: "#DocumentVersion_New",
                DocumentManufacturerId_New: "#txtManufacturerId_New",
                DocumentSupplierId_New: "#txtSupplierId_New",
                DocumentRevisionTitle_Revision: "#RevisionTitle_",
                DocumentIdentification_Revision: "#DocumentIdentification_",
                DocumentVersion_Revision: "#DocumentVersion_",
                DocumentManufacturerId_Revision: "#txtManufacturerId_",
                DocumentSupplierId_Revision: "#txtSupplierId_",
                DocumentStatus: "#hdnDocAssoMfrAllProductsDocStatusId_",
            },
            label: {
                DocumentLinkToAllMfrProductWarning: "#lblDuplicateAssociation_",
            }
        };

        var controllerCalls={
            RemoveProductDocumentsWithoutCheckDuplicate: GetEnvironmentLocation()+"/Configuration/ProductManager/RemoveProductDocumentsWithoutCheckDuplicate",
            AssociateDocumentToAllManufacturerProducts: GetEnvironmentLocation()+"/Configuration/ProductManager/AssociateDocumentAllItsManufacturerProducts",
            IsManufacturerProductionSelectionValid: GetEnvironmentLocation()+"/Operations/Document/IsManufacturerProductionSelectionValid",
            AddDocumentSibling: GetEnvironmentLocation()+"/Operations/Document/AddDocumentSibling",
            AddExistDocumentAsSibling: GetEnvironmentLocation()+"/Operations/Document/AddExistDocumentAsSibling",
            GetSiblingList: GetEnvironmentLocation()+"/Operations/Document/GetSiblingDocumentList",
            LoadSingleDocument: GetEnvironmentLocation()+"/Operations/Document/DocumentMainAlt?",
            IsDocumentExist: GetEnvironmentLocation()+"/Operations/Document/IsDocumentExist",
            DocumentContainerComponentsCount: GetEnvironmentLocation()+"/Operations/Document/DocumentContainerComponentsCount",
            GetSupplierOrDocumentLevelAccessibility: GetEnvironmentLocation()+"/Operations/Document/GetSupplierOrDocumentLevelAccessibility",
            SetSupplierOrDocumentLevelAccessibility: GetEnvironmentLocation()+"/Operations/Document/SetSupplierOrDocumentLevelAccessibility",
            GetDpeRevisionIndexationAsync: GetEnvironmentLocation()+"/Operations/Document/GetDpeRevisionIndexationAsync",
            GetAsynchData: GetEnvironmentLocation()+"/Operations/Document/GetAsynchData",
            RetrieveLatestDocumentRevision: GetEnvironmentLocation()+"/Operations/Document/RetrieveLatestDocumentRevision",
            GetIndexationDataForInboundAttachment: GetEnvironmentLocation()+"/Operations/Document/GetIndexationDataForInboundAttachment",
            DoLookUpSupplierOnKeyEnter: GetEnvironmentLocation()+"/Operations/Company/LookUpSupplierOnKeyEnter",
            DeleteDocumentRevision: GetEnvironmentLocation()+"/Operations/Document/DeleteRevisionAllowAsynch",
            GetSupplierName: GetEnvironmentLocation()+"/Operations/Company/GetSupplierName",
            DocumentSiblingChainingVerify: GetEnvironmentLocation()+"/Operations/Document/DocumentSiblingChainingVerify",
            ReplaceFileForRevisionSiblings: GetEnvironmentLocation()+"/Operations/Document/ReplaceFileForRevisionSiblings",
            DocumentDeleteNameAndNumberPair: GetEnvironmentLocation()+"/Operations/Document/DeleteNameAndNumberMultiPair",
            ProductSearch: GetEnvironmentLocation()+"/Operations/Document/GetProductResult",
            CreateProductFromDocumentAssociatedProductSection: GetEnvironmentLocation()+"/Operations/Document/CreateProductFromDocumentAssociatedProductSection",
            DocumentRoamingProfileSave: "/Operations/Document/SaveDocumentSearchSettings",
            DocumentRoamingProfileRetrieve: "/Operations/Document/RetrieveDocumentSearchSettings",
        }

        var documentMessages={
            errors: {
                AddNewDocumentPopup: "An error occured displaying the add new document screen. Please container you adminstrator.",
                AddNewRevisionPopup: "An error occured displaying the add new revision screen. Please container you adminstrator.",
                CompanyViewError: "An error occurred displaying the selected company. Please review you selection and try again.",
                ConfirmationDateFuture: "Invalid verify date, it can't be a future date.",
                ConfirmationDateGreaterThanRevisionDate: "Invalid verify date, it must be greater than or equal to revision date.",
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
                RevisionDateLessThanConfirmationDate: "Invalid  revision date, it must be less than or equal to verify date.",
                SaveDocumentError: "Saving the document could not be completed. Please review your changes and try again.",
                SaveDocumentContainerComponent: "Saving the document container component could not be complete. Please try again.",
                SaveDocumentRevisionError: "Save the document revision could not be completed. Please review your changes and try again.",
                SaveNewDocumentAttachmentError: "New documents cannot be created without an attachment. Add an attachment and please try again.",
                SaveNewDocumentError: "Save the new document could not be completed. Please review you changes and try again.",
                SaveNewDocumentRevisionAttachmentError: "New revisions cannot be created without an attachment. Add an attachment and please try again.",
                KitsComponentsTotalError: "This component can not be removed, kits must have two or more components",
                GettingDataSourceError: "Error while retrieving data...",
                InvalidVerifyDate: "Invalid verify date, it can't be less than 1/1/1979.",
                InvalidRevisionyDate: "Invalid revision date, it can't be less than 1/1/1979.",
            },
            modals: {
                GeneralConfirm: "Confirmation Required",
                DocumentDeleteContainerComponentHeader: "Delete Container Component Confirmation",
                DocumentDeleteContainerComponentMessage: "Are you sure you want to remove this component?",
                DocumentDiscardChangesHeader: "Discard Document Changes",
                DocumentDiscardChangesMessage: "You are going to discard your document changes. Are you sure you would like to continue?",
                DocumentNewDocumentDiscardChangesHeader: "Discard New Document Changes",
                DocumentNewDocumentDiscardChangesMessage: "You are going to discard your document changes. Are you sure you would like to continue?",
                DocumentRevisionDeleteAttachmentHeader: "Delete Attachment Confirmation",
                DocumentRevisionDeleteAttachmentMessage: "Are you sure you want to delete this file?",
                DocumentRevisionDiscardChangesHeader: "Discard Revision Changes",
                DocumentRevisionDiscardChangesMessage: "You are going to discard your revision changes. Are you sure you would like to continue?",
                SaveRevisionWothoutAttachment: "Are you sure you want to save revision without attachment?",
                PrivateAccessForDocument: "This document is being marked private. Only documents marked public will be searchable on certain client systems.",
                PublicAccessForDocument: "This document is being marked public. Only Documents marked public will be searchable on certain client systems.",
                DocumentAccessConfirmation: "Document access change confirmation.",
                RevisionAttachmentReplacementConfirmation: "Revision attachment replacement confirmation.",
                NullRevisionConfirmTitle: "Confirm for null revision date",
                NullRevisionConfirmMessage: "The revision date is blank; if you wish to proceed with this save press Confirm<br/> or hit Cancel to enter the missed revision date.",
                SiblingCascadingConfirmTitle: "Sibling Cascading Warning",
                SiblingCascadingConfirmMessage: "This action will be applied to {0} siblings.  Do you wish to proceed?",
                DocumentRevisionNameNumbers: "Are you sure you want to delete all selected record(s)?"
            },
            success: {
                DocumentRevisionAttachmentsSaved: "Attachments Saved",
                DocumentRevisionAttachmentsReplaced: "Attachment Replaced",
                DocumentRevisionMultipleNameNumbersSaved: "Items Saved Successful",
                DocumentRevisionSaved: "Revision Saved",
                DocumentSaved: "Document Saved",
            },
            warnings: {
                DocumentRevisionAttachments: "Reminder: No attachment has been provided for this document.",
                UnlinkDocumentFromProudct: "Are you sure you want to remove the above document from ths product?",
                ConfirmDeleteRevision: "Are you sure you want to delete this revision?",
                LinkDocumentToAllMfrProudct: "Are you sure you want to link the document to first N product(s) from the list?",
                InvalidManufacturerSelection: "Invalid Manufacturer Selection. Proceed nevertheless ?",
                IncompleteKitsReminder: "This is reminder: A valid kit must have at least two components.",
                IncompleteKitsReminderRedirect: "A valid kit must have at least two components. You will be redirect to add components first.",
                OcrSilverLevelIndexData: "Do you want to the automated silver level indexation run to extract data for you?",
                DocumentRevisionNameNumbers: "No items have been selected.",
                LeastCriteriaFilter: "A filter must be selected to execute a search."
            }
        };

        let dpeFields={
            fields: {
                New: {
                    RevisionTitle: documentElementSelectors.textboxes.DocumentRevisionTitle_New,
                    DocumentIdentification: documentElementSelectors.textboxes.DocumentIdentification_New,
                    DocumentVersion: documentElementSelectors.textboxes.DocumentVersion_New,
                    RevisionDate: documentElementSelectors.datepickers.DocumentRevisionDate_New,
                    //ConfirmationDate: documentElementSelectors.datepickers.DocumentVerifyDate_New,
                    ManufacturerId: documentElementSelectors.textboxes.DocumentManufacturerId_New,
                    SupplierId: documentElementSelectors.textboxes.DocumentSupplierId_New,
                    DpeManufacturerName: "DpeManufacturerName",
                    DpeSupplierName: "DpeManufacturerName"
                },
                Revision: {
                    RevisionTitle: documentElementSelectors.textboxes.DocumentRevisionTitle_Revision,
                    DocumentIdentification: documentElementSelectors.textboxes.DocumentIdentification_Revision,
                    DocumentVersion: documentElementSelectors.textboxes.DocumentVersion_Revision,
                    RevisionDate: documentElementSelectors.datepickers.DocumentRevisionDate_Revision,
                    //ConfirmationDate: documentElementSelectors.datepickers.DocumentVerifyDate_Revision,
                    ManufacturerId: documentElementSelectors.textboxes.DocumentManufacturerId_Revision,
                    SupplierId: documentElementSelectors.textboxes.DocumentSupplierId_Revision,
                    DpeManufacturerName: "DpeManufacturerName",
                    DpeSupplierName: "DpeManufacturerName"
                },
                Resequence: function(inFields,sequenceId,versionId) {
                    var outFields={};
                    $.each(inFields,function(key,element) {
                        //newFields.push({ key: element + '_' + sequenceId
                        outFields[key]=element+sequenceId+'_'+versionId;
                    });
                    return outFields;
                }
            }
        };

        var dpeFieldsStatus={
            IncludeRevisionTitle: false,
            IncludeRevisionVersion: false,
            IncludeRevisionIdentification: false,
            IncludeRevisionDate: false,
            //IncludeVerifiyDate: false,
            IncludeManufacturerId: false,
            IncludIdSupplierId: false,
        };

        var keyCodeValues={
            Enter: 13,
            V: 86,
            ctrlKeyState:
            {
                Pressed: false
            }
        };


        /******************************** Local Methods ********************************/
        function changeContainerButtonDirtyStatusLayout(container,saveSelector,cancelSelector,saveFunc,changeCancelBtn) {
            //Jira Ticket: TRECOMPLI-4428 Done by Vivek: Save button should not be activate/deactivate on name number grid check box selection 5/Jan/2022.
            var newDocumentNameNumberGridCheckbox=false;
            var revisionNameNumberGridcheckbox=false;
            var nameNumberGridCheckboxSelected=false;
            newDocumentNameNumberGridCheckbox=$(container.context.activeElement).hasClass('chkMasterMultiSelect')||$(container.context.activeElement).hasClass('chkMultiSelect')? true:false;
            revisionNameNumberGridcheckbox=$(container.context).hasClass('chkMasterMultiSelect')||$(container.context).hasClass('chkMultiSelect')? true:false;
            nameNumberGridCheckboxSelected=newDocumentNameNumberGridCheckbox==true||revisionNameNumberGridcheckbox==true? true:false;

            if(container!=null&&container.length>0) {
                var saveBtn=container.find(saveSelector);
                var cancelBtn=container.find(cancelSelector);
                if(saveBtn.length>0&&cancelBtn.length>0) {
                    var containerDirty=isContainerFieldsDirty(container);
                    var cancelBtnAddClass=containerDirty==true? documentElementClasses.CancelIcon:documentElementClasses.RefreshIcon;
                    var cancelBtnRemoveClass=containerDirty==true? documentElementClasses.RefreshIcon:documentElementClasses.CancelIcon;
                    var cancelBtnText=containerDirty==true? 'Cancel':'Reload';
                    var saveBtnAddClass=containerDirty==true? null:documentElementClasses.DisabledButtonLink;
                    var saveBtnFunc=containerDirty==true? saveFunc:onDisabledButtonClick;
                    var saveBtnRemoveClass=containerDirty==true? documentElementClasses.DisabledButtonLink:null;

                    if(!nameNumberGridCheckboxSelected==true) {
                        saveBtn.off('click');
                        saveBtn.on('click',saveBtnFunc);
                        saveBtn.removeClass(saveBtnRemoveClass);
                        saveBtn.addClass(saveBtnAddClass);
                    }

                    if(changeCancelBtn==true&&!nameNumberGridCheckboxSelected==true) {
                        var cancelBtnParts=$.parseHTML(cancelBtn.html());
                        $(cancelBtnParts[0]).removeClass(cancelBtnRemoveClass).addClass(cancelBtnAddClass);
                        cancelBtnParts[1]=cancelBtnText;
                        cancelBtn.html(cancelBtnParts[0].outerHTML+cancelBtnParts[1]);
                    }
                }
            }
        }

        function clearContainerDirtyFlags(container,setValueFunc,changeLayoutFunc) {
            if(container) {

                container.find('input[data-is-dirty=true]').each(function() {
                    var field=this;
                    if(setValueFunc) setValueFunc(field);

                    field.removeAttribute('data-is-dirty');
                });

                if(changeLayoutFunc) changeLayoutFunc(container);
            }
        }

        function displayConfirmationModal(settings,yesFunc,noFunc) {
            if(DisplayConfirmationModal)
                DisplayConfirmationModal(settings,yesFunc,noFunc);
            else {
                var confirmResult=confirm(settings.message);
                if(confirmResult==true&&yesFunc)
                    yesFunc();
                else if(confirmResult==false&&noFunc)
                    noFunc();
            }
        }

        function displayCreatedMessage(message) {
            $(documentElementSelectors.containers.CreatedMessage).fadeIn(500).delay(1000).fadeOut(400).html(message);
        }

        function displayError(message,isShowMoreContent) {
            //kendo.alert(message);
            //if (onDisplayError)
            //    onDisplayError(message);

            //else
            //    kendo.alert(message);
            // changes by nitin to add title
            if(isShowMoreContent) {
                $("<div></div>").kendoAlert({
                    title: "Error",
                    content: message,
                    width: '800px'
                }).data("kendoAlert").open();
            } else {
                $("<div></div>").kendoAlert({
                    title: "Error",
                    content: message,
                }).data("kendoAlert").open();
            }

            setTimeout(function() {
                $('.collapse').on('show.bs.collapse',function() {
                    $('#lbl_showMore').text('Show Less <<');
                });

                $('.collapse').on('hide.bs.collapse',function() {

                    $('#lbl_showMore').text('Show More >>');
                });
            },500)
        }

        function extractReferenceId(value) {
            if(value) {
                var parts=value.split('_');
                if(parts.length>=2) {
                    var convertedValue=parseInt(parts[parts.length-1]);
                    return isNaN(convertedValue)? null:convertedValue;
                }
            }

            return null;
        }

        function generateActionUrl(controller,action) {
            if(controller&&action)
                return "../"+controller+"/"+action;

            return null;
        }

        function isContainerFieldsDirty(container) {
            var isDirty=container? container.find(documentElementSelectors.general.DirtyFields).length>0:false;
            return isDirty;
        }

        function onCompanyIdFieldKeyUp(e) {
            if(onKeyPressEnter) {
                onKeyPressEnter(e,function() {
                    var companyId=e.target.value;
                    if(IsNumeric&&IsNumeric(companyId)) {

                        if(generateLocationUrl) {
                            var requestUrl=documentAjaxSettings.directory.Operations+"/"+documentAjaxSettings.controllers.Company+"/"+documentAjaxSettings.actions.LookUpSupplierOnKeyEnter;
                            requestUrl=generateLocationUrl(requestUrl);
                            $.post(requestUrl,{ supplierInfo: companyId },function(data) {
                                $(e.target).val(data);
                            });
                        }

                        var id=$(e.currentTarget).attr("id");

                        // if we are adding a new document set the public flag to the same visibility
                        // as is set at the supplier level. if the manufacturer is set at the revision
                        // level, do not make any changes. changes for revisions will be handled only
                        // at the document level

                        if(id.toLowerCase().indexOf("_new")>0) {

                            $.post(controllerCalls.GetSupplierOrDocumentLevelAccessibility,{ supplierId: companyId },function(data) {
                                id=id.replace("txtSupplierId_","#IsPublic_");
                                $(id).prop("checked",data.IsPublic);
                            });
                        }

                    }

                });
            }
        }

        function DoLookUpSupplierOnKeyEnter(cntrlid) {
            //var url = '@Url.Action("LookUpSupplierOnKeyEnter", "Company", new {Area = "Operations"})';
            var url='../Company/LookUpSupplierOnKeyEnter';
            url=controllerCalls.DoLookUpSupplierOnKeyEnter;
            var supplierInfo=$(cntrlid).val();
            $.post(url,{ supplierInfo: supplierInfo },function(data) {
                $(cntrlid).val(data);
            });
        }


        function onDisabledButtonClick(e) {
            e.preventDefault();
        }

        function onDocumentDetailsRepublishClick(e) {
            var documentId=parseInt(e.currentTarget.id.split("_")[1]);

            var url=generateActionUrl(documentAjaxSettings.controllers.Document,documentAjaxSettings.actions.RepublishCurrentRevision);

            $.post(url,{ documentId: documentId },function(data) {
                $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Document republished.");
            });

        }

        function onInputFieldChange(e) {
            var element=$(e.currentTarget);
            var defaultValue=element.is(':checkbox, :radio')? element[0].defaultChecked:element[0].defaultValue;

            var currentValue=null;
            if(element.is(':checkbox, :radio'))
                currentValue=element[0].checked;
            else if(element.data('kendoDropDownList')) {
                var ddl=element.data('kendoDropDownList');
                currentValue=ddl.value()&&ddl.value().length>0? ddl.value():"0";
            } else
                currentValue=element.val();

            if(defaultValue!=currentValue)
                element.attr('data-is-dirty',true);
            else
                element.removeAttr('data-is-dirty');
        }

        function parseErrorMessages(data) {

            var errorMessages=[];
            if(data&&data.Errors) {

                var keys=Object.keys(data.Errors);

                for(var idx=0;idx<keys.length;idx++) {
                    var errorobj=data.Errors[keys[idx]];
                    if(errorobj.errors&&errorobj.errors.length>0) {
                        errorMessages.push(errorobj.errors[0]);
                    }
                }
            }

            return errorMessages;

        }

        function parseErrorMessage(data) {

            var errorMessage='';
            if(data&&data.Errors) {

                var keys=Object.keys(data.Errors);
                for(var idx=0;idx<keys.length;idx++) {
                    var errorobj=data.Errors[keys[idx]];
                    if(errorobj.errors&&errorobj.errors.length>0) {
                        errorMessage=errorobj.errors[0];
                        break;
                    }
                }
            }

            return errorMessage;
        }

        function revertContainerFieldValues(container,changeLayoutFunc) {
            clearContainerDirtyFlags(container,revertFieldValue,changeLayoutFunc);
        }

        function revertFieldValue(field) {
            if(field.getAttribute('type')=='checkbox')
                field.checked=field.defaultChecked;
            else if(field.getAttribute('type')=='radio') {
                $(field).parents('form').find('input[name="'+field.getAttribute('name')+'"]').each(function(index,data) {
                    data.checked=data.defaultChecked;
                });

            } else if(field.getAttribute('data-role')=='dropdownlist') {
                var ddl=$(field).data('kendoDropDownList');
                if(ddl) {

                    var fieldDefault=field.defaultValue.length==0? "0":field.defaultValue;
                    ddl.select(function(dataItem) {
                        var dvalue=dataItem.Value.length==0? "0":dataItem.Value;
                        return dvalue==fieldDefault;
                    });

                    ddl.trigger("change");
                }
            } else
                field.value=field.defaultValue;
        }

        function setContainerFieldDefaultValues(container,changeLayoutFunc) {
            clearContainerDirtyFlags(container,setFieldDefaultValue,changeLayoutFunc);
        }

        function setFieldDefaultValue(field) {
            if(field.getAttribute('type')=='checkbox'||field.getAttribute('type')=='radio')
                field.defaultChecked=field.checked;
            else
                field.defaultValue=field.value;
        }

        /******************************** Search Methods ********************************/
        function performDocumentSearch() {
            var adDocumentSearchCtl=$(documentElementSelectors.advancedControl.AdvancedDocumentSearchCtrl).data(documentElementSelectors.advancedControl.AdvancedSearchCtrlData);
            if(typeof adDocumentSearchCtl=='undefined')
                return;

            if($.isEmptyObject(adDocumentSearchCtl.MappedCriterias())) {
                kendo.alert(documentMessages.warnings.LeastCriteriaFilter);
                return;
            }

            var searchGrid=$(documentElementSelectors.grids.DocumentSearch).data('kendoGrid');
            searchGrid.dataSource.data([]);
            searchGrid.dataSource.page(1);
        }


        function onDocumentSearchAddNewBtnClick(e) {
            e.preventDefault();

            var container=$(documentElementSelectors.containers.NewDocument);
            container.off('click',documentElementSelectors.buttons.DocumentAddMultipleNameNumbers);
            container.on('click',documentElementSelectors.buttons.DocumentAddMultipleNameNumbers,onDocumentAddMultipleNameNumbersBtnClick);
            if(container.length>0) container.show(500);

            clearNewDocumentNameNumberGrid();

        }

        function onDocumentSearchClearBtnClick(e) {
            e.preventDefault();

            var adDocumentSearchCtl=$(documentElementSelectors.advancedControl.AdvancedDocumentSearchCtrl).data(documentElementSelectors.advancedControl.AdvancedSearchCtrlData);
            if(typeof adDocumentSearchCtl!='undefined') {
                adDocumentSearchCtl.ClearData();
            }

            // hide filter and count
            $(documentElementSelectors.textboxes.DocumentSearchResultTotal).text("&nbsp;");
            $(documentElementSelectors.textboxes.DocumentSearchResultTotal).css({ "visibility": "hidden" });
            $(documentElementSelectors.textboxes.DocumentSearchFiltering).text("&nbsp;");
            $(documentElementSelectors.textboxes.DocumentSearchFiltering).css({ "visibility": "hidden" });

            var searchGrid=$(documentElementSelectors.grids.DocumentSearch).data('kendoGrid');
            if(searchGrid&&searchGrid.dataSource) {
                //4/20/2022 Vikas - [TRECOMPLI 4530] No need of below statement.
                //searchGrid.dataSource.filter({});
                $("form.k-filter-menu button[type='reset']").trigger("click");
                searchGrid.dataSource.data([]);
            }
        }


        function onDocumentSearchAdvancedSearchBtnClick(e) {
            e.preventDefault();
            performDocumentSearch();
        };

        function onAdvanedSearchCallBack(e) {
            performDocumentSearch();
        }

        function RestoreAdvanceSearchFromRoamingProfile(sender) {
            var documentId=getQueryVariable("documentId");  //Only restore without subsequent search
            if(documentId!=null) {
                sender.CallBackSearch(sender.ColumnMapName('Document ID'),documentId);
            }
            else {
                var url=GetEnvironmentLocation()+controllerCalls.DocumentRoamingProfileRetrieve;
                $(this).ajaxCall(url)
                    .success(function(SearchDefault) {
                        if(SearchDefault!="") {
                            var dsObject=JSON.parse(SearchDefault);
                            sender.SetData(dsObject);
                        }
                    }).error(function(error) {
                        $(this).displayError(error);
                    });
            }
        };

        function onDocumentSearchSaveSearchClick(e) {
            var adDocumentSearchCtl=$(documentElementSelectors.advancedControl.AdvancedDocumentSearchCtrl).data(documentElementSelectors.advancedControl.AdvancedSearchCtrlData);
            if(typeof adDocumentSearchCtl!='undefined') {
                var searchDataSource=adDocumentSearchCtl.DataSource();

                var url=GetEnvironmentLocation()+controllerCalls.DocumentRoamingProfileSave;
                $(this).ajaxCall(url,{ searchDataSource: JSON.stringify(searchDataSource) })
                    .success(function(successData) {
                        if(successData.success==true) {
                            $(this).savedSuccessFully("Saved Successfully");
                        }
                    }).error(function(error) {
                        $(this).displayError(error);
                    });
            }
        };


        function InitializeDocumentSearchAdvancedSearch() {
            var adDocumentSearchCtl=$(documentElementSelectors.advancedControl.AdvancedDocumentSearchCtrl).data(documentElementSelectors.advancedControl.AdvancedSearchCtrlData);
            if(typeof adDocumentSearchCtl=='undefined') {
                advanceSearchDataSource.DocumentSearchColumn.read().then(function() {
                    advanceSearchDataSource.Operators.read().then(function() {
                        adDocumentSearchCtl=$(documentElementSelectors.advancedControl.AdvancedDocumentSearchCtrl).advancedsearch({
                            selectedColumnDataSource: advanceSearchDataSource.DocumentSearchColumn.view(),
                            selectedOperatorDataSource: advanceSearchDataSource.Operators.view(),
                            selectedDataSourceUrl: GetEnvironmentLocation()+"/"+advanceSearchDataSourceSettings.controllers.Svc+"/",
                            searchCallBack: onAdvanedSearchCallBack,
                            ExtendWidth: true
                        });
                        $(documentElementSelectors.advancedControl.AdvancedDocumentSearchCtrl).data(documentElementSelectors.advancedControl.AdvancedSearchCtrlData,adDocumentSearchCtl);
                        //Initial default value or restore roaming profile
                        RestoreAdvanceSearchFromRoamingProfile(adDocumentSearchCtl);
                    });
                });
            }
        };

        //function onDocumentSearchSearchSupplierBtnClick(e) {
        //    e.preventDefault();

        //    var buttonElement = $(e.currentTarget);
        //    if (displaySupplierPopUp) {
        //        displaySupplierPopUp(function (data) {

        //            var siblingSelector = getCompanyTextFieldSibling(buttonElement);
        //            if (siblingSelector) {
        //                var companyInfo = getCompanyTemplate ? getCompanyTemplate(data.CompanyId, data.Name) : data.CompanyId + ', ' + data.Name;
        //                buttonElement.siblings(siblingSelector + ":first").val(companyInfo).trigger('change');
        //            }
        //        });
        //    }
        //}

        function updateDocumentSearchResultTotal(model) {
            $(documentElementSelectors.textboxes.DocumentSearchResultTotal).css({ "visibility": "hidden" });
            $(documentElementSelectors.textboxes.DocumentSearchResultTotal).text("");

            var url=GetEnvironmentLocation()+'/Document/GetDocumentResultCount';
            $(this).ajaxCall(url,{ searchCriteria: JSON.stringify(model) })
                .success(function(result) {
                    if(result&&result.Message&&result.Message.trim()!="") {
                        $(documentElementSelectors.textboxes.DocumentSearchResultTotal).text(result.Message);
                        $(documentElementSelectors.textboxes.DocumentSearchResultTotal).css({ "visibility": "" });
                    }
                }).error(function(error) {
                    $(this).displayError(error);
                });
        };



        var getDocumentSearchCriteria=function(e) {
            var model=null;

            var asDocumentCtrl=$(documentElementSelectors.advancedControl.AdvancedDocumentSearchCtrl).data(documentElementSelectors.advancedControl.AdvancedSearchCtrlData);
            if(typeof asDocumentCtrl=='undefined'||asDocumentCtrl===null)
                return { searchCriteria: {} };
            else {
                model=asDocumentCtrl.MappedCriterias();
            }
            //updateDocumentSearchResultTotal(JSON.stringify(model));
            if(model!=null)
                updateDocumentSearchResultTotal(model);

            return model;
        };



        //var onDocumentMainPanelActivate=function() {
        //    this.element.on('keyup',documentElementSelectors.textboxes.DocumentSearchDocumentId,onDocumentSearchFieldKeyUp);
        //    this.element.on('keyup',documentElementSelectors.textboxes.DocumentSearchPartNumber,onDocumentSearchFieldKeyUp);
        //    this.element.on('keyup',documentElementSelectors.textboxes.DocumentSearchRevisionTitle,onDocumentSearchFieldKeyUp);
        //    this.element.on('keyup',documentElementSelectors.textboxes.DocumentSearchSupplierId,onCompanyIdFieldKeyUp);
        //    this.element.on('keyup',documentElementSelectors.textboxes.DocumentSearchManufacturerId,onCompanyIdFieldKeyUp);
        //    this.element.on('keyup',documentElementSelectors.textboxes.DocumentSearchUPC,onDocumentSearchFieldKeyUp);

        //    $(documentElementSelectors.grids.DocumentSearch).show(500);
        //};

        var onAdvancedSearchDocumentMainPanelActivate=function() {
            this.element.on('click',documentElementSelectors.buttons.DocumentSearchAdvancedSearchAddNew,onDocumentSearchAddNewBtnClick);
            this.element.on('click',documentElementSelectors.buttons.DocumentSerachAdvancedSearchClear,onDocumentSearchClearBtnClick);
            this.element.on('click',documentElementSelectors.buttons.DocumentSearchAdvancedSearch,onDocumentSearchAdvancedSearchBtnClick);
            this.element.on('click',documentElementSelectors.buttons.DocumentSearchAdvancedSearchSaveSearch,onDocumentSearchSaveSearchClick);

            InitializeDocumentSearchAdvancedSearch();

            $(documentElementSelectors.grids.DocumentSearch).show(500);
        };


        //var onDocumentMainPanelActivateReadOnly=function() {
        //    // TODO: Add code to modify the UI to be read only
        //    $(documentElementSelectors.grids.DocumentSearch).show(500);
        //};

        var onDisplayNewDocumentPopUp=function(pKey) {
            displayAddNewDocumentPopUp(pKey);
        }

        var DocumentRowSelect=function(e) {
            var dataItem=$(documentElementSelectors.grids.DocumentSearch).data("kendoGrid").dataItem(this);
            if(e.ctrlKey) {
                var currenturl=window.location.href;
                var indexArea=currenturl.substring(0,currenturl.indexOf('Document'));
                // Vikas-10/22/2020  Ctrl + Click on one of row in document main search result grid and open IntelliForm for SDS and same old Indexation page for non-Sds document
                if(dataItem.DocumentTypeId==3) {
                    var url=indexArea+"IntelliForms/LoadIntelliForm?documentId="+dataItem.ReferenceId+"&revisionId="+dataItem.RevisionId+"&documentTypeId="+dataItem.DocumentTypeId;
                } else {
                    var url=indexArea+"Indexation/SelectIndexingType?documentId="+dataItem.ReferenceId+"&revisionId="+dataItem.RevisionId;
                }
                window.open(url,"_blank");
            }
        }

        function parseFilters(filters,fields) {
            Array.from(filters.filters).forEach((i,e) => {
                if(i.field===undefined)
                    parseFilters(i,fields);
                else
                    fields.push(i);
            });

        }

        var onRevisionDataBound=function(e) {
            if(keyCodeValues.ctrlKeyState.Pressed) {
                var grid=$("#"+this.wrapper.closest("[data-role=grid]").get(0).id).data("kendoGrid");
                grid.table.kendoDraggable({
                    filter: "tbody > tr",
                    group: "target-group",
                    threshold: 100,
                    hint: function(e) {
                        return $('<div class="span6 k-grid k-widget"><table><tbody><tr>'+e.html()+'</tr></tbody></table></div>');
                    }
                });
            }

            var grid=$("#"+this.wrapper.closest("[data-role=grid]").get(0).id).data("kendoGrid");
            var dataSource=grid.dataSource;

            if(dataSource.total()==1) {
                //Not using this column instead using Command.Destroy 
                //grid.hideColumn("Actions");

                //Hide the Command.Destroy button if there is only one revision
                var gridData=grid.dataSource.view();
                for(var i=0;i<gridData.length;i++) {
                    var gridItem=gridData[i];
                    var currenRow=grid.table.find("tr[data-uid='"+gridItem.uid+"']");
                    var deleteButton=$(currenRow).find(".k-grid-delete");
                    deleteButton.hide();
                }
            }
        }

        //var hideRevisionDeleteButton = function(e) {
        //    var grid = $("#" + this.wrapper.closest("[data-role=grid]").get(0).id).data("kendoGrid");
        //    var dataSource = grid.dataSource;

        //    if (dataSource.total() == 1) {
        //        return true;
        //    }

        //    return false;
        //}


        var onDataBound=function(e) {
            // remove filtering details
            $(documentElementSelectors.textboxes.DocumentSearchFiltering).text("");
            $(documentElementSelectors.textboxes.DocumentSearchFiltering).css({ "visibility": "hidden" });

            var searchGrid=$(documentElementSelectors.grids.DocumentSearch);
            searchGrid.find("tr").click(DocumentRowSelect);

            var documentId=getQueryVariable("documentId");
            if(documentId!=null) {
                var rowCount=$('#gdSearchDocument  tr.k-master-row').length;
                if(rowCount==1) {
                    this.expandRow(this.tbody.find("tr.k-master-row").first());
                }

                //do not collaspe the panel for advanced search
                //$("#advancedDocumentSearchPanel").data("kendoPanelBar").collapse($("li.k-state-active"));
            }

            // display filtering

            var grid=searchGrid.data("kendoGrid");
            var dataSource=grid.dataSource;
            var columns=grid.columns;
            var filters=dataSource.filter();

            if(filters!=null) {

                var fields=[];
                parseFilters(filters,fields);

                var list=new Set(Array.from(fields).map((i,e) => { return columns.find(e => e.field==i.field).title; }));
                list=Array.from(list).join(",");

                // update filtering details
                $(documentElementSelectors.textboxes.DocumentSearchFiltering).text("Rows filtered by: "+list);
                $(documentElementSelectors.textboxes.DocumentSearchFiltering).css({ "visibility": "" });

            }
            //Changes for TRECOMPLI-4231 Document- Suspect/Deactivated status highlight results grid

            var data=grid.dataSource.data();
            $.each(data,function(i,row) {
                if(row.DocumentStatusId==4||row.DocumentStatusId==5) {
                    $('tr[data-uid="'+row.uid+'"] ').addClass('grid-red-row');
                }
            })
        }

        var onGenericDataBound=function(e) {
            var grid=this;
            grid.tbody.find("tr").dblclick(function(e) {
                var dataItem=grid.dataItem(this);
                displaySingleDocument({ DocumentID: dataItem.ReferenceId,RevisionID: 0 });
            });
        }

        function getQueryVariable(variable) {
            var query=window.location.search.substring(1);
            var vars=query.split('&');
            for(var i=0;i<vars.length;i++) {
                var pair=vars[i].split('=');
                if(decodeURIComponent(pair[0])==variable) {
                    return decodeURIComponent(pair[1]);
                }
            }
            return null;
        }

        /******************************** Search Methods (Pop-Up) ********************************/
        function displayAddNewDocumentPopUp(pKey) {

            if(generateLocationUrl) {
                var url=documentAjaxSettings.controllers.Home+'/'+documentAjaxSettings.actions.OpenWindowVariable;
                var locationUrl=generateLocationUrl(url);
                var data={ key: 'newDocOpened',value: true };

                $(this).ajaxCall(locationUrl,data)
                    .success(function() {
                        var requestWindowHeight=1024;
                        var requestWindowWidth=1280;
                        var requestUrl=documentAjaxSettings.directory.Operations+"/"+documentAjaxSettings.controllers.Document+"/"+documentAjaxSettings.actions.AddNewDocument;
                        if($(this).getQueryStringParameterByName("docGuid")&&typeof pKey!='undefined') {
                            if($(this).getQueryStringParameterByName("inboundResponseid")) {
                                //TRECOMPLI-4468: Assigned  verify date with the response date of the Inbound email.[Vivek] 
                                requestUrl=generateLocationUrl(requestUrl+"/?nnumber="+$(this).getQueryStringParameterByName("nnumber")+"&docGuid="+$(this).getQueryStringParameterByName("docGuid")+"&supplierid="+$(this).getQueryStringParameterByName("supplierid"))+"&inboundResponseid="+$(this).getQueryStringParameterByName("inboundResponseid")+"&productid="+pKey+"&inboundDate="+$(this).getQueryStringParameterByName("inboundDate");
                            } else {
                                requestUrl=generateLocationUrl(requestUrl+"/?nnumber="+$(this).getQueryStringParameterByName("nnumber")+"&docGuid="+$(this).getQueryStringParameterByName("docGuid")+"&supplierid="+$(this).getQueryStringParameterByName("supplierid"));
                            }
                        }
                        else
                            requestUrl=generateLocationUrl(requestUrl);


                        var requestWindow=window.open(requestUrl,"_newDocumentPopUp",'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+requestWindowWidth+', height='+requestWindowHeight);
                        requestWindow.onload=function() {
                            var doc=this.document;
                            $(doc.body).find("#mainMenu").hide();
                        }

                        window.onbeforeunload=function(evt) {
                            if(typeof evt=="undefined") evt=window.event;
                            if(evt) requestWindow.close();
                        }

                    })
                    .error(function() { displayError(documentMessages.errors.AddNewDocumentPopUp); });

            } else
                displayError(documentMessages.errors.AddNewDocumentPopUp);
        }

        function duplicateObtainmentTypeTextWaring(did) {
            var x=0;
            var intervalID=setInterval(function() {
                $(documentElementSelectors.label.DocumentLinkToAllMfrProductWarning+did).fadeOut(500);
                $(documentElementSelectors.label.DocumentLinkToAllMfrProductWarning+did).fadeIn(500);
                if(++x===5) {
                    window.clearInterval(intervalID);
                }
            },500);
        };

        var onGDDocumentProductDataBound=function(e) {
            var grid=e.sender;
            var data=grid.dataSource.data();
            $.each(data,function(i,row) {
                if(row.SelectedStatusId==11) {
                    $('tr[data-uid="'+row.uid+'"] ').addClass('grid-red-row');
                }
            })
        }

        var initializeProductAssociation=function(did) {
            $(documentElementSelectors.buttons.DocumentLinkToAllMfrProduct+did).click(function(e) {
                e.preventDefault();
                //Make sure if the did is kit, then it must contain at least two children
                $.post(controllerCalls.DocumentContainerComponentsCount,{ documentId: did },function(data) {
                    if(data!='True') {
                        kendo.alert("In order to associate to a product, kits parent document must have at least two children.");
                        return;
                    }
                    DisplayConfirmationModal({ message: documentMessages.warnings.LinkDocumentToAllMfrProudct,header: 'Confirm to link document to all products' },function() {
                        kendo.ui.progress($(documentElementSelectors.grids.DocumentProduct+did),true);
                        kendo.ui.progress($(documentElementSelectors.grids.NonDocumentProduct+did),true);
                        duplicateObtainmentTypeTextWaring(did);

                        $.post(controllerCalls.AssociateDocumentToAllManufacturerProducts,{ documentId: did },function(data) {
                            if(!data.Success) {
                                $(this).displayError(data.Message);
                                return;
                            }
                            refereshAssociationGrid(did);
                        });
                    });
                });


            });
            $(documentElementSelectors.buttons.CreateProduct+did).click(function(e) {
                e.preventDefault();
                $('#gdDocumentProduct_'+did).data('kendoGrid').dataSource.read().then(function() {

                    if($('#gdDocumentProduct_'+did).data('kendoGrid').dataSource.total()==0) {
                        $(documentElementSelectors.buttons.CreateProduct+did).prop('disabled',false);
                        $.post(controllerCalls.ProductSearch,{ documentId: did },function(data) {

                            if(data&&data.length) {
                                var html='<b>The requested product information already exists under the following Product ID(s). Please click on the links<br />below to access the Products(s) and associate the document appropratey.</b> ';
                                html+='<br /><br /><div id="existingProductsGrid"></div>';

                                var prompt={};
                                prompt.header="Existing Product(s)";
                                prompt.message=html;
                                prompt.okButtonHtml=" Close ";

                                DisplayErrorMessageInPopUp(prompt,function() {
                                    // do nothing
                                })

                                setTimeout(bind_existingProductsGrid(data),500);
                                function bind_existingProductsGrid(_data) {

                                    $("#existingProductsGrid").kendoGrid({
                                        dataSource: {
                                            data: _data,
                                            schema: {
                                                model: {
                                                    fields: {
                                                        ReferenceId: { type: "number" },
                                                        ProductName: { type: "string" },
                                                        SupplierNameAndId: { type: "string" },
                                                    }
                                                }
                                            },
                                            pageSize: 8
                                        },

                                        'min-height': 300,
                                        width: 640,
                                        scrollable: true,
                                        sortable: true,
                                        filterable: true,
                                        pageable: {
                                            input: true,
                                            numeric: false,
                                            info: true
                                        },
                                        columns: [
                                            {
                                                field: "ReferenceId",title: "Product Id",width: "20%",
                                                template: "<a target='_blank' href='"+GetEnvironmentLocation()+"/Configuration/ProductManager/ConfigProduct?productid=#: ReferenceId #'>#: ReferenceId # </a>"
                                                //template: "<b>#: ReferenceId # </b>"
                                            },
                                            { field: "ProductName",title: "Name",width: "40%" },
                                            { field: "SupplierNameAndId",title: "Manufacturer",width: "40%" }
                                        ]
                                    });
                                }
                            }
                            else {
                                $.post(controllerCalls.CreateProductFromDocumentAssociatedProductSection,{ documentId: did },function(_res) {

                                    onDisplayError(_res.message)
                                    $('#tbDocumentDetail_'+did).data("kendoTabStrip").reload("#tbDocumentDetail_"+did+"-tab-6");

                                });

                            }
                        });
                    }
                    else {
                        $(documentElementSelectors.buttons.CreateProduct+did).prop('disabled',true);
                        onDisplayError("Product already associated.")
                    }
                });



            });
            getRealNumberForProductAssociation(did);
        };

        var onRefreshSiblingRequest=function(did) {
            var sbGrid=$(documentElementSelectors.grids.DocumentSibling+did).data("kendoGrid");

            if(sbGrid.dataSource.view().length>0) {
                sbGrid.dataSource.page(1);
            }
            sbGrid.dataSource.data([]);
            sbGrid.dataSource.read();
        }


        var onRefreshStatusHistoryRequest=function(did) {
            var sbGrid=$(documentElementSelectors.grids.DocumentStatusHistory+did).data("kendoGrid");

            if(sbGrid.dataSource.view().length>0) {
                sbGrid.dataSource.page(1);
            }
            sbGrid.dataSource.data([]);
            sbGrid.dataSource.read();
        }

        var onAddSiblingRequest=function(did) {
            //e.preventDefault();

            //TRECOMPLI - 3724: https://epm.verisk.com/jira/browse/TRECOMPLI-3724
            //Allow all document types for siblings

            var documentTypeId=$(documentElementSelectors.dropdownlists.DocumentDetailsDocumentTypeExact+did).val();
            //if (documentTypeId != 3) {
            //    kendo.alert("Sibling can only be created for SDS document.");
            //    return;
            //}


            //"<input id='siblingDocType' data-role='dropdownlist' data-auto-bind='false'  data-text-field='Text' data-value-field='Value'  data-bind='value: newDocumentTypeId, source: columnDataSource, events: { change: onSiblingDocTypeChange }'/>"

            var useExistingDocument=$("<div><div>Enter sibling title: <span><input type='text' id='siblingTitle' title='Please enter sibling title' data-bind='value: newDocumentTitle, disabled:usingExistingDocument' style='margin-left: 10px; width: 320px;'></span></div>"+
                "<div>Choose Doc Type: <span><input id='siblingDocType' style='margin: 5px 0px 0px 10px; width: 332px;' data-role='dropdownlist' data-auto-bind='false'  data-text-field='Text' data-value-field='Value'  data-bind='value: newDocumentTypeId, disabled:usingExistingDocument, source: docTypeDataSource, events: { change: onSiblingDocTypeChange }'/></span></div>"+
                "<div>Mfr Part Number: <span><input type='text' id='mfrPartNumber' maxlength='500' title='Please enter Mfr Part Number' data-bind='value: nameOrNumber, disabled:usingExistingDocument' style='margin: 5px 0px 0px 10px; width: 320px;'></span></div>"+
                "<label style='margin-top:8px;'><input type='checkbox' id='checkExistingDocument' data-bind='checked: usingExistingDocument, events: { change: onUsingExistingDocumentChange}'>Use existing Document Id: <input type='text' id='documentId' title='Please enter document Id' data-auto-bind='false' data-bind='value: existingDocumentId, visible: usingExistingDocument' style='width: 100px;'></label></div>");
            //$("<div>siblingRequest</div>").dialog({
            var rowModel;

            function GetBindingRow() {
                var siblingObservable=new kendo.observable({
                    usingExistingDocument: false,
                    newDocumentTitle: "",
                    newDocumentTypeId: documentTypeId,
                    existingDocumentId: null,
                    nameOrNumber: "",
                    //This is for prototype only
                    //docTypeDataSource: [{                   
                    //    Text: "SDS",
                    //    Value: "3"
                    //}, {
                    //    Text: "Conflict Mineral",
                    //    Value: "11"
                    //}, {
                    //    Text: "Prop 65",
                    //    Value: "19"
                    //    }],

                    docTypeDataSource: new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: generateActionUrl(documentAjaxSettings.controllers.Svc,documentAjaxSettings.actions.GetDocumentTypeInJson),
                                type: "POST",
                                contentType: "application/json"
                            }
                        }
                    }),
                    onUsingExistingDocumentChange: function(e) {
                        //kendo.alert("check changed");
                    },
                    onSiblingDocTypeChange: function(e) {
                        //kendo.alert("Doc Type changed to " + this.newDocumentTypeId);
                    },
                });
                siblingObservable.get("docTypeDataSource").fetch();
                return siblingObservable;
            }

            useExistingDocument.dialog({
                title: "Please enter new sibling information",
                dialogClass: 'siblingDialogClass',
                autoOpen: true,
                buttons: {
                    OK: function() {
                        if(!rowModel.usingExistingDocument&&rowModel.newDocumentTitle==="") {
                            kendo.alert("Sibling title is required.");
                            return;
                        }
                        else if(rowModel.usingExistingDocument&&rowModel.existingDocumentId===null) {
                            kendo.alert("Existing document Id is required.");   //Need to verify DocumentId
                            return;
                        }
                        else if(rowModel.usingExistingDocument&&rowModel.existingDocumentId!=null) {
                            $.post(controllerCalls.IsDocumentExist,
                                { documentId: rowModel.existingDocumentId },
                                function(exist) {
                                    if(!exist) {
                                        kendo.alert("Provided Document Id does not exist!");
                                        return;
                                    }
                                });
                            $(this).dialog("close");
                            SaveSiblingAsExistDocument(did,rowModel.existingDocumentId,rowModel.newDocumentTitle);
                        } else {
                            $(this).dialog("close");
                            SaveSiblingAsNewDocument(did,rowModel.newDocumentTitle,rowModel.newDocumentTypeId,rowModel.nameOrNumber);
                        }
                    },
                    Cancel: function() {
                        $(this).dialog("close")
                    }
                },
                width: "500px",
                //dialogClass: 'no-close',   //Does not work
                open: function(event,ui) {
                    $(".ui-dialog-titlebar-close",ui.dialog|ui).hide();
                },
                create: function(e,ui) {
                    rowModel=GetBindingRow();
                    //Get dataSource, better way to do it below
                    //$(this).ajaxJSONCall(generateActionUrl(documentAjaxSettings.controllers.Svc, documentAjaxSettings.actions.GetDocumentTypeInJson))
                    //    .success(function (dataSource) {
                    //        rowModel.set("docTypeDataSource", dataSource);
                    //    })
                    //    .error(function () {
                    //        displayError(documentMessages.errors.GettingDataSourceError);

                    //    })
                    //    .complete(function () {
                    //        //displayCreatedMessage(documentMessages.success.whatever);
                    //        kendo.bind(useExistingDocument, rowModel);
                    //        $(this).dialog("widget").find(".ui-dialog-buttonset").children().addClass("k-button");
                    //        //var pane = $(this).dialog("widget").find(".ui-dialog-buttonpane")
                    //        //$("<label class='shut-up' ><input  type='checkbox'/> Stop asking!</label>").prependTo(pane)
                    //    });

                    kendo.bind(useExistingDocument,rowModel);
                    $(this).dialog("widget").find(".ui-dialog-buttonset").children().addClass("k-button");
                    //var pane = $(this).dialog("widget").find(".ui-dialog-buttonpane")
                    //$("<label class='shut-up' ><input  type='checkbox'/> Stop asking!</label>").prependTo(pane)
                }
            });
        }

        function SaveSiblingAsNewDocument(did,title,docTypeId,nameOrNumber) {
            kendo.ui.progress($(documentElementSelectors.grids.DocumentSibling+did),true);
            $.post(controllerCalls.AddDocumentSibling,
                { documentId: did,documentTitle: title,docTypeId: docTypeId,nameOrNumber: nameOrNumber },
                function(data) {
                    if(!data.Success) {
                        $(this).displayError(data.Message);
                        return;
                    }
                    var sbGrid=$(documentElementSelectors.grids.DocumentSibling+did).data("kendoGrid");

                    if(sbGrid.dataSource.view().length>0) {
                        sbGrid.dataSource.page(1);
                    }
                    sbGrid.dataSource.data([]);
                    sbGrid.dataSource.read();
                });
            kendo.ui.progress($(documentElementSelectors.grids.DocumentSibling+did),false);
        }

        function SaveSiblingAsExistDocument(didFrom,didTo,title) {
            kendo.ui.progress($(documentElementSelectors.grids.DocumentSibling+didFrom),true);
            $.post(controllerCalls.AddExistDocumentAsSibling,
                { documentIdFrom: didFrom,documentIdTo: didTo,documentTitle: title },
                function(data) {
                    if(!data.Success) {
                        $(this).displayError(data.Message);
                        return;
                    }
                    var sbGrid=$(documentElementSelectors.grids.DocumentSibling+didFrom).data("kendoGrid");

                    if(sbGrid.dataSource.view().length>0) {
                        sbGrid.dataSource.page(1);
                    }
                    sbGrid.dataSource.data([]);
                    sbGrid.dataSource.read();
                });
            kendo.ui.progress($(documentElementSelectors.grids.DocumentSibling+didFrom),false);
        }


        function refereshAssociationGrid(did) {
            var gProudct=$(documentElementSelectors.grids.DocumentProduct+did).data("kendoGrid");
            var gNonProduct=$(documentElementSelectors.grids.NonDocumentProduct+did).data("kendoGrid");

            if(gProudct.dataSource.view().length>0) {
                gProudct.dataSource.page(1);
            }
            gProudct.dataSource.data([]);

            if(gNonProduct.dataSource.view().length>0) {
                gNonProduct.dataSource.page(1);
            }
            gNonProduct.dataSource.data([]);


            getRealNumberForProductAssociation(did)

            gProudct.dataSource.read();
            gNonProduct.dataSource.read();


            kendo.ui.progress($(documentElementSelectors.grids.DocumentProduct+did),false);
            kendo.ui.progress($(documentElementSelectors.grids.NonDocumentProduct+did),false);
        }

        function getRealNumberForProductAssociation(did) {
            $.ajax({
                method: "GET",
                url: GetEnvironmentLocation()+"/Document/GetProductDocumentAssociationInfo?documentId="+did,
                contentType: 'application/json; charset=utf-8',
                error: function() { /* DO NOTHING */ },
                success: function(result) {

                    $(documentElementSelectors.textboxes.DocumentAssociatedProduct+did).text('Total products in db: '+result.associatedItems);
                    $(documentElementSelectors.textboxes.DocumentUnAssociatedProduct+did).text('Total products in db: '+result.unassociatedItems);
                    var docType=$(documentElementSelectors.textboxes.DocumentType+did).val();
                    var docStatusId=$(documentElementSelectors.textboxes.DocumentStatus+did).val();

                    if(result.unassociatedItems>5000)
                        $(documentElementSelectors.buttons.DocumentLinkToAllMfrProduct+did).text('Link to first 5000 products');
                    else
                        $(documentElementSelectors.buttons.DocumentLinkToAllMfrProduct+did).text('Link to '+result.unassociatedItems+' products');
                    //If document type is SDS or Document Status is Suspect(4) or Deactivated(5) then disable the link(By Nitin on 13 May 2021)
                    if(docType.toUpperCase()=="SDS"||docStatusId==4||docStatusId==5) {
                        $(documentElementSelectors.buttons.DocumentLinkToAllMfrProduct+did).prop('disabled',true);
                    }
                    else {
                        $(documentElementSelectors.buttons.DocumentLinkToAllMfrProduct+did).prop('disabled',false);
                    }

                    if(result.associatedItems>0) {
                        $(documentElementSelectors.buttons.CreateProduct+did).prop('disabled',true);
                    }
                    else {
                        $(documentElementSelectors.buttons.CreateProduct+did).prop('disabled',false);
                    }
                }
            });
        }

        /******************************** New Document Methods ********************************/

        function clearNewDocumentNameNumberGrid() {
            var requestUrl=documentAjaxSettings.directory.Operations+"/"+documentAjaxSettings.controllers.Document+"/"+documentAjaxSettings.actions.ResetNameNumbersInSession;
            requestUrl=generateLocationUrl(requestUrl);
            $.post(requestUrl,{ token: $(documentElementSelectors.hidden.DocumentRevisionNameNumberSession).val() },function() {
                $(documentElementSelectors.grids.DocumentRevisionNameNumbers+"0").data("kendoGrid").dataSource.read();
            });

        }

        function cancelNewDocumentForm(callbackFunc,clearFields,clearAttachments) {
            var container=$(documentElementSelectors.containers.NewDocument);
            var formData={
                files: getDocumentRevisionAttachments(container),
                documentId: 0,
                revisionId: 0
            };

            if(isContainerFieldsDirty(container)==true) {
                var settings={
                    message: documentMessages.modals.DocumentNewDocumentDiscardChangesMessage,
                    header: documentMessages.modals.DocumentNewDocumentDiscardChangesHeader,
                };
                displayConfirmationModal(settings,function() {
                    if(clearFields==true)
                        revertContainerFieldValues(container,checkNewDocumentDirtyStatus);
                    clearFormAttachment(container,formData);
                    clearNewDocumentNameNumberGrid();
                    if(callbackFunc) callbackFunc();
                });
            } else {
                clearFormAttachment(container,formData);
                clearNewDocumentNameNumberGrid();
                if(callbackFunc) callbackFunc();
            }
        }

        function checkNewDocumentDirtyStatus() {
            var container=$(documentElementSelectors.containers.NewDocument);
            var addNewDocumentPopUp=$(documentElementSelectors.containers.NewDocument).parents(documentElementSelectors.containers.NewDocumentPopUp);
            var saveBtnFunc=(addNewDocumentPopUp.length>0)? onNewDocumentPopUpSaveBtnClick:onNewDocumentSaveBtnClick;
            changeContainerButtonDirtyStatusLayout(container,documentElementSelectors.buttons.DocumentNewDocumentSave,documentElementSelectors.buttons.DocumentNewDocumentCancel,saveBtnFunc);
        }

        function getNewDocumentData() {
            var container=$(documentElementSelectors.containers.NewDocument);
            if(container.length>0) {
                var result={
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
                    CloneOfRevisionId: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsCloneOfRevisionId).val(),
                    RevisionTitle: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionTitle).val(),
                    SupplierId: null,
                    VerifyDate: container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsVerifyDate).val(),
                    IsExposureScenario: container.find(documentElementSelectors.checkboxes.DocumentIsExposureScenario).is(":checked"),
                    ExposureScenarioStartingPage: container.find(documentElementSelectors.textboxes.DocumentExposureScenarioStartingPage).val(),
                    EpochLastUpdate: container.find(documentElementSelectors.datepickers.EpochDateTimeNew).val(),
                };

                if(extractCompanyIdFromTemplate) {
                    result.ManufacturerId=extractCompanyIdFromTemplate(container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsManufacturerId).val());
                    result.SupplierId=extractCompanyIdFromTemplate(container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsSupplierId).val());
                }

                return result;
            }

            return null;
        }

        function closeNewDocument() {
            var container=$(documentElementSelectors.containers.NewDocument);
            if(container.length>0) container.hide(500);
        }

        function closeNewDocumentPopUp() {
            this.window.close();
        }

        function saveNewDocumentRevisionToDatabase(callbackFunc,clearFields,clearAttachments) {
            var formData=null;
            var url="";
            var form=$(documentElementSelectors.containers.NewDocumentForm);
            if($(this).getQueryStringParameterByName("docGuid")=="") {
                formData={
                    model: getNewDocumentData(),
                    attachments: getDocumentRevisionAttachments(form),
                    token: $(documentElementSelectors.hidden.DocumentRevisionNameNumberSession).val()
                };
            } else {
                formData={
                    model: getNewDocumentData(),
                    docGuidId: $(this).getQueryStringParameterByName("docGuid"),
                    token: $(documentElementSelectors.hidden.DocumentRevisionNameNumberSession).val()
                };
            }

            if(formData.model.RevisionDate.toString()=="") {
                $("<div/>").kendoConfirm({
                    title: documentMessages.modals.NullRevisionConfirmTitle,
                    content: documentMessages.modals.NullRevisionConfirmMessage,
                    actions: [
                        {
                            text: 'Confirm',
                            primary: true,
                            action: function(e) {
                                doSaveNewDocumentRevisionToDatabase(form,formData,callbackFunc,clearFields,clearAttachments);
                                return true;
                            },
                        },
                        { text: 'Cancel' }
                    ]
                }).data("kendoConfirm").open().center();
            }
            else
                doSaveNewDocumentRevisionToDatabase(form,formData,callbackFunc,clearFields,clearAttachments);

        }

        function doSaveNewDocumentRevisionToDatabase(form,formData,callbackFunc,clearFields,clearAttachments,IsConfirmedForDocumentSetSelected=false) {
            if(formData.model) {
                formData.model.IsConfirmedForDocumentSetSelected=IsConfirmedForDocumentSetSelected;
                if(formData.attachments!=null) {
                    if(formData.attachments.length==0&&$(this).getQueryStringParameterByName("docGuid")=="") {
                        if(formData.model.ContainerTypeId!=2) {
                            displayError(documentMessages.errors.SaveNewDocumentAttachmentError);
                            return false;
                        }
                    }
                }

                url=form.attr('action');

                $(this).ajaxCall(url,formData)
                    .success(function(data) {
                        var errorMessages=parseErrorMessages(data);
                        if(errorMessages.length==0) {

                            if(clearFields==true)
                                revertContainerFieldValues(form,checkNewDocumentDirtyStatus);

                            if(clearAttachments==true)
                                clearDocumentRevisionAttachments(form);

                            if(callbackFunc)
                                callbackFunc(data.DocumentId,formData.model.ContainerTypeId);

                            if(formData.model.ContainerTypeId==2&&callbackFunc.name=="saveNewDocument") {
                                displayError(documentMessages.warnings.IncompleteKitsReminder);
                            }

                            //if (formData.model.ContainerTypeId == 2) {
                            //    displayError(documentMessages.warnings.IncompleteKitsReminder);
                            //}

                        } else {
                            var str_InvalidDocumentSetKey='InvalidDocumentSet'
                            if(!IsConfirmedForDocumentSetSelected&&data&&data.Errors&&data.Errors[str_InvalidDocumentSetKey]&&data.Errors[str_InvalidDocumentSetKey].errors
                                &&data.Errors[str_InvalidDocumentSetKey].errors.length) {
                                $("<div/>").kendoConfirm({
                                    title: 'Confirm',
                                    content: data.Errors[str_InvalidDocumentSetKey].errors[0],
                                    actions: [
                                        {
                                            text: 'Save',
                                            primary: true,
                                            action: function(e) {
                                                doSaveNewDocumentRevisionToDatabase(form,formData,callbackFunc,clearFields,clearAttachments,true);
                                                return true;
                                            },
                                        },
                                        { text: 'Cancel' }
                                    ]
                                }).data("kendoConfirm").open().center();
                            }
                            else {
                                var errorMessage="The data entered is either invalid or incomplete:<br><br><ul><li>"+errorMessages.join("<li>")+"</ul>";
                                displayError(errorMessage,errorMessage.toLowerCase().indexOf('show more')>-1? true:false);
                            }

                        }
                    })
                    .error(function() { displayError(documentMessages.errors.SaveNewDocumentError); });
            } else
                displayError(documentMessages.errors.SaveNewDocumentError);
        }

        function saveNewDocument(documentId) {
            displayCreatedMessage(documentMessages.success.DocumentSaved);
            //Min: 06/29/2022: Let Advanced Search to handle the new page load instead of doing above complicated work
            window.location.replace(controllerCalls.LoadSingleDocument+"documentId="+documentId+"&revisionId=0");

        }

        function doAdvancedSeachCallBack(documentId) {
            if(parent.window.opener) {
                const searchEvent=new CustomEvent("onCreate",{
                    detail: {
                        ColumnName: "Document ID",
                        ColumnValue: documentId
                    }
                });
                parent.window.opener.document.getElementById(parent.window.opener.document.activeElement.id).dispatchEvent(searchEvent);
            }
        }

        function RefreshOpenerActiveElement() {
            try {
                var refreshId=parent.window.opener.document.activeElement.id.replace("AttachInboundDocTo","Refresh");
                var refreshBtn=parent.window.opener.document.getElementById(refreshId);
                refreshBtn.click();
            }
            catch(e) {
                kendo.alert("Can not refresh product grid, please click the ReLoad Product above the grid to refresh.\r\nError:"+e);
            }
        }

        function saveNewDocumentPopUp(documentId,containerTypeId) {
            if(containerTypeId!=undefined&&containerTypeId==2) {
                $("<div/>").kendoDialog({
                    closable: false, // hide X
                    title: "Kits Parent Reminder",
                    content: documentMessages.warnings.IncompleteKitsReminderRedirect,
                    actions: [{
                        text: "OK",
                        action: function(e) {
                            displaySingleDocument({ DocumentID: documentId,RevisionID: 0 });
                            if($(this).getQueryStringParameterByName("docGuid")=="") {
                                //if(window.opener) {
                                //    var parentSearchWindow=$(window.opener.document).find(documentElementSelectors.containers.DocumentSearchPopUp);
                                //    if(parentSearchWindow.length>0) {
                                //        parentSearchWindow.find(documentElementSelectors.buttons.DocumentSearchClear).trigger('click');
                                //        parentSearchWindow.find(documentElementSelectors.textboxes.DocumentSearchDocumentId).val(documentId);
                                //        parentSearchWindow.find(documentElementSelectors.buttons.DocumentSearchSearch).click();
                                //    }
                                //}
                                doAdvancedSeachCallBack(documentId);
                            }
                            else
                                //parent.window.opener.location.reload();
                                RefreshOpenerActiveElement();

                            closeNewDocumentPopUp();
                            return true;
                        },
                        primary: true
                    }]
                }).data("kendoDialog").open().center();
            }
            else {
                if($(this).getQueryStringParameterByName("docGuid")=="") {
                    //if(window.opener) {
                    //    var parentSearchWindow=$(window.opener.document).find(documentElementSelectors.containers.DocumentSearchPopUp);
                    //    if(parentSearchWindow.length>0) {
                    //        parentSearchWindow.find(documentElementSelectors.buttons.DocumentSearchClear).trigger('click');
                    //        parentSearchWindow.find(documentElementSelectors.textboxes.DocumentSearchDocumentId).val(documentId);
                    //        parentSearchWindow.find(documentElementSelectors.buttons.DocumentSearchSearch).click();
                    //    }
                    //}
                    doAdvancedSeachCallBack(documentId);
                }
                else {
                    //parent.window.opener.location.reload();
                    RefreshOpenerActiveElement();
                }

                closeNewDocumentPopUp();
            }
        }

        function showDpeDialog() {

            var guid=$(this).getQueryStringParameterByName("docGuid");
            var inboundResponseId=$(this).getQueryStringParameterByName("inboundResponseid");

            if(guid==""||guid==null) return;
            if(isNaN(parseInt(inboundResponseId))) return;

            $.ajax({
                type: 'POST',
                dataType: 'json',
                cache: false,
                url: controllerCalls.GetIndexationDataForInboundAttachment,
                data: { documentDBguidId: guid,inboundResponseId: inboundResponseId },
                start: function() { inProgress=true; },
                success: function(data,textStatus,jqXHR) {

                    if(data.State=="QUEUED")
                        setTimeout(showDpeDialog,2000);
                    else {

                        if(data.State!="INVALID"&&data!=null) {

                            var dpeData=data;
                            //DpeDataExtractionNew(data, documentElementSelectors.image.EmojiHappy_New, documentElementSelectors.image.EmojiConfuse_New);

                        }

                    }

                },
                error: function(jqXHR,status,errorThrown) {

                },
                complete: function() {
                }
            });


        }

        function onNewDocumentAddAttachmentBtnClick(e) {

            e.preventDefault();

            if($(e.currentTarget).hasClass('k-state-disabled')) {
                return false;
            }

            // indicating which document/revision the upload file has been called for.
            attachingFileFor=e.currentTarget.id;
            console.log(attachingFileFor);

            if(displayUploadModal) {
                var documentId=0;
                var revisionId=0;


                displayUploadModal(function() {
                    return { documentId: documentId,revisionId: revisionId };
                },function(data) {
                    var container=$(documentElementSelectors.containers.NewDocument);
                    var attachmentGrid=(container.length>0)? container.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid'):null;
                    if(attachmentGrid) {
                        for(var i=0;i<data.length;i++) {
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
                },null,false);
            } else
                displayError(documentMessages.errors.DocumentRevisionAttachmentPopUp);
        }


        function DpeDataExtractionNew(dpeData,happyTarget,confuseTarget) {
            var uncertain_replacement=false;
            if(dpeData.RevisionDate!=null) {
                var frmRevisionDate=$(documentElementSelectors.datepickers.DocumentRevisionDate_New).data("kendoDatePicker").value();

                if(frmRevisionDate==null) {
                    var revisionDate=new Date(parseInt(dpeData.RevisionDate.replace("/Date(","").replace(")/",""),10));
                    $(documentElementSelectors.datepickers.DocumentRevisionDate_New).data("kendoDatePicker").value(revisionDate);
                    dpeFieldsStatus.IncludeRevisionDate=true;
                }
                else {
                    dpeFieldsStatus.IncludeRevisionDate=false;
                    uncertain_replacement=true;
                }
            }

            //if (dpeData.VerifyDate != null) {
            //    var frmVerifyDate = $(documentElementSelectors.datepickers.DocumentVerifyDate_New).data("kendoDatePicker").value();

            //    if (frmVerifyDate == null) {
            //        var confirmDate = new Date(parseInt(dpeData.VerifyDate.replace("/Date(", "").replace(")/", ""), 10));
            //        $(documentElementSelectors.datepickers.DocumentVerifyDate_New).data("kendoDatePicker").value(confirmDate);
            //        dpeFieldsStatus.IncludeVerifiyDate = true;
            //    }
            //    else
            //        uncertain_replacement = true;
            //}

            if(dpeData.RevisionTitle!=null&&dpeData.RevisionTitle!='') {
                var frmRevisionTitle=$(documentElementSelectors.textboxes.DocumentRevisionTitle_New).val();

                if(frmRevisionTitle=='') {
                    $(documentElementSelectors.textboxes.DocumentRevisionTitle_New).val(dpeData.RevisionTitle);
                    dpeFieldsStatus.IncludeRevisionTitle=true;
                }
                else {
                    dpeFieldsStatus.IncludeRevisionTitle=false;
                    uncertain_replacement=true;
                }
            }

            if(dpeData.DocumentIdentification!=null&&dpeData.DocumentIdentification!='') {
                var frmRevisionIdentification=$(documentElementSelectors.textboxes.DocumentIdentification_New).val();

                if(frmRevisionIdentification=='') {
                    $(documentElementSelectors.textboxes.DocumentIdentification_New).val(dpeData.DocumentIdentification);
                    dpeFieldsStatus.IncludeRevisionIdentification=true;
                }
                else {
                    dpeFieldsStatus.IncludeRevisionIdentification=false;
                    uncertain_replacement=true;
                }
            }

            if(dpeData.VersionOnDocument!=null&&dpeData.VersionOnDocument!='') {
                var frmRevisionVersion=$(documentElementSelectors.textboxes.DocumentVersion_New).val();

                if(frmRevisionVersion=='') {
                    $(documentElementSelectors.textboxes.DocumentVersion_New).val(dpeData.VersionOnDocument);
                    dpeFieldsStatus.IncludeRevisionVersion=true;
                }
                else {
                    dpeFieldsStatus.IncludeRevisionVersion=false;
                    uncertain_replacement=true;
                }
            }

            if(dpeData.ManufacturerId!=null&&dpeData.ManufacturerId!='') {
                var frmManufacturerId=$(documentElementSelectors.textboxes.DocumentManufacturerId_New).val();

                if(frmManufacturerId=='') {
                    $(documentElementSelectors.textboxes.DocumentManufacturerId_New).val(dpeData.ManufacturerId);
                    DoLookUpSupplierOnKeyEnter(documentElementSelectors.textboxes.DocumentManufacturerId_New);
                    dpeFieldsStatus.IncludeManufacturerId=true;
                    //Can not get it work
                    //var e = $.Event("keypress", { keyCode: 13 });
                    //$(documentElementSelectors.textboxes.DocumentManufacturerId_New).focus();
                    //var e = jQuery.Event('keydown', { which: $.ui.keyCode.ENTER });
                    //$("txtManufacturerId_New").trigger(e);
                    //setTimeout(function () { $(documentElementSelectors.textboxes.DocumentManufacturerId_New).keypress(); }, 2000);
                }
                else {
                    dpeFieldsStatus.IncludeManufacturerId=false;
                    uncertain_replacement=true;
                }
            }

            if(dpeData.SupplierId!=null&&dpeData.SupplierId!='') {
                var frmSupplierId=$(documentElementSelectors.textboxes.DocumentSupplierId_New).val();

                if(frmSupplierId=='') {
                    $(documentElementSelectors.textboxes.DocumentSupplierId_New).val(dpeData.SupplierId);
                    DoLookUpSupplierOnKeyEnter(documentElementSelectors.textboxes.DocumentSupplierId_New);
                    dpeFieldsStatus.IncludIdSupplierId=true;
                }
                else {
                    dpeFieldsStatus.IncludIdSupplierId=false;
                    uncertain_replacement=true;
                }
            }

            //$(documentElementSelectors.image.EmojiHappy_New).prop('title', JSON.stringify(dpeData));
            if(uncertain_replacement) {
                $(confuseTarget).data('dpedata',dpeData);
                $(confuseTarget).data('dpedata_status',dpeFieldsStatus);
                $(confuseTarget).show();
            }
            else {
                $(happyTarget).data('dpedata',dpeData);
                $(happyTarget).data('dpedata_status',dpeFieldsStatus);
                $(happyTarget).show();
            }
            //if (uncertain_replacement) {
            //    $(documentElementSelectors.image.EmojiConfuse_New).data('dpedata', dpeData);
            //    $(documentElementSelectors.image.EmojiConfuse_New).data('dpedata_status', dpeFieldsStatus);
            //    $(documentElementSelectors.image.EmojiConfuse_New).show();
            //}
            //else {
            //    $(documentElementSelectors.image.EmojiHappy_New).data('dpedata', dpeData);
            //    $(documentElementSelectors.image.EmojiHappy_New).data('dpedata_status', dpeFieldsStatus);
            //    $(documentElementSelectors.image.EmojiHappy_New).show();
            //}
        }

        function DpeDataExtractionRevision(dpeData,sequenceId,versionId,happyTarget,confuseTarget) {
            var uncertain_replacement=false;
            var sequencedFields=dpeFields.fields.Resequence(dpeFields.fields.Revision,sequenceId,versionId);
            happyTarget=happyTarget+'_'+sequenceId;
            confuseTarget=confuseTarget+'_'+sequenceId;
            if(dpeData.RevisionDate!=null) {
                var frmRevisionDate=$(sequencedFields.RevisionDate).data("kendoDatePicker").value();

                if(frmRevisionDate==null) {
                    var revisionDate=new Date(parseInt(dpeData.RevisionDate.replace("/Date(","").replace(")/",""),10));
                    $(sequencedFields.RevisionDate).data("kendoDatePicker").value(revisionDate);
                    dpeFieldsStatus.IncludeRevisionDate=true;
                }
                else
                    uncertain_replacement=true;
            }

            if(dpeData.VerifyDate!=null) {
                var frmVerifyDate=$(sequencedFields.ConfirmationDate).data("kendoDatePicker").value();

                if(frmVerifyDate==null) {
                    var confirmDate=new Date(parseInt(dpeData.VerifyDate.replace("/Date(","").replace(")/",""),10));
                    $(sequencedFields.ConfirmationDate).data("kendoDatePicker").value(confirmDate);
                    dpeFieldsStatus.IncludeVerifiyDate=true;
                }
                else
                    uncertain_replacement=true;
            }

            if(dpeData.RevisionTitle!=null&&dpeData.RevisionTitle!='') {
                var frmRevisionTitle=$(sequencedFields.RevisionTitle).val();

                if(frmRevisionTitle=='') {
                    $(sequencedFields.RevisionTitle).val(dpeData.RevisionTitle);
                    dpeFieldsStatus.IncludeRevisionTitle=true;
                }
                else
                    uncertain_replacement=true;
            }

            if(dpeData.DocumentIdentification!=null&&dpeData.DocumentIdentification!='') {
                var frmRevisionIdentification=$(sequencedFields.DocumentIdentification).val();

                if(frmRevisionIdentification=='') {
                    $(sequencedFields.DocumentIdentification).val(dpeData.DocumentIdentification);
                    dpeFieldsStatus.IncludeRevisionIdentification=true;
                }
                else
                    uncertain_replacement=true;
            }

            if(dpeData.VersionOnDocument!=null&&dpeData.VersionOnDocument!='') {
                var frmRevisionVersion=$(sequencedFields.DocumentVersion).val();

                if(frmRevisionVersion=='') {
                    $(sequencedFields.DocumentVersion).val(dpeData.VersionOnDocument);
                    dpeFieldsStatus.IncludeRevisionVersion=true;
                }
                else
                    uncertain_replacement=true;
            }

            if(dpeData.ManufacturerId!=null&&dpeData.ManufacturerId!='') {
                var frmManufacturerId=$(sequencedFields.ManufacturerId).val();

                if(frmManufacturerId=='') {
                    $(sequencedFields.ManufacturerId).val(dpeData.ManufacturerId);
                    DoLookUpSupplierOnKeyEnter(sequencedFields.ManufacturerId);
                    dpeFieldsStatus.IncludeManufacturerId=true;
                    //Can not get it work
                    //var e = $.Event("keypress", { keyCode: 13 });
                    //$(documentElementSelectors.textboxes.DocumentManufacturerId_New).focus();
                    //var e = jQuery.Event('keydown', { which: $.ui.keyCode.ENTER });
                    //$("txtManufacturerId_New").trigger(e);
                    //setTimeout(function () { $(documentElementSelectors.textboxes.DocumentManufacturerId_New).keypress(); }, 2000);
                }
                else
                    uncertain_replacement=true;
            }

            if(dpeData.SupplierId!=null&&dpeData.SupplierId!='') {
                var frmSupplierId=$(sequencedFields.SupplierId).val();

                if(frmSupplierId=='') {
                    $(sequencedFields.SupplierId).val(dpeData.SupplierId);
                    DoLookUpSupplierOnKeyEnter(sequencedFields.SupplierId);
                    dpeFieldsStatus.IncludIdSupplierId=true;
                }
                else
                    uncertain_replacement=true;
            }

            if(uncertain_replacement) {
                $(confuseTarget).data('dpedata',dpeData);
                $(confuseTarget).data('dpedata_status',dpeFieldsStatus);
                $(confuseTarget).show();
            }
            else {
                $(happyTarget).data('dpedata',dpeData);
                $(happyTarget).data('dpedata_status',dpeFieldsStatus);
                $(happyTarget).show();
            }
        }


        function onNewDocumentCancelBtnClick(e) {

            e.preventDefault();
            cancelNewDocumentForm(closeNewDocument,true,true);
        }

        function onNewDocumentFieldChange(e) {
            onInputFieldChange(e);
            checkNewDocumentDirtyStatus();

            var element=$(e.currentTarget);
            if((element.attr("id")=="IsPublic_New")) {

                var supplierId="#txtSupplierId_New";
                supplierId=parseInt($(supplierId).val());
                var isPublic=getNewDocumentData().IsPublic;

                if(!isNaN(supplierId)) {

                    // get global accessibility
                    $.post(controllerCalls.GetSupplierOrDocumentLevelAccessibility,{ supplierId: supplierId },function(data) {

                        var isPublic=data.IsPublic;               // supplier level selection
                        var isChecked=element.is(":checked");     // document level selection

                        var msg=null;

                        if(isPublic!=isChecked) {

                            // confirm 
                            var msg="This document is being marked '"+(isChecked? "Public":"Private")+"' where as document "+
                                "accessibility at the supplier level is '"+(isPublic? "Public":"Private")+"'.";

                            msg+="<br><br>Mark document as '"+(isChecked? "Public":"Private")+"'?";

                            var settings={
                                message: msg,
                                header: documentMessages.modals.DocumentAccessConfirmation
                            };

                            displayConfirmationModal(settings,function() {
                                // do nothing
                            },function() {
                                element.prop("checked",!isChecked);
                            });

                        }
                        else {
                            if(!isPublic) {
                                displayError(documentMessages.modals.PrivateAccessForDocument);
                            }
                        }

                    });

                }
                else {
                    if(!isPublic) {
                        displayError(documentMessages.modals.PrivateAccessForDocument);
                    }
                }
            }

        }

        function onNewDocumentPopUpCancelBtnClick(e) {
            e.preventDefault();
            cancelNewDocumentForm(closeNewDocumentPopUp);
        }

        function onNewDocumentPopUpSaveBtnClick(e) {
            e.preventDefault();
            if($(this).getQueryStringParameterByName("productid")!="") {
                var formData=getNewDocumentData();
                var data=new Object();
                data.manufacturerId=formData.ManufacturerId;
                data.productId=$(this).getQueryStringParameterByName("productid");
                $(this).syncAjaxCall(controllerCalls.IsManufacturerProductionSelectionValid,data)
                    .success(function(response) {
                        var valid=true;
                        if(!response.IsValid) valid=confirm("The selected manufacturer does not correspond to the product. Continue ?");
                        if(valid) saveNewDocumentRevisionToDatabase(saveNewDocumentPopUp);
                    })
                    .error(function() { });
            } else
                saveNewDocumentRevisionToDatabase(saveNewDocumentPopUp);

        }

        function isManufacturerSelectionValid() {

            var formData=getNewDocumentData();

            var data=new Object();
            data.manufacturerId=formData.ManufacturerId;
            data.productId=$(this).getQueryStringParameterByName("productid");
            $(this).syncAjaxCall(controllerCalls.IsManufacturerProductionSelectionValid,data)
                .success(function(response) {
                    console.log(response);

                    if(!response.IsValid) return confirm("The selected manufacturer does not correspond to the product. Continue ?");
                    saveNewDocumentRevisionToDatabase(saveNewDocumentPopUp);
                    if(response.IsValid) return true;
                    if(!response.IsValid) return confirm("The selected manufacturer does not correspond to the product. Continue ?");

                })
                .error(function() { });
        }

        function onNewDocumentSaveBtnClick(e) {

            e.preventDefault();
            saveNewDocumentRevisionToDatabase(saveNewDocument,true,true);
        }

        var onNewDocumentPanelActivate=function() {

            showDpeDialog();

            $(documentElementSelectors.buttons.DocumentNewDocumentSave).on("click",onDisabledButtonClick);

            $(documentElementSelectors.containers.NewDocument).on('change','input',onNewDocumentFieldChange);
            $(documentElementSelectors.containers.NewDocument).on('click',documentElementSelectors.buttons.DocumentRevisionDetailsAddAttachment,onNewDocumentAddAttachmentBtnClick);
            $(documentElementSelectors.containers.NewDocument).on('click',documentElementSelectors.buttons.DocumentRevisionDetailsDeleteAttachment,onDocumentNewRevisionDetailsDeleteAttachmentBtnClick);

            // If we are within the popup window display the panel
            var addNewDocumentPopUp=$(documentElementSelectors.containers.NewDocument).parents(documentElementSelectors.containers.NewDocumentPopUp);
            if(addNewDocumentPopUp.length>0) {
                $(documentElementSelectors.containers.NewDocument).show(500);
                $(documentElementSelectors.buttons.DocumentNewDocumentCancel).on("click",onNewDocumentPopUpCancelBtnClick);

                addNewDocumentPopUp.off('click',documentElementSelectors.buttons.DocumentAddMultipleNameNumbers);
                addNewDocumentPopUp.on('click',documentElementSelectors.buttons.DocumentAddMultipleNameNumbers,loadMulitNameNumberPopup);
            } else {
                $(documentElementSelectors.buttons.DocumentNewDocumentCancel).on("click",onNewDocumentCancelBtnClick);
            }
        };

        var onNewRevisionPanelActivate=function(e) {
            var documentId=0;
            var supplierId=0;

            try {
                var tokens=Array.from(location.search.substring(1).split("&"));

                documentId=parseInt(tokens.find(e => e.toLowerCase().indexOf("documentid")==0).split("=")[1]);
                supplierId=parseInt(tokens.find(e => e.toLowerCase().indexOf("supplierid")==0).split("=")[1]);
            }
            catch(err) {
                alert("Unable to parse information either for documentId or supplierId.\r\nThis new revision window will be closed.\r\n\r\nInner exception error: "+err+".");
                window.close();
                return;
            }
            //var documentId = location.search.substring(1).split('&')[1].split('=')[1];
            //var supplierId = location.search.substring(1).split('&')[2].split('=')[1];

            $(this).ajaxCall(controllerCalls.GetSupplierName,{ supplierId: supplierId })
                .success(function(result) {
                    if(result.message=="Error"||result.success==false) {
                        $("[id*=txtSupplierId_"+documentId+"]").val(supplierId);
                        $("[id*=txtManufacturerId_"+documentId+"]").val(supplierId);
                    } else {
                        $("[id*=txtSupplierId_"+documentId+"]").val(supplierId+', '+result);
                        $("[id*=txtManufacturerId_"+documentId+"]").val(supplierId+', '+result);
                    }
                })
                .error(function() {
                    $("[id*=txtSupplierId_"+documentId+"]").val(supplierId);
                    $("[id*=txtManufacturerId_"+documentId+"]").val(supplierId);
                });


            $("[id*=btnDocumentRevisionSave_"+documentId+"]").removeClass('disabled-link');
            $("[id*=btnDocumentRevisionSave_"+documentId+"]").on("click",onDocRevSaveForInboundResponseBtnClick);
            $("[id*=btnDocumentRevisionCancel_"+documentId+"]").on("click",onDocNewRevDetailsCancelForInboundResponseBtnClick);
            $("[id*=btnSetUnknownMfg_"+documentId+"]").hide();
            $("[id*=revisionMfgIdBtn_"+documentId+"]").hide();
            $("[id*=revisionSupplierIdBtn_"+documentId+"]").hide();
            $("[id*=viewRevisionManufacturerIdBtn_"+documentId+"]").on("conlick",onDocumentRevisionCompanyViewBtnClick);
            $("[id*=viewRevisionSupplierIdBtn_"+documentId+"]").on("click",onDocumentRevisionCompanyViewBtnClick);
            $("[id*=txtSupplierId_"+documentId+"]").val(supplierId);
            $("[id*=txtManufacturerId_"+documentId+"]").val(supplierId);

            // If we are within the popup window display the panel
            var addNewRevisionPopUp=$(documentElementSelectors.containers.NewRevision).parents(documentElementSelectors.containers.NewRevisionPopUp);
            if(addNewRevisionPopUp.length>0) {
                $(documentElementSelectors.containers.NewRevision).show(500);
            }
        };


        /******************************** Document Methods ********************************/
        function checkDocumentDetailsDirtyStatus(container) {
            changeContainerButtonDirtyStatusLayout(container,documentElementSelectors.buttons.DocumentDetailsSave,documentElementSelectors.buttons.DocumentDetailsCancel,onDocumentDetailsSaveBtnClick,true);
        }

        function checkDocumentStatus(form,documentId) {

            if(!form&&documentId) {
                form=$(documentElementSelectors.containers.DocumentDetailsFormExact+documentId);
            }

            var formData=getDocumentDetailsData(form,documentId);
            if(formData) {

                // First check if a status change needs to display a notes popup
                var url=generateActionUrl(documentAjaxSettings.controllers.Document,documentAjaxSettings.actions.GetStatusAction);
                $.post(url,formData,function(data) {

                    if(data.displayMessage) {

                        if(data.statusError==true)
                            displayError(data.displayMessage);
                        else {

                            if(displayStatusNoteConfirmation) {
                                displayStatusNoteConfirmation(data,function(eval) {
                                    formData.StatusNotes=eval.modalNotes;
                                    verifySiblingChaining(form,formData);
                                });
                            }
                        }
                    } else
                        verifySiblingChaining(form,formData);
                });
            }
        }

        function getDocumentDetailsData(form,documentId) {
            if(!form&&documentId) {
                form=$(documentElementSelectors.containers.DocumentDetailsFormExact+documentId);
            }

            if(form&&form.length>0) {
                var result={
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

        function verifySiblingChaining(form,formData) {
            //Verify impacted sibling if any SDS Not required or FlagDiscontinued turned on/off 
            if(form&&formData) {
                var url=controllerCalls.DocumentSiblingChainingVerify;
                $.post(url,formData,function(result) {
                    if(result.hasChange&&(result.siblingCount>0)) {
                        $("<div/>").kendoConfirm({
                            title: documentMessages.modals.SiblingCascadingConfirmTitle,
                            content: documentMessages.modals.SiblingCascadingConfirmMessage.format(result.siblingCount),
                            actions: [
                                {
                                    text: 'Confirm',
                                    primary: true,
                                    action: function(e) {
                                        saveDocumentDetails(form,formData)
                                    },
                                },
                                {
                                    text: 'Cancel',
                                    action: function(e) {
                                    },
                                }
                            ]
                        }).data("kendoConfirm").open().center();
                    }
                    else
                        saveDocumentDetails(form,formData)
                });
            }
        }

        function saveDocumentDetails(form,formData) {

            if(form&&formData) {
                var url=form.attr('action');
                $.post(url,formData,function(data) {

                    // Attempt to get error message
                    var errorMessage=parseErrorMessage(data);
                    if(!errorMessage) {
                        displayCreatedMessage(documentMessages.success.DocumentSaved);

                        var lastUpdatePopOver=form.find(documentElementSelectors.general.DocumentLastUpdatePopOver);
                        if(lastUpdatePopOver.length>0)
                            lastUpdatePopOver.data('popover').options.content=data.LastUpdatedDescription;

                        // Check if the status history table needs to be repopulated
                        var documentStatusDdl=form.find(documentElementSelectors.dropdownlists.DocumentDetailsStatus);
                        if(documentStatusDdl.length>0&&documentStatusDdl[0].defaultValue!=documentStatusDdl.val()) {
                            var statusGrid=$(documentElementSelectors.grids.DocumentStatusHistory+formData.DocumentId).data('kendoGrid');
                            if(statusGrid) {
                                statusGrid.dataSource.read();
                                displayDocumentStatusNote(formData.DocumentId,'');
                            }
                        }

                        form.find(documentElementSelectors.hidden.DocumentDetailsStatusNotes).val('');
                        setContainerFieldDefaultValues(form,checkDocumentDetailsDirtyStatus);

                    } else
                        displayError(errorMessage);
                });
            }
        }

        function onDocumentDetailsCancelBtnClick(e) {
            e.preventDefault();

            var tabContainer=$(e.currentTarget).parents(documentElementSelectors.containers.DocumentDetailsTab+'.k-tabstrip').data('kendoTabStrip');
            var documentDetailsForm=$(e.currentTarget).parents(documentElementSelectors.containers.DocumentDetailsForm);
            if(tabContainer&&documentDetailsForm.length>0) {

                if(isContainerFieldsDirty(documentDetailsForm)==true) {

                    var settings={
                        message: documentMessages.modals.DocumentDiscardChangesMessage,
                        header: documentMessages.modals.DocumentDiscardChangesHeader,
                    };

                    displayConfirmationModal(settings,function() {
                        tabContainer.reload(tabContainer.element.find('li[aria-selected=true]:first'));
                    });

                } else {
                    tabContainer.reload(tabContainer.element.find('li[aria-selected=true]:first'));
                }
            }
        }

        function onDocumentDetailsFieldChange(e) {
            onInputFieldChange(e);

            var element=$(e.currentTarget);
            checkDocumentDetailsDirtyStatus(element.parents(documentElementSelectors.containers.DocumentDetailsForm+":first"));

            var id=element.attr("id");
            if(id.indexOf("IsPublic_")<0) return;

            // if this is an existing document, lookup the visibility status at the 
            // supplier level. if there is a difference prompt user

            // selected document 
            var documentId=id.replace("IsPublic_","#DocumentId_");
            documentId=$(documentId).val();

            // get global settings
            $.post(controllerCalls.GetSupplierOrDocumentLevelAccessibility,{ documentId: documentId },function(data) {

                var isPublic=data.IsPublic;               // supplier level selection
                var isChecked=element.is(":checked");     // document level selection

                var msg=null;

                if(isPublic!=isChecked) {

                    msg="Document #"+documentId+" is being marked '"+(isChecked? "Public":"Private")+"' where as document "+
                        "accessibility at the supplier level is '"+(isPublic? "Public":"Private")+"'.";

                    if(!isChecked) msg+="<br>"+"A change to 'Private' access will make this document unsearchable on certain client systems.";

                }
                else {
                    msg=!isChecked? documentMessages.modals.PrivateAccessForDocument:documentMessages.modals.PublicAccessForDocument;
                }

                msg+="<br><br>"+"Proceed with access change and republish document ? ";

                var settings={
                    message: msg,
                    header: documentMessages.modals.DocumentAccessConfirmation
                };

                displayConfirmationModal(settings,function() {

                    // set document accessibility
                    $.post(controllerCalls.SetSupplierOrDocumentLevelAccessibility,{ documentId: documentId,isPublic: isChecked },function(data) {

                    });

                },function() {
                    element.prop("checked",!isChecked);
                });

            });




        }

        function onDocumentDetailsSaveBtnClick(e) {
            e.preventDefault();

            var documentId=extractReferenceId(e.currentTarget.getAttribute('id'));
            var form=$(documentElementSelectors.containers.DocumentDetailsFormExact+documentId);
            if(form.length>0) {
                checkDocumentStatus(form,documentId);
            } else
                displayError(documentMessages.errors.SaveDocumentError);
        }

        var initializeDocumentComponents=function() {
            var container=$(documentElementSelectors.containers.DocumentMain);
            if(container.length==0) return;

            // Associated document
            $(documentElementSelectors.buttons.ConflictingFileUploadClose).on('click',function() {
                $("#mdlConflictingFileUpload").toggleModal();
            });

            // Document
            container.on('change',documentElementSelectors.containers.DocumentDetailsForm+' input',onDocumentDetailsFieldChange);
            container.on('click',documentElementSelectors.buttons.DocumentDetailsSave,onDisabledButtonClick);
            container.on('click',documentElementSelectors.buttons.DocumentDetailsCancel,onDocumentDetailsCancelBtnClick);
            container.on('change',documentElementSelectors.dropdownlists.DocumentDetailsDocumentType,enableDisableExposureScenario);
            container.on('click',documentElementSelectors.checkboxes.DocumentIsExposureScenario,enableDisableExposureScenarioPage);
            container.on('click',documentElementSelectors.buttons.DocumentDetailsRepublish,onDocumentDetailsRepublishClick);

            // Revision
            container.on('change',documentElementSelectors.containers.DocumentRevisionDetailsForm+' input',onDocumentRevisionFieldChange);
            container.on('click',documentElementSelectors.buttons.DocumentRevisionAddMultipleNameNumbers,onDocumentRevisionAddMultipleNameNumbersBtnClick);
            container.on('click',documentElementSelectors.buttons.DocumentRevisionAddNewRevision,onDocumentRevisionAddNewRevisionBtnClick);
            container.on('click',documentElementSelectors.buttons.DocumentRevisionDetailsSave,onDisabledButtonClick);
            //container.on('click', documentElementSelectors.buttons.DocumentRevisionDetailsManufacturerSearch, onDocumentRevisionCompanySearchBtnClick);
            container.on('click',documentElementSelectors.buttons.DocumentRevisionDetailsManufacturerView,onDocumentRevisionCompanyViewBtnClick);
            container.on('click',documentElementSelectors.buttons.DocumentRevisionDetailsSetUnknownManufacturer,onDocumentRevisionSetUnknownCompanyBtnClick);
            //container.on('click', documentElementSelectors.buttons.DocumentRevisionDetailsSupplierSearch, onDocumentRevisionCompanySearchBtnClick);
            container.on('click',documentElementSelectors.buttons.DocumentRevisionDetailsSupplierView,onDocumentRevisionCompanyViewBtnClick);
            container.on('click',documentElementSelectors.buttons.DocumentSearchRevisionDetailsSupplierView,onDocumentRevisionCompanyViewBtnClick);
            container.on('click',documentElementSelectors.buttons.DocumentSearchRevisionDetailsManufacturerView,onDocumentRevisionCompanyViewBtnClick);
            container.on('click',documentElementSelectors.containers.DocumentNewRevisionDetails+' '+documentElementSelectors.buttons.DocumentRevisionDetailsAddAttachment,onDocumentNewRevisionDetailsAddAttachmentBtnClick);
            container.on('click',documentElementSelectors.containers.DocumentNewRevisionDetails+' '+documentElementSelectors.buttons.DocumentRevisionDetailsCancel,onDocumentNewRevisionDetailsCancelBtnClick);
            container.on('click',documentElementSelectors.containers.DocumentNewRevisionDetails+' '+documentElementSelectors.buttons.DocumentRevisionDetailsDeleteAttachment,onDocumentNewRevisionDetailsDeleteAttachmentBtnClick);
            container.on('click',documentElementSelectors.containers.DocumentRevisionDetails+' '+documentElementSelectors.buttons.DocumentRevisionDetailsAddAttachment,onDocumentRevisionDetailsAddAttachmentBtnClick);
            //container.on('click', documentElementSelectors.containers.DocumentRevisionDetails + ' ' + documentElementSelectors.buttons.DocumentRevisionDetailsReplaceAttachment, onDocumentRevisionDetailsReplaceAttachmentBtnClick);
            container.on('click',documentElementSelectors.containers.DocumentRevisionDetails+' '+documentElementSelectors.buttons.DocumentRevisionDetailsCancel,onDocumentRevisionDetailsCancelBtnClick);
            container.on('click',documentElementSelectors.containers.DocumentRevisionDetails+' '+documentElementSelectors.buttons.DocumentRevisionDetailsDeleteAttachment,onDocumentRevisionDetailsDeleteAttachmentBtnClick);
            container.on('keyup',documentElementSelectors.textboxes.DocumentRevisionDetailsManufacturerId,onCompanyIdFieldKeyUp);
            container.on('keyup',documentElementSelectors.textboxes.DocumentRevisionDetailsSupplierId,onCompanyIdFieldKeyUp);

            // Containers
            container.on('click',documentElementSelectors.buttons.DocumentAddContainerComponents,onDocumentAddContainerComponentsBtnClick);
            container.on('click',documentElementSelectors.buttons.DocumentDeleteContainerComponent,onDocumentDeleteContainerComponentBtnClick);


            // Multiple name numbers
            container=$(documentElementSelectors.containers.DocumentRevisionMultipleNameNumbers);
            if(container.length>0) {
                container.on('click',documentElementSelectors.buttons.DocumentRevisionMultipleNameNumbersSave,onDocumentRevisionMultipleNameNumbersSaveBtnClick);
                container.on('keyup',documentElementSelectors.textboxes.DocumentRevisionMultipleNameNumbers,onDocumentRevisionMultipleNameNumbersKeyUp);
            }

            // sibling replacement

            $(documentElementSelectors.buttons.CancelReplaceForSelectedRevisions).on('click',function(e) {
                e.preventDefault();
                $("#mdlListofSiblingsForReplacement").toggleModal();
            });

            $(documentElementSelectors.buttons.SaveReplaceForSelectedRevisions).on('click',onSaveReplaceForSelectedRevisionsBtnClick);


        };

        function enableDisableExposureScenario(e) {

            // determine document type selection
            var isSDS=($(e.currentTarget).data("kendoDropDownList").value()==3);

            // reset on any change
            $("#ExposureScenarioStartingPage_New").val("");
            $("#ExposureScenarioStartingPage_New").attr("disabled",true);
            $("#IsExposureScenario_New").prop("checked",false);

            if(!isSDS)
                $("#IsExposureScenario_New").attr("disabled",true);
            else
                $("#IsExposureScenario_New").removeAttr("disabled");

        }

        function enableDisableExposureScenarioPage(e) {

            var isChecked=$(e.currentTarget).is(":checked");
            var parent=$(e.currentTarget).closest("fieldset");
            var text=parent.find(documentElementSelectors.textboxes.DocumentExposureScenarioStartingPage);

            if(isChecked)
                $(text).removeAttr("disabled");
            else
                $(text).attr("disabled",true);

            $(text).val("");

        }

        /******************************** Revision Methods ********************************/
        function checkDocumentRevisionDirtyStatus(container) {
            var isExistingRevision=container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionId).val()!="0";
            changeContainerButtonDirtyStatusLayout(container,documentElementSelectors.buttons.DocumentRevisionDetailsSave,
                documentElementSelectors.buttons.DocumentRevisionDetailsCancel,onDocumentRevisionSaveBtnClick,isExistingRevision);
        }

        var displaySingleDocument=function(documentObj) {
            window.open(controllerCalls.LoadSingleDocument+"documentId="+documentObj.DocumentID+"&revisionId="+documentObj.RevisionID,"_blank");
        }

        var displayAllParents=function(parents) {
            parents.forEach(function(parent) {
                window.open(controllerCalls.LoadSingleDocument+"documentId="+parent+"&revisionId=0","_blank");
            });
        }

        function clearDocumentRevisionAttachments(container) {
            if(container) {
                var grid=container.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
                if(grid&&grid.dataSource) {
                    grid.dataSource.data([]);
                    container.find(documentElementSelectors.buttons.DocumentRevisionNewFile).removeClass('k-state-disabled');
                }
            }
        }

        function getCompanyTextFieldSibling(buttonElement) {

            if(buttonElement) {
                var siblingSelector=documentElementSelectors.textboxes.DocumentRevisionDetailsSupplierId;
                if(buttonElement.is(documentElementSelectors.buttons.DocumentRevisionDetailsManufacturerSearch)||
                    buttonElement.is(documentElementSelectors.buttons.DocumentRevisionDetailsManufacturerView)||
                    buttonElement.is(documentElementSelectors.buttons.DocumentRevisionDetailsSetUnknownManufacturer)) {
                    siblingSelector=documentElementSelectors.textboxes.DocumentRevisionDetailsManufacturerId;
                }
                else if(
                    buttonElement.is(documentElementSelectors.buttons.DocumentSearchSearchSupplier)||
                    buttonElement.is(documentElementSelectors.buttons.DocumentSearchRevisionDetailsSupplierView)
                ) {
                    siblingSelector=documentElementSelectors.textboxes.DocumentSearchSupplierId;
                }
                else if(
                    buttonElement.is(documentElementSelectors.buttons.DocumentSearchSearchManufacturer)||
                    buttonElement.is(documentElementSelectors.buttons.DocumentSearchRevisionDetailsManufacturerView)
                )
                    siblingSelector=documentElementSelectors.textboxes.DocumentSearchManufacturerId;

                return siblingSelector;
            }

            return null;
        }

        function getDocumentRevisionAttachments(container) {
            var gridContainer=$(this).getQueryStringParameterByName("docGuid")!=""? container.find(documentElementSelectors.grids.DocumentFromInboundResponse).data('kendoGrid'):container.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
            var grid=container&&container.length>0? gridContainer:null;
            if(grid&&grid.dataSource) {

                var items=[];
                var gridData=grid.dataSource.data();
                for(var i=0;i<gridData.length;i++) {
                    items.push({ DocumentId: gridData[i].DocumentId,RevisionId: gridData[i].RevisionId,PhysicalPath: gridData[i].PhysicalPath });

                }

                return items;
            }
        }

        function getDocRevAttachmentsForInboundResponse(container,documentId,revisionId) {
            var gridContainer=$(this).getQueryStringParameterByName("docGuid")!=""? container.find(documentElementSelectors.grids.DocumentFromInboundResponse).data('kendoGrid'):container.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
            var grid=container&&container.length>0? gridContainer:null;

            if(grid&&grid.dataSource) {

                var items=[];
                var gridData=grid.dataSource.data();
                for(var i=0;i<gridData.length;i++) {
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

        function getDocumentRevisionDetailsData(container,documentId,revisionId) {

            if(!container&&documentId&revisionId) {
                container=((revisionId||0)==0)? $(documentElementSelectors.containers.DocumentNewRevision+documentId):$(documentElementSelectors.containers.DocumentRevision+documentId);
            }

            if(container&&container.length>0) {
                var result={
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
                    CloneOfRevisionId: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsCloneOfRevisionId).val(),
                    RevisionTitle: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionTitle).val(),
                    SupplierId: null,
                    VerifyDate: container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsVerifyDate).val(),
                    CopyIndexationData: container.find(documentElementSelectors.radiobuttons.DocumentRevisionDetailsReplicateIndexationData).is(":checked"),
                    IsExposureScenario: container.find(documentElementSelectors.checkboxes.DocumentIsExposureScenario).is(":checked"),
                    ExposureScenarioStartingPage: container.find(documentElementSelectors.textboxes.DocumentExposureScenarioStartingPage).val()
                };

                if(extractCompanyIdFromTemplate) {
                    result.ManufacturerId=extractCompanyIdFromTemplate(container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsManufacturerId).val());
                    result.SupplierId=extractCompanyIdFromTemplate(container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsSupplierId).val());
                }

                return result;
            }

            return null;
        }

        function getDocRevDetailsDataForInboundResponse(container,documentId,revisionId) {

            if(!container&&documentId&revisionId) {
                container=((revisionId||0)==0)? $(documentElementSelectors.containers.DocumentNewRevision+documentId):$(documentElementSelectors.containers.DocumentRevision+documentId);
            }

            if(container&&container.length>0) {
                var result={
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
                    CloneOfRevisionId: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsCloneOfRevisionId).val(),
                    RevisionTitle: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionTitle).val(),
                    DocumentDBGuidId: $(this).getQueryStringParameterByName("docGuid"),
                    SupplierId: null,
                    VerifyDate: container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsVerifyDate).val(),
                    CopyIndexationData: container.find(documentElementSelectors.radiobuttons.DocumentRevisionDetailsReplicateIndexationData).is(":checked"),
                    EpochLastUpdate: container.find(documentElementSelectors.datepickers.EpochDateTime).val(),
                };

                if(extractCompanyIdFromTemplate) {
                    result.ManufacturerId=extractCompanyIdFromTemplate(container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsManufacturerId).val());
                    result.SupplierId=extractCompanyIdFromTemplate(container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsSupplierId).val());
                }

                return result;
            }

            return null;
        }

        //For new revision only
        function onDocumentNewRevisionDetailsAddAttachmentBtnClick(e) {

            // ARINDAM KATAKI FILE UPLOAD CHECK

            e.preventDefault();

            if($(e.currentTarget).hasClass('k-state-disabled')) {
                return false;
            }

            // indicating which document/revision the upload file has been called for.
            attachingFileFor=e.currentTarget.id;
            console.log(attachingFileFor);

            if(displayUploadModal) {

                var container=$(this).parents(documentElementSelectors.containers.DocumentNewRevisionDetails+":first");
                if(container.length>0) {
                    var documentId=container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentId).val();
                    var revisionId=0;


                    displayUploadModal(function() {
                        return { documentId: documentId,revisionId: revisionId };
                    },function(data) {
                        var parentContainer=$(documentElementSelectors.containers.DocumentNewRevisionDetailsExact+documentId);
                        var attachmentGrid=(parentContainer.length>0)? parentContainer.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid'):null;
                        if(attachmentGrid) {
                            for(var i=0;i<data.length;i++) {
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

                    },function(data) {
                        return;
                        //Prompt for OCR and show animation                    
                        //if (!confirm(documentMessages.warnings.OcrSilverLevelIndexData)) {
                        //    return;
                        //}
                        var filename=data[0].physicalPath;
                        $(documentElementSelectors.image.MsdsOcrImageRevision+'_'+documentId).show();
                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            cache: false,
                            url: controllerCalls.GetDpeRevisionIndexationAsync,
                            data: { fn: filename },
                            success: function(dpeData,textStatus,jqXHR) {
                                if(dpeData!=null) {
                                    DpeDataExtractionRevision(dpeData,documentId,0,documentElementSelectors.image.EmojiHappy_Revision,documentElementSelectors.image.EmojiConfuse_Revision);
                                } else {
                                    $(documentElementSelectors.image.EmojiSad_Revision+'_'+documentId).show();
                                }
                            },
                            error: function(jqXHR,status,errorThrown) {
                                displayError(errorThrown);
                                $(documentElementSelectors.image.EmojiSad_Revision+'_'+documentId).show();
                            },
                            complete: function() {
                                $(documentElementSelectors.image.MsdsOcrImageRevision+'_'+documentId).hide();
                            }
                        });
                    },
                        false);
                } else
                    displayError(documentMessages.errors.DocumentRevisionAttachmentData);
            } else
                displayError(documentMessages.errors.DocumentRevisionAttachmentPopUp);
        }

        function onDocumentNewRevisionDetailsCancelBtnClick(e) {
            e.preventDefault();
            var container=$(e.currentTarget).parents('ul'+documentElementSelectors.containers.DocumentNewRevisionDetails+':first');
            if(container.length>0) {
                var formData={
                    files: getDocumentRevisionAttachments(container),
                    documentId: container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentId).val(),
                    revisionId: 0
                };

                if(isContainerFieldsDirty(container)==true) {
                    var settings={
                        message: documentMessages.modals.DocumentRevisionDiscardChangesMessage,
                        header: documentMessages.modals.DocumentRevisionDiscardChangesHeader,
                    };
                    displayConfirmationModal(settings,
                        function() {
                            revertContainerFieldValues(container,checkDocumentRevisionDirtyStatus);
                            clearFormAttachment(container,formData);
                            container.hide(500);
                        });

                } else {
                    clearFormAttachment(container,formData);
                    container.hide(500);
                }
            }
        }

        function clearFormAttachment(container,formData) {
            $.ajax({
                type: 'POST',
                url: generateActionUrl(documentAjaxSettings.controllers.Document,documentAjaxSettings.actions.RemoveRevisionAttachment),
                data: formData,
                beforeSend: function() {
                    clearDocumentRevisionAttachments(container);
                }
            });
        }

        function onDocNewRevDetailsCancelForInboundResponseBtnClick(e) {
            e.preventDefault();
            window.opener=self;

            var container=$(e.currentTarget).parents('ul[id^=pnlNewRevision]');
            if(container.length>0) {

                if(isContainerFieldsDirty(container)==true) {
                    var settings={
                        message: documentMessages.modals.DocumentRevisionDiscardChangesMessage,
                        header: documentMessages.modals.DocumentRevisionDiscardChangesHeader,
                    };

                    displayConfirmationModal(settings,function() {
                        revertContainerFieldValues(container,checkDocumentRevisionDirtyStatus);
                        window.close();
                    });
                } else {
                    window.close();
                }
            }
        }

        function onDocumentNewRevisionDetailsDeleteAttachmentBtnClick(e) {
            e.preventDefault();

            var settings={
                message: documentMessages.modals.DocumentRevisionDeleteAttachmentMessage,
                header: documentMessages.modals.DocumentRevisionDeleteAttachmentHeader
            };

            var attachmentGrid=$(this).parents(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
            var dataItem=attachmentGrid? attachmentGrid.dataItem($(e.currentTarget).parents('[data-uid]')):null;
            if(dataItem) {

                displayConfirmationModal(settings,function() {
                    $(this).ajaxCall(generateActionUrl(documentAjaxSettings.controllers.Document,documentAjaxSettings.actions.RemoveRevisionAttachment),{
                        files: [{ FileName: dataItem.FileName,PhysicalPath: dataItem.PhysicalPath }],
                        documentId: dataItem.DocumentId,
                        revisionId: dataItem.RevisionId,
                    })
                        .success(function(data) {
                            var errorMessage=parseErrorMessage(data);
                            if(errorMessage)
                                displayError(errorMessage);
                            else {
                                attachmentGrid.dataSource.remove(dataItem);
                                //only one attachment allowed for the Single container. After remove this file, should allow add file.
                                if(dataItem.DocumentId==0) {
                                    $('#addNewFilesBtn_New').removeClass('k-state-disabled');
                                }
                                else if(dataItem.DocumentId>0&&dataItem.RevisionId==0) {
                                    $('#addNewFilesBtn_'+dataItem.DocumentId+"_"+dataItem.RevisionId).removeClass('k-state-disabled');
                                }
                                $(documentElementSelectors.image.EmojiHappy_New).hide();
                                $(documentElementSelectors.image.EmojiSad_New).hide();
                            }
                        })
                        .error(function() {
                            displayError(documentMessages.errors.DocumentRevisionAttachmentDelete);
                        });
                });
            } else
                displayError(documentMessages.errors.DocumentRevisionAttachmentDelete);
        }

        function onDocumentRevisionAddNewRevisionBtnClick(e) {
            e.preventDefault();

            var documentId=extractReferenceId(e.currentTarget.getAttribute('id'));
            var newRevisionContainer=$(documentElementSelectors.containers.DocumentNewRevisionDetailsExact+documentId);
            if(newRevisionContainer.length>0) {

                // make call to get latest revision details
                $(this).ajaxCall(controllerCalls.RetrieveLatestDocumentRevision,{ DocumentId: documentId })
                    .success(function(data) {

                        if(data==null) return;

                        $("#txtSupplierId_"+documentId+"_0").val(getCompanyTemplate(data.SupplierId,data.SupplierName));
                        $("#txtManufacturerId_"+documentId+"_0").val(getCompanyTemplate(data.ManufacturerId,data.ManufacturerName));
                        $("#RevisionTitle_"+documentId+"_0").val(data.RevisionTitle);


                        newRevisionContainer.find(documentElementSelectors.datepickers.DocumentRevisionDetailsRevisionDate).val('');
                        newRevisionContainer.show(650);
                        // autofocus on Revision Date Field on add new revision button click
                        setTimeout(
                            function() {
                                $("#RevisionDate_"+documentId+"_0").focus();
                            },1000);

                    });

            }
        }

        function loadMulitNameNumberPopup(e) {
            $("<div></div>").multinamenumber({
                documentId: 0,
                revisionId: 0,
                token: $(documentElementSelectors.hidden.DocumentRevisionNameNumberSession).val(),
                crudUrl: GetEnvironmentLocation()+"/"+documentAjaxSettings.controllers.Document+"/"+documentAjaxSettings.actions.CreateMultipleNameNumbers,
                targetGrid: $(documentElementSelectors.grids.DocumentRevisionNameNumbers+0).data("kendoGrid")
            });
        }

        function onDocumentAddMultipleNameNumbersBtnClick(e) {
            e.preventDefault();

            var modalContainer=$(documentElementSelectors.containers.DocumentRevisionMultipleNameNumbers);

            modalContainer.find(documentElementSelectors.hidden.DocumentRevisionNameNumberDocument).val(0);
            modalContainer.find(documentElementSelectors.hidden.DocumentRevisionNameNumberRevision).val(0);
            modalContainer.find(documentElementSelectors.textboxes.DocumentRevisionMultipleNameNumbers).val('');
            modalContainer.find(documentElementSelectors.dropdownlists.DocumentRevisionMultipleNameNumbersType).data('kendoDropDownList').select(0);

            modalContainer.modal({
                backdrop: true,
                keyboard: true
            }).css(
                {
                    'margin-left': function() {
                        return -($(this).width()/2);
                    }
                });
        }

        function onDocumentRevisionAddMultipleNameNumbersBtnClick(e) {
            e.preventDefault();

            var container=$(e.currentTarget).parents(documentElementSelectors.containers.DocumentRevisionDetails+":first");
            if(container.length==0) return;

            var revisionId=container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionId).val();
            var documentId=container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentId).val();
            var modalContainer=$(documentElementSelectors.containers.DocumentRevisionMultipleNameNumbers);
            if(modalContainer.length>0&&revisionId) {
                modalContainer.find(documentElementSelectors.hidden.DocumentRevisionNameNumberDocument).val(documentId);
                modalContainer.find(documentElementSelectors.hidden.DocumentRevisionNameNumberRevision).val(revisionId);
                modalContainer.find(documentElementSelectors.textboxes.DocumentRevisionMultipleNameNumbers).val('');
                modalContainer.find(documentElementSelectors.dropdownlists.DocumentRevisionMultipleNameNumbersType).data('kendoDropDownList').select(0);

                modalContainer.modal({
                    backdrop: true,
                    keyboard: true
                }).css(
                    {
                        'margin-left': function() {
                            return -($(this).width()/2);
                        }
                    });
            }
        }

        function onDocumentRevisionDetailsDeleteAttachmentBtnClick(e) {

            e.preventDefault();

            var settings={
                message: documentMessages.modals.DocumentRevisionDeleteAttachmentMessage,
                header: documentMessages.modals.DocumentRevisionDeleteAttachmentHeader
            };
            var attachmentGridParent=$(this).parents(documentElementSelectors.grids.DocumentRevisionAttachments);
            var attachmentGrid=attachmentGridParent.data('kendoGrid');

            var dataItem=attachmentGrid? attachmentGrid.dataItem(attachmentGrid.select()):null;
            if(dataItem) {
                displayConfirmationModal(settings,function() {

                    $(this).ajaxCall(generateActionUrl(documentAjaxSettings.controllers.Document,documentAjaxSettings.actions.DeleteDocumentFile),{ DocumentInfoId: dataItem.DocumentInfoId })
                        .success(function(data) {
                            var errorMessage=parseErrorMessage(data);
                            if(errorMessage)
                                displayError(errorMessage);
                            else {

                                attachmentGrid.bind("dataBound",function attachmentWarning() {
                                    attachmentGrid.unbind("dataBound",attachmentWarning);

                                    var currentGrid=this;

                                    if(!currentGrid.dataSource||currentGrid.dataSource.data().length==0)
                                        displayError(documentMessages.warnings.DocumentRevisionAttachments);

                                    if(currentGrid.dataSource.data().length==0)
                                        $('[id*=addNewFilesBtn]',attachmentGridParent).removeClass('k-state-disabled');
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

            var container=$(e.currentTarget).parents('.modal:first');
            var nameNumbers=container.find(documentElementSelectors.textboxes.DocumentRevisionMultipleNameNumbers).val();
            var nameNumberType=container.find(documentElementSelectors.dropdownlists.DocumentRevisionMultipleNameNumbersType).val();
            var token=$(documentElementSelectors.hidden.DocumentRevisionNameNumberSession).val();

            if(!nameNumbers||!nameNumberType) {
                container.modal('hide');
                displayError(documentMessages.errors.DocumentRevisionMultipleNameNumbersRequiredInformation);
                return;
            }

            var texts=[];
            var lines=nameNumbers.split(/\n/);
            for(var i=0;i<lines.length;i++)
                if(lines[i].length>0) texts.push($.trim(lines[i]));

            var data={};
            data['documentId']=container.find(documentElementSelectors.hidden.DocumentRevisionNameNumberDocument).val();
            data['revisionId']=container.find(documentElementSelectors.hidden.DocumentRevisionNameNumberRevision).val();
            data['aliasTypeId']=nameNumberType;
            data['aliasesText']=texts;

            if(data['documentId']==0&&data['revisionId']==0) {
                data['token']=token;
            }

            $(this).ajaxJSONCall(generateActionUrl(documentAjaxSettings.controllers.Document,documentAjaxSettings.actions.CreateMultipleNameNumbers),JSON.stringify(data))
                .success(function(successData) {
                    if(successData.success==true) {
                        container.modal('hide');
                        var nameNumberGrid=$(documentElementSelectors.grids.DocumentRevisionNameNumbers+data.revisionId).data("kendoGrid");
                        if(nameNumberGrid) nameNumberGrid.dataSource.read();

                    } else
                        displayError(documentMessages.errors.DocumentRevisionMultipleNameNumbers);
                })
                .error(function() { displayError(documentMessages.errors.DocumentRevisionMultipleNameNumbers); })
                .complete(function() { displayCreatedMessage(documentMessages.success.DocumentRevisionMultipleNameNumbersSaved); });
        }

        function onDocumentRevisionMultipleNameNumbersKeyUp(e) {
            if(e.keyCode==keyCodeValues.Enter||(e.ctrlKey&&e.keyCode==keyCodeValues.V)) {
                var arr=e.currentTarget.value.split("\n");
                var arrDistinct=new Array();
                $(arr).each(function(index,item) {
                    if(item.length>0) {
                        if($.inArray(item,arrDistinct)==-1)
                            arrDistinct.push(item);
                    }
                });

                e.currentTarget.value="";
                $(arrDistinct).each(function(index,item) {
                    e.currentTarget.value=e.currentTarget.value+item+"\n";
                });
            }
        }

        function onDocumentRevisionCompanySearchBtnClick(e) {

            e.preventDefault();

            var buttonElement=$(e.currentTarget);
            if(displaySupplierPopUp) {
                displaySupplierPopUp(function(data) {

                    var siblingSelector=getCompanyTextFieldSibling(buttonElement);
                    if(siblingSelector) {
                        var companyInfo=getCompanyTemplate? getCompanyTemplate(data.CompanyId,data.Name):data.CompanyId+', '+data.Name;
                        buttonElement.siblings(siblingSelector+":first").val(companyInfo).trigger('change');
                    }
                });
            }
        }

        function onDocumentRevisionCompanyViewBtnClick(e) {

            e.preventDefault();

            var buttonElement=$(e.currentTarget);
            var siblingField=getCompanyTextFieldSibling(buttonElement);
            if(!siblingField) return;

            var companyFieldValue=buttonElement.siblings(siblingField+":first").val();
            var companyId=extractCompanyIdFromTemplate? extractCompanyIdFromTemplate(companyFieldValue):null;
            if(companyId&&generateLocationUrl) {
                var url=generateLocationUrl("Operations/Company/LoadSingleSupplier?supplierId="+companyId);
                window.open(url,"_blank");
            } else
                displayError(documentMessages.errors.CompanyViewError);
        }

        function onDocumentRevisionDetailsAddAttachmentBtnClick(e) {
            e.preventDefault();

            if($(e.currentTarget).hasClass('k-state-disabled')) {
                return false;
            }

            if(displayUploadModal) {

                var container=$(this).parents(documentElementSelectors.containers.DocumentRevisionDetails+":first");
                if(container.length>0) {
                    var documentId=container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentId).val();
                    var revisionId=extractReferenceId(this.getAttribute('id'));


                    displayUploadModal(function() {
                        return { documentId: documentId,revisionId: revisionId };
                    },function(data) {
                        var deferred=$.Deferred();

                        setTimeout(function() {

                            var containerType=$(documentElementSelectors.dropdownlists.DocumentDetailsContainerTypeExact+documentId).val();
                            if(containerType=="2"&&data.length>1) {
                                displayError(documentMessages.errors.DocumentRevisionKitAttachments);
                                deferred.reject();

                            } else {
                                $(this).ajaxCall(generateActionUrl(documentAjaxSettings.controllers.Document,documentAjaxSettings.actions.SaveDocumentRevisionAttachments),{
                                    files: data.map(function(item) { return { FileName: item.filename,PhysicalPath: item.physicalPath,DocumentId: documentId,RevisionId: revisionId }; }),
                                    documentId: documentId,
                                    revisionId: revisionId,
                                    isNewRevision: false
                                })
                                    .success(function(result) {
                                        if(result.message=="Error"||result.success==false) {
                                            displayError(documentMessages.errors.DocumentRevisionAttachment);
                                            deferred.reject();
                                        } else {
                                            var attachmentGrid=container.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
                                            if(attachmentGrid)
                                                attachmentGrid.dataSource.read();

                                            displayCreatedMessage(documentMessages.success.DocumentRevisionAttachmentsSaved);
                                            deferred.resolve();

                                            $(e.currentTarget).addClass('k-state-disabled');
                                        }
                                    })
                                    .error(function() {
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

                        },750);

                        return deferred.promise();
                    });

                } else
                    displayError(documentMessages.errors.DocumentRevisionAttachmentData);

            } else
                displayError(documentMessages.errors.DocumentRevisionAttachmentPopUp);
        }

        function onDocumentRevisionDetailsCancelBtnClick(e) {
            e.preventDefault();

            var container=$(e.currentTarget).parents('ul'+documentElementSelectors.containers.DocumentRevisionDetails+':first').data('kendoPanelBar');
            if(container) {

                if(isContainerFieldsDirty(container.element)==true) {
                    var settings={
                        message: documentMessages.modals.DocumentRevisionDiscardChangesMessage,
                        header: documentMessages.modals.DocumentRevisionDiscardChangesHeader,
                    };

                    displayConfirmationModal(settings,function() {
                        container.reload(container.element.find('li:first'));
                    });

                } else
                    container.reload(container.element.find('li:first'));
            }
        }

        function onDocumentRevisionFieldChange(e) {
            onInputFieldChange(e);

            var element=$(e.currentTarget);
            checkDocumentRevisionDirtyStatus(element.parents(documentElementSelectors.containers.DocumentRevisionDetailsForm+":first"));
        }

        function onDocumentRevisionSaveBtnClick(e) {
            if($(e.currentTarget).hasClass('k-state-disabled')) {
                return false;
            }
            e.preventDefault();

            var form=$(e.currentTarget).parents(documentElementSelectors.containers.DocumentRevisionDetailsForm+":first");
            var formData={
                model: getDocumentRevisionDetailsData(form),
                attachments: getDocumentRevisionAttachments(form)
            };


            if(formData.model.RevisionId>0&&form.find('.k-invalid-msg.field-validation-error').not('.k-hidden').length) {
                var element=form.find('.k-invalid-msg.field-validation-error').not('.k-hidden')[0];
                var _msg='';
                if($(element).attr('data-valmsg-for')=='NameOrNumberTypeId') {
                    _msg+="<li>Name number type is required.</li>";
                }
                if($(element).attr('data-valmsg-for')=='NameOrNumber') {
                    _msg+="<li>Name or number is required.</li>";
                }
                if(_msg) {
                    displayError('<ul>'+_msg+'</ul>');
                }

                return;
            }
            var errMsg="";
            if(formData.model.SupplierId==''||formData.model.SupplierId<=0) {
                errMsg+="<li>Supplier is required.</li>";
            }
            if(formData.model.VerifyDate=='') {
                errMsg+="<li>Verify date is required.</li>";
            }
            if(formData.model.RevisionTitle=='') {
                errMsg+="<li>Revision title is required.</li>";
            }
            if(formData.model.RevisionId==0&&(formData.model.DocumentSourceId==''||formData.model.SupplierId<=0)) {
                errMsg+="<li>Document source is required.</li>";
            }
            if(errMsg!='') {
                displayError('<ul>'+errMsg+'</ul>');
                return;
            }
            if(formData.model.RevisionDate.toString()=="") {
                $("<div/>").kendoConfirm({
                    title: documentMessages.modals.NullRevisionConfirmTitle,
                    content: documentMessages.modals.NullRevisionConfirmMessage,
                    actions: [
                        {
                            text: 'Confirm',
                            primary: true,
                            action: function(event) {
                                SaveDocumentRevisionData(form,formData,e);
                                // Returning false will prevent the closing of the dialog
                                return true;
                            },
                        },
                        { text: 'Cancel' }
                    ]
                }).data("kendoConfirm").open().center();
            }
            else
                SaveDocumentRevisionData(form,formData,e);
        }

        function SaveDocumentRevisionData(form,formData,e) {
            if(formData.model) {
                //Make sure the new revision is bigger than the latest revision
                var newRevisionDate=formData.model.RevisionDate.toString();
                var newVerifyDate=formData.model.VerifyDate.toString();
                var revListGrid=$("#gdDocumentRevisions_"+formData.model.DocumentId).data('kendoGrid');
                var availalbeRevisions=revListGrid.dataSource.data();
                var quitPost=false;
                $.each(availalbeRevisions,function(i,row) {
                    var previousRevisionDate=(row.RevisionDate!=null)? (row.RevisionDate.getMonth()+1)+'/'+row.RevisionDate.getDate()+'/'+row.RevisionDate.getFullYear():"";
                    //if (row.RevisionDate != null)
                    //    previousRevisionDate = (row.RevisionDate.getMonth() + 1) + '/' + row.RevisionDate.getDate() + '/' + row.RevisionDate.getFullYear();
                    var previousConfirmationDate=(row.VerifyDate.getMonth()+1)+'/'+row.VerifyDate.getDate()+'/'+row.VerifyDate.getFullYear();

                    //This only consider for the new revision
                    if(formData.model.RevisionId==0) {
                        if(row.RevisionDate!=null&&newRevisionDate==previousRevisionDate) {
                            displayError("Can not create revision with duplicate revision date.");
                            quitPost=true;
                            return false;
                        } else if(newVerifyDate==previousConfirmationDate) {
                            displayError("New revision should have updated verify date.");
                            quitPost=true;
                            return false;
                        }
                    }
                    else if(formData.model.RevisionId!=row.RevisionId) {
                        if(row.RevisionDate!=null&&newRevisionDate==previousRevisionDate) {
                            displayError("Revision with same revision date already exists.");
                            quitPost=true;
                            return false;
                        } else if(newVerifyDate==previousConfirmationDate) {
                            displayError("Revision with same verify date already exists.");
                            quitPost=true;
                            return false;
                        }
                    }

                });

                if(quitPost)
                    return false;

                var containerType=$(documentElementSelectors.containers.DocumentDetailsFormExact+formData.model.DocumentId).find(documentElementSelectors.dropdownlists.DocumentDetailsContainerType).val();
                if(formData.model.RevisionId==0&&formData.attachments.length==0&&containerType!=2) {
                    displayError(documentMessages.errors.SaveNewDocumentRevisionAttachmentError);
                    return false;
                }

                //Prevent continuously click
                $(e.currentTarget).addClass('k-state-disabled');

                if(formData.model.RevisionId>0) {
                    submitRevison(form,formData,e);
                }
                else
                    $.ajax({
                        type: 'GET',
                        dataType: 'json',
                        cache: false,
                        url: controllerCalls.GetSiblingList,
                        data: { documentId: formData.model.DocumentId },
                        success: function(result,textStatus,jqXHR) {
                            if(result.length>0) {
                                var siblingList=[];
                                for(var idx=0;idx<result.length;idx++) {
                                    siblingList.push(
                                        {
                                            DocumentId: result[idx].ReferenceId,
                                            RevisionTitle: result[idx].RevisionTitle,
                                            Included: true
                                        });
                                }
                                var siblingLib=$("#siblingPopup").bundlesiblings({
                                    siblingDataSource: siblingList,
                                    submitForm: form,
                                    submitData: formData,
                                    target: e,
                                    revisionCallback: function(form,formData,e) {
                                        submitRevison(form,formData,e);
                                    },
                                    inboundRevisionCallback: null
                                });
                            }
                            else {
                                submitRevison(form,formData,e);
                            }
                        },
                        error: function(jqXHR,textStatus,errorThrown) {
                            //Parent will throw error
                        }
                    });
            }
            else
                displayError(documentMessages.errors.SaveDocumentRevisionError);
        }


        function submitRevison(form,formData,e) {
            var url=form.attr("action");
            $(this).ajaxCall(url,formData)
                .success(function(data) {
                    $(e.currentTarget).removeClass('k-state-disabled');
                    var errorMessage=parseErrorMessage(data);
                    if(!errorMessage) {
                        displayCreatedMessage(documentMessages.success.DocumentRevisionSaved);
                        setContainerFieldDefaultValues(form,checkDocumentRevisionDirtyStatus);
                        if(formData.model.RevisionId==0) {
                            form.parents('ul'+documentElementSelectors.containers.DocumentNewRevisionDetails).hide(500);
                            var revisionTab=form.parents(documentElementSelectors.containers.DocumentDetailsTab+':first');
                            if(revisionTab.length>0) {
                                var revisionGrid=revisionTab.find(documentElementSelectors.grids.DocumentRevision).data('kendoGrid');
                                if(revisionGrid) {
                                    revisionGrid.dataSource.bind("change",function newRevisionRead() {
                                        revisionGrid.expandRow(revisionGrid.wrapper.find('tr.k-master-row:first'));
                                        revisionGrid.dataSource.unbind("change",newRevisionRead);
                                    });
                                    revisionGrid.dataSource.read();
                                }
                            }

                            //Refersh Silbing if it already displayed
                            var btnSibliing=$("#btnRefreshSibling_"+formData.model.DocumentId);
                            if(btnSibliing!=null) {
                                btnSibliing.click();
                            }

                            clearDocumentRevisionAttachments(form);

                        } else {
                            var lastUpdatePopOver=form.find(documentElementSelectors.general.DocumentRevisionLastUpdatePopOver);
                            if(lastUpdatePopOver.length>0)
                                lastUpdatePopOver.data('popover').options.content=data.LastUpdatedDescription;
                        }

                    } else
                        displayError(errorMessage);
                })
                .error(function() {
                    $(e.currentTarget).removeClass('k-state-disabled');
                    displayError(documentMessages.errors.SaveDocumentRevisionError);
                });
        }

        function submitInboundRevision(form,formData) {
            var url=form.attr("action");

            if(formData.model.RevisionId>0&&form.find('.k-invalid-msg.field-validation-error').not('.k-hidden').length) {
                var element=form.find('.k-invalid-msg.field-validation-error').not('.k-hidden')[0];
                var _msg='';
                if($(element).attr('data-valmsg-for')=='NameOrNumberTypeId') {
                    _msg+="<li>Name number type is required.</li>";
                }
                if($(element).attr('data-valmsg-for')=='NameOrNumber') {
                    _msg+="<li>Name or number is required.</li>";
                }
                if(_msg) {
                    displayError('<ul>'+_msg+'</ul>');
                }

                return;
            }
            var errMsg="";
            if(formData.model.SupplierId==''||formData.model.SupplierId<=0) {
                errMsg+="<li>Supplier is required.</li>";
            }
            if(formData.model.VerifyDate=='') {
                errMsg+="<li>Verify date is required.</li>";
            }
            if(formData.model.RevisionTitle=='') {
                errMsg+="<li>Revision title is required.</li>";
            }
            if(formData.model.RevisionId==0&&(formData.model.DocumentSourceId==''||formData.model.SupplierId<=0)) {
                errMsg+="<li>Document source is required.</li>";
            }
            if(errMsg!='') {
                displayError('<ul>'+errMsg+'</ul>');
                return;
            }
            if(formData.model.RevisionDate.toString()=="") {
                $("<div/>").kendoConfirm({
                    title: documentMessages.modals.NullRevisionConfirmTitle,
                    content: documentMessages.modals.NullRevisionConfirmMessage,
                    actions: [
                        {
                            text: 'Confirm',
                            primary: true,
                            action: function(e) {
                                doInboundRevisionSubmit(url,formData);
                                return true;
                            },
                        },
                        { text: 'Cancel' }
                    ]
                }).data("kendoConfirm").open().center();
            }
            else
                doInboundRevisionSubmit(url,formData);
        }

        function doInboundRevisionSubmit(url,formData) {
            $(this).ajaxCall(url,formData)
                .success(function(data) {
                    var errorMessage=parseErrorMessage(data);
                    if(!errorMessage) {

                        var tokens=Array.from(location.search.substring(1).split("&"));
                        var clientRevision=false;
                        try {
                            clientRevision=(tokens.find(e => e.toLowerCase().indexOf("clientrevision")==0).split("=")[1]=="yes");
                        }
                        catch(e) { }

                        if(!clientRevision) parent.window.opener.location.reload();
                        if(clientRevision) parent.window.focus();

                        window.close();

                    } else
                        displayError(errorMessage);
                })
                .error(function() {
                    displayError(documentMessages.errors.SaveDocumentRevisionError);
                });
        }

        function onDocRevSaveForInboundResponseBtnClick(e) {
            e.preventDefault();
            //var documentId = location.search.substring(1).split('&')[1].split('=')[1];

            var tokens=Array.from(location.search.substring(1).split("&"));
            var documentId=parseInt(tokens.find(e => e.toLowerCase().indexOf("documentid")==0).split("=")[1]);

            var form=$(e.currentTarget).parents(documentElementSelectors.containers.DocumentRevisionDetailsForm+":first");

            var formData={
                inboundResponseId: $(this).getQueryStringParameterByName("inboundresponseid"),
                model: getDocRevDetailsDataForInboundResponse(form,documentId,0),
                attachments: getDocRevAttachmentsForInboundResponse(form,documentId,0)
            };

            if(formData.model) {
                var url=form.attr("action");
                if(formData.attachments.length>0) {
                    $.ajax({
                        type: 'GET',
                        dataType: 'json',
                        cache: false,
                        url: controllerCalls.GetSiblingList,
                        data: { documentId: formData.model.DocumentId },
                        success: function(result,textStatus,jqXHR) {
                            if(result.length>0) {
                                var siblingList=[];
                                for(var idx=0;idx<result.length;idx++) {
                                    siblingList.push(
                                        {
                                            DocumentId: result[idx].ReferenceId,
                                            RevisionTitle: result[idx].RevisionTitle,
                                            Included: true
                                        });
                                }

                                var siblingLib=$("#siblingPopup").bundlesiblings({
                                    siblingDataSource: siblingList,
                                    submitForm: form,
                                    submitData: formData,
                                    target: null,
                                    revisionCallback: null,
                                    inboundRevisionCallback: function(form,formData) {
                                        submitInboundRevision(form,formData);
                                    }
                                });
                            }
                            else {
                                submitInboundRevision(form,formData);
                            }
                        },
                        error: function(jqXHR,textStatus,errorThrown) {
                            //Parent will throw error
                        }
                    });
                    return;
                }

                // if there are no attachments, prompt for a save confirmation
                if(formData.attachments.length==0) {
                    var settings={
                        header: documentMessages.modals.GeneralConfirm,
                        message: documentMessages.modals.SaveRevisionWothoutAttachment,
                    };

                    // no attachment
                    proceedWithSave=false;
                    displayConfirmationModal(settings,function() {
                        $(this).ajaxCall(url,formData)
                            .success(function(data) {
                                var errorMessage=parseErrorMessage(data);
                                if(!errorMessage) {
                                    parent.window.opener.location.reload();
                                    window.close();
                                } else
                                    displayError(errorMessage);
                            })
                            .error(function() {
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

            var buttonElement=$(e.currentTarget);
            var siblingField=getCompanyTextFieldSibling(buttonElement);
            if(!siblingField) return;

            var url=generateActionUrl(documentAjaxSettings.controllers.Document,documentAjaxSettings.actions.LoadUnknownManufacturer);
            $(this).ajaxCall(url)
                .success(function(data) {
                    if(data!='') {
                        var supplierField=buttonElement.siblings(siblingField+":first");
                        supplierField.val(data).trigger('change');
                    }
                })
                .error(function(xhr,textStatus,error) { displayError(error); });
        }

        function clearRevisionDates(container,documentId) {
            if(container&&container.length>0) {
                container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsRevisionDate).val('');
            }
        }

        function setDocumentRevisionDetailsDefaultValues(container,documentId) {
            if(container&&container.length>0) {
                container.find(documentElementSelectors.checkboxes.DocumentRevisionDetailsBestImageAvailable).prop("checked",false);
                container.find(documentElementSelectors.checkboxes.DocumentRevisionDetailsDocumentVersion).val('');
                container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsRevisionDate).val('');
                container.find(documentElementSelectors.datepickers.DocumentRevisionDetailsVerifyDate).val('');
                container.find(documentElementSelectors.radiobuttons.DocumentRevisionDetailsIsBadImage).prop("checked",false);
                container.find(documentElementSelectors.radiobuttons.DocumentRevisionDetailsIsGoodImage).prop("checked",false);
                container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentIdentification).val('');
                container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsDocumentVersion).val('');
                container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsManufacturerId).val('');
                container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsRevisionTitle).val('');
                container.find(documentElementSelectors.textboxes.DocumentRevisionDetailsSupplierId).val('');
                container.find(documentElementSelectors.buttons.DocumentRevisionNewFile).removeClass('k-state-disabled');
                var pnl=documentElementSelectors.containers.DocumentNewRevisionDetailsExact.substr(1,documentElementSelectors.containers.DocumentNewRevisionDetailsExact.length-1)+documentId;
                $(documentElementSelectors.buttons.DocumentRevisionDetailsAddAttachment,$("[id*="+pnl+"]")).removeClass("k-state-disabled");
            }
        }
        var onDocumentRevisionAttachmentDataBound=function(e) {
            this.element.find('tbody tr:first').addClass('k-state-selected')
        };

        var onDocumentRevisionAttachmentSave=function(e) {

            // When revision id is 0 the controller is not hit, we force this action to occur here
            if(e.model.RevisionId==0) {
                var attachment={
                    DocumentId: e.model.DocumentId,
                    DocumentInfoDescription: e.model.DocumentInfoDescription,
                    DocumentInfoId: e.model.DocumentInfoId,
                    FileName: e.model.FileName,
                    PhysicalPath: e.model.PhysicalPath,
                    RevisionId: e.model.RevisionId,
                };

                // alert(JSON.stringyfy(attachment));

                $(this).ajaxCall(generateActionUrl(documentAjaxSettings.controllers.Document,documentAjaxSettings.actions.UpdateDocumentInfoDescription),attachment)
                    .success(function(data) {
                        var errorMessage=parseErrorMessage(data);
                        if(errorMessage) displayError(errorMessage);
                    })
                    .error(function() { displayError(documentMessages.errors.DocumentRevisionAttachmentDescriptionUpdate); });
            }
        };

        var onDocumentRevisionConfirmationDateChange=function(e) {
            var parentContainer=$(e.sender.element).parents("form");
            var kDatePicker=parentContainer.find(documentElementSelectors.datepickers.DocumentRevisionDetailsVerifyDate).data('kendoDatePicker');
            if(this.value()==null) {
                //displayError(documentMessages.errors.ConfirmationDateFuture);
                //kDatePicker.value(new Date());
                //kDatePicker.trigger("change");
                // this._oldText = new Date();
                return;
            }

            var sDateEntered=kendo.toString(this.value(),'d');
            var now=new Date();
            var dateEntered=new Date(sDateEntered);
            if(dateEntered>now) {
                // added by nitin 17 May 2021(Future date check)
                kDatePicker.value(null);
                // end
                displayError(documentMessages.errors.ConfirmationDateFuture);
                //  $(e.sender.element).val(new Date());
                return;
            }

            // added by nitin 3 June 2021(1/1/1979 date check)
            var sDateEntered=kendo.toString(this.value(),'d');
            var minDate=new Date('1/1/1979');
            var dateEntered=new Date(sDateEntered);
            if(dateEntered<minDate) {
                kDatePicker.value(null);
                // end
                displayError(documentMessages.errors.InvalidVerifyDate);
                //  $(e.sender.element).val(new Date());
                return;
            }


            var parentContainer=$(e.sender.element).parents("form");
            if(parentContainer.length>0) {
                var revisionDate=new Date(parentContainer.find(documentElementSelectors.datepickers.DocumentRevisionDetailsRevisionDate).val());
                if(dateEntered<revisionDate) {
                    // var kVDatePicker = parentContainer.find(documentElementSelectors.datepickers.DocumentRevisionDetailsVerifyDate).data('kendoDatePicker');
                    kDatePicker.value(null);
                    // $(e.sender.element).val(new Date());
                    displayError(documentMessages.errors.ConfirmationDateGreaterThanRevisionDate);
                    return;
                }
            }
        };

        var onNameNumberGridDataBound=function(e) {
        }

        var onDocumentRevisionNameNumberGridEdit=function(e) {
            var update=$(e.container).parent().find(".k-grid-update");
            var cancel=$(e.container).parent().find(".k-grid-cancel");
            $(update).attr('title','Save');
            $(cancel).attr('title','Cancel');
        };

        var onDocumentRevisionNameNumberGridSave=function(e) {
            var editClass="tr.k-grid-edit-row.k-state-selected";
            var dataItem=e.sender.tbody.find(editClass);
            dataItem.closest("tr").removeClass("k-state-selected").addClass("k-active");
        };
        var onProductAliasGridDestroy=function(e) {
            e.preventDefault();
            var dataItem=e.model;//this.dataItem($(e.currentTarget).closest("tr"));
            var grid=$(documentElementSelectors.grids.ProductAliasGrid+dataItem.ProductId).data("kendoGrid");
            kendo.confirm('Are you sure you want to delete: '+dataItem.AliasName)
                .done(function() {
                    grid.dataSource.remove(dataItem);
                    grid.dataSource.sync();
                    grid.refresh();
                })
                .fail(function() {
                    grid.refresh();
                });
        };

        var onDocumentRevisionRevisionDateChange=function(e) {
            var parentContainer=$(e.sender.element).parents("form");
            var kDatePicker=parentContainer.find(documentElementSelectors.datepickers.DocumentRevisionDetailsRevisionDate).data('kendoDatePicker');
            var sDateEntered=kendo.toString(this.value(),'d');
            if(sDateEntered==null) {
                ///displayError(documentMessages.errors.RevisionDateFuture);
                // kDatePicker.value(null);
                // kDatePicker.trigger("change");
                // kDatePicker.value(null);
                return
            };
            var now=new Date();
            var dateEntered=new Date(sDateEntered);
            if(dateEntered>now) {
                // added by nitin 17 May 2021(Future date check)
                kDatePicker.value(null);
                // end
                displayError(documentMessages.errors.RevisionDateFuture);
                //  $(e.sender.element).val(new Date());
                return;
            }

            // added by nitin 3 June 2021(1/1/1979 date check)
            var sDateEntered=kendo.toString(this.value(),'d');
            var minDate=new Date('1/1/1979');
            var dateEntered=new Date(sDateEntered);
            if(dateEntered<minDate) {
                kDatePicker.value(null);
                // end
                displayError(documentMessages.errors.InvalidRevisionyDate);
                //  $(e.sender.element).val(new Date());
                return;
            }

            // As per request by Ops if the date is today automatically set the confirm date to today's date as well
            var todaysDate=kendo.toString(kendo.date.today(),'d');
            if(todaysDate==sDateEntered) {
                var parentContainer=$(e.sender.element).parents("form");
                if(parentContainer.length>0) {
                    var kDatePicker=parentContainer.find(documentElementSelectors.datepickers.DocumentRevisionDetailsVerifyDate).data('kendoDatePicker');
                    if(kDatePicker) {
                        kDatePicker.value(sDateEntered);
                        kDatePicker.element.trigger("change");
                    }
                }
            }
            //added validation for revesion date to be less than confirmation date
            var parentContainer=$(e.sender.element).parents("form");
            if(parentContainer.length>0) {
                var DCkDatePicker=parentContainer.find(documentElementSelectors.datepickers.DocumentRevisionDetailsVerifyDate).data('kendoDatePicker');
                if(DCkDatePicker) {
                    if(DCkDatePicker.value()!=null) {
                        var dateString=kendo.toString(DCkDatePicker.value(),'d')
                        confirmDate=new Date(dateString);
                        if(dateEntered>confirmDate) {
                            var kDatePicker=parentContainer.find(documentElementSelectors.datepickers.DocumentRevisionDetailsRevisionDate).data('kendoDatePicker');
                            // $(e.sender.element).val(new Date());
                            kDatePicker.value(null);
                            displayError(documentMessages.errors.RevisionDateLessThanConfirmationDate);
                        }
                    }
                }
            }
        };




        /******************************** Notes Methods ********************************/
        function displayDocumentNote(documentId,message) {
            if(documentId) {
                var container=$(documentElementSelectors.containers.DocumentNotes+documentId);
                if(container.length>0) container.html(message);
            }
        }

        function onDocumentNoteEditSave() {

            var validationSummary=$('div.validation-summary-valid.validationSummary ul');
            if(validationSummary.length==0) return;

            validationSummary.find('li').remove();

            if($("#Notes").val().length==0)
                validationSummary.append(documentElements.DocumentNoteRequiredNotes);
            else
                validationSummary.find('li').remove(".notes-required");

            if($("#NoteTypeId").val().length==0)
                validationSummary.append(documentElements.DocumentNoteRequiredNoteType);
            else
                validationSummary.find('li').remove(".note-type-required");

            validationSummary.append(documentElements.BlankListItem);
        }

        function onDocumentNoteEditCancel(e) {
            e.preventDefault();

            var noteGrid=$(documentElementSelectors.grids.DocumentNotes+e.data.documentId).data("kendoGrid");
            if(noteGrid) {
                var dataItem=noteGrid.dataItem(noteGrid.select());
                noteGrid.dataSource.read();

                if(dataItem) {
                    var uid=noteGrid.dataSource.get(dataItem.id).uid;
                    noteGrid.select('tr[data-uid="'+uid+'"]');
                }
            }
        }

        var onDocumentNoteChange=function() {
            var documentId=extractReferenceId(this.element.attr('id'));
            var dataItem=this.dataItem(this.select());
            var text=dataItem? dataItem.Notes:'';
            displayDocumentNote(documentId,text);
        };

        var onDocumentNoteDataBound=function() {
            var documentId=extractReferenceId(this.element.attr('id'));
            displayDocumentNote(documentId,'');
        };

        var onDocumentNoteEdit=function(e) {
            var cancel=$(e.container).parent().find(".k-grid-cancel");
            var title=$(e.container).parent().find(".k-window-title");
            var update=$(e.container).parent().find(".k-grid-update");

            $(title).html(e.model.DocumentNoteId>0? 'Edit':'Create');
            $(update).attr(e.model.DocumentNoteId>0? 'Update':'Create');
            $(cancel).attr('Cancel');

            var htmlParts=$.parseHTML($(update).html());
            $(update).html(htmlParts.length==0? '':htmlParts[0].outerHTML);

            htmlParts=$.parseHTML($(cancel).html());
            $(cancel).html(htmlParts.length==0? '':htmlParts[0].outerHTML);

            update.on("click",onDocumentNoteEditSave);
            cancel.on("click",{ documentId: e.model.DocumentId },onDocumentNoteEditCancel);

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
            if(url) {
                var documentIdString="documentId=";
                var index=url.indexOf(documentIdString)+documentIdString.length;
                if(index>0&&index<url.length) {
                    var documentId=url.substring(index);
                    return documentId? documentId:null;
                }
            }

            return null;
        }


        function onDocumentAddContainerComponentsBtnClick(e) {
            e.preventDefault();
            var currentDocumentId=extractReferenceId(this.getAttribute('id'));
            activeComponentId=currentDocumentId;
        }

        //:::::::::::::::::::Advanced Search Popup Callback Begin::::::::::::::::::::::::::::::::://
        var AddContainerComponentCallBack=function(dItem) {

            var model={
                ChildDocumentId: dItem.ReferenceId,
                ClassificationTypeId: '',
                ParentDocumentId: activeComponentId
            };
            $(this).ajaxCall(generateActionUrl(documentAjaxSettings.controllers.Document,documentAjaxSettings.actions.SaveDocumentContainerComponent),model)
                .success(function(result) {
                    var errorMessage=parseErrorMessage(result);
                    if(errorMessage)
                        displayError(errorMessage);
                    else
                        refreshDocumentContainersGrid(activeComponentId);
                })
                .error(function() { displayError(documentMessages.errors.SaveDocumentContainerComponent); });
        }
        //:::::::::::::::::::Advanced Search Popup Callback End::::::::::::::::::::::::::::::::://

        function onDocumentDeleteContainerComponentBtnClick() {
            var currentRow=$(this).parents('tr[role="row"]');
            var grid=$(this).parents('.k-grid:first').data('kendoGrid');
            if(grid.dataSource.total()<=2) {
                kendo.alert(documentMessages.errors.KitsComponentsTotalError);
                return;
            }

            var dataItem=grid? grid.dataItem(currentRow):null;
            if(dataItem) {

                var settings={
                    header: documentMessages.modals.DocumentDeleteContainerComponentHeader,
                    message: documentMessages.modals.DocumentDeleteContainerComponentMessage,
                };

                if(confirm(documentMessages.modals.DocumentDeleteContainerComponentMessage)) {
                    var data={
                        ChildDocumentId: dataItem.ChildDocumentId,
                        ContainerTypeId: dataItem.ContainerTypeId,
                        KitGroupContainerId: dataItem.KitGroupContainerId,
                        ParentDocumentId: dataItem.ParentDocumentId,
                    };

                    $(this).ajaxCall(generateActionUrl(documentAjaxSettings.controllers.Document,documentAjaxSettings.actions.RemoveDocumentContainerComponent),data)
                        .success(function(result) {
                            var errorMessage=parseErrorMessage(result);
                            if(errorMessage)
                                displayError(errorMessage);
                            else
                                refreshDocumentContainersGrid(dataItem.ParentDocumentId);
                        })
                        .error(function() { displayError(documentMessages.errors.DocumentContainerComponentDelete); });
                }
            }
        }

        function refreshDocumentContainersGrid(documentId) {
            var componentGrid=$(documentElementSelectors.grids.DocumentContainerComponents+documentId).data('kendoGrid');
            if(componentGrid) {
                componentGrid.dataSource.read();
            }
        }

        var onDocumentContainerClassificationTypeChange=function() {
            refreshDocumentContainersGrid(this.element.attr('id'));
        };

        var onDocumentContainerClassificationTypeDataBound=function() {
            refreshDocumentContainersGrid(this.element.attr('id'));
        };

        var onDocumentContainerClassificationTypeRequestStart=function(e) {
            if(e.type=='read') {
                var documentId=extractDocumentIdFromRequestUrl(this.transport.options.read.url);
                var containerType=$(documentElementSelectors.containers.DocumentDetailsFormExact+documentId).find(documentElementSelectors.dropdownlists.DocumentDetailsContainerType).val();
                this.transport.options.read.data={ containerTypeId: containerType };
            }
        };

        var onDocumentContainerComponentsRequestStart=function(e) {
            if(e.type=='read') {
                var documentId=extractDocumentIdFromRequestUrl(this.transport.options.read.url);
                var classificationType=$(documentElementSelectors.dropdownlists.DocumentContainerClassificationType+documentId).val();
                this.transport.options.read.data={ classificationType: classificationType };
            }
        };

        /******************************** Status Notes Methods ********************************/
        function displayDocumentStatusNote(documentId,message) {
            if(documentId) {
                var container=$(documentElementSelectors.containers.DocumentStatusHistory+documentId);
                if(container.length>0) container.html(message);
            }
        }

        var onDocumentStatusHistoryChange=function() {
            var documentId=extractReferenceId(this.element.attr('id'));
            var dataItem=this.dataItem(this.select());
            var text=dataItem? dataItem.Notes:'';
            displayDocumentStatusNote(documentId,text);
        };

        var onDocumentStatusHistoryDataBound=function() {
            var documentId=extractReferenceId(this.element.attr('id'));
            displayDocumentStatusNote(documentId,'');
        };

        var UnlinkDocFromProudct=function(e) {
            e.preventDefault();
            var dataItem=this.dataItem($(e.currentTarget).closest("tr"));
            var pid=dataItem.id;

            //dataItem.IsSelected = true;
            var targetId=e.delegateTarget.id;
            var did=targetId.substring(targetId.indexOf("_")+1,targetId.length);

            DisplayConfirmationModal({ message: documentMessages.warnings.UnlinkDocumentFromProudct,header: 'Confirm to remove document from product' },function() {
                $.post(controllerCalls.RemoveProductDocumentsWithoutCheckDuplicate,{ productId: pid,documentId: did },function(data) {
                    if(!data.Success) {
                        $(this).displayError(data.Message);
                        return;
                    }
                    //Remove the row instead of refresh grid, it's much faster
                    var gView=$("#"+targetId).data("kendoGrid");
                    gView.removeRow($(dataItem)); //just gives alert message
                    gView.dataSource.remove(dataItem); //removes it actually from the grid

                    //var gNonProduct = $(documentElementSelectors.grids.NonDocumentProduct + did).data("kendoGrid");
                    //gNonProduct.dataSource.page(1);
                    //gNonProduct.dataSource.read();

                    getRealNumberForProductAssociation(did);
                });
            });
        };

        var onDocumentRevisionNameNumberError=function(e) {

            var tokens=e.errors["ServerError"].errors[0].split(":");
            $(this).displayError(tokens[1]);
            var gridId='#gdRevisionNameNumber_'+tokens[0];
            var grid=$(gridId).data("kendoGrid");
            grid.one("dataBinding",function(e) {
                e.preventDefault();
            });
            return;
        }


        //***************Due Diligence Methods*********************??
        var ClearCommunicationText=function() {
            $('#DocumentDueDiligenceText').html("");
        };


        var SelectDocumentDueDiligence=function(e) {
            e.preventDefault();
            var selectedObj=this.select();
            var selectedData=this.dataItem(selectedObj);
            console.log(selectedData);
            $('#DocumentDueDiligenceText_'+selectedData.DocumentId).html(selectedData.CommunicationNotes);
        };
        //***************End Due Diligence Methods*********************??

        function error_handler(e) {
            //console.log(e);
            //if (e.errors) {
            //    var message = "Errors:\n";
            //    $.each(e.errors, function (key, value) {
            //        if ('errors' in value) {
            //            $.each(value.errors, function () {
            //                message += this + "\n";
            //            });
            //        }
            //    });
            //    alert(message);
            //}
        }
        var afterSaveProductAlias=function(e) {
            // create event - triggered after a new row has been addd to the grid
            if(e.type=="create"||e.type=="update") {

                // check for errors
                if(e.response.Errors!=null) {

                    // error response
                    console.log(Array.from(e.response.Errors.ServerError.errors)[0]);
                    var data=JSON.parse(Array.from(e.response.Errors.ServerError.errors)[0]);

                    var grid=$(documentElementSelectors.grids.ProductAliasGrid+data.ProductId).data('kendoGrid');
                    grid.one("dataBinding",function(e) {
                        e.preventDefault();
                    });

                    // display the first error and keep the grid in edit mode

                    $(this).displayError("Duplicate Alias Name not allowed : "+data.AliasName);
                    e.preventDefault();

                }

            }

        };

        var afterSaveNameNumber=function(e) {

            // create event - triggered after a new row has been addd to the grid
            if(e.type=="create"||e.type=="update") {

                // check for errors
                if(e.response.Errors!=null) {

                    // error response
                    console.log(Array.from(e.response.Errors.ServerError.errors)[0]);
                    var data=JSON.parse(Array.from(e.response.Errors.ServerError.errors)[0]);

                    var grid=$('#gdRevisionNameNumber_'+data.RevisionId).data('kendoGrid');
                    grid.one("dataBinding",function(e) {
                        e.preventDefault();
                    });

                    // display the first error and keep the grid in edit mode

                    $(this).displayError("Duplicate Name Or Number not allowed : "+data.NameNumber);
                    e.preventDefault();


                }
                else {

                    // no errors in creation of name number pair
                    var revisionId=Array.from(e.response.Data)[0].RevisionId;
                    var documentId=Array.from(e.response.Data)[0].DocumentId;
                    //var grid = $('#gdRevisionNameNumber_' + revisionId).data('kendoGrid').dataSource.read();

                }

            }

        };

        var cloneNextNewRevision=function(dataItem) {
            var sequenceId=dataItem.DocumentId;
            $(documentElementSelectors.textboxes.DocumentRevisionTitle_Revision+sequenceId+"_0").val(dataItem.RevisionTitle);
            $(documentElementSelectors.textboxes.DocumentManufacturerId_Revision+sequenceId+"_0").val(dataItem.ManufacturerId);
            DoLookUpSupplierOnKeyEnter($(documentElementSelectors.textboxes.DocumentManufacturerId_Revision+sequenceId+"_0"));
            $(documentElementSelectors.textboxes.DocumentSupplierId_Revision+sequenceId+"_0").val(dataItem.SupplierId);
            DoLookUpSupplierOnKeyEnter($(documentElementSelectors.textboxes.DocumentSupplierId_Revision+sequenceId+"_0"));
            $(documentElementSelectors.textboxes.DocumentIdentification_Revision+sequenceId+"_0").val(dataItem.DocumentIdentification);
            $(documentElementSelectors.textboxes.DocumentVersion_Revision+sequenceId+"_0").val(dataItem.DocumentVersion);
            var newDate=new Date(dataItem.RevisionDate);
            newDate.setDate(newDate.getDate()+1);
            $(documentElementSelectors.datepickers.DocumentRevisionDate_Revision+sequenceId+"_0").data("kendoDatePicker").value(newDate);
            var newDate=new Date(dataItem.VerifyDate);
            newDate.setDate(newDate.getDate()+1);
            $(documentElementSelectors.datepickers.DocumentVerifyDate_Revision+sequenceId+"_0").data("kendoDatePicker").value(newDate);
        };

        var addFieldClone=function(sequenceId) {
            $(".form-horizontal, .form-condensed, .target-group").kendoDropTarget(
                {
                    group: "target-group",
                    drop: function(e) {
                        if(!e.ctrlKey)
                            return;
                        var sourceGrid=$(e.draggable.currentTarget).closest("[data-role=grid]");
                        var dataItem=sourceGrid.data("kendoGrid").dataItem($(e.draggable.currentTarget).closest("tr"));
                        cloneNextNewRevision(dataItem);
                    }
                })

            //$(documentElementSelectors.datepickers.DocumentRevisionDate_Revision + sequenceId + "_0").kendoDraggable({
            //    hint: function () {
            //        return $("#draggableRevDate").clone();
            //    }
            //});

            $(documentElementSelectors.datepickers.DocumentVerifyDate_Revision+sequenceId+"_0").kendoDropTarget({
                drop: function(e) {
                    e.dropTarget.val(e.draggable.currentTarget.val());
                }
            });

            $(documentElementSelectors.textboxes.DocumentManufacturerId_Revision+sequenceId+"_0").kendoDraggable({
                hint: function(e) {
                    return $(documentElementSelectors.textboxes.DocumentManufacturerId_Revision+sequenceId+"_0").clone().width($(documentElementSelectors.textboxes.DocumentManufacturerId_Revision+sequenceId+"_0").width());

                }
            });

            $(documentElementSelectors.textboxes.DocumentSupplierId_Revision+sequenceId+"_0").kendoDropTarget({
                drop: function(e) {
                    e.dropTarget.val(e.draggable.currentTarget.val());
                }
            });
        };

        var onEmojiHappyNewClick=function(e) {
            var dpeData=$("#"+e.id).data('dpedata');
            var dpeDataStatus=$("#"+e.id).data('dpedata_status');

            var dpeDataLib=$("#dpeExtractDataPopup").dpedataresult({
                dpeDataSource: dpeData,
                dpeFields: dpeFields.fields.New,
                dpeFieldsStatus: dpeDataStatus,
                ManufacturerCallBack: function(target) {
                    DoLookUpSupplierOnKeyEnter(target);
                }
            });
        };

        var onEmojiHappyRevisionClick=function(e,docSequenceId,versionId) {
            var dpeData=$("#"+e.id).data('dpedata');
            var dpeDataStatus=$("#"+e.id).data('dpedata_status');

            var dpeDataLib=$("#dpeExtractDataPopup").dpedataresult({
                dpeDataSource: dpeData,
                dpeFields: dpeFields.fields.Resequence(dpeFields.fields.Revision,docSequenceId,versionId),
                dpeFieldsStatus: dpeDataStatus,
                ManufacturerCallBack: function(target) {
                    DoLookUpSupplierOnKeyEnter(target);
                }
            });
        };

        var conflictingFileUpload=function(response) {

            var response=$.parseJSON(response);
            console.log(response);

            fUploadlib.clearOnConflictedFileUpload();

            // display a message indicating that the uploaded file is associated 
            // with different document(s)/revision(s)

            kendo.ui.progress($("#mdlConflictingFileUpload"),true);

            if(attachingFileFor.toLowerCase().indexOf("_new")<0&&attachingFileFor!="FORREPLACEMENT") {

                var documentId=parseInt(Array.from(attachingFileFor.split("_")).reverse()[1]);
                var revisions=(Array.from(response.Revisions||[])).filter(e => e.DocumentId==documentId);

                // the file being uploaded may be associated with the current document itself.
                // possibilities - document has only one revision. document has two or more revisions
                // and the file is associated with the latest revision or the file is associated with
                // a revision that is not the latest.

                if(revisions.length>0) {

                    // latest revision is already the same file
                    if(revisions[0].IsLatestRevision) {

                        kendo.alert("The uploaded file is a duplicate revision. Please mark obtainment requests with 'Confirm as current'","Invalid File");

                    } else {

                        // the file being uploaded is associated with a revision that is not 
                        // the latest revision of the document.

                        kendo.alert("The uploaded file is an older revision. A newer revision already exists.","Invalid File");

                    }

                    return;

                }

            }

            $("#mdlConflictingFileUpload").modal();
            $("#mdlConflictingFileUpload > .modal-body").html("Fetching a list of matches ...");
            $("#conflictingFileName").html(response.Attachments[0].FileName);

            var message="exists under the following Doc ID(s).Clicks on the links below to access the Document(s) and create siblings.Or click on 'Close' to upload a different file.";
            if(attachingFileFor=="FORREPLACEMENT") message="exists under the following Doc ID(s). Click on 'Close' and upload another different file.";
            $("#conflictingFileMessage").html(message);

            $.post(GetEnvironmentLocation()+'/Operations/Document/ShowSiblingRevisions',response,
                function(response) {
                    kendo.ui.progress($("#mdlConflictingFileUpload"),false);
                    $("#mdlConflictingFileUpload > .modal-body").html(response);
                });
        }

        var onSaveReplaceForSelectedRevisionsBtnClick=function(e) {

            var files=$("#fileUploadReplacementFileUpload")[0].files;
            if(files==null||files.length==0) {
                kendo.alert("No file has been selected.");
                return;
            }

            // prevent double processing
            if($(e.currentTarget).hasClass('k-state-disabled')) return false;
            $(e.currentTarget).addClass('k-state-disabled');

            var data=new FormData();
            var files=$("#fileUploadReplacementFileUpload")[0].files;

            data.append("file",files[0]);
            data.append("documentid",$("#SiblingDocumentId").val());
            data.append("revisionid",$("#SiblingRevisionId").val());
            data.append("revisionids",$("#SiblingRevisionsSelected").val());

            var url=controllerCalls.ReplaceFileForRevisionSiblings;
            $.ajax({
                type: "POST",
                url: controllerCalls.ReplaceFileForRevisionSiblings,
                contentType: false,
                processData: false,
                data: data,
                success: function(result) {

                    // enable button
                    $(e.currentTarget).removeClass('k-state-disabled');

                    // refresh all attachment grids
                    var gridId="#gdRevisionFileInfoDetail_"+$("#SiblingDocumentId").val()+"_"+$("#SiblingRevisionId").val();

                    // refresh attachments grid
                    $(gridId).data("kendoGrid").dataSource.read();

                    // close dialog
                    $("#mdlListofSiblingsForReplacement").toggleModal();

                    // display message
                    displayCreatedMessage(documentMessages.success.DocumentRevisionAttachmentsReplaced);

                },
                error: function(xhr,status,p3,p4) {
                    var err="Error "+" "+status+" "+p3+" "+p4;
                    if(xhr.responseText&&xhr.responseText[0]=="{")
                        err=JSON.parse(xhr.responseText).Message;
                    $(e.currentTarget).removeClass('k-state-disabled');
                    return;
                }
            });

        }

        var handleSiblingSelectionAll=function(ctrl,id) {

            var grid=$("#gdListofSiblingsForReplacement").data("kendoGrid");

            var checked=$(ctrl).is(":checked");
            var ids=[];

            ids.push(parseInt($("#SiblingRevisionId").val()));
            if(checked) {
                Array.from(grid.dataSource.data().toJSON()).map(e => e.RevisionId).forEach(e => ids.push(e));
            }

            $("#SiblingRevisionsSelected").val(ids.join(","))
            grid.dataSource.read();

        }

        var handleSiblingSelection=function(ctrl,id) {

            var checked=$(ctrl).is(":checked");
            var ids=Array.from($("#SiblingRevisionsSelected").val().split(","));
            if(!checked) {
                ids[ids.indexOf(id+"")]=0;
                $(".chkMasterMultiSelectSibling").prop("checked","");
            }
            else ids.push(id);

            // update selected ids
            $("#SiblingRevisionsSelected").val(ids.filter(e => e!=0).join(","));

        }

        var replaceRevisionAttachment=function(e) {

            e.preventDefault();

            var tr=$(e.target).closest("tr"); // get current row
            var grid=$("#"+e.delegateTarget.id).data("kendoGrid");
            var dataItem=grid.dataItem(tr);

            var revisionId=dataItem.RevisionId;
            var documentId=dataItem.DocumentId;

            // prompt selection of revisions
            // open modal form

            var siblingsGrid=$("#gdListofSiblingsForReplacement").data("kendoGrid");

            $("#SiblingDocumentId").val(documentId);
            $("#SiblingRevisionId").val(revisionId);
            $("#SiblingRevisionsSelected").val(revisionId);

            // reset file selections
            $('#fileUploadReplacementFileUpload').files=null;
            $("#txtSelectedReplacementFile").html("");


            siblingsGrid.dataSource.read();

        }

        var uploadReplacementFile=function(ctrl) {

        }

        var replaceRevisionAttachmentConfirmation=function(e,currentRevisionId,revisionId) {

            e.preventDefault();

            // confirm 
            var msg="With this confirmation you are replacing the exact SDS with a better version.<br><br>";
            if(currentRevisionId==revisionId)
                msg+="The current revision's attachment is being replaced, attachment of current siblings will be replaced.";
            else
                msg+="Since the previous revision's attachment is being replaced, attachment of previous revision siblings will be replaced.";


            var settings={
                message: msg,
                header: documentMessages.modals.RevisionAttachmentReplacementConfirmation
            };

            displayConfirmationModal(settings,
                function() {

                    var tr=$(e.target).closest("tr"); // get current row
                    var grid=$("#"+e.delegateTarget.id).data("kendoGrid");
                    var dataItem=grid.dataItem(tr);

                    var documentInfoId=dataItem.DocumentInfoId;
                    var revisionId=dataItem.RevisionId;
                    var documentId=dataItem.DocumentId;

                    // ---- YES FUNCTION

                    if($(e.currentTarget).hasClass('k-state-disabled')) {
                        return false;
                    }

                    if(displayUploadModal) {

                        attachingFileFor="FORREPLACEMENT";



                        displayUploadModal(function() {
                            return { documentInfoId: documentInfoId,revisionId: revisionId,documentId: 0 };
                        },function(data) {

                            var deferred=$.Deferred();

                            setTimeout(function() {

                                $(this).ajaxCall(generateActionUrl(documentAjaxSettings.controllers.Document,documentAjaxSettings.actions.ReplaceDocumentRevisionAttachments),{
                                    files: data.map(function(item) { return { FileName: item.filename,PhysicalPath: item.physicalPath,DocumentId: documentId,RevisionId: revisionId }; }),
                                    documentInfoId: documentInfoId,
                                    revisionId: revisionId,
                                    documentId: 0,
                                    isNewRevision: false
                                })
                                    .success(function(result) {

                                        if(result.message=="Error"||result.success==false) {
                                            displayError(documentMessages.errors.DocumentRevisionAttachment);
                                            deferred.reject();
                                        } else {

                                            //var attachmentGrid = container.find(documentElementSelectors.grids.DocumentRevisionAttachments).data('kendoGrid');
                                            grid.dataSource.read();

                                            // message indicating replaced
                                            displayCreatedMessage(documentMessages.success.DocumentRevisionAttachmentsReplaced);
                                            deferred.resolve();

                                            $(e.currentTarget).addClass('k-state-disabled');
                                        }

                                    })
                                    .error(function() {
                                        // message ok
                                        displayError(documentMessages.errors.DocumentRevisionAttachment);
                                        deferred.reject();
                                    });



                            },750);

                            return deferred.promise();
                        });



                    } else
                        displayError(documentMessages.errors.DocumentRevisionAttachmentPopUp);

                    // ---- END OF YES FUNCTION

                },function() {
                    // do nothing
                });

            // **********************************************************************



        }

        var onCustomDeleteRevision=function(sender,docId,revId) {
            var confirmDelete=confirm(documentMessages.warnings.ConfirmDeleteRevision);
            if(confirmDelete==false)
                return;
            //kendo.alert("Delete: " + docId + ',' + revId);
            var targetGridName="#"+sender+docId;
            kendo.ui.progress($(targetGridName),true);
            $.post(controllerCalls.DeleteDocumentRevision,{ documentId: docId,revisionId: revId },function(data) {
                kendo.ui.progress($(targetGridName),false);

                if(data.result>0) {
                    var targetGrid=$(targetGridName).data("kendoGrid");
                    targetGrid.dataSource.page(1);
                    targetGrid.dataSource.read();
                }
                else {  //Notify user the revsion was queued on server for deletion
                    //$(this).displayError(data);
                    kendo.alert(data.message);
                }
            });

        }

        //Done by Vivek for multi selection master checkbox 24/Dec/2021. Jira Ticket: TRECOMPLI-4428
        var onRevisionDocumentMultiSelection=function(e) {
            revisionId=e;
            $(documentElementSelectors.grids.DocumentRevisionNameNumbers+revisionId).on("click",".chkMasterMultiSelect",function(e) {

                var checked=$(this).is(':checked');
                var grid=$(this).parents('.k-grid:first');
                if(grid) {
                    var kgrid=grid.data().kendoGrid;
                    if(kgrid._data.length>0) {
                        $.each(kgrid._data,function() {
                            this['IsSelected']=checked;
                        });

                        $('tr',grid).each(function() {
                            var tr=$(this);
                            if(checked) {
                                tr.addClass('k-state-selected');
                                $('.chkMultiSelect',tr).prop('checked',true);
                            } else {
                                tr.removeClass('k-state-selected');
                                $('.chkMultiSelect',tr).removeAttr('checked');
                            }
                        });
                    }

                }
                e.stopImmediatePropagation();

            });
        }

        //Done by Vivek for multi selection ofeach row checkbox 24/Dec/2021. Jira Ticket: TRECOMPLI-4428
        var onRevisionDocumentEachRowSelection=function(e) {
            revisionId=e;
            $(documentElementSelectors.grids.DocumentRevisionNameNumbers+revisionId).on("click",".chkMultiSelect",function(e) {
                selectedRequests=new Array();
                var checked=$(this).is(':checked');
                var grid=$(this).parents('.k-grid:first');
                if(grid) {
                    var kgrid=grid.data().kendoGrid;
                    var selectedRow=$(this).closest('tr');
                    var dataItem=kgrid.dataItem(selectedRow);
                    if(dataItem) {
                        dataItem['IsSelected']=checked;
                    }

                    if(checked) {
                        selectedRow.addClass('k-state-selected');
                        $('.chkMultiSelect ',selectedRow).prop('checked',true);
                    } else {
                        selectedRow.removeClass('k-state-selected');
                        $('.chkMultiSelect',selectedRow).removeAttr('checked');
                        $('.chkMasterMultiSelect',selectedRow).removeAttr('checked');
                        $(grid.find('th')[0].children[0]).removeClass('k-state-selected');
                        $(grid.find('th')[0].children[0]).removeAttr('checked');
                    }


                }

                e.stopImmediatePropagation();

            });
        }

        //Done by Vivek for multi deletion for name and number grid 29/Dec/2021. Jira Ticket: TRECOMPLI-4428
        var onNameNumberMultiDeletion=function(e,documentId) {
            var revisionId=e;
            var token=documentId==0? $(documentElementSelectors.hidden.DocumentRevisionNameNumberSession).val():"";
            var grid=$(documentElementSelectors.grids.DocumentRevisionNameNumbers+revisionId).data("kendoGrid");

            // array to store the dataItems                    
            var nameNumberViewModels=[];

            //get all selected rows (those which have the checkbox checked) 

            grid.tbody.find("input:checked").closest("tr").each(function() {
                var nameNumberViewModel={};
                //push the dataItem into the array

                var selectedRow=grid.dataItem(this);
                nameNumberViewModel.DocumentId=selectedRow.DocumentId;
                nameNumberViewModel.RevisionId=selectedRow.RevisionId;
                nameNumberViewModel.NameNumberId=selectedRow.NameNumberId;
                nameNumberViewModel.NameOrNumber=selectedRow.NameOrNumber;
                nameNumberViewModel.NameOrNumberTypeId=selectedRow.NameOrNumberTypeId;
                nameNumberViewModel.id=selectedRow.id;

                nameNumberViewModels.push(nameNumberViewModel);
            });

            if(nameNumberViewModels.length!=0) {

                //  if (confirm(documentMessages.modals.DocumentRevisionNameNumbers) == true) {
                $("<div/>").kendoConfirm({
                    title: 'Confirmation',
                    content: documentMessages.modals.DocumentRevisionNameNumbers,
                    actions: [
                        {
                            text: 'Confirm',
                            primary: true,
                            action: function(e) {
                                $.ajax({
                                    type: 'POST',
                                    dataType: 'json',
                                    cache: false,
                                    url: controllerCalls.DocumentDeleteNameAndNumberPair,
                                    data: { nameNumberViewModels: nameNumberViewModels,token: token },
                                    success: function(data,textStatus,jqXHR) {
                                        grid.dataSource.read();
                                        grid.refresh();

                                    },
                                    error: function(jqXHR,status,errorThrown) {
                                        displayError(errorThrown);
                                        grid.dataSource.read();
                                        grid.refresh();
                                    },
                                    complete: function() {
                                        grid.dataSource.read();
                                        grid.refresh();

                                    }
                                });
                                return true;
                            },
                        },
                        { text: 'Cancel' }
                    ]
                }).data("kendoConfirm").open().center();



                //}

            }
            else {
                $("<div/>").kendoConfirm({
                    title: 'Warning',
                    content: documentMessages.warnings.DocumentRevisionNameNumbers,
                    actions: [
                        {
                            text: 'ok',
                            primary: true,
                            action: function(e) {

                                return true;
                            },
                        }
                    ]
                }).data("kendoConfirm").open().center();
            }
        }

        return {
            getDocumentSearchCriteria: getDocumentSearchCriteria,
            displaySingleDocument: displaySingleDocument,
            displayAllParents: displayAllParents,
            initializeDocumentComponents: initializeDocumentComponents,
            onAddSiblingRequest: onAddSiblingRequest,
            onRefreshSiblingRequest: onRefreshSiblingRequest,
            onRefreshStatusHistoryRequest: onRefreshStatusHistoryRequest,
            initializeProductAssociation: initializeProductAssociation,
            onDocumentContainerClassificationTypeChange: onDocumentContainerClassificationTypeChange,
            onDocumentContainerClassificationTypeDataBound: onDocumentContainerClassificationTypeDataBound,
            onDocumentContainerClassificationTypeRequestStart: onDocumentContainerClassificationTypeRequestStart,
            onDocumentContainerComponentsRequestStart: onDocumentContainerComponentsRequestStart,
            onAdvancedSearchDocumentMainPanelActivate: onAdvancedSearchDocumentMainPanelActivate,
            onDocumentNoteChange: onDocumentNoteChange,
            onDocumentNoteDataBound: onDocumentNoteDataBound,
            onDocumentNoteEdit: onDocumentNoteEdit,
            onDocumentRevisionAttachmentSave: onDocumentRevisionAttachmentSave,
            onDocumentRevisionAttachmentDataBound: onDocumentRevisionAttachmentDataBound,
            onDocumentRevisionConfirmationDateChange: onDocumentRevisionConfirmationDateChange,
            onDocumentRevisionRevisionDateChange: onDocumentRevisionRevisionDateChange,
            onDocumentRevisionNameNumberGridEdit: onDocumentRevisionNameNumberGridEdit,
            onDocumentRevisionNameNumberGridSave: onDocumentRevisionNameNumberGridSave,
            onProductAliasGridDestroy: onProductAliasGridDestroy,
            onNameNumberGridDataBound: onNameNumberGridDataBound,
            onDocumentRevisionNameNumberError: onDocumentRevisionNameNumberError,
            onDocumentStatusHistoryChange: onDocumentStatusHistoryChange,
            onDocumentStatusHistoryDataBound: onDocumentStatusHistoryDataBound,
            onNewDocumentPanelActivate: onNewDocumentPanelActivate,
            onNewRevisionPanelActivate: onNewRevisionPanelActivate,
            onDisplayNewDocumentPopUp: onDisplayNewDocumentPopUp,
            onDataBound: onDataBound,
            onRevisionDataBound: onRevisionDataBound,
            onGenericDataBound: onGenericDataBound,
            UnlinkDocFromProudct: UnlinkDocFromProudct,
            afterSaveNameNumber: afterSaveNameNumber,
            afterSaveProductAlias: afterSaveProductAlias,
            cloneNextNewRevision: cloneNextNewRevision,
            addFieldClone: addFieldClone,
            performDocumentSearch: performDocumentSearch,
            onEmojiHappyNewClick: onEmojiHappyNewClick,
            onEmojiHappyRevisionClick: onEmojiHappyRevisionClick,
            onConflictingFileUpload: conflictingFileUpload,
            error_handler: error_handler,
            replaceRevisionAttachment: replaceRevisionAttachment,
            onGDDocumentProductDataBound: onGDDocumentProductDataBound,
            onCustomDeleteRevision: onCustomDeleteRevision,
            SelectDocumentDueDiligence: SelectDocumentDueDiligence,
            ClearCommunicationText: ClearCommunicationText,
            HandleSiblingSelection: handleSiblingSelection,
            HandleSiblingSelectionAll: handleSiblingSelectionAll,
            UploadReplacementFile: uploadReplacementFile,
            onRevisionDocumentMultiSelection: onRevisionDocumentMultiSelection,
            onRevisionDocumentEachRowSelection: onRevisionDocumentEachRowSelection,
            onNameNumberMultiDeletion: onNameNumberMultiDeletion,
            onDocumentRevisionCompanyViewBtnClick: onDocumentRevisionCompanyViewBtnClick,
            AddContainerComponentCallBack: AddContainerComponentCallBack
        };
    };

    //Initialize
    $(function() {
        menuHelper.turnMenuActive($("#menuOperations"));
    });

})(jQuery);