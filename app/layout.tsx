import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google"

import "./globals.css"

// Same font stack as scoutgaminggroup.com: Space Grotesk (display), Inter (body), JetBrains Mono (labels/code)
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] })
const body = Inter({ subsets: ["latin"], variable: "--font-body" })
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] })

export const metadata: Metadata = {
  title: "scout/gaming · Croupier Ops",
  description: "Lokal operationsdashboard i Scout Gaming-profil som monterar Croupier Studio från labbservern.",
  robots: { index: false, follow: false },
  generator: "v0.app",
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0A0B0D",
  width: "device-width",
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" className={`dark ${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-scout-ink font-sans text-scout-off antialiased">{children}</body>
    </html>
  )
}
