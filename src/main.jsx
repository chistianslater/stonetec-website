import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/sora'
import '@fontsource-variable/dm-sans'
import './index.css'
import App from './App.jsx'
import { captureClickIds, persistClickIdsAfterConsent } from './lib/adsClickId.js'

// Google-Ads-Klick-ID festhalten (siehe lib/adsClickId.js) und nach einer
// späteren Zustimmung im selben Besuch nachträglich ablegen.
captureClickIds()
window.addEventListener('cookie-consent:changed', persistClickIdsAfterConsent)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
