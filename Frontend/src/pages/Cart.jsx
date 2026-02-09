import { Link } from 'react-router-dom'
import { useStore } from '../store/store'
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Cart() {
  const { cart, removeFromCart, updateCartItem, clearCart } = useStore()

  const subtotal = cart.reduce((acc, item) => acc + (item.discountedPrice || item.originalNumber) * item.quantity, 0)
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + tax

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      toast.success('Item removed from cart')
    } else {
      updateCartItem(productId, newQuantity)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some skincare products to get started!</p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="border-b p-6">
                <h2 className="text-xl font-semibold">
                  {cart.length} Item{cart.length !== 1 ? 's' : ''}
                </h2>
              </div>

              <div className="divide-y">
                {cart.map((item) => (
                  <div key={item._id} className="p-6 flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={item.img || 'https://via.placeholder.com/100'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <Link to={`/product/${item._id}`} className="font-semibold text-gray-800 hover:text-pink-600">
                        {item.title}
                      </Link>
                      {item.Brand && <p className="text-sm text-gray-500 mt-1">{item.Brand}</p>}
                      <div className="mt-2 font-semibold text-gray-900">
                        ₹{item.discountedPrice || item.originalNumber}
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end gap-4">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-600 hover:text-red-700 transition"
                      >
                        <Trash2 size={20} />
                      </button>

                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="font-semibold text-gray-900">
                        ₹{((item.discountedPrice || item.originalNumber) * item.quantity).toFixed(0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t bg-gray-50">
                <button
                  onClick={() => {
                    if (confirm('Clear all items from cart?')) {
                      clearCart()
                      toast.success('Cart cleared')
                    }
                  }}
                  className="text-red-600 hover:text-red-700 text-sm font-semibold"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="h-fit">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full text-center block">
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="btn-outline w-full text-center block mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
