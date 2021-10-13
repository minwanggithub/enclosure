

if (jQuery) (function ($, kdo) {
    $.fn.multiproductalias = function (options) {
        options = options || {};
        var $this = $(this);

        var winPop;
        var productAliasObservableModel;
        var confirmCancel = false;

        var settings = $.extend({
           // productAliasTypeDataSource: defaultProductAliasTypeDataSource,
            productId: 0,
            token: "",
            crudUrl: "",
            targetGrid: null
        }, options);

        var dialogProperty = {
            Text: {
                WindowTitle: "Add Multiple Product Aliases",
                UnableToCreateCtl: "Can not create Product Alias Control."
            },
            Ids: {
                SilbingSectionId: "#siblingsection"
            },
            KeyCode: {
                Enter: 13,
                KeyV: 86
            }
        };

        function onClose(e) {
            //if (confirmCancel) {
            //    if (!confirm("are you sure?")) {
            //        e.preventDefault();
            //        winPop.fadeIn();
            //    }
            //    else
            //        return;
            //}
            e.sender.destroy();
        }


        function GetObservable() {
            return kdo.observable({
                isNoteVisiable: true,
                productAliasText: "",
                //productAliasTypeDataSource: settings.productAliasTypeDataSource,

                onCancelClick: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    winPop.close();
                },
                onSaveClick: function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    
                    var nnArray = this.get("productAliasText").split("\n");
                    var nnResult = DeDupProductAlias(nnArray);
                    if (nnResult.length == 0) {
                        kdo.alert("Nothing to save.");
                        return;
                    }

                    var data = {};
                    data['productId'] = settings.productId;
                    data['aliasesText'] = nnResult;
                    data['token'] = settings.token;
                    $(this).ajaxJSONCall(settings.crudUrl, JSON.stringify(data))
                        .success(function (ajxResult) {
                            if (ajxResult.success == true) {
                                if (settings.targetGrid) settings.targetGrid.dataSource.read();
                            } else
                                kdo.alert(ajxResult.result);
                        })
                        .error(function () { kdo.alert("An error occurred saving the product alias values."); })
                        .complete(function () {
                           
                        });

                    winPop.close();
                },

                onProductAliasTypeSelect: function (e) {
                    //e.stopPropagation();
                   
                },

                onProductAliasTextKeyup: function (e) {
                    if (e.keyCode == dialogProperty.KeyCode.Enter || (e.ctrlKey && e.keyCode == dialogProperty.KeyCode.KeyV)) {
                        var nnArray = e.currentTarget.value.split("\n");
                        var result = DeDupProductAlias(nnArray);
                        e.currentTarget.value = "";
                        $(result).each(function (index, item) {
                            e.currentTarget.value = e.currentTarget.value + item + "\n";
                        });
                    }
                }
            });
        }

        function DeDupProductAlias(arr) {
            var arrDistinct = new Array();
            $(arr).each(function (index, item) {
                if (item.trim().length > 0) {
                    if ($.inArray(item, arrDistinct) == -1)
                        arrDistinct.push(item);
                }
            });
            return arrDistinct;
        }

        function Init() {
            //Verify required parameters before doing anything
            if (settings.crudUrl == "") {
                kdo.alert(dialogProperty.Text.UnableToCreateCtl + ": crudUrl parameter is requried.");
                return;
            }
            var parentPopDiv = $("<div id='name-number-section' style='padding: 0;'></div>");
            var PopDiv = $("<div class='modal-body'></div>");
            var windowFootDiv = "<div class='modal-footer' style='position:absolute;bottom:0;display:block;width: 94.5%;text-align:right;border-top:1px solid #e5e5e5;'>"+
                "<button id='saveMultiProductAliasBtn' data-bind='click: onSaveClick' type='button' class='k-primary k-button'style='margin-right: 5px;'>Save</button>" +
                "<button id='cancelMultiProductAliasBtn' type='button' class='k-button' data-bind='click: onCancelClick'>Cancel</button></div>";

            var contentTemplate = kendo.template(
                "<div id='divContentSection'><table>" +
                "<tr>" +
                "<td style='min-width:120px;'><label style='font-weight:bold'>Product Alias:</label></td>" +
                "<td><textarea rows='5' cols='60' data-bind='value: productAliasText, events: {keyup: onProductAliasTextKeyup }' style='min-width:300px;'></textarea></td>" +
                "</tr>" +
                "<tr>" +
                "<td style='min-width:120px;'><br/><label style='font-weight:bold' data-bind='visible: isNoteVisiable'>Note:</label></td>" +
                "<td style='min-width:120px;'><br/><label style='font-weight:bold' data-bind='visible: isNoteVisiable'>Duplicates will be removed automatically.</label><td/>" +
                "</tr>" +
                "</table></div>");

            var templateResult = $(contentTemplate({}));
            PopDiv.append(templateResult);
            parentPopDiv.append(PopDiv, [windowFootDiv]);


            productAliasObservableModel = GetObservable();
            kdo.bind(parentPopDiv, productAliasObservableModel);

            winPop = parentPopDiv.kendoWindow({
                width: "550px",
                title: dialogProperty.Text.WindowTitle,
                modal: true,
                visible: false,
                resizable: false,
                actions: [
                    //"Pin",
                    "Minimize",
                    //"Maximize",
                    "Close"
                ],
                height: 270,
                close: onClose
            }).data("kendoWindow");

            if (winPop != null) {
                //winPop.wrapper.find('.k-window-title').html("<b>" + dialogProperty.Text.WindowTitle + "</b>");   //Bold the title if needed
                winPop.center().open();
            }
        }

        Init();
    }
})(jQuery, kendo);