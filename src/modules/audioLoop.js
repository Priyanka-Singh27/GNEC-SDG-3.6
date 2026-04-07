import * as tf from '@tensorflow/tfjs';
import { emitAlert } from './priorityEngine.js';

// YAMNET AudioSet class indices (verify against the model's label map)
const SIREN_INDEX = 396;
const HORN_INDEX  = 300;
const SIREN_THRESHOLD = 0.70;
const HORN_THRESHOLD  = 0.65;

export function startAudioLoop(micStream, yamnetModel, onDispatch, sensitivityRef) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)({
    sampleRate: 16000,
  });
  const source = audioCtx.createMediaStreamSource(micStream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 16384;
  source.connect(analyser);

  const buffer = new Float32Array(analyser.fftSize);

  const intervalId = setInterval(async () => {
    analyser.getFloatTimeDomainData(buffer);

    let tensor;
    let results;
    try {
      tensor = tf.tensor(buffer, [buffer.length]);
      results = yamnetModel.predict(tensor);
      
      // YAMNet returns an array of [scores, embeddings, log_mel_spectrograms] or an object
      let scoresTensor;
      if (Array.isArray(results)) {
        scoresTensor = results[0]; // scores is the primary output
      } else if (results && !results.data) {
        // If it returns a map
        scoresTensor = Object.values(results)[0];
      } else {
        scoresTensor = results;
      }

      const scoresData = await scoresTensor.data();

      const sirenScore = scoresData[SIREN_INDEX] ?? 0;
      const hornScore  = scoresData[HORN_INDEX]  ?? 0;

      const activeSirenThreshold = sensitivityRef?.current?.audioThreshold ?? SIREN_THRESHOLD;
      // Horn typically needs a slightly lower conf than siren proportionally, but we can reuse the threshold or apply a small offset
      const activeHornThreshold = sensitivityRef?.current?.audioThreshold ? sensitivityRef.current.audioThreshold - 0.05 : HORN_THRESHOLD;

      if (sirenScore > activeSirenThreshold) {
        emitAlert('siren', sirenScore, onDispatch);
      } else if (hornScore > activeHornThreshold) {
        emitAlert('horn', hornScore, onDispatch);
      }
    } catch (err) {
      console.warn('Audio inference error:', err.message);
    } finally {
      if (tensor) tensor.dispose();
      
      // Properly dispose results since it can be an array
      if (Array.isArray(results)) {
        results.forEach(t => t && t.dispose && t.dispose());
      } else if (results && results.dispose) {
        results.dispose();
      } else if (results) {
        Object.values(results).forEach(t => t && t.dispose && t.dispose());
      }
    }
  }, 1000);

  return { intervalId, audioCtx };
}
