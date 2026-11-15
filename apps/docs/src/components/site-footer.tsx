import Link from "next/link"
import { MacbetterMark } from "@/components/logo"

const repo = "https://github.com/kyleledbetter/macbetter"

const columns = [
  {
    title: "Docs",
    links: [
      { href: "/docs/introduction", label: "Introduction" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/platforms", label: "Platforms" },
      { href: "/docs/theming", label: "Theming" },
      { href: "/docs/agents", label: "Built for agents" },
    ],
  },
  {
    title: "Components",
    links: [
      { href: "/docs/components", label: "All components" },
      { href: "/docs/components/button", label: "Button" },
      { href: "/docs/components/menu", label: "Menu" },
      { href: "/docs/components/sheet", label: "Sheet" },
      { href: "/docs/components/glass", label: "Glass" },
      { href: "/docs/charts/overview", label: "Charts" },
    ],
  },
  {
    title: "Foundations",
    links: [
      { href: "/docs/foundations/color", label: "Color" },
      { href: "/docs/foundations/typography", label: "Typography" },
      { href: "/docs/foundations/web-typography", label: "Web typography" },
      { href: "/docs/foundations/materials", label: "Materials" },
      { href: "/docs/foundations/motion", label: "Motion" },
      { href: "/docs/foundations/accessibility", label: "Accessibility" },
    ],
  },
  {
    title: "Examples",
    links: [
      { href: "/examples", label: "All examples" },
      { href: "/examples/settings", label: "Settings" },
      { href: "/examples/mail", label: "Mail" },
      { href: "/examples/analytics", label: "Analytics" },
      { href: "/examples/music", label: "Music" },
      { href: "/themes", label: "Theme Studio" },
    ],
  },
  {
    title: "Project",
    links: [
      { href: repo, label: "GitHub" },
      { href: `${repo}/issues`, label: "Report an issue" },
      { href: `${repo}/blob/main/LICENSE`, label: "License" },
      { href: "https://ui-sdk.dev", label: "ui-sdk" },
    ],
  },
]

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href}>{children}</Link>
  )
}

/**
 * apple.com's global footer: notes, a breadcrumb, a directory of link columns and
 * a legal line, all in 12px Text. `path` is the breadcrumb after the home mark.
 */
function SiteFooter({ path = [], children }: { path?: string[]; children?: React.ReactNode }) {
  return (
    <footer className="site-footer" data-platform="macos">
      <div className="site-footer-inner">
        {children ? <div className="site-footer-notes">{children}</div> : null}
        <nav aria-label="Breadcrumb" className="site-footer-breadcrumbs">
          <ol>
            <li>
              <Link href="/" aria-label="macbetter home" className="site-footer-home">
                <MacbetterMark size={16} />
              </Link>
            </li>
            {path.map((crumb) => (
              <li key={crumb}>{crumb}</li>
            ))}
          </ol>
        </nav>
        <nav aria-label="Site directory" className="site-footer-directory">
          {columns.map((column) => (
            <div key={column.title} className="site-footer-column">
              <h2 className="site-footer-column-title">{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="site-footer-legal">
          <p>
            Copyright © 2026 <a href="https://github.com/kyleledbetter">Kyle Ledbetter</a>. Apache 2.0. Not affiliated
            with Apple.
          </p>
          <p className="site-footer-legal-links">
            <FooterLink href={repo}>Source</FooterLink>
            <FooterLink href={`${repo}/blob/main/LICENSE`}>License</FooterLink>
            <FooterLink href={`${repo}/blob/main/docs/apple-web-typography.md`}>Type research</FooterLink>
          </p>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
