import { Link } from 'react-router-dom'
import { Mail, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#2d2d2d] text-gray-300 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">VULPINE</h3>
            <p className="text-sm text-gray-400 max-w-xs">
              High-performing skincare. Visible results from the first use.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition">All Products</Link></li>
              <li><Link to="/products?category=skincare" className="hover:text-white transition">Skincare</Link></li>
              <li><Link to="/products?category=serums" className="hover:text-white transition">Serums</Link></li>
              <li><Link to="/products?category=sun-care" className="hover:text-white transition">Sun Care</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Help
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="hover:text-white transition">My Orders</Link></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Stay in touch
            </h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </div>
            <a href="mailto:support@vulpine.com" className="flex items-center gap-2 mt-3 text-sm text-gray-400 hover:text-white transition">
              <Mail size={16} />
              support@vulpine.com
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} Vulpine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
