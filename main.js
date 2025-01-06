const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const messageDiv = document.getElementById('message'); // 動き検知メッセージを表示するための<div>

let prevFrame = null; // 前のフレーム
const motionThreshold = 10000000; // 動き検知の閾値（調整可能）



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
      processFrame();
    };
  } catch (err) {
    console.error('カメラのアクセスに失敗しました:', err);
  }
}

// 動きの検知
function detectMotion(currentFrame) {
  if (!prevFrame) {
    prevFrame = currentFrame;
    return false;
  }

  let motion = 0;

  // 各ピクセルの差分を計算
  for (let i = 0; i < currentFrame.data.length; i += 4) {
    const rDiff = Math.abs(currentFrame.data[i] - prevFrame.data[i]); // 赤の差分
    const gDiff = Math.abs(currentFrame.data[i + 1] - prevFrame.data[i + 1]); // 緑の差分
    const bDiff = Math.abs(currentFrame.data[i + 2] - prevFrame.data[i + 2]); // 青の差分

    motion += rDiff + gDiff + bDiff;
  }

  prevFrame = currentFrame;

  // 動きが閾値を超えたかどうか
  return motion > motionThreshold;
}

// フレームを処理
function processFrame() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // 動きを検知
  if (detectMotion(currentFrame)) {
    messageDiv.textContent = '動きを検知しました！';
  } else {
    messageDiv.textContent = '';
  }

  requestAnimationFrame(processFrame);
}


// カメラ起動
startCamera();
