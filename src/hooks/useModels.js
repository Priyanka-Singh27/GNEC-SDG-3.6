import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const YAMNET_URL =
  'https://tfhub.dev/google/tfjs-model/yamnet/tfjs/1';

export function useModels() {
  const [models, setModels] = useState({ coco: null, yamnet: null });
  const [loadProgress, setLoadProgress] = useState({ coco: false, yamnet: false });
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAll() {
      try {
        await tf.ready();

        const coco = await cocoSsd.load();
        setLoadProgress(p => ({ ...p, coco: true }));

        const yamnet = await tf.loadGraphModel(YAMNET_URL, { fromTFHub: true });
        setLoadProgress(p => ({ ...p, yamnet: true }));

        setModels({ coco, yamnet });
      } catch (err) {
        setError(err.message);
        console.error('Model load failed:', err);
      }
    }
    loadAll();
  }, []);

  const allLoaded = loadProgress.coco && loadProgress.yamnet;
  return { models, loadProgress, allLoaded, error };
}
