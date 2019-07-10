(function ($, kdo) {
    $.fn.dpedataresult = function (options) {
        options = options || {};
        var $this = $(this);

        var winPop;
        var warningMsg;
        var cancelSave = false;

        var settings = $.extend({
            dpeDataSource: null,
            dpeFields: null,
            dpeFieldsStatus: null,
            ManufacturerCallBack: null
        }, options);

        var plugInOptions = {
            Text: {
                WindowTitle: "Data Point Extracted Result"
            },
            Ids: {
                DataPointContentSectionId: "#DataPointContent"
            }
        };

        function onClose(e) {
             //if (!confirm("are you sure?")) {
             //  e.preventDefault();
             //  win.fadeIn();
             //}                
            //e.sender.destroy();
        }

        function GetDpeObservable() {
            var revisionDate;
            var confirmDate;

            if (settings.dpeDataSource.RevisionDate != null) {
                revisionDate = new Date(parseInt(settings.dpeDataSource.RevisionDate.replace("/Date(", "").replace(")/", ""), 10));
            }
            else
                revisionDate = '';

            if (settings.dpeDataSource.VerifyDate != null) {
                confirmDate = new Date(parseInt(settings.dpeDataSource.VerifyDate.replace("/Date(", "").replace(")/", ""), 10));
            }
            else
                confirmDate = '';

            return kdo.observable({
                cbRevisionTitle: settings.dpeFieldsStatus.IncludeRevisionTitle,
                cbRevisionVersion: settings.dpeFieldsStatus.IncludeRevisionVersion,
                cbRevisionIdentification: settings.dpeFieldsStatus.IncludeRevisionIdentification,
                cbRevisionDate: settings.dpeFieldsStatus.IncludeRevisionDate,
                cbVerifyDate: settings.dpeFieldsStatus.IncludeVerifiyDate,
                cbMfgId: settings.dpeFieldsStatus.IncludeManufacturerId,
                cbSupplierId: settings.dpeFieldsStatus.IncludIdSupplierId,
                dpeRevisionTitle: settings.dpeDataSource.RevisionTitle,
                dpeRevisionVersion: settings.dpeDataSource.VersionOnDocument,
                dpeRevisionIdentification: settings.dpeDataSource.DocumentIdentification,
                dpeRevisionDate: revisionDate,
                dpeVerifyDate: confirmDate,
                dpeMfgId: settings.dpeDataSource.ManufacturerId,
                dpeMfgName: settings.dpeDataSource.ManufacturerName,
                dpeSupplierId: settings.dpeDataSource.SupplierId,
                dpeSupplierName: settings.dpeDataSource.SupplierName,
                isRevisionDateVisible: true,
                isVerifyDateVisible: true,
                onIncludeRevisionTitleChange: function (e) {
                    if (e.currentTarget.checked && dpeRevisionTitle.value != '')
                        $(settings.dpeFields.fileds.RevisionTitle).val(dpeRevisionTitle.value);
                    else
                        $(settings.dpeFields.fileds.RevisionTitle).val('');
                },
                onIncludeRevisionVersionChange: function (e) {
                    if (e.currentTarget.checked && dpeRevisionVersion.value != '')
                        $(settings.dpeFields.fileds.DocumentVersion).val(dpeRevisionVersion.value);
                    else
                        $(settings.dpeFields.fileds.DocumentVersion).val('');
                },
                onIncludeRevisionIdentificationChange: function (e) {
                    if (e.currentTarget.checked && dpeRevisionIdentification.value != '')
                        $(settings.dpeFields.fileds.DocumentIdentification).val(dpeRevisionIdentification.value);
                    else
                        $(settings.dpeFields.fileds.DocumentIdentification).val('');
                },
                onIncludeRevisionDateChange: function (e) {
                    if (e.currentTarget.checked && dpeRevisionDate.value != '')
                        $(settings.dpeFields.fileds.RevisionDate).data("kendoDatePicker").value(new Date(dpeRevisionDate.value));
                    else
                        $(settings.dpeFields.fileds.RevisionDate).data("kendoDatePicker").value('');
                },
                onIncludeVerifyDateChange: function (e) {
                    if (e.currentTarget.checked && dpeVerifyDate.value != '')
                        $(settings.dpeFields.fileds.VerifyDate).data("kendoDatePicker").value(new Date(dpeVerifyDate.value));
                    else
                        $(settings.dpeFields.fileds.VerifyDate).data("kendoDatePicker").value('');
                },
                onIncludeMfgIdChange: function (e) {
                    if (e.currentTarget.checked && dpeMfgId.value != '' && $.isFunction(settings.ManufacturerCallBack)) {
                        $(settings.dpeFields.fileds.ManufacturerId).val(dpeMfgId.value);
                        settings.ManufacturerCallBack.call(this, settings.dpeFields.fileds.ManufacturerId);
                    }
                    else
                        $(settings.dpeFields.fileds.ManufacturerId).val('');
                },
                onIncludeSupplierIdChange: function (e) {
                    if (e.currentTarget.checked && dpeSupplierId.value != '' && $.isFunction(settings.ManufacturerCallBack)) {
                        $(settings.dpeFields.fileds.SupplierId).val(dpeSupplierId.value);
                        settings.ManufacturerCallBack.call(this, settings.dpeFields.fileds.SupplierId);
                    }
                    else
                        $(settings.dpeFields.fileds.SupplierId).val('');
                },
                onSelectRevisionDateChange: function (e) {

                },
                onSelectVerifyDateChange: function (e) {

                }
            });
        }

        function AddContent(p) {
            var datatable = $("<table style='width: 100%' border='0' />");
            var rowTitle = $("<tr><th colspan='1'>Filled</th><th colspan='2'>Field</th><th colspan='5'>Value</th></tr><tr><td colspan='8'><hr style='border: 1px solid; margin-top:10px;'></td></tr><tr><td colspan='8'>&nbsp;</tr>");

            datatable.append(rowTitle);

            var revisionTitleRow = $("<tr class='RevisionTitleRow'></tr>");
            var revisionTitleInclude = $("<td colspan='1'><input type='checkbox' id='cbRevisionTitle' data-bind='checked: cbRevisionTitle, events: { change: onIncludeRevisionTitleChange}' style='margin-left: 10px'></td>");            
            var revisionTitleField = $("<td colspan='2'><b id='lblRevisionTitle'style='padding-right:5px;'>Revision Title</b></td>");
            var revisionTitleText = $("<td colspan='5'><input type='text' id='dpeRevisionTitle' data-auto-bind='false' data-bind='value: dpeRevisionTitle' style='width:470px; height:16px;'></td>");
            revisionTitleRow.append(revisionTitleInclude, [revisionTitleField, revisionTitleText]);
            datatable.append(revisionTitleRow);

            var revisionVersionRow = $("<tr class='RevisionVersionRow'></tr>");
            var revisionVersionInclude = $("<td colspan='1'><input type='checkbox' id='cbRevisionVersion' data-bind='checked: cbRevisionVersion, events: { change: onIncludeRevisionVersionChange}' style='margin-left: 10px'></td>");
            var revisionVersionField = $("<td colspan='2'><b id='lblRevisionVersion'style='padding-right:5px;'>Ver. Number</b></td>");
            var revisionVersionText = $("<td colspan='5'><input type='text' id='dpeRevisionVersion' data-auto-bind='false' data-bind='value: dpeRevisionVersion' style='width:470px; height:16px;'></td>");
            revisionVersionRow.append(revisionVersionInclude, [revisionVersionField, revisionVersionText]);
            datatable.append(revisionVersionRow);

            var revisionIdentificationRow = $("<tr class='RevisionIdentificationRow'></tr>");
            var revisionIdentificationInclude = $("<td colspan='1'><input type='checkbox' id='cbRevisionIdentification' data-bind='checked: cbRevisionIdentification, events: { change: onIncludeRevisionIdentificationChange}' style='margin-left: 10px'></td>");
            var revisionIdentificationField = $("<td colspan='2'><b id='lblRevisionIdentification'style='padding-right:5px;'>Identification</b></td>");
            var revisionIdentificationText = $("<td colspan='5'><input type='text' id='dpeRevisionIdentification' data-auto-bind='false' data-bind='value: dpeRevisionIdentification' style='width:470px; height:16px;'></td>");
            revisionIdentificationRow.append(revisionIdentificationInclude, [revisionIdentificationField, revisionIdentificationText]);
            datatable.append(revisionIdentificationRow);

            var revisionDateRow = $("<tr class='RevisionDateRow'></tr>");
            var revisionDateInclude = $("<td colspan='1'><input type='checkbox' id='cbRevisionDate' data-bind='checked: cbRevisionDate, events: { change: onIncludeRevisionDateChange}' style='margin-left: 10px'></td>");
            var revisionDateField = $("<td colspan='2'><b id='lblRevisionDate'style='padding-right:5px;'>Revision Date</b></td>");
            var revisionDateText = $("<td colspan='5'><input type='text' id='dpeRevisionDate' data-auto-bind='false' data-bind='value: dpeRevisionDate' readonly='readonly' style='width:344px; height:16px;'><input data-role='datepicker' data-bind='visible: isRevisionDateVisible, value: dpeRevisionDate, events: { change: onSelectRevisionDateChange }' style='width: 123px;padding-left:2px;'></td>");            
            revisionDateRow.append(revisionDateInclude, [revisionDateField, revisionDateText]);
            datatable.append(revisionDateRow);

            var VerifyDateRow = $("<tr class='VerifyDateRow'></tr>");
            var verifyDateInclude = $("<td colspan='1'><input type='checkbox' id='cbVerifyDate' data-bind='checked: cbVerifyDate, events: { change: onIncludeVerifyDateChange}' style='margin-left: 10px'></td>");
            var verifyDateField = $("<td colspan='2'><b id='lblVerifyDate'style='padding-right:5px;'>Confirm Date</b></td>");
            var verifyDateText = $("<td colspan='5'><input type='text' id='dpeVerifyDate' data-auto-bind='false' data-bind='value: dpeVerifyDate' readonly='readonly' style='width:344px; height:16px;'><input data-role='datepicker' data-bind='visible: isVerifyDateVisible, value: dpeVerifyDate, events: { change: onSelectVerifyDateChange }' style='width: 123px;padding-left:2px;'></td>");
            VerifyDateRow.append(verifyDateInclude, [verifyDateField, verifyDateText]);
            datatable.append(VerifyDateRow);

            var mfgRow = $("<tr class='ManufacturerRow'></tr>");
            var mfgInclude = $("<td colspan='1'><input type='checkbox' id='cbMfgId' data-bind='checked: cbMfgId, events: { change: onIncludeMfgIdChange}' style='margin-left: 10px'></td>");
            var mfgField = $("<td colspan='2'><b id='lblMfgId'style='padding-right:5px;'>Mfg. Id</b></td>");
            var mfgText = $("<td colspan='5'><input type='text' id='dpeMfgId' data-auto-bind='false' data-bind='value: dpeMfgId' style='width:200px; height:16px;'></td>");
            mfgRow.append(mfgInclude, [mfgField, mfgText]);
            datatable.append(mfgRow);

            var mfgNameRow = $("<tr class='ManufacturerNameRow'></tr>");
            var mfgNameInclude = $("<td colspan='1'></td>");
            var mfgNameField = $("<td colspan='2'><b id='lblMfgName'style='padding-right:5px;'>Mfg. Name</b></td>");
            var mfgNameText = $("<td colspan='5'><input type='text' id='dpeMfgName' data-auto-bind='false' data-bind='value: dpeMfgName' style='width:470px; height:16px;'></td>");
            mfgNameRow.append(mfgNameInclude, [mfgNameField, mfgNameText]);
            datatable.append(mfgNameRow);

            var supplierRow = $("<tr class='ManufacturerRow'></tr>");
            var supplierInclude = $("<td colspan='1'><input type='checkbox' id='cbSupplierId' data-bind='checked: cbSupplierId, events: { change: onIncludeSupplierIdChange}' style='margin-left: 10px'></td>");
            var supplierField = $("<td colspan='2'><b id='lblSupplierId'style='padding-right:5px;'>Supplier. Id</b></td>");
            var supplierText = $("<td colspan='5'><input type='text' id='dpeSupplierId' data-auto-bind='false' data-bind='value: dpeSupplierId' style='width:200px; height:16px;'></td>");
            supplierRow.append(supplierInclude, [supplierField, supplierText]);
            datatable.append(supplierRow);

            var supplierNameRow = $("<tr class='SupplierNameRow'></tr>");
            var supplierNameInclude = $("<td colspan='1'></td>");
            var supplierNameField = $("<td colspan='2'><b id='lblSupplierName'style='padding-right:5px;'>Supplier Name</b></td>");
            var supplierNameText = $("<td colspan='5'><input type='text' id='dpeSupplierName' data-auto-bind='false' data-bind='value: dpeSupplierName' style='width:470px; height:16px;'></td>");
            supplierNameRow.append(supplierNameInclude, [supplierNameField, supplierNameText]);
            datatable.append(supplierNameRow);


            p.append(datatable);
            var model = GetDpeObservable();
            kdo.bind(datatable, model);
        }

        function Init() {
            var windowConstraint = $("<div style='height: 100%;'/>");
            var windowContent = $("<div style='overflow: auto; height: calc(100% - 74px); padding: 10px'><div id='DataPointContent'/></div>");
            //            var windowFoot = $("<div style='width: 100%; height: 60px; background-color: #e3e3e3; border-top: solid #C5C5C5 1px'></div>");
            var windowFoot = $("<div style='height: 60px;  border-top: solid #C5C5C5 1px'></div>");
            //var footMargin = $("<div style='float: right; margin: 10px'/>");
            //            var footMargin = $("<div style='float: right;'/>");
            var footMargin = $("<div />");
            var closeButton = $("<a id='btndpeClose' style='margin-top: 20px;' class='k-button k-button-icontext pull-right' href='#' title='Cancel'><span class='k-icon k-i-cancel'></span>Close</a>");
            footMargin.append(closeButton);
            //footMargin.append(addButton);
            windowFoot.append(footMargin);
            windowConstraint.append(windowContent, windowFoot);
            $this.empty(); //Make sure you remove all the children first
            $this.append(windowConstraint);

            winPop = $this.kendoWindow({
                title: plugInOptions.Text.WindowTitle,
                actions: ["Close"], //["Refresh"]
                modal: true,
                width: "660px",
                height: "500px",
                pinned: true,
                //position: 'fixed',
                close: onClose
                //deactivate: function (e) {
                //    e.sender.destroy();
                //}
            });

            closeButton.kendoButton({
                click: function (e) {
                    winPop.data("kendoWindow").close();
                }
            });

            AddContent($(plugInOptions.Ids.DataPointContentSectionId));

            if (winPop.length > 0) {
                winPop.parent().find(".k-window-action").css("visibility", "hidden");
                winPop.data("kendoWindow").center().open();
            }
        }

        Init();

        return {
            //Data: Data
        };

    }
})(jQuery, kendo);