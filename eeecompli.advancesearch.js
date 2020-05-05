//=====================================================================
//Min Wang: 05/01/2020 -- Note ----
//jQuery Advance Search Control for dynamically creating criterias
//It depends on kendo UI
//=====================================================================

(function ($, kdo) {
    $.fn.advancedsearch = function (options) {

        // All default datasources used here are for testing purpose, can be override anytime
        // All datasource needs to be passed at runtime, otherwise default will be injected.
        
        //Dummy data
        var defaultLookUpDataSource = [
            {
                Text: 'LookUpOne',
                Value: '1',
            },
            {
                Text: 'LookUpTwo',
                Value: '2',
            },
            {
                Text: 'LookUpThree',
                Value: '3',
            },
        ];

        //Dummy data
        var defaultColumnDataSource = [{
           Text: "ColumnId",
           Value: "1",
           Type: "integer"
         }, {
           Text: "ColumnText",
           Value: "2",
           Type: "text"
         }, {
           Text: "ColumnLookUp",
           Value: "3",
           Type: "lookup",
           DataLookup: defaultLookUpDataSource
         }, {
           Text: "ColumnDateRange",
           Value: "4",
           Type: "DateRange"
         }];

        //Dummy data
        var defaultOperatorDataSource = [
            {
                Text: 'Contains',
                Value: '1',
                Type: 'integer'
            },
            {
                Text: 'Exact Match',
                Value: '2',
                Type: 'integer'
            },
            {
                Text: 'Starts With',
                Value: '3',
                Type: 'integer'
            },
            {
                Text: 'Ends With',
                Value: '4',
                Type: 'integer'
            }
        ];



        options = options || {}; //make sure options is not null, or can extend to define default options
        var $this = $(this);
        var totalrow = 0;

        var settings = $.extend(
            {
                selectedColumnDataSource: defaultColumnDataSource,
                selectedOperatorDataSource: defaultOperatorDataSource,
                selectedFirstDefaultColumn: defaultColumnDataSource[0].Value,
                selectedDataSourceUrl: "",     //Static Datasource does not require this.
                EnableLog: false
            },
            options
        );

        //Verify if dynamic datasource with empty url, then error message warning.
        //Control will fail when loading sub layer lookup information
        $.each(settings.selectedColumnDataSource, function (index, column) {
            if ((typeof (column.DataLookup) === 'string') && (settings.selectedDataSourceUrl === "")) {
                kendo.alert("Dynamic DataSource type must have a valid datasource URL defined.");
                return;
            }
        });

        var plugInOptions = {
            Icons: {
                Add: 'add',
                Delete: 'delete',
                Reset: 'reset',
                History: 'clock'
            },
            IconsTip: {
                Add: 'Add',
                Delete: 'Delete',
                Reset: 'Reset all',
                History: 'Histroy'
            },
            OperatorIndex: {
                Contains: defaultOperatorDataSource[0].Value,
                ExactMatch: defaultOperatorDataSource[1].Value,
                StartsWith: defaultOperatorDataSource[2].Value,
                EndsWith: defaultOperatorDataSource[3].Value
            }
        };

        var allColumnValues = settings.selectedColumnDataSource.map(a => a.Value);

        function ConsoleLog(m) {
            if (settings.EnableLog) {
                kendoConsole.log(m);
            }
        }

        function GetDataSource(typeLookUpName) {
            return new kdo.data.DataSource({
                transport: {
                    read: {
                        url: settings.selectedDataSourceUrl + typeLookUpName,
                        type: "POST",
                        contentType: "application/json"
                    }
                }
            });
        }

        function getModelViewObservable(dataSource) {
            return kdo.observable({
                selectedColumn: settings.selectedFirstDefaultColumn,
                selectedColumnType: 'text',
                selectedOperator: 1,
                selectedDateFrom: null, //'01/20/2019',
                selectedDateTo: null,
                isVisible: true,
                isOperatorVisible: true,
                isOperatorEnabled: true,
                isDataFieldVisiable: true,
                isDataLookUpVisiable: false,
                isDatePickerVisible: true,
                enteredDataFieldValue: '',
                selectedDataLookupIndex: 1,
                selectedDataLookupValue: '',

                onColumnChange: function (e) {
                    ConsoleLog(
                        'Column change:' +
                        kdo.stringify(this.get('selectedColumn'), null, 4)
                    );
                    ConsoleLog(
                        'Default First Column: ' + settings.selectedFirstDefaultColumn
                    );

                    //Validation
                    var selectedItem = e.sender.dataItem();
                    var criteriarow = $(e.sender.element[0])
                        .parent()
                        .parent();

                    this.set('selectedColumnType', selectedItem.Type);
                    if (selectedItem.Type === 'integer') {
                        this.set(
                            'selectedOperator',
                            plugInOptions.OperatorIndex.ExactMatch
                        );
                        this.set('isOperatorEnabled', false);
                        this.set('isOperatorVisible', true);
                        this.set('isDataFieldVisiable', true);
                        this.set('isDataLookUpVisiable', false);
                        this.set('isDatePickerVisible', false);

                        //Only allow numeric
                        $(document).on(
                            'keyup',
                            '#' + criteriarow.children()[2].id,
                            function () {
                                this.value = this.value.replace(/[^0-9$,]/g, '');
                            }
                        );
                    } else if (selectedItem.Type === 'text') {
                        this.set('selectedOperator', plugInOptions.OperatorIndex.Contains);
                        this.set('isOperatorEnabled', true);
                        this.set('isOperatorVisible', true);
                        this.set('isDataFieldVisiable', true);
                        this.set('isDataLookUpVisiable', false);
                        this.set('isDatePickerVisible', false);

                        //Remove numeric constrain
                        $(document).off('keyup', '#' + criteriarow.children()[2].id);
                    } else if (selectedItem.Type === 'lookup') {
                        this.set(
                            'selectedOperator',
                            plugInOptions.OperatorIndex.ExactMatch
                        );
                        this.set('isOperatorEnabled', false);
                        this.set('isOperatorVisible', true);
                        this.set('isDataFieldVisiable', false);
                        this.set('isDataLookUpVisiable', true);
                        this.set('isDatePickerVisible', false);

                        //Check the datasource type
                        if (typeof (selectedItem.DataLookup) === 'string') {
                            var activeDs = GetDataSource(selectedItem.DataLookup);
                            var myParent = this;
                            activeDs.read().then(function () {
                                myParent.set('dataLookUpDataSource', activeDs.view());
                                selectedItem.DataLookup = activeDs.view();   //Put in Cache
                            });
                        }
                        else {
                            this.set('dataLookUpDataSource', selectedItem.DataLookup);
                            //alert("hit cache");
                        }
                    } //This date range
                    else {
                        this.set(
                            'selectedOperator',
                            plugInOptions.OperatorIndex.ExactMatch
                        );
                        this.set('isOperatorEnabled', false);
                        this.set('isOperatorVisible', false);
                        this.set('isDataFieldVisiable', false);
                        this.set('isDataLookUpVisiable', false);
                        this.set('isDatePickerVisible', true);
                    }
                },

                onOperatorChange: function () {
                    ConsoleLog(
                        'Operator change: ' +
                        kdo.stringify(this.get('selectedOperator'), null, 4)
                    );
                },

                onSelectDateFromChange: function () {
                    ConsoleLog(
                        'DateFrom change: ' +
                        kdo.stringify(this.get('selectedDateFrom'), null, 4)
                    );
                },

                onSelectDateToChange: function () {
                    ConsoleLog(
                        'DateTo change: ' +
                        kdo.stringify(this.get('selectedDateTo'), null, 4)
                    );
                },

                onDataFieldLookupChange: function (e) {
                    ConsoleLog(
                        'LookUp value change: ' +
                        kdo.stringify(this.get('selectedDataLookupIndex'), null, 4)
                    );
                    var dataItem = e.sender.dataItem();
                    this.set('selectedDataLookupText', dataItem.Text);
                   
                },

                onAddRemoveClick: function (e) {
                    e.stopPropagation();
                    if (e.currentTarget.name === plugInOptions.Icons.Add) {
                        AddRow(totalrow);
                    } else {
                        e.currentTarget.parentNode.remove();
                        totalrow--;
                    }
                },

                onResetClick: function (e) {
                    e.stopPropagation();
                    ConsoleLog('Reset Clicked');
                    $this.html('');
                    totalrow = 0;
                    AddRow(totalrow++, null);
                    //Remember to reset cache if adde in the future
                },
                columnDataSource: settings.selectedColumnDataSource,
                operatorDataSource: settings.selectedOperatorDataSource,
                dataLookUpDataSource: [] //Unkonw Yet
            });
        }

        function AddRow(rowIndex, defaultModel) {
            var btnname = rowIndex === 0 ? plugInOptions.Icons.Add : plugInOptions.Icons.Delete;
            var btnnameTip = (rowIndex === 0) ? plugInOptions.IconsTip.Add : plugInOptions.IconsTip.Delete;

            //Find the first index which is not in the array
            var onScreenList = getAddedColumnOnScreen();
            var nextColumnList = allColumnValues.filter(
                n => !onScreenList.includes(n)
            );

            //Define dynamica columns
            var criteriaRowId = 'criteriaRow_' + rowIndex;
            var criteriaRow = $("<div id='" + criteriaRowId + "' class='criteriarow'></div>");
            var column = $("<input id='column_" +
                rowIndex +
                "' data-role='dropdownlist' data-auto-bind='false' data-field-lookup='SubLookUp' data-text-field='Text' data-value-field='Value'  data-bind='value: selectedColumn, source: columnDataSource, events: { change: onColumnChange }' style='min-width:180px;'/>"
            );
            var operator = $(
                "<input id='operator_" + rowIndex + "' data-role='dropdownlist' data-auto-bind='false' data-text-field='Text' data-value-field='Value' data-bind='value: selectedOperator, source: operatorDataSource, visible: isOperatorVisible, enabled: isOperatorEnabled, events: { change: onOperatorChange }' style='min-width:164px;'/>"
            );
            var datafield = $(
                "<input type='text' id='dataField_" +
                rowIndex +
                "' data-bind='value: enteredDataFieldValue, visible: isDataFieldVisiable' style='width:150px; height:16px;' />"
            );
            var datalookup = $(
                "<input id='dataFieldLookup_ " +
                rowIndex +
                "' data-role='dropdownlist' data-auto-bind='false' data-text-field='Text' data-value-field='Value' data-bind='value: selectedDataLookupIndex, source: dataLookUpDataSource, visible: isDataLookUpVisiable, events: { change: onDataFieldLookupChange }' style='min-width:164px;'/>"
            );

            var datePickerFrom = $(
                "<input data-role='datepicker' data-bind='visible: isDatePickerVisible, value: selectedDateFrom, events: { change: onSelectDateFromChange }' style='width: 164px; height:24px;'>"
            );
            var datePickerTo = $(
                "<input data-role='datepicker' data-bind='visible: isDatePickerVisible, value: selectedDateTo, events: { change: onSelectDateToChange }' style='width: 164px; height:24px;'>"
            );

            //This onclick can not find defined function
            var operationbtn = $(
                "<button id='operationbtn_" +
                rowIndex +
                "' parentdiv='" +
                criteriaRowId +
                "' data-bind='click: onAddRemoveClick' class='k-button btn btn-small' style='position:relative;z-index:1;height:26px;' name='" +
                btnname +
                "' title='" +
                btnnameTip +
                "'><span class='k-icon k-i-" +
                btnname +
                "'></span></button>"
            );

            criteriaRow.append(column, [
                operator,
                datafield,
                datalookup,
                datePickerFrom,
                datePickerTo,
                operationbtn
            ]);

            if (btnname == plugInOptions.Icons.Add) {
                var resetbtn = $(
                    "<button id='resetbtn_" +
                    rowIndex +
                    "' parentdiv='" +
                    criteriaRowId +
                    "' data-bind='click: onResetClick' class='k-button btn btn-small' style='position:relative;z-index:1;height:26px;' name='reset' title='" +
                    plugInOptions.IconsTip.Reset +
                    "'><span class='k-icon k-i-refresh'></span></button>"
                );

                //var historybtn = $(
                //    "<button id='historybtn_" +
                //    rowIndex +
                //    "' parentdiv='" +
                //    criteriaRowId +
                //    "' data-bind='click: onResetClick' class='btn btn-small' style='position:relative;z-index:1;height:26px; width:20px;' name='config' title='" +
                //    plugInOptions.IconsTip.History +
                //    "'><span class='k-icon k-i-" +
                //    plugInOptions.Icons.History +
                //    "' style='margin-left:-6px;'></span></button>"
                //);
                criteriaRow.append(resetbtn);
                //criteriaRow.append(historybtn);
            }
            $this.append(criteriaRow);

            var rowModel = defaultModel;
            if (rowModel == null) rowModel = getModelViewObservable();
            kdo.bind(criteriaRow, rowModel);

            //Set Next Column in Sequence
            if (nextColumnList.length === 0) {
                SetNextSelectColumnDefault(column, rowModel.selectedColumn);
                ConsoleLog(
                    'Default column when next = 0 :  ' + rowModel.selectedColumn
                );
            } else {
                if (rowIndex === 0)
                    SetNextSelectColumnDefault(column, rowModel.selectedColumn);
                else SetNextSelectColumnDefault(column, parseInt(nextColumnList[0]));

                ConsoleLog(
                    'Default column:  ' +
                    parseInt(nextColumnList[0]) +
                    ', total: ' +
                    nextColumnList.length
                );
            }

            //Increase the row counter to create unique controls on screen
            totalrow++;
        }

        //Defined SetNextSelectCoumnDefault
        //For 05/05/2020
        function SetNextSelectColumnDefault(sender, index) {
            ConsoleLog('Set next column ' + index);
            $(sender)
                .data('kendoDropDownList')
                .select(index - 1); //kendo dropdownlist index starts with 0;
            $(sender)
                .getKendoDropDownList()
                .trigger('change');
        }

        function getAddedColumnOnScreen() {
            var selectedColunmList = [];
            for (var index = 0; index < $this.get(0).children.length; index++) {
                var targetDiv = $this.get(0).children[index]; //This object is the ctl passed in Root
                var firstChild = $this.get(0).children[index].childNodes[0];
                var inputCtl = $(
                    '#' +
                    $(firstChild)
                        .find('input')
                        .get(0).id
                );

                var bs = $(inputCtl).get(0).kendoBindingTarget.source;
                selectedColunmList.push(bs.selectedColumn);
            }
            return selectedColunmList;
        }

        //Doing some default
        //var initialRowModel = getModelViewObservable();
        //initialRowModel.selectedColumn = 4;
        var initialRowModel = null;

        AddRow(totalrow++, initialRowModel);

        if (settings.EnableLog) {
            var asConsolectl =
                "<div style='padding-top: 1em;'><h4 style='margin:0em'>Console Log</h4><div class='console'></div></div>";
            $this.before(asConsolectl);
        }

        //public function
        var SearchData = function (e) {
            var criteriaList = [];
            //ConsoleLog("Total datarow ; " + $this.get(0).children.length);

            for (var index = 0; index < $this.get(0).children.length; index++) {
                var criteria = {};
                // ConsoleLog("<<<<<<<<<<<<<<<<<<<<Index value:" + index);
                var targetDiv = $this.get(0).children[index]; //This object is the ctl passed in Root

                //ConsoleLog("Children = " + thisObject.get(0).children[index]);
                //ConsoleLog("Children = " + thisObject.get(0).children[index].children[0]);

                var firstChild = $this.get(0).children[index].childNodes[0];
                var inputCtl = $(
                    '#' +
                    $(firstChild)
                        .find('input')
                        .get(0).id
                );
                var bs = $(inputCtl).get(0).kendoBindingTarget.source;

                // ConsoleLog.log("-----------------Get Advanced Data Final Begin-----------------------");
                // ConsoleLog.log("Selected Column: " + bs.selectedColumn + " Selected Operator: " + bs.selectedOperator + " Data Type: " + bs.selectedColumnType);
                // ConsoleLog.log("-----------------Get Advanced Data Final End-----------------------");
                criteria.FieldNameIndex = bs.selectedColumn;
                criteria.FiledNameValue =
                    settings.selectedColumnDataSource[bs.selectedColumn - 1].Text;
                criteria.FieldOperatorIndex = null;
                criteria.FieldOperatorValue = null;

                if (bs.selectedColumnType != 'DateRange') {
                    criteria.FieldOperatorIndex = bs.selectedOperator;
                    criteria.FieldOperatorValue =
                        settings.selectedOperatorDataSource[bs.selectedOperator - 1].Text;
                }
                criteria.SearchType = bs.selectedColumnType;
                criteria.DateFromValue = null;
                criteria.DateToValue = null;
                criteria.Value = null;
                criteria.SelectedLookUpIndex = null;
                criteria.SelectedLookUpValue = null;
                criteria.LookUpDataSource = null;

                if (bs.selectedColumnType === 'lookup') {
                    criteria.SelectedLookUpIndex = bs.selectedDataLookupIndex;
                    criteria.SelectedLookUpValue = bs.selectedDataLookupValue;
                    criteria.LookUpDataSource = bs.dataLookUpDataSource;
                } else if (bs.selectedColumnType === 'DateRange') {
                    criteria.DateFromValue = bs.selectedDateFrom;
                    criteria.DateToValue = bs.selectedDateTo;
                } else {
                    criteria.Value = bs.enteredDataFieldValue;
                }
                criteriaList.push(criteria);
            }

            return criteriaList;
        };

        var DataSource = function (e) {
            var dataModels = [];

            for (var index = 0; index < $this.get(0).children.length; index++) {
                var targetDiv = $this.get(0).children[index]; //This object is the ctl passed in Root
                var firstChild = $this.get(0).children[index].childNodes[0];
                var inputCtl = $(
                    '#' +
                    $(firstChild)
                        .find('input')
                        .get(0).id
                );
                var rowModel = $(inputCtl).get(0).kendoBindingTarget.source;
                dataModels.push(rowModel);
            }
            return dataModels;
        };

        var SetData = function (ds) {
            $this.html('');
            totalrow = 0;
            var rowsCount = ds.length;
            $.each(ds, function (index, val) {
                AddRow(totalrow++, val);
                ConsoleLog('Value Entered: ' + val.enteredDataFieldValue);
            });
        };
        var ClearData = function () {
            $this.html('');
            totalrow = 0;
            AddRow(totalrow++, null);
        };

        return {
            SearchData: SearchData,
            SetData: SetData,
            ClearData: ClearData,
            DataSource: DataSource
        };
    };
})(jQuery, kendo);
