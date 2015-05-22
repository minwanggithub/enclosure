; (function ($) {
    if ($.fn.complibObtainmentResponse == null) {
        $.fn.complibObtainmentResponse = {};

    }
    $.fn.complibObtainmentResponse = function () {
        ////var obtainmentResponseObj = $("#DetailObtianment");

        var obtainmentObject = {
            controls: {
                grids: {
                },
                buttons: {
                    ClearRequestSearchButton: "#clearResponseSearchBtn",
                    SearchRequestsButton: "#searchResponseBtn",
                },
                textBoxes: {
                    NoticeNumber: "#txtNoticeNumber",
                    SupplierName: "#txtSupplierName"
                }
            }
        }

        //obtainmentSearchObj.on("click", obtainmentObject.controls.buttons.SearchRequestsButton, function () {
        //    var noticId = $("#divSearchSection " + obtainmentObject.controls.textBoxes.NoticeNumber).val();
        //    var supplierName = $("#divSearchSection " + obtainmentObject.controls.textBoxes.SupplierName).val();

        //    //create requestSearchModel to be passed to the controller
        //    //obtainmentWorkLoadSearchResultModel.NoticeNumber = "" ? 0 : drpTeams.value();
        //    //obtainmentWorkLoadSearchResultModel.SupplierId = drpLang.value() == "" ? 0 : drpLang.value();

        //    //obtainmentWorkLoadSearchResultModel.HasFilter = obtainmentWorkLoadSearchResultModel.NoticeNumber + obtainmentWorkLoadSearchResultModel.SupplierId;

        //    //if (obtainmentWorkLoadSearchResultModel.HasFilter > 0) {
        //    //    DisableEnableButtons(false);

        //    //    kendo.ui.progress(obtainmentDetailObj, true);
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

        };
    };
})(jQuery);
