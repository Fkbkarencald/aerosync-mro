/** AeroSync MRO brand mark — stylised ascending delta on radar ring. */
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <span className="brand-mark" style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" strokeDasharray="3 2.6" />
        <path d="M12 4.6 L18.4 17.8 L12 14.6 L5.6 17.8 Z" fill="#fff" />
      </svg>
    </span>
  )
}

export function BrandBlock() {
  return (
    <>
      <BrandMark />
      <span className="brand-text">
        <strong>AeroSync</strong>
        <span>MRO</span>
      </span>
    </>
  )
}
