function StardustMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="sd-mark-a" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8B16D" />
          <stop offset="0.45" stopColor="#F67F01" />
          <stop offset="1" stopColor="#EE5700" />
        </linearGradient>
      </defs>
      <path
        d="M16 1.5c.9 7.6 6.9 13.6 14.5 14.5C22.9 16.9 16.9 22.9 16 30.5 15.1 22.9 9.1 16.9 1.500 16 9.1 15.1 15.1 9.1 16 1.5Z"
        fill="url(#sd-mark-a)"
      />
      <circle cx="25.5" cy="6.5" r="2" fill="#52C6A0" />
      <circle cx="6" cy="25" r="1.25" fill="#44BD8B" />
    </svg>
  )
}

function StardustLogo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <StardustMark size={22} />
      <span className="text-[15px] font-semibold tracking-[-0.02em] text-label">Stardust</span>
    </span>
  )
}

export { StardustLogo, StardustMark }
