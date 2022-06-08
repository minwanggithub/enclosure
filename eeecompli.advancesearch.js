//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::Min Wang: 05/01/2020 -- Note ----
//:::::An Universal jQuery Advance Search Control for dynamically extract criteria based on bypassing datasource
//:::::Dependency: jQuery and Kendo UI
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

(function($,kdo) {
    $.fn.advancedsearch=function(options) {

        // All default datasources used here are for testing purpose, can be override anytime
        // All datasource needs to be passed at runtime, otherwise default will be injected.

        //Dummy data
        var defaultLookUpDataSource=[
            {
                Text: "Item 1",
                Value: "1"
            },
            {
                Text: "Item 2",
                Value: "2"
            },
            {
                Text: "Item 3",
                Value: "3"
            }
        ];

        var defaultCalendarLookUpDataSource=[
            {
                Text: '5 days',
                Value: '1',
            },
            {
                Text: '10 days',
                Value: '2',
            },
            {
                Text: '15 days',
                Value: '3',
            },
            {
                Text: '30 days',
                Value: '4',
            },
            {
                Text: '60 days',
                Value: '5',
            },
            {
                Text: 'Custom',
                Value: '6',
            }
        ];

        //Dummy data
        var defaultColumnDataSource=[{
            Text: "ColumnId",
            Value: "1",
            Type: "integer",
            DataLookup: null,
            ColumnMap: "ColumnId",
            DataAttributes: null,
            Active: true
        },{
            Text: "ColumnText",
            Value: "2",
            Type: "text",
            DataLookup: null,
            ColumnMap: "ColumnText",
            DataAttributes: null,
            Active: true
        },{
            Text: "ColumnLookUp",
            Value: "3",
            Type: "lookup",
            DataLookup: defaultLookUpDataSource,
            ColumnMap: "ColumnLookUp",
            DataAttributes: null,
            Active: true
        },{
            Text: "ColumnDateRange",
            Value: "4",
            Type: "DateRange",
            ColumnMap: "ColumnDateRange",
            DataLookup: defaultCalendarLookUpDataSource,
            DataAttributes: null,
            Active: true
        },{
            Text: "DisabledColumn",
            Value: "5",
            Type: "text",
            ColumnMap: "DisabledColumn",
            DataAttributes: null,
            Active: false
        }];

        //Dummy data, index started with 0 to map original eeeCompli search option
        var defaultOperatorDataSource=[
            {
                Text: 'Contains',
                Value: '0',
                Type: 'integer'
            },
            {
                Text: 'Exact Match',
                Value: '1',
                Type: 'integer'
            },
            {
                Text: 'Starts With',
                Value: '2',
                Type: 'integer'
            },
            {
                Text: 'Ends With',
                Value: '3',
                Type: 'integer'
            }
        ];



        options=options||{}; //make sure options is not null, or can extend to define default options
        var $this=$(this);
        var asConsolectl,jsonFormatCtl;
        var totalrow=0;


        /**
         * Returns a random integer between min (inclusive) and max (inclusive).
         * The value is no lower than min (or the next integer greater than min
         * if min isn't an integer) and no greater than max (or the next integer
         * lower than max if max isn't an integer).
         * Using Math.round() will give you a non-uniform distribution! Therefore,
         * the chance to have duplicate id on one page between 100000, 999999 is very small.
         */

        function getRandomInt(min,max) {
            min=Math.ceil(min);
            max=Math.floor(max);
            return Math.floor(Math.random()*(max-min+1))+min;
        }

        var randomPrefix="_For_"+($this)[0].id+getRandomInt(100000,999999);

        var settings=$.extend(
            {
                selectedColumnDataSource: defaultColumnDataSource,
                selectedOperatorDataSource: defaultOperatorDataSource,
                selectedFirstDefaultColumn: defaultColumnDataSource[0].Value,
                selectedDataSourceUrl: "",     //Static Datasource does not require this.
                extendWidth: false,
                EnableLog: false
            },
            options
        );

        //Verify if dynamic datasource with empty url, then error message warning.
        //Control will fail when loading sub layer lookup information
        $.each(settings.selectedColumnDataSource,function(index,column) {
            if((typeof (column.DataLookup)==='string')&&(settings.selectedDataSourceUrl==="")) {
                kdo.alert("Dynamic DataSource type must have a valid datasource URL defined.");
                return;
            }
        });

        var plugInOptions={
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
                History: 'Histroy',
                GetData: 'Get selected criterias',
                GetDataSource: 'Get data source',
                ClearLogData: 'Clear Log data',
                ResizeControl: 'Resize Control'
            },
            OperatorIndex: {
                Contains: defaultOperatorDataSource[0].Value,
                ExactMatch: defaultOperatorDataSource[1].Value,
                StartsWith: defaultOperatorDataSource[2].Value,
                EndsWith: defaultOperatorDataSource[3].Value
            },
            DataAttributes: {
                PopUpAttribute: "PopUpAttribute",
                DetailRedirectAttribute: "DetailRedirectAttribute"
            },
            ResizeMetrics: {
                ResizeBase: [200,400],                          //Default 200,400,500
                ResizeDropDownDelta: [14,14],                   //Default 14,14,14
                ResizeCalendarDelta: [-94,-194]                 //Default -94,194,-244
            },
            Control: {
                MarginLeft: 2,
                Index: {
                    ColumnDefinitionName: 0,
                    OperatorType: 1,
                    DataField: 2,                               //Mutually exclusive
                    DataLookUp: 2,                              //Mutually exclusive
                    DatePickerFrom: 3,
                    DatePickerTo: 4,
                    CalendarDataLookUp: 5,
                    Operationbutton: 6,
                    ResetButton: 7,
                    DataAttributePopUp: 8,
                    GetDataButton: 9,
                    GetDataSourceButton: 10,
                    ClearDataButton: 11

                }
            }
        };

        var allColumnValues=settings.selectedColumnDataSource.map(a => a.Value);
        var disabledValues=settings.selectedColumnDataSource.filter(a => a.Active==0).map(a => a.Value);

        var resizeIndex=(settings.extendWidth==true? 1:0);

        function ConsoleLog(m) {
            if(settings.EnableLog) {
                ToggleConsole("ConsoleLog");
                kendoConsole.log(m);
            }
        }

        function ClearConsole() {
            if(settings.EnableLog) {
                ToggleConsole("ConsoleLog");
                kendoConsole.clear();
            }
        }

        function ToggleConsole(activeConsole) {
            if(typeof (asConsolectl)=="undefined"||typeof (jsonFormatCtl)=="undefined")
                return;

            if(activeConsole=='ConsoleLog') {
                $("#"+$(asConsolectl)[0].id).show();
                $("#"+$(jsonFormatCtl)[0].id).hide();
            }
            else {
                $("#"+$(asConsolectl)[0].id).hide();
                $("#"+$(jsonFormatCtl)[0].id).show();
            }

        }

        function NullishCheck(obj,propertyName) {
            if(obj===null||typeof obj=='undefined')
                return "null";
            else {
                if(obj instanceof Date)
                    return obj.toLocaleDateString();
                else
                    return obj[propertyName];
            }
        }

        function GetDataSource(typeLookUpName) {
            return new kdo.data.DataSource({
                transport: {
                    read: {
                        url: settings.selectedDataSourceUrl+typeLookUpName,
                        type: "POST",
                        contentType: "application/json"
                    }
                }
            });
        }

        function FormatRowType(rowModel,index) {
            switch(rowModel["selectedColumnType"].toLowerCase()) {
                case "text":
                case "integer":
                    return "Row {0}.  ColumnType={1}, ColumnName={2}, Operator={3}, Value={4}".format(
                        index,
                        rowModel["selectedColumnType"],
                        rowModel["columnDataSource"][rowModel["selectedColumn"]-1].Text,
                        rowModel["operatorDataSource"][rowModel["selectedOperator"]].Text,
                        rowModel["enteredDataFieldValue"]);
                case "lookup":
                    return "Row {0}.  ColumnType={1}, ColumnName={2}, Operator={3}, LookUpIndex={4}, Value={5}".format(
                        index,
                        rowModel["selectedColumnType"],
                        rowModel["columnDataSource"][rowModel["selectedColumn"]-1].Text,
                        rowModel["operatorDataSource"][rowModel["selectedOperator"]].Text,
                        NullishCheck(rowModel["selectedDataLookupIndex"],"Value"),
                        NullishCheck(rowModel["selectedDataLookupIndex"],"Text"));
                case "daterange":
                    return "Row {0}.  ColumnType={1}, ColumnName={2}, DateRangeIndex={3}, Value={4}, DateFrom={5}, DateTo={6}".format(
                        index,
                        rowModel["selectedColumnType"],
                        rowModel["columnDataSource"][rowModel["selectedColumn"]-1].Text,
                        NullishCheck(rowModel["selectedCalendarDataLookupIndex"],"Value"),
                        NullishCheck(rowModel["selectedCalendarDataLookupIndex"],"Text"),
                        NullishCheck(rowModel["selectedCalendarDateFromValue"],""),
                        NullishCheck(rowModel["selectedCalendarDateToValue"],""));
                default:
                    return "";
            }
        }

        function getModelViewObservable(dataSource) {
            return kdo.observable({
                selectedColumn: settings.selectedFirstDefaultColumn,
                selectedColumnType: 'text',
                selectedOperator: 1,
                isVisible: true,
                isOperatorVisible: true,
                isOperatorEnabled: true,
                isDataFieldVisiable: true,
                isDataLookUpVisiable: false,
                isPopUpSearchVisiable: false,
                selectedDataLookupIndex: null,
                selectedDataLookupValue: '',
                enteredDataFieldValue: '',

                isCalendarDateListPickerVisible: true,
                isDatePickerFromToVisible: false,
                selectedCalendarDataLookupIndex: null,
                selectedCalendarDataLookupValue: '',
                selectedCalendarDateFromValue: null,
                selectedCalendarDateToValue: null,      //Can initialize with today's date if needed = new Date(),

                queuedDataAttribute: '',                //Dequeue for non-data attribute

                onColumnSelect: function(e) {
                    //var currentItem = e.sender.dataItem();
                    var selectedItem=e.dataItem;

                    if(selectedItem.Active===false) {
                        kdo.alert("This column has been disabled and can not be selected");
                        e.preventDefault();
                        return;
                    }
                },

                onColumnChange: function(e) {
                    ConsoleLog(
                        'Column change: Index='+
                        kdo.stringify(this.get('selectedColumn'),null,4)+
                        ', Text='+settings.selectedColumnDataSource[this.get('selectedColumn')-1].Text
                    );
                    //ConsoleLog(
                    //    'Default First Column: '+settings.selectedFirstDefaultColumn
                    //);

                    //ValidationplugInOptions
                    var selectedItem=e.sender.dataItem();
                    var criteriarow=$(e.sender.element[0]).parent().parent();
                    debugger;
                    var targetCtrl='#'+criteriarow.children()[2].id;
       

                    //Dequeue any accumulated data attribute
                    //if(this.get('queuedDataAttribute')!='') {
                    //    $(targetPopUpCtrl).removeAttr(this.get('queuedDataAttribute'));
                    //    this.set('queuedDataAttribute','');
                    //}

                    this.set('selectedColumnType',selectedItem.Type);
                    if(selectedItem.Type==='integer') {
                        this.set(
                            'selectedOperator',
                            plugInOptions.OperatorIndex.ExactMatch
                        );
                        this.set('isOperatorEnabled',false);
                        this.set('isOperatorVisible',true);
                        this.set('isDataFieldVisiable',true);
                        this.set('isDataLookUpVisiable',false);
                        this.set('isCalendarDateListPickerVisible',false);
                        this.set('isDatePickerFromToVisible',false);
                        //this.set('enteredDataFieldValue','');

                        var bindingRoot=this;                    //Save observable for later keypress binding to use
                        if(selectedItem.DataLookup!=null) {
                            this.set('dataLookUpDataSource',selectedItem.DataLookup);   //This is very important because every time the column changes
                            this.set('isPopUpSearchVisiable',true);
                            if(selectedItem.DataAttributes!=null) {
                                var targetPopUpCtrl='#'+criteriarow.children()[plugInOptions.Control.Index.DataAttributePopUp].id;
                                var attObj=JSON.parse(selectedItem.DataAttributes);
                                if(attObj!=null) {
                                    var popUpAtt=attObj[plugInOptions.DataAttributes.PopUpAttribute];
                                    if(popUpAtt!=null&&popUpAtt!='')
                                        $(targetPopUpCtrl).attr(popUpAtt,targetCtrl);
                                    this.set('queuedDataAttribute',popUpAtt);
                                }
                            }
                        }
                        else {
                            this.set('dataLookUpDataSource',[]);
                            this.set('isPopUpSearchVisiable',false);
                        }

                        $(document).off('keypress',targetCtrl);   //Everytime unbinding first, the column type may change from one type to another
                        $(document).on('keypress',
                            targetCtrl,
                            function(evt) {
                                var resolveId=parseInt($(this).val());
                                if(evt.keyCode==13&&bindingRoot.get('dataLookUpDataSource')!=null&&resolveId>0) {
                                    evt.preventDefault();
                                    var url=settings.selectedDataSourceUrl+bindingRoot.get('dataLookUpDataSource')+"="+resolveId;
                                    var myParent=this;
                                    $(this).ajaxCall(url,
                                        {})
                                        .success(function(data) {
                                            if(data.Resolved) {
                                                $(myParent).val(data.SupplierId+', '+data.SupplierName);
                                            }
                                        });
                                    return;
                                }

                                var charCode=(evt.which)? evt.which:event.keyCode
                                if(charCode!=46&&charCode>31&&(charCode<48||charCode>57))
                                    return false;

                                return true;
                            });
                    } else if(selectedItem.Type==='text') {
                        this.set('selectedOperator',plugInOptions.OperatorIndex.Contains);
                        this.set('isOperatorEnabled',true);
                        this.set('isOperatorVisible',true);
                        this.set('isDataFieldVisiable',true);
                        this.set('isDataLookUpVisiable',false);
                        this.set('isCalendarDateListPickerVisible',false);
                        this.set('isDatePickerFromToVisible',false);
                        this.set('isPopUpSearchVisiable',false);
                        //this.set('enteredDataFieldValue','');

                        //Remove numeric constraint
                        //$(document).off('keyup','#'+criteriarow.children()[2].id);
                        $(document).off('keypress',targetCtrl);
                    } else if(selectedItem.Type==='lookup') {
                        this.set(
                            'selectedOperator',
                            plugInOptions.OperatorIndex.ExactMatch
                        );
                        this.set('isOperatorEnabled',false);
                        this.set('isOperatorVisible',true);
                        this.set('isDataFieldVisiable',false);
                        this.set('isDataLookUpVisiable',true);
                        this.set('isCalendarDateListPickerVisible',false);
                        this.set('isDatePickerFromToVisible',false);
                        this.set('isPopUpSearchVisiable',false);

                        //Check the datasource type, get the data if it's url raw type
                        if(typeof (selectedItem.DataLookup)==='string') {
                            var activeDs=GetDataSource(selectedItem.DataLookup);
                            var myParent=this;
                            activeDs.read().then(function() {
                                myParent.set('dataLookUpDataSource',activeDs.view());
                                selectedItem.DataLookup=activeDs.view();   //Put in Cache
                            });
                        }
                        else {  //Fetch from cache
                            this.set('dataLookUpDataSource',selectedItem.DataLookup);
                        }
                        //this.set('selectedDataLookupIndex', 1);    //This is an issue here, binding to the value not the sort-order
                    } //This date range
                    else {
                        this.set(
                            'selectedOperator',
                            plugInOptions.OperatorIndex.ExactMatch
                        );
                        this.set('isOperatorEnabled',false);
                        this.set('isOperatorVisible',false);
                        this.set('isDataFieldVisiable',false);
                        this.set('isDataLookUpVisiable',false);
                        this.set('isCalendarDateListPickerVisible',true);
                        this.set('isPopUpSearchVisiable',false);

                        if(NullishCheck(this.get('selectedCalendarDataLookupIndex'),'Text')==='Custom')
                            this.set('isDatePickerFromToVisible',true);

                        //Check for Calendar datasource 
                        if(typeof selectedItem.DataLookup==='string') {   //Has url
                            var activeDs=GetDataSource(selectedItem.DataLookup);
                            var myParent=this;
                            activeDs.read().then(function() {
                                myParent.set('calendarDataLookUpDataSource',activeDs.view());
                                selectedItem.DataLookup=activeDs.view(); //Put in Cache
                            });
                        } else if(selectedItem.DataLookup===null) {  //Use default if not provided
                            this.set('calendarDataLookUpDataSource',defaultCalendarLookUpDataSource);
                        } else { //Fetch from cache
                            this.set('calendarDataLookUpDataSource',selectedItem.DataLookup);
                        }
                    }
                },

                onOperatorChange: function() {
                    ConsoleLog(
                        'Operator change: Index='+
                        kdo.stringify(this.get('selectedOperator'),null,4)+
                        ', Text='+settings.selectedOperatorDataSource[this.get('selectedOperator')].Text
                    );
                },

                onSelectDateFromChange: function() {
                    ConsoleLog(
                        'DateFrom change: Value='+
                        kdo.stringify(this.get('selectedCalendarDateFromValue').toLocaleDateString(),null,4)
                    );
                },

                onSelectDateToChange: function() {
                    ConsoleLog(
                        'DateTo change: Value='+
                        kdo.stringify(this.get('selectedCalendarDateToValue').toLocaleDateString(),null,4)
                    );
                },

                onDataFieldLookupChange: function(e) {
                    var dataItem=e.sender.dataItem();
                    this.set('selectedDataLookupText',dataItem.Text);
                    ConsoleLog(
                        'LookUp value change: Index='+
                        kdo.stringify(parseInt(this.get('selectedDataLookupIndex')),null,4)+
                        ', Text='+dataItem.Text
                    );
                },

                onCalendarDataFieldLookupChange: function(e) {
                    var dataItem=e.sender.dataItem();
                    ConsoleLog(
                        'Calendar LookUp value change: Index='+
                        kdo.stringify(parseInt(this.get('selectedCalendarDataLookupIndex')),null,4)+
                        ', Text='+dataItem.Text
                    );
                    this.set('isDatePickerFromToVisible',dataItem.Text=='Custom');
                    this.set('selectedCalendarDataLookupValue',dataItem.Text);
                },

                onAddRemoveClick: function(e) {
                    e.stopPropagation();
                    if(e.currentTarget.name===plugInOptions.Icons.Add) {
                        AddRow(totalrow);
                    } else {
                        e.currentTarget.parentNode.remove();
                        totalrow--;
                    }
                },

                onResetClick: function(e) {
                    e.stopPropagation();
                    ConsoleLog('Reset button clicked');
                    $this.html('');
                    totalrow=0;
                    AddRow(totalrow++,null);
                    //Remember to reset cache if adde in the future
                },

                onGetDataClick: function(e) {
                    e.stopPropagation();
                    //Improvement: arr.slice().reverse().forEach(x => console.log(x))

                    ConsoleLog("----------------------------------------------------------------------------------------------------------------------------------");
                    var selectedDate=GetSelectionStateData();
                    selectedDate.forEach(function(rowModel,index) {
                        ConsoleLog(FormatRowType(rowModel,index+1));
                    });

                    //ConsoleLog(JSON.stringify(GetSelectionStateData(), null, 4));       //Indent with space
                    ConsoleLog("----------------------------------------------------------------------------------------------------------------------------------");
                },

                onGetDataSourceClick: function(e) {
                    e.stopPropagation();
                    ToggleConsole("JsonFormat");
                    var ctlId=$(jsonFormatCtl)[0].children[1].id;
                    document.getElementById(ctlId).textContent=JSON.stringify(GetSelectionStateData(),null,4);
                },

                onClearLogClick: function(e) {
                    e.stopPropagation();
                    ClearConsole();
                },

                columnDataSource: settings.selectedColumnDataSource,
                operatorDataSource: settings.selectedOperatorDataSource,
                dataLookUpDataSource: [] //Unkonwn yet until lookup column selected
            });
        }

        function AddRow(rowIndex,defaultModel) {
            var btnname=rowIndex===0? plugInOptions.Icons.Add:plugInOptions.Icons.Delete;
            var btnnameTip=(rowIndex===0)? plugInOptions.IconsTip.Add:plugInOptions.IconsTip.Delete;

            //Find the first index which is not in the array
            var onScreenList=getAddedColumnOnScreen();

            var nextColumnList=allColumnValues.filter(
                n => !onScreenList.includes(n)
            ).filter(
                n => !disabledValues.includes(n)
            );

            //nextColumnList = nextColumnList.filter(
            //    n => !disabledValues.includes(n)
            //);


            //Define dynamica columns
            var criteriaRowId='criteriaRow_'+rowIndex;
            var criteriaRow=$("<div id='"+criteriaRowId+"' class='criteriarow'></div>");
            var column=$("<input id='column_"+
                rowIndex+randomPrefix+
                "' data-role='dropdownlist' data-auto-bind='false' data-field-lookup='SubLookUp' data-text-field='Text' data-value-field='Value' data-template='kendoDropdownTemplateWithDisabledItem' data-bind='value: selectedColumn, source: columnDataSource, events: { change: onColumnChange, select: onColumnSelect }' style='min-width:170px;'/>"
            );

            var operator=$(
                "<input id='operator_"+
                rowIndex+randomPrefix+
                "' data-role='dropdownlist' data-auto-bind='false' data-text-field='Text' data-value-field='Value' data-bind='value: selectedOperator, source: operatorDataSource, visible: isOperatorVisible, enabled: isOperatorEnabled, events: { change: onOperatorChange }' style='min-width:100px;margin-left:"+plugInOptions.Control.MarginLeft+"px;'/>"
            );

            var datafield=$(
                "<input type='text' id='dataField_"+rowIndex+randomPrefix+
                "' data-bind='value: enteredDataFieldValue, visible: isDataFieldVisiable' style='width:"+plugInOptions.ResizeMetrics.ResizeBase[resizeIndex]+"px; height:16px;margin-left:"+plugInOptions.Control.MarginLeft+"px;'/>"
            );

            var datalookup=$(
                "<input id='dataFieldLookup_"+
                rowIndex+randomPrefix+
                "' data-role='dropdownlist' data-option-label='Select One' data-auto-bind='false' data-text-field='Text' data-value-field='Value' data-bind='value: selectedDataLookupIndex, source: dataLookUpDataSource, visible: isDataLookUpVisiable, events: { change: onDataFieldLookupChange }' style='min-width:"+eval(plugInOptions.ResizeMetrics.ResizeBase[resizeIndex]+plugInOptions.ResizeMetrics.ResizeDropDownDelta[resizeIndex])+"px;margin-left:"+plugInOptions.Control.MarginLeft+"px;'/>"
            );

            //var popupbtn=$(
            //    "<button id='popUpbtn_"+
            //    rowIndex+randomPrefix+"'"+
            //    "data-adsearch-supplier-target='#"+datafieldId+"'"+
            //    " parentdiv='"+
            //    criteriaRowId+
            //    "' data-bind='visible:isPopUpSearchVisiable' class='k-button btn btn-small' style='position:relative;z-index:1;height:26px;' " +
            //    " name='popUpbtn_search'" +
            //    " data-adsearch-supplier-target=''" +
            //    "' title='Search'><span class='k-icon k-i-search"+
            //    "'></span></button>"
            //);

            var popupbtn=$(
                "<button id='popUpbtn_"+
                rowIndex+randomPrefix+"'"+
                " parentdiv='"+
                criteriaRowId+
                "' data-bind='visible:isPopUpSearchVisiable' class='k-button btn btn-small' style='position:relative;z-index:1;height:26px;margin-left:"+plugInOptions.Control.MarginLeft+"px;' "+
                " name='popUpbtn_search'"+
                " data-adsearch-supplier-target=''"+
                " title='Search'><span class='k-icon k-i-search"+
                "'></span></button>"
            );

            var datePickerFrom=$(
                "<input id='calendarDatePickerFrom_'"+
                rowIndex+randomPrefix+
                "' data-role='datepicker' data-bind='visible: isDatePickerFromToVisible, value: selectedCalendarDateFromValue, events: { change: onSelectDateFromChange }' style='width:"+eval(plugInOptions.ResizeMetrics.ResizeBase[resizeIndex]+plugInOptions.ResizeMetrics.ResizeCalendarDelta[resizeIndex])+"px; height:24px;margin-left:"+plugInOptions.Control.MarginLeft+"px;'>"
            );
            var datePickerTo=$(
                "<input id='calendarDatePickerTo_'"+
                rowIndex+randomPrefix+
                "' data-role='datepicker' data-bind='visible: isDatePickerFromToVisible, value: selectedCalendarDateToValue, events: { change: onSelectDateToChange }' style='width:"+eval(plugInOptions.ResizeMetrics.ResizeBase[resizeIndex]+plugInOptions.ResizeMetrics.ResizeCalendarDelta[resizeIndex])+"px; height:24px;margin-left:"+plugInOptions.Control.MarginLeft+"px;'>"
            );

            var calendarDatalookup=$(
                "<input id='calendarDataFieldLookup_ "+
                rowIndex+randomPrefix+
                "' data-role='dropdownlist' data-option-label='Select One' data-auto-bind='false' data-text-field='Text' data-value-field='Value' data-bind='value: selectedCalendarDataLookupIndex, source: calendarDataLookUpDataSource, visible: isCalendarDateListPickerVisible, events: { change: onCalendarDataFieldLookupChange }' style='min-width:100px;margin-left:"+plugInOptions.Control.MarginLeft+"px;'/>"
            );


            //This onclick can not find defined function
            var operationbtn=$(
                "<button id='operationbtn_"+
                rowIndex+randomPrefix+
                "' parentdiv='"+
                criteriaRowId+
                "' data-bind='click: onAddRemoveClick' class='k-button btn btn-small' style='position:relative;z-index:1;height:26px;margin-left:"+plugInOptions.Control.MarginLeft+"px;' name='"+
                btnname+
                "' title='"+
                btnnameTip+
                "'><span class='k-icon k-i-"+
                btnname+
                "'></span></button>"
            );

            criteriaRow.append(column,[
                operator,
                datafield,
                datalookup,
                // popupbtn,
                calendarDatalookup,
                datePickerFrom,
                datePickerTo,
                operationbtn
            ]);

            if(btnname==plugInOptions.Icons.Add) {
                var resetbtn=$(
                    "<button id='resetbtn_"+
                    rowIndex+randomPrefix+
                    "' parentdiv='"+
                    criteriaRowId+
                    "' data-bind='click: onResetClick' class='k-button btn btn-small' style='position:relative;z-index:1;height:26px;margin-left:"+plugInOptions.Control.MarginLeft+"px;' name='reset' title='"+
                    plugInOptions.IconsTip.Reset+
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
                //criteriaRow.append(resizeDatabtn);
                //criteriaRow.append(historybtn);

                if(settings.EnableLog) {
                    //::::Log enabled debugging button :::://
                    var getDatabtn=$(
                        "<button id='getdatabtn_"+
                        rowIndex+
                        randomPrefix+
                        "' parentdiv='"+
                        criteriaRowId+
                        "' data-bind='click: onGetDataClick' class='k-button btn btn-small' style='position:relative;z-index:1;height:26px;' name='GetData' title='"+
                        plugInOptions.IconsTip.GetData+
                        "'>Criteria</button>"
                    );

                    var getDataSourcebtn=$(
                        "<button id='getdatasourcebtn_"+
                        rowIndex+
                        randomPrefix+
                        "' parentdiv='"+
                        criteriaRowId+
                        "' data-bind='click: onGetDataSourceClick' class='k-button btn btn-small' style='position:relative;z-index:1;height:26px;' name='GetDataSource' title='"+
                        plugInOptions.IconsTip.GetDataSource+
                        "'>DataSoure</button>"
                    );

                    var clearDatabtn=$(
                        "<button id='cleardatabtn_"+
                        rowIndex+
                        randomPrefix+
                        "' parentdiv='"+
                        criteriaRowId+
                        "' data-bind='click: onClearLogClick' class='k-button btn btn-small' style='position:relative;z-index:1;height:26px;' name='ClearLog' title='"+
                        plugInOptions.IconsTip.ClearLogData+
                        "'>Clear Log</button>"
                    );

                    criteriaRow.append(getDatabtn);
                    criteriaRow.append(getDataSourcebtn);
                    criteriaRow.append(clearDatabtn);
                }
            }
            criteriaRow.append(popupbtn);


            $this.append(criteriaRow);

            var rowModel=getModelViewObservable();
            if(defaultModel!=null) {
                Object.keys(defaultModel).forEach(function(key,index) {
                    rowModel[key]=defaultModel[key];   //Restore events, lost after serialiazation
                });
            }

            kdo.bind(criteriaRow,rowModel);

            //Increase the row counter to create unique controls on screen
            totalrow++;

            //Set Next Column in Sequence
            //Also need to find disable the column, then filter them
            if(nextColumnList.length===0) {
                SetNextSelectColumnDefault(column,rowModel.selectedColumn);
                ConsoleLog(
                    'Restart from column index from 0 :  '+rowModel.selectedColumn
                );
            } else {
                if(rowIndex===0)
                    SetNextSelectColumnDefault(column,rowModel.selectedColumn);
                else
                    SetNextSelectColumnDefault(column,parseInt(nextColumnList[0]));
                ConsoleLog(
                    'Added column sequence index:  '+
                    parseInt(nextColumnList[0])+
                    ', Text:  '+settings.selectedColumnDataSource[nextColumnList[0]-1].Text
                );
            }


        }

        //Defined SetNextSelectCoumnDefault
        //For 05/05/2020
        function SetNextSelectColumnDefault(sender,index) {
            //ConsoleLog('Next column candidate: '+ settings.selectedColumnDataSource[index].Text);
            //Need to reset index when reaches length
            try {
                //var dd = $(sender).data('kendoDropDownList');
                //var totalItems = dd.dataSource.data().length;
                //var dataItem = dd.dataItem(index - 1);
                $(sender).data('kendoDropDownList').select(index-1); //kendo dropdownlist index starts with 0;
                $(sender).getKendoDropDownList().trigger('change');
            }
            catch(err) {
                kdo.alert(err.message);
            }
        }

        function getAddedColumnOnScreen() {
            var selectedColunmList=[];
            for(var index=0;index<$this.get(0).children.length;index++) {
                var targetDiv=$this.get(0).children[index]; //This object is the ctl passed in Root
                var firstChild=$this.get(0).children[index].childNodes[0];
                var inputCtl=$(
                    '#'+
                    $(firstChild)
                        .find('input')
                        .get(0).id
                );

                var bs=$(inputCtl).get(0).kendoBindingTarget.source;
                selectedColunmList.push(bs.selectedColumn);
            }
            return selectedColunmList;
        }

        //Doing some default
        //var initialRowModel = getModelViewObservable();
        //initialRowModel.selectedColumn = 4;
        var initialRowModel=null;

        AddRow(totalrow++,initialRowModel);

        if(settings.EnableLog) {
            asConsolectl=
                "<div style='padding-top: 1em;' id='"+randomPrefix+"_kendoconsoleDiv'><h4 style='margin:0em'>Console Log</h4><div class='console'></div></div>";
            $this.before(asConsolectl);

            jsonFormatCtl="<div style='padding-top: 1em;display:none' id='"+randomPrefix+"_jsonOutputDiv'><h4 style='margin: 0em'>Json Output</h4><pre id='"+randomPrefix+"_jsonOutput' style='height:250px;overflow:auto;background:white;'></pre></div>";
            $this.before(jsonFormatCtl);
        }

        function GetSelectionStateData() {
            var dataModels=[];

            for(var index=0;index<$this.get(0).children.length;index++) {
                var targetDiv=$this.get(0).children[index]; //This object is the ctl passed in Root
                var firstChild=$this.get(0).children[index].childNodes[0];
                var inputCtl=$(
                    '#'+
                    $(firstChild)
                        .find('input')
                        .get(0).id
                );
                var rowModel=$(inputCtl).get(0).kendoBindingTarget.source;
                dataModels.push(rowModel);
            }
            return dataModels;
        }

        function DaysBetween(dateFrom,dateTo) {
            const ONE_DAY=1000*60*60*24;                // The number of milliseconds in one day
            const differenceMs=Math.abs(dateFrom-dateTo);   // Calculate the difference in milliseconds
            // Convert back to days and return
            return Math.round(differenceMs/ONE_DAY);
        }

        var MappedCriterias=function() {
            var searchCriteria=GetSelectionStateData();
            var searchModel={};
            var SearchOperator="SearchOperator";
            var SearchDateFrom="From";
            var SearchDateTo="To";

            $.each(searchCriteria,function(index,row) {
                var selectedColumn=row.columnDataSource[row.selectedColumn-1];

                if(selectedColumn.Type==='integer') {
                    searchModel[selectedColumn.ColumnMap]=parseInt(row.enteredDataFieldValue);
                }
                else if(selectedColumn.Type==='text') {
                    searchModel[selectedColumn.ColumnMap]=row.enteredDataFieldValue;
                    searchModel[selectedColumn.ColumnMap+SearchOperator]=row.selectedOperator;
                }
                else if(selectedColumn.Type==='lookup') {
                    if(typeof row.selectedDataLookupIndex=='object'&&row.selectedDataLookupIndex!=null)
                        searchModel[selectedColumn.ColumnMap]=row.selectedDataLookupIndex.Value;
                    else
                        searchModel[selectedColumn.ColumnMap]=row.selectedDataLookupIndex;
                }
                else if(selectedColumn.Type==='daterange') {
                    let selectedDays=0;
                    var dF=new Date();

                    if(row.selectedCalendarDataLookupIndex!=null&&row.selectedCalendarDataLookupIndex.Text!='Custom') {
                        selectedDays=parseInt(row.selectedCalendarDataLookupIndex.Text);
                        searchModel[selectedColumn.ColumnMap]=selectedDays;
                        dF.setDate(dF.getDate()-selectedDays);
                        searchModel[selectedColumn.ColumnMap+SearchDateTo]=new Date();
                        searchModel[selectedColumn.ColumnMap+SearchDateFrom]=dF;
                    }
                    else if(row.selectedCalendarDataLookupIndex!=null&&row.selectedCalendarDataLookupIndex.Text=='Custom') {
                        if(row.selectedCalendarDateToValue!=null&&row.selectedCalendarDateFromValue!=null) {
                            searchModel[selectedColumn.ColumnMap+SearchDateTo]=row.selectedCalendarDateToValue;
                            searchModel[selectedColumn.ColumnMap+SearchDateFrom]=row.selectedCalendarDateFromValue;
                            searchModel[selectedColumn.ColumnMap]=DaysBetween(row.selectedCalendarDateFromValue,row.selectedCalendarDateToValue);
                        }
                    }
                    else {
                        var nullRow=row.selectedCalendarDataLookupIndex;  //Select one is considered null row 
                    }
                }
            });
            //kdo.alert(kdo.stringify(searchModel,null,4));
            return searchModel;
        }

        //public function
        var SearchData=function(e) {
            var criteriaList=[];
            //ConsoleLog("Total datarow ; " + $this.get(0).children.length);

            for(var index=0;index<$this.get(0).children.length;index++) {
                var criteria={};
                // ConsoleLog("<<<<<<<<<<<<<<<<<<<<Index value:" + index);
                var targetDiv=$this.get(0).children[index]; //This object is the ctl passed in Root

                //ConsoleLog("Children = " + thisObject.get(0).children[index]);
                //ConsoleLog("Children = " + thisObject.get(0).children[index].children[0]);

                var firstChild=$this.get(0).children[index].childNodes[0];
                var inputCtl=$(
                    '#'+
                    $(firstChild)
                        .find('input')
                        .get(0).id
                );
                var bs=$(inputCtl).get(0).kendoBindingTarget.source;

                // ConsoleLog.log("-----------------Get Advanced Data Final Begin-----------------------");
                // ConsoleLog.log("Selected Column: " + bs.selectedColumn + " Selected Operator: " + bs.selectedOperator + " Data Type: " + bs.selectedColumnType);
                // ConsoleLog.log("-----------------Get Advanced Data Final End-----------------------");
                criteria.FieldNameIndex=bs.selectedColumn;
                criteria.FiledNameValue=
                    settings.selectedColumnDataSource[bs.selectedColumn-1].Text;
                criteria.FieldOperatorIndex=null;
                criteria.FieldOperatorValue=null;

                if(bs.selectedColumnType!='DateRange') {
                    criteria.FieldOperatorIndex=bs.selectedOperator;
                    criteria.FieldOperatorValue=
                        settings.selectedOperatorDataSource[bs.selectedOperator].Text;
                }
                criteria.SearchType=bs.selectedColumnType;
                criteria.DateFromValue=null;
                criteria.DateToValue=null;
                criteria.Value=null;
                criteria.SelectedLookUpIndex=null;
                criteria.SelectedLookUpValue=null;
                criteria.LookUpDataSource=null;

                if(bs.selectedColumnType==='lookup') {
                    criteria.SelectedLookUpIndex=bs.selectedDataLookupIndex;
                    criteria.SelectedLookUpValue=bs.selectedDataLookupValue;
                    criteria.LookUpDataSource=bs.dataLookUpDataSource;
                } else if(bs.selectedColumnType==='DateRange') {
                    criteria.DateFromValue=bs.selectedDateFrom;
                    criteria.DateToValue=bs.selectedDateTo;
                } else {
                    criteria.Value=bs.enteredDataFieldValue;
                }
                criteriaList.push(criteria);
            }

            return criteriaList;
        };


        var DataSource=function(e) {
            return GetSelectionStateData();
        };

        var SetData=function(ds) {
            $this.html('');
            totalrow=0;
            var rowsCount=ds.length;
            $.each(ds,function(index,val) {
                AddRow(totalrow++,val);
                ConsoleLog('Value Entered: '+val.enteredDataFieldValue);
            });
        };

        var ClearData=function() {
            $this.html('');
            totalrow=0;
            AddRow(totalrow++,null);
        };

        return {
            //SearchData: SearchData,   //Obsoleted 
            SetData: SetData,
            ClearData: ClearData,
            DataSource: DataSource,
            MappedCriterias: MappedCriterias
        };
    };
})(jQuery,kendo);
