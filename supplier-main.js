; (function ($) {
    if ($.fn.complibSupplier == null) {
        $.fn.complibSupplier = { };
    }

    $.fn.complibSupplier = function () {
        //local var
        var obtainmentSettingId;
        var texts = [];

        //local funcs
        function GetCompany() {
            //var url = '@Url.Action("LookUpSupplierOnKeyEnter", "Company")';
            var url = "../Company/LookUpSupplierOnKeyEnter";
            var supplierInfo = $("#txtSearchSupplierId").val();
            $.post(url, { supplierInfo: supplierInfo }, function (data) {
                $('#txtSearchSupplierId').val(data);
            });
        }

        function DisableControls(disable, fromInput) {
            var datepicker = $("#ObtainmentSettingPauseNotificationDP").data("kendoDatePicker");
            var ddlObtainmentStartAction = $("#ddlObtainmentStartAction").data("kendoDropDownList");
            var ddlRenewalStartAction = $("#ddlRenewalStartAction").data("kendoDropDownList");
            var ddlDoNotObtainNotes = $("#ddlDoNotObtainNotes").data("kendoDropDownList");
            if (disable) {
                if (fromInput) {
                    $("#ObtainmentSettingDoNotObtain").attr("disabled", "disabled");
                    $("#ObtainmentSettingDoNotObtain").removeAttr("checked");
                    ddlDoNotObtainNotes.enable(false);
                    ddlDoNotObtainNotes.value("");
                    $("#ObtainmentSettingPauseNotification").removeAttr("checked");
                }
                $("#gdWebSites").data("kendoGrid").dataSource.data([]);
                $("#gdContacts").data("kendoGrid").dataSource.data([]);
                $("#ObtainmentSettingPauseNotification").attr("disabled", "disabled");
                $("#PauseNotificationNote").attr("disabled", "disabled");
                $("#PauseNotificationNote").val("");
                datepicker.enable(false);
                datepicker.value("");
                ddlRenewalStartAction.enable(false);
                ddlRenewalStartAction.value("");
                ddlObtainmentStartAction.enable(false);
                ddlObtainmentStartAction.value("");
                $("#btnAddContact").addClass("k-state-disabled");
                $("#DetailSupplier").off("click", "#btnAddContact", fnbtnAddContact);
                $("#DetailSupplier").off("click", "#btnAddWebSite", fnbtnAddWebSite);
                $("#btnAddWebSite").addClass("k-state-disabled");
            } else {
                if (fromInput) {
                    $("#ObtainmentSettingDoNotObtain").removeAttr('disabled');
                }
                $("#ObtainmentSettingPauseNotification").removeAttr('disabled');
                ddlRenewalStartAction.enable();
                ddlObtainmentStartAction.enable();
                ddlDoNotObtainNotes.enable(false);
                ddlDoNotObtainNotes.value("");
                if ($('#ObtainmentSettingID').val() != "0") {
                    $("#btnAddWebSite").removeClass("k-state-disabled");
                    // $("#btnAddWebSite").bind('click');
                    $("#DetailSupplier").on("click", "#btnAddWebSite", fnbtnAddWebSite);
                    $("#btnAddContact").removeClass("k-state-disabled");
                    $("#DetailSupplier").on("click", "#btnAddContact", fnbtnAddContact);
                }
            }
        }

        function serializeArray(prefix, array, result) {
            for (var i = 0; i < array.length; i++) {
                if ($.isPlainObject(array[i])) {
                    for (var property in array[i]) {
                        result[prefix + "[" + i + "]." + property] = array[i][property];
                    }
                } else {
                    result[prefix + "[" + i + "]"] = array[i];
                }
            }
        }

        //----------------------start of normal public func---------------------------
        var initializeSupplierLibrary = function () {
            menuHelper.turnMenuActive($("#menuOperations"));

            $("#DetailSupplier").on("focusin", "#FormIdentification", function () {
                $('#FormIdentification').updateValidation();
            });

            $("#DetailSupplier").on("click", "#btnSaveIdentification", function (e) {
                e.preventDefault();
                var form = $("#FormIdentification");
                if (form.valid()) {
                    var formData = form.serialize();
                    // First check if a status change needs to display a notes popup
                    var url = "../Company/GetStatusAction";
                    $.post(url, formData, function (data) {

                        if (data.displayMessage) {
                            if (data.statusError == true)
                                displayErrorMessage(data.displayMessage);
                            else {
                                displayStatusNoteConfirmation(data, function (eval) {
                                    // Attach notes field information into form to be serialized
                                    $("#FormIdentification").find('#StatusNotes').val(eval.modalNotes);
                                    saveIdentificationInfo(true);
                                });
                            }
                        } else
                            saveIdentificationInfo();
                    });

                }
            });

            //the following snippet has been modified to support the post action in lib
            $("#DetailSupplier").on("click", "#AddObtainmentType", function (e) {
                e.preventDefault();
                var url = "../ObtainmentSettings/GetObtainmentSettingsDetail";
                var supplierId = $("#SupplierId").val();
                obtainmentSettingId = 0;

                $.post(url, { SupplierId: supplierId, ObtainmentSettingID: '0' },
                    function (data) {
                        $('#ObtainmentSettingsDetail').html(data);
                    });
            });

            $("#DetailSupplier").on("click", "#btnDiscardObtainmentSettingDetail", function () {
                $('#ObtainmentSettingsDetail').html("");
            });

            $("#DetailSupplier").on("click", "#AddSupplierFacility", function (e) {
                e.preventDefault();
                //var url = '@Url.Action("GetSupplierFacilityDetail", "Company")';
                var url = "../Company/GetSupplierFacilityDetail";
                var supplierId = $("#SupplierId").val();
                $.post(url, { SupplierId: supplierId, SupplierFacilityId: '0' },
                    function (data) {
                        $('#SupplierFacilitiesDetail').html(data);
                    });
            });

            $("#DetailSupplier").on("click", "#AddSupplierContact", function (e) {
                e.preventDefault();
                //var url = '@Url.Action("GetSupplierContactDetail", "Company")';
                var url = "../Company/GetSupplierContactDetail";
                var supplierId = $("#SupplierId").val();
                $.post(url, { SupplierId: supplierId, supplierContactId: '0' },
                    function (data) {
                        $('#CompanyContactDetailResult').html(data);
                    });
            });

            $("#DetailSupplier").on("click", "#btnSaveFacilityDetail", function (e) {
                e.preventDefault();
                var form = $("#FormFacilityDetail").updateValidation();
                if (form.valid()) {
                    var url = form.attr("action");

                    //fix the issue with SelectSupplierFacilityTypeId
                    var dataToSerialize = form.serializeArray();
                    dataToSerialize[dataToSerialize.length] = { name: "SelectSupplierFacilityTypeId", value: $("#SupplierFacilityType").data("kendoDropDownList").value() };
                    var formData = jQuery.param(dataToSerialize);

                    $.post(url, formData, function (data) {
                        var grid = $("#gdSupplierFacilities").data("kendoGrid");
                        grid.dataSource.read();
                        $('#SupplierFacilitiesDetail').html(data);
                    });
                }
            });

            $("#DetailSupplier").on("click", "#btnSaveContactDetail", function (e) {
                e.preventDefault();
                var form = $("#FormContactDetail").updateValidation();
                if (form.valid()) {
                    var url = form.attr("action");
                    var formData = form.serialize();
                    $.post(url, formData, function (data) {
                        var contactgrid = $("#gdSupplierContacts").data("kendoGrid");
                        contactgrid.dataSource.read();
                        $('#CompanyContactDetailResult').html(data);
                    });
                }
            });

            $("#btnCancelSupplierSearch").click(function () {
                //supplierSearchDialog.data("kendoWindow").close();
                $("#supplierSearchWindow").data("kendoWindow").close();
            });

            $('#DetailSupplier').on("resize", function() {

                // Find all splitters and resize them
                var detail = $(this);
                detail.find('.k-splitter').each(function() {
                    $(this).data("kendoSplitter").trigger("resize");
                });
            });
        };


        function saveIdentificationInfo(reloadSupplier) {
            var form = $("#FormIdentification");
            var formData = form.serialize();

            var url = form.attr("action");
            var urlValidation = url.replace("SaveIdentification", "ValidateDuplicateIdentification");

            $.post(urlValidation, formData, function (data) {
                if (data == "Duplicate") {

                    var args = {
                         header: 'Confirm Save',
                         message: 'A duplicate supplier exists, do you wish to continue?'
                    };
                    DisplayConfirmationModal(args, function () {
                     
                                $.post(url, formData, function (data2) {

                                    var supplierId = $("#SupplierId").val();
                                    if (supplierId == 0) {
                                        $('#DetailSupplier').html(data2);
                                        setTimeout(function () {
                                            $('#IdentificationSplitter').data("kendoSplitter").trigger("resize");
                                        }, 500);
                                    } else {

                                        if (reloadSupplier == true) {
                                            $('#gdSearchSupplier').data('kendoGrid').trigger('change');
                                        } else {

                                            // Attempt to find the history grid to refresh
                                            var historyGrid = $('#gdSupplierStatusHistory').data('kendoGrid');
                                            if (historyGrid) {
                                                historyGrid.dataSource.read();
                                                historyGrid.refresh();
                                            }
                                        }

                                        $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data2);
                                    }
                                });


                     });
                } else {
                            $.post(url, formData, function (data2) {

                                var supplierId = $("#SupplierId").val();
                                if (supplierId == 0) {
                                    $('#DetailSupplier').html(data2);
                                    setTimeout(function () {
                                        $('#IdentificationSplitter').data("kendoSplitter").trigger("resize");
                                    }, 500);
                                } else {

                                    if (reloadSupplier == true) {
                                        $('#gdSearchSupplier').data('kendoGrid').trigger('change');
                                    } else {

                                        // Attempt to find the history grid to refresh
                                        var historyGrid = $('#gdSupplierStatusHistory').data('kendoGrid');
                                        if (historyGrid) {
                                            historyGrid.dataSource.read();
                                            historyGrid.refresh();
                                        }
                                    }

                                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                                }
                            });

               }
            });
                   
        }

        function CheckFormValidationStyle(frmObj) {
            $("#" +frmObj).on("blur", function () {
                if ($("#" +frmObj).val() != "")
                    $("#" + frmObj).removeClass("requiredText").addClass("validText");
                    else
                    $("#" +frmObj).removeClass("validText").addClass("requiredText");
                    });
                    }

        function DropDownValidationStyle(e) {
            var selectedText = e.sender.value();
            if(selectedText.length > 0) {
                $("span.k-widget.k-dropdown.k-header[aria-owns='" +e.sender.element.attr("id") + "_listbox'] span").removeClass("invalid").removeClass("k-i-arrow-s").addClass("valid");
                $("span.k-widget.k-dropdown.k-header[aria-owns='" + e.sender.element.attr("id") + "_listbox']").css("box-shadow", "0 0 5px #5cd053");
                } else {
                    $("span.k-widget.k-dropdown.k-header[aria-owns='" +e.sender.element.attr("id") + "_listbox'] span").removeClass("valid").addClass("invalid");
                $("span.k-widget.k-dropdown.k-header[aria-owns='" + e.sender.element.attr("id") + "_listbox']").css("box-shadow", "0 0 5px #d45252");
                }
        }

        function RemoveValidationSummary(frmObj, requiredMessage, isKendoDropDown) {
            var formObjectValue;
            if (!isKendoDropDown)
                formObjectValue = $("#" +frmObj).val();
            else {
                var kendoDropdown = $("#" +frmObj).data("kendoDropDownList");
                formObjectValue = kendoDropdown.value();
            }

            if(formObjectValue == "") {
                $("#" + frmObj).removeClass("validText").addClass("requiredText");
                $("div.validation-summary-valid.validationSummary ul").append("<li>" +requiredMessage + "</li>"); 
            } else { 
                $("#" +frmObj).removeClass("requiredText").addClass("validText");
                $("div.validation-summary-valid.validationSummary ul li:contains('" +requiredMessage + "')").remove();
            }
        }

        var onGetObtainmentSettingId = function () {
            return {
                ObtainmentSettingID: obtainmentSettingId
            };
        };

        var OnChangeCountry = function () {
            var ddlRegion = $("#ddlDocumentRegion").data("kendoDropDownList");
            if (e.item.index() != "0")
                ddlRegion.value("");
        };


        var OnChangeRegion = function () {
            var ddlCountry = $("#ddlDocumentCountry").data("kendoDropDownList");
            if (e.item.index() != "0")
                ddlCountry.value("");
        };

        var gdGdWebSiteChange = function () {
            var grid = $("#gdWebSite").data("kendoGrid");
            var selectedRow = grid.select();
            var selectedIndex = selectedRow.index();

            var data = this.dataItem(selectedRow);
            this.element.attr("SelectedWebSiteId", data.CompanyWebsiteId);

            var inverted = $("#gdWebSite").find("tr td a.inverturl");
            if (inverted.length > 0) inverted.removeClass("inverturl");

            var selectedUrl = $("tr:nth(" + selectedIndex + ")", grid.tbody).find("td:nth(0)").find("a");
            selectedUrl.addClass("inverturl");
        };

        var gdGdDomainChange = function () {
            var grid = $("#gdCompanyIdentificationDomains").data("kendoGrid");
            var selectedRow = grid.select();
            
            var data = this.dataItem(selectedRow);
            this.element.attr("SelectedDomainId", data.CompanyDomainId);
        };

        var onChangeSupplierCountry = function (e) {
            if ($('#FacilityCountry').length > 0) {
                DropDownValidationStyle(e);
                var autoFacilityCountry = $("#SupplierFacilityState").data("kendoAutoComplete");
                if (autoFacilityCountry != null) {
                    autoFacilityCountry.destroy();
                }
                var selectedFacilityCountry = $("#FacilityCountry").val();
                if (selectedFacilityCountry == "CAN" || selectedFacilityCountry == "MEX" || selectedFacilityCountry == "USA") {
                    $("#SupplierFacilityState").val("");
                    $("#SupplierFacilityState").kendoAutoComplete({
                        minlength: 2,
                        dataTextField: "Text",
                        filter: "contains",
                        dataSource: new kendo.data.DataSource({
                            transport: {
                                read: {
                                    //url: '@Url.Action("GetStateProvince", "Company")',
                                    url: "../Company/GetStateProvince",
                                    data: {
                                        userInput: function () {
                                            return $("#SupplierFacilityState").data("kendoAutoComplete").value();
                                        },
                                        countryAbbrev: selectedFacilityCountry
                                    },
                                    type: "GET"
                                }
                            }
                        }),
                        change: function () {
                            this.dataSource.read();
                        }
                    });
                }
            } else {
                DropDownValidationStyle(e);
                var autoContactCountry = $("#CompanyContactState").data("kendoAutoComplete");
                if (autoContactCountry != null) {
                    autoContactCountry.destroy();
                }
                var selectedContactCountry = $("#CompanyContactCountry").val();
                if (selectedContactCountry == "CAN" || selectedContactCountry == "MEX" || selectedContactCountry == "USA") {
                    $("#CompanyContactState").val("");
                    $("#CompanyContactState").kendoAutoComplete({
                        minlength: 2,
                        dataTextField: "Text",
                        filter: "contains",
                        dataSource: new kendo.data.DataSource({
                            transport: {
                                read: {
                                    url: "../Company/GetStateProvince",
                                    data: {
                                        userInput: function () {
                                            return $("#CompanyContactState").data("kendoAutoComplete").value();
                                        },
                                        countryAbbrev: selectedContactCountry
                                    },
                                    type: "GET"
                                }
                            }
                        }),
                        change: function () {
                            this.dataSource.read();
                        }
                    });
                }
            }
        };

        var onChangeSupplierAddressType = function (e) {
            if ($('#SelectAddressType').length > 0) {
                DropDownValidationStyle(e);
            }
        }

        var gdSupplierContacts_Change = function (e) {
            e.preventDefault();
            var data = this.dataItem(this.select());
            //var url = '@Url.Action("GetSupplierContactDetail", "Company")';
            var url = "../Company/GetSupplierContactDetail";
            $.post(url, { supplierId: data.SupplierId, supplierContactId: data.SupplierContactId }, function (result) {
                $("#CompanyContactDetailResult").html($(result));
            });
        };

        var gdSupplierContacts_Remove = function (e) {
            if (e.type == "destroy") {
                $("#CompanyContactDetailResult").html("");
            }
        };

        var gdSupplierFacility_Change = function (e) {
            e.preventDefault();
            var selectedData = this.dataItem(this.select());
            //var url = '@Url.Action("GetSupplierFacilityDetail", "Company")';
            var url = "../Company/GetSupplierFacilityDetail";

            $.post(url, { supplierId: selectedData.SupplierId, supplierFacilityId: selectedData.SupplierFacilityId },
                function (data) {
                    $('#SupplierFacilitiesDetail').html(data);
                });
        };

        var panelbar_activated = function () {
            //Can not be moved to partial view, or it cause clear and search again
            $("#clearSupplierBtn").click(function () {
                //Remove search result
                $('#txtSupplierSearch').val("");

                var grid = $("#gdSearchSupplier").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    return false;
                }
               
                grid.dataSource.data([]);
                $('#DetailSupplier').html("");
                return false;
            });

            //Initialize listview
            $(function () {
                var listView = $("#lvCriterias").data("kendoListView");
                $("#btnCriteriaAdd").click(function (e) {
                    alert("Fire listview");
                    listView.add();
                    e.preventDefault();
                });
            });

            if (IsReadOnlyMode()) {
                $("#addNewSupplierBtn").addClass("k-state-disabled");
                $("#addNewSupplierBtn").unbind('click');
            }

        };


        function panelbar_collapse() {
            //alert("collapse");
        };

        function panelbar_expand() {
            //Handle the expand event
        };

        var getSupplierId = function () {
            var supplierId = $("#SupplierId").val();
            return {
                SupplierId: supplierId
            };
        };

        var gdSupplierFacility_Remove = function (e) {
            if (e.type == "destroy") {
                $("#SupplierFacilitiesDetail").html("");
            }
        };


        var gdObtainmentSettings_Change = function (e) {
            e.preventDefault();
            var data = this.dataItem(this.select());
            obtainmentSettingId = data.ObtainmentSettingID;
            var url = "../ObtainmentSettings/GetObtainmentSettingsDetail";
            $.post(url, { SupplierId: data.SupplierId, ObtainmentSettingID: data.ObtainmentSettingID }, function (result) {
                $("#ObtainmentSettingsDetail").html($(result));
            });
        };


        var gdObtainmentSettings_Remove = function (e) {
            if (e.type == "destroy") {
                $("#ObtainmentSettingsDetail").html("");
            }
        };

        
        var docGridSave_FacilityAddress = function (e) {
           
                var val = $("#FacilityCountry").data().kendoDropDownList.value();
                e.model.set("FacilityCountry", val);
                var supplierId = $("#SupplierId").val();
                var supplierFacilityId = $("#SupplierFacilityId").val();
                $('#DetailSupplier #gdFacilityAddress').data("kendoGrid").cancelChanges();
                var urlSave = "../Company/FacilityAddress_Save";
                var url = "../Company/ValidateFacilityAddress";
                var data = { facilityAddressId: e.model.id, companyId: supplierId, facilityid: supplierFacilityId, add1: e.model.SupplierFacilityAddress1, add2: e.model.SupplierFacilityAddress2, city: e.model.SupplierFacilityCity, state: e.model.SupplierFacilityState, country: e.model.FacilityCountry, zip: e.model.SupplierFacilityPostalCode, type: e.model.SelectAddressType};
                $.post(url, data, function(data1) {
                    if (data1 == "Duplicate") {
                        var args = {
                            header: 'Confirm Save',
                            message: 'A duplicate supplier exists, do you wish to continue?'
                        };
                        DisplayConfirmationModal(args, function () {
                            saveFacilityAddress(urlSave, data);
                        });
                    } else {
                        saveFacilityAddress(urlSave, data);
                    }
                });

        };

        function saveFacilityAddress(url, data) {

            $.post(url, data, function (data2) {
                if (data2 == "success") {
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Save Facility Address.");
                    $('#DetailSupplier #gdFacilityAddress').data("kendoGrid").dataSource.read();
                }
            });
        }


        var onGdFacilityAddressChange = function (e) {
            e.preventDefault();

            // Get the selected item and attempt to get the information to be displayed to the document note text area
            var data = this.dataItem(this.select());
            this.element.attr("selectedfacilityaddressid", data.SupplierFacilityAddressId);
        };


        var onGdFacilityAddressEdit = function (e) {
            var update = $(e.container).parent().find(".k-grid-update");
            var cancel = $(e.container).parent().find(".k-grid-cancel");
            $(update).attr('title', 'Save');
            $(cancel).attr('title', 'Cancel');
            $("#SupplierFacilityAddress1").addClass("requiredText");
            $("#SupplierFacilityCity").addClass("requiredText");
            $("#SupplierFacilityState").addClass("requiredText");
            $("span.k-widget.k-dropdown.k-header[aria-owns='FacilityCountry_listbox'] span").removeClass("k-i-arrow-s").addClass("invalid");
            $("span.k-widget.k-dropdown.k-header[aria-owns='FacilityCountry_listbox'] span.k-icon.invalid").html("&nbsp");
            $("#SupplierFacilityPostalCode").addClass("requiredText");
            $("span.k-widget.k-dropdown.k-header[aria-owns='SelectAddressType_listbox'] span").removeClass("k-i-arrow-s").addClass("invalid");
            $("span.k-widget.k-dropdown.k-header[aria-owns='SelectAddressType_listbox'] span.k-icon.invalid").html("&nbsp");

            CheckFormValidationStyle("SupplierFacilityAddress1");
            CheckFormValidationStyle("SupplierFacilityCity");
            CheckFormValidationStyle("SupplierFacilityState");
            CheckFormValidationStyle("SupplierFacilityPostalCode");

            $(update).on("click", function () {
                $("div.validation-summary-valid.validationSummary ul li").remove();
                RemoveValidationSummary("SupplierFacilityAddress1", "Supplier - Facility Address 1 is required",false);
                RemoveValidationSummary("SupplierFacilityCity", "Supplier - Facility City is required",false);
                RemoveValidationSummary("SupplierFacilityState", "Supplier - Facility State is required",false);
                RemoveValidationSummary("FacilityCountry", "Supplier - Facility Country is required", true);
                RemoveValidationSummary("SupplierFacilityPostalCode", "Supplier - Facility Postal Code is required", false);
                RemoveValidationSummary("SelectAddressType", "Supplier - Facility Address Type is required", true);

                $("div.validation-summary-valid.validationSummary ul").append("<li style='display:none'>");
            });

            var title = $(e.container).parent().find(".k-window-title");
            if (e.model.SupplierFacilityAddressId > 0) {
                $(title).html('Edit');
            } else {
                $(title).html('Create');
                var updateHtml = $(update).html();
                updateHtml = updateHtml.replace("Update", "Create");
                $(update).html(updateHtml);
                updateHtml = updateHtml.replace("Create", " ");
                $(update).html(updateHtml);
                var cancelHtml = $(cancel).html();
                cancelHtml = cancelHtml.replace("Cancel", " ");
                $(cancel).html(cancelHtml);
            }

            removeModelDescriptionFields(e.container);
            removeModelReadOnlyField(e.container);
            readonlyModelDateFields(e.container);
            
            $(".k-button.k-button-icontext.k-grid-cancel").click(function () {
                var grid = $("#gdFacilityAddress").data("kendoGrid");
                grid.dataSource.read();
            });
        };

        var onGdContactAddressSave = function (e) {
            var val = $("#CompanyContactCountry").data().kendoDropDownList.value();
            e.model.set("CompanyContactCountry", val);
            var supplierId = $("#SupplierId").val();
            var supplierContactId = $("#SupplierContactId").val();
            $('#DetailSupplier #gdContactAddress').data("kendoGrid").cancelChanges();
            var urlSave = "../Company/ContactAddress_Save";
            var url = "../Company/ValidateContactAddress";
            var data = { contactAddressId: e.model.CompanyContactAddressId, companyId: supplierId, contactid: supplierContactId, add1: e.model.CompanyContactAddress1, add2: e.model.CompanyContactAddress2, city: e.model.CompanyContactCity, state: e.model.CompanyContactState, country: e.model.CompanyContactCountry, zip: e.model.CompanyContactPostalCode, type: e.model.SelectAddressType };
            $.post(url, data, function (data1) {
                if (data1 == "Duplicate") {
                    var args = {
                        header: 'Confirm Save',
                        message: 'A duplicate supplier exists, do you wish to continue?'
                    };
                    DisplayConfirmationModal(args, function () {
                        saveContactAddress(urlSave, data);
                    });
                } else {
                    saveContactAddress(urlSave, data);
                }
            });
        };

        function saveContactAddress(url, data) {

            $.post(url, data, function (data2) {
                if (data2 == "success") {
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Save Contact Address.");
                    $('#DetailSupplier #gdContactAddress').data("kendoGrid").dataSource.read();
                }
            });
        }

        var EditSupplierNotes = function (e) {

            e.preventDefault();

            onGridEditChangeTitle(e);
          
            var datetext = $('#SupplierNoteUpdatedDate').val();
            if (datetext != '') {
                var updatedate = new Date(datetext);
                $('#SupplierNoteUpdatedDate').val(getCustomDateFormat(updatedate));
            }
    
            window.setTimeout(function () {
                $("#SupplierNoteText").kendoEditor({ encoded: false });
                $(".k-edit-form-container").parent().width(645).height(550).data("kendoWindow").center();
                $(".k-edit-form-container").width(620).height(500);
            }, 100);

            $(".k-button.k-button-icontext.k-grid-cancel").click(function () {
                var grid = $("#gdSupplierNotes").data("kendoGrid");
                var selectedDataItem = grid.dataSource.getByUid(grid.select().data("uid"));
                grid.dataSource.read();
                if (selectedDataItem) {
                    var uid = grid.dataSource.get(selectedDataItem.id).uid;
                    grid.select('tr[data-uid="' + uid + '"]');
                }
            });

        };

        var SelectSupplierNotes = function (e) {
            e.preventDefault();

            var selectedObj = this.select();
            var selectedData = this.dataItem(selectedObj);
            this.element.attr("SelectedSupplierNotesId", selectedData.SupplierNotesId);
            //var url = '@Url.Action("GetSupplierNotesText", "Company")';
            var url = "../Company/GetSupplierNotesText";
            $.post(url, { supplierId: selectedData.SupplierId, supplierNotesId: selectedData.SupplierNotesId },
                function (data) {
                    $('#SupplierNotesText').html(data);
                });
        };


        var ClearNoteText = function () {
            $('#SupplierNotesText').html("");
        };

        var additionalDataContact = function () {
            var supplierContactId = $("#SupplierContactId").val();
            return {
                supplierContactId: supplierContactId
            };
        };

        var additionalDataFacility = function () {
            var supplierId = $("#SupplierId").val();
            var supplierFacilityId = $("#SupplierFacilityId").val();
            return {
                supplierId: supplierId,
                supplierFacilityId: supplierFacilityId
            };
        };

        var serialize = function (data) {
            //console.log("supplier-main's serialize used. data: " + JSON.stringify(data));
            for (var property in data) {
                if ($.isArray(data[property])) {
                    serializeArray(property, data[property], data);
                }
                var supplierId = $("#SupplierId").val();
                data["SupplierId"] = supplierId;
            }
        };

        var onGridEditChangeTitle = function (e) {
            var update = $(e.container).parent().find(".k-grid-update");
            var cancel = $(e.container).parent().find(".k-grid-cancel");
            
            $(update).attr('title', 'Create');
            $(cancel).attr('title', 'Cancel');
            
            $(update).on("click", function() {
                    $("div.validation-summary-valid.validationSummary ul li").remove();

                    if ($("#SupplierNoteText").data("kendoEditor").value().length == 0)
                        $("div.validation-summary-valid.validationSummary ul").append("<li>Supplier - Notes is required</li>");
                    else
                        $("div.validation-summary-valid.validationSummary ul li:contains('Supplier - Notes is required')").remove();


                    if ($("#SupplierNoteType").data("kendoMultiSelect").value() =="")
                        $("div.validation-summary-valid.validationSummary ul").append("<li>Supplier - Type is required</li>");
                    else
                        $("div.validation-summary-valid.validationSummary ul li:contains('Supplier - Type is required')").remove();

                    $("div.validation-summary-valid.validationSummary ul").append("<li style='display:none'>");
                });

            var title = $(e.container).parent().find(".k-window-title");
            if (e.model.SupplierNotesId > 0) {
                $(title).html('Edit');
            }
            else {
                $(title).html('Create');
                var updateHtml = $(update).html();
                updateHtml = updateHtml.replace("Update", "Create");
                $(update).html(updateHtml);
                updateHtml = updateHtml.replace("Create", " ");
                $(update).html(updateHtml);
                var cancelHtml = $(cancel).html();
                cancelHtml = cancelHtml.replace("Cancel", " ");
                $(cancel).html(cancelHtml);
            }

        };

       var onGridEditChangePhone = function (e) {
            var update = $(e.container).parent().find(".k-grid-update");
            var cancel = $(e.container).parent().find(".k-grid-cancel");

            $(update).attr('title', 'Create');
            $(cancel).attr('title', 'Cancel');

            $(update).on("click", function () {
                var validationUrl = "../company/ValidateFacilityPhone";
                var saveUrl = "../company/SaveFacilityPhone";
                var supplierId = $("#SupplierId").val();
                var supplierFacilityId = $("#SupplierFacilityId").val();
                var supplierFacilityPhoneId = e.model.SupplierFacilityPhoneId;
                $('#DetailSupplier #gdFacilityPhone').data("kendoGrid").cancelChanges();
                var data = {
                    supplierFacilityPhoneId: supplierFacilityPhoneId, companyId: supplierId, facilityid: supplierFacilityId, phoneType: e.model.SelectPhoneTypeId, areaCode: e.model.SupplierFacilityCityAreaCode,
                    extension:e.model.SupplierFacilityExtension, localNo:e.model.SupplierFacilityLocalNumber
                };
                $.post(validationUrl, data, function (result) {
                    if (result == "Duplicate") {
                        var args = {
                            header: 'Confirm Save',
                            message: 'A duplicate supplier exists, do you wish to continue?'
                        };
                        DisplayConfirmationModal(args, function () {
                            saveFacilityPhone(saveUrl, data);
                        });
                    }
                    else
                    {
                       saveFacilityPhone(saveUrl, data);
                    }
                });
                
            });

            var title = $(e.container).parent().find(".k-window-title");
            if (e.model.SupplierNotesId > 0) {
                $(title).html('Edit');
            }
            else {
                $(title).html('Create');
                var updateHtml = $(update).html();
                updateHtml = updateHtml.replace("Update", "Create");
                $(update).html(updateHtml);
                updateHtml = updateHtml.replace("Create", " ");
                $(update).html(updateHtml);
                var cancelHtml = $(cancel).html();
                cancelHtml = cancelHtml.replace("Cancel", " ");
                $(cancel).html(cancelHtml);
            }

        };
       
       var onGridEditChangeContactPhone = function (e) {
           var update = $(e.container).parent().find(".k-grid-update");
           var cancel = $(e.container).parent().find(".k-grid-cancel");

           $(update).attr('title', 'Create');
           $(cancel).attr('title', 'Cancel');

           $(update).on("click", function () {
               var validationUrl = "../company/ValidateContactPhone";
               var saveUrl = "../company/SaveContactPhone";
               var supplierId = $("#SupplierId").val();
               var supplierContactId = $("#SupplierContactId").val();
               var supplierContactPhoneId = e.model.CompanyContactPhoneId;
               $('#DetailSupplier #gdContactPhone').data("kendoGrid").cancelChanges();
               var data = {
                   supplierContactPhoneId: supplierContactPhoneId, companyId: supplierId, contactid: supplierContactId, phoneType: e.model.SelectPhoneTypeId, areaCode: e.model.CityOrAreaCode,
                   extension: e.model.Extension, localNo: e.model.LocalNumber, countryId: e.model.CountryLkpId
               };
               $.post(validationUrl, data, function (result) {
                   if (result == "Duplicate") {
                       var args = {
                           header: 'Confirm Save',
                           message: 'A duplicate supplier exists, do you wish to continue?'
                       };
                       DisplayConfirmationModal(args, function () {
                           saveContactPhone(saveUrl, data);
                       });
                   }
                   else {
                       saveContactPhone(saveUrl, data);
                   }
               });

           });

           var title = $(e.container).parent().find(".k-window-title");
           if (e.model.SupplierNotesId > 0) {
               $(title).html('Edit');
           }
           else {
               $(title).html('Create');
               var updateHtml = $(update).html();
               updateHtml = updateHtml.replace("Update", "Create");
               $(update).html(updateHtml);
               updateHtml = updateHtml.replace("Create", " ");
               $(update).html(updateHtml);
               var cancelHtml = $(cancel).html();
               cancelHtml = cancelHtml.replace("Cancel", " ");
               $(cancel).html(cancelHtml);
           }

       };

       function saveContactPhone(url, data) {
           $.post(url, data, function (data2) {
               if (data2 == "success") {
                   $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Save Contact Phone.");
                   $('#DetailSupplier #gdContactPhone').data("kendoGrid").dataSource.read();
               }
           });
       }

        function saveFacilityPhone(url, data) {
            $.post(url, data, function (data2) {
                if (data2 == "success") {
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Save Facility Phone.");
                    $('#DetailSupplier #gdFacilityPhone').data("kendoGrid").dataSource.read();
                }
            });
        }
        
        var onGridEditChangeEmail = function (e) {
            alert("onGridEditChangeEmail");
            var update = $(e.container).parent().find(".k-grid-update");
            var cancel = $(e.container).parent().find(".k-grid-cancel");

            $(update).attr('title', 'Create');
            $(cancel).attr('title', 'Cancel');

            $(update).on("click", function() {
                var validationUrl = "../company/ValidateFacilityEmail";
                var saveUrl = "../company/SaveFacilityEmail";
                var supplierId = $("#SupplierId").val();
                var supplierFacilityId = $("#SupplierFacilityId").val();
                var supplierFacilityEmailId = e.model.SupplierFacilityEmailId;
                $('#DetailSupplier #gdFacilityEmail').data("kendoGrid").cancelChanges();
                	
                var data = {
                    supplierFacilityEmailId: supplierFacilityEmailId, companyId: supplierId, facilityid: supplierFacilityId, emailTxt: e.model.FacilityEmail
                };
                $.post(validationUrl, data, function (result) {
                    if (result == "Duplicate") {
                      var args = {
                          header : 'Confirm Save',
                          message: 'A duplicate supplier exists, do you wish to continue?'
                    };
                    DisplayConfirmationModal(args, function () {
                      saveFacilityEmail(saveUrl, data);
                        });
                    }
                    else
                    {
                       saveFacilityEmail(saveUrl, data);
                    }
                });
            });

            var title = $(e.container).parent().find(".k-window-title");
            if (e.model.SupplierNotesId > 0) {
                $(title).html('Edit');
            }
            else {
                $(title).html('Create');
                var updateHtml = $(update).html();
                updateHtml = updateHtml.replace("Update", "Create");
                $(update).html(updateHtml);
                updateHtml = updateHtml.replace("Create", " ");
                $(update).html(updateHtml);
                var cancelHtml = $(cancel).html();
                cancelHtml = cancelHtml.replace("Cancel", " ");
                $(cancel).html(cancelHtml);
            }
        };

        function saveFacilityEmail(url, data) {
            alert("saveFacilityEmail");
            $.post(url, data, function (data2) {
                if (data2 == "success") {
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Save Facility Email.");
                    $('#DetailSupplier #gdFacilityEmail').data("kendoGrid").dataSource.read();
                }
            });
        }

        var onGridEditChangeWebSite = function (e) {
            var update = $(e.container).parent().find(".k-grid-update");
            var cancel = $(e.container).parent().find(".k-grid-cancel");
            $(update).attr('title', 'Save');
            $(cancel).attr('title', 'Cancel');

            var title = $(e.container).parent().find(".k-window-title");
            if (e.model.CompanyWebsiteId > 0) {
                $(title).html('Edit');
            } else {
                $(title).html('Create');
                var updateHtml = $(update).html();
                updateHtml = updateHtml.replace("Update", "Create");
                $(update).html(updateHtml);
            }

            //hide CompanyWebsiteId from the pop up edit form.
            $("label[for='CompanyWebsiteId']").parent().hide();
            $('#CompanyWebsiteId').parent().hide();

            removeModelDescriptionFields(e.container);
            removeModelReadOnlyField(e.container);
            readonlyModelDateFields(e.container);

            //reload website Grid.
            $(".k-button.k-button-icontext.k-grid-cancel").click(function () {
                var grid = $("#gdWebSite").data("kendoGrid");
                grid.dataSource.read();
            });

        };

        var onGridEditChangeDomain = function (e) {
            var update = $(e.container).parent().find(".k-grid-update");
            var title = $(e.container).parent().find(".k-window-title");
            if (e.model.CompanyDomainId > 0) {
                $(title).html('Edit');
            } else {
                $(title).html('Create');
                var updateHtml = $(update).html();
                updateHtml = updateHtml.replace("Update", "Create");
                $(update).html(updateHtml);
            }

            //hide some fields from the pop up form.
            $("label[for='CompanyDomainId']", e.container).parent().hide();
            $('#CompanyDomainId', e.container).parent().hide();

            removeModelDescriptionFields(e.container);
            removeModelReadOnlyField(e.container);
            readonlyModelDateFields(e.container);
          
            //reload domain Grid.
            $(".k-button.k-button-icontext.k-grid-cancel").click(function () {
                var grid = $("#gdCompanyIdentificationDomains").data("kendoGrid");
                grid.dataSource.read();
            });

        };

        //======Security group Read-Only Integration Section Starts
        var onSupplierIdentificationActivate = function (e) {

            if (IsReadOnlyMode() && $(e.item).find("* > .k-link").text() == "Identification") {
                setTimeout(function () {
                    $("#btnSaveIdentification").addClass("k-state-disabled");
                    $("#btnSaveIdentification").unbind('click');
                    StopPropagation("btnSaveIdentification");

                    $("#btnDiscardIdentification").addClass("k-state-disabled");
                    $("#btnDiscardIdentification").unbind('click');
                    StopPropagation("btnDiscardIdentification");
                }, 700);
            }
        };

        var onFaciltyGeneralActivate = function (e) {
            //alert($(e.item).find("> .k-link").text());
            if (IsReadOnlyMode() && $(e.item).find("* > .k-link").text() == "General") {
                //alert($(e.item).find("> .k-link").text());
                //Identification section
                setTimeout(function () {
                    $("#btnSaveFacilityDetail").addClass("k-state-disabled");
                    $("#btnSaveFacilityDetail").unbind('click');
                    StopPropagation("btnSaveFacilityDetail");

                    $("#btnDiscardFacilityDetail").addClass("k-state-disabled");
                    $("#btnDiscardFacilityDetail").unbind('click');
                    StopPropagation("btnDiscardFacilityDetail");
                }, 300);
            }
        };

        var onContactGeneralActivate = function (e) {
            //alert($(e.item).find("> .k-link").text());
            if (IsReadOnlyMode() && $(e.item).find("* > .k-link").text() == "General") {
                //alert($(e.item).find("> .k-link").text());
                //Identification section
                setTimeout(function () {
                    $("#btnSaveContactDetail").addClass("k-state-disabled");
                    $("#btnSaveContactDetail").unbind('click');
                    StopPropagation("btnSaveContactDetail");

                    $("#btnDiscardContactDetail").addClass("k-state-disabled");
                    $("#btnDiscardContactDetail").unbind('click');
                    StopPropagation("btnDiscardContactDetail");
                }, 300);

            }
        };

        var onObtainmentSettingsActivate = function (e) {
            //alert($(e.item).find("> .k-link").text());
            if (IsReadOnlyMode() && $(e.item).find("* > .k-link").text() == "General") {
                //alert($(e.item).find("> .k-link").text());
                //Identification section
                setTimeout(function () {
                    $("#btnSaveObtainmentSettingDetail").addClass("k-state-disabled");
                    $("#btnSaveObtainmentSettingDetail").unbind('click');
                    StopPropagation("btnSaveObtainmentSettingDetail");

                    $("#btnDiscardObtainmentSettingDetail").addClass("k-state-disabled");
                    $("#btnDiscardObtainmentSettingDetail").unbind('click');
                    StopPropagation("btnDiscardObtainmentSettingDetail");
                }, 300);

            }
        };

        var IsReadOnlyMode = function () {
            return ($("#SearchPanel").find("span.icon-lock.icon-white").length == 1);
        };

        var StopPropagation = function (ctlName) {
            $("#" + ctlName).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
        };

        var DisableGridInCellEditing = function (gdName) {
            $('[id^="' + gdName + '"]').each(function () {
                var gridId = "#" + this.id;

                var btnSaveChanges = $(gridId).find("a.k-button.k-button-icontext.k-grid-save-changes");
                if (btnSaveChanges.length > 0) {
                    btnSaveChanges.addClass("k-state-disabled");
                    btnSaveChanges.bind('click', false);
                }
                ;

                var btnCancelChanges = $(gridId).find("a.k-button.k-button-icontext.k-grid-cancel-changes");
                if (btnCancelChanges.length > 0) {
                    btnCancelChanges.addClass("k-state-disabled");
                    btnCancelChanges.bind('click', false);
                }
                ;

            });
        };

        var DisableGridInLineEditing = function (gdName) {
            $('[id^="' + gdName + '"]').each(function () {
                var gridId = "#" + this.id;

                var btnAdd;
                if (gdName == "gdSupplierFacilities" || gdName == "gdSupplierContacts") {
                    btnAdd = $(gridId).find("a.k-button.k-button-icontext");
                } else {
                    btnAdd = $(gridId).find("a.k-button.k-button-icontext.k-grid-add");
                }

                if (btnAdd.length > 0) {
                    btnAdd.addClass("k-state-disabled");
                    btnAdd.bind('click', false);
                }
                ;

                $(gridId).find("a.k-button.k-button-icontext.k-grid-edit").each(function (i, item) {
                    if (!$(item).hasClass("k-state-disabled")) {
                        $(item).addClass("k-state-disabled");
                        $(item).bind('click', false);
                    }
                });

                $(gridId).find("a.k-button.k-button-icontext.k-grid-delete").each(function (i, item) {
                    if (!$(item).hasClass("k-state-disabled")) {
                        $(item).addClass("k-state-disabled");
                        $(item).bind('click', false);
                    }
                });

            });
        };

        var onGdWebSiteDataBound = function () {
            if (IsReadOnlyMode()) {
                setTimeout(function () {
                    //DisableGridInLineEditing("gdWebSite");
                }, 200);
            }

            var selecteddocumentnotesid = $('#gdWebSite').attr("selectedwebsiteid");

            $('td', '#gdWebSite').each(function () {
                var txt = $(this).html();
                var i = txt.indexOf("CompanyWebsiteId");
                if (i >= 0) {
                    var websiteid = txt.substr(18, txt.length);
                    if (websiteid == selecteddocumentnotesid) {
                        var parent = $(this).parent();
                        parent.addClass("k-state-selected");
                    }
                }

            }); 

        };

        var onGdDomainDataBound = function () {
            if (IsReadOnlyMode()) {
                setTimeout(function () {
                   // DisableGridInLineEditing("gdCompanyIdentificationDomains");
                }, 200);
            }

            var selectedid = $('#gdCompanyIdentificationDomains').attr("selecteddomainid");

            $('td', '#gdCompanyIdentificationDomains').each(function () {
                var txt = $(this).html().toLowerCase();
                var i = txt.indexOf("domainid");
                if (i >= 0) {
                    var domainid = txt.substr(17, txt.length);
                    if (domainid == selectedid) {
                        var parent = $(this).parent();
                        parent.addClass("k-state-selected");
                    }
                }

            });

        };

        var onGdAliasDataBound = function () {
            if (IsReadOnlyMode()) {
                setTimeout(function () {
                    //DisableGridInLineEditing("gdAlias");
                }, 200);
            }
        };

        var onGdCompanyIdentifierDataBound = function () {
            if (IsReadOnlyMode()) {
                setTimeout(function () {
                   // DisableGridInCellEditing("gdCompanyIdentifiers");
                }, 200);
            }
        };

        var onGdCompanyIdentifierEdit = function () {
            if (IsReadOnlyMode()) {
                $('#gdCompanyIdentifiers').data("kendoGrid").closeCell();
            }
        };

        var onGdSupplierFacilitiesDataBound = function () {
            if (IsReadOnlyMode()) {
                setTimeout(function () {
                  //  DisableGridInLineEditing("gdSupplierFacilities");
                }, 200);
            }
        };

        var onGdFacilityAddressDataBound = function () {
            
            if (IsReadOnlyMode()) {
                setTimeout(function () {
                    //DisableGridInLineEditing("gdFacilityAddress");
                }, 200);
            }

            var selectedfacilityaddressid = $('#gdFacilityAddress').attr("selectedfacilityaddressid");
            $('td', '#gdFacilityAddress').each(function () {
                var txt = $(this).html();
                var i = txt.indexOf("SupplierFacilityAddressId");
                if (i >= 0) {
                    var addressid = txt.substr(27, txt.length);
                    if (addressid == selectedfacilityaddressid) {
                        var parent = $(this).parent();
                        parent.addClass("k-state-selected");
                    }
                }

            });

        };

        var onGdFacilityPhoneDataBound = function () {
            if (IsReadOnlyMode()) {
                setTimeout(function () {
                   // DisableGridInLineEditing("gdFacilityPhone");
                }, 200);
            }
        };

        var onGdFacilityEmailDataBound = function () {
            if (IsReadOnlyMode()) {
                setTimeout(function () {
                    //DisableGridInLineEditing("gdFacilityEmail");
                }, 200);
            }
        };

        var onGdFacilityIdentifiersDataBound = function () {
            if (IsReadOnlyMode()) {
                setTimeout(function () {
                    //DisableGridInCellEditing("gdFacilityIdentifiers");
                }, 200);
            }
        };

        var onGdFacilityIdentifierEdit = function () {
            if (IsReadOnlyMode()) {
                $('#gdFacilityIdentifiers').data("kendoGrid").closeCell();
            }
        };


        var onGdSupplierNotesDataBound = function () {

            if (IsReadOnlyMode()) {
                setTimeout(function () {
                    //DisableGridInLineEditing("gdSupplierNotes");
                }, 200);
            }

            var selectedsuppliernotesid = $('#gdSupplierNotes').attr("selectedsuppliernotesid");
            $('td', '#gdSupplierNotes').each(function () {
                var txt = $(this).html();
                var i = txt.indexOf("SupplierNotesId");
                if (i >= 0) {
                    var suppliernotesid = txt.substr(17, txt.length);
                    if (suppliernotesid == selectedsuppliernotesid) {
                        var parent = $(this).parent();
                        parent.addClass("k-state-selected");

                        $('td', parent).each(function() {
                            var note = $(this).html();
                            var ii = note.indexOf("SupplierNoteText");
                            if (ii >= 0) {
                                var notesText = note.substr(18, note.length);
                                $('#SupplierNotesText').html(notesText);
                            }
                        }); //inner loop
                    }
                }
                
            }); //outer loop

        };

        var onGdSupplierContactsDataBound = function () {
            if (IsReadOnlyMode()) {
                setTimeout(function () {
                    //DisableGridInLineEditing("gdSupplierContacts");
                }, 200);
            }
        };

        var onGdContactAddressDataBound = function () {
            if (IsReadOnlyMode()) {
                setTimeout(function () {
                    //DisableGridInLineEditing("gdContactAddress");
                }, 200);
            }
        
            var selectedcontactaddressid = $('#gdContactAddress').attr("selectedcontactaddressid");
            $('td', '#gdContactAddress').each(function () {
                var txt = $(this).html();
                var i = txt.indexOf("CompanyContactAddressId");
                if (i >= 0) {
                    var addressid = txt.substr(25, txt.length);
                    if (addressid == selectedcontactaddressid) {
                        var parent = $(this).parent();
                        parent.addClass("k-state-selected");
                    }
                }

            }); 

        };

        
        var onGdContactAddressChange = function (e) {
            e.preventDefault();

            // Get the selected item and attempt to get the information to be displayed to the document note text area
            var data = this.dataItem(this.select());
            this.element.attr("selectedcontactaddressid", data.CompanyContactAddressId);
        };

        
        var onGdContactAddressEdit = function (e) {
            //hide CompanyContactAddressId from the pop up edit form.
            $("label[for='CompanyContactAddressId']").parent().hide();
            $('#CompanyContactAddressId').parent().hide();
            var update = $(e.container).parent().find(".k-grid-update");
            var cancel = $(e.container).parent().find(".k-grid-cancel");
            $(update).attr('title', 'Save');
            $(cancel).attr('title', 'Cancel');

            $("#CompanyContactAddress1").addClass("requiredText");
            $("#CompanyContactCity").addClass("requiredText");
            $("#CompanyContactState").addClass("requiredText");
            $("span.k-widget.k-dropdown.k-header[aria-owns='CompanyContactCountry_listbox'] span").removeClass("k-i-arrow-s").addClass("invalid");
            $("span.k-widget.k-dropdown.k-header[aria-owns='CompanyContactCountry_listbox'] span.k-icon.invalid").html("&nbsp");
            $("#CompanyContactPostalCode").addClass("requiredText");
            $("span.k-widget.k-dropdown.k-header[aria-owns='SelectAddressType_listbox'] span").removeClass("k-i-arrow-s").addClass("invalid");
            $("span.k-widget.k-dropdown.k-header[aria-owns='SelectAddressType_listbox'] span.k-icon.invalid").html("&nbsp");

            CheckFormValidationStyle("CompanyContactAddress1");
            CheckFormValidationStyle("CompanyContactCity");
            CheckFormValidationStyle("CompanyContactState");
            CheckFormValidationStyle("CompanyContactPostalCode");

            $(update).on("click", function () {
                $("div.validation-summary-valid.validationSummary ul li").remove();
                RemoveValidationSummary("CompanyContactAddress1", "Supplier - Contact Address 1 is required", false);
                RemoveValidationSummary("CompanyContactCity", "Supplier - Contact City is required", false);
                RemoveValidationSummary("CompanyContactState", "Supplier - Contact State is required", false);
                RemoveValidationSummary("CompanyContactCountry", "Supplier - Contact Country is required", true);
                RemoveValidationSummary("CompanyContactPostalCode", "Supplier - Contact Postal Code is required", false);
                RemoveValidationSummary("SelectAddressType", "Supplier - Contact Address Type is required", true);

                $("div.validation-summary-valid.validationSummary ul").append("<li style='display:none'>");
            });

            var title = $(e.container).parent().find(".k-window-title");
            if (e.model.CompanyContactAddressId > 0) {
                $(title).html('Edit');
            } else {
                $(title).html('Create');
                var updateHtml = $(update).html();
                updateHtml = updateHtml.replace("Update", "Create");
                $(update).html(updateHtml);
                updateHtml = updateHtml.replace("Create", " ");
                $(update).html(updateHtml);
                var cancelHtml = $(cancel).html();
                cancelHtml = cancelHtml.replace("Cancel", " ");
                $(cancel).html(cancelHtml);
            }


            removeModelDescriptionFields(e.container);
            removeModelReadOnlyField(e.container);
            readonlyModelDateFields(e.container);

            $(".k-button.k-button-icontext.k-grid-cancel").click(function () {
                var grid = $("#gdContactAddress").data("kendoGrid");
                grid.dataSource.read();
            });
        };

        var onGdContactPhoneDataBound = function () {
            if (IsReadOnlyMode()) {
                setTimeout(function () {
                    //DisableGridInLineEditing("gdContactPhone");
                }, 200);
            }
        };

        var onGdContactEmailDataBound = function () {
            if (IsReadOnlyMode()) {
                setTimeout(function () {
                    //DisableGridInLineEditing("gdContactEmail");
                }, 200);
            }
        };

        var ongdObtainmentSettingsDataBound = function () {
            if (IsReadOnlyMode()) {
                setTimeout(function () {
                    //DisableGridInLineEditing("gdObtainmentSettings");
                }, 200);
            }

            if ($('a[title="Copy"]').size() > 0) {
                $('a[title="Copy"]').each(function () {
                    $(this).text("");
                    $(this).prepend("<span class='k-icon k-i-refresh'></span>");
                });
            }
        };


        //======Security group Read-Only Integration Section Ends


        //----------------------end of normal public func---------------------------




        //----------------------start of callbacks-----------------------
        var fnInitializeObtainmentSettings = function () {
            if ($("#ObtainmentSettingDoNotObtain").is(':checked'))
                fnEnableDoNotObtain();

            if ($("#ObtainmentSettingPauseNotification").is(':checked'))
                fnEnablePauseNotification();

            if (!$("#ObtainmentSettingDoNotObtain").is(':checked') && !$("#ObtainmentSettingPauseNotification").is(':checked')) {
                $("#PauseNotificationNote").val("");
                $("#ObtainmentSettingPauseNotificationDP").data("kendoDatePicker").value("");
            }

            if ($('#ObtainmentSettingID').val() == "0") {
                $("#btnAddContact").addClass("k-state-disabled");
                $("#DetailSupplier").off("click", "#btnAddWebSite", fnbtnAddWebSite);
                $("#DetailSupplier").off("click", "#btnAddContact", fnbtnAddContact);
                $("#btnAddWebSite").addClass("k-state-disabled");

            } else {
                $("#btnAddWebSite").removeClass("k-state-disabled");
                $("#DetailSupplier").on("click", "#btnAddWebSite", fnbtnAddWebSite);
                $("#DetailSupplier").on("click", "#btnAddContact", fnbtnAddContact);
                $("#btnAddContact").removeClass("k-state-disabled");
            }

            if ($('#txtSearchSupplierId').val() == "" || $('#txtSearchSupplierId').val() == "0") {
                DisableControls($("#ObtainmentSettingDoNotObtain").is(":checked"), false);
            } else {
                GetCompany();
                DisableControls(true, true);
            }
        };

        var fnbtnAddContact = function (e) {
            e.preventDefault();
            if ($('#ObtainmentSettingID').val() != 0) {
                if ($("#popupContactSearch").length > 0) {
                    var grid = $("#GridSearchContacts").data("kendoGrid");
                    grid.dataSource.read();
                }
                $("#popupContactSearch").modal("show");
            }
        };

        var fnbtnAddWebSite = function (e) {
            e.preventDefault();
            if ($('#ObtainmentSettingID').val() != 0) {

                if ($("#popupWebSiteSearch").length > 0) {
                    var grid = $("#GridSearchWebSites").data("kendoGrid");
                    grid.dataSource.read();
                }
                $("#popupWebSiteSearch").modal("show");
            }
        };

        var fnEnableDoNotObtain = function () {
            $("#FormObtainmentSettingDetail").kendoValidator().data("kendoValidator").hideMessages();
            if ($("#ObtainmentSettingDoNotObtain").is(':checked')) {
                var datepicker = $("#ObtainmentSettingPauseNotificationDP").data("kendoDatePicker");
                var ddlObtainmentStartAction = $("#ddlObtainmentStartAction").data("kendoDropDownList");
                var ddlRenewalStartAction = $("#ddlRenewalStartAction").data("kendoDropDownList");
                var ddlDoNotObtainNotes = $("#ddlDoNotObtainNotes").data("kendoDropDownList");
                $("#gdWebSites").data("kendoGrid").dataSource.data([]);
                $("#gdContacts").data("kendoGrid").dataSource.data([]);
                $("#ObtainmentSettingPauseNotification").removeAttr("checked");
                $("#ObtainmentSettingPauseNotification").attr("disabled", "disabled");
                $("#PauseNotificationNote").attr("disabled", "disabled");
                $("#PauseNotificationNote").val("");
                datepicker.enable(false);
                datepicker.value("");
                ddlDoNotObtainNotes.enable();
                //ddlDoNotObtainNotes.value("");
                ddlRenewalStartAction.enable(false);
                ddlRenewalStartAction.value("");
                ddlObtainmentStartAction.enable(false);
                ddlObtainmentStartAction.value("");
                $("#btnAddContact").addClass("k-state-disabled");
                $("#DetailSupplier").off("click", "#btnAddContact", fnbtnAddContact);
                $("#DetailSupplier").off("click", "#btnAddWebSite", fnbtnAddWebSite);
                $("#btnAddWebSite").addClass("k-state-disabled");
                $("#ObtainmentSettingPauseNotification").removeAttr('checked');
            } else {
                DisableControls(false, false);
            }
        };

        var fnEnablePauseNotification = function () {
            $("#FormObtainmentSettingDetail").kendoValidator().data("kendoValidator").hideMessages();
            var calendar = $("#ObtainmentSettingPauseNotificationDP").data("kendoDatePicker");
            if ($("#ObtainmentSettingPauseNotification").is(':checked')) {
                calendar.enable();
                $("#ObtainmentSettingPauseNotification").attr("checked", "checked");
                $("#PauseNotificationNote").removeAttr("disabled", "disabled");
                $("#ObtainmentSettingDoNotObtain").removeAttr("checked");
                $("#ObtainmentSettingDoNotObtain").attr("disabled", "disabled");
            } else {
                calendar.enable(false);
                calendar.value("");
                $("#PauseNotificationNote").attr("disabled", "disabled");
                $("#ObtainmentSettingDoNotObtain").removeAttr("checked");
                $("#ObtainmentSettingDoNotObtain").removeAttr("disabled", "disabled");
            }
        };

        var fnSearchCompany = function () {
            if ($("#txtSearchSupplierId").val() != "") {
                DisableControls(true, true);
            } else {
                DisableControls(false, true);
            }
        };

        var fnSearchCompanyKeyup = function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) { //Search only on enter
                GetCompany();
            }
        };

        var fnSaveObtainmentSettings = function () {

            var validator = $("#FormObtainmentSettingDetail").kendoValidator({
                messages: {
                    custom: "Do Not Obtain Notes is required",
                    custom2: "Pause Notification Date is required",
                    custom3: "Pause Notification Date should be in the future",
                    custom4: "Document Types is required",
                    custom5: "Language is required"
                },
                rules: {
                    custom: function (input) {
                        if ($("#ObtainmentSettingDoNotObtain").is(':checked')) {
                            if (input.is("[name=ddlDoNotObtainNotes]")) {
                                return input.val() !== "";
                            }
                        }
                        return true;
                    },
                    custom2: function (input) {
                        if ($("#ObtainmentSettingPauseNotification").is(':checked')) {
                            if (input.is("[name=ObtainmentSettingPauseNotificationDP]")) {
                                return input.val() !== "";
                            }
                        }
                        return true;
                    },
                    custom3: function (input) {
                        if ($("#ObtainmentSettingPauseNotification").is(':checked')) {
                            if (input.is("[name=ObtainmentSettingPauseNotificationDP]")) {
                                var pickeddate = new Date(input.val());
                                var todayDate = new Date();
                                if (pickeddate > todayDate) {
                                    return true;
                                }
                                return false;
                            }
                        }
                        return true;
                    },
                    custom4: function (input) {
                        if (input.is("[name=ddlDocumentType]")) {
                            return input.val() !== "";
                        }
                        return true;
                    },
                    custom5: function (input) {
                        if (input.is("[name=ddlDocumentLanguage]")) {
                            return input.val() !== "";
                        }
                        return true;
                    }
                }
            }).data("kendoValidator");


            if (validator.validate()) {
                var queryText = {
                    ObtainmentSettingID: $("#ObtainmentSettingID").val(),
                    SupplierId: $("#SupplierId").val(),
                    ParentSupplier: $("#txtSearchSupplierId").val(),
                    SelectedDocTypeID: $("#ddlDocumentType").val(),
                    SelectedLanguageID: $("#ddlDocumentLanguage").val(),
                    SelectedCountrieID: $("#ddlDocumentCountry").val(),
                    SelectedRegionID: $("#ddlDocumentRegion").val(),
                    DoNotObtain: $("#ObtainmentSettingDoNotObtain").is(':checked'),
                    DoNotObtainID: $("#ddlDoNotObtainNotes").val(),
                    PauseNotification: $("#ObtainmentSettingPauseNotification").is(':checked'),
                    PauseNotificatioDate: $("#ObtainmentSettingPauseNotificationDP").val(),
                    PauseNotificationNote: $("#PauseNotificationNote").val(),
                    ObtainmentStartActionID: $("#ddlObtainmentStartAction").val(),
                    RenewalStartActionID: $("#ddlRenewalStartAction").val()
                };


                //var url = '@Url.Action("SaveObtainmentSettingDetail", "ObtainmentSettings")';
                var url = "../ObtainmentSettings/SaveObtainmentSettingDetail";
                $.post(url, { jsObtainmentSettingsModel: JSON.stringify(queryText) }, function (data) {
                    if (data == '0') {
                        alert('Error occured while saving the contact details');
                    } else {
                        var obtID = $("#ObtainmentSettingID").val();
                        var grid = $("#gdObtainmentSettings").data("kendoGrid");
                        grid.dataSource.read();
                        $('#ObtainmentSettingsDetail').html(data);

                        if (obtID > 0) {
                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html('Obtainment settings saved.');
                        } else {
                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html('Obtainment settings added.');
                        }

                    }
                });
            }
        };

        var fnSearchSupplier = function () {
            var urlSearch = "../ObtainmentSettings/PlugInParentSupplierSearch";
            $.post(urlSearch, { supplierId: 0 }, function (data) {
                $("#dgSupplierPlugIn").html(data);
            });

            var supplierSearchDialog = $("#supplierSearchWindow");

            $("#btnCancelSupplierSearch").click(function () {
                supplierSearchDialog.data("kendoWindow").close();
            });

            supplierSearchDialog.data("kendoWindow").center();
            supplierSearchDialog.data("kendoWindow").open();
        };


        //----------------------end of callbacks-----------------------


        var initObtainmentSettingWiring = function () {
            $("#DetailSupplier").on("click", "#btnAddContact", fnbtnAddContact);
            $("#DetailSupplier").on("click", "#btnAddWebSite", fnbtnAddWebSite);
            $("#DetailSupplier").on("click", "#ObtainmentSettingDoNotObtain", fnEnableDoNotObtain);
            $("#DetailSupplier").on("click", "#ObtainmentSettingPauseNotification", fnEnablePauseNotification);
            $("#DetailSupplier").on("input", "#txtSearchSupplierId", fnSearchCompany);
            $("#DetailSupplier").on("keyup", "#txtSearchSupplierId", fnSearchCompanyKeyup);
            $("#DetailSupplier").on("click", "#btnSaveObtainmentSettingDetail", fnSaveObtainmentSettings);
            $("#DetailSupplier").on("click", "#searchSupplierIdBtn", fnSearchSupplier);

        };


        //----------------------start of not in use-----------------------
        var refreshAndQuery = function (txtCntlId, gridId) {
            refreshSupplierSearchResultGrid(gridId);
            QueueQuery(txtCntlId, gridId);
        };

        var refreshSupplierSearchResultGrid = function (gridid) {
            var grid = $("#" + gridid).data("kendoGrid");
            grid.dataSource.read();
            grid.dataSource.page(1);
        };


        var QueueQuery = function (txtCntrlId, gridid) {
            txtCntrlId = "#" + txtCntrlId;
            if ($(txtCntrlId).val().length != 0) {
                var searchQueue = $(".btn-group > ul.dropdown-menu");
                if (searchQueue.length > 0) {

                    searchQueue.prepend("<li><a href='#'><span class='hreflimit'>" + $(txtCntrlId).val() + "</span></a><span class='btn history-close'>×</span></li>");

                    if ($(".btn-group > ul.dropdown-menu li").length > 10) {
                        $(".btn-group > ul.dropdown-menu > li:last-child").remove();
                    }
                    $(".btn-group > ul.dropdown-menu li a").click(function () {
                        $(txtCntrlId).val($(this).text());
                        refreshSupplierSearchResultGrid(gridid);
                    });

                    $(".btn.history-close").click(function (e) {
                        //$(e).parent().find("li").remove();
                        e.target.parentNode.outerHTML = "";
                        e.stopPropagation();
                    });
                }
            }
        };
        //----------------------end of not in use-----------------------

        var loadSupplierDetail = function (supplierId) {
            var url = '../Company/GetSupplierDetail';
            $.post(url, { SupplierId: supplierId }, function (data) {
                var detail = $('#DetailSupplier');
                if (detail) {
                    detail.html(data);
                }
            });
        };

        var getFacilityCountryDropdownData = function() {
            return getCountryDropdownData("#SelectSupplierFacilityCountry", "#SupplierFacilityState");
        };

        var getContactCountryDropdownData = function() {
            return getCountryDropdownData("#SelectSupplierContactCountry", "#SupplierContactState");
        };

        var getSupplierCountryDropdownData = function() {
            return getCountryDropdownData("#SelectSupplierCountry", "#SupplierState");
        };

        function getCountryDropdownData(ddlCountry, acState) {
            var countryComponent = $(ddlCountry).data("kendoDropDownList");
            var stateComponent = $(acState).data("kendoAutoComplete");

            return {
                'userInput': stateComponent.value(),
                'countryAbbrev': countryComponent.value()
            };
        };

        // Helper Methods
        var onErrorCallback;
        function displayErrorMessage(errorMessage) {
            if (onErrorCallback) {
                onErrorCallback(errorMessage);
            } else {
                alert(errorMessage);
            }
        };

        // Supplier Identification Methods
        var initSupplierIdentification = function(errorCallback, onDeactivateContentLoad) {
            onErrorCallback = errorCallback;

            // Set up observer to hide all save/cancel/add/delete buttons
            var statusDdl = $('#SelectStatusId').data('kendoDropDownList');
            if (statusDdl && statusDdl.value() == '14') {

                // Display deactivated label
                var deactivatedLabel = $('#lblSupplierDeactivated');
                if (deactivatedLabel.length > 0) {
                    deactivatedLabel.show();
                }

                if (onDeactivateContentLoad) {
                var tabstrip = $('#SupplierTabstrip');
                if (tabstrip.length > 0) {
                    tabstrip.addClass('deactivated-tabstrip');

                    var ktabstrip = $('#SupplierTabstrip').data('kendoTabStrip');
                    if (ktabstrip) {
                            ktabstrip.bind('contentLoad', onDeactivateContentLoad);
                        ktabstrip.trigger('contentLoad');
                    }
                }
            }
            }
        };

        function displayStatusNoteConfirmation(args, yesFunc, noFunc) {

            var modal = $('#statusNoteModal');
            if (modal.length > 0) {
                modal.find('#myModalLabel')
                    .html(args.headerMessage)
                    .end()
                    .find('#myModalMessage')
                    .html(args.displayMessage)
                    .end()
                    .find('#myModalNotes')
                    .val('')
                    .end()
                    .find('#confirm-btn-yes')
                    .text(args.headerMessage.indexOf('Deactivation') > -1 ? 'Deactivate' : 'Continue');

                // Set up all click events
                modal.off('click', '#confirm-btn-yes');
                modal.on('click', '#confirm-btn-yes', function (e) {

                    // Check if the notes field has the correct information
                    var notesField = modal.find('#myModalNotes');
                    if (notesField.length > 0) {

                        if (notesField.val() && notesField.val().length > 0) {
                            modal.modal('hide');
                            if (yesFunc) {
                                e['modalNotes'] = notesField.val();
                                yesFunc(e);
                            }
                        } else {
                            displayErrorMessage('Notes were not provided, enter notes to continue.');
                        }
                    }
                });

                if (noFunc) {
                    modal.off('click', '#btn-no');
                    modal.on('click', '#btn-no', noFunc);
                }

                modal.modal({
                    backdrop: true,
                    keyboard: true
                }).css({
                    width: 'auto',
                    'max-width': '650px',
                    'margin-left': function () {
                        return -($(this).width() / 2); //auto size depending on the message
                    },
                    'margin-top': function () {
                        return (document.documentElement.clientHeight / 2) - $(this).height() - 35;
                    }
                });
            }
        }

        // Supplier Status History Methods
        var clearSupplierStatusNote = function() {
            $('#StatusNotesText').html("");
        };

        var onStatusChange = function (e) {
            e.preventDefault();

            var selectedRow = this.select();
            var selectedData = this.dataItem(selectedRow);
            $('#StatusNotesText').html(selectedData.Notes);
        };
       
        $("#DetailSupplier").on("keyup", '#txtMultipleAliases', function (e) {
            //CurrentContent = $('#DetailSupplier #txtMultipleAliases').val();
            if (e.keyCode == 13) {
                e.preventDefault();
               var arr = $('#DetailSupplier #txtMultipleAliases').val().split("\n");
                var arrDistinct = new Array();
                $(arr).each(function (index, item) {
                    if (item.length > 0) {
                        if ($.inArray(item, arrDistinct) == -1)
                            arrDistinct.push(item);
                    }
                    
                });
                $('#DetailSupplier #txtMultipleAliases').val("");
                $(arrDistinct).each(function (index, item) {
                        $('#DetailSupplier #txtMultipleAliases').val($('#DetailSupplier #txtMultipleAliases').val() + item + "\n");
                });
            }
        });

        $("#DetailSupplier").on("keyup", '#txtMultipleWebsites', function (e) {
            //CurrentContent = $('#DetailSupplier #txtMultipleAliases').val();
            if (e.keyCode == 13) {
                e.preventDefault();
                var arr = $('#DetailSupplier #txtMultipleWebsites').val().split("\n");
                var arrDistinct = new Array();
                $(arr).each(function (index, item) {
                    if (item.length > 0) {
                        if ($.inArray(item, arrDistinct) == -1)
                            arrDistinct.push(item);
                    }

                });
                $('#DetailSupplier #txtMultipleWebsites').val("");
                $(arrDistinct).each(function (index, item) {
                    $('#DetailSupplier #txtMultipleWebsites').val($('#DetailSupplier #txtMultipleWebsites').val() + item + "\n");
                });
            }
        });

        $("#DetailSupplier").on("keyup", '#txtMultipleEmails', function (e) {
            //CurrentContent = $('#DetailSupplier #txtMultipleAliases').val();
            if(e.keyCode == 13) {
                e.preventDefault();
                var arr = $('#DetailSupplier #txtMultipleEmails').val().split("\n");
                    var arrDistinct = new Array();
                    $(arr).each(function (index, item) {
                        if (item.length > 0) {
                            if ($.inArray(item, arrDistinct) == -1) {
                                if (/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(item)) {
                                    arrDistinct.push(item);
                                }
                            }
                        }
                    });
                    $('#DetailSupplier #txtMultipleEmails').val("");
                    $(arrDistinct).each(function (index, item) {
                        $('#DetailSupplier #txtMultipleEmails').val($('#DetailSupplier #txtMultipleEmails').val() + item + "\n");
            });
            }
        });

        var showMultiple = function () {
            DisplayModal("mdlMultipleAliases");
        }

        var showMultipleWebSites = function() {
            DisplayModal("mdlMultipleWebSites");
        }

        var showMultipleFacilityEmails = function() {
            DisplayModal("mdlMultipleFacilityEmails");
        }

        var showMultipleContactEmails = function () {
            DisplayModal("mdlMultipleContactEmails");
        }

        function DisplayModal(objModal) {
            $('#' + objModal).find('.modal-body').html();
            $('#' + objModal).modal({
                backdrop: true,
                keyboard: true
            }).css(
            {
                'margin-left': function () {
                    return -($(this).width() / 2);
                }
            });
        }

        $("#DetailSupplier").on("click", '#btnDiscardMultipleContactEmails', function () {
                    $('#DetailSupplier #txtMultipleEmails').val("");
                    $('#mdlMultipleContactEmails').modal("toggle");
        });

        $("#DetailSupplier").on("click", '#btnSaveMultipleContactEmails', function (e) {
            var lines = $('#DetailSupplier #txtMultipleEmails').val().split(/\n/);
            for (var i = 0; i < lines.length; i++) {
                // only push this line if it contains a non whitespace character.
                if (lines[i].length > 0)
                    texts.push($.trim(lines[i]));
            }
           var data = { };
            data['supplierContactId'] = $("#SupplierContactId").val();
            data['emailsText']= texts;
            e.preventDefault();
            $.ajax({
                    url: "../Company/ContactEmails_Multiple_Create",
                    data: JSON.stringify(data),
                    type: "POST",
                    contentType: 'application/json; charset=utf-8',
                    error: function () {
                        onDisplayError('Emails could not be saved.');
                    },
                    success: function (successData) {
                        if(successData.success == true) {
                            $('#mdlMultipleContactEmails').modal("toggle");
                            var grid = $("#DetailSupplier #gdContactEmail").data("kendoGrid");
                            grid.dataSource.read();
                            //should refressh grid
                        } else
                            onDisplayError("Error Occurred");
                    },
                    complete: function () {
                        $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Items Saved Successful");
                    }
            });
        });

        $("#DetailSupplier").on("click", '#btnDiscardMultipleFacilityEmails', function () {
            $('#DetailSupplier #txtMultipleEmails').val("");
            $('#mdlMultipleFacilityEmails').modal("toggle");
         });

        $("#DetailSupplier").on("click", '#btnSaveMultipleFacilityEmails', function (e) {
            var lines = $('#DetailSupplier #txtMultipleEmails').val().split(/\n/);
            for (var i = 0; i < lines.length; i++) {
                // only push this line if it contains a non whitespace character.
                if (lines[i].length > 0)
                    texts.push($.trim(lines[i]));
            }
           var data = {};
            data['facilityId'] = $("#SupplierFacilityId").val();
            data['emailsText'] = texts;
            e.preventDefault();
            $.ajax({
                url: "../Company/FacilityEmails_Multiple_Create",
                data: JSON.stringify(data),
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                error: function () {
                    onDisplayError('Emails could not be saved.');
                },
                success: function (successData) {
                    if (successData.success == true) {
                        $('#mdlMultipleFacilityEmails').modal("toggle");
                        var grid = $("#DetailSupplier #gdFacilityEmail").data("kendoGrid");
                        grid.dataSource.read();
                        //should refressh grid
                    } else
                        onDisplayError("Error Occurred");
                },
                complete: function () {
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Items Saved Successful");
        }
            });
        });

        $("#DetailSupplier").on("click", '#btnDiscarMultipleAliases', function () {
            $('#DetailSupplier #txtMultipleAliases').val("");
            $('#mdlMultipleAliases').modal("toggle");
        });

        $("#DetailSupplier").on("click", '#btnSaveMultipleAliases', function (e) {
            var lines = $('#DetailSupplier #txtMultipleAliases').val().split(/\n/);
            for (var i = 0; i < lines.length; i++) {
                // only push this line if it contains a non whitespace character.
                if (lines[i].length > 0)
                    texts.push($.trim(lines[i]));
            }
            var selAliaseType = $("#DetailSupplier #selAliasType").data("kendoDropDownList");
            var data = {};
            data['supplierId'] = $("#SupplierId").val();
            data['aliasTypeId'] = selAliaseType.value();
            data['aliasesText'] = texts;
            e.preventDefault();
            $.ajax({
                url: "../Company/Alias_Multiple_Create",
                data: JSON.stringify(data),
                type: "POST",
                contentType: 'application/json; charset=utf-8',
               error: function () {
                    onDisplayError('Aliases could not be saved.');
                },
                success: function (successData) {
                    if (successData.success == true) {
                        $('#mdlMultipleAliases').modal("toggle");
                        var grid = $("#DetailSupplier #gdAlias").data("kendoGrid");
                        grid.dataSource.read();
                       //should refressh grid
                    } else 
                        onDisplayError("Error Occurred");
                },
                complete: function () {
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Items Saved Successful");
                }
            });
                });
        
        $("#DetailSupplier").on("click", '#btnDiscardMultipleWebSites', function () {
            $('#DetailSupplier #txtMultipleWebsites').val("");
            $('#mdlMultipleWebSites').modal("toggle");
        });


        $("#DetailSupplier").on("click", '#btnSaveMultipleWebSites', function (e) {
            var lines = $('#DetailSupplier #txtMultipleWebsites').val().split(/\n/);
            for (var i = 0; i < lines.length; i++) {
                // only push this line if it contains a non whitespace character.
                if (lines[i].length > 0)
                    texts.push($.trim(lines[i]));
            }
            var selWebSiteType = $("#DetailSupplier #selWebSiteType").data("kendoDropDownList");
            var data = {};
            data['supplierId'] = $("#SupplierId").val();
            data['websiteTypeId'] = selWebSiteType.value();
            data['websites'] = texts;
            e.preventDefault();
            $.ajax({
                url: "../Company/WebSite_Multiple_Create",
                data: JSON.stringify(data),
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                error: function () {
                    onDisplayError('WebSites could not be saved.');
                },
                success: function (successData) {
                    if (successData.success == true) {
                        $('#mdlMultipleWebSites').modal("toggle");
                        var grid = $("#DetailSupplier #gdWebSite").data("kendoGrid");
                        grid.dataSource.read();
                        //should refressh grid
                    } else
                        onDisplayError("Error Occurred");
                },
                complete: function () {
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Items Saved Successful");
                }
            });
        });

        //Expose to public
        return {
            QueueQuery: QueueQuery,
            refreshSupplierSearchResultGrid: refreshSupplierSearchResultGrid,
            refreshAndQuery: refreshAndQuery,

            onGetObtainmentSettingId: onGetObtainmentSettingId,
            OnChangeCountry: OnChangeCountry,
            OnChangeRegion: OnChangeRegion,

            gdGdWebSiteChange: gdGdWebSiteChange,
            gdGdDomainChange: gdGdDomainChange,

            fnInitializeObtainmentSettings: fnInitializeObtainmentSettings,
            fnbtnAddContact: fnbtnAddContact,
            fnbtnAddWebSite: fnbtnAddWebSite,
            fnEnableDoNotObtain: fnEnableDoNotObtain,
            fnEnablePauseNotification: fnEnablePauseNotification,
            fnSearchCompany: fnSearchCompany,
            fnSearchCompanyKeyup: fnSearchCompanyKeyup,
            fnSaveObtainmentSettings: fnSaveObtainmentSettings,
            fnSearchSupplier: fnSearchSupplier,

            onChangeSupplierCountry: onChangeSupplierCountry,
            onChangeSupplierAddressType:onChangeSupplierAddressType,
            gdSupplierContacts_Change: gdSupplierContacts_Change,
            gdSupplierContacts_Remove: gdSupplierContacts_Remove,
            gdSupplierFacility_Change: gdSupplierFacility_Change,

            panelbar_activated: panelbar_activated,
            panelbar_collapse: panelbar_collapse,
            panelbar_expand: panelbar_expand,
            getSupplierId: getSupplierId,
            gdSupplierFacility_Remove: gdSupplierFacility_Remove,
            gdObtainmentSettings_Change: gdObtainmentSettings_Change,
            gdObtainmentSettings_Remove: gdObtainmentSettings_Remove,
            docGridSave_FacilityAddress: docGridSave_FacilityAddress,
            onGdContactAddressSave: onGdContactAddressSave,
            EditSupplierNotes: EditSupplierNotes,

            SelectSupplierNotes: SelectSupplierNotes,
            ClearNoteText: ClearNoteText,
            additionalDataContact: additionalDataContact,
            additionalDataFacility: additionalDataFacility,
            serialize: serialize,
            onGridEditChangeTitle: onGridEditChangeTitle,
            onGridEditChangeWebSite: onGridEditChangeWebSite,
            onGridEditChangeDomain: onGridEditChangeDomain,

            onSupplierIdentificationActivate: onSupplierIdentificationActivate,
            onFaciltyGeneralActivate: onFaciltyGeneralActivate,
            onContactGeneralActivate: onContactGeneralActivate,
            onObtainmentSettingsActivate: onObtainmentSettingsActivate,
            IsReadOnlyMode: IsReadOnlyMode,
            StopPropagation: StopPropagation,
            DisableGridInCellEditing: DisableGridInCellEditing,
            DisableGridInLineEditing: DisableGridInLineEditing,
            onGdWebSiteDataBound: onGdWebSiteDataBound,
            onGdDomainDataBound: onGdDomainDataBound,
            onGdAliasDataBound: onGdAliasDataBound,
            onGdCompanyIdentifierDataBound: onGdCompanyIdentifierDataBound,
            onGdCompanyIdentifierEdit: onGdCompanyIdentifierEdit,
            onGdSupplierFacilitiesDataBound: onGdSupplierFacilitiesDataBound,
            onGdFacilityAddressDataBound: onGdFacilityAddressDataBound,
            onGdFacilityAddressChange: onGdFacilityAddressChange,
            onGdFacilityAddressEdit: onGdFacilityAddressEdit,
            onGdFacilityPhoneDataBound: onGdFacilityPhoneDataBound,
            onGdFacilityEmailDataBound: onGdFacilityEmailDataBound,
            onGdFacilityIdentifiersDataBound: onGdFacilityIdentifiersDataBound,
            onGdFacilityIdentifierEdit: onGdFacilityIdentifierEdit,
            onGdSupplierNotesDataBound: onGdSupplierNotesDataBound,
            onGdSupplierContactsDataBound: onGdSupplierContactsDataBound,
            onGdContactAddressDataBound: onGdContactAddressDataBound,
            onGdContactAddressChange: onGdContactAddressChange,
            onGdContactAddressEdit: onGdContactAddressEdit,
            onGdContactPhoneDataBound: onGdContactPhoneDataBound,
            onGdContactEmailDataBound: onGdContactEmailDataBound,
            ongdObtainmentSettingsDataBound: ongdObtainmentSettingsDataBound,


            initObtainmentSettingWiring: initObtainmentSettingWiring,
            initializeSupplierLibrary: initializeSupplierLibrary,

            loadSupplierDetail: loadSupplierDetail,
            getContactCountryDropdownData: getContactCountryDropdownData,
            getFacilityCountryDropdownData: getFacilityCountryDropdownData,
            getSupplierCountryDropdownData: getSupplierCountryDropdownData,

            initSupplierIdentification: initSupplierIdentification,

            clearSupplierStatusNote: clearSupplierStatusNote,
            onStatusChange: onStatusChange,
            showMultiple: showMultiple,
            showMultipleWebSites: showMultipleWebSites,
            showMultipleFacilityEmails: showMultipleFacilityEmails,
            showMultipleContactEmails: showMultipleContactEmails,
            onGridEditChangePhone: onGridEditChangePhone,
            onGridEditChangeEmail: onGridEditChangeEmail,
            onGridEditChangeContactPhone: onGridEditChangeContactPhone,
        };
    };

    // Initializer
    $(function () { });

})(jQuery);
