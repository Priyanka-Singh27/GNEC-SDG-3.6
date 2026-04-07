import { useRef } from 'react';

export default function CameraFeed({ videoRef, canvasRef, width = 640, height = 480 }) {
  return (
    <div style={{ position: 'relative', width, maxWidth: '100%' }}>
      <video
        ref={videoRef}
        width={width}
        height={height}
        muted
        playsInline
        style={{ display: 'block', width: '100%' }}
      />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ display: 'none' }}
      />
    </div>
  );
}
