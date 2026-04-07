import { colors, priorityColors } from '../styles/tokens.js';
import { ALERT_MESSAGES } from '../constants/alertMessages.js';

export default function HUDBar({ alert, isHearing }) {
  const bar = {
    padding: '10px 16px',
    background: colors.gray900,
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', gap: 10,
    borderBottom: `0.5px solid rgba(255,255,255,0.08)`,
  };

  if (!alert) {
    return (
      <div style={bar}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          Monitoring for hazards...
        </div>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: colors.teal, opacity: 0.8,
        }} />
      </div>
    );
  }

  const pc = priorityColors[alert.priority] ?? priorityColors[1];

  return (
    <div style={{ ...bar, borderLeft: `3px solid ${pc.bg}` }}>
      <div style={{
        fontSize: isHearing ? 14 : 13, fontWeight: 500,
        color: pc.bg,
      }}>
        {alert.label}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
        {(alert.score * 100).toFixed(0)}% conf
      </div>
    </div>
  );
}
