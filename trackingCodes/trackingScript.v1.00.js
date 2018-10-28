var capture = {
    id: 12345,
    loc: encodeURIComponent(document.location),
    tit: encodeURIComponent(document.title),
    ref: encodeURIComponent(document.referrer),
    sDate: new Date().getTime(),
    pointer: [],
    device: {
        scr: {
            w: screen.width,
            h: screen.height
        },
        brws: window.navigator.userAgent,
        agent: window.navigator.appName,
        os: window.navigator.platform,
        lang: window.navigator.userLanguage || window.navigator.language || window.navigator.languages
    },
    domain: document.domain,
    guid: guid(),
    fingerprint: fingerprint()
}

document.body.onmousemove = function (e) {

    var event = {
        time: new Date().getTime(),
        x: e.clientX,
        y: e.clientY
    }

    capture.pointer.push(event);
};

document.body.onunload = function (e) {

    capture.eDate = new Date().getTime();
    console.log(capture);

    // construct an HTTP request
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://localhost:8500/tracking/capture');
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(capture));

    xhr.onloadend = function () {
        alert('why hello there');
    };

}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function fingerprint() {

    var nav = window.navigator;
    var screen = window.screen;
    var print = nav.mimeTypes.length;
    print += nav.userAgent.replace(/\D+/g, '');
    print += nav.plugins.length;
    print += screen.height || '';
    print += screen.width || '';
    print += screen.pixelDepth || '';

    return print;
};