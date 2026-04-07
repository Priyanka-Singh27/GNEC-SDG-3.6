import { emitAlert } from './priorityEngine.js';

const WATCHED_CLASSES = [
  'stop sign', 'traffic light', 'car', 'truck',
  'motorcycle', 'person', 'bicycle',
];

const SCORE_THRESHOLD = 0.55;

// Lane drift ROI: lower-centre strip of the frame
const ROI = { x: 200, y: 340, w: 240, h: 60 };
const DRIFT_THRESHOLD = 0.35; // left/right pixel imbalance ratio

export function startVisionLoop(videoEl, canvasEl, cocoModel, onDispatch, sensitivityRef) {
  const ctx = canvasEl.getContext('2d');

  const intervalId = setInterval(async () => {
    if (!videoEl || videoEl.readyState < 2) return;

    ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

    const activeThreshold = sensitivityRef?.current?.visionThreshold ?? SCORE_THRESHOLD;

    // Object detection
    const predictions = await cocoModel.detect(canvasEl);
    for (const p of predictions) {
      if (p.score > activeThreshold && WATCHED_CLASSES.includes(p.class)) {
        emitAlert(p.class, p.score, onDispatch);
      }
    }

    // Lane drift detection
    const imageData = ctx.getImageData(ROI.x, ROI.y, ROI.w, ROI.h);
    const pixels = imageData.data;
    let leftBright = 0, rightBright = 0;
    const half = ROI.w / 2;

    for (let i = 0; i < pixels.length; i += 4) {
      const pixelIndex = i / 4;
      const col = pixelIndex % ROI.w;
      const brightness = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3;
      if (brightness > 180) {
        if (col < half) leftBright++;
        else rightBright++;
      }
    }

    const total = leftBright + rightBright;
    if (total > 20) {
      const leftRatio = leftBright / total;
      const rightRatio = rightBright / total;
      if (leftRatio > (0.5 + DRIFT_THRESHOLD)) {
        emitAlert('lane-drift-left', leftRatio, onDispatch);
      } else if (rightRatio > (0.5 + DRIFT_THRESHOLD)) {
        emitAlert('lane-drift-right', rightRatio, onDispatch);
      }
    }

  }, 100);

  return intervalId;
}
