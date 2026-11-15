import { MacbetterScript } from "macbetter"
import { Toaster } from "macbetter/toast"
import type { Metadata, Viewport } from "next"
import { Geist_Mono } from "next/font/google"
import { AppPreferences } from "@/components/app-preferences"
import { EffectsNotice } from "@/components/effects-notice"
import { ogImageUrl, ogSize, tagline } from "@/lib/og/routes"
import "./globals.css"

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://macbetter.dev"),
  title: { default: `macbetter — ${tagline}`, template: "%s · macbetter" },
  description:
    "macbetter is a design system: Apple-grade components for the web, themeable to any brand and built on ui-sdk.",
  applicationName: "macbetter",
  authors: [{ name: "Kyle Ledbetter", url: "https://github.com/kyleledbetter" }],
  creator: "Kyle Ledbetter",
  // Pages without a card of their own (the 404) share the home page's.
  openGraph: { type: "website", siteName: "macbetter", locale: "en_US", images: [{ url: ogImageUrl(""), ...ogSize }] },
  twitter: { card: "summary_large_image", images: [{ url: ogImageUrl(""), ...ogSize }] },
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
      data-theme="ember"
      data-color-scheme="dark"
      data-scroll-behavior="smooth"
      className={geistMono.variable}
      suppressHydrationWarning
    >
      <body data-macbetter="">
        <MacbetterScript />
        <AppPreferences>
          {children}
          <Toaster />
          <EffectsNotice />
        </AppPreferences>
      </body>
    </html>
  )
}
