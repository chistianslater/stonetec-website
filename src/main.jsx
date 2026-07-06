import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/sora'
import '@fontsource-variable/dm-sans'
import './index.css'
import App from './App.jsx'
import { initContactTracking } from './lib/track.js'

initContactTracking()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
