; (function ($) {
    if ($.fn.complibObtainmentResponse == null) {
        $.fn.complibObtainmentResponse = {};
    }

    $.fn.complibObtainmentResponse = function () {
        var UIObject = {
            sections: {
                inboundResponseSearchSection: function () { return $("#divObtainmentResponseSearchSection") },
                responseDetailGridSection: function () { return $("#ReponseDetail") },
                supplierSearchFootSection: function () { return $("#supplierSearchFootSection") },
            },
            controls: {
                grids: {
                    InboundResponse: function () { return $("#gdInboundResponse").data("kendoGrid") },
                    SearchSupplier: function () { return $("#gdSearchSupplier").data("kendoGrid") },
                },              
                textBoxes: {
                    NoticeNumber: function () { return $("#NoticeNumber") },
                    SupplierNameAndId: function () { return $("#SupplierNameAndId") }
                }
            },
            popWindow : {
                supplierSearchDialog: function () { return $("#supplierSearchWindow").data("kendoWindow") }
            },

            controllerCalls: {
                SearchResponse: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/SearchInboundResponse",
                SearchSupplierInfo: GetEnvironmentLocation() + "/Operations/Company/LookUpSupplierOnKeyEnter",
                LoadSingleSupplier: GetEnvironmentLocation() + "/Operations/Company/LoadSingleSupplier?",
                LoadSupplierPlugIn: GetEnvironmentLocation() + "/Operations/Document/PlugInSupplierSearchAlt",
            },
            warnings: {
                NoRowSelected: "No row selected, please try again."
            }

        }

        var Initialize = function () {
            InitializeSearch();
        };

        var SearchBind = function () {
            var viewModel = kendo.observable({
                NoticeNumber: "",
                SupplierNameAndId: "", 
                SupplierId: 0,
                SupplierName: "",

                SearchClick: function (e) {
                    e.preventDefault();
                    kendo.ui.progress(UIObject.sections.responseDetailGridSection(), true);
                    $(this).ajaxCall(UIObject.controllerCalls.SearchResponse, { searchCriteria: JSON.stringify(this) })
                           .success(function (data) {
                               UIObject.sections.responseDetailGridSection().html(data);
                               //DisableEnableButtons(true);
                           }).error(
                           function () {
                               $(this).displayError(messages.errorMessages.GeneralError);
                                });

                },

                ClearClick: function (e) {
                    e.preventDefault();
                    this.set("NoticeNumber", "");
                    this.set("SupplierNameAndId", "");
                },

                CloseSupplierClick: function (e) {
                    e.preventDefault();
                    UIObject.popWindow.supplierSearchDialog().center().close();
                },

                SelectSupplierClick: function (e) {
                    e.preventDefault();
                    if (UIObject.controls.grids.SearchSupplier().dataSource.total() == 0)                    
                    {
                        onDisplayError(UIObject.warnings.NoRowSelected);
                        return;
                    }

                    var item = UIObject.controls.grids.SearchSupplier().dataItem(UIObject.controls.grids.SearchSupplier().select());
                    if (item == null)
                    {
                        onDisplayError(UIObject.warnings.NoRowSelected);
                        return;
                    }

                    viewModel.set("SupplierNameAndId", item.CompanyId + ", " + item.Name)
                    viewModel.set("SupplierId", item.CompanyId)
                    UIObject.popWindow.supplierSearchDialog().center().close();
                },

                
                //SelectSupplier : function () {
                //    var grid = $("#gdSearchSupplier").data("kendoGrid");
                //    if (grid.dataSource.total() == 0) {
                //        hideSupplierPlugIn();
                //        onDisplayError("No row selected");
                //        return;
                //    }
                //    var data = grid.dataItem(grid.select());
                //    if (data == null) {
                //        hideSupplierPlugIn();
                //        onDisplayError("No row selected");
                //        return;
                //    }
        
                //    $("#txtSupplierId").val(data.id + ", " + data.Name);
                //    hideSupplierPlugIn();
                //},


                onSearchSupplierClick: function (e) {
                    e.preventDefault();
                    UIObject.popWindow.supplierSearchDialog().center().open();
                },

                onViewSupplierClick: function (e) {
                    e.preventDefault();
                    var supplierId = viewModel.get("SupplierId");

                    if (supplierId > 0)
                        window.open(UIObject.controllerCalls.LoadSingleSupplier + "supplierId=" + supplierId, "_blank");
                }
            });

            kendo.bind(UIObject.sections.inboundResponseSearchSection(), viewModel);
            kendo.bind(UIObject.sections.supplierSearchFootSection(), viewModel);


            UIObject.controls.textBoxes.SupplierNameAndId().keyup(function (e1) {
                var code = (e1.keyCode ? e1.keyCode : e1.which);
                if (code == 13) //Search only on enter
                    viewModel.set("SupplierId", viewModel.get("SupplierNameAndId"));
                    $.post(UIObject.controllerCalls.SearchSupplierInfo, { supplierInfo: viewModel.get("SupplierNameAndId") }, function (data) {
                         viewModel.set("SupplierNameAndId", data);
                    });
            });

        };
     
        function InitializeSearch() {
            UIObject.controls.grids.InboundResponse().dataSource.read();
        };

        var loadSupplierPlugIn = function () {
            $.post(UIObject.controllerCalls.LoadSupplierPlugIn, { supplierId: 0 }, function (data) {
                $("#dgSupplierPlugIn").html(data);
            });
        };

        return {
            PanelLoadCompleted: function (e) { $(e.item).find("a.k-link").remove(); var selector = "#" + e.item.id; $(selector).parent().find("li").remove(); },
            Initialize: Initialize,
            SearchBind: SearchBind,
            loadSupplierPlugIn: loadSupplierPlugIn,
            closeSupplierSearchWindow: function InitializeSearch() { UIObject.popWindow.supplierSearchDialog().close(); }
        };
    };
})(jQuery);
