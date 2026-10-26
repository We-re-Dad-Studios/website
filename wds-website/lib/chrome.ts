// Routes that render without the global site chrome (navbar, Royal Road
// banner, newsletter, footer) — e.g. the link-in-bio page.
const CHROMELESS_ROUTES = new Set(["/links"]);

export function isChromeless(pathname: string | null | undefined): boolean {
  return Boolean(pathname && CHROMELESS_ROUTES.has(pathname));
}
