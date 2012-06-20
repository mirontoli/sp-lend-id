function ikkelen($, webpartId) {
    var webpart;
    function notifyIkkelen() {
        webpart.find("[data-role='notification-area']")
            .append($("<div class='notification'>Tada!</div>"));
    }

    function initIkkelen() {
        webpart = $("#" + webpartId);
        webpart.find("[data-role='clickMe']").on({
            click: notifyIkkelen
        });
    }

    $(document).on({
        ready: initIkkelen
    });
}