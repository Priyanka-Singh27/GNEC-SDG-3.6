export function drawHUD(canvasRef, alertData) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!alertData) return;

  const { type, priority, score, timestamp } = alertData;
  const age = Date.now() - timestamp;
  if (age > 4000) return;

  const opacity = Math.max(0, 1 - age / 4000);
  const color = priority === 3 ? '#E24B4A' : priority === 2 ? '#BA7517' : '#1D9E75';

  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, 44);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px Arial';
  ctx.fillText(`${type.toUpperCase()}  |  conf: ${(score * 100).toFixed(0)}%`, 16, 28);
  ctx.globalAlpha = 1;
}
