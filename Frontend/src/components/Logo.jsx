export default function Logo() {
  return (
    <svg
      width="45"
      height="45"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-all hover:scale-105"
    >
      {/* Define gradients */}
      <defs>
        <linearGradient id="foxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#F97316', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#EA580C', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Left Ear - Outer */}
      <path
        d="M 25 15 Q 15 8 12 25 Q 15 35 28 30 Q 30 28 28 18 Z"
        fill="url(#foxGradient)"
        stroke="#EA580C"
        strokeWidth="0.5"
      />

      {/* Right Ear - Outer */}
      <path
        d="M 75 15 Q 85 8 88 25 Q 85 35 72 30 Q 70 28 72 18 Z"
        fill="url(#foxGradient)"
        stroke="#EA580C"
        strokeWidth="0.5"
      />

      {/* Left Ear - Inner (Pink) */}
      <path
        d="M 25 18 Q 18 12 16 25 Q 18 32 26 28 Z"
        fill="#FEE2E2"
      />

      {/* Right Ear - Inner (Pink) */}
      <path
        d="M 75 18 Q 82 12 84 25 Q 82 32 74 28 Z"
        fill="#FEE2E2"
      />

      {/* Main Head */}
      <ellipse cx="50" cy="50" rx="35" ry="40" fill="url(#foxGradient)" stroke="#EA580C" strokeWidth="0.8" />

      {/* White Face Area */}
      <ellipse cx="50" cy="58" rx="22" ry="20" fill="#FEF2F2" />

      {/* Left Eye */}
      <circle cx="40" cy="42" r="4" fill="#1F2937" />
      <circle cx="39.5" cy="40.5" r="1.2" fill="white" />

      {/* Right Eye */}
      <circle cx="60" cy="42" r="4" fill="#1F2937" />
      <circle cx="60.5" cy="40.5" r="1.2" fill="white" />

      {/* Nose */}
      <ellipse cx="50" cy="58" rx="3" ry="3.5" fill="#1F2937" />

      {/* Mouth - Elegant curve */}
      <path
        d="M 50 60 Q 46 64 42 62"
        stroke="#D97706"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 50 60 Q 54 64 58 62"
        stroke="#D97706"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left cheek blush */}
      <circle cx="32" cy="55" r="3.5" fill="#FECACA" opacity="0.6" />

      {/* Right cheek blush */}
      <circle cx="68" cy="55" r="3.5" fill="#FECACA" opacity="0.6" />

      {/* Left whiskers */}
      <line x1="15" y1="50" x2="28" y2="48" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <line x1="14" y1="55" x2="28" y2="57" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <line x1="16" y1="62" x2="30" y2="65" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

      {/* Right whiskers */}
      <line x1="85" y1="50" x2="72" y2="48" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <line x1="86" y1="55" x2="72" y2="57" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <line x1="84" y1="62" x2="70" y2="65" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

      {/* Small accent - forehead mark */}
      <path
        d="M 50 22 Q 48 18 50 15"
        stroke="#FEE2E2"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
