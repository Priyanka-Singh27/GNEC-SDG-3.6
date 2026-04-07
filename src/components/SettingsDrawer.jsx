import { useProfile } from '../context/UserProfileContext.jsx';
import { colors, radius } from '../styles/tokens.js';

export default function SettingsDrawer({ onClose }) {
  const { profile, setProfile, sensitivity, setSensitivity } = useProfile();

  const backdrop = {
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.5)', zIndex: 50,
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
  };

  const drawer = {
    background: colors.white, borderRadius: `${radius.xl} ${radius.xl} 0 0`,
    padding: '20px 20px 32px', maxHeight: '75vh', overflowY: 'auto',
  };

  const handle = {
    width: 40, height: 4, borderRadius: 2,
    background: colors.gray200, margin: '0 auto 20px',
  };

  const heading = { fontSize: 17, fontWeight: 600, marginBottom: 20 };

  const section = { fontSize: 11, fontWeight: 500, color: colors.textTertiary,
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 };

  const row = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 0', borderBottom: `0.5px solid ${colors.borderLight}`,
    fontSize: 14, color: colors.textPrimary,
  };

  const slider = { width: 120 };

  const profileOpts = [
    { id: 'vision',  label: 'Vision assist' },
    { id: 'hearing', label: 'Hearing assist' },
    { id: 'both',    label: 'Full assist' },
  ];

  return (
    <div style={backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={drawer}>
        <div style={handle} />
        <div style={heading}>Settings</div>

        <div style={section}>Profile</div>
        {profileOpts.map(p => (
          <div key={p.id} style={row}>
            <span>{p.label}</span>
            <input type="radio" name="profile" value={p.id}
                   checked={profile === p.id}
                   onChange={() => setProfile(p.id)} />
          </div>
        ))}

        <div style={{ marginTop: 20 }} />
        <div style={section}>Sensitivity</div>
        <div style={row}>
          <div>
            <div>Vision confidence</div>
            <div style={{ fontSize: 11, color: colors.textTertiary }}>
              Higher = fewer false alerts
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="range" min={30} max={90} step={5}
                   value={Math.round(sensitivity.visionThreshold * 100)}
                   style={slider}
                   onChange={e => setSensitivity(s => ({
                     ...s, visionThreshold: e.target.value / 100
                   }))} />
            <span style={{ fontSize: 12, color: colors.textSecondary, minWidth: 28 }}>
              {Math.round(sensitivity.visionThreshold * 100)}%
            </span>
          </div>
        </div>
        <div style={row}>
          <div>
            <div>Audio confidence</div>
            <div style={{ fontSize: 11, color: colors.textTertiary }}>
              Higher = fewer false alerts
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="range" min={40} max={95} step={5}
                   value={Math.round(sensitivity.audioThreshold * 100)}
                   style={slider}
                   onChange={e => setSensitivity(s => ({
                     ...s, audioThreshold: e.target.value / 100
                   }))} />
            <span style={{ fontSize: 12, color: colors.textSecondary, minWidth: 28 }}>
              {Math.round(sensitivity.audioThreshold * 100)}%
            </span>
          </div>
        </div>

        <button
          style={{
            width: '100%', padding: '13px', marginTop: 24,
            background: colors.blue, color: colors.white,
            border: 'none', borderRadius: radius.md,
            fontSize: 15, fontWeight: 500,
          }}
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
}
