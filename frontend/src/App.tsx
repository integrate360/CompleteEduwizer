import './App.css'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import SiteHeader from './components/SiteHeader'
import { MarketingFooter } from './components/SiteFooter'
import { NewsletterDark } from './components/Newsletter'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ProfilePage from './pages/ProfilePage'
import SearchPage from './pages/SearchPage'
import DetailPage from './pages/DetailPage'
import TermsPage from './pages/TermsPage'
import { ForgotPasswordPage, SetNewPasswordPage } from './pages/ForgotPasswordPage'
import { AuthProvider, RequireAuth } from './auth/AuthContext'

/** Scrolls to top (or to the #hash target) on every route change. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <NewsletterDark />
      <MarketingFooter />
    </>
  )
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route
            path="/home"
            element={<MarketingLayout><HomePage /></MarketingLayout>}
          />
          <Route
            path="/events-blogs"
            element={<MarketingLayout><EventsPage /></MarketingLayout>}
          />
          <Route
            path="/contact-us"
            element={<MarketingLayout><ContactPage /></MarketingLayout>}
          />
          <Route
            path="/about-us"
            element={<MarketingLayout><AboutPage /></MarketingLayout>}
          />
          <Route
            path="/login"
            element={<MarketingLayout><LoginPage /></MarketingLayout>}
          />
          <Route
            path="/register/:type"
            element={<MarketingLayout><SignUpPage /></MarketingLayout>}
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <MarketingLayout><ProfilePage /></MarketingLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/forgot-password"
            element={<MarketingLayout><ForgotPasswordPage /></MarketingLayout>}
          />
          <Route
            path="/setNewPassword/:token"
            element={<MarketingLayout><SetNewPasswordPage /></MarketingLayout>}
          />
          <Route
            path="/infrastructure-search/:preference"
            element={
              <RequireAuth>
                <MarketingLayout><SearchPage userType="vendor" /></MarketingLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/career-counselling/:preference"
            element={
              <RequireAuth>
                <MarketingLayout><SearchPage userType="counseller" /></MarketingLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/candidate"
            element={
              <RequireAuth>
                <MarketingLayout><SearchPage userType="candidate" /></MarketingLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/events-details/:id"
            element={<MarketingLayout><DetailPage kind="event" /></MarketingLayout>}
          />
          <Route
            path="/blogs-details/:id"
            element={<MarketingLayout><DetailPage kind="blog" /></MarketingLayout>}
          />
          <Route
            path="/terms-conditions"
            element={<MarketingLayout><TermsPage /></MarketingLayout>}
          />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  )
}

export default App
