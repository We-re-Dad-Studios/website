// Decorative diagonal bands from the Brand Guidelines covers.
// Drawn in Deep Indigo so they read as a tone-on-tone texture on Mystical Indigo.
export const BrandStripes = ({
  className = "",
  color = "#2621A8",
}: {
  className?: string;
  color?: string;
}) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 180 400"
    preserveAspectRatio="none"
    className={`pointer-events-none absolute ${className}`}
  >
    <g fill={color}>
      <polygon points="0,-60 0,-10 180,170 180,120" />
      <polygon points="0,40 0,92 180,272 180,220" />
      <polygon points="0,170 0,196 180,376 180,350" />
    </g>
  </svg>
);
