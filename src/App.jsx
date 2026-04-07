import { useState, useRef } from 'react';
import { useProfile } from './context/UserProfileContext.jsx';
import { useModels } from './hooks/useModels.js';
import { useMediaStream } from './hooks/useMediaStream.js';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import ProfileSelect from './components/ProfileSelect.jsx';
import PermissionsScreen from './components/PermissionsScreen.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import SessionScreen from './components/SessionScreen.jsx';

const SCREENS = ['welcome', 'profile', 'permissions', 'loading', 'session'];

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [currentAlert, setCurrentAlert] = useState(null);
  const { profile } = useProfile();

  const { models, loadProgress, allLoaded, error: modelError } = useModels();
  const { videoRef, micStream, permissionError, ready } = useMediaStream();

  const shell = {
    maxWidth: '480px',
    margin: '0 auto',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  };

  const navigate = (to) => setScreen(to);

  return (
    <div style={shell}>
      {screen === 'welcome' &&
        <WelcomeScreen onNext={() => navigate('profile')} />}
      {screen === 'profile' &&
        <ProfileSelect onNext={() => navigate('permissions')} />}
      {screen === 'permissions' &&
        <PermissionsScreen
          onNext={() => navigate('loading')}
          videoRef={videoRef}
          micStream={micStream}
          permissionError={permissionError}
        />}
      {screen === 'loading' &&
        <LoadingScreen
          loadProgress={loadProgress}
          allLoaded={allLoaded}
          modelError={modelError}
          onReady={() => navigate('session')}
        />}
      {screen === 'session' &&
        <SessionScreen
          videoRef={videoRef}
          micStream={micStream}
          models={models}
          currentAlert={currentAlert}
          setCurrentAlert={setCurrentAlert}
        />}
    </div>
  );
}
