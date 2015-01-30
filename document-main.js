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
        var texts = [];
        var productTreeName = "#tvProductSearchResult";
        var activeNode = "#tvProductSearchResult_tv_active";

        // support mutltiple elements
        if (this.length > 1) {
            this.each(function () { $(this).complibDocument(); });
            return this;
        }

        // ************************************** Local Methods **************************************************
        function DisplayModal(objModal) {
            $('#' + objModal).find('.modal-body').html();
            $('#' + objModal).modal({
                backdrop: true,
                keyboard: true
            }).css(
            {
                'margin-left': function () {
                    return -($(this).width() / 2);
                }
            });
        }

        function getUrl(area, controllerAndFunc) {
            var currenturl = window.location.href;
            var indexArea = currenturl.substring(0, currenturl.indexOf(area));
            var url = indexArea + controllerAndFunc;
            return url;
        }

        var error_handler = function () {
            onDisplayError("Duplicate Names are not allowed");
            var grid = $("#DocumentDetail #gdRevisionNameNumber").data("kendoGrid");
            grid.dataSource.read();
        }

        var isInEditingMode = function () {
            var docId = $("input#DocumentID.doc-ref-id").val();
            var pid = $("#ParentDocumentId").val();
            if (docId != undefined && docId && docId != "0" && pid == undefined) {
                return true;
            }
            return false;
        };

        var onDisplayError = function (errorMessage) {
            var message = errorMessage;
            $('#errorReport').find('.modal-body').html(message);
            $("#errorReport").modal({
                backdrop: true,
                keyboard: true
            }).css({
                width: 'auto',
                'margin-left': function () {
                    return -($(this).width() / 2); //auto size depending on the message
                }
            });
        }

        var onJustifySpliter = function (spliter) {
            $(window).resize(function () {
                kendo.resize(spliter);
            });
        };

        var onPopuClose = function (e) {
            $("#divDocumentIdentification").show();
        };

        var onTabContentLoad = function (e) {
            var containerTypeId = $("#ContainerTypeId").val();
            if (containerTypeId == "2") {
                setTimeout(setLblRevisionFileInfoDetaillib("Cover Sheet"), 100);

                $("#btnDissembleKit").show();

                $(document).off('click', "#btnDissembleKit");
                $(document).on('click', "#btnDissembleKit", function (e) {
                    DisplayConfirmationModal({ message: 'Are you sure you want to disassemble this kit?', header: 'Confirm for disassembling kits' }, function () {
                        disembleKitOrGroup(2);
                    });
                });

            } else if (containerTypeId == "3") {
                setTimeout(setLblRevisionFileInfoDetaillib("Attachments"), 100);

                $("#btnDissembleKit").show();

                $(document).off('click', "#btnDissembleKit");
                $(document).on('click', "#btnDissembleKit", function (e) {
                    if (confirm("Are you sure to destroy or dissemble this group?")) {
                        disembleKitOrGroup(3);
                    }
                });

            } else {
                $("#btnDissembleKit").hide();
            }

            //for existing doc/rev, show the attachment grid and label
            if ($("input#DocumentID.doc-ref-id").val() != "0") {
                $("#lblRevisionFileInfoDetail").show();
                $("#tabRevisionFileInfo").show();
            }

            onSplitterContentLoad(e);
        };

        // ************************************** Document Methods **************************************************
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
                ContainerTypeId: $("#ddlDocumentContainer").val(),
                PartNumber: $("#txtSearchPartNumber").val(),
                UPC: $("#txtSearchUPC").val(),
                SupplierId: parseInt($("#txtSearchSupplierId").val()),
                RevisionTitle: $("#txtRevisionTitle").val(),
                SearchOption: $("input[name=radiogroupTitleSearchOption]:checked").val(),
                LatestRevisionOnly: $("#chkLatestRevision:checked").length == 1,
                IncludeDeletedDocument: $("#chkIncludeDeletedDocument:checked").length == 1,
                PhysicalStateId: $("#ddlDocumentPhysicalState").val(),
                DocumentStatusId: $("#ddlDocumentStatus").val()
            };

            var treeview = $(productTreeName).data("kendoTreeView");

            var url = "ProductSearchResultRoute";
            var param = { searchText: JSON.stringify(queryText) };
            treeview.dataSource.transport.options.read.url = url;
            treeview.dataSource.transport.options.read.data = param;
            treeview.dataSource.read();

            clearDocumentDetail();
        };

        var hideSupplierPlugIn = function () {
            supplierSearchDialog.data("kendoWindow").close();
        };

        var loadIndexation = function () {
            var documentId = $("#DocumentId").val();
            var revisionId = $("#RevisionId").val();
            var currenturl = window.location.href;
            var indexArea = currenturl.substring(0, currenturl.indexOf('Document'));

            var url = indexArea + "Indexation/SelectIndexingType?documentId=" + documentId + "&revisionId=" + revisionId;
            window.open(url, "_blank");
        };

        // FOR TESTING PURPOSES ONLY
        var loadSingleDocument = function () {
            //Temp test id
            var documentId = 52;
            var revisionId = 1056274;
            var currenturl = window.location.href;
            var indexArea = currenturl.substring(0, currenturl.indexOf('Document'));
            var url = indexArea + "Document/LoadSingleDocument?documentId=" + documentId + "&revisionId=" + revisionId;
            window.open(url, "_blank");
        };

        var loadSupplierPlugIn = function () {

            var url = "PlugInSupplierSearch";
            $.post(url, { supplierId: 0 }, function (data) {
                $("#dgSupplierPlugIn").html(data);
            });

            supplierSearchDialog = $("#supplierSearchWindow");
        };

        var panelbarActivated = function () {
            $("#loadSingleDocBtn").click(function (e) {
                loadSingleDocument();
            });

            $("#searchDocumentBtn").click(function (e) {
                doDocumentSearch();
            });

            $("#addNewDocumentBtn").click(function (e) {
                //at certain time, tv has not been created so we need to guard this cond
                var tv = $("#tvProductSearchResult").data("kendoTreeView");
                if (tv != null)
                    tv.dataSource.data([]);

                loadDocumentDetail(0, 0);
                $("#DocumentDetail").show();

                //This sequence is very important
                var splitter = $("#splitterResultAndDetail").data("kendoSplitter");
                splitter.collapse("#panelTreeView");
            });

            $("#clearDocumentBtn").click(function (e) {
                $("[name^='ddlDocument']").each(function (index) {
                    var ddl = $(this).data("kendoDropDownList");
                    if (ddl != undefined) {
                        ddl.select(0);
                    }
                });

                $('#txtSearchDocumentId').val("");
                $('#txtSearchPartNumber').val("");
                $('#txtSearchSupplierId').val("");
                $('#txtSearchUPC').val("");
                $('#txtRevisionTitle').val("");
                $('#chkLatestRevision').prop('checked', true);
                $('#chkIncludeDeletedDocument').prop('checked', false);
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
                    return false;
                }
                return true;
            });

            $('#txtSearchSupplierId').keyup(function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code == 13) { //Search only on enter
                    if (IsNumeric($("#txtSearchSupplierId").val())) {
                        var url = "../Company/LookUpSupplierOnKeyEnter";
                        var supplierInfo = $("#txtSearchSupplierId").val();
                        $.post(url, { supplierInfo: supplierInfo }, function (data) {
                            $('#txtSearchSupplierId').val(data);
                        });
                    }
                }
            });

            $("#DetailSupplier").on("click", "#AddSupplierFacility", function (e) {
                var url = "../Company/GetSupplierFacilityDetail";
                var supplierId = $("#SupplierId").val();
                $.post(url, { SupplierId: supplierId, SupplierFacilityId: '0' },
                    function (data) {
                        $('#SupplierFacilitiesDetail').html(data);
                    });
            });

            //Initialize the dialog but not show
            supplierSearchDialog.data("kendoWindow").close();

            //No Access here for add new supplier
            $("#addNewSupplierBtn").addClass("k-state-disabled");
            $("#addNewSupplierBtn").unbind('click');

            $("#clearSupplierBtn").click(function (e) {
                //Remove search result
                var grid = $("#gdSearchSupplier").data("kendoGrid");
                grid.dataSource.data([]);
                $('#' + activeSupplier).val("");
                $('#txtSupplierSearch').val("");
                return false;
            });

            $("#searchSupplierIdBtn").click(function (e) {
                doclib.showSupplierPlugIn("txtSearchSupplierId");
            });

            $("#btnCancelSupplierSearch").click(function (e) {
                hideSupplierPlugIn();
            });

            $("#searchSupplierIdSelect").click(function (e) {
                selectSupplier();
            });

            $("#gdSearchSupplier").dblclick(function (e) {
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

        var selectSupplier = function () {
            var grid = $("#gdSearchSupplier").data("kendoGrid");
            if (grid.dataSource.total() == 0) {
                hideSupplierPlugIn();
                onDisplayError("No row selected");
                return;
            }
            var data = grid.dataItem(grid.select());
            if (data == null) {
                hideSupplierPlugIn();
                onDisplayError("No row selected");
                return;
            }
            $("#" + activeSupplier).val(data.id + ", " + data.Name);
            hideSupplierPlugIn();
        };

        var showSupplierPlugIn = function (currentSupplier) {
            activeSupplier = currentSupplier;
            supplierSearchDialog.data("kendoWindow").center();
            supplierSearchDialog.data("kendoWindow").open();
        };

        var viewSingleSupplier = function (supplierId) {
            if (supplierId > 0) {
                var url = getUrl("Operations", "Operations/Company/LoadSingleSupplier?supplierId=" + supplierId);
                window.open(url, "_blank");
            }
        };

        // ************************************** Document Tree View Methods **************************************************
        function expandActiveDeeper() {
            setTimeout(function () {
                var treeview = $(productTreeName).data("kendoTreeView");
                var children = $(activeNode).find(".k-item");
                if (children.length > 0)
                    treeview.expand(children);
                else
                    expandActiveDeeper();
            }, 200);
        }

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

        function initiateRevisionContextMenu() {
            $("#documentTreeContextMenu").kendoMenuEx({
                dataSource: [
                    {
                        text: "Indexing",
                        click: function (event, obj) {
                            var treeView = $("#tvProductSearchResult").data("kendoTreeView");
                            var target = this.target;
                            var li = $(target).closest(".k-item")[0];
                            var documentId = treeView.dataSource.getByUid(li.getAttribute('data-uid')).DocumentId;
                            var revisionId = treeView.dataSource.getByUid(li.getAttribute('data-uid')).RevisionId;

                            var currenturl = window.location.href;
                            var indexArea = currenturl.substring(0, currenturl.indexOf('Document'));
                            var url = indexArea + "Indexation/SelectIndexingType?documentId=" + documentId + "&revisionId=" + revisionId;
                            window.open(url, "_blank");
                            return false;
                        },
                        spriteCssClass: "k-icon k-i-pencil"
                    },
                    {
                        text: 'Ext Indexing',
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

        function openPath(treeview, path) { 
            if (path.length) {
                
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
            
            if (expand == true) {
                splitter.expand("#panelTreeView");
            } else {
                splitter.toggle("#panelTreeView");
            }
        }

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

        var expandNodeData = function (e) {
            var selectTypeValue = getSelectType();
            return {
                selectType: JSON.stringify(selectTypeValue)
            };
        };

        var getSelectType = function () {
            return selectType;
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

        var onDataBound = function () {

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

        var onExpand = function (e, expandedItem) {

            var passingId = 0;
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

        var reloadSelectedTreeNode = function () {
            var treeView = $(productTreeName).data("kendoTreeView");
            var selectedNode = treeView.select(); //Reselect current node    
        };

        // ************************************** Document Identification Methods **************************************************
        function documentStatusCheck() {

            var form = $("#documentRevisionTab").updateValidation();
            var formData = form.serialize();

            // First check if a status change needs to display a notes popup
            var url = "../Document/GetStatusAction";
            $.post(url, formData, function (data) {

                if (data.displayMessage) {

                    if (data.statusError == true)
                        onDisplayError(data.displayMessage);
                    else {
                        if (notesModalSettings) {
                            notesModalSettings.displayStatusNoteConfirmation(data, function (eval) {

                                // Attach notes field information into form to be serialized
                                $("#documentRevisionTab").find('#hdnStatusNotes').val(eval.modalNotes);
                                saveDocumentInformationInDatabase();
                            });
                        }
                    }
                } else
                    saveDocumentInformationInDatabase();
            });
        }

        function getContainerTypeId() {
            var containerOption = $("#ContainerTypeId").val();
            if (containerOption == "2")
                return 2;
            else if (containerOption == "3")
                return 3;
            return containerOption;
        }

        function saveDocumentInformationInDatabase() {

            var form = $("#documentRevisionTab");
            var url = form.attr("action");
            var formData = form.serialize();
            var containerTypeId = getContainerTypeId();
            $.post(url, formData, function (data) {
                if (data.DisplayMessage != "Error") {
                    //special handling for group's element addition
                    if ($("#DocumentCreationIntention").val() == "31") { //wip
                        var parentDocumentId = $("#ParentDocumentId").val();
                        insertKitAndGroup(parentDocumentId, 3, data.DocumentId);
                        var parentRevisionId = $("#ParentRevisionId").val();
                        loadDocumentDetail(parentDocumentId, parentRevisionId);
                        return;
                    }

                    //the following line is faulty, but leave it as is since there would be some repurcussion if changed
                    if (data.NewDocument) {
                        if (containerTypeId == 2 || containerTypeId == 3) {
                            var vKitGroupContainerId = $("#KitGroupContainerId").val();
                            if (vKitGroupContainerId == undefined) {
                                if ($("input#DocumentID.doc-ref-id").val() == "0")
                                    vKitGroupContainerId = 0;
                            }
                            $("#ParentDocumentId").val(data.DocumentId);

                            if (containerTypeId == 2 || (containerTypeId == 3 && isInEditingMode()))
                                dispatch("gdAssocatedDocuments", containerTypeId, data.DocumentId, vKitGroupContainerId);
                        }

                        $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data.DisplayMessage);
                        loadDocumentDetail(data.DocumentId, data.RevisionId);

                        return;
                    }
                } else {
                    onDisplayError("No attachment has been provided, unable to save.");
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
                if (typeof (tvDataItem) != "undefined") {
                    selectedNode = (tvDataItem.length > 0) ? null : tvDataItem.id;
                    repopulateTreeBranch(form, docNode);
                }

                // Attempt to reload the status history grid
                var kgrid = $('#gdSupplierStatusHistory').data('kendoGrid');
                if (kgrid) {
                    kgrid.dataSource.read();
                    $('#StatusNotesText').html('');
                }

                $('#hdnStatusNotes').val('');

                if (documentStatusLayoutFunc) {
                    var currentStatusId = '0';
                    var statusDdl = $('#DocumentStatusId').data('kendoDropDownList');
                    if (statusDdl) currentStatusId = statusDdl.value();
                    documentStatusLayoutFunc(JSON.stringify(data.DocumentId), currentStatusId);
                }
            });
        };

        function setLblRevisionFileInfoDetail(text) {
            text = (typeof text !== 'undefined') ? text : "Attachment";
            $("#lblRevisionFileInfoDetail").html(text);
            $("#lblRevisionFileInfoDetail").show();
            $("#addNewFilesBtn").html("Add " + text);
        }

        function setLblRevisionFileInfoDetaillib(text) {
            text = (typeof text !== 'undefined') ? text : "Attachment";
            $("#lblRevisionFileInfoDetail").html(text);
            $("#addNewFilesBtn").html("Add " + text);
        };

        var checkAttachmentsBeforeSave = function () {
            var containerOption = $("#ContainerTypeId").val();

            //Always warn if there is no attachment for SINGLE
            if (containerOption == "1") {
                var currenRevId = $("#RevisionID").val();
                var currenDocId = $("#DocumentID").val();
                if (currenDocId == 0) { //New document must have an attachment, check single upload first
                    if ($("#txtFileName").val() == '') {
                        onDisplayError("No attachment has been provided, unable to save.");
                        return false;
                    }
                } else {  //Existing document
                    if ($("#IsNewRevision").val() == "True") { //Existing document but new revision, check the single attachment
                        if ($("#txtFileName").val() == '') {
                            onDisplayError("No attachment has been provided, unable to save.");
                            return false;
                        }
                        return true;
                    }

                    //Normal case
                    var multiAttachment = $("#gdRevisionFileInfoDetail_" + currenRevId).data("kendoGrid").dataSource.data().length;
                    if (multiAttachment == 0) {
                        //Existing document, but give a reminder
                        onDisplayError("This is reminder:  No attachment has been provided for this document");
                        return true;
                    }
                }
            }

            if (containerOption == "2") {
                //if this is a new kit we will do the checking
                if (!isInEditingMode()) {
                    var componentsCount = $("#gdAssocatedDocuments").data("kendoGrid").dataSource.data().length;
                    if (componentsCount <= 1) {
                        DisplayConfirmationModal({ message: 'The kit has ' + componentsCount + ' component attached. Do you want to attach the components now?', header: 'Confirm attach components' }, function () {
                            launchKGPopup(containerOption);
                        });
                        return false;
                    };
                }
            }
            return true;
        };

        var clearDocumentDetail = function () {
            $('#panelDocDetailInner').html("");
            $('#panelDocDetailInner').removeClass("new-document-revision");
        };

        var currentRevisionId = function () {
            var currenRevId = $("#RevisionID").val();
            return {
                RevisionId: currenRevId
            };
        };

        var customDeleteAttachment = function (infoId) {
            var message = "Are you sure you want to delete this file?";
            var cResult = confirm(message);
            if (!cResult)
                return;

            var multiAttachment = $("#gdRevisionFileInfoDetail_" + $("#RevisionID").val()).data("kendoGrid").dataSource.data().length;
            if (multiAttachment == 1) {
                onDisplayError("Reminder:  the deleted item was the last attachment for this document.");
            }
            var url = getUrl("Operations", "Operations/Document/CustomDocumentFileDelete");
            $.post(url, { infoId: infoId }, function (data) {
                var currenRevId = $("#RevisionID").val();
                var grid = $("#gdRevisionFileInfoDetail_" + currenRevId).data("kendoGrid");
                grid.dataSource.read();
                grid.dataSource.page(1);
            });
        };

        var deleteDocument = function () {
            var strconfirm = confirm("Are you sure you want delete this document?");
            if (strconfirm == false) {
                return false;
            }

            var treeView = $(productTreeName).data("kendoTreeView");
            var selectedNode = treeView.dataItem(treeView.select().parent());
            $.ajax({

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
                    onDisplayError(error);
                }
            });

            return true;
        };

        var loadDocumentDetail = function (documentId, revisionId) {
            loadNodeInformation("LoadDocumentDetail", { documentId: documentId, revisionId: revisionId }, true);
        };

        var loadNewRevision = function () {
            $("#IsNewRevision").val("True");
            $("#RevisionDate").val('');
            $("#ConfirmationDate").val('');
            $("#tabRevisionNameNumber").hide();
            $("#tabRevisionFileInfo").hide();
            $("#divCancelRevision").show();

            $("#divExistRevision").addClass("new-document-revision");

            var objDisableArray = [];
            objDisableArray.push($("#ContainerTypeId").data("kendoDropDownList"));
            objDisableArray.push($("#DocumentLanguageId").data("kendoDropDownList"));
            objDisableArray.push($("#DocumentTypeId").data("kendoDropDownList"));
            for (var i = 0 ; i < objDisableArray.length; i++) {
                objDisableArray[i].readonly();
                objDisableArray[i]._inputWrapper.css({
                    "background-color": "#eeeeee",
                    "cursor": "not-allowed"
                });
            }


            $("#dvAddNewAttachment").show();
            $("#lblRevisionFileInfoDetail").hide();
            $("#divCancelRevision").click(function (e) {
                loadDocumentDetail($("#DocumentId").val(), $("#RevisionId").val());
            });
        };

        var onContainerTypeIdChange = function (e) {

            var containerTypeId = $("#ContainerTypeId").val();
            var previousContainerTypeId = $("#previousContainerTypeId").val();
            var documentCount = $("#gdAssocatedDocuments").data("kendoGrid").dataSource.data().length;

            // Is there a container type change which involves information already added by the user?
            if (documentCount > 0) {

                if (containerTypeId != previousContainerTypeId) {

                    var containerTypeText = $(e.target).data('kendoDropDownList').value() ? $(e.target).data('kendoDropDownList').text().toLowerCase() : 'unknown';
                    var settings = {
                        message: 'Are you sure to switch the current document to ' + containerTypeText + '? If you proceed, then the previously added documents will be discarded',
                        header: 'Confirm Container Type Change'
                    };

                    DisplayConfirmationModal(settings,
                        function () {
                            setContainerTypeLayout(containerTypeId, true);
                        },
                        function () {
                            $(e.target).data('kendoDropDownList').select(parseInt(previousContainerTypeId || '1'));
                        });
                }

            } else
                setContainerTypeLayout(containerTypeId, true);
        };

        var onGridEditChangeTitle = function (e) {
            var update = $(e.container).parent().find(".k-grid-update");
            var cancel = $(e.container).parent().find(".k-cancel");
            $(update).attr('title', 'Save');
            $(cancel).attr('title', 'Cancel');
        };

        var onIUserInfo = function (e) {
            $("a[id$='I-Info']").popover();
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

        var onSaveNameNumber = function (e) {
            var editClass = "tr.k-grid-edit-row.k-state-selected";
            var dataItem = e.sender.tbody.find(editClass);
            dataItem.closest("tr").removeClass("k-state-selected").addClass("k-active");
        };

        var saveDocumentDetail = function () {
            var form = $("#documentRevisionTab").updateValidation();
            var validForm = form.valid();

            if (validForm) {
                if (!checkAttachmentsBeforeSave()) //check all the attachment if form is valid before preceed
                    return;

                setTimeout(function () {

                    // Check if the error report popup is displayed and wait for the user to click ok to continue
                    var errorReportPopup = $('#errorReport');
                    if (errorReportPopup.length > 0 && errorReportPopup.is(':visible')) {
                        errorReportPopup.on('click', '.btn', function errorReportButtonClick(e) {
                            errorReportPopup.off('click', '.btn', errorReportButtonClick);
                            errorReportPopup.modal('hide');
                            documentStatusCheck();
                        });
                    } else {
                        documentStatusCheck();
                    }

                }, 500);

            } else {
                onDisplayError('Saving the document could not be completed. Please review your changes and try again.');
            }
        };

        var setUnknownManufacturer = function (sender) {
            sender.click(function (e) {
                $.ajax({
                    url: "LoadUnknownManufacturer",
                    type: 'POST',
                    cache: false,
                    //data: { id:80000 },
                    success: function (data) {
                        if (data != '') {
                            $("#txtManufacturerId").val(data);
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        onDisplayError(error);
                    }
                });

                return true;
            });
        };

        var showMultipleNames = function () {
            $('#DocumentDetail #txtNamesNumbers').val("");
            var selAliaseType = $("#DocumentDetail #selNameType").data("kendoDropDownList");
            selAliaseType.select(0);
            DisplayModal("mdlMultipleNames");
        }

        var viewAndUpdateAttachments = function () {
            var containerOption = $("#ContainerTypeId").val();

            var validContainers = ["2", "4"];
            if (validContainers.indexOf(containerOption) > -1)
                launchKGPopup(containerOption);
        };

        $("#DocumentDetail").on("keyup", '#txtNamesNumbers', function (e) {
            if (e.keyCode == 13 || (e.ctrlKey && e.keyCode == 86)) {
                e.preventDefault();
                var arr = $('#DocumentDetail #txtNamesNumbers').val().split("\n");
                var arrDistinct = new Array();
                $(arr).each(function (index, item) {
                    if (item.length > 0) {
                        if ($.inArray(item, arrDistinct) == -1)
                            arrDistinct.push(item);
                    }

                });
                $('#DocumentDetail #txtNamesNumbers').val("");
                $(arrDistinct).each(function (index, item) {
                    $('#DocumentDetail #txtNamesNumbers').val($('#DocumentDetail #txtNamesNumbers').val() + item + "\n");
                });
            }
        });

        $("#DocumentDetail").on("click", '#btnSaveMultipleNames', function (e) {
            var selAliaseType = $("#DocumentDetail #selNameType").data("kendoDropDownList");
            if (selAliaseType.value() == "" || $('#DocumentDetail #txtNamesNumbers').val() == "") {
                $('#mdlMultipleNames').modal("toggle");
                onDisplayError('Alias Type and Aliases are required.');
                return;
            }
            texts = [];
            var lines = $('#DocumentDetail #txtNamesNumbers').val().split(/\n/);
            for (var i = 0; i < lines.length; i++) {
                // only push this line if it contains a non whitespace character.
                if (lines[i].length > 0)
                    texts.push($.trim(lines[i]));
            }

            var data = {};
            data['documentId'] = $("#DocumentId").val();
            data['revisionId'] = $("#RevisionId").val();
            data['aliasTypeId'] = selAliaseType.value();
            data['aliasesText'] = texts;
            e.preventDefault();
            $.ajax({
                url: "../Document/NamesNumbers_Multiple_Create",
                data: JSON.stringify(data),
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                error: function () {
                    onDisplayError('Aliases could not be saved.');
                },
                success: function (successData) {
                    if (successData.success == true) {
                        $('#mdlMultipleNames').modal("toggle");
                        var grid = $("#DocumentDetail #gdRevisionNameNumber").data("kendoGrid");
                        grid.dataSource.read();
                        //should refressh grid
                    } else
                        onDisplayError("Error Occurred");
                },
                complete: function (compData) {
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Items Saved Successful");
                }
            });
        });

        // ************************************** Document Kits Groups Methods **************************************************
        var dlgDocumentSearch = $("#documentSearchWindow_kg");
        var listOfChildDocumentId = JSON.parse("[" + (($("#ListOfChildDocumentId").val() == undefined) ? "" : $("#ListOfChildDocumentId").val()) + "]");
        var prevRadioButtonState = [0, 0, 0, 0];

        function addToChildGrid(childGridId, selectedDataItem) {
            var child = $("#" + childGridId).data("kendoGrid");
            if (child == null)
                return;

            if (hasGridContain(child, selectedDataItem))
                return;

            child.dataSource.add({
                ReferenceId: selectedDataItem.ReferenceId,
                DocumentId: selectedDataItem.ReferenceId,
                RevisionTitle: selectedDataItem.RevisionTitle,
                SupplierName: selectedDataItem.SupplierName,
                ManufacturerName: selectedDataItem.SupplierName,
                LanguageDescription: selectedDataItem.LanguageDescription,
                DocumentTypeDescription: selectedDataItem.DocumentTypeDescription,
                RegionDescription: selectedDataItem.RegionDescription,
                RevisionDate: selectedDataItem.RevisionDate,
                ConfirmationDate: selectedDataItem.RevisionDate,
                RevisionId: selectedDataItem.RevisionId
            });
        }

        function addToGridHelper(grid, gridDs, itm) {
            if (!hasGridContain2(grid, itm.ReferenceId))
                gridDs.add({
                    ReferenceId: itm.ReferenceId,
                    DocumentId: itm.ReferenceId,
                    RevisionId: itm.RevisionId,
                    RevisionTitle: itm.RevisionTitle,
                    SupplierName: itm.SupplierName,
                    ManufacturerName: itm.SupplierName,
                    LanguageDescription: itm.LanguageDescription,
                    DocumentTypeDescription: itm.DocumentTypeDescription,
                    RegionDescription: itm.RegionDescription,
                    RevisionDate: itm.RevisionDate,
                    ConfirmationDate: itm.ConfirmationDate
                });    
        }

        function CheckRemoveComponentsFromKits(e) {
            //if this is an existing kit, we prevent deleting the last two records
            var containerTypeId = $("#ContainerTypeId").val();
            if (shouldPostToServer() && containerTypeId == "2") {
                var gridid = e.delegateTarget.id;
                var grid = $("#" + gridid).data("kendoGrid");
                var dataSource = grid.dataSource;
                if (dataSource.data().length <= 2) {
                    return false;
                }
            }
            return true;
        }

        function clearData() {
            getHandle('#txtSearchDocumentId').val("");
            getHandle('#txtSearchPartNumber').val("");
            getHandle('#txtSearchSupplierId').val("");
            getHandle('#txtSearchUPC').val("");
            getHandle('#txtRevisionTitle').val("");

            resetDropDown('#ddlDocumentLanguage');
            resetDropDown("#ddlDocumentRegion");
            resetDropDown("#ddlDocumentType");
            resetDropDown('#ddlDocumentPhysicalState');

            //Remove document search grid result
            var grid = getHandle("#gdSearchDocument").data("kendoGrid");
            if (grid.dataSource.total() != 0) {
                grid.dataSource.filter([]);
                grid.dataSource.data([]);
            }

            //JQuery 1.6 above
            var defaultSearchOption = 0;
            $("input[name=radiogroupTitleSearchOption][value=" + defaultSearchOption + "]").prop('checked', true);
        };

        function clearOutContentAndHide() {
            $("#divAssocatedDocuments").hide();
            var grid = $("#gdAssocatedDocuments").data("kendoGrid");

            grid.dataSource.filter({});
            grid.dataSource.data([]);

            grid = $("#" + $("#whichGridToAdd").val()).data("kendoGrid");
            if (grid && grid.dataSource)
                grid.dataSource.data([]);

            setViewUpdateAttachmentText();
        }

        function disembleKitOrGroup(vContainerTypeId) {
            var url = getUrl("Operations", "Operations/Document/DocumentKitAndGroup_Update");
            $.post(url, {
                parentDocumentId: $("input#DocumentID.doc-ref-id").val(),
                containerTypeId: vContainerTypeId,
                childDocumentIdSet: JSON.stringify([]),
                kitGroupContainerId: -1
            }, function (data) {
                //Confirmation message for kit disassembled
                doDocumentSearch();
            });
        }

        function dispatch(id, containerTypeId, parentDocumentId, vKitGroupContainerId) { //id is grid id

            var dataSource = $("#" + id).data("kendoGrid").dataSource;
            var filters = dataSource.filter();
            var allData = dataSource.data();
            var query = new kendo.data.Query(allData);
            var filteredData = query.filter(filters).data;

            var childDocumentIdSet = [];
            $.each(filteredData, function (index, item) {
                if ($.inArray(item.ReferenceId, childDocumentIdSet) == -1) {
                    childDocumentIdSet.push(item.ReferenceId);
                }
            });

            updateKitAndGroup(parentDocumentId, containerTypeId, childDocumentIdSet, vKitGroupContainerId);
        }

        function dispatch2(id, containerTypeId) {
            if (containerTypeId == 0)
                return;

            var dataSource = $("#" + id).data("kendoGrid").dataSource;
            var filters = dataSource.filter();
            var allData = dataSource.data();
            var query = new kendo.data.Query(allData);
            var filteredData = query.filter(filters).data;

            //var url = '@Url.Action("DocumentKitAndGroup_Update", "Document", new { Area = "Operations" })';
            var url = getUrl("Operations", "Operations/Document/DocumentKitAndGroup_Update");

            var childDocumentIdSet = [];
            $.each(filteredData, function (index, item) {
                childDocumentIdSet.push(item.ReferenceId);
            });

            //prevent from deleting the last two components from an existing kit
            if (shouldPostToServer() && containerTypeId == 2 && childDocumentIdSet.length <= 1) {
                var prompt = confirm("Error: the last two component of an existing kit can't be deleted");
                return;
            }

            var vKitGroupContainerId = $("#KitGroupContainerId").val();
            if (vKitGroupContainerId == undefined)
                vKitGroupContainerId = 0;

            var parentDocumentId = $("#ParentDocumentId").val();
            if (parentDocumentId == undefined)
                parentDocumentId = 0;

            updateKitAndGroup(parentDocumentId, containerTypeId, childDocumentIdSet, vKitGroupContainerId);
        }

        function doBothChildren() {
            setKGTopLabel("Kit Compoent and Group Element");
            $("#divBody").show();

            $('input[name=kgClassifierKitParent]').prop('checked', false);
            $('input[name=kgClassifierGroupParent]').prop('checked', false);
            $('input[name=kgClassifierKitChildren]').prop('checked', true);
            $('input[name=kgClassifierGroupChildren]').prop('checked', true);

            $('#lblParent').html("Parents");
            $('#divParent').show();

            $('#lblKitSibling').html("Kit Sibling");
            $("#divKitSibling").show();

            $("#lblGroupSibling").html("Group Sibling");
            $("#divGroupSibling").show();

            $("#divGroupParent").hide();
            setPrevRadioButtonState(1, 3);
        }

        function doGroupChildren() {
            setKGTopLabel("Group Element");
            $("#divBody").show();

            $('input[name=kgClassifierKitParent]').prop('checked', false);
            $('input[name=kgClassifierGroupParent]').prop('checked', false);

            $('#divParent').hide();

            $("#divKitSibling").hide();

            $("#divGroupParent").show();

            $("#divGroupSibling").show();
            $('#lblGroupSibling').html("Other Sibling");

            setPrevRadioButtonState(3);
        }

        function doGroupParent() {
            setKGTopLabel("Group");
            $("#divBody").show();

            $('input[name=kgClassifierKitParent]').prop('checked', false);
            $('input[name=kgClassifierKitChildren]').prop('checked', false);
            $('input[name=kgClassifierGroupChildren]').prop('checked', false);

            $('#divParent').hide();

            $("#divGroupParent").hide();

            $("#divKitSibling").hide();

            $('#lblGroupSibling').html("Elements");
            $("#divGroupSibling").show();

            setPrevRadioButtonState(2);
        }

        function doKitChildren() {
            setKGTopLabel("Kit Component");
            $("#divBody").show();

            $('input[name=kgClassifierKitParent]').prop('checked', false);
            $('input[name=kgClassifierGroupParent]').prop('checked', false);

            $("#divGroupParent").hide();

            $('#lblParent').html("Parent");
            $('#divParent').show();

            $('#lblKitSibling').html("Sibling");
            $("#divKitSibling").show();

            $("#divGroupSibling").hide();
            setPrevRadioButtonState(1);
        }

        function doKitParent() {
            setKGTopLabel("Kit");
            $("#divBody").show();

            $('input[name=kgClassifierKitChildren]').prop('checked', false);
            $('input[name=kgClassifierGroupParent]').prop('checked', false);
            $('input[name=kgClassifierGroupChildren]').prop('checked', false);

            $('#divParent').hide();

            $("#divGroupParent").hide();

            $('#lblKitSibling').html("Components");
            $("#divKitSibling").show();

            $("#divGroupSibling").hide();
            setPrevRadioButtonState(0);
        }

        function extractValue(entry) {
            try {
                return JSON.stringify(entry.innerText).replace(/"/g, "");
            } catch (err) {
                return "";
            }
        };

        function getDocumentQueryParam(docId, childDocumentIds) {
            var queryText = {
                ReferenceId: docId,
                DocumentTypeId: "",
                DocumentLanguageId: getHandle($("#ddlDocumentLanguage")).val(),
                DocumentRegionId: "",
                PartNumber: "",
                UPC: "",
                SupplierId: null,
                RevisionTitle: "",
                SearchOption: "0",
                LatestRevisionOnly: false,
                childDocumentIds: childDocumentIds
            };
            return JSON.stringify(queryText);
        }

        function hasGridContain(grid, newEl) {
            if (grid == undefined || grid.dataSource == undefined)
                return false;

            var result = false;
            $.each(grid.dataSource.data(), function (index, item) {
                if (item.ReferenceId != undefined && item.ReferenceId == newEl.ReferenceId) {
                    result = true;
                }
            });
            return result;
        }

        function hasGridContain2(grid, refid) {
            if (grid == undefined || grid.dataSource == undefined)
                return false;

            var result = false;
            $.each(grid.dataSource.data(), function (index, item) {
                if (item.ReferenceId != undefined && item.ReferenceId == refid) {
                    result = true;
                }
            });
            return result;
        }

        function hidePopups() {
            getHandle("#documentModalPopup").hide();
        }

        function inferContainerTypeId(gridid) {
            if (gridid.indexOf("Kit") > 0)
                return 2;
            else if (gridid.indexOf("Group") > 0)
                return 3;
            return 1;
        }

        function insertKitAndGroup(parentDocumentId, containerTypeId, childDocumentIdSet) {
            var url = getUrl("Document", "Document/DocumentKitAndGroup_Insert");
            $.post(url, {
                parentDocumentId: parentDocumentId,
                containerTypeId: containerTypeId,
                childDocumentIdSet: JSON.stringify(childDocumentIdSet),
            });
        }

        function isTheOnlyOneChecked(id) {
            var chkRslt = true;
            $.each(prevRadioButtonState, function (i) {
                if (i == id && prevRadioButtonState[id] != 1) {
                    chkRslt = false;
                }
                if (i != id && prevRadioButtonState[i] == 1) {
                    chkRslt = false;
                }
            });
            return chkRslt;
        }

        function loadExistingChildren(gridid) {
            var grid = $("#" +gridid).data("kendoGrid");
            var gridDs = grid.dataSource;
            
            if ($("#gdAssocatedDocuments").data("kendoGrid") != undefined && $("#gdAssocatedDocuments").data("kendoGrid").dataSource.data().length > 0) {
                gridDs.data([]);
                $.each($("#gdAssocatedDocuments").data("kendoGrid").dataSource.data(), function (idx, itm) {
                    addToGridHelper(grid, gridDs, itm);
                });
                return 0;
            }

            var cids = ($("#ListOfChildDocumentId").val() == undefined) ? "": $("#ListOfChildDocumentId").val();
            if (cids.length < 0) return 0;

            var url = getUrl("Operations", "Operations/Document/GetDocumentResultForKitAndGroupEx");
            var docId = $("input#DocumentID.doc-ref-id").val();
            var vSearchText = getDocumentQueryParam(docId);
            $.post(url, { searchText: vSearchText, listOfChildDocumentId: JSON.stringify(cids) }, function (selectedDataList) {
                $.each(selectedDataList, function (idx, selectedDataItem){
                    addToGridHelper(grid, gridDs, selectedDataItem);
                });
            });

            return 1;
        }

        function resetDropDown(did) {
            if (getHandle(did).data("kendoDropDownList") != null) {
                getHandle(did).data("kendoDropDownList").select(0);
            } else {
                getHandle(did).val("");
            }
        }

        function resetPrevRadioButtonState() {
            prevRadioButtonState = [0, 0, 0, 0];
        }

        function setContainerTypeLayout(containerTypeId, setPreviousContainerValue) {

            // Start off by making the tab a blank slate
            clearOutContentAndHide();
            setLblRevisionFileInfoDetail();
            $("#dvDocSource, #dvImageQuality, #dvVersionNUmber, #gdAssocatedDocuments, #kgAttachment, #lblRevisionFileInfoDetail, #tabRevisionFileInfo").hide();
            $("#whichGridToAdd").val("");

            // Add information based on the container type provided
            switch (containerTypeId) {

                // KIT
                case '2':
                    $("#whichGridToAdd").val("gdKitSibling");
                    $("#dvDocSource, #kgAttachment").show();
                    setViewUpdateAttachmentText();
                    break;

                    // GROUP
                case '3':
                    $("#whichGridToAdd").val("gdGroupSibling");
                    $('#dvVersionNUmber').show();
                    break;

                    // TOPIC
                case '4':
                    $('#kgAttachment').show();
                    setViewUpdateAttachmentText();
                    break;

                    // SINGLE
                default:
                    $("#lblRevisionFileInfoDetail").hide();
                    $('#dvDocSource, #dvImageQuality, #dvVersionNUmber').show();
                    break;
            }

            if (setPreviousContainerValue == true)
                $("#previousContainerTypeId").val(containerTypeId);
        };

        function setKGTopLabel(keyWord)
        {
            $("#pTopLabel").html("This is a <strong>" +keyWord + "</strong>.");
        }

        function setPrevRadioButtonState(id1, id2) {
            prevRadioButtonState = [0, 0, 0, 0];
            prevRadioButtonState[id1] = 1;

            if(id2)
                prevRadioButtonState[id2] = 1;
        }

        function setupOneDropDown(url, ddlid) {
            getHandle("#" + ddlid).kendoDropDownList({
                dataSource: {
                    transport: {
                        read: {
                            dataType: "json",
                            url: url,
                        }
                    }
                },
                dataTextField: "Text",
                dataValueField: "Value",
                optionLabel: {
                    Text: "Select One",
                    Value: ""
                }
            });
        }

        function setViewUpdateAttachmentText() {

            var containerTypeText = $('#ContainerTypeId').val() ? $('#ContainerTypeId').data('kendoDropDownList').text() : '';
            if (containerTypeText) {
                containerTypeText = containerTypeText.toLowerCase();
                containerTypeText = containerTypeText.charAt(0).toUpperCase() + containerTypeText.slice(1) + ' Components';
            } else {
                containerTypeText = 'Attachments';
            }

            $("#btnViewAndUpdateAttachments").html('<span class="k-icon k-add"></span>' + containerTypeText + ' (' + getAttachmentCounted($("#whichGridToAdd").val()) + ')');
        }

        function uncheckAndHideAll() {
            $("#pTopLabel").html("");
            $("#divBody").hide();

            $('input[name=kgClassifierKitParent]').prop('checked', false);
            $('input[name=kgClassifierGroupParent]').prop('checked', false);
            $('input[name=kgClassifierKitChildren]').prop('checked', false);
            $('input[name=kgClassifierGroupChildren]').prop('checked', false);
            resetPrevRadioButtonState();
        }

        function updateKitAndGroup(parentDocumentId, containerTypeId, childDocumentIdSet, vKitGroupContainerId) {
            var url = getUrl("Document", "Document/DocumentKitAndGroup_Update");
            $.post(url, {
                parentDocumentId: parentDocumentId,
                containerTypeId: containerTypeId,
                childDocumentIdSet: JSON.stringify(childDocumentIdSet),
                kitGroupContainerId: vKitGroupContainerId
            });
        }

        var collectDataToDelete = function () {
            console.log("hitting collectDataToDelete");
        };

        var documentQuery_kg = function (e) {
            var queryText = {
                ReferenceId: getHandle("#txtSearchDocumentId").val(),
                DocumentTypeId: getHandle("#ddlDocumentType").val(),
                DocumentLanguageId: getHandle("#ddlDocumentLanguage").val(),
                DocumentRegionId: getHandle("#ddlDocumentRegion").val(),
                ContainerTypeId: 1,
                PartNumber: getHandle("#txtSearchPartNumber").val(),
                UPC: getHandle("#txtSearchUPC").val(),
                SupplierId: parseInt(getHandle("#txtSearchSupplierId").val()),
                RevisionTitle: getHandle("#txtRevisionTitle").val(),
                SearchOption: getHandle("input[name=radiogroupTitleSearchOption]:checked").val(),
                LatestRevisionOnly: getHandle("#chkLatestRevision:checked").length == 1,
                PhysicalStateId: getHandle("#ddlDocumentPhysicalState").val()
            };
            return {
                searchText: JSON.stringify(queryText)
            };
        };

        var fillUpKGContent = function() {
            var sbv = $("#KitGroupClassificationSetBitValue").val();
            var tid = $("#ContainerTypeId").val();

            if (sbv == "1") {
                $("#divBody").show();
                doKitParent();
                $("#whichGridToAdd").val("gdKitSibling");
                loadExistingChildren("gdKitSibling");
            } else if (sbv == "2") {
                $("#divBody").show();
                doKitChildren();
            } else if (sbv == "4" || tid == 3) {
                $("#divBody").show();
                doGroupParent();
                $("#whichGridToAdd").val("gdGroupSibling");
                loadExistingChildren("gdGroupSibling");
            } else if (sbv == "8") {
                doGroupChildren();
                $("#divBody").show();
            } else if (sbv == "10") {
                $("#divBody").show();
                doBothChildren();
            } else {
                $("#divBody").hide();
            }
        };

        var getAttachmentCounted = function (gridid) {
            if (typeof gridid == 'undefined') return 0;

            var grid = $("#" + gridid).data("kendoGrid");
            return grid ? grid.dataSource.data().length : 0;
        };

        var getHandle = function (id) {
            return $("#documentSearchWindow_kg").find(id);
        };

        var handleAddDocument = function () {
            var parent = getHandle("#gdSearchDocument").data("kendoGrid");
            if (parent == null)
                return;

            var selectedRows = parent.select();
            selectedRows.each(function (index, row) {
                var selectedDataItem;
                try {
                    selectedDataItem = parent.dataItem(row);
                } catch (err) {
                    selectedDataItem = {
                    ReferenceId: "",
                    DocumentId: "",
                    RevisionTitle: "",
                    SupplierName: "",
                    ManufacturerName: "",
                    LanguageDescription: "",
                    DocumentTypeDescription: "",
                    RegionDescription: "",
                    RevisionDate: "",
                    ConfirmationDate: "" };

                    $.each(selectedRows[index].childNodes, function(idx, entry) {
                        
                        if (idx == 1) {
                            selectedDataItem.ReferenceId = extractValue(entry);
                        } else if (idx == 3) {
                            selectedDataItem.RevisionTitle = extractValue(entry);
                        } else if (idx == 4) {
                            selectedDataItem.SupplierName = extractValue(entry);
                        } else if(idx == 5) {
                            selectedDataItem.LanguageDescription = extractValue(entry);
                        } else if(idx == 6) {
                            selectedDataItem.DocumentTypeDescription = extractValue(entry);
                        } else if(idx == 7) {
                            selectedDataItem.RegionDescription = extractValue(entry);
                        } else if (idx == 20) {
                            selectedDataItem.ConfirmationDate = extractValue(entry);
                            selectedDataItem.RevisionDate = extractValue(entry);
                        } else if (idx == 18) {
                            selectedDataItem.ReferenceId = extractValue(entry);
                        } else if (idx == 26) {
                            selectedDataItem.SupplierName = extractValue(entry);
                        }
                    });
                }

                if(selectedDataItem == null) {
                    onDisplayError("No row selected");
                    return;
                }
                
                addToChildGrid($("#whichGridToAdd").val(), selectedDataItem);
            });

            if (shouldPostToServer())
                dispatch2($("#whichGridToAdd").val(), inferContainerTypeId($("#whichGridToAdd").val()));

            var dlgDocumentSearch = $("#documentSearchWindow_kg");
            if (dlgDocumentSearch.data("kendoWindow") && dlgDocumentSearch.data("kendoWindow").dataSource) {
                dlgDocumentSearch.data("kendoWindow").dataSource.filter({ });
                dlgDocumentSearch.data("kendoWindow").dataSource.data([]);
            }

            dlgDocumentSearch.data("kendoWindow").close();
            setViewUpdateAttachmentText();
        };

        var initKitAndGroup = function () {
            var dlgDocumentSearch = $("#documentSearchWindow_kg");

            var url = getUrl("Operations", "Operations/Document/PlugInSupplierSearch");
            $.post(url, {
                supplierId: 0
            }, function (data) {
                $("#supplierSearchWindow #dgSupplierPlugIn").html(data);
            });

            url = getUrl("Operations", "Operations/Document/SearchDocumentContent");
            $.post(url, {
                supplierId: 0
            }, function (data) {
                $("#dgDocumentPlugIn").html(data);
            });


            $("#divParent").hide();
            $("#divKitSibling").hide();
            $("#divGroupSibling").hide();

            //TODO: bring back group and childrens
                //bring back the kit component
            if ($("#ParentDocumentId").val().length <= 0 || $("#ParentDocumentId").val() == "0") {
                var docId = $("input#DocumentID.doc-ref-id").val();
                if (docId != undefined && docId && docId.length > 0)
                    $("#ParentDocumentId").val(docId);
                
            }

            fillUpKGContent();

            if (!shouldPostToServer()) { //for a doc under creation
                //show the save and cancel buttons
                $("#divContainerControlPanel").show();
                $("#btnContainerSave").html("Keep");
                $("#btnContainerCancel").html("Discard");
                $("#btnContainerSave").attr("title", "Keep");

                $("#btnContainerSave").prepend($('<span></span>').addClass("k-icon k-i-pencil"));
                $("#btnContainerCancel").prepend($('<span></span>').addClass("k-icon k-i-cancel"));
            }

            //------------------------------start of secondary layer event handlers-----------------------------------
            $(document).on('click', "#documentSearchWindow_kg #clearDocumentBtn", function (e) {
                e.preventDefault();
                clearData();
            });

            $(document).on('click', "#documentSearchWindow_kg #searchDocumentBtn", function (e) {
                e.preventDefault();
                var grid = getHandle("#gdSearchDocument").data("kendoGrid");
                if (grid != null) {
                    grid.dataSource.page(1);
                    grid.dataSource.read();
                }
            });

            $(document).on('click', "#documentSearchWindow_kg #addNewDocumentBtn2", function (e) {
                var currenturl = window.location.href;
                var indexArea = currenturl.substring(0, currenturl.indexOf('Document/DocumentMain'));
                var url = indexArea + "/Document/LoadSingleDocument?documentId=0&revisionId=0";
                window.open(url, "_blank");
            });

            $(document).on('click', "#documentSearchWindow_kg #titleDropDown", function (e) {
                e.preventDefault();
                if (dsSearchOption == undefined || dsSearchOption == null) 
                    return;

                kendo.bind(getHandle("#searchTtileOptionDiv"), dsSearchOption);
                getHandle("#searchTtileOptionDiv").show();
            });

            $(document).on('click', "#documentSearchWindow_kg #searchSupplierIdBtn", function (e) {
                e.preventDefault();

                showSupplierPlugIn("documentSearchWindow_kg #txtSearchSupplierId");

                    //cope with the deficiency
                $(document).on('dblclick', 'table tr', "#gdSearchSupplier", selectSupplier);
            });

            getHandle("#searchDocumentIdSelect").click(function (e) {
                e.preventDefault();
                handleAddDocument();
            });

            getHandle("#btnCancelDocumentSearch").click(function (e) {
                e.preventDefault();
                dlgDocumentSearch.data("kendoWindow").close();
            });

            //intercepting value from supplier popup
            getHandle("#searchSupplierIdSelect").click(function (e) {
                e.preventDefault();

                var grid = $("#gdSearchSupplier").data("kendoGrid");
                if (grid.dataSource.total() == 0) return;

                var data = grid.dataItem(grid.select());
                if (data == null) {   
                    onDisplayError("No row selected");
                    return;
                }

                getHandle("#txtSearchSupplierId").val(data.id + ", " +data.Name);
            });

            getHandle("#btnCancelSupplierSearch").click(function (e) {
                e.preventDefault();
            });

            getHandle("#SearchResultGridDiv").on("click", function (e) {
                e.preventDefault();
            });

            getHandle("#SearchResultGridDiv").on('dblclick', 'table tr', function(e) {
                e.preventDefault();
                handleAddDocument();
            });

            $('#addDocToKitBtn').click(function (e) {
                e.preventDefault();
                $("#whichGridToAdd").val("gdKitSibling");
                getHandle("#documentModalPopup").show();
                setupDropDowns();
                    
                dlgDocumentSearch.data("kendoWindow").center();
                dlgDocumentSearch.data("kendoWindow").open();
            });

            $('#addDocToGroupBtn').click(function (e) {
                e.preventDefault();
                $("#whichGridToAdd").val("gdGroupSibling");

                getHandle("#documentModalPopup").show();
                setupDropDowns();
                
                dlgDocumentSearch.data("kendoWindow").center();
                dlgDocumentSearch.data("kendoWindow").open();
            });

            $('#btnContainerSave').click(function (e) {
                e.preventDefault();

                var ad = $("#gdAssocatedDocuments");

                //copy the cached document lists to divAssociatedDocuments
                var parent = ad.data("kendoGrid");
                if (parent == null)
                    return;

                var child = $("#" +$("#whichGridToAdd").val()).data("kendoGrid");
                if (child) {
                    var dataSource = child.dataSource;
                    var filters = dataSource.filter();
                    var allData = dataSource.data();
                    var query = new kendo.data.Query(allData);
                        var filteredData = query.filter(filters).data;

                    $.each(filteredData, function (index, selectedDataItem) {
                        parent.dataSource.add({
                            ReferenceId: selectedDataItem.ReferenceId,
                                DocumentId : selectedDataItem.ReferenceId,
                                RevisionTitle: selectedDataItem.RevisionTitle,
                                SupplierName: selectedDataItem.SupplierName,
                                ManufacturerName: selectedDataItem.SupplierName,
                                LanguageDescription: selectedDataItem.LanguageDescription,
                                DocumentTypeDescription: selectedDataItem.DocumentTypeDescription,
                                RegionDescription: selectedDataItem.RegionDescription,
                                RevisionDate: selectedDataItem.RevisionDate,
                                ConfirmationDate: selectedDataItem.RevisionDate
                            });
                    });
                    
                    dataSource.filter({ });
                    dataSource.data([]);
                }

                dlgDocumentSearch.data("kendoWindow").close();

                $("#kg_popup").data("kendoWindow").close();
            });

            $('#btnContainerCancel').click(function (e) {
                var grid = $("#" +$("#whichGridToAdd").val()).data("kendoGrid");
                var popup = $("#kg_popup").data("kendoWindow");
                if (grid && grid.dataSource && grid.dataSource.data().length > 0) {
                    if (confirm("You choose to discard the documents attached. However, the chosen container type requires attachments. Do you want to come back to revisit it later?")) {
                        dlgDocumentSearch.data("kendoWindow").close();
                        if(popup)
                            popup.close();
                        grid.dataSource.data([]);
                        setViewUpdateAttachmentText();
                    } else 
                        return;
                }

                dlgDocumentSearch.data("kendoWindow").close();
                if (popup) popup.close();

                grid.dataSource.data([]);
            });

            $('#gdKitSibling').dblclick(function (e) {
                e.preventDefault();

                if($("#canViewConstituentDocument").val() != "0") {
                    var grid = $("#gdKitSibling").data("kendoGrid");
                    var url = getUrl("Operations", "Operations/Document/LoadSingleDocument");
                    var data = grid.dataItem(grid.select());
                    if (data != undefined) {
                        url += "?documentId=" +data.ReferenceId + "&revisionId=" +data.RevisionId;
                        window.open(url, "_blank");
                    }
                }

                $("#canViewConstituentDocument").val("1");
            });
        };

        var launchKGPopup = function (containerTypeId) {
            var kitGroupClassificationSetBitValue = 0;
            var title = "Configuration";
            if (containerTypeId == "2") {
                kitGroupClassificationSetBitValue = 1;
                title = "Kit " + title;
            } else if(containerTypeId == "3") {
                kitGroupClassificationSetBitValue = 4;
                title = "Group " +title;
                } else if(containerTypeId == "4") {
                kitGroupClassificationSetBitValue = 16;
                title = "Topic " +title;
                }

            var d = $("<div id='kg_popup'></div>")
                .appendTo('body');
            var win = d.kendoWindow({
                            modal: true,
                            animation: false,
                            visible: false,
                            width: "1200px",
                            title: title,
                            actions: [ "Pin", "Minimize", "Maximize", "Close" ],
                            deactivate: function(evnt) { this.destroy();},
                            close: onPopuClose
                    }).data("kendoWindow");

            var url = getUrl("Operations", "Operations/Document/LoadDocumentKitsGroups");
            $.post(url,
                { documentId: 0, KitGroupClassificationSetBitValue: kitGroupClassificationSetBitValue },
                function(content) {
                    d.html(content);
                    $("#DocumentKitsAndGroupsSplitter", "#kg_popup").removeClass().addClass("new-document-revision");
                    win.center();
                    win.open();
            });
        };

        var onCustomCommand = function (e) {
            e.stopPropagation();
            $("#canViewConstituentDocument").val("0");

            if (!CheckRemoveComponentsFromKits(e)) {
                onDisplayError("Component can not be removed from this Kits because a kit must contain at lease two components.");
                return;
            }

            if (confirm("Are you sure you want to delete this record")) {
                var gridid = e.delegateTarget.id;
                var grid = $("#" + gridid).data("kendoGrid");
                var referenceId = this.dataItem(this.select())["ReferenceId"];
                var dataSource = grid.dataSource;
                var raw = dataSource.data();
                $.each(raw, function (index, elem) {
                    if (elem != undefined && elem.ReferenceId != null && elem.ReferenceId == referenceId) {
                        dataSource.remove(elem);
                    }
                });

                if (shouldPostToServer()) {
                    dispatch2(gridid, inferContainerTypeId(gridid));
                }
            }
        };

        var ongdWorkLoadItemChange = function (e) {
            e.preventDefault();
        };

        var setupDropDowns = function () {
            var url = getUrl("Operations", "Operations/Document/LoadDocumentLanguage");
            var ddlid = "ddlDocumentLanguage";
            setupOneDropDown(url, ddlid);

            url = getUrl("Operations", "Operations/Document/LoadDocumentType");
            ddlid = "ddlDocumentType";
            setupOneDropDown(url, ddlid);

            url = getUrl("Operations", "Operations/Document/LoadDocumentRegion");
            ddlid = "ddlDocumentRegion";
            setupOneDropDown(url, ddlid);

            url = getUrl("Operations", "Operations/Document/LoadPhysicalStateOptions");
            ddlid = "ddlDocumentPhysicalState";
            setupOneDropDown(url, ddlid);

            //mod the popup appearance
            $("#documentSearchWindow_kg #lblIncludeDeletedDocument").hide();
            $("#documentSearchWindow_kg #chkIncludeDeletedDocument").hide();
            $("#documentSearchWindow_kg #addNewDocumentBtn").hide();

            $('label[for="ContainerTypeId"]').css('visibility', 'hidden');
            $("#documentSearchWindow_kg #ddlDocumentContainer").hide();
        };

        var shouldPostToServer = function () {
            if ($("#ParentDocumentId").length == 0)
                return false;
            if ($("#ParentDocumentId").val() == 0)
                return false;

            return true;
        };

        $('#btnContainerSave').click(function (e) {
            var ad = $("#gdAssocatedDocuments");

            //copy the cached document lists to divAssociatedDocuments
            var parent = ad.data("kendoGrid");
            if (parent == null)
                return;

            var child = $("#" + $("#whichGridToAdd").val()).data("kendoGrid");
            
            if (child) {
                var dataSource = child.dataSource;
                var filters = dataSource.filter();
                var allData = dataSource.data();
                var query = new kendo.data.Query(allData);
                var filteredData = query.filter(filters).data;

                $.each(filteredData, function (index, selectedDataItem) {    
                    parent.dataSource.add({
                        ReferenceId: selectedDataItem.ReferenceId,
                        DocumentId: selectedDataItem.ReferenceId,
                        RevisionTitle: selectedDataItem.RevisionTitle,
                        SupplierName: selectedDataItem.SupplierName,
                        ManufacturerName: selectedDataItem.SupplierName,
                        LanguageDescription: selectedDataItem.LanguageDescription,
                        DocumentTypeDescription: selectedDataItem.DocumentTypeDescription,
                        RegionDescription: selectedDataItem.RegionDescription,
                        RevisionDate: selectedDataItem.RevisionDate,
                        ConfirmationDate: selectedDataItem.RevisionDate,
                    });
                });
                
                dataSource.filter({});
                dataSource.data([]);
            }

            dlgDocumentSearch.data("kendoWindow").close();

            $("#kg_popup").data("kendoWindow").close();
        });

        $('input[name=kgClassifierGroupChildren]').click(function (e) {
            var idx = 3;
            var selfPreImage = prevRadioButtonState[idx];
            if (selfPreImage == 1 && isTheOnlyOneChecked(idx)) {
                uncheckAndHideAll();
                return;
            }
            hidePopups();

            var otherPreImage = prevRadioButtonState[1];
            if (selfPreImage == 0) {
                if (otherPreImage == 1) {
                    doBothChildren();
                    return;
                } else {
                    doGroupChildren();
                    return;
                }
            } else {
                doKitChildren();
                $('input[name=kgClassifierGroupChildren]').prop('checked', false);
                return;
            }
        });

        $('input[name=kgClassifierGroupParent]').click(function (e) {
            var idx = 2;
            var selfPreImage = prevRadioButtonState[idx];
            if (selfPreImage == 1 && isTheOnlyOneChecked(idx)) {
                uncheckAndHideAll();
                return;
            }
            hidePopups();
            doGroupParent();
        });

        $('input[name=kgClassifierKitChildren]').click(function (e) {
            var idx = 1;
            var selfPreImage = prevRadioButtonState[idx];
            if (selfPreImage == 1 && isTheOnlyOneChecked(idx)) {
                uncheckAndHideAll();
                return;
            }
            hidePopups();

            var otherPreImage = prevRadioButtonState[3];
            if (selfPreImage == 0) {
                if (otherPreImage == 1) {
                    doBothChildren();
                    return;
                } else {
                    doKitChildren();
                    $('input[name=kgClassifierKitChildren]').prop('checked', true);
                    return;
                }
            } else {
                doGroupChildren();
                $('input[name=kgClassifierKitChildren]').prop('checked', false);
                return;
            }

        });

        $('input[name=kgClassifierKitParent]').click(function (e) {
            var idx = 0;
            var selfPreImage = prevRadioButtonState[idx];
            if (selfPreImage == 1 && isTheOnlyOneChecked(idx)) {
                uncheckAndHideAll();
                return;
            }
            hidePopups();
            doKitParent();
        });

        getHandle("#btnCancelDocumentSearch").click(function (e) {
            e.preventDefault();
            dlgDocumentSearch.data("kendoWindow").close();
        });

        getHandle("#SearchResultGridDiv").on("click", function (e) {
            e.preventDefault();
        });

        getHandle("#SearchResultGridDiv").on('dblclick', 'table tr', function (e) {
            e.preventDefault();
            e.preventBubble();
            
            handleAddDocument();
        });

        getHandle("#searchSupplierIdSelect").click(function (e) {
            e.preventDefault();

            var grid = $("#gdSearchSupplier").data("kendoGrid");
            if (grid.dataSource.total() == 0)
                return;

            var data = grid.dataItem(grid.select());
            if (data == null) {
                onDisplayError("No row selected");
                return;
            }

            getHandle("#txtSearchSupplierId").val(data.id + ", " + data.Name);
        });

        // ***************************************** Document Note Methods ******************************************************
        var onDocumentNoteEdit = function (e) {
            // Convert the value in the last update field to something more readable

            var update = $(e.container).parent().find(".k-grid-update");
            var cancel = $(e.container).parent().find(".k-grid-cancel");

            var title = $(e.container).parent().find(".k-window-title");
            if (e.model.DocumentNoteId > 0) {
                $(title).html('Edit');
                $(update).attr('title', 'Update');
                $(cancel).attr('title', 'Cancel');
            }
            else {
                $(title).html('Create');
                $(update).attr('title', 'Create');
                $(cancel).attr('title', 'Cancel');
            }

            var updateHtml = $(update).html();
            updateHtml = updateHtml.replace("Update", "Create");
            $(update).html(updateHtml);
            updateHtml = updateHtml.replace("Create", " ");
            $(update).html(updateHtml);
            var cancelHtml = $(cancel).html();
            cancelHtml = cancelHtml.replace("Cancel", " ");
            $(cancel).html(cancelHtml);


            $(update).on("click", function () {
                $("div.validation-summary-valid.validationSummary ul li").remove();

                if ($("#Notes").data("kendoEditor").value().length == 0)
                    $("div.validation-summary-valid.validationSummary ul").append("<li>Document - Notes is required</li>");
                else
                    $("div.validation-summary-valid.validationSummary ul li:contains('Document - Notes is required')").remove();


                if ($("#NoteTypeId").data("kendoDropDownList").value() == "")
                    $("div.validation-summary-valid.validationSummary ul").append("<li>Document - Type is required</li>");
                else
                    $("div.validation-summary-valid.validationSummary ul li:contains('Document - Type is required')").remove();

                $("div.validation-summary-valid.validationSummary ul").append("<li style='display:none'>");
            });

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


            $(".k-button.k-button-icontext.k-grid-cancel").click(function () {
                var grid = $("#gdDocumentNotes").data("kendoGrid");
                var selectedDataItem = grid.dataSource.getByUid(grid.select().data("uid"));
                grid.dataSource.read();
                if (selectedDataItem) {
                    var uid = grid.dataSource.get(selectedDataItem.id).uid;
                    grid.select('tr[data-uid="' + uid + '"]');
                }
            });

        };

        var onGdDocumentNoteDataBound = function (e) {
            var selecteddocumentnotesid = $('#gdDocumentNotes').attr("selecteddocumentnotesid");
            $('td', '#gdDocumentNotes').each(function (e) {
                var txt = $(this).html();
                var i = txt.indexOf("DocumentNoteId");
                if (i >= 0) {
                    var documentnotesid = txt.substr(16, txt.length);
                    if (documentnotesid == selecteddocumentnotesid) {
                        var parent = $(this).parent();
                        parent.addClass("k-state-selected");

                        $('td', parent).each(function (e) {
                            var note = $(this).html();
                            var ii = note.indexOf("Notes");
                            if (ii >= 0) {
                                var notesText = note.substr(7, note.length);
                                $('#DocumentNotesText').html(notesText);
                            }
                        }); //inner loop
                    }
                }

            }); //outer loop

        };

        // ************************************ Document Status History Methods *************************************************
        var notesModalSettings;
        var documentStatusLayoutFunc;

        var setDocumentStatusLayoutFunc = function(layoutFunc) {
            documentStatusLayoutFunc = layoutFunc;
        };

        var setNotesModalSettings = function(settings) {
            notesModalSettings = settings;
        };

        var clearSupplierStatusNote = function() {
            $('#StatusNotesText').html("");
        };

        var onStatusChange = function (e) {
            e.preventDefault();

            var selectedRow = this.select();
            var selectedData = this.dataItem(selectedRow);
            $('#StatusNotesText').html(selectedData.Notes);
        };

        // **************************************** Exposing Public Methods *****************************************************
        return {
            clearDocumentDetail: clearDocumentDetail,
            clearSupplierStatusNote: clearSupplierStatusNote,
            collectDataToDelete: collectDataToDelete,
            currentRevisionId: currentRevisionId,
            customDeleteAttachment: customDeleteAttachment,
            deleteDocument: deleteDocument,
            documentQuery_kg: documentQuery_kg,
            error_handler: error_handler,
            expandNodeData: expandNodeData,
            initKitAndGroup: initKitAndGroup,
            loadDocumentDetail: loadDocumentDetail,
            loadIndexation: loadIndexation,
            loadNewRevision: loadNewRevision,
            loadSupplierPlugIn: loadSupplierPlugIn,
            onContainerTypeIdChange: onContainerTypeIdChange,
            onCustomCommand: onCustomCommand,
            onDataBound: onDataBound,
            onDisplayError: onDisplayError,
            onDocumentNoteEdit: onDocumentNoteEdit,
            onExpand: onExpand,
            onGdDocumentNoteDataBound: onGdDocumentNoteDataBound,
            ongdWorkLoadItemChange: ongdWorkLoadItemChange,
            onGridEditChangeTitle: onGridEditChangeTitle,
            onIUserInfo: onIUserInfo,
            onJustifySpliter: onJustifySpliter,
            onRequestEnd: onRequestEnd,
            onSaveNameNumber: onSaveNameNumber,
            onSelect: onSelect,
            onStatusChange: onStatusChange,
            onTabContentLoad: onTabContentLoad,
            panelbarActivated: panelbarActivated,
            readonlyPanelbarActivated: readonlyPanelbarActivated,
            saveDocumentDetail: saveDocumentDetail,
            setDocumentStatusLayoutFunc: setDocumentStatusLayoutFunc,
            setNotesModalSettings: setNotesModalSettings,
            setUnknownManufacturer: setUnknownManufacturer,
            showMultipleNames: showMultipleNames,
            showSupplierPlugIn: showSupplierPlugIn,
            viewAndUpdateAttachments: viewAndUpdateAttachments,
            viewSingleSupplier: viewSingleSupplier,
        };
    };

    //Initialize
    $(function () {
        $("#DocumentDetail").hide();
        $("#eeeSideBar").sidemenu();
        menuHelper.turnMenuActive($("#menuOperations"));
    });

})(jQuery);