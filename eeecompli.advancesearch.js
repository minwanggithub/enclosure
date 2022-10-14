//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::Min Wang: 05/01/2020 -- Note ----
//:::::An Universal jQuery Advance Search Control for dynamically extract criteria based on bypassing datasource
//:::::Dependency: jQuery and Kendo UI
//:::::Warning: New development involvement
//:::::Any new enhancement added to this collection may impact the functionality of the control
//:::::please verify the items below
//:::::  1. Data detail in DataSource retrieve
//:::::  2. Data Profile
//:::::  3. Add new row, the sequence is as expected
//:::::  4. Data Attribute with call back functions (Supplier and Mfr validation and search function)
//:::::  5. Data validation and constraints (integer, operators)
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

        var defaultCategoryDataSource=[
            {
                Text: 'Category 1',
                Value: '1'
            },
            {
                Text: 'Category 2',
                Value: '2'
            },
            {
                Text: 'Category 3',
                Value: '4'
            },
            {
                Text: 'Category 4',
                Value: '8'
            },
            {
                Text: 'Another Category longer',
                Value: '16'
            },
            {
                Text: 'long Category with some words',
                Value: '32'
            },
            {
                Text: 'Another long Category with lots of more words',
                Value: '64'
            },
            {
                Text: 'This is last Category unless we need more for testing',
                Value: '128'
            }
        ];


        //Dummy data
        var defaultColumnDataSource=[{
            Text: "ColumnId",
            Value: "1",
            Sequence: "1",
            Type: "integer",
            DataLookup: null,
            ColumnMap: "ColumnId",
            DataAttributes: null,
            Active: true,
            OperatorGroup: 1
        },{
            Text: "ColumnText",
            Value: "2",
            Sequence: "2",
            Type: "text",
            DataLookup: null,
            ColumnMap: "ColumnText",
            DataAttributes: null,
            Active: true,
            OperatorGroup: 1
        },{
            Text: "ColumnLookUp",
            Value: "3",
            Sequence: "3",
            Type: "lookup",
            DataLookup: defaultLookUpDataSource,
            ColumnMap: "ColumnLookUp",
            DataAttributes: null,
            Active: true,
            OperatorGroup: 1
        },{
            Text: "ColumnDateRange",
            Value: "4",
            Sequence: "4",
            Type: "DateRange",
            DataLookup: defaultCalendarLookUpDataSource,
            ColumnMap: "ColumnDateRange",
            DataAttributes: null,
            Active: true,
            OperatorGroup: 1
        },{
            Text: "ColumnMultiSelect",
            Value: "5",
            Sequence: "5",
            Type: "multilookup",
            DataLookup: defaultCategoryDataSource,
            ColumnMap: "ColumnMultiSelect",
            DataAttributes: null,
            Active: true,
            OperatorGroup: 2
        },{
            Text: "DisabledColumn",
            Value: "6",
            Sequence: "6",
            Type: "text",
            DataLookup: null,
            ColumnMap: "DisabledColumn",
            DataAttributes: null,
            Active: false,
            OperatorGroup: 1
        }];

        //Dummy data, index started with 0 to map original eeeCompli search option, if you modify the database, here has to be modified
        var defaultOperatorDataSource=[
            {
                Text: 'Contains',
                Value: '0',
                Type: 'integer',
                Active: true,
                OperatorGroup: 1
            },
            {
                Text: 'Exact Match',
                Value: '1',
                Type: 'integer',
                Active: true,
                OperatorGroup: 1
            },
            {
                Text: 'Starts With',
                Value: '2',
                Type: 'integer',
                Active: true,
                OperatorGroup: 1
            },
            {
                Text: 'Ends With',
                Value: '3',
                Type: 'integer',
                Active: true,
                OperatorGroup: 1
            },
            {
                Text: 'Match Any',
                Value: '0',
                Type: 'integer',
                Active: true,
                OperatorGroup: 2
            },
            {
                Text: 'Match All',
                Value: '1',
                Type: 'integer',
                Active: true,
                OperatorGroup: 2
            }
        ];

        options=options||{}; //make sure options is not null, or can extend to define default options
        var $this=$(this);
        var asConsolectl,jsonFormatCtl;
        var totalrow=0;
        var profileHwnd;
        var historyDataSource=[];


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
                searchCallBack: null,
                ExtendWidth: false,
                EnableLog: false               //Intended to use Capital for First letter for default = false
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
                SaveCriteria: 'Save Criteria',
                CriteriaHistory: 'Load Criteria History',
                GetData: 'Get selected criterias',
                GetDataSource: 'Get data source',
                ClearLogData: 'Clear Log data',
                ResizeControl: 'Resize Control'
            },
            OperatorIndex: {
                Contains: defaultOperatorDataSource[0].Value,
                ExactMatch: defaultOperatorDataSource[1].Value,
                StartsWith: defaultOperatorDataSource[2].Value,
                EndsWith: defaultOperatorDataSource[3].Value,
                MatchAny: defaultOperatorDataSource[4].Value,
                MatchAll: defaultOperatorDataSource[5].Value,
            },
            DataAttributes: {
                PopUpAttribute: "PopUpAttribute",
                DetailRedirectAttribute: "DetailRedirectAttribute"
            },
            BindingTemplate: {
                DisabledKendoDropdownTemplate: "#kendoDropdownTemplateWithDisabledItem"
            },
            ResizeMetrics: {
                ResizeBase: [200,400],                          //Default 200,400,500
                ResizeDropDownDelta: [14,14],                   //Default 14,14,14
                ResizeMultiDropDownDelta: [14,14],              //Default 14,14,14
                ResizeCalendarDelta: [-94,-194]                 //Default -94,194,-244
            },
            Window: {
                HistoryWindowTitle: "Manage History"
            },
            Control: {
                MarginLeft: 2,
                Index: {
                    ColumnDefinitionName: 0,
                    OperatorType: 1,
                    DataField: 2,                               //Mutually exclusive
                    DataLookUp: 2,                              //Mutually exclusive
                    DataMulitLookUp: 3,
                    DatePickerFrom: 4,
                    DatePickerTo: 5,
                    CalendarDataLookUp: 6,
                    Operationbutton: 7,
                    ResetButton: 8,
                    DataAttributeSearchPopUp: 9,
                    DataAttributeLoadDetail: 10,
                    GetDataButton: 11,
                    GetDataSourceButton: 12,
                    ClearDataButton: 13,
                    HistoryButton: 14

                }
            }
        };

        var allColumnValues=settings.selectedColumnDataSource.map(a => a.Value);
        var disabledValues=settings.selectedColumnDataSource.filter(a => a.Active==0).map(a => a.Value);

        var resizeIndex=(settings.ExtendWidth==true? 1:0);

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

        function HookUpCallBackOnKeyUp(targetCtrl,caller) {
            $(document).off('keyup',targetCtrl)
            $(document).on(
                'keyup',
                targetCtrl,
                function(evt) {
                    if(evt.keyCode==13&&!evt.ctrlKey) {
                        if($.isFunction(settings.searchCallBack)) {
                            settings.searchCallBack.call(caller);
                        }
                    }
                }
            );
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
                profileVersion: '2022_v1.0',                                   //Tracking the the version for future debugging
                selectedColumn: settings.selectedFirstDefaultColumn,
                selectedColumnText: '',                                        //Will track persistent column info, in case it will be removed from DB
                selectedColumnType: 'text',
                selectedOperator: 1,
                isVisible: true,
                isOperatorVisible: true,
                isOperatorEnabled: true,
                isDataFieldVisiable: true,
                isDataLookUpVisiable: false,
                isDataMultiLookUpVisiable: false,
                isPopUpSearchVisiable: false,
                selectedDataLookupName: '',
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
                selectedMultiDataLookupValues: [],

                onColumnSelect: function(e) {
                    //var currentItem = e.sender.dataItem();
                    var selectedItem=e.dataItem;

                    if(selectedItem.Active===false) {
                        //kdo.alert("This column has been disabled and can not be selected");
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
                    var targetCtrl='#'+criteriarow.children()[2].id;

                    //Dequeue any accumulated data attribute
                    //if(this.get('queuedDataAttribute')!='') {
                    //    $(targetPopUpCtrl).removeAttr(this.get('queuedDataAttribute'));
                    //    this.set('queuedDataAttribute','');
                    //}
                    this.set('selectedColumnText',selectedItem.Text);
                    this.set('selectedColumnType',selectedItem.Type);
                    if(selectedItem.Type==='integer') {
                        this.set('isOperatorEnabled',false);
                        this.set('isOperatorVisible',true);
                        this.set('isDataFieldVisiable',true);
                        this.set('isDataLookUpVisiable',false);
                        this.set('isDataMultiLookUpVisiable',false);
                        this.set('isCalendarDateListPickerVisible',false);
                        this.set('isDatePickerFromToVisible',false);
                        this.set('enteredDataFieldValue',"");

                        this.set('operatorDataSource',settings.selectedOperatorDataSource.filter(element => selectedItem.OperatorGroup==element.OperatorGroup));
                        this.set(
                            'selectedOperator',
                            plugInOptions.OperatorIndex.ExactMatch
                        );

                        var bindingRoot=this;                    //Save observable for later keypress binding to use
                        if(selectedItem.DataLookup!=null) {
                            this.set('dataLookUpDataSource',selectedItem.DataLookup);   //This is very important because every time the column changes
                            this.set('isPopUpSearchVisiable',true);
                            if(selectedItem.DataAttributes!=null) {
                                var attObj=JSON.parse(selectedItem.DataAttributes);
                                if(attObj!=null) {
                                    var popUpAtt=attObj[plugInOptions.DataAttributes.PopUpAttribute];
                                    if(popUpAtt!=null&&popUpAtt!='') {
                                        var popUpSenderCtrl=criteriarow.children('button['+popUpAtt+']');
                                        $(popUpSenderCtrl).attr(popUpAtt,targetCtrl);
                                    }

                                    var loadDetailAtt=attObj[plugInOptions.DataAttributes.DetailRedirectAttribute];
                                    if(loadDetailAtt!=null&&loadDetailAtt!='') {
                                        var loadDetailSenderCtrl=criteriarow.children('button['+loadDetailAtt+']');
                                        $(loadDetailSenderCtrl).attr(loadDetailAtt,targetCtrl);
                                    }
                                    //this.set('queuedDataAttribute',popUpAtt);
                                }
                            }
                        }
                        else {
                            this.set('dataLookUpDataSource',[]);
                            this.set('isPopUpSearchVisiable',false);
                        }

                        HookUpCallBackOnKeyUp(targetCtrl,this);

                        $(document).off('keypress',targetCtrl);   //Everytime unbinding first, the column type may change from one type to another
                        $(document).on('keypress',
                            targetCtrl,
                            function(evt) {
                                var resolveId=parseInt($(this).val());
                                //if(evt.keyCode==13) {
                                //    if($.isFunction(settings.searchCallBack)) {
                                //        settings.searchCallBack.call(this);
                                //    }
                                //    return;
                                //}

                                if((evt.keyCode==10||(evt.keyCode==13&&evt.ctrlKey))
                                    &&bindingRoot.get('dataLookUpDataSource')!=null
                                    &&bindingRoot.get('dataLookUpDataSource').length>0
                                    &&resolveId>0) {
                                    evt.preventDefault();
                                    var url=settings.selectedDataSourceUrl+bindingRoot.get('dataLookUpDataSource')+"="+resolveId;
                                    var myParent=this;

                                    $(this).ajaxCall(url,
                                        {})
                                        .success(function(data) {
                                            if(data.Resolved) {
                                                $(myParent).val(data.SupplierId+', '+data.SupplierName);
                                            }
                                            else
                                                $(myParent).val('');
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
                        this.set('isDataMultiLookUpVisiable',false);
                        this.set('isCalendarDateListPickerVisible',false);
                        this.set('isDatePickerFromToVisible',false);
                        this.set('isPopUpSearchVisiable',false);
                        this.set('enteredDataFieldValue','');

                        this.set('operatorDataSource',settings.selectedOperatorDataSource.filter(element => selectedItem.OperatorGroup==element.OperatorGroup));

                        $(document).off('keypress',targetCtrl);
                        HookUpCallBackOnKeyUp(targetCtrl,this);
                    } else if(selectedItem.Type==='lookup') {
                        this.set('isOperatorEnabled',false);
                        this.set('isOperatorVisible',true);
                        this.set('isDataFieldVisiable',false);
                        this.set('isDataLookUpVisiable',true);
                        this.set('isDataMultiLookUpVisiable',false);
                        this.set('isCalendarDateListPickerVisible',false);
                        this.set('isDatePickerFromToVisible',false);
                        this.set('isPopUpSearchVisiable',false);
                        this.set('operatorDataSource',settings.selectedOperatorDataSource);


                        this.set('operatorDataSource',settings.selectedOperatorDataSource.filter(element => selectedItem.OperatorGroup==element.OperatorGroup));
                        this.set(
                            'selectedOperator',
                            plugInOptions.OperatorIndex.ExactMatch
                        );

                        //Check the datasource type, get the data if it's url raw type
                        if(typeof (selectedItem.DataLookup)==='string') {
                            var activeDs=GetDataSource(selectedItem.DataLookup);
                            this.set('selectedDataLookupName',selectedItem.DataLookup);
                            var myParent=this;
                            activeDs.read().then(function() {
                                myParent.set('dataLookUpDataSource',activeDs.view());
                                selectedItem.DataLookup=activeDs.view();   //Put in Cache
                            });
                        }
                        else {  //Fetch from cache
                            this.set('dataLookUpDataSource',selectedItem.DataLookup);
                        }
                        this.set('selectedDataLookupIndex',null);    //This is an issue here, binding to the value not the sort-order
                    } //This date range
                    else if(selectedItem.Type==='multilookup') {
                        this.set('isOperatorEnabled',true);
                        this.set('isOperatorVisible',true);
                        this.set('isDataFieldVisiable',false);
                        this.set('isDataLookUpVisiable',false);
                        this.set('isCalendarDateListPickerVisible',false);
                        this.set('isDatePickerFromToVisible',false);
                        this.set('isPopUpSearchVisiable',false);
                        this.set('isDataMultiLookUpVisiable',true);
                        this.set('dataLookUpMultiDataSource',selectedItem.DataLookup);

                        this.set('operatorDataSource',settings.selectedOperatorDataSource.filter(element => selectedItem.OperatorGroup==element.OperatorGroup));
                        this.set(
                            'selectedOperator',
                            plugInOptions.OperatorIndex.MatchAny
                        );
                    }
                    else {
                        this.set(
                            'selectedOperator',
                            plugInOptions.OperatorIndex.ExactMatch
                        );
                        this.set('isOperatorEnabled',false);
                        this.set('isOperatorVisible',false);
                        this.set('isDataFieldVisiable',false);
                        this.set('isDataLookUpVisiable',false);
                        this.set('isDataMultiLookUpVisiable',false);
                        this.set('isCalendarDateListPickerVisible',true);
                        this.set('isPopUpSearchVisiable',false);
                        this.set('operatorDataSource',settings.selectedOperatorDataSource);

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

                onOperatorChange: function(e) {
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

                onDataFieldMultiLookupChange: function(e) {
                    //ConsoleLog(
                    //    'LookUp values change: '+
                    //    kendo.stringify(this.get('selectedDataLookupIndex'),null,4)
                    //);
                    //var dataItem=e.sender.dataItem();
                    var dataItems=this.get('selectedMultiDataLookupValues');
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
                    //Remember to reset cache if added in the future
                },

                //Min: 06/14/2022
                //Reserved for history management
                //onHistorySaveClick: function(e) {
                //    e.stopPropagation();
                //    kdo.prompt("Please enter a name to save:","My criteria").then(function(data) {
                //        //kendo.alert(kendo.format("The value that you entered is '{0}'",data));
                //        var rowExist=historyDataSource.some(item => item.HistoryName===data)

                //        if(rowExist) {
                //            kdo.alert("Entry with name '<b>"+data+"</b>' already exists. Please try again.");
                //            return;
                //        }

                //        var criteriaInfo=new Object();
                //        criteriaInfo.HistoryName=data;
                //        criteriaInfo.DataSource=GetSelectionStateData();
                //        criteriaInfo.IsDefault=false;
                //        historyDataSource.push(criteriaInfo);
                //    },function() {
                //        //kendo.alert("Cancelled");
                //    })

                //},

                //onHistoryPopUpClick: function(e) {
                //    e.stopPropagation();
                //    //ManageProfile();
                //},

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

                SetSelectedColumn: function(id) {
                    this.set('selectedColumn',id);
                },

                SetSelectedColumnValue: function(value) {
                    this.set('enteredDataFieldValue',value);
                },

                SetDataLookUpValue: function (value) {
                    this.set('selectedDataLookupIndex', value);
                },

                SetSelectedOperatorValue: function (value) {
                    this.set('selectedOperator', value)
                },

                columnDataSource: settings.selectedColumnDataSource,
                operatorDataSource: settings.selectedOperatorDataSource,
                dataLookUpDataSource: [],            //Unkonwn yet until lookup column selected
                dataLookUpMultiDataSource: [],       //Unkonw  yet until lookup column selected
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

            //MultiSelect header definition
            //var headerOption=$(
            //    "<div type='text/x-kendo-tmpl' id='headerTemplate"+
            //    rowIndex+
            //    "' style='display:none'>"+
            //    "<div class='dropdown-header' style='margin: 0px 0px 5px 80px'>"+
            //    "<span>"+
            //    "<label><input type='radio' name='mtlCategoryMatch' value='MatchAny' data-bind='checked: mtlMatchAnyOrAll'/>Match Any</label>"+
            //    "<label><input type='radio' name='mtlCategoryMatch' value='MatchAll' data-bind='checked: mtlMatchAnyOrAll'/>Match All</label>"+
            //    '</span>'+
            //    '</div>'+
            //    '</div>'
            //);

            var column=$("<input id='column_"+
                rowIndex+randomPrefix+
                "' data-role='dropdownlist' data-auto-bind='false' data-field-lookup='SubLookUp' data-text-field='Text' data-value-field='Value' data-template='kendoDropdownTemplateWithDisabledItem' data-bind='value: selectedColumn, source: columnDataSource, events: { change: onColumnChange, select: onColumnSelect }' style='min-width:170px;'/>"
            );

            var operator=$(
                "<input id='operator_"+
                rowIndex+randomPrefix+
                "' data-role='dropdownlist' data-auto-bind='false' data-text-field='Text' data-value-field='Value' data-template='kendoDropdownTemplateWithDisabledItem' data-bind='value: selectedOperator, source: operatorDataSource, visible: isOperatorVisible, enabled: isOperatorEnabled, events: { change: onOperatorChange, select: onColumnSelect }' style='max-width:105px;margin-left:"+plugInOptions.Control.MarginLeft+"px;'/>"
            );

            var datafield=$(
                "<input type='text' id='dataField_"+rowIndex+randomPrefix+
                "' data-bind='value: enteredDataFieldValue, visible: isDataFieldVisiable' style='width:"+plugInOptions.ResizeMetrics.ResizeBase[resizeIndex]+"px; height:16px;margin-left:"+plugInOptions.Control.MarginLeft+"px;'/>"
            );

            var datalookup=$(
                "<input id='dataFieldLookup_"+
                rowIndex+randomPrefix+
                "' data-role='dropdownlist' data-option-label='Select One'  data-value-primitive='true' data-auto-bind='true' data-text-field='Text' data-value-field='Value' data-bind='value: selectedDataLookupIndex, source: dataLookUpDataSource, visible: isDataLookUpVisiable, events: { change: onDataFieldLookupChange }' style='min-width:"+eval(plugInOptions.ResizeMetrics.ResizeBase[resizeIndex]+plugInOptions.ResizeMetrics.ResizeDropDownDelta[resizeIndex])+"px;margin-left:"+plugInOptions.Control.MarginLeft+"px;'/>"
            );

            var datamultilookup=$(
                "<select id='dataFieldMultiLookup_"+
                rowIndex+randomPrefix+
                "' data-role='multiselect' data-placeholder='Select One'  data-value-primitive='true' data-auto-bind='true' data-text-field='Text' data-value-field='Value' data-header-template='ad-multiselect-header"+
                "' data-bind='value: selectedMultiDataLookupValues, source: dataLookUpMultiDataSource, visible: isDataMultiLookUpVisiable, events: { change: onDataFieldMultiLookupChange }' class='advanced-search' style=';width:"+eval(plugInOptions.ResizeMetrics.ResizeBase[resizeIndex]+plugInOptions.ResizeMetrics.ResizeMultiDropDownDelta[resizeIndex])+"px;margin-left:"+plugInOptions.Control.MarginLeft+"px;'/>"
            ) ;

            //var datamultilookup=$(
            //    "<select id='dataFieldMultiLookup_ "+
            //    rowIndex+
            //    "' data-role='multiselect' data-auto-bind='false' data-text-field='Text' data-value-field='Value' data-header-template='headerTemplate"+
            //    rowIndex+
            //    "' data-bind='value: selectedMultiDataLookupValues, source: dataLookUpMultiDataSource, visible: isDataMultiLookUpVisiable, events: { change: onDataFieldMultiLookupChange }' style='width: 308px;'/>"
            //);


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

            var attributebtnPopUpSearch=$(
                "<button id='attributebtnPopUpSearch_"+
                rowIndex+randomPrefix+"'"+
                " parentdiv='"+
                criteriaRowId+
                "' data-bind='visible:isPopUpSearchVisiable' class='k-button btn btn-small' style='position:relative;z-index:1;height:26px;margin-left:"+plugInOptions.Control.MarginLeft+"px;' "+
                " name='attributebtnPopUp_search'"+
                " data-adsearch-supplier-target=''"+
                " title='Search'><span class='k-icon k-i-search"+
                "'></span></button>"
            );

            var attributebtnDetail=$(
                "<button id='attributebtnDetail_"+
                rowIndex+randomPrefix+"'"+
                " parentdiv='"+
                criteriaRowId+
                "' data-bind='visible:isPopUpSearchVisiable' class='k-button btn btn-small' style='position:relative;z-index:1;height:26px;margin-left:"+plugInOptions.Control.MarginLeft+"px;' "+
                " name='attributebtnDetail'"+
                " data-adsearch-supplier-load-target=''"+
                " title='Search'><span class='k-icon k-i-note"+
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
                "' data-role='dropdownlist' data-value-primitive='true' data-auto-bind='true' data-option-label='Select One' data-auto-bind='false' data-text-field='Text' data-value-field='Value' data-bind='value: selectedCalendarDataLookupIndex, source: calendarDataLookUpDataSource, visible: isCalendarDateListPickerVisible, events: { change: onCalendarDataFieldLookupChange }' style='max-width:105px;margin-left:"+plugInOptions.Control.MarginLeft+"px;'/>"
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
                datamultilookup,
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

                criteriaRow.append(resetbtn);
                //criteriaRow.append(resizeDatabtn);
                //criteriaRow.append(historySavebtn);
                //criteriaRow.append(historyPopUpbtn);

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

            criteriaRow.append(attributebtnPopUpSearch);
            criteriaRow.append(attributebtnDetail);

            $this.append(criteriaRow);

            var rowModel=getModelViewObservable();
            if(defaultModel!=null) {
                Object.keys(defaultModel).forEach(function(key,index) {
                    rowModel[key]=defaultModel[key];
                });
                rowModel["columnDataSource"]=settings.selectedColumnDataSource;
            }

            kdo.bind(criteriaRow,rowModel);
            //kdo.bind(datamultilookup.data('kendoMultiSelect').header,rowModel);

            //Increase the row counter to create unique controls on screen
            totalrow++;


            //Set Next Column in Sequence
            //Also need to find disable the column, then filter them

            if(defaultModel!=null) {
                var bs=criteriaRow.find('input').get(0).kendoBindingTarget.source;
                SetNextSelectColumnDefault(column,settings.selectedColumnDataSource.find(col => col.Value==defaultModel.selectedColumn).Sequence);
                bs.SetSelectedColumnValue(defaultModel.enteredDataFieldValue);
                bs.SetDataLookUpValue(defaultModel.selectedDataLookupIndex);
                bs.SetSelectedOperatorValue(defaultModel.selectedOperator);
                return criteriaRow;
            }

            if(nextColumnList.length===0) {
                SetNextSelectColumnDefault(column,rowModel.selectedColumn);
                ConsoleLog(
                    'Restart from column index from 0 :  '+rowModel.selectedColumn
                );
            } else {
                if(rowIndex===0)
                    SetNextSelectColumnDefault(column,rowModel.selectedColumn);
                else {
                    SetNextSelectColumnDefault(column,settings.selectedColumnDataSource.find(col => col.Value==nextColumnList[0]).Sequence);
                }
                ConsoleLog(
                    'Added column sequence index:  '+
                    parseInt(nextColumnList[0])+
                    ', Text:  '+settings.selectedColumnDataSource.find(col => col.Value==nextColumnList[0]).Text
                );
            }

            return criteriaRow;
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

        //Check template
        var element=$(plugInOptions.BindingTemplate.DisabledKendoDropdownTemplate)
        if(!element.length) {
            // create specific template for advanced control
        }


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

            if(dataModels.length==1) {
                if(dataModels[0]["enteredDataFieldValue"]==''&&dataModels[0]["selectedColumn"]==1)
                    return "";
            }
            return dataModels;
        }

        function SetStateData(ds) {
            if((ds==null)||(typeof ds==='string'&&ds.trim()==''))
                return;

            $this.html('');
            totalrow=0;
            //var rowsCount=ds.length;
            $.each(ds,function(index,val) {
                AddRow(totalrow++,val);
                ConsoleLog('Value Entered: '+val.enteredDataFieldValue);               //More logs can be added here.
            });
        }

        function DaysBetween(dateFrom,dateTo) {
            const ONE_DAY=1000*60*60*24;                // The number of milliseconds in one day
            const differenceMs=Math.abs(new Date(dateFrom)-new Date(dateTo));   // Calculate the difference in milliseconds
            // Convert back to days and return
            return Math.ceil(differenceMs/ONE_DAY);
        }

        var MappedCriterias=function() {
            var searchCriteria=GetSelectionStateData();
            var searchModel={};
            var SearchOperator="SearchOperator";
            var SearchDateFrom="From";
            var SearchDateTo="To";

            $.each(searchCriteria,function(index,row) {
                var selectedColumn=settings.selectedColumnDataSource.find(col => col.Value==(row.selectedColumn));

                if(selectedColumn.Type==='integer' && !isNaN(parseInt(row.enteredDataFieldValue))) {
                    searchModel[selectedColumn.ColumnMap]=parseInt(row.enteredDataFieldValue);
                }
                else if(selectedColumn.Type==='text' && row.enteredDataFieldValue.trim() != "") {
                    searchModel[selectedColumn.ColumnMap]=row.enteredDataFieldValue.replace("''","'");
                    searchModel[selectedColumn.ColumnMap+SearchOperator]=row.selectedOperator;
                }
                else if(selectedColumn.Type==='lookup' && row.selectedDataLookupIndex!=null) {
                    if(typeof row.selectedDataLookupIndex=='object')
                        searchModel[selectedColumn.ColumnMap]=row.selectedDataLookupIndex.Value;
                    else
                        searchModel[selectedColumn.ColumnMap]=row.selectedDataLookupIndex;
                }
                else if(selectedColumn.Type==='multilookup') {
                    //Notes:  Will extract based on the first screen(eg: XRef) integration mapping table
                }
                else if(selectedColumn.Type==='daterange' && row.selectedCalendarDataLookupIndex!=null) {
                    let selectedDays=0;
                    var dF=new Date();
                    if(row.selectedCalendarDataLookupValue!='Custom') {
                        selectedDays=parseInt(row.selectedCalendarDataLookupValue);
                        searchModel[selectedColumn.ColumnMap]=selectedDays;
                        dF.setDate(dF.getDate()-selectedDays);
                        searchModel[selectedColumn.ColumnMap+SearchDateTo]=new Date();
                        searchModel[selectedColumn.ColumnMap+SearchDateFrom]=dF;
                    }
                    else {
                        if(row.selectedCalendarDateToValue!=null&&row.selectedCalendarDateFromValue!=null) {
                            searchModel[selectedColumn.ColumnMap+SearchDateTo]=row.selectedCalendarDateToValue;
                            searchModel[selectedColumn.ColumnMap+SearchDateFrom]=row.selectedCalendarDateFromValue;
                            searchModel[selectedColumn.ColumnMap]=DaysBetween(row.selectedCalendarDateFromValue,row.selectedCalendarDateToValue);
                        }
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
            SetStateData(ds);
        };

        var ClearData=function() {
            $this.html('');
            totalrow=0;
            AddRow(totalrow++,null);
        };

        //This is just a quick dirty approach as we don't have other requirement other than the documentId search. 
        //Will redesign for multiply columns search in the future.
        var CallBackSearch=function(columnName,columnValue) {
            var requestColSearch=settings.selectedColumnDataSource.find(col => col.ColumnMap==columnName);

            if(requestColSearch!=null) {
                $this.html('');
                totalrow=0;
                var criteriaRow=AddRow(totalrow++,null);
                var bs=criteriaRow.find('input').get(0).kendoBindingTarget.source;
                bs.SetSelectedColumn(requestColSearch.Value);
                bs.SetSelectedColumnValue(columnValue);

                if($.isFunction(settings.searchCallBack)) {
                    settings.searchCallBack.call($this);
                }
            } else {
                kdo.alert("Unable to find column definition for given column: "+columnName);
            }

        };

        var ColumnMapName=function(columnDefText) {
            var columnItem=settings.selectedColumnDataSource.find(col => col.Text==columnDefText);
            if(columnItem!=null) {
                return columnItem.ColumnMap;
            }
            return "";
        };

        return {
            //SearchData: SearchData,   //Obsoleted 
            SetData: SetData,
            ClearData: ClearData,
            DataSource: DataSource,
            ColumnMapName: ColumnMapName,
            MappedCriterias: MappedCriterias,
            CallBackSearch: CallBackSearch                        //Need to consider for future multiple column search trigger
        };
    };
})(jQuery,kendo);
