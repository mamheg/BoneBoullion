interface JarProps {
  accent?: string
  className?: string
  title?: string
}

/**
 * Placeholder broth-jar illustration used until real product photography is
 * supplied. The liquid color comes from `product.accent`, so each SKU reads
 * distinctly in the grid.
 */
export function JarIllustration({
  accent = '#E9B84A',
  className = '',
  title,
}: JarProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={title ? `${title} — изображение` : 'Бульон в банке'}
    >
      <defs>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* liquid */}
      <path
        d="M58 78 h84 a8 8 0 0 1 8 8 v74 a20 20 0 0 1 -20 20 H70 a20 20 0 0 1 -20 -20 V86 a8 8 0 0 1 8 -8 Z"
        fill={accent}
      />
      {/* jar glass outline */}
      <path
        d="M58 78 h84 a8 8 0 0 1 8 8 v74 a20 20 0 0 1 -20 20 H70 a20 20 0 0 1 -20 -20 V86 a8 8 0 0 1 8 -8 Z"
        fill="url(#glass)"
        stroke="#2b2a28"
        strokeOpacity="0.16"
        strokeWidth="2.5"
      />
      {/* label */}
      <rect x="68" y="104" width="64" height="44" rx="6" fill="#fffdf7" opacity="0.92" />
      <rect x="78" y="116" width="44" height="5" rx="2.5" fill={accent} />
      <rect x="84" y="128" width="32" height="4" rx="2" fill="#2b2a28" opacity="0.35" />
      <rect x="88" y="137" width="24" height="3.5" rx="1.75" fill="#2b2a28" opacity="0.25" />
      {/* lid */}
      <rect x="64" y="52" width="72" height="30" rx="9" fill="#2b2a28" />
      <rect x="64" y="52" width="72" height="11" rx="6" fill="#3d3b38" />
      {/* steam */}
      <g stroke="#2b2a28" strokeOpacity="0.18" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M86 44 q-6 -8 0 -16 q6 -8 0 -16" />
        <path d="M114 44 q6 -8 0 -16 q-6 -8 0 -16" />
      </g>
    </svg>
  )
}
