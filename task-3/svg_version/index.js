(function () {

    var video,
        canvas,
        controlsFilter,
        filterName;

    var initVideoStream = function(){
        video = document.querySelector('.camera__video'),
        canvas = document.querySelector('.camera__canvas'),
        controlsFilter = document.querySelector('.controls__filter'),
        filterName = controlsFilter.value,
        prefixClass = 'camera__canvas_';

        canvas.classList.add(prefixClass+filterName);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }

    window.onload = initVideoStream();
    window.onresize = initVideoStream();

    controlsFilter.onchange = function(){
        canvas.classList.remove(prefixClass+filterName);
        filterName = this.value;
        canvas.classList.add(prefixClass+filterName);
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

    var captureFrame = function () {
        canvas.getContext('2d').drawImage(video, 0, 0);
    };

    getVideoStream(function () {
        captureFrame();
        setInterval(captureFrame, 1);
    });
})();
