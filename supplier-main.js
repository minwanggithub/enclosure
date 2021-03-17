; (function ($) {
    if ($.fn.complibSupplier == null) {
        $.fn.complibSupplier = { };
    }

    $.fn.complibSupplier = function () {
        //local var
        var obtainmentSettingId;
        var texts = [];
        var regexExpressionEmail = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        var onErrorCallback;
        var notesModalSettings;

        var supplierLiterSettings = {
            actions: {},
            controls: {
                grids: {
                    SupplerSearchGrid: "#gdSearchSupplier"
                },
                buttons: {
                    ClearSupplierSearchButton: "#clearSupplierBtn",
                    SaveSupplierSearchButton: "#saveSupplierSearchSettingsBtn",
                    SearchSupplierButton: "#searchSupplierBtn",
                    RestoreSupplierSearchSettingsButton: "#restoreSupplierSearchSettingsBtn"
                },
                textBoxes: {
                },
                customControl: {
                    MainSupplierAdvanceSearchCtl: "#mainSupplierAdvanceSearchCtl",
                    SupplierAdvanceSearchCtlInPopUp: "#supplierAdvanceSearchCtlInPopUp"
                }
            },
            data: {
                advanceSearchHistory: "AdvanceSearchHistory",
                advanceSearch: "AdvanceSearch"
            },
            controllerCalls: {
                SaveCompanySearchSettings:  GetEnvironmentLocation() + "/Operations/Company/SaveCompanySearchSettings"
            }
        };

        //local funcs
        function GetCompany() {
            if(IsNumeric($("#txtSearchSupplierId").val())) {
                //var url = '@Url.Action("LookUpSupplierOnKeyEnter", "Company")';
                var url = "../Company/LookUpSupplierOnKeyEnter";
                var supplierInfo = $("#txtSearchSupplierId").val();
                $.post(url, { supplierInfo: supplierInfo
                }, function (data) {
                    $('#txtSearchSupplierId').val(data);
                });
            }
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

        function InitializeDropDownCSSValidation(ddlObj) {
            $("span.k-widget.k-dropdown.k-header[aria-owns='" + ddlObj + "'] span").removeClass("k-i-arrow-s").addClass("invalid");
            $("span.k-widget.k-dropdown.k-header[aria-owns='" + ddlObj + "'] span.k-icon.invalid").html("&nbsp");
        }

        function IntializeInputCSSValidation(inputObjArray) {
            for (var i = 0; i < inputObjArray.length; i++) {
                $("#" + inputObjArray[i]).addClass("requiredText");
                CheckFormValidationStyle(inputObjArray[i]);
            }
        }

        function InitializePopUpWindows(e,idValue) {
            var update = $(e.container).parent().find(".k-grid-update");
            var cancel = $(e.container).parent().find(".k-grid-cancel");
            var title = $(e.container).parent().find(".k-window-title");
            var updateHtml;
            var cancelHtml;

            $(update).attr('title', 'Save');
            $(cancel).attr('title', 'Cancel');
            if (idValue > 0) {
                $(title).html('Edit');
                updateHtml = $(update).html();
                updateHtml = updateHtml.replace("Update", " ");
                $(update).html(updateHtml);
                cancelHtml = $(cancel).html();
                cancelHtml = cancelHtml.replace("Cancel", " ");
                $(cancel).html(cancelHtml);
            } else {
                $(title).html('Create');
                updateHtml = $(update).html();
                updateHtml = updateHtml.replace("Update", " ");
                $(update).html(updateHtml);
                cancelHtml = $(cancel).html();
                cancelHtml = cancelHtml.replace("Cancel", " ");
                $(cancel).html(cancelHtml);
            }
        }

        function saveIdentificationInfo(reloadSupplier) {
            var form = $("#FormIdentification");
            var formData = form.serialize();

            var url = form.attr("action");
            var urlValidation = url.replace("SaveIdentification", "ValidateDuplicateIdentification");

            form.resetValidation();

            $.post(urlValidation, formData, function (data) {
                if (data.indexOf("Duplicate") >= 0) {

                    var args = {
                         header: 'Confirm Save',
                         message: data
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
                                            $(supplierLiterSettings.controls.grids.SupplerSearchGrid).data('kendoGrid').trigger('change');
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
                                        $(supplierLiterSettings.controls.grids.SupplerSearchGrid).data('kendoGrid').trigger('change');
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

               }
            });
                   
        }

       function CheckFormValidationStyle(frmObj) {
           $("#" + frmObj).on("blur", function () {
               $("#" + frmObj).val() != "" ? $("#" + frmObj).removeClass("requiredText").addClass("validText") : $("#" + frmObj).removeClass("validText").addClass("requiredText");
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
            var validValue = true;
            if (!isKendoDropDown)
                formObjectValue = $("#" +frmObj).val();
            else {
                var kendoDropdown = $("#" +frmObj).data("kendoDropDownList");
                formObjectValue = kendoDropdown.value();
            }
            
            if (formObjectValue == "")
                validValue = false;

            if (frmObj == "CompanyContactState" || frmObj=="SupplierFacilityState") {
                var matches = formObjectValue.match(/\d+/g);
                if (matches != null) 
                    validValue = false;
            }
            
            if (!isKendoDropDown) {
                if (!validValue) {
                    $("#" + frmObj).removeClass("validText").addClass("requiredText");
                    $("div.validation-summary-valid.validationSummary ul").append("<li>" +requiredMessage + "</li>");
                } else {
                    $("#" +frmObj).removeClass("requiredText").addClass("validText");
                    $("div.validation-summary-valid.validationSummary ul li:contains('" +requiredMessage + "')").remove();
                }
            } else {
                if(formObjectValue.length > 0) {
                    $("span.k-widget.k-dropdown.k-header[aria-owns='" +frmObj + "_listbox'] span").removeClass("invalid").removeClass("k-i-arrow-s").addClass("valid");
                    $("span.k-widget.k-dropdown.k-header[aria-owns='" +frmObj + "_listbox']").css("box-shadow", "0 0 5px #5cd053");
                } else {
                    $("span.k-widget.k-dropdown.k-header[aria-owns='" +frmObj + "_listbox'] span").removeClass("valid").addClass("invalid");
                    $("span.k-widget.k-dropdown.k-header[aria-owns='" + frmObj + "_listbox']").css("box-shadow", "0 0 5px #d45252");
                }
            }
        }
        
        function displayErrorMessage(errorMessage) {
            if (onErrorCallback)
                onErrorCallback(errorMessage);
                else
                kendo.alert(errorMessage);
        };

        function getCountryDropdownData(ddlCountry, acState) {
            var countryComponent = $(ddlCountry).data("kendoDropDownList");
            var stateComponent = $(acState).data("kendoAutoComplete");

            return {
                'userInput': stateComponent.value(),
                'countryAbbrev': countryComponent.value()
                };
        };

        function DoMultipleItems(txtObj, regExpression) {
            var arr = $(txtObj).val().split("\n");
            var arrDistinct = new Array();
            $(arr).each(function (index, item) {
                if(item.length > 0) {
                    if ($.inArray(item, arrDistinct) == -1) {
                        if (regExpression!=null) {
                            if(regExpression.test(item))
                                arrDistinct.push(item);
                        } else
                            arrDistinct.push(item);
                        }
                        }
                        });
            $(txtObj).val("");
            $(arrDistinct).each(function (index, item) {
                $(txtObj).val($(txtObj).val() +item + "\n");
                });
        }

        function DisplayModal(objModal) {
            $('#' +objModal).find('.modal-body').html();
            $('#' +objModal).modal({
                    backdrop: true,
                    keyboard: true
                    }).css(
                        {
                'margin-left': function () {
                    return -($(this).width() / 2);
                    }
            });
            }

        function saveSupplier(url, data, obj) {
            $.post(url, data, function (data2) {
                if (data2.indexOf("Saved") >= 0) {
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data2);
                    obj.data("kendoGrid").dataSource.read();
                }
            });
        }

         function panelbar_collapse() {
             //alert("collapse");
             };

         function panelbar_expand() {
            //Handle the expand event
            };

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

                                if (notesModalSettings) {
                                    notesModalSettings.displayStatusNoteConfirmation(data, function (eval) {
                                        // Attach notes field information into form to be serialized
                                        $("#FormIdentification").find('#StatusNotes').val(eval.modalNotes);
                                        saveIdentificationInfo(true);
                                    });
                                }
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

            $('#DetailSupplier').on("resize", function () {

                // Find all splitters and resize them
                var detail = $(this);
                detail.find('.k-splitter').each(function () {
                    $(this).data("kendoSplitter").trigger("resize");
                });
            });
        };

        var showMultiple = function () {
            var selAliaseType = $("#DetailSupplier #selAliasType").data("kendoDropDownList");
            $('#DetailSupplier #txtMultipleAliases').val("");
            selAliaseType.select(0);
            DisplayModal("mdlMultipleAliases");
                                            }

        var showMultipleWebSites = function () {
            $('#DetailSupplier #txtMultipleWebsites').val("");
            DisplayModal("mdlMultipleWebSites");
                                    }

        var showMultipleFacilityEmails = function () {
            $('#DetailSupplier #txtMultipleEmails').val("");
            DisplayModal("mdlMultipleFacilityEmails");
                                        }

        var showMultipleContactEmails = function () {
            $('#DetailSupplier #txtMultipleEmails').val("");
            DisplayModal("mdlMultipleContactEmails");
                                }

        var onGetObtainmentSettingId = function () {
            return {
                ObtainmentSettingID: obtainmentSettingId
            };
        };

        var OnChangeCountry = function (e) {
            var ddlRegion = $("#ddlDocumentRegion").data("kendoDropDownList");
            if (e.item.index() != "0")
                ddlRegion.value("");
        };

        //var OnChangeRegion = function (e) {
        //    var ddlCountry = $("#ddlDocumentCountry").data("kendoDropDownList");
        //    if (e.item.index() != "0")
        //        ddlCountry.value("");
        //};

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
            if ($('#SelectAddressType').length > 0) 
                DropDownValidationStyle(e);
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
            if (e.type == "destroy") 
                $("#CompanyContactDetailResult").html("");
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
                $("#DetailSupplier #SupplierName").focus();
                var grid = $(supplierLiterSettings.controls.grids.SupplerSearchGrid).data("kendoGrid");
                if (grid.dataSource.total() == 0)
                    return false;
               
                grid.dataSource.data([]);
                $('#DetailSupplier').html("");
                return false;
            });

            //Initialize listview
            $(function () {
                var listView = $("#lvCriterias").data("kendoListView");
                $("#btnCriteriaAdd").click(function (e) {
                    kendo.alert("Fire listview");
                    listView.add();
                    e.preventDefault();
                });
            });

            if (IsReadOnlyMode()) {
                $("#addNewSupplierBtn").addClass("k-state-disabled");
                $("#addNewSupplierBtn").unbind('click');
            }

        };

        var getSupplierId = function () {
            var supplierId = $("#SupplierId").val();
            return {
                SupplierId: supplierId
            };
        };

        var gdSupplierFacility_Remove = function (e) {
            if (e.type == "destroy")
                $("#SupplierFacilitiesDetail").html("");
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
            if (e.type == "destroy")
                $("#ObtainmentSettingsDetail").html("");
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
                    if (data1.indexOf("Duplicate") >=0) {
                        var args = {
                            header: 'Confirm Save',
                            message: data1
                        };
                        DisplayConfirmationModal(args, function () {
                            saveSupplier(urlSave, data, $('#DetailSupplier #gdFacilityAddress'));
                        });
                    } else
                        saveSupplier(urlSave, data, $('#DetailSupplier #gdFacilityAddress'));
                });

        };

        var onGdFacilityAddressChange = function (e) {
            e.preventDefault();

            // Get the selected item and attempt to get the information to be displayed to the document note text area
            var data = this.dataItem(this.select());
            this.element.attr("selectedfacilityaddressid", data.SupplierFacilityAddressId);
        };


        var onGdFacilityAddressEdit = function (e) {
            InitializePopUpWindows(e);
            var update = $(e.container).parent().find(".k-grid-update");
            var inputObjArray = ["SupplierFacilityAddress1", "SupplierFacilityCity", "SupplierFacilityState", "SupplierFacilityPostalCode"];
            IntializeInputCSSValidation(inputObjArray);
            InitializeDropDownCSSValidation("FacilityCountry_listbox");
            InitializeDropDownCSSValidation("SelectAddressType_listbox");

            $(update).on("click", function () {
                $("div.validation-summary-valid.validationSummary ul li").remove();
                RemoveValidationSummary("SupplierFacilityAddress1", "Supplier - Facility Address 1 is required",false);
                RemoveValidationSummary("SupplierFacilityCity", "Supplier - Facility City is required",false);
                RemoveValidationSummary("SupplierFacilityState", "Supplier - Facility State is required or invalid",false);
                RemoveValidationSummary("FacilityCountry", "Supplier - Facility Country is required", true);
                RemoveValidationSummary("SupplierFacilityPostalCode", "Supplier - Facility Postal Code is required", false);
                RemoveValidationSummary("SelectAddressType", "Supplier - Facility Address Type is required", true);
                $("div.validation-summary-valid.validationSummary ul").append("<li style='display:none'>");
            });

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
                if (data1.indexOf("Duplicate")>=0) {
                    var args = {
                        header: 'Confirm Save',
                        message: data1
                    };
                    DisplayConfirmationModal(args, function () {
                        saveSupplier(urlSave, data, $('#DetailSupplier #gdContactAddress'));
                    });
                } else
                    saveSupplier(urlSave, data, $('#DetailSupplier #gdContactAddress'));
            });
        };
      
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

        var SelectSupplierCommunications = function (e) {
            e.preventDefault();

            var selectedObj = this.select();
            var selectedData = this.dataItem(selectedObj);
            console.log(selectedData);

            $('#SupplierCommunicationsText').html(selectedData.Note);

            //this.element.attr("SelectedSupplierNotesId", selectedData.SupplierNotesId);
            ////var url = '@Url.Action("GetSupplierNotesText", "Company")';
            //var url = "../Company/GetSupplierCommunicationsText";
            //$.post(url, { supplierId: getSupplierId(), companyCommunicationId: selectedData.CompanyCommunicationId },
            //    function (data) {
            //        $('#SupplierCommunicationsText').html(data);
            //    });
        };

        var ClearNoteText = function () {
            $('#SupplierNotesText').html("");
        };

        var ClearCommunicationText = function () {
            $('#SupplierCommunicationsText').html("");
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
                if ($.isArray(data[property]))
                    serializeArray(property, data[property], data);

                var supplierId = $("#SupplierId").val();
                data["SupplierId"] = supplierId;
            }           
        };

        var onGridEditChangeTitle = function (e) {
            InitializePopUpWindows(e, e.model.SupplierNotesId);
            var update = $(e.container).parent().find(".k-grid-update");
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
        };

        var onGridSaveFacilityPhone = function(e) {
           
       }

       //facility phone
        var onGridEditChangePhone = function (e) {
            InitializePopUpWindows(e, e.model.SupplierNotesId);
            var update = $(e.container).parent().find(".k-grid-update");
            $(update).on("click", function () {
                var validationUrl = "../company/ValidateFacilityPhone";
                var saveUrl = "../company/SaveFacilityPhone";
                var supplierId = $("#SupplierId").val();
                var supplierFacilityId = $("#SupplierFacilityId").val();
                var supplierFacilityPhoneId = e.model.SupplierFacilityPhoneId;
                var validationMessage = "";
                $('#DetailSupplier #gdFacilityPhone').data("kendoGrid").cancelChanges();
               
                var data = {
                    supplierFacilityPhoneId: supplierFacilityPhoneId, companyId: supplierId, facilityid: supplierFacilityId, phoneType: e.model.SelectPhoneTypeId, areaCode: e.model.SupplierFacilityCityAreaCode,
                    extension: e.model.SupplierFacilityExtension, localNo: e.model.SupplierFacilityLocalNumber, countryId: e.model.CountryLkpId, internationalDialingCode: e.model.InternationalDialingCode
                };

                //validation to check before saving
                if (data.phoneType != null) {
                    if (isNaN(data.areaCode) || data.areaCode == null)
                        validationMessage = "Area Code must be numeric";

                    if (isNaN(data.localNo) || data.localNo == null || (data.localNo % 1) > 0) {
                        if (validationMessage.length > 0)
                            validationMessage += "<br />";

                        validationMessage += "Local Number must be numeric";
                    }

                    if (validationMessage.length > 0) {
                        onDisplayError(validationMessage);
                        return;
                    }
                } else {
                    onDisplayError("Area Code, Local Number and Type are required");
                    return;
                }

                $.post(validationUrl, data, function (result) {

                    if (result.indexOf("Duplicate") >= 0) {
                        var args = {
                            header: 'Confirm Save',
                            message: result
                        };
                        DisplayConfirmationModal(args, function() {
                            saveSupplier(saveUrl, data, $('#DetailSupplier #gdFacilityPhone'));
                        });
                    } else {
                        if (data.phoneType != null) {
                            if (IsNumeric(data.localNo) && IsNumeric(data.areaCode))
                                saveSupplier(saveUrl, data, $('#DetailSupplier #gdFacilityPhone'));
                            else
                                onDisplayError("Area Code and Local Number must be numeric");
                        } else
                            onDisplayError("Area Code, Local Number and Type are required");
                    }
                });
            });
        };
       
       //contact phone
        var onGridEditChangeContactPhone = function (e) {
           InitializePopUpWindows(e, e.model.SupplierNotesId);
           var update = $(e.container).parent().find(".k-grid-update");

           $(update).on("click", function () {
               var validationUrl = "../company/ValidateContactPhone";
               var saveUrl = "../company/SaveContactPhone";
               var supplierId = $("#SupplierId").val();
               var supplierContactId = $("#SupplierContactId").val();
               var supplierContactPhoneId = e.model.CompanyContactPhoneId;
               var validationMessage = "";
               $('#DetailSupplier #gdContactPhone').data("kendoGrid").cancelChanges();
             
               var data = {
                   supplierContactPhoneId: supplierContactPhoneId, companyId: supplierId, contactid: supplierContactId, phoneType: e.model.SelectPhoneTypeId, areaCode: e.model.CityOrAreaCode,
                   extension: e.model.Extension, localNo: e.model.LocalNumber, countryId: e.model.CountryLkpId, internationalDialingCode: e.model.InternationalDialingCode
               };

               
               //validation to check before saving
               if (data.phoneType == null || data.areaCode == null || data.localNo == null || data.phoneType == '' || data.areaCode == '' || data.localNo == '') {
                   onDisplayError("Area Code, Local Number and Type are required");
                   return;
               }
               var errMsg = "";

               var regx = new RegExp('[\\d+\/()\\- ]{' + data.areaCode.length + ',' + data.areaCode.length + '}', 'g')
               if (data.areaCode.length>20) {
                   errMsg += ("Area Code should be less then 20 characters.<br />");
                   
               }
               else if (!(regx.test(data.areaCode))) {
                   errMsg += ("Area Code is invalid.<br />");
                   
               }

               regx = new RegExp('[\\d+\/()\\- ]{' + data.localNo.length + ',' + data.localNo.length + '}', 'g')
               if (data.localNo.length > 20) {
                   errMsg += ("Local Number should be less then 20 characters.<br />");
                   
               }
               else if (!(regx.test(data.localNo))) {
                   errMsg += ("Local Number is invalid.<br />");
                   
               }

               regx = new RegExp('[\\d+\/()\\- ]{' + data.internationalDialingCode.length + ',' + data.internationalDialingCode.length + '}', 'g')

               if (data.internationalDialingCode && data.internationalDialingCode.length > 20) {
                   errMsg += ("Country Code should be less then 20 characters.<br />");

               }
               else if (data.internationalDialingCode && !(regx.test(data.internationalDialingCode))) {
                   errMsg += ("Country Code is invalid.<br />");

               }

               if (errMsg.length > 0) {
                   onDisplayError(errMsg);
                   return;
               }
               
               $.post(validationUrl, data, function (data1) {
                   
                   if (data1.indexOf("Duplicate") >=0) {
                       var args = {
                           header: 'Confirm Save',
                           message: data1
                       };
                       DisplayConfirmationModal(args, function () {
                           saveSupplier(saveUrl, data, $('#DetailSupplier #gdContactPhone'));
                       });
                   }
                   else {
                       if (data.phoneType != null) {
                           var regx_LN = new RegExp('[\\d+\/()\\- ]{' + data.localNo.length + ',' + data.localNo.length + '}', 'g')
                           var regx_AC = new RegExp('[\\d+\/()\\- ]{' + data.areaCode.length + ',' + data.areaCode.length + '}', 'g')
                           if ((regx_LN.test(data.localNo)) && (regx_AC.test(data.areaCode)))
                               saveSupplier(saveUrl, data, $('#DetailSupplier #gdContactPhone'));
                           else
                               onDisplayError("Area Code and Local Number must be numeric");
                       } else
                           onDisplayError("Area Code, Local Number and Type are required");
                   }
               });

           });

       };
      
        //facility email
        var onGridEditChangeEmail = function (e) {
            InitializePopUpWindows(e, e.model.SupplierNotesId);
            var update = $(e.container).parent().find(".k-grid-update");

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
                    if (result.indexOf("Duplicate") >= 0) {
                      var args = {
                          header : 'Confirm Save',
                          message: result
                    };
                    DisplayConfirmationModal(args, function () {
                        saveSupplier(saveUrl, data, $('#DetailSupplier #gdFacilityEmail'));
                        });
                    }
                    else
                        saveSupplier(saveUrl, data, $('#DetailSupplier #gdFacilityEmail'));

                });
            });
        };
    
        //contact email
        var onGridEditChangeContactEmail = function (e) {
            InitializePopUpWindows(e, e.model.SupplierNotesId);
            var update = $(e.container).parent().find(".k-grid-update");

            $(update).on("click", function () {
                var validationUrl = "../company/ValidateContactEmail";
                var saveUrl = "../company/SaveContactEmail";
                var supplierId = $("#SupplierId").val();
                var supplierContactId = $("#SupplierContactId").val();
                var supplierContactEmailId = e.model.CompanyContactEmailId;
                $('#DetailSupplier #gdContactEmail').data("kendoGrid").cancelChanges();

                var data = {
                    supplierContactEmailId: supplierContactEmailId, companyId: supplierId, contactid: supplierContactId, emailTxt: e.model.Email
                };
                $.post(validationUrl, data, function (result) {
                    if (result.indexOf("Duplicate") >=0) {
                        var args = {
                            header: 'Confirm Save',
                            message: result
                        };
                        DisplayConfirmationModal(args, function () {
                            saveSupplier(saveUrl, data, $('#DetailSupplier #gdContactEmail'));
                        });
                    }
                    else
                        saveSupplier(saveUrl, data, $('#DetailSupplier #gdContactEmail'));
                });
            });
        };

       var onGridEditChangeWebSite = function (e) {
            InitializePopUpWindows(e, e.model.CompanyWebsiteId);

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
            InitializePopUpWindows(e, e.model.CompanyDomainId);
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
            if (IsReadOnlyMode() && $(e.item).find(".k-link").text() == "General") {
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
                if (gdName == "gdSupplierFacilities" || gdName == "gdSupplierContacts")
                    btnAdd = $(gridId).find("a.k-button.k-button-icontext");
                else
                    btnAdd = $(gridId).find("a.k-button.k-button-icontext.k-grid-add");


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

        var onGdSupplierCommunicationsDataBound = function () {

            var selectedsuppliernotesid = $('#gdSupplierNotes').attr("selectedsuppliernotesid");
            $('td', '#gdSupplierCommunications').each(function () {
                var txt = $(this).html();
                console.log(txt);
                //var i = txt.indexOf("SupplierNotesId");
                //if (i >= 0) {
                //    var suppliernotesid = txt.substr(17, txt.length);
                //    if (suppliernotesid == selectedsuppliernotesid) {
                //        var parent = $(this).parent();
                //        parent.addClass("k-state-selected");

                //        $('td', parent).each(function () {
                //            var note = $(this).html();
                //            var ii = note.indexOf("SupplierNoteText");
                //            if (ii >= 0) {
                //                var notesText = note.substr(18, note.length);
                //                $('#SupplierNotesText').html(notesText);
                //            }
                //        }); //inner loop
                //    }
                //}

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
            InitializePopUpWindows(e, e.model.CompanyContactAddressId);
            var update = $(e.container).parent().find(".k-grid-update");
            var inputObjArray = ["CompanyContactAddress1", "CompanyContactCity", "CompanyContactState", "CompanyContactPostalCode"];
            IntializeInputCSSValidation(inputObjArray);
            InitializeDropDownCSSValidation("CompanyContactCountry_listbox");
            InitializeDropDownCSSValidation("SelectAddressType_listbox");

            $(update).on("click", function () {
                $("div.validation-summary-valid.validationSummary ul li").remove();
                RemoveValidationSummary("CompanyContactAddress1", "Supplier - Contact Address 1 is required", false);
                RemoveValidationSummary("CompanyContactCity", "Supplier - Contact City is required", false);
                RemoveValidationSummary("CompanyContactState", "Supplier - Contact State is required or invalid", false);
                RemoveValidationSummary("CompanyContactCountry", "Supplier - Contact Country is required", true);
                RemoveValidationSummary("CompanyContactPostalCode", "Supplier - Contact Postal Code is required", false);
                RemoveValidationSummary("SelectAddressType", "Supplier - Contact Address Type is required", true);

                $("div.validation-summary-valid.validationSummary ul").append("<li style='display:none'>");
            });

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

            $("#OSSpecialAssignment").kendoAutoComplete({
                minlength: 2, dataTextField: "Text", filter: "contains",
                dataSource: new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "../ObtainmentSettings/GetObtainmentGroupUser",
                            type: "GET"
                        }
                    }
                }),
            });

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
            if ($("#txtSearchSupplierId").val() != "")
                DisableControls(true, true);
            else
                DisableControls(false, true);
        };

        var fnSearchCompanyKeyup = function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) //Search only on enter
                GetCompany();
        };

        var fnSaveObtainmentSettings = function () {

            var validator = $("#FormObtainmentSettingDetail").kendoValidator({
                messages: {
                    custom: "Do Not Obtain Notes is required",
                    custom2: "Pause Notification Date is required",
                    custom3: "Pause Notification Date should be in the future",
                },
                rules: {
                    custom: function (input) {
                        if ($("#ObtainmentSettingDoNotObtain").is(':checked')) {
                            if (input.is("[name=ddlDoNotObtainNotes]"))
                                return input.val() !== "";
                            }
                        return true;
                    },
                    custom2: function (input) {
                        if ($("#ObtainmentSettingPauseNotification").is(':checked')) {
                            if (input.is("[name=ObtainmentSettingPauseNotificationDP]"))
                                return input.val() !== "";
                            }
                        return true;
                    },
                    custom3: function (input) {
                        if ($("#ObtainmentSettingPauseNotification").is(':checked')) {
                            if (input.is("[name=ObtainmentSettingPauseNotificationDP]")) {
                                var pickeddate = new Date(input.val());
                                var todayDate = new Date();
                                if (pickeddate > todayDate)
                                    return true;

                                return false;
                            }
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
                    //SelectedCountrieID: $("#ddlDocumentCountry").val(),
                    SelectedRegionID: $("#ddlDocumentRegion").val(),
                    DoNotObtain: $("#ObtainmentSettingDoNotObtain").is(':checked'),
                    DoNotObtainID: $("#ddlDoNotObtainNotes").val(),
                    PauseNotification: $("#ObtainmentSettingPauseNotification").is(':checked'),
                    PauseNotificatioDate: $("#ObtainmentSettingPauseNotificationDP").val(),
                    PauseNotificationNote: $("#PauseNotificationNote").val(),
                    ObtainmentStartStepLkpID: $("#ddlObtainmentStartAction").val(),
                    RenewalStartActionID: $("#ddlRenewalStartAction").val(),
                    SpecialAssignedTo: $("#OSSpecialAssignment").val(),
                };


                //var url = '@Url.Action("SaveObtainmentSettingDetail", "ObtainmentSettings")';
                var url = "../ObtainmentSettings/SaveObtainmentSettingDetail";
                $.post(url, { jsObtainmentSettingsModel: JSON.stringify(queryText) }, function (data) {                    
                    if (data == -1)
                    {
                        onDisplayError('Can not save duplicate obtainment setting.');
                    }
                    else if (data == '0')
                        onDisplayError('Error occured while saving the contact details');
                    else {
                        var obtID = $("#ObtainmentSettingID").val();
                        var grid = $("#gdObtainmentSettings").data("kendoGrid");
                        grid.dataSource.read();
                        /*Commented by hitesh on as it just showing current id of saved obtainment */
                        //$('#ObtainmentSettingsDetail').html(data);
                            if (obtID > 0) 
                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html('Obtainment settings saved.');
                            else 
                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html('Obtainment settings added.');
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
            //$("#DetailSupplier").on("click", "#searchSupplierIdBtn", fnSearchSupplier);

        };


        var initSupplierSummary = function (supplierId) {
            //kendo.alert(supplierId);

            $("#gdSupplierSummaryEmail_" + supplierId).kendoGrid({
                dataSource: {
                    type: "aspnetmvc-ajax",
                    transport: {
                        read: {
                            url: "../Company/WebSite_Read",
                            data: function () {
                                return {
                                    supplierId: supplierId
                                }
                            }
                        }
                    },
                    schema: {
                        data: "Data",
                        model: {
                            id: "CompanyWebsiteId",
                            fields: {
                                "CompanyWebsiteId": { type: "integer" },
                                "Url": { type: "string" },
                                "WebSiteTypeDescription": { type: "string" }
                            }
                        }
                        //,
                        //total: function (response) {
                        //    if (typeof response.Data !== 'undefined')
                        //        return response.Data.length;
                        //    else
                        //        return 0;
                        //}
                    },
                    //pageSize: 10
                    //serverPaging: false,
                    //serverSorting: true,
                },
                height:80,
                filterable: true,
                sortable: true,
                autoBind: true, 
                //pageable: {
                //    alwaysVisible: true,
                //    previousNext: true,
                //    //refresh: true,
                //    //pageSizes: [10, 20, 50],
                //    buttonCount: 10
                //},
                requestStart: function (e) {
                    kendo.ui.progress(thisGrid, true);
                    //Or kendo.ui.progress($("#" + target.attr('id').kendoGrid()), false);
                },
                requestEnd: function (e) {
                    kendo.ui.progress(thisGrid, false);
                },
                columns: [
                    //{ field: "CompanyWebsiteId", title: "ID"},
                    { field: "Url", title: "Website/URL", template: '<a href=\"#=Url#\" target="_blank">#=Url#</a>' },
                    { field: "WebSiteTypeDescription", title: "WebSite Type", width: "120px"}
                ]
                //dataBound: function (e) {
                //    setTimeout(function () {
                //        e.sender.wrapper.find('.k-pager-wrap.k-grid-pager > a').removeClass('k-state-disabled');
                //    });
                //}
            });

            $("#gdSupplierSummaryObtainmentSetting_" + supplierId).kendoGrid({
                dataSource: {
                    type: "aspnetmvc-ajax",
                    transport: {
                        read: {
                            url: "../ObtainmentSettings/ObtainmentSettings_Read",
                            data: function () {
                                return {
                                    supplierId: supplierId
                                }
                            }
                        }
                    },
                    schema: {
                        data: "Data",
                        model: {
                            id: "ObtainmentSettingID",
                            fields: {
                                "Sequence": { type: "integer" },
                                "DocType": { type: "string" },
                                "Language": { type: "string" },
                                "Region": { type: "string" },
                                "DoNotObtainDescription": { type: "string" },
                                "ObtainmentStepsDescription": { type: "string" }
                            }
                        }
                        //,
                        //total: function (response) {
                        //    if (typeof response.Data !== 'undefined')
                        //        return response.Data.length;
                        //    else
                        //        return 0;
                        //}
                    },
                    //pageSize: 10
                    //serverPaging: false,
                    //serverSorting: true,
                },
                height: 80,
                filterable: true,
                sortable: true,
                autoBind: true,
                pageable: {
                    alwaysVisible: false,
                    //previousNext: true,
                    //refresh: true,
                    //pageSizes: [10, 20, 50],
                    pageSizes: 2
                    //buttonCount: 10
                },
                requestStart: function (e) {
                    kendo.ui.progress(thisGrid, true);
                    //Or kendo.ui.progress($("#" + target.attr('id').kendoGrid()), false);
                },
                requestEnd: function (e) {
                    kendo.ui.progress(thisGrid, false);
                },
                columns: [
                    //{ field: "Sequence", title: "Seq" },
                    { field: "DocType", title: "DocType" },
                    { field: "Language", title: "Language" },
                    { field: "Region", title: "Jurisdiction" },
                    {
                        field: "DoNotObtainDescription",
                        title: "Do Not Obtain",
                        encoded: false,
                        //template: "<b style='font-size: 1.2em;'>#=DoNotObtainDescription#</b>",
                        width: "400px"
                    },
                    {
                        field: "ObtainmentStepsDescription",
                        title: "Obtainment",
                        encoded: false,
                        //template: "<b style='font-size: 1.2em;'>#=ObtainmentStepsDescription#</b>",
                        width: "400px"
                    },
                ]
                //dataBound: function (e) {
                //    setTimeout(function () {
                //        e.sender.wrapper.find('.k-pager-wrap.k-grid-pager > a').removeClass('k-state-disabled');
                //    });
                //}
            });

            $("#gdSupplierSummaryAlias_" + supplierId).kendoGrid({
                dataSource: {
                    type: "aspnetmvc-ajax",
                    transport: {
                        read: {
                            url: "../Company/Alias_Read",
                            data: function () {
                                return {
                                    supplierId: supplierId
                                }
                            }
                        }
                    },
                    schema: {
                        data: "Data",
                        model: {
                            id: "CompanyAliasId",
                            fields: {
                                "CompanyAliasId": { type: "integer" },
                                "Name": { type: "string" }
                            }
                        }
                        //total: function (response) {
                        //    if (typeof response.Data !== 'undefined')
                        //        return response.Data.length;
                        //    else
                        //        return 0;
                        //}
                    },
                    pageSize: 10
                    //serverPaging: false,
                    //serverSorting: true,
                },
                height: 80,
                filterable: true,
                sortable: true,
                autoBind: true,
                pageable: {
                    alwaysVisible: false,
                    //previousNext: true,
                    //refresh: true,
                    //pageSizes: [10, 20, 50],
                    pageSizes: 2
                    //buttonCount: 10
                },
                requestStart: function (e) {
                    kendo.ui.progress(thisGrid, true);
                    //Or kendo.ui.progress($("#" + target.attr('id').kendoGrid()), false);
                },
                requestEnd: function (e) {
                    kendo.ui.progress(thisGrid, false);
                },
                columns: [
                    //{ field: "CompanyAliasId", title: "Alias Id" },
                    { field: "Name", title: "Alias Name" }
                ]
            });

            $("#gdSupplierSummaryContactInfo_" + supplierId).kendoGrid({
                dataSource: {
                    type: "aspnetmvc-ajax",
                    transport: {
                        read: {
                            url: "../Company/LoadSupplierContactAddress",
                            data: function () {
                                return {
                                    supplierId: supplierId
                                }
                            }
                        }
                    },
                    schema: {
                        data: "Data",
                        model: {
                            id: "SupplierAddressId",
                            fields: {
                                "SupplierAddressId": { type: "integer" },
                                "AddressType": { type: "string" },
                                "SupplierAddressName": { type: "string" },
                                "SupplierAddress1": { type: "string" },
                                "SupplierCity": { type: "string" },
                                "SupplierState": { type: "string" },
                                "SupplierCountry": { type: "string" },
                                "SupplierPostalCode": { type: "string" },
                                "PhoneNumber": { type: "string" },
                                "SupplierEmails": { type: "string" }
                            }
                        }
                        //total: function (response) {
                        //    if (typeof response.Data !== 'undefined')
                        //        return response.Data.length;
                        //    else
                        //        return 0;
                        //}
                    },
                    pageSize: 10
                    //serverPaging: false,
                    //serverSorting: true,
                },
                height: 160,
                filterable: true,
                sortable: true,
                autoBind: true,
                pageable: {
                    alwaysVisible: false,
                    //previousNext: true,
                    //refresh: true,
                    //pageSizes: [10, 20, 50],
                    pageSizes: 2
                    //buttonCount: 10
                },
                requestStart: function (e) {
                    kendo.ui.progress(thisGrid, true);
                    //Or kendo.ui.progress($("#" + target.attr('id').kendoGrid()), false);
                },
                requestEnd: function (e) {
                    kendo.ui.progress(thisGrid, false);
                },
                columns: [
                    { field: "AddressType", title: "Type", width: "45px"},
                    { field: "SupplierAddressName", title: "Name" },
                    { field: "SupplierAddress1", title: "Address" },
                    { field: "SupplierCity", title: "City", width: "120px" },
                    { field: "SupplierState", title: "State", width: "120px" },
                    { field: "SupplierCountry", title: "Country" },
                    { field: "SupplierPostalCode", title: "Zip",  width: "60px"},
                    { field: "PhoneNumber", title: "Phone Number", encoded: false },
                    { field: "SupplierEmails", title: "Email", encoded: false }
                    //template: '<a href=\"#=Url#\" target="_blank">#=Url#</a>'
                ]
                //dataBound: function (e) {
                //    setTimeout(function () {
                //        e.sender.wrapper.find('.k-pager-wrap.k-grid-pager > a').removeClass('k-state-disabled');
                //    });
                //}
            });
        }
      

        //----------------------start of not in use-----------------------
        //var refreshAndQuery = function (txtCntlId, gridId) {
        //    refreshSupplierSearchResultGrid(gridId);
        //    QueueQuery(txtCntlId, gridId);
        //};

        //var refreshSupplierSearchResultGrid = function (gridid) {
        //    var grid = $("#" + gridid).data("kendoGrid");

        //    if (grid.dataSource.view().length > 0) {
        //        grid.dataSource.page(1);
        //    }
        //    grid.dataSource.read();
        //};


        //var QueueQuery = function (txtCntrlId, gridid) {
        //    txtCntrlId = "#" + txtCntrlId;
        //    if ($(txtCntrlId).val().length != 0) {
        //        var searchQueue = $(".btn-group > ul.dropdown-menu");
        //        if (searchQueue.length > 0) {

        //            searchQueue.prepend("<li><a href='#'><span class='hreflimit'>" + $(txtCntrlId).val() + "</span></a><span class='btn history-close'>×</span></li>");

        //            if ($(".btn-group > ul.dropdown-menu li").length > 10) 
        //                $(".btn-group > ul.dropdown-menu > li:last-child").remove();
                    
        //            $(".btn-group > ul.dropdown-menu li a").click(function () {
        //                $(txtCntrlId).val($(this).text());
        //                refreshSupplierSearchResultGrid(gridid);
        //            });

        //            $(".btn.history-close").click(function (e) {
        //                //$(e).parent().find("li").remove();
        //                e.target.parentNode.outerHTML = "";
        //                e.stopPropagation();
        //            });
        //        }
        //    }
        //};
        //----------------------end of not in use-----------------------

        var loadSupplierDetail = function (supplierId) {
            var url = '../Company/GetSupplierDetail';
            $.post(url, { SupplierId: supplierId }, function (data) {
                var detail = $('#DetailSupplier');

                if (detail) 
                    detail.html(data);
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

        // Supplier Identification Methods
        var initSupplierIdentification = function(errorCallback, onDeactivateContentLoad) {
            onErrorCallback = errorCallback;
            
            // Set up observer to hide all save/cancel/add/delete buttons
            var statusDdl = $('#SelectStatusId').data('kendoDropDownList');
            var deactivatedLabel = $('#lblSupplierDeactivated');

            if (statusDdl && statusDdl.value() == '14') {

                // Display deactivated label
                if (deactivatedLabel.length > 0)
                    deactivatedLabel.show();

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
            else {
                if (deactivatedLabel.length > 0)
                    deactivatedLabel.hide();
            }
        };

        var setNotesModalSettings = function(settings) {
            notesModalSettings = settings;
        };

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

        $(document).on('paste', '#DetailSupplier #txtMultipleAliases', function () {
            DoMultipleItems("#DetailSupplier #txtMultipleAliases", null);
        });

        $(document).on('paste', '#DetailSupplier #txtMultipleWebsites', function () {
            DoMultipleItems("#DetailSupplier #txtMultipleWebsites", null);
        });

        $(document).on('paste', '#DetailSupplier #txtMultipleEmails', function () {
            DoMultipleItems("#DetailSupplier #txtMultipleEmails", regexExpressionEmail);
        });


        $("#DetailSupplier").on("keyup", '#txtMultipleAliases', function (e) {
            if (e.keyCode == 13 || (e.ctrlKey && e.keyCode==86)) {
                e.preventDefault();
                DoMultipleItems("#DetailSupplier #txtMultipleAliases",null);
            }
        });
        
        $("#DetailSupplier").on("keyup", '#txtMultipleWebsites', function (e) {
            if (e.keyCode == 13 || (e.ctrlKey && e.keyCode == 86)) {
                e.preventDefault();
                DoMultipleItems("#DetailSupplier #txtMultipleWebsites",null);
            }
        });

        $("#DetailSupplier").on("keyup", '#txtMultipleEmails', function (e) {
            if (e.keyCode == 13 || (e.ctrlKey && e.keyCode == 86)) {
                e.preventDefault();
                DoMultipleItems("#DetailSupplier #txtMultipleEmails", regexExpressionEmail);
            }
        });

           $("#DetailSupplier").on("click", '#btnDiscardMultipleContactEmails', function () {
              $('#DetailSupplier #txtMultipleEmails').val("");
              $('#mdlMultipleContactEmails').modal("toggle");
           });

           $("#DetailSupplier").on("click", '#btnSaveMultipleContactEmails', function (e) {
              if ($('#DetailSupplier #txtMultipleEmails').val() == "") {
                  $('#mdlMultipleContactEmails').modal("toggle");
                  onDisplayError('Emails are required.');
                  return;
             }
             texts = [];
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

        function republishDocuments(supplierId, state) {


        }

        $("#DetailSupplier").on("click", '#Published', function (e) {

            var checked = $(this).is(":checked");       // public/private 
            var supplierId = $("#SupplierId").val();    // company id

            if (supplierId > 0) {

                var args = {
                    header: 'Confirm Document Access for Public',
                    message: 'Do you wish to republish the Documents associated to this manufacturer?'
                };

                DisplayConfirmationModal(args, function () {

                    // ===========================================================

                    var url = GetEnvironmentLocation() + "/Operations/Company/SetAllDocumentVisibility";
                    
                    $.ajax({
                        url: url,
                        data: JSON.stringify({ supplierId: $("#SupplierId").val(), state: checked }),
                        type: "POST",
                        contentType: 'application/json; charset=utf-8'
                    });

                    // ===========================================================
                }, function () {
                    $('#Published').prop("checked", !checked);
                });

            }

  
        });

        $("#DetailSupplier").on("click", '#btnSaveMultipleFacilityEmails', function (e) {
            if ($('#DetailSupplier #txtMultipleEmails').val() == "") {
                $('#mdlMultipleFacilityEmails').modal("toggle");
                onDisplayError('Emails are required.');
                return;
            }
            texts = [];
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

        $("#DetailSupplier").on("click", '#btnDiscardMultipleAliases', function () {
            $('#DetailSupplier #txtMultipleAliases').val("");
            $('#mdlMultipleAliases').modal("toggle");
        });

        $("#DetailSupplier").on("click", '#btnSaveMultipleAliases', function (e) {
            
            var selAliaseType = $("#DetailSupplier #selAliasType").data("kendoDropDownList");
            if (selAliaseType.value() == "" || $('#DetailSupplier #txtMultipleAliases').val() == "") {
                $('#mdlMultipleAliases').modal("toggle");
                onDisplayError('Alias Type and Aliases are required.');
                return;
            }
            texts = [];
            var lines = $('#DetailSupplier #txtMultipleAliases').val().split(/\n/);
            for (var i = 0; i < lines.length; i++) {
                // only push this line if it contains a non whitespace character.
                if (lines[i].length > 0)
                    texts.push($.trim(lines[i]));
            }
           
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
            var selWebSiteType = $("#DetailSupplier #selWebSiteType").data("kendoDropDownList");
            if (selWebSiteType.value() == "" || $('#DetailSupplier #txtMultipleWebsites').val() == "") {
                $('#mdlMultipleWebSites').modal("toggle");
                onDisplayError('Web Site Type and Web Sites are required.');
                return;
            }
            var lines = $('#DetailSupplier #txtMultipleWebsites').val().split(/\n/);
            for (var i = 0; i < lines.length; i++) {
                // only push this line if it contains a non whitespace character.
                if (lines[i].length > 0)
                    texts.push($.trim(lines[i]));
            }
            
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

        // #region Advance Search Section

        function extractSupplierCriteria(e) {
            var supplierSearchModel = {};
            var SearchOperator = 'SearchOperator';

            var searchCriteria = $(supplierLiterSettings.controls.customControl.MainSupplierAdvanceSearchCtl).data(supplierLiterSettings.data.advanceSearch).DataSource();

            $.each(searchCriteria, function (index, row) {
                var selectedColumn = row.columnDataSource[row.selectedColumn - 1];

                if (selectedColumn.Type === 'integer') {
                    supplierSearchModel[selectedColumn.ColumnMap] = row.enteredDataFieldValue;
                }
                else if (selectedColumn.Type === 'text') {
                    supplierSearchModel[selectedColumn.ColumnMap] = row.enteredDataFieldValue;
                    supplierSearchModel[selectedColumn.ColumnMap + SearchOperator] = row.selectedOperator;
                }
                else if (selectedColumn.Type === 'lookup') {
                    supplierSearchModel[selectedColumn.ColumnMap] = row.selectedDataLookupIndex;
                }
            });

            return {
                supplierSearchCriteria: supplierSearchModel
            };
        }

        function refreshSupplierSearchResultGrid() {
            var grid = $(supplierLiterSettings.controls.grids.SupplerSearchGrid).data("kendoGrid");
            if (grid.dataSource.view().length > 0) {
                grid.dataSource.page(1);
            }
            grid.dataSource.read();
        }

        function RestoreAdvanceSearchFromRoamingProfile(sender) {
            var url = GetEnvironmentLocation() + "/Operations/Company/RetrieveCompanySearchSettings"
            $(this).ajaxCall(url)
                .success(function (SearchDefault) {
                    if (SearchDefault != "") {
                        var dsObject = JSON.parse(SearchDefault);
                        sender.SetData(dsObject);
                    }
                }).error(function (error) {
                    $(this).displayError(error);
                });
        };

        var advanceSearchInitialize = function () {
            $(supplierLiterSettings.controls.buttons.ClearSupplierSearchButton).click(function (e) {
                if (typeof $(supplierLiterSettings.controls.customControl.MainSupplierAdvanceSearchCtl).data(supplierLiterSettings.data.advanceSearch) != 'undefined')
                    adSearchCtl.ClearData();

                //Remove search result
                //$('#DetailSupplier').html('');
                var grid = $(supplierLiterSettings.controls.grids.SupplerSearchGrid).data("kendoGrid");

                if (grid.dataSource.total() == 0) {
                    return false;
                }

                grid.dataSource.filter([]);
                grid.dataSource.data([]);
            });

            $(supplierLiterSettings.controls.buttons.SaveSupplierSearchButton).click(function (e) {
                var adSearchCtl = $(supplierLiterSettings.controls.customControl.MainSupplierAdvanceSearchCtl).data(supplierLiterSettings.data.advanceSearch);
                if (typeof adSearchCtl != 'undefined') {
                    var searchDataSource = adSearchCtl.DataSource();

                    $(supplierLiterSettings.controls.buttons.SaveSupplierSearchButton).data(supplierLiterSettings.data.advanceSearchHistory, searchDataSource);
                    var url = GetEnvironmentLocation() + "/Operations/Company/SaveCompanySearchSettings"
                    $(this).ajaxCall(url, { searchDataSource: JSON.stringify(searchDataSource) })
                        .success(function (successData) {
                            if (successData.success == true) {
                                //DisableEnableButtons(true);
                                $(this).savedSuccessFully("Saved Successfully");
                            }
                        }).error(function (error) {
                            $(this).displayError(error);
                        });
                }
            });

            //This button is for test only
            $(supplierLiterSettings.controls.buttons.RestoreSupplierSearchSettingsButton).click(function (e) {
                //var adSearchCtl = $(supplierLiterSettings.controls.customControl.MainSupplierAdvanceSearchCtl).data('eeeCompli.advancedsearch');
                //RestoreAdvanceSearchFromRoamingProfile(adSearchCtl);

                var dsObject = RestoreAdvanceSearchFromRoamingProfile();
                var historyDataSource = $(supplierLiterSettings.controls.buttons.SaveSupplierSearchButton).data(supplierLiterSettings.data.historyDataSource);
                if (typeof historyDataSource != 'undefined') {
                    var adSearchCtl = $(supplierLiterSettings.controls.customControl.MainSupplierAdvanceSearchCtl).data(supplierLiterSettings.data.advanceSearch);
                    adSearchCtl.SetData(historyDataSource);
                }
                else
                    kendo.alert("No saved datasource.");
            });

            $(supplierLiterSettings.controls.buttons.SearchSupplierButton).click(function (e) {
                $('#DetailSupplier').html('');
                refreshSupplierSearchResultGrid();
            });

            //Initialize main advance search control
            var adSearchCtl = $(supplierLiterSettings.controls.customControl.MainSupplierAdvanceSearchCtl).data(supplierLiterSettings.data.advanceSearchHistory);
            if (typeof adSearchCtl == 'undefined') {
                advanceSearchDataSource.SupplierSearchColumn.read().then(function () {
                    advanceSearchDataSource.Operators.read().then(function () {
                        adSearchCtl = $(supplierLiterSettings.controls.customControl.MainSupplierAdvanceSearchCtl).advancedsearch({
                            //Using dynamic data source extracted from database
                            selectedColumnDataSource: advanceSearchDataSource.SupplierSearchColumn.view(),
                            //selectedColumnDataSource: asSupplierSearchColumnDataSource,
                            selectedOperatorDataSource: advanceSearchDataSource.Operators.view(),
                            selectedDataSourceUrl: GetEnvironmentLocation() + "/" + advanceSearchDataSourceSettings.controllers.Svc + "/",
                            EnableLog: false

                            //Using Static datasource, selectedDataSourceUrl is not required
                            //selectedColumnDataSource: asSupplierSearchColumnDataSource,
                            //selectedOperatorDataSource: defaultOperatorDataSource,
                            //EnableLog: false
                        });
                        $(supplierLiterSettings.controls.customControl.MainSupplierAdvanceSearchCtl).data(supplierLiterSettings.data.advanceSearch, adSearchCtl);
                        RestoreAdvanceSearchFromRoamingProfile(adSearchCtl);
                    });
                });
            }

            //Initialize popup advance search control -- Another pattern
            //var adPopUpSearchCtl = $(supplierLiterSettings.controls.customControl.SupplierAdvanceSearchCtlInPopUp).data(supplierLiterSettings.data.advanceSearch);
            //if (typeof adSearchCtl == 'undefined') {
            //    advanceSearchDataSource.SupplierSearchColumn.read().then(function () {
            //        advanceSearchDataSource.Operators.read().then(function () {
            //            adPopUpSearchCtl = $(supplierLiterSettings.controls.customControl.SupplierAdvanceSearchCtlInPopUp).advancedsearch({
            //                //Using dynamic data source extracted from database
            //                selectedColumnDataSource: advanceSearchDataSource.SupplierSearchColumn.view(),
            //                selectedOperatorDataSource: advanceSearchDataSource.Operators.view(),
            //                selectedDataSourceUrl: GetEnvironmentLocation() + "/" + advanceSearchDataSourceSettings.controllers.Svc + "/",
            //                EnableLog: false
            //            });
            //            $(supplierLiterSettings.controls.customControl.SupplierAdvanceSearchCtlInPopUp).data(supplierLiterSettings.data.advanceSearch, adPopUpSearchCtl);
            //        });
            //    });
            //}

        };

        // #endregion

        //Expose to public
        return {
            //QueueQuery: QueueQuery,
            refreshSupplierSearchResultGrid: refreshSupplierSearchResultGrid,
            //refreshAndQuery: refreshAndQuery,

            onGetObtainmentSettingId: onGetObtainmentSettingId,
            OnChangeCountry: OnChangeCountry,

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
            SelectSupplierCommunications: SelectSupplierCommunications,
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
            onGdSupplierCommunicationsDataBound: onGdSupplierCommunicationsDataBound,
            onGdSupplierContactsDataBound: onGdSupplierContactsDataBound,
            onGdContactAddressDataBound: onGdContactAddressDataBound,
            onGdContactAddressChange: onGdContactAddressChange,
            onGdContactAddressEdit: onGdContactAddressEdit,
            onGdContactPhoneDataBound: onGdContactPhoneDataBound,
            onGdContactEmailDataBound: onGdContactEmailDataBound,
            ongdObtainmentSettingsDataBound: ongdObtainmentSettingsDataBound,


            initObtainmentSettingWiring: initObtainmentSettingWiring,
            initSupplierSummary: initSupplierSummary,
            initializeSupplierLibrary: initializeSupplierLibrary,

            loadSupplierDetail: loadSupplierDetail,
            getContactCountryDropdownData: getContactCountryDropdownData,
            getFacilityCountryDropdownData: getFacilityCountryDropdownData,
            getSupplierCountryDropdownData: getSupplierCountryDropdownData,

            initSupplierIdentification: initSupplierIdentification,
            setNotesModalSettings: setNotesModalSettings,

            clearSupplierStatusNote: clearSupplierStatusNote,
            onStatusChange: onStatusChange,
            showMultiple: showMultiple,
            showMultipleWebSites: showMultipleWebSites,
            showMultipleFacilityEmails: showMultipleFacilityEmails,
            showMultipleContactEmails: showMultipleContactEmails,
            onGridSaveFacilityPhone: onGridSaveFacilityPhone,
            onGridEditChangePhone: onGridEditChangePhone,
            onGridEditChangeEmail: onGridEditChangeEmail,
            onGridEditChangeContactPhone: onGridEditChangeContactPhone,
            onGridEditChangeContactEmail: onGridEditChangeContactEmail,
            extractSupplierCriteria: extractSupplierCriteria,
            advanceSearchInitialize: advanceSearchInitialize
        };
    };
})(jQuery);
