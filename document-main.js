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
                            var documentId = treeView.dataSource.getByUid(li.getAttribute('data-uid')).DocumentId;
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
                ContainerTypeId: $("#ddlDocumentContainer").val(),
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
            console.log("hitting loadDocumentDetail");
            loadNodeInformation("LoadDocumentDetail", { documentId: documentId, revisionId: revisionId });
        };

        var loadNodeInformation = function (url, options, loadingIndicator) {
            if (loadingIndicator)
                kendo.ui.progress($('#panelDocDetailInner'), true);

            console.log("hitting loadNodeInformation, url:", url);
            $.post(url, options, function (data) {
                if (loadingIndicator)
                    kendo.ui.progress($('#panelDocDetailInner'), false);

                $('#panelDocDetailInner').html(data);
            });
        };

        var loadNewRevision = function () {
            $("#IsNewRevision").val("True");
            //$("#txtManufacturerId").val('');
            //$("#txtSupplierId").val('');
            $("#RevisionDate").val('');
            $("#ConfirmationDate").val('');
            //$("#RevisionTitle").val('');
            //$("#DocumentIdentification").val('');
            //$("#DocumentVersion").val('');
            //$("#VersionStatusDate").val('');
            //$("#IndexationStatusDate").val('');
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

        function updateKitAndGroup(parentDocumentId, containerTypeId, childDocumentIdSet, vKitGroupContainerId)
        {
            var url = getUrl("Document", "Document/DocumentKitAndGroup_Update");
           $.post(url, {
               parentDocumentId: parentDocumentId,
               containerTypeId: containerTypeId,
               childDocumentIdSet: JSON.stringify(childDocumentIdSet),
               kitGroupContainerId: vKitGroupContainerId
           }, function (data) {
               console.log("after posted in updateKitAndGroup, data: ", data);
           });
        }

        function insertKitAndGroup(parentDocumentId, containerTypeId, childDocumentIdSet) {
            var url = getUrl("Document", "Document/DocumentKitAndGroup_Insert");
            $.post(url, {
                parentDocumentId: parentDocumentId,
                containerTypeId: containerTypeId,
                childDocumentIdSet: JSON.stringify(childDocumentIdSet),
            }, function (data) {
                console.log("after posted in insertKitAndGroup, data: ", data);
            });
        }

        function dispatch(id, containerTypeId, parentDocumentId, vKitGroupContainerId) { //id is grid id
            console.log("hitting dispatch: id: {0};  containerTypeId:{1}", id, containerTypeId);
            var dataSource = $("#" + id).data("kendoGrid").dataSource;
            var filters = dataSource.filter();
            var allData = dataSource.data();
            var query = new kendo.data.Query(allData);
            var filteredData = query.filter(filters).data;
            console.log("filteredData: ", filteredData);

            
            var childDocumentIdSet = [];
            $.each(filteredData, function (index, item) {
                console.log("item: ", item);
                console.log("childDocumentIdSet: ", childDocumentIdSet);
                if ($.inArray(item.ReferenceId, childDocumentIdSet) == -1) {
                    childDocumentIdSet.push(item.ReferenceId);
                } else {
                    console.log("already contained in cs, ", item);
                }

            });

            updateKitAndGroup(parentDocumentId, containerTypeId, childDocumentIdSet, vKitGroupContainerId);
            console.log("exiting dispatch");
        }

        function getContainerTypeId()
        {
            var containerOption = $("#ContainerTypeId").val();
            if (containerOption == "2") 
                return 2; 
             else if (containerOption == "3") 
               return 3; 
            return containerOption;
        }

      

        var saveDocumentDetail = function () {
            var form = $("#documentRevisionTab").updateValidation();
            var validForm = form.valid();

            if (validForm) {
                if (!checkAttachmentsBeforeSave())    //check all the attachment if form is valid before preceed
                    return;

                var url = form.attr("action");
                var formData = form.serialize();
                var containerTypeId = getContainerTypeId();
                $.post(url, formData, function(data) {
                    if (data.DisplayMessage != "Error") {
                        //special handling for group's element addition
                        if ($("#DocumentCreationIntention").val() == "31") { //wip
                            console.log("to add to group control");
                            //handleExitFromSingleNewDocCreation(data);
                            //we need add association for the newly created doc 
                            var parentDocumentId = $("#ParentDocumentId").val();
                            insertKitAndGroup(parentDocumentId, 3, data.DocumentId);
                            var parentRevisionId = $("#ParentRevisionId").val();
                            loadDocumentDetail(parentDocumentId, parentRevisionId);
                            return;
                        }


                        //if (data.NewDocument == "true" || data.NewDocument == "True") {
                        //the following line is faulty, but leave it as is since there would be some repurcussion if changed
                        if (data.NewDocument) {
                            if (containerTypeId == 2 || containerTypeId == 3) {
                                console.log("within lib saveDocumentDetail, to save with  containerTypeId", containerTypeId);
                                var vKitGroupContainerId = $("#KitGroupContainerId").val();
                                if (vKitGroupContainerId == undefined) {
                                    if ($("input#DocumentID.doc-ref-id").val() == "0")
                                        vKitGroupContainerId = 0;
                                }
                                console.log("kitGroupContainerId: ", vKitGroupContainerId);
                                $("#ParentDocumentId").val(data.DocumentId);

                                if (containerTypeId == 2 || (containerTypeId == 3 && isInEditingMode()))
                                    dispatch("gdAssocatedDocuments", containerTypeId, data.DocumentId, vKitGroupContainerId);
                            }

                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data.DisplayMessage);
                            loadDocumentDetail(data.DocumentId, data.RevisionId);

                            //if (containerTypeId != 2) {
                            //    alert("This is a reminder, please attach all necessary file to this newly created document, otherwise it will ge treated as incomplete.");
                            //}

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
                        console.log("within saveDocumentDetail, is a new document: ", data.NewRevision);
                    }

                    var kendoTreeView = $('#tvProductSearchResult').data("kendoTreeView");
                    var tvDataItem = kendoTreeView.dataItem(kendoTreeView.select());
                    if (typeof(tvDataItem) != "undefined") {
                        selectedNode = (tvDataItem.length > 0) ? null : tvDataItem.id; 
                 
                        console.log("within saveDocumentDetail, selectedNode: ", selectedNode);
                        repopulateTreeBranch(form, docNode);
                    }
                });
            }
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

        var loadIndexation = function () {
            var documentId = $("#DocumentId").val();
            var revisionId = $("#RevisionId").val();
            var currenturl = window.location.href;
            var indexArea = currenturl.substring(0, currenturl.indexOf('Document'));
            var url = indexArea + "Indexation/Indexation?documentId=" + documentId + "&revisionId=" + revisionId;
            window.open(url, "_blank");
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
                            //alert('This function is under construction. It will set the current manufacturer to unknonw.');
                            $("#txtManufacturerId").val(data);
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
            });            
        };

        //Testing only
        var loadSingleDocument = function () {
            //Temp test id
            var documentId = 52;
            var revisionId = 1056274;
            var currenturl = window.location.href;
            var indexArea = currenturl.substring(0, currenturl.indexOf('Document'));
            var url = indexArea + "Document/LoadSingleDocument?documentId=" + documentId + "&revisionId=" + revisionId;
            window.open(url, "_blank");
        };

        //(SH) 4-16-2014
        var viewSingleSupplier = function(supplierId) {
            if (supplierId > 0) {
                var url = getUrl("Operations", "Operations/Company/LoadSingleSupplier?supplierId=" + supplierId);
                window.open(url, "_blank");
            }
        };

        var selectSupplier = function () {
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
                if(tv != null)
                    tv.dataSource.data([]);

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

           

            $("#searchSupplierIdSelect").click(function (e) {
                selectSupplier();
            });

            $("#gdSearchSupplier").dblclick(function (e) {
                console.log("gdSearchSupplier double clicked");
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

        function setLblRevisionFileInfoDetaillib(text) {
            text = (typeof text !== 'undefined') ? text : "Attachment";
            //console.log("to set lblRevisionFileInfoDetail with value: ", text);
            $("#lblRevisionFileInfoDetail").html(text);
            $("#addNewFilesBtn").html("Add " + text);

        }

        // Method resize splitters when all content is loaded into the selected tab
        var onTabContentLoad = function (e) {
            setTimeout(function () {
                $(e.contentElement).find('.k-splitter').each(function () {
                    $(this).data("kendoSplitter").trigger("resize");
                });
            }, 200);

            var containerTypeId = $("#ContainerTypeId").val();
            if (containerTypeId == "2") {
                setTimeout(setLblRevisionFileInfoDetaillib("Cover Sheet"), 100);

                $("#btnDissembleKit").show();

                console.log("set the destroy link");
                $(document).off('click', "#btnDissembleKit");
                $(document).on('click', "#btnDissembleKit", function (e) {
                    console.log("btnDissembleKit clicked via on ");
                    if (confirm("Are you sure to destroy or dissemble this kit?")) {
                        console.log("user chooses to delete the kit");
                        disembleKitOrGroup(2);
                    }
                });

            } else if (containerTypeId == "3") {
                setTimeout(setLblRevisionFileInfoDetaillib("Attachments"), 100);
                    
                $("#btnDissembleKit").show();

                console.log("set the destroy link");
                $(document).off('click', "#btnDissembleKit");
                $(document).on('click', "#btnDissembleKit", function (e) {
                    console.log("btnDissembleKit clicked via on ");
                    if (confirm("Are you sure to destroy or dissemble this group?")) {
                        console.log("user chooses to delete the kit");
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

        var onIUserInfo = function(e) {
            $("a[id$='I-Info']").popover();
        };

        var OnddlContainerTypeSelect = function (e) {

            $("#dvImageQuality").show();
            $("#dvDocSource").show();
            $("#dvVersionNUmber").show();

            //hide image quality and version number if kit is selected
            if (e.item.index() == "2") {
                $("#dvImageQuality").hide();
                $("#dvVersionNUmber").hide();
            }
            //hide image quality and document source if  group is selected
            if (e.item.index() == "3") {
                $("#dvImageQuality").hide();
                $("#dvDocSource").hide();
            }
            
        };


        //kg
        //--------------------------------start of kit and group implementation--------------------------------------
        //------This implementation contains two tabs: doc id tab and kg tab-------
        //------start of doc id tab---
        var dlgDocumentSearch = $("#documentSearchWindow_kg");
        //var supplierSearchDialog = $("#supplierSearchWindow");
        var prevRadioButtonState = [0, 0, 0, 0];

        var listOfChildDocumentId = JSON.parse("[" + (($("#ListOfChildDocumentId").val() == undefined) ? "" : $("#ListOfChildDocumentId").val())+ "]");

        function getUrl(area, controllerAndFunc){
            var currenturl = window.location.href;
            var indexArea = currenturl.substring(0, currenturl.indexOf(area));
            var url = indexArea + controllerAndFunc;
            console.log("resulting url: ", url);
            return url;
        }


        var isInEditingMode = function()
        {
            var docId = $("input#DocumentID.doc-ref-id").val();
            var pid = $("#ParentDocumentId").val();
            if (docId != undefined && docId && docId != "0"  && pid == undefined) {
                return true;
            }
            return false;
        };

        //Specifically used for document attachment delete
        var customDeleteAttachment = function (infoId) {
            var message = "Are you sure you want to delete this file?";
            var cResult = confirm(message);
            if (!cResult)
                return;

            var multiAttachment = $("#gdRevisionFileInfoDetail_" + $("#RevisionID").val()).data("kendoGrid").dataSource.data().length;
            if (multiAttachment == 1)
            {
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
        
        var currentRevisionId = function () {
            var currenRevId = $("#RevisionID").val();
            return {
                RevisionId: currenRevId
            };
        };


        var checkAttachmentsBeforeSave = function() {
            var message = "The Kit needs at least two components attached.";
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
                    if (componentsCount <= 0) {
                        if (confirm("The kit has no components attached," + message)) {
                            launchKGPopup(containerOption);
                        }
                        return false;
                    } else if (componentsCount == 1) {
                        if (confirm("The kit has only one components attached," + message)) {
                            launchKGPopup(containerOption);
                        }
                        return false;
                    };
                }
            }
            return true;
        };

        var viewAndUpdateAttachments = function() {
            console.log("viewAndUpdateAttachments hitting");
            var containerOption = $("#ContainerTypeId").val();
            if (containerOption == "2") //k
            {
                launchKGPopup(containerOption);
            } else if (containerOption == "3") //g
            {
                launchKGPopup(containerOption);
            }
        };

        var onContainerTypeIdChange = function(e) {
            var containerTypeId = $("#ContainerTypeId").val();
            var previousContainerTypeId = $("#previousContainerTypeId").val();
            console.log("Within ContainerTypeId's change, previousContainerTypeId: ", previousContainerTypeId);
            console.log("Within ContainerTypeId's change, current containerTypeId: ", containerTypeId);
            if (containerTypeId == "1") {
                //also need check if it is in display mode
                if ($("#gdAssocatedDocuments").data("kendoGrid").dataSource.data().length > 0 && (previousContainerTypeId == "2" || previousContainerTypeId == "3")) {
                    if (confirm("Are you sure to switch the current document to a single? If you proceed, then the previously added documents will be discarded")) {
                        setLblRevisionFileInfoDetail();
                        clearOutContentAndHide();
                        $("#lblRevisionFileInfoDetail").hide();
                    } else {
                        console.log("reset back to the previous selection since user cancelled it");
                        if ($(this).data("kendoDropDownList") != null) {
                            $(this).data("kendoDropDownList").select(parseInt(previousContainerTypeId));
                        } 
                        return;
                    }
                }
                $("#kgAttachment").hide();
                $("#whichGridToAdd").val("");
                $("#tabRevisionFileInfo").hide();
                $("#gdAssocatedDocuments").hide();
                $("#previousContainerTypeId").val(containerTypeId);
                return;
            }

            //as long as it is not a new single doc creation, we wil let the lblRevisionFileInfoDetail show
            if ($("input#DocumentID.doc-ref-id").val() != "0" || ($("input#DocumentID.doc-ref-id").val() != "0" && (containerTypeId == "2" && containerTypeId == "3"))) {
                $("#lblRevisionFileInfoDetail").show();
                $("#tabRevisionFileInfo").show();
            }

            if (!isInEditingMode()) {
                if (containerTypeId == 3) {
                    $("#kgAttachment").hide();
                } else if (containerTypeId == 2) {
                    $("#kgAttachment").show();
                }
                return;
            }


            if (previousContainerTypeId != undefined) {
                if (containerTypeId == "2" && previousContainerTypeId == "3") {
                    if ($("#gdAssocatedDocuments").data("kendoGrid").dataSource.data().length > 0) {
                        if (confirm("Are you sure to switch the current document from group to kit? If you proceed, then the previously added documents will be discarded")) {
                            setLblRevisionFileInfoDetail();
                            //$("#tabRevisionFileInfo").show();
                            clearOutContentAndHide();
                            $("#whichGridToAdd").val("gdKitSibling");
                            //launchKGPopup(containerTypeId);
                            $("#kgAttachment").show();
                            $("#previousContainerTypeId").val(containerTypeId);
                            return;
                        } else {
                            $("#tabRevisionFileInfo").hide();
                            $(this).val(previousContainerTypeId);
                            return;
                        }
                    }
                } else if (containerTypeId == "3" && previousContainerTypeId == "2") {
                    if ($("#gdAssocatedDocuments").data("kendoGrid").dataSource.data().length > 0) {
                        if (confirm("Are you sure to switch the current document from kit to group? If you proceed, then the previously added documents will be discarded")) {
                            clearOutContentAndHide();
                            setLblRevisionFileInfoDetail();
                            $("#tabRevisionFileInfo").hide();
                            $("#whichGridToAdd").val("gdGroupSibling");
                            $("#kgAttachment").hide();
                            //launchKGPopup(containerTypeId);
                            $("#previousContainerTypeId").val(containerTypeId);
                            return;
                        }else {
                            //$("#tabRevisionFileInfo").show();
                            $(this).val(previousContainerTypeId);
                            return;
                        }
                    }
                }
            }
            if (containerTypeId == 2) {
                if (shouldPostToServer()) {
                    setLblRevisionFileInfoDetail("Cover Sheet");
                    $("#tabRevisionFileInfo").show();
                } else {
                    $("#tabRevisionFileInfo").hide();
                }
                $("#whichGridToAdd").val("gdKitSibling");
            } else if (containerTypeId == 3) {
                $("#whichGridToAdd").val("gdGroupSibling");
                $("#tabRevisionFileInfo").hide();
            }

            //launchKGPopup(containerTypeId);
            
            //$("#kgAttachment").show();

            $("#previousContainerTypeId").val(containerTypeId);
        };
    

        var onPopuClose = function(e) {
            console.log("Within onPopuClose, e:", e);
            $("#divDocumentIdentification").show();
        };

        //mode: 2 for kit; and 3 for group
        var launchKGPopup = function (containerTypeId) {
            console.log("hitting launchKGPopup with containerTypeId:", containerTypeId);
            var kitGroupClassificationSetBitValue = 0;
            var title = "Configuration";
            if (containerTypeId == "2") {
                kitGroupClassificationSetBitValue = 1;
                title = "Kit " + title;
            } else if (containerTypeId == "3") {
                kitGroupClassificationSetBitValue = 4;
                title = "Group " + title;
            }

            var d = $("<div id='kg_popup'></div>")
                .appendTo('body');
            var win = d.kendoWindow({
                modal: true,
                animation: false,
                visible: false,
                width: "1200px",
                title: title,
                actions: [
                    "Pin",
                    "Minimize",
                    "Maximize",
                    "Close"
                ],
                deactivate: function(evnt) {
                    console.log("Within deactivate, e:", evnt);
                    this.destroy();
                },
                close: onPopuClose
            }).data("kendoWindow");

            var url = getUrl("Operations", "Operations/Document/LoadDocumentKitsGroups");
            $.post(url, { documentId: 0, KitGroupClassificationSetBitValue: kitGroupClassificationSetBitValue }, function(content) {
                //console.log("within launchKGPopup after posted, data: ", content);
                d.html(content);
                $("#DocumentKitsAndGroupsSplitter", "#kg_popup").removeClass().addClass("new-document-revision");
                win.center();
                win.open();
            });

            console.log("exiting launchKGPopup");
        };
    
        function setLblRevisionFileInfoDetail(text){
            text = (typeof text !== 'undefined') ? text : "Attachment";
            //console.log("to set lblRevisionFileInfoDetail with value: ", text);
            $("#lblRevisionFileInfoDetail").html(text);
            $("#lblRevisionFileInfoDetail").show();
            $("#addNewFilesBtn").html("Add " + text);

        }

        function clearOutContentAndHide() {
            $("#divAssocatedDocuments").hide();
            var grid = $("#gdAssocatedDocuments").data("kendoGrid");
            
            grid.dataSource.filter({});
            grid.dataSource.data([]);

            grid = $("#" + $("#whichGridToAdd").val()).data("kendoGrid");
            if(grid &&  grid.dataSource)
                grid.dataSource.data([]);

            $("#btnViewAndUpdateAttachments").html("Attachments()");
        }
        //------end of doc id tab---


        //------start of doc kg tab---
        var collectDataToDelete = function() {
            console.log("hitting collectDataToDelete");
        };

        var documentQuery_kg = function (e) {
            console.log("hitting documentQuery");
            var queryText = {
                ReferenceId: getHandle("#txtSearchDocumentId").val(),
                DocumentTypeId: getHandle("#ddlDocumentType").val(),
                DocumentLanguageId: getHandle("#ddlDocumentLanguage").val(),
                DocumentRegionId: getHandle("#ddlDocumentRegion").val(),
                PartNumber: getHandle("#txtSearchPartNumber").val(),
                UPC: getHandle("#txtSearchUPC").val(),
                SupplierId: parseInt(getHandle("#txtSearchSupplierId").val()),
                RevisionTitle: getHandle("#txtRevisionTitle").val(),
                SearchOption: getHandle("input[name=radiogroupTitleSearchOption]:checked").val(),
                LatestRevisionOnly: getHandle("#chkLatestRevision:checked").length == 1
            };
            return {
                searchText: JSON.stringify(queryText)
            };
        };


        var OngdSearchDocumentChange = function (e) {
            e.preventDefault();
        };


        var ongdWorkLoadItemChange = function (e) {
            e.preventDefault();
        };

        
        var getHandle = function(id) {
            return $("#documentSearchWindow_kg").find(id);
        };

        function canDeelete(e) {
            //if this is an existing kit, we prevent deleting the last two records
            var containerTypeId = $("#ContainerTypeId").val();
            if (shouldPostToServer() && containerTypeId == "2") {
                var gridid = e.delegateTarget.id;
                var grid = $("#" + gridid).data("kendoGrid");
                var dataSource = grid.dataSource;
                if (dataSource.data().length <= 2) {
                    return false;
                } else {
                    console.log("permitting delete from kit");
                }
            }
            return true;
        }

        var onCustomCommand = function(e) {
            e.stopPropagation();
            $("#canViewConstituentDocument").val("0");
            console.log("onCustomCommand e.isPropagationStopped(): ", e.isPropagationStopped());

            if (!canDeelete(e)) {
                confirm("You can't delete this record as it is one of the last two records in the kit");
                return;
            }

            if (confirm("Are you sure you want to delete this record")) {
                var gridid = e.delegateTarget.id;
                var grid = $("#" + gridid).data("kendoGrid");
                var referenceId = this.dataItem(this.select())["ReferenceId"];
                var dataSource = grid.dataSource;
                var raw = dataSource.data();
                $.each(raw, function(index, elem) {
                    if (elem != undefined && elem.ReferenceId != null && elem.ReferenceId == referenceId) {
                        dataSource.remove(elem);
                    }
                });

                if (shouldPostToServer()) {
                    console.log("to post to server after delete");
                    dispatch2(gridid, inferContainerTypeId(gridid));
                }
            }
            console.log("exiting onCustomCommand");
        };

        function hasGridContain2(grid, refid) {
            if (grid == undefined || grid.dataSource == undefined)
                return false;
            var result = false;
            $.each(grid.dataSource.data(), function (index, item) {
                if (item.ReferenceId != undefined && item.ReferenceId == refid) {
                    //console.log(newEl.ReferenceId + " already contained");
                    result = true;
                }
            });
            return result;
        }

        function hasGridContain(grid, newEl) {
            if (grid == undefined || grid.dataSource == undefined)
                return false;
            var result = false;
            $.each(grid.dataSource.data(), function (index, item) {
                if (item.ReferenceId != undefined && item.ReferenceId == newEl.ReferenceId) {
                    //console.log(newEl.ReferenceId + " already contained");
                    result = true;
                }
            });
            return result;
        }

        var addToChildGrid = function(childGridId, selectedDataItem) {
            console.log("addToChildGrid, childGridId:", childGridId);
            console.log("addToChildGrid, selectedDataItem.ReferenceId:", selectedDataItem.ReferenceId);
            var child = $("#" + childGridId).data("kendoGrid");
            if (child == null) {
                console.log("error: child is null!!");
                return;
            }

            if (hasGridContain(child, selectedDataItem)) {
                console.log("No op, since grip already contains", selectedDataItem.ReferenceId);
                return;
            }
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
            });

            //console.log("within addToChildGrid, after addition, there are " + child.dataSource.data().length + " records");
            //if (shouldPostToServer()) {
            //    dispatch2(childGridId, inferContainerTypeId(childGridId));
            //}
        };

        function dispatch2(id, containerTypeId) { //id is grid id
            console.log("hitting dispatch2");
            if (containerTypeId == 0) {
                console.log("No op for Single");
                return;
            }

            var dataSource = $("#" + id).data("kendoGrid").dataSource;
            var filters = dataSource.filter();
            var allData = dataSource.data();
            var query = new kendo.data.Query(allData);
            var filteredData = query.filter(filters).data;

            //var url = '@Url.Action("DocumentKitAndGroup_Update", "Document", new { Area = "Operations" })';
            var url = getUrl("Operations", "Operations/Document/DocumentKitAndGroup_Update");

            var childDocumentIdSet = [];
            $.each(filteredData, function (index, item) {
                console.log("filtered Data, item: ", item);
                childDocumentIdSet.push(item.ReferenceId);
            });

            //prevent from deleting the last two components from an existing kit
            if (shouldPostToServer() && containerTypeId == 2 && childDocumentIdSet.length <= 1) {
                console.log("we will prevent from deleting the last two components from an existing kit");
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
            console.log("exiting dispatch2");
        }

        var shouldPostToServer = function () {
            if ($("#ParentDocumentId").length == 0)
                return false;
            if ($("#ParentDocumentId").val() == 0)
                return false;
            return true;
        };

        function inferContainerTypeId(gridid) {
            if (gridid.indexOf("Kit") > 0)
                return 2;
            else if (gridid.indexOf("Group") > 0)
                return 3;
            return 1;
        }

        function resetPrevRadioButtonState() {
            prevRadioButtonState = [0, 0, 0, 0];
        }

        function setPrevRadioButtonState(id) {
            prevRadioButtonState = [0, 0, 0, 0];
            prevRadioButtonState[id] = 1;
        }

        function setPrevRadioButtonState(id1, id2) {
            prevRadioButtonState = [0, 0, 0, 0];
            prevRadioButtonState[id1] = 1;
            prevRadioButtonState[id2] = 1;
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

        function hidePopups() {
            console.log("hitting hidePopups");
            getHandle("#documentModalPopup").hide();
            //getHandle("#supplierModalPopup").hide();
            console.log("exiting hidePopups");
        }

        function resetDropDown(did) {
            if (getHandle(did).data("kendoDropDownList") != null) {
                getHandle(did).data("kendoDropDownList").select(0);
            } else {
                getHandle(did).val("");
            }
        }

        var clearData = function () {
            getHandle('#txtSearchDocumentId').val("");
            getHandle('#txtSearchPartNumber').val("");
            getHandle('#txtSearchSupplierId').val("");
            getHandle('#txtSearchUPC').val("");
            getHandle('#txtRevisionTitle').val("");

            resetDropDown('#ddlDocumentLanguage');
            resetDropDown("#ddlDocumentRegion");
            resetDropDown("#ddlDocumentType");

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

        //------------------------------start of UI initialization-----------------------------------
        //var doDocumentSearch = function () {
        //    console.log("do doc search");
        //};

        var fillUpKGContent = function() {
            console.log("hitting fillUpKGContent");
            var sbv = $("#KitGroupClassificationSetBitValue").val();
            var tid = $("#ContainerTypeId").val();
            console.log("KitGroupClassificationSetBitValue has value of " + sbv);
            if (sbv == "1") {
                console.log("it is a kit parent");
                $("#divBody").show();
                doKitParent();
                $("#whichGridToAdd").val("gdKitSibling");
                loadExistingChildren("gdKitSibling");
            } else if (sbv == "2") {
                console.log("it is a kit children");
                $("#divBody").show();
                doKitChildren();
            } else if (sbv == "4" || tid == 3) {
                console.log("it is a group parent");
                $("#divBody").show();
                doGroupParent();
                $("#whichGridToAdd").val("gdGroupSibling");
                loadExistingChildren("gdGroupSibling");
            } else if (sbv == "8") {
                console.log("it is a group children");
                doGroupChildren();
                $("#divBody").show();
            } else if (sbv == "10") {
                console.log("it is both a kit children and a group children");
                $("#divBody").show();
                doBothChildren();
            } else {
                console.log("single or unknown container type");
                $("#divBody").hide();
            }

         
            //console.log("KitGroupClassificationSetBitValue has value of " + sbv);
            //if (sbv == "2") {
            //    console.log("it is a kit parent");
            //    doKitParent();
            //    loadExistingChildren("gdKitSibling");
            //} else if (sbv == "3") {
            //    console.log("it is a group parent");
            //    doGroupParent();
            //    loadExistingChildren("gdGroupSibling");
            //} else {
            //    console.log("unknown container type");
            //}

        };


        function setKGTopLabel(keyWord)
        {
            $("#pTopLabel").html("This is a <strong>" + keyWord + "</strong>.");
        }

        function doKitParent() {
            console.log("hitting doKitParent");
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
            //console.log("exiting doKitParent");
        }

        function doKitChildren() {
            console.log("hitting doKitChildren");
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
            //console.log("exiting doKitChildren");
        }

        function doGroupParent() {
            console.log("hitting doGroupParent");
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
            //console.log("exiting doGroupParent");
        }

        function doBothChildren() {
            console.log("hitting doBothChildren");
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
            //console.log("exiting doBothChildren");
        }

        function uncheckAndHideAll() {
            console.log("hitting uncheckAndHideAll");
            $("#pTopLabel").html("");
            $("#divBody").hide();

            $('input[name=kgClassifierKitParent]').prop('checked', false);
            $('input[name=kgClassifierGroupParent]').prop('checked', false);
            $('input[name=kgClassifierKitChildren]').prop('checked', false);
            $('input[name=kgClassifierGroupChildren]').prop('checked', false);
            resetPrevRadioButtonState();
        }

        function doGroupChildren() {
            setKGTopLabel("Group Element");
            $("#divBody").show();

            //console.log("hitting doGroupChildren");
            $('input[name=kgClassifierKitParent]').prop('checked', false);
            $('input[name=kgClassifierGroupParent]').prop('checked', false);

            $('#divParent').hide();

            $("#divKitSibling").hide();

            $("#divGroupParent").show();

            $("#divGroupSibling").show();
            $('#lblGroupSibling').html("Other Sibling");

            setPrevRadioButtonState(3);
            //console.log("exiting doGroupChildren");
        }

        //Below are case handlers
        $('input[name=kgClassifierKitParent]').click(function (e) {
            var idx = 0;
            var selfPreImage = prevRadioButtonState[idx];
            if (selfPreImage == 1 && isTheOnlyOneChecked(idx)) {
                uncheckAndHideAll();
                return;
            }
            hidePopups();
            //console.log("kgClassifierKitParent, initial prevRadioButtonState", prevRadioButtonState);
            doKitParent();
            //console.log("kgClassifierKitParent, final prevRadioButtonState", prevRadioButtonState);
        });

        $('input[name=kgClassifierKitChildren]').click(function (e) {
            //console.log("kgClassifierKitChildren, initial prevRadioButtonState", prevRadioButtonState);
            var idx = 1;
            var selfPreImage = prevRadioButtonState[idx];
            if (selfPreImage == 1 && isTheOnlyOneChecked(idx)) {
                uncheckAndHideAll();
                return;
            }
            hidePopups();

            var otherPreImage = prevRadioButtonState[3];
            //console.log("within kgClassifierKitChildren selfPreImage: ", selfPreImage);
            //console.log("within kgClassifierKitChildren other Image:", otherPreImage);
            if (selfPreImage == 0) {
                if (otherPreImage == 1) {
                    doBothChildren();
                    //console.log("kgClassifierKitChildren, final prevRadioButtonState 1", prevRadioButtonState);
                    return;
                } else {
                    doKitChildren();
                    $('input[name=kgClassifierKitChildren]').prop('checked', true);
                    //console.log("kgClassifierKitChildren, final prevRadioButtonState 2", prevRadioButtonState);
                    return;
                }
            } else {
                doGroupChildren();
                $('input[name=kgClassifierKitChildren]').prop('checked', false);
                //console.log("kgClassifierKitChildren, final prevRadioButtonState 3", prevRadioButtonState);
                return;
            }

        });

        $('input[name=kgClassifierGroupParent]').click(function (e) {
            //console.log("kgClassifierGroupParent, inital prevRadioButtonState", prevRadioButtonState);
            var idx = 2;
            var selfPreImage = prevRadioButtonState[idx];
            if (selfPreImage == 1 && isTheOnlyOneChecked(idx)) {
                uncheckAndHideAll();
                return;
            }
            hidePopups();
            doGroupParent();
            //console.log("kgClassifierGroupParent, final prevRadioButtonState", prevRadioButtonState);
        });

        $('input[name=kgClassifierGroupChildren]').click(function (e) {
            //console.log("kgClassifierGroupChildren, initial prevRadioButtonState", prevRadioButtonState);
            var idx = 3;
            var selfPreImage = prevRadioButtonState[idx];
            if (selfPreImage == 1 && isTheOnlyOneChecked(idx)) {
                uncheckAndHideAll();
                return;
            }
            hidePopups();

            var otherPreImage = prevRadioButtonState[1];
            //console.log("within kgClassifierGroupChildren selfPreImage: ", selfPreImage);
            //console.log("within kgClassifierGroupChildren other Image:", otherPreImage);
            if (selfPreImage == 0) {
                if (otherPreImage == 1) {
                    doBothChildren();
                    //console.log("kgClassifierGroupChildren, final prevRadioButtonState 1", prevRadioButtonState);
                    return;
                } else {
                    doGroupChildren();
                    //console.log("kgClassifierGroupChildren, final prevRadioButtonState 2", prevRadioButtonState);
                    return;
                }
            } else {
                doKitChildren();
                $('input[name=kgClassifierGroupChildren]').prop('checked', false);
                //console.log("kgClassifierGroupChildren, final prevRadioButtonState 3", prevRadioButtonState);
                return;
            }
        });

        function setupOneDropDown(url, ddlid) {
            //console.log("hitting setupOneDropDown ddlid: " + ddlid);
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

        var setupDropDowns = function() {
            //var url = '@Url.Action("LoadDocumentLanguage", "Document", new
            //{
            //    Area = "Operations"
            //})';
            var url = getUrl("Operations", "Operations/Document/LoadDocumentLanguage");
            var ddlid = "ddlDocumentLanguage";
            setupOneDropDown(url, ddlid);

            //url = '@Url.Action("LoadDocumentType", "Document", new
            //{
            //    Area = "Operations"
            //})';
            url = getUrl("Operations", "Operations/Document/LoadDocumentType");
            ddlid = "ddlDocumentType";
            setupOneDropDown(url, ddlid);

            //url = '@Url.Action("LoadDocumentRegion", "Document", new
            //{
            //    Area = "Operations"
            //})';
            url = getUrl("Operations", "Operations/Document/LoadDocumentRegion");
            ddlid = "ddlDocumentRegion";
            setupOneDropDown(url, ddlid);

            //mod the popup appearance
            $("#documentSearchWindow_kg #lblIncludeDeletedDocument").hide();
            $("#documentSearchWindow_kg #chkIncludeDeletedDocument").hide();
            $("#documentSearchWindow_kg #addNewDocumentBtn").hide();
        };

      
        $('#btnContainerSave').click(function (e) {
            console.log("btnContainerSave clicked");
            var ad = $("#gdAssocatedDocuments");

            //copy the cached document lists to divAssociatedDocuments
            var parent = ad.data("kendoGrid");
            if (parent == null) {
                console.log("error: parent is null!!");
                return;
            }

            var child = $("#" + $("#whichGridToAdd").val()).data("kendoGrid");
            console.log("btnContainerSave child: ", child);
            if (child) {
                var dataSource = child.dataSource;
                var filters = dataSource.filter();
                var allData = dataSource.data();
                var query = new kendo.data.Query(allData);
                var filteredData = query.filter(filters).data;

                console.log("before parent.dataSource: ", parent.dataSource);
                $.each(filteredData, function (index, selectedDataItem) {
                    console.log("selectedDataItem: ", selectedDataItem);
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
                console.log("after addition parent.dataSource: ", parent.dataSource);

                dataSource.filter({});
                dataSource.data([]);
            }

            dlgDocumentSearch.data("kendoWindow").close();

            $("#kg_popup").data("kendoWindow").close();
            //$("#divAssocatedDocuments").show();
        });

        var extractValue = function(entry) {
            try {
                return JSON.stringify(entry.innerText).replace(/"/g, "");
            } catch (err) {
                return "";
            }
        };

        var getAttachmentCounted = function(gridid) {
            console.log("hitting getAttachmentCounted, gridid: ", gridid);
            var grid = $("#" + gridid).data("kendoGrid");
            return grid.dataSource.data().length;
        };

        getHandle("#btnCancelDocumentSearch").click(function (e) {
            e.preventDefault();
            console.log("btnCancelDocumentSearch clicked");
            dlgDocumentSearch.data("kendoWindow").close();
        });

        //intercepting value from supplier popup
        getHandle("#searchSupplierIdSelect").click(function (e) {
            e.preventDefault();
            //console.log("searchSupplierIdSelect clicked");

            var grid = $("#gdSearchSupplier").data("kendoGrid");
            if (grid.dataSource.total() == 0) {
                //$("#popupSupplierSearch").modal("hide");
                //alert("No row selected");
                return;
            }
            var data = grid.dataItem(grid.select());
            if (data == null) {
                alert("No row selected");
                return;
            }
            //console.log("data.id + ", " + data.Name: " + data.id + ", " + data.Name);
            getHandle("#txtSearchSupplierId").val(data.id + ", " + data.Name);

        });


        getHandle("#btnCancelSupplierSearch").click(function (e) {
            e.preventDefault();
            console.log("btnCancelSupplierSearch clicked");
        });

        getHandle("#SearchResultGridDiv").on("click", function (e) {
            e.preventDefault();
            console.log("SearchResultGridDiv singly clicked");
        });

        getHandle("#SearchResultGridDiv").on('dblclick', 'table tr', function (e) {
            e.preventDefault();
            e.preventBubble();
            console.log("SearchResultGridDiv doubly clicked");
            handleAddDocument();
        });

        //------------------------------end of secondary layer event handlers-----------------------------------

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

        function getParsedDate(d)
        {
            var dt = "";
            if (kendo.parseDate(d, "yyyy/MM/dd") != null) {
                dt = kendo.parseDate(d, "yyyy/MM/dd");
            }
            return dt;
        }


        function getDocumentData(idata) {
            console.log("hitting getDocumentData with ", idata);
            var url = getUrl("Operations", "Operations/Document/GetSingleDocumentEssential");
            console.log("getDocumentData, idata: ", idata);
            $.post(url, { documentId: idata.DocumentId, revisionId: idata.RevisionId }, function (data) {
                console.log("getDocumentData, data: ", data);
                return data;
            });
            return null;
        }

        function addToGridHelper(grid, gridDs, itm) {
            if (!hasGridContain2(grid, itm.ReferenceId)) {
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
        }

        //typical search text
        //{"ReferenceId":"","DocumentTypeId":"","DocumentLanguageId":"2","DocumentRegionId":"","PartNumber":"","UPC":"","SupplierId":null,"RevisionTitle":"","SearchOption":"0","LatestRevisionOnly":false}
        //Response Headersview source
        function loadExistingChildren(gridid) {
            console.log("hitting loadExistingChildren");
            var grid = $("#" + gridid).data("kendoGrid");
            var gridDs = grid.dataSource;
            console.log("gridDs: ", gridDs);

            if ($("#gdAssocatedDocuments").data("kendoGrid") != undefined && $("#gdAssocatedDocuments").data("kendoGrid").dataSource.data().length > 0) {
                //gridDs.filter([]);
                gridDs.data([]);
                $.each($("#gdAssocatedDocuments").data("kendoGrid").dataSource.data(), function (idx, itm) {
                    console.log("itm: ", itm);
                    addToGridHelper(grid, gridDs, itm);
                });
                console.log("within loadExistingChildren, done copying");
                return 0;
            }
            
            var cids = ($("#ListOfChildDocumentId").val() == undefined) ? "" : $("#ListOfChildDocumentId").val();
            if (cids.length < 0) {
                console.log("exiting loadExistingChildren due to no children to load");
                return 0;
            }
            
            var url = getUrl("Operations", "Operations/Document/GetDocumentResultForKitAndGroupEx");
            var docId = $("input#DocumentID.doc-ref-id").val();
            var vSearchText = getDocumentQueryParam(docId);
            console.log("vSearchText2: ", vSearchText);
            $.post(url, { searchText: vSearchText, listOfChildDocumentId: JSON.stringify(cids) }, function (selectedDataList) {
                $.each(selectedDataList, function (idx, selectedDataItem){
                    console.log("within loadExistingChildren after post, selectedDataItem2: ", selectedDataItem);
                    addToGridHelper(grid, gridDs, selectedDataItem);
                });
            });

            console.log("exiting loadExistingChildren done children load");
            return 1;
        };

        var disembleKitOrGroup = function (vContainerTypeId) {
            //delete this kit's component and cover sheet
            console.log("delete this kit's component");
            var url = getUrl("Operations", "Operations/Document/DocumentKitAndGroup_Update");
            $.post(url, {
                parentDocumentId: $("input#DocumentID.doc-ref-id").val(),
                containerTypeId: vContainerTypeId,
                childDocumentIdSet: JSON.stringify([]),
                kitGroupContainerId: -1
            }, function(data) {
                console.log("after posted after kit destroy, data: ", data);

                //redirect to the doc main
                doDocumentSearch();
            });
        };

        //--------------------------end of kit and group implementation---------------------------------
        var handleAddDocument = function () {
            //add the select records to container grid
            console.log("hitting handleAddDocument");
            var parent = getHandle("#gdSearchDocument").data("kendoGrid");
            if (parent == null) {
                console.log("handleAddDocument parent is null");
                return;
            }

            var selectedRows = parent.select();
            console.log("handleAddDocument selected rows: ", selectedRows);
            console.log("handleAddDocument # of selected rows: ", selectedRows.length);

            selectedRows.each(function (index, row) {
                var selectedDataItem;
                try {
                    selectedDataItem = parent.dataItem(row);
                    console.log("try, selectedDataItem: ", selectedDataItem);
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
                        ConfirmationDate: "",
                    };
                    $.each(selectedRows[index].childNodes, function (idx, entry) {
                        console.log("idx: ", idx);
                        console.log("entry: ", entry);
                        if (idx == 1) {
                            selectedDataItem.ReferenceId = extractValue(entry);
                        } else if (idx == 3) {
                            selectedDataItem.RevisionTitle = extractValue(entry);
                        } else if (idx == 4) {
                            selectedDataItem.SupplierName = extractValue(entry);
                        } else if (idx == 5) {
                            selectedDataItem.LanguageDescription = extractValue(entry);
                        } else if (idx == 6) { 
                            selectedDataItem.DocumentTypeDescription = extractValue(entry);
                        } else if (idx == 7) { 
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
                if (selectedDataItem == null) {
                    alert("No row selected");
                    return;
                }
                console.log("handleAddDocument adding to source grid with selectedDataItem: ", selectedDataItem);
                console.log("handleAddDocument adding to source grid with gridid: ", $("#whichGridToAdd").val());
                addToChildGrid($("#whichGridToAdd").val(), selectedDataItem);
            });

            if (shouldPostToServer()) {
                dispatch2($("#whichGridToAdd").val(), inferContainerTypeId($("#whichGridToAdd").val()));
            }

            //clearn up the doc search model pupup
            var dlgDocumentSearch = $("#documentSearchWindow_kg");
            if (dlgDocumentSearch.data("kendoWindow") && dlgDocumentSearch.data("kendoWindow").dataSource) {
                dlgDocumentSearch.data("kendoWindow").dataSource.filter({});
                dlgDocumentSearch.data("kendoWindow").dataSource.data([]);
            }

            dlgDocumentSearch.data("kendoWindow").close();

            //update the kgAttachment
            $("#btnViewAndUpdateAttachments").html("Kit Components (" + getAttachmentCounted($("#whichGridToAdd").val()) + ")");
            console.log("exiting handleAddDocument");
        };

        var initKitAndGroup = function () {
            var dlgDocumentSearch = $("#documentSearchWindow_kg");
            //var supplierSearchDialog = $("#supplierSearchWindow");

            var url = getUrl("Operations", "Operations/Document/PlugInSupplierSearch");
            $.post(url, { supplierId: 0 }, function (data) {
                //console.log("retrieved data for supplier plugin: ", data);
                $("#supplierSearchWindow #dgSupplierPlugIn").html(data);
            });

            url = getUrl("Operations", "Operations/Document/SearchDocumentContent");
            $.post(url, { supplierId: 0 }, function (data) {
                //console.log("retrieved data for search doc content: ", data);
                $("#dgDocumentPlugIn").html(data);
            });


            $("#divParent").hide();
            $("#divKitSibling").hide();
            $("#divGroupSibling").hide();

            //clearData();
            //uncheckAndHideAll();

            //TODO: bring back group and childrens
            //bring back the kit component
            if ($("#ParentDocumentId").val().length <= 0 || $("#ParentDocumentId").val() == "0") {
                var docId = $("input#DocumentID.doc-ref-id").val();
                if (docId != undefined && docId && docId.length > 0) {
                    $("#ParentDocumentId").val(docId);
                    console.log("manually correct the parent document id to ", $("#ParentDocumentId").val());
                }
            }

            console.log("initKitAndGroup, to fillup kg content");
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
                console.log("clearDocumentBtn clicked");
                clearData();
            });

            $(document).on('click', "#documentSearchWindow_kg #searchDocumentBtn", function (e) {
                e.preventDefault();
                console.log("searchDocumentBtn clicked");
                var grid = getHandle("#gdSearchDocument").data("kendoGrid");
                if (grid != null) {
                    grid.dataSource.page(1);
                    grid.dataSource.read();
                }
            });

            $(document).on('click', "#documentSearchWindow_kg #addNewDocumentBtn2", function (e) {
                console.log("to add new doc clicked");
                var currenturl = window.location.href;
                var indexArea = currenturl.substring(0, currenturl.indexOf('Document/DocumentMain'));
                var url = indexArea + "/Document/LoadSingleDocument?documentId=0&revisionId=0";
                window.open(url, "_blank");
            });

            $(document).on('click', "#documentSearchWindow_kg #titleDropDown", function (e) {
                e.preventDefault();
                console.log("drop down near txtRevisionTitle clicked");
                if (dsSearchOption == undefined || dsSearchOption == null) {
                    console.log("dsSearchOption is null or undefined.");
                    return;
                }

                console.log("within initKitAndGroup, dsSearchOption: ", dsSearchOption);
                kendo.bind(getHandle("#searchTtileOptionDiv"), dsSearchOption);
                getHandle("#searchTtileOptionDiv").show();
            });

            $(document).on('click', "#documentSearchWindow_kg #searchSupplierIdBtn", function (e) {
                e.preventDefault();
                console.log("searchSupplierIdBtn clicked");

                showSupplierPlugIn("documentSearchWindow_kg #txtSearchSupplierId");

                //cope with the deficiency
                $(document).on('dblclick', 'table tr', "#gdSearchSupplier", selectSupplier);
            });


            getHandle("#searchDocumentIdSelect").click(function (e) {
                e.preventDefault();
                console.log("searchDocumentIdSelect or attach clicked");
                handleAddDocument();
            });


            getHandle("#btnCancelDocumentSearch").click(function (e) {
                e.preventDefault();
                console.log("btnCancelDocumentSearch clicked");
                dlgDocumentSearch.data("kendoWindow").close();
            });

            //intercepting value from supplier popup
            getHandle("#searchSupplierIdSelect").click(function (e) {
                e.preventDefault();
                //console.log("searchSupplierIdSelect clicked");

                var grid = $("#gdSearchSupplier").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    //$("#popupSupplierSearch").modal("hide");
                    //alert("No row selected");
                    return;
                }
                var data = grid.dataItem(grid.select());
                if (data == null) {
                    alert("No row selected");
                    return;
                }
                //console.log("data.id + ", " + data.Name: " + data.id + ", " + data.Name);
                getHandle("#txtSearchSupplierId").val(data.id + ", " + data.Name);

            });


            getHandle("#btnCancelSupplierSearch").click(function (e) {
                e.preventDefault();
                console.log("btnCancelSupplierSearch clicked");
            });

            getHandle("#SearchResultGridDiv").on("click", function (e) {
                e.preventDefault();
                console.log("SearchResultGridDiv singly clicked");
            });

            getHandle("#SearchResultGridDiv").on('dblclick', 'table tr', function (e) {
                e.preventDefault();
                console.log("SearchResultGridDiv doubly clicked");
                handleAddDocument();
            });


            $('#addDocToKitBtn').click(function (e) {
                e.preventDefault();
                console.log("addDocToKitBtn clicked");
                $("#whichGridToAdd").val("gdKitSibling");
                getHandle("#documentModalPopup").show();
                setupDropDowns();
                //dlgDocumentSearch.data("kendoWindow").dataSource.filter({});
                //dlgDocumentSearch.data("kendoWindow").dataSource.data([]);
                dlgDocumentSearch.data("kendoWindow").center();
                dlgDocumentSearch.data("kendoWindow").open();
            });

            $('#addDocToGroupBtn').click(function (e) {
                e.preventDefault();
                $("#whichGridToAdd").val("gdGroupSibling");

                getHandle("#documentModalPopup").show();
                setupDropDowns();
                //dlgDocumentSearch.data("kendoWindow").dataSource.filter({});
                //dlgDocumentSearch.data("kendoWindow").dataSource.data([]);
                dlgDocumentSearch.data("kendoWindow").center();
                dlgDocumentSearch.data("kendoWindow").open();

                ////Create new element of group using single document popup + the rule without attachment.
                //var url = getUrl("Operations", "Operations/Document/LoadSingleDocumentForAddingGroupElement");
                //var did = 0;
                //var rid = 0;
                //var pid = $("#ParentDocumentId").val();
                //var prid = $("#RevisionID").val();
                //url += "?documentId=" + did + "&revisionId=" + rid + "&documentCreationIntention=31&parentDocumentId=" + pid + "&parentRevisionId=" + prid;
                //console.log("to create element with url: ", url);
                //window.open(url, "_blank");
                //
            });

            $('#btnContainerSave').click(function (e) {
                e.preventDefault();

                console.log("btnContainerSave clicked");
                var ad = $("#gdAssocatedDocuments");

                //copy the cached document lists to divAssociatedDocuments
                var parent = ad.data("kendoGrid");
                if (parent == null) {
                    console.log("error: parent is null!!");
                    return;
                }

                var child = $("#" + $("#whichGridToAdd").val()).data("kendoGrid");
                console.log("btnContainerSave child: ", child);
                if (child) {
                    var dataSource = child.dataSource;
                    var filters = dataSource.filter();
                    var allData = dataSource.data();
                    var query = new kendo.data.Query(allData);
                    var filteredData = query.filter(filters).data;

                    console.log("before parent.dataSource: ", parent.dataSource);
                    $.each(filteredData, function (index, selectedDataItem) {
                        console.log("selectedDataItem: ", selectedDataItem);
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
                    console.log("after addition parent.dataSource: ", parent.dataSource);

                    dataSource.filter({});
                    dataSource.data([]);
                }

                dlgDocumentSearch.data("kendoWindow").close();

                $("#kg_popup").data("kendoWindow").close();
                //$("#divAssocatedDocuments").show();
            });

            $('#btnContainerCancel').click(function (e) {
                console.log("btnContainerCancel clicked");
                //$("#divAssocatedDocuments").show();

                var grid = $("#" + $("#whichGridToAdd").val()).data("kendoGrid");
                var popup = $("#kg_popup").data("kendoWindow");
                if (grid && grid.dataSource && grid.dataSource.data().length > 0) {
                    if (confirm("You choose to discard the documents attached. However, the chosen container type requires attachments. Do you want to come back to revisit it later?")) {
                        dlgDocumentSearch.data("kendoWindow").close();
                        if(popup)
                            popup.close();
                        grid.dataSource.data([]);
                        $("#btnViewAndUpdateAttachments").html("Attachments()");
                    } else {
                        return;
                    }
                }

                dlgDocumentSearch.data("kendoWindow").close();
                if (popup)
                    popup.close();
                grid.dataSource.data([]);
            });


            console.log("set view doc in kit link");
            $('#gdKitSibling').click(function (e) {
                e.preventDefault();

                if ($("#canViewConstituentDocument").val() != "0") {
                    var grid = $("#gdKitSibling").data("kendoGrid");
                    var url = getUrl("Operations", "Operations/Document/LoadSingleDocument");
                    var data = grid.dataItem(grid.select());
                    if (data != undefined) {
                        console.log("gdKitSibling clicked, selected data: ", data);
                        var did = data.ReferenceId;
                        var rid = data.RevisionId;
                        url += "?documentId=" + did + "&revisionId=" + rid;
                        console.log("to view kit component with url: ", url);
                        window.open(url, "_blank");
                    }
                }

                $("#canViewConstituentDocument").val("1");
            });


            console.log("exing initKitAndGroup");
        };

        //Expose to public

        return {
            loadSupplierPlugIn: loadSupplierPlugIn,
            showSupplierPlugIn: showSupplierPlugIn,
            hideSupplierPlugIn: hideSupplierPlugIn,
            onExpand: onExpand,
            onDataBound: onDataBound,
            onDisplayError: onDisplayError,
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
            setUnknownManufacturer: setUnknownManufacturer,
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
            OnddlContainerTypeSelect: OnddlContainerTypeSelect,
            onIUserInfo: onIUserInfo,

            selectSupplier: selectSupplier,
            viewSingleSupplier: viewSingleSupplier,

            //------start of kit and group implementation------
            checkAttachmentsBeforeSave: checkAttachmentsBeforeSave,
            customDeleteAttachment: customDeleteAttachment,
            currentRevisionId: currentRevisionId,
            viewAndUpdateAttachments: viewAndUpdateAttachments,
            onContainerTypeIdChange: onContainerTypeIdChange,


            onCustomCommand: onCustomCommand,
            collectDataToDelete: collectDataToDelete,
            documentQuery_kg: documentQuery_kg,
            OngdSearchDocumentChange: OngdSearchDocumentChange,
            ongdWorkLoadItemChange: ongdWorkLoadItemChange,
            getHandle: getHandle,
            extractValue: extractValue,
            addToChildGrid: addToChildGrid,
            getAttachmentCounted: getAttachmentCounted,
            getUrl: getUrl,
            fillUpKGContent: fillUpKGContent,
            shouldPostToServer: shouldPostToServer,
            clearData: clearData,
            setupDropDowns: setupDropDowns,
            disembleKitOrGroup: disembleKitOrGroup,

            handleAddDocument: handleAddDocument,
            initKitAndGroup: initKitAndGroup,

            //------end of kit and group implementation------
        };
    };

    //Initialize
    $(function () {
        $("#DocumentDetail").hide();
        $("#eeeSideBar").sidemenu();
        menuHelper.turnMenuActive($("#menuOperations"));
    });

})(jQuery);


