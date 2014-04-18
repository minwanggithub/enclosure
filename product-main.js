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
            //var urlmultiple = '@Url.Action("AddDocumentListToProduct", "ProductManager")';
            var urlmultiple = "../ProductManager/AddDocumentListToProduct";

            $.post(urlmultiple, { productId: activeProduct, documentList: JSON.stringify(doclists) }, function (data) {
                if (data == '1') {
                    documentSearchDialog.data("kendoWindow").close();

                    var curGdProductDoc = $("#gdProductDocuments_" + activeProduct).data("kendoGrid");
                    if (newProductActive)
                        curGdProductDoc = $("#gdProductDocuments_0").data("kendoGrid");
                    curGdProductDoc.dataSource.page(1);
                    curGdProductDoc.dataSource.read();

                    var currentProductAttributes = "#txtProductAttributes_" + activeProduct;
                    if (newProductActive)
                        currentProductAttributes = "#txtProductAttributes_0";

                    //var url = '@Url.Action("GetProductPartNumberById", "ProductManager")';
                    var url = "../ProductManager/GetProductPartNumberById";
                    $.post(url, { productId: activeProduct }, function (partNumber) {
                        $(currentProductAttributes).val(partNumber);
                    });


                } else {
                    alert('All documents already exist in this product');
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


        function AddDocumentProduct(documentId, e) {
            //var url = '@Url.Action("AddDocumentToProduct", "ProductManager")';
            var url = "../ProductManager/AddDocumentToProduct";
            $.post(url, { productId: activeProduct, documentId: documentId }, function (data) {
                if (data == '0') {
                    documentSearchDialog.data("kendoWindow").close();
                    var curGdProductDoc = $("#gdProductDocuments_" + activeProduct).data("kendoGrid");
                    if (newProductActive)
                        curGdProductDoc = $("#gdProductDocuments_0").data("kendoGrid");
                    curGdProductDoc.dataSource.page(1);
                    curGdProductDoc.dataSource.read();

                    var currentProductAttributes = "#txtProductAttributes_" + activeProduct;
                    if (newProductActive)
                        currentProductAttributes = "#txtProductAttributes_0";

                    //url = '@Url.Action("GetProductPartNumberById", "ProductManager")';
                    $.post("../ProductManager/GetProductPartNumberById", { productId: activeProduct }, function (partNumber) {
                        $(currentProductAttributes).val(partNumber);
                    });
                    return true;
                } else {
                    alert('Document already exists in this product');
                }
            });
        };

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
                LatestRevisionOnly: $("#chkLatestRevision:checked").length == 1
            };
            return {
                searchText: JSON.stringify(queryText)
            };
        };

        //(SH) 4-16-2014
        var viewSingleSupplier = function (supplierId) {
            if (supplierId > 0) {
                var url = "/MsdsBoiler//Operations/Company/LoadSingleSupplier?supplierId=" + supplierId;
                window.open(url, "_blank");
            }
        }

        function saveBtnEvent(activeSaveButton) {

            //e.preventDefault();
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

            //var url = '@Url.Action("SaveProduct", "ProductManager")';
            var url = "../ProductManager/SaveProduct";
            $.post(url, { jsProductSearchModel: JSON.stringify(queryText) }, function (data) {
                if (activeSaveButton == 0) {
                    $("#txtProductId_" + activeSaveButton).val(data);
                    if ($("#btnAddDocToProduct_" + activeSaveButton).hasClass("k-state-disabled")) {
                        $("#btnAddDocToProduct_" + activeSaveButton).removeClass("k-state-disabled");

                        $("#btnAddDocToProduct_" + activeSaveButton).click(function (e) {
                            activeProduct = data;
                            newProductActive = true;
                            //$("#popupDocumentSearch").modal("show");
                            documentSearchDialog.data("kendoWindow").center();
                            documentSearchDialog.data("kendoWindow").open();
                            $("#addNewDocumentBtn").hide();
                            $("#documentDisplayOptionDiv").hide();
                        });

                        $("#searchDocumentBtn").click(function (e) {
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


                if (grid.select().length > 1) {
                    var rows = grid.select();
                    var doclists = [];
                    rows.each(
                        function (index, row) {
                            var selectedItem = grid.dataItem(row);
                            doclists.push(selectedItem.ReferenceId);
                        }
                    );
                    AddDocumentListToProduct(doclists);
                    return;
                }
                AddDocumentProduct(data.ReferenceId);
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

        var OnProductDocumentRequestEnd = function(e) {
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
            tsProdDetail.reload(tsProdDetail.items()[tab]);
        }

        ////////////non publuc / public/////////////
        var refreshProductSearchResultGrid = function () {
            var grid = $("#gdSearchProduct").data("kendoGrid");
            grid.dataSource.page(1);
            grid.dataSource.read();
        };

        var LoadProductMatchDetailsCompleted = function (e) {
            var pKey = e.item.id.substring(0, e.item.id.indexOf('_tbProductDetail'));

            $('#txtSupplierId_' + pKey).keyup(function (e1) {
                var code = (e1.keyCode ? e1.keyCode : e1.which);
                if (code == 13) { //Search only on enter
                    DoLookUpSupplierOnKeyEnter('#txtSupplierId_' + pKey);
                }
            });

            UnBindingSaveCancel(pKey);

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
            $("#btnAddDocToProduct_" + pKey).click(function (e3) {
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
       
        return {
            //--------------------start of ConfigProduct.cshtml-----------------------
            panelbar_activated: panelbar_activated,
            RemovedProductDocument: RemovedProductDocument,
            RefreshProductData: RefreshProductData,
            OnProductDocumentRequestEnd: OnProductDocumentRequestEnd,
            AddDocumentProduct: AddDocumentProduct,
            displaySingleDocument: displaySingleDocument,
            panelbar_expand: panelbar_expand,
            panelbar_collapse: panelbar_collapse,
            OngdSearchDocumentChange: OngdSearchDocumentChange,
            OngdProductDocumentSelectChange: OngdProductDocumentSelectChange,
            OngdProductRevisionSelectChange: OngdProductRevisionSelectChange,
            getSelectDocID : getSelectDocID,
            documentQuery: documentQuery,
            viewSingleSupplier: viewSingleSupplier,
            //--------------------end of ConfigProduct.cshtml-----------------------

            //--------------------start of _SearchProduct.cshtml-----------------------
            BindingSaveCancel: BindingSaveCancel,
            UnBindingSaveCancel: UnBindingSaveCancel,
            LoadProductMatchDetailsCompleted: LoadProductMatchDetailsCompleted,
            showSupplierPlugIn : showSupplierPlugIn,
            refreshProductSearchResultGrid : refreshProductSearchResultGrid,
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
            if(prodlib != undefined)
                prodlib.AddDocumentProduct(prodlib.getSelectDocID, e);
        });
    });

})(jQuery);

