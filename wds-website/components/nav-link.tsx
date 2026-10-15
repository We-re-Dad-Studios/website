import Link from "next/link";

// Sits on the Mystical Indigo navbar (desktop bar and mobile menu),
// so colours are fixed rather than theme tokens.
export const NavLink = ({
  href,
  label,
  active,
  onFocus,
}: {
  href: string;
  label: string;
  active: string;
  onFocus?: () => void;
}) => (
  <Link
    href={href}
    prefetch
    onFocus={onFocus}
    aria-current={active === href ? "page" : undefined}
    className={`uppercase tracking-[0.06em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green ${
      active === href ? "text-white" : "text-brand-mist hover:text-white"
    }`}
  >
    {label}
  </Link>
);
