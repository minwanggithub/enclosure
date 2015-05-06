
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

        // Helper Methods
        function displayErrorMessage(errorMessage) {
            
            if (onErrorCallback) {
                onErrorCallback(errorMessage);
            } else {
                alert(errorMessage);
            }
        }

        function deactivateLayout(productId) {
            
            // Sanity check!
            if (!deactivateContent) {
                return;
            }

            // Deactivate the layout if the status is set to deactivated and layout not already deactivated
            var nameInput = $("#txtProductName_" + productId);
            var statusDdl = $("#ddlProductStatus_" + productId).data('kendoDropDownList');
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

        var setUpdateStatusLayoutCallback = function (updateStatusLayoutFunc) {
            updateStatusLayoutCallback = updateStatusLayoutFunc;
        };

        // Document Methods
        function addDocumentListToProduct(doclists) {
            var urlmultiple = GetEnvironmentLocation() + "/Configuration/ProductManager/AddDocumentListToProduct";
            $.post(urlmultiple, { productId: activeProduct, documentList: JSON.stringify(doclists) }, function (data) {

                var flag = data.substring(5, 6);
                if (flag == '0') {

                    var gridId = (newProductActive) ? "#gdProductDocuments_0" : "#gdProductDocuments_" + activeProduct;
                    var curGdProductDoc = $(gridId).data("kendoGrid");
                    if (curGdProductDoc) {
                        curGdProductDoc.dataSource.page(1);
                        curGdProductDoc.dataSource.read();
                    }

                    var currentProductAttributes = (newProductActive) ? "#txtProductAttributes_0" : "#txtProductAttributes_" + activeProduct;
                    var url = GetEnvironmentLocation() + "/Configuration/ProductManager/GetProductPartNumberById";
                    $.post(url, { productId: activeProduct }, function (partNumber) {
                        $(currentProductAttributes).val(partNumber);
                    });

                } else if (flag == '2') {
                    onDisplayError('Document(s) already exist in this product. Cannot attach document(s).');
                }
                else if (flag == '3') {
                    var index = data.indexOf('msg:');
                    onDisplayError(data.substring(index + 4));
                }
                else if (flag == '4') {
                    onDisplayError("Documents and product should have the same manufacturer.");
                }
                else if (flag == '5') {
                    onDisplayError("Only one combination of language/Jurisdiction for a document type by product.");
                }
            });
        };

        function displaySingleDocument(documentObj) {
            var url = GetEnvironmentLocation() + "/Operations/Document/LoadSingleDocument?documentId=" + documentObj.DocumentID + "&revisionId=" + documentObj.RevisionID;
            window.open(url, "_blank");
        }

        var DeleteDoc = function (e) {
            e.preventDefault();

            var strconfirm = confirm("Are you sure you want to remove this document from product?");
            if (strconfirm == false) {
                return;
            }

            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            dataItem.IsSelected = true;
            var targetId = e.delegateTarget.id;
            var pid = targetId.substring(targetId.indexOf("_") + 1, targetId.length);
            activeProduct = pid;
            var doclists = [];
            doclists.push(dataItem.ReferenceId);

            var url = GetEnvironmentLocation() + "/Configuration/ProductManager/DeleteProductDocument";
            $.post(url, { productId: pid, documentList: JSON.stringify(doclists) }, function (data) {

                if (data.indexOf("Successfully") < 0) {
                    onDisplayError(data);
                    return;
                }

                var index = data.indexOf("from product");
                var prodid = data.substring(index + 13, data.length);

                var grid1 = $('#gdProductDocuments_' + prodid).data("kendoGrid");
                grid1.dataSource.page(1);
                grid1.dataSource.read();

                var tabId = "#" + prodid + "_tbProductDetail";
                TabReload(tabId, 0);
            });
        };

        var DeleteSelectedDocFromProd = function (productId, doclists) {

            if (doclists.length <= 0) {
                onDisplayError("Please select document(s) to delete.");
                return;
            }

            var strconfirm = confirm("Are you sure you want to delete these document(s)?");
            if (strconfirm == false) {
                return;
            }

            var url = GetEnvironmentLocation() + "/Configuration/ProductManager/DeleteProductDocument";
            if (doclists.length > 0) {
                $.post(url, {
                    productId: productId,
                    documentList: JSON.stringify(doclists)
                }, function (data) {

                    if (data.indexOf("Successfully") < 0) {
                        onDisplayError(data);
                        return false;
                    }

                    //delete a row from the grid after successfully delete document
                    var index2 = data.indexOf("from product");
                    var prodid = data.substring(index2 + 13, data.length);
                    var grid = $('#gdProductDocuments_' + prodid);

                    $(".chkMasterMultiSelect", grid).removeAttr("checked");

                    var gridId = 'gdProductDocuments_' + prodid;

                    var singleProdObj = selectedProdIdObj[gridId];

                    //uncheck checkboxes
                    var gData = grid.data("kendoGrid").dataSource.data();
                    var totalNumber = gData.length;

                    if (totalNumber > 0) {
                        $.each(gData, function () {
                            for (var i = 0; i < singleProdObj.length; i++) {
                                if (this.ReferenceId == singleProdObj[i]) {
                                    singleProdObj.splice(i, 1);
                                }
                            }
                        });
                    }

                    var grid1 = $('#gdProductDocuments_' + productId).data("kendoGrid");
                    activeProduct = productId;
                    grid1.dataSource.read();
                    grid1.dataSource.page(1);
                });
            }

        };

        // Product Status History Methods
        var onProductStatusGridChange = function () {
            var productId = this.wrapper.attr('id');
            productId = productId.substring(productId.indexOf('_') +1);

            var selectedRow = this.wrapper.data('kendoGrid').select();
            var selectedData = this.dataItem(selectedRow);
            if (selectedData != null) {
                $('#StatusNotesText_' + productId).html(selectedData.Notes);
            } else {
                $('#StatusNotesText_' + productId).html('');
            }
        };

        // Supplier Methods
        var viewSingleSupplier = function (supplierId) {
            if (supplierId > 0) {
                //var currenturl = window.location.href;
                //var indexArea = currenturl.substring(0, currenturl.indexOf('Configuration/ProductManager'));
                var url = GetEnvironmentLocation() + "/Operations/Company/LoadSingleSupplier?supplierId=" + supplierId;
                window.open(url, "_blank");
            }
        }

        function saveBtnEvent(activeSaveButton) {
            var form = $("#frmProductDetail_" + activeSaveButton).updateValidation();
            if (!form.valid()) {
                return;
            }

            // Check if notes are needed for a status change
            var formData = form.serialize();
            kendo.ui.progress(form, true);

            var url = GetEnvironmentLocation() + "/Configuration/ProductManager/GetStatusAction";        
            $.post(url, formData, function (data) {
                kendo.ui.progress(form, false);

                if (data.displayMessage) {
                    if(data.statusError == true) {
                        displayErrorMessage(data.displayMessage);
                    } else {

                        if (notesModalSettings) {
                            notesModalSettings.displayStatusNoteConfirmation(data, function (e) {
                                form.find('#hdnStatusNotes_' + activeSaveButton).val(e.modalNotes);
                                saveProductInformation(activeSaveButton);
                            });
                        }
                    }

                } else {
                    saveProductInformation(activeSaveButton);
                }
                UnBindingSaveCancel(activeSaveButton);
            });
        }

        function saveProductInformation(activeSaveButton) {

            var selectedSuppilerId = $("#txtSupplierId_" + activeSaveButton).val().substring(0, $("#txtSupplierId_" + activeSaveButton).val().indexOf(','));
            var selectedSuppilerName = $("#txtSupplierId_" + activeSaveButton).val().substring($("#txtSupplierId_" +activeSaveButton).val().indexOf(',') +1);
            var selectedStatusId = $("#ddlProductStatus_" + activeSaveButton).data('kendoDropDownList').value();
            var selectedPhysicalStateId = $("#ddlPhysicalState_" + activeSaveButton).data('kendoDropDownList').value();
            var selectedPhysicalStateText = selectedPhysicalStateId ? $("#ddlPhysicalState_" + activeSaveButton).data('kendoDropDownList').text() : 'Unknown';
            var productId = $("#txtProductId_" + activeSaveButton).val();

            var queryText = {
                        ReferenceId: productId,
                        ProductName: $("#txtProductName_" + activeSaveButton).val(),
                        SupplierId: selectedSuppilerId,
                        SupplierName: selectedSuppilerName,
                        ObtainmentNote: $("#txtObtainmentNote_" + activeSaveButton).val(),
                        XReferenceNote: $("#txtXReferenceNote_" +activeSaveButton).val(),
                        SelectedStatusId: selectedStatusId,
                        StatusNotes: $("#hdnStatusNotes_" + activeSaveButton).val(),
                        SelectedPhysicalStateId: selectedPhysicalStateId,
                        PhysicalStateText: selectedPhysicalStateText
                    };

            var url = GetEnvironmentLocation() + "/Configuration/ProductManager/SaveProduct";
            $.post(url, { jsProductSearchModel: JSON.stringify(queryText) }, function (data) {

                if (!data || data.ErrorMessage) {
                    var errorMessage = data.ErrorMessage || 'Error occured while saving the product';
                    onDisplayError(errorMessage);
                    return;
                }
        
                if (activeSaveButton == 0) {

                    $("#txtProductId_" + activeSaveButton).val(data.ReferenceId);

                    if ($("#btnAddDocToProduct_" + activeSaveButton).hasClass("k-state-disabled")) {
                        $("#btnAddDocToProduct_" + activeSaveButton).removeClass("k-state-disabled");
                        $("#btnAddDocToProduct_" + activeSaveButton).click(function (e) {
                            newProductActive = true;
                            activeProduct = data.ReferenceId;
                            $('#ddlProductStatus_' + activeSaveButton).data('kendoDropDownList').enable(true);

                            if (displayDocumentPopUp) {
                                displayDocumentPopUp(function (data) {
                                    debugger;

                                    var doclists = [];
                                    doclists.push(data.ReferenceId);
                                    addDocumentListToProduct(doclists);
                                });
                            }
                        });
                    }

                    UnBindingSaveCancel(0);
                    deactivateLayout(activeSaveButton);
                    
                    $('#txtProductSearch').val(data.ReferenceId);
                    $("#divNewProductDetail").html("");

                    var grid = $('#gdSearchProduct').data('kendoGrid');
                    if (grid) {
                        grid.bind("dataBound", function addNewProductDataBound() {
                            var productRow = grid.wrapper.find('tr.k-master-row:first');
                            grid.select(productRow);
                            grid.expandRow(productRow);
                            grid.unbind("dataBound", addNewProductDataBound);
                        });

                        grid.dataSource.read();
                    }

                } else {
                    $('#hdnStatusNotes_' +activeSaveButton).val('');

                    reloadProductHistoryGrid(activeSaveButton);
                    setProductGridDataSourceItem(data);
                }

                if (updateStatusLayoutCallback) {
                    updateStatusLayoutCallback(productId, selectedStatusId);
                }
            });
        }

        // Method to set the datasource item based on the data passed through
        function setProductGridDataSourceItem(productObj) {
            var kgrid = $("#gdSearchProduct").data("kendoGrid");
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
            var grid = $('#grdProductStatusHistory_' + productId).data('kendoGrid');
            if (grid) grid.dataSource.read();
        }

        ////////////non publuc / public/////////////
        var panelbar_activated = function () {
            //Can not be moved to partial view, or it cause clear and search again
            $("#clearProductBtn").click(function (e) {

                if (parent.window.opener != null) {
                    if (parent.window.opener.document.getElementById("txtProductId") != null) {
                        var txtName = parent.window.opener.document.getElementById("txtProductId");
                        txtName.value = "";
                    }
                }

                
                //Remove search result
                $('#txtProductSearch').val("");
                var grid = $("#gdSearchProduct").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    return false;
                }

                grid.dataSource.filter([]);
                grid.dataSource.data([]);
                return false;
            });

            $("#searchSupplierIdSelect").click(function (e) {

                var grid = $("#gdSearchSupplier").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    //$("#popupSupplierSearch").modal("hide");
                    onDisplayError("No row selected");
                    return;
                }
                var data = grid.dataItem(grid.select());
                if (data == null) {
                    onDisplayError("No row selected");
                    return;
                }

                $("#" + activeSupplier).val(data.id + ", " + data.Name);

                supplierSearchDialog.data("kendoWindow").close();

                BindingSaveCancel(activeSupplierIndex);
            });

            $("#gdSearchSupplier").dblclick(function(e) {
                    
                    var grid = $("#gdSearchSupplier").data("kendoGrid");
                    if (grid.dataSource.total() == 0) {
                        //$("#popupSupplierSearch").modal("hide");
                        onDisplayError("No row selected");
                        return;
                    }
                    var data = grid.dataItem(grid.select());
                    if (data == null) {
                        onDisplayError("No row selected");
                        return;
                    }
                    $("#" + activeSupplier).val(data.id + ", " + data.Name);

                    supplierSearchDialog.data("kendoWindow").close();

                    BindingSaveCancel(activeSupplierIndex);
            });

            $("#btnCancelSupplierSearch").click(function (e) {
                supplierSearchDialog.data("kendoWindow").close();
            });

            if (initializeSearchHistoryCallback)
                initializeSearchHistoryCallback('gdSearchProduct', 'txtProductSearch', refreshProductSearchResultGrid);
        };

        var RemovedProductDocument = function (e) {
            var docId = e.model["ReferenceId"];
            var gridname = e.row.context.attributes["gridname"];
            var activepid = e.row.context.attributes["activepid"];
            var pid = activepid.value;

            if (pid == 0)
                pid = $("#txtProductId_0").val();

            //if not work, then get PartNumber using serverFiltering sproc
            setTimeout(function () {
                var currentProductAttributes = "#txtProductAttributes_" + activepid.value;
                //var url = '@Url.Action("GetProductPartNumberById", "ProductManager")';
                var url = GetEnvironmentLocation() + "/Configuration/ProductManager/GetProductPartNumberById";
                $.post(url, { productId: pid }, function (partNumber) {
                    $(currentProductAttributes).val(partNumber);
                });
            }, 500);
        };

        var RefreshProductData = function (e) {
            if (newProductActive)
                return { productInfo: $("#txtProductId_0").val() };
            else
                return { productInfo: $("#txtProductId_" + activeProduct).val() };
        };

        var panelbar_collapse = function() {
        };

        var panelbar_expand = function () {
        };

        var onProductStatusChange = function() {
            var elemId = this.element.attr('id');
            elemId = elemId.replace('ddlProductStatus_', '');
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
            var grid = $("#gdSearchProduct").data("kendoGrid");
            grid.dataSource.page(1);
            grid.dataSource.read();
            QueueQuery();
        };

        var QueueQuery = function () {

            if (!addToSearchHistoryCallback) return;

            var searchField = $("#txtProductSearch");
            if (searchField.length > 0)
                addToSearchHistoryCallback('gdSearchProduct', searchField.val());
        };

        var LoadProductMatchDetailsCompleted = function (e) {
            var pKey = e.item.id.substring(0, e.item.id.indexOf('_tbProductDetail'));

            var productObj = $('[id*=gdProductDocuments_' + pKey + ']');
            initializeMultiSelectCheckboxes(productObj);

            $('#txtSupplierId_' + pKey).keyup(function (e1) {
                var code = (e1.keyCode ? e1.keyCode : e1.which);
                if (code == 13) { //Search only on enter
                    DoLookUpSupplierOnKeyEnter('#txtSupplierId_' + pKey);
                }
            });

            UnBindingSaveCancel(pKey);

            $('#btnRefreshProduct_' + pKey).on('click', function () {
                var tabId = "#" + pKey + "_tbProductDetail";

                // Check if a change had occurred in any of the fields
                if (!$('#btnSaveProduct_' + pKey).hasClass('k-state-disabled')) {

                    // Set up information for the confirmation modal
                    var args = { message: 'All product changes will be reverted. Are you sure you would like to reload the product?', header: 'Confirm Product Reload' };
                    DisplayConfirmationModal(args, function () {
                        TabReload(tabId, 0);
                    });
                } else {
                    TabReload(tabId, 0);
                }
            });

            $('#txtProductName_' + pKey + ',#txtSupplierId_' + pKey).on('input', function () {
                BindingSaveCancel(pKey);
            });

            $('#txtObtainmentNote_' + pKey + ',#txtSupplierId_' + pKey).on('input', function () {
                BindingSaveCancel(pKey);
            });

            $('#txtXReferenceNote_' + pKey + ',#txtSupplierId_' + pKey).on('input', function () {
                BindingSaveCancel(pKey);
            });

            $("#searchSupplierIdBtn_" + pKey).on("click", function (e2) {
                activeSupplier = "txtSupplierId_" + pKey;
                activeSupplierIndex = pKey;

                //BootStrap Dialog
                supplierSearchDialog.data("kendoWindow").center().open();
                //supplierSearchDialog.data("kendoWindow").open();

                //No Access here for add new supplier
                $("#addNewSupplierBtn").hide();

                $("#clearSupplierBtn").click(function (ee) {
                    //Remove search result
                    var grid = $("#gdSearchSupplier").data("kendoGrid");
                    grid.dataSource.filter({});
                    grid.dataSource.data([]);
                    $('#txtSupplierSearch').val("");
                    return false;
                });
            });

            //(SH) 4-16-2014
            $("#viewSupplierIdBtn_" + pKey).click(function (e2) {

                var supplierId = GetNewSupplierId(pKey);
                if (supplierId > 0) {
                    //var currenturl = window.location.href;
                    //var indexArea = currenturl.substring(0, currenturl.indexOf('Configuration/ProductManager'));
                    var url = GetEnvironmentLocation() + "/Operations/Company/LoadSingleSupplier?supplierId=" + supplierId;
                    window.open(url, "_blank");
                }
            });

            //Add doc parts
            $("#btnAddDocToProduct_" +pKey).on("click",function(e3) {
                activeProduct = pKey;
                newProductActive = false;

                //Hook up the txtSearchSupplierId key events on document screen plugIn
                $('#txtSearchSupplierId').keyup(function (event) {
                    var code = (event.keyCode ? event.keyCode : event.which);
                    if (code == 13) { //Search only on enter
                        DoLookUpSupplierOnKeyEnter('#txtSearchSupplierId');
                    }
                });

                $("#searchSupplierIdBtn").click(function (eee) {
                    prodlib.showSupplierPlugIn("txtSearchSupplierId");
                });

                if (displayDocumentPopUp) {
                    displayDocumentPopUp(function (data) {
                        var doclists = [];
                        doclists.push(data.ReferenceId);
                        addDocumentListToProduct(doclists);
                    });
                }
            });

            $("#btnDeleteDocFromProduct_" + pKey).click(function(e3) {
                
                var grid = $(this).parents('.k-grid:first');
                var gridId = grid.attr('id');
                var singleProdObj = selectedProdIdObj[gridId];
                if (gridId in selectedProdIdObj) {
                    singleProdObj = selectedProdIdObj[gridId];
                }
                if (singleProdObj != undefined) {
                    DeleteSelectedDocFromProd(pKey, singleProdObj);

                    var tabId = "#" + pKey + "_tbProductDetail";
                    TabReload(tabId, 0);
                    
                } else {
                    alert('Please select document(s) to delete.');
                }
            });

            // Deactivate the layout if the status is set to deactivated
            deactivateLayout(pKey);

        }; //end of LoadProductMatchDetailsCompleted

        var showSupplierPlugIn = function (currentSupplier) {
            activeSupplier = currentSupplier;
            $("#addNewSupplierBtn").hide();

            supplierSearchDialog.data("kendoWindow").center().open();
            //supplierSearchDialog.data("kendoWindow").open();
        };


        var UnBindingSaveCancel = function(activekey) {
            var saveBtn = '#btnSaveProduct_' + activekey;
            var cancelBtn = "#btnCancelProductEdit_" + activekey;

            if (!$(saveBtn).hasClass("k-state-disabled")) 
                $(saveBtn).addClass("k-state-disabled").unbind('click');
                
            
            if (activekey > 0) {
                if (!$(cancelBtn).hasClass("k-state-disabled")) 
                    $(cancelBtn).addClass("k-state-disabled").unbind('click');
            }
        };

        var BindingSaveCancel = function(activekey) {
            var saveBtn = '#btnSaveProduct_' + activekey;
            var cancelBtn = "#btnCancelProductEdit_" + activekey;

            if ($(saveBtn).hasClass("k-state-disabled")) {
                $(saveBtn).removeClass("k-state-disabled").unbind('click');

                $(saveBtn).click(function (e) {
                    e.preventDefault();
                    saveBtnEvent(activekey);
                });
            }

            if ($(cancelBtn).hasClass("k-state-disabled")) {
                $(cancelBtn).removeClass("k-state-disabled").unbind('click');
                //$(cancelBtn).unbind('click');

                if (activekey > 0) {
                    $(cancelBtn).click(function(e) {
                        var tabId = "#" + activekey + "_tbProductDetail";
                        TabReload(tabId, 0);
                    });
                }
            }
        };
        //--------------------end of _SearchProduct.cshtml-----------------------

        //--------------------start of _NewProductView.cshtml-----------------------
        ////currently not used due to the concern over the default routing behavior
        var setDeleteImageIcon = function (e) {
            $(".k-grid-Remove").html("<span class='k-icon k-delete'></span>");
        }

        var pnlNewProduct_Activated = function(event) {

            //$("#btnDiscardNewProduct").click(function(evt) {
            //    evt.preventDefault();
            //    $("#btnDiscardNewProduct").closest('div').html("");
            //});

            $("#btnCancelProductEdit_0").click(function (evt) {
                $("#divNewProductDetail").html("");
            });

            var pKey = 0;
            //$("#btnCancelProductEdit_0").hide();
            $("#btnRefreshProduct_0").hide();

            UnBindingSaveCancel(pKey);
            BindingSaveCancel(pKey);

            $('#txtProductName_' + pKey + ',' + '#txtSupplierId_' + pKey).on('input', function() {
                BindingSaveCancel(pKey);
            });

            $('#txtObtainmentNote_' + pKey + ',' + '#txtSupplierId_' + pKey).on('input', function () {
                BindingSaveCancel(pKey);
            });

            $('#txtXReferenceNote_' + pKey + ',' + '#txtSupplierId_' + pKey).on('input', function () {
                BindingSaveCancel(pKey);
            });

            $('#txtSupplierId_' + pKey).keyup(function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code == 13) { //Search only on enter
                    if (IsNumeric($("#txtSupplierId_" + pKey).val()))
                        DoLookUpSupplierOnKeyEnter('#txtSupplierId_' + pKey);

                }
            });


            $("#searchSupplierIdBtn_" + pKey).click(function(evt) {
                activeSupplier = "txtSupplierId_" + pKey;
                activeSupplierIndex = pKey;

                //$("#popupSupplierSearch").modal("show");
                supplierSearchDialog.data("kendoWindow").center().open();
                //supplierSearchDialog.data("kendoWindow");

                //No Access here for add new supplier
                $("#addNewSupplierBtn").addClass("k-state-disabled").unbind('click');
                //$("#addNewSupplierBtn").unbind('click');

                $("#clearSupplierBtn").click(function(e) {
                    //Remove search result
                    var grid = $("#gdSearchSupplier").data("kendoGrid");
                   // grid.dataSource.filter({});
                    grid.dataSource.data([]);
                    //$('#' + activeSupplier).val("");
                    $('#txtSupplierSearch').val("");
                    return false;
                });
            });
        };

        //--------------------end _NewProductView.cshtml-----------------------

        var selectedProdIdObj = {};

        function initializeMultiSelectCheckboxes(productObj) {

            productObj.on("mouseup MSPointerUp", ".chkMultiSelect", function (e) {
                var checked = $(this).is(':checked');  //checkbox status BEFORE click event
                var grid = $(this).parents('.k-grid:first');
                var gridId = grid.attr('id');
                var singleProdObj = [];
                if (gridId in selectedProdIdObj) {
                    singleProdObj = selectedProdIdObj[gridId];
                }else {
                    selectedProdIdObj[gridId] = singleProdObj;
                }

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
                                if (index < 0) {
                                    singleProdObj.push(id);
                                }
                            } else {
                                if (index >=0) {
                                    singleProdObj.splice(index, 1);
                                }
                            }
                        }

                        $('tr', grid).each(function() {
                            var tr = $(this);
                            var cked = $('.chkMultiSelect', tr).is(':checked');
                            if (cked) {
                                tr.addClass('k-state-selected');
                            } else {
                                tr.removeClass('k-state-selected');
                            }
                        });
                     
                    }
                }

                // Keep grid from changing seleted information
                e.stopImmediatePropagation();
            });
          
            productObj.on("click", ".chkMasterMultiSelect", function (e) {
                var checked = $(this).is(':checked');
                var grid = $(this).parents('.k-grid:first');
                var singleProdObj = [];

                var gridId = grid.attr('id');
                if (gridId in selectedProdIdObj) {
                    singleProdObj = selectedProdIdObj[gridId];
                } else {
                    selectedProdIdObj[gridId] = singleProdObj;
                }

                if (grid) {
                    $('tr', grid).each(function () {
                        var tr = $(this);
                        var id = $('td:nth-child(3)', tr).text(); //get docid
                        
                        if (id) {
                            var index = singleProdObj.indexOf(id);
                            if (checked) {
                                if (index < 0) {
                                    singleProdObj.push(id);
                                }
                            } else {
                                if (index >= 0) {
                                    singleProdObj.splice(index, 1);
                                }
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
                            if (cked) {
                                tr.addClass('k-state-selected');
                            } else {
                                tr.removeClass('k-state-selected');
                            }
                        });

                    } else {
                        return false;
                    }
                }
            });
        };
       
        return {
            BindingSaveCancel: BindingSaveCancel,
            DeleteDoc: DeleteDoc,
            displaySingleDocument: displaySingleDocument,
            initializeProductDetailControls: initializeProductDetailControls,
            intializeSearchHistoryControls: intializeSearchHistoryControls,
            LoadProductMatchDetailsCompleted: LoadProductMatchDetailsCompleted,
            onProductStatusChange: onProductStatusChange,
            onProductStatusGridChange: onProductStatusGridChange,
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

            setUpdateStatusLayoutCallback: setUpdateStatusLayoutCallback
        };
    };

    //Initialize
    $(function() {
        menuHelper.turnMenuActive($("#menuOperations"));
    });

})(jQuery);

