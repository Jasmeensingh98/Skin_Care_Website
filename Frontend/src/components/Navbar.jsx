import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/store'
import { Menu, X, ShoppingCart, Heart, LogOut, User } from 'lucide-react'
import Logo from './Logo'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, user, logout } = useStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Logo />
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              VULPINE
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-pink-600 transition">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-pink-600 transition">
              Products
            </Link>
            <Link to="/skincycle" className="text-gray-700 hover:text-pink-600 transition">
              SkinCycle
            </Link>
            <Link to="/products?category=skincare" className="text-gray-700 hover:text-pink-600 transition">
              Skincare
            </Link>
            <Link to="/products?category=makeup" className="text-gray-700 hover:text-pink-600 transition">
              Makeup
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart size={24} className="text-gray-700 hover:text-pink-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/dashboard" className="text-gray-700 hover:text-pink-600 transition">
                  <User size={24} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-pink-600 transition"
                >
                  <LogOut size={24} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t">
            <Link to="/" className="block py-2 text-gray-700 hover:text-pink-600">
              Home
            </Link>
            <Link to="/products" className="block py-2 text-gray-700 hover:text-pink-600">
              Products
            </Link>
            <Link to="/skincycle" className="block py-2 text-gray-700 hover:text-pink-600">
              SkinCycle
            </Link>
            <Link to="/products?category=skincare" className="block py-2 text-gray-700 hover:text-pink-600">
              Skincare
            </Link>
            <Link to="/products?category=makeup" className="block py-2 text-gray-700 hover:text-pink-600">
              Makeup
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-pink-600">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-gray-700 hover:text-pink-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700 hover:text-pink-600">
                  Login
                </Link>
                <Link to="/register" className="block py-2 text-gray-700 hover:text-pink-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
