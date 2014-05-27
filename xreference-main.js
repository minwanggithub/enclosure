; (function ($) {
    if ($.fn.complibXReference == null) {
        $.fn.complibXReference = {};
    }
    $.fn.complibXReference = function () {
        var xreferenceDetailObj = $("#DetailXreference");
        var xreferenceSearchObj = $("#XReferenceGrid");
        var xreferenceSearchResults = $("#dvRequestSearchResults");
        var itemsChecked = 0;
        var requestSearchModel = {};
        // General indexation methods
        var loadRequestsPlugin = function () {
            initializeMultiSelectCheckboxes();
        };

       
        var IsReadOnlyMode = function () {
            return ($("#SearchPanel").find("span.icon-lock.icon-white").length == 1);
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

        xreferenceDetailObj.on("click", "#btnAssignTo", function() {
            $('#mdlAssign').find('.modal-body').html();
            $("#mdlAssign").modal({
                backdrop: true,
                keyboard: true
            }).css({
                width: 'auto',
                'margin-left': function () {
                    return -($(this).width() / 2); 
                }
            });
        });

        

        xreferenceDetailObj.on("click", "#btnUnAssign", function (e) {
            e.preventDefault();
            batchDeleteObjects('gdRequests', 'unassign these request', '../XReference/SaveAssignedItems', null, false);
        });

        xreferenceDetailObj.on("click", "#btnAssignMe", function (e) {
            e.preventDefault();
            batchDeleteObjects('gdRequests', 'assign these request','../XReference/SaveAssignedItems',null,true);
        });



        
        //Does search and displays search results 
        xreferenceSearchObj.on("click", "#searchRequestBtn", function (e) {
            var numberOfRows = $('div #row').length;
            var initialRow = 0;
            var drpPriorities = $("#divSearchSection #ddlPriorities").data("kendoDropDownList");
            var drpAssigned = $("#divSearchSection #ddlAssignations").data("kendoDropDownList");
            var dteDateCreated = $("#divSearchSection #DateCreated").data("kendoDatePicker");
            var dteDateAssigned = $("#divSearchSection #DateAssigned").data("kendoDatePicker");
           
            //create requestSearchModel to be passed to the controller
            requestSearchModel.Priority = drpPriorities.value() == "" ? null : drpPriorities.value();
            requestSearchModel.Assigned = drpAssigned.value() == "" ? null : drpAssigned.value();
            requestSearchModel.DateCreated = dteDateCreated.value() == "" ? null : dteDateCreated.value();
            requestSearchModel.DateAssigned = dteDateAssigned.value() == "" ? null : dteDateAssigned.value();

            var criteriaList = [];

            //create filter array
           for (var i = 0; i < numberOfRows; i++) {
               initialRow++;
               var drpFields = $("div #row #middle #drpFields_" + initialRow).data("kendoDropDownList");
               var drpCriteria = $("div #row #right #drpContains_" + initialRow).data("kendoDropDownList");
               var criteria = {};
               criteria.FieldName = drpFields.value();
               criteria.WhereOperator = drpCriteria.text();
               var valueAssigned;
               if ($("div #row #right #txtFreeField_" + initialRow).is(":hidden")) {
                   if (drpFields.text() == "Language") {
                       var drpLanguage = $("div #row #right #drpLanguage_" + initialRow).data("kendoDropDownList");
                       criteria.SearchFor = drpLanguage.value();
                   }


                   if (drpFields.text() == "Document Type") {
                       var drpDocType = $("div #row #right #drpDocumentType_" + initialRow).data("kendoDropDownList");
                       criteria.SearchFor = drpDocType.text();
                       debugger;
                   }


                   if (drpFields.text() == "Country") {
                       var drpCountry = $("div #row #right #drpCountry_" + initialRow).data("kendoDropDownList");
                       criteria.SearchFor = drpCountry.value();
                   }

               } else {
                   valueAssigned = $("div #row #right #txtFreeField_" + initialRow).val();
                   criteria.SearchFor = valueAssigned;
               }
                   

               criteriaList.push(criteria);
           }

            //add filter array to requestSearchModel
           requestSearchModel.Criterias = criteriaList;
            var url = "../XReference/SearchRequests";
            $.post(url, { searchCriteria: JSON.stringify(requestSearchModel) }, function (data) {
                xreferenceDetailObj.html(data);
            });
        });

        //clears search results
        xreferenceSearchObj.on("click", "#clearRequestSearchBtn", function (e) {
            xreferenceDetailObj.html("");
        });

       //changes the controls on the criteria from dropdowns to text inputs depending on selection
        $(document).on("change", "select", function () {
            //only execute this code if the dropdownlist is other than the dropdownlist on grid for paging
            if (this.id.length > 0) {
                var elementId = $(this).attr("id");
                var ddlName = $(this).attr("id").substring(0, elementId.indexOf("_"));
                var index = elementId.substring(elementId.indexOf("_") + 1);

                if ($(this).val() == "Language") {
                    $("#txtFreeField_" + index).hide();
                    var drpDownLanguage = CreateDropDown("language", index);
                    //create dropdown in html form first and added to it's corresponding div
                    $("#dvDropDown_" + index).html(drpDownLanguage);
                    //transform select to kendo dropdown
                    $("#drpLanguage_" + index).kendoDropDownList();
                    $("#dvDropDown_" + index).css("display", "inline");
                    return;
                }

                if ($(this).val() == "DocumentType") {
                    $("#txtFreeField_" + index).hide();
                    var drpDownDocType = CreateDropDown("docType", index);
                    $("#dvDropDown_" + index).html(drpDownDocType);
                    //transform select to kendo dropdown
                    $("#drpDocumentType_" + index).kendoDropDownList();
                    $("#dvDropDown_" + index).css("display", "inline");
                    return;
                }

                if ($(this).val() == "Country") {
                    $("#txtFreeField_" + index).hide();
                    var drpDownCountry = CreateDropDown("country", index);
                    $("#dvDropDown_" + index).html(drpDownCountry);
                    //transform select to kendo dropdown
                    $("#drpCountry_" + index).kendoDropDownList();
                    $("#dvDropDown_" + index).css("display", "inline");
                    return;
                }

                if (ddlName == "drpFields") {
                    $("#txtFreeField_" + index).show();
                    $("#dvDropDown_" + index).css("display", "none");
                }
            }
        });
     
        

        function initializeMultiSelectCheckboxes() {

            xreferenceDetailObj.on("mouseup MSPointerUp", ".chkMultiSelect", function (e) {
                var checked = $(this).is(':checked');
                var grid = $(this).parents('.k-grid:first');
                if (grid) {
                    var kgrid = grid.data().kendoGrid;
                    var selectedRow = kgrid.tbody.find(".k-state-selected");;
                    var dataItem = kgrid.dataItem($(this).closest('tr'));
                    if (dataItem) {
                        dataItem.set('IsSelected', !checked);
                        if (selectedRow.length > 0) {
                            grid.find('tr[data-uid="' + selectedRow.attr('data-uid') + '"]').addClass('k-state-selected');
                        }
                    }
                }

                itemsChecked = 0;
                $.each(kgrid._data, function () {
                    if(this['IsSelected'])
                        itemsChecked++;
                });

                $("#numberOfItems").text("(" + itemsChecked + ")");

                // Keep grid from changing seleted information
                e.stopImmediatePropagation();
            });

            xreferenceDetailObj.on("click", ".chkMasterMultiSelect", function (e) {
                itemsChecked = 0;
                var checked = $(this).is(':checked');
                var grid = $(this).parents('.k-grid:first');
                if (grid) {
                    var kgrid = grid.data().kendoGrid;
                    if (kgrid._data.length > 0) {
                        $.each(kgrid._data, function () {
                            this['IsSelected'] = checked;
                            itemsChecked++;
                          
                        });

                        kgrid.refresh();
                        $("#numberOfItems").text("(" + itemsChecked + ")");
                        // No items were found in the datasource, return from the function and cancel the current event
                    } else {
                        return false;
                    }
                }
            });
        }

        function batchDeleteObjects(targetGrid, objName, url, data, isAssign, completeCallback) {
            if (!targetGrid || !objName || !url) {
                return false;
            }

            var targetGridSelector = '#' + targetGrid;
            var grid = $(targetGridSelector).data("kendoGrid");
            if (grid && grid.dataSource._total > 0) {

                var selectedIds = new Array();
                $.each(grid.dataSource.data(), function () {
                    if (this.IsSelected == true) {
                        selectedIds.push(this.id);
                    }
                });

                if (selectedIds.length > 0) {
                    if (!data) {
                        data = {};
                    }

                    data['ids'] = selectedIds;
                    data["searchCriteria"] = $("#SearchCriteria").val();
                    data["isAssign"] = isAssign;
                    var args = { message: 'Are you sure you would like to ' + objName + '?', header: 'Confirm Requests Selected' };
                    DisplayConfirmationModal(args, function () {
                        $.ajax({
                            url: url,
                            data: JSON.stringify(data),
                            type: "POST",
                            contentType: 'application/json; charset=utf-8',
                            beforeSend: function () {
                                kendo.ui.progress(xreferenceDetailObj, true);
                            }, error: function () {
                                onDisplayError('Requests could not be assigned');
                            }, success: function (successData) {

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
                                    onDisplayError("fja;lsfja;lsfdja;slj");
                                }

                            }, complete: function (compData) {

                                kendo.ui.progress(xreferenceDetailObj, false);

                                if (completeCallback) {
                                    completeCallback(compData);
                                }
                            }
                        });
                    });
                }
            }
        };

        return {
            loadRequestsPlugin: loadRequestsPlugin,
            IsReadOnlyMode: IsReadOnlyMode,
            onDisplayError: onDisplayError
        };
    };
})(jQuery);