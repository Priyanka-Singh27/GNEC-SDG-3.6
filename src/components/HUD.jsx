import { useRef, useEffect } from 'react';
import { drawHUD } from '../output/hudOutput.js';

export default function HUD({ alert, width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => drawHUD(canvasRef, alert), 200);
    return () => clearInterval(id);
  }, [alert]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={44}
      style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', pointerEvents: 'none' }}
    />
  );
}
