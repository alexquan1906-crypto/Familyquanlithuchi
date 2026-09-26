import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// The app always needs a network connection for Supabase. Retire old PWA workers
// so they cannot reload an auth flow or keep serving a stale application shell.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => { void registration.unregister() })
  }).catch(error => console.warn('Service worker cleanup failed:', error))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
