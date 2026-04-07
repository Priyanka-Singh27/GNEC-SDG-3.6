import { useState, useEffect, useRef } from 'react';

export function useMediaStream() {
  const videoRef = useRef(null);
  const [micStream, setMicStream] = useState(null);
  const [permissionError, setPermissionError] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'environment' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
          await videoRef.current.play();
        }

        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: { sampleRate: 16000, channelCount: 1, echoCancellation: false },
          video: false,
        });
        setMicStream(audioStream);
        setReady(true);
      } catch (err) {
        setPermissionError(err.message);
      }
    }
    init();
  }, []);

  return { videoRef, micStream, permissionError, ready };
}
