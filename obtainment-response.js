; (function ($) {
    if ($.fn.complibObtainmentResponse == null) {
        $.fn.complibObtainmentResponse = {};
    }

    $.fn.complibObtainmentResponse = function () {
        var viewModel = {};

        var UIObject = {
            sections: {
                inboundResponseSearchSection: function () { return $("#divObtainmentResponseSearchSection") },
                responseDetailGridSection: function () { return $("#ReponseDetail") },
                supplierSearchFootSection: function () { return $("#supplierSearchFootSection") },
                customerActionSection: function () { return $("#customerActionSection") },
            },
            controls: {
                grids: {
                    InboundResponse: function () { return $("#gdInboundResponse").data("kendoGrid") },
                    SearchSupplier: function () { return $("#gdSearchSupplier").data("kendoGrid") },
                },
                textBoxes: {
                    NoticeNumberObj: function () { return $("#NoticeNumber") },
                    NoticeNumberObjField: "NoticeNumber",
                    SupplierNameAndIdObj: function () { return $("#SupplierNameAndId") },
                    SupplierNameAndIdObjField: "SupplierNameAndId",
                    SupplierIdObjField: "SupplierId",
                },
                buttons: {
                    ShowCollapseObjField: "ShowCollapse",
                }               

            },
            popWindow: {
                   supplierSearchDialog: function () { return $("#supplierSearchWindow").data("kendoWindow") },
                   supplierPlugIn: function () { return $("#dgSupplierPlugIn") },                   
            },

                controllerCalls: {
                    SearchResponse : GetEnvironmentLocation() + "/Operations/ObtainmentResponse/SearchInboundResponse",
                    SearchSupplierInfo : GetEnvironmentLocation() + "/Operations/Company/LookUpSupplierOnKeyEnter",
                    LoadSingleSupplier : GetEnvironmentLocation() + "/Operations/Company/LoadSingleSupplier?",
                    LoadSupplierPlugIn : GetEnvironmentLocation() + "/Operations/Document/PlugInSupplierSearchAlt",
                    NoticeAutoComplete : GetEnvironmentLocation() + "/Operations/ObtainmentResponse/GetNoticeNumberSelect",
            },
                warnings: {
                    NoRowSelected: "No row selected, please try again.",
                    NoSearchCriteria: "No search criteria entered."
                    },
                        errorMessage: {
                            GeneralError: "Error Occurred on server call."
            },
        };

        var Initialize = function () {
            InitializeSearch();
        };

        var SearchBind = function () {
            viewModel = kendo.observable({
                NoticeNumber: "",
                SupplierNameAndId: "", 
                SupplierId: 0,
                SupplierName: "",
                ShowCollapse: "none",

                SearchClick: function (e) {
                    e.preventDefault();
                    //if (this.NoSearchCriteria())
                    //{
                    //    $(this).displayError(UIObject.warnings.NoSearchCriteria);
                    //    return;
                    //}

                    kendo.ui.progress(UIObject.sections.responseDetailGridSection(), true);                    
                    if (this.get(UIObject.controls.textBoxes.SupplierNameAndIdObjField) == '')  //Prevent supply information deleted
                        this.set(UIObject.controls.textBoxes.SupplierIdObjField, 0);

                    $(this).ajaxCall(UIObject.controllerCalls.SearchResponse, { searchCriteria: JSON.stringify(this) })
                           .success(function (data) {
                               UIObject.sections.responseDetailGridSection().html(data);
                               //DisableEnableButtons(true);
                           }).error(
                           function () {
                               $(this).displayError(UIObject.errorMessage.GeneralError);
                                });

                },

                ClearClick: function (e) {
                    e.preventDefault();
                    this.set(UIObject.controls.textBoxes.NoticeNumberObjField, "");
                    this.set(UIObject.controls.textBoxes.SupplierNameAndIdObjField, "");
                    this.set(UIObject.controls.textBoxes.SupplierIdObjField, 0);

                    var inboundGrid = UIObject.controls.grids.InboundResponse

                    if ((null != inboundGrid()) && (inboundGrid().dataSource.total() > 0))
                         inboundGrid().dataSource.data([]);
                },

                CloseSupplierClick: function (e) {
                    e.preventDefault();
                    UIObject.popWindow.supplierSearchDialog().center().close();
                },

                CollapseMasterDetailClick: function (e) {
                    var inboundGrid = UIObject.controls.grids.InboundResponse
                    var allMasterRows = inboundGrid().tbody.find('>tr.k-master-row');

                    for (var i = 0; i < allMasterRows.length; i++) {
                        inboundGrid().collapseRow(allMasterRows.eq(i));
                    }
                    //viewModel.set('ShowCollapse', 'none');
                    viewModel.set(UIObject.controls.buttons.ShowCollapseObjField, 'none')
                },

                NoSearchCriteria: function () {
                    var result = (this.SupplierNameAndId == "" && this.NoticeNumber == "")
                    return result;
                },

                SelectSupplierClick: function (e) {
                    e.preventDefault();
                    if (UIObject.controls.grids.SearchSupplier().dataSource.total() == 0) {
                        onDisplayError(UIObject.warnings.NoRowSelected);
                        return;
                    }

                    var item = UIObject.controls.grids.SearchSupplier().dataItem(UIObject.controls.grids.SearchSupplier().select());
                    if (item == null) {
                        onDisplayError(UIObject.warnings.NoRowSelected);
                        return;
                    }

                    viewModel.set(UIObject.controls.textBoxes.SupplierNameAndIdObjField, item.CompanyId + ", " + item.Name)
                    viewModel.set(UIObject.controls.textBoxes.SupplierIdObjField, item.CompanyId)
                    UIObject.popWindow.supplierSearchDialog().center().close();
                },

                onSearchSupplierClick: function (e) {
                    e.preventDefault();
                    UIObject.popWindow.supplierSearchDialog().center().open();
                },

                onViewSupplierClick: function (e) {
                    e.preventDefault();
                    var supplierId = viewModel.get(UIObject.controls.textBoxes.SupplierIdObjField)

                    if (supplierId > 0)
                        window.open(UIObject.controllerCalls.LoadSingleSupplier + "supplierId=" + supplierId, "_blank");
                }
            });

            kendo.bind(UIObject.sections.inboundResponseSearchSection(), viewModel);
            kendo.bind(UIObject.sections.supplierSearchFootSection(), viewModel);

            UIObject.controls.textBoxes.SupplierNameAndIdObj().keyup(function (e1) {
                var code = (e1.keyCode ? e1.keyCode : e1.which);
                if (code == 13) {//Search only on enter
                    viewModel.set(UIObject.controls.textBoxes.SupplierIdObjField, viewModel.get(UIObject.controls.textBoxes.SupplierNameAndIdObjField));
                $.post(UIObject.controllerCalls.SearchSupplierInfo, { supplierInfo: viewModel.get(UIObject.controls.textBoxes.SupplierNameAndIdObjField) }, function (data) {
                    viewModel.set(UIObject.controls.textBoxes.SupplierNameAndIdObjField, data);
                    });
                }
            });

            var noticObj = UIObject.controls.textBoxes.NoticeNumberObj().kendoAutoComplete({
                MinLength: 2,
                //dataTextField: "Text",
                filter: "startswith",
                dataSource: new kendo.data.DataSource({
                    transport: {
                        serverFiltering: true,
                        serverPaging: false,
                        read: {
                            url: UIObject.controllerCalls.NoticeAutoComplete,
                            type: "GET"
                        }
                    }

                 }),
            });                     
        };
     
        var SearchSupplierOnResponseDetailBind = function (responseId) {
            viewModel = kendo.observable({              
          
                CloseSupplierClick: function (e) {
                    e.preventDefault();
                    UIObject.popWindow.supplierSearchDialog().center().close();
                },             

                SelectSupplierClick: function (e) {
                    e.preventDefault();
                    if (UIObject.controls.grids.SearchSupplier().dataSource.total() == 0) {
                        onDisplayError(UIObject.warnings.NoRowSelected);
                        return;
                    }

                    var item = UIObject.controls.grids.SearchSupplier().dataItem(UIObject.controls.grids.SearchSupplier().select());
                    if (item == null) {
                        onDisplayError(UIObject.warnings.NoRowSelected);
                        return;
                    }

                    $('#lblSupplierInfoForResponseDetail' + responseId).text(item.CompanyId + ", " + item.Name);
                    UIObject.popWindow.supplierSearchDialog().center().close();
                },

                onSearchSupplierClick: function (e) {
                    e.preventDefault();
                    UIObject.popWindow.supplierSearchDialog().center().open();
                },
           
            });

            kendo.bind(UIObject.sections.inboundResponseSearchSection(), viewModel);
            kendo.bind(UIObject.sections.supplierSearchFootSection(), viewModel);

            UIObject.controls.textBoxes.SupplierNameAndIdObj().keyup(function (e1) {
                var code = (e1.keyCode ? e1.keyCode : e1.which);
                if (code == 13) {//Search only on enter
                    viewModel.set(UIObject.controls.textBoxes.SupplierIdObjField, viewModel.get(UIObject.controls.textBoxes.SupplierNameAndIdObjField));
                $.post(UIObject.controllerCalls.SearchSupplierInfo, { supplierInfo: viewModel.get(UIObject.controls.textBoxes.SupplierNameAndIdObjField) }, function (data) {
                    viewModel.set(UIObject.controls.textBoxes.SupplierNameAndIdObjField, data);
                    });
                }
            });
                       
        };

        var EditSupplierOnResponseDetail = function (responseID) {

            var editBtn = $('#EditSupplierBtn' +responseID);
            var strUrl = GetEnvironmentLocation() + '/Operations/ObtainmentResponse/IfExistEmailOrDomain';
            $.ajax({
                method: "POST",
                url: strUrl,
                data: { inboundResponseId: responseID },
            })
            .done(function (msg) {
              
                if (msg == false) {
                    var args = { message: 'Do you want to add email or domain to supplier contact?', header: 'Add email and domain' };
                    DisplayConfirmationModal(args,
                                             function () { AddEmailOrDoman(responseID); },
                                             function() {  UIObject.popWindow.supplierSearchDialog().center().open();}
                    );
                }
                else {
                    UIObject.popWindow.supplierSearchDialog().center().open();
                }

            })
            .error(function (msg) {
        });

        }

        function AddEmailOrDoman(responseID) {
            var editBtn = $('#EditSupplierBtn'+responseID);
            var strUrl =  GetEnvironmentLocation() + '/Operations/ObtainmentResponse/AddEmailOrDomain';
     
            $.ajax({
                 method:"POST",
                 url: strUrl,
                 data: {inboundResponseId: responseID},
                })
                .done(function(msg) {     
                    UIObject.popWindow.supplierSearchDialog().center().open();             
               })
               .error(function(msg){
                    
               });

        }

        function InitializeSearch() {
            UIObject.controls.grids.InboundResponse().dataSource.read();
            kendo.bind(UIObject.sections.customerActionSection(), viewModel);
        };

        var loadSupplierPlugIn = function () {
            $.post(UIObject.controllerCalls.LoadSupplierPlugIn, { supplierId: 0 }, function (data) {
                UIObject.popWindow.supplierPlugIn().html(data);
            });
        };

        var MasterExpand = function () {
            viewModel.set(UIObject.controls.buttons.ShowCollapseObjField, 'inherit');
        };

        var MasterCollapse = function() {
          if ($("#gdInboundResponse td.k-hierarchy-cell").find("a.k-minus").length == 0)
              viewModel.set(UIObject.controls.buttons.ShowCollapseObjField, 'none');
        };

        var SaveInboundResponseDetail = function(data) {           
            var strUrl =  GetEnvironmentLocation() + '/Operations/ObtainmentResponse/SaveInboundResponseDetail';

            $.ajax({
                     method: "POST",
                     url: strUrl,
                     data: JSON.stringify(data),
                     contentType: 'application/json; charset=utf-8',
                     error: function () {
                           DisplayError('Inbound response detail could not be saved.');
                     },
                     success: function (successData) {
                           if(successData.success == false)                             
                                 DisplayError("Error Occurred.");
                     },
                     complete: function (compData) {
                         $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html("Inbound response detail Saved Successful.");
                    }
                 })               
        };

        return {
            PanelLoadCompleted: function (e) { $(e.item).find("a.k-link").remove(); var selector = "#" +e.item.id; $(selector).parent().find("li").remove(); },
            Initialize: Initialize,
            SearchBind: SearchBind,
            SearchSupplierOnResponseDetailBind: SearchSupplierOnResponseDetailBind,
            EditSupplierOnResponseDetail: EditSupplierOnResponseDetail,
            loadSupplierPlugIn: loadSupplierPlugIn,
            closeSupplierSearchWindow: function InitializeSearch() { UIObject.popWindow.supplierSearchDialog().close(); },
            MasterExpand: MasterExpand,          
            MasterCollapse: MasterCollapse,
            SaveInboundResponseDetail: SaveInboundResponseDetail
        };
    };
})(jQuery);
