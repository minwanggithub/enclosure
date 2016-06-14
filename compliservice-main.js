﻿; (function ($) {
    if ($.fn.complservice == null) {
        $.fn.complservice = {};
    }

    $.fn.complservice = function () {

        /******************************** Enclosure Variables ********************************/

        var controls = {
            buttons: {                
                btnAddTestCase: "#btnAddTestCase",
                btnTestRevisionTitleChain: "#btnTestRevisionTitleChain",
                btnTestGetDocumentFamilyTree: "#btnTestGetDocumentFamilyTree"
            },
            division: {
                divDataLoadTabs: "#divDataLoadTabs"
            },

            tabstrip: {
                DataLoadTabs: "#DataLoadTabs"
            },
            dropdownlists: {
                ddServiceModule: "#ddServiceModule"
            },
            textbox: {
                txtTestResult: "#txtTestResult",
                txtRevisionId: "#txtRevisionId",
                txtDocumentId: "#txtDocumentId"
            },
            actionmethod: {
                TestAreaNotes: "Configuration/CompliServiceTest/TestAreaNotes",
                GetRevisionTitleChainByRevisionId: "Configuration/CompliServiceTest/GetRevisionTitleChainByRevisionId?revisionId=",
                GetDocumentFamilyTreeByDocumentId: "Configuration/CompliServiceTest/GetDocumentFamilyTreeByDocumentId?"
            }

        };


        function initTabStrip() {
            $(document).ready(function () {
                $(controls.tabstrip.DataLoadTabs).kendoTabStrip({
                    animation: {
                        open: {
                            effects: "fadeIn"
                        }
                    },
                    select: function (element) { selecttab(element) }
                });

                var tabStrip = $(controls.tabstrip.DataLoadTabs).kendoTabStrip().data("kendoTabStrip");
                tabStrip.append({ text: "Test Guide", contentUrl: generateLocationUrl(controls.actionmethod.TestAreaNotes) });
                tabStrip.select(0);
            });
        }

        function selecttab(element) {
            var tabStrip1 = $(controls.tabstrip.DataLoadTabs).kendoTabStrip().data("kendoTabStrip");
            var item = tabStrip1.element.find("li:contains(" + $(element.item).text() + ")"),
            itemIdx = item.index();
            $(controls.tabstrip.DataLoadTabs).data("kendoTabStrip").select(itemIdx);
        }

        function reInitializeTab(title, targetUrl) {
            //$(controls.division.divDataLoadTabs).html("<div id='DataLoadTabs'></div>");
            
            var tabStrip = $(controls.tabstrip.DataLoadTabs).kendoTabStrip().data("kendoTabStrip");
            tabStrip.append({ text: title, contentUrl: targetUrl });            
            $(".k-last > .k-link").append("<button class='btn btn-mini' style='margin-left:5px; margin-right:-5px;' onClick='compliservicetestlib.closeTab($(this).closest(\"li\"));'>x</button>");
            tabStrip.select((tabStrip.tabGroup.children("li").length - 1));
            //tabStrip.select(0);
            tabStrip.select((tabStrip.tabGroup.children("li").length - 1));
        }


        var closeTab = function(tab) {
            var tabStrip = $("#DataLoadTabs").kendoTabStrip().data("kendoTabStrip");
            tabStrip.remove(tab);
            tabStrip.select((tabStrip.tabGroup.children("li").length - 1));
        }

        function createNewTab(title, targetUrl) {
            debugger;
            $(controls.tabstrip.DataLoadTabs).kendoTabStrip({
                animation: {
                    open: {
                        effects: "fadeIn"
                    }
                },
                select: function (element) { selecttab(element) }
            });

            var tabStrip = $(controls.tabstrip.DataLoadTabs).kendoTabStrip().data("kendoTabStrip");
            tabStrip.append({ text: title, contentUrl: targetUrl });
            tabStrip.select(0);
        }

        function init() {
            initTabStrip();
            $(controls.buttons.btnAddTestCase).on("click", function () {
                var selectedValue = $(controls.dropdownlists.ddServiceModule).data("kendoDropDownList").value();

                if (selectedValue === "") {
                    $(this).displayError("You need to select the module before preceeding.");
                    return;
                }
                var moduler = $.parseJSON(selectedValue);

                var url = generateLocationUrl(moduler.Data.area + '/' + moduler.Data.controller + '/' + moduler.Data.action);
                reInitializeTab(moduler.Data.name, url);
            });
        };

        var initializeRevisionTitleChangeModule = function () {
            $(controls.buttons.btnTestRevisionTitleChain).on("click", function () {
                var revisionId = $(controls.textbox.txtRevisionId).val();
                if (revisionId === "") {
                    $(controls.textbox.txtTestResult).val("***** Revision Id can not be null value *****");
                    return;
                }

                $(controls.textbox.txtTestResult).val("");
                var url = generateLocationUrl(controls.actionmethod.GetRevisionTitleChainByRevisionId + revisionId);
                $(this).ajaxCall(url)
                    .success(function (data) {
                        if (data.success) {
                            $(controls.textbox.txtTestResult).val(data.result);
                        }
                    }).error(
                        function () {
                            $(controls.textbox.txtTestResult).val("Error Occurred while getting revision title chain.");
                        });
            });
        }

        var initializeFamilyTreeModule = function () {
            $(controls.buttons.btnTestGetDocumentFamilyTree).on("click", function () {
                var documentId = $(controls.textbox.txtDocumentId).val();
                if (documentId === "") {
                    $(controls.textbox.txtTestResult).val("***** Document Id can not be null value *****");
                    return;
                }

                $(controls.textbox.txtTestResult).val("");
                var isParent = $("#relation-parent").is(":checked");
                debugger;
                var params = { documentId: documentId, relation: isParent ? 'parent' : 'children'};
                var url = generateLocationUrl(controls.actionmethod.GetDocumentFamilyTreeByDocumentId);
                $(this).ajaxCall(url, params)
                    .success(function (data) {
                        if (data.success) {
                            $(controls.textbox.txtTestResult).val(data.result);
                        }
                    }).error(
                        function () {
                            $(controls.textbox.txtTestResult).val("Error Occurred while getting document relationship.");
                        });
            });
        }
        init();

        return {
            initializeRevisionTitleChangeModule: initializeRevisionTitleChangeModule,
            initializeFamilyTreeModule: initializeFamilyTreeModule,
            closeTab: closeTab
        };
    };

    $(function () { });

})(jQuery);