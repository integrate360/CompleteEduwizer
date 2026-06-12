import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster 
      position="top-center"
      toastOptions={{
        style: {
          background: '#14223d',
          color: '#ffffff',
          border: '1px solid rgba(242, 208, 85, 0.3)',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '14px',
          borderRadius: '12px',
          padding: '12px 24px',
        },
        success: {
          iconTheme: {
            primary: '#f2d055',
            secondary: '#14223d',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
    <App />
  </StrictMode>,
)
