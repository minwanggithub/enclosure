<script id="kendoDropdownTemplateWithDisabledItem" type="text/x-kendo-template">
    <span class="#: !Active ? 'k-state-disabled': ''#">
        #: Text #
            </span>
</script>

<script id="ad-search-history-row" type="text/x-kendo-template">
   <tr class='historyrow'><td><input class='chk-default' type='radio' name='historyDefault' data-bind='value: HistoryName, click: onIsDefaultChange' #: IsDefault?'checked':''# style='margin-left: 10px'></td><td><input type='text' data-bind='value: HistoryName' style='width: 250px; height:18px; border: 0' readonly='readonly'><button data-bind='value: HistoryName, click: onDeleteHistoryRowClick' class='k-button btn btn-small' style='position:relative;z-index:1;height:26px;margin-left:2px;'><span class='k-icon k-i-delete'></span></button></td></tr>
</script>



