import { VIBRATION_PATTERNS } from '../constants/vibrationPatterns.js';

export function vibrateAlert(type) {
  if (!('vibrate' in navigator)) return;
  const pattern = VIBRATION_PATTERNS[type] ?? VIBRATION_PATTERNS['default'];
  navigator.vibrate(pattern);
}
