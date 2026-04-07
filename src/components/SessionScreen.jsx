import { useRef, useState, useEffect, useCallback } from 'react';
import { useProfile } from '../context/UserProfileContext.jsx';
import { colors, radius, priorityColors } from '../styles/tokens.js';
import { startVisionLoop } from '../modules/visionLoop.js';
import { startAudioLoop } from '../modules/audioLoop.js';
import { speakAlert } from '../output/speechOutput.js';
import { vibrateAlert } from '../output/vibrationOutput.js';
import { ALERT_MESSAGES } from '../constants/alertMessages.js';
import AlertOverlay from './AlertOverlay.jsx';
import AlertLog from './AlertLog.jsx';
import HUDBar from './HUDBar.jsx';
import SettingsDrawer from './SettingsDrawer.jsx';

export default function SessionScreen({ videoRef, micStream, models }) {
  const { isVision, isHearing, profile, sensitivity } = useProfile();
  const sensitivityRef = useRef(sensitivity);
  useEffect(() => { sensitivityRef.current = sensitivity; }, [sensitivity]);

  const canvasRef = useRef(null);
  const visionRef = useRef(null);
  const audioRef  = useRef(null);
  const audioCtxRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [alertLog, setAlertLog] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [vibrationFired, setVibrationFired] = useState(false);

  const handleDispatch = useCallback(({ type, priority, score }) => {
    const label = ALERT_MESSAGES[type] ?? type;
    const alert = { type, priority, score, label, timestamp: Date.now(), id: Math.random() };

    setCurrentAlert(alert);
    setAlertLog(prev => [alert, ...prev].slice(0, 20)); // keep last 20

    // Voice: only in vision or both mode
    if (isVision) speakAlert(type, priority);

    // Vibration + visual: only in hearing or both mode
    if (isHearing) {
      vibrateAlert(type);
      setVibrationFired(true);
      setTimeout(() => setVibrationFired(false), 1500);
    }
  }, [isVision, isHearing]);

  function handleStart() {
    setStarted(true);
    if (isVision && models.coco) {
      visionRef.current = startVisionLoop(
        videoRef.current, canvasRef.current, models.coco, handleDispatch, sensitivityRef
      );
    }
    if (isHearing && models.yamnet && micStream) {
      const { intervalId, audioCtx } = startAudioLoop(
        micStream, models.yamnet, handleDispatch, sensitivityRef
      );
      audioRef.current = intervalId;
      audioCtxRef.current = audioCtx;
    }
  }

  useEffect(() => {
    return () => {
      if (visionRef.current) clearInterval(visionRef.current);
      if (audioRef.current)  clearInterval(audioRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // ── Layout ──
  const wrap = {
    flex: 1, display: 'flex', flexDirection: 'column',
    background: colors.gray900, position: 'relative',
  };

  const feedWrap = {
    position: 'relative', flex: isHearing ? '0 0 200px' : '0 0 280px',
    background: '#000', overflow: 'hidden',
  };

  const bottomPanel = {
    flex: 1, background: colors.white, display: 'flex',
    flexDirection: 'column', overflow: 'hidden',
  };

  const topBar = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 16px', background: colors.gray900,
    borderBottom: `0.5px solid rgba(255,255,255,0.1)`,
  };

  const liveChip = {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 12, color: started ? '#9FE1CB' : colors.gray400,
  };

  const liveDot = {
    width: 7, height: 7, borderRadius: '50%',
    background: started ? colors.teal : colors.gray400,
  };

  const gearBtn = {
    background: 'rgba(255,255,255,0.1)', border: 'none',
    borderRadius: radius.sm, padding: '6px 8px', color: colors.white,
    fontSize: 16, lineHeight: 1,
  };

  const profileChip = {
    fontSize: 11, padding: '3px 10px', borderRadius: radius.pill,
    background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)',
  };

  return (
    <div style={wrap}>
      {/* Camera feed */}
      <div style={feedWrap}>
        <video ref={videoRef} muted playsInline autoPlay
               style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <canvas ref={canvasRef} width={640} height={480}
                style={{ display: 'none' }} />

        {/* Top status bar over feed */}
        <div style={topBar}>
          <div style={liveChip}>
            <div style={liveDot} />
            {started ? 'Active' : 'Ready'}
          </div>
          <div style={profileChip}>
            {profile === 'vision' ? 'Vision assist'
             : profile === 'hearing' ? 'Hearing assist'
             : 'Full assist'}
          </div>
          <button style={gearBtn} onClick={() => setShowSettings(true)}>⚙</button>
        </div>

        {/* Alert overlay — only in hearing or both mode */}
        {isHearing && started && (
          <AlertOverlay
            alert={currentAlert}
            vibrationFired={vibrationFired}
          />
        )}
      </div>

      {/* Bottom panel */}
      <div style={bottomPanel}>
        {!started ? (
          <StartPanel onStart={handleStart} profile={profile} />
        ) : (
          <>
            <HUDBar alert={currentAlert} isHearing={isHearing} />
            <AlertLog
              alerts={alertLog}
              isHearing={isHearing}
              isVision={isVision}
            />
          </>
        )}
      </div>

      {showSettings && (
        <SettingsDrawer onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

function StartPanel({ onStart, profile }) {
  const wrap = {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12,
  };
  const btn = {
    width: '100%', maxWidth: 320, padding: '16px',
    background: colors.blue, color: colors.white,
    border: 'none', borderRadius: radius.md,
    fontSize: 17, fontWeight: 500,
  };
  const note = { fontSize: 12, color: colors.textTertiary, textAlign: 'center', lineHeight: 1.6 };
  return (
    <div style={wrap}>
      <button style={btn} onClick={onStart}>Start DriveSense</button>
      <div style={note}>
        {profile === 'vision' && 'Voice alerts will begin. Keep your volume up.'}
        {profile === 'hearing' && 'Visual alerts and vibration will activate.'}
        {profile === 'both' && 'All alert channels will activate.'}
      </div>
    </div>
  );
}
