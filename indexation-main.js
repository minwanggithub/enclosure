;(function($) {

    // Null check for plugin
    if ($.fn.compliIndexation == null) {
        $.fn.compliIndexation = {};
    }

    $.fn.compliIndexation = function() {

        var name = "#special_features";
        var menuYloc = null;
        var indexationDetailObj = $("#IndexationDetail");
        var ingredientValidator = null;
        var settings = null;
        var validationGeneral = true;
        var validationMessage = "Validation failed for following sections:<br />";
        var generalSave = false;

        // General indexation methodsa
        var loadIndexationPlugin = function(callbackSettings) {
            settings = callbackSettings;
            initializeMenu();
            $("#IndexationDetailPanel").kendoPanelBar({
                select: function(e) {
                    setTimeout(function() {
                        $(e.contentElement).find(".k-splitter").each(function() {
                            $(this).data("kendoSplitter").trigger("resize");
                        });
                    }, 500);
                }
            });

            initializeMultiSelectCheckboxes();
            initializeIdentificationControls();
            initializeIngredientControls();         // initialize indexation controls
            initializePhysicalChemicalControls();
            initializeTransportControls();
            initializeAmericanControls();
            initializeCanadianControls();
            initializeEuropeanControls();
            initializeGhsControls();
            initializeOthersControls();
            initializeHandlingStorageControls();
            initializeFirstAidControls();
            initializeFireFightingControls();
            initializePpeControls();

          

            indexationDetailObj.on("click", "#btnDocumentAddressSave", function (e) {
                e.preventDefault();
                var form = $("#FormDocumentContactAddress");
                var url = form.attr("action");
                var formData = form.serialize();
                $.post(url, formData, function (data) {
                    if (data.result === "success") {
                        var url = "../Indexation/GetDocumentContactAddress";
                        $.post(url, { indexationId: data.indexationId}, function (result) {
                            $("#DocERContactAddress").html($(result));
                        });

                        $(this).savedSuccessFully(data.message);
                    } else {
                        if (data.popupMessage)
                            $(this).displayError(data.popupMessage);
                    }
                });
                return true;                
            });

            indexationDetailObj.on("click", "#btnDocumentPhoneSave", function (e) {
                e.preventDefault();
                var form = $("#FormDocumentContactPhone");
                var url = form.attr("action");
                var formData = form.serialize();
                $.post(url, formData, function (data) {
                    if (data.result === "success") {
                        var url = "../Indexation/GetDocumentContactPhone";
                        $.post(url, {
                        indexationId: data.indexationId
                        }, function (result) {
                            $("#DocERContactPhone").html($(result));
                       });
                        $(this).savedSuccessFully(data.message);
                    } else {
                        if (data.popupMessage)
                            $(this).displayError(data.popupMessage);
                    }
                });
                return true;
            });

            function PrePopulatePhone(arr) {
            
                $('#CountryLkpId').val('');
                $('#CityOrAreaCode').val('');
                $('#LocalNumber').val('');
                $('#Extension').val('');

                if (arr.length >= 1) {
                    var phone = arr[0].trim();
                    phone = phone.replace(/\(/g, '-');
                    phone = phone.replace(/\)/g, '-');
                    phone = phone.replace(/\./g, '-');

                    var firstDigit = phone.match(/\d/);
                    var indexed = phone.indexOf(firstDigit);
                    if (indexed < 0) return;

                    phone = phone.substring(indexed, phone.length);
                    var phoneSplitArr = phone.split('-');
                    if (phoneSplitArr.length == 1) {
                        $('#LocalNumber').val(phoneSplitArr[0]);
                    } else if (phoneSplitArr.length >= 3) {
                        $('#CountryLkpId').val(phoneSplitArr[0]);
                        $('#CityOrAreaCode').val(phoneSplitArr[1]);
                        $('#LocalNumber').val(phoneSplitArr[2]);
                        $('#Extension').val((typeof phoneSplitArr[3] === 'undefined') ? null : phoneSplitArr[3]);
                    }

                }
            }

            indexationDetailObj.on("paste", "#OriginalPhoneLabel", function (e) {
                var e = this;

                setTimeout(function () {
                    var arr = e.value.split('\n');
                    PrePopulatePhone(arr);
                }, 4);

            });

            indexationDetailObj.on("click", "#btnERPhonePrePopulate", function (e) {
                var arr = $('#OriginalPhoneLabel').val().split('\n');
                PrePopulatePhone(arr);
            });

        };

        var loadNonSdsIndexationPlugin = function (callbackSettings) {
            settings = callbackSettings;
            initializeNonSdsControls();
        };

        var loadWorkLoadPlugIn = function() {
            initializeIngredientControls();
            initializeAmericanControls();
            initializeCanadianControls();
            initializeEuropeanControls();
            initializeGhsControls();
            initializeOthersControls();
        };

        var getIndexLevelParam = function () {
            var revisionId = $("#RevisionId").val();
            var ehsChecked = $('#IndexLevelEHS').prop('checked');
            var safetyHandlingChecked = $('#IndexLevelSafetyHandling').prop('checked');
            return { revisionId: revisionId, ehsLevel: ehsChecked, safetyHandlingLevel: safetyHandlingChecked };
        };

        var getDocRevisionId = function() {
            var revisionId = $("#RevisionId").val();
            var documentId = $("#DocumentId").val();
            return { RevisionId: revisionId, DocumentId: documentId };
        };

        var getIndexationId = function () {
            var indexationId = $("#IndexationId").val();
            return { IndexationId: indexationId };
        };

        var onGridEditChangeTitle = function(e) {
            var update = $(e.container).parent().find(".k-grid-update");
            var cancel = $(e.container).parent().find(".k-grid-cancel");
            $(update).attr('title', 'Save');
            $(cancel).attr('title', 'Cancel');
        };

        var onSaveNameNumber = function(e) {
            var currentNameOrNumber = e.model.NameOrNumber;
            var data = this.dataSource.data();
            $.each(data, function(i, row) {
                if (row.NameNumberId !== e.model.NameNumberId && currentNameOrNumber === row.NameOrNumber) {
                    $(this).displayError("Duplicates not allowed");
                    e.preventDefault();
                    return false;
                }
                return true;
            });
        };

        var onSaveReachUse = function (e) {
            var currentNameOrNumber = e.model.ReachUse;
            var data = this.dataSource.data();
            $.each(data, function(i, row) {
                if (row.ReachUseId !== e.model.ReachUseId && currentNameOrNumber === row.ReachUse) {
                    $(this).displayError("Duplicates not allowed");
                    e.preventDefault();
                    return false;
                }
                return true;
            });
        };

        var onSaveNonSdsIndexation = function() {
            var nonIndexationObj = $('#NonSdsIndexingContent');
            nonIndexationObj.on("click", "#btnSaveNonSdsIndexing", function (e) {
                e.preventDefault();

                var form = $('#NonSdsIndexingContent');
                var url = form.attr("action");
                var formData = form.serialize();
                $.post(url, formData, function (data) {
                    if (data.substring(0, 5) === "Error")
                        DisplayErrorNotification(data);
                    else
                        $(this).displaySavedMessage("NonSdsIndexation Saved.");

                });
            });
        }

        // Helper Methods
        
        //function displayErrorMessage(message) {
        //    if (settings && settings.onErrorCallback)
        //        settings.onErrorCallback(message);
        //    else
        //        $(this).displayError(message);

        //};

        //function displaySuccessMessage(message) {
        //    if (settings && settings.onSuccessCallback) {
        //        settings.onSuccessCallback(message);
        //    } else {
        //        alert(message);
        //    }
        //};

        function displayKendoPopup(element) {
            if (settings && settings.popupCallback && element)
                settings.popupCallback(element);
            else
                $(this).displayError('An error occurred displaying the popup');
        }

        function confirmUserSelection(header, message, yesFunc, noFunc) {
            if (settings && settings.onConfirmationCallback) {
                var args = { header: header, message: message };
                settings.onConfirmationCallback(args, yesFunc, noFunc);
            }
        }

        function operatorDropdownChange(selectedValue, fromDdl, toDdl, moreNeeded) {

            // <, <=, >, >=, =, approx, trace, range

            // disable by default
            $("#" + fromDdl + ", #" + toDdl).val("").prop("disabled", onElementDisable);

            if (!selectedValue || selectedValue == 7) {
                $("#" + fromDdl + ", #" + toDdl).val("").prop("disabled", true);    // trace
            } else if (selectedValue == 8) {                                        // range
                $("#" + fromDdl + ", #" + toDdl).val("").prop("disabled", false);
            } else {
                $("#" + fromDdl).prop("disabled", false);
                $("#" + toDdl).val("").prop("disabled", true);
            }

            // if a function was passed to complete the task continue with that
            if (moreNeeded) {
                moreNeeded(selectedValue);
            }
        };

        function uniOperatorDropdownChange(selectedValue, fromDdl, moreNeeded) {
            $(fromDdl).val("").prop("disabled", onElementDisable);
            if (!selectedValue || selectedValue == 7) {
                $(fromDdl).val("").prop("disabled", true);    // trace
            } else if (selectedValue == 8) {                                        // range
                $(fromDdl).val("").prop("disabled", false);
            } else {
                $(fromDdl).prop("disabled", false);
            }

            // if a function was passed to complete the task continue with that
            if (moreNeeded) {
                moreNeeded(selectedValue);
            }
        };

        function concentrationTypeDropdownChange(selectedValue, affectedFields, moreNeeded) {

            if (!affectedFields)
                return false;

            var fieldEnabled = (selectedValue == 4);
            for (var idx = 0; idx < affectedFields.length; idx++) {

                var currentDdl = $('#' + affectedFields[idx]).data("kendoDropDownList");
                if (fieldEnabled == false)
                    currentDdl.select(0);
                currentDdl.enable(fieldEnabled);
            }

            if (moreNeeded)
                moreNeeded(selectedValue);
        }

        function onElementDisable(index, oldPropertyValue) {
            if (oldPropertyValue == false)
                removeValidationToolTips(this);
        }

        function removeValidationToolTips(element) {
            var self = $(element);

            var parentValue = self.parents('.controls:first');
            if (!parentValue || parentValue.length != 1) {
                if (self.is('[data-role="dropdownlist"]')) {
                    parentValue = self.parents('.k-dropdown');
                } else if (self.parent().is('[class^="span"]')) {
                    parentValue = self.parent();
                }
            }

            if (parentValue.length > 0) {
                parentValue.find('span.k-tooltip-validation').each(function () {
                    $(this).hide();
                });
            }
        }

        function hideEditorSection(editorId, timeout) {
            timeout = typeof timeout !== 'undefined' ? timeout : 300;

            var container = $('#' + editorId);
            if (container.length > 0) {
                container.fadeOut(timeout, function () {
                    $(this).empty();
                });
            }
        }

        function isValidDecimal(val) {
            var decimalVal = parseFloat(val);
            return decimalVal == val;
        }

        function parseErrorMessage(data) {

            var errorMessage = '';
            if (data && data.Errors) {
                
                var keys = Object.keys(data.Errors);
                for (var idx = 0; idx < keys.length; idx++) {
                    var errorobj = data.Errors[keys[idx]];
                    if (errorobj.errors && errorobj.errors.length > 0) {
                        errorMessage = errorobj.errors[0];
                        break;
                    }
                }
            }

            return errorMessage;
        }

        function searchGridDoubleClick(searchGrid, button) {
            var grid = $(searchGrid).data("kendoGrid");
            if (grid.dataSource.total() > 0) {
                $(button).trigger('click');
            }
        }

        function initializeMultiSelectCheckboxes() {
            
            indexationDetailObj.on("mouseup MSPointerUp", ".chkMultiSelect", function (e) {
                var checked = $(this).is(':checked');
                var grid = $(this).parents('.k-grid:first');
                if (grid) {
                    var kgrid = grid.data().kendoGrid;
                    var selectedRow = kgrid.tbody.find(".k-state-selected");;
                    var dataItem = kgrid.dataItem($(this).closest('tr'));
                    if (dataItem) {
                        dataItem.set('IsSelected', !checked);
                        if (selectedRow.length > 0)
                            grid.find('tr[data-uid="' + selectedRow.attr('data-uid') + '"]').addClass('k-state-selected');
                    }
                }

                // Keep grid from changing seleted information
                e.stopImmediatePropagation();
            });

            indexationDetailObj.on("click", ".chkMasterMultiSelect", function() {
                var checked = $(this).is(':checked');
                var grid = $(this).parents('.k-grid:first');
                if (grid) {
                    var kgrid = grid.data().kendoGrid;
                    if (kgrid._data.length > 0) {
                        $.each(kgrid._data, function() {
                            this['IsSelected'] = checked;
                        });

                        kgrid.refresh();
                    } else
                        return false;
                }
            });
        }

        function ReorderSelectedRow(targetGrid, up) {

            var targetGridSelector = '#' + targetGrid;
            var grid = $(targetGridSelector).data("kendoGrid");

            if (grid.select().length > 0) {

                var selectedData = grid.dataItem(grid.select());
                if (typeof selectedData != 'undefined') {

                    var ingredientId = selectedData.IngredientId;

                    $.ajax({
                        url: url,
                        data: JSON.stringify(data),
                        type: "POST",
                        contentType: 'application/json; charset=utf-8',
                        success: function (successData) {

                            if (successData.success === true) {

                                // Uncheck the master select checkbox if checked
                                var checkbox = $(grid.element).find('.chkMasterMultiSelect');
                                if (checkbox && checkbox.is(':checked')) {
                                    checkbox.attr('checked', false);
                                }

                                grid = $(targetGridSelector).data("kendoGrid");
                                grid.dataSource.read();

                            }

                        }

                    });

                }

            }else
            {
                $(this).displayError("No rows selected");
            }
 
        };

        function batchDeleteObjects(targetGrid, objName, url, data, completeCallback) {

            if (!targetGrid || !objName || !url)
                return false;


            var targetGridSelector = '#' + targetGrid;
            var grid = $(targetGridSelector).data("kendoGrid");
            if (grid && grid.dataSource._total > 0) {

                var selectedIds = new Array();
                $.each(grid.dataSource.data(), function () {
                    if (this.IsSelected == true)
                        selectedIds.push(this.id);
                });

                if (selectedIds.length > 0) {
                    if (!data)
                        data = {};

                    data['ids'] = selectedIds;

                    var args = {
                        message: 'Are you sure you would like to delete the selected ' + objName + '?',
                        header: 'Confirm Delete Selected'
                    };
                    DisplayConfirmationModal(args,
                        function() {

                            $.ajax({
                                url: url,
                                data: JSON.stringify(data),
                                type: "POST",
                                contentType: 'application/json; charset=utf-8',
                                beforeSend: function() {
                                    kendo.ui.progress($('#IndexationDetail'), true);
                                },
                                error: function() {
                                    onDisplayError('Deleting ' + objName + ' could not be completed');
                                },
                                success: function(successData) {

                                    if (successData.success === true) {

                                        // Uncheck the master select checkbox if checked
                                        var checkbox = $(grid.element).find('.chkMasterMultiSelect');
                                        if (checkbox && checkbox.is(':checked')) {
                                            checkbox.attr('checked', false);
                                        }

                                        grid = $(targetGridSelector).data("kendoGrid");
                                        grid.dataSource.read();

                                        $(this).savedSuccessFully('Delete Successful');

                                    } else {
                                        $(this).displayError(successData.message);
                                    }

                                },
                                complete: function(compData) {

                                    kendo.ui.progress($('#IndexationDetail'), false);

                                    if (completeCallback) {
                                        completeCallback(compData);
                                    }
                                }
                            });
                        });
                } else {
                    $(this).displayError("No rows selected");
                }
            }
        };

        function batchDeleteIndexationObjects(targetGrid, objName, url, completeCallback) {

            var indId = getIndexationId();
            var data = { indexationId: indId.IndexationId };

            batchDeleteObjects(targetGrid, objName, url, data, completeCallback);
        };

        var multiDeleteCache = {
            cache: {},
            getCache: function(tableName) {
                var cacheObj = this.cache[tableName] = this.cache[tableName] || {};
                return cacheObj;
            },
            clearCache: function(tableName) {
                this.cache[tableName] = {};
            }
        };

        var onMultiDeleteGridDataBinding = function (e) {
            // Set the checkbox style only on rebind of the grid
            if (e.action === "rebind") {
                var grid = $(e.sender.table.context);
                if (grid.length > 0) {
                    var kgrid = grid.data("kendoGrid");
                    if (kgrid) {
                        var readonly = kgrid.dataSource.total() <= 0;
                        grid.find('.chkMasterMultiSelect').attr("readonly", readonly);

                        // Capture the most recent selected row of the table
                        var cacheObj = multiDeleteCache.getCache(grid.attr('id'));
                        var selectedRow = kgrid.tbody.find(".k-state-selected:first");;
                        if (selectedRow && selectedRow.length > 0) {
                            cacheObj["selected"] = selectedRow.data('uid');
                        }
                    }
                }
            }
        };

        var onMultiDeleteGridDataBound = function (e) {
            var grid = $(e.sender.table.context);
            if (grid) {
                var cacheObj = multiDeleteCache.getCache(grid.attr('id'));
                if (cacheObj.selected) {
                    var row = grid.find('tr[data-uid="' + cacheObj.selected + '"]');
                    if (row) {
                        row.addClass('k-state-selected');
                        multiDeleteCache.clearCache(grid.attr('id'));
                    }
                }
            }
        };

        // Menu methods
        function initializeMenu() {

            // Place the menu at the correct location
            var menu = $(name);
            menuYloc = parseInt(menu.css("top").substring(0, menu.css("top").indexOf("px")));
            $(window).scroll(function () {
                var offset = menuYloc + $(document).scrollTop() + "px";
                menu.animate({ top: offset }, { duration: 500, queue: false });
            });

            // Are any menu items selected?
            if (menu.find('a.idx-selected-section').length === 0) {
                menu.find('a:first').addClass('idx-selected-section');
            }

            menu.on("click", "a", onMenuItemClick);
        }

        $("#btnIndexationGeneralSave").on("click", function() {
            validationGeneral = true;
            generalSave = true;
            validationMessage = "";
            //expand Identification Tab
            var panelBarMain = $("#IndexationDetailPanel").data("kendoPanelBar");
            panelBarMain.select(panelBarMain.element.children("li").eq(0));
            var itemIdentification = panelBarMain.select();
            panelBarMain.expand(itemIdentification);

            //expand Physical
            panelBarMain.select(panelBarMain.element.children("li").eq(2));
            var itemPhysical = panelBarMain.select();
            panelBarMain.expand(itemPhysical);

            //expand Regulatory
            panelBarMain.select(panelBarMain.element.children("li").eq(4));
            var itemRegulatory = panelBarMain.select();
            panelBarMain.expand(itemRegulatory);

            //expand Fire Fighting
            panelBarMain.select(panelBarMain.element.children("li").eq(7));
            var itemFireFight = panelBarMain.select();
            panelBarMain.expand(itemFireFight);

            //Expand Regulatory American
            var panelBarRegulatory = $("#IndexationRegPanel").data("kendoPanelBar");
            panelBarRegulatory.select(panelBarRegulatory.element.children("li").eq(0));
            var itemAmerican = panelBarRegulatory.select();
            panelBarRegulatory.expand(itemAmerican);

            //Expand Regulatory GHS
            panelBarRegulatory.select(panelBarRegulatory.element.children("li").eq(3));
            var itemGHS = panelBarRegulatory.select();
            panelBarRegulatory.expand(itemGHS);


            $("#btnSaveIdentification").click();
            if (validationGeneral)
                $("#btnSavePhyChemProperties").click();
            if (validationGeneral)
                $("#btnSaveRegAmerican").click();
            if (validationGeneral)
                $("#btnSaveRegulatoryGhs").click();
            if (validationGeneral)
                $("#btnSaveFireFighting").click();

            //SaveGeneral();
            saveIndexationLevel();

            if (!validationGeneral)
                $(this).displayError(validationMessage + "" + "<br />Please navigate to the section(s) above to correct validation.");
            else
                $(this).savedSuccessFully("Indexation Saved");


        });

        function onMenuItemClick(e) {
            if (e.currentTarget.id !== "btnIndexationGeneralSave") {
                e.preventDefault();
                // Reset all CSS class references
                var self = $(this);
                self.addClass("idx-selected-section");
                self.parents('tr')
                    .find('a')
                    .not(self)
                    .removeClass("idx-selected-section");

                var menu = $(name);
                var section = $('#IndexationDetailPanel').find('.k-header[name="' + self.data('section') + '"]');
                if (section && menu) {
                    var yScrollTop = section[0].offsetTop - menu.height() - 15;
                    window.scrollTo(0, yScrollTop);
                }
            }
        }

      
        // Identification section methods
        function initializeIdentificationControls() {
            indexationDetailObj.on("click", "#btnSaveIdentification", function (e) {
                e.preventDefault();
                var validator = $("#FormIndexIdentification").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var form = $("#FormIndexIdentification");
                    var url = form.attr("action");
                    var formData = form.serialize();
                    $.post(url, formData, function () {
                        if (!generalSave)
                            $(this).savedSuccessFully("Identification Saved");
                        else
                            $(this).savedSuccessFully("Indexation Saved");

                        
                    });
                } else {
                    validationGeneral = false;
                    validationMessage = "Identification<br />";
                    return false;
                }
            });

            //See TRECOMPLI-2216 - change the cancel to close
            indexationDetailObj.on("click", "#btnDiscardIdentification", function (e) {
                e.preventDefault();                
                window.close();
            });

            indexationDetailObj.on("keypress", "#readOnlyRevisionTitle", function (e) {
                //alert(e.keyCode);
                if (e.keyCode === 35 || e.keyCode === 36 || e.keyCode === 37 || e.keyCode === 39) {
                    return;
                }
                else
                    e.preventDefault();                
            });

            

            indexationDetailObj.on("click", "#ancSynBatchDelete", function (e) {
                e.preventDefault();
                batchDeleteObjects('Gridsynonyms', 'synonyms', '../Indexation/BatchDeleteNameNumbers');
            });

            indexationDetailObj.on("click", "#ancProdNameBatchDelete", function(e) {
                e.preventDefault();
                batchDeleteObjects('GridClientProductName', 'product names', '../Indexation/BatchDeleteNameNumbers');
            });

            indexationDetailObj.on("click", "#ancOtherNumBatchDelete", function (e) {
                e.preventDefault();
                batchDeleteObjects('GridOtherNumber', 'other numbers', '../Indexation/BatchDeleteNameNumbers');
            });

        };


        var onAttachmentRequestEnd = function (e) {
            if (!e.response || e.response.length === 0) {
                $('#AvailableAttachments').prev('span').find('.k-input').text('No attachments are available to view.');
                $('#AvailableAttachments').data('kendoDropDownList').enable(false);
            }
        };

        // Ingredient section methods
        var ingredientMissing = "Select a valid ingredient to continue.";
        var ingredientSearching = "Searching for ingredient...";
        var ingredientFromRequired = "From value required.";
        var ingredientToRequired = "To value required.";

        function initializeIngredientControls() {

            // select - unselect behavior
            indexationDetailObj.on("click", "#IngredientOtherNames", function (e) {

            });

            indexationDetailObj.on("click", "#AddIngredient", function (e) {
                e.preventDefault();

                // unselect the grid 
                $("#GridIngredients").data("kendoGrid").clearSelection();

                // this window may not have been created yet.

                try {

                    if ($("#SearchIngredientWindow").length > 0) {
                        var window = $("#SearchIngredientWindow").data("kendoWindow");
                        window.destroy();
                    }
                }
                catch (e) { }

                var indexationId = $("#IndexationId").val();
                var url = GetEnvironmentLocation() + '/Operations/Indexation/AddIngredient';
                $.post(url, { indexationId: indexationId },
                    function (data) {
                        $('#EditIngredient').html(data);
                    });
            });

            indexationDetailObj.on("click", "#ancIngredientBatchDelete", function(e) {
                e.preventDefault();
                batchDeleteObjects("GridIngredients"
                    , "ingredients"
                    , GetEnvironmentLocation() + "/Operations/Indexation/BatchDeleteIngredients"
                    , null
                    , function () { $('#EditIngredient').empty(); });
            });

          
            indexationDetailObj.on("click", "#SearchByCAS, #SearchByIngredient", function (e) {
                e.preventDefault();
                var ingredientWindow = $('#SearchIngredientWindow');

                ingredientWindow.closest(".k-window").css({
                    top: 100,
                    left: 100
                });

                ingredientWindow.find("#CasNo").val("");
                ingredientWindow.find("#IngredientName").val("");
                ingredientWindow.find("#IngredientId").val("");
                ingredientWindow.find("#EinecsNo").val("");

                ingredientWindow.data("kendoWindow").center();
                ingredientWindow.data("kendoWindow").open();
            });

            indexationDetailObj.on("click", "#btnDiscardIngredient", function (e) {

                // determine if there have been updates ?
                confirmUserSelection("Confirm", "Message", function () { alert("funct 1"); }, function () { alert("funct 2"); });

                // clear out contents
                $('#EditIngredient').html("");

            });

            indexationDetailObj.on("click", "#btnSaveIngredient", function (e) {
                e.preventDefault();
                var validator = retrieveIngredientValidator();

                var registrationNumber = $('#ingredientForm').find('#RegistrationNumber').data("kendoMaskedTextBox");

                // validate registration
                if (!isRegistrationNumberValid(registrationNumber.value())) {
                    $(this).displayError("Registration Number invalid format");
                    return false;
                }

                if (validator.validate()) {
                    var form = $("#ingredientForm");
                    var url = form.attr("action");

                    var formdata = {};
                    formdata['overrideDuplicate'] = false;
                    $.each(form.serializeArray(), function () {
                        formdata[this.name] = this.value;
                    });

                    // default 
                    formdata["Ingredient_NameId"] = formdata["IngredientsUsualNameId"];

                    var otherNames = formdata["IngredientOtherNames"];

                    if (otherNames != null && otherNames > 0) {

                        formdata["IngredientOtherNames"] = [{
                            IngredientNameId: otherNames,
                            IngredientNameText:"",
                            IngredientTypeId:2
                        }];

                        // over ride
                        formdata["Ingredient_NameId"] = otherNames;
                    }
//                    var isAdding = (formdata["MappingId"] == 0);  // check for selected item instead of insert mode.

                    var grid = $("#GridIngredients").data("kendoGrid");
                    var selectedItem = grid.dataItem(grid.select());
                    var gridData = grid.dataSource.data();

                    for (var i = 0; i < gridData.length; i++) {
                        if (selectedItem != gridData[i] && formdata["IngredientId"] == gridData[i].IngredientId)
                        {
                            if (gridData[i].CasNumber != null) 
                                $(this).displayError("Ingredient '" + gridData[i].CasNumber.trim() + "' has already been added!");
                            else
                                $(this).displayError("Ingredient '" + gridData[i].IngredientsUsualName + "' has already been added!");
                            return true;
                        }
                    }

                    $.post(url, formdata, function (data) {

                        if (data.result == "success") {

                            $(this).savedSuccessFully(data.message);
                            $('#EditIngredient').empty();
                            if ($("#SearchIngredientWindow").length > 0) {
                                var window = $("#SearchIngredientWindow").data("kendoWindow");
                                window.destroy();
                            }

                            grid.dataSource.read();
                            return true;

                        } else {

                            $(this).displayError(data.message);
                            $('#EditIngredient').empty();
                            return false;

                            if ($("#SearchIngredientWindow").length > 0) {
                                var window = $("#SearchIngredientWindow").data("kendoWindow");
                                window.destroy();
                            }
                            
                        }
                    });
                } else {
                    return false;
                }
            });

            indexationDetailObj.on("keyup", "#CasNumber", function (e) {

                var code = (e.keyCode ? e.keyCode : e.which);

                // search on enter
                if (code == 13) { //Search only on enter

                    // url for data
                    var url = GetEnvironmentLocation() + '/Operations/Indexation/LookUpIngredientOnKeyEnter';

                    var ingCasNo = $("#CasNumber").val();
                    if (isValidInteger(ingCasNo)) {
                        var indexationId = $("#IndexationId").val();
                        if (ingCasNo !== '') {
                            $.ajax({
                                url: url,
                                data: { ingCasNo: ingCasNo, indexationId: indexationId },
                                type: "POST",
                                success: function(data) {
                                    if (data !== '') {
                                        onIngredientSelection(data);
                                    } else {
                                        $(this).displayError('No ingredient was found with the CAS of "' + ingCasNo + '"');
                                        $('#CasNumber').val("");
                                    }
                                }, 
                                error: function () {
                                    $(this).displayError('No ingredient was found with the CAS of "' + ingCasNo + '"');
                                    $('#CasNumber').val("");
                                }
                            });
                        }
                    } else
                        $(this).displayError('Use a valid CasNumber to search.');
                }
            });

            indexationDetailObj.on("keyup", "#IngredientsUsualName", function (e) {

                var code = (e.keyCode ? e.keyCode : e.which);

                // search on enter
                if (code == 13) { //Search only on enter

                    // url for data
                    var url = GetEnvironmentLocation() + '/Operations/Indexation/LookUpIngredientOnNameEnter';

                    var ingredientName = $("#IngredientsUsualName").val();
                    if (ingredientName != '') {
                        var indexationId = $("#IndexationId").val();
                        $.ajax({
                            url: url,
                            data: { ingredientName: ingredientName, indexationId: indexationId },
                            type: "POST",
                            success: function (data) {
                                if (data !== '') {
                                    onIngredientSelection(data);
                                } else {
                                    $(this).displayError('No unique ingredient was found with the Ingredient Name of "' + ingredientName + '"');
                                    $('#IngredientsUsualName').val("");
                                }
                            },
                            error: function () {
                                $(this).displayError('No unique ingredient was found with the Ingredient Name of "' + ingredientName + '"');
                                $('#IngredientsUsualName').val("");
                            }
                        });
                    } else
                        $(this).displayError('Use a valid ingredientName to search.');
                }
            });

            $(document).on("dblclick", "#gdIngredientsSearch table tr", function () {
                searchGridDoubleClick("#gdIngredientsSearch", "#btnSelectIngredient");
            });

            $(document).on("keyup", "#SearchIngredientWindow input", function(e) {
                if (e.keyCode === 13)
                    $('#btnSearchIngredient').click();
            });
        }

        function isRegistrationNumberValid(registrationNumber) {
            if (registrationNumber == "")
                return true;
            else {
                var pattern = new RegExp(/^[\d]{2}-[\d]{10}-[\d]{2}(-([xX]{4}|[\d]{4}))?$/);
                return pattern.test(registrationNumber);
            }
        }

        function initializeIngredientCreationControls(editorWindow) {

            // exit on no placeholder
            if (!editorWindow) return false;

            // editor form
            var editorForm = editorWindow.find("#ingredientForm");
            if (editorForm) {

                // Modify existing layout
                var container = editorForm.find('.form-horizontal');
                if (container) {
                    container.css({ height: '', margin: '35px' });
                    container.find('.controls input[style*="width"], span[style*="width"]').each(function () {
                        $(this).css('width', '');
                    });

                    var row = container.find(".row-fluid:first");
                    if (row) container.append(row);

                    var btnSaveIngredient = editorForm.find("#btnSaveIngredient");
                    btnSaveIngredient.unbind().click(function (e) {

                        e.preventDefault();

                        var url = editorForm.attr("action");
                        var formdata = {};
                        formdata['overrideDuplicate'] = false;
                        $.each(editorForm.serializeArray(), function () {
                            formdata[this.name] = this.value;
                        });

                        // usual names
                        formdata["UsualNames"] = [{
                            "Ingredient_NameTypeLkpId": 11,
                            "ChemicalName": $("#UsualNames").val()
                        }];

                        // form data valid ?
                        var validator = editorForm.kendoValidator().data("kendoValidator");
                        if (validator.validate()) {
                            $.post(url, formdata, function (data) {
                                if (data.Success) {

                                    // display message
                                    $(this).savedSuccessFully(data.Message);

                                    var formdata =[];
                                    formdata["ingredientId"] = data.IngredientId;
                                    
                                    $.post("../Ingredient/GetIngredient?ingredientId=" + data.IngredientId,
                                        formdata,
                                        function (response) {

                                            // remove previous form and any event handlers
                                            var ingredientForm = $('#ingredientEditorWindow').find("#ingredientForm");
                                            if (ingredientForm != null) ingredientForm.remove();

                                            // load contents
                                            $('#ingredientEditorContents').html(response);

                                            // enable display of controls
                                            $('#btnSelectIngredientDirect').css("visibility", "");

                                            $("#btnSelectIngredientDirect").unbind().click(function (e)
                                            {
                                                onIngredientSelectionDirect(e)
                                            });

                                            $("#btnDeleteIngredient").unbind().click(function (e) {
                                                onIngredientSelectionDelete(e)
                                            });
                                                                                        
                                    });

                                    return true;

                                } else {


                                    $(this).displayError(data.Message);
                                    return false;
                                }
                            });
                        }
                    });

                    var btnDiscardIngredient = editorForm.find("#btnDiscardIngredient");
                    btnDiscardIngredient.unbind().click(function (e) {
                        e.preventDefault();
                        editorWindow.data('kendoWindow').close();
                    });
                }
            }
        }

        function retrieveIngredientValidator() {

            ingredientValidator = $('#ingredientForm').kendoValidator({
                messages: {
                    fromvaluerequired: function (input) {
                        if (!input.val()) {
                            return ingredientFromRequired;
                        } else if (input.val() < input.data('valRangeMin') || input.val() > input.data('valRangeMax')) {
                            return input.data('valRange');
                        } else {
                            return input.data('valNumber');
                        }
                    },
                    tovaluerequired: function(input) {
                        if (!input.val())
                            return ingredientToRequired;
                        else
                            return input.data('valNumber');
                    },
                    //ingredientsearch: function () {
                    //    debugger;
                    //    var ingredientId = $('#ingredientForm').find('#IngredientId').val();
                    //    var cacheObj = ingredientCache.cache[ingredientId];
                    //    if (cacheObj.searching)
                    //        return ingredientSearching;
                    //    else
                    //        return cacheObj.valid ? '' : ingredientMissing;
                    //},
                    validnumber: function (input) {
                        return input.data('valNumber');
                    }
                },
                rules: {
                    fromvaluerequired: function (input) {
                        if (input.is('[id="OperatorFrom"]')) {
                            if (isValidDecimal(input.val()))
                                return input.val() >= input.data('valRangeMin') || input.val() <= input.data('valRangeMax');
                            else
                                return false;
                        }
                        return true;
                    },
                    tovaluerequired: function (input) {
                        if (input.is('[id="OperatorTo"]'))
                            return isValidDecimal(input.val());
                        return true;
                    }//,
                    //ingredientsearch: function (input) {
                    //    var validationUrl = input.data("valRemoteUrl");
                    //    if (typeof validationUrl !== 'undefined' && validationUrl) {

                    //        // Attempt to check if we have already checked this value
                    //        var ingredientId = $('#ingredientForm').find('#IngredientId').val();
                    //        var cacheObj = ingredientCache.cache[ingredientId] = ingredientCache.cache[ingredientId] || {};
                    //        cacheObj.searching = true;

                    //        var settings = {
                    //             ingredientId: ingredientId,
                    //             url: validationUrl
                    //        };

                    //        if (cacheObj.value === settings.ingredientId && cacheObj.valid)
                    //            return true;

                    //        if (cacheObj.value === settings.ingredientId && !cacheObj.valid) {
                    //            cacheObj.searching = false;
                    //            return false;
                    //        }

                    //        ingredientCache.check(input, settings);

                    //        // Automatically set to false to display searching ingredient
                    //        return false;
                    //    }
                    //    return true;
                    //},
                    //validnumber: function (input) {
                    //    if (input.is('[id="AuthorizationNumber"]') || input.is('[id="RegistrationNumber"]')) {
                    //        if (input.val())
                    //            return isValidInteger(input.val());
                    //    } 
                    //    return true;
                    //}
                }

            }).data("kendoValidator");

            return ingredientValidator;
        }

        var ingredientCache = {
            cache: {},
            check: function (input, settings) {
                var cacheObj = this.cache[settings.ingredientId] = this.cache[settings.ingredientId] || {};

                $.ajax({
                    url: settings.url,
                    dataType: 'json',
                    data: { ingredientsUsualName: input.val(), ingredientId: settings.ingredientId },
                    success: function (data) {
                        cacheObj.valid = data;
                        ingredientValidator.validateInput(input);
                    },
                    failure: function() {
                        cacheObj.valid = false;
                        ingredientValidator.validateInput(input);
                    },
                    complete: function() {
                        cacheObj.value = settings.ingredientId;
                    }
                });
            },
            addToCache: function(ingredientId) {
                var cacheObj = this.cache[ingredientId] = this.cache[ingredientId] || {};
                if (!cacheObj.valid) {
                    cacheObj.valid = true;
                    cacheObj.value = ingredientId;
                }
            }
        };

        var onIngredientSearchReady = function () {

            var searchwindow = $("#IndexationSearchWindow");

            searchwindow.on("click", "#btnSearchIngredient", function (e) {
                e.preventDefault();

                var grid = $("#gdIngredientsSearch").data("kendoGrid");

                grid.bind("dataBound", function ingredientBind() {
                    displayKendoPopup($('#SearchIngredientWindow'));
                    grid.unbind("dataBound", ingredientBind);

                    // if there are no rows in the dataset and we try to
                    // navigate to page(1), the grid will try read again

                    if (grid.dataSource.total() > 0) grid.dataSource.page(1);
                    //grid.dataSource.query({ page: 1, pageSize: 15 });

                });

                grid.dataSource.read();

            });

            searchwindow.on("click", "#btnSelectIngredient", function(e) {
                e.preventDefault();

                var grid = $("#gdIngredientsSearch").data("kendoGrid");
                if (grid.dataSource.total() === 0) {
                    $(this).displayError("No rows selected");
                    return;
                }

                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    $(this).displayError("No rows selected");
                    return;
                }

                var window = $("#SearchIngredientWindow").data("kendoWindow");
                window.close();

                var url = GetEnvironmentLocation() + '/Operations/Indexation/GetIndexationIngredient';
                var indexationId = $("#IndexationId").val();
                var data = { ingredientId: selectedData.IngredientId, indexationId: indexationId };
                $.post(url, data, onIngredientSelection);
            });

            searchwindow.on("click", "#btnCancelIngSearch", function(e) {
                e.preventDefault();
                $("#SearchIngredientWindow").data("kendoWindow").close();
            });

            searchwindow.on("click", "#btnClearIngSearch", function(e) {
                e.preventDefault();
                $('#IngredientId, #CasNo, #IngredientName, #EinecsNo').val("");
                $("#gdIngredientsSearch").data("kendoGrid").dataSource.data([]);
                $('#ingredientEditorWindow').data('kendoWindow').center();
            });

            searchwindow.on("click", "#btnAddNewIngredient", function (e) {
                e.preventDefault();

                var editorWindow = $('#ingredientEditorWindow');

                // remove previous form and any event handlers
                var ingredientForm = $('#ingredientEditorWindow').find("#ingredientForm");
                if (ingredientForm != null) ingredientForm.remove();

                var editorContents = editorWindow.find("#ingredientEditorContents");
                if (editorContents != null) editorContents.html("");

                /*

                var loadedContents = "";

                // may not have been loaded yet
                try { loadedContents = editorWindow.find("#ingredientEditorContents").html(); }
                catch (e) { }
                */
                var searchedIngridentName = $('#IngredientName').val();
                var searchedCasNumber = $('#CasNo').val();
                /*
                if (loadedContents.length != 0) {

                    //TRECOMPLI-2212
                    editorWindow.find("#CASNumber").val(searchedCasNumber);
                    editorWindow.find("#UsualNames").val(searchedIngridentName);   
                    editorWindow.data('kendoWindow').open();
                    editorWindow.data('kendoWindow').center();
                    return;
                }

                */

                // load window contents once only
                var url = GetEnvironmentLocation() + "/Operations/Ingredient/GetIngredient";
                var data = { ingredientId: 0 };
                
                if (editorWindow) {

                    // detatch all handlers
                    $("#ingredientEditorWindow").children().off();

                    $.ajax({
                        url: url,
                        data: data,
                        success: function(layout) {
                            editorWindow.find("#ingredientEditorContents").html(layout);
                            var e = editorWindow;
                        },
                        complete: function() {
                            initializeIngredientCreationControls(editorWindow);

                            var e = editorWindow;

                            editorWindow.data('kendoWindow').open();
                            editorWindow.data('kendoWindow').center();
                            editorWindow.find("#CASNumber").val(searchedCasNumber);
                            editorWindow.find("#UsualNames").val(searchedIngridentName);


                        }
                    });

                } else {
                    editorWindow.data('kendoWindow').close();
                    $(this).displayError('An error occurred adding a new ingredient');
                }
                    

            });
        };

        var onGridIngredientOrderChange = function (e) {
            e.preventDefault();
        };


        var onGridIngredientChange = function(e) {

            e.preventDefault();

            // triggered on un-selection also, careful !!
            var select = this.select();
            if (select.length == 0) return;

            var selectedData = this.dataItem(select);
            var url = GetEnvironmentLocation() + '/Operations/Indexation/GetIngredientDetail';
            if ($("#SearchIngredientWindow").length > 0) {
                var window = $("#SearchIngredientWindow").data("kendoWindow");
                window.destroy();
            }

            $.post(url, { MappingId: selectedData.MappingId },
                function(data) {
                    $('#EditIngredient').html(data);
                });
        };
        
        var onGridIngredientRemove = function(e) {
            if (e.type === "destroy") {
                $("#EditIngredient").html("");
            }
        };

        var onIngredientConcentrationChange = function(e) {
            var selectedValue = e.sender._selectedValue;
            if (selectedValue > 0)
                $("#SelectIngOperator").data("kendoDropDownList").enable(true);
            else {
                $("#SelectIngOperator").data("kendoDropDownList").select(0);
                $("#SelectIngOperator").data("kendoDropDownList").enable(false);

                removeValidationToolTips($("#SelectIngOperator"));
                operatorDropdownChange(selectedValue, "OperatorFrom", "OperatorTo");
            }
        };

        var onIngredientOperatorChange = function (e) {
            operatorDropdownChange(e.sender._selectedValue, "OperatorFrom", "OperatorTo");
        };

        var onIngredientSelection = function(response) {

            var ingredientForm = $('#ingredientForm');

            ingredientForm.find('#CasNumber')
                            .val(response.CasNumber)
                            .end()
                            .find('#IngredientsUsualName')
                            .val(response.IngredientsUsualName)
                            .end()
                            .find('#IngredientsUsualNameId')
                            .val(response.IngredientsUsualNameId)
                            .end()
                            .find('#IngredientId')
                            .val(response.IngredientId)
                            .end()
                            .find('#RegistrationNumber')
                            .val("")
                            .end()
                            .find('#AuthorizationNumber')
                            .val("")
                            .end()
                            .find('#OperatorTo')
                            .val("")
                            .end()
                            .find('#OperatorFrom')
                            .val("")
                            .end();

            var ddl = $('#IngredientOtherNames').data("kendoDropDownList");
            ddl.setDataSource(response.IngredientOtherNames);
            ddl.refresh();

            $('#SelectIngOperator').data("kendoDropDownList").select(0);
            $('#SelectConcentration').data("kendoDropDownList").select(0);

            // set edit link
            var editLink = $("#btnEditIngredient").attr("href");
            var cas = (response.CasNumber + "").replace(/ /g, "");
            if (response.CasNumber == null || cas == "")
                editLink = "..//Ingredient/IngredientsMain?un=" + encodeURIComponent(response.IngredientsUsualName);
            else
                editLink = "..//Ingredient/IngredientsMain?cas=" + response.CasNumber;

            $("#btnEditIngredient").attr("href", editLink);

            removeValidationToolTips('#IngredientsUsualName');

            // Add to the cache so the check does not need to happen
            ingredientCache.addToCache(response.IngredientId);

           // display the edit and refresh buttons
           // show on selection
           $("#btnRefreshIngredient").css("display", "");
           $("#btnEditIngredient").css("display", "");
           $("#btnEditIngredient").parent().css("display", "");

        };

        // Physical & Chemical Properties
        var physicalChemicalValidator = null;

        function initializePhysicalChemicalControls() {

            // Overall PhyChem section
            indexationDetailObj.on("click", "#btnSavePhyChemProperties", function (e) {
                e.preventDefault();
                initializePhysicalChemicalValidator();
                if(physicalChemicalValidator.validate()) {
                    var form = $("#FormPhyChemProperties");
                    var url = form.attr("action");
                    var formData = form.serialize();
                    $.post(url, formData, function (data) {
                        var errorMessage = parseErrorMessage(data);
                        if (errorMessage)
                            $(this).displayError(errorMessage);
                        else {
                            if (!generalSave)
                                $(this).savedSuccessFully('Physical & Chemical Properties Saved');
                            else
                                $(this).savedSuccessFully("Indexation Saved");
                        }
                    });
                    return true;
                } else {
                    validationGeneral = false;
                    validationMessage = validationMessage + "Physical & Chemical Properties<br />";
                    return false;
                }
            });

            indexationDetailObj.on("change", "[name=SelectCoeffDistrib]", function () {
                var selectedItem = $(this).val();
                if (selectedItem == 3)
                    $("#CoeffDistribEquals").prop("disabled", false);
                else
                    $("#CoeffDistribEquals").val("").prop("disabled", true);
            });

            indexationDetailObj.on("change", "#MiscibilityType", function () {
                var selectedValue = $(this).data("kendoDropDownList").value();
                var affectedFields = ["MiscibilityWeight", "MiscibilityVolume"];

                concentrationTypeDropdownChange(selectedValue, affectedFields, function (val) {
                    onConcentrationChangeCallback(val, 'Miscibility');
                });
            });

            indexationDetailObj.on("change", "#SolubilityWaterType", function () {
                var selectedValue = $(this).data("kendoDropDownList").value();
                var affectedFields = ["SolubilityWaterWeight", "SolubilityWaterVolume"];
                concentrationTypeDropdownChange(selectedValue, affectedFields, function(val) {
                    onConcentrationChangeCallback(val, 'SolubilityWater');
                });
            });

            indexationDetailObj.on("change", "#SolubilityOtherType", function () {
                var selectedValue = $(this).data("kendoDropDownList").value();
                var affectedFields = ["SolubilityOtherWeight", "SolubilityOtherVolume"];
                concentrationTypeDropdownChange(selectedValue, affectedFields, function (val) {
                    onConcentrationChangeCallback(val, 'SolubilityOther');
                });
            });
        }

        function initializePhysicalChemicalValidator() {

            physicalChemicalValidator = $('#FormPhyChemProperties').kendoValidator({
                messages: {
                    decimalvalidate: function (input) {
                        //return "Value must be numeric.";
                        return input.data('valNumber');
                    },
                    rangeValidation: function (input) {
                        return input.attr('data-val-range-message');
                    }
                },
                rules: {

                   

                    decimalvalidate: function (input) {
                        if (input.is('[class="val-decimal"]') && input.val()) {
                            return isValidDecimal(input.val());
                        }

                        return true;
                    },
                    rangeValidation: function (input) {
                        if (input.is('[class*="val-range-value"]') && input.val()) {
                            if (input.attr("data-val-range-min")) {
                                var userValue = parseInt(input.val());
                                var minValue = parseInt(input.attr("data-val-range-min"));
                                var maxValue = parseInt(input.attr("data-val-range-max"));
                                return (userValue >= minValue && userValue <= maxValue);
                            }

                            return true;
                        }

                        return true;
                    }
                }

            }).data('kendoValidator');

            return physicalChemicalValidator;
        }

        // temparature unit
        function boilingPointMoreNeeded(selectedValue) {
            if (!selectedValue || selectedValue == 7) {
                $('#SelectCfkrBoilingPoint').data("kendoDropDownList").select(0);
                $('#SelectCfkrBoilingPoint').data("kendoDropDownList").enable(false);
            } else
                $('#SelectCfkrBoilingPoint').data("kendoDropDownList").enable(true);
        }

        // temparature unit
        function volatilityMoreNeeded(selectedValue) {
            if (!selectedValue || selectedValue == 7) {
                $('#SelectFromToVolatility').data("kendoDropDownList").select(0);
                $('#SelectFromToVolatility').data("kendoDropDownList").enable(false);
            } else
                $('#SelectFromToVolatility').data("kendoDropDownList").enable(true);
        }

        function viscosity2MoreNeeded(selectedValue) {
            if (!selectedValue) {
                $("#SelectFromToViscosity").data("kendoDropDownList").select(0);
                $("#SelectFromToViscosity").data("kendoDropDownList").enable(false);
                $("#SelectAtViscosity").data("kendoDropDownList").select(0);
                $("#SelectAtViscosity").data("kendoDropDownList").enable(false);
                $("#AtViscosity").val("").prop("disabled", true);
            } else {
                $("#SelectFromToViscosity").data("kendoDropDownList").enable(true);
                $("#SelectAtViscosity").data("kendoDropDownList").enable(true);
                $("#AtViscosity").prop("disabled", false);

                if (selectedValue == 7) {
                    $("#SelectFromToViscosity").data("kendoDropDownList").select(0);
                    $("#SelectFromToViscosity").data("kendoDropDownList").enable(false);
                }
            }
        }

        function vocOperatorMoreNeeded(selectedValue) {
            if (!selectedValue || selectedValue == 7) {
                $('#SelectMuType').data("kendoDropDownList").select(0);
                $('#SelectMuType').data("kendoDropDownList").enable(false);
                $("#SelectWeightMu").data("kendoDropDownList").select(0);
                $("#SelectWeightMu").data("kendoDropDownList").enable(false);
                $("#SelectVolumeMu").data("kendoDropDownList").select(0);
                $("#SelectVolumeMu").data("kendoDropDownList").enable(false);
            } else
                $('#SelectMuType').data("kendoDropDownList").enable(true);
        }

        function onConcentrationChangeCallback(concentrationValue, valueField) {
            
            var textField = $('#' + valueField);
            if (concentrationValue != 0) {
                var minValue = 0;
                var maxValue = (concentrationValue == 4 || concentrationValue == 5) ? 999 : 100;
                var errorMessage = 'The numeric value must be between ' + minValue + ' and ' + maxValue;

                textField.attr({
                    'data-val-range-message': errorMessage,
                    'data-val-range-min': minValue,
                    'data-val-range-max': maxValue
                });

                initializePhysicalChemicalValidator();
                physicalChemicalValidator.validate(textField);

            } else {
                textField.removeAttr('data-val-range-message data-val-range-max data-val-range-min');
                textField.val("");
                var validationTooltip = textField.siblings('.k-tooltip-validation');
                if (validationTooltip) {
                    validationTooltip.hide();
                }
            }

        }

        var onBoilingPointOperatorChange = function (e) {
            operatorDropdownChange(e.sender._selectedValue, "FromBoilingPoint", "ToBoilingPoint", boilingPointMoreNeeded);
        };

        var onGravityOperatorChange = function (e) {
            operatorDropdownChange(e.sender._selectedValue, "FromSpecificGravity", "ToSpecificGravity");
        };

        // VISCOSITY-LOGIC

        var onViscosity1Change = function(e) {

            var selectedValue = e.sender._selectedValue;
           
            // "value"
            if (selectedValue == 1)
                $("#SelectViscosity2").data("kendoDropDownList").enable(true);
            else {
                $("#SelectViscosity2").data("kendoDropDownList").select(0);
                $("#SelectViscosity2").data("kendoDropDownList").enable(false);
                $("#SelectFromToViscosity").data("kendoDropDownList").select(0);
                $("#SelectFromToViscosity").data("kendoDropDownList").enable(false);
                $("#SelectAtViscosity").data("kendoDropDownList").select(0);
                $("#SelectAtViscosity").data("kendoDropDownList").enable(false);

                $("#FromViscosity, #ToViscosity, #AtViscosity").val("").prop("disabled", true);
            }
        };

        var onViscosity2Change = function(e) {
            operatorDropdownChange(e.sender._selectedValue, "FromViscosity", "ToViscosity", viscosity2MoreNeeded);
        };

        var onVocCodeChange = function (e) {
            var selectedValue = e.sender._selectedValue;

            
            if (selectedValue != 1) {
                $("#SelectOperator").data("kendoDropDownList").select(0);
                $("#SelectOperator").data("kendoDropDownList").enable(false);
                $("#SelectParticularity").data("kendoDropDownList").select(0);
                $("#SelectParticularity").data("kendoDropDownList").enable(false);
                $("#Warning").prop("disabled", true).prop("checked", false);

                removeValidationToolTips($('#SelectOperator'));
                removeValidationToolTips($('#SelectMuType'));
                removeValidationToolTips($('#SelectParticularity'));
                operatorDropdownChange("", "FromVoc", "ToVoc", vocOperatorMoreNeeded);

            } else {
                $("#SelectOperator").data("kendoDropDownList").enable(true);
                $("#SelectParticularity").data("kendoDropDownList").enable(true);
                $("#Warning").prop("disabled", false);
            }
        };

        var onVocOperatorChange = function(e) {
            operatorDropdownChange(e.sender._selectedValue, "FromVoc", "ToVoc", vocOperatorMoreNeeded);
        };

        var onVocWeightMuChange = function (e) {

            var selectedValue = e.sender._selectedValue;

            // enable by default
            $("#SelectParticularity").data("kendoDropDownList").enable(true);
            $("#Warning").prop("disabled", false).prop("checked", false);
            $("#SelectVolumeMu").data("kendoDropDownList").enable(true);

            // ppb, ppm, ppt
            if (selectedValue >= 26 && selectedValue <= 29) {
                $("#SelectParticularity").data("kendoDropDownList").enable(false);
                $("#Warning").prop("disabled", true).prop("checked", false);
                $("#SelectVolumeMu").data("kendoDropDownList").enable(false);
            }

        }

        var onVocVolumeMuChange = function (e) {

            var selectedValue = e.sender._selectedValue;

            // default to disabled
            $("#SelectParticularity").data("kendoDropDownList").enable(true);
            $("#Warning").prop("disabled", false).prop("checked", false);
            $("#SelectWeightMu").data("kendoDropDownList").enable(true);

            // %, %v, %w
            if (selectedValue >= 33 && selectedValue <= 35) {
                $("#SelectParticularity").data("kendoDropDownList").enable(false);
                $("#Warning").prop("disabled", true).prop("checked", false);
                $("#SelectWeightMu").data("kendoDropDownList").enable(false);
            }
            
        }

        var onVocMuTypeChange = function (e) {

            var selectedValue = e.sender._selectedValue;

            // disable always
            $("#SelectParticularity").data("kendoDropDownList").enable(false);
            $("#Warning").prop("disabled", true);

            if (selectedValue == 4) {

                // weight by volume
                $("#SelectWeightMu").data("kendoDropDownList").enable(true);
                $("#SelectVolumeMu").data("kendoDropDownList").enable(true);

                $("#SelectParticularity").data("kendoDropDownList").enable(true);
                $("#Warning").prop("disabled", false);

            } else {
                $("#SelectWeightMu").data("kendoDropDownList").select(0);
                $("#SelectWeightMu").data("kendoDropDownList").enable(false);
                $("#SelectVolumeMu").data("kendoDropDownList").select(0);
                $("#SelectVolumeMu").data("kendoDropDownList").enable(false);

                removeValidationToolTips($('#SelectWeightMu'));
                removeValidationToolTips($('#SelectVolumeMu'));
            }
        };

        var onVolatilityChange = function (e) {
            debugger;
            operatorDropdownChange(e.sender._selectedValue, "FromVolatility", "ToVolatility", volatilityMoreNeeded);
        };

        var onPhysChemPropertiesPartialReady = function (settings) {
            onConcentrationChangeCallback(settings.miscibilitytype, 'Miscibility');
            onConcentrationChangeCallback(settings.solubilitywatertype, 'SolubilityWater');
            onConcentrationChangeCallback(settings.solubilityothertype, 'SolubilityOther');
        };

        // Transport section methods
        function initializeTransportControls() {

            indexationDetailObj.on("click", "#btnAddTransportMode", function (e) {
                e.preventDefault();

                var indexationObj = getIndexationId();
                var url = '../Indexation/EditTransportMode';
                $.post(url, { indexationId: indexationObj.IndexationId, indexationTransportModeId: 0 },
                    function (data) {
                        $('#AddEditTransportMode').html(data).show();
                    });
            });

            indexationDetailObj.on("click", "#ancTransportModeBatchDelete", function (e) {
                e.preventDefault();

                batchDeleteObjects("GridTransportMode"
                    , "transport modes"
                    , GetEnvironmentLocation() + "/Operations/Indexation/BatchDeleteTransportModes"
                    , null
                    , function () { hideEditorSection("AddEditTransportMode"); });
            });

            indexationDetailObj.on("click", "#btnSaveTransportMode", function (e) {
                e.preventDefault();
                var form = $("#FormEditTransportMode");
                if (form.valid()) {
                    var url = form.attr("action");
                    var formData = form.serialize();
                    $.post(url, formData, function (data) {
                        if (data && data.Errors)
                            $(this).displayError(parseErrorMessage(data));
                        else {
                            $(this).savedSuccessFully('Transport Model Saved');
                            hideEditorSection('AddEditTransportMode');

                            var grid = $('#GridTransportMode').data("kendoGrid");
                            grid.dataSource.read();
                        }
                        return true;
                    });
                } else
                    return false;
            });

            indexationDetailObj.on("click", "#btnDiscardTransportMode", function (e) {
                e.preventDefault();
                hideEditorSection('AddEditTransportMode');
            });
        }

        var onGridTransportModeChange = function () {
            var selectedrows = this.select();
            if (selectedrows && selectedrows.length > 0) {

                var indexationObj = getIndexationId();
                var transClass = this.dataSource.getByUid($(selectedrows[0]).data("uid"));
                if (transClass) {
                    var ajaxdata = { indexationId: indexationObj.IndexationId, indexationTransportModeId: transClass.IndexationTransportModeId };
                    var url = GetEnvironmentLocation() + '/Operations/Indexation/EditTransportMode';

                    $.ajax({
                        type: "POST",
                        url: url,
                        data: ajaxdata,
                        success: function(data) {
                            $('#AddEditTransportMode').html(data).show();
                        },
                        error: function() {
                            $(this).displayError('An error occurred retrieving transport classification information');
                        }
                    });
                } else
                    hideEditorSection('AddEditTransportMode');
            } else
                hideEditorSection('AddEditTransportMode');
        };

        var onGridTransportModeRequestComplete = function(e) {
            if(e.type === "destroy")
                hideEditorSection('AddEditTransportMode');
        };

       
        // American regulatory section methods
        function initializeAmericanControls() {
            indexationDetailObj.on("click", "#btnSaveRegAmerican", function (e) {
                e.preventDefault();
                var form = $("#FormRegAmerican");
                if (form.valid()) {
                    var url = form.attr("action");
                    var formData = form.serialize();
                    $.post(url, formData, function () {
                        if (!generalSave)
                            $(this).savedSuccessFully("Regulatory American Saved");
                        else
                            $(this).savedSuccessFully("Indexation Saved");
                    });
                    return true;
                } else {
                    validationGeneral = false;
                    validationMessage = "Regulatory American<br />";
                    return false;
                }
            });

            indexationDetailObj.on("click", "#btnAddAmericanClass", function (e) {
                e.preventDefault();
                if ($("#popupAmericanClassSearch").length > 0) {
                    var grid = $("#GridSearchAmericanClass").data("kendoGrid");
                    grid.dataSource.read();
                }
                $("#popupAmericanClassSearch").modal("show");
            });

            indexationDetailObj.on("click", "#ancOshaBatchDelete", function(e) {
                e.preventDefault();
                batchDeleteIndexationObjects("GridRegAmerican", "OSHA classification", "../Indexation/BatchDeleteAmericanClassification");
            });

            indexationDetailObj.on("click", "#btnSelectAmericanClass", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchAmericanClass").data("kendoGrid");
                if (grid.dataSource.total() === 0) {
                    $(this).displayError("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    $(this).displayError("No rows selected");
                    return;
                }
                if (grid.select().length > 1) {
                    var rows = grid.select();
                    var americaclasslists = [];
                    rows.each(
                        function (index, row) {
                            var selectedItem = grid.dataItem(row);
                            americaclasslists.push(selectedItem.Reference);
                        }
                    );
                    addAmericaClassificationList(americaclasslists);
                    return;
                }
                addAmericaClassification(selectedData.Reference);
            });

            indexationDetailObj.on("dblclick", "#GridSearchAmericanClass table tr", function () {
                searchGridDoubleClick("#GridSearchAmericanClass", "#btnSelectAmericanClass");
            });
        }

        function addAmericaClassification(reference) {
            var url = GetEnvironmentLocation() + '/Operations/Indexation/AmericanClass_Create';
            var indexationId = $("#IndexationId").val();
            $.post(url, { iReference: reference, indexationId: indexationId },
                function (data) {
                    $("#popupAmericanClassSearch").modal("hide");
                    $(this).savedSuccessFully(data);
                    var americanClassGrid = $("#GridRegAmerican").data("kendoGrid");
                    americanClassGrid.dataSource.read();
                });
        }

        function addAmericaClassificationList(americaclasslists) {
            var urlmultiple = GetEnvironmentLocation() + '/Operations/Indexation/AmericanClass_CreateList';
            var indexationId = $("#IndexationId").val();
            $.post(urlmultiple, { classificationList: JSON.stringify(americaclasslists), indexationId: indexationId },
                function (data) {
                    $("#popupAmericanClassSearch").modal("hide");
                    $(this).savedSuccessFully(data);
                    var americanClassGrid = $("#GridRegAmerican").data("kendoGrid");
                    americanClassGrid.dataSource.read();
                });
        }

        var getSelectedPpe = function () {
            var selectedPpe = 0;
            var dropdownlist = $('#SelectHmisppe').data("kendoDropDownList");
            if (dropdownlist)
                selectedPpe = dropdownlist.select();
            return { selectedPpe: selectedPpe };
        };

        var onHmisPpeChange = function(e) {
            var hmisPictogramGrid = $("#GridHMISPictograms").data("kendoGrid");
            hmisPictogramGrid.dataSource.read();

            var referenceDdl = $('#PpeHmisReference').data("kendoDropDownList");
            if (referenceDdl) {
                referenceDdl.select(e.sender.selectedIndex);
                onPpeHmisChange();
            }
        };

        // Canadian regulatory section methods
        function initializeCanadianControls() {

            indexationDetailObj.on("click", "#btnAddCanadaClass", function (e) {
                e.preventDefault();
                if ($("#popupCanadaClassSearch").length > 0) {
                    var grid = $("#GridSearchCanadaClass").data("kendoGrid");
                    grid.dataSource.read();
                }
                $("#popupCanadaClassSearch").modal("show");
            });

            indexationDetailObj.on("click", "#ancCanadaClassBatchDelete", function(e) {
                e.preventDefault();
                batchDeleteIndexationObjects("GridRegCanadian", "Canadian classification", GetEnvironmentLocation() + "/Operations/Indexation/BatchDeleteCanadianClassification");
            });

            indexationDetailObj.on("click", "#btnSelectCanadaClass", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchCanadaClass").data("kendoGrid");
                if (grid.dataSource.total() === 0) {
                    $(this).displayError("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    $(this).displayError("No rows selected");
                    return;
                }
                if (grid.select().length > 1) {
                    var rows = grid.select();
                    var canadaclasslists = [];
                    rows.each(
                        function (index, row) {
                            var selectedItem = grid.dataItem(row);
                            canadaclasslists.push(selectedItem.WhmisClassificationID);
                        }
                    );
                   
                    addCanadaClassificationList(canadaclasslists);
                    return;
                }
                addCanadaClassification(selectedData.WhmisClassificationID);
            });

            indexationDetailObj.on("dblclick", "#GridSearchCanadaClass table tr", function () {
                searchGridDoubleClick("#GridSearchCanadaClass", "#btnSelectCanadaClass");
            });
        }

        function addCanadaClassification(whmisClassificationID) {
            var url = GetEnvironmentLocation() + '/Operations/Indexation/RegCanadian_Create';
            var indexationId = $("#IndexationId").val();
            $.post(url, { iReference: whmisClassificationID, indexationId: indexationId },
                function (data) {
                    $("#popupCanadaClassSearch").modal("hide");
                    $(this).savedSuccessFully(data);
                    var canadaClassGrid = $("#GridRegCanadian").data("kendoGrid");
                    canadaClassGrid.dataSource.read();
                });
        }

        function addCanadaClassificationList(canadaclasslists) {
            var urlmultiple = GetEnvironmentLocation()  + '/Operations/Indexation/RegCanadian_CreateList';
            var indexationId = $("#IndexationId").val();
            $.post(urlmultiple, { classificationList: JSON.stringify(canadaclasslists), indexationId: indexationId },
                function (data) {
                    $("#popupCanadaClassSearch").modal("hide");
                    $(this).savedSuccessFully(data);
                    var canadaClassGrid = $("#GridRegCanadian").data("kendoGrid");
                    canadaClassGrid.dataSource.read();
                });
        }

        // European regulatory section methods
        function initializeEuropeanControls() {

            indexationDetailObj.on("click", "#btnAddEuropeRSPhrase", function (e) {
                e.preventDefault();

                if ($("#popupRSPhraseSearch").length > 0) {
                    //clearRsPhraseSearchFields(false);
                }
                $("#popupRSPhraseSearch").modal("show");
            });

            indexationDetailObj.on("click", "#ancReachUsesBatchDelete", function(e) {
                e.preventDefault();
                batchDeleteObjects("GridReachUse", "reach uses", GetEnvironmentLocation() + "/Operations/Indexation/BatchDeleteReachUses");
            });

            indexationDetailObj.on("click", "#btnSelectRSPhrase", function (e) {

                e.preventDefault();
                var grid = $("#GridSearchRSPhrase").data("kendoGrid");
                if (grid.dataSource.total() === 0) {
                    $(this).displayError("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    $(this).displayError("No rows selected");
                    return;
                }
                if (grid.select().length > 1) {
                    var rows = grid.select();
                    var rsphraselists = [];
                    rows.each(
                        function (index, row) {
                            var selectedItem = grid.dataItem(row);
                            rsphraselists.push(selectedItem.Reference);
                        }
                    );

                    console.log(rsphraselists);
                    addRsPhraseList(rsphraselists);

                    return;
                }

                addRsPhrase(selectedData.Reference);

            });

            indexationDetailObj.on("click", "#ancRSPhraseBatchDelete", function (e) {
                e.preventDefault();
                batchDeleteIndexationObjects("GridRegEuropeRSPhrase", "risk and safety phrases", GetEnvironmentLocation() + "/Operations/Indexation/BatchDeleteRsPhrases"
                    , function () {
                        var europeClassGrid = $("#GridRegEuropeClassification").data("kendoGrid");
                        europeClassGrid.dataSource.read();
                    });
            });

            indexationDetailObj.on("dblclick", "#GridSearchRSPhrase table tr", function () {
                searchGridDoubleClick("#GridSearchRSPhrase", "#btnSelectRSPhrase");
            });
        }

        function addRsPhrase(reference) {
            var url = GetEnvironmentLocation() + '/Operations/Indexation/RSPhrase_Create';
            var indexationId = $("#IndexationId").val();
            $.post(url, { iReference: reference, indexationId: indexationId },
                function (data) {
                    $("#popupRSPhraseSearch").modal("hide");
                    $(this).savedSuccessFully(data);
                    var rsPhraseGrid = $("#GridRegEuropeRSPhrase").data("kendoGrid");
                    var europeClassGrid = $("#GridRegEuropeClassification").data("kendoGrid");
                    rsPhraseGrid.dataSource.read();
                    europeClassGrid.dataSource.read();
                });
        }

        function addRsPhraseList(rsphraselists) {
            var urlmultiple = GetEnvironmentLocation() + '/Operations/Indexation/RSPhrase_CreateList';
            var indexationId = $("#IndexationId").val();
            $.post(urlmultiple, { rsPhraseList: JSON.stringify(rsphraselists), indexationId: indexationId },
                function (data) {
                    $("#popupRSPhraseSearch").modal("hide");
                    $(this).savedSuccessFully(data);
                    var rsPhraseGrid = $("#GridRegEuropeRSPhrase").data("kendoGrid");
                    var europeClassGrid = $("#GridRegEuropeClassification").data("kendoGrid");
                    rsPhraseGrid.dataSource.read();
                    europeClassGrid.dataSource.read();
                });
        }

        function clearRsPhraseSearchFields(clearGrid) {
            var popup = $('#popupRSPhraseSearch');
            popup.find('#rSCategoryType').data("kendoDropDownList").select(0);
            popup.find('#rSPhraseType').data("kendoDropDownList").select(0);
            popup.find('#txtRSPhraseSearch').val('');

            var grid = popup.find('#GridSearchRSPhrase');
            if (grid) {
                var datasource = grid.data('kendoGrid').dataSource;
                if (clearGrid === true)
                    datasource.data([]);
                else {
                    datasource.data([]);
                    datasource.read();
                    datasource.page(1);
                }
            }
        }

        var onRegEuropePartialReady = function() {

            var popup = $('#popupRSPhraseSearch');
            popup.modal({
                keyboard: false,
                show: false,
                backdrop: true
            });

            popup.on('click', '#searchRSPhrases', function(e) {
                e.preventDefault();

                var grid = popup.find('#GridSearchRSPhrase');
                if (grid) {
                    var datasource = grid.data('kendoGrid').dataSource;
                    datasource.read();
                    datasource.page(1);
                }
            });

            popup.on('click', '#clearRSPhrases', function (e) {
                e.preventDefault();
                //clearRsPhraseSearchFields(true);
            });

            popup.on('keyup', '#txtRSPhraseSearch', function (e) {
                onKeyPressEnter(e, function() {
                    popup.find("#searchRSPhrases").click();
                });
            });
            
            $.post(GetEnvironmentLocation() + '/Operations/Indexation/GetSearchRsPhrase', function (data) {
                $("#dgRSPhrasePlugIn").html(data);
            });
        };

        var getRsPhraseSearchCriteria = function () {
            var criteria = {};
            var indexationId = getIndexationId();
            criteria["indexationId"] = indexationId.IndexationId;

            var popup = $('#popupRSPhraseSearch');
            var category = popup.find('#rSCategoryType').data("kendoDropDownList");
            criteria["categoryType"] = (category) ? category.value() : "";

            var phrase = popup.find('#rSPhraseType').data("kendoDropDownList");
            criteria["phraseType"] = (phrase) ? phrase.value() : "";
            criteria["searchText"] = popup.find('#txtRSPhraseSearch').val();

            return criteria;
        }

        // GHS regulatory section methods
        var ghsHazardClassValidator = null;
        var ghsHazardStatementValidator = null;
        var ghsPrecautionaryStatementValidator = null;

        function initializeGhsControls() {

            indexationDetailObj.on("click", "#btnSaveRegulatoryGhs", function (e) {
                e.preventDefault();

                if ($("#SWOtherBit").is(":checked") && $("#SWOther").val() === "") {
                    $(this).displayError("Other field cannot be empty if Other checkbox is checked.");
                    return false;
                }

                var validator = $("#FormRegulatoryGHS").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var form = $("#FormRegulatoryGHS");
                    var url = form.attr("action");
                    var formData = form.serialize();
                    $.post(url, formData, function () {
                        if (!generalSave)
                            $(this).savedSuccessFully("Regulatory GHS Saved");
                        else
                            $(this).savedSuccessFully("Indexation Saved");
                    });
                    return true;

                } else {
                    validationGeneral = false;
                    validationMessage = "GHS<br />";
                    return false;
                }
            });

            indexationDetailObj.on("click", "#btnAddHazardClass", onAddHazardClassButtonClick);

            indexationDetailObj.on("click", "#ancHazardClassBatchDelete", function (e) {
        
                e.preventDefault();
                batchDeleteIndexationObjects("GridHazardClass"
                    , "hazard classes"
                    , GetEnvironmentLocation() + "/Indexation/BatchDeleteHazardClasses"
                    , function () { hideEditorSection("AddEditHazardClass"); });
            });

            indexationDetailObj.on("change", "#HClassNotProvided", function () {
                var url = GetEnvironmentLocation() + '/Operations/Indexation/SaveHClassNotProvided';
                var indexationId = $("#IndexationId").val();
                if ($(this).is(":checked")) {
                    $('#AddEditHazardClass').empty();
                    $.post(url, { hClassNotProvided: true, indexationId: indexationId },
                        function (data) {
                            $(this).savedSuccessFully(data);
                            var hClassGrid = $("#GridHazardClass").data("kendoGrid");
                            hClassGrid.dataSource.read();
                            $("#btnAddHazardClass, #ancHazardClassBatchDelete").addClass("k-state-disabled");
                            indexationDetailObj.off("click", "#btnAddHazardClass", onAddHazardClassButtonClick);
                        });
                } else {
                    $.post(url, { hClassNotProvided: false, indexationId: indexationId },
                        function (data) {
                            $(this).savedSuccessFully(data);
                            $("#btnAddHazardClass, #ancHazardClassBatchDelete").removeClass("k-state-disabled");
                            indexationDetailObj.on("click", "#btnAddHazardClass", onAddHazardClassButtonClick);
                        });
                }
            });

            indexationDetailObj.on("click", "#SearchByCode", function (e) {
                e.preventDefault();
                $("#popupHazardClass").modal("show");
            });

            indexationDetailObj.on("click", "#btnEnableOtherHClass", function (e) {
                e.preventDefault();
                $("#Class").val("");
                $("#ClassPhraseId").val("");
                $("#OtherClass").prop("disabled", false);

                if (ghsHazardClassValidator) {
                    ghsHazardClassValidator.validateInput($('#Class'));
                    ghsHazardClassValidator.validateInput($('#OtherClass'));
                }
            });

            indexationDetailObj.on("click", "#btnSelectHazardClass", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchHazardClass").data("kendoGrid");
                if (grid.dataSource.total() === 0) {
                    $(this).displayError("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    $(this).displayError("No rows selected");
                    return;
                }
                $("#popupHazardClass").modal("hide");

                $("#OtherClass").val("");
                $("#OtherClass").prop("disabled", true);
               
                $("#Class").val(selectedData.Description);
                $("#ClassPhraseId").val(selectedData.Reference);

                if (ghsHazardClassValidator) {
                    ghsHazardClassValidator.validateInput($('#Class'));
                    ghsHazardClassValidator.validateInput($('#OtherClass'));
                }
            });

            indexationDetailObj.on("dblclick", "#GridSearchHazardClass table tr", function () {
                searchGridDoubleClick("#GridSearchHazardClass", "#btnSelectHazardClass");
            });

            indexationDetailObj.on("click", "#SearchByCategory", function (e) {
                e.preventDefault();
                $("#popupHazardCategory").modal("show");
            });

            indexationDetailObj.on("click", "#btnEnableOtherHCategory", function (e) {
                e.preventDefault();
                $("#Category").val("");
                $("#CategoryPhraseId").val("");
                $("#OtherCategory").prop("disabled", false);

                if (ghsHazardClassValidator) {
                    ghsHazardClassValidator.validateInput($('#Category'));
                    ghsHazardClassValidator.validateInput($('#OtherCategory'));
                }
            });

            indexationDetailObj.on("click", "#btnSelectHazardCategory", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchHazardCategory").data("kendoGrid");
                if (grid.dataSource.total() === 0) {
                    $(this).displayError("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    $(this).displayError("No rows selected");
                    return;
                }
                $("#popupHazardCategory").modal("hide");

                $("#OtherCategory").val("");
                $("#OtherCategory").prop("disabled", true);

                $("#Category").val(selectedData.Description);
                $("#CategoryPhraseId").val(selectedData.Reference);

                if (ghsHazardClassValidator) {
                    ghsHazardClassValidator.validateInput($('#Category'));
                    ghsHazardClassValidator.validateInput($('#OtherCategory'));
                }
            });

            indexationDetailObj.on("dblclick", "#GridSearchHazardCategory table tr", function () {
                searchGridDoubleClick("#GridSearchHazardCategory", "#btnSelectHazardCategory");
            });

            indexationDetailObj.on("click", "#btnSaveHazardClass", function (e) {
                e.preventDefault();
                initializeGhsHazardClassValidator();
                if (ghsHazardClassValidator.validate()) {
                    var form = $("#FormEditHazardClass");
                    var url = form.attr("action");
                    var formData = form.serialize();
                    $.post(url, formData, function (data) {
                        if (data.result === "success") {
                            $(this).savedSuccessFully(data.message);
                            $('#AddEditHazardClass').empty();
                            var grid = $("#GridHazardClass").data("kendoGrid");
                            grid.dataSource.read();
                        } else {
                            if (data.popupMessage)
                                $(this).displayError(data.popupMessage);
                        }
                    });
                    return true;
                } else
                    return false;
            });

            indexationDetailObj.on("click", "#btnDiscardHazardClass", function (e) {
                e.preventDefault();
                $('#AddEditHazardClass').empty();
            });

            indexationDetailObj.on("click", "#btnAddGhsPictograms", onAddGhsPictogramsButtonClick);

            indexationDetailObj.on("click", "#ancGhsPictogramBatchDelete", function(e) {
                e.preventDefault();
                batchDeleteObjects("GridRegGHSPic", "pictograms", GetEnvironmentLocation() + "/Operations/Indexation/BatchDeleteGhsPictograms");
            });

            indexationDetailObj.on("change", "#PictNotProvided", function () {
                var url = GetEnvironmentLocation() + '/Operations/Indexation/SavePictNotProvided';
                var indexationId = $("#IndexationId").val();
                if ($(this).is(":checked")) {
                    $.post(url, { pictNotProvided: true, indexationId: indexationId },
                        function (data) {
                            $(this).savedSuccessFully(data);
                            var pictGrid = $("#GridRegGHSPic").data("kendoGrid");
                            pictGrid.dataSource.read();
                            $("#btnAddGhsPictograms, #ancGhsPictogramBatchDelete").addClass("k-state-disabled");
                            indexationDetailObj.off("click", "#btnAddGhsPictograms", onAddGhsPictogramsButtonClick);
                        });
                } else {
                    $.post(url, { pictNotProvided: false, indexationId: indexationId },
                        function (data) {
                            $(this).savedSuccessFully(data);
                            $("#btnAddGhsPictograms, #ancGhsPictogramBatchDelete").removeClass("k-state-disabled");
                            indexationDetailObj.on("click", "#btnAddGhsPictograms", onAddGhsPictogramsButtonClick);
                        });
                }
            });

            indexationDetailObj.on("click", "#btnSelectGhsPictograms", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchGhsPictograms").data("kendoGrid");
                if (grid.dataSource.total() === 0) {
                    $(this).displayError("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    $(this).displayError("No rows selected");
                    return;
                }
                if (grid.select().length > 1) {
                    var rows = grid.select();
                    var ghspictogramlists = [];
                    rows.each(
                        function (index, row) {
                            var selectedItem = grid.dataItem(row);
                            ghspictogramlists.push(selectedItem.Reference);
                        }
                    );
                    addGhsPictogramList(ghspictogramlists);
                    return;
                }
                addGhsPictogram(selectedData.Reference);
            });

            indexationDetailObj.on("dblclick", "#GridSearchGhsPictograms table tr", function () {
                searchGridDoubleClick("#GridSearchGhsPictograms", "#btnSelectGhsPictograms");
            });

            indexationDetailObj.on("click", "#SearchBySignalWord", onSignalWordSearchButtonClick);

            indexationDetailObj.on("change", "#SWordNotProvided", function () {
                if ($(this).is(":checked")) {
                    $("#SignalWord").val("").prop("disabled", true);
                    $("#SWOther").val("").prop("disabled", true);
                    $("#SWOtherBit").prop('checked', false); 
                    $("#SearchBySignalWord").addClass("k-state-disabled");
                    $("#SignalWordId").val(null);
                    indexationDetailObj.off("click", "#SearchBySignalWord", onSignalWordSearchButtonClick);
                } else {
                   $("#SearchBySignalWord").removeClass("k-state-disabled");
                    indexationDetailObj.on("click", "#SearchBySignalWord", onSignalWordSearchButtonClick);
                }
            });

            indexationDetailObj.on("change", "#SWOtherBit", function () {
                if ($(this).is(":checked")) {
                    $("#SignalWord").val("").prop("disabled", true);
                    $("#SWOther").val("").prop("disabled", true);
                    $("#SWOther").prop("disabled", false);
                    $("#SWordNotProvided").prop('checked', false);
                    $("#SearchBySignalWord").addClass("k-state-disabled");
                    $("#SignalWordId").val(null);
                    indexationDetailObj.off("click", "#SearchBySignalWord", onSignalWordSearchButtonClick);
                } else {
                    $("#SWOther").val("").prop("disabled", true);
                    $("#SearchBySignalWord").removeClass("k-state-disabled");
                    indexationDetailObj.on("click", "#SearchBySignalWord", onSignalWordSearchButtonClick);
                }
            });

            indexationDetailObj.on("click", "#btnSelectGhsSignalWord", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchSignalWord").data("kendoGrid");
                if (grid.dataSource.total() === 0) {
                    $(this).displayError("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    $(this).displayError("No rows selected");
                    return;
                }
                $("#popupGhsSignalWord").modal("hide");
                $("#SignalWord").val(selectedData.SignalWord + ", " + selectedData.SignalWordCode);
                $("#SignalWordId").val(selectedData.SignalWordId);
            });

            indexationDetailObj.on("dblclick", "#GridSearchSignalWord table tr", function() {
                searchGridDoubleClick("#GridSearchSignalWord", "#btnSelectGhsSignalWord");
            });

            indexationDetailObj.on("click", "#btnAddHazardStatement", onAddHazardStatementButtonClick);

            indexationDetailObj.on("click", "#ancHazardStatementBatchDelete", function (e) {
                e.preventDefault();
                batchDeleteIndexationObjects("GridHazardStatement"
                    , "hazard statements"
                    , GetEnvironmentLocation() + "/Operations/Indexation/BatchDeleteHazardStatements"
                    , function() { hideEditorSection("AddEditHazardStatement"); });
            });

            indexationDetailObj.on("change", "#HStatementNotProvided", function () {
                var url = GetEnvironmentLocation() + '/Operations/Indexation/SaveHStatementNotProvided';
                var indexationId = $("#IndexationId").val();
                if ($(this).is(":checked")) {
                    $('#AddEditHazardStatement').empty();
                    $.post(url, { hStatementNotProvided: true, indexationId: indexationId },
                        function (data) {
                            $(this).savedSuccessFully(data);
                            var hStatementGrid = $("#GridHazardStatement").data("kendoGrid");
                            hStatementGrid.dataSource.read();
                            $("#btnAddHazardStatement, #ancHazardStatementBatchDelete").addClass("k-state-disabled");
                            indexationDetailObj.off("click", "#btnAddHazardStatement", onAddHazardStatementButtonClick);
                        });
                } else {
                    $.post(url, { hStatementNotProvided: false, indexationId: indexationId },
                        function (data) {
                            $(this).savedSuccessFully(data);
                            $("#btnAddHazardStatement, #ancHazardStatementBatchDelete").removeClass("k-state-disabled");
                            indexationDetailObj.on("click", "#btnAddHazardStatement", onAddHazardStatementButtonClick);
                        });
                }
            });

            indexationDetailObj.on("click", "#SearchByHazardCode", function (e) {
                e.preventDefault();

                var referenceId = $('#AddEditHazardStatement').find('#Reference').val();
                if ($("#popupHazardStatement").length > 0) {
                    var grid = $("#GridSearchHazardStatement").data("kendoGrid");
                    var singleSelection = !(referenceId && referenceId !== "0");
                    grid.selectable.options.multiple = singleSelection;
                    grid.dataSource.read();
                }
                
                $("#popupHazardStatement").modal("show");
            });

            indexationDetailObj.on("click", "#btnEnableOtherHCode", function (e) {
                e.preventDefault();
                $("#StatementHCode, #HCodePhraseID").val("");
                $("#OtherHCode, #OtherHStatement").val("").prop("disabled", false);

                if (ghsHazardStatementValidator) {
                    ghsHazardStatementValidator.validateInput($('#StatementHCode'));
                    ghsHazardStatementValidator.validateInput($('#OtherHCode'));
                    ghsHazardStatementValidator.validateInput($('#OtherHStatement'));
                }
            });

            indexationDetailObj.on("click", "#btnSelectHazardStatement", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchHazardStatement").data("kendoGrid");
                if (grid.dataSource.total() === 0) {
                    $(this).displayError("No rows selected");
                    return;
                }

                var selectedItems = grid.tbody.find(".k-state-selected");
                if (!selectedItems || selectedItems.length <= 0) {
                    $(this).displayError("No rows selected");
                    return;
                }

                // Continue to have older logic to handle single selected hazard statements or edits
                var referenceId = $('#AddEditHazardStatement').find('#Reference').val() || "0";

                if (selectedItems.length === 1 || referenceId !== "0") {
                    $("#popupHazardStatement").modal("hide");

                    var selectedData = grid.dataItem(selectedItems[0]);
                    $("#StatementHCode").val(selectedData.Statement + ", " + selectedData.HCode);
                    $("#OtherHCode").val(selectedData.HCode).prop("disabled", true);
                    $("#OtherHStatement").val(selectedData.Statement).prop("disabled", true);
                    $("#HCodePhraseID").val(selectedData.Reference);

                    if (ghsHazardStatementValidator) {
                        ghsHazardStatementValidator.validateInput($('#StatementHCode'));
                        ghsHazardStatementValidator.validateInput($('#OtherHCode'));
                        ghsHazardStatementValidator.validateInput($('#OtherHStatement'));
                    }

                    // Multiple items have been selected save directly into the database
                } else {
                    batchSaveHazardStatements(getSelectedIds(grid, selectedItems));
                }
            });

            indexationDetailObj.on("dblclick", "#GridSearchHazardStatement table tr", function() {
                searchGridDoubleClick("#GridSearchHazardStatement", "#btnSelectHazardStatement");
            });

            indexationDetailObj.on("click", "#btnSaveHazardStatement", function (e) {
                e.preventDefault();

                initializeGhsHazardStatementValidator();
                if (ghsHazardStatementValidator.validate()) {
                    var form = $("#FormEditHazardStatement");
                    var url = form.attr("action");
                    var formData = form.serialize();
                    $.post(url, formData, function (data) {
                        if (data.result === "success") {
                            $(this).savedSuccessFully(data.message);
                            $('#AddEditHazardStatement').empty();
                            var grid = $("#GridHazardStatement").data("kendoGrid");
                            grid.dataSource.read();
                        } else {
                            if (data.popupMessage)
                                $(this).displayError(data.popupMessage);
                        }
                    });
                    return true;
                } else
                    return false;
            });

            indexationDetailObj.on("click", "#btnDiscardHazardStatement", function (e) {
                e.preventDefault();
                $('#AddEditHazardStatement').empty();
            });

            indexationDetailObj.on("click", "#btnAddPrecautionaryStatement", onAddPrecautionaryStatementButtonClick);

            indexationDetailObj.on("click", "#ancPrecautionaryStatementBatchDelete", function (e) {
                e.preventDefault();
                batchDeleteIndexationObjects("GridPrecautionaryStatement"
                    , "precautionary statements"
                    , "../Indexation/BatchDeletePrecautionaryStatements",
                    function () { hideEditorSection("AddEditPrecautionaryStatement"); });
            });

            indexationDetailObj.on("change", "#PStatementNotProvided", function () {
                var url = '../Indexation/SavePStatementNotProvided';
                var indexationId = $("#IndexationId").val();
                if ($(this).is(":checked")) {
                    $('#AddEditPrecautionaryStatement').empty();
                    $.post(url, { pStatementNotProvided: true, indexationId: indexationId },
                        function (data) {
                            $(this).savedSuccessFully(data);
                            var hClassGrid = $("#GridPrecautionaryStatement").data("kendoGrid");
                            hClassGrid.dataSource.read();
                            $("#btnAddPrecautionaryStatement, #ancPrecautionaryStatementBatchDelete").addClass("k-state-disabled");
                            indexationDetailObj.off("click", "#btnAddPrecautionaryStatement", onAddPrecautionaryStatementButtonClick);
                        });
                } else {
                    $.post(url, { pStatementNotProvided: false, indexationId: indexationId },
                        function (data) {
                            $(this).savedSuccessFully(data);
                            $("#btnAddPrecautionaryStatement, #ancPrecautionaryStatementBatchDelete").removeClass("k-state-disabled");
                            indexationDetailObj.on("click", "#btnAddPrecautionaryStatement", onAddPrecautionaryStatementButtonClick);
                        });
                }
            });

            indexationDetailObj.on("click", "#SearchByPrecautionaryCode", function (e) {
                e.preventDefault();

                var referenceId = $('#AddEditPrecautionaryStatement').find('#Reference').val();
                if ($("#popupPStatement").length > 0) {
                    var grid = $("#GridSearchPrecautionaryStatement").data("kendoGrid");
                    var singleSelection = !(referenceId && referenceId !== "0");
                    grid.selectable.options.multiple = singleSelection;
                    grid.dataSource.read();
                }
                
                $("#popupPStatement").modal("show");
            });

            indexationDetailObj.on("click", "#btnEnableOtherPCode", function (e) {
                e.preventDefault();
                $("#StatementPCode, #PrecautionaryStatementId").val("");
                $("#OtherPCode, #OtherPStatement").val("").prop("disabled", false);

                if (ghsPrecautionaryStatementValidator) {
                    ghsPrecautionaryStatementValidator.validateInput($('#StatementPCode'));
                    ghsPrecautionaryStatementValidator.validateInput($('#OtherPCode'));
                    ghsPrecautionaryStatementValidator.validateInput($('#OtherPStatement'));
                }
            });

            indexationDetailObj.on("click", "#btnSelectPStatement", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchPrecautionaryStatement").data("kendoGrid");
                if (grid.dataSource.total() === 0) {
                    $(this).displayError("No rows selected");
                    return;
                }
                
                var selectedItems = grid.tbody.find(".k-state-selected");
                if (!selectedItems || selectedItems.length <= 0) {
                    $(this).displayError("No rows selected");
                    return;
                }

                // Continue to have older logic to handle single selected hazard statements or edits
                var referenceId = $('#AddEditHazardStatement').find('#Reference').val() || "0";

                if (selectedItems.length === 1 || referenceId !== "0") {
                    $("#popupPStatement").modal("hide");

                    var selectedData = grid.dataItem(selectedItems[0]);
                    $("#StatementPCode").val(selectedData.PCode + ", " + selectedData.Statement);
                    $("#OtherPCode").val(selectedData.PCode).prop("disabled", true);
                    $("#OtherPStatement").val(selectedData.Statement).prop("disabled", true);
                    $("#PrecautionaryStatementId").val(selectedData.PrecautionaryStatementId);

                    if (ghsPrecautionaryStatementValidator) {
                        ghsPrecautionaryStatementValidator.validateInput($('#StatementPCode'));
                        ghsPrecautionaryStatementValidator.validateInput($('#OtherPCode'));
                        ghsPrecautionaryStatementValidator.validateInput($('#OtherPStatement'));
                    }

                    // Multiple items have been selected save directly into the database
                } else {
                    batchSavePrecautionaryStatements(getSelectedIds(grid, selectedItems));
                }
            });

            indexationDetailObj.on("dblclick", "#GridSearchPrecautionaryStatement table tr", function () {
                searchGridDoubleClick("#GridSearchPrecautionaryStatement", "#btnSelectPStatement");
            });

            indexationDetailObj.on("click", "#btnSavePrecautionaryStatement", function (e) {
                e.preventDefault();

                initializeGhsPrecautionaryStatementValidator();
                if (ghsPrecautionaryStatementValidator.validate()) {

                    var form = $("#FormEditPrecautionaryStatement");
                    var url = form.attr("action");
                    var formData = form.serialize();
                    $.post(url, formData, function (data) {
                        if (data.result === "success") {
                            $(this).savedSuccessFully(data.message);
                            $('#AddEditPrecautionaryStatement').empty();
                            var grid = $("#GridPrecautionaryStatement").data("kendoGrid");
                            grid.dataSource.read();
                        } else {
                            if (data.popupMessage)
                                $(this).displayError(data.popupMessage);
                        }
                    });
                    return true;

                } else
                    return false;
            });

            indexationDetailObj.on("click", "#btnDiscardPrecautionaryStatement", function (e) {
                e.preventDefault();
                $('#AddEditPrecautionaryStatement').empty();
            });

            // NONE ----

            indexationDetailObj.on("change", "#NoHazardCategory", function () {
                if ($(this).is(":checked")) {

                    $("#btnEnableOtherHCategory").addClass("k-state-disabled");//.prop("disabled", true);
                    $("#SearchByCategory").addClass("k-state-disabled");//.prop("disabled", true);
                    $("#Category").val("").prop("disabled", true);
                    $("#OtherCategory").val("Category not provided").prop("disabled", false);

                } else {

                    $("#btnEnableOtherHCategory").removeClass("k-state-disabled");//.prop("disabled", true);
                    $("#SearchByCategory").removeClass("k-state-disabled");//.prop("disabled", true);
                    $("#Category").val("").prop("disabled", false);
                    $("#OtherCategory").val("").prop("disabled", true);
                }
            });

            indexationDetailObj.on("change", "#NoHazardClass", function () {
                if ($(this).is(":checked")) {

                    $("#btnEnableOtherHClass").addClass("k-state-disabled");
                    $("#SearchByCode").addClass("k-state-disabled");
                    $("#Class").val("").prop("disabled", true);
                    $("#OtherClass").val("Class not provided").prop("disabled", false);
//                    indexationDetailObj.off("click", "#SearchByCode", onSearchByCodeButtonClick);

                } else {

                    $("#btnEnableOtherHClass").removeClass("k-state-disabled");
                    $("#SearchByCode").removeClass("k-state-disabled");
                    $("#Class").val("").prop("disabled", false);
                    $("#OtherClass").val("").prop("disabled", true);
//                    indexationDetailObj.on("click", "#SearchByCode", onSearchByCodeButtonClick);
                }
            });


            // NONE ----
        }

        function initializeGhsHazardClassValidator() {
            
            ghsHazardClassValidator = $("#FormRegulatoryGHS").kendoValidator({
                messages: {
                    codevalid: function (input) {
                        if (input.is('[id="Class"]')) {
                            if (input.val().length <= 0) {
                                return "Class/Code is required";
                            }
                        } else {
                            return "Other Class is required";
                        }
                    },
                    categoryvalid: function (input) {
                        if (input.is('[id="Category"]')) {
                            if (input.val().length <= 0) {
                                return "Category is required";
                            }
                        } else {
                            return "Other Category is required";
                        }
                    }
                },
                rules: {
                    codevalid: function (input) {
                        if (input.is('[id="Class"]') && !$('#Class').val() && $('#OtherClass').is(':disabled')) {
                            return false;
                        } else if (input.is('[id="OtherClass"]') && !input.val() && !$('#Class').val()) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    categoryvalid: function (input) {
                        if (input.is('[id="Category"]') && !$('#Category').val() && $('#OtherCategory').is(':disabled')) {
                            return false;
                        } else if (input.is('[id="OtherCategory"]') && !input.val() && !$('#Category').val()) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }

            }).data("kendoValidator");
            return ghsHazardClassValidator;
        }

        function initializeGhsHazardStatementValidator() {
         
            ghsHazardStatementValidator = $("#FormEditHazardStatement").kendoValidator({
                
                messages: {
                    codevalid: function(input) {
                        if (input.is('[id="StatementHCode"]')) {
                            return "Statement/HCode is required";
                        } else if (input.is('[id="OtherHCode"]')) {
                            return "Other HCode is required";
                        } else {
                            return "Other Statement is required";
                        }
                    }   
                },
                rules: {
                    codevalid: function(input) {
                        if (input.is('[id="StatementHCode"]') && !$('#HCodePhraseID').val() && $('#OtherHCode').is(':disabled')) {
                            return false;
                        } else if ((input.is('[id="OtherHCode"]') || input.is('[id="OtherHStatement"]')) && !input.val() && !$('#HCodePhraseID').val()) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }

            }).data("kendoValidator");

            return ghsHazardStatementValidator;
        }

        function initializeGhsPrecautionaryStatementValidator() {

            ghsPrecautionaryStatementValidator = $('#FormEditPrecautionaryStatement').kendoValidator({
                
                messages: {
                    statementvalid: function(input) {
                        if (input.is('[id="StatementPCode"]')) {
                            return "Statement/PCode is required";
                        } else if (input.is('[id="OtherPCode"]')) {
                            return "Other PCode is required";
                        } else {
                            return "Other Statement is required";
                        }
                    }
                },
                rules: {
                    statementvalid: function(input) {
                        if (input.is('[id="StatementPCode"]') && !$('#PrecautionaryStatementId').val() && $('#OtherPCode').is(':disabled')) {
                            return false;
                        } else if ((input.is('[id="OtherPCode"]') || input.is('[id="OtherPStatement"]')) && !input.val() && !$('#PrecautionaryStatementId').val()) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }

            }).data('kendoValidator');

            return ghsPrecautionaryStatementValidator;
        }

        function addGhsPictogram(reference) {
            var url = GetEnvironmentLocation() + '/Operations/Indexation/RegGHSPic_Create';
            var indexationId = $("#IndexationId").val();
            $.post(url, { iReference: reference, indexationId: indexationId },
                function (data) {
                    $("#popupGhsPictograms").modal("hide");
                    $(this).savedSuccessFully(data);
                    var pictogramGrid = $("#GridRegGHSPic").data("kendoGrid");
                    pictogramGrid.dataSource.read();
                });
        }

        function addGhsPictogramList(ghspictogramlists) {
            var urlmultiple = GetEnvironmentLocation() + '/Operations/Indexation/RegGHSPic_CreateList';
            var indexationId = $("#IndexationId").val();
            $.post(urlmultiple, { pictogramList: JSON.stringify(ghspictogramlists), indexationId: indexationId },
                function (data) {
                    $("#popupGhsPictograms").modal("hide");
                    $(this).savedSuccessFully(data);
                    var pictogramGrid = $("#GridRegGHSPic").data("kendoGrid");
                    pictogramGrid.dataSource.read();
                });
        }

        function batchSaveHazardStatements(ids) {
            if (!ids || ids.length === 0) {
                $(this).displayError("No hazard statements were selected to be created.");
                return false;
            }

            var url = GetEnvironmentLocation() +  "/Operations/Indexation/BatchCreateHazardStatements";
            var indexationId = getIndexationId();

            var data = { indexationId: indexationId.IndexationId, ids: ids };
            $.ajax({
                url: url,
                data: JSON.stringify(data),
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                error: function() {
                    $(this).displayError("Batch hazard statement creation could not be completed");
                },
                success: function (response) {

                    if (response.success) {
                        var grid = $('#GridHazardStatement').data("kendoGrid");
                        grid.dataSource.read();

                        hideEditorSection("AddEditHazardStatement");
                        $("#popupHazardStatement").modal("hide");

                    } else {
                        $("#popupHazardStatement").modal("hide");
                        $(this).displayError("Batch hazard statement creation could not be completed");
                    }
                }
            });
        }

        function saveIndexationLevel() {
            var url = GetEnvironmentLocation() + "/Operations/Indexation/SaveIndexationLevel";
            var param = getIndexLevelParam();

            $.ajax({
                url: url,
                data: JSON.stringify(param),
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                error: function () {                    
                    $(this).displayError("Can not save indexation level information.");
                },
                success: function (response) {
                }
            });
        }

        function batchSavePrecautionaryStatements(ids) {
            
            if (!ids || ids.length === 0) {
                $(this).displayError("No precautionary statements were selected to be created.");
                return false;
            }

            var url = GetEnvironmentLocation() + "/Operations/Indexation/BatchCreatePrecautionaryStatements";
            var indexationId = getIndexationId();

            var data = { indexationId: indexationId.IndexationId, ids: ids };
            $.ajax({
                url: url,
                data: JSON.stringify(data),
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                error: function () {
                    $("#popupPStatement").modal("hide");
                    $(this).displayError("Batch precautionary statement creation could not be completed");
                },
                success: function (response) {

                    if (response.success) {
                        var grid = $('#GridPrecautionaryStatement').data("kendoGrid");
                        grid.dataSource.read();

                        hideEditorSection("AddEditPrecautionaryStatement");
                        $("#popupPStatement").modal("hide");

                    } else {
                        $(this).displayError("Batch precautionary statement creation could not be completed");
                    }
                }
            });
        }

        function getSelectedIds(grid, selectedItems) {

            var ids = [];
            if (grid) {

                for (var idx = 0; idx < selectedItems.length > 0; idx++) {
                    var item = selectedItems[idx];
                    var dataItem = grid.dataItem(item);
                    if (dataItem) {
                        ids.push(dataItem.id);
                    }
                }
            }

            return ids;
        }

        function onAddHazardClassButtonClick(e) {
            e.preventDefault();
            var indexationId = $("#IndexationId").val();
            var url = GetEnvironmentLocation() + '/Operations/Indexation/HazardClass_Edit';
            $.post(url, { indexationId: indexationId, iReference: 0 },
                function (data) {
                    $('#AddEditHazardClass').html(data).show();
                });
        };

        function onAddHazardStatementButtonClick(e) {
            e.preventDefault();

            var indexation = getIndexationId();
            var url = GetEnvironmentLocation() + '/Operations/Indexation/HazardStatement_Edit';
            $.post(url, { indexationId: indexation.IndexationId, iReference: 0 },
                function (data) {
                    $('#AddEditHazardStatement').html(data).show();
                });
        }

        function onAddGhsPictogramsButtonClick (e) {
            e.preventDefault();
            if ($("#popupGhsPictograms").length > 0) {
                var grid = $("#GridSearchGhsPictograms").data("kendoGrid");
                grid.dataSource.read();
            }
            $("#popupGhsPictograms").modal("show");
        };

        function onAddPrecautionaryStatementButtonClick(e) {
            e.preventDefault();
            var indexationId = $("#IndexationId").val();
            var url = GetEnvironmentLocation() + '/Operations/Indexation/PrecautionaryStatement_Edit';
            $.post(url, { indexationId: indexationId, iReference: 0 },
                function (data) {
                    $('#AddEditPrecautionaryStatement').html(data).show();
                });
        }

        function onSignalWordSearchButtonClick(e) {
            e.preventDefault();
            $("#popupGhsSignalWord").modal("show");
        }

        var gridPrecautionaryStatementChange = function () {
            var selectedData = this.dataItem(this.select());
            var indexationId = $("#IndexationId").val();

            if (selectedData) {
                var url = GetEnvironmentLocation() + '/Operations/Indexation/PrecautionaryStatement_Edit';
                $.post(url, { indexationId: indexationId, iReference: selectedData.Reference },
                    function (data) {
                        $('#AddEditPrecautionaryStatement').html(data).show();
                    });
            } else {
                hideEditorSection('AddEditPrecautionaryStatement');
            }
        };

        var onGridHazardClassChange = function () {
            var selectedData = this.dataItem(this.select());
            var indexationId = $("#IndexationId").val();

            if (selectedData) {
                var url = GetEnvironmentLocation() + '/Operations/Indexation/HazardClass_Edit';
                $.post(url, { indexationId: indexationId, iReference: selectedData.Reference },
                    function(data) {
                        $('#AddEditHazardClass').html(data).show();
                    });
            } else {
                hideEditorSection('AddEditHazardClass');
            }
        };

        var onGridHazardClassRequestComplete = function (e) {
            if (e.type === "destroy") {
                hideEditorSection('AddEditHazardClass');
            }
        };

        var onGridHazardStatementChange = function() {
            var selectedData = this.dataItem(this.select());
            var indexation = getIndexationId();

            if (selectedData) {

                var url = GetEnvironmentLocation() + '/Operations/Indexation/HazardStatement_Edit';
                $.post(url, { indexationId: indexation.IndexationId, iReference: selectedData.Reference },
                    function (data) {
                        $('#AddEditHazardStatement').html(data).show();
                    });
                
            } else {
                hideEditorSection('AddEditHazardStatement');
            }
        };

        var onGridHazardStatementRequestComplete = function (e) {
            if (e.type === "destroy") {
                hideEditorSection('AddEditHazardStatement');
            }
        };

        var onRegGhsPartialReady = function() {

            $('#popupGhsPictograms').modal({
                keyboard: false,
                show: false,
                backdrop: true
            });
            $('#popupGhsSignalWord').modal({
                keyboard: false,
                show: false,
                backdrop: true
            });

            var url = GetEnvironmentLocation() + '/Operations/Indexation/GetSearchGhsPictograms';
            $.post(url, function (data) {
                $("#dgGhsPictogramsPlugIn").html(data);
            });
            var urlSignalWord = GetEnvironmentLocation() + '/Operations/Indexation/GetSearchSignalWord';
            $.post(urlSignalWord, function (data) {
                $("#dgGhsSignalWordPlugIn").html(data);
            });
        };

        var onGridPrecautionaryStatementRequestComplete = function (e) {
            if (e.type === "destroy") {
                hideEditorSection('AddEditPrecautionaryStatement');
            }
        };

        var onRegulatoryGhsActivate = function (e) {
            if ($(e.item).find("> .k-link").text() === "GHS") {

                setTimeout(function () {
                    if ($("#btnAddHazardClass").hasClass("k-state-disabled")) {
                        indexationDetailObj.off("click", "#btnAddHazardClass", onAddHazardClassButtonClick);
                    }
                    if ($("#btnAddGhsPictograms").hasClass("k-state-disabled")) {
                        indexationDetailObj.off("click", "#btnAddGhsPictograms", onAddGhsPictogramsButtonClick);
                    }
                    if ($("#btnAddHazardStatement").hasClass("k-state-disabled")) {
                        indexationDetailObj.off("click", "#btnAddHazardStatement", onAddHazardStatementButtonClick);
                    }
                    if ($("#btnAddPrecautionaryStatement").hasClass("k-state-disabled")) {
                        indexationDetailObj.off("click", "#btnAddPrecautionaryStatement", onAddPrecautionaryStatementButtonClick);
                    }
                    if ($("#SearchBySignalWord").hasClass("k-state-disabled")) {
                        indexationDetailObj.off("click", "#SearchBySignalWord", onSignalWordSearchButtonClick);
                    }
                }, 700);
            }
        };

        var onGridPPEChange = function () {
            var selectedData = this.dataItem(this.select());
            var indexation = getIndexationId();

            if (selectedData) {

                var url = GetEnvironmentLocation() + '/Operations/Indexation/Ppe_Edit';
                $.post(url, { indexationId: indexation.IndexationId, iReference: selectedData.Reference, section: "PPE" },
                    function (data) {
                        $('#AddPPE').html(data).show();
                    });

            } else
                hideEditorSection('AddPPE');
        };


        var onGridPPERequestComplete = function (e) {
            if(e.type === "destroy")
                hideEditorSection('AddPPE');
        };

        // Others regulatory section methods
        function initializeOthersControls() {

            indexationDetailObj.on("click", "#btnAddOtherClass", function (e) {
                e.preventDefault();
                if ($("#popupOtherClass").length > 0) {
                    var grid = $("#GridSearchOtherClass").data("kendoGrid");
                    grid.dataSource.read();
                }
                $("#popupOtherClass").modal("show");
            });

            indexationDetailObj.on("click", "#ancOtherClassificationBatchDelete", function (e) {
                e.preventDefault();
                batchDeleteIndexationObjects("GridRegOthers", "other classification", GetEnvironmentLocation() + "/Operations/Indexation/BatchDeleteOtherClassification");
            });

            indexationDetailObj.on("click", "#btnSelectOtherClass", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchOtherClass").data("kendoGrid");
                if (grid.dataSource.total() === 0) {
                    $(this).displayError("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    $(this).displayError("No rows selected");
                    return;
                }
                if (grid.select().length > 1) {
                    var rows = grid.select();
                    var otherclasslists = [];
                    rows.each(
                        function (index, row) {
                            var selectedItem = grid.dataItem(row);
                            otherclasslists.push(selectedItem.Reference);
                        }
                    );
                    addOtherClassificationList(otherclasslists);
                    return;
                }
                addOtherClassification(selectedData.Reference);
            });

            indexationDetailObj.on("dblclick", "#GridSearchOtherClass table tr", function() {
                searchGridDoubleClick("#GridSearchOtherClass", "#btnSelectOtherClass");
            });
        }

        function addOtherClassification(reference) {
            var url = GetEnvironmentLocation() + '/Operations/Indexation/RegOthers_Create';
            var indexationId = $("#IndexationId").val();
            $.post(url, { iReference: reference, indexationId: indexationId },
                function (data) {
                    $("#popupOtherClass").modal("hide");
                    $(this).savedSuccessFully(data);
                    var otherClassGrid = $("#GridRegOthers").data("kendoGrid");
                    otherClassGrid.dataSource.read();
                });
        }

        function addOtherClassificationList(otherclasslists) {
            var urlmultiple = '../Indexation/RegOthers_CreateList';
            var indexationId = $("#IndexationId").val();
            $.post(urlmultiple, { classificationList: JSON.stringify(otherclasslists), indexationId: indexationId },
                function (data) {
                    $("#popupOtherClass").modal("hide");
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    var otherClassGrid = $("#GridRegOthers").data("kendoGrid");
                    otherClassGrid.dataSource.read();
                });
        }

        var onRegOthersPartialReady = function () {
            
            $('#popupOtherClass').modal({
                keyboard: false,
                show: false,
                backdrop: true
            });

            var url = '../Indexation/GetSearchOtherClassification';
            $.post(url, function (data) {
                $("#dgOtherClassPlugIn").html(data);
            });
        };

        // Handling and storage section 
        function initializeHandlingStorageControls() {
            indexationDetailObj.on("click", "#btnAddHandlingStorage", function (e) {
                e.preventDefault();
                var url = GetEnvironmentLocation() + '/Operations/Indexation/HandlingStorage_Edit';
                var indexationId = $("#IndexationId").val();
                $.post(url, { indexationId: indexationId, iReference: 0, section: "HandlingStorage" },
                    function (data) {
                        $('#AddHandlingStorage').html(data).show();
                    });
            });

            indexationDetailObj.on("click", "#ancHandlingStorageBatchDelete", function(e) {
                e.preventDefault();
                batchDeleteObjects("GridHandlingStorage", "handling storage indexation", GetEnvironmentLocation() + "/Operations/Indexation/BatchDeleteSafetyIndexation");
            });

            indexationDetailObj.on("click", "#btnDiscardHandlingStorage", function (e) {
                e.preventDefault();
                $('#AddHandlingStorage').empty();
            });

            indexationDetailObj.on("click", "#btnSaveHandlingStorage", function (e) {
                e.preventDefault();
             
                var form = $("#FormEditHandlingStorage");
                var url = form.attr("action");
                var formData = form.serialize();
                $.post(url, formData, function (data) {
                    if(data.result === "success") {
                          $(this).savedSuccessFully(data.message);
                          $('#AddHandlingStorage').empty();
                          var grid = $("#GridHandlingStorage").data("kendoGrid");
                         grid.dataSource.read();
                    } else {
                         if (data.popupMessage)
                         $(this).displayError(data.popupMessage);
                    }
               });
                  return true;
            });


        }

        var onGridHandlingStorageRequestComplete = function (e) {
            if (e.type === "destroy")
                hideEditorSection('AddHandlingStorage');
        };

        var onGridHandlingStorageChange = function () {
            var selectedData = this.dataItem(this.select());
            var indexation = getIndexationId();

            if (selectedData) {
               var url = GetEnvironmentLocation() + '/Operations/Indexation/HandlingStorage_Edit';
                $.post(url, { indexationId: indexation.IndexationId, iReference: selectedData.Reference, section: "HandlingStorage" },
                    function (data) {
                        $('#AddHandlingStorage').html(data).show();
                    });

            } else
                hideEditorSection('AddHandlingStorage');
        };



        // First aid section methods
        function initializeFirstAidControls() {
            indexationDetailObj.on("click", "#btnAddFirstAid", function (e) {
                e.preventDefault();
                var url = GetEnvironmentLocation() +  '/Operations/Indexation/FirstAid_Edit';
                var indexationId = $("#IndexationId").val();
                $.post(url, { indexationId: indexationId, iReference: 0, section: "FirstAid" },
                    function (data) {
                        $('#AddFirstAid').html(data).show();
                    });
            });

            indexationDetailObj.on("click", "#ancFirstAidBatchDelete", function(e) {
                e.preventDefault();
                batchDeleteObjects("GridFirstAid", "first aid indexation", GetEnvironmentLocation() + "/Operations/Indexation/BatchDeleteSafetyIndexation");
            });

            indexationDetailObj.on("click", "#btnDiscardFirstAid", function (e) {
                e.preventDefault();
                $('#AddFirstAid').empty();
            });

            indexationDetailObj.on("click", "#btnSaveFirstAid", function (e) {
                e.preventDefault();
                var form = $("#FormEditFirstAid");
                var url = form.attr("action");
                var formData = form.serialize();
                $.post(url, formData, function (data) {
                    if (data.result === "success") {
                        $(this).savedSuccessFully(data.message);
                        $('#AddFirstAid').empty();
                        var grid = $("#GridFirstAid").data("kendoGrid");
                        grid.dataSource.read();
                    } else {
                        if (data.popupMessage)
                            $(this).displayError(data.popupMessage);
                    }
                });
                return true;
            });

        }

          var onGridFirstAidRequestComplete = function (e) {
            if(e.type === "destroy")
                hideEditorSection('AddFirstAid');
                };

        var onGridFirstAidChange = function () {
            var selectedData = this.dataItem(this.select());
            var indexation = getIndexationId();

                    if (selectedData) {
                        var url = GetEnvironmentLocation() + '/Operations/Indexation/FirstAid_Edit';
                        $.post(url, {
                            indexationId: indexation.IndexationId, iReference: selectedData.Reference, section: "FirstAid"
                        },
                    function (data) {
                        $('#AddFirstAid').html(data).show();
                    });

                    } else
                hideEditorSection('AddFirstAid');
                };


        // Fire fighting section methods
        function initializeFireFightingControls() {
            indexationDetailObj.on("click", "#btnSaveFireFighting", function(e) {
                e.preventDefault();
                var form = $("#FormFireFighting");
                var validator = form.kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var url = form.attr("action");
                    var formData = form.serialize();
                    $.post(url, formData, function (data) {

                        if (!data.Errors) {
                            if(!generalSave)
                                $(this).savedSuccessFully("Fire Fighting Saved");
                            else
                                $(this).savedSuccessFully("Indexation Saved");

                            //this is to reset the general save flag DO NOT CHANGE THIS
                            generalSave = false;
                            return true;
                        } else {
                            validationGeneral = false;
                            validationMessage = "Fire Fighting<br />";
                            var errorMessage = 'Error occured while saving the fire fighting details';
                            var keys = Object.keys(data.Errors);
                            for (var idx = 0; idx < keys.length; idx++) {
                                var errorobj = data.Errors[keys[idx]];
                                if (errorobj.errors && errorobj.errors.length > 0) {
                                    errorMessage = errorobj.errors[0];
                                    break;
                                }
                            }

                            $(this).displayError(errorMessage);
                            return false;
                        }
                    });
                }
            });
        }

        function flashPointMoreNeeded(selectedValue) {
            if (!selectedValue || selectedValue == 7) {
                $('#SelectFlashPointTempUnit').data("kendoDropDownList").select(0);
                $('#SelectFlashPointTempUnit').data("kendoDropDownList").enable(false);
            } else
                $('#SelectFlashPointTempUnit').data("kendoDropDownList").enable(true);
        }

        function flameExtensionMoreNeeded(selectedValue) {
            if (!selectedValue || selectedValue == 7) {
                $('#FlameExtensionUnitLength').data("kendoDropDownList").select(0);
                $('#FlameExtensionUnitLength').data("kendoDropDownList").enable(false);
            } else
                $('#FlameExtensionUnitLength').data("kendoDropDownList").enable(true);
        }

        function selfIgnitionMoreNeeded(selectedValue) {
            if (!selectedValue || selectedValue == 7) {
                $('#SelectSelfIgniTempUnit').data("kendoDropDownList").select(0);
                $('#SelectSelfIgniTempUnit').data("kendoDropDownList").enable(false);
            } else
                $('#SelectSelfIgniTempUnit').data("kendoDropDownList").enable(true);
        }

        var onFlashPointOperatorChange = function (e) {
            operatorDropdownChange(e.sender._selectedValue, "FromFlashPoint", "ToFlashPoint", flashPointMoreNeeded);
        };

        var onFlameExtensionOperatorChange = function (e) {
            operatorDropdownChange(e.sender._selectedValue, "FlameExtensionFrom", "FlameExtensionTo", flameExtensionMoreNeeded);
        };

        var onSelfIgnitionOperatorChange = function (e) {
            uniOperatorDropdownChange(e.sender._selectedValue, "#SelfIgniTemperature", selfIgnitionMoreNeeded);
        };

        // PPE section methods
        function initializePpeControls() {
            indexationDetailObj.on("click", "#btnAddPpe", function (e) {
                e.preventDefault();
                var url = GetEnvironmentLocation() + '/Operations/Indexation/Ppe_Edit';
                var indexationId = $("#IndexationId").val();
                $.post(url, { indexationId: indexationId, iReference: 0, section: "PPE" },
                     function (data) {
                         $('#AddPPE').html(data).show();
                     });
            });

            indexationDetailObj.on("click", "#btnDiscardPPE", function (e) {
                e.preventDefault();
                $('#AddPPE').empty();
            });

            indexationDetailObj.on("click", "#btnSavePPE", function (e) {
                e.preventDefault();

                var form = $("#FormEditPPE");
                var url = form.attr("action");
                var formData = form.serialize();
                $.post(url, formData, function (data) {
                    if (data.result === "success") {
                        $(this).savedSuccessFully(data.message);
                        $('#AddPPE').empty();
                        var grid = $("#GridPPE").data("kendoGrid");
                        grid.dataSource.read();
                    } else {
                        if (data.popupMessage)
                            $(this).displayError(data.popupMessage);
                    }
                });
                return true;
            });

            indexationDetailObj.on("click", "#ancPpeBatchDelete", function(e) {
                e.preventDefault();
                batchDeleteObjects("GridPPE", "ppe indexation", GetEnvironmentLocation() + "/Operations/Indexation/BatchDeleteSafetyIndexation");
            });



            //Pictograms
            indexationDetailObj.on("click", "#btnAddPpePictograms", function (e) {
                e.preventDefault();
                if ($("#popupPpePictograms").length > 0) {
                    var grid = $("#GridSearchPpePictograms").data("kendoGrid");
                    grid.dataSource.read();
                }
                $("#popupPpePictograms").modal("show");
            });

            indexationDetailObj.on("click", "#ancPpePictogramBatchDelete", function(e) {
                e.preventDefault();
                batchDeleteObjects("GridPPEPictogram", "ppe pictograms", GetEnvironmentLocation() + "/Operations/Indexation/BatchDeletePpePictograms");
            });

            indexationDetailObj.on("click", "#btnSelectPpePictograms", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchPpePictograms").data("kendoGrid");
                if (grid.dataSource.total() === 0) {
                    $(this).displayError("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    $(this).displayError("No rows selected");
                    return;
                }
                if (grid.select().length > 1) {
                    var rows = grid.select();
                    var ppepictogramlists = [];
                    rows.each(
                        function(index, row) {
                            var selectedItem = grid.dataItem(row);
                            ppepictogramlists.push(selectedItem.Reference);
                        }
                    );
                    addPpePictogramList(ppepictogramlists);
                } else {
                    addPpePictogram(selectedData.Reference);
                }
            });

            indexationDetailObj.on("dblclick", "#GridSearchPpePictograms table tr", function() {
                searchGridDoubleClick("#GridSearchPpePictograms", "#btnSelectPpePictograms");
            });
        }

        function addPpePictogram(reference) {
            var url = GetEnvironmentLocation() + '/Operations/Indexation/RegPPEPic_Create';
            var indexationId = $("#IndexationId").val();
            $.post(url, { iReference: reference, indexationId: indexationId },
                function (data) {
                    $("#popupPpePictograms").modal("hide");
                    $(this).savedSuccessFully(data);
                    var pictogramGrid = $("#GridPPEPictogram").data("kendoGrid");
                    pictogramGrid.dataSource.read();
                });
        }

        function addPpePictogramList(ppepictogramlists) {
            var urlmultiple = GetEnvironmentLocation() + '/Operations/Indexation/RegPPEPic_CreateList';
            var indexationId = $("#IndexationId").val();
            $.post(urlmultiple, { pictogramList: JSON.stringify(ppepictogramlists), indexationId: indexationId },
                function (data) {
                    $("#popupPpePictograms").modal("hide");
                    $(this).savedSuccessFully(data);
                    var pictogramGrid = $("#GridPPEPictogram").data("kendoGrid");
                    pictogramGrid.dataSource.read();
                });
        }

        function onPpeHmisChange() {
            var ppeHmisPictogramGrid = $("#GridPPEHMISPictograms").data("kendoGrid");
            ppeHmisPictogramGrid.dataSource.read();
        }

        function getSelectedPpeHmisReference() {
            var selectedPpe = 0;
            var dropdownlist = $('#PpeHmisReference').data("kendoDropDownList");
            if (dropdownlist)
                selectedPpe = dropdownlist.select();

            return { selectedPpe: selectedPpe };
        }

        var onPpeReady = function() {
            $('#popupPpePictograms').modal({
                keyboard: false,
                show: false,
                backdrop: true
            });

            var url = GetEnvironmentLocation() + '/Operations/Indexation/GetSearchPpePictograms';
            $.post(url, function (data) {
                $("#dgPpePictogramsPlugIn").html(data);
            });

        };

        function onIngredientSearchCriteriaError(e) {

            alert(e.errors);
        }

    
        var initialNonSdsValues = '';

        // Non Sds Indexing Methods
        function initializeNonSdsControls() {
            var mainContent = $('.main-content');
            if (mainContent.length > 0) {
         //       kendo.ui.progress(mainContent, true);

                var nonSdsContentFrame = $('#NonSdsIndexingIframe');
                if (nonSdsContentFrame.length > 0) {

                    nonSdsContentFrame.on('load', function () {
                        var frameContents = $(this).contents();
                        if (frameContents.length > 0) {

                            // Keep track of the initial indexing values
                            var form = frameContents.find('#NonSdsIndexingContent');
                            if (form.length > 0)
                                initialNonSdsValues = form.serialize();

                            setiFrameHeight(nonSdsContentFrame, frameContents);

                            frameContents.on('click', '#btnSaveNonSdsIndexing', function () {
                                form = $(this).parents('#NonSdsIndexingContent');
                                form.submit();
                            });

                            frameContents.on('click', '#btnDiscardNonSdsIndexing', function (e) {
                                e.preventDefault();

                                var form = $(this).parents('#NonSdsIndexingContent');
                                if (form.length > 0) {

                                        // Check if any changes are found
                                    if (initialNonSdsValues !== form.serialize()) {
                                        confirmUserSelection('Confirm Indexing Cancel', 'All indexing changes will be reverted. Are you sure you would like to cancel indexing?', function () {
                                            nonSdsContentFrame.attr('src', nonSdsContentFrame.attr('src'));
                                        });
                                    }
                                }
                            });

                            var contentContainer = frameContents.find('.nethub-container');
                            if (contentContainer.length > 0) {

                                var observer = new MutationObserver(function () {
                                    setiFrameHeight();
                                });

                                var config = { subtree: true, attributes: true, childList: true, characterData: true };
                                observer.observe(contentContainer[0], config);
                            }
                        }

                  //      kendo.ui.progress(mainContent, false);
                    });
                }
            }
        }

        function setiFrameHeight(parentFrame, contentFrame) {
            if (!parentFrame) {
                parentFrame = $('#NonSdsIndexingIframe');
                if (parentFrame.length > 0) {
                    contentFrame = parentFrame.contents();
                }
            }

            var htmlPadding = 23;
            contentFrame.find('html').css('padding', htmlPadding + 'px');
            contentFrame.find('body').css('padding', '0');

            var nethubContent = contentFrame.find('#NonSdsIndexingContent');
            parentFrame.height(nethubContent.height() +(htmlPadding * 2) + 'px');
        }



        


        // Exposed methods
        return {
            getDocRevisionId: getDocRevisionId,
            getIndexationId: getIndexationId,
            getRsPhraseSearchCriteria: getRsPhraseSearchCriteria,
            getSelectedPpe: getSelectedPpe,
            getSelectedPpeHmisReference: getSelectedPpeHmisReference,
            loadIndexationPlugin: loadIndexationPlugin,
            loadNonSdsIndexationPlugin: loadNonSdsIndexationPlugin,
            loadWorkLoadPlugIn: loadWorkLoadPlugIn,
            onAttachmentRequestEnd: onAttachmentRequestEnd,
            onBoilingPointOperatorChange: onBoilingPointOperatorChange,
            onFlameExtensionOperatorChange: onFlameExtensionOperatorChange,
            onFlashPointOperatorChange: onFlashPointOperatorChange,
            onSelfIgnitionOperatorChange: onSelfIgnitionOperatorChange,
            onGravityOperatorChange: onGravityOperatorChange,
            onGridEditChangeTitle: onGridEditChangeTitle,
            onGridHazardClassChange: onGridHazardClassChange,
            onGridHazardClassRequestComplete: onGridHazardClassRequestComplete,
            onGridHazardStatementChange: onGridHazardStatementChange,
            onGridHazardStatementRequestComplete: onGridHazardStatementRequestComplete,
            onGridIngredientChange: onGridIngredientChange,
            onGridIngredientOrderChange: onGridIngredientOrderChange,
            onGridFirstAidChange: onGridFirstAidChange,
            onGridFirstAidRequestComplete:onGridFirstAidRequestComplete,
            onGridPrecautionaryStatementChange: gridPrecautionaryStatementChange,
            onGridPrecautionaryStatementRequestComplete: onGridPrecautionaryStatementRequestComplete,
            onGridTransportModeRequestComplete: onGridTransportModeRequestComplete,
            onGridHandlingStorageChange: onGridHandlingStorageChange,
            onGridHandlingStorageRequestComplete: onGridHandlingStorageRequestComplete,
            onGridPPERequestComplete: onGridPPERequestComplete,
            onGridPPEChange: onGridPPEChange,
            onHmisPpeChange: onHmisPpeChange,
            onIngredientSearchReady: onIngredientSearchReady,
            onRegEuropePartialReady: onRegEuropePartialReady,
            onRegGhsPartialReady: onRegGhsPartialReady,
            onIngredientConcentrationChange: onIngredientConcentrationChange,
            onIngredientOperatorChange: onIngredientOperatorChange,
            onIngredientSelection: onIngredientSelection,
            onMultiDeleteGridDataBinding: onMultiDeleteGridDataBinding,
            onMultiDeleteGridDataBound: onMultiDeleteGridDataBound,
            onPhysChemPropertiesPartialReady: onPhysChemPropertiesPartialReady,
            onPpeReady: onPpeReady,
            onRegOthersPartialReady: onRegOthersPartialReady,
            onPpeHmisChange: onPpeHmisChange,
            onSaveReachUse: onSaveReachUse,
            onRegulatoryGhsActivate: onRegulatoryGhsActivate,
            onSaveNameNumber: onSaveNameNumber,
            onGridTransportModeChange: onGridTransportModeChange,
            onViscosity1Change: onViscosity1Change,
            onViscosity2Change: onViscosity2Change,
            onVocCodeChange: onVocCodeChange,
            onVocMuTypeChange: onVocMuTypeChange,
            onVocWeightMuChange: onVocWeightMuChange,
            onVocVolumeMuChange: onVocVolumeMuChange,
            onVocOperatorChange: onVocOperatorChange,
            onVolatilityChange: onVolatilityChange,
            onSaveNonSdsIndexation: onSaveNonSdsIndexation,
            onIngredientSearchCriteriaError: onIngredientSearchCriteriaError
        };
    };

})(jQuery);