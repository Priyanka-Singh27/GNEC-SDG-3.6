import { colors, priorityColors } from '../styles/tokens.js';

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

export default function AlertLog({ alerts, isHearing }) {
  const wrap = {
    flex: 1, overflowY: 'auto', padding: '0 16px 16px',
  };

  const header = {
    fontSize: 11, fontWeight: 500, color: colors.textTertiary,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    padding: '12px 0 8px',
  };

  if (alerts.length === 0) {
    return (
      <div style={{ ...wrap, display: 'flex', alignItems: 'center',
                    justifyContent: 'center' }}>
        <div style={{ fontSize: 13, color: colors.textTertiary, textAlign: 'center' }}>
          No alerts yet. Detection is running.
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={header}>Recent alerts</div>
      {alerts.map(a => {
        const pc = priorityColors[a.priority] ?? priorityColors[1];
        return (
          <div key={a.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 0',
            borderBottom: `0.5px solid ${colors.borderLight}`,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: pc.bg, flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: isHearing ? 15 : 14,
                fontWeight: 500, color: colors.textPrimary,
              }}>
                {a.label}
              </div>
              <div style={{ fontSize: 11, color: colors.textTertiary, marginTop: 1 }}>
                Confidence {(a.score * 100).toFixed(0)}%
              </div>
            </div>
            <div style={{ fontSize: 11, color: colors.textTertiary, flexShrink: 0 }}>
              {timeAgo(a.timestamp)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
