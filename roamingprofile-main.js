;
(function($) {
    if ($.fn.complibRoamingProfile == null) {
        $.fn.complibRoamingProfile = {};
    }

    $.fn.complibRoamingProfile = function() {

        //local variables
        var docConfigObj = $('#DocumentConfiguration');

        //Public functions
        docConfigObj.on("click", "#btnDocumentConfigSave", function (e) {
            e.preventDefault();
         
            var form = $("#documentConfigForm");
            var url = form.attr("action");
            var formData = form.serialize();
          
            $.post(url, formData, function (data) {
                if (data == "Document configuration Saved") {
                    $('#CreatedMessage').fadeIn(500).delay(1000).fadeOut(400).html(data);
                    return true;
                } else {
                    kendo.alert('Error occured while saving document configuration, ' + data);
                    return false;
                }
            });
        });

        return {
            
        };

    };

})(jQuery);