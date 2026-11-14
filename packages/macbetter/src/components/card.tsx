import type * as React from "react"
import { join } from "../lib/cx"

type CardVariant = "grouped" | "elevated" | "material" | "outline"

type CardProps = React.ComponentProps<"div"> & {
  /** `grouped` is a macOS group box or an iOS grouped cell; `material` floats over content. */
  variant?: CardVariant
}

function Card({ variant = "grouped", className, ...props }: CardProps) {
  return <div data-variant={variant} className={join("mb-card", className)} {...props} />
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-card-header", className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={join("mb-card-title", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={join("mb-card-description", className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-card-content", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-card-footer", className)} {...props} />
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
export type { CardProps, CardVariant }
