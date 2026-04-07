import { colors, radius, transition } from '../styles/tokens.js';

export default function WelcomeScreen({ onNext }) {
  const wrap = {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '32px 24px', textAlign: 'center',
  };

  const logoBox = {
    width: 72, height: 72, borderRadius: radius.lg,
    background: colors.blue, display: 'flex',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  };

  const title = {
    fontSize: 28, fontWeight: 600, color: colors.textPrimary,
    marginBottom: 8, letterSpacing: '-0.5px',
  };

  const sub = {
    fontSize: 16, color: colors.teal, fontWeight: 500, marginBottom: 32,
  };

  const body = {
    fontSize: 15, color: colors.textSecondary, lineHeight: 1.7,
    marginBottom: 'auto', maxWidth: 300,
  };

  const badge = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: colors.blueLight, color: colors.blueDark,
    fontSize: 12, fontWeight: 500, padding: '4px 12px',
    borderRadius: radius.pill, marginBottom: 24,
  };

  const btn = {
    width: '100%', padding: '15px', marginTop: 32,
    background: colors.blue, color: colors.white,
    border: 'none', borderRadius: radius.md,
    fontSize: 16, fontWeight: 500,
    transition: transition.fast,
  };

  return (
    <div style={wrap}>
      <div style={badge}>SDG 3 — Health &amp; Well-being</div>
      <div style={logoBox}>
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <circle cx="19" cy="19" r="14" stroke="#fff" strokeWidth="2.5"/>
          <path d="M19 11v9l6 3.5" stroke="#fff" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={title}>DriveSense</div>
      <div style={sub}>Inclusive driving assistant</div>
      <div style={body}>
        Real-time alerts for low-vision and hearing-impaired drivers.
        Powered by on-device AI — no data ever leaves your device.
      </div>
      <button
        style={btn}
        onMouseEnter={e => e.target.style.background = colors.blueDark}
        onMouseLeave={e => e.target.style.background = colors.blue}
        onClick={onNext}
      >
        Get started
      </button>
    </div>
  );
}
