; (function ($) {
    if ($.fn.uploadFileAlt == null) {
        $.fn.uploadFileAlt = {};
    }

    $.fn.uploadFileAlt = function () {
        var clearAttachmentCacheOnConfirm = false;
        var parentCallback = null;
        var parentArgsCallback = null;
        var dpeCallback = null;
        var uploadError = false;
        var uploadStake = [];
        var docLanguageDetail = null;
        // ************************************** Local Methods **************************************************
        function displayConfirmation(settings, yesFunc, noFunc) {
            if (DisplayConfirmationModal)
                DisplayConfirmationModal(settings, yesFunc, noFunc);
            else {
                var confirmResult = confirm(settings.message);
                if (confirmResult == true && yesFunc) {
                    yesFunc();
                } else if (confirmResult == false && noFunc) {
                    noFunc();
                }
            }
        }

        function displayError(message) {
            if (onDisplayError)
                onDisplayError(message);
            else
                kendo.alert(message);
        }

        // ***************************************** UI Methods ******************************************************
        function closeFileUploadModal() {

            parentCallback = null;
            uploadError = false;
            uploadStake = [];

            resetFileUploadLayout();

            $('#fileUploadWindow').find('.k-reset li').remove();
            $('#fileUploadWindow').find('.k-upload-status').remove();
            $('#fileUploadWindow').data('kendoWindow').close();
        }

        function clearAttachmentSessionCache() {

            var removeArgs = null;
            if (parentArgsCallback)
                removeArgs = parentArgsCallback();

            removeArgs = removeArgs || {};
            removeArgs['files'] = uploadStake.map(function (value) {
                return {
                    FileName: value.filename,
                    PhysicalPath: value.physicalPath
                };
            });

            // if this a notification upload ?
            
            if (document.location.href.toLowerCase().indexOf("/operations/notification") > 0)
                $.post('../Notification/ClearAttachmentsCache', removeArgs, closeFileUploadModal);
            else
                $.post('../Document/RemoveAttachmentAlt', removeArgs, closeFileUploadModal);
        }

        function clearConfirmFileUploadCache() {

            if (clearAttachmentCacheOnConfirm == true)
                clearAttachmentSessionCache();
            else
                closeFileUploadModal();

            $('[id*=addNewFilesBtn_]').each(function (index) {
                if ($(this).closest('div.k-grid').data('kendoGrid').dataSource.total() >= 1) {
                    $(this).addClass('k-state-disabled');
                }
            });
        }

        function confirmFileUploadWindowClose() {

            if (uploadStake.length > 0) {
                var settings = { message: 'You have attachments ready to be linked. Are you sure you would like to cancel?', header: 'Confirm Attachment Upload Cancel' };
                displayConfirmation(settings, clearAttachmentSessionCache);
            } else
                closeFileUploadModal();
        }

        function disableFileUploadLayout() {
            $("body").css("cursor", "wait");

            $('#fileUploadWindow').find("input").toggleClass("file-upload-disable").attr('disabled', 'disabled').end()
                .find("a").toggleClass("file-upload-disable").attr('disabled', 'disabled').end()
                .find(".k-button").toggleClass("file-upload-disable").attr('disabled', 'disabled');
        }

        function resetFileUploadLayout() {

            $("body").css("cursor", "default");

            $('#fileUploadWindow').find("input").toggleClass("file-upload-disable").removeAttr("disabled").end()
                .find("a").toggleClass("file-upload-disable").removeAttr("disabled").end()
                .find(".k-button").toggleClass("file-upload-disable").removeAttr("disabled");
        }

        function onAttachmentCancelBtnClick(e) {
            e.preventDefault();
            confirmFileUploadWindowClose();
        }

        function onAttachmentConfirmBtnClick(e) {

            // do not process confirmation if there was an 
            // error while upload ing the file.

            if (!uploadError) {

                e.preventDefault();
                disableFileUploadLayout();

                if (dpeCallback)
                    dpeCallback(uploadStake);

                if (parentCallback) {
                    var promise = parentCallback(uploadStake);
                    if (promise && promise.done) {
                        promise.done(clearConfirmFileUploadCache).always(resetFileUploadLayout);
                    }
                    else
                        clearConfirmFileUploadCache();

                    var drpdwn = $('#frmNewDocument #DocumentLanguageId_New').data("kendoDropDownList")
                    if (docLanguageDetail) {
                        if (!drpdwn.value() || drpdwn.value() == docLanguageDetail.LanguageId) {
                            _updateLanguage(drpdwn);
                        }
                        else {
                            var settings = { message: 'You have already selected language ' + drpdwn.text() + ' and the uploaded document is containing language ' + docLanguageDetail.Language + '. Do you want to update language to ' + docLanguageDetail.Language + '?', header: 'Confirm' };
                            displayConfirmation(settings, function () { _updateLanguage(drpdwn) }, function () { });
                        }
                    } 
                } else if (uploadStake.length > 0)
                    clearConfirmFileUploadCache();
                else
                    closeFileUploadModal();

            }

        }
        function _updateLanguage(drpdwn) {
            drpdwn.value(docLanguageDetail.LanguageId);
            drpdwn.trigger("change");
        }
        var displayFileUploadModal =
            function(uploadArgsFunc, callbackFunc, dpeCallbackFunc, confirmClearAttachmentCache) {

                clearAttachmentCacheOnConfirm =
                    confirmClearAttachmentCache == false ? confirmClearAttachmentCache : true;
                parentArgsCallback = uploadArgsFunc;
                parentCallback = callbackFunc;
                dpeCallback = dpeCallbackFunc;

                uploadError = false;
                uploadStake = [];

                //if (KendoPopUpAjustExecute)
                //    KendoPopUpAjustExecute($('#fileUploadWindow'));
                //else {
                //    $('#fileUploadWindow').data('kendoWindow').center();
                //    $('#fileUploadWindow').data('kendoWindow').open();
                //}

                //Nitin-10 Sep 2020- No need to call KendoPopUpAjustExecute method(TRECOMPLI-3912: Document- Automatic scroll when adding a revision)
                $('#fileUploadWindow').data('kendoWindow').center();
                $('#fileUploadWindow').data('kendoWindow').open();
            };

        function disableConfirmButton() {
            disableFileUploadLayout();
        }

        function enableConfirmButton() {
            resetFileUploadLayout();
        }

        var onFileUploadErrorCallback = null;

        var initializeAttachmentPopUp = function (handlers) {

            var window = $('#fileUploadWindow');
            window.on('click', '#uploadFilesConfirmSelect', onAttachmentConfirmBtnClick);
            window.on('click', '#uploadFilesCancelSelect', onAttachmentCancelBtnClick);

            onFileUploadErrorCallback = handlers.onFileUploadErrorCallback;
            

        };

        var onFileUploadWindowClose = function (e) {

            if (e.userTriggered == true) {
                e.preventDefault();
                confirmFileUploadWindowClose();
            }
        };

        // ***************************************** File Loading Methods ******************************************************
        var onFileUploadError = function (e) {

            console.log(e);

            // disable the confirm button 
            // find catch all event to enable "confirm" button

            if (e.XMLHttpRequest.response.indexOf("CONFLICTINGFILEUPLOADED:") >= 0) {
                uploadError = true;
                var response = e.XMLHttpRequest.response.replace("CONFLICTINGFILEUPLOADED:", "");
                if (onFileUploadErrorCallback != null) onFileUploadErrorCallback(response);

            } else {

                if (uploadError != true) {
                    uploadError = true;
                    displayError('An error occurred uploading the file(s) specified.');
                }
            }
        };

        var onFileUploadRemove = function (e) { 
            $('#uploadFilesConfirmSelect').attr('disabled', 'disabled');
            if (parentArgsCallback) {
                e.data = parentArgsCallback(e);
            }
        };

        var onFileUploadSelect = function (e) {
            if (uploadStake.length) {
                displayError("Only one file allowed at a time.")
                e.preventDefault();
                return false;
            }
            if ($(e.sender.element).hasClass("document-file-upload") && e.files.length>1) {
                displayError("Only one file allowed at a time.")
                e.preventDefault();
                return false;
            }
            var copiedArray = uploadStake.slice(0);
            var isvalidFile = true;
            $.each(e.files, function (index, value) {          
                //var fileExtension = ['.htm', '.html'];
                var fileExtension = ['.txt', '.doc', '.docx', '.xls', '.xlsx', '.tif', '.tiff', '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.bmp', '.gif', '.pdf'];
                if ($.inArray(value.extension.toLowerCase(), fileExtension) == -1 && !Is_Debug) {
                    e.preventDefault();
                    //displayError("HTML files are not allowed")
                    displayError("Only these files are allowed: .txt, .doc, .docx, .xls, .xlsx, .tif, .tiff, .ppt, .pptx, .jpg, .jpeg, .png, .bmp, .gif ,.pdf")
                    isvalidFile = false;
                }              
                if (isvalidFile == false) {
                    return false;
                }
                // Check if we already have a file uploaded with that given name
                var lowerCaseName = value.name.toLowerCase();
                if ($.inArray(lowerCaseName, copiedArray) >= 0) {
                    e.preventDefault();
                    displayError("You are attempting to upload or have uploaded a file with the same file name. Please rename " + lowerCaseName + " to continue.");
                    return false;
                }

                copiedArray.splice(0, 0, lowerCaseName);
            });
        };

        var onFileUploadSuccess = function (e) {

            //http://stackoverflow.com/questions/9614681/kendo-ui-file-upload-plugin-remove-button-customization
            //e.operation = remove or upload

            var lowerCaseFile = "";
            if (e.response[0] == undefined && uploadStake != null) {
                lowerCaseFile = uploadStake[0].filename;
            }
            else {
                lowerCaseFile = e.response[0].FileName.toLowerCase();
                if (!e.response[0].DocumentId) {
                    docLanguageDetail = e.response[0].DocumentLanguageDetail
                }
            }

            if (e.operation == 'upload') {
                uploadStake.splice(0, 0, {
                    filename: lowerCaseFile, elink: e.response[0].DocumentElink, physicalPath: e.response[0].PhysicalPath
                });
            } else {
                uploadStake = $.grep(uploadStake, function (value) {
                    return value.filename != lowerCaseFile;
                });
            }

            if (uploadStake.length >= 1) {
                $('#files').attr('disabled', 'disabled');
                $('#uploadFilesConfirmSelect').removeAttr("disabled")
            }
            else {
                $('#files').removeAttr("disabled");
                $('#uploadFilesConfirmSelect').attr('disabled', 'disabled');
            }
           
        };

        var onFileUploadUpload = function (e) {
            

            if (parentArgsCallback) {
                e.data = parentArgsCallback(e);
            }
        };

        var clearOnConflictedFileUpload = function (e) {
            // remove file from session memory
            clearAttachmentSessionCache();
            // sreset the file layout
            resetFileUploadLayout();
            // reset variables
            var uploadError = false;
            var uploadStake = [];
        }

        return {
            displayFileUploadModal: displayFileUploadModal,
            initializeAttachmentPopUp: initializeAttachmentPopUp,
            onFileUploadError: onFileUploadError,
            onFileUploadRemove: onFileUploadRemove,
            onFileUploadSelect: onFileUploadSelect,
            onFileUploadSuccess: onFileUploadSuccess,
            onFileUploadUpload: onFileUploadUpload,
            onFileUploadWindowClose: onFileUploadWindowClose,
            disableConfirmButton: disableConfirmButton,
            enableConfirmButton: enableConfirmButton,
            clearOnConflictedFileUpload: clearOnConflictedFileUpload
        };
    };

    $(function () {

    });

    

})(jQuery);