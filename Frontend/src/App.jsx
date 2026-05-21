import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { authAPI } from './services/api'
import { useStore } from './store/store'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import OrderStatus from './pages/OrderStatus'
import NotFound from './pages/NotFound'
import SkinCycle from './pages/SkinCycle'
import SkinAnalysis from './pages/SkinAnalysis'
import MySkinReports from './pages/MySkinReports'
import SkinReportDetail from './pages/SkinReportDetail'
import DermatologistPanel from './pages/DermatologistPanel'
import DermatologistReports from './pages/DermatologistReports'
import { Toaster } from 'react-hot-toast'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const setUser = useStore((s) => s.setUser)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await authAPI.getMe()
        setUser(data)
      } catch {
        useStore.getState().logout()
      } finally {
        setIsLoading(false)
      }
    }
    restoreSession()
  }, [setUser])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/order/:orderId" element={<OrderStatus />} />
            <Route path="/skincycle" element={<SkinCycle />} />
            <Route path="/skin-analysis" element={<SkinAnalysis />} />
            <Route path="/my-skin-reports" element={<MySkinReports />} />
            <Route path="/my-skin-reports/:id" element={<SkinReportDetail />} />
            <Route path="/dermatologist" element={<DermatologistPanel />} />
            <Route path="/dermatologist/reports" element={<DermatologistReports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
          }}
        />
      </div>
    </Router>
  )
}

export default App
