import { useState } from 'react';
import { useProfile } from '../context/UserProfileContext.jsx';
import { colors, radius, transition } from '../styles/tokens.js';

const PROFILES = [
  {
    id: 'vision',
    title: 'I have low vision',
    description: 'Voice alerts for signs, lanes, and vehicles',
    detail: 'Camera-based detection. Speech output. Minimal visual distractions.',
    accent: colors.teal,
    light: colors.tealLight,
    dark: colors.tealDark,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'hearing',
    title: 'I have hearing loss',
    description: 'Visual banners + vibration for sirens and horns',
    detail: 'Microphone-based detection. No voice output. Bold visual alerts.',
    accent: '#993C1D',
    light: '#FAECE7',
    dark: '#712B13',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3a6 6 0 016 6v4l2.5 2.5V17H3.5v-1.5L6 13V9a6 6 0 016-6z"
              stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M10 20a2 2 0 004 0"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'both',
    title: 'Both',
    description: 'All alerts active — voice, visual, and vibration',
    detail: 'All modules enabled. Smart priority engine handles conflicts.',
    accent: colors.blue,
    light: colors.blueLight,
    dark: colors.blueDark,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4"
              stroke="currentColor" strokeWidth="2"/>
        <path d="M8 12h8M12 8v8"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function ProfileSelect({ onNext, onBack }) {
  const { setProfile } = useProfile();
  const [selected, setSelected] = useState(null);

  const wrap = {
    flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 20px',
  };
  
  const backBtn = {
    alignSelf: 'flex-start', background: 'transparent', border: 'none',
    padding: '0 0 16px 0', color: colors.textSecondary, fontSize: 14,
    display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
  };

  const heading = { fontSize: 22, fontWeight: 600, color: colors.textPrimary, marginBottom: 6 };
  const subhead = { fontSize: 14, color: colors.textSecondary, marginBottom: 24, lineHeight: 1.5 };

  const card = (p) => ({
    border: selected === p.id
      ? `2px solid ${p.accent}`
      : `1px solid ${colors.border}`,
    borderRadius: radius.md,
    padding: '16px',
    marginBottom: 12,
    cursor: 'pointer',
    background: selected === p.id ? p.light : colors.white,
    transition: transition.normal,
    display: 'flex', gap: 14, alignItems: 'flex-start',
  });

  const iconBox = (p) => ({
    width: 44, height: 44, borderRadius: radius.sm, flexShrink: 0,
    background: selected === p.id ? p.accent : colors.surface,
    color: selected === p.id ? colors.white : p.accent,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: transition.normal,
  });

  const btn = {
    width: '100%', padding: '15px', marginTop: 'auto',
    background: selected ? colors.blue : colors.gray200,
    color: selected ? colors.white : colors.gray400,
    border: 'none', borderRadius: radius.md,
    fontSize: 16, fontWeight: 500,
    cursor: selected ? 'pointer' : 'not-allowed',
    transition: transition.fast,
  };

  const handleContinue = () => {
    if (!selected) return;
    setProfile(selected);
    onNext();
  };

  return (
    <div style={wrap}>
      {onBack && (
        <button style={backBtn} onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      )}
      <div style={heading}>What describes you?</div>
      <div style={subhead}>
        This sets up the right alerts and display for you.
        You can change this in settings at any time.
      </div>

      {PROFILES.map(p => (
        <div key={p.id} style={card(p)} onClick={() => setSelected(p.id)}
             role="button" aria-pressed={selected === p.id} tabIndex={0}
             onKeyDown={e => e.key === 'Enter' && setSelected(p.id)}>
          <div style={iconBox(p)}>{p.icon}</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: colors.textPrimary, marginBottom: 2 }}>
              {p.title}
            </div>
            <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>
              {p.description}
            </div>
            {selected === p.id && (
              <div style={{ fontSize: 12, color: p.dark, marginTop: 4 }}>{p.detail}</div>
            )}
          </div>
          {selected === p.id && (
            <div style={{ marginLeft: 'auto', color: p.accent, flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6.5 10l2.5 2.5 4.5-4.5"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
      ))}

      <button style={btn} onClick={handleContinue} disabled={!selected}>
        {selected ? 'Continue' : 'Select a profile to continue'}
      </button>
    </div>
  );
}
