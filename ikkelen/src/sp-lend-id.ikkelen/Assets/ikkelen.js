function notifyIkkelen() {
    jQuery("#notification-area")
        .append(jQuery("<div class='notification'>Tada!</div>"));
}
function initIkkelen() {
    jQuery("#clickMe").on({
        click: notifyIkkelen
    });
}
jQuery(document).on({
    ready: initIkkelen
});