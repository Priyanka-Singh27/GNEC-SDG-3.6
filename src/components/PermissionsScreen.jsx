import { useState } from 'react';
import { useProfile } from '../context/UserProfileContext.jsx';
import { colors, radius, transition } from '../styles/tokens.js';

export default function PermissionsScreen({ onNext, permissionError }) {
  const { isVision, isHearing } = useProfile();
  const [granting, setGranting] = useState(false);
  const [granted, setGranted] = useState(false);
  const [error, setError] = useState(permissionError || null);

  const handleGrant = async () => {
    setGranting(true);
    setError(null);
    try {
      // Request both streams regardless of profile
      // (mic is needed for hearing, camera for vision)
      const constraints = {
        video: isVision ? { width: 640, height: 480, facingMode: 'environment' } : false,
        audio: isHearing ? { sampleRate: 16000, channelCount: 1 } : false,
      };
      // Always request both in 'both' mode
      if (!constraints.video && !constraints.audio) {
        constraints.video = { width: 640, height: 480 };
        constraints.audio = true;
      }
      await navigator.mediaDevices.getUserMedia(constraints);
      setGranted(true);
      setTimeout(onNext, 800); // brief success pause
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Permission denied. Please allow camera and microphone access in your browser settings, then refresh.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera or microphone found on this device.');
      } else {
        setError(err.message);
      }
    } finally {
      setGranting(false);
    }
  };

  const wrap = { flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 20px' };
  const heading = { fontSize: 22, fontWeight: 600, color: colors.textPrimary, marginBottom: 6 };
  const sub = { fontSize: 14, color: colors.textSecondary, marginBottom: 28, lineHeight: 1.5 };

  const permRow = {
    display: 'flex', alignItems: 'flex-start', gap: 14,
    padding: '14px 0', borderBottom: `0.5px solid ${colors.borderLight}`,
  };

  const dot = (required) => ({
    width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 4,
    background: required ? colors.teal : colors.gray400,
  });

  const badge = (required) => ({
    fontSize: 11, fontWeight: 500, padding: '2px 8px',
    borderRadius: radius.pill, marginLeft: 'auto', flexShrink: 0,
    background: required ? colors.tealLight : colors.surface,
    color: required ? colors.tealDark : colors.textSecondary,
  });

  const privacyBox = {
    background: colors.amberLight, borderRadius: radius.sm,
    padding: '12px 14px', marginTop: 20,
    fontSize: 12, color: colors.amberDark, lineHeight: 1.6,
  };

  const errorBox = {
    background: '#FCEBEB', borderRadius: radius.sm,
    padding: '12px 14px', marginTop: 16,
    fontSize: 13, color: colors.redDark, lineHeight: 1.5,
  };

  const btn = {
    width: '100%', padding: '15px', marginTop: 'auto',
    background: granted ? colors.teal : granting ? colors.gray400 : colors.blue,
    color: colors.white, border: 'none', borderRadius: radius.md,
    fontSize: 16, fontWeight: 500, transition: transition.fast,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  };

  const perms = [
    {
      icon: '📷', title: 'Camera', desc: 'Detects signs, lanes, vehicles',
      required: isVision || true, show: true,
    },
    {
      icon: '🎙️', title: 'Microphone', desc: 'Detects sirens and car horns',
      required: isHearing || true, show: true,
    },
    {
      icon: '📳', title: 'Vibration', desc: 'Haptic alerts (hearing mode)',
      required: false, show: true,
      note: 'Auto-enabled — no prompt needed',
    },
  ];

  return (
    <div style={wrap}>
      <div style={heading}>Allow access</div>
      <div style={sub}>
        DriveSense needs these to detect road hazards.
        Nothing is recorded or stored — all processing is on your device.
      </div>

      {perms.filter(p => p.show).map(p => (
        <div key={p.title} style={permRow}>
          <div style={dot(p.required)} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: colors.textPrimary }}>
              {p.title}
            </div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
              {p.note || p.desc}
            </div>
          </div>
          <div style={badge(p.required)}>
            {p.required ? 'Required' : 'Auto'}
          </div>
        </div>
      ))}

      <div style={privacyBox}>
        <strong>Your privacy:</strong> All AI inference runs locally on this
        device using TensorFlow.js. No video, audio, or location data is ever
        sent to any server.
      </div>

      {error && <div style={errorBox}>{error}</div>}

      <div style={{ marginTop: 'auto', paddingTop: 20 }}>
        <button style={btn} onClick={handleGrant} disabled={granting || granted}>
          {granted ? '✓ Access granted — continuing...'
           : granting ? 'Requesting access...'
           : 'Grant access'}
        </button>
        <div style={{ fontSize: 11, color: colors.textTertiary, textAlign: 'center', marginTop: 10 }}>
          Your browser will show a permission dialog.
        </div>
      </div>
    </div>
  );
}
