import { ALERT_MESSAGES } from '../constants/alertMessages.js';

export function speakAlert(type, priority) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const msg = ALERT_MESSAGES[type] ?? type;
  const utterance = new SpeechSynthesisUtterance(msg);
  utterance.rate = priority === 3 ? 1.4 : 1.0;
  utterance.volume = 1.0;
  window.speechSynthesis.speak(utterance);
}
