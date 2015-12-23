; (function ($) {
    if ($.fn.uploadFileAlt == null) {
        $.fn.uploadFileAlt = {};
    }

    $.fn.uploadFileAlt = function () {
        var clearAttachmentCacheOnConfirm = false;
        var parentCallback = null;
        var parentArgsCallback = null;
        var uploadError = false;
        var uploadStake = [];

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
                alert(message);
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

        function  onAttachmentConfirmBtnClick(e) {

            e.preventDefault();
            disableFileUploadLayout();

            if (parentCallback) {
                var promise = parentCallback(uploadStake);
                if (promise && promise.done) {
                    promise.done(clearConfirmFileUploadCache).always(resetFileUploadLayout);
                }
                else
                    clearConfirmFileUploadCache();

            } else if (uploadStake.length > 0)
                clearConfirmFileUploadCache();
            else
                closeFileUploadModal();
        }

        var displayFileUploadModal = function (uploadArgsFunc, callbackFunc, confirmClearAttachmentCache) {
            clearAttachmentCacheOnConfirm = confirmClearAttachmentCache == false ? confirmClearAttachmentCache: true;
            parentArgsCallback = uploadArgsFunc;
            parentCallback = callbackFunc;

            uploadError = false;
            uploadStake =[];

            if (KendoPopUpAjustExecute)
                KendoPopUpAjustExecute($('#fileUploadWindow'));
            else {
                $('#fileUploadWindow').data('kendoWindow').center();
                $('#fileUploadWindow').data('kendoWindow').open();
    }
        };

        var initializeAttachmentPopUp = function () {

            var window = $('#fileUploadWindow');
            window.on('click', '#uploadFilesConfirmSelect', onAttachmentConfirmBtnClick);
            window.on('click', '#uploadFilesCancelSelect', onAttachmentCancelBtnClick);
        };

        var onFileUploadWindowClose = function (e) {

            if (e.userTriggered == true) {
                e.preventDefault();
                confirmFileUploadWindowClose();
    }
    };

        // ***************************************** File Loading Methods ******************************************************
        var onFileUploadError = function (e) {
          
            if (uploadError != true) {
                uploadError = true;
                displayError('An error occurred uploading the file(s) specified.');
    }
        };

        var onFileUploadRemove = function (e) {
           
            if (parentArgsCallback) {
                e.data = parentArgsCallback(e);
    }
        };

        var onFileUploadSelect = function (e) {

            var copiedArray = uploadStake.slice(0);
            $.each(e.files, function (index, value) {

                if (value.extension.toLowerCase() != ".pdf") {
                    //    e.preventDefault();
                    //  displayError("Please upload only pdf files");
                    //return false;
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
          
            var lowerCaseFile="";
            if (e.response[0] == undefined && uploadStake != null) {
                lowerCaseFile = uploadStake[0].filename;
            }
            else {
                lowerCaseFile = e.response[0].FileName.toLowerCase();
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
                }
            else {
                $('#files').removeAttr("disabled");
                }

        };

        var onFileUploadUpload = function (e) {
       
            if (parentArgsCallback) {
                e.data = parentArgsCallback(e);
    }
        };

        return {
        displayFileUploadModal: displayFileUploadModal,
        initializeAttachmentPopUp: initializeAttachmentPopUp,
        onFileUploadError: onFileUploadError,
        onFileUploadRemove: onFileUploadRemove,
        onFileUploadSelect: onFileUploadSelect,
        onFileUploadSuccess: onFileUploadSuccess,
        onFileUploadUpload: onFileUploadUpload,
        onFileUploadWindowClose: onFileUploadWindowClose
        };
    };

    $(function () {

    });

})(jQuery);