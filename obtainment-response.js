﻿; (function ($) {
    if ($.fn.complibObtainmentResponse == null) {
        $.fn.complibObtainmentResponse = {};
    }

    $.fn.complibObtainmentResponse = function () {
        var viewModel = {};

        var UIObject = {
            sections: {
                    inboundResponseSearchSection: function() { return $("#divObtainmentResponseSearchSection"); },
                    responseDetailGridSection: function() { return $("#ReponseDetail"); },
                    supplierSearchFootSection: function() { return $("#supplierSearchFootSection"); },
                    customerActionSection: function() { return $("#customerActionSection"); },
            },
                classes: {
                    CancelIcon: 'k-i-cancel',
                    DisabledLink: 'disabled-link',
                    RefreshIcon: 'k-i-refresh'
                },
            controls: {
                    buttons: {
                        CancelResponseAll: "[id^=btnResponseCancel]",
                        CancelResponseSpecific: "btnResponseCancel",
                        EditSupplier: "EditSupplierBtn",
                        SaveResponseAll: "[id^=btnResponseSave]",
                        SaveResponseSpecific: "btnResponseSave",
                        ShowCollapseObjField: "ShowCollapse"
                    },
                    dropdownlists: {
                        ResponseStatusAll: "[id^=ddlResponseStatus]",
                        ResponseStatusId: "ResponseStatusId",
                        ResponseStatusSpecific: "ddlResponseStatus",
                    },
                grids: {
                        InboundResponse: function() { return $("#gdInboundResponse").data("kendoGrid"); },
                        SearchSupplier: function() { return $("#gdSearchSupplier").data("kendoGrid"); },
                    },
                    labels: {
                        SupplierInfo: "lblSupplierInfoForResponseDetail",
                },
                textBoxes: {
                        NoticeNumberObj: function() { return $("#NoticeNumber") },
                    NoticeNumberObjField: "NoticeNumber",
                        SupplierNameAndIdObj: function() { return $("#SupplierNameAndId") },
                    SupplierNameAndIdObjField: "SupplierNameAndId",
                    SupplierIdObjField: "SupplierId",
                }               
            },
            popWindow: {
                    supplierSearchDialog: function() { return $("#supplierSearchWindow").data("kendoWindow"); },
                    supplierPlugIn: function() { return $("#dgSupplierPlugIn"); },
            },
            controllerCalls: {
                GetInboundResponseById: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/GetInboundResponseById",
                SaveResponseDetail: GetEnvironmentLocation() + '/Operations/ObtainmentResponse/SaveInboundResponseDetail',
                SearchResponse: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/SearchInboundResponse",
                SearchSupplierInfo : GetEnvironmentLocation() + "/Operations/Company/LookUpSupplierOnKeyEnter",
                LoadSingleSupplier : GetEnvironmentLocation() + "/Operations/Company/LoadSingleSupplier?",
                LoadSupplierPlugIn: GetEnvironmentLocation() + "/Operations/Document/PlugInSupplierSearchAlt",
                NoticeAutoComplete: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/GetNoticeNumberSelect",
                IfExistEmailOrDomain: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/IfExistEmailOrDomain"
            },
                warnings: {
                    NoRowSelected: "No row selected, please try again.",
                    NoSearchCriteria: "No search criteria entered."
                    },
                        errorMessage: {
                            GeneralError: "Error Occurred on server call."
            },
        };

        var Initialize = function () {
            InitializeSearch();

            UIObject.sections.responseDetailGridSection().on("change", UIObject.controls.dropdownlists.ResponseStatusAll, onDdlResponseStatusesChange);
            UIObject.sections.responseDetailGridSection().on("click", UIObject.controls.buttons.CancelResponseAll, onBtnResponseCancelClick);
            UIObject.sections.responseDetailGridSection().on("click", UIObject.controls.buttons.SaveResponseAll, onDisabledButtonClick);
        };

        var SearchBind = function () {
            viewModel = kendo.observable({
                NoticeNumber: "",
                SupplierNameAndId: "", 
                SupplierId: 0,
                SupplierName: "",
                ShowCollapse: "none",
                ResponseStatusId: "0",

                SearchClick: function (e) {
                    e.preventDefault();
                    //if (this.NoSearchCriteria())
                    //{
                    //    $(this).displayError(UIObject.warnings.NoSearchCriteria);
                    //    return;
                    //}

                    kendo.ui.progress(UIObject.sections.responseDetailGridSection(), true);                    
                    if (this.get(UIObject.controls.textBoxes.SupplierNameAndIdObjField) == '')  //Prevent supply information deleted
                        this.set(UIObject.controls.textBoxes.SupplierIdObjField, 0);

                    $(this).ajaxCall(UIObject.controllerCalls.SearchResponse, { searchCriteria: JSON.stringify(this) })
                           .success(function (data) {
                               UIObject.sections.responseDetailGridSection().html(data);
                               //DisableEnableButtons(true);
                           }).error(
                           function () {
                               $(this).displayError(UIObject.errorMessage.GeneralError);
                                });

                },

                ClearClick: function (e) {
                    e.preventDefault();
                    this.set(UIObject.controls.textBoxes.NoticeNumberObjField, "");
                    this.set(UIObject.controls.textBoxes.SupplierNameAndIdObjField, "");
                    this.set(UIObject.controls.textBoxes.SupplierIdObjField, 0);
                    this.set(UIObject.controls.dropdownlists.ResponseStatusId, 0);

                    var inboundGrid = UIObject.controls.grids.InboundResponse;

                    if ((null != inboundGrid()) && (inboundGrid().dataSource.total() > 0))
                         inboundGrid().dataSource.data([]);
                },

                CloseSupplierClick: function (e) {
                    e.preventDefault();
                    UIObject.popWindow.supplierSearchDialog().center().close();
                },

                CollapseMasterDetailClick: function (e) {
                    var inboundGrid = UIObject.controls.grids.InboundResponse
                    var allMasterRows = inboundGrid().tbody.find('>tr.k-master-row');

                    for (var i = 0; i < allMasterRows.length; i++) {
                        inboundGrid().collapseRow(allMasterRows.eq(i));
                    }
                    //viewModel.set('ShowCollapse', 'none');
                    viewModel.set(UIObject.controls.buttons.ShowCollapseObjField, 'none')
                },

                NoSearchCriteria: function () {
                    var result = (this.SupplierNameAndId == "" && this.NoticeNumber == "")
                    return result;
                },

                SelectSupplierClick: function (e) {
                    e.preventDefault();
                    if (UIObject.controls.grids.SearchSupplier().dataSource.total() == 0) {
                        onDisplayError(UIObject.warnings.NoRowSelected);
                        return;
                    }

                    var item = UIObject.controls.grids.SearchSupplier().dataItem(UIObject.controls.grids.SearchSupplier().select());
                    if (item == null) {
                        onDisplayError(UIObject.warnings.NoRowSelected);
                        return;
                    }

                    viewModel.set(UIObject.controls.textBoxes.SupplierNameAndIdObjField, item.CompanyId + ", " + item.Name)
                    viewModel.set(UIObject.controls.textBoxes.SupplierIdObjField, item.CompanyId)
                    UIObject.popWindow.supplierSearchDialog().center().close();
                },

                onSearchSupplierClick: function (e) {
                    e.preventDefault();
                    UIObject.popWindow.supplierSearchDialog().center().open();
                },

                onViewSupplierClick: function (e) {
                    e.preventDefault();
                    var supplierId = viewModel.get(UIObject.controls.textBoxes.SupplierIdObjField)

                    if (supplierId > 0)
                        window.open(UIObject.controllerCalls.LoadSingleSupplier + "supplierId=" + supplierId, "_blank");
                }
            });

            kendo.bind(UIObject.sections.inboundResponseSearchSection(), viewModel);
            kendo.bind(UIObject.sections.supplierSearchFootSection(), viewModel);

            UIObject.controls.textBoxes.SupplierNameAndIdObj().keyup(function (e1) {
                var code = (e1.keyCode ? e1.keyCode : e1.which);
                if (code == 13) {//Search only on enter
                    viewModel.set(UIObject.controls.textBoxes.SupplierIdObjField, viewModel.get(UIObject.controls.textBoxes.SupplierNameAndIdObjField));
                $.post(UIObject.controllerCalls.SearchSupplierInfo, { supplierInfo: viewModel.get(UIObject.controls.textBoxes.SupplierNameAndIdObjField) }, function (data) {
                    viewModel.set(UIObject.controls.textBoxes.SupplierNameAndIdObjField, data);
                    });
                }
            });

            var noticObj = UIObject.controls.textBoxes.NoticeNumberObj().kendoAutoComplete({
                MinLength: 2,
                //dataTextField: "Text",
                filter: "startswith",
                dataSource: new kendo.data.DataSource({
                    transport: {
                        serverFiltering: true,
                        serverPaging: false,
                        read: {
                            url: UIObject.controllerCalls.NoticeAutoComplete,
                            type: "GET"
                        }
                    }

                 }),
            });                     
        };
     
        var SearchSupplierOnResponseDetailBind = function (responseId) {
            viewModel = kendo.observable({              
          
                CloseSupplierClick: function (e) {
                    e.preventDefault();
                    UIObject.popWindow.supplierSearchDialog().center().close();
                },             

                SelectSupplierClick: function (e) {
                    e.preventDefault();
                    if (UIObject.controls.grids.SearchSupplier().dataSource.total() == 0) {
                        onDisplayError(UIObject.warnings.NoRowSelected);
                        return;
                    }

                    var item = UIObject.controls.grids.SearchSupplier().dataItem(UIObject.controls.grids.SearchSupplier().select());
                    if (item == null) {
                        onDisplayError(UIObject.warnings.NoRowSelected);
                        return;
                    }

                    var supplierLabel = $('#lblSupplierInfoForResponseDetail' + responseId);
                    if (supplierLabel.length > 0) {
                        var newValue = item.CompanyId + ", " +item.Name;
                        var previousValue = supplierLabel.attr('data-previous-value');
                        if (newValue != previousValue) 
                            supplierLabel.attr('data-is-dirty', true);
                        else 
                            supplierLabel.removeAttr('data-is-dirty');

                        supplierLabel.text(newValue);
                        changeLayoutOnInputChange(responseId);
                    }

                    UIObject.popWindow.supplierSearchDialog().center().close();
                },

                onSearchSupplierClick: function (e) {
                    e.preventDefault();
                    UIObject.popWindow.supplierSearchDialog().center().open();
                },
           
            });

            kendo.bind(UIObject.sections.inboundResponseSearchSection(), viewModel);
            kendo.bind(UIObject.sections.supplierSearchFootSection(), viewModel);

            UIObject.controls.textBoxes.SupplierNameAndIdObj().keyup(function (e1) {
                var code = (e1.keyCode ? e1.keyCode : e1.which);
                if (code == 13) {//Search only on enter
                    viewModel.set(UIObject.controls.textBoxes.SupplierIdObjField, viewModel.get(UIObject.controls.textBoxes.SupplierNameAndIdObjField));
                $.post(UIObject.controllerCalls.SearchSupplierInfo, { supplierInfo: viewModel.get(UIObject.controls.textBoxes.SupplierNameAndIdObjField) }, function (data) {
                    viewModel.set(UIObject.controls.textBoxes.SupplierNameAndIdObjField, data);
                    });
                }
            });
                       
        };

        var EditSupplierOnResponseDetail = function () {
                    UIObject.popWindow.supplierSearchDialog().center().open();
                }

        function AddEmailOrDoman(responseID) {
            var editBtn = $('#EditSupplierBtn'+responseID);
            var strUrl =  GetEnvironmentLocation() + '/Operations/ObtainmentResponse/AddEmailOrDomain';
     
            $.ajax({
                 method:"POST",
                 url: strUrl,
                 data: {inboundResponseId: responseID},
                })
               .error(function(){
                   DisplayError('Error: Cannot add Email or Domain.');
               });
        }

        function InitializeSearch() {
            UIObject.controls.grids.InboundResponse().dataSource.read();
            kendo.bind(UIObject.sections.customerActionSection(), viewModel);
        };

        var loadSupplierPlugIn = function () {
            $.post(UIObject.controllerCalls.LoadSupplierPlugIn, { supplierId: 0 }, function (data) {
                UIObject.popWindow.supplierPlugIn().html(data);
            });
        };

        var MasterExpand = function () {
            viewModel.set(UIObject.controls.buttons.ShowCollapseObjField, 'inherit');
        };

        var MasterCollapse = function() {
          if ($("#gdInboundResponse td.k-hierarchy-cell").find("a.k-minus").length == 0)
              viewModel.set(UIObject.controls.buttons.ShowCollapseObjField, 'none');
        };

        // Response Detail Section
        function changeLayoutOnInputChange(inboundResponseId) {
            if (inboundResponseId) {
                var dirtyCount = $('span[id$=' +inboundResponseId + '][data-is-dirty="true"], input[id$=' +inboundResponseId + '][data-is-dirty="true"]').length;
                var cancelBtn = $('#' + UIObject.controls.buttons.CancelResponseSpecific + inboundResponseId);
                var saveBtn = $('#' + UIObject.controls.buttons.SaveResponseSpecific + inboundResponseId);

                var saveFunc = dirtyCount > 0 ? onBtnResponseSaveClick : onDisabledButtonClick;
                var addCancelClass = dirtyCount > 0 ? UIObject.classes.CancelIcon : UIObject.classes.RefreshIcon;
                var addSaveClass = dirtyCount > 0 ? null : UIObject.classes.DisabledLink;
                var cancelBtnText = dirtyCount > 0 ? 'Cancel' : 'Reload';
                var removeCancelClass = dirtyCount > 0 ? UIObject.classes.RefreshIcon : UIObject.classes.CancelIcon;
                var removeSaveClass = dirtyCount > 0 ? UIObject.classes.DisabledLink : null;

                saveBtn.off('click');
                saveBtn.on('click', saveFunc);
                saveBtn.removeClass(removeSaveClass).addClass(addSaveClass);

                var cancelBtnParts = $.parseHTML(cancelBtn.html());
                $(cancelBtnParts[0]).removeClass(removeCancelClass).addClass(addCancelClass);
                cancelBtnParts[1] = cancelBtnText;
                cancelBtn.html(cancelBtnParts[0].outerHTML + cancelBtnParts[1]);
            }
        }

        function onBtnResponseCancelClick(e) {
            e.preventDefault();

            var inboundResponseId = this.id.substring(UIObject.controls.buttons.CancelResponseSpecific.length);
            var dirtyCount = $('input[id$=' + inboundResponseId + '][data-is-dirty="true"]').length;
            if (dirtyCount > 0) {
                
                    var settings = {
                        message: "You are going to discard your response changes. Are you sure you would like to continue?",
                        header: "Discard Inbound Response Changes",
                    };

                    DisplayConfirmationModal(settings, function () {
                        refreshResponseLayout(inboundResponseId);
                    });

            } else {
                refreshResponseLayout(inboundResponseId);
            }
        }

        function onBtnResponseSaveClick(e) {
            e.preventDefault();

            var inboundResponseId = this.id.substring(UIObject.controls.buttons.SaveResponseSpecific.length);
            if (inboundResponseId) {

                var supplierElem = $('#' +UIObject.controls.labels.SupplierInfo +inboundResponseId);
                var supplierId =  supplierElem.length > 0 && supplierElem.text() ? supplierElem.text().split(',')[0].trim() : '';

                var responseStatusSelector = '#' + UIObject.controls.dropdownlists.ResponseStatusSpecific + inboundResponseId;
                var responseStatusElem = $(responseStatusSelector).data('kendoDropDownList');
                var responseStatusId = responseStatusElem ? responseStatusElem.value() : null;

                var formData = {};
                formData['InboundResponseId'] = inboundResponseId;
                formData['SupplierId']= supplierId;
                formData['ResponseStatusId']= responseStatusId;

                $(this).ajaxJSONCall(UIObject.controllerCalls.SaveResponseDetail, JSON.stringify(formData))
                    .success(function(successData) {
                        if (successData == false)
                            $(this).displayError("Error occurred.");
                        else { 
                            $(this).savedSuccessFully("Inbound response detail saved.");

                            var supplierAttached = supplierElem.attr('data-is-dirty');
                            if (supplierElem.length > 0) resetFieldDefaultValue(supplierElem[0]);
                            if (responseStatusElem) resetFieldDefaultValue(responseStatusElem.element[0]);
                            changeLayoutOnInputChange(inboundResponseId);

                            // Only attempt to check email and domain of supplier when attempting to attach a new one
                            if (supplierAttached == "true") {
                                var emailData = { "inboundResponseID": inboundResponseId };
                                $(this).ajaxCall(UIObject.controllerCalls.IfExistEmailOrDomain, emailData)
                                    .success(function(data) {
                                        if(data == false) {
                                            var args = { message: 'Do you want to add email or domain to supplier contact?', header: 'Add email and domain' };
                                                    DisplayConfirmationModal(args, function() { AddEmailOrDoman(inboundResponseId); });
                                        }
                                    })
                                    .error(function() {
                                        $(this).displayError('Error: Cannot add email or domain.');
                                    })
                                    .complete(function () {
                                        $('#' +UIObject.controls.buttons.EditSupplier +inboundResponseId).hide();
                                    });
                            }
                        }
                    })               
                    .error(function() {
                        $(this).displayError('Inbound response detail could not be saved.');
                    });
            }
        }

        function onDdlResponseStatusesChange(e) {
            onInputFieldChange(e);
            changeLayoutOnInputChange(this.id.substring(UIObject.controls.dropdownlists.ResponseStatusSpecific.length));
        }

        function onDisabledButtonClick(e) {
            e.preventDefault();
        }

        function onInputFieldChange(e) {
            var element = $(e.currentTarget);
            var defaultValue = element.is(':checkbox, :radio') ? element[0].defaultChecked : element[0].defaultValue;

            var currentValue = null;
            if (element.is(':checkbox, :radio'))
                currentValue = element[0].checked;
            else if (element.data('kendoDropDownList')) {
                var ddl = element.data('kendoDropDownList');
                currentValue = ddl.value() && ddl.value().length > 0 ? ddl.value() : "0";
            } else
                currentValue = element.val();

            if (defaultValue != currentValue)
                element.attr('data-is-dirty', true);
            else
                element.removeAttr('data-is-dirty');
        }

        function refreshResponseLayout(inboundResponseId) {
            if (inboundResponseId) {

                var formData = {
                    'inboundResponseId': parseInt(inboundResponseId)
                };

                $(this).ajaxJSONCall(UIObject.controllerCalls.GetInboundResponseById, JSON.stringify(formData))
                    .success(function(successData) {
                        if (successData) {
                            var ddl = $('#' +UIObject.controls.dropdownlists.ResponseStatusSpecific +inboundResponseId).data('kendoDropDownList');
                            if (ddl) {
                                ddl.value(successData.ResponseStatusId);
                                resetFieldDefaultValue(ddl.element[0]);
                            }

                            var label = $('#' +UIObject.controls.labels.SupplierInfo +inboundResponseId);
                            if(label.length > 0) {
                                label.text(successData.SupplierIdAndName);
                                resetFieldDefaultValue(label[0]);
                            }

                            changeLayoutOnInputChange(inboundResponseId);

                        } else
                            $(this).displayError("An error occurred refreshing the inbound response");
                    })
                    .error(function() {
                        $(this).displayError('An error occurred refreshing the inbound response');
                    });
            }
        }

        function resetFieldDefaultValue(field) {

            // Check if field is an input or label
            if (field.tagName == 'INPUT') {
                if (field.getAttribute('type') == 'checkbox' || field.getAttribute('type') == 'radio')
                    field.defaultChecked = field.checked;
                else
                    field.defaultValue = field.value;
            } else if (field.tagName == 'SPAN' && $(field).hasClass('display-label')) {
                field.setAttribute('data-previous-value', field.innerText);
            }

            field.removeAttribute('data-is-dirty');
        }

        return {
            PanelLoadCompleted: function (e) { $(e.item).find("a.k-link").remove(); var selector = "#" +e.item.id; $(selector).parent().find("li").remove(); },
            Initialize: Initialize,
            SearchBind: SearchBind,
            SearchSupplierOnResponseDetailBind: SearchSupplierOnResponseDetailBind,
            EditSupplierOnResponseDetail: EditSupplierOnResponseDetail,
            loadSupplierPlugIn: loadSupplierPlugIn,
            closeSupplierSearchWindow: function InitializeSearch() { UIObject.popWindow.supplierSearchDialog().close(); },
            MasterExpand: MasterExpand,          
            MasterCollapse: MasterCollapse
        };
    };
})(jQuery);
