import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Camera, Leaf, Shield, ShieldAlert, Sparkles, Heart } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { productAPI, bannerAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [banner, setBanner] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, bannerRes] = await Promise.all([
          productAPI.getAllProducts({ limit: 6 }),
          bannerAPI.getRandomBanner(),
        ])
        setFeaturedProducts(productsRes.data)
        setBanner(bannerRes.data)
      } catch (error) {
        toast.error('Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-96 md:h-[500px] bg-gradient-to-r from-pink-600 to-orange-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Glow Naturally With Vulpine
            </h1>
            <p className="text-lg text-white mb-8 opacity-90">
              Discover our premium skincare collection crafted with nature's finest ingredients for radiant, healthy skin.
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              Shop Now <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* SkinCycle Highlight */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm uppercase tracking-wide text-pink-600 font-semibold">New: SkinCycle</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-3">
                Smart skin safety report, not just product picks
              </h2>
              <p className="text-gray-600 mt-4 max-w-xl">
                Upload or capture a face photo and get a skin health report that blocks harmful products
                and builds a recovery-first routine based on UV exposure.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                  <Camera size={18} className="text-pink-600" />
                  <span className="text-sm font-semibold">Photo scan</span>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                  <ShieldAlert size={18} className="text-orange-500" />
                  <span className="text-sm font-semibold">Safety blocking</span>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                  <Shield size={18} className="text-emerald-600" />
                  <span className="text-sm font-semibold">Recovery plan</span>
                </div>
              </div>
              <Link to="/skincycle" className="btn-primary inline-flex items-center gap-2 mt-6">
                Open SkinCycle <ArrowRight size={20} />
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Sample report</h3>
                <span className="text-xs uppercase tracking-wide bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                  Safety-first
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  { label: 'Acne', value: 'Moderate' },
                  { label: 'Redness', value: 'High' },
                  { label: 'Oiliness', value: 'Low' },
                  { label: 'Dryness', value: 'Moderate' },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-lg font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-700">Blocked ingredients</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Fragrance', 'Denatured alcohol', 'Strong exfoliants'].map((item) => (
                    <span key={item} className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-pink-100 rounded-full">
                  <Leaf className="text-pink-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Natural Ingredients</h3>
              <p className="text-gray-600">100% natural and organic ingredients</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-pink-100 rounded-full">
                  <Sparkles className="text-pink-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dermatologist Tested</h3>
              <p className="text-gray-600">Clinically proven for all skin types</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-pink-100 rounded-full">
                  <Shield className="text-pink-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cruelty-Free</h3>
              <p className="text-gray-600">No animal testing, vegan options</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-pink-100 rounded-full">
                  <Heart className="text-pink-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Results Guaranteed</h3>
              <p className="text-gray-600">30-day satisfaction guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Featured Products
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              Explore our best-selling skincare products trusted by thousands of customers
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {featuredProducts.slice(0, 6).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="text-center">
                <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                  View All Products <ArrowRight size={20} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Get exclusive offers, skincare tips, and new product launches delivered to your inbox
          </p>
          <div className="flex flex-col md:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none"
            />
            <button className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-lg font-semibold transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
