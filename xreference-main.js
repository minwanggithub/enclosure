; (function ($) {
    if ($.fn.complibXReference == null) {
        $.fn.complibXReference = {};
    }
    $.fn.complibXReference = function () {
        var xreferenceDetailObj = $("#DetailXreference");
        var xreferenceSearchObj = $("#XReferenceGrid");
        var itemsChecked = 0;
        var requestSearchModel = {};
        var selectedRequests = new Array();
        var selectedRows = new Array();
        var radioButtonSelected = "Group";
  

        // General indexation methods
        var loadRequestsPlugin = function () {
            initializeMultiSelectCheckboxes(xreferenceDetailObj);
        };

        var loadMyRequestsPlugin = function () {
            initializeMultiSelectCheckboxes(xreferenceSearchObj);
        };

        var IsReadOnlyMode = function () {
            return ($("#SearchPanel").find("span.icon-lock.icon-white").length == 1);
        };

        var onDisplayError = function (errorMessage) {
            var message = errorMessage;
            $('#errorReport').find('.modal-body').html(message);
            DisplayModal("errorReport");
        }

        //Foreign script from suppplier not being in this module
        var gdGroupsChange = function () {
            var selectedData = this.dataItem(this.select());
            var groupId = selectedData.GroupID;
            var url = "../Configuration/RequestManager/GetGroupUsers";
            $.post(url, {
                groupId: groupId
            }, function (result) {
                $("#GroupUsersDetail").html($(result));
            });

        };

        var loadRequests = function() {
            var grid = $("#gdRequests").data("kendoGrid");
            grid.dataSource.read();
            //setTimeout(openDocWindowSearch(), 5000);
            $("#txtIndividual").closest(".k-widget").hide();
            $("#eeeSideBarWorkLoad").sidemenu();
            $('#eeeSideBarWorkLoad').show();
            $("#atlwdg-trigger").css({ top: '100px' });
        };
       
        var loadSupplierPlugIn = function () {
            $.post("../ObtainmentSettings/PlugInSupplierSearch", { supplierId: 0 }, function (data) {
                $("#dgSupplierPlugIn").html(data);
            });
            var supplierSearchDialog = $("#supplierSearchWindow");

            $("#btnCancelSupplierSearch").click(function () {
                supplierSearchDialog.data("kendoWindow").close();
                DisableSideMenuItems();
                EnableSideMenuItem("btnObtainment");
                DisplayModal("mdlObtainment");
            });

            $('#dgSupplierPlugIn').on('dblclick', 'table tr', function () {
                obtainmentSelSupplier(supplierSearchDialog);
            });

            //This is for Supplier plugIn
            $("#searchSupplierIdSelect").click(function () {
                obtainmentSelSupplier(supplierSearchDialog);
            });

        }
       
        var hotKeyDisplay = function (btnObj, mdlObj) {

            var xrefModals = ['mdlResolve', 'mdlObtainment', 'mdlPending', 'mdlCustomerAction', 'mdlQC'];
            for (var i = 0; i < xrefModals.length; i++) {
                if (mdlObj != xrefModals[i])
                    $("#" + xrefModals[i]).modal("hide");
            }

            if (btnObj == "btnResolve") {
                $("#hdnDialogOpen").val("resolveOpen");
            }


            if (btnObj == "btnCustomerAction") {
                $("#lblNotes").css("display", "none");
                $("#txtNotes").css("display", "none");

            }

            if (btnObj == "btnPending") {
                $("#lblPendingNotes").css("display", "none");
                $("#txtPendingNotes").css("display", "none");
            }

            DisableSideMenuItems();
            EnableSideMenuItem(btnObj);
            DisplayModal(mdlObj);
        }

        //Assgn and Unassign Request and saves them
        if ($("#hdnAccess").val() == "Admin") {
            AssignUnassignRequest("btnUnAssignFrom", "gdRequests", "unassign these request", "../XReference/SaveAssignedItems", false, "x u");
            AssignUnassignRequest("btnAssignTo", "gdRequests", "assign these request", "../XReference/SaveAssignedItems", true, "x a");
        } else {
            AssignUnassignRequest("btnAssignMe", "gdRequests", "assign these request", "../XReference/SaveAssignedItems", true, "x a");
            AssignUnassignRequest("btnUnAssign", "gdRequests", "unassign these request", "../XReference/SaveAssignedItems", false, "x u");
        }
        
        //Display Modals on Button Clicks
        EnableSideMenuItems();

        xreferenceSearchObj.on("click", "#clearRequestSearchBtn", function () {
            var url = "../XReference/SearchXReferenceContent";
            $.post(url, function (data) {
                $("#divSearchSection").html(data);
            });
        });

        xreferenceDetailObj.on("change", "input[name=GroupIndividual]:radio", function () {
            radioButtonSelected = $(this).val();
            if ($(this).val() == "Group") {
                $("#ddlGroups").closest(".k-widget").show();
                $("#txtIndividual").closest(".k-widget").hide();
                $("#txtIndividual").data("kendoAutoComplete").value("");
            }
            else {
                $("#txtIndividual").closest(".k-widget").show();
                $("#ddlGroups").closest(".k-widget").hide();
            }
        });

        xreferenceDetailObj.on("click", "#btnAssignTo", function () {
            DisplayModal("mdlAssign");
        });
        
        xreferenceDetailObj.on("click", "#btnSaveAssign", function (e) {
            e.preventDefault();
            var userName = $("#txtIndividual").data("kendoAutoComplete");
            var selectedValue;
            if (radioButtonSelected == "Group") {
                var ddlGroups = $("#ddlGroups").data("kendoDropDownList");
                selectedValue = ddlGroups.text();
            } else {
                selectedValue = userName.value();
            }

            if (selectedValue.length > 0) {
                batchDeleteObjects('gdRequests', 'assign these request item(s)', '../XReference/SaveAssignedItems', null, true, selectedValue);
            } else {
                $('#mdlAssign').modal('hide');
                var errorMessage;

                if ($("input[name=GroupIndividual]:radio").val() == "Group")
                    errorMessage = "Please select a group to assign request item(s)";
                else
                    errorMessage = "User required to assign selected request item(s)";

                onDisplayError(errorMessage);
            }

        });

        //clears search results
        xreferenceSearchObj.on("click", "#clearRequestSearchBtn", function () {
            xreferenceDetailObj.html("");
        });
        
        //Show Supplier
        xreferenceSearchObj.on("click", "#searchSupplierIdBtn", function () {
           // var activeSupplier = "txtSearchSupplierId";
            $("#supplierSearchWindow").data("kendoWindow").center();
            $("#supplierSearchWindow").data("kendoWindow").open();
            HideModal("mdlObtainment");
        });

        //Toggle Customer Action Option for Notes
        xreferenceSearchObj.on("change", "#selCustomerAction", function () {
            var selCustomerAction = $("#selCustomerAction").data("kendoDropDownList");
            if (selCustomerAction.text() == "Other") {
                $("#lblNotes").css("display", "inline");
                $("#txtNotes").css("display", "inline");
            } else {
                $("#lblNotes").css("display", "none");
                $("#txtNotes").css("display", "none");
            }
        });

        //Toggle Pending Option for Notes
         xreferenceSearchObj.on("change", "#selPending", function() {
        var selPending = $("#selPending").data("kendoDropDownList");
            if(selPending.text() == "Other") {
                $("#lblPendingNotes").css("display", "inline");
                $("#txtPendingNotes").css("display", "inline");
            } else {
                $("#lblPendingNotes").css("display", "none");
                $("#txtPendingNotes").css("display", "none");
            }
            });

        //Does search and displays search results 
         xreferenceSearchObj.on("click", "#searchRequestBtn", function () {
            var numberOfRows = $('div #row').length;
            var initialRow = 0;
            var mltCategories = $("#divSearchSection #mltCategories").data("kendoMultiSelect");
            var dteDateAssigned = $("#divSearchSection #DateAssigned").data("kendoDatePicker");
            var drpStatus = $("#divSearchSection #ddlStatus").data("kendoDropDownList");
            var drpDays = $("#divSearchSection #ddlDays").data("kendoDropDownList");

            var strCategoryValue = mltCategories.value();
            var intCategoryValue = 0;
            for (var indexCategory = 0; indexCategory < strCategoryValue.length; indexCategory++)
                intCategoryValue += parseInt(strCategoryValue[indexCategory]);

            //create requestSearchModel to be passed to the controller
            requestSearchModel.DateAssigned = dteDateAssigned.value() == "" ? null : dteDateAssigned.value();
            requestSearchModel.StatusId = drpStatus.value() == "" ? null : drpStatus.value();
            requestSearchModel.DaysSelected = drpDays.value() == "" ? null : drpDays.value();
            requestSearchModel.Category = intCategoryValue == 0 ? null : intCategoryValue;

            var criteriaList = [];

            //create filter array
            for (var indexRows = 0; indexRows < numberOfRows; indexRows++) {
               initialRow++;
               var drpFields = $("div #row #middle #drpFields_" + initialRow).data("kendoDropDownList");
               var drpCriteria = $("div #row #right #drpContains_" + initialRow).data("kendoDropDownList");
               var criteria = { };
               criteria.FieldName = drpFields.value();
               criteria.WhereOperator = drpCriteria.text();
               var valueAssigned;
               if ($("div #row #right #txtFreeField_" + initialRow).is(":hidden")) {
                   if (drpFields.text() == "Language") {
                       var drpLanguage = $("div #row #right #drpLanguage_" + initialRow).data("kendoDropDownList");
                       var language = drpLanguage.value();
                       criteria.SearchFor = language.replace("flag-", "");
                   }


                   if (drpFields.text() == "Document Type") {
                       var drpDocType = $("div #row #right #drpDocumentType_" + initialRow).data("kendoDropDownList");
                       criteria.SearchFor = drpDocType.value();
                   }


                   if (drpFields.text() == "Country") {
                       var drpCountry = $("div #row #right #drpCountry_" + initialRow).data("kendoDropDownList");
                       criteria.SearchFor = drpCountry.value();
                   }

                   if(criteria.SearchFor.length>0)
                    criteriaList.push(criteria);

               } else {
                   valueAssigned = $("div #row #right #txtFreeField_" + initialRow).val();
                   criteria.SearchFor = valueAssigned;

                   if (valueAssigned.length > 0)
                    criteriaList.push(criteria);
               }
               
            }

            if (dteDateAssigned.value() != null || drpStatus.value() != "" || drpDays.value() != "" || intCategoryValue > 0 || criteriaList.length > 0) {
                //add filter array to requestSearchModel
                $("#searchRequestBtn").attr("disabled", "disabled");
                $("#clearRequestSearchBtn").attr("disabled", "disabled");
                requestSearchModel.Criterias = criteriaList;
                kendo.ui.progress(xreferenceDetailObj, true);
                var url = "../XReference/SearchRequests";
                $.post(url, {
                    searchCriteria: JSON.stringify(requestSearchModel)
                }, function (data) {
                    xreferenceDetailObj.html(data);
                   
                }).done(function () {
                    $("#searchRequestBtn").removeAttr("disabled");
                    $("#clearRequestSearchBtn").removeAttr("disabled");
                });
            } else {
                onDisplayError("A filter must be selected to execute a search");
            }

           
        });

        //Save Request to be Resolved
         xreferenceSearchObj.on("click", "#btnSaveResolve", function () {
            if($("#numberOfItems").val().length == 0) {
                 HideModal("mdlResolve");
                 onDisplayError("No items have been selected to be resolved");
             } else {
                 if ($("#txtProductId").val().length > 0) {
                     var data = { };
                     data['ids'] = selectedRequests;
                     data['productId'] = $("#txtProductId").val();
                     SaveRequest("../XReference/ResolveRequests", data, "mdlResolve");
                 } else {
                     HideModal("mdlResolve");
                     onDisplayError("No product has been selected");
                 }
             }
         });

        //Save Request for Obtainment
        xreferenceSearchObj.on("click", "#btnSaveObtainment", function () {
            if ($("#numberOfItems").val().length == 0 || $("#numberOfItems").val() == "0" || $("#numberOfItems").val() == "") {
                HideModal("mdlObtainment");
                onDisplayError("No items have been selected to be sent to obtainment");
            } else {
                if ($("#txtSearchSupplierId").val().length > 0) {
                    var data = {};
                    data['ids'] = selectedRequests;
                    data['supplierId'] = Remove($("#txtSearchSupplierId").val(), $("#txtSearchSupplierId").val().indexOf(","));
                    SaveRequest("../XReference/SaveObtainment", data, "mdlObtainment");
                } else {
                    HideModal("mdlObtainment");
                    onDisplayError("No supplier has been selected");
                }
            }

        });

        //Save Request for Customer Action
        xreferenceSearchObj.on("click", "#btnSaveCustomerAction", function () {
            if($("#numberOfItems").val() == "") {
                HideModal("mdlCustomerAction");
                onDisplayError("No items have been selected for customer action");
            } else {
                  var selCustomerAction = $("#selCustomerAction").data("kendoDropDownList");
                if (selCustomerAction.text().length > 0 || $("#txtNotes").text().length > 0) {
                    var data = { };
                    data['ids']= selectedRequests;
                    data['customerAction']= selCustomerAction.text();
                    data['notes']= $("#txtNotes").text();
                    SaveRequest("../XReference/SaveCustomerActionRequests", data, "mdlCustomerAction");
                } else {
                    HideModal("mdlCustomerAction");
                    onDisplayError("No customer action has been specified");
                }
            }

        });

        //Save Request for Pending Action
        xreferenceSearchObj.on("click", "#btnSavePending", function () {
            if ($("#numberOfItems").val() == "") {
                HideModal("mdlPending");
                onDisplayError("No items have been selected for customer action");
            } else {
                var selPending = $("#selPending").data("kendoDropDownList");
                var selYesNo = $("#selYesNo").data("kendoDropDownList");
                if (selPending.text().length > 0 || $("#txtPendingNotes").text().length > 0) {
                    var data = {};
                    data['ids'] = selectedRequests;
                    data['keepInWorkload'] = selYesNo.value();
                    data['pendingAction'] = selPending.text();
                    data['notes'] = $("#txtPendingNotes").text();
                    SaveRequest("../XReference/SavePendingRequests", data, "mdlPending");
                } else {
                    HideModal("mdlPending");
                    onDisplayError("No action has been specified");
                }
            }

        });

        //Save Request for QC Action
        //xreferenceSearchObj.on("click", "#btnSaveQC", function () {
        //    if ($("#numberOfItems").val() == "") {
        //        HideModal("mdlQC");
        //        onDisplayError("No items have been selected for customer action");
        //    } else {
        //        var selQC = $("#selQC").data("kendoDropDownList");
        //        if (selQC.text().length > 0 || $("#txtQCNotes").text().length > 0) {
        //            var data = {};
        //            data['ids'] = selectedRequests;
        //            data['qcStatus'] = selQC.value();
        //            data['notes'] = $("#txtQCNotes").text();
        //            SaveRequest("../XReference/SaveQCRequests", data, "mdlQC");
        //        } else {
        //            HideModal("mdlQC");
        //            onDisplayError("No action has been specified");
        //        }
        //    }

        //});

        $(document).keypress(function(e) {
            var code = e.keyCode || e.which;
           
            if (e.altKey) {
                switch (code) {
                    case 49: //Open Resolve Window alt+1
                        HotKeyDisplayModal("btnResolve", "mdlResolve");
                        return false;
                    case 50: //Open Obtainment Window alt+2
                        HotKeyDisplayModal("btnObtainment", "mdlObtainment");
                        return false;
                    case 51: //Open Pending Window alt+3
                        HotKeyDisplayModal("btnPending", "mdlPending");
                        return false;
                    case 52: //Open Customer Action Window alt+4
                        HotKeyDisplayModal("btnCustomerAction", "mdlCustomerAction");
                        return false;
                    case 53: //Open QC Window alt+5
                        HotKeyDisplayModal("btnQC", "mdlQC");
                        return false;
                    case 54: //Remove Request alt+5
                        batchDeleteObjects("gdRequests", "unassign these request", "../XReference/SaveAssignedItems", null, false);
                        return false;
                    case 114: //save Resolve alt+r
                        $("#XReferenceGrid #btnSaveResolve").click();
                        return false;
                    case 111: //save obtainment alt+o
                        $("#XReferenceGrid #btnSaveObtainment").click();
                        return false;
                    case 112: //save pending alt+p
                        $("#XReferenceGrid #btnSavePending").click();
                        return false;
                    case 99: //save customer action alt+c
                        $("#XReferenceGrid #btnSaveCustomerAction").click();
                        return false;
                    case 113: //save qc alt+q
                        $("#XReferenceGrid #btnSaveQC").click();
                        return false;
                }
            }
            return true;
        });
        
        xreferenceSearchObj.on("click", "#btnRemoveRequests", function (e) {
                e.preventDefault();
                batchDeleteObjects("gdRequests", "unassign these request", "../XReference/SaveAssignedItems", null, false);
       });

        //Display Modal Pop Up for History of Requests
        xreferenceSearchObj.on("click", ".showHistory", function (e) {
            e.preventDefault();
            var url = "../Xreference/RequestWorkLoadHistory";
            $.post(url, {requestWorkItemID: this.id}, function (result) {
                $("#dvRequestItemHistory").html(result);
            }).done(function() {
                DisplayModal("mdlViewHistory");
            });

        });

        //changes the controls on the criteria from dropdowns to text inputs depending on selection
        $(document).on("change", "select", function () {
            //only execute this code if the dropdownlist is other than the dropdownlist on grid for paging
        if(this.id.length > 0) {
            var elementId = $(this).attr("id");
            var ddlName = $(this).attr("id").substring(0, elementId.indexOf("_"));
                var index = elementId.substring(elementId.indexOf("_") + 1);

            if ($(this).val() == "Language" || $(this).val() == "DocumentType" || $(this).val() == "Country") {
                $("#txtFreeField_" + index).hide();
                    var drpDownList = window.CreateDropDown($(this).val().toLowerCase(), index);
                //create dropdown in html form first and added to it's corresponding div
                    $("#dvDropDown_" + index).html(drpDownList);
                //transform select to kendo dropdown
                    $("#drp" + $(this).val() + "_" + index).kendoDropDownList();
                    $("#dvDropDown_" + index).css("display", "inline");
                    return;
            }

                if (ddlName == "drpFields") {
                    $("#txtFreeField_" + index).show();
                $("#dvDropDown_" + index).css("display", "none");
                }
        }
        });

        function Remove(str, startIndex) {
            return str.substr(0, startIndex);
        }

        function obtainmentSelSupplier(supplierSearchDialog) {
            var grid = $("#gdSearchSupplierNew").data("kendoGrid");
            if (grid.dataSource.total() == 0) {
                onDisplayError("No row selected");
                return;
            }
            var data = grid.dataItem(grid.select());
            if (data == null) {
                onDisplayError("No row selected");
                return;
            }
            $("#txtSearchSupplierId").val(data.id + "," + data.Name);

            supplierSearchDialog.data("kendoWindow").close();
            DisplayModal("mdlObtainment");
        }

        function SaveRequest(strUrl, dataArray, modalId) {
            if(selectedRequests.length > 0) {
               $.ajax({
                   url: strUrl,
                   data: JSON.stringify(dataArray),
                   type: "POST",
                   contentType: 'application/json; charset=utf-8',
                   beforeSend: function() {
                       kendo.ui.progress(xreferenceDetailObj, true);
                   },
                   error: function() {
                       onDisplayError('Requests could not be saved');
                   },
                   success: function(successData) {
                       if(successData.success == true) {
                            kendo.ui.progress(xreferenceDetailObj, false);
                           var grid = $("#gdRequests").data("kendoGrid");
                           grid.dataSource.read();
                         
                           HideModal(modalId);
                           onDisplayError(successData.message);

                       } else {
                           onDisplayError('Requests could not be saved');
                       }
                   },
                   done:function() {
                       $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Items Saved Successful");
                   }
               });
            }
        }

        function AssignUnassignRequest(btnObj, gridObj, message, url, isAssigned, keyCombination) {
            xreferenceDetailObj.on("click", "#" + btnObj, function (e) {
                e.preventDefault();
                batchDeleteObjects(gridObj, message, url, null, isAssigned);
            });
            Mousetrap.bind(keyCombination, function () { $("#" + btnObj).click(); });
        }

        function DisplayModal(modalId) {
            $('#' + modalId).find('.modal-body').html();
            $('#' + modalId).modal({
                backdrop: true,
                keyboard: true
            }).css(
            {
                'margin-left': function() {
                    return -($(this).width() / 2);
                }
            });
        }

        function HideModal(modalId) {
            $("#" + modalId).modal("toggle");
        }
    
        xreferenceDetailObj.on('hide', '#mdlResolve', function () {
            EnableSideMenuItems();
        });
        xreferenceDetailObj.on('hide', '#mdlObtainment', function () {
            EnableSideMenuItems();
        });
        xreferenceDetailObj.on('hide', '#mdlPending', function () {
            EnableSideMenuItems();
        });
        xreferenceDetailObj.on('hide', '#mdlCustomerAction', function () {
            EnableSideMenuItems();
        });

        xreferenceDetailObj.on('hide', '#mdlQC', function () {
            EnableSideMenuItems();
        });

        function DisableSideMenuItems() {
            $("#btnResolve").attr("disabled", "disabled");
            xreferenceSearchObj.off("click", "#btnResolve");
            $("#btnObtainment").attr("disabled", "disabled");
            xreferenceSearchObj.off("click", "#btnObtainment");
            $("#btnPending").attr("disabled", "disabled");
            xreferenceSearchObj.off("click", "#btnPending");
            $("#btnCustomerAction").attr("disabled", "disabled");
            xreferenceSearchObj.off("click", "#btnCustomerAction");
            $("#btnRemoveRequests").attr("disabled", "disabled");
            xreferenceSearchObj.off("click", "#btnRemoveRequests");
            $("#btnQC").attr("disabled", "disabled");
            xreferenceSearchObj.off("click", "#btnQC");
        }

        function EnableSideMenuItems() {
            $("#btnResolve").removeAttr("disabled");
            $("#btnObtainment").removeAttr("disabled");
            $("#btnPending").removeAttr("disabled");
            $("#btnCustomerAction").removeAttr("disabled");
            $("#btnRemoveRequests").removeAttr("disabled");
            $("#btnQC").removeAttr("disabled");
            ShowDisplayModal("btnResolve", "mdlResolve");
            ShowDisplayModal("btnObtainment", "mdlObtainment");
            ShowDisplayModal("btnPending", "mdlPending");
            ShowDisplayModal("btnCustomerAction", "mdlCustomerAction");
            ShowDisplayModal("btnQC", "mdlQC");
        }

        function EnableSideMenuItem(btnObj) {
            $("#" + btnObj).removeAttr("disabled");
        }

        function HotKeyDisplayModal(btnObj, mdlObj) {
            if (btnObj == "btnResolve") {
                $("#hdnDialogOpen").val("resolveOpen");
            }


            if (btnObj == "btnCustomerAction") {
                $("#lblNotes").css("display", "none");
                $("#txtNotes").css("display", "none");

            }

            if (btnObj == "btnPending") {
                $("#lblPendingNotes").css("display", "none");
                $("#txtPendingNotes").css("display", "none");
            }
         
            DisableSideMenuItems();
            EnableSideMenuItem(btnObj);
            DisplayModal(mdlObj);
            
        }

        function ShowDisplayModal(btnObj, mdlObj) {
            xreferenceSearchObj.on("click", "#" + btnObj, function (e) {
                e.preventDefault();
               

                if (btnObj == "btnResolve") {
                    $("#hdnDialogOpen").val("resolveOpen");
                }
                    

                if (btnObj == "btnCustomerAction") {
                    $("#lblNotes").css("display", "none");
                    $("#txtNotes").css("display", "none");
                    
                }

                if(btnObj == "btnPending") {
                    $("#lblPendingNotes").css("display", "none");
                    $("#txtPendingNotes").css("display", "none");
                }

                DisableSideMenuItems();
                EnableSideMenuItem(btnObj);
                DisplayModal(mdlObj);

            });
        }
       
        function initializeMultiSelectCheckboxes(obj) {
            obj.on("mouseup MSPointerUp", ".chkMultiSelect", function (e) {
                selectedRequests = new Array();
                var checked = $(this).is(':checked');
                var grid = $(this).parents('.k-grid:first');
                if (grid) {
                    var kgrid = grid.data().kendoGrid;
                    var selectedRow = $(this).parent().parent();
                    var dataItem = kgrid.dataItem($(this).closest('tr'));
                    if (dataItem) {
                        dataItem.set('IsSelected', !checked);
                        if (selectedRow.length > 0) {
                            if ($(this).is(':checked')) {
                                var indexUid = selectedRows.indexOf(selectedRow.attr('data-uid'));
                                if (indexUid > -1)
                                    selectedRows.splice(indexUid, 1);
                            }else
                                selectedRows.push(selectedRow.attr('data-uid'));
                        }
                    }

                    itemsChecked = 0;
                    $.each(kgrid._data, function () {
                        if (this['IsSelected']) {
                            selectedRequests.push(this["RequestWorkItemID"]);
                            itemsChecked++;
                        } else {
                            var index = selectedRequests.indexOf(this["RequestWorkItemID"]);
                            if (index > -1)
                                selectedRequests.splice(index, 1);
                        }

                        if (selectedRows.indexOf(this["uid"]) > -1)
                            grid.find('tr[data-uid="' + this["uid"] + '"]').addClass('k-state-selected');
                        else
                            grid.find('tr[data-uid="' + this["uid"] + '"]').removeClass('k-state-selected');
                    });

                    $("#numberOfItems").text("(" + itemsChecked + ")");
                    $("#numberOfItems").val(itemsChecked);

                    //highlight rows on current page
                    //$.each(kgrid._data, function () {
                    //    if (selectedRows.indexOf(this["uid"]) > -1) 
                    //        grid.find('tr[data-uid="' + this["uid"] + '"]').addClass('k-state-selected');
                    //     else 
                    //        grid.find('tr[data-uid="' + this["uid"] + '"]').removeClass('k-state-selected');
                    //});

                    e.stopImmediatePropagation();
                }
                
            });

            obj.on("click", ".chkMasterMultiSelect", function () {
                selectedRequests = new Array();
                itemsChecked = 0;
                var checked = $(this).is(':checked');
                var grid = $(this).parents('.k-grid:first');
                if (grid) {
                    var kgrid = grid.data().kendoGrid;
                    if (kgrid._data.length > 0) {
                        $.each(kgrid._data, function () {
                            this['IsSelected'] = checked;
                            if (this['IsSelected']) {
                                selectedRequests.push(this["RequestWorkItemID"]);
                                itemsChecked++;
                            } else {
                                var index = selectedRequests.indexOf(this["RequestWorkItemID"]);
                                if (index > -1) {
                                    selectedRequests.splice(index, 1);
                                   // grid.find('tr[data-uid="' + this["uid"] + '"]').removeClass('k-state-selected');
                                }
                                    
                            }
                        });

                        kgrid.refresh();
                        $("#numberOfItems").text("(" + itemsChecked + ")");
                        $("#numberOfItems").val(itemsChecked);
                        // No items were found in the datasource, return from the function and cancel the current event

                        //highlight rows on current page
                        $.each(kgrid._data, function () {
                            if (this['IsSelected'])
                                grid.find('tr[data-uid="' + this["uid"] + '"]').addClass('k-state-selected');
                             else 
                                grid.find('tr[data-uid="' + this["uid"] + '"]').removeClass('k-state-selected');
                        });

                    } else {
                        return false;
                    }
                }

                return false;
            });
        }

        function batchDeleteObjects(targetGrid, objName, url, data, isAssign, assignTo, completeCallback) {
            if(!targetGrid || !objName || !url) {
                return false;
            }

            var targetGridSelector = '#' + targetGrid;
            var grid = $(targetGridSelector).data("kendoGrid");
            if (grid && grid.dataSource._total > 0) {
                var selectedIds = new Array();
                $.each(grid.dataSource.data(), function () {
                    if(this.IsSelected == true) {
                        selectedIds.push(this.id);
                    }
                });

                if (selectedIds.length > 0) {
                    if (!data) {
                        data = { };
                    }

                    data['ids'] = selectedIds;
                    data["searchCriteria"] = $("#SearchCriteria").val();
                    data["isAssign"] = isAssign;

                    if (typeof (assignTo) != "undefined") {
                        data["assignedTo"] = assignTo;
                        $('#mdlAssign').modal('hide');

                        var args = { message: 'Are you sure you would like to ' + objName + '?', header: 'Confirm Requests Selected' };
                        DisplayConfirmationModal(args, function () {
                            $.ajax({
                                url: url,
                                data: JSON.stringify(data),
                                type: "POST",
                                contentType: 'application/json; charset=utf-8',
                                beforeSend: function () {
                                    kendo.ui.progress(xreferenceDetailObj, true);
                                },
                                error: function () {
                                    onDisplayError('Requests could not be assigned');
                                },
                                success: function (successData) {

                                    if (successData.success == true) {

                                        // Uncheck the master select checkbox if checked
                                        var checkbox = $(grid.element).find('.chkMasterMultiSelect');
                                        if (checkbox && checkbox.is(':checked')) {
                                            checkbox.attr('checked', false);
                                        }

                                        grid = $(targetGridSelector).data("kendoGrid");
                                        grid.dataSource.read();


                                        // displayCreatedMessage('Items Assigned Successful');

                                    } else {
                                        onDisplayError("Error Occurred");
                                    }

                                },
                                complete: function (compData) {

                                    kendo.ui.progress(xreferenceDetailObj, false);
                                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Items Saved Successful");
                                    if (completeCallback) {
                                        completeCallback(compData);
                                    }
                                }
                            });
                        });
                    }
                } else {
                    $('#mdlAssign').modal('hide');
                    onDisplayError("No items have been selected");
                }
            }
            return false;
        };


        return {
            loadRequestsPlugin: loadRequestsPlugin,
            loadMyRequestsPlugin: loadMyRequestsPlugin,
            loadRequests: loadRequests,
            loadSupplierPlugIn: loadSupplierPlugIn,
            IsReadOnlyMode: IsReadOnlyMode,
            onDisplayError: onDisplayError,
            gdGroupsChange: gdGroupsChange,
            hotKeyDisplay: hotKeyDisplay
        };
    };
})(jQuery);

