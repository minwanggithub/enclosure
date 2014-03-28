; (function ($) {
    if ($.fn.complibDocument == null) {
        $.fn.complibDocument = {};
    }

    $.fn.complibDocument = function () {
        //local variables
        var selectType;
        var supplierSearchDialog;
        var activeSupplier;
        var selectedNode = null;

        var productTreeName = "#tvProductSearchResult";
        var activeNode = "#tvProductSearchResult_tv_active";
        // support mutltiple elements
        if (this.length > 1) {
            this.each(function () { $(this).complibDocument(); });
            return this;
        }

        //Local functions
        function expandActiveDeeper() {
            setTimeout(function () {
                //var testNodes = expandedItem.find(".k-item");
                var treeview = $(productTreeName).data("kendoTreeView");
                var children = $(activeNode).find(".k-item");
                if (children.length > 0)
                    treeview.expand(children);
                else
                    expandActiveDeeper();
            }, 200);
        }

        function openPath(treeview, path) { // success
            if (path.length) {
                // listen to the change event to know when the node has been loaded
                treeview.dataSource.bind("change", function expandLevel(e) {
                    var id = e.node && e.node.id;
                    // proceed if the change is caused by the last fetching
                    if (id == path[0]) {
                        path.shift();
                        treeview.dataSource.unbind("change", expandLevel);

                        // if there are more than one levels to expand, expand them
                        if (path.length > 1) {
                            openPath(treeview, path);
                        } else {
                            // otherwise select the node with the last id
                            treeview.dataSource.get(path[0]).set("selected", true);
                        }
                    }
                });

                treeview.dataSource.get(path[0]).set("expanded", true);
            }
        }

        function toggleTreeViewPanel(expand) {
            var splitter = $("#splitterResultAndDetail").data("kendoSplitter");
            // collapse the pane with ID, pane1
            //splitter.collapse("#panelTreeView");
            //splitter.min("#panelTreeView", "1%");
            if (expand == true) {
                splitter.expand("#panelTreeView");
            } else {
                splitter.toggle("#panelTreeView");
            }
        }

        function expandNonProduct() {
            var treeview = $(productTreeName).data("kendoTreeView");

            //This line will expand all the non product
            //treeview.expand('.k-item:last');

            //treeview.expand('.k-item:first'); 

            //var getitem = treeview.dataSource.get(0);
            //                alert(getitem.Name);
            //    treeview.findByUid(getitem.uid).expand();

            //$("#tvProductSearchResult").data("kendoTreeView").expand("li:first li:first"); // expands first child 
        }

        function initiateRevisionContextMenu() {
            $("#documentTreeContextMenu").kendoMenuEx({
                dataSource: [
                    {
                        text: "Indexation",
                        click: function (event, obj) {
                            var treeView = $("#tvProductSearchResult").data("kendoTreeView");
                            var target = this.target;
                            var li = $(target).closest(".k-item")[0];
                            var documentId = treeView.dataSource.getByUid(li.getAttribute('data-uid')).id;
                            var revisionId = treeView.dataSource.getByUid(li.getAttribute('data-uid')).RevisionId;

                            var currenturl = window.location.href;
                            var indexArea = currenturl.substring(0, currenturl.indexOf('Document'));
                            var url = indexArea + "Indexation/Indexation?documentId=" + documentId + "&revisionId=" + revisionId;
                            window.open(url, "_blank");
                            return false;
                        },
                        spriteCssClass: "k-icon k-i-pencil"
                    },
                    {
                        text: 'Ext Indexation',
                        click: function (event) {
                            alert("This option is under construction");
                            return false;
                        },
                        spriteCssClass: "k-icon k-i-plus"
                    }
                ],
                anchor: '#tvProductSearchResult li',
                selector: '.CompliNodeTypeRevision',
                delay: 0
            });
        };

        function initiateDocumentContextMenu() {
            $("#documentTreeContextMenu").kendoMenuEx({
                dataSource: [
                    {
                        text: "Revise",
                        click: function (event) {
                            loadNewRevision();
                            return false;
                        },
                        spriteCssClass: "k-icon k-i-plus"
                    }
                ],
                anchor: '#tvProductSearchResult li',
                selector: '.CompliNodeTypeDocument',
                delay: 0
            });
        }

        //Used for refresh node when language changes
        function repopulateTreeBranch(form, node) {

            // Check if the language value found in the treeview vs saved, if different refresh the tree branch
            var topLevelNode = node.parents('li:last');
            var uid = node.parents('li')
                .not('[data-uid="' + topLevelNode.attr('data-uid') + '"]')
                .find('.CompliNodeTypeLanguage:first')
                .parents('li:first')
                .attr('data-uid');
            var langId = form.find('[name=DocumentLanguageId]').val();

            var obj = $('#tvProductSearchResult').data("kendoTreeView").dataSource.getByUid(uid);
            if (obj && obj.LanguageId != langId) {
                repopulateNode(topLevelNode, langId);
            }
        }

        //Used for refresh node when language changes
        function repopulateNode(node, languageid) {

            // Get any nodes below the node to preserve expanded state
            var expandedNodes = [];

            var treeview = $('#tvProductSearchResult');
            var kendoTreeView = treeview.data("kendoTreeView");
            var datasource = kendoTreeView.dataSource;

            node.find('li[data-expanded="true"]').andSelf().each(function () {
                var self = this;
                var nodeSpan = $(self).find('.k-in:first span[class^="CompliNodeType"]');
                var obj = datasource.getByUid(self.getAttribute('data-uid'));
                if (obj && nodeSpan) {
                    expandedNodes.push(nodeSpan.attr('id'));
                }

                // After the nodes are added to the array process the node paths
            }).promise().done(function () {

                // Attempt to add a new path for the new language
                if (expandedNodes.length > 0 && languageid) {
                    expandedNodes.splice(1, 0, 'Language-' + languageid);
                }

                var uid = retrieveNodeUid(node, expandedNodes[0]);
                var tvNode = kendoTreeView.findByUid(uid);
                if (tvNode) {
                    kendoTreeView.collapse(node);

                    var dataitem = kendoTreeView.dataItem(tvNode);
                    dataitem.bind("change", function setDataItemLoaded(e) {

                        var senderuid = e.sender && e.sender.uid;
                        if (this.uid == senderuid) {

                            // Check if the items calling the change event was our dataitem
                            dataitem.unbind("change", setDataItemLoaded);

                            // Follow the path to re-expand all the nodes before the tree was reloaded
                            expandNodePath(treeview, node, expandedNodes);
                        }
                    });

                    dataitem.loaded(false);
                    setTimeout(function () {
                        dataitem.load();
                    }, 500);
                }
            });
        }

        //Used for refresh node when language changes
        function expandNodePath(treeview, nodeBranch, path) {

            var kendoTreeView = treeview.data("kendoTreeView");
            var datasource = kendoTreeView.dataSource;

            // Attempt to get the next node to deal with
            var currentnode = null;
            while (!currentnode && path.length > 0) {

                // Attempt to get the node
                currentnode = datasource.getByUid(retrieveNodeUid(nodeBranch, path[0]));
                if (currentnode) {

                    // Skip all paths which have already been expanded, loaded or are not available
                    if (currentnode.expanded || currentnode.loaded()) {
                        currentnode.set("expanded", true);
                        path.shift();
                        currentnode = null;
                    }

                } else {
                    path.shift();
                }
            }

            if (currentnode) {

                // If there are levels left to expand, expand them
                if (path.length > 0) {

                    datasource.bind("change", function expandLevel(e) {

                        if (e.node) {

                            var expandedNode = kendoTreeView.findByUid(e.node.uid);
                            var expandedNodeId = expandedNode.find('.k-in:first span[class^="CompliNodeType"]').attr('id');
                            var nodeId = path[0];

                            // Continue if the change was caused by the last fetching
                            if (nodeId == expandedNodeId) {

                                // Was the node the selected node that was edited in the beginning?
                                path.shift();
                                datasource.unbind("change", expandLevel);
                                expandNodePath(treeview, nodeBranch, path);

                                // If selected value is still available attempt to check if we need to find the document
                                if (selectedNode) {
                                    var tvNode = kendoTreeView.findByUid(retrieveNodeUid(expandedNode, selectedNode));
                                    if (tvNode.length > 0) {
                                        kendoTreeView.select(tvNode);
                                        selectedNode = null;
                                    }
                                }
                            }
                        }
                    });

                    currentnode.set("expanded", true);
                }
            }
        }

        // Method to retrieve a uid based on the node information provided
        function retrieveNodeUid(nodeBranch, nodeInfo) {
            var result = null;
            if (nodeInfo) {

                var ds = $('#tvProductSearchResult').data("kendoTreeView").dataSource;
                var obj = ds.get(nodeInfo);
                if (obj) {
                    result = obj.uid;
                } else {
                    result = nodeBranch.find('span[id="' + nodeInfo + '"]').first().parents('li:first').attr('data-uid');
                }
            }

            return result;
        }

        //Public functions
        var loadSupplierPlugIn = function () {
            //var url = '@Url.Action("PlugInSupplierSearch", "Document", new
            //{
            //    Area = "Operations"
            //})';

            var url = "PlugInSupplierSearch";
            $.post(url, { supplierId: 0 }, function (data) {
                $("#dgSupplierPlugIn").html(data);
            });

            supplierSearchDialog = $("#supplierSearchWindow");
        };

        var showSupplierPlugIn = function (currentSupplier) {
            activeSupplier = currentSupplier;
            supplierSearchDialog.data("kendoWindow").center();
            supplierSearchDialog.data("kendoWindow").open();
        };

        var hideSupplierPlugIn = function () {
            supplierSearchDialog.data("kendoWindow").close();
        };


        var onExpand = function (e, expandedItem) {

            //var expandedItem = dataItem(e.node);
            var passingId = 0;
            //selectType = expandedItem;
            switch (expandedItem.NodeType) {
                case 0:
                    passingId = expandedItem.id;
                    break;
                case 1:
                    passingId = expandedItem.ProductId;
                    break;
                case 2:
                    passingId = expandedItem.ProductId;
                    break;
                case 3:
                    passingId = expandedItem.DocumentId;
                    break;
                case 4:
                    passingId = expandedItem.RevisionId;
                    break;
                default:
                    passingId = expandedItem.id;
                    break;
            }

            selectType = { "id": passingId, "ProductId": expandedItem.ProductId, "RevisionId": expandedItem.RevisionId, "NodeType": expandedItem.NodeType, "Name": expandedItem.Name, "hasChildren": expandedItem.hasChildren, "childrenList": expandedItem.childrenList, "LanguageId": expandedItem.LanguageId, "LatestRevisionOnly": expandedItem.LatestRevisionOnly, "IncludeDeletedDocument": expandedItem.IncludeDeletedDocument };

            if (expandedItem.NodeType == 1) {
                expandActiveDeeper();
            }
        };

        var expandNodeData = function (e) {
            var selectTypeValue = getSelectType();
            return {
                selectType: JSON.stringify(selectTypeValue)
            };
        };

        var onDataBound = function () {
            //expandNonProduct();

            var revisionNode = $(".CompliNodeTypeRevision");
            if (revisionNode.length > 0) {
                revisionNode.mouseover(function (element) {
                    initiateRevisionContextMenu();
                });
            }

            var documentNode = $(".CompliNodeTypeDocument");
            if (documentNode.length > 0) {
                documentNode.mouseover(function (element) {
                    initiateDocumentContextMenu();
                });
            }
        };


        var getSelectType = function () {
            return selectType;
        };

        var clearDocumentDetail = function () {
            $('#panelDocDetailInner').html("");
            $('#panelDocDetailInner').removeClass("new-document-revision");
            //            $('#divDocumentIdentification').html("");
            //            $('#divRevisionIdentification').html("");
        };

        var onSelect = function (e) {
            var expandedItem = this.dataItem(e.node);
            clearDocumentDetail();

            if (expandedItem.NodeType == 1) {
                loadNodeInformation("LoadProductDetail", { productId: expandedItem.ProductId }, true);
            } else if (expandedItem.NodeType == 2) {
                loadNodeInformation("LoadProductLanguageDetail", { productId: expandedItem.ProductId, languageId: expandedItem.LanguageId, includeDeletedDocument: expandedItem.IncludeDeletedDocument }, true);
            } else if (expandedItem.NodeType == 3) {
                loadNodeInformation("LoadDocumentOnlyDetail", { documentId: expandedItem.DocumentId, revisionId: expandedItem.RevisionId });
            } else if (expandedItem.NodeType > 3) {
                loadDocumentDetail(expandedItem.DocumentId, expandedItem.RevisionId);
            }
            return this;
        };

        var doDocumentSearch = function () {
            $("#DocumentDetail").show();
            //Hide the side menu
            $('#eeeSideBar').hide();
            toggleTreeViewPanel(true);
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
                LatestRevisionOnly: $("#chkLatestRevision:checked").length == 1,
                IncludeDeletedDocument: $("#chkIncludeDeletedDocument:checked").length == 1
            };
            var treeview = $(productTreeName).data("kendoTreeView");
            //var url = '@Url.Action("ProductSearchResultRoute", "Document", new
            //{
            //    searchText = "parameter"
            //})';
            //url = url.replace("parameter", JSON.stringify(queryText));
            var url = "ProductSearchResultRoute";
            var param = { searchText: JSON.stringify(queryText) };
            treeview.dataSource.transport.options.read.url = url;
            treeview.dataSource.transport.options.read.data = param;
            treeview.dataSource.read();

            clearDocumentDetail();
        };

        var reloadSelectedTreeNode = function () {
            var treeView = $(productTreeName).data("kendoTreeView");
            var selectedNode = treeView.select(); //Reselect current node    
        };

        var loadDocumentDetail = function (documentId, revisionId) {
            loadNodeInformation("LoadDocumentDetail", { documentId: documentId, revisionId: revisionId });
        };

        var loadNodeInformation = function (url, options, loadingIndicator) {
            if (loadingIndicator)
                kendo.ui.progress($('#panelDocDetailInner'), true);

            $.post(url, options, function (data) {
                if (loadingIndicator)
                    kendo.ui.progress($('#panelDocDetailInner'), false);

                $('#panelDocDetailInner').html(data);
            });
        };

        var loadNewRevision = function () {
            $("#IsNewRevision").val(true);
            $("#txtManufacturerId").val('');
            $("#txtSupplierId").val('');
            $("#RevisionDate").val('');
            $("#ConfirmationDate").val('');
            $("#RevisionTitle").val('');
            $("#DocumentIdentification").val('');
            $("#DocumentVersion").val('');
            $("#VersionStatusDate").val('');
            $("#IndexationStatusDate").val('');
            $("#tabRevisionNameNumber").hide();
            $("#tabRevisionFileInfo").hide();
            $("#divCancelRevision").show();

            $("#divExistRevision").addClass("new-document-revision");

            var ddlistLanguage = $("#DocumentLanguageId").data("kendoDropDownList");
            var ddlistDocumentType = $("#DocumentTypeId").data("kendoDropDownList");
            var ddlistContainer = $("#ContainerTypeId").data("kendoDropDownList");
            //ddlistLanguage.readonly();
            ddlistLanguage.enable(false);
            ddlistDocumentType.enable(false);
            ddlistContainer.enable(false);

            $("#divCancelRevision").click(function (e) {
                loadDocumentDetail($("#DocumentId").val(), $("#RevisionId").val());
            });

            //             var url = '@Url.Action("NewRevisionContent", "Document")';
            //                $.post(url, function(data) {
            //                    $("#divExistRevision").hide();
            //                    $("#divNewRevision").show();
            //                    $('#divNewRevision').html(data);
            //                });
        };


        var deleteDocument = function () {
            var strconfirm = confirm("Are you sure you want delete this document?");
            if (strconfirm == false) {
                return false;
            }

            var treeView = $(productTreeName).data("kendoTreeView");
            var selectedNode = treeView.dataItem(treeView.select().parent());
            $.ajax({

                //url: '@Url.Action("ObsoleteDocument", "Document")',
                url: "ObsoleteDocument",
                type: 'POST',
                cache: false,
                data: { documentId: selectedNode.DocumentId },
                success: function (data) {
                    if (data.Status == 0) {
                        $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data.DisplayMessage);
                        $('#eeeSideBar').hide();

                        if ($("#chkIncludeDeletedDocument:checked").length == 0) {
                            clearDocumentDetail();
                            var productObj = $("#tvProductSearchResult_tv_active").parent().parent().parent().parent().parent().parent();
                            var numOfLanguages = $("#tvProductSearchResult_tv_active").parent().parent().parent().parent().parent().parent().find('.CompliNodeTypeLanguage').length
                            if (numOfLanguages == 1) //a product has one language
                            {
                                if ($("#tvProductSearchResult_tv_active").parent().parent().siblings().length == 0) {
                                    //remove a language and controls under it
                                    $("#tvProductSearchResult_tv_active").parent().parent().parent().parent().html("");
                                } else //remove a document
                                {
                                    $("#tvProductSearchResult_tv_active").parent().parent().html("");

                                }

                                //remove product when no document under it
                                if ($('.CompliNodeTypeRevision', productObj).length == 0) {
                                    productObj.html("");
                                }
                            } else //a product has multiple languages
                            {
                                //a language has one document
                                if ($("#tvProductSearchResult_tv_active").parent().parent().siblings().length == 0) {
                                    //remove a language and controls under it
                                    $("#tvProductSearchResult_tv_active").parent().parent().parent().parent().html("");
                                } else //a language has multiple documents
                                {
                                    $("#tvProductSearchResult_tv_active").parent().parent().html("");
                                }
                            }
                        }
                        else {
                            $('#btnDocumentSave').parent().prepend('<span style="color: red; font-size: 20px;">Deleted document</span>');
                        }
                    }
                },
                error: function (xhr, textStatus, error) {
                    //alert(xhr.statusText);
                    //alert(textStatus);
                    alert(error);
                }
            });
            //Not working for on-demand fetch
            //var docNode = selectedNode.parent();
            //treeview.remove(selectedNode.parent());
            return true;
        };

        var saveDocumentDetail = function () {
            var form = $("#documentRevisionTab").updateValidation();
            if (form.valid()) {
                var url = form.attr("action");
                var formData = form.serialize();
                $.post(url, formData, function (data) {
                    //                $('.form-reset').click();
                    //                $('#CreatedMessage').html(data);
                    //if (data.TitleChanged === true) {
                    //}

                    if (data.NewDocument) {
                        $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data.DisplayMessage);
                        loadDocumentDetail(data.DocumentId, data.RevisionId);
                        alert("This is a reminder, please attach all necessary file to this newly created document, otherwise it will ge treated as incomplete.");
                        return;
                    }

                    // After the post is completed update document information in the markup
                    var docNode = $("#Document-" + data.DocumentId);
                    docNode.html(data.Title);
                    docNode.attr('Title', data.HoverTitle);
                    docNode.prev().attr('class', data.SpriteCssClass);

                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data.DisplayMessage);

                    if (data.NewRevision == true) {
                        loadDocumentDetail(data.DocumentId, data.RevisionId);
                        docNode.hasChildren = true;
                    }

                    var kendoTreeView = $('#tvProductSearchResult').data("kendoTreeView");
                    var tvDataItem = kendoTreeView.dataItem(kendoTreeView.select());
                    selectedNode = (tvDataItem.length > 0) ? null : tvDataItem.id;
                    repopulateTreeBranch(form, docNode);
                });
            }
        };


        var loadIndexation = function () {
            var documentId = $("#DocumentId").val();
            var revisionId = $("#RevisionId").val();
            var currenturl = window.location.href;
            var indexArea = currenturl.substring(0, currenturl.indexOf('Document'));
            var url = indexArea + "Indexation/Indexation?documentId=" + documentId + "&revisionId=" + revisionId;
            window.open(url, "_blank");
        };


        var loadSingleDocument = function () {
            //Temp test id
            var documentId = 52;
            var revisionId = 1056274;
            var currenturl = window.location.href;
            var indexArea = currenturl.substring(0, currenturl.indexOf('Document'));
            var url = indexArea + "Document/LoadSingleDocument?documentId=" + documentId + "&revisionId=" + revisionId;
            window.open(url, "_blank");
        };

        var panelbarActivated = function () {
            $("#loadSingleDocBtn").click(function (e) {
                loadSingleDocument();
            });

            $("#searchDocumentBtn").click(function (e) {
                doDocumentSearch();
            });

            $("#addNewDocumentBtn").click(function (e) {
                $("#tvProductSearchResult").data("kendoTreeView").dataSource.data([]);
                loadDocumentDetail(0, 0);
                $("#DocumentDetail").show();

                //This sequence is very important
                var splitter = $("#splitterResultAndDetail").data("kendoSplitter");
                splitter.collapse("#panelTreeView");

                //setTimeout(function () {
                //    $("#tabRevisionNameNumber").hide();
                //    $("#tabRevisionFileInfo").hide();
                //}, 500);

            });


            $("#clearDocumentBtn").click(function (e) {
                //                var ddlDocumentType = $("#ddlDocumentType").data("kendoDropDownList");
                //                ddlDocumentType.select(0);
                //                var ddlDocumentLanguage = $("#ddlDocumentLanguage").data("kendoDropDownList");
                //                ddlDocumentLanguage.select(0);
                //                var ddlDocumentRegion = $("#ddlDocumentRegion").data("kendoDropDownList");
                //                ddlDocumentRegion.select(0);


                $("[name^='ddlDocument']").each(function (index) {
                    var ddl = $(this).data("kendoDropDownList");
                    ddl.select(0);
                });

                $('#txtSearchDocumentId').val("");
                $('#txtSearchPartNumber').val("");
                $('#txtSearchSupplierId').val("");
                $('#txtSearchUPC').val("");
                $('#txtRevisionTitle').val("");

                $("#tvProductSearchResult").data("kendoTreeView").dataSource.data([]);

                //JQuery 1.6 above
                var defaultSearchOption = 0;
                $("input[name=radiogroupTitleSearchOption][value=" + defaultSearchOption + "]").prop('checked', true);
                clearDocumentDetail();
                $("#DocumentDetail").hide();
                $('#eeeSideBar').hide();
            });


            $('#txtSearchDocumentId').keyup(function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code == 13) { //Search only on enter
                    doDocumentSearch();
                    //GridResultTest();
                    return false;
                }
                return true;
            });


            $('#txtSearchSupplierId').keyup(function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code == 13) { //Search only on enter
                    //var url = '@Url.Action("LookUpSupplierOnKeyEnter", "Company")';
                    var url = "../Company/LookUpSupplierOnKeyEnter";
                    var supplierInfo = $("#txtSearchSupplierId").val();
                    $.post(url, { supplierInfo: supplierInfo }, function (data) {
                        $('#txtSearchSupplierId').val(data);
                    });
                }
            });


            $("#DetailSupplier").on("click", "#AddSupplierFacility", function (e) {
                //var url = '@Url.Action("GetSupplierFacilityDetail", "Company")';
                var url = "../Company/GetSupplierFacilityDetail";
                var supplierId = $("#SupplierId").val();
                $.post(url, { SupplierId: supplierId, SupplierFacilityId: '0' },
                    function (data) {
                        $('#SupplierFacilitiesDetail').html(data);
                    });
            });


            //Initialize the dialog but not show
            //supplierSearchDialog.data("kendoWindow").open();		    
            supplierSearchDialog.data("kendoWindow").close();

            //No Access here for add new supplier
            $("#addNewSupplierBtn").addClass("k-state-disabled");
            $("#addNewSupplierBtn").unbind('click');

            $("#clearSupplierBtn").click(function (e) {
                //Remove search result
                var grid = $("#gdSearchSupplier").data("kendoGrid");
                //grid.dataSource.filter({});
                grid.dataSource.data([]);
                $('#' + activeSupplier).val("");
                $('#txtSupplierSearch').val("");
                return false;
            });

            //$("#searchSupplierBtn").bind('click', function () {
            //    KendoPopUpAjust(supplierSearchDialog);
            //});


            $("#searchSupplierIdBtn").click(function (e) {
                //showSupplierPlugIn("txtSearchSupplierId");
                doclib.showSupplierPlugIn("txtSearchSupplierId");
            });



            $("#btnCancelSupplierSearch").click(function (e) {
                hideSupplierPlugIn();
            });

            function selectSupplier() {
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

                hideSupplierPlugIn();
            }

            $("#searchSupplierIdSelect").click(function (e) {
                selectSupplier();
            });

            $("#gdSearchSupplier").dblclick(function (e) {
                selectSupplier();
            });

            $('div.k-widget').dblclick(function (e) {
                selectSupplier();
            });

            //End initializee supplier serach dialog		    
            //Add more action triggered by panel activation

            $('#txtRevisionTitle').keyup(function (event) {
                var key = event.keyCode || event.which;
                if (key == 13) {
                    doDocumentSearch();
                }
                return false;
            });
        };

        var readonlyPanelbarActivated = function () { };

        //Foreign script from suppplier not being in this module
        var gdSearchSupplierChange = function (e) {
            var selectedData = this.dataItem(this.select());
            var supplierId = selectedData.CompanyId;
        };

        var documentQuery = function (e) {
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
                LatestRevisionOnly: $("#chkLatestRevision:checked").length == 1,
                IncludeDeletedDocument: $("#chkIncludeDeletedDocument:checked").length == 1
            };
            return {
                searchText: JSON.stringify(queryText)
            };
        };

        // Method resize splitters when all content is loaded into the selected tab
        var onTabContentLoad = function (e) {
            setTimeout(function () {
                $(e.contentElement).find('.k-splitter').each(function () {
                    $(this).data("kendoSplitter").trigger("resize");
                });
            }, 200);
        };


        var onDocumentNoteEdit = function (e) {
            // Convert the value in the last update field to something more readable
            var elem = $(e.container).find('#LastUpdate');
            if (elem) {
                var datetext = elem.val();
                if (datetext != '') {
                    var updatedate = new Date(datetext);
                    elem.val(getCustomDateFormat(updatedate));
                }
            }

            $(e.container).find('#Notes')
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

        var onGdDocumentNoteDataBound = function (e) {
            var selecteddocumentnotesid = $('#gdDocumentNotes').attr("selecteddocumentnotesid");
            $('tr', '#gdDocumentNotes').each(function (e) {
                var documentnotesid = $("td[style='display:none']", $(this)).text();
                if (documentnotesid == selecteddocumentnotesid) {
                    $(this).addClass("k-state-selected");
                }
            });

        };

        var onGridEditChangeTitle = function (e) {
            var update = $(e.container).parent().find(".k-grid-update");
            var cancel = $(e.container).parent().find(".k-cancel");
            $(update).attr('title', 'Save');
            $(cancel).attr('title', 'Cancel');
        };

        var onSaveNameNumber = function (e) {
            var editClass = "tr.k-grid-edit-row.k-state-selected";
            var dataItem = e.sender.tbody.find(editClass);
            dataItem.closest("tr").removeClass("k-state-selected").addClass("k-active");

            //not sure we should implement the following logic, need confirm with mw
            //var currentNameOrNumber = e.model.NameOrNumber;
            //var data = this.dataSource.data();
            //$.each(data, function (i, row) {
            //    if (i != 0 && currentNameOrNumber == row.NameOrNumber) {
            //        alert("Duplicates not allowed");
            //        e.preventDefault();
            //        return false;
            //    }
            //    return true;
            //});
        };

        var onRequestEnd = function (e) {
            if (e.type == undefined || e.type != "read") {
                setTimeout(function () {
                    var ts = $("#tabRevisionNameNumber").data('kendoTabStrip');
                    var items = ts.items();
                    if (items != null && items.length > 0)
                        ts.reload(items[0]);
                }, 200);
            }
        };
        //Expose to public

        return {
            loadSupplierPlugIn: loadSupplierPlugIn,
            showSupplierPlugIn: showSupplierPlugIn,
            hideSupplierPlugIn: hideSupplierPlugIn,
            onExpand: onExpand,
            onDataBound: onDataBound,
            onSelect: onSelect,
            expandNodeData: expandNodeData,
            selectType: getSelectType,
            clearDocumentDetail: clearDocumentDetail,
            doDocumentSearch: doDocumentSearch,
            reloadSelectedTreeNode: reloadSelectedTreeNode,
            loadDocumentDetail: loadDocumentDetail,
            loadNewRevision: loadNewRevision,
            deleteDocument: deleteDocument,
            saveDocumentDetail: saveDocumentDetail,
            loadIndexation: loadIndexation,
            panelbarActivated: panelbarActivated,
            readonlyPanelbarActivated: readonlyPanelbarActivated,
            gdSearchSupplierChange: gdSearchSupplierChange,
            documentQuery: documentQuery,
            onDocumentNoteEdit: onDocumentNoteEdit,
            onGdDocumentNoteDataBound: onGdDocumentNoteDataBound,
            onTabContentLoad: onTabContentLoad,
            onGridEditChangeTitle: onGridEditChangeTitle,
            onSaveNameNumber: onSaveNameNumber,
            onRequestEnd: onRequestEnd,
        };
    };

    //Initialize
    $(function () {
        $("#DocumentDetail").hide();
        $("#eeeSideBar").sidemenu();
        menuHelper.turnMenuActive($("#menuOperations"));
    });

})(jQuery);


