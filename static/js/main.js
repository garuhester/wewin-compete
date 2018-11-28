
function headerNav() {
    var url = window.location.href.split("/");
    if (url[3] == "") {
        document.getElementById("index").className += " mdui-bottom-nav-active";
    } else if (url[3] == "rank") {
        document.getElementById("rank").className += " mdui-bottom-nav-active";
    }
}

function snackbar(msg, time) {
    mdui.snackbar({
        message: msg,
        timeout: time,
        position: 'bottom',
    });
}