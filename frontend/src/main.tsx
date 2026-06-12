import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary'
import { SeoProvider } from './seo/SeoContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <SeoProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </SeoProvider>
    </HelmetProvider>
  </StrictMode>,
)
