// src/registerSW.ts
import { registerSW } from 'virtual:pwa-register';
import { toast } from 'sonner';

const updateSW = registerSW({
  // Triggered when a new SW is installed and waiting
  onNeedRefresh() {
    toast('Mise à jour disponible', {
      description: 'Une nouvelle version de Facto est prête.',
      action: {
        label: 'Mettre à jour',
        onClick: () => updateSW(true), // skipWaiting() + reload
      },
      duration: 10000,
    });
  },
  // Triggered when the app is fully cached
  onOfflineReady() {
    toast.success('Prêt hors-ligne ✅', { duration: 3000 });
  },

  // Helpful during testing:
  onRegisteredSW(swUrl, registration) {
    console.log('[PWA] SW registered:', swUrl, registration);

    // Check for updates whenever the page becomes visible
    const check = () => {
      // If using vite-plugin-pwa, this triggers an update check
      updateSW();
      // Also ask the Registration to check:
      registration?.update().catch(() => {});
    };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') check();
    });

    // Also poll every 30s while the tab is open (testing only)
    const iv = setInterval(check, 30_000);
    // Optional cleanup (not strictly necessary in SPA root)
    window.addEventListener('beforeunload', () => clearInterval(iv));
  },

  onRegisterError(error) {
    console.error('[PWA] SW register error:', error);
  },
});
