import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'

const PROMOS = [
  { code: 'B2G3', text: 'Buy 2 Get 3 Free', color: 'from-rose-500 to-orange-400' },
  { code: 'B3G4', text: 'Buy 3 Get 4 Free', color: 'from-violet-500 to-fuchsia-500' },
  { code: 'B4G5', text: 'Buy 4 Get 5 Free', color: 'from-teal-500 to-cyan-500' },
]

export default function PromoBar() {
  const [closed, setClosed] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  if (closed) return null

  const promo = PROMOS[activeIndex]

  return (
    <div className={`bg-gradient-to-r ${promo.color} text-white text-center py-2.5 px-4 relative shadow-md`}>
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-2">
        <span className="font-semibold drop-shadow-sm">
          {promo.text} [Use Code: <strong className="bg-white/20 px-1.5 py-0.5 rounded">{promo.code}</strong>]
        </span>
        <Link
          to="/products"
          className="underline font-bold hover:no-underline ml-1 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded transition"
        >
          Shop Now
        </Link>
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {PROMOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition ${
              i === activeIndex ? 'bg-white shadow' : 'bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`Promo ${i + 1}`}
          />
        ))}
        <button
          onClick={() => setClosed(true)}
          className="p-1 hover:bg-white/20 rounded ml-2 transition"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
