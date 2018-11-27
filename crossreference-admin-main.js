; (function ($) {

    if ($.fn.crossReferenceAdmin == null) {
        $.fn.crossReferenceAdmin = {};

    }
    $.fn.crossReferenceAdmin = function () {

        var currentUser = "LOGGEDINUSER";

        // initialize 
        var craSearchObj = $("#CrossRefernceWFPanel");                          // panel container
        var craAdvancedSearchObj = $("#CrossReferenceAdminSearchOptions");      // advanced search options
        var craDetailObj = $("#CrossReferenceAdminWFGrid");                       // grid container 

        var workflowSearchObj = $("#IndexationWFPanel");                        // panel container
        var workflowAdvancedSearchObj = $("#IndexationAdvancedSearchOptions");  // advanced search options
        var workflowDetailObj = $("#IndexationWFGrid");                         // grid container 

        var selectedIds = {};                                                   // ids of selected rows
        var gridIds = {};                                                       // traversed ids with selection state

        var itemsChecked = 0;
        var selectedRequests = new Array();         // ids selected in the grid
        var preSelectedRequests = new Array();      // ids in previously sent email
        var selectedRows = new Array();

        var crossReferenceObjects = {

            controls: {

                buttons: {
                    AddAdvancedSearchOption: "#btnAddCriteria",                     // save settings (not implemented)
                    RemoveAdvancedSearchOption: "#btnDeleteCriteria",               // remove settings (not implemented)
                    ClearCrossReferenceAdminBtn: "#clearCrossReferenceAdminBtn",    // clear advanced search options
                    SearchCrossReferenceAdminBtn: "#searchCrossReferenceAdminBtn"   // search as per advanced options
                },

                grids: {
                    GridRequests: "#gdSearchCrossReference"
                },

                dateTime: {
                },

                dropdownlists: {
                },

                textBoxes: {
                },

                checkboxes: {
                },

                sideMenus: {
                }

            }

        }

        var actionModals = {
        };

        var kendoWindows = {
        };

        var controllerCalls = {
            SearchRequestsCriteria: GetEnvironmentLocation() + "/Administration/CrossReference/GetSearchCriteria",
            SearchRequests: GetEnvironmentLocation() + "/Administration/CrossReference/SearchRequests",
        };


        var messages = {

            instructionMessages: {
            },

            successMessages: {
            },

            confirmationMessages: {
            },

            errorMessages: {
            }
        };

        // query model
        var crossReferenceAdminSearchModel = {
            Criterias: []
        };

        // side action menus
        function disableSideMenuItems() {
        }

        function enableSideMenuItems() {
        }

        var loadRequests = function () {

            // bind grid
            var grid = $(crossReferenceObjects.controls.grids.GridRequests).data("kendoGrid");
            grid.dataSource.read();

        };

        // get cross reference results
        var doCrossReferenceSearch = function () {

            // prevent another search being executed
            disableButtons();

            var url = controllerCalls.SearchRequests
            var searchCriteria = JSON.stringify(getAdvancedSearchCriteria());

            $(this).ajaxCall(controllerCalls.SearchRequests, { searchCriteria: searchCriteria })
                .success(function (data) {
                    console.log(data);
                    craDetailObj.html(data);
                    enableButtons();
                }).error(
                    function () {
                        enableButtons();
                    });
        };

        // ---------------------------------  BUTTONS AND MENUS    

        disableButtons = function () { };
        enableButtons = function () { };

        getSelectedCategories = function () {
            var list = $(crossReferenceObjects.controls.dropdownlists.CategoriesDropDownList).data("kendoMultiSelect").value();
            return list.join(",");
        };

        // clear search 
        craSearchObj.on("click", crossReferenceObjects.controls.buttons.ClearCrossReferenceAdminBtn, function () {

            // release all kendo controls
            $("#advancedSearchContainerTable").find("[data-role='datepicker']").each((i, v) => {
                $(v).data("kendoDatePicker").destroy();
            });

            // remove all criteria
            $("#advancedSearchContainerTable").find("select[id^='drpFields_']").map((i, v) => {

                // if first one, set to default choice.
                if (i == 0) {
                    $(v).data("kendoDropDownList").value("AccountName");
                    $(v).data("kendoDropDownList").trigger("change");
                }
                else {
                    $(v).closest("[id^=row]").remove();
                }

            });

        });

        // clear search 
        craSearchObj.on("click", crossReferenceObjects.controls.buttons.SearchCrossReferenceAdminBtn, function () {
            doCrossReferenceSearch();
        });

        // ---------------------------------------- ADVANCED SEARCH OPTIONS ---------------------------------------- 

        // ADD ADVANCED SEARCH OPTION
        craSearchObj.on("click", crossReferenceObjects.controls.buttons.AddAdvancedSearchOption, function () {

            // conditions
            var conditions = $("#advancedSearchContainerTable > div[id=row]").size();
            
            if (true) {

                var url = controllerCalls.SearchRequestsCriteria;
                $.post(url, function (data) {
                    $("#advancedSearchContainerTable").append(data);
                });

            }

        })

        // REMOVE ADVANCED SEARCH OPTION - all except the first are removable
        craSearchObj.on("click", crossReferenceObjects.controls.buttons.RemoveAdvancedSearchOption, function (e) {
            $(e.target).closest("[id^=row]").remove();
        })

        craSearchObj.on("change", crossReferenceObjects.controls.dropdownlists.SearchCriteriaOption, function (e) {
            
        })

        function handleAdvancedSearchOption(e) {

            // the fields control and unique id
            var ctrl = "#" + this.element.attr("id");
            var id = ctrl.substr(ctrl.lastIndexOf("_"));

            // field selected value
            var optionTag = $(ctrl).data("kendoDropDownList");
            var option = optionTag.value().toUpperCase();

            // free text fields
            var textField = ctrl.replace("drpFields", "txtFreeField");
            var textField1 = ctrl.replace("drpFields", "txtFreeField_1");

            // destroy any date pickers that may have been created by a previous action
            var datePickers = $("#advancedSearchContainerTable").find("[data-role='datepicker'][id$='" + id + "']");
            if (datePickers.size() > 0) {
                $(textField).data("kendoDatePicker").destroy();
                $(textField1).data("kendoDatePicker").destroy();
            }

            // destroy any multi select drop downs

            // re-create controls
            $("#dvFreeText" + id).empty();

            var html = '<input type="text" id="txtFreeField_@id" style="width:100px;visibility:hidden" />' +
                '<input type="text" id="txtFreeField_1_@id" style="width:100px;visibility:hidden" />';

            html = html.replace(/_@id/g, id);
            var textParent = $("#dvFreeText" + id).html(html);
            textParent.hide();

            // hide condition, enable as required
            var condition = "#dvDropDownCondition" + id;
            $(condition).css({ visibility: 'hidden' });

            var conditionDropDown = "#drpContains" + id;
            $(conditionDropDown).data("kendoDropDownList").value("");

            // hide all selects           
            $("#advancedSearchContainerTable").find("select[id$=" + id + "]").map((i, v) => {
                var id = $(v).attr("id");
                if (id.toLowerCase().indexOf("dropdown") >= 0) {
                    var enclosure = "#" + id.replace("drp", "dv");
                    $(enclosure).hide();
                }
            });

            if (option == "DATERANGE") {
                // convert to date pickers
                $(textField).css({ visibility: '', width: "100px" });
                $(textField1).css({ visibility: '', width: "100px" });
                $(textField).kendoDatePicker();
                $(textField1).kendoDatePicker();
                textParent.show();
            }
            else if (["ACCOUNTID", "DOCUMENTID"].indexOf(option) >= 0) {
                $(textField).css({ visibility: '', width: "100px" });
                textParent.show();
            }
            else if (["ACCOUNTNAME", "PRODUCTNAME", "MANUFACTURERNAME", "ASSIGNEDTO"].indexOf(option) >= 0) {
                $(textField1).css({ width: "0px" });
                $(textField).css({ visibility: '', width: "200px" });
                $(condition).css({ visibility: '' });
                textParent.show();
            }
            else {

                var ddid = "#dvDropDown_" + optionTag.text().replace(/ /g, "") + id;
                $(ddid).show();
            }

        }

        getAdvancedSearchCriteria = function () {

            var criteria = [];

            $("#advancedSearchContainerTable").find("select[id^='drpFields_']").map((i, v) => {

                var searchFor = null;

                var timeId = $(v).attr("id").split("_").reverse()[0];

                var ddlFields = "#drpFields_" + timeId;

                var textFieldId = "#txtFreeField_" + timeId;
                var textField1Id = "#txtFreeField_1_" + timeId;

                var criteriaField = $("#drpFields_" + timeId).data("kendoDropDownList");        // always has a value
                var containsDropDown = $("#drpContains_" + timeId).data("kendoDropDownList");   // always has a value
                var fieldDropDown = $("#drpDropDown_" + criteriaField.text().replace(/ /g, "") + "_" + timeId).data("kendoDropDownList");

                // criteria definition
                var fieldName = criteriaField.value();
                var whereOperator = containsDropDown.value();
                var searchFor = $(textFieldId).val().replace(/ /g, "");

                var criteriaFieldName = criteriaField.value().toUpperCase();

                var errors = [];

                if (criteriaFieldName == "DATERANGE") {

                    var fromDate = $(textFieldId).val().replace(/ /g, "");
                    var toDate = $(textField1Id).val().replace(/ /g, "");

                    searchFor = fromDate + ":" + toDate;

                }
                else if (["ACCOUNTID", "DOCUMENTID"].indexOf(criteriaFieldName) >= 0) {
                }
                else if (["ACCOUNTNAME", "PRODUCTNAME", "MANUFACTURERNAME", "ASSIGNEDTO"].indexOf(criteriaFieldName) >= 0) {
                }
                else {
                    searchFor = fieldDropDown.value();
                }

                criteria.push({
                    FieldName: fieldName,
                    WhereOperator: whereOperator,
                    SearchFor: searchFor
                });

            });

            var data = new Object();
            data.Criterias = criteria;

            return data;

        }

        // ---------------------------------  UTILITY FUNCTIONS

        function changesSavedSuccessfully() {
            $(this).savedSuccessFully(messages.successMessages.ChangesSavedSuccessfully);
        }

        // --------------------------------- GRID ACTIONS

        function handleKendoGridEvents(e) { // TESTED

            var grid = e.sender;
            $(grid.dataSource.view()).each(function (i, v) {

                // locate row
                var row = grid.table.find("[data-uid=" + v.uid + "]");

                // row preselected ?
                var checked = (gridIds[v.IndexingWorkItemID] == true);

                // locate checkbox
                $(row).find(".chkMultiSelect").prop("checked", checked);

                // set row state
                $(row).addClass(checked ? "k-state-selected" : "").removeClass(checked ? "" : "k-state-selected");

            });

        }

        function getSelectedIdsBySortOrder() {

            var _selectedIds = [];

            var grid = $(crossReferenceObjects.controls.grids.GridRequests).data("kendoGrid");
            $(grid.dataSource.view()).each(function (i, v) {

                // locate row
                var row = grid.table.find("[data-uid=" + v.uid + "]");

                // selected ?
                var selected = $(row).hasClass("k-state-selected");

                if (selected) _selectedIds.push(v.IndexingWorkItemID);

            });

            // alert(_selectedIds);
            return _selectedIds;

        }

        function doPostGridRowAction() {

            disableSideMenuItems();
            enableAssignUnAssignButtons(false);

            selectedIds = [];
            Object.keys(gridIds).forEach(function (v, i) {
                console.log(v, i);
                if (gridIds[v]) selectedIds.push(parseInt(v));
            });

            console.log(selectedIds);

            if (selectedIds.length > 0) {
                enableAssignUnAssignButtons(true);
                enableSideMenuItems();
            }

        }

        var loadRequests = function () {

            // bind grid
            var grid = $(crossReferenceObjects.controls.grids.GridRequests).data("kendoGrid");
            grid.dataSource.read();

        };

        $(craDetailObj).on("click", ".chkMultiSelect", function () { // TESTED

            // master select state
            var checked = $(this).is(':checked');

            // get grid
            var grid = $(this).parents('.k-grid:first').data().kendoGrid;

            // grid row
            var row = $(this).closest("[data-uid]");

            // set row state
            $(row).addClass(checked ? "k-state-selected" : "").removeClass(checked ? "" : "k-state-selected");

            // set state of row
            gridIds[grid.dataItem(row).IndexingWorkItemID] = checked;

            // after select actions
            doPostGridRowAction();

        });

        $(craDetailObj).on("click", ".chkMasterMultiSelect", function () {

            // master select state
            var checked = $(this).is(':checked');

            // get grid
            var grid = $(this).parents('.k-grid:first').data().kendoGrid;

            var dataSource = grid.dataSource;

            // iterate through rows in view and set/un selection state
            $(grid.dataSource.view()).each(function (i, v) {

                // locate row
                var row = grid.table.find("[data-uid=" + v.uid + "]");

                // locate checkbox
                var selector = $(row).find(".chkMultiSelect");

                if (selector.size() != 0) {

                    $(selector).prop("checked", checked);

                    // set row state
                    $(row).addClass(checked ? "k-state-selected" : "").removeClass(checked ? "" : "k-state-selected");

                    // flag selection state
                    gridIds[grid.dataItem(row).IndexingWorkItemID] = checked;
                }

            });

            // after select actions
            doPostGridRowAction();

        });

        function SubError(errorMessage) {
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

        // UTILITY FUNCTION
        function getQueryVariable(variable) {
            var query = window.location.search.substring(1);

            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
        }

        function init() {

        }

        function onDataBound() {

        }

        return {

            init: init,
            getAdvancedSearchCriteria: getAdvancedSearchCriteria,
            handleAdvancedSearchOption: handleAdvancedSearchOption,
            loadRequests: loadRequests,
            handleKendoGridEvents: handleKendoGridEvents,
            showError: SubError,
            onDataBound: onDataBound

        };
    };
})(jQuery);