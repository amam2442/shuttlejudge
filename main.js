const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const messageDiv = document.getElementById('message'); // 動き検知メッセージを表示するための<div>



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
async function drawToCanvas() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height); // 現在のフレームデータを取得

  // シャトルの動きを検知
  requestAnimationFrame(drawToCanvas); // 毎フレーム描画
}

// カメラ起動
startCamera();
