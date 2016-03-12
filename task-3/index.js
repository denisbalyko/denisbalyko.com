(function () {

    var video,
        canvas,
        ctx,
        controlsFilter,
        filterName;

    var initVideoStream = function(){
        video = document.querySelector('.camera__video'),
        canvas = document.querySelector('.camera__canvas'),
        ctx = canvas.getContext('2d'),
        controlsFilter = document.querySelector('.controls__filter'),
        filterName = controlsFilter.value;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }

    var filters = {
        invert: function (r, g, b) {
            return [255 - r, 255 - g, 255 - b];
        },
        grayscale: function (r, g, b) {
            var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            return [v, v, v];
        },
        threshold: function (r, g, b) {
            var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 128) ? 255 : 0;
            return [v, v, v];
        }
    };

    window.onload = initVideoStream();
    window.onresize = initVideoStream();

    controlsFilter.onchange = function(){
        filterName = this.value;
    }

    var getVideoStream = function (callback) {
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true},
                function (stream) {
                    video.src = window.URL.createObjectURL(stream);
                    video.onloadedmetadata = function (e) {
                        video.play();
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        callback();
                    };
                },
                function (err) {
                    console.log("The following error occured: " + err.name);
                }
            );
        } else {
            console.log("getUserMedia not supported");
        }
    };

    var applyFilter = function (pixels) {

        for (var i = 0; i < pixels.data.length - 1; i += 4){
            var filtered = filters[filterName](
                               pixels.data[i  ],
                               pixels.data[i+1],
                               pixels.data[i+2]
                           );

            pixels.data[i  ] = filtered[0];
            pixels.data[i+1] = filtered[1];
            pixels.data[i+2] = filtered[2];
        }

        return pixels;
    };

    var captureFrame = function () {
        ctx.drawImage(video, 0, 0);
        pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(applyFilter(pixels), 0, 0);
    };

    getVideoStream(function () {
        setInterval(captureFrame, 1);
    });
})();
