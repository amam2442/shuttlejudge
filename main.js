// script.js
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const snapButton = document.getElementById('snap');

// スマホカメラの映像を取得する
navigator.mediaDevices.getUserMedia({ video: true })
  .then(function (stream) {
    video.srcObject = stream;
    video.play();
  })
  .catch(function (err) {
    console.log("An error occurred: " + err);
  });

// ボタンをクリックするとcanvasにカメラ映像を描画する
snapButton.addEventListener('click', function () {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
});
