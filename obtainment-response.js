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

        var controllerCalls = {
            SearchResponse: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/SearchInboundResponse",
        };

        inboundResponseSearchSection.on("click", UIObject.controls.buttons.SearchResponseButton, function () {
            var noticId = $("#divSearchSection " + UIObject.controls.textBoxes.NoticeNumber).val();
            var supplierName = $("#divSearchSection " + UIObject.controls.textBoxes.SupplierName).val();

            //create requestSearchModel to be passed to the controller
            //obtainmentWorkLoadSearchResultModel.NoticeNumber = "" ? 0 : drpTeams.value();
            //obtainmentWorkLoadSearchResultModel.SupplierId = drpLang.value() == "" ? 0 : drpLang.value();

            //ObtainmentResponseSearchModel.HasValue = noticId.NoticeNumber == "" || supplierName == "";
            var ObtainmentResponseSearchModel = {};
            ObtainmentResponseSearchModel.HasValue = 2;

    
            //Always do the search regardless of values
            $(this).ajaxCall(controllerCalls.SearchResponse, { searchCriteria: JSON.stringify(ObtainmentResponseSearchModel) })
                   .success(function (data) {
                       responseDetailGridSection.html(data);
                       //DisableEnableButtons(true);
                   }).error(
                   function () {
                       $(this).displayError(messages.errorMessages.GeneralError);
                   });

            //if (obtainmentWorkLoadSearchResultModel.HasFilter > 0) {
            ////    DisableEnableButtons(false);

            ////    kendo.ui.progress(obtainmentDetailObj, true);
            //    $(this).ajaxCall(controllerCalls.SearchRequests, { searchCriteria: JSON.stringify(obtainmentWorkLoadSearchResultModel) })
            //        .success(function (data) {
            //            obtainmentDetailObj.html(data);
            //            DisableEnableButtons(true);
            //        }).error(
            //        function () {
            //            $(this).displayError(messages.errorMessages.GeneralError);
            //        });
            //}
            //else
            //    $(this).displayError(messages.errorMessages.SelectFilter);
        });
        return {
            PanelLoadCompleted: function (e) { $(e.item).find("a.k-link").remove(); var selector = "#" + e.item.id; $(selector).parent().find("li").remove(); },
            InboundResponseSearch: function () { UIObject.controls.grids.InboundResponse().dataSource.read(); }
        };
    };
})(jQuery);
