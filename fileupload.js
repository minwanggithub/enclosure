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
                var parameters = "filelist=" + uploadStake + "&documentId=" + $('input#DocumentId').val() + "&revisionId=" + $('input#RevisionId').val() + "&isNewRevision=" +  $("#IsNewRevision").val();
                var fileName = uploadStake;

                if (!$("#dvAddNewAttachment").is(":hidden"))
                    $("#txtFileName").val(fileName);

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

                            if (!$("#dvAddNewAttachment").is(":hidden"))
                                $("#addNewDocFilesBtn").attr("disabled", "disabled");

                        } else {
                            $("#txtFileName").val("");
                            onDisplayError('Error: ' + response.message);
                            e.preventDefault();
                        }
                    },
                    error: function (result) {
                        $("#txtFileName").val("");
                        onDisplayError('Error: ' + result);
                        e.preventDefault();
                    }
                });
            });
        }

        //Public functions starts
        var openFileUploadDialog = function () {
            //add multiple when it's not a new document or revision
            $("#files").removeAttr("multiple");
            if ($('#IsNewRevision').val()=="False" && $('input#DocumentId').val()!="0") {
                $("#files").attr("multiple", "multiple");
            }

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
            if ($("#IsNewRevision").val()) {
                if (e.files.length > 1) {
                    fileUploadDialog.data("kendoWindow").close();
                    onDisplayError("Only one file can be uploaded on new revision.");
                   e.preventDefault();
                } 
            }
           

            var copiedArray = uploadStake.slice(0);

            $.each(e.files, function (index, value) {
                if (value.extension.toLowerCase() != ".pdf") {
                    e.preventDefault();
                    onDisplayError("Please upload only pdf files");
                    return false;
                }

                // Check if we already have a file uploaded with that given name
                var lowerCaseName = value.name.toLowerCase();
                if ($.inArray(lowerCaseName, copiedArray) >= 0) {
                    e.preventDefault();
                    onDisplayError("You are attempting to uploading or have uploaded a file with the same file name. Please rename " + lowerCaseName + " to continue.");
                    return false;
                }

                copiedArray.splice(0, 0, lowerCaseName);
            });

            errorDisplayed = false;
        };

        var onFileUploadError = function (e) {
            if (!errorDisplayed) {
                errorDisplayed = true;
                onDisplayError('An error occurred uploading the file(s) specified.');
            }
        };

        //Expose to public
        var loadFileUploaPlugIn = function () {
            fileUploadDialog = $("#fileUploadWindow");
            hookEvents();
        };

        var onDisplayError = function (errorMessage) {
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


