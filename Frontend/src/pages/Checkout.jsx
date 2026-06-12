import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store'
import { orderAPI, paymentAPI } from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import { resolveBackendImageUrl } from '../utils/imageUrl'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, user, clearCart } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    pincode: '',
  })

  const subtotal = cart.reduce((acc, item) => acc + (item.discountedPrice || item.originalNumber) * item.quantity, 0)
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + tax

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login first')
      navigate('/login')
      return
    }

    if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill all delivery details')
      return
    }

    setIsLoading(true)

    try {
      // Create order in database
      const orderResponse = await orderAPI.createOrder({
        name: formData.name,
        userId: user._id,
        products: cart,
        total,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        status: 0, // Pending payment
      })

      const orderId = orderResponse.data._id

      // Create payment order
      const paymentResponse = await paymentAPI.createPaymentOrder({
        amount: total,
        currency: 'INR',
        orderId,
      })

      const paymentConfigResponse = await paymentAPI.getPaymentConfig()

      // Initialize Razorpay
      const razorpayKey = paymentConfigResponse.data?.key || import.meta.env.VITE_RAZORPAY_KEY_ID

      if (!razorpayKey) {
        toast.error('Payment key missing. Please configure VITE_RAZORPAY_KEY_ID.')
        return
      }

      const options = {
        key: razorpayKey,
        amount: paymentResponse.data.amount,
        currency: paymentResponse.data.currency || 'INR',
        name: 'VULPINE',
        description: 'Premium Skincare Products',
        order_id: paymentResponse.data.orderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await paymentAPI.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            })

            if (verifyResponse.data.success) {
              clearCart()
              toast.success('Order placed successfully!')
              navigate(`/order/${orderId}`)
            }
          } catch (error) {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#ec4899',
        },
      }

      if (!window.Razorpay) {
        toast.error('Payment system not available. Please try again.')
        return
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', (response) => {
        const description = response?.error?.description || 'Payment failed'
        toast.error(description)
      })
      razorpay.open()
    } catch (error) {
      const message = error.response?.data?.details || error.response?.data?.message || 'Checkout failed'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <button
              onClick={() => navigate('/products')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-3xl font-bold mb-8">Checkout</h1>

              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="address"
                      placeholder="Street Address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                      <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Summary in Form */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18%):</span>
                      <span>₹{tax.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>₹{total.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-3 pb-4 border-b">
                    <img
                      src={resolveBackendImageUrl(item.img, 'https://via.placeholder.com/60')}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm line-clamp-2">{item.title}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-semibold text-sm text-pink-600 mt-1">
                        ₹{((item.discountedPrice || item.originalNumber) * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span>Tax:</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
