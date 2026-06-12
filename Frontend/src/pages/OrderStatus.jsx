import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { orderAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Package, Truck, CheckCircle, Clock, MapPin, Mail, Phone } from 'lucide-react'
import { resolveBackendImageUrl } from '../utils/imageUrl'

const statusSteps = [
  { id: 0, label: 'Pending', icon: Clock },
  { id: 1, label: 'Payment Confirmed', icon: CheckCircle },
  { id: 2, label: 'Processing', icon: Package },
  { id: 3, label: 'Shipped', icon: Truck },
  { id: 4, label: 'Delivered', icon: CheckCircle },
]

export default function OrderStatus() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderAPI.getOrderById(orderId)
        setOrder(response.data)
      } catch (error) {
        toast.error('Failed to load order')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Order Status</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-8">Order Progress</h2>
              
              <div className="space-y-6">
                {statusSteps.map((step, idx) => {
                  const isActive = order.status >= step.id
                  const Icon = step.icon
                  
                  return (
                    <div key={step.id} className="flex items-start">
                      <div className="flex flex-col items-center mr-6">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          <Icon size={24} />
                        </div>
                        {idx < statusSteps.length - 1 && (
                          <div className={`w-1 h-12 my-2 ${
                            order.status > step.id ? 'bg-pink-600' : 'bg-gray-300'
                          }`}></div>
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.label}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {isActive ? '✓ Completed' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.products.map((product, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b last:border-0">
                    <img
                      src={resolveBackendImageUrl(product.img, 'https://via.placeholder.com/80')}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.title}</h3>
                      <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                      <p className="font-semibold text-pink-600 mt-1">
                        ₹{((product.discountedPrice || product.originalNumber) * product.quantity).toFixed(0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="h-fit">
            <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Details</h2>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono text-sm">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold capitalize">
                    {statusSteps[order.status]?.label || 'Unknown'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div>
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="font-semibold">₹{(order.total * 0.85).toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tax</p>
                  <p className="font-semibold">₹{(order.total * 0.15).toFixed(0)}</p>
                </div>
                <div className="text-lg font-bold">
                  <p className="text-sm text-gray-600 mb-2">Total</p>
                  <p>₹{order.total.toFixed(0)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold mb-3">Delivery Address</h3>
                <div className="flex gap-2">
                  <MapPin size={20} className="text-pink-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{order.address}</p>
                </div>
                <div className="flex gap-2">
                  <Phone size={20} className="text-pink-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{order.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Mail size={20} className="text-pink-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{order.email}</p>
                </div>
              </div>
            </div>

            <Link to="/dashboard" className="btn-primary w-full text-center block">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
