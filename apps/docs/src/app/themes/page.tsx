import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { ThemeStudio } from "@/components/theme-studio/theme-studio"

export const metadata: Metadata = {
  title: "Theme Studio",
  description:
    "Build a Stardust theme from your brand's colors, check its contrast in light and dark, see it on macOS, iPadOS and iOS, and export it as CSS or TypeScript.",
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
