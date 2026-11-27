import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/be-vietnam-pro/vietnamese-400.css'
import '@fontsource/be-vietnam-pro/vietnamese-500.css'
import '@fontsource/be-vietnam-pro/vietnamese-700.css'
import '@fontsource/be-vietnam-pro/latin-400.css'
import '@fontsource/be-vietnam-pro/latin-500.css'
import '@fontsource/be-vietnam-pro/latin-700.css'
import App from './App'
import './styles.css'
import './glass.css'

// Preserve links shared by the old hash-based prototype without retaining hashes.
if (/^#\/(?!\/)/.test(window.location.hash)) {
  const legacy = new URL(window.location.hash.slice(1), window.location.origin)
  if (legacy.origin === window.location.origin) {
    window.history.replaceState(null, '', legacy.pathname + legacy.search + legacy.hash)
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>,
)
