import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../store/store'
import { ShoppingCart } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useStore()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please login to view your dashboard</p>
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* User Profile Card */}
          <div className="md:col-span-4 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">0</div>
              <p className="text-gray-600">Total Orders</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">₹0</div>
              <p className="text-gray-600">Total Spent</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">0</div>
              <p className="text-gray-600">Wishlist Items</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">0</div>
              <p className="text-gray-600">Cart Items</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gradient-to-r from-pink-600 to-orange-500 text-white p-4">
                <h3 className="font-semibold">Account</h3>
              </div>
              <nav className="divide-y">
                <a href="#orders" className="block px-4 py-3 hover:bg-gray-50">
                  My Orders
                </a>
                <a href="#profile" className="block px-4 py-3 hover:bg-gray-50">
                  Edit Profile
                </a>
                <a href="#addresses" className="block px-4 py-3 hover:bg-gray-50">
                  Addresses
                </a>
                <a href="#wishlist" className="block px-4 py-3 hover:bg-gray-50">
                  Wishlist
                </a>
                <a href="#settings" className="block px-4 py-3 hover:bg-gray-50">
                  Settings
                </a>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-2">
            {/* Orders Section */}
            <div id="orders" className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">My Orders</h2>
              <div className="text-center py-12">
                <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-4">No orders yet</p>
                <Link to="/products" className="btn-primary inline-block">
                  Start Shopping
                </Link>
              </div>
            </div>

            {/* Profile Section */}
            <div id="profile" className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <p className="text-lg font-semibold">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="text-lg font-semibold">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <p className="text-lg font-semibold">{user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Address</label>
                  <p className="text-lg font-semibold">{user?.address || 'Not provided'}</p>
                </div>
                <button className="btn-primary mt-4">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
