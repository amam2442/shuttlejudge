const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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

// <canvas>に映像を描画
function drawToCanvas() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  requestAnimationFrame(drawToCanvas); // 毎フレーム描画
}

// カメラ起動
startCamera();
