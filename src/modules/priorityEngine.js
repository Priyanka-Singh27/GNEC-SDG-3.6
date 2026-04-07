import { PRIORITIES, COOLDOWN_MS } from '../constants/priorities.js';

const lastFired = {};
let activePriority = 0;
let activePriorityExpiry = 0;

function getActivePriority() {
  if (Date.now() > activePriorityExpiry) activePriority = 0;
  return activePriority;
}

export function emitAlert(type, score, onDispatch) {
  const priority = PRIORITIES[type] ?? 1;
  const now = Date.now();

  if (priority < getActivePriority()) return;
  if (now - (lastFired[type] ?? 0) < COOLDOWN_MS[priority]) return;

  lastFired[type] = now;
  activePriority = priority;
  activePriorityExpiry = now + COOLDOWN_MS[priority];

  onDispatch({ type, priority, score });
}

export function resetEngine() {
  Object.keys(lastFired).forEach(k => delete lastFired[k]);
  activePriority = 0;
  activePriorityExpiry = 0;
}
