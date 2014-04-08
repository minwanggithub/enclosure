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

        // General indexation methods
        var loadIndexationPlugin = function() {
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

            initializeIdentificationControls();
            initializeIngredientControls();
            initializePhysicalChemicalControls();
            initializeTransportControls();
            initializeAmericanControls();
            initializeCanadianControls();
            initializeEuropeanControls();
            initializeGhsControls();
            initializeOthersControls();
            initializeHandlingStorageControls();
            initializeFirstAidControls();
            initializePpeControls();
        };

        var loadWorkLoadPlugIn = function() {
            initializeIngredientControls();
            initializeAmericanControls();
            initializeCanadianControls();
            initializeEuropeanControls();
            initializeGhsControls();
            initializeOthersControls();
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
                if (i != 0 && currentNameOrNumber == row.NameOrNumber) {
                    alert("Duplicates not allowed");
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
                if (i != 0 && currentNameOrNumber == row.ReachUse) {
                    alert("Duplicates not allowed");
                    e.preventDefault();
                    return false;
                }
                return true;
            });
        };

        // Helper Methods
        function operatorDropdownChange(selectedValue, fromDdl, toDdl, moreNeeded) {
            $("#" + fromDdl + ", #" + toDdl).val("").prop("disabled", onElementDisable);

            if (!selectedValue || selectedValue == 7) {
                $("#" + fromDdl + ", #" + toDdl).val("").prop("disabled", true);
            } else if (selectedValue == 8) {
                $("#" + fromDdl + ", #" + toDdl).val("").prop("disabled", false);
            } else {
                $("#" + fromDdl).prop("disabled", false);
                $("#" + toDdl).val("").prop("disabled", true);
            }

            // If a function was passed to complete the task continue with that
            if (moreNeeded) {
                moreNeeded(selectedValue);
            }
        };

        function onElementDisable(index, oldPropertyValue) {
            if (oldPropertyValue == false) {
                removeValidationToolTips(this);
            }
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

        function isValidInteger(val) {
            return val.length > 0 && !isNaN(val) && val == (val | 0);
        }

        function isValidDecimal(val) {
            var decimalVal = parseFloat(val);
            return decimalVal == val;
        }

        function searchGridDoubleClick(searchGrid, button) {
            var grid = $(searchGrid).data("kendoGrid");
            if (grid.dataSource.total() > 0) {
                $(button).trigger('click');
            }
        }

        // Menu methods
        function initializeMenu() {

            // Place the menu at the correct location
            var menu = $(name);
            menuYloc = parseInt(menu.css("top").substring(0, menu.css("top").indexOf("px")));
            $(window).scroll(function () {
                var offset = menuYloc + $(document).scrollTop() + "px";
                menu.animate({ top: offset }, { duration: 500, queue: false });
            });

            menu.on("click", "a", onMenuItemSelected);
        }

        function linkMouseEnter() {
            $(this).css("color", "#8DC73F");
        }

        function linkMouseLeave() {
            $(this).css("color", "#fff");
        }

        function onMenuItemSelected() {

            // Reset all elements associated with the current item
            var self = $(this);
            self.css('color', "#8DC73F").off('mouseenter mouseleave');
            self.parents('tr')
                .find('a')
                .not(self)
                .css("color", "#fff")
                .on({
                    mouseenter: linkMouseEnter,
                    mouseleave: linkMouseLeave
                });
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
                    $.post(url, formData, function(data) {
                        $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    });
                } else {
                    return false;
                }
            });
        }

        var onAttachmentRequestEnd = function (e) {
            if (!e.response || e.response.length == 0) {
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

            indexationDetailObj.on("click", "#AddIngredient", function (e) {
                e.preventDefault();
                if ($("#SearchIngredientWindow").length > 0) {
                    var window = $("#SearchIngredientWindow").data("kendoWindow");
                    window.destroy();
                }
                var indexationId = $("#IndexationId").val();
                var url = '../Indexation/AddIngredient';
                $.post(url, { indexationId: indexationId },
                    function (data) {
                        $('#EditIngredient').html(data);
                    });
            });

            indexationDetailObj.on("click", "#SearchByCAS, #SearchByIngredient", function (e) {
                e.preventDefault();
                $("#SearchIngredientWindow").closest(".k-window").css({
                    top: 100,
                    left: 100
                });
                $("#SearchIngredientWindow").data("kendoWindow").center();
                $("#SearchIngredientWindow").data("kendoWindow").open();
            });

            indexationDetailObj.on("click", "#btnSaveIngredient", function (e) {
                e.preventDefault();

                var validator = retrieveIngredientValidator();
                if (validator.validate()) {
                    var form = $("#ingredientForm");
                    var url = form.attr("action");
                    var formData = form.serialize();
                    $.post(url, formData, function (data) {
                        if (data.result == "success") {
                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data.message);
                            $('#EditIngredient').empty();
                            if ($("#SearchIngredientWindow").length > 0) {
                                var window = $("#SearchIngredientWindow").data("kendoWindow");
                                window.destroy();
                            }
                            var grid = $("#GridIngredients").data("kendoGrid");
                            grid.dataSource.read();
                            return true;
                        } else {
                            alert(data.message);
                            return false;
                        }
                    });
                } else {
                    return false;
                }
            });

            indexationDetailObj.on("keyup", "#CasNumber", function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code == 13) { //Search only on enter
                    var url = '../Indexation/LookUpIngredientOnKeyEnter';

                    // Double check user input is an 'signed integer'
                    var ingCasNo = $("#CasNumber").val();
                    if (isValidInteger(ingCasNo)) {
                        var indexationId = $("#IndexationId").val();
                        if (ingCasNo != '') {
                            $.ajax({
                                url: url,
                                data: { ingCasNo: ingCasNo, indexationId: indexationId },
                                type: "POST",
                                success: function(data) {
                                    if (data != '') {
                                        onIngredientSelection(data);
                                    } else {
                                        alert('No ingredient was found with the Cas Code of "' + ingCasNo + '"');
                                        $('#CasNumber').val("");
                                    }
                                }, 
                                error: function () {
                                    alert('No ingredient was found with the Cas Code of "' + ingCasNo + '"');
                                    $('#CasNumber').val("");
                                }

                            });
                        }
                    } else {
                        alert('Use a valid CasNumber to search.');
                    }
                }
            });

            $(document).on("dblclick", "#gdIngredientsSearch table tr", function () {
                searchGridDoubleClick("#gdIngredientsSearch", "#btnSelectIngredient");
            });
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
                        if (!input.val()) {
                            return ingredientToRequired;
                        } else {
                            return input.data('valNumber');
                        }
                    },
                    ingredientsearch: function () {
                        var ingredientId = $('#ingredientForm').find('#IngredientId').val();
                        var cacheObj = ingredientCache.cache[ingredientId];
                        if (cacheObj.searching) {
                            return ingredientSearching;
                        } else {
                            return cacheObj.valid ? '' : ingredientMissing;
                        }
                    },
                    validnumber: function (input) {
                        return input.data('valNumber');
                    }
                },
                rules: {
                    fromvaluerequired: function (input) {
                        if (input.is('[id="OperatorFrom"]')) {
                            if (isValidDecimal(input.val())) {
                                return input.val() >= input.data('valRangeMin') || input.val() <= input.data('valRangeMax');
                            } else {
                                return false;
                            }
                        }

                        // Nothing to see here
                        return true;
                    },
                    tovaluerequired: function (input) {
                        if (input.is('[id="OperatorTo"]')) {
                            return isValidDecimal(input.val());
                        }

                        // Nothing to see here
                        return true;
                    },
                    ingredientsearch: function (input) {
                        var validationUrl = input.data("valRemoteUrl");
                        if (typeof validationUrl !== 'undefined' && validationUrl) {

                            // Attempt to check if we have already checked this value
                            var ingredientId = $('#ingredientForm').find('#IngredientId').val();
                            var cacheObj = ingredientCache.cache[ingredientId] = ingredientCache.cache[ingredientId] || {};
                            cacheObj.searching = true;

                            var settings = {
                                 ingredientId: ingredientId,
                                 url: validationUrl
                            };

                            if (cacheObj.value == settings.ingredientId && cacheObj.valid) {
                                return true;
                            }

                            if (cacheObj.value == settings.ingredientId && !cacheObj.valid) {
                                cacheObj.searching = false;
                                return false;
                            }

                            ingredientCache.check(input, settings);

                            // Automatically set to false to display searching ingredient
                            return false;
                        }

                        // Nothing to see here
                        return true;
                    },
                    validnumber: function (input) {
                        if (input.is('[id="AuthorizationNumber"]') || input.is('[id="RegistrationNumber"]')) {
                            if (input.val()) {
                                return isValidInteger(input.val());
                            }
                        } 
                        
                        return true;
                    }
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

        var onGridIngredientChange = function(e) {
            e.preventDefault();
            var selectedData = this.dataItem(this.select());
            var url = '../Indexation/GetIngredientDetail';
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
            if (e.type == "destroy") {
                $("#EditIngredient").html("");
            }
        };

        var onIngredientConcentrationChange = function(e) {
            var selectedValue = e.sender._selectedValue;
            if (selectedValue > 0) {
                $("#SelectIngOperator").data("kendoDropDownList").enable(true);
            } else {
                $("#SelectIngOperator").data("kendoDropDownList").select(0);
                $("#SelectIngOperator").data("kendoDropDownList").enable(false);

                removeValidationToolTips($("#SelectIngOperator"));
                operatorDropdownChange(selectedValue, "OperatorFrom", "OperatorTo");
            }
        };

        var onIngredientOperatorChange = function (e) {
            operatorDropdownChange(e.sender._selectedValue, "OperatorFrom", "OperatorTo");
        };

        var onIngredientSelection = function(data) {

            var ingredientForm = $('#ingredientForm');
            ingredientForm.find('#CasNumber')
                .val(data.CasNumber)
                .end()
                .find('#IngredientsUsualName')
                .val(data.IngredientsUsualName)
                .end()
                .find('#IngredientId')
                .val(data.IngredientId);

            var synonymElement = ingredientForm.find('#IngredientSynonyms');
            for (var i = 0; i < data.IngredientSynonyms.length; i++) {
                $('<option>',
                    {
                        text: data.IngredientSynonyms[i].IngredientSynonymText,
                        value: data.IngredientSynonyms[i].IngredientSynonymId
                    }).appendTo(synonymElement);
            }

            removeValidationToolTips('#IngredientsUsualName');

            // Add to the cache so the check does not need to happen
            ingredientCache.addToCache(data.IngredientId);
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
                        $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    });
                    return true;
                } else {
                    return false;
                }
            });

            indexationDetailObj.on("change", "input[type=radio][name=SelectCoeffDistrib]", function () {
                var selectedItem = $(this).val();
                if (selectedItem == 3) {
                    $("#CoeffDistribEquals").prop("disabled", false);
                } else {
                    $("#CoeffDistribEquals").val("").prop("disabled", true);
                }
            });
        }

        function boilingPointMoreNeeded(selectedValue) {
            if (!selectedValue || selectedValue == 7) {
                $('#SelectCfkrBoilingPoint').data("kendoDropDownList").select(0);
                $('#SelectCfkrBoilingPoint').data("kendoDropDownList").enable(false);
            } else {
                $('#SelectCfkrBoilingPoint').data("kendoDropDownList").enable(true);
            }
        }

        function flashPointMoreNeeded(selectedValue) {
            if (!selectedValue || selectedValue == 7) {
                $('#SelectFlashPointTempUnit').data("kendoDropDownList").select(0);
                $('#SelectFlashPointTempUnit').data("kendoDropDownList").enable(false);
            } else {
                $('#SelectFlashPointTempUnit').data("kendoDropDownList").enable(true);
            }
        }

        function volatilityMoreNeeded(selectedValue) {
            if (!selectedValue || selectedValue == 7) {
                $('#SelectFromToVolatility').data("kendoDropDownList").select(0);
                $('#SelectFromToVolatility').data("kendoDropDownList").enable(false);
            } else {
                $('#SelectFromToVolatility').data("kendoDropDownList").enable(true);
            }
        }

        function viscosity2MoreNeeded(selectedValue) {
            if (!selectedValue || selectedValue == 7) {
                $("#SelectFromToViscosity").data("kendoDropDownList").select(0);
                $("#SelectFromToViscosity").data("kendoDropDownList").enable(false);
                $("#SelectAtViscosity").data("kendoDropDownList").select(0);
                $("#SelectAtViscosity").data("kendoDropDownList").enable(false);
                $("#AtViscosity").val("").prop("disabled", true);
            } else {
                $("#SelectFromToViscosity").data("kendoDropDownList").enable(true);
                $("#SelectAtViscosity").data("kendoDropDownList").enable(true);
                $("#AtViscosity").prop("disabled", false);
            }
        }

        function initializePhysicalChemicalValidator() {

            physicalChemicalValidator = $('#FormPhyChemProperties').kendoValidator({
                messages: {
                    decimalvalidate: function (input) {
                        return input.data('valNumber');
                    }
                },
                rules: {
                    decimalvalidate: function(input) {
                        if (input.is('[class="val-decimal"]') && input.val()) {
                            return isValidDecimal(input.val());
                        }

                        return true;
                    }
                }

            }).data('kendoValidator');

            return physicalChemicalValidator;
        }

        var onBoilingPointOperatorChange = function (e) {
            operatorDropdownChange(e.sender._selectedValue, "FromBoilingPoint", "ToBoilingPoint", boilingPointMoreNeeded);
        };

        var onFlashPointOperatorChange = function (e) {
            operatorDropdownChange(e.sender._selectedValue, "FromFlashPoint", "ToFlashPoint", flashPointMoreNeeded);
        };

        var onGravityOperatorChange = function (e) {
            operatorDropdownChange(e.sender._selectedValue, "FromSpecificGravity", "ToSpecificGravity");
        };

        var onViscosity1Change = function(e) {
            var selectedValue = e.sender._selectedValue;
            if (selectedValue == 1) {
                $("#SelectViscosity2").data("kendoDropDownList").enable(true);
            } else {
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
                $("#SelectMuType").data("kendoDropDownList").select(0);
                $("#SelectMuType").data("kendoDropDownList").enable(false);
                $("#SelectParticularity").data("kendoDropDownList").select(0);
                $("#SelectParticularity").data("kendoDropDownList").enable(false);
                $("#Warning").prop("disabled", true).prop("checked", false);

                removeValidationToolTips($('#SelectOperator'));
                removeValidationToolTips($('#SelectMuType'));
                removeValidationToolTips($('#SelectParticularity'));
                operatorDropdownChange("", "FromVoc", "ToVoc");

                $("#SelectMuType").data("kendoDropDownList").trigger("change");

            } else {
                $("#SelectOperator").data("kendoDropDownList").enable(true);
                $("#SelectMuType").data("kendoDropDownList").enable(true);
                $("#SelectParticularity").data("kendoDropDownList").enable(true);
                $("#Warning").prop("disabled", false);
            }
        };

        var onVocMuTypeChange = function (e) {
            var selectedValue = e.sender._selectedValue;
            if (selectedValue == 4) {
                $("#SelectWeightMu").data("kendoDropDownList").enable(true);
                $("#SelectVolumeMu").data("kendoDropDownList").enable(true);

            } else {
                $("#SelectWeightMu").data("kendoDropDownList").select(0);
                $("#SelectWeightMu").data("kendoDropDownList").enable(false);
                $("#SelectVolumeMu").data("kendoDropDownList").select(0);
                $("#SelectVolumeMu").data("kendoDropDownList").enable(false);

                removeValidationToolTips($('#SelectWeightMu'));
                removeValidationToolTips($('#SelectVolumeMu'));
            }
        };

        var onVocOperatorChange = function (e) {
            operatorDropdownChange(e.sender._selectedValue, "FromVoc", "ToVoc");
        };

        var onVolatilityChange = function(e) {
            operatorDropdownChange(e.sender._selectedValue, "FromVolatility", "ToVolatility", volatilityMoreNeeded);
        };

        // Transport section methods
        function initializeTransportControls()
        {
            indexationDetailObj.on("click", "#btnAddTransClass", function (e) {
                e.preventDefault();
                if ($("#popupTransClassSearch").length > 0) {
                    var grid = $("#GridSearchTransClass").data("kendoGrid");
                    grid.dataSource.read();
                }
                $("#popupTransClassSearch").modal("show");
            });

            indexationDetailObj.on("click", "#btnSaveTransport", function (e) {
                e.preventDefault();
                var form = $("#FormTransport");
                if (form.valid()) {
                    var url = form.attr("action");
                    var formData = form.serialize();
                    $.post(url, formData, function (data) {
                        $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    });
                    return true;
                } else {
                    return false;
                }
            });

            indexationDetailObj.on("click", "#btnSelectTransClass", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchTransClass").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    alert("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    alert("No rows selected");
                    return;
                }

                if (grid.select().length > 1) {
                    var rows = grid.select();
                    var transclasslists = [];
                    rows.each(
                        function (index, row) {
                            var selectedItem = grid.dataItem(row);
                            transclasslists.push(selectedItem.Reference);
                        }
                    );
                    addTransportClassificationList(transclasslists);
                    return;
                }
                addTransportClassification(selectedData.Reference);
            });

            indexationDetailObj.on("dblclick", "#GridSearchTransClass table tr", function () {
                searchGridDoubleClick("#GridSearchTransClass", "#btnSelectTransClass");
            });
        }

        function addTransportClassification(reference) {
            var url = '../Indexation/TransClass_Create';
            var indexationId = $("#IndexationId").val();
            $.post(url, { iReference: reference, indexationId: indexationId },
                function (data) {
                    $("#popupTransClassSearch").modal("hide");
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    var transClassGrid = $("#GridTransClass").data("kendoGrid");
                    transClassGrid.dataSource.read();
                });
        }

        function addTransportClassificationList(transclasslists) {
            var urlmultiple = '../Indexation/TransClass_CreateList';
            var indexationId = $("#IndexationId").val();
            $.post(urlmultiple, { classificationList: JSON.stringify(transclasslists), indexationId: indexationId },
                function (data) {
                    $("#popupTransClassSearch").modal("hide");
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    var transClassGrid = $("#GridTransClass").data("kendoGrid");
                    transClassGrid.dataSource.read();
                });
        }

        // American regulatory section methods
        function initializeAmericanControls() {

            indexationDetailObj.on("click", "#btnSaveRegAmerican", function (e) {
                e.preventDefault();
                var form = $("#FormRegAmerican");
                if (form.valid()) {
                    var url = form.attr("action");
                    var formData = form.serialize();
                    $.post(url, formData, function (data) {
                        $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    });
                    return true;
                } else {
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

            indexationDetailObj.on("click", "#btnSelectAmericanClass", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchAmericanClass").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    alert("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    alert("No rows selected");
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
            var url = '../Indexation/AmericanClass_Create';
            var indexationId = $("#IndexationId").val();
            $.post(url, { iReference: reference, indexationId: indexationId },
                function (data) {
                    $("#popupAmericanClassSearch").modal("hide");
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    var americanClassGrid = $("#GridRegAmerican").data("kendoGrid");
                    americanClassGrid.dataSource.read();
                });
        }

        function addAmericaClassificationList(americaclasslists) {
            var urlmultiple = '../Indexation/AmericanClass_CreateList';
            var indexationId = $("#IndexationId").val();
            $.post(urlmultiple, { classificationList: JSON.stringify(americaclasslists), indexationId: indexationId },
                function (data) {
                    $("#popupAmericanClassSearch").modal("hide");
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    var americanClassGrid = $("#GridRegAmerican").data("kendoGrid");
                    americanClassGrid.dataSource.read();
                });
        }

        var getSelectedPpe = function () {
            var selectedPpe = 0;
            var dropdownlist = $('#SelectHmisppe').data("kendoDropDownList");
            if (dropdownlist) {
                selectedPpe = dropdownlist.select();
            }

            return { selectedPpe: selectedPpe };
        };

        var onHmisPpeChange = function(e) {
            var hmisPictogramGrid = $("#GridHMISPictograms").data("kendoGrid");
            hmisPictogramGrid.dataSource.read();
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

            indexationDetailObj.on("click", "#btnSelectCanadaClass", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchCanadaClass").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    alert("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    alert("No rows selected");
                    return;
                }
                if (grid.select().length > 1) {
                    var rows = grid.select();
                    var canadaclasslists = [];
                    rows.each(
                        function (index, row) {
                            var selectedItem = grid.dataItem(row);
                            canadaclasslists.push(selectedItem.Reference);
                        }
                    );
                    addCanadaClassificationList(canadaclasslists);
                    return;
                }
                addCanadaClassification(selectedData.Reference);
            });

            indexationDetailObj.on("dblclick", "#GridSearchCanadaClass table tr", function (e) {
                searchGridDoubleClick("#GridSearchCanadaClass", "#btnSelectCanadaClass");
            });
        }

        function addCanadaClassification(reference) {
            var url = '../Indexation/RegCanadian_Create';
            var indexationId = $("#IndexationId").val();
            $.post(url, { iReference: reference, indexationId: indexationId },
                function (data) {
                    $("#popupCanadaClassSearch").modal("hide");
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    var canadaClassGrid = $("#GridRegCanadian").data("kendoGrid");
                    canadaClassGrid.dataSource.read();
                });
        }

        function addCanadaClassificationList(canadaclasslists) {
            var urlmultiple = '../Indexation/RegCanadian_CreateList';
            var indexationId = $("#IndexationId").val();
            $.post(urlmultiple, { classificationList: JSON.stringify(canadaclasslists), indexationId: indexationId },
                function (data) {
                    $("#popupCanadaClassSearch").modal("hide");
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    var canadaClassGrid = $("#GridRegCanadian").data("kendoGrid");
                    canadaClassGrid.dataSource.read();
                });
        }

        // European regulatory section methods
        function initializeEuropeanControls() {

            indexationDetailObj.on("click", "#btnAddEuropeRSPhrase", function (e) {
                e.preventDefault();
                if ($("#popupRSPhraseSearch").length > 0) {
                    var grid = $("#GridSearchRSPhrase").data("kendoGrid");
                    grid.dataSource.read();
                }
                $("#popupRSPhraseSearch").modal("show");
            });

            indexationDetailObj.on("click", "#btnSelectRSPhrase", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchRSPhrase").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    alert("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    alert("No rows selected");
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
                    addRsPhraseList(rsphraselists);
                    return;
                }
                addRsPhrase(selectedData.Reference);
            });

            indexationDetailObj.on("dblclick", "#GridSearchRSPhrase table tr", function (e) {
                searchGridDoubleClick("#GridSearchRSPhrase", "#btnSelectRSPhrase");
            });
        }

        function addRsPhrase(reference) {
            var url = '../Indexation/RSPhrase_Create';
            var indexationId = $("#IndexationId").val();
            $.post(url, { iReference: reference, indexationId: indexationId },
                function (data) {
                    $("#popupRSPhraseSearch").modal("hide");
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    var rsPhraseGrid = $("#GridRegEuropeRSPhrase").data("kendoGrid");
                    var europeClassGrid = $("#GridRegEuropeClassification").data("kendoGrid");
                    rsPhraseGrid.dataSource.read();
                    europeClassGrid.dataSource.read();
                });
        }

        function addRsPhraseList(rsphraselists) {
            var urlmultiple = '../Indexation/RSPhrase_CreateList';
            var indexationId = $("#IndexationId").val();
            $.post(urlmultiple, { rsPhraseList: JSON.stringify(rsphraselists), indexationId: indexationId },
                function (data) {
                    $("#popupRSPhraseSearch").modal("hide");
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    var rsPhraseGrid = $("#GridRegEuropeRSPhrase").data("kendoGrid");
                    var europeClassGrid = $("#GridRegEuropeClassification").data("kendoGrid");
                    rsPhraseGrid.dataSource.read();
                    europeClassGrid.dataSource.read();
                });
        }

        // GHS regulatory section methods
        var ghsHazardClassValidator = null;
        var ghsHazardStatementValidator = null;
        var ghsPrecautionaryStatementValidator = null;

        function initializeGhsControls() {

            indexationDetailObj.on("click", "#btnSaveRegulatoryGhs", function (e) {
                e.preventDefault();

                var validator = $("#FormRegulatoryGHS").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var form = $("#FormRegulatoryGHS");
                    var url = form.attr("action");
                    var formData = form.serialize();
                    $.post(url, formData, function (data) {
                        $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    });
                    return true;

                } else {
                    return false;
                }
            });

            indexationDetailObj.on("click", "#btnAddHazardClass", onAddHazardClassButtonClick);

            indexationDetailObj.on("change", "#HClassNotProvided", function () {
                var url = '../Indexation/SaveHClassNotProvided';
                var indexationId = $("#IndexationId").val();
                if ($(this).is(":checked")) {
                    $('#AddEditHazardClass').empty();
                    $.post(url, { hClassNotProvided: true, indexationId: indexationId },
                        function (data) {
                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                            var hClassGrid = $("#GridHazardClass").data("kendoGrid");
                            hClassGrid.dataSource.read();
                            $("#btnAddHazardClass").addClass("k-state-disabled");
                            indexationDetailObj.off("click", "#btnAddHazardClass", onAddHazardClassButtonClick);
                        });
                } else {
                    $.post(url, { hClassNotProvided: false, indexationId: indexationId },
                        function (data) {
                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                            $("#btnAddHazardClass").removeClass("k-state-disabled");
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
                $("#ClassId").val("");
                $("#OtherClass").prop("disabled", false);

                if (ghsHazardClassValidator) {
                    ghsHazardClassValidator.validateInput($('#Class'));
                    ghsHazardClassValidator.validateInput($('#OtherClass'));
                }
            });

            indexationDetailObj.on("click", "#btnSelectHazardClass", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchHazardClass").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    alert("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    alert("No rows selected");
                    return;
                }
                $("#popupHazardClass").modal("hide");

                $("#OtherClass").val("");
                $("#OtherClass").prop("disabled", true);

                $("#Class").val(selectedData.Description);
                $("#ClassId").val(selectedData.Reference);

                if (ghsHazardClassValidator) {
                    ghsHazardClassValidator.validateInput($('#Class'));
                    ghsHazardClassValidator.validateInput($('#OtherClass'));
                }
            });

            indexationDetailObj.on("dblclick", "#GridSearchHazardClass table tr", function (e) {
                searchGridDoubleClick("#GridSearchHazardClass", "#btnSelectHazardClass");
            });

            indexationDetailObj.on("click", "#SearchByCategory", function (e) {
                e.preventDefault();
                $("#popupHazardCategory").modal("show");
            });

            indexationDetailObj.on("click", "#btnEnableOtherHCatagory", function (e) {
                e.preventDefault();
                $("#Category").val("");
                $("#CategoryId").val("");
                $("#OtherCategory").prop("disabled", false);

                if (ghsHazardClassValidator) {
                    ghsHazardClassValidator.validateInput($('#Category'));
                    ghsHazardClassValidator.validateInput($('#OtherCategory'));
                }
            });

            indexationDetailObj.on("click", "#btnSelectHazardCategory", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchHazardCategory").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    alert("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    alert("No rows selected");
                    return;
                }
                $("#popupHazardCategory").modal("hide");

                $("#OtherCategory").val("");
                $("#OtherCategory").prop("disabled", true);

                $("#Category").val(selectedData.Description);
                $("#CategoryId").val(selectedData.Reference);

                if (ghsHazardClassValidator) {
                    ghsHazardClassValidator.validateInput($('#Category'));
                    ghsHazardClassValidator.validateInput($('#OtherCategory'));
                }
            });

            indexationDetailObj.on("dblclick", "#GridSearchHazardCategory table tr", function (e) {
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
                        $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data.message);
                        if (data.result == "success") {
                            $('#AddEditHazardClass').empty();
                            var grid = $("#GridHazardClass").data("kendoGrid");
                            grid.dataSource.read();
                        }
                    });
                    return true;

                } else {
                    return false;
                }
            });

            indexationDetailObj.on("click", "#btnDiscardHazardClass", function (e) {
                e.preventDefault();
                $('#AddEditHazardClass').empty();
            });

            indexationDetailObj.on("click", "#btnAddGhsPictograms", onAddGhsPictogramsButtonClick);

            indexationDetailObj.on("change", "#PictNotProvided", function () {
                var url = '../Indexation/SavePictNotProvided';
                var indexationId = $("#IndexationId").val();
                if ($(this).is(":checked")) {
                    $.post(url, { pictNotProvided: true, indexationId: indexationId },
                        function (data) {
                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                            var pictGrid = $("#GridRegGHSPic").data("kendoGrid");
                            pictGrid.dataSource.read();
                            $("#btnAddGhsPictograms").addClass("k-state-disabled");
                            indexationDetailObj.off("click", "#btnAddGhsPictograms", onAddGhsPictogramsButtonClick);
                        });
                } else {
                    $.post(url, { pictNotProvided: false, indexationId: indexationId },
                        function (data) {
                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                            $("#btnAddGhsPictograms").removeClass("k-state-disabled");
                            indexationDetailObj.on("click", "#btnAddGhsPictograms", onAddGhsPictogramsButtonClick);
                        });
                }
            });

            indexationDetailObj.on("click", "#btnSelectGhsPictograms", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchGhsPictograms").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    alert("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    alert("No rows selected");
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

            indexationDetailObj.on("dblclick", "#GridSearchGhsPictograms table tr", function (e) {
                searchGridDoubleClick("#GridSearchGhsPictograms", "#btnSelectGhsPictograms");
            });

            indexationDetailObj.on("click", "#SearchBySignalWord", onSignalWordSearchButtonClick);

            indexationDetailObj.on("change", "#SWordNotProvided", function () {
                if ($(this).is(":checked")) {
                    $("#SignalWord").val("").prop("disabled", true);
                    $("#SearchBySignalWord").addClass("k-state-disabled");
                    $("#SignalWordId").val(null);
                    indexationDetailObj.off("click", "#SearchBySignalWord", onSignalWordSearchButtonClick);
                } else {
                    $("#SignalWord").prop("disabled", false);
                    $("#SearchBySignalWord").removeClass("k-state-disabled");
                    indexationDetailObj.on("click", "#SearchBySignalWord", onSignalWordSearchButtonClick);
                }
            });

            indexationDetailObj.on("click", "#btnSelectGhsSignalWord", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchSignalWord").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    alert("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    alert("No rows selected");
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

            indexationDetailObj.on("change", "#HStatementNotProvided", function () {
                var url = '../Indexation/SaveHStatementNotProvided';
                var indexationId = $("#IndexationId").val();
                if ($(this).is(":checked")) {
                    $('#AddEditHazardStatement').empty();
                    $.post(url, { hStatementNotProvided: true, indexationId: indexationId },
                        function (data) {
                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                            var hStatementGrid = $("#GridHazardStatement").data("kendoGrid");
                            hStatementGrid.dataSource.read();
                            $("#btnAddHazardStatement").addClass("k-state-disabled");
                            indexationDetailObj.off("click", "#btnAddHazardStatement", onAddHazardStatementButtonClick);
                        });
                } else {
                    $.post(url, { hStatementNotProvided: false, indexationId: indexationId },
                        function (data) {
                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                            $("#btnAddHazardStatement").removeClass("k-state-disabled");
                            indexationDetailObj.on("click", "#btnAddHazardStatement", onAddHazardStatementButtonClick);
                        });
                }
            });

            indexationDetailObj.on("click", "#SearchByHazardCode", function (e) {
                e.preventDefault();
                if ($("#popupHazardStatement").length > 0) {
                    var grid = $("#GridSearchHazardStatement").data("kendoGrid");
                    grid.dataSource.read();
                }
                
                $("#popupHazardStatement").modal("show");
            });

            indexationDetailObj.on("click", "#btnEnableOtherHCode", function (e) {
                e.preventDefault();
                $("#StatementHCode, #HazardStatementId").val("");
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
                if (grid.dataSource.total() == 0) {
                    alert("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    alert("No rows selected");
                    return;
                }
                $("#popupHazardStatement").modal("hide");

                $("#StatementHCode").val(selectedData.Statement + ", " + selectedData.HCode);
                $("#OtherHCode").val(selectedData.HCode).prop("disabled", true);
                $("#OtherHStatement").val(selectedData.Statement).prop("disabled", true);
                $("#HazardStatementId").val(selectedData.Reference);

                if (ghsHazardStatementValidator) {
                    ghsHazardStatementValidator.validateInput($('#StatementHCode'));
                    ghsHazardStatementValidator.validateInput($('#OtherHCode'));
                    ghsHazardStatementValidator.validateInput($('#OtherHStatement'));
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
                        $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data.message);
                        if (data.result == "success") {
                            $('#AddEditHazardStatement').empty();
                            var grid = $("#GridHazardStatement").data("kendoGrid");
                            grid.dataSource.read();
                        }
                    });
                    return true;

                } else {
                    return false;
                }
            });

            indexationDetailObj.on("click", "#btnDiscardHazardStatement", function (e) {
                e.preventDefault();
                $('#AddEditHazardStatement').empty();
            });

            indexationDetailObj.on("click", "#btnAddPrecautionaryStatement", onAddPrecautionaryStatementButtonClick);

            indexationDetailObj.on("change", "#PStatementNotProvided", function () {
                var url = '../Indexation/SavePStatementNotProvided';
                var indexationId = $("#IndexationId").val();
                if ($(this).is(":checked")) {
                    $('#AddEditPrecautionaryStatement').empty();
                    $.post(url, { pStatementNotProvided: true, indexationId: indexationId },
                        function (data) {
                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                            var hClassGrid = $("#GridPrecautionaryStatement").data("kendoGrid");
                            hClassGrid.dataSource.read();
                            $("#btnAddPrecautionaryStatement").addClass("k-state-disabled");
                            indexationDetailObj.off("click", "#btnAddPrecautionaryStatement", onAddPrecautionaryStatementButtonClick);
                        });
                } else {
                    $.post(url, { pStatementNotProvided: false, indexationId: indexationId },
                        function (data) {
                            $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                            $("#btnAddPrecautionaryStatement").removeClass("k-state-disabled");
                            indexationDetailObj.on("click", "#btnAddPrecautionaryStatement", onAddPrecautionaryStatementButtonClick);
                        });
                }
            });

            indexationDetailObj.on("click", "#SearchByPrecautionaryCode", function (e) {
                e.preventDefault();
                if ($("#popupPStatement").length > 0) {
                    var grid = $("#GridSearchPrecautionaryStatement").data("kendoGrid");
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
                if (grid.dataSource.total() == 0) {
                    alert("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    alert("No rows selected");
                    return;
                }
                $("#popupPStatement").modal("hide");
                $("#StatementPCode").val(selectedData.Statement + ", " + selectedData.PCode);
                $("#OtherPCode").val(selectedData.PCode).prop("disabled", true);
                $("#OtherPStatement").val(selectedData.Statement).prop("disabled", true);
                $("#PrecautionaryStatementId").val(selectedData.Reference);

                if (ghsPrecautionaryStatementValidator) {
                    ghsPrecautionaryStatementValidator.validateInput($('#StatementPCode'));
                    ghsPrecautionaryStatementValidator.validateInput($('#OtherPCode'));
                    ghsPrecautionaryStatementValidator.validateInput($('#OtherPStatement'));
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
                        $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data.message);
                        if (data.result == "success") {
                            $('#AddEditPrecautionaryStatement').empty();
                            var grid = $("#GridPrecautionaryStatement").data("kendoGrid");
                            grid.dataSource.read();
                        }
                    });
                    return true;

                } else {
                    return false;
                }
            });

            indexationDetailObj.on("click", "#btnDiscardPrecautionaryStatement", function (e) {
                e.preventDefault();
                $('#AddEditPrecautionaryStatement').empty();
            });
        }

        function initializeGhsHazardClassValidator() {
            
            ghsHazardClassValidator = $("#FormRegulatoryGHS").kendoValidator({
                messages: {
                    codevalid: function(input) {
                        if (input.is('[id="Class"]')) {
                            return "Class/Code is required";
                        } else {
                            return "Other Class is required";
                        }
                    },
                    categoryvalid: function (input) {
                        if (input.is('[id="Category"]')) {
                            return "Category is required";
                        } else {
                            return "Other Category is required";
                        }
                    }
                },
                rules: {
                    codevalid: function (input) {
                        if (input.is('[id="Class"]') && !$('#ClassId').val() && $('#OtherClass').is(':disabled')) {
                            return false;
                        } else if (input.is('[id="OtherClass"]') && !input.val() && !$('#ClassId').val()) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    categoryvalid: function (input) {
                        if (input.is('[id="Category"]') && !$('#CategoryId').val() && $('#OtherCategory').is(':disabled')) {
                            return false;
                        } else if (input.is('[id="OtherCategory"]') && !input.val() && !$('#CategoryId').val()) {
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
                        if (input.is('[id="StatementHCode"]') && !$('#HazardStatementId').val() && $('#OtherHCode').is(':disabled')) {
                            return false;
                        } else if ((input.is('[id="OtherHCode"]') || input.is('[id="OtherHStatement"]')) && !input.val() && !$('#HazardStatementId').val()) {
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
            var url = '../Indexation/RegGHSPic_Create';
            var indexationId = $("#IndexationId").val();
            $.post(url, { iReference: reference, indexationId: indexationId },
                function (data) {
                    $("#popupGhsPictograms").modal("hide");
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    var pictogramGrid = $("#GridRegGHSPic").data("kendoGrid");
                    pictogramGrid.dataSource.read();
                });
        }

        function addGhsPictogramList(ghspictogramlists) {
            var urlmultiple = '../Indexation/RegGHSPic_CreateList';
            var indexationId = $("#IndexationId").val();
            $.post(urlmultiple, { pictogramList: JSON.stringify(ghspictogramlists), indexationId: indexationId },
                function (data) {
                    $("#popupGhsPictograms").modal("hide");
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    var pictogramGrid = $("#GridRegGHSPic").data("kendoGrid");
                    pictogramGrid.dataSource.read();
                });
        }

        function onAddHazardClassButtonClick(e) {
            e.preventDefault();
            var indexationId = $("#IndexationId").val();
            var url = '../Indexation/HazardClass_Edit';
            $.post(url, { indexationId: indexationId, iReference: 0 },
                function (data) {
                    $('#AddEditHazardClass').html(data).show();
                });
        };

        function onAddHazardStatementButtonClick(e) {
            e.preventDefault();
            var indexationId = $("#IndexationId").val();
            var url = '../Indexation/HazardStatement_Edit';
            $.post(url, { indexationId: indexationId, iReference: 0 },
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
            var url = '../Indexation/PrecautionaryStatement_Edit';
            $.post(url, { indexationId: indexationId, iReference: 0 },
                function (data) {
                    $('#AddEditPrecautionaryStatement').html(data).show();
                });
        }

        function onSignalWordSearchButtonClick(e) {
            e.preventDefault();
            $("#popupGhsSignalWord").modal("show");
        }

        var onGridHazardClassChange = function(e) {
            e.preventDefault();
            var selectedData = this.dataItem(this.select());
            var indexationId = $("#IndexationId").val();

            if (selectedData) {
                var url = '../Indexation/HazardClass_Edit';
                $.post(url, { indexationId: indexationId, iReference: selectedData.Reference },
                    function(data) {
                        $('#AddEditHazardClass').html(data).show();
                    });
            } else {
                hideEditorSection('AddEditHazardClass');
            }
        };

        var onGridHazardClassRequestComplete = function (e) {
            if (e.type == "destroy") {
                hideEditorSection('AddEditHazardClass');
            }
        };

        var onGridHazardStatementChange = function(e) {
            var selectedData = this.dataItem(this.select());
            var indexationId = $("#IndexationId").val();

            if (selectedData) {
                var url = '../Indexation/HazardStatement_Edit';
                $.post(url, { indexationId: indexationId, iReference: selectedData.Reference },
                    function (data) {
                        $('#AddEditHazardStatement').html(data).show();
                    });
            } else {
                hideEditorSection('AddEditHazardStatement');
            }
        };

        var onGridHazardStatementRequestComplete = function (e) {
            if (e.type == "destroy") {
                hideEditorSection('AddEditHazardStatement');
            }
        };

        var gridPrecautionaryStatementChange = function(e) {
            var selectedData = this.dataItem(this.select());
            var indexationId = $("#IndexationId").val();

            if (selectedData) {
                var url = '../Indexation/PrecautionaryStatement_Edit';
                $.post(url, { indexationId: indexationId, iReference: selectedData.Reference },
                    function(data) {
                        $('#AddEditPrecautionaryStatement').html(data).show();
                    });
            } else {
                hideEditorSection('AddEditPrecautionaryStatement');
            }
        };

        var onGridPrecautionaryStatementRequestComplete = function (e) {
            if (e.type == "destroy") {
                hideEditorSection('AddEditPrecautionaryStatement');
            }
        };

        var onRegulatoryGhsActivate = function (e) {
            if ($(e.item).find("> .k-link").text() == "GHS") {

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

            indexationDetailObj.on("click", "#btnSelectOtherClass", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchOtherClass").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    alert("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    alert("No rows selected");
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
            var url = '../Indexation/RegOthers_Create';
            var indexationId = $("#IndexationId").val();
            $.post(url, { iReference: reference, indexationId: indexationId },
                function (data) {
                    $("#popupOtherClass").modal("hide");
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
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

        // Handling and storage section methodsbtnAddPpePictograms
        function initializeHandlingStorageControls() {
            indexationDetailObj.on("click", "#btnAddHandlingStorage", function (e) {
                e.preventDefault();
                var url = '../Indexation/HandlingStorage_Insert';
                var indexationId = $("#IndexationId").val();
                $.post(url, { indexationId: indexationId },
                    function (data) {
                        var pStatementGrid = $("#GridHandlingStorage").data("kendoGrid");
                        pStatementGrid.dataSource.read();
                    });
            });
        }

        // First aid section methods
        function initializeFirstAidControls() {
            indexationDetailObj.on("click", "#btnAddFirstAid", function (e) {
                e.preventDefault();
                var url = '../Indexation/FirstAid_Insert';
                var indexationId = $("#IndexationId").val();
                $.post(url, { indexationId: indexationId },
                    function (data) {
                        var pStatementGrid = $("#GridFirstAid").data("kendoGrid");
                        pStatementGrid.dataSource.read();
                    });
            });
        }

        // PPE section methods
        function initializePpeControls() {
            indexationDetailObj.on("click", "#btnAddPpe", function (e) {
                e.preventDefault();
                var url = '../Indexation/Ppe_Insert';
                var indexationId = $("#IndexationId").val();
                $.post(url, { indexationId: indexationId },
                    function (data) {
                        var pStatementGrid = $("#GridPPE").data("kendoGrid");
                        pStatementGrid.dataSource.read();
                    });
            });

            indexationDetailObj.on("click", "#btnAddPpePictograms", function (e) {
                e.preventDefault();
                if ($("#popupPpePictograms").length > 0) {
                    var grid = $("#GridSearchPpePictograms").data("kendoGrid");
                    grid.dataSource.read();
                }
                $("#popupPpePictograms").modal("show");
            });

            indexationDetailObj.on("click", "#btnSelectPpePictograms", function (e) {
                e.preventDefault();
                var grid = $("#GridSearchPpePictograms").data("kendoGrid");
                if (grid.dataSource.total() == 0) {
                    alert("No rows selected");
                    return;
                }
                var selectedData = grid.dataItem(grid.select());
                if (selectedData == null) {
                    alert("No rows selected");
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
            var url = '../Indexation/RegPPEPic_Create';
            var indexationId = $("#IndexationId").val();
            $.post(url, { iReference: reference, indexationId: indexationId },
                function (data) {
                    $("#popupPpePictograms").modal("hide");
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    var pictogramGrid = $("#GridPPEPictogram").data("kendoGrid");
                    pictogramGrid.dataSource.read();
                });
        }

        function addPpePictogramList(ppepictogramlists) {
            var urlmultiple = '../Indexation/RegPPEPic_CreateList';
            var indexationId = $("#IndexationId").val();
            $.post(urlmultiple, { pictogramList: JSON.stringify(ppepictogramlists), indexationId: indexationId },
                function (data) {
                    $("#popupPpePictograms").modal("hide");
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    var pictogramGrid = $("#GridPPEPictogram").data("kendoGrid");
                    pictogramGrid.dataSource.read();
                });
        }

        // Exposed methods
        return {
            getDocRevisionId: getDocRevisionId,
            getIndexationId: getIndexationId,
            getSelectedPpe: getSelectedPpe,
            loadIndexationPlugin: loadIndexationPlugin,
            loadWorkLoadPlugIn: loadWorkLoadPlugIn,
            onAttachmentRequestEnd: onAttachmentRequestEnd,
            onBoilingPointOperatorChange: onBoilingPointOperatorChange,
            onFlashPointOperatorChange: onFlashPointOperatorChange,
            onGravityOperatorChange: onGravityOperatorChange,
            onGridEditChangeTitle: onGridEditChangeTitle,
            onGridHazardClassChange: onGridHazardClassChange,
            onGridHazardClassRequestComplete: onGridHazardClassRequestComplete,
            onGridHazardStatementChange: onGridHazardStatementChange,
            onGridHazardStatementRequestComplete: onGridHazardStatementRequestComplete,
            onGridIngredientChange: onGridIngredientChange,
            onGridIngredientRemove: onGridIngredientRemove,
            onGridPrecautionaryStatementChange: gridPrecautionaryStatementChange,
            onGridPrecautionaryStatementRequestComplete: onGridPrecautionaryStatementRequestComplete,
            onHmisPpeChange: onHmisPpeChange,
            onIngredientConcentrationChange: onIngredientConcentrationChange,
            onIngredientOperatorChange: onIngredientOperatorChange,
            onIngredientSelection: onIngredientSelection,
            onSaveReachUse: onSaveReachUse,
            onRegulatoryGhsActivate: onRegulatoryGhsActivate,
            onSaveNameNumber: onSaveNameNumber,
            onViscosity1Change: onViscosity1Change,
            onViscosity2Change: onViscosity2Change,
            onVocCodeChange: onVocCodeChange,
            onVocMuTypeChange: onVocMuTypeChange,
            onVocOperatorChange: onVocOperatorChange,
            onVolatilityChange: onVolatilityChange
        };
    };

})(jQuery);