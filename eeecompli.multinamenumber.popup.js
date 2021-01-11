/*
 * Purpose: In order to reduced the current complex logic in the document new and revision screnns for entering multiple name number for document 
 * Contribute: Min Wang
 * @Date: January 20201
 */

if (jQuery) (function ($, kdo) {
    $.fn.multinamenumber = function (options) {
        options = options || {};
        var $this = $(this);

        var winPop;
        var nameNumberObservableModel;
        var confirmCancel = false;


        //For testing purpose only
        //var defaultNameNumberTypeDataSource =
        //    [
        //        { Text: 'Mfr Alias', Value: '1' },
        //        { Text: 'Mfr Part Number', Value: '2' },
        //        { Text: 'Client Product Number or Alias', Value: '3' },
        //        { Text: 'Mfr UPC', Value: '4' },
        //        { Text: 'Other Number', Value: '5' },
        //    ];


        var defaultNameNumberTypeDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: GetEnvironmentLocation() + "/Svc/GetNameNumberTypeLookUp",
                    type: "POST",
                    contentType: "application/json"
                }
            }
        });

        var settings = $.extend({
            nameNumberTypeDataSource: defaultNameNumberTypeDataSource,
            documentId: 0,
            revisionId: 0,
            token: "",
            crudUrl: "",
            targetGrid: null
        }, options);

        var dialogProperty = {
            Text: {
                WindowTitle: "Add Multiple Names or Numbers",
                UnableToCreateCtl: "Can not create Name Number Control."
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
                selectedNameNumberIndex: -1,
                nameNumberText: "",
                nameNumberTypeDataSource: settings.nameNumberTypeDataSource,

                onCancelClick: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    winPop.close();
                },
                onSaveClick: function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    if (this.get("selectedNameNumberIndex") === -1) {
                        kdo.alert("Please select type of alias first.");
                        return;
                    }

                    var nnArray = this.get("nameNumberText").split("\n");
                    var nnResult = DeDupNameNumber(nnArray);
                    if (nnResult.length == 0) {
                        kdo.alert("Nothing to save.");
                        return;
                    }

                    var data = {};
                    data['documentId'] = settings.documentId;
                    data['revisionId'] = settings.revisionId;
                    data['aliasTypeId'] = this.get("selectedNameNumberIndex");
                    data['aliasesText'] = nnResult;
                    data['token'] = settings.token;

                    $(this).ajaxJSONCall(settings.crudUrl, JSON.stringify(data))
                        .success(function (ajxResult) {
                            if (ajxResult.success == true) {
                                if (settings.targetGrid) settings.targetGrid.dataSource.read();
                            } else
                                kdo.alert(ajxResult.result);
                        })
                        .error(function () { kdo.alert("An error occurred saving the revision's name number values."); })
                        .complete(function () {
                           
                        });

                    winPop.close();
                },

                onNameNumberTypeSelect: function (e) {
                    //e.stopPropagation();
                   
                },

                onNameNumberTextKeyup: function (e) {
                    if (e.keyCode == dialogProperty.KeyCode.Enter || (e.ctrlKey && e.keyCode == dialogProperty.KeyCode.KeyV)) {
                        var nnArray = e.currentTarget.value.split("\n");
                        var result = DeDupNameNumber(nnArray);
                        e.currentTarget.value = "";
                        $(result).each(function (index, item) {
                            e.currentTarget.value = e.currentTarget.value + item + "\n";
                        });
                    }
                }
            });
        }

        function DeDupNameNumber(arr) {
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

            var popDiv = $("<div id='name-number-section'></div>");
            var windowFootDiv = "<div class='window-footer' style='position:absolute;bottom:0;display:block;width:95%;margin-top:100px;padding:19px 0 20px;text-align:right;border-top:1px solid #e5e5e5;'><button id='saveMultiNameNumberBtn' data-bind='click: onSaveClick' type='button' class='k-primary k-button'style='margin-right: 5px;'>Save</button><button id='cancelMultiNameNumberBtn' type='button' class='k-button' data-bind='click: onCancelClick'>Cancel</button></div>";

            var contentTemplate = kendo.template(
                "<div id='divContentSection'><table>" +
                "<tr>" +
                "<td style='min-width:120px;'><label style='font-weight:bold'>Type of Alias:</label></td>" +
                "<td><input id='ddlNameNumberType' data-role='dropdownlist' data-auto-bind='true' data-text-field='Text' data-value-field='Value' data-option-label='Select One' data-bind='value: selectedNameNumberIndex, source: nameNumberTypeDataSource, events: {select: onNameNumberTypeSelect }' style='min-width:355px;'/></td>" +
                "</tr>" +
                "<tr>" +
                "<td style='min-width:120px;'><label style='font-weight:bold'>Name or Number:</label></td>" +
                "<td><textarea rows='5' cols='60' data-bind='value: nameNumberText, events: {keyup: onNameNumberTextKeyup }' style='min-width:300px;'></textarea></td>" +
                "</tr>" +
                "<tr>" +
                "<td style='min-width:120px;'><br/><label style='font-weight:bold' data-bind='visible: isNoteVisiable'>Note:</label></td>" +
                "<td style='min-width:120px;'><br/><label style='font-weight:bold' data-bind='visible: isNoteVisiable'>Duplicates will be removed automatically.</label><td/>" +
                "</tr>" +
                "</table></div>");

            var templateResult = $(contentTemplate({}));
            popDiv.append(templateResult, [windowFootDiv]);

            nameNumberObservableModel = GetObservable();
            kdo.bind(popDiv, nameNumberObservableModel);

            winPop = popDiv.kendoWindow({
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