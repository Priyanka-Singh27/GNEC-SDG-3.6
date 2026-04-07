import { useEffect, useState } from 'react';
import { priorityColors, colors, radius } from '../styles/tokens.js';

const ICONS = {
  'siren': (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 4l10 18H4L14 4z" stroke="currentColor"
            strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M14 12v5M14 20v1" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'horn': (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M8 10h4l8-4v16l-8-4H8V10z"
            stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M22 10a6 6 0 010 8" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'default': (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M14 9v6M14 18v1" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

export default function AlertOverlay({ alert, vibrationFired }) {
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState(null);

  useEffect(() => {
    if (!alert) return;
    setDisplayed(alert);
    setVisible(true);
    const duration = alert.priority === 3 ? 5000 : 3000;
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [alert?.id]);

  if (!visible || !displayed) return null;

  const pc = priorityColors[displayed.priority] ?? priorityColors[1];
  const icon = ICONS[displayed.type] ?? ICONS['default'];

  const overlay = {
    position: 'absolute', top: 0, left: 0, right: 0,
    background: pc.bg, padding: '14px 16px',
    display: 'flex', alignItems: 'center', gap: 12,
    zIndex: 10,
    animation: 'slideDown 0.2s ease',
  };

  const iconWrap = {
    color: pc.text, flexShrink: 0,
    width: 44, height: 44,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.15)', borderRadius: radius.sm,
  };

  const labelStyle = {
    fontSize: displayed.priority === 3 ? 18 : 16,
    fontWeight: 600, color: pc.text, lineHeight: 1.2,
  };

  const subStyle = { fontSize: 12, color: pc.text, opacity: 0.85, marginTop: 3 };

  return (
    <>
      <style>{`@keyframes slideDown{from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      <div style={overlay}>
        <div style={iconWrap}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>{displayed.label}</div>
          <div style={subStyle}>
            Conf: {(displayed.score * 100).toFixed(0)}%
            {vibrationFired && ' · Vibration fired'}
          </div>
        </div>
        {displayed.priority === 3 && (
          <div style={{ color: pc.text, fontSize: 24, opacity: 0.8 }}>!</div>
        )}
      </div>
    </>
  );
}
