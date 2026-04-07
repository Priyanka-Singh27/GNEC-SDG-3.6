import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UserProfileProvider } from './context/UserProfileContext.jsx';
import App from './App.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProfileProvider>
      <App />
    </UserProfileProvider>
  </StrictMode>
);
