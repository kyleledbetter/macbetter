"use client"

import { Button, type ButtonProps } from "macbetter/button"
import Link from "next/link"

/**
 * A Macbetter button that navigates. It's a client component because a `render`
 * element has to be created in the browser: one passed from a Server Component
 * can reach ui-sdk before React has resolved it.
 */
function ButtonLink({ href, ...props }: Omit<ButtonProps, "render"> & { href: string }) {
  return <Button render={<Link href={href} />} {...props} />
}

export { ButtonLink }
