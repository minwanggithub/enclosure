; (function ($) {
    if ($.fn.complibObtainmentResponse == null) {
        $.fn.complibObtainmentResponse = {};
    }

    $.fn.complibObtainmentResponse = function () {
        var responseSearchObj = $("#ReponseDetail");
        var inboundResponseSearchSection = $("#InboundResponseSearchSection");
        var responseDetailGridSection = $("#ReponseDetail");

        var UIObject = {
            controls: {
                grids: {
                    InboundResponse: function () { return $("#gdInboundResponse").data("kendoGrid") }
                },
                buttons: {
                    ClearResponseSearchButton: "#clearResponseSearchBtn",
                    SearchResponseButton: "#searchResponseBtn",
                },
                textBoxes: {
                    NoticeNumber: "#txtNoticeNumber",
                    SupplierName: "#txtSupplierName"
                }
            }
        }

        var Initialize = function () {
            InitializeSearch();
        };

        var SearchBind = function () {
            var viewModel = kendo.observable({
                NoticeNumber: "Ref25",
                SupplierNameAndId: "61514,Unknown Manufacturer / Manufacturier Inconnu",

                SearchClick: function (e) {
                    e.preventDefault();
                    //$.post(url, { searchCriteria: searchCriteriaData }, function (data) {
                    //    $('#page-wrapper').html(data);
                    //});
                    kendo.ui.progress(responseDetailGridSection, true);
                    $(this).ajaxCall(controllerCalls.SearchResponse, { searchCriteria: JSON.stringify(this) })
                           .success(function (data) {
                               responseDetailGridSection.html(data);
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
                    alert("supplier view clicked");
                }
            });

            viewModel.bind('change', function (e) {
                console.log(e.field + ' changed to ' + this[e.field]);
            });

            kendo.bind($("#divObtainmentResponseSearchSection"), viewModel);
        };

     
        function InitializeSearch() {
            UIObject.controls.grids.InboundResponse().dataSource.read();
        };

        var controllerCalls = {
            SearchResponse: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/SearchInboundResponse",
        };

        //inboundResponseSearchSection.on("click", UIObject.controls.buttons.SearchResponseButton, function () {
        //    var noticId = $("#divSearchSection " + UIObject.controls.textBoxes.NoticeNumber).val();
        //    var supplierName = $("#divSearchSection " + UIObject.controls.textBoxes.SupplierName).val();

        //    //create requestSearchModel to be passed to the controller
        //    //obtainmentWorkLoadSearchResultModel.NoticeNumber = "" ? 0 : drpTeams.value();
        //    //obtainmentWorkLoadSearchResultModel.SupplierId = drpLang.value() == "" ? 0 : drpLang.value();

        //    //ObtainmentResponseSearchModel.HasValue = noticId.NoticeNumber == "" || supplierName == "";
        //    var ObtainmentResponseSearchModel = {};
        //    ObtainmentResponseSearchModel.HasValue = 2;

    
        //    //Always do the search regardless of values
        //    kendo.ui.progress(responseDetailGridSection, true);
        //    $(this).ajaxCall(controllerCalls.SearchResponse, { searchCriteria: JSON.stringify(ObtainmentResponseSearchModel) })
        //           .success(function (data) {
        //               responseDetailGridSection.html(data);
        //               //DisableEnableButtons(true);
        //           }).error(
        //           function () {
        //               $(this).displayError(messages.errorMessages.GeneralError);
        //           });

        //    //if (obtainmentWorkLoadSearchResultModel.HasFilter > 0) {
        //    ////    DisableEnableButtons(false);

        //    ////    kendo.ui.progress(obtainmentDetailObj, true);
        //    //    $(this).ajaxCall(controllerCalls.SearchRequests, { searchCriteria: JSON.stringify(obtainmentWorkLoadSearchResultModel) })
        //    //        .success(function (data) {
        //    //            obtainmentDetailObj.html(data);
        //    //            DisableEnableButtons(true);
        //    //        }).error(
        //    //        function () {
        //    //            $(this).displayError(messages.errorMessages.GeneralError);
        //    //        });
        //    //}
        //    //else
        //    //    $(this).displayError(messages.errorMessages.SelectFilter);
        //});


        return {
            PanelLoadCompleted: function (e) { $(e.item).find("a.k-link").remove(); var selector = "#" + e.item.id; $(selector).parent().find("li").remove(); },
            Initialize: Initialize,
            SearchBind: SearchBind
        };
    };
})(jQuery);
