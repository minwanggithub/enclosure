; (function ($) {
    if ($.fn.complibWorkLoad == null) {
        $.fn.complibWorkLoad = {};
    }
    $.fn.complibWorkLoad = function () {
        var supplierSearchDialog;
        var activeSupplier;
        var currentRecordPerPage = 0;
        var currentRecord = 0;
        var currentPage = 1;
        var nextRecord = 0;
        var sortData = false;
        var sortDirection = "asc";
       
        menuHelper.turnMenuActive($("#menuOperations"));

        /******************************************* Supplier Plug In **********************************/
        //Public functions
        var loadSupplierPlugIn = function () {
           var url = "../Document/PlugInSupplierSearch";
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

        var onKeyUpSupplierPlugin = function(e, txtObj) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) { //Search only on enter
                var url = '../Company/LookUpSupplierOnKeyEnter';
                var supplierInfo = $("#" + txtObj).val();
                $.post(url, { supplierInfo: supplierInfo }, function (data) {
                    $("#" + txtObj).val(data);
                });
            }
        };

        $("#btnCancelSupplierSearch").click(function (e) {
            hideSupplierPlugIn();
        });

        //This is for Supplier plugIn
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
            //$("#txtSearchSupplierId").val(data.id + "," + data.Name);
            $("#" + activeSupplier).val(data.id + ", " + data.Name);

            hideSupplierPlugIn();
        });
        
        $("#dgSupplierPlugIn").dblclick('table tr', function () {
            var grid = $("#gdSearchSupplier").data("kendoGrid");
            if (grid.dataSource.total() == 0) {
            
                onDisplayError("No row selected");
                return;
            }
            var data = grid.dataItem(grid.select());
            if (data == null) {
                onDisplayError("No row selected");
                return;
            }
            
            $("#" + activeSupplier).val(data.id + ", " + data.Name);

            hideSupplierPlugIn();
        });
        

        /*********************************************** Ingredients ***********************************************************************/
        var InitializeIngredients = function()
        {
            var url = '../Indexation/GetIngredients';
            $.post(url, function (data) {
                $('#Ingredients').html(data);
            });
        };
       

        /***********************************************************************************************************************************/

        /*************************************** Arrows ************************************************************************************/
        $('html').keydown(function (e) {

            switch (e.which) {
                case 38: //up
                    MovePreviousRecord();
                    break;

                case 40: //down
                    MoveNextRecord();
                    break;

                    // exit this handler for other keys
                default: return;
            }

            // prevent the default action (scroll / move caret)
            e.preventDefault();
        });

        $("#DetailWorkLoad").on("click", "#prevRecord", function () {
            MovePreviousRecord();
        });

        $("#DetailWorkLoad").on("click", "#nextRecord", function () {
            MoveNextRecord();
        });

        ///************************************************************************///
        /* Event that is triggered when the previous button is clicked to move the
           record up the page                                                      */
        ///************************************************************************///
        function MovePreviousRecord() {
            var grid = $("#gdWorkLoadItem").data("kendoGrid");
            var id = grid.dataItem(grid.select());

            //if no row is selected don't do anything
            if (typeof id == 'undefined')
                return;

            var dataSource = grid.dataSource;
            
            var model = dataSource.get(id.DocumentId); // get the model
            var index = dataSource.indexOf(model); // get the index of the item into the DataSource
            var prev = 0;
            currentPage = dataSource.page();

            if (index == 0) {
                $("#prevRecord").addClass("k-state-disabled");
            } else {
                $("#prevRecord").remove("k-state-disabled");

                //calculation to see if we are at the top of the page
                var startOfPage = index % dataSource.pageSize();
                var currentPagePrev = (index / dataSource.pageSize());

                //check to see if the selected item is at the top of the page
                if (startOfPage == 0) {
                    //add one since the index is zero based
                    prev = index + 1;
                    dataSource.page(currentPagePrev);
                    grid.dataItem(grid.select("tr:eq(" + ((prev - 1) - (10 * (currentPagePrev)) + 10) + ")"));
                    currentPage = currentPagePrev;
                } else {
                    //if the index is above 9 means that this is another page and not the first
                    if (index > 9)
                        prev = index - (10 * (currentPage - 1));
                    else
                        prev = index;
                    grid.dataItem(grid.select("tr:eq(" + prev + ")"));
                }
            }
        }

        ///************************************************************************///
        /* Event that is triggered when the next button is clicked to move the
           record down the page                                                      */
        ///************************************************************************///
        function MoveNextRecord() {
            var grid = $("#gdWorkLoadItem").data("kendoGrid");
            var id = grid.dataItem(grid.select());

            //if no row is selected don't do anything
            if (typeof id == 'undefined')
                return;

            var dataSource = grid.dataSource;
            var model = dataSource.get(id.DocumentId); // get the model
            var index = dataSource.indexOf(model); // get the index of the item into the DataSource
           
            currentPage = dataSource.page();
            currentRecord = index;
            currentRecordPerPage = currentRecord + 1;
            var endOfPage = currentRecordPerPage % dataSource.pageSize();

            //the nextcord has to be added by 2 seems that this the only way the recod can move down, by one it will not respond
            nextRecord = index + 2;

            //check if the selected item is at the bottom of the page, if it is then change page and select the first record in that new page
            if (endOfPage == 0) {
                currentPage++;
                dataSource.page(currentPage);
                grid.dataItem(grid.select("tr:eq(" + (currentRecord - (currentRecord - 1)) + ")"));
                nextRecord = 0;
            } else {
                grid.dataItem(grid.select("tr:eq(" + (nextRecord - (10 * (currentPage - 1))) + ")"));
            }

            //remove the disable class of previous button of the cursor is in the second record of the whole grid
            //if (index == 1)
            //    ("#prevRecord").remove("k-state-disabled");
        };


        /*********************************************************************************************************/

        /************************************************ GHS ****************************************************/
        var onRegulatoryGHSActivate = function(e) {
            if ($(e.item).find("* > .k-link").text() == "GHS") {
                //alert($(e.item).find("> .k-link").text());
                setTimeout(function() {
                    if ($("#btnAddHazardClass").hasClass("k-state-disabled")) {
                        $("#DetailWorkLoad").off("click", "#btnAddHazardClass", fnAddHazardClass);
                    }
                    if ($("#btnAddGhsPictograms").hasClass("k-state-disabled")) {
                        $("#DetailWorkLoad").off("click", "#btnAddGhsPictograms", fnAddGhsPictograms);
                    }
                    if ($("#btnAddHazardStatement").hasClass("k-state-disabled")) {
                        $("#DetailWorkLoad").off("click", "#btnAddHazardStatement", fnAddHazardStatement);
                    }
                    if ($("#btnAddPrecautionaryStatement").hasClass("k-state-disabled")) {
                        $("#DetailWorkLoad").off("click", "#btnAddPrecautionaryStatement", fnAddPrecautionaryStatement);
                    }
                    if ($("#SearchBySignalWord").hasClass("k-state-disabled")) {
                        $("#DetailWorkLoad").off("click", "#SearchBySignalWord", fnSearchBySignalWord);
                    }
                }, 700);
            }
        };


        /*********************************************************************************************************/



        ///************************************************************************///
        /* Save Work Load Item                                                 */
        ///************************************************************************///

        $("#DetailWorkLoad").on("click", "#btnSaveWorkLoadItem", function (e) {
            var val;
            $("input:radio").each(function () {
                if ($(this).is(":checked")) {
                    val = this.value;
                }
            });

            var queryText = {
                DocumentId: $("#DocumentId").val(),
                DocumentTypeId: $("#ddlDocumentType").val(),
                DocumentLanguageId: $("#ddlLanguages").val(),
                RevisionTitle: $("#RevisionTitle").val(),
                RevisionId: $("#RevisionId").val(),
                RevisionDate: $("#RevisionDate").val(),
                ConfirmDate: $("#ConfirmDate").val(),
                DocumentIdentification: $("#DocIdentification").val(),
                DocumentVersion: $("#VersionNo").val(),
                ImageBad: val == "False" ? true : false,
                ImageGood: val == "True" ? true : false,
                ManufacturerName: $("#txtManufacturerId").val(),
                SupplierName: $("#txtSupplierId").val()
            };
            var url = "SaveWorkLoadItem";
            $.post(url, { jsWorkLoadItemModel: JSON.stringify(queryText) }, function (data) {
                if (data == '0')
                    alert('Error occured while saving the work load item details');
                else
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
            });

        });

        var gdWorkLoadItem_Change = function (e) {
            var selectedData = this.dataItem(this.select());
            if (typeof selectedData != 'undefined') {
                var documentId = selectedData.DocumentId;
                var revisionId = selectedData.RevisionId;
                onDetailWorkLoadItemClick(documentId, revisionId);
            }
        };

        function onDetailWorkLoadItemClick(documentId, revId) {
            var url = "GetWorkLoadDetail";
            $.post(url, { docId: documentId, revisionId: revId }, function (data) {
                $('#DetailWorkLoad').html(data);
            });
        }

        var getDocRevisionId = function() {
            var revisionId = $("#RevisionId").val();
            var documentId = $("#DocumentId").val();
            return {
                RevisionId: revisionId,
                DocumentId: documentId
            };
        };

        var getIndexationId = function () {
            var indexationId = $("#IndexationId").val();
            return {
                IndexationId: indexationId
            };
        };

        var onGridEditChangeTitle = function(e) {
            var update = $(e.container).parent().find(".k-grid-update");
            var cancel = $(e.container).parent().find(".k-grid-cancel");
            $(update).attr('title', 'Save');
            $(cancel).attr('title', 'Cancel');
        };

        var onSaveNameNumber = function(e) {
            var currentNameOrNumber = e.model.NameOrNumber;
            var data = this.dataSource.data();
            $.each(data, function(i, row) {
                if (i != 0 && currentNameOrNumber == row.NameOrNumber) {
                    alert("Duplicates not allowed");
                    e.preventDefault();
                    return false;
                }
                return true;
            });
        };

        //(SH) 4-22-2014
        var viewSingleSupplier = function (supplierId) {
            if (supplierId > 0) {
                var url = getUrl("Operations", "Operations/Company/LoadSingleSupplier?supplierId=" + supplierId);
                window.open(url, "_blank");
            }
        };

        //(SH) 4-22-2014
        function getUrl(area, controllerAndFunc) {
            var currenturl = window.location.href;
            var indexArea = currenturl.substring(0, currenturl.indexOf(area));
            var url = indexArea + controllerAndFunc;
            console.log("resulting url: ", url);
            return url;
        }

        //Expose to public

        return {
            InitializeIngredients: InitializeIngredients,
            loadSupplierPlugIn: loadSupplierPlugIn,
            showSupplierPlugIn: showSupplierPlugIn,
            onKeyUpSupplierPlugin: onKeyUpSupplierPlugin,
            hideSupplierPlugIn: hideSupplierPlugIn,
            onRegulatoryGHSActivate: onRegulatoryGHSActivate,
            getDocRevisionId: getDocRevisionId,
            getIndexationId: getIndexationId,
            onGridEditChangeTitle: onGridEditChangeTitle,
            onSaveNameNumber: onSaveNameNumber,
            ongdWorkLoadItemChange: gdWorkLoadItem_Change,
            getUrl: getUrl,
            viewSingleSupplier: viewSingleSupplier

        };

    };
})(jQuery);