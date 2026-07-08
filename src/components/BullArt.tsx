type BullArtProps = {
  primary: string;
  secondary: string;
  accent: string;
  className?: string;
};

export function BullArt({ primary, secondary, accent, className }: BullArtProps) {
  const id = primary.replace("#", "");
  return (
    <svg
      viewBox="0 0 320 360"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="55%" stopColor={secondary} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <linearGradient id={`body-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent} />
          <stop offset="50%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="320" height="360" fill={`url(#bg-${id})`} rx="24" />

      {/* horns */}
      <path
        d="M70 130 C40 70, 20 40, 55 55 C75 65, 95 95, 110 125"
        fill="none"
        stroke={accent}
        strokeWidth="14"
        strokeLinecap="round"
        filter={`url(#glow-${id})`}
      />
      <path
        d="M250 130 C280 70, 300 40, 265 55 C245 65, 225 95, 210 125"
        fill="none"
        stroke={accent}
        strokeWidth="14"
        strokeLinecap="round"
        filter={`url(#glow-${id})`}
      />

      {/* head */}
      <ellipse cx="160" cy="190" rx="88" ry="78" fill={`url(#body-${id})`} />
      <ellipse cx="160" cy="210" rx="52" ry="40" fill={secondary} opacity="0.55" />

      {/* eyebrows / visor */}
      <rect x="95" y="160" width="130" height="28" rx="8" fill="#0a0a0a" opacity="0.85" />
      <rect x="100" y="165" width="50" height="16" rx="4" fill={primary} filter={`url(#glow-${id})`} />
      <rect x="170" y="165" width="50" height="16" rx="4" fill={primary} filter={`url(#glow-${id})`} />

      {/* snout grill */}
      <path
        d="M130 230 Q160 255 190 230"
        fill="none"
        stroke={accent}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="145" cy="228" r="5" fill={primary} />
      <circle cx="175" cy="228" r="5" fill={primary} />

      {/* ring */}
      <ellipse
        cx="160"
        cy="268"
        rx="18"
        ry="10"
        fill="none"
        stroke={accent}
        strokeWidth="5"
        filter={`url(#glow-${id})`}
      />

      {/* notched ear marks */}
      <circle cx="78" cy="175" r="14" fill={primary} opacity="0.7" />
      <circle cx="242" cy="175" r="14" fill={primary} opacity="0.7" />

      {/* scan lines */}
      <g opacity="0.12" stroke={accent} strokeWidth="1">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="20" y1={40 + i * 26} x2="300" y2={40 + i * 26} />
        ))}
      </g>
    </svg>
  );
}
