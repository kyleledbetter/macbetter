"use client"

import { PageControl } from "macbetter/page-control"
import { useState } from "react"

const photos = [
  { caption: "Sunrise over Half Dome", background: "linear-gradient(160deg, var(--mb-orange), var(--mb-pink) 60%, var(--mb-indigo))" },
  { caption: "Kelp forest, Monterey", background: "linear-gradient(160deg, var(--mb-mint), var(--mb-teal) 50%, var(--mb-blue))" },
  { caption: "Lavender fields, Valensole", background: "linear-gradient(160deg, var(--mb-purple), var(--mb-indigo) 60%, var(--mb-blue))" },
  { caption: "Aspens in October", background: "linear-gradient(160deg, var(--mb-yellow), var(--mb-orange) 55%, var(--mb-brown))" },
  { caption: "Moss in the rain", background: "linear-gradient(160deg, var(--mb-green), var(--mb-mint) 60%, var(--mb-teal))" },
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
        className="mb-text-headline"
        style={{ justifySelf: "start", color: "#fff", textShadow: "0 1px 8px rgb(0 0 0 / 0.3)" }}
      >
        {photo.caption}
      </figcaption>
      <PageControl variant="glass" aria-label="Photos" pageCount={photos.length} page={page} onPageChange={setPage} />
    </figure>
  )
}
