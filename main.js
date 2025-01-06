const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const messageDiv = document.getElementById('message'); // 動き検知メッセージを表示するための<div>

let prevFrame = null; // 前のフレーム
const motionThreshold = 10000000; // 動き検知の閾値（調整可能）
const recordingBuffer = []; // 録画バッファ
let recorder = null; // MediaRecorderのインスタンス
let isRecording = false;
let skipMotionDetection = false;
let cooldown = false;


// カメラ映像を取得して<video>に表示
async function startCamera() {
  try {
    // スマホのリアカメラを使用
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    });

    video.srcObject = stream;

    // MediaRecorderを初期化
    initRecorder(stream);


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
// MediaRecorderの初期化
function initRecorder(stream) {
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordingBuffer.push(event.data);
    }
  };

  recorder.onstop = () => {
    console.log("録画終了");
    if (recordingBuffer.length > 0) {
      const recordedBlob = new Blob(recordingBuffer, { type: 'video/webm' });
      console.log("録画データ作成完了", recordedBlob);

      // 再生用ビデオに設定
      const playback = document.getElementById('playback');
      playback.src = URL.createObjectURL(recordedBlob);
      playback.style.display = 'block'; // 再生用ビデオを表示
    }
    recordingBuffer.length = 0; // バッファをクリア
  };
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
  if (skipMotionDetection) {
    requestAnimationFrame(processFrame);
    return;
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // 動きを検知
  if (detectMotion(currentFrame)) {
    messageDiv.textContent = '動きを検知しました！';
    if (!isRecording) {
      startRecording();
    }
  } else {
    messageDiv.textContent = '';
  }

  requestAnimationFrame(processFrame);
}


// 録画を開始
function startRecording() {
  isRecording = true;
  skipMotionDetection = true; // 動き検知をスキップ
  recorder.start();
  console.log("録画を開始しました");

  // 3秒間録画
  setTimeout(() => {
    stopRecording();
  }, 3000);
}

// 録画を停止
function stopRecording() {
  if (isRecording) {
    console.log("録画を停止しました")
    isRecording = false;
    recorder.stop();
    cooldown = true; // クールダウンを開始

    setTimeout(() => {
      cooldown = false;
      skipMotionDetection = false; // クールダウン終了後に動き検知を再開
      prevFrame = null; // フレームデータをリセット
    }, 5000); // クールダウン時間（5秒）
  }
}


// カメラ起動
startCamera();
