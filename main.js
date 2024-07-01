const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Webカメラの映像を取得
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error('エラー:', err);
  });

// シャトルの検出関数
function detectShuttle(context, width, height) {
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;
  const threshold = 50;
  let shuttleDetected = false;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // 白色のピクセルを検出
    if (r > 200 && g > 200 && b > 200) {
      // シャトルの特徴を持つ領域を確認
      shuttleDetected = true;
      break;
    }
  }

  return shuttleDetected;
}

// 定期的にフレームをキャプチャして解析
function processFrame() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  if (detectShuttle(context, canvas.width, canvas.height)) {
    console.log("シャトルが見つかりました！");
  } else {
    console.log("シャトルは見つかりませんでした。");
  }
  requestAnimationFrame(processFrame);
}

// ビデオの準備ができたらフレームの処理を開始
video.addEventListener('play', () => {
  requestAnimationFrame(processFrame);
});
