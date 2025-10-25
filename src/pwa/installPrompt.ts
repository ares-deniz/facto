// src/pwa/installPrompt.ts
import { toast } from 'sonner';

let deferredPrompt: any = null;

export function setupInstallPrompt() {
  // Chrome/Edge/Android: capture the event and show our own UI
  window.addEventListener('beforeinstallprompt', (e: any) => {
    e.preventDefault();
    deferredPrompt = e;

    toast('Installer Facto ?', {
      description: 'Ajoutez l’app à votre écran d’accueil.',
      action: {
        label: 'Installer',
        onClick: async () => {
          try {
            deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice;
            deferredPrompt = null;

            if (choice?.outcome === 'accepted') {
              toast.success('Installation en cours…', { duration: 2500 });
            } else {
              toast.message('Installation annulée', { duration: 2500 });
            }
          } catch {
            toast.error('Impossible de lancer l’installation');
          }
        },
      },
      duration: 15000, // visible long enough on mobile
    });
  });

  // Fired once the app has been installed
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    toast.success('Facto a été installé ✅', { duration: 3000 });
  });

  // iOS Safari tip (no beforeinstallprompt)
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone =
    (window.matchMedia &&
      window.matchMedia('(display-mode: standalone)').matches) ||
    // old iOS PWA detection
    (navigator as any).standalone;

  if (isIos && !isStandalone) {
    // Show this hint once
    if (!localStorage.getItem('facto_ios_install_tip')) {
      localStorage.setItem('facto_ios_install_tip', '1');
      toast('Ajouter à l’écran d’accueil', {
        description: 'Safari → Partager → “Sur l’écran d’accueil”',
        duration: 12000,
      });
    }
  }
}
