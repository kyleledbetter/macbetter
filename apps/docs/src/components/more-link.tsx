import Link from "next/link"

type MoreLinkProps = Omit<React.ComponentProps<"a">, "href"> & { href: string }

/** apple.com's text link with a chevron: "Learn more ›". External links open in a new tab. */
function MoreLink({ href, className, ...props }: MoreLinkProps) {
  const classes = `more-link ${className ?? ""}`
  if (href.startsWith("http")) return <a href={href} target="_blank" rel="noreferrer" className={classes} {...props} />
  return <Link href={href} className={classes} {...props} />
}

export { MoreLink }
