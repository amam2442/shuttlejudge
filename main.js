function videoStart() {
  var constraints = { audio: false, video: { facingMode: "environment" } };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(
      function (stream) {
        var video = document.querySelector('video');
        video.srcObject = stream;
        video.onloadedmetadata = function (e) {
          video.play();
        };
      }
    )
};


function videoStop() {
  var constraints = { audio: false, video: { facingMode: "environment" } };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(
      function (stream) {
        var video = document.querySelector('video');
        video.srcObject = stream;
        video.onloadedmetadata = function (e) {
          stream.getVideoTracks()[0].stop();
        };
      }
    )
};
