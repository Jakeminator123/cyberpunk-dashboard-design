import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist_Mono as GeistMono } from "next/font/google"

import "./globals.css"

const geistMono = GeistMono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Croupier Operations · Local Lab Bridge",
  description: "En lokal operationsdashboard som monterar Croupier Studio direkt från labbservern.",
  robots: { index: false, follow: false },
  generator: "v0.app",
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a0a",
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
    <html lang="sv">
      <body className={`${geistMono.className} min-h-screen bg-neutral-950 text-white antialiased`}>{children}</body>
    </html>
  )
}
