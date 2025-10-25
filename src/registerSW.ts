/// <reference types="vite-plugin-pwa/client" />

import { registerSW } from 'virtual:pwa-register';

// auto updates the service worker when a new version is available
registerSW({
  immediate: true, // or remove if you prefer the default
  onOfflineReady() {
    // optional: toast/snackbar
    console.log('App is ready to work offline');
  },
});
