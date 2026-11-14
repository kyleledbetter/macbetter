"use client"

import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import * as React from "react"
import { cx, join } from "../lib/cx"

/**
 * The scroll view a navigation bar belongs to. Its scroll position drives the
 * bar: the material fades in and a large title collapses as content passes under.
 */
function NavigationStack({ className, ref: forwardedRef, ...props }: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement)

  React.useEffect(() => {
    const stack = ref.current
    if (!stack || (typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()"))) return
    // Browsers without scroll-driven animations (Safari before 26) get the same states from a scroll listener.
    let frame = 0
    const update = () => {
      frame = 0
      const large = stack.querySelector<HTMLElement>(".sd-navigation-bar-large-title")
      // A hidden panel lays the title out at 0px; never call that "scrolled".
      const threshold = Math.max(1, large ? large.offsetHeight - 8 : 1)
      stack.style.setProperty("--sd-navigation-offset", `${Math.max(0, stack.scrollTop)}px`)
      stack.toggleAttribute("data-scrolled", stack.scrollTop > threshold)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    stack.addEventListener("scroll", schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      stack.removeEventListener("scroll", schedule)
    }
  }, [])

  return <div {...props} ref={ref} className={join("sd-navigation-stack", className)} />
}

type NavigationBarProps = Omit<React.ComponentProps<"div">, "title"> & {
  title?: React.ReactNode
  /** Shows the title large below the bar, collapsing into the bar as content scrolls. */
  largeTitle?: boolean
  /** The level of the screen's title heading. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

function NavigationBar({
  title,
  largeTitle,
  headingLevel = 1,
  className,
  children,
  ...props
}: NavigationBarProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <>
      <div
        data-large-title={largeTitle ? "" : undefined}
        className={join("sd-navigation-bar", className)}
        {...props}
      >
        {title && largeTitle ? (
          <div aria-hidden="true" data-large-title="" className="sd-navigation-bar-title">
            {title}
          </div>
        ) : title ? (
          <Heading className="sd-navigation-bar-title">{title}</Heading>
        ) : null}
        {children}
      </div>
      {largeTitle && title ? <Heading className="sd-navigation-bar-large-title">{title}</Heading> : null}
    </>
  )
}

function NavigationBarLeading({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("sd-navigation-bar-leading", className)} {...props} />
}

function NavigationBarTrailing({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("sd-navigation-bar-trailing", className)} {...props} />
}

type NavigationBarBackButtonProps = Omit<React.ComponentProps<typeof ButtonPrimitive>, "children"> & {
  children?: React.ReactNode
}

/** The back button: a chevron and the previous screen's title. */
function NavigationBarBackButton({ className, children, ...props }: NavigationBarBackButtonProps) {
  return (
    <ButtonPrimitive className={cx("sd-navigation-bar-back", className)} {...props}>
      <svg viewBox="0 0 12 21" aria-hidden="true" className="sd-navigation-bar-back-chevron">
        <path d="M10 1.5 2 10.5l8 9" />
      </svg>
      <span className="sd-navigation-bar-back-label">{children}</span>
    </ButtonPrimitive>
  )
}

export { NavigationBar, NavigationBarBackButton, NavigationBarLeading, NavigationBarTrailing, NavigationStack }
export type { NavigationBarBackButtonProps, NavigationBarProps }
