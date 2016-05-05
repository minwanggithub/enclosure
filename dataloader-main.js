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
                if (selectedTable === "3" || selectedTable === "6" || selectedTable === "7") {
                    $(this).displayError("The current version can not process selected table. The feature is still under development.");
                    return;
                }

                var selectedTableRows = $(controls.dropdownlists.ddSqlTables).data("kendoDropDownList").text();

                if (selectedTableRows.indexOf("0 rows") > -1) {
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
                                tabStrip.select(item.index);
                                tabStrip.reload(tabStrip.items()[item.index]);
                            }
                        }
                        $(this).savedSuccessFully(data.message); 
                    }).error(
                        function () {
                            $(this).displayError("Error Occurred");
                        });
            });
        }


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
        }

        var closeTab =  function(tab) {
            var tabStrip = $(controls.tabstrip.DataLoadTabs).kendoTabStrip().data("kendoTabStrip");
            tabStrip.remove(tab);         
            tabStrip.select((tabStrip.tabGroup.children("li").length - 1));            
        }

        init();

        return {           
            AddTab: addTab,
            CloseTab: closeTab
        };
    };

    $(function () { });

})(jQuery);