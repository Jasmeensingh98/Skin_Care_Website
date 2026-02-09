import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf9f7] to-gray-100">
      <div className="text-center">
        <AlertCircle size={64} className="mx-auto text-[#c45c3e] mb-4" />
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">Page Not Found</p>
        <p className="text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary inline-block">
          Go Home
        </Link>
      </div>
    </div>
  )
}
