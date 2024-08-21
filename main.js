const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const message = document.getElementById('message');
const playbackVideos = [
  document.getElementById('playbackVideo1'),
  document.getElementById('playbackVideo2'),
  document.getElementById('playbackVideo3')
];

let previousFrame = null;
let currentFrame = null;
const blueThreshold = 150; // 青色の検出閾値
let isRecording = false;
let recordedFrames = [];
let videoCount = 0;
const recordDuration = 2000; // 2秒間の録画

// Webカメラの映像を取得
navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: 'environment', // スマホの後ろのカメラを使用
    width: { ideal: 640 },
    height: { ideal: 480 }
  }
})
  .then((stream) => {
    video.srcObject = stream;
    video.play();
  })
  .catch((err) => {
    console.error('エラー:', err);
  });

// フレーム間の差分を計算し、青色の動きを検出
function detectMovement(context, width, height) {
  currentFrame = context.getImageData(0, 0, width, height);

  if (previousFrame) {
    let movementDetected = false;

    for (let i = 0; i < currentFrame.data.length; i += 4) {
      const r = currentFrame.data[i];
      const g = currentFrame.data[i + 1];
      const b = currentFrame.data[i + 2];

      // 青色のピクセルを検出
      if (b > blueThreshold && r < 100 && g < 100) {
        movementDetected = true;
        break;
      }
    }

    previousFrame = currentFrame;
    return movementDetected;
  } else {
    previousFrame = currentFrame;
    return false;
  }
}

// 2秒間の録画を開始
function startRecording() {
  isRecording = true;
  recordedFrames = []; // 新しい録画を開始
  const recordingStartTime = Date.now();

  const recordFrame = () => {
    if (Date.now() - recordingStartTime < recordDuration) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      recordedFrames.push(canvas.toDataURL());
      requestAnimationFrame(recordFrame);
    } else {
      stopRecording();
    }
  };

  recordFrame();
}

// 録画終了後に動画を表示
function stopRecording() {
  isRecording = false;
  createVideoFromFrames();
}

// 録画されたフレームを使って動画を作成し、最大で3つまで保存・表示
function createVideoFromFrames() {
  const videoBlob = new Blob(recordedFrames.map(dataURLtoBlob), { type: 'video/webm' });
  const videoURL = URL.createObjectURL(videoBlob);

  const playbackVideo = playbackVideos[videoCount % 3];
  playbackVideo.src = videoURL;
  playbackVideo.style.display = 'block';

  videoCount++;
}

// DataURLをBlobに変換
function dataURLtoBlob(dataURL) {
  const binary = atob(dataURL.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: 'image/webp' });
}

// 定期的にフレームをキャプチャして解析
function processFrame() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const movementDetected = detectMovement(context, canvas.width, canvas.height);

  if (movementDetected && !isRecording) {
    message.textContent = "青色の動きを検出しました！録画中...";
    startRecording();
  } else if (!isRecording) {
    message.textContent = "";
  }

  requestAnimationFrame(processFrame);
}

// ビデオの準備ができたらフレームの処理を開始
video.addEventListener('play', () => {
  requestAnimationFrame(processFrame);
});
