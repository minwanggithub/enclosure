; (function ($) {
    if ($.fn.complibObtainmentResponse == null) {
        $.fn.complibObtainmentResponse = {};
    }

    $.fn.complibObtainmentResponse = function () {
        var viewModel = {};
        var supplierSearchViewModel = {};
        var notesModalSettings;
        var itemsChecked = 0;
        var previewInboundResponseId = null;
        var previewNoticeNumber = null;
        var emailResent = false;
        var selectedRequests = new Array();
        var selectedRows = new Array();

        var UIObject = {
            sections: {
                inboundResponseSearchSection: function () { return $("#divObtainmentResponseSearchSection"); },
                responseDetailGridSection: function () { return $("#ReponseDetail"); },
                supplierSearchFootSection: function () { return $("#supplierSearchFootSection"); },
                customerActionSection: function () { return $("#customerActionSection"); },
            },
            classes: {
                CancelIcon: 'k-i-cancel',
                DisabledLink: 'disabled-link',
                RefreshIcon: 'k-i-refresh'
            },
            controls: {
                buttons: {
                    CancelResponseAll: "[id^=btnResponseCancel_]",
                    CancelResponseSpecific: "btnResponseCancel_",
                    EditSupplierAll: "[id^=EditSupplierBtn_]",
                    EditSupplierSpecific: "EditSupplierBtn_",
                    SaveResponseAll: "[id^=btnResponseSave]",
                    SaveResponseSpecific: "btnResponseSave_",
                    ShowCollapseObjField: "ShowCollapse",
                    ResendObtainmentEmail: "[id^=btnResendObtainmentEmail]",
                    ResendObtainmentEmailSpecific: "btnResendObtainmentEmail_",
                    ResendPreviewEmail: "#btnResendPreviewEmail", // preview functionality
                    CancelPreviewEmail: "#btnCancelPreviewEmail",
                    SendOutlookCompositionEmail: "[id^=btnSendOutlookCompositionEmail]",
                    RefreshOutlookCompositionEmail: "[id^=btnRefreshOutlookCompositionEmail]",

                },
                containers: {
                    InboundResponsePanel: "InboundResponsePanel"
                },
                dropdownlists: {
                    ResponseStatusAll: "[id^=ddlResponseStatus]",
                    ResponseStatusId: "ResponseStatusId",
                    ResponseStatusSpecific: "ddlResponseStatus_",
                    ResponseHasNotes: "#HasNotes",
                    ResponseMethod: "#ResponseMethod",
                    DdlResponseStatus: "#mltDdlResponseStatus"
                },
                grids: {
                    InboundResponse: function () { return $("#gdInboundResponse").data("kendoGrid"); },
                    SearchSupplier: function () { return $("#gdSearchSupplier").data("kendoGrid"); },
                },
                labels: {
                    SupplierInfo: "lblSupplierInfoForResponseDetail",
                    UnprocessedResponsesCount: "lblUnprocessedCount",
                    LblFlagBy: "#lblFlagBy",
                    LblNoticeNumberSpecific: "#lblNoticeNumber_"
                },
                textBoxes: {
                    Description: "divDescription",
                    NoticeNumberObj: function () { return $("#NoticeNumber"); },
                    NoticeNumberObjField: "NoticeNumber",
                    StatusNotes: "hdnStatusNotes",
                    SupplierNameAndIdObj: function () { return $("#SupplierNameAndId"); },
                    SupplierNameAndIdObjField: "SupplierNameAndId",
                    SupplierIdObjField: "SupplierId",
                    ResponseNotesField: "#txtStatusNotes",
                    StatusNotesFieldAll: "[id^=txtStatusNotes]",
                    DateRangeFrom: "#txtDateRangeFrom",
                    DateRangeTo: "#txtDateRangeTo",
                    BodyText: "BodyText",
                    AccountId: "AccountId",
                    PreviewRecipients: "PreviewRecipients",
                    PreviewSubject: "PreviewSubject",
                    PreviewBody: "PreviewBody",
                    PreviewAttachments: "PreviewAttachments",
                    SubjectSenderEmail: "SubjectSenderEmail",
                    InboundResponseId: "InboundResponseId",
                    ToRecipients: "ToRecipients",
                    CCRecipients: "CCRecipients",
                },
                checkBoxes: {
                    chkHasNotes: "HasNotes"
                },
                tabstrip: {
                    tabObtainmentResponseDetail: "#tbObtainmentResponseDetail_"
                }
            },
            observable: {
                ResponseStatusList: "ResponseStatusList",
            },
            popWindow: {
                supplierSearchDialog: function () { return $("#supplierSearchWindow").data("kendoWindow"); },
                supplierPlugIn: function () { return $("#dgSupplierPlugIn"); },
                resendEmailDialog: function () { return $("#resendEmailWindow").data("kendoWindow"); }
            },
            controllerCalls: {
                GetInboundResponseById: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/GetInboundResponseById",
                SaveResponseDetail: GetEnvironmentLocation() + '/Operations/ObtainmentResponse/SaveInboundResponseDetail',
                SearchResponse: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/SearchInboundResponse",
                SearchSupplierInfo: GetEnvironmentLocation() + "/Operations/Company/LookUpSupplierOnKeyEnter",
                LoadSingleSupplier: GetEnvironmentLocation() + "/Operations/Company/LoadSingleSupplier?",
                LoadSupplierPlugIn: GetEnvironmentLocation() + "/Operations/Document/PlugInSupplierSearchAlt",
                NoticeAutoComplete: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/GetNoticeNumberSelect",
                IfExistEmailOrDomain: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/IfExistEmailOrDomain",
                ResendObtainmentEmail: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/ResendObtainmentEmail",
                GetObtainmentResponseContentBody: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/GetObtainmentResponseContentBody",
                ChangeStatus: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/ChangeStatus",
                SendInboundResponseEmailToOutlook: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/SendInboundResponseEmailToOutlook",
                ValidateEmailIds: GetEnvironmentLocation() + "/Operations/Company/ValidateEmailIds",
                UpdateEmailStatus: GetEnvironmentLocation() + "/Operations/Company/UpdateEmailStatus",
                InboundAttachmentFileHash: GetEnvironmentLocation() + "/Operations/ObtainmentResponse/InboundAttachmentFileHash"

            },
            warnings: {
                NoRowSelected: "No row selected, please try again.",
                NoSearchCriteria: "No search criteria entered.",
                ValidEmail: "Email is not valid."
            },
            errorMessage: {
                GeneralError: "Error Occurred on server call."
            },
        };

        var Initialize = function () {
            InitializeSearch();
        };

        var SearchBySupplierIdAndName = function (supplierId, supplierName) {

            viewModel.set(UIObject.controls.textBoxes.SupplierNameAndIdObjField, supplierId + ", " + supplierName);
            viewModel.set(UIObject.controls.textBoxes.SupplierIdObjField, supplierId);
            viewModel.set(UIObject.controls.checkBoxes.chkHasNotes, null);

            $(this).ajaxCall(UIObject.controllerCalls.SearchResponse, { searchCriteria: JSON.stringify(viewModel) })
                .success(function (data) {
                    UIObject.sections.responseDetailGridSection().html(data);
                }).error(
                    function () {
                        $(this).displayError(UIObject.errorMessage.GeneralError);
                    });

        }

        function GetResponseDetailView() {
            return new kendo.observable({
                InboundResponseId: 0,
                SupplierNameAndId: "",
                SupplierId: 0,
                SupplierName: "",
                ResponseStatusId: 0,
                HasNotes: false,
                ResponseNotes: "",
                isSaveButtonEnabled: false,
                isCancelButtonEnabled: false,
                Dirty: false,
                ResponseStatusLkp: null,

                onSelectSupplierNameAndIdChange: function (e) {
                    if ($(e.target).text() !== "") {
                        this.set("SupplierNameAndId", $(e.target).text());
                        var commaIndex = this.SupplierNameAndId.indexOf(",");
                        var sid = this.SupplierNameAndId.substr(0, commaIndex);
                        this.set("SupplierId", sid);

                        this.set("Dirty", true);
                    }
                 
                },

                onSearchSupplierClick: function (e) {
                    e.preventDefault();
                    //var inboundResponseId = e.currentTarget.id.substring(UIObject.controls.buttons.EditSupplierSpecific.length);
                    //var parsedValue = parseInt(inboundResponseId);
                    //this.set("ExistingInboundResponseId", (IsNumeric(parsedValue, false) == true) ? parsedValue : 0);
                    viewModel.set("ExistingInboundResponseId", this.InboundResponseId);
                    viewModel.set("DetailViewModel", this);
                    UIObject.popWindow.supplierSearchDialog().center().open();
                },
                onBtnResponseCancelClick: function (e) {
                    e.preventDefault();

                    var currentView = this;    //Context will change after the dialog displayed
                    if (this.Dirty) {
                        var settings = {
                            message: "You are going to discard your response changes. Are you sure you would like to continue?",
                            header: "Discard Inbound Response Changes"
                        };

                        _DisplayConfirmationModal(settings, function () {
                            var tabStrip = $(UIObject.controls.tabstrip.tabObtainmentResponseDetail + currentView.InboundResponseId).kendoTabStrip().data("kendoTabStrip");
                            tabStrip.reload("li:first");
                        });

                    }
                },
                onBtnResponseSaveClick: function (e) {
                    e.preventDefault();
                    var inboundResponseId = e.currentTarget.id.substring(UIObject.controls.buttons.SaveResponseSpecific.length);
                    var saveBtn = $('#' + UIObject.controls.buttons.SaveResponseSpecific + inboundResponseId);
                    if (saveBtn != null) {
                        var dataBindingSource = saveBtn.get(0).kendoBindingTarget.source;

                        var formData = {};
                        formData['InboundResponseId'] = dataBindingSource.InboundResponseId;
                        formData['SupplierId'] = dataBindingSource.SupplierId;
                        formData['ResponseStatusId'] = dataBindingSource.ResponseStatusId;
                        formData['ResponseNotes'] = dataBindingSource.ResponseNotes;

                        if (dataBindingSource.ResponseMethodId == 4) {

                            if (dataBindingSource.ResponseStatusDesc == "Pending" && dataBindingSource.ResponseStatusId == 1) {
                                saveResponse(formData, function () {
                                    dataBindingSource.set("Dirty", false);
                                });
                            }
                            else if (dataBindingSource.ResponseStatusId != 3) {
                                $(this).displayError("NETHUB Response can only be set to Processed.");
                            }
                            else if (dataBindingSource.ResponseStatusId == 3) {

                                var msg = "Are you sure you want to change the selected NETHUB response status to Processed? NETHUB responses marked Processed cannot be reset to Pending.<br>" +
                                    "You will still be able to Attach to Product and create revisions from attachments of an Inbound Response marked Pending.";
                                var settings = {
                                    message: (msg),
                                    header: "Confirm"
                                };
                                _DisplayConfirmationModal(settings, function () {
                                    saveResponse(formData, function () {
                                        dataBindingSource.set("Dirty", false);
                                    });
                                });

                            }

                        }
                        else {

                            saveResponse(formData, function () {
                                dataBindingSource.set("Dirty", false);
                            });

                        }
                    }
                },
                onBtnResponseResendClick: function (e) {
                    e.preventDefault();
                    BtnResendObtainmentEmailClick(e);
                },
              //TRECOMPLI-4698:Date and time stamp for file hash process & a button to re-run [VK]
                onBtnRunAutomationClick: function (e) {
                    e.preventDefault();
                    onBtnRunFileHash(e);
                },

                onResponseStatusChange: function (e) {
                    //Also triggered by detailVM.bind change, so no need to check the dirty status
                },

                
            });
        }

        var SearchBind = function () {
            viewModel = kendo.observable({
                NoticeNumber: "",
                SupplierNameAndId: "",
                SupplierId: 0,
                SupplierName: "",
                ShowCollapse: "none",
                ResponseStatusId: "1",
                ExistingInboundResponseId: 0,
                HasNotes: false,
                 ResponseMethod: 0,
                DateRangeFrom: null,
                DateRangeTo: null,
                BodyText: "",
                AccountId: "",
                InboundResponseId: "",
                SubjectSenderEmail: "",
                ToRecipients: "",
                CCRecipients: "",
                DetailViewModel: null,
                ResponseStatusList: null,
                SearchClick: function (e) {
                    e.preventDefault();
                    //TRECOMPLI:4496 Get multi selected response status ids and pass it to the request
                    this.set(UIObject.observable.ResponseStatusList, ($(UIObject.controls.dropdownlists.DdlResponseStatus).data("kendoMultiSelect").value()).map(function (item) {
                            return parseInt(item, 10);
                        }));
                    kendo.ui.progress(UIObject.sections.responseDetailGridSection(), true);
                    if (this.get(UIObject.controls.textBoxes.SupplierNameAndIdObjField) == '')  //Prevent supply information deleted
                        this.set(UIObject.controls.textBoxes.SupplierIdObjField, 0);

                    this.SupplierNameAndId = encodeURIComponent(this.get(UIObject.controls.textBoxes.SupplierNameAndIdObjField));
                    this.HasNotes = $(UIObject.controls.dropdownlists.ResponseHasNotes).data("kendoDropDownList").value();
                    if (this.HasNotes == "") this.HasNotes = null;

                    this. ResponseMethod = $(UIObject.controls.dropdownlists.ResponseMethod).data("kendoDropDownList").value();
                    if (this.ResponseMethod == "") this. ResponseMethod = null;

                    this.BodyText = this.get(UIObject.controls.textBoxes.BodyText);
                    this.AccountId = this.get(UIObject.controls.textBoxes.AccountId);

                    this.InboundResponseId = this.get(UIObject.controls.textBoxes.InboundResponseId);
                    this.SubjectSenderEmail = this.get(UIObject.controls.textBoxes.SubjectSenderEmail);
                    this.ToRecipients = this.get(UIObject.controls.textBoxes.ToRecipients);
                    this.CCRecipients = this.get(UIObject.controls.textBoxes.CCRecipients);
                    if ($(UIObject.controls.textBoxes.DateRangeFrom).data("kendoDatePicker").value() != null)
                        this.DateRangeFrom = $(UIObject.controls.textBoxes.DateRangeFrom).data("kendoDatePicker").value().toLocaleDateString();
                    else
                        this.DateRangeFrom = null;
                    if ($(UIObject.controls.textBoxes.DateRangeTo).data("kendoDatePicker").value() != null)
                        this.DateRangeTo = $(UIObject.controls.textBoxes.DateRangeTo).data("kendoDatePicker").value().toLocaleDateString();
                    else
                        this.DateRangeTo = null;

                    if (new Date(this.DateRangeFrom) > new Date(this.DateRangeTo) && this.DateRangeFrom != null && this.DateRangeTo != null) {
                        $(this).displayError("Invalid date range. ");
                        kendo.ui.progress(UIObject.sections.responseDetailGridSection(), false);
                        return;
                    }
                    // declare sarch variable here and use it for download inbonud excel download
                    this.ResponseStatusId = null;
                    inboundSearchCriteria = JSON.stringify(this);

                    //TRECOMPLI-4622:   Inbound Response - Supplier search issue [Vivek]
                    //If there is \(backslash) in supplier name  then add \\(double backslash) so that model can be deserialized in controller and page won't crash.
                    var containsBackSlash = this.SupplierNameAndId.includes('%5C');
                    this.SupplierNameAndId = containsBackSlash == true ? this.SupplierNameAndId.replace("%5C", "%5C%5C") : this.SupplierNameAndId;
                    
                    //TRECOMPLI - 4449 Applied check if all Search fields are empty [Vivek/Kshtish]
                    if (this.SupplierNameAndId != "" || this.HasNotes != null || this.AccountId != "" || this.InboundResponseId != ""
                        || this.SubjectSenderEmail != "" || this.DateRangeFrom != null || this.DateRangeTo != null
                        || this.NoticeNumber != "" || this.ResponseStatusList.length != 0 || this.ToRecipients != "" || this.CCRecipients != "") {

                        $(this).ajaxCall(UIObject.controllerCalls.SearchResponse, { searchCriteria: JSON.stringify(this) })
                            .success(function (data) {
                                UIObject.sections.responseDetailGridSection().html(data);
                            }).error(
                                function () {
                                    $(this).displayError(UIObject.errorMessage.GeneralError);
                                });
                    }
                    else {
                        $(this).displayError(UIObject.warnings.NoSearchCriteria);
                        kendo.ui.progress(UIObject.sections.responseDetailGridSection(), false);
                        return;
                    }

                },


                ClearClick: function (e) {

                    e.preventDefault();

                    this.set(UIObject.controls.textBoxes.NoticeNumberObjField, "");
                    this.set(UIObject.controls.textBoxes.SupplierNameAndIdObjField, "");
                    this.set(UIObject.controls.textBoxes.SupplierIdObjField, 0);
                    this.set(UIObject.controls.dropdownlists.ResponseStatusId, 0);
                    this.set(UIObject.controls.textBoxes.AccountId, "");
                    this.set(UIObject.controls.textBoxes.BodyText, "");
                    $(UIObject.controls.textBoxes.DateRangeFrom).data("kendoDatePicker").value("");
                    $(UIObject.controls.textBoxes.DateRangeTo).data("kendoDatePicker").value("");
                    $(UIObject.controls.dropdownlists.ResponseHasNotes).data("kendoDropDownList").value("");
                    $(UIObject.controls.dropdownlists.ResponseMethod).data("kendoDropDownList").value("");
                    //$(UIObject.controls.dropdownlists.ResponseStatusId).data("kendoDropDownList").value("");
                    this.set(UIObject.controls.textBoxes.SubjectSenderEmail, "");
                    this.set(UIObject.controls.textBoxes.ToRecipients, "");
                    this.set(UIObject.controls.textBoxes.CCRecipients, "");
                    this.set(UIObject.controls.textBoxes.InboundResponseId, "");

                    var inboundGrid = UIObject.controls.grids.InboundResponse;
                    if ((null != inboundGrid()) && (inboundGrid().dataSource.total() > 0))
                        inboundGrid().dataSource.data([]);

                },

                CloseSupplierClick: function (e) {
                    e.preventDefault();
                    this.set("ExistingInboundResponseId", 0);
                    UIObject.popWindow.supplierSearchDialog().center().close();
                },

                CollapseMasterDetailClick: function (e) {
                    var inboundGrid = UIObject.controls.grids.InboundResponse;
                    var allMasterRows = inboundGrid().tbody.find('>tr.k-master-row');

                    for (var i = 0; i < allMasterRows.length; i++) {
                        inboundGrid().collapseRow(allMasterRows.eq(i));
                    }
                    viewModel.set(UIObject.controls.buttons.ShowCollapseObjField, 'none');
                },

                NoSearchCriteria: function () {
                    var result = (this.SupplierNameAndId == "" && this.NoticeNumber == "");
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
                    if (this.ExistingInboundResponseId > 0) {

                        var supplierLabel = $('#lblSupplierInfoForResponseDetail_' + this.ExistingInboundResponseId);
                        if (supplierLabel.length > 0) {
                            var newValue = item.CompanyId + ", " + item.Name;
                            supplierLabel.text(newValue);
                            this.DetailViewModel.set("SupplierNameAndId", newValue);
                            this.DetailViewModel.set("SupplierId", item.CompanyId);
                            this.DetailViewModel.set("SupplierName", item.Name);
                            var supplierLink = $('#lnkSupplierInfoForResponseDetail_' + this.ExistingInboundResponseId);
                            var link = supplierLink.attr("href").split("=")[0] + "=" + item.CompanyId;
                            supplierLink.attr("href", link);

                        }
                        this.set("DetailViewModel", null);
                        this.set("ExistingInboundResponseId", 0);

                    } else {
                        viewModel.set(UIObject.controls.textBoxes.SupplierNameAndIdObjField, item.CompanyId + ", " + item.Name);
                        viewModel.set(UIObject.controls.textBoxes.SupplierIdObjField, item.CompanyId);
                    }

                    UIObject.popWindow.supplierSearchDialog().center().close();
                },
                onSearchSupplierClick: function (e) {
                    e.preventDefault();
                    var inboundResponseId = e.currentTarget.id.substring(UIObject.controls.buttons.EditSupplierSpecific.length);
                    var parsedValue = parseInt(inboundResponseId);
                    this.set("ExistingInboundResponseId", (IsNumeric(parsedValue, false) == true) ? parsedValue : 0);

                    UIObject.popWindow.supplierSearchDialog().center().open();
                },

                onViewSupplierClick: function (e) {
                    e.preventDefault();
                    var supplierId = viewModel.get(UIObject.controls.textBoxes.SupplierIdObjField);

                    if (supplierId > 0)
                        window.open(UIObject.controllerCalls.LoadSingleSupplier + "supplierId=" + supplierId, "_blank");
                },

                onSetResponseStatusClick: function (e) {
                    e.preventDefault();
                    SetAllStatus(e);
                },


                onBtnResponseCancelClick: function (e) {
                    //DoBtnResponseCancelClick(e);
                    e.preventDefault();
                    var inboundResponseId = e.target.id.substring(UIObject.controls.buttons.CancelResponseSpecific.length);
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
                },

                onSupplierNameAndIdChange: function (e) {
                    e.preventDefault();
                    var changedText = this.get("SupplierNameAndId");
                    if (changedText !== "") {
                        var commaIndex = changedText.indexOf(",");
                        if (commaIndex > 0) {
                            this.set("SupplierId", changedText.substr(0, commaIndex));
                        }
                        else
                            this.set("SupplierId", 0);
                    }
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

        function AddEmailOrDoman(responseID) {
            var editBtn = $('#EditSupplierBtn' + responseID);
            var strUrl = GetEnvironmentLocation() + '/Operations/ObtainmentResponse/AddEmailOrDomain';

            $.ajax({
                method: "POST",
                url: strUrl,
                data: { inboundResponseId: responseID },
            })
                .error(function () {
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

        var MasterExpand = function (e) {
            //TRECOMPLI-4455: Display Manage Recipient Tab on each row selection and status -Vivek
            //On Each row expand ,it will pick the selected row,then getting the Manage Recipient tab.
            //Based on the each row status, displaying the tab.
            var selectedRow = e.sender.dataItem(e.masterRow);
            var manageRecipientTab = $($(UIObject.controls.tabstrip.tabObtainmentResponseDetail + selectedRow.InboundResponseId).data("kendoTabStrip").items()[3]);

            (selectedRow.ResponseStatusId == 4 || selectedRow.ResponseStatusId == 7) ? manageRecipientTab.show() : manageRecipientTab.hide();

            viewModel.set(UIObject.controls.buttons.ShowCollapseObjField, 'inherit');

        };

        var MasterCollapse = function () {
            if ($("#gdInboundResponse td.k-hierarchy-cell").find("a.k-minus").length == 0)
                viewModel.set(UIObject.controls.buttons.ShowCollapseObjField, 'none');
        };

        var onInboundResponseDataBound = function () {
        };

        var setNotesModalSettings = function (settings) {
            notesModalSettings = settings;
        };

        // Response Search Panel Section
        function onUnprocessedResponseLabelClick() {
            $("#" + UIObject.controls.containers.InboundResponsePanel + " .k-header:first").trigger('click');
        }

        // Response Detail Section, need review, not efficient logic
        function changeLayoutOnInputChange(inboundResponseId) {
            if (inboundResponseId) {
                var dirtyCount = $('span[id$=' + inboundResponseId + '][data-is-dirty="true"], input[id$=' + inboundResponseId + '][data-is-dirty="true"]').length;
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

        //Obsoleted
        //function DoBtnResponseCancelClick(e) {
        //    e.preventDefault();
        //    var inboundResponseId = this.id.substring(UIObject.controls.buttons.CancelResponseSpecific.length);
        //    var dirtyCount = $('input[id$=' + inboundResponseId + '][data-is-dirty="true"]').length;
        //    if (dirtyCount > 0) {

        //            var settings = {
        //                message: "You are going to discard your response changes. Are you sure you would like to continue?",
        //                header: "Discard Inbound Response Changes",
        //            };

        //            DisplayConfirmationModal(settings, function () {
        //                refreshResponseLayout(inboundResponseId);
        //            });

        //    } else {
        //        refreshResponseLayout(inboundResponseId);
        //    }
        //}


        //Need to review
        function onBtnResponseSaveClick(e) {
            e.preventDefault();

            var inboundResponseId = this.id.substring(UIObject.controls.buttons.SaveResponseSpecific.length);
            if (inboundResponseId) {

                var supplierElem = $('#' + UIObject.controls.labels.SupplierInfo + inboundResponseId);
                var supplierId = supplierElem.length > 0 && supplierElem.text() ? supplierElem.text().split(',')[0].trim() : '';

                var responseStatusSelector = '#' + UIObject.controls.dropdownlists.ResponseStatusSpecific + inboundResponseId;
                var responseStatusElem = $(responseStatusSelector).data('kendoDropDownList');
                var responseStatusId = responseStatusElem ? responseStatusElem.value() : null;
                var responseNoteElem = $(UIObject.controls.textBoxes.ResponseNotesField + inboundResponseId);

                var formData = {};
                formData['InboundResponseId'] = inboundResponseId;
                formData['SupplierId'] = supplierId;
                formData['ResponseStatusId'] = responseStatusId;
                formData['ResponseNotes'] = responseNoteElem.val();

                saveResponse(formData, function () {
                    var supplierAttached = supplierElem.attr('data-is-dirty');
                    if (supplierElem.length > 0) resetFieldDefaultValue(supplierElem[0]);
                    if (responseStatusElem) resetFieldDefaultValue(responseStatusElem.element[0]);
                    if (responseNoteElem) responseNoteElem.removeAttr('data-is-dirty');

                    var hdnStatusNotes = $('#' + UIObject.controls.textBoxes.StatusNotes + formData.InboundResponseId);
                    if (hdnStatusNotes.length > 0 && hdnStatusNotes.val()) {
                        var descElem = $('#' + UIObject.controls.textBoxes.Description + inboundResponseId);
                        descElem.text(descElem.text() + ' ' + hdnStatusNotes.val());
                        hdnStatusNotes.val(null);
                    }

                    refreshResponseLayout(inboundResponseId);

                    // Only attempt to check email and domain of supplier when attempting to attach a new one
                    if (supplierAttached == "true") {
                        var emailData = { "inboundResponseID": inboundResponseId };
                        $(this).ajaxCall(UIObject.controllerCalls.IfExistEmailOrDomain, emailData)
                            .success(function (data) {
                                if (data == false) {
                                    var args = { message: 'Do you want to add email or domain to supplier contact?', header: 'Add email and domain' };
                                    DisplayConfirmationModal(args, function () { AddEmailOrDoman(inboundResponseId); });
                                }
                            })
                            .error(function () {
                                $(this).displayError('Error: Cannot add email or domain.');
                            })
                            .complete(function () {
                                $('#' + UIObject.controls.buttons.EditSupplierSpecific + inboundResponseId).hide();
                            });
                    }
                });
            }
        }

        function saveResponse(data, successFunc) {
         
            $(this).ajaxJSONCall(UIObject.controllerCalls.SaveResponseDetail, JSON.stringify(data))
                .success(function (successData) {

                    if (successData.result == true) {
                        $(this).savedSuccessFully("Inbound response detail saved.");
                        if (successFunc) successFunc();
                    }
                    else {
                        $(this).displayError(successData.message);
                    }

                })
                .error(function () {
                    $(this).displayError('Inbound response detail could not be saved.');
                });
        }

        function onDdlResponseStatusesChange(e) {
            onInputFieldChange(e);
            changeLayoutOnInputChange(this.id.substring(UIObject.controls.dropdownlists.ResponseStatusSpecific.length));
        }

        function onStatusesNotesChange(e) {
            $(e.currentTarget).attr('data-is-dirty', true);
            changeLayoutOnInputChange(this.id.substring(UIObject.controls.textBoxes.ResponseNotesField.length - 1));
        }

        function onDisabledButtonClick(e) {
            e.preventDefault();
        }

        function onBtnCancelPreviewEmailClick(e) {
            e.preventDefault();
            UIObject.popWindow.resendEmailDialog().close();
        }

        function onBtnResendPreviewEmail() {
            var formData = {
                'inboundResponseId': previewInboundResponseId,
                'noticeNumber': previewNoticeNumber,
                'preview': false
            };

            $(this).ajaxJSONCall(UIObject.controllerCalls.ResendObtainmentEmail, JSON.stringify(formData))

                .success(function (result) {

                    if (result.successful) {
                        $(this).savedSuccessFully(result.message);
                        UIObject.popWindow.resendEmailDialog().close();
                    } else {
                        $(this).displayError(result.message);
                    }
                })
                .error(function () {
                    $(this).displayError('An error occurred while resending the email assocaited with this response.');
                });

        };
        //TRECOMPLI-4698:Date and time stamp for file hash process & a button to re-run [VK]
        function onBtnRunFileHash(e) {
            $("#btnRunAutomation_" + $(e)[0].data.InboundResponseId).prop("disabled", true);
            var formData = {
                'inboundResponseId': $(e)[0].data.InboundResponseId
            };
            $(this).ajaxJSONCall(UIObject.controllerCalls.InboundAttachmentFileHash, JSON.stringify(formData))

                .success(function (result) {
                    $("#btnRunAutomation_" + $(e)[0].data.InboundResponseId).prop("disabled", false);
                    debugger;
                    if (result.successful) {
                        $("#btnRunAutomation_" + $(e)[0].data.InboundResponseId).prop("disabled", false);
                        $(this).savedSuccessFully("FileHash process run successfully");
                    } else {
                        $("#btnRunAutomation_" + $(e)[0].data.InboundResponseId).prop("disabled", false);
                        $(this).displayError("FileHash process stopped");
                    }
                })
                .error(function () {
                    $("#btnRunAutomation_" + $(e)[0].data.InboundResponseId).prop("disabled", false);
                    $(this).displayError('An error occurred while file hash Process.');
                });

        };

        function BtnResendObtainmentEmailClick(e) {
            var inboundResponseId = e.currentTarget.id.substring(UIObject.controls.buttons.ResendObtainmentEmailSpecific.length);
            if (inboundResponseId) {

                var noticeNumber = $(UIObject.controls.labels.LblNoticeNumberSpecific + inboundResponseId).text();

                previewInboundResponseId = inboundResponseId;
                previewNoticeNumber = noticeNumber;

                var formData = {
                    'inboundResponseId': parseInt(inboundResponseId),
                    'noticeNumber': noticeNumber,
                    'preview': true
                };

                $(this).ajaxJSONCall(UIObject.controllerCalls.ResendObtainmentEmail, JSON.stringify(formData))

                    .success(function (result) {

                        if (result.successful) {

                            // populate the preview pane and display it. although the email preview may be
                            // visible, the attachments may no longer be available on disk.

                            $("#previewSender").html(result.data.Sender);
                            $("#previewRecepients").html(result.data.Recepients);
                            $("#previewSubject").html(result.data.Subject);
                            $("#previewBody").html(result.data.Body);

                            var attachments = result.attachments;
                            if (result.attachmentsCount > 0 && result.attachmentsAvailable == false) {
                                attachments = "<b>Attachments are no longer available.</b><br>" +
                                    "<strike>" + attachments + "</strike>";
                            }

                            $("#previewAttachments").html(attachments);

                            // if there are attachments, but are not available on disk, indicate
                            // so and let user decide what to do.

                            UIObject.popWindow.resendEmailDialog().center().open();

                        } else {

                            $(this).displayError(result.message);

                        }
                    })
                    .error(function () {
                        // the attachments associated with the email are no longer available on disk
                        // the email can not be re-sent
                        $(this).displayError('An error occurred while resending the email assocaited with this response.');
                    });
            }

        }
        var onInboundResponseDetailBinding = function (templateRow, irModel) {
            var detailVM = GetResponseDetailView();
            detailVM.set("InboundResponseId", irModel.InboundResponseId);
            detailVM.set("ResponseNotes", irModel.ResponseNotes);
            detailVM.set("ResponseStatusLkp", irModel.ResponseStatusLkp);
            detailVM.set("ResponseStatusId", irModel.ResponseStatusId);
            detailVM.set("SupplierId", irModel.SupplierId);
            detailVM.set("SupplierName", irModel.SupplierName);
            detailVM.set("SupplierNameAndId", irModel.SupplierIdAndName);
            detailVM.set("ResponseMethodId", irModel.ResponseMethodId);
            detailVM.set("ResponseStatusDesc", irModel.ResponseStatusDesc);

            detailVM.bind("change", function (e) { //alert(e.field, "=", this.get(e.field));
                if (e.field == "Dirty")
                    return;
                detailVM.set("Dirty", true);
            });
            kendo.bind(templateRow, detailVM);

            $(UIObject.controls.buttons.CancelPreviewEmail).on("click", onBtnCancelPreviewEmailClick);
            $(UIObject.controls.buttons.ResendPreviewEmail).on("click", onBtnResendPreviewEmail);

            $(this).ajaxCall(UIObject.controllerCalls.GetObtainmentResponseContentBody, { inboundResponseId: irModel.InboundResponseId })
                .success(function (data) {
                    //Earlier HtmlFormat was hardcoded to true at server side,now it is changed and hardcoded here due to deprecation of HtmlAgility pack [TRECOMPLI-4524]
                    data.HtmlFormat = true;
                    if (data.HtmlFormat)
                        $("#html_mail_body_" + irModel.InboundResponseId).attr("srcdoc",  data.ContentBody);
                    else
                        $("#text_mail_body_" + irModel.InboundResponseId).val(data.ContentBody);                    
                }).error(function () {
                    kendo.alert("Loading error");
                });

        };

        var ReRouteIdDetail = function (whereTo, routeId) {
            if (routeId === null)
                return '';

            if (whereTo === 'Product')
                //return "<a href='../../Configuration/ProductManager/ConfigProduct?productid=" + productId + "' title='View Product Detail',  target='_blank'>" + "<span class='icon-eye-open' style='cursor: hand;'></a>";
                return "<a href='../../Configuration/ProductManager/ConfigProduct?productid=" + routeId + "' title='View Product Detail',  target='_blank'>" + routeId + "</a>";
            else if (whereTo === 'Document')
                return "<a href='../../Operations/Document/DocumentMainAlt?documentId=" + routeId + "' title='View Document Detail',  target='_blank'>" + routeId + "</a>";
        };


        //Need to obsolete
        function onResponseDetailExpand(e) {
            var detailRow = e.detailRow.find('[id="InboundResponseSection"]');
            if (detailRow.length > 0) {
                var searchButton = detailRow.find(UIObject.controls.buttons.EditSupplierAll);

                if (searchButton.length > 0 && typeof detailRow.attr('data-mvvm-bound') == 'undefined') {

                    detailRow.attr('data-mvvm-bound', true);
                    kendo.bind(detailRow, viewModel);

                    // get inbound response id
                    var inboundResponseId = e.sender.dataItem(e.masterRow).InboundResponseId;

                    $(this).ajaxCall(UIObject.controllerCalls.GetObtainmentResponseContentBody, { inboundResponseId: inboundResponseId })
                        .success(function (data) {

                            data = data.Content;

                            if (e.sender.dataItem(e.masterRow).HtmlFormat)
                                $("#html_mail_body_" + inboundResponseId).attr("srcdoc", "<html><body>" + data + "</body></html>");
                            else
                                $("#text_mail_body_" + inboundResponseId).val(data);

                            /*var target = "#html_mail_body_" + inboundResponseId;
                            if ($(target).size[0] == 0) {
                                target = "#text_mail_body_" + inboundResponseId;
                                $(target).val(data);
                            }
                            else
                                $(target).attr("srcdoc", "<html><body>" + data + "</body></html>");*/

                        }).error(
                            function () {

                            });
                }

            }

        }

        //Need to obsolete
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

        //Need to obsolete
        function refreshResponseLayout(inboundResponseId) {
            if (inboundResponseId) {

                var formData = {
                    'inboundResponseId': parseInt(inboundResponseId)
                };

                $(this).ajaxJSONCall(UIObject.controllerCalls.GetInboundResponseById, JSON.stringify(formData))
                    .success(function (successData) {
                        if (successData) {
                            var ddl = $('#' + UIObject.controls.dropdownlists.ResponseStatusSpecific + inboundResponseId).data('kendoDropDownList');
                            if (ddl) {
                                ddl.value(successData.ResponseStatusId);
                                resetFieldDefaultValue(ddl.element[0]);
                            }

                            var label = $('#' + UIObject.controls.labels.SupplierInfo + inboundResponseId);
                            if (label.length > 0) {
                                label.text(successData.SupplierIdAndName);

                                if (successData.SupplierIdAndName && successData.SupplierIdAndName.length > 0) {
                                    $('#' + UIObject.controls.buttons.EditSupplierSpecific + inboundResponseId).hide();
                                }

                                resetFieldDefaultValue(label[0]);
                            }

                            var field = $('#' + UIObject.controls.textBoxes.Description + inboundResponseId);
                            if (field.length > 0) {
                                field.text(successData.Description);
                            }


                            field = $(UIObject.controls.textBoxes.ResponseNotesField + inboundResponseId);
                            if (field.length > 0) {
                                field.val(successData.ResponseNotes);
                            }

                            label = $(UIObject.controls.labels.LblFlagBy + inboundResponseId);
                            if (label.length > 0) {
                                label.text('By ' + successData.ResponseNotesBy);
                            }


                            changeLayoutOnInputChange(inboundResponseId);

                        } else
                            $(this).displayError("An error occurred refreshing the inbound response");
                    })
                    .error(function () {
                        $(this).displayError('An error occurred refreshing the inbound response');
                    });
            }
        }

        //Need to obsolete
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

        UIObject.sections.responseDetailGridSection().on("click", ".chkMasterMultiSelect", function (e) {

            var checked = $(this).is(':checked');
            var grid = $(this).parents('.k-grid:first');
            if (grid) {
                var kgrid = grid.data().kendoGrid;
                if (kgrid._data.length > 0) {
                    $.each(kgrid._data, function () {
                        this['IsSelected'] = checked;
                    });

                    $('tr', grid).each(function () {
                        var tr = $(this);
                        if (checked) {
                            tr.addClass('k-state-selected');
                            $('.chkMultiSelect', tr).prop('checked', true);
                        } else {
                            tr.removeClass('k-state-selected');
                            $('.chkMultiSelect', tr).removeAttr('checked');
                        }
                    });

                }

            }
            e.stopImmediatePropagation();

        });

        UIObject.sections.responseDetailGridSection().on("click", ".chkMultiSelect", function (e) {

            selectedRequests = new Array();
            var checked = $(this).is(':checked');
            var grid = $(this).parents('.k-grid:first');
            if (grid) {
                var kgrid = grid.data().kendoGrid;
                var selectedRow = $(this).closest('tr');
                var dataItem = kgrid.dataItem(selectedRow);
                if (dataItem) {
                    dataItem['IsSelected'] = checked;
                }

                if (checked) {
                    selectedRow.addClass('k-state-selected');
                    $('.chkMultiSelect ', selectedRow).prop('checked', true);
                } else {
                    selectedRow.removeClass('k-state-selected');
                    $('.chkMultiSelect', selectedRow).removeAttr('checked');
                }

            }

            e.stopImmediatePropagation();

        });

        function SetAllStatus(e)
        {
            var status = $('#ddlSetResponseStatus').val();
            var isNethubRecordSelected = false;
            var isNonNethubRecordSelected = false;
            var IsAnyProcessedNethubRecordSelected = false;
            selectedRequests = new Array();
            itemsChecked = 0;

            var grid = $('#gdInboundResponse');
            if (grid) {

                var kgrid = grid.data().kendoGrid;
                if (kgrid._data.length > 0) {
                    $.each(kgrid._data,
                        function() {
                            if (this['IsSelected']) {
                                selectedRequests.push(this["InboundResponseId"]);
                                itemsChecked++;
                                if (this['ResponseMethodId'] == 4 && this['ResponseStatusId'] == 3) {//NETHUB & ProcessedRecord
                                    IsAnyProcessedNethubRecordSelected = true;
                                }
                                if (this['ResponseMethodId'] == 4) {//NethubRecord
                                    isNethubRecordSelected = true;
                                }
                                else {//NonNethub
                                    isNonNethubRecordSelected = true;
                                }
                            } else {
                                var index = selectedRequests.indexOf(this["InboundResponseId"]);
                                if (index > -1)
                                    selectedRequests.splice(index, 1);
                            }

                        });

                }
            }

            var func_SubmitRequest = function () {
                $(this).ajaxCall(UIObject.controllerCalls.ChangeStatus, { inboundResponseIDs: selectedRequests, statusID: status })
                    .success(function (data) {
                        if (data == 'success') {
                            $('#searchResponseBtn').trigger('click');
                            $(this).savedSuccessFully("Inbound response status set.");
                        } else {
                            $(this).displayError("Status of any of the selected responses could not be set. They may already be in the selected state.");
                        }
                    }).error(
                        function () {
                            $(this).displayError("Error Set Status.");
                        });
            }

            if (itemsChecked > 0 && status > 0) {

                // no mixing
                if (isNethubRecordSelected && isNonNethubRecordSelected) {
                    $(this).displayError("You selected NETHUB and non-NETHUB responses, the status cannot be changed for both types. " +
                                            "Please remove either the NETHUB or non-NETHUB response from your selection.");
                    return;
                }

                if (isNethubRecordSelected) {

                    if (status != 3) {
                        $(this).displayError("The NETHUB status can only be set to Processed.");
                        return;
                    }

                    /*
                    if (status == 1) {

                        var msg = "Selected NETHUB responses can be set to Pending status if there are no additional submissions.<br>" +
                            "You may alternately consider setting them to Processed status.<br><br>" +
                            "You will still be able to Attach to Product and create revisions from attachments.";
                        var settings = {
                            message: (msg),
                            header: "Confirm"
                        };
                        _DisplayConfirmationModal(settings, function () {
                            func_SubmitRequest();
                        });

                    }
                    */

                    if (status == 3) {
                        var msg = "Are you sure you want to change the selected NETHUB responses status to Processed? NETHUB responses marked Processed cannot be reset to Pending.<br>" + 
                                  "You will still be able to Attach to Product and create revisions from attachments of an Inbound Response marked Pending.";
                        var processedRecordSelectedMsg = '<br><br>Any selected NETHUB responses that are already in a Processed state will be ignored.';
                        var finalMsg = msg + (IsAnyProcessedNethubRecordSelected ? processedRecordSelectedMsg : "")
                        var settings = {
                            message: (finalMsg),
                            header: "Confirm"
                        };
                        _DisplayConfirmationModal(settings, function () {
                            func_SubmitRequest();
                        });

                    }

                } else {
                    func_SubmitRequest();
                }
               
            }
            else {
                  $(this).displayError("Please select inbound responses items and the status.");
            }

            e.stopImmediatePropagation();

        }

        var UpdateEmailStatus = function(action, id, e) {

            var data = {};

            data.invalid = (action != "AUTOREPLY");
            data.EmailIds = $("#txtEmailsToManage" + id).val();
            data.Notes = $("#txtEmailStatusNotes" + id).val();
            data.InboundResponseId = id;

            //TRECOMPLI-4447 :  Validating Email and marking emails invalid on Manage Recipients tab in Inbound Response screen[Vivek and Kshitish]
            var txtAreaId = "#txtEmailsToManage" + id;
            FilterEmailIds(txtAreaId);

            if (!$("#txtEmailsToManage" + id).val() || $.trim($("#txtEmailsToManage" + id).val()) ==="") {
                $(this).displayError(UIObject.warnings.ValidEmail);
                return;
            }

            data.EmailIds = data.EmailIds.replaceAll('<', '').replaceAll('>', '');
            if (action == "AUTOREPLY") {
                data.Notes = data.Notes.replaceAll('<', '').replaceAll('>', '');
            }

            var maxLengthForNotes = 500;
            if (action == "AUTOREPLY" && data.Notes.length > maxLengthForNotes) {
                kendo.alert("Notes should be less then " + maxLengthForNotes + " characters.");
                return;
            }

            if (data.invalid) data.Notes = "Marked invalid.";

            var url = UIObject.controllerCalls.UpdateEmailStatus;
            $(this).ajaxCall(url, data)

                .success(function (data) {
                    $("#txtEmailsToManage" + id).val(data+"\n");
                    $(this).savedSuccessFully("Email status updated.");

                }).error(function () {
                    $(this).displayError(UIObject.errorMessage.GeneralError);
                });

        }

        //TRECOMPLI-4447 :  Validating Email and marking emails invalid on Manage Recipients tab in Inbound Response screen[Vivek and Kshitish]
        var ValidateEmail = function (e) {
            var keyCode = window.event.keyCode;
            var ctrlKey = window.event.ctrlKey;
            var txtAreaId = "#" + e.id;
            if (keyCode === 13 || keyCode === 17 || (ctrlKey && keyCode === 86)) {
                FilterEmailIds(txtAreaId);
            }
        }

        var OnfocusOutValidateEmail = function (e) {
            var txtAreaId = "#" + e.id;
            FilterEmailIds(txtAreaId);
        }

        var FilterEmailIds = function (id) {
            var txtAreaId = id;
            var data = {};
            data.emailIds = $(txtAreaId).val().replaceAll('<', '').replaceAll('>', '');
            var url = UIObject.controllerCalls.ValidateEmailIds;
            $(this).ajaxCall(url, data)

                .success(function (data) {
                    $(txtAreaId).val(data+"\n");

                }).error(function () {
                    $(this).displayError(UIObject.warnings.ValidEmail);
                    kendo.alert("An error was encountered.");
                });
        }
       

        return {
            PanelLoadCompleted: function (e) { $(e.item).find("a.k-link").remove(); var selector = "#" +e.item.id; $(selector).parent().find("li").remove(); },
            Initialize: Initialize,
            SearchBind: SearchBind,
            loadSupplierPlugIn: loadSupplierPlugIn,
            closeSupplierSearchWindow: function InitializeSearch() { UIObject.popWindow.supplierSearchDialog().close(); },
            onInboundResponseDataBound: onInboundResponseDataBound,
            MasterExpand: MasterExpand,          
            MasterCollapse: MasterCollapse,
            OnResponseDetailExpand: onResponseDetailExpand,
            setNotesModalSettings: setNotesModalSettings,
            SearchBySupplierIdAndName: SearchBySupplierIdAndName,            
            onInboundResponseDetailBinding: onInboundResponseDetailBinding,
            ReRouteIdDetail: ReRouteIdDetail,
            ValidateEmail: ValidateEmail,
            OnfocusOutValidateEmail: OnfocusOutValidateEmail,
            UpdateEmailStatus: UpdateEmailStatus
        };
    };
})(jQuery);
