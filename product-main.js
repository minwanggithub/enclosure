    ;(function($) {
    if ($.fn.complibProduct == null) {
        $.fn.complibProduct = {};
    }

    $.fn.complibProduct = function () {
        ////local variables
        var windowInit = true;
        var activeSupplier;
        var activeSupplierIndex;
        var activeProduct;
        var newProductActive = false;
        var supplierSearchDialog = $("#supplierSearchWindow");
        var onErrorCallback;
        var deactivateContent;
        var initializeSearchHistoryCallback;
        var addToSearchHistoryCallback;
        var notesModalSettings;
        var updateStatusLayoutCallback;
        var productObject = {
            controls: {
                grids: { GridProductDocuments: "#gdProductDocuments", GridSearchProduct: "#gdSearchProduct", GridProductStatusHistory: "#grdProductStatusHistory", GridSearchSupplier: "#gdSearchSupplier", GridNotAvailable: "#gdNotAvailable" },
                buttons: {
                    AddDocToProduct: "#btnAddDocToProduct",
                    AttachInboundDocToProduct: "#btnAttachInboundDocToProduct",
                    AddNotAvailable: "#btnAddNotAvailable",
                    SaveNotAvailable: "#btnSaveNotAvailable",
                    ClearProductBtn: "#clearProductBtn",
                    SearchSupplier: "#searchSupplierIdSelect",
                    CancelSupplierSearch: "#btnCancelSupplierSearch",
                    SearchSupplierId: "#searchSupplierIdBtn",
                    AddNewSupplier: "#addNewSupplierBtn",
                    ClearSupplierBtn: "#clearSupplierBtn",
                    RefreshProduct: "#btnRefreshProduct",
                    SaveProduct: "#btnSaveProduct",
                    CancelProductEdit: "#btnCancelProductEdit",
                    AddNewRevision: "[id^=btnAddDocumentRevision_]",
                    ProductSearch: "#searchProductBtn"
                },
                textBoxes: {
                    ProductName: "#txtProductName",
                    ProductAttributes: "#txtProductAttributes",
                    SupplierId: "#txtSupplierId",
                    ProductId: "#txtProductId",
                    ObtainmentNote: "#txtObtainmentNote",
                    ReferenceNote: "#txtXReferenceNote",
                    ProductSearch: "#txtProductSearch",
                    SupplierSearch: "#txtSupplierSearch",
                    SearchSupplierId: "#txtSearchSupplierId",                    
                    ProductSearchProductName: "#txtProductSearchProductName",
                    ProductSearchProductId: "#txtProductSearchSearchProductId",
                    ProductSearchResultTotal: "#lblProductSearchResultTotal",
                    ObtainmentActionNotes: "#txtObtainmentActionNotes"

                },
                checkBox: {
                    Obsolete: "#chkIsObsolete"
                },
                hiddenTextBoxes: {
                    HiddenSupplierName: "#hdnSupplierName",
                    HiddenProductName: "#hdnProductName",
                    HiddenStatusNotes: "#hdnStatusNotes"

                },
                dropdownlists: {
                    ProductStatus: "#ddlProductStatus",
                    PhysicalState: "#ddlPhysicalState",
                    ProductScope: "#ddlProductScope",
                    ObtainmentType: "#ddlObtainmentType",
                    ConfirmNotAvailable: "#ddlConfirmNotAvailable"
                },

                divs: { NewProductDetail: "#divNewProductDetail" },
                labels: { ProductFull: "#lblProductName"}
            }
        }
        var controllerCalls = {
            AddDocumentListToProduct: GetEnvironmentLocation() + "/Configuration/ProductManager/AddDocumentListToProduct",
            GetProductPartNumberById: GetEnvironmentLocation() + "/Configuration/ProductManager/GetProductPartNumberById",
            GetProductNameNumberById: GetEnvironmentLocation() + "/Configuration/ProductManager/GetProductNameNumberById",
            LoadSingleDocument: GetEnvironmentLocation() + "/Operations/Document/DocumentMainAlt?",
            DeleteProductDocument: GetEnvironmentLocation() + "/Configuration/ProductManager/DeleteProductDocument",
            LoadSingleSupplier: GetEnvironmentLocation() + "/Operations/Company/LoadSingleSupplier?",
            GetStatusAction: GetEnvironmentLocation() + "/Configuration/ProductManager/GetStatusAction",
            SaveProduct: GetEnvironmentLocation() + "/Configuration/ProductManager/SaveProduct",
            ISProductExist: GetEnvironmentLocation() + "/Configuration/ProductManager/CheckExistProduct",
            AttachDocRevToProd: GetEnvironmentLocation() + '/Operations/Document/AttachDocRevToProd',
            IfExistsDocRev: GetEnvironmentLocation() + '/Operations/Document/IfExistsDocRev',
            SaveObtainmentNotAvailable: GetEnvironmentLocation() + "/Configuration/ProductManager/SaveObtainmentNotAvailable"
        }
        var actionModals = { NotAvailable: "#mdlNotAvailable" }
        var messages = {
            confirmationMessages: {
                RemoveThisDocument: "Are you sure you want to delete this document from product?",
                ProductChangesReverted: "All product changes will be reverted. Are you sure you would like to reload the product?",
                ObtainmentTypeSaved: "Obtainment Type Not Avaialbe Saved Succesfully",
                OverwriteComments: "Overwrite action notes ?",
                ToBeMergedProduct: "This PID status is listed as to be merged.",
                Inbound_ToBeMergedProduct:"This PID status is listed as to be merged, select another PID to resolve request."
            },
            errorMessages:{
                DocumentAlreadyExistsCannotAttach: "Document(s) already exist in this product. Cannot attach document(s).",
                DocumentAndProductSameMFR: "Documents and product should have the same manufacturer.",
                OnlyOneCombinationLanguageJur: "Only one combination of language/Jurisdiction for a document type by product.",
                //KitsParentsDonotHaveEnoughChildren: "Attach kit parent to product, it must have two or more children.",
                KitsParentsDonotHaveEnoughChildren: "A Kit is required to have at least two components to be resolved.",     //See TRECOMPLI:3500, will allow for attach
                PleaseSelectDocumentToDelete: "Please select document(s) to delete.",
                ErrorSavingProduct: "Error occured while saving the product",
                NoRowSelected: "No row selected",
                SelectDocumentsToDelete: 'Please select document(s) to delete.',
                CompletedAttachDocToProd: 'Finish attaching existing document to product.',
                ErrorAttachDocToProd: 'Cannot attach Document to product.',
                ErrorAtIfExistsDocRev: 'Error at action IfExistsDocRev.',
                ObtainmentTypeError: "Obtainment Type needs to be selected.",
                ObtianmentTypeAlreadyAdded: "Obtainment Type has already been added.",
                NoReasonNotes: "Reason specifying unavailability of obtainment type is required.",
                NoDocToDeactivatePrd: "Can not add document to DeActiveated product."
            }
        }

        var notAvailableModel = {
            ObtainmentLkpID: 0,
            ProductID: 0,
            Obsolete: false
        };

        var dsProductNameOption = kendo.observable({
            selectedValue: "3",
            id: "radiogroupProductNameSearchOption",
            items: [
                { caption: "Contains", value: "3" },
                { caption: "Exact Match", value: "0" },
                { caption: "Start With", value: "1" },
                { caption: "End With", value: "2" }
            ]
        });

        var dsProductSupplierNameSearchOption = kendo.observable({
            selectedValue: "3",
            id: "radiogroupProductSupplierNameSearchOption",     //radiogroupSupplierNameSearchOption
            items: [
                { caption: "Contains", value: "3" },
                { caption: "Exact Match", value: "0" },
                { caption: "Start With", value: "1" },
                { caption: "End With", value: "2" }
            ]
        });

        var dsAliasSearchOption = kendo.observable({
            selectedValue: "3",
            id: "radiogroupAliasSearchOption",
            items: [
                { caption: "Contains", value: "3" },
                { caption: "Exact Match", value: "0" },
                { caption: "Start With", value: "1" },
                { caption: "End With", value: "2" }
            ]
        });

        var initializeSearchOperator = function () {
            kendo.bind($("#searchProductTitleOptionDivPre"), dsProductNameOption);
            kendo.bind($("#searchAliasOptionDivPre"), dsAliasSearchOption);
            kendo.bind($("#productSearchSupplierNameOptionDiv"), dsProductSupplierNameSearchOption);
        };

        var resetSupplierNameOptionObservable = function (value) {            
            dsProductSupplierNameSearchOption.set("selectedValue", value);
        };

        function deactivateLayout(productId) {
            // Sanity check!
            if (!deactivateContent)
                return;

            // Deactivate the layout if the status is set to deactivated and layout not already deactivated
            var nameInput = $(productObject.controls.textBoxes.ProductName + "_" + productId);
            var statusDdl = $(productObject.controls.dropdownlists.ProductStatus + "_" + productId).data('kendoDropDownList');
            if (statusDdl && statusDdl.value() == '14' && nameInput.not(':disabled')) {

                // Find the current tab, if not find the form
                var container = $('#' + productId + '_tbProductDetail');
                if (container.length == 0)
                    container = $('#frmProductDetail_' + productId);

                deactivateContent(container);
            }
        }

        
        // Initializing Methods
        var initializeProductDetailControls = function(errorCallback, deactivateContentFunc) {
            onErrorCallback = errorCallback;
            deactivateContent = deactivateContentFunc;
        };

        var intializeSearchHistoryControls = function (initializeSearchHistoryFunc, addToSearchHistoryFunc) {
            initializeSearchHistoryCallback = initializeSearchHistoryFunc;
            addToSearchHistoryCallback = addToSearchHistoryFunc;
        };

        var setNotesModalSettings = function(settings) {
            notesModalSettings = settings;
        };

        // Document Methods
        function addDocumentListToProduct(doclists) {
            $.post(controllerCalls.AddDocumentListToProduct + "Enhanced", { productId: activeProduct, documentList: JSON.stringify(doclists) }, function (data) {

                data = Array.from(data);

                // Any flag other than 0 or 6 -->> the documents could not be added
                if (data.some(e => e != 0)) {
                    // map messages
                    var errors = [null, null, messages.errorMessages.DocumentAlreadyExistsCannotAttach,
                        messages.errorMessages.OnlyOneCombinationLanguageJur,
                        messages.errorMessages.DocumentAndProductSameMFR,
                        null,
                        messages.errorMessages.KitsParentsDonotHaveEnoughChildren,
                        messages.errorMessages.NoDocToDeactivatePrd
                    ];

                    var flag = Math.min(data.filter(e => e > 0));
                    $(this).displayError(errors[flag]);

                    //If error is 6, them we still added the doc to the product, so refresh the grid
                    //This make the logic a little difficut, see TRECOMPLI-3500
                    if (flag == 6) {
                        var gridId = (newProductActive) ? productObject.controls.grids.GridProductDocuments + "_0" : productObject.controls.grids.GridProductDocuments + "_" + activeProduct;
                        var curGdProductDoc = $(gridId).data("kendoGrid");
                        if (curGdProductDoc) {
                            curGdProductDoc.dataSource.page(1);
                            curGdProductDoc.dataSource.read();
                        }
                    }
                }
                else {

                    // all documents were successfully added

                    var gridId = (newProductActive) ? productObject.controls.grids.GridProductDocuments + "_0" : productObject.controls.grids.GridProductDocuments + "_" + activeProduct;
                    var curGdProductDoc = $(gridId).data("kendoGrid");
                    if (curGdProductDoc) {
                        curGdProductDoc.dataSource.page(1);
                        curGdProductDoc.dataSource.read();
                    }

                    var currentProductAttributes = (newProductActive) ? productObject.controls.textBoxes.ProductAttributes + "_0" : productObject.controls.textBoxes.ProductAttributes + "_" + activeProduct;
                    $.post(controllerCalls.GetProductNameNumberById, { productId: activeProduct }, function (nameNumber) {
                        $(currentProductAttributes).val(nameNumber);
                    });

                }

                /*
                 
                DEPRECATED

                var flag = data.substring(5, 6);
                if (flag == '0') {
                    var gridId = (newProductActive) ? productObject.controls.grids.GridProductDocuments + "_0" : productObject.controls.grids.GridProductDocuments+ "_" + activeProduct;
                    var curGdProductDoc = $(gridId).data("kendoGrid");
                    if (curGdProductDoc) {
                        curGdProductDoc.dataSource.page(1);
                        curGdProductDoc.dataSource.read();
                    }

                    var currentProductAttributes = (newProductActive) ? productObject.controls.textBoxes.ProductAttributes + "_0" : productObject.controls.textBoxes.ProductAttributes + "_" + activeProduct;
                    $.post(controllerCalls.GetProductNameNumberById, { productId: activeProduct }, function (nameNumber) {
                        $(currentProductAttributes).val(nameNumber);
                    });

                } else if (flag == '2')    
                    $(this).displayError(messages.errorMessages.DocumentAlreadyExistsCannotAttach);
                else if (flag == '3')
                    $(this).displayError(data.substring(data.indexOf('msg:') + 4));
                else if (flag == '4')
                    $(this).displayError(messages.errorMessages.DocumentAndProductSameMFR);
                else if (flag == '5')
                    $(this).displayError(messages.errorMessages.OnlyOneCombinationLanguageJur);

                */

            });
        };

        function displaySingleDocument(documentObj) {
            window.open(controllerCalls.LoadSingleDocument + "documentId=" + documentObj.DocumentID + "&revisionId=" + documentObj.RevisionID, "_blank");
        }

        var ModifyNotAvailable = function(e) {

            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var pKey = dataItem["ProductID"];
            var notes = dataItem["Notes"];

            $(productObject.controls.buttons.SaveNotAvailable + "_" + pKey).text("Save Obtainment Type");
            $(actionModals.NotAvailable + "_" + pKey).toggleModal();
            var ddlObtainmentType = $(productObject.controls.dropdownlists.ObtainmentType + "_" + pKey).data("kendoDropDownList").value(dataItem["ObtainmentLkpID"]);
            $(productObject.controls.dropdownlists.ConfirmNotAvailable + "_" + pKey).data("kendoDropDownList").value(-1);

            $(productObject.controls.checkBox.Obsolete + "_" + pKey).attr("checked", dataItem["Obsolete"]);
            $(productObject.controls.textBoxes.ObtainmentActionNotes + "_" + pKey).val(notes);

        }

        var DeleteDoc = function (e) {
            e.preventDefault();
            var strconfirm = confirm(messages.confirmationMessages.RemoveThisDocument);
            if (strconfirm == false)
                return;

            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            dataItem.IsSelected = true;
            var targetId = e.delegateTarget.id;
            var pid = targetId.substring(targetId.indexOf("_") + 1, targetId.length);
            activeProduct = pid;
            var doclists = [];
            doclists.push(dataItem.ReferenceId);

            $.post(controllerCalls.DeleteProductDocument, { productId: pid, documentList: JSON.stringify(doclists) }, function (data) {
                if (data.indexOf("Successfully") < 0) {
                    $(this).displayError(data);
                    return;
                }

                var index = data.indexOf("from product");
                var prodid = data.substring(index + 13, data.length);

                var grid1 = $(productObject.controls.grids.GridProductDocuments +"_" +  prodid).data("kendoGrid");
                grid1.dataSource.page(1);
                grid1.dataSource.read();

                var tabId = "#" + prodid + "_tbProductDetail";
                TabReload(tabId, 0);
            });
        };

        
        // Product Status History Methods
        var onProductStatusGridChange = function () {
            var productId = this.wrapper.attr('id');
            productId = productId.substring(productId.indexOf('_') +1);

            var selectedRow = this.wrapper.data('kendoGrid').select();
            var selectedData = this.dataItem(selectedRow);
            if (selectedData != null)
                $('#StatusNotesText_' + productId).html(selectedData.Notes);
            else
                $('#StatusNotesText_' + productId).html('');
        };

        // Supplier Methods
        var viewSingleSupplier = function (supplierId) {
            if (supplierId > 0)
                window.open(controllerCalls.LoadSingleSupplier + "supplierId=" + supplierId, "_blank");
        }

        // Logic to check if the document status dropdownlist should be readonly
        var updateProductStatusLayout = function (currentProductId, currentStatusId) {
            if (currentStatusId == '@deactivated' ||
                (currentStatusId == '@suspect' && '@isAdmin' != 'True') ||
                currentProductId == '0') {
                var ddlId = ($('#ddlProductStatus_' + currentProductId).length > 0) ? 'ddlProductStatus_' + currentProductId : 'ddlProductStatus_0';
                readonlyKendoDropDownList(ddlId);
            }
        }
        function getUrlVars() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                //vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }
        function onGDSearchProductDataBound(e) {
            var selectedPhysicalState = $("#hdnPhysicalState").val();
            var grid = $("#gdSearchProduct").data("kendoGrid");
            var data = grid.dataSource.data();
            $.each(data, function (i, row) {
                if (row.SelectedStatusId == 11) {
                    $('tr[data-uid="' + row.uid + '"] ').addClass('grid-red-row');
                }
                var params = getUrlVars();
                if (params && params["from"] == "xref") {
                    if (selectedPhysicalState && selectedPhysicalState == row.PhysicalStateText) {
                        $('tr[data-uid="' + row.uid + '"] ').addClass('grid-green-row');
                    }
                }
                
                
            })
        }
        function saveBtnEvent(activeSaveButton) {
            var form = $("#frmProductDetail_" + activeSaveButton).updateValidation();
            if (!form.valid())
                return;

            // Check if notes are needed for a status change
            var formData = form.serialize();
            kendo.ui.progress(form, true);
            $.post(controllerCalls.GetStatusAction, formData, function (data) {
                kendo.ui.progress(form, false);
                if (data.displayMessage) {
                    if (data.statusError == true)
                        $(this).displayError(data.displayMessage);
                    else {
                        if (notesModalSettings) {
                            notesModalSettings.displayStatusNoteConfirmation(data, function (e) {
                                form.find('#hdnStatusNotes_' + activeSaveButton).val(e.modalNotes);
                                saveProductInformation(activeSaveButton);
                            });
                        }
                    }
                } else
                    saveProductInformation(activeSaveButton);

                UnBindingSaveCancel(activeSaveButton);
            });
        }

        function saveProductInformation(activeSaveButton) {
            var selectedSuppilerId = 0;
            if ($(productObject.controls.textBoxes.SupplierId + "_" + activeSaveButton).val().indexOf(',') < 0)
                selectedSuppilerId = $(productObject.controls.textBoxes.SupplierId + "_" + activeSaveButton).val();
            else
                selectedSuppilerId = $(productObject.controls.textBoxes.SupplierId + "_" + activeSaveButton).val().substring(0, $(productObject.controls.textBoxes.SupplierId + "_" + activeSaveButton).val().indexOf(','));
            var selectedSuppilerName = $(productObject.controls.textBoxes.SupplierId + "_" + activeSaveButton).val().substring($(productObject.controls.textBoxes.SupplierId + "_" + activeSaveButton).val().indexOf(',') + 1);
            var selectedStatusId = $(productObject.controls.dropdownlists.ProductStatus + "_" + activeSaveButton).data('kendoDropDownList').value();
            var selectedProductScopeId = $(productObject.controls.dropdownlists.ProductScope + "_" + activeSaveButton).data('kendoDropDownList').value();
            var selectedPhysicalStateId = $(productObject.controls.dropdownlists.PhysicalState + "_" + activeSaveButton).data('kendoDropDownList').value();
            var selectedPhysicalStateText = selectedPhysicalStateId ? $(productObject.controls.dropdownlists.PhysicalState + "_" + activeSaveButton).data('kendoDropDownList').text() : 'Unknown';
            var productId = $(productObject.controls.textBoxes.ProductId + "_" + activeSaveButton).val();
            var queryText = {
                        ReferenceId: productId,
                        ProductName: $(productObject.controls.textBoxes.ProductName + "_" + activeSaveButton).val(),
                        SupplierId: selectedSuppilerId,
                        SupplierName: selectedSuppilerName,
                        ObtainmentNote: $(productObject.controls.textBoxes.ObtainmentNote + "_" + activeSaveButton).val(),
                        XReferenceNote: $(productObject.controls.textBoxes.ReferenceNote + "_" + activeSaveButton).val(),
                        SelectedStatusId: selectedStatusId,
                        SelectedProductScopeId: selectedProductScopeId,
                        StatusNotes: $(productObject.controls.hiddenTextBoxes.HiddenStatusNotes + "_" + activeSaveButton).val(),
                        SelectedPhysicalStateId: selectedPhysicalStateId,
                        PhysicalStateText: selectedPhysicalStateText
            };
           
            $(productObject.controls.hiddenTextBoxes.HiddenProductName).val($(productObject.controls.textBoxes.ProductName + "_" + activeSaveButton).val());


            var existPromise = $.post(controllerCalls.ISProductExist,{jsProductSearchModel: JSON.stringify(queryText) });

            $.when(existPromise)
                .done(function (result) {                    
                    if (!result || result.Exist) {
                        if (!confirm(result.DisplayMessage)) {
                            BindingSaveCancel(activeSaveButton);
                            return;
                        }                        
                    }
                    $.post(controllerCalls.SaveProduct,
                        { jsProductSearchModel: JSON.stringify(queryText) },
                        function (data) {
                            if (!data || data.ErrorMessage) {
                                var errorMessage = data.ErrorMessage || messages.errorMessages.ErrorSavingProduct;
                                $(this).displayError(errorMessage);
                                return false;
                            }
                            if (activeSaveButton == 0) {
                                $(productObject.controls.textBoxes.ProductId + "_" + activeSaveButton)
                                    .val(data.ReferenceId);
                                if ($(productObject.controls.buttons.AddDocToProduct + "_" + activeSaveButton)
                                    .hasClass("k-state-disabled")) {
                                    $(productObject.controls.buttons.AddDocToProduct + "_" + activeSaveButton)
                                        .removeClass("k-state-disabled");
                                    $(productObject.controls.buttons.AddDocToProduct + "_" + activeSaveButton)
                                        .click(function () {

                                            newProductActive = true;
                                            activeProduct = data.ReferenceId;
                                            $(productObject.controls.dropdownlists.ProductStatus +
                                                "_" +
                                                activeSaveButton)
                                                .data('kendoDropDownList')
                                                .enable(true);

                                            if (displayDocumentPopUp) {
                                                displayDocumentPopUp(function (data) {
                                                    var doclists = [];
                                                    doclists.push(data.ReferenceId);
                                                    addDocumentListToProduct(doclists);
                                                });
                                            }
                                        });
                                }

                                UnBindingSaveCancel(0);
                                deactivateLayout(activeSaveButton);
                                $("#divSearchSection " + productObject.controls.textBoxes.ProductSearchProductId)
                                    .val(data.ReferenceId);
                                $("#divSearchSection " + productObject.controls.buttons.ProductSearch).click();

                                $(productObject.controls.divs.NewProductDetail).html("");

                                var grid = $(productObject.controls.grids.GridSearchProduct).data('kendoGrid');
                                if (grid) {
                                    grid.bind("dataBound",
                                        function addNewProductDataBound() {
                                            var productRow = grid.wrapper.find('tr.k-master-row:first');
                                            grid.select(productRow);
                                            grid.expandRow(productRow);
                                            grid.unbind("dataBound", addNewProductDataBound);
                                        });

                                    grid.dataSource.read();
                                }
                            } else {
                                $(productObject.controls.hiddenTextBoxes.HiddenStatusNotes + "_" + activeSaveButton)
                                    .val('');
                                reloadProductHistoryGrid(activeSaveButton);
                                setProductGridDataSourceItem(data);
                            }
                            updateProductStatusLayout(productId, selectedStatusId);
                        });
                })
                .fail(function (xhr, status, error) {                   
                    $(this).displayError(messages.errorMessages.ErrorSavingProduct + ": " + error);
                });
        }

        // Method to set the datasource item based on the data passed through
        function setProductGridDataSourceItem(productObj) {
            var kgrid = $(productObject.controls.grids.GridSearchProduct).data("kendoGrid");
            if (kgrid) {
                var parentRowIndex = productObj.ReferenceId;
                var dataItem = kgrid.dataSource.get(parentRowIndex);
                if (dataItem) {
                    // Check if something has changed
                    var dataChanged = false;
                    var fields = ['ProductName', 'SupplierId', 'SupplierName', 'SelectedStatusId', 'PhysicalStateText'];
                    for (var i = 0; i < fields.length; i++) {
                        var dsItem = dataItem[fields[i]] || '';
                        var productItem = productObj[fields[i]] || '';
                        if (dsItem != productItem) {
                            dataChanged = true;
                            break;
                        }
                    }

                    if (dataChanged == true) {
                        dataItem.set("ProductName", productObj.ProductName);
                        dataItem.set("SupplierId", productObj.SupplierId);
                        dataItem.set("SupplierName", productObj.SupplierName);
                        dataItem.set("SelectedStatusId", productObj.SelectedStatusId);
                        dataItem.set("PhysicalStateText", productObj.PhysicalStateText);
                        var dataItemRow = kgrid.table.find('tr[data-uid="' + dataItem.uid + '"]');
                        kgrid.expandRow(dataItemRow);
                    }
                }
            }
        }

        function reloadProductHistoryGrid(productId) {
            var grid = $(productObject.controls.grids.GridProductStatusHistory + '_' + productId).data('kendoGrid');
            if (grid) grid.dataSource.read();
        }

        ////////////non publuc / public/////////////
        var panelbar_activated = function () {
            //Can not be moved to partial view, or it cause clear and search again
            $(productObject.controls.buttons.ClearProductBtn).on("click", function () {

                if (parent.window.opener != null) {
                    if (parent.window.opener.document.getElementById("txtProductId") != null) {
                        var txtName = parent.window.opener.document.getElementById("txtProductId");
                        txtName.value = "";
                    }
                }
                //Remove search result
                //$(productObject.controls.textBoxes.ProductSearch).val("");
                var grid = $(productObject.controls.grids.GridSearchProduct).data("kendoGrid");
                if (grid.dataSource.total() == 0)
                    return false;

                grid.dataSource.filter([]);
                grid.dataSource.data([]);
                return false;
            });
        };

        var RemovedProductDocument = function (e) {
            var activepid = e.row.context.attributes["activepid"];
            var pid = activepid.value;

            if (pid == 0)
                pid = $(productObject.controls.textBoxes.ProductId + "_0").val();

            //if not work, then get PartNumber using serverFiltering sproc
            setTimeout(function () {
                var currentProductAttributes = productObject.controls.textBoxes.ProductAttributes + "_" + activepid.value;
                $.post(controllerCalls.GetProductNameNumberById, { productId: pid }, function (nameNumber) {
                    $(currentProductAttributes).val(nameNumber);
                });
            }, 500);
        };

        var RefreshProductData = function () {
            return newProductActive ? { productInfo: $(productObject.controls.textBoxes.ProductId + "_0").val() } : { productInfo: $(productObject.controls.textBoxes.ProductId + "_" + activeProduct).val() };
        };

        var panelbar_collapse = function() {
        };

        var panelbar_expand = function () {
        };

        var onProductStatusChange = function () {
            var elemId = this.element.attr('id');
            elemId = elemId.replace('ddlProductStatus_', '');
            BindingSaveCancel(elemId);
        };


        var onProductScopeChange = function () {
            var elemId = this.element.attr('id');
            elemId = elemId.replace('ddlProductScope_', '');
            BindingSaveCancel(elemId);
        };

        var onProductPhysicalStateChange = function() {
            var elemId = this.element.attr('id');
            elemId = elemId.replace('ddlPhysicalState_', '');
            BindingSaveCancel(elemId);
        };

        //--------------------start of _SearchProduct.cshtml-----------------------
        function TabReload(tabName, tab) {
            var tabstrip = $(tabName).data("kendoTabStrip");

            // Ensure that the other tabs will be reloaded when they are selected
            tabstrip.contentElements.each(function() {
                var currentElement = $(this);
                if (!currentElement.is('.k-state-active')) {
                    currentElement.html("");
                }
            });          

            // Is the tab marked as the active tab?
            var currentTab = $(tabstrip.items()[tab]);
            if (!currentTab.attr('id')) {
                currentTab.attr('id', tabstrip._ariaId);
            }

            tabstrip.reload(currentTab.context);
        }

        ////////////non publuc / public/////////////
        var refreshProductSearchResultGrid = function () {
           
            var grid = $(productObject.controls.grids.GridSearchProduct).data("kendoGrid");
            
            if (grid.dataSource.view().length > 0) {
                grid.dataSource.page(1);
            }
            grid.dataSource.read();
        };

        var QueueQuery = function () {
            if (!addToSearchHistoryCallback) return;
            var searchField = $(productObject.controls.textBoxes.ProductSearch);
            if (searchField.length > 0)
                addToSearchHistoryCallback('gdSearchProduct', searchField.val());
        };

        var LoadProductMatchDetailsCompleted = function (e) {
            var pKey = e.item.id.substring(0, e.item.id.indexOf('_tbProductDetail'));

            var productObj = $('[id*=gdProductDocuments_' + pKey + ']');
            initializeMultiSelectCheckboxes(productObj);

            $(productObject.controls.textBoxes.SupplierId + '_' + pKey).keyup(function (e1) {
                var code = (e1.keyCode ? e1.keyCode : e1.which);
                if (code == 13) //Search only on enter
                    DoLookUpSupplierOnKeyEnter(productObject.controls.textBoxes.SupplierId + '_' + pKey);
            });

            UnBindingSaveCancel(pKey);

            $(productObject.controls.buttons.AddNotAvailable + "_" + pKey).on("click", function () {
                $(productObject.controls.buttons.SaveNotAvailable + "_" + pKey).text("Add Obtainment Type");
                var ddlObtainmentType = $(productObject.controls.dropdownlists.ObtainmentType + "_" + pKey).data("kendoDropDownList");
                ddlObtainmentType.select(0);
               $(productObject.controls.checkBox.Obsolete + "_" + pKey).attr("checked", false);
               $(actionModals.NotAvailable + "_" + pKey).toggleModal();
            });


            $(productObject.controls.buttons.RefreshProduct + '_' + pKey).on('click', function () {
                var tabId = "#" + pKey + "_tbProductDetail";

                // Check if a change had occurred in any of the fields
                if (!$(productObject.controls.buttons.SaveProduct + '_' + pKey).hasClass('k-state-disabled')) {

                    // Set up information for the confirmation modal
                    var args = { message: messages.confirmationMessages.ProductChangesReverted, header: 'Confirm Product Reload' };
                    DisplayConfirmationModal(args, function () {
                        TabReload(tabId, 0);
                    });
                } else
                    TabReload(tabId, 0);
            });

            BindInputs(pKey);

           
            $(productObject.controls.buttons.SearchSupplierId + "_" + pKey).on("click", function() {
                activeSupplier = productObject.controls.textBoxes.SupplierId + '_' + pKey;
                activeSupplierIndex = pKey;

                if (displaySupplierPopUp) {
                    displaySupplierPopUp(function(data) {
                        var companyInfo = typeof getCompanyTemplate != "undefined" ? getCompanyTemplate(data.CompanyId, data.Name) : data.CompanyId + ', ' + data.Name;
                        $(activeSupplier).val(companyInfo);
                        BindingSaveCancel(activeSupplierIndex);
                    });
                }
            });

            $(productObject.controls.buttons.SaveNotAvailable + "_" + pKey).on("click", function () {
                var ddlObtainmentType = $(productObject.controls.dropdownlists.ObtainmentType + "_" + pKey).data("kendoDropDownList");

                notAvailableModel.ProductID = pKey;

                notAvailableModel.ObtainmentLkpID = ddlObtainmentType.value() === "" ? 0 : ddlObtainmentType.value();
                notAvailableModel.Obsolete = $(productObject.controls.checkBox.Obsolete + "_" + pKey).is(":checked");
                notAvailableModel.Notes = $(productObject.controls.textBoxes.ObtainmentActionNotes + "_" + pKey).val();

                var errors = [];

                if ((notAvailableModel.Notes + "").trim() == "") {
                    errors.push(messages.errorMessages.NoReasonNotes);
                }

                if (notAvailableModel.ObtainmentLkpID <= 0) {
                    errors.push(messages.errorMessages.ObtainmentTypeError);
                }

                if (errors.length == 0) {
                    $(this).ajaxCall(controllerCalls.SaveObtainmentNotAvailable, { jsnotAvailableModel: JSON.stringify(notAvailableModel) })
                        .success(function (data) {
                            if (data == 0) {
                                $(this).savedSuccessFully(messages.confirmationMessages.ObtainmentTypeSaved);
                                var grid1 = $(productObject.controls.grids.GridNotAvailable + "_" + pKey).data("kendoGrid");
                                grid1.dataSource.read();
                                grid1.dataSource.page(1);
                                $(actionModals.NotAvailable + "_" + pKey).toggleModal();
                            } else {
                                $(actionModals.NotAvailable + "_" + pKey).toggleModal();
                                $(this).displayError(messages.errorMessages.ObtianmentTypeAlreadyAdded);
                            }

                        }).error(
                            function () {
                                $(this).displayError(messages.errorMessages.GeneralError);
                            });
                } else {
                    var html = "Validation failed:<br><br>" + errors.join("<br>");
                    $(this).displayError(html);
                }

            });


            //(SH) 4-16-2014
            $("#viewSupplierIdBtn_" + pKey).click(function () {
                var supplierId = GetNewSupplierId(pKey);
                if (supplierId > 0)
                    window.open(controllerCalls.LoadSingleSupplier + "supplierId=" + supplierId, "_blank");
            });

           
            //Add doc parts
            function attachDocRevToProd(pKey, docGuid, noticeNo, inboundResponseid, supplierid) {
            
                $.post(controllerCalls.AttachDocRevToProd, { productId: pKey, docGuid: docGuid, noticeNumber: noticeNo, inboundResponseid: inboundResponseid, supplierid: supplierid },
                    function (result) {
                        if (result == 'success') {
                            $('#btnRefreshProduct_' + pKey).click();
                            onDisplayError(messages.errorMessages.CompletedAttachDocToProd);
                        } else {
                            onDisplayError(result);
                        }
                });

            }

            $(productObject.controls.buttons.AttachInboundDocToProduct + "_" + pKey).on("click", function () {
                if ($(productObject.controls.dropdownlists.ProductStatus + "_" + pKey).data("kendoDropDownList").value() == 11) {
                    onDisplayError(messages.confirmationMessages.Inbound_ToBeMergedProduct);
                    return;
                }
                var guid = $(this).getQueryStringParameterByName("docGuid");
                var noticeNo = $(this).getQueryStringParameterByName("nnumber");
                var inboundResponseid = $(this).getQueryStringParameterByName("inboundResponseid");
                var supplierid = $(this).getQueryStringParameterByName("supplierid");

                if (guid != "") {
                    $.post(controllerCalls.IfExistsDocRev, { docGuid: guid }, function (ifExists) {

                        if (ifExists == false) {
                            doclib.onDisplayNewDocumentPopUp(pKey);
                        } else {
                            attachDocRevToProd(pKey, guid, noticeNo, inboundResponseid, supplierid);
                        }
                    });
                }
                else {
                    kendo.alert("Can not detect inbound document attachment.");
                }
            });

            $(productObject.controls.buttons.AddDocToProduct + "_" + pKey).on("click", function () {
               
                if ($(productObject.controls.dropdownlists.ProductStatus + "_" + pKey).data("kendoDropDownList").value() == 11) {
                    onDisplayError(messages.confirmationMessages.ToBeMergedProduct);
                    return;
                }
                activeProduct = pKey;
                newProductActive = false;

                if (displayDocumentPopUp) {
                    displayDocumentPopUp(function (data) {
                        var doclists = [];
                        doclists.push(data.ReferenceId);
                        addDocumentListToProduct(doclists);
                    });
                }
            });

            // Deactivate the layout if the status is set to deactivated
            deactivateLayout(pKey);

        }; //end of LoadProductMatchDetailsCompleted

    
        var showSupplierPlugIn = function (currentSupplier) {
            activeSupplier = currentSupplier;
            $(productObject.controls.buttons.AddNewSupplier).hide();
            supplierSearchDialog.data("kendoWindow").center().open();
        };


        var UnBindingSaveCancel = function(activekey) {
            if (!$(productObject.controls.buttons.SaveProduct + '_' + activekey).hasClass("k-state-disabled"))
                $(productObject.controls.buttons.SaveProduct + '_' + activekey).addClass("k-state-disabled").unbind('click');
            
            if (activekey > 0)
                if (!$(productObject.controls.buttons.CancelProductEdit + '_' + activekey).hasClass("k-state-disabled"))
                    $(productObject.controls.buttons.CancelProductEdit + '_' + activekey).addClass("k-state-disabled").unbind('click');
        };

        var BindingSaveCancel = function(activekey) {
            if ($(productObject.controls.buttons.SaveProduct + '_' + activekey).hasClass("k-state-disabled")) {
                $(productObject.controls.buttons.SaveProduct + '_' + activekey).removeClass("k-state-disabled").unbind('click');

                $(productObject.controls.buttons.SaveProduct + '_' + activekey).click(function (e) {
                    e.preventDefault();
                    saveBtnEvent(activekey);
                });
            }

            if ($(productObject.controls.buttons.CancelProductEdit + '_' + activekey).hasClass("k-state-disabled")) {
                $(productObject.controls.buttons.CancelProductEdit + '_' + activekey).removeClass("k-state-disabled").unbind('click');
                if (activekey > 0) {
                    $(productObject.controls.buttons.CancelProductEdit + '_' + activekey).click(function () {
                        var tabId = "#" + activekey + "_tbProductDetail";
                        TabReload(tabId, 0);
                    });
                }
            }
        };
        //--------------------end of _SearchProduct.cshtml-----------------------


        //***************Due Deligence Methods*********************??
        var ClearCommunicationText = function () {
            $('#ProductDueDiligenceText').html("");
        };

       
        var SelectProductDueDiligence = function (e) {
            var inputId = this.element.attr("id");
            e.preventDefault();
            var selectedObj = this.select();
            var selectedData = this.dataItem(selectedObj);
            console.log(selectedData);
            $('#ProductDueDiligenceText_' + selectedData.ProductId).html(selectedData.CommunicationNotes);
        };
        //***************END Due Deligence Methods*********************??

        //--------------------start of _NewProductView.cshtml-----------------------
        ////currently not used due to the concern over the default routing behavior
        var setDeleteImageIcon = function (e) {
            var grid = e.sender;
            var data = grid.dataSource.data();
            $.each(data, function (i, row) {
                if (row.DocumentStatusId == 4 || row.DocumentStatusId == 5) {
                    $('tr[data-uid="' + row.uid + '"] ').addClass('grid-red-row');
                }
            })
            $(".k-grid-remove").html("<span class='k-icon k-i-close'></span>");
        };

        var pnlNewProduct_Activated = function () {
            $(productObject.controls.buttons.CancelProductEdit + '_0').click(function () {
                $(productObject.controls.divs.NewProductDetail).html("");
            });

            var pKey = 0;
            $(productObject.controls.buttons.RefreshProduct + '_0').hide();

            UnBindingSaveCancel(pKey);
            BindingSaveCancel(pKey);
            BindInputs(pKey);

            $(productObject.controls.textBoxes.SupplierId + '_' + pKey).keyup(function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code == 13) //Search only on enter
                    if (IsNumeric($(productObject.controls.textBoxes.SupplierId + '_' + pKey).val()))
                        DoLookUpSupplierOnKeyEnter(productObject.controls.textBoxes.SupplierId + '_' + pKey);
            });

            $(productObject.controls.buttons.SearchSupplierId + "_" + pKey).click(function () {
                activeSupplier = "#txtSupplierId_" + pKey;
                activeSupplierIndex = pKey;

                if (displaySupplierPopUp) {
                    displaySupplierPopUp(function(data) {
                        var companyInfo = typeof getCompanyTemplate != "undefined" ? getCompanyTemplate(data.CompanyId, data.Name): data.CompanyId + ', ' +data.Name;
                        $(activeSupplier).val(companyInfo);
                        BindingSaveCancel(activeSupplierIndex);
                    });
                }
            });
        };

        function BindInputs(pKey) {
            $(productObject.controls.textBoxes.ProductName + '_' + pKey + ',' +productObject.controls.textBoxes.SupplierId + '_' + pKey).on('input', function () {
                BindingSaveCancel(pKey);
            });

            $(productObject.controls.textBoxes.ObtainmentNote + '_' + pKey + ',' +productObject.controls.textBoxes.SupplierId + '_' +pKey).on('input', function () {
                BindingSaveCancel(pKey);
            });

            $(productObject.controls.textBoxes.ReferenceNote + '_' + pKey + ',' +productObject.controls.textBoxes.SupplierId + '_' + pKey).on('input', function () {
                BindingSaveCancel(pKey);
            });
        }

        //--------------------end _NewProductView.cshtml-----------------------

        var selectedProdIdObj = {};

        function initializeMultiSelectCheckboxes(productObj) {
            productObj.on("mouseup MSPointerUp", ".chkMultiSelect", function (e) {
                var checked = $(this).is(':checked');  //checkbox status BEFORE click event
                var grid = $(this).parents('.k-grid:first');
                var gridId = grid.attr('id');
                var singleProdObj = [];
                if (gridId in selectedProdIdObj)
                    singleProdObj = selectedProdIdObj[gridId];
                else
                    selectedProdIdObj[gridId] = singleProdObj;

                if (grid) {
                    var kgrid = grid.data().kendoGrid;
                    var selectedRow = $(this).parent().parent();
                    var dataItem = kgrid.dataItem($(this).closest('tr'));
                    if (dataItem) {
                        dataItem.set('IsSelected', !checked);
                        var id = $('td:nth-child(3)', selectedRow).text(); //get docid
                        if (id) {
                            var index = singleProdObj.indexOf(id);
                            if (!checked) {
                                if (index < 0)
                                    singleProdObj.push(id);
                            } else {
                                if (index >=0)
                                    singleProdObj.splice(index, 1);
                            }
                        }

                        $('tr', grid).each(function() {
                            var tr = $(this);
                            var cked = $('.chkMultiSelect', tr).is(':checked');
                            if (cked)
                                tr.addClass('k-state-selected');
                            else
                                tr.removeClass('k-state-selected');
                        });
                    }
                }
                // Keep grid from changing seleted information
                e.stopImmediatePropagation();
            });
          
            productObj.on("click", ".chkMasterMultiSelect", function () {
                var checked = $(this).is(':checked');
                var grid = $(this).parents('.k-grid:first');
                var singleProdObj = [];
                var gridId = grid.attr('id');
                if (gridId in selectedProdIdObj)
                    singleProdObj = selectedProdIdObj[gridId];
                else
                    selectedProdIdObj[gridId] = singleProdObj;

                if (grid) {
                    $('tr', grid).each(function () {
                        var tr = $(this);
                        var id = $('td:nth-child(3)', tr).text(); //get docid
                        
                        if (id) {
                            var index = singleProdObj.indexOf(id);
                            if (checked) {
                                if (index < 0) 
                                    singleProdObj.push(id);
                            } else {
                                if (index >= 0)
                                    singleProdObj.splice(index, 1);
                            }
                        }
                    });

                    var kgrid = grid.data().kendoGrid;
                    if (kgrid._data.length > 0) {
                        $.each(kgrid._data, function () {
                            this['IsSelected'] = checked;
                        });
                        kgrid.refresh();

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
            });
        };

        return {
            BindingSaveCancel: BindingSaveCancel,
            DeleteDoc: DeleteDoc,
            ModifyNotAvailable:ModifyNotAvailable,
            displaySingleDocument: displaySingleDocument,
            initializeProductDetailControls: initializeProductDetailControls,
            intializeSearchHistoryControls: intializeSearchHistoryControls,
            initializeSearchOperator: initializeSearchOperator,
            LoadProductMatchDetailsCompleted: LoadProductMatchDetailsCompleted,
            onProductStatusChange: onProductStatusChange,
            onProductStatusGridChange: onProductStatusGridChange,
            onProductScopeChange:onProductScopeChange,
            panelbar_activated: panelbar_activated,
            panelbar_collapse: panelbar_collapse,
            panelbar_expand: panelbar_expand,
            pnlNewProduct_Activated: pnlNewProduct_Activated,
            QueueQuery: QueueQuery,
            RefreshProductData: RefreshProductData,
            refreshProductSearchResultGrid: refreshProductSearchResultGrid,
            RemovedProductDocument: RemovedProductDocument,
            setDeleteImageIcon: setDeleteImageIcon,
            setNotesModalSettings: setNotesModalSettings,
            setProductGridDataSourceItem: setProductGridDataSourceItem,
            showSupplierPlugIn: showSupplierPlugIn,
            UnBindingSaveCancel: UnBindingSaveCancel,
            viewSingleSupplier: viewSingleSupplier,
            onProductPhysicalStateChange: onProductPhysicalStateChange,
            resetSupplierNameOptionObservable: resetSupplierNameOptionObservable,
            updateProductStatusLayout: updateProductStatusLayout,
            dsProductNameOption: dsProductNameOption,
            onGDSearchProductDataBound: onGDSearchProductDataBound,
            SelectProductDueDiligence: SelectProductDueDiligence,
            ClearCommunicationText: ClearCommunicationText
        };
    };

    //Initialize
    $(function() {
        menuHelper.turnMenuActive($("#menuOperations"));
    });

})(jQuery);