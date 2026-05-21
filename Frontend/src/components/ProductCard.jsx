import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useStore } from '../store/store'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const { addToCart, addToWishlist, wishlist } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const fallbackImage = '/productsimages/Vulpine.png'

  const isWishlisted = wishlist.some(item => item._id === product._id)
  const discount = product.originalNumber ? Math.round(((product.originalNumber - product.discountedPrice) / product.originalNumber) * 100) : 0

  const handleAddToCart = () => {
    setIsLoading(true)
    try {
      addToCart(product)
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWishlist = () => {
    try {
      addToWishlist(product)
      toast.success('Added to wishlist!')
    } catch (error) {
      toast.error('Failed to add to wishlist')
    }
  }

  return (
    <div className="card overflow-hidden group">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-200 h-64">
        <img
          src={product.img || fallbackImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          onError={(event) => {
            event.currentTarget.src = fallbackImage
          }}
        />
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            -{discount}%
          </div>
        )}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 left-4 p-2 rounded-full transition ${
            isWishlisted ? 'bg-pink-600 text-white' : 'bg-white text-pink-600'
          }`}
        >
          <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        {product.Brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.Brand}
          </p>
        )}

        {/* Title */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-pink-600 transition line-clamp-2 mb-2">
            {product.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.desc}
        </p>

        {/* Rating */}
        {product.ratings && product.ratings.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(product.ratings[0].star || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.ratings.length})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-pink-600">
            ₹{product.discountedPrice || product.originalNumber}
          </span>
          {product.originalNumber && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalNumber}
            </span>
          )}
        </div>

        {/* In Stock */}
        <div className="mb-4">
          {product.inStock ? (
            <span className="badge-success">In Stock</span>
          ) : (
            <span className="badge-error">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isLoading}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition ${
            product.inStock
              ? 'btn-primary'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={18} />
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
