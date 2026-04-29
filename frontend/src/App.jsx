import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HotelDetailsPage from './pages/HotelDetailsPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import BookingConfirmationPage from './pages/BookingConfirmationPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import MyBookingsPage from './pages/MyBookingsPage'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col bg-transparent">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/hotels/:id" element={<HotelDetailsPage />} />

                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute>
                        <MyBookingsPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/booking-confirmation"
                    element={
                      <ProtectedRoute>
                        <BookingConfirmationPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="Admin">
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
