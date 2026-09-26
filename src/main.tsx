import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Capacitor } from '@capacitor/core'

if (Capacitor.isNativePlatform()) {
  // A WebView serves bundled files locally; an older PWA worker can serve stale pages.
  navigator.serviceWorker?.getRegistrations().then(registrations => {
    registrations.forEach(registration => { void registration.unregister() })
  }).catch(error => console.warn('Service worker cleanup failed:', error))
} else if ('serviceWorker' in navigator) {
  void import('virtual:pwa-register').then(({ registerSW }) => registerSW())
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
