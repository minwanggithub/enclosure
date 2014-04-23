;(function($) {
    if ($.fn.uploadFile == null) {
        $.fn.uploadFile = {};
    }

    $.fn.uploadFile = function () {
        //local variables
        var uploadStake = new Array();
        var fileUploadDialog;
        var errorDisplayed = false;

        function tabReload(tabName, tab) {
            var tsCtl = $(tabName).data("kendoTabStrip");
            tsCtl.reload(tsCtl.items()[tab]);
        }

        function hookEvents() {
            $("#uploadFilesCancelSelect").click(function (e) {

                var self = $(this);
                if (!self.attr("disabled")) {
                 
                    $.ajax({
                        type: "POST",
                        url: 'FileUploadingCancel',
                        data: "filelist=" + uploadStake, //multiple array, just add something like "&b="+b ...
                        success: function (response) {
                            uploadStake.splice(0, uploadStake.length);
                            $(".k-upload-files.k-reset").find("li").remove();
                            fileUploadDialog.data("kendoWindow").close();
                        },
                        error: function (e) {
                            alert('Error: ' + e);
                        }
                    });
                }
            });

            $("#uploadFilesConfirmSelect").click(function (e) {
                console.log("uploadFilesConfirmSelect clicked");

                console.log("tring to enforce kit's lone cover sheet rule.");
                if ($("#ContainerTypeId").length > 0 && $("#ContainerTypeId").val() == "2") {
                    var docId = $("input#DocumentID.doc-ref-id").val();
                    if (docId != undefined && docId != "0") {
                        var currCount = $("#addNewFilesBtn").parent().parent().data("kendoGrid").dataSource.data().length;
                        if (currCount != undefined && currCount == 1) {
                            if (confirm("Error: A kit can only have one cover sheet. If you want to change the cover sheet, delete it and add another one.")) {
                                fileUploadDialog.data("kendoWindow").close();
                                return;
                            }
                        }
                    }
                }
                console.log("done passing check of kit's lone cover sheet rule.");

                if (uploadStake.length == 0) {
                    //shall we prompt user why this will be close?
                    fileUploadDialog.data("kendoWindow").close();
                    return;
                }

                $("body").css("cursor", "wait");
                fileUploadDialog.parents('.k-window:first')
                    .find("input").toggleClass("file-upload-disable").attr('disabled', 'disabled').end()
                    .find("a").toggleClass("file-upload-disable").attr('disabled', 'disabled').end()
                    .find(".k-button").toggleClass("file-upload-disable").attr('disabled', 'disabled');

                //Call server to create database entries for all files
                var parameters = "filelist=" + uploadStake + "&documentId=" + $('input#DocumentId').val() + "&revisionId=" + $('input#RevisionId').val();

                $.ajax({
                    type: "POST",
                    url: "FileUploadingConfirm",
                    data: parameters, //multiple array, just add something like "&b="+b ...
                    complete: function () {
                        $("body").css("cursor", "default");
                            
                        fileUploadDialog.parents('.k-window:first')
                            .find("input").toggleClass("file-upload-disable").removeAttr("disabled").end()
                            .find("a").toggleClass("file-upload-disable").removeAttr("disabled").end()
                            .find(".k-button").toggleClass("file-upload-disable").removeAttr("disabled");
                    },
                    success: function (response) {

                        if (response.success) {
                            uploadStake.splice(0, uploadStake.length);
                            $(".k-upload-files.k-reset").find("li").remove();
                            fileUploadDialog.data("kendoWindow").close();

                            //Refresh revision document ist
                            tabReload("#tabRevisionFileInfo", 0);
                        } else {
                            alert('Error: ' + response.message);
                        }
                    },
                    error: function (result) {
                        console.log('Error: result is: ' + result);
                        alert('Error: ' + JSON.stringify(result.statusText));
                    }
                });
            });
        }

        //Public functions starts
        var openFileUploadDialog = function () {
            KendoPopUpAjustExecute(fileUploadDialog);
            fileUploadDialog.data("kendoWindow").open();
        };

        var onFileUploadSuccess = function (e) {
            //http://stackoverflow.com/questions/9614681/kendo-ui-file-upload-plugin-remove-button-customization
            //e.operation = remove or upload

            var lowerCaseFile = e.files[0].name.toLowerCase();
            if (e.operation == 'upload') {
                uploadStake.splice(0, 0, lowerCaseFile);
            } else {
                
                uploadStake = $.grep(uploadStake, function (value) {
                    return value != lowerCaseFile;
                });
            }
        };

        var onFileSelect = function (e) {
            var copiedArray = uploadStake.slice(0);

            $.each(e.files, function (index, value) {
                if (value.extension.toLowerCase() != ".pdf") {
                    e.preventDefault();
                    alert("Please upload only pdf files");
                    return false;
                }

                // Check if we already have a file uploaded with that given name
                var lowerCaseName = value.name.toLowerCase();
                if ($.inArray(lowerCaseName, copiedArray) >= 0) {
                    e.preventDefault();
                    alert("You are attempting to uploading or have uploaded a file with the same file name. Please rename " + lowerCaseName + " to continue.");
                    return false;
                }

                copiedArray.splice(0, 0, lowerCaseName);
            });

            errorDisplayed = false;
        };

        var onFileUploadError = function (e) {
            if (!errorDisplayed) {
                errorDisplayed = true;
                alert('An error occurred uploading the file(s) specified.');
            }
        };

        //Expose to public
        var loadFileUploaPlugIn = function () {
            fileUploadDialog = $("#fileUploadWindow");
            hookEvents();
        };

        return {
            loadFileUploaPlugIn: loadFileUploaPlugIn,
            openFileUploadDialog: openFileUploadDialog,
            onFileUploadError: onFileUploadError,
            onFileUploadSuccess: onFileUploadSuccess,
            onFileSelect: onFileSelect
        };
    };

    //Initialize
    $(function () {
       
    });

})(jQuery);


