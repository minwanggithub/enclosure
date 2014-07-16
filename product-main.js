
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

            var selectedSuppilerId = $("#txtSupplierId_" + activeSaveButton).val().substring(0, $("#txtSupplierId_" + activeSaveButton).val().indexOf(','));
            var selectedSuppilerName = $("#txtSupplierId_" + activeSaveButton).val().substring($("#txtSupplierId_" + activeSaveButton).val().indexOf(',') + 1);

            var queryText = {
                ReferenceId: $("#txtProductId_" + activeSaveButton).val(),
                ProductName: $("#txtProductName_" + activeSaveButton).val(),
                SupplierId: selectedSuppilerId
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
                    return;
                }

                if (data != '0') {
                    var prdGrid = $("#gdSearchProduct").data("kendoGrid");
                    var parentRowIndex = $("#txtProductId_" + activeSaveButton).val();
                    var dataItem = prdGrid.dataSource.get(parentRowIndex);

                    //var dataItem = $("#gdSearchProduct").data("kendoGrid").dataSource.get(parentRowIndex);
                    dataItem.set("ProductName", $("#txtProductName_" + activeSaveButton).val());
                    dataItem.set("SupplierId", selectedSuppilerId);
                    dataItem.set("SupplierName", selectedSuppilerName);

                    var dataItemRow = prdGrid.table.find('tr[data-uid="' + dataItem.uid + '"]');
                    prdGrid.expandRow(dataItemRow);

                } else {
                    alert('Error occured while saving the product');
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

            var strconfirm = confirm("Are you sure you want to delete this document?");
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
        }

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

            $('#txtProductName_' + pKey + ',' + '#txtSupplierId_' + pKey).on('input', function () {
                BindingSaveCancel(pKey);
            });

            $("#searchSupplierIdBtn_" + pKey).click(function (e2) {
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
            $("#btnAddDocToProduct_" +pKey).click(function(e3) {
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
                        //var url = '@Url.Action("LookUpSupplierOnKeyEnter", "Company", new {Area="Operations"})';
                        //var supplierInfo = $("#txtSearchSupplierId").val();
                        //$.post(url, { supplierInfo: supplierInfo }, function (data) {
                        //    $('#txtSearchSupplierId').val(data);
                        //});
                        DoLookUpSupplierOnKeyEnter('#txtSearchSupplierId');
                    }
                });

                $("#searchSupplierIdBtn").click(function (eee) {
                    prodlib.showSupplierPlugIn("txtSearchSupplierId");
                });

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
                $(saveBtn).click(function(e) { saveBtnEvent(activekey); });
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

            $("#btnDiscardNewProduct").click(function(evt) {
                evt.preventDefault();
                $("#btnDiscardNewProduct").closest('div').html("");
            });

            var pKey = 0;
            $("#btnCancelProductEdit_0").hide();

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
                    grid.dataSource.filter({});
                    grid.dataSource.data([]);
                    //$('#' + activeSupplier).val("");
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
                     
                        if (selectedRow.length > 0) {
                            if (!checked) {
                               grid.find('tr[data-uid="' + selectedRow.attr('data-uid') + '"]').addClass('k-state-selected');
                            }
                            else {
                               grid.find('tr[data-uid="' +selectedRow.attr('data-uid') + '"]').removeClass('k-state-selected');
                            }
                        }
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
                    } else {
                        return false;
                    }
                }
            });

         

        };
       
        return {
            //--------------------start of ConfigProduct.cshtml-----------------------
            panelbar_activated: panelbar_activated,
            RemovedProductDocument: RemovedProductDocument,
            RefreshProductData: RefreshProductData,
            AddDocumentListToProduct: AddDocumentListToProduct,
            displaySingleDocument: displaySingleDocument,
            panelbar_expand: panelbar_expand,
            panelbar_collapse: panelbar_collapse,
            OngdSearchDocumentChange: OngdSearchDocumentChange,
            OngdProductDocumentSelectChange: OngdProductDocumentSelectChange,
            OngdProductRevisionSelectChange: OngdProductRevisionSelectChange,
            getSelectDocID: getSelectDocID,
            documentQuery: documentQuery,
            viewSingleSupplier: viewSingleSupplier,
            getUrl: getUrl,
            DeleteDoc: DeleteDoc,
            setDeleteImageIcon: setDeleteImageIcon,

            //--------------------end of ConfigProduct.cshtml-----------------------

            //--------------------start of _SearchProduct.cshtml-----------------------
            BindingSaveCancel: BindingSaveCancel,
            UnBindingSaveCancel: UnBindingSaveCancel,
            LoadProductMatchDetailsCompleted: LoadProductMatchDetailsCompleted,
            showSupplierPlugIn: showSupplierPlugIn,
            refreshProductSearchResultGrid: refreshProductSearchResultGrid,
            //--------------------end of _SearchProduct.cshtml-----------------------

            //--------------------start of AgentManager.cshtml-----------------------
            //--------------------end AgentManager.cshtml-----------------------


            //--------------------start of _NewProductView.cshtml-----------------------
            pnlNewProduct_Activated: pnlNewProduct_Activated,
            //--------------------end _NewProductView.cshtml-----------------------
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

