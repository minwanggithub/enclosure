; (function ($) {
    if ($.fn.dataloader == null) {
        $.fn.dataloader = {};
    }

    $.fn.dataloader = function () {

        /******************************** Enclosure Variables ********************************/
        var tableList = ["",
                         "Document_",
                         "Revision_",
                         "DocumentInfo_",
                         "NameNumber_",
                         "DocumentNote_",
                         "CompliFolder_",
                         "CompliFolderDocument_",
                         "ObtainmentWorkItemHistory_"];

        var controls = {
            buttons: {                
                btnLoadDataPreview: "#btnLoadDataPreview",
                btnRefreshDatasource: "#btnRefreshDatasource",
                btnLoadDataSql: "#btnLoadDataSql"
            },
            tabstrip: {
                DataLoadTabs: "#DataLoadTabs"
            },
            dropdownlists: {
                ddSqlTables: "#ddSqlTables"
            }
        };


        function init() {
            $(controls.buttons.btnLoadDataPreview).on("click", function () {
                var selectedTable = $(controls.dropdownlists.ddSqlTables).data("kendoDropDownList").value();
                if (selectedTable === '') {
                    $(this).displayError("You need to select the data source before preceeding.");
                    return;
                }

                var url = generateLocationUrl("Configuration/DataLoader/GetWaitingProcessItems?tableId=" + selectedTable);
                window.dataloadlib.AddTab(selectedTable, url);
            });

            $(controls.buttons.btnRefreshDatasource).on("click", function () {
                $(controls.dropdownlists.ddSqlTables).data("kendoDropDownList").dataSource.read();
            });

            $(controls.buttons.btnLoadDataSql).on("click", function () {
                //Filter any tables which will not be supported for this version
                var selectedTable = $(controls.dropdownlists.ddSqlTables).data("kendoDropDownList").value();
                if (selectedTable === "") {
                    $(this).displayError("You need to select the data source before preceeding.");
                    return;
                }

                var selectedTableRows = $(controls.dropdownlists.ddSqlTables).data("kendoDropDownList").text();

                if (selectedTableRows.indexOf("(0 rows)") > -1) {
                    $(this).displayError("Nothing to process. Please refresh your datasource if you know there are some data waiting on the queue.");
                    return;
                }

                var url = generateLocationUrl("Configuration/DataLoader/GenerateProcessWaitingBatch?tableId=" + selectedTable);
                $(this).ajaxCall(url)
                    .success(function (data) {
                        if (data.success) {
                            $(controls.dropdownlists.ddSqlTables).data("kendoDropDownList").dataSource.read();
                            var tabStrip = $(controls.tabstrip.DataLoadTabs).kendoTabStrip().data("kendoTabStrip");
                            var item = tabStrip.tabGroup.find(':contains("In Queue")');
                            if (item.index() > -1) {
                                tabStrip.select(item.index());
                                tabStrip.reload(tabStrip.items()[item.index()]);
                            }
                        }
                        $(this).savedSuccessFully(data.message); 
                    }).error(
                        function () {
                            $(this).displayError("Error Occurred");
                        });
            });
        };


        var addTab = function(tableIndex, targetUrl) {

            var title = tableList[tableIndex];

            var tabStrip = $(controls.tabstrip.DataLoadTabs).kendoTabStrip().data("kendoTabStrip");

            var date = new Date;
            var stampTitle = title + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

            var item = tabStrip.tabGroup.find(':contains("' + title + '")');
            if (item.index() > -1)
                tabStrip.remove(tabStrip.select());

            tabStrip.insertAfter({ text: stampTitle, contentUrl: targetUrl }, tabStrip.tabGroup.children("li:last"));
            $(".k-last > .k-link").append("<button class='btn btn-mini' style='margin-left:5px; margin-right:-5px;' onClick='dataloadlib.CloseTab($(this).closest(\"li\"));'>x</button>");
            tabStrip.select((tabStrip.tabGroup.children("li").length - 1));
        };

        var closeTab = function(tab) {
            var tabStrip = $(controls.tabstrip.DataLoadTabs).kendoTabStrip().data("kendoTabStrip");
            tabStrip.remove(tab);
            tabStrip.select((tabStrip.tabGroup.children("li").length - 1));
        };

        var initializePregressBar = function (queueId) {
            $("#queueProgressbar_" + queueId).kendoProgressBar({
                min: 1,
                max: 100,
                value: 100,
                type: "percent",
                //complete: function (e) {
                //    console.log("Progress completed");
                //},
                animation: {
                    duration: 900
                }
            });


            $.when(BatchRequestAll(queueId)).then(
                 function (status) {  
                     $(this).savedSuccessFully("Batch with Id=" + status.BatchQueueID + " has completed.");                     
                     BatchStatusUpdates(status);
                 },
                 function (status) {  
                     $(this).displayError("Batch with Id=" + status.BatchQueueID + " has failed.");
                 },
                 function (status) {  
                     BatchStatusUpdates(status);
                 }
            );
        };

        function BatchStatusUpdates(status) {
            if (status != null) {
                var qpb = $("#queueProgressbar_" + status.BatchQueueID).data("kendoProgressBar");
                if (qpb != null) {     //Kendo progress bar may not be ready yet
                    qpb.value(status.PercentCompleted);
                    //$("#queueProgressbar_" + status.BatchQueueID).data("kendoProgressBar").value(status.PercentCompleted);
                    $("#batchCompletedRow_" + status.BatchQueueID).text(status.TotalCompleted);
                    $("#batchErrorRow_" + status.BatchQueueID).text(status.TotalErrors);
                    $("#batchTotalRow_" + status.BatchQueueID).text(status.TotalRows);
                }
            }
        }

        var onGridQueueDataBound = function (e) {            
            var dataItems = e.sender.dataSource.view();
            for (var j = 0; j < dataItems.length; j++) {
                var row = dataItems[j];
                if (dataItems[j].get("DataSource") === 2)                
                  this.expandRow("tr[data-uid='" + row.uid + "']"); // expands the row with the specific uid
            }
        };


        function BatchPromiseEvent(dataLoadQueueId, dfd ) {          
            $(this).ajaxCall(GetEnvironmentLocation() + "/Configuration/DataLoader/GetBatchStatusById", { dataLoadQueueId: dataLoadQueueId })
                .success(function (data) {
                    if (dfd.state() === "pending" && data.Continue) {
                        dfd.notify(data);
                        //setTimeout(BatchPromiseEvent(dataLoadQueueId, dfd), 1000);
                        $.wait(1000).then(BatchPromiseEvent(dataLoadQueueId, dfd));
                    }
                    else if (!data.Continue) {
                        dfd.resolve(data);
                    }
                }).error(
                function () { dfd.reject("Error"); }
                );
        };


        function BatchRequestAll(dataLoadQueueId) {
            var deferred = jQuery.Deferred();
            BatchPromiseEvent(dataLoadQueueId, deferred);
            return deferred.promise();
        }


        init();

        return {
            PanelLoadCompleted: function (e) { $(e.item).find("a.k-link").remove(); var selector = "#" + e.item.id; $(selector).parent().find("li").remove(); },
            InitializePregressBar: initializePregressBar,
            OnGridQueueDataBound: onGridQueueDataBound,
            AddTab: addTab,
            CloseTab: closeTab
        };
    };

    $(function () { });

})(jQuery);