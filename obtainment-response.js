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
                    NoticeNumberObj: function () { return $("#NoticeNumber") },
                    NoticeNumberObjField: "NoticeNumber",
                    SupplierNameAndIdObj: function () { return $("#SupplierNameAndId") },
                    SupplierNameAndIdObjField: "SupplierNameAndId",
                    SupplierIdObjField: "SupplierId",
                },                
            },
            popWindow : {
                supplierSearchDialog: function () { return $("#supplierSearchWindow").data("kendoWindow") },
                supplierPlugIn: function () { return $("#dgSupplierPlugIn") },         
            },

            controllerCalls: {
                SearchResponse: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/SearchInboundResponse",
                SearchSupplierInfo: GetEnvironmentLocation() + "/Operations/Company/LookUpSupplierOnKeyEnter",
                LoadSingleSupplier: GetEnvironmentLocation() + "/Operations/Company/LoadSingleSupplier?",
                LoadSupplierPlugIn: GetEnvironmentLocation() + "/Operations/Document/PlugInSupplierSearchAlt",
                NoticeAutoComplete: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/GetNoticeNumberSelect",
            },
            warnings: {
                NoRowSelected: "No row selected, please try again.",
                NoSearchCriteria: "No search criteria entered."
            },
            errorMessage: {
                GeneralError: "Error Occurred on server call."
            },
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
                    if (this.NoSearchCriteria())
                    {
                        $(this).displayError(UIObject.warnings.NoSearchCriteria);
                        return;
                    }

                    kendo.ui.progress(UIObject.sections.responseDetailGridSection(), true);                    
                    $(this).ajaxCall(UIObject.controllerCalls.SearchResponse, { searchCriteria: JSON.stringify(this) })
                           .success(function (data) {
                               UIObject.sections.responseDetailGridSection().html(data);
                               //DisableEnableButtons(true);
                           }).error(
                           function () {
                               $(this).displayError(UIObject.errorMessage.GeneralError);
                                });

                },

                ClearClick: function (e) {
                    e.preventDefault();
                    this.set(UIObject.controls.textBoxes.NoticeNumberObjField, "");
                    this.set(UIObject.controls.textBoxes.SupplierNameAndIdObjField, "");
                    this.set(UIObject.controls.textBoxes.SupplierIdObjField, 0);

                    var inboundGrid = UIObject.controls.grids.InboundResponse
                    if (inboundGrid().dataSource.total() > 0)
                         inboundGrid().dataSource.data([]);
                },

                CloseSupplierClick: function (e) {
                    e.preventDefault();
                    UIObject.popWindow.supplierSearchDialog().center().close();
                },

                NoSearchCriteria: function () {
                    var result = (this.SupplierNameAndId == "" && this.NoticeNumber == "")
                    return result;
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

                    viewModel.set(UIObject.controls.textBoxes.SupplierNameAndIdObjField, item.CompanyId + ", " + item.Name)
                    viewModel.set(UIObject.controls.textBoxes.SupplierIdObjField, item.CompanyId)
                    UIObject.popWindow.supplierSearchDialog().center().close();
                },

                onSearchSupplierClick: function (e) {
                    e.preventDefault();
                    UIObject.popWindow.supplierSearchDialog().center().open();
                },

                onViewSupplierClick: function (e) {
                    e.preventDefault();
                    var supplierId = viewModel.get(UIObject.controls.textBoxes.SupplierIdObjField);

                    if (supplierId > 0)
                        window.open(UIObject.controllerCalls.LoadSingleSupplier + "supplierId=" + supplierId, "_blank");
                }
            });

            kendo.bind(UIObject.sections.inboundResponseSearchSection(), viewModel);
            kendo.bind(UIObject.sections.supplierSearchFootSection(), viewModel);

            UIObject.controls.textBoxes.SupplierNameAndIdObj().keyup(function (e1) {
                var code = (e1.keyCode ? e1.keyCode : e1.which);
                if (code == 13) //Search only on enter
                    viewModel.set(UIObject.controls.textBoxes.SupplierIdObjField, viewModel.get(UIObject.controls.textBoxes.SupplierNameAndIdObjField));
                $.post(UIObject.controllerCalls.SearchSupplierInfo, { supplierInfo: viewModel.get(UIObject.controls.textBoxes.SupplierNameAndIdObjField) }, function (data) {
                    viewModel.set(UIObject.controls.textBoxes.SupplierNameAndIdObjField, data);
                    });
            });

            var noticObj = UIObject.controls.textBoxes.NoticeNumberObj().kendoAutoComplete({
                MinLength: 2,
                //dataTextField: "Text",
                filter: "startswith",
                dataSource: new kendo.data.DataSource({
                    transport: {
                        serverFiltering: true,
                        serverPaging:false,
                        read: {
                            url: UIObject.controllerCalls.NoticeAutoComplete,
                            type: "GET"
                        }
                    }
                }),
            });          
        };
     
        function InitializeSearch() {
            UIObject.controls.grids.InboundResponse().dataSource.read();
        };

        var loadSupplierPlugIn = function () {
            $.post(UIObject.controllerCalls.LoadSupplierPlugIn, { supplierId: 0 }, function (data) {
                UIObject.popWindow.supplierPlugIn().html(data);
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
