; (function ($) {
    if ($.fn.complibIngredients == null) {
        $.fn.complibIngredients = {};
    }
    $.fn.complibIngredients = function () {
        var ingredientDetailObj = $("#DetailIngredient");

        var StopPropagation = function(ctlName) {
            $("#" + ctlName).click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
        };
        var IsReadOnlyMode = function () {
            return ($("#SearchPanel").find("span.icon-lock.icon-white").length == 1);
        };

        var gdSearchIngredient_Change = function (e) {

            // FOR THE TIME BEING REMOVED BASED ON COMMENTS FROM JAMES 2014-06-26
            //var selectedData = this.dataItem(this.select());
            //if (typeof selectedData != 'undefined') {
            //    var ingredientId = selectedData.IngredientId;
            //    onDetailIngredientItemClick(ingredientId);
            //}
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

        //======Security group Read-Only Integration Section Starts
        var onIngredientActivate = function (e) {
            if (IsReadOnlyMode() && $(e.item).find("* > .k-link").text() == "Ingredient") {

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
            saveIngredient(false);
        });

        function saveIngredient(overrideDuplicate) {
            var form = $('#ingredientForm');
            var validator = retrieveIngredientValidator();
            if (validator.validate()) {
                var url = form.attr("action");
                var formdata = {};
                formdata['overrideDuplicate'] = overrideDuplicate;
                $.each(form.serializeArray(), function () {
                    formdata[this.name] = this.value;
                });

                $.post(url,
                    formdata,
                    function (data) {
                        if (!data.Errors) {
                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Ingredient Saved");
                            $('#DetailIngredient').html("");
                            var grid = $("#gdSearchIngredient").data("kendoGrid");
                            grid.dataSource.read();
                            return true;
                        } else {

                            var errorMessage = 'Error occured while saving the ingredient details';
                            if (data.Errors.Exists) {
                                errorMessage = data.Errors.Exists.errors[0];

                            } else {

                                var keys = Object.keys(data.Errors);
                                for (var idx = 0; idx < keys.length; idx++) {
                                    var errorobj = data.Errors[keys[idx]];
                                    if (errorobj.errors && errorobj.errors.length > 0) {
                                        errorMessage = errorobj.errors[0];
                                        break;
                                    }
                                }
                            }

                            onDisplayError(errorMessage);
                            return false;
                        }
                    });
            }
        }

        var onIngredientGeneralReady = function () {            
            //var ddl = ingredientDetailObj.find('#IngredientTypeLkpID');
            //if (ddl) {
            //    //ddl.data("kendoDropDownList").readonly(true);
            //    ddl.data("kendoDropDownList")._inputWrapper.css({
            //        "background-color": "#eeeeee",
            //        "cursor": "not-allowed"
            //    });
            //}
        };

        // CAS Validation Methods
        var ingredientValidator = null;

        function retrieveIngredientValidator() {

            ingredientValidator = $('#ingredientForm').kendoValidator({
                messages: {
                    isnumber: function (input) {
                        var message = input.data('valNumber');
                        return message ? message : 'This field must be a number.';
                    }
                },
                rules: {
                    isnumber: function (input) {
                        if (input.is('#CASNumber') && input.val()) {
                            return isValidInteger(input.val());
                        }

                        return true;
                    }
                }
            }).data("kendoValidator");

            return ingredientValidator;
        }

        //Expose to public

        return {
            IsReadOnlyMode: IsReadOnlyMode,
            ongdDetailIngredientItemClick: gdSearchIngredient_Change,
            OnSelectIngredientTabstrip: OnSelectIngredientTabstrip,
            onIngredientActivate: onIngredientActivate,
            onDisplayError: onDisplayError,
            onIngredientGeneralReady: onIngredientGeneralReady
        };
    };
})(jQuery);