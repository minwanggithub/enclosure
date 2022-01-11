(function ($, kdo) {
    $.fn.bundlesiblings = function (options) {
        options = options || {};
        var $this = $(this);

        //var form = options.submitForm;
        //var formData = options.submitData;
        //var target = options.target;
        
        var winPop;
        var warningMsg;
        var cancelSave = false;

        var defaultLookUpDataSource = [
            {
                DocumentId: 1111111111,
                RevisionTitle: "Revision Title1",
                Included: true,
                Additional: false
    }, {
                DocumentId: 2222222222,
                RevisionTitle: "Revision Title2",
                Included: true,
                Additional: false
            }
        ];

        var settings = $.extend({
            siblingDataSource: defaultLookUpDataSource,
            submitForm: null,
            submitData: null,            
            target: null,
            revisionCallback: null,
            inboundRevisionCallback: null
        }, options);

        var plugInOptions = {
            Text: {
                WindowTitle: "Adding revision for siblings"
            },
            Ids: {
                SilbingSectionId: "#siblingsection",
                IncludeCheckbox: "#chkAllSiblings"
            },
            Message: {
                WarningMessage: "WARNING: If you continue the excluded sibling(s) will be removed and will no longer be linked to this image."
            }
        };

        var footModel = kdo.observable({
            checkMessage: false,
            warningMessage: plugInOptions.Message.WarningMessage,
            onSiblingSaveButtonClick: function () {
                winPop.data("kendoWindow").close();
            },

            onSiblingCancelButtonClick: function () {
                cancelSave = true;
                winPop.data("kendoWindow").close();
            }
        });

        function onClose(e) {            
            // if (!confirm("are you sure?")) {
            //   e.preventDefault();
            //   win.fadeIn();
            // }            
            if (cancelSave) {
                $(settings.target.currentTarget).removeClass('k-state-disabled');
                //e.sender.destroy();
                return;
            }

            var target = $(plugInOptions.Ids.SilbingSectionId);
            var siblingRows = target.find(".siblingrow");

            var siblingList = [];

            for (var index = 0; index < siblingRows.length; index++) {
                var checkBox = $(siblingRows[index]).find('input:checkbox');
                var bs = checkBox.get(0).kendoBindingTarget.source;
                //var bs = $(siblingRows[index]).get(0).children[0].kendoBindingTarget.source;
                //kendoConsole.log("Include: " + bs.included + " , DocumentId: " + bs.documentId + ", RevisionTitle: " + bs.exteredRevisionTitle);
                if (bs != null && bs.included && bs.enteredRevisionTitle === "") {
                    kendo.alert("Please enter revision title for document: " + bs.documentId);
                    e.preventDefault();                    
                    return;
                } else {
                    if (bs.included) {
                        var siblingdata = {};
                        siblingdata.DocumentId = bs.documentId;
                        siblingdata.RevisionTitle = bs.exteredRevisionTitle;
                        siblingList.push(siblingdata);
                    }
                }
            }

            if (siblingList.length > 0) {
                settings.submitData.model.SiblingList = siblingList;
            }

            if ($.isFunction(settings.revisionCallback)) {
                settings.revisionCallback.call(this, settings.submitForm, settings.submitData, settings.target);
            }

            if ($.isFunction(settings.inboundRevisionCallback)) {
                settings.inboundRevisionCallback.call(this, settings.submitForm, settings.submitData);
            }
            e.sender.destroy();
        }



        function AddSibilingTableRow(p) {
            var totalSiblingCount = settings.siblingDataSource.length;

            var siblingTable = $("<table style='width: 100%' border='0' />");
            var siblingRowTitle = $("<tr><th><div style='width:85px;padding-top:5px'><div style='float:left;width:20%;padding-top:2px'><input type='checkbox' id='chkAllSiblings'  data-bind='checked: included, events: { change: CheckUncheckAllfun}'   style='margin-left: 10px'></div > <div style='float:right;width:80%'><label style='font-weight:bold' for='chkAllSiblings'>Include</label></div></div ></th ><th style='text-alogn:left;padding-left:10px'>Document Id</th><th>New Revision Title</th><th>&nbsp;</th></tr > <tr><td colspan='4'><hr></td></tr><tr><td colspan='4'>&nbsp;</tr>");

            siblingTable.append(siblingRowTitle);

            var headRowModel = GetCkhAllObservable();
            kdo.bind(siblingRowTitle, headRowModel);

            for (var rowId = 0; rowId < totalSiblingCount; rowId++) {
                var siblingRow = $("<tr id='" + rowId + "' class='siblingrow'></tr>");
                var siblingInclude = $("<td><input class='chk-sibling' type='checkbox' id='includedId_'" + rowId + " data-bind='checked: included, events: { change: onIncludeCheckChange}'  style='margin-left: 10px'></td>");
                //var siblingDocumentId = $("<td><input type='text' id='documentId_'" + rowId + " data-auto-bind='false' data-bind='value: documentId, title: exteredRevisionTitle' style='margin-left: 50px; width: 100px; height:18px; border: 0' readonly='readonly' title='DocumentId = 13434&#13;RevisionID = 343443&#13;Line3>'></td>");
                var siblingDocumentId = $("<td><input type='text' id='documentId_'" + rowId + " data-auto-bind='false' data-bind='value: documentId' style='margin-left: 50px; width: 100px; height:18px; border: 0' readonly='readonly'></td>");
                var siblingRevisionTitle = $("<td><input type='text' id='revisionTitle_" + rowId + "' data-auto-bind='false' data-bind='value: exteredRevisionTitle, visible: isVisible' style='width:360px; height:18px;'></td>");
                //var removeBtn = $("<td><button id='btnRemove_" + rowId + "' style='margin-top: -2px; height:22px; width:14px' data-bind='visible: isVisible, events: {click: onRemoveRowClick}' class='btn btn-small'><span class='k-icon k-i-cancel' style='margin-top:2px;'></span></button></td>");
                siblingRow.append(siblingInclude, [siblingDocumentId, siblingRevisionTitle]);
                siblingTable.append(siblingRow);

                var rowModel = GetSibingObservable(rowId);
                kdo.bind(siblingRow, rowModel);

                //siblingDocumentId.prop('title', rowModel.exteredRevisionTitle);
            }

            p.append(siblingTable);
        }

        function AddSibilingRow(p) {
            var totalSiblingCount = settings.siblingDataSource.length;
            var siblingRowTitle = $("<div><p style='display: inline;'>Exclude</p><p style='margin:20px;display: inline;'>Document Id</p><p style='margin:50px;display: inline;'>New Revision Title</p></div>");
            p.append(siblingRowTitle);
            p.append("<hr>");
            for (var rowId = 0; rowId < totalSiblingCount; rowId++) {
                var siblingRow = $("<div id='" + rowId + "' class='siblingrow'></div>");
                var siblingInclude = $("<input type='checkbox' id='includedId_'" + rowId + " data-bind='checked: included, events: { change: onIncludeCheckChange}'  style='margin-left: 10px'>");
                var siblingDocumentId = $("<input type='text' id='documentId_'" + rowId + " data-auto-bind='false' data-bind='value: documentId' style='margin-left: 50px; width: 100px; height:18px; border: 0' value='2045798765' readonly='readonly'>");
                var siblingRevisionTitle = $("<input type='text' id='revsionTitle_" + rowId + "' data-auto-bind='false' data-bind='value: enteredRevisionTitle, visible: isVisible' style='margin: 0px 0px 2px 10px; width:320px; height:18px;'>");
                //var removebtn = $("<button id='btnRemove_" + rowId +  "' data-bind='visible: isVisible, events: {click: onRemoveRowClick}' class='k-button k-button-icontext' style='position:relative;z-index:1'><span class='k-icon k-i-add'></span></button>");

                siblingRow.append(siblingInclude, [siblingDocumentId, siblingRevisionTitle]);
                p.append(siblingRow);

                var rowModel = GetSibingObservable(rowId);
                kdo.bind(siblingRow, rowModel);
            }
        }

        function GetSibingObservable(rowId) {
            return kdo.observable({
                included: settings.siblingDataSource[rowId].Included,
                documentId: settings.siblingDataSource[rowId].DocumentId,
                //enteredRevisionTitle: "",
                exteredRevisionTitle: settings.siblingDataSource[rowId].RevisionTitle,
                isVisible: true,
                onIncludeCheckChange: function (e) {
                    var excludedCount = 0;
                    var target = $(plugInOptions.Ids.SilbingSectionId);
                    var siblingRows = target.find(".siblingrow");

                    //This code can be omitted after the data-binding
                    //for (var index = 0; index < siblingRows.length; index++) {
                    //    var checkBox = $(siblingRows[index]).find('input:checkbox');
                    //    var bs = checkBox.get(0).kendoBindingTarget.source;
                        
                    //    if (bs != null && !bs.included) {
                    //        excludedCount++;
                    //    }
                    //}

                    footModel.set("checkMessage", (target.find('.chk-sibling:checked').length != siblingRows.length));

                    // to change "select all" checkbox wrt other checkboxes selection present in grid
                    $(plugInOptions.Ids.IncludeCheckbox).prop('checked', (target.find('.chk-sibling:checked').length == siblingRows.length));

                },

                onRemoveRowClick: function(e) {
                    kendo.alert("remove");
                }
            });
        }
        // for check/Uncheck all checkbox
        function GetCkhAllObservable() {
            return kdo.observable({
                CheckUncheckAllfun: function (e) {
                    $(plugInOptions.Ids.SilbingSectionId).find('.chk-sibling').prop('checked', (e.currentTarget.checked));
                   
                    var target = $(plugInOptions.Ids.SilbingSectionId);
                    var siblingRows = target.find(".siblingrow");
                    siblingRows.each(function (index, currentrow) {
                        var checkBox = $(currentrow).find('input:checkbox');
                        var bs = checkBox.get(0).kendoBindingTarget.source;
                        bs.included = e.currentTarget.checked;
                    });

                    //footModel.set("checkMessage", (target.find('.chk-sibling:checked').length != siblingRows.length));
                    footModel.set("checkMessage", !e.currentTarget.checked);
                }
            });
        }

        function Init() {
            var windowConstraint = $("<div style='height: 100%;'/>");
            var windowContent = $("<div style='overflow: auto; height: calc(100% - 74px); padding: 10px'><div id='siblingsection'/></div>");
            //            var windowFoot = $("<div style='width: 100%; height: 60px; background-color: #e3e3e3; border-top: solid #C5C5C5 1px'></div>");
            var windowFoot = $("<div style='height: 60px;  border-top: solid #C5C5C5 1px'></div>");
            //var footMargin = $("<div style='float: right; margin: 10px'/>");
//            var footMargin = $("<div style='float: right;'/>");
            var footMargin = $("<div />");
            //var saveButton = $("<button id='btnSiblingSave'>Save</button>");
            warningMsg = $("<span id='txtWarning' data-bind='visible: checkMessage, text: warningMessage' style='margin-top: 7px;font-size:120%; color:red; max-width: 450px;' class='pull-left'></span>");
           
            var saveButton = $("<a id='btnSiblingSave' data-bind='click: onSiblingSaveButtonClick' style='margin-top: 20px;margin-left:5px;' class='k-button k-button-icontext pull-right' href='#' title='Save'><span class='k-icon k-i-pencil'></span>Save</a>");
            var cancelButton = $("<a id='btnSiblingCancel' data-bind='click: onSiblingCancelButtonClick' style='margin-top: 20px;' class='k-button k-button-icontext pull-right' href='#' title='Cancel'><span class='k-icon k-i-cancel'></span>Cancel</a>");
            var testButton = $("<a id='btnTest' style='margin-top: 20px;' class='k-button k-button-icontext pull-right' href='#' title='Cancel'>Test</a>");
            //var addButton = $("<a id='btnSiblingAdd' style='margin-top: 20px;' class='k-button k-button-icontext pull-right' href='#' title='Cancel'><span class='k-icon k-add'></span>Add</a>");
            // var cancelButton = $("<button id='siblingButton' style='background-color: red'>Cancel</button>");            
            footMargin.append(warningMsg);
            footMargin.append(saveButton);
            footMargin.append(cancelButton);

            //footMargin.append(addButton);
            windowFoot.append(footMargin);
            windowConstraint.append(windowContent, windowFoot);
            $this.empty(); //Make sure you remove all the children first
            $this.append(windowConstraint);

            winPop = $this.kendoWindow({
                title: plugInOptions.Text.WindowTitle,
                actions: ["Close"], //["Refresh"]
                modal: true,
                width: "675px",
                height: "500px",        
                position: 'fixed',
                close: onClose
                //deactivate: function (e) {
                //    e.sender.destroy();
                //}
            });


            //saveButton.kendoButton({
            //    click: function (e) {
            //        winPop.data("kendoWindow").close();
            //    }
            //});

            //cancelButton.kendoButton({
            //    click: function (e) {
            //        cancelSave = true;
            //        winPop.data("kendoWindow").close();
            //    }
            //});

//            addButton.kendoButton({
//                click: function (e) {
//                    //Clear the content
//                    var containerParent = $(plugInOptions.Ids.SilbingSectionId);
//                    containerParent.empty();
//
//                    var siblingdata = {};
//                    siblingdata.DocumentId = 3433434343;
//                    siblingdata.RevisionTitle = "";
//                    siblingdata.Included = true;
//                    siblingdata.Additional = true;
//                    settings.siblingDataSource.push(siblingdata);
//
//                    AddSibilingTableRow(containerParent);
//                }
//            });


            //AddSibilingRow($(plugInOptions.Ids.SilbingSectionId));            
            AddSibilingTableRow($(plugInOptions.Ids.SilbingSectionId));

            kdo.bind(footMargin, footModel);

            if (winPop.length > 0) {
                winPop.data("kendoWindow").center().open();        
                winPop.parent().find(".k-window-action").css("visibility", "hidden");
                //to "check all" Checkbox true by default at start
                $(plugInOptions.Ids.IncludeCheckbox).prop('checked', true);
            }
        }

        function Data() {
            var siblingRows = $(plugInOptions.Ids.SilbingSectionId).find(".siblingrow");
            var criteriaList = [];

            for (var index = 0; index < siblingRows.length; index++) {
                var bs = $(siblingRows[index]).get(0).children[0].kendoBindingTarget.source;
                var criteria = {};
                criteria.Included = bs.included;
                criteria.DocumentId = bs.documentId;
                criteria.RevisionTitle = bs.exteredRevisionTitle;

                criteriaList.push(criteria);
            }
            return criteriaList;
        }

        function Data1() {
            var siblingRows = $(plugInOptions.Ids.SilbingSectionId).find(".siblingrow");
            var criteriaList = [];            
            $.each(siblingRows, function(i, row) {
                var bs = row.get(0).children[0].kendoBindingTarget.source;
                var criteria = {};
                criteria.Included = bs.included;
                criteria.DocumentId = bs.documentId;
                criteria.RevisionTitle = bs.exteredRevisionTitle;

                criteriaList.push(criteria);
            });
            return criteriaList;
        }

        Init();

        return {
            Data: Data
        };

    }
})(jQuery, kendo);