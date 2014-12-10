﻿
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
        //var documentMain = false;
        var selectDocID = undefined;
        var selectProductDocID = undefined;
        var selectProductRevisionID = 0;

        var documentSearchDialog = $("#documentSearchWindow");
        var supplierSearchDialog = $("#supplierSearchWindow");

        var onErrorCallback;
        var deactivateContent;

        //--------------------start of ConfigProduct.cshtml-----------------------
        function AddDocumentListToProduct(doclists) {
            
            var urlmultiple = "../ProductManager/AddDocumentListToProduct";

            $.post(urlmultiple, { productId: activeProduct, documentList: JSON.stringify(doclists) }, function (data) {
              
                var flag = data.substring(5, 6);

                if (flag == '0') {
                    documentSearchDialog.data("kendoWindow").close();

                    var curGdProductDoc = $("#gdProductDocuments_" + activeProduct).data("kendoGrid");
                    if (newProductActive)
                        curGdProductDoc = $("#gdProductDocuments_0").data("kendoGrid");
                    curGdProductDoc.dataSource.page(1);
                    curGdProductDoc.dataSource.read();

                    var currentProductAttributes = "#txtProductAttributes_" + activeProduct;
                    if (newProductActive)
                        currentProductAttributes = "#txtProductAttributes_0";

                    var url = "../ProductManager/GetProductPartNumberById";
                    $.post(url, { productId: activeProduct }, function (partNumber) {
                        $(currentProductAttributes).val(partNumber);
                    });

                } else if (flag == '2') {
                    $("#documentSearchWindow").data("kendoWindow").close();
                    onDisplayError('Document(s) already exist in this product. Cannot attach document(s).');
                }
                else if (flag == '3') {
                    $("#documentSearchWindow").data("kendoWindow").close();
                    var index = data.indexOf('msg:');
                    onDisplayError(data.substring(index + 4));
                }
            });
        };

        function displaySingleDocument() {
            var documentId = selectProductDocID;
            var revisionId = selectProductRevisionID;
            var currenturl = window.location.href;
            var indexArea = currenturl.substring(0, currenturl.indexOf('Configuration/ProductManager'));
            var url = indexArea + "/Operations/Document/LoadSingleDocument?documentId=" + documentId + "&revisionId=" + revisionId;
            window.open(url, "_blank");
        }

        function CreateNewDocument() {
            var currenturl = window.location.href;
            var indexArea = currenturl.substring(0, currenturl.indexOf('Configuration/ProductManager'));
            var url = indexArea + "/Operations/Document/LoadSingleDocument?documentId=0&revisionId=0";
            window.open(url, "_blank");
        }

        function GridDocumentSearchResult() {
            var grid = $("#gdSearchDocument").data("kendoGrid");
            grid.dataSource.page(1);
            grid.dataSource.read();
        };

        var documentQuery = function(e) {
            //alert($("#radiogroupTitleSearchOption:checked").val());  unlikely

            //var params = $("input[name=radiogroupTitleSearchOption]:checked").val();
            //alert(params);
            var queryText = {
                ReferenceId: $("#txtSearchDocumentId").val(),
                DocumentTypeId: $("#ddlDocumentType").val(),
                DocumentLanguageId: $("#ddlDocumentLanguage").val(),
                DocumentRegionId: $("#ddlDocumentRegion").val(),
                PartNumber: $("#txtSearchPartNumber").val(),
                UPC: $("#txtSearchUPC").val(),
                SupplierId: parseInt($("#txtSearchSupplierId").val()),
                RevisionTitle: $("#txtRevisionTitle").val(),
                SearchOption: $("input[name=radiogroupTitleSearchOption]:checked").val(),
                ContainerTypeId: $("#ddlDocumentContainer").val(),
                LatestRevisionOnly: $("#chkLatestRevision:checked").length == 1
            };
            return {
                searchText: JSON.stringify(queryText)
            };
        };

        // Helper Methods
        function displayErrorMessage(errorMessage) {
            
            if (onErrorCallback) {
                onErrorCallback(errorMessage);
            } else {
                alert(errorMessage);
            }
        }

        function displayStatusNoteConfirmation(args, yesFunc, noFunc) {

            var modal = $('#statusNoteModal');
            if (modal.length > 0) {
                modal.find('#myModalLabel')
                    .html(args.headerMessage)
                    .end()
                    .find('#myModalMessage')
                    .html(args.displayMessage)
                    .end()
                    .find('#myModalNotes')
                    .val('')
                    .end()
                    .find('#confirm-btn-yes')
                    .text(args.headerMessage.indexOf('Deactivation') > -1 ? 'Deactivate' : 'Continue');

                // Set up all click events
                modal.off('click', '#confirm-btn-yes');
                modal.on('click', '#confirm-btn-yes', function (e) {

                    // Check if the notes field has the correct information
                    var notesField = modal.find('#myModalNotes');
                    if (notesField.length > 0) {

                        if (notesField.val() && notesField.val().length > 0) {
                            modal.modal('hide');
                            if (yesFunc) {
                                e['modalNotes'] = notesField.val();
                                yesFunc(e);
                            }
                        } else {
                            displayErrorMessage('Notes were not provided, enter notes to continue.');
                        }
                    }
                });

                if (noFunc) {
                    modal.off('click', '#btn-no');
                    modal.on('click', '#btn-no', noFunc);
                }

                modal.modal({
                    backdrop: true,
                    keyboard: true
                }).css({
                    width: 'auto',
                    'max-width': '650px',
                    'margin-left': function () {
                        return -($(this).width() / 2); //auto size depending on the message
                    },
                    'margin-top': function () {
                        return (document.documentElement.clientHeight / 2) - $(this).height() - 35;
                    }
                });
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

        // Product Detail Methods
        var initializeProductDetailControls = function(errorCallback, deactivateContentFunc) {
            onErrorCallback = errorCallback;
            deactivateContent = deactivateContentFunc;
        };

        // Product Status History Methods
        var onProductStatusGridChange = function () {
            var productId = this.wrapper.attr('id');
            productId = productId.substring(productId.indexOf('_') +1);

            var selectedRow = this.wrapper.data('kendoGrid').select();
            var selectedData = this.dataItem(selectedRow);
            if (selectedData != null) {
                $('#StatusNotesText_' + productId).html(selectedData.Notes);
            }
        };

        //(SH) 4-16-2014
        //(SH) 5-7-2014
        var viewSingleSupplier = function (supplierId) {
            if (supplierId > 0) {
                var currenturl = window.location.href;
                var indexArea = currenturl.substring(0, currenturl.indexOf('Configuration/ProductManager'));
                var url = indexArea + "/Operations/Company/LoadSingleSupplier?supplierId=" + supplierId;
                window.open(url, "_blank");
            }
        }

        function getUrl(area, controllerAndFunc) {
            var currenturl = window.location.href;
            var indexArea = currenturl.substring(0, currenturl.indexOf(area));
            var url = indexArea + controllerAndFunc;
            console.log("resulting url: ", url);
            return url;
        }

        function clearMessage(activeSaveButton) {
            $('#productErrorMessage').removeAttr("color");
            $('#productErrorMessage').html("");
            if ($("#btnAddDocToProduct_" + activeSaveButton).hasClass("k-state-disabled")) {
                $("#btnAddDocToProduct_" + activeSaveButton).removeClass("k-state-disabled");
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

            var url = "../ProductManager/GetStatusAction";        
            $.post(url, formData, function (data) {
                kendo.ui.progress(form, false);

                if (data.displayMessage) {
                    if(data.statusError == true) {
                        displayErrorMessage(data.displayMessage);
                    } else {
                        displayStatusNoteConfirmation(data, function(e) {
                            form.find('#hdnStatusNotes_' +activeSaveButton).val(e.modalNotes);
                            saveProductInformation(activeSaveButton);
                        });
                    }

                } else {
                    saveProductInformation(activeSaveButton);
                }
            });
        }

        function saveProductInformation(activeSaveButton) {
            var selectedSuppilerId = $("#txtSupplierId_" + activeSaveButton).val().substring(0, $("#txtSupplierId_" + activeSaveButton).val().indexOf(','));
            var selectedSuppilerName = $("#txtSupplierId_" + activeSaveButton).val().substring($("#txtSupplierId_" +activeSaveButton).val().indexOf(',') +1);
            var selectedStatusId = $("#ddlProductStatus_" + activeSaveButton).data('kendoDropDownList').value();
            var selectedPhysicalStateId = $("#ddlPhysicalState_" + activeSaveButton).data('kendoDropDownList').value();
            var queryText = {
                        ReferenceId: $("#txtProductId_" + activeSaveButton).val(),
                        ProductName: $("#txtProductName_" + activeSaveButton).val(),
                        SupplierId: selectedSuppilerId,
                        ObtainmentNote: $("#txtObtainmentNote_" + activeSaveButton).val(),
                        XReferenceNote: $("#txtXReferenceNote_" +activeSaveButton).val(),
                        SelectedStatusId: selectedStatusId,
                        StatusNotes: $("#hdnStatusNotes_" + activeSaveButton).val(),
                        SelectedPhysicalStateId: selectedPhysicalStateId
                    };

            var url = "../ProductManager/SaveProduct";
            $.post(url, { jsProductSearchModel: JSON.stringify(queryText) }, function (data) {
                if (activeSaveButton == 0) {

                    if (data.indexOf("Error") >= 0) {
                        onDisplayError(data);
                        return;
                    }

                    $("#txtProductId_" + activeSaveButton).val(data);

                    if ($("#btnAddDocToProduct_" + activeSaveButton).hasClass("k-state-disabled")) {
                        $("#btnAddDocToProduct_" + activeSaveButton).removeClass("k-state-disabled");

                        $("#btnAddDocToProduct_" + activeSaveButton).click(function(e) {
                            activeProduct = data;
                            newProductActive = true;

                            documentSearchDialog.data("kendoWindow").center();
                            documentSearchDialog.data("kendoWindow").open();
                            $("#addNewDocumentBtn").hide();
                            $("#documentDisplayOptionDiv").hide();
                        });

                        $("#searchDocumentBtn").click(function(e) {
                            GridDocumentSearchResult();
                        });
                    }

                    UnBindingSaveCancel(0);
                    deactivateLayout(activeSaveButton);
                    return;
                }

                if (data != '0') {
                    var prdGrid = $("#gdSearchProduct").data("kendoGrid");
                    var parentRowIndex = $("#txtProductId_" + activeSaveButton).val();
                    var dataItem = prdGrid.dataSource.get(parentRowIndex);

                    dataItem.set("ProductName", $("#txtProductName_" + activeSaveButton).val());
                    dataItem.set("SupplierId", selectedSuppilerId);
                    dataItem.set("SupplierName", selectedSuppilerName);
                    dataItem.set("SelectedStatusId", selectedStatusId);

                    var dataItemRow = prdGrid.table.find('tr[data-uid="' + dataItem.uid + '"]');
                    prdGrid.expandRow(dataItemRow);

                } else {
                    displayErrorMessage('Error occured while saving the product');
                }
            });
        }

        ////////////non publuc / public/////////////
        var panelbar_activated = function () {
            //Can not be moved to partial view, or it cause clear and search again
            $("#clearProductBtn").click(function (e) {
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
                    alert("No row selected");
                    return;
                }
                var data = grid.dataItem(grid.select());
                if (data == null) {
                    alert("No row selected");
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
                        alert("No row selected");
                        return;
                    }
                    var data = grid.dataItem(grid.select());
                    if (data == null) {
                        alert("No row selected");
                        return;
                    }
                    $("#" + activeSupplier).val(data.id + ", " + data.Name);

                    supplierSearchDialog.data("kendoWindow").close();

                    BindingSaveCancel(activeSupplierIndex);
            });

            $("#btnCancelSupplierSearch").click(function (e) {
                supplierSearchDialog.data("kendoWindow").close();
            });

            $("#searchDocumentIdSelect").click(function (e) {
                addDocToProduct();
            });

            $("#btnAddDocumentFromProduct").click(function (e) {
                //alert("Under construction");
                CreateNewDocument();
            });
            
            function addDocToProduct() {
                var grid = $("#gdSearchDocument").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    alert("No row selected");
                    return;
                }

                var data = grid.dataItem(grid.select());
                if (data == null) {
                    alert("No row selected");
                    return;
                }


                if (grid.select().length >= 1) {
                    var rows = grid.select();
                    var doclists = [];
                    rows.each(
                        function (index, row) {
                            var selectedItem = grid.dataItem(row);
                            doclists.push(selectedItem.ReferenceId);
                        }
                    );
                    AddDocumentListToProduct(doclists);
                }
            }

            $("#btnCancelDocumentSearch").click(function (e) {
                documentSearchDialog.data("kendoWindow").close();
            });
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
                var url = "../ProductManager/GetProductPartNumberById";
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

        var DeleteDoc = function(e) {
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

            var url = "../ProductManager/DeleteProductDocument";
            $.post(url, { productId: pid, documentList: JSON.stringify(doclists) }, function(data) {

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

            var url = "../ProductManager/DeleteProductDocument";
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
                                if ( this.ReferenceId == singleProdObj[i]) {
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

        var panelbar_collapse = function() {
        };

        var panelbar_expand = function () {
        };

        var OngdSearchDocumentChange = function () {
            var model = this.dataItem(this.select());
            selectDocID = model.ReferenceId; //gets the value of the field DocumentID and save as global

        };

        var OngdProductDocumentSelectChange = function () {
            var model = this.dataItem(this.select());
            selectProductDocID = model.ReferenceId; //gets the value of the field DocumentID and save as global

        };

        var OngdProductRevisionSelectChange = function () {
            var model = this.dataItem(this.select());
            selectProductDocID = model.DocumentId;
            selectProductRevisionID = model.RevisionId;
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

        //--------------------end of ConfigProduct.cshtml-----------------------


        var getSelectDocID = function () {
            return selectDocID;
        };


        //--------------------start of _SearchProduct.cshtml-----------------------
        function TabReload(tabName, tab) {
            var tsProdDetail = $(tabName).data("kendoTabStrip");

            // Is the tab marked as the active tab?
            var currentTab = $(tsProdDetail.items()[tab]);
            if (!currentTab.attr('id')) {
                currentTab.attr('id', tsProdDetail._ariaId);
            }

            tsProdDetail.reload(currentTab.context);
        }

        ////////////non publuc / public/////////////
        var refreshProductSearchResultGrid = function () {
            var grid = $("#gdSearchProduct").data("kendoGrid");
            grid.dataSource.page(1);
            grid.dataSource.read();
        };


        var QueueQuery = function () {
            var txtCntrlId = "#txtProductSearch";
            if ($(txtCntrlId).val().length != 0) {
                var searchQueue = $(".btn-group > ul.dropdown-menu");
                if (searchQueue.length > 0) {

                    searchQueue.prepend("<li><a href='#'><span class='hreflimit'>" + $(txtCntrlId).val() + "</span></a><span class='btn history-close'>×</span></li>");

                    if ($(".btn-group > ul.dropdown-menu li").length > 10) {
                        $(".btn-group > ul.dropdown-menu > li:last-child").remove();
                    }
                    $(".btn-group > ul.dropdown-menu li a").click(function (e) {
                        $(txtCntrlId).val($(this).text());
                        refreshProductSearchResultGrid();
                    });

                    $(".btn.history-close").click(function (e) {
                        //$(e).parent().find("li").remove();
                        e.target.parentNode.outerHTML = "";
                        e.stopPropagation();
                    });
                }
            }
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

            Mousetrap.bind('p r', function () { $("#btnRefreshProduct_" + pKey).click(); });

            $('#txtProductName_' + pKey + ',' + '#txtSupplierId_' + pKey).on('input', function () {
                BindingSaveCancel(pKey);
            });

            $("#searchSupplierIdBtn_" + pKey).on("click", function (e2) {
                activeSupplier = "txtSupplierId_" + pKey;
                activeSupplierIndex = pKey;

                //BootStrap Dialog
                supplierSearchDialog.data("kendoWindow").center();
                supplierSearchDialog.data("kendoWindow").open();

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

            Mousetrap.bind('p m', function () { $("#searchSupplierIdBtn_" + pKey).click(); });

            //(SH) 4-16-2014
            $("#viewSupplierIdBtn_" + pKey).click(function (e2) {

                var supplierId = GetNewSupplierId(pKey);
                if (supplierId > 0) {
                    var currenturl = window.location.href;
                    var indexArea = currenturl.substring(0, currenturl.indexOf('Configuration/ProductManager'));
                    var url = indexArea + "/Operations/Company/LoadSingleSupplier?supplierId=" + supplierId;
                    window.open(url, "_blank");
                }
            });

            //Add doc parts
            $("#btnAddDocToProduct_" +pKey).on("click",function(e3) {
                activeProduct = pKey;
                newProductActive = false;

                documentSearchDialog.data("kendoWindow").center();
                documentSearchDialog.data("kendoWindow").open();

                $("#documentDisplayOptionDiv").hide();
                $("#chkLatestRevision").attr("disabled", true);
                $("#chkIncludeDeletedDocument").hide();
                $('#lblIncludeDeletedDocument').hide();

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

            });

            Mousetrap.bind('p d', function () { $("#btnAddDocToProduct_" + pKey).click(); });

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

           
            $("#addNewDocumentBtn").hide();

            $("#clearDocumentBtn").click(function (e4) {
                $("[name^='ddlDocument']").each(function (index) {
                    var ddl = $(this).data("kendoDropDownList");
                    ddl.select(0);
                });

                $('#txtSearchDocumentId').val("");
                $('#txtSearchPartNumber').val("");
                $('#txtSearchSupplierId').val("");
                $('#txtSearchUPC').val("");
                $('#txtRevisionTitle').val("");

                //Remove document search grid result
                var grid = $("#gdSearchDocument").data("kendoGrid");

                if (grid.dataSource.total() != 0) {
                    grid.dataSource.filter([]);
                    grid.dataSource.data([]);
                }

                //JQuery 1.6 above
                var defaultSearchOption = 0;
                $("input[name=radiogroupTitleSearchOption][value=" + defaultSearchOption + "]").prop('checked', true);
            });

            $("#searchDocumentBtn").click(function (e5) {
                GridDocumentSearchResult();
            });

            // Deactivate the layout if the status is set to deactivated
            deactivateLayout(pKey);

        }; //end of LoadProductMatchDetailsCompleted

        var showSupplierPlugIn = function (currentSupplier) {
            activeSupplier = currentSupplier;
            $("#addNewSupplierBtn").hide();

            supplierSearchDialog.data("kendoWindow").center();
            supplierSearchDialog.data("kendoWindow").open();
        };


        var UnBindingSaveCancel = function(activekey) {
            var saveBtn = '#btnSaveProduct_' + activekey;
            var cancelBtn = "#btnCancelProductEdit_" + activekey;

            if (!$(saveBtn).hasClass("k-state-disabled")) {
                $(saveBtn).addClass("k-state-disabled");
                $(saveBtn).unbind('click');
            }
            if (activekey > 0) {
                if (!$(cancelBtn).hasClass("k-state-disabled")) {
                    $(cancelBtn).addClass("k-state-disabled");
                    $(cancelBtn).unbind('click');
                }
            }
        };

        var BindingSaveCancel = function(activekey) {
            var saveBtn = '#btnSaveProduct_' + activekey;
            var cancelBtn = "#btnCancelProductEdit_" + activekey;

            if ($(saveBtn).hasClass("k-state-disabled")) {
                $(saveBtn).removeClass("k-state-disabled");
                $(saveBtn).unbind('click');
                $(saveBtn).click(function (e) {
                    e.preventDefault();
                    saveBtnEvent(activekey);
                });
            }

            if ($(cancelBtn).hasClass("k-state-disabled")) {
                $(cancelBtn).removeClass("k-state-disabled");
                $(cancelBtn).unbind('click');

                if (activekey > 0) {
                    $(cancelBtn).click(function(e) {
                        var tabId = "#" + activekey + "_tbProductDetail";
                        TabReload(tabId, 0);
                    });
                }
            }
        };
        //--------------------end of _SearchProduct.cshtml-----------------------



        //--------------------start of AgentManager.cshtml-----------------------

        //--------------------end AgentManager.cshtml-----------------------


        //--------------------start of _NewProductView.cshtml-----------------------
        ////currently not used due to the concern over the default routing behavior
        var setDeleteImageIcon = function (e) {
            $(".k-grid-Remove").html("<span class='k-icon k-delete'></span>")
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

            $('#txtSupplierId_' + pKey).keyup(function(e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code == 13) { //Search only on enter
                    DoLookUpSupplierOnKeyEnter('#txtSupplierId_' + pKey);
                }
            });


            $("#searchSupplierIdBtn_" + pKey).click(function(evt) {
                activeSupplier = "txtSupplierId_" + pKey;
                activeSupplierIndex = pKey;

                //$("#popupSupplierSearch").modal("show");
                supplierSearchDialog.data("kendoWindow").center();
                supplierSearchDialog.data("kendoWindow").open();

                //No Access here for add new supplier
                $("#addNewSupplierBtn").addClass("k-state-disabled");
                $("#addNewSupplierBtn").unbind('click');

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
            AddDocumentListToProduct: AddDocumentListToProduct,
            BindingSaveCancel: BindingSaveCancel,
            DeleteDoc: DeleteDoc,
            displaySingleDocument: displaySingleDocument,
            documentQuery: documentQuery,
            getSelectDocID: getSelectDocID,
            getUrl: getUrl,
            initializeProductDetailControls: initializeProductDetailControls,
            LoadProductMatchDetailsCompleted: LoadProductMatchDetailsCompleted,
            OngdProductDocumentSelectChange: OngdProductDocumentSelectChange,
            OngdProductRevisionSelectChange: OngdProductRevisionSelectChange,
            OngdSearchDocumentChange: OngdSearchDocumentChange,
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
            showSupplierPlugIn: showSupplierPlugIn,
            UnBindingSaveCancel: UnBindingSaveCancel,
            viewSingleSupplier: viewSingleSupplier,
            onProductPhysicalStateChange: onProductPhysicalStateChange
        };
    };

    //Initialize
    $(function() {
        menuHelper.turnMenuActive($("#menuOperations"));

        $('#gdSearchDocument').on('dblclick', 'table tr', function (e) {
            e.preventDefault();

            if (prodlib != undefined) {

                var grid = $("#gdSearchDocument").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    alert("No row selected");
                    return;
                }
                var data = grid.dataItem(grid.select());
                if (data == null) {
                    alert("No row selected");
                    return;
                }

                if (grid.select().length >= 1) {
                    var rows = grid.select();
                    var doclists = [];
                    rows.each(
                        function(index, row) {
                            var selectedItem = grid.dataItem(row);
                            doclists.push(selectedItem.ReferenceId);
                        }
                    );

                    prodlib.AddDocumentListToProduct(doclists, e);
                }
            }
        });
    });

})(jQuery);

