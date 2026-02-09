import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { productAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Filter, X } from 'lucide-react'

const CATEGORIES = ['skincare', 'makeup', 'sun-care', 'serums', 'moisturizer']
const SKIN_TYPES = ['dry', 'oily', 'combination', 'sensitive', 'normal']
const CONCERNS = ['acne', 'dryness', 'sensitivity', 'aging', 'dullness']

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const parseListParam = (value) => {
    if (!value) return []
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const sortBy = searchParams.get('sort') || 'newest'
  const skinTypes = parseListParam(searchParams.get('skintype'))
  const concerns = parseListParam(searchParams.get('concern'))

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const params = {
          ...(category && { category }),
          ...(search && { search }),
          ...(skinTypes.length > 0 && { skintype: skinTypes.join(',') }),
          ...(concerns.length > 0 && { concern: concerns.join(',') }),
        }
        const response = await productAPI.getAllProducts(params)
        let data = response.data

        // Sort products
        if (sortBy === 'price-low') {
          data = [...data].sort((a, b) => a.discountedPrice - b.discountedPrice)
        } else if (sortBy === 'price-high') {
          data = [...data].sort((a, b) => b.discountedPrice - a.discountedPrice)
        }

        setProducts(data)
      } catch (error) {
        toast.error('Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [category, search, sortBy, skinTypes.join(','), concerns.join(',')])

  const handleCategoryClick = (cat) => {
    const newParams = new URLSearchParams(searchParams)
    if (category === cat) {
      newParams.delete('category')
    } else {
      newParams.set('category', cat)
    }
    setSearchParams(newParams)
  }

  const handleToggleListFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    const existing = parseListParam(newParams.get(key))
    const updated = existing.includes(value)
      ? existing.filter((item) => item !== value)
      : [...existing, value]

    if (updated.length > 0) {
      newParams.set(key, updated.join(','))
    } else {
      newParams.delete(key)
    }

    setSearchParams(newParams)
  }

  const handleClearFilters = () => {
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Our Products</h1>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Categories</h4>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={category === cat}
                        onChange={() => handleCategoryClick(cat)}
                        className="w-4 h-4 text-pink-600"
                      />
                      <span className="ml-2 text-gray-700 capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skin Types */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Skin Type</h4>
                <div className="space-y-2">
                  {SKIN_TYPES.map((type) => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={skinTypes.includes(type)}
                        onChange={() => handleToggleListFilter('skintype', type)}
                        className="w-4 h-4 text-pink-600"
                      />
                      <span className="ml-2 text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Concerns */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Skin Concerns</h4>
                <div className="space-y-2">
                  {CONCERNS.map((concern) => (
                    <label key={concern} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={concerns.includes(concern)}
                        onChange={() => handleToggleListFilter('concern', concern)}
                        className="w-4 h-4 text-pink-600"
                      />
                      <span className="ml-2 text-gray-700 capitalize">{concern}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold mb-3">Price Range</h4>
                <input type="range" className="w-full" min="0" max="5000" />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>₹0</span>
                  <span>₹5000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg">
              <div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 text-gray-700"
                >
                  <Filter size={20} />
                  Filters
                </button>
                <span className="hidden md:block text-gray-600">
                  Showing {products.length} products
                </span>
              </div>

              <select
                value={sortBy}
                onChange={(e) => {
                  const newParams = new URLSearchParams(searchParams)
                  newParams.set('sort', e.target.value)
                  setSearchParams(newParams)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
