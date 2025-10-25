import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './registerSW';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { setupInstallPrompt } from './pwa/installPrompt';

setupInstallPrompt();

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
