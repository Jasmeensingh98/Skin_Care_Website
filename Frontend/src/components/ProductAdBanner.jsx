import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

const GRADIENTS = {
  coral: 'from-rose-500 via-orange-400 to-amber-400',
  purple: 'from-violet-500 via-fuchsia-500 to-pink-500',
  teal: 'from-teal-500 via-cyan-500 to-sky-500',
  green: 'from-emerald-500 via-green-500 to-lime-400',
  blue: 'from-blue-600 via-indigo-500 to-violet-500',
}

export default function ProductAdBanner({
  title,
  subtitle,
  ctaText = 'Shop Now',
  to = '/products',
  gradient = 'coral',
  image,
  badge,
  compact = false,
}) {
  const gradientClass = GRADIENTS[gradient] || GRADIENTS.coral

  return (
    <Link
      to={to}
      className={`block relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group ${compact ? 'p-6' : 'p-8 md:p-12'}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-95 group-hover:opacity-100 transition-opacity`} />
      {image && (
        <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-2/5 opacity-20 group-hover:opacity-30 transition-opacity">
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="relative z-10 text-white">
        {badge && (
          <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={12} /> {badge}
          </span>
        )}
        <h3 className={`font-bold text-white drop-shadow-sm ${compact ? 'text-xl md:text-2xl' : 'text-2xl md:text-4xl'} mb-1`}>
          {title}
        </h3>
        {subtitle && (
          <p className={`text-white/90 mb-4 ${compact ? 'text-sm' : 'text-lg'}`}>
            {subtitle}
          </p>
        )}
        <span className="inline-flex items-center gap-2 font-semibold text-sm md:text-base bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition w-fit">
          {ctaText}
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  )
}
