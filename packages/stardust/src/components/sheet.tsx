"use client"

import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerOutlet,
  DrawerTitle,
  DrawerTrigger,
  type SnapPoint,
} from "@ui-sdk/react/drawer"
import * as React from "react"
import { cx, join } from "../lib/cx"

type Detent = "medium" | "large"

const detentPoints: Record<Detent, SnapPoint> = { medium: 0.5, large: 1 }

const SheetContext = React.createContext<{ resizable: boolean; large: boolean; blocking: boolean }>({
  resizable: false,
  large: false,
  blocking: true,
})

type SheetProps = Omit<React.ComponentProps<typeof Drawer>, "side"> & {
  /** `bottom` is the iOS sheet. `start` and `end` are inspectors on iPad and Mac. */
  side?: "bottom" | "top" | "start" | "end"
  /** iOS detents. `["medium", "large"]` rests at half height and drags to full. Ignored when `snapPoints` is set. */
  detents?: Detent[]
}

function Sheet({ side = "bottom", detents, snapPoints, modal = true, children, ...props }: SheetProps) {
  const points = snapPoints ?? detents?.map((detent) => detentPoints[detent])
  const context = React.useMemo(
    () => ({
      resizable: (points?.length ?? 0) > 1,
      large: detents?.includes("large") ?? (points?.some((point) => point === 1) || false),
      // A sheet that leaves the page usable draws no scrim: it would dim the page and swallow presses meant for it.
      blocking: modal === true,
    }),
    [points, detents, modal]
  )
  return (
    <SheetContext.Provider value={context}>
      <Drawer side={side} snapPoints={points} modal={modal} {...props}>
        {children}
      </Drawer>
    </SheetContext.Provider>
  )
}

function SheetTrigger(props: React.ComponentProps<typeof DrawerTrigger>) {
  return <DrawerTrigger {...props} />
}

type SheetContentProps<Payload = unknown> = React.ComponentProps<typeof DrawerContent<Payload>> & {
  /** Shows the grabber on a bottom sheet. With more than one detent it's a button that steps between them. */
  grabber?: boolean
}

function SheetContent<Payload = unknown>({ grabber = true, className, children, ...props }: SheetContentProps<Payload>) {
  const { resizable, large, blocking } = React.useContext(SheetContext)
  return (
    <>
      {blocking ? <DrawerBackdrop className="sd-sheet-backdrop" /> : null}
      <DrawerContent<Payload> data-large={large ? "" : undefined} className={cx("sd-sheet", className)} {...props}>
        {(state) => (
          <>
            {typeof children === "function" ? children(state) : children}
            {/* Last in the DOM so opening focuses the content, not the grabber; it's positioned at the top. */}
            {grabber && state.side === "bottom" ? (
              resizable ? (
                <DrawerHandle aria-label="Resize sheet" className="sd-sheet-grabber" />
              ) : (
                <span aria-hidden="true" className="sd-sheet-grabber" />
              )
            ) : null}
          </>
        )}
      </DrawerContent>
    </>
  )
}

/** The bar across the top: a title with optional leading and trailing buttons. */
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("sd-sheet-header", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DrawerTitle>) {
  return <DrawerTitle className={cx("sd-sheet-title", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof DrawerDescription>) {
  return <DrawerDescription className={cx("sd-sheet-description", className)} {...props} />
}

/** The scrolling area. Dragging it down past its top moves the sheet. */
function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("sd-sheet-body", className)} {...props} />
}

type SheetCloseProps = React.ComponentProps<typeof DrawerClose> & {
  variant?: "default" | "primary"
}

function SheetClose({ variant = "default", className, ...props }: SheetCloseProps) {
  return <DrawerClose data-variant={variant} className={cx("sd-sheet-close", className)} {...props} />
}

/** Wraps the page behind a sheet so it recedes as the sheet rises, as iOS does. */
function SheetOutlet({
  keyframes = { scale: [1, 0.94], borderRadius: ["0px", "12px"] },
  className,
  ...props
}: React.ComponentProps<typeof DrawerOutlet>) {
  return <DrawerOutlet keyframes={keyframes} className={cx("sd-sheet-outlet", className)} {...props} />
}

export { createDrawerController as createSheetController } from "@ui-sdk/react/drawer"
export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOutlet,
  SheetTitle,
  SheetTrigger,
}
export type { Detent, SheetCloseProps, SheetContentProps, SheetProps }
