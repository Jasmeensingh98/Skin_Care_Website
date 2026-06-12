import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '../store/store'
import { productAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Star, Heart, ShoppingCart, ArrowLeft } from 'lucide-react'
import { resolveBackendImageUrl } from '../utils/imageUrl'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart, addToWishlist, wishlist } = useStore()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [newReview, setNewReview] = useState({
    star: 5,
    comment: '',
  })
  const fallbackImage = resolveBackendImageUrl('Vulpine.png')

  const isWishlisted = wishlist.some(item => item._id === id)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getProductById(id)
        setProduct(response.data)
      } catch (error) {
        toast.error('Failed to load product')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart({ ...product, quantity })
    toast.success('Added to cart!')
  }

  const handleWishlist = () => {
    addToWishlist(product)
    toast.success('Added to wishlist!')
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    try {
      await productAPI.rateProduct(id, {
        ...newReview,
        name: 'Anonymous',
        postedBy: 'user',
      })
      toast.success('Review added successfully!')
      setNewReview({ star: 5, comment: '' })
      // Refetch product
      const response = await productAPI.getProductById(id)
      setProduct(response.data)
    } catch (error) {
      toast.error('Failed to add review')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const discount = product.originalNumber ? Math.round(((product.originalNumber - product.discountedPrice) / product.originalNumber) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Link to="/products" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-8">
          <ArrowLeft size={20} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Image Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="relative bg-gray-200 rounded-lg h-96 flex items-center justify-center overflow-hidden">
              <img
                src={resolveBackendImageUrl(product.img, fallbackImage)}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
                onError={(event) => {
                  event.currentTarget.src = fallbackImage
                }}
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold">
                  -{discount}%
                </div>
              )}
            </div>

            {product.video && (
              <div className="mt-4">
                <video
                  controls
                  className="w-full rounded-lg h-48 object-cover bg-gray-200"
                >
                  <source src={product.video} type="video/mp4" />
                </video>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="bg-white rounded-lg shadow p-6">
            {product.Brand && (
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                {product.Brand}
              </p>
            )}
            
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

            <p className="text-gray-600 mb-4">{product.desc}</p>

            {/* Rating */}
            {product.ratings && product.ratings.length > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.round(product.ratings[0].star || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.ratings.length} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-pink-600">
                  ₹{product.discountedPrice || product.originalNumber}
                </span>
                {product.originalNumber && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.originalNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Categories & Details */}
            <div className="mb-6 space-y-3">
              {product.categories && product.categories.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">Categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((cat, idx) => (
                      <span key={idx} className="badge-success">{cat}</span>
                    ))}
                  </div>
                </div>
              )}

              {product.skintype && product.skintype.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">Skin Types:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.skintype.map((type, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.concern && product.concern.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">Concerns:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.concern.map((concern, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* In Stock */}
            <div className="mb-6">
              {product.inStock ? (
                <span className="badge-success">In Stock</span>
              ) : (
                <span className="badge-error">Out of Stock</span>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-6 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button
                onClick={handleWishlist}
                className={`px-6 py-2 rounded-lg border transition ${
                  isWishlisted
                    ? 'bg-pink-600 text-white border-pink-600'
                    : 'border-gray-300 text-pink-600 hover:border-pink-600'
                }`}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {product.whatinbox && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What's in the Box</h3>
                <p className="text-gray-700">{product.whatinbox}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

              {product.ratings && product.ratings.length > 0 ? (
                <div className="space-y-6">
                  {product.ratings.map((review, idx) => (
                    <div key={idx} className="pb-6 border-b">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold">{review.name}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < parseInt(review.star) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>

          {/* Add Review */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select
                  value={newReview.star}
                  onChange={(e) => setNewReview({ ...newReview, star: parseInt(e.target.value) })}
                  className="input-field"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                  <option value={4}>⭐⭐⭐⭐ Good</option>
                  <option value={3}>⭐⭐⭐ Average</option>
                  <option value={2}>⭐⭐ Poor</option>
                  <option value={1}>⭐ Terrible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience..."
                  required
                  rows="4"
                  className="input-field"
                ></textarea>
              </div>
              <button type="submit" className="btn-primary w-full">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
