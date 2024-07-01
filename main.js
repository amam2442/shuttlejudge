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

// Canvasに画像を描画してシャトルを検出する
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const image = new Image();
image.src = 'path_to_image';
image.onload = function () {
  context.drawImage(image, 0, 0);
  const width = canvas.width;
  const height = canvas.height;
  if (detectShuttle(context, width, height)) {
    console.log("シャトルが見つかりました！");
  } else {
    console.log("シャトルは見つかりませんでした。");
  }
};
