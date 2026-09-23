import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import { LocationProvider } from './context/LocationContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RoleRoute } from './routes/RoleRoute'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/common/LoadingSpinner'
import ErrorBoundary from './components/common/ErrorBoundary'

// Lazy load pages
const HomePage = lazy(() => import('./pages/public/HomePage'))
const FindPage = lazy(() => import('./pages/public/FindPage'))
const ShopDetailPage = lazy(() => import('./pages/public/ShopDetailPage'))
const BookingPage = lazy(() => import('./pages/public/BookingPage'))
const LoginPage = lazy(() => import('./pages/public/LoginPage'))
const RegisterPage = lazy(() => import('./pages/public/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/public/ForgotPasswordPage'))
const AboutPage = lazy(() => import('./pages/public/AboutPage'))
const HelpPage = lazy(() => import('./pages/public/HelpPage'))
const ResourcesPage = lazy(() => import('./pages/public/ResourcesPage'))
const TermsPage = lazy(() => import('./pages/public/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/public/PrivacyPage'))

// Customer pages
const CustomerDashboard = lazy(() => import('./pages/customer/Dashboard'))
const CustomerAppointments = lazy(() => import('./pages/customer/Appointments'))
const CustomerProfile = lazy(() => import('./pages/customer/Profile'))
const CustomerReviews = lazy(() => import('./pages/customer/Reviews'))

// Barber pages
const BarberDashboard = lazy(() => import('./pages/barber/Dashboard'))
const BarberShop = lazy(() => import('./pages/barber/Shop'))
const BarberServices = lazy(() => import('./pages/barber/Services'))
const BarberSchedule = lazy(() => import('./pages/barber/Schedule'))
const BarberAppointments = lazy(() => import('./pages/barber/Appointments'))
const BarberReviews = lazy(() => import('./pages/barber/Reviews'))

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminBarbers = lazy(() => import('./pages/admin/Barbers'))
const AdminCustomers = lazy(() => import('./pages/admin/Customers'))
const AdminReviews = lazy(() => import('./pages/admin/Reviews'))
const AdminAppointments = lazy(() => import('./pages/admin/Appointments'))

const LoadingFallback = () => <LoadingSpinner fullPage message="Loading..." />

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <LocationProvider>
            <Layout>
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/find" element={<FindPage />} />
                    <Route path="/shops/:id" element={<ShopDetailPage />} />
                    <Route path="/shops/:shopId/book" element={<BookingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/help" element={<HelpPage />} />
                    <Route path="/resources" element={<ResourcesPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />

                    {/* Customer Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                      <Route path="/customer/appointments" element={<CustomerAppointments />} />
                      <Route path="/customer/profile" element={<CustomerProfile />} />
                      <Route path="/customer/reviews" element={<CustomerReviews />} />
                    </Route>

                    {/* Barber Routes */}
                    <Route element={<RoleRoute allowedRoles={['barber']} />}>
                      <Route path="/barber/dashboard" element={<BarberDashboard />} />
                      <Route path="/barber/shop" element={<BarberShop />} />
                      <Route path="/barber/services" element={<BarberServices />} />
                      <Route path="/barber/schedule" element={<BarberSchedule />} />
                      <Route path="/barber/appointments" element={<BarberAppointments />} />
                      <Route path="/barber/reviews" element={<BarberReviews />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<RoleRoute allowedRoles={['admin']} />}>
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/barbers" element={<AdminBarbers />} />
                      <Route path="/admin/customers" element={<AdminCustomers />} />
                      <Route path="/admin/reviews" element={<AdminReviews />} />
                      <Route path="/admin/appointments" element={<AdminAppointments />} />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </Layout>
          </LocationProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  )
}

export default App