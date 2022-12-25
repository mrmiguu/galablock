import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { EngineProvider } from './Engine'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <>
    <EngineProvider>
      <App />
    </EngineProvider>
    <Toaster />
  </>,
  // </React.StrictMode>,
)
