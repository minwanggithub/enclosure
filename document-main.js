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

        var documentElementSelectors = {
            inputs: {
                DocumentId: "#DocumentID"
            }, 
            buttons: {                
                DocumentAddSibling: "#btnSibling_"
            },            
            grids: {              
                DocumentSibling: "#gdDocumentSibling_"
            },
            dropdownlists: {
                DocumentContainerClassificationType: "#ContainerTypeId"
            }
        };

        var controllerCalls = {
            AddDocumentSibling: GetEnvironmentLocation() + "/Operations/Document/AddDocumentSibling",
            GetSiblingList: GetEnvironmentLocation() + "/Operations/Document/GetSiblingDocumentList",
            AddContainerComponents: GetEnvironmentLocation() + "/Operations/Document/SaveDocumentContainerComponent"
        }

        // support mutltiple elements
        if (this.length > 1) {
            this.each(function () { $(this).complibDocument(); });
            return this;
        }

        // ************************************** Local Methods **************************************************
        function DisplayError(message) {
            if (onDisplayError)
                onDisplayError(message);
            else
                alert(message);
        }
        
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
            DisplayError("Duplicate Names are not allowed");
            var grid = $("#DocumentDetail #gdRevisionNameNumber").data("kendoGrid");
            grid.dataSource.read();
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

        var isInEditingMode = function () {
            var docId = $("input#DocumentID.doc-ref-id").val();
            return ((docId || '0') != '0');
        };

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
            } else if (containerTypeId == "3") {
                setTimeout(setLblRevisionFileInfoDetaillib("Attachments"), 100);
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
                DisplayError("No row selected");
                return;
            }
            var data = grid.dataItem(grid.select());
            if (data == null) {
                hideSupplierPlugIn();
                DisplayError("No row selected");
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

        // ************************************** Document Identification Methods **************************************************
        function documentStatusCheck() {

            var form = $("#documentRevisionTab").updateValidation();
            var formData = form.serialize();

            // First check if a status change needs to display a notes popup
            var url = "../Document/GetStatusAction";
            $.post(url, formData, function (data) {

                if (data.displayMessage) {

                    if (data.statusError == true)
                        DisplayError(data.displayMessage);
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
            var returnValue = 0;
            var containerOption = $("#ContainerTypeId").val();
            if (containerOption) {
                returnValue = parseInt(containerOption);
                returnValue = isNaN(returnValue) ? 0 : returnValue;
            }

            return returnValue;
        }

        function getContainerTypeText() {
            var containerTypeDdl = $('#ContainerTypeId').data('kendoDropDownList');
            return containerTypeDdl && containerTypeDdl.value() ? containerTypeDdl.text().toLowerCase() : 'unknown';
        }

        function getDocumentTypeId() {
            var returnValue = 0;
            var documentTypeValue = $("#DocumentTypeId").val();
            if (documentTypeValue) {
                returnValue = parseInt(documentTypeValue);
                returnValue = isNaN(returnValue) ? 0: returnValue;
            }

            return returnValue;
        }

        function getDocumentTypeText() {
            var documentTypeDdl = $('#DocumentTypeId').data('kendoDropDownList');
            return documentTypeDdl && documentTypeDdl.value() ? documentTypeDdl.text().toLowerCase() : 'unknown';
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

                    if (data.DisplayMessage.indexOf("Error") >= 0) {
                        DisplayError(data.DisplayMessage);
                        return;
                    }

                    //the following line is faulty, but leave it as is since there would be some repurcussion if changed
                    if (data.NewDocument) {

                        if (containerTypeId != 1) {
                            var vKitGroupContainerId = $("#KitGroupContainerId").val();
                            if (vKitGroupContainerId == undefined) {
                                if ($("input#DocumentID.doc-ref-id").val() == "0")
                                    vKitGroupContainerId = 0;
                            }

                            $("#ParentDocumentId").val(data.DocumentId);
                            dispatch("gdAssocatedDocuments", containerTypeId, data.DocumentId, vKitGroupContainerId);
                        }

                        $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data.DisplayMessage);
                        loadDocumentDetail(data.DocumentId, data.RevisionId);
                        return;
                    }
                } else {
                    DisplayError("No attachment has been provided, unable to save.");
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


                try {
                    var kendoTreeView = $('#tvProductSearchResult').data("kendoTreeView");
                    var tvDataItem = kendoTreeView.dataItem(kendoTreeView.select());
                    if (typeof (tvDataItem) != "undefined") {
                        selectedNode = (tvDataItem.length > 0) ? null : tvDataItem.id;
                        repopulateTreeBranch(form, docNode);
                    }
                   } catch (ex) {
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

                // SINGLE
            if (containerOption == "1") {
                var currenRevId = $("#RevisionID").val();
                var currenDocId = $("#DocumentID").val();
                if (currenDocId == 0) { //New document must have an attachment, check single upload first
                    if ($("#txtFileName").val() == '') {
                        DisplayError("No attachment has been provided, unable to save.");
                        return false;
                    }
                } else {  //Existing document
                    if ($("#IsNewRevision").val() == "True") { //Existing document but new revision, check the single attachment
                        if ($("#txtFileName").val() == '') {
                            DisplayError("No attachment has been provided, unable to save.");
                            return false;
                        }
                        return true;
                    }

                    //Normal case
                    var multiAttachment = $("#gdRevisionFileInfoDetail_" + currenRevId).data("kendoGrid").dataSource.data().length;
                    if (multiAttachment == 0) {
                        //Existing document, but give a reminder
                        DisplayError("This is reminder:  No attachment has been provided for this document");
                        return true;
                    }
                }

                // KIT
            } else if (containerOption == "2") {
                if (!isInEditingMode()) {
                    var componentsCount = $("#gdAssocatedDocuments").data("kendoGrid").dataSource.data().length;
                    if (componentsCount <= 1) {
                        var settings = { message: 'The ' +getContainerTypeText() + ' has ' +componentsCount + ' component attached. Do you want to attach the components now?', header: 'Confirm attach components' };
                        DisplayConfirmationModal(settings, function () { launchKGPopup(containerOption); });
                            return false;
                        };
                }

                // TOPIC
            } else if (containerOption == '4') {
                // TODO: Might need to do something here
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

            var settings = {
                message: 'Are you sure you want to delete this file?',
                header: 'Delete Attachment Confirmation'
            };

            DisplayConfirmationModal(settings, function() {
                var multiAttachment = $("#gdRevisionFileInfoDetail_" +$("#RevisionID").val()).data("kendoGrid").dataSource.data().length;
                if (multiAttachment == 1) {
                    DisplayError("Reminder:  the deleted item was the last attachment for this document.");
                }

                var url = getUrl("Operations", "Operations/Document/CustomDocumentFileDelete");
                $.post(url, { infoId : infoId },
                    function (data) {
                        var currenRevId = $("#RevisionID").val();
                        var grid = $("#gdRevisionFileInfoDetail_" + currenRevId).data("kendoGrid");
                        if (grid.dataSource.view().length > 0) {
                            grid.dataSource.page(1);
                        }
                        grid.dataSource.read();                        
                });
            });
        };

        var displayOriginalAndPublishedAttachments = function (data) {

            // if the file extension is "pdf" always show the published version.
            // if the published version was not generated, show the original version.

            // file extension
            var fileExt = (data.OriginalFileName + "").split(".");
            fileExt = fileExt[fileExt.length - 1].toLowerCase();

            var html = "";

            if (fileExt == "pdf") {

                // link to PDF file
                var pdfFileELink = "onClickReviewViewImage(\"" + (data.PublishedDocumentElink || data.DocumentElink) + "\");";
                html = "<a title='Double click to view revision " + data.RevisionId + "' onclick='" + pdfFileELink + "'><span class='k-sprite doc-pdf' style='cursor:pointer;'></span></a>";

            } else {
                
                // original document
                var uploadedDocLink = "onClickReviewViewImage(\"" + data.DocumentElink + "\");";
                
                // sprite translation table 
                // supported types - TXT,DOC,DOCX,XLS,XLSX,TIF

                var xrefDocTypeToCss = new Array();

                xrefDocTypeToCss["doc"] = "doc-document";
                xrefDocTypeToCss["docx"] = "doc-document";
                xrefDocTypeToCss["xls"] = "doc-spreadsheet";
                xrefDocTypeToCss["xlsx"] = "doc-spreadsheet";
                xrefDocTypeToCss["tif"] = "doc-image";
                xrefDocTypeToCss["tiff"] = "doc-image";

                var uploadedDocSpriteCss = xrefDocTypeToCss[fileExt];

                // if found, we have a supported file type
                if (uploadedDocSpriteCss != null) {
                    
                    // link to PDF file
                    var originalFileELink = "onClickReviewViewImage(\"" + (data.DocumentElink) + "\");";
                    html = "<a title='Double click to view revision " + data.RevisionId + "' onclick='" + originalFileELink + "'><span class='k-sprite " +
                        uploadedDocSpriteCss + "' style='cursor:pointer;'></span></a>";

                    // if the PDF version has been published, show the links
                    if (data.PublishedDocumentElink != null) {

                        // link to published PDF file   
                        var publishedDocumentELink = "onClickReviewViewImage(\"" + data.PublishedDocumentElink + "\");";

                        // append link to published document
                        html += "<span style='padding-left:20px;'>&nbsp</span><a title='Double click to view revision " + data.RevisionId + "' onclick='"
                                + publishedDocumentELink + "'><span class='k-sprite doc-pdf' style='cursor:pointer;'></span></a>";

                    }

                }

            }

            return html;

        };

        var deleteDocument = function () {

            var settings = {
                message : 'Are you sure you want delete this document?',
                header: 'Confirm Document Deletion'
            };

            DisplayConfirmationModal(settings, function() {

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

                                    //a product has one language
                                    if (numOfLanguages == 1)
                                    {
                                        //remove a language and controls under it
                                        if ($("#tvProductSearchResult_tv_active").parent().parent().siblings().length == 0) 
                                            $("#tvProductSearchResult_tv_active").parent().parent().parent().parent().html("");
                                        else //remove a document
                                            $("#tvProductSearchResult_tv_active").parent().parent().html("");

                                        //remove product when no document under it
                                        if ($('.CompliNodeTypeRevision', productObj).length == 0)
                                            productObj.html("");

                                    } else 
                                    {
                                        //remove a language and controls under it
                                        if ($("#tvProductSearchResult_tv_active").parent().parent().siblings().length == 0)
                                            $("#tvProductSearchResult_tv_active").parent().parent().parent().parent().html("");
                                        else //a language has multiple documents
                                            $("#tvProductSearchResult_tv_active").parent().parent().html("");
                                    }
                                }
                                else
                                    $('#btnDocumentSave').parent().prepend('<span style="color: red; font-size: 20px;">Deleted document</span>');
                            }
                        },
                        error: function (xhr, textStatus, error) { DisplayError(error); }
                });

                return true;

            }, function() {
                return false;
            });
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

            var containerTypeId = getContainerTypeId();
            var previousContainerTypeId = $("#previousContainerTypeId").val();
            var documentCount = $("#gdAssocatedDocuments").data("kendoGrid").dataSource.data().length;

            // Is there a container type change which involves information already added by the user?
            if (documentCount > 0) {

                if (containerTypeId != previousContainerTypeId) {

                    var containerTypeText = getContainerTypeText();
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

        var onDocumentTypeIdSelect = function (e) {
            e.sender['previousValue'] = e.sender.value();
        };

        var onDocumentTypeIdChange = function (e) {
            var containerTypeId = getContainerTypeId();
            var associatedDocumentsGrid = $("#gdAssocatedDocuments").data("kendoGrid");
            var documentCount = associatedDocumentsGrid ? associatedDocumentsGrid.dataSource.data().length : 0;

            // Container type was 'KIT'
            if (containerTypeId == 2 && documentCount > 0) {
                
                var documentTypeText = getDocumentTypeText();
                var settings = {
                    message: 'Are you sure to switch the current document type to ' + documentTypeText + '? If you proceed, then the previously added documents will be discarded',
                    header: 'Confirm Document Type Change'
                };

                DisplayConfirmationModal(settings,
                    function () {
                        setContainerTypeLayout(containerTypeId, false);
                    },
                    function () {
                        var documentTypeDdl = $(e.target).data('kendoDropDownList');
                        if (documentTypeDdl) {
                            documentTypeDdl.select(function (dataItem) {
                                return dataItem.Value == documentTypeDdl['previousValue'];
                            });

                            documentTypeDdl['previousValue']= '';
                        };
                    });
            }
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
                DisplayError('Saving the document could not be completed. Please review your changes and try again.');
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
                        DisplayError(error);
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
                DisplayError('Alias Type and Aliases are required.');
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
                    DisplayError('Aliases could not be saved.');
                },
                success: function (successData) {
                    if (successData.success == true) {
                        $('#mdlMultipleNames').modal("toggle");
                        var grid = $("#DocumentDetail #gdRevisionNameNumber").data("kendoGrid");
                        grid.dataSource.read();
                        //should refressh grid
                    } else
                        DisplayError("Error Occurred");
                },
                complete: function (compData) {
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Items Saved Successful");
                }
            });
        });

        // ************************************** Document Kits Groups Methods **************************************************
        var prevRadioButtonState = [0, 0, 0, 0];
        
        function addToChildGrid(childGridId, selectedDataItem) {
            var child = $("#" + childGridId).data("kendoGrid");
            if (!child)
                return "An error occurred attempting to attachment documents";

            if (hasGridContain(child, selectedDataItem))
                return "Duplicate documents could not be attached";
            
            // All attachments must be of container type single
            if (selectedDataItem.ContainerTypeId != 1)
                return "Non-Single documents could not be attached";

            // Kit business rules
            var parentContainerTypeId = getContainerTypeId();
            var parentDocumentTypeId = getDocumentTypeId();
            if (parentContainerTypeId == 2 && selectedDataItem.DocumentTypeId != parentDocumentTypeId)
                return "Documents not matching the parent kit's document type could not be attached";
            
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

            return null;
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
            var containerTypeId = getContainerTypeId();
            if (shouldPostToServer() && containerTypeId == 2) {
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
            resetDropDown('#ddlDocumentStatus');

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

            var url = getUrl("Operations", "Operations/Document/DocumentKitAndGroup_Update");

            var childDocumentIdSet = [];
            $.each(filteredData, function (index, item) {
                childDocumentIdSet.push(item.ReferenceId);
            });

            var vKitGroupContainerId = $("#KitGroupContainerId").val();
            if (vKitGroupContainerId == undefined)
                vKitGroupContainerId = 0;

            var parentDocumentId = $("#ParentDocumentId").val();
            if (parentDocumentId == undefined)
                parentDocumentId = 0;

            updateKitAndGroup(parentDocumentId, containerTypeId, childDocumentIdSet, vKitGroupContainerId);
        }

        function doBothChildren() {
            $('#rbtnGrpControlPanel').find('input').prop('checked', false);
            $('input[name=kgClassifierKitChildren], input[name=kgClassifierGroupChildren]').prop('checked', true);

            $('#lblParent').html("Parents");
            $('#lblKitSibling').html("Kit Sibling");
            $("#lblGroupSibling").html("Group Sibling");

            $("#divGroupParent").hide();
            $('#divBody, #divParent, #divKitSibling').show();

            setPrevRadioButtonState(1, 3);
        }

        function doGroupChildren() {
            $('#rbtnGrpControlPanel').find('input:not([id="kgClassifierGroupChildren"])').prop('checked', false);

            $('#lblGroupSibling').html("Other Sibling");
            $('#divParent, #divKitSibling').hide();
            $("#divBody, #divGroupParent, #divGroupSibling").show();

            setPrevRadioButtonState(3);
        }

        function doGroupParent() {
            $('#rbtnGrpControlPanel').find('input:not([id="kgClassifierGroupParent"])').prop('checked', false);
            $('#divParent, #divGroupParent, #divKitSibling').hide();
            $('#lblGroupSibling').html("Elements");
            $("#divBody, #divGroupSibling").show();
            
            setPrevRadioButtonState(2);
        }

        function doKitChildren() {
            $('#rbtnGrpControlPanel').find('input:not([id="kgClassifierKitChildren"])').prop('checked', false);

            $('#lblParent').html("Parent");
            $('#lblKitSibling').html("Sibling");
            $("#divGroupParent, #divGroupSibling").hide();
            $('#divBody, #divParent, #divKitSibling').show();

            setPrevRadioButtonState(1);
        }

        function doKitParent() {
            $('#rbtnGrpControlPanel').find('input:not([id="kgClassifierKitParent"])').prop('checked', false);
            $('#divParent, #divGroupParent, #divGroupSibling').hide();
            $("#divBody, #divKitSibling").show();

            $('#lblKitSibling').html("Components");

            setPrevRadioButtonState(0);
        }

        function doTopicParent() {
            $('#rbtnGrpControlPanel').find('input:not([id="kgClassifierTopicChildren"])').prop('checked', false);
            $("#divBody, #divTopicComponents").show();
            $('#lblTopicParent').html("Components");

            setPrevRadioButtonState(4);
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

        function getKitsGroupClassificationTextValue(containerTypeId) {

            var classificationTextValue = ' Configuration';
            switch (containerTypeId) {

                // KIT
                case '2':
                    classificationTextValue = 'Kit' + classificationTextValue;
                    break;

                // GROUP
                case '3':
                    classificationTextValue = 'Group' + classificationTextValue;
                    break;

                // TOPIC
                case '4':
                    classificationTextValue = 'Topic' + classificationTextValue;
                    break;

                // SINGLE
                default:
                    classificationTextValue = classificationTextValue.trim();
                    break;
            }

            return classificationTextValue;
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
            else if (gridid.indexOf('Topic') > 0)
                return 4;

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

        function onSearchDocumentGridDataBound() {
            var kwindow = $('#documentSearchWindow_kg').data('kendoWindow');
            if (kwindow && !kwindow.element.is(':hidden')) {
                kwindow.center();
            }
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
            setLblRevisionFileInfoDetail();
            $("#gdAssocatedDocuments, #kgAttachment, #lblRevisionFileInfoDetail, #tabRevisionFileInfo").hide();

            // Add information based on the container type provided
            switch (containerTypeId) {

                // KIT
                case 2:
                    $("#kgAttachment").show(); // MUST HIDE UNTIL SOFT LAUNCH
                    clearOutContentAndHide();
                    setViewUpdateAttachmentText();
                    break;

                // GROUP
                case 3:
                    break;

                // TOPIC
                case 4:
                    $('#kgAttachment').show();
                    clearOutContentAndHide();
                    setViewUpdateAttachmentText();
                    break;

                // SINGLE
                default:
                    $("#lblRevisionFileInfoDetail").hide();
                    break;
            }

            if (setPreviousContainerValue == true)
                $("#previousContainerTypeId").val(containerTypeId);
        };

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
            $('input[name=kgClassifierTopicChildren]').prop('checked', false);
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
                PhysicalStateId: getHandle("#ddlDocumentPhysicalState").val(),
                DocumentStatusId: getHandle("#ddlDocumentStatus").val()
        };
            return {
                searchText: JSON.stringify(queryText)
            };
        };

        var fillUpKGContent = function () {
            var sbv = $("#KitGroupClassificationSetBitValue").val();
            var tid = $("#ContainerTypeId").val();
            
            // KIT PARENT
            if (sbv == "1") {
                doKitParent();
                $("#whichGridToAdd").val("gdKitSibling");
                //loadExistingChildren("gdKitSibling");

            // KIT CHILDREN
            } else if (sbv == "2") {
               doKitChildren();

            // GROUP PARENT
            } else if (sbv == "4" || tid == 3) {
                doGroupParent();
                $("#whichGridToAdd").val("gdGroupSibling");
                loadExistingChildren("gdGroupSibling");

            // GROUP CHILDREN
            } else if (sbv == "8") {
                doGroupChildren();

            // BOTH KIT AND GROUP CHILDREN
            } else if (sbv == "10") {
                doBothChildren();

            // TOPIC PARENT
            } else if (sbv == '16') {
                doTopicParent();
                $("#whichGridToAdd").val("gdTopicComponents");
                loadExistingChildren("gdTopicComponents");

            // SINGLE
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
            if (!selectedRows || selectedRows.length == 0) {
                DisplayError("No row selected");
                return;
            }

            var itemsSaved = 0;
            var errorMessage = null;
            var childGridId = $("#whichGridToAdd").val();

            var model = {};

            //Might needed in the future for multiply select items
            selectedRows.each(function (index, row) {
                var uid = row.getAttribute('data-uid');
                var dataItem = parent.dataSource.getByUid(uid);
                if (dataItem.ContainerTypeId != 1) {
                    DisplayError('Document with type other than SINGLE can not be attached');
                    return;
                }

                model = {
                    ChildDocumentId: dataItem.ReferenceId,
                    ClassificationTypeId: $(documentElementSelectors.dropdownlists.DocumentContainerClassificationType).val(),
                    ParentDocumentId: $(documentElementSelectors.inputs.DocumentId).val()
                };
                //if (dataItem) {
                //    var tempErrorMessage = addToChildGrid(childGridId, dataItem);
                //    if (tempErrorMessage)
                //        errorMessage = errorMessage || tempErrorMessage;
                //    else
                //        itemsSaved++;
                //}
            });

            if (typeof (model.ParentDocumentId) == "undefined") {
                return;
            }

            //clearData();
            var documentSearchWindow = $("#documentSearchWindow_kg").data('kendoWindow');
            if (documentSearchWindow) documentSearchWindow.close();

            $(this).ajaxCall(controllerCalls.AddContainerComponents, model)
                .success(function (result) {
                    var errorMessage = parseErrorMessage(result);
                    if (errorMessage)
                        DisplayError(errorMessage);
                    else {
                        var componentGrid = $("#gdKitSibling").data('kendoGrid');
                        if (componentGrid) {
                            componentGrid.dataSource.read();
                        }
                    }
                })
                .error(function() {
                    DisplayError("Saving the document container component could not be completed. Please try again.");
                });

            //if (itemsSaved > 0) {

            //    if (shouldPostToServer())
            //        dispatch2($("#whichGridToAdd").val(), inferContainerTypeId($("#whichGridToAdd").val()));

            //    if (errorMessage)
            //        DisplayError('Warning: Some ' + errorMessage.toLowerCase());

            //} else {
            //    DisplayError(errorMessage ? errorMessage : 'No items were able to be attached');
            //}

            //setViewUpdateAttachmentText();
        };

        var initKitAndGroup = function () {
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


            $("#divParent, #divKitSibling, #divTopicComponents").hide();

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

            // SECONDARY LAYER EVENT HANDLERS
            var dlgDocumentSearch = $("#documentSearchWindow_kg");
            dlgDocumentSearch.off('click');

            dlgDocumentSearch.on('click', "#clearDocumentBtn", function (e) {
                e.preventDefault();
                clearData();
            });

            dlgDocumentSearch.on('click', "#searchDocumentBtn", function (e) {
                e.preventDefault();
                var grid = getHandle("#gdSearchDocument").data("kendoGrid");
                if (grid != null) {
                    if (grid.dataSource.view().length > 0) {
                        grid.dataSource.page(1);
                    }
                    
                    grid.dataSource.read();
                }
            });

            dlgDocumentSearch.on('click', "#addNewDocumentBtn2", function (e) {
                var currenturl = window.location.href;
                var indexArea = currenturl.substring(0, currenturl.indexOf('Document/'));
                var url = indexArea + "Document/LoadSingleDocument?documentId=0&revisionId=0";
                window.open(url, "_blank");
            });

            dlgDocumentSearch.on('click', "#titleDropDown", function (e) {
                e.preventDefault();
                if (dsSearchOption == undefined || dsSearchOption == null) 
                    return;

                kendo.bind(getHandle("#searchTtileOptionDiv"), dsSearchOption);
                getHandle("#searchTtileOptionDiv").show();
            });

            dlgDocumentSearch.on('click', "#searchSupplierIdBtn", function (e) {
                e.preventDefault();

                showSupplierPlugIn("documentSearchWindow_kg #txtSearchSupplierId");

                //cope with the deficiency
                $(document).on('dblclick', 'table tr', "#gdSearchSupplier", selectSupplier);
            });

            dlgDocumentSearch.on('click', "#searchDocumentIdSelect", function (e) {
                e.preventDefault();
                handleAddDocument();
            });

            dlgDocumentSearch.on("click", "#btnCancelDocumentSearch", function (e) {
                e.preventDefault();
                dlgDocumentSearch.data("kendoWindow").close();
            });

            //intercepting value from supplier popup
            dlgDocumentSearch.on("click", "#searchSupplierIdSelect", function(e) {
                e.preventDefault();

                var grid = $("#gdSearchSupplier").data("kendoGrid");
                if (grid.dataSource.total() == 0) return;

                var data = grid.dataItem(grid.select());
                if (data == null) {   
                    DisplayError("No row selected");
                    return;
                }

                getHandle("#txtSearchSupplierId").val(data.id + ", " +data.Name);
            });

            dlgDocumentSearch.on("click", "#btnCancelSupplierSearch", function (e) {
                e.preventDefault();
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

            $('#btnAddTopicComponent').click(function (e) {
                e.preventDefault();
                $("#whichGridToAdd").val("gdTopicComponents");

                getHandle("#documentModalPopup").show();
                setupDropDowns();

                dlgDocumentSearch.data("kendoWindow").center();
                dlgDocumentSearch.data("kendoWindow").open();
            });

            $('#btnContainerSave').click(function (e) {
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

                        var newItem = {
                            ReferenceId: selectedDataItem.ReferenceId,
                            DocumentId: selectedDataItem.ReferenceId,
                            RevisionTitle: selectedDataItem.RevisionTitle,
                            SupplierName: selectedDataItem.SupplierName,
                            ManufacturerName: selectedDataItem.SupplierName,
                            LanguageDescription: selectedDataItem.LanguageDescription,
                            DocumentTypeDescription: selectedDataItem.DocumentTypeDescription,
                            RegionDescription: selectedDataItem.RegionDescription,
                            RevisionDate: selectedDataItem.RevisionDate,
                            ConfirmationDate: selectedDataItem.RevisionDate
                        };

                        if (!hasGridContain(parent, newItem))
                            parent.dataSource.add(newItem);
                    });

                    dataSource.filter({});
                    dataSource.data([]);
                }

                dlgDocumentSearch.data("kendoWindow").close();
                $("#kg_popup").data("kendoWindow").close();
            });

            $('#btnContainerCancel').click(function (e) {
                var grid = $("#" +$("#whichGridToAdd").val()).data("kendoGrid");
                var popup = $("#kg_popup").data("kendoWindow");
                if (grid && grid.dataSource && grid.dataSource.data().length > 0) {

                    var settings = {
                        message: 'You choose to discard the documents attached. Do you wish to continue?',
                        header: 'Confirm Attachment Discard'
                    };

                    DisplayConfirmationModal(settings, function() {
                        dlgDocumentSearch.data("kendoWindow").close();
                        if (popup) popup.close();

                        grid.dataSource.data([]);
                        
                        var associatedGrid = $("#gdAssocatedDocuments").data('kendoGrid');
                        if (associatedGrid) associatedGrid.dataSource.data([]);

                        setViewUpdateAttachmentText();
                    });

                } else {
                    dlgDocumentSearch.data("kendoWindow").close();
                    if (popup) popup.close();
                    grid.dataSource.data([]);
                }
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

            var documentSearchGrid = $('#gdSearchDocument').data('kendoGrid');
            if (documentSearchGrid) {
                documentSearchGrid.unbind('dataBound', onSearchDocumentGridDataBound);
                documentSearchGrid.bind('dataBound', onSearchDocumentGridDataBound);
            }
        };

        var launchKGPopup = function (containerTypeId) {
            var title = getKitsGroupClassificationTextValue(containerTypeId);
            var d = $("<div id='kg_popup'></div>").appendTo('body');
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

            win.wrapper.find('.k-window-actions').hide();
                
            var url = getUrl("Operations", "Operations/Document/LoadDocumentKitsGroups");
            $.post(url,
                { documentId: 0, containerTypeId: containerTypeId },
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

            //if (!CheckRemoveComponentsFromKits(e)) {
            //    DisplayError("Component can not be removed from this Kits because a kit must contain at lease two components.");
            //    return;
            //}

            var settings = {
                message: 'Are you sure you want to remove this component?',
                header: 'Confirm Record Deletion'
            };

            DisplayConfirmationModal(settings, function() {
                var kgrid = $(e.delegateTarget).data('kendoGrid');
                if(kgrid) {
                    var dataSource = kgrid.dataSource;
                    var rowId = $(e.target).parents('tr').data('uid');

                    var dataItem = dataSource ? dataSource.getByUid(rowId): null;
                    if (dataItem) 
                        dataSource.remove(dataItem);

                    if (shouldPostToServer()) 
                        dispatch2(e.delegateTarget.id, inferContainerTypeId(e.delegateTarget.id));

                    // TOPIC: Business logic to display to the user when they remove the last component
                    if(getContainerTypeId() == 4 && dataSource.data().length == 0)
                        DisplayError("Warning: No more components are associated to the current topic");
                }
            });
        };

        var onKitGroupGridDataBound = function(e) {
            e.sender.element.find('.k-grid-Remove span').addClass('k-icon k-delete');
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

            url = getUrl("Operations", "Operations/Document/LoadDocumentJurisdiction");
            ddlid = "ddlDocumentJurisdiction";
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
             $("#documentSearchWindow_kg").data("kendoWindow").close();
        });

        getHandle("#SearchResultGridDiv").on('dblclick', 'table tr', function (e) {
            e.preventDefault();
            handleAddDocument();
        });

        getHandle("#searchSupplierIdSelect").click(function (e) {
            e.preventDefault();

            var grid = $("#gdSearchSupplier").data("kendoGrid");
            if (grid.dataSource.total() == 0)
                return;

            var data = grid.dataItem(grid.select());
            if (data == null) {
                DisplayError("No row selected");
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

        var onAddSiblingRequest = function (did) {
            //e.preventDefault();
            var title = prompt("Please enter title for the sibling you want to create", "");
            if (title != null) {
                kendo.ui.progress($(documentElementSelectors.grids.DocumentSibling + did), true);
                $.post(controllerCalls.AddDocumentSibling,
                    { documentId: did, documentTitle: title },
                    function (data) {
                        if (!data.Success) {
                            $(this).displayError(data.Message);
                            return;
                        }
                        var sbGrid = $(documentElementSelectors.grids.DocumentSibling + did).data("kendoGrid");

                        if (sbGrid.dataSource.view().length > 0) {
                            sbGrid.dataSource.page(1);
                        }
                        sbGrid.dataSource.data([]);
                        sbGrid.dataSource.read();
                    });
                kendo.ui.progress($(documentElementSelectors.grids.DocumentSibling + did), false);
            }
        }

        var onDocumentContainerComponentsRequestStart = function (e) {
            if (e.type == 'read') {
                this.transport.options.read.data = {
                    documentId: $(documentElementSelectors.inputs.DocumentId).val(),
                        classificationType: $(documentElementSelectors.dropdownlists.DocumentContainerClassificationType).val()
                };
            }
        };

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
        };

        function refreshDocumentContainersGrid(documentId) {
            var componentGrid = $(documentElementSelectors.grids.DocumentContainerComponents + documentId).data('kendoGrid');
            if (componentGrid) {
                componentGrid.dataSource.read();
            }
        }

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
            onDocumentNoteEdit: onDocumentNoteEdit,
            onDocumentTypeIdSelect: onDocumentTypeIdSelect,
            onDocumentTypeIdChange: onDocumentTypeIdChange,
            onExpand: onExpand,
            onGdDocumentNoteDataBound: onGdDocumentNoteDataBound,
            ongdWorkLoadItemChange: ongdWorkLoadItemChange,
            onGridEditChangeTitle: onGridEditChangeTitle,
            onKitGroupGridDataBound: onKitGroupGridDataBound,
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
            onAddSiblingRequest: onAddSiblingRequest,
            onDocumentContainerComponentsRequestStart: onDocumentContainerComponentsRequestStart
        };
    };

    //Initialize
    $(function () {
        $("#DocumentDetail").hide();
        $("#eeeSideBar").sidemenu();
        menuHelper.turnMenuActive($("#menuOperations"));
    });

})(jQuery);