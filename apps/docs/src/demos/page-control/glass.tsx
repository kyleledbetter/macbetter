"use client"

import { PageControl } from "@dreambase/stardust/page-control"
import { useState } from "react"

const photos = [
  { caption: "Sunrise over Half Dome", background: "linear-gradient(160deg, var(--sd-orange), var(--sd-pink) 60%, var(--sd-indigo))" },
  { caption: "Kelp forest, Monterey", background: "linear-gradient(160deg, var(--sd-mint), var(--sd-teal) 50%, var(--sd-blue))" },
  { caption: "Lavender fields, Valensole", background: "linear-gradient(160deg, var(--sd-purple), var(--sd-indigo) 60%, var(--sd-blue))" },
  { caption: "Aspens in October", background: "linear-gradient(160deg, var(--sd-yellow), var(--sd-orange) 55%, var(--sd-brown))" },
  { caption: "Moss in the rain", background: "linear-gradient(160deg, var(--sd-green), var(--sd-mint) 60%, var(--sd-teal))" },
]

export default function Example() {
  const [page, setPage] = useState(1)
  const photo = photos[page - 1]

  return (
    <figure
      style={{
        position: "relative",
        display: "grid",
        gridTemplateRows: "1fr auto",
        justifyItems: "center",
        margin: 0,
        width: "100%",
        maxWidth: 340,
        aspectRatio: "4 / 5",
        padding: 14,
        borderRadius: 28,
        background: photo.background,
        transition: "background 300ms",
      }}
    >
      <figcaption
        className="sd-text-headline"
        style={{ justifySelf: "start", color: "#fff", textShadow: "0 1px 8px rgb(0 0 0 / 0.3)" }}
      >
        {photo.caption}
      </figcaption>
      <PageControl variant="glass" aria-label="Photos" pageCount={photos.length} page={page} onPageChange={setPage} />
    </figure>
  )
}
