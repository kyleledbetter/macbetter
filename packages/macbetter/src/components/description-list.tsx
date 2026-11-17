import type * as React from "react"
import { join } from "../lib/cx"

type DescriptionListProps = React.ComponentProps<"dl"> & {
  /** `rows` puts each label in a column beside its value; `stacked` puts the label above the value. */
  layout?: "rows" | "stacked"
  size?: "sm" | "md"
}

/** Label and value pairs, on a real `<dl>`. Wrap each pair in a DescriptionItem. */
function DescriptionList({ layout = "rows", size = "md", className, ...props }: DescriptionListProps) {
  return <dl data-layout={layout} data-size={size} className={join("mb-description-list", className)} {...props} />
}

/** One label and its value (or values). A `div`, which is the one wrapper a `<dl>` allows. */
function DescriptionItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-description-item", className)} {...props} />
}

function DescriptionTerm({ className, ...props }: React.ComponentProps<"dt">) {
  return <dt className={join("mb-description-term", className)} {...props} />
}

type DescriptionDetailsProps = React.ComponentProps<"dd"> & {
  /** Sets the value in the monospaced font, for ids, hashes and paths. */
  mono?: boolean
}

function DescriptionDetails({ mono, className, ...props }: DescriptionDetailsProps) {
  return (
    <dd data-mono={mono ? "" : undefined} className={join("mb-description-details", className)} {...props} />
  )
}

export { DescriptionDetails, DescriptionItem, DescriptionList, DescriptionTerm }
export type { DescriptionDetailsProps, DescriptionListProps }
