const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const messageDiv = document.getElementById('message'); // 動き検知メッセージを表示するための<div>

let prevFrame = null; // 前のフレームの画像データ
let motionDetected = false; // 動きが検知されたかどうか


// カメラ映像を取得して<video>に表示
async function startCamera() {
  try {
    // スマホのリアカメラを使用
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    });

    video.srcObject = stream;

    // 動画メタデータがロードされたら<canvas>のサイズを設定
    video.onloadedmetadata = () => {
      video.play();
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      drawToCanvas();
    };
  } catch (err) {
    console.error('カメラのアクセスに失敗しました:', err);
  }
}
// シャトルの動きを検知する
function detectShuttleMotion(frame) {
  if (prevFrame === null) {
    prevFrame = frame;
    return false;
  }

  // 前フレームとの差分を計算
  const diff = cv.absdiff(prevFrame, frame); // OpenCVの差分処理（要OpenCV.js）

  const grayDiff = cv.cvtColor(diff, cv.COLOR_RGBA2GRAY); // グレースケールに変換
  const threshold = cv.threshold(grayDiff, 50, 255, cv.THRESH_BINARY); // 二値化

  // シャトルが動いているかどうかの閾値（動きが大きければ検出）
  const nonZeroCount = cv.countNonZero(threshold);
  const motionThreshold = 500; // 動きの閾値（非ゼロのピクセル数）

  prevFrame = frame;

  return nonZeroCount > motionThreshold;
}

// <canvas>に映像を描画
async function drawToCanvas() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height); // 現在のフレームデータを取得

  // シャトルの動きを検知
  if (detectShuttleMotion(frame)) {
    if (!motionDetected) {
      motionDetected = true;
      messageDiv.textContent = 'シャトルを検出しました！';
    }
  } else {
    motionDetected = false;
    messageDiv.textContent = ''; // 動きがない場合はメッセージを消す
  }
  requestAnimationFrame(drawToCanvas); // 毎フレーム描画
}

// カメラ起動
startCamera();
