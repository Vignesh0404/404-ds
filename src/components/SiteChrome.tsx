import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ElementType, ReactNode } from "react";
import { IconButton } from "./IconButton.js";
import { Sheet } from "./Sheet.js";
import type { SheetTone } from "./Sheet.js";
import { Wordmark } from "./Wordmark.js";
import type { SiteName } from "./Wordmark.js";
import { GitHubIcon, InstagramIcon, MenuIcon } from "./icons.js";

/** The three sites, in the order they are always listed. */
export const FAMILY: Array<{ name: SiteName; href: string }> = [
  { name: "the404labs", href: "https://the404labs.co/" },
  { name: "404shop", href: "https://shop.the404labs.co/" },
  { name: "404games", href: "https://play.the404labs.co/" },
];

const CONTACT_EMAIL = "hello@the404labs.co";

type HomeLink = {
  /** Element or component for the link to this site's own home. Pass a router's Link to avoid a full reload. */
  homeAs?: ElementType;
  /** Props for it: { href: "/" } by default, { to: "/" } for a router Link. */
  homeProps?: Record<string, unknown>;
};

/** Links to the three sites. The current one points at its own home and is marked. */
function FamilyLinks({ site, homeAs: Home = "a", homeProps = { href: "/" }, className }: { site: SiteName; className: string } & HomeLink) {
  return (
    <>
      {FAMILY.map(({ name, href }) =>
        name === site ? (
          <Home key={name} {...homeProps} className={className} aria-current="page">
            {name}
          </Home>
        ) : (
          <a key={name} href={href} className={className}>
            {name}
          </a>
        ),
      )}
    </>
  );
}

// --------------------------------------------------------------- page tone
// The header is mounted once, above the routes, but its colours depend on
// the page beneath it. A page that isn't the site's default tone says so:
//
//   function NotFoundPage() { usePageTone("red"); … }

const PageToneContext = createContext<{ tone: SheetTone | null; setTone: (tone: SheetTone | null) => void } | null>(null);

/** Wrap the app (inside the router) so pages can tell the header their tone. */
export function PageToneProvider({ children }: { children: ReactNode }) {
  const [tone, setTone] = useState<SheetTone | null>(null);
  const value = useMemo(() => ({ tone, setTone }), [tone]);
  return <PageToneContext.Provider value={value}>{children}</PageToneContext.Provider>;
}

/** Declares the tone of the page that calls it, for as long as that page is mounted. */
export function usePageTone(tone: SheetTone) {
  const setTone = useContext(PageToneContext)?.setTone;
  useEffect(() => {
    setTone?.(tone);
    return () => setTone?.(null);
  }, [tone, setTone]);
}

// ------------------------------------------------------------------ header

export type SiteHeaderProps = HomeLink & {
  site: SiteName;
  /**
   * The tone of the page under the header. The bar has no colour of its own:
   * it is transparent, uses this tone's text colour, and fills with this
   * tone's surface once the page has scrolled. A page can override it with
   * usePageTone.
   */
  tone?: SheetTone;
  /** Controls that stay in the bar at every width. Keep it to two: the accessibility button first. */
  controls?: ReactNode;
  /** Further controls: in the bar from 768px, inside the menu below that. */
  secondaryControls?: ReactNode;
  /** This site's own links, listed in the menu under the three sites. */
  menuLinks?: ReactNode;
};

/**
 * The header every site shares. From 768px: the three sites on the left, the
 * wordmark in the centre, controls on the right. Below that: a menu button on
 * the left that opens a panel from the left edge.
 */
export function SiteHeader({ site, tone: defaultTone = "paper", controls, secondaryControls, menuLinks, homeAs: Home = "a", homeProps = { href: "/" } }: SiteHeaderProps) {
  const tone = useContext(PageToneContext)?.tone ?? defaultTone;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Usually the window scrolls. On 404games the page is a full-height
    // element that scrolls inside a fixed viewport, so the listener is on
    // the document in the capture phase (scroll doesn't bubble) and accepts
    // any scroller that is page-sized — which leaves out a sheet's body or a
    // dropdown list, whose scrolling says nothing about the page.
    const onScroll = (e: Event) => {
      const target = e.target;
      if (target === document) {
        setScrolled(window.scrollY > 8);
      } else if (target instanceof HTMLElement && target.clientHeight >= window.innerHeight * 0.8 && !target.closest("[role=dialog]")) {
        setScrolled(target.scrollTop > 8);
      }
    };
    setScrolled(window.scrollY > 8);
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  return (
    <>
      <header className="ds-header" data-tone={tone} data-scrolled={scrolled ? "" : undefined}>
        <div className="ds-header-start">
          <IconButton
            label="Menu"
            tone="ghost"
            className="ds-header-menu-button"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <nav className="ds-header-nav" aria-label="the404labs sites">
            <FamilyLinks site={site} homeAs={Home} homeProps={homeProps} className="ds-nav-link" />
          </nav>
        </div>

        <Home {...homeProps} className="ds-header-wordmark" aria-label={`${site} home`}>
          <Wordmark name={site} />
        </Home>

        <div className="ds-header-end">
          {controls}
          {secondaryControls && <div className="ds-header-secondary">{secondaryControls}</div>}
        </div>
      </header>

      <Sheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        side="left"
        tone={tone}
        title="Menu"
        closeLabel="Close menu"
      >
        {/* Clicking a link closes the menu: with a router the page doesn't
            reload, so nothing else would. */}
        <nav className="ds-menu" aria-label="Menu" onClick={(e) => (e.target as HTMLElement).closest("a") && setMenuOpen(false)}>
          <FamilyLinks site={site} homeAs={Home} homeProps={homeProps} className="ds-menu-link" />
          {menuLinks && <div className="ds-menu-site">{menuLinks}</div>}
        </nav>
        {/* A control here usually opens a sheet of its own; the menu gets out
            of its way first. */}
        {secondaryControls && (
          <div className="ds-menu-controls" onClick={(e) => (e.target as HTMLElement).closest("button, a") && setMenuOpen(false)}>
            {secondaryControls}
          </div>
        )}
      </Sheet>
    </>
  );
}

// ------------------------------------------------------------------ footer

export type SiteFooterProps = HomeLink & {
  site: SiteName;
  /** This site's own links (legal pages, FAQ…), shown as a row above the copyright line. */
  children?: ReactNode;
};

/** The footer every site shares. Always on ink. */
export function SiteFooter({ site, children, homeAs, homeProps }: SiteFooterProps) {
  return (
    <footer className="ds-footer" data-tone="ink">
      <div className="ds-footer-inner">
        <div className="ds-footer-top">
          <Wordmark name="the404labs" className="ds-footer-wordmark" />
          <ul className="ds-footer-social">
            <li>
              <IconButton as="a" label="Instagram" tone="ghost" href="https://www.instagram.com/the404labs_/" target="_blank" rel="noopener noreferrer">
                <InstagramIcon />
              </IconButton>
            </li>
            <li>
              <IconButton as="a" label="GitHub" tone="ghost" href="https://github.com/Vignesh0404" target="_blank" rel="noopener noreferrer">
                <GitHubIcon />
              </IconButton>
            </li>
          </ul>
        </div>

        <div className="ds-footer-bottom">
          <nav className="ds-footer-links" aria-label="the404labs sites">
            <FamilyLinks site={site} homeAs={homeAs} homeProps={homeProps} className="ds-nav-link" />
          </nav>
          {children && (
            <nav className="ds-footer-links" aria-label={`${site} pages`}>
              {children}
            </nav>
          )}
          <p className="ds-footer-note">
            Say hello at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
          <p className="ds-footer-note">© {new Date().getFullYear()} the404labs</p>
        </div>
      </div>
    </footer>
  );
}
