(function (doc, win) {
    var docEl = doc.documentElement;
    var resizeFont = function () {
        window.clientWidth = docEl.clientWidth;
        window.clientHeight = docEl.clientHeight;
        var aspectRatio = window.clientWidth / window.clientHeight;
        if (aspectRatio > 1280 / 320) {
            docEl.style.fontSize = 300 * (window.clientHeight / 1080) + 'px';
        } else {
            docEl.style.fontSize = 300 * (window.clientWidth / 1920) + 'px';
        }
    };
    win.addEventListener('resize', function () {
        setTimeout(resizeFont, 300)
    }, false);
    doc.addEventListener('DOMContentLoaded', resizeFont, false);
})(document, window);