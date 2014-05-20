; (function ($) {
    if ($.fn.complibXReference == null) {
        $.fn.complibXReference = {};
    }
    $.fn.complibXReference = function () {
        var xreferenceDetailObj = $("#DetailXreference");
        var xreferenceSearchObj = $("#XReferenceGrid");
        var xreferenceSearchResults = $("#dvRequestSearchResults");
        var itemsChecked = 0;

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


        
        //Does search and displays search results 
        xreferenceSearchObj.on("click","#searchRequestBtn", function (e) {
            var url = "../XReference/SearchRequests";
            var dateCreated = $("#DateCreated").val();
            $.post(url, { dateCreated: dateCreated }, function (data) {
                xreferenceDetailObj.html(data);
            });
        });

        //clears search results
        xreferenceSearchObj.on("click", "#clearRequestSearchBtn", function (e) {
            xreferenceDetailObj.html("");
        });

       //changes the controls on the criteria from dropdowns to text inputs depending on selection
        $(document).on("change", "select", function () {
            var elementId = $(this).attr("id");
            var ddlName = $(this).attr("id").substring(0, elementId.indexOf("_"));
            var index = elementId.substring(elementId.indexOf("_") + 1);

            if ($(this).val() == "10") {
                $("#txtFreeField_" + index).hide();
                var drpDownLanguage = CreateDropDown("language", index);
                //create dropdown in html form first and added to it's corresponding div
                $("#dvDropDown_" + index).html(drpDownLanguage);
                //transform select to kendo dropdown
                $("#drpLanguage_" + index).kendoDropDownList();
                $("#dvDropDown_" + index).css("display", "inline");
                return;
            }

            if ($(this).val() == "11") {
                $("#txtFreeField_" + index).hide();
                var drpDownDocType = CreateDropDown("docType", index);
                $("#dvDropDown_" + index).html(drpDownDocType);
                //transform select to kendo dropdown
                $("#drpDocumentType_" + index).kendoDropDownList();
                $("#dvDropDown_" + index).css("display", "inline");
                return;
            }

            if ($(this).val() == "12") {
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


        return {
            loadRequestsPlugin: loadRequestsPlugin,
            IsReadOnlyMode: IsReadOnlyMode,
            onDisplayError: onDisplayError
        };
    };
})(jQuery);