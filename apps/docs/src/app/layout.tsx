import { StardustScript } from "@dreambase/stardust"
import { Toaster } from "@dreambase/stardust/toast"
import type { Metadata, Viewport } from "next"
import { Geist_Mono } from "next/font/google"
import { AppPreferences } from "@/components/app-preferences"
import "./globals.css"

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://stardust.dreambase.ai"),
  title: { default: "Stardust — macOS, iPadOS and iOS for the web", template: "%s · Stardust" },
  description:
    "Stardust is Dreambase's design system: Apple-grade components for the web, themeable to any brand and built on ui-sdk.",
  applicationName: "Stardust",
  openGraph: { type: "website", siteName: "Stardust", locale: "en_US" },
  twitter: { card: "summary_large_image" },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a1c13" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  viewportFit: "cover",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dreambase"
      data-color-scheme="dark"
      data-scroll-behavior="smooth"
      className={geistMono.variable}
      suppressHydrationWarning
    >
      <body data-stardust="">
        <StardustScript />
        <AppPreferences>
          {children}
          <Toaster />
        </AppPreferences>
      </body>
    </html>
  )
}
