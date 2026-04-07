// src/context/UserProfileContext.jsx
import { createContext, useContext, useState } from 'react';

// Profile shapes what loads and how alerts are delivered:
// 'vision'  → COCO-SSD only, voice alerts, calm UI
// 'hearing' → YAMNet only, visual + vibration, bold UI
// 'both'    → all modules, all outputs, priority engine active

const UserProfileContext = createContext(null);

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(null); // null = not yet chosen
  const [sensitivity, setSensitivity] = useState({
    visionThreshold: 0.55,
    audioThreshold:  0.70,
  });

  const isVision  = profile === 'vision'  || profile === 'both';
  const isHearing = profile === 'hearing' || profile === 'both';

  return (
    <UserProfileContext.Provider value={{
      profile, setProfile,
      sensitivity, setSensitivity,
      isVision, isHearing,
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside UserProfileProvider');
  return ctx;
}
