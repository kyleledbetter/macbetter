import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "macbetter",
    short_name: "macbetter",
    description: "macOS, iPadOS and iOS. One web framework.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1c13",
    theme_color: "#0a1c13",
    icons: [
      { src: "/icon-192.png", type: "image/png", sizes: "192x192", purpose: "any" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512", purpose: "any" },
      { src: "/icon-maskable-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
  }
}
