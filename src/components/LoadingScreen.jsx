import { useEffect } from 'react';
import { useProfile } from '../context/UserProfileContext.jsx';
import { colors, radius } from '../styles/tokens.js';

export default function LoadingScreen({ loadProgress, allLoaded, modelError, onReady }) {
  const { profile, isVision, isHearing } = useProfile();

  // Auto-advance when all needed models are loaded
  useEffect(() => {
    const visionReady  = !isVision  || loadProgress.coco;
    const hearingReady = !isHearing || loadProgress.yamnet;
    if (visionReady && hearingReady && !modelError) {
      const t = setTimeout(onReady, 600);
      return () => clearTimeout(t);
    }
  }, [loadProgress, isVision, isHearing, modelError, onReady]);

  const wrap = { flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px' };
  const heading = { fontSize: 20, fontWeight: 600, color: colors.textPrimary, marginBottom: 6 };
  const sub = { fontSize: 13, color: colors.textSecondary, marginBottom: 32, lineHeight: 1.5 };

  const barLabel = { fontSize: 13, color: colors.textSecondary, marginBottom: 6 };
  const barWrap = {
    background: colors.surface, borderRadius: radius.pill,
    height: 6, marginBottom: 20, overflow: 'hidden',
  };
  const bar = (filled, accent) => ({
    height: '100%', borderRadius: radius.pill,
    background: filled ? accent : 'transparent',
    width: filled ? '100%' : '0%',
    transition: 'width 0.5s ease',
  });

  const profileLabel = {
    marginTop: 'auto', paddingTop: 20,
    borderTop: `0.5px solid ${colors.borderLight}`,
    fontSize: 12, color: colors.textTertiary, textAlign: 'center',
  };

  const profileName = {
    vision: 'Vision assist', hearing: 'Hearing assist', both: 'Full assist',
  };

  if (modelError) {
    return (
      <div style={wrap}>
        <div style={{ ...heading, color: colors.red }}>Failed to load</div>
        <div style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.6 }}>
          {modelError}
        </div>
        <div style={{ marginTop: 16, fontSize: 13, color: colors.textSecondary }}>
          Check your internet connection and refresh the page. Models are
          cached after first load — future starts will work offline.
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={heading}>Setting up your session</div>
      <div style={sub}>
        Loading AI models. First time takes 10–15 seconds.
        After that, models are cached and load instantly.
      </div>

      {isVision && (
        <>
          <div style={barLabel}>
            {loadProgress.coco ? '✓ ' : ''}Vision model (COCO-SSD)
          </div>
          <div style={barWrap}>
            <div style={bar(loadProgress.coco, colors.teal)} />
          </div>
        </>
      )}

      {isHearing && (
        <>
          <div style={barLabel}>
            {loadProgress.yamnet ? '✓ ' : ''}Audio model (YAMNet)
          </div>
          <div style={barWrap}>
            <div style={bar(loadProgress.yamnet, '#534AB7')} />
          </div>
        </>
      )}

      <div style={{ fontSize: 12, color: colors.textTertiary, marginTop: 8, lineHeight: 1.6 }}>
        Models run entirely on your device. No internet connection needed
        once loaded.
      </div>

      <div style={profileLabel}>
        Profile: <strong style={{ color: colors.blue }}>
          {profileName[profile] || 'Unknown'}
        </strong>
      </div>
    </div>
  );
}
