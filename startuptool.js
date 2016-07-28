var createInputDevices = function (canvas) {
    var devices = {
        keyboard: new pc.Keyboard(window),
        mouse: new pc.Mouse(canvas),
        gamepads: new pc.GamePads(),
    };
    if ('ontouchstart' in window) {
        devices.touch = new pc.TouchDevice(canvas);
    }

    return devices;
};

var reflow = function () {
    var size = app.resizeCanvas(canvas.width, canvas.height);
    canvas.style.width = '';
    canvas.style.height = '';

    var fillMode = app._fillMode;

    if (fillMode == pc.FILLMODE_NONE || fillMode == pc.FILLMODE_KEEP_ASPECT) {
        if ((fillMode == pc.FILLMODE_NONE && canvas.clientHeight < window.innerHeight) || (canvas.clientWidth / canvas.clientHeight >= window.innerWidth / window.innerHeight)) {
            canvas.style.marginTop = Math.floor((window.innerHeight - canvas.clientHeight) / 2) + 'px';
        } else {
            canvas.style.marginTop = '';
        }
    }
};

var displayError = function (html) {
    var div = document.createElement('div');

    div.innerHTML  = [
        '<table style="background-color: #8CE; width: 100%; height: 100%;">',
        '  <tr>',
        '      <td align="center">',
        '          <div style="display: table-cell; vertical-align: middle;">',
        '              <div style="">' + html + '</div>',
        '          </div>',
        '      </td>',
        '  </tr>',
        '</table>'
    ].join('\n');

    document.body.appendChild(div);
};

var configureCss = function (fillMode, width, height) {
    // Configure resolution and resize event
    if (canvas.classList) {
        canvas.classList.add('fill-mode-' + fillMode);
    }

    // css media query for aspect ratio changes
    var css  = "@media screen and (min-aspect-ratio: " + width + "/" + height + ") {";
        css += "    #application-canvas.fill-mode-KEEP_ASPECT {";
        css += "        width: auto;";
        css += "        height: 100%;";
        css += "        margin: 0 auto;";
        css += "    }";
        css += "}";

    // append css to style
    if (document.head.querySelector) {
        document.head.querySelector('style').innerHTML += css;
    }
};