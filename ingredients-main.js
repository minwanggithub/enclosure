; (function ($) {
    if ($.fn.complibIngredients == null) {
        $.fn.complibIngredients = {};
    }
    $.fn.complibIngredients = function () {

        var ingredientDetailObj = $("#DetailIngredient");

        var StopPropagation = function (ctlName) {
            $("#" + ctlName).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
        };

        var IsReadOnlyMode = function () {
            //var spanobj = $("#SearchPanel").find("span.icon-lock.icon-white").length();
            return ($("#SearchPanel").find("span.icon-lock.icon-white").length == 1);
        };

        var gdSearchIngredient_Change = function (e) {
            var selectedData = this.dataItem(this.select());
            if (typeof selectedData != 'undefined') {
                var ingredientId = selectedData.IngredientId;
                onDetailIngredientItemClick(ingredientId);
            }
        };

        function onDetailIngredientItemClick(ingredientId) {
            var url = "GetIngredientDetail";
            $.post(url, { ingredientId: ingredientId}, function (data) {
                $('#DetailIngredient').html(data);
            });
        }

        var OnSelectIngredientTabstrip = function (e) {
            setTimeout(function () {
                $(e.contentElement).find(".k-splitter").each(function () {
                    $(this).data("kendoSplitter").trigger("resize");
                });
            }, 500);
        };

        //======Security group Read-Only Integration Section Starts
        var onIngredientActivate = function (e) {
            //alert($(e.item).find("> .k-link").text());
            if (IsReadOnlyMode() && $(e.item).find("* > .k-link").text() == "Ingredient") {
                //alert($(e.item).find("> .k-link").text());
                //Identification section
                setTimeout(function () {
                    $("#btnSaveIngredient").addClass("k-state-disabled");
                    $("#btnSaveIngredient").unbind('click');
                    StopPropagation("btnSaveIngredient");

                    $("#btnDiscardIngredient").addClass("k-state-disabled");
                    $("#btnDiscardIngredient").unbind('click');
                    StopPropagation("btnDiscardIngredient");
                }, 700);
            }
        };

        ingredientDetailObj.on("click", "#btnSaveIngredient", function (e) {
            e.preventDefault();
            //var validator = retrieveIngredientValidator();
            var form = $("#ingredientForm");
            var url = form.attr("action");
            var formData = form.serialize();
            debugger;
            $.post(url, formData, function (data) {
                if (data == "Ingredient Saved") {
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    return true;
                } else {
                    alert('Error occured while saving the ingredient details, ' + data);
                    return false;
                }
            });
        });

        //Expose to public

        return {
            IsReadOnlyMode: IsReadOnlyMode,
            ongdDetailIngredientItemClick: gdSearchIngredient_Change,
            OnSelectIngredientTabstrip: OnSelectIngredientTabstrip,
            onIngredientActivate: onIngredientActivate
        };
    };
})(jQuery);