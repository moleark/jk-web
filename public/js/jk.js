window.onload = function () {
    let isMobile = browserRedirect();
    if (!isMobile) {

        $("div a").each(function (index, element) {
            $(element).attr("target", "_blank");
        });
        $("li a").each(function (index, element) {
            $(element).attr("target", "_blank");
        });
    }
}

function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)) {
        return true;
    } else {
        return false;
    }
}