import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { ThemeStudio } from "@/components/theme-studio/theme-studio"
import { socialMetadata } from "@/lib/og/routes"

const description =
  "Build a Macbetter theme from your brand's colors, check its contrast in light and dark, see it on macOS, iPadOS and iOS, and export it as CSS or TypeScript."

export const metadata: Metadata = {
  title: "Theme Studio",
  description,
  alternates: { canonical: "/themes" },
  ...socialMetadata({ path: "themes", title: "Theme Studio", description }),
}

export default function ThemesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <ThemeStudio />
      </main>
    </>
  )
}
