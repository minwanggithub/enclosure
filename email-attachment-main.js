; (function ($) {
    if ($.fn.uploadEmailAttachmentAlt == null) {
        $.fn.uploadEmailAttachmentAlt = {};
    }

    $.fn.uploadEmailAttachmentAlt = function () {

        var clearAttachmentCacheOnConfirm = false;
        var parentCallback = null;
        var parentArgsCallback = null;
        var uploadError = false;
        var uploadStake = [];
        var blockGuid = null;

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

            return;
            parentCallback = null;
            uploadError = false;
            uploadStake = [];

            resetFileUploadLayout();

            $('#fileUploadWindow').find('.k-reset li').remove();
            $('#fileUploadWindow').find('.k-upload-status').remove();
            $('#fileUploadWindow').data('kendoWindow').close();
        }

        function clearAttachmentSessionCache() {

            return;
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

            $.post('../ObtainmentWorkflow/RemoveEmailAttachments', removeArgs, closeFileUploadModal);
        }

        function clearConfirmFileUploadCache() {
            return;
            if (clearAttachmentCacheOnConfirm == true)
                clearAttachmentSessionCache();
            else
                closeFileUploadModal();

        }

        function confirmFileUploadWindowClose() {
            return;
            console.log(uploadStake);

            if (uploadStake.length > 0) {
                var settings = { message: 'You have attachments ready to be linked to a email. Are you sure you would like to cancel?', header: 'Confirm Email Attachment Upload Cancel' };
                displayConfirmation(settings, clearAttachmentSessionCache);
            } else
                closeFileUploadModal();
        }

        function disableFileUploadLayout() {
            return;
            $("body").css("cursor", "wait");

            $('#fileUploadWindow').find("input").toggleClass("file-upload-disable").attr('disabled', 'disabled').end()
                .find("a").toggleClass("file-upload-disable").attr('disabled', 'disabled').end()
                .find(".k-button").toggleClass("file-upload-disable").attr('disabled', 'disabled');
        }

        function resetFileUploadLayout() {
            return;
            $("body").css("cursor", "default");

            $('#fileUploadWindow').find("input").toggleClass("file-upload-disable").removeAttr("disabled").end()
                .find("a").toggleClass("file-upload-disable").removeAttr("disabled").end()
                .find(".k-button").toggleClass("file-upload-disable").removeAttr("disabled");
        }

        function onAttachmentCancelBtnClick(e) {
            return;
            // abandoning file attachments. 

            e.preventDefault();
            confirmFileUploadWindowClose();

        }

        function onAttachmentConfirmBtnClick(e) {
            return;
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
            return;
            // when the file upload window shows, we are starting a new upload
            // session.

            console.log("Reset session");

            uploadError = false;
            uploadStake = [];

            /*
            blockGuid = null;

            clearAttachmentCacheOnConfirm = confirmClearAttachmentCache == false ? confirmClearAttachmentCache : true;
            parentArgsCallback = uploadArgsFunc;
            parentCallback = callbackFunc;

            uploadError = false;
            uploadStake = [];

            */

            if (KendoPopUpAjustExecute)
                KendoPopUpAjustExecute($('#fileUploadWindow'));
            else {
                $('#fileUploadWindow').data('kendoWindow').center();
                $('#fileUploadWindow').data('kendoWindow').open();
            }
        };

        var initialize = function (files) {

            // clear out kendo upload
            $(".k-upload-files").remove();
            $(".k-upload-status").remove();
            $(".k-upload.k-header").addClass("k-upload-empty");
            $(".k-upload-button").removeClass("k-state-focused");

            // storage for attachments
            uploadStake = [];

            for (var i = 0; files != null && i < files.length; i++) {

                var data = new Object();
                data.files = [];

                data.files.push(files[i]);
                uploadStake.push(data);

            }

        };

        var onFileUploadWindowClose = function (e) {
            return;
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

            // replace the file name
            e.files[0].name = e.files[0].dictGuid;

            var temp = uploadStake;
            var i = null;
            $.each(temp, function (index, value) {

                console.log(value);
                console.log(e.files[0]);

                // remove the element that matches the file GUID
                if (value.files[0].dictGuid == e.files[0].name && i == null) {
                    i = index;
                }

            });

            if (i != null) {
                uploadStake.splice(i, 1);
                console.log(uploadStake);
            } else
                uploadStake = [];

        };

        var onFileUploadSelect = function (e) {

            // duplicate file name check - how to return full path including directory
            // name - two files may have the same name, but different directory paths

            // iterate through all files already uploaded and see if we are uploading
            // a file that has been uploaded already ?

            $.each(uploadStake, function (index, value) {

                // filename
                var lowerCaseName = value.files[0].name.toLowerCase();
                if (lowerCaseName == e.files[0].name.toLowerCase()) {
                    e.preventDefault();
                    displayError("You are attempting to upload or have uploaded a file with the same file name. Please rename " + lowerCaseName + " to continue.");
                    return false;
                }

            });
        };

        var onFileUploadSuccess = function (e) {

            if (e.operation == "upload") {
                e.files[0].dictGuid = e.response.id;
                uploadStake.push(e);
            }

        };

        var onFileUploadUpload = function (e) {
        };

        var abandonAttachments = function (callback) {

            var data = new Object();
            data.attachments = getAttachments();

            if (uploadStake.length > 0) {

                var settings = {
                    message: "You have attachments, abandon composing email?",
                    header: 'Abandon Email?'
                };

                displayConfirmation(settings,
                    function () {

                        uploadStake = [];

                        // clear out kendo upload
                        $(".k-upload-files").remove();
                        $(".k-upload-status").remove();
                        $(".k-upload.k-header").addClass("k-upload-empty");
                        $(".k-upload-button").removeClass("k-state-focused");

                        data.abandon = true;
                        callback(data);

                    },
                    function () {

                        data.abandon = false;
                        callback(data);

                    });

            } else {

                data.abandon = true;
                callback(data);
            }
        };

        var getAttachments = function () {

            var dictGuids = [];

            // locate files
            $.each(uploadStake, function (index, value) {
                dictGuids.push(value.files[0].dictGuid);
            });

            console.log(dictGuids);
            return dictGuids;
        }

        return {
            displayFileUploadModal: displayFileUploadModal,
            initialize: initialize,
            abandonAttachments: abandonAttachments,
            getAttachments: getAttachments,
            onFileUploadError: onFileUploadError,
            onFileUploadRemove: onFileUploadRemove,
            onFileUploadSelect: onFileUploadSelect,
            onFileUploadSuccess: onFileUploadSuccess,
            onFileUploadUpload: onFileUploadUpload,
            onFileUploadWindowClose: onFileUploadWindowClose,
        };
    };

    $(function () {

    });

})(jQuery);