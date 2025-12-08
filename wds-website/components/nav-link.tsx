import Link from "next/link";

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
    className={`transition outline-none ${
      active === href
        ? "text-purple-500"
        : "text-white hover:text-purple-500"
    }`}
  >
    {label}
  </Link>
);
