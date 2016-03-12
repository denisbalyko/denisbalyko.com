(function () {

    var video,
        controlsFilter,
        filterName;

    var initVideoStream = function(){
        video = document.querySelector('.camera__video');
        controlsFilter = document.querySelector('.controls__filter');
        filterName = controlsFilter.value;
    }

    window.onload = initVideoStream();
    window.onresize = initVideoStream();

    controlsFilter.onchange = function(){
        filterName = this.value;
        video.style.webkitFilter='url(#'+filterName+')';
        video.style.mozFilter='url(#'+filterName+')';
        video.style.filter='url(#'+filterName+')';
    }

    controlsFilter.onchange();

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true},
            function (stream) {
                video.src = window.URL.createObjectURL(stream);
                video.onloadedmetadata = function (e) {
                    video.play();
                };
            },
            function (err) {
                console.log("The following error occured: " + err.name);
            }
        );
    } else {
        console.log("getUserMedia not supported");
    }

})();
