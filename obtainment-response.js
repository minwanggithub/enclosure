; (function ($) {
    if ($.fn.complibObtainmentResponse == null) {
        $.fn.complibObtainmentResponse = {};
    }

    $.fn.complibObtainmentResponse = function () {
        var UIObject = {
            sections: {
                inboundResponseSearchSection: function () { return $("#divObtainmentResponseSearchSection") },
                responseDetailGridSection: function () { return $("#ReponseDetail") },
            },
            controls: {
                grids: {
                    InboundResponse: function () { return $("#gdInboundResponse").data("kendoGrid") }
                },
                //buttons: {
                //    ClearResponseSearchButton: "#clearResponseSearchBtn",
                //    SearchResponseButton: "#searchResponseBtn",
                //},
                textBoxes: {
                    NoticeNumber: function () { return $("#NoticeNumber") },
                    SupplierNameAndId: function () { return $("#SupplierNameAndId") }
                }
            },
            controllerCalls: {
                SearchResponse: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/SearchInboundResponse",
                SearchSupplierInfo: GetEnvironmentLocation() + "/Operations/Company/LookUpSupplierOnKeyEnter",
                LoadSingleSupplier: GetEnvironmentLocation() + "/Operations/Company/LoadSingleSupplier?",
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

                onSearchSupplierClick: function (e) {
                    e.preventDefault();
                    alert("supplier search clicked");
                },

                onViewSupplierClick: function (e) {
                    e.preventDefault();
                    var supplierId = viewModel.get("SupplierId");

                    if (supplierId > 0)
                        window.open(UIObject.controllerCalls.LoadSingleSupplier + "supplierId=" + supplierId, "_blank");
                }
            });

            kendo.bind(UIObject.sections.inboundResponseSearchSection(), viewModel);

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

        return {
            PanelLoadCompleted: function (e) { $(e.item).find("a.k-link").remove(); var selector = "#" + e.item.id; $(selector).parent().find("li").remove(); },
            Initialize: Initialize,
            SearchBind: SearchBind
        };
    };
})(jQuery);
