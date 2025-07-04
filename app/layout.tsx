import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ceará No Grau",
  description: "Seu portal de notícias do Ceará atualizado",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Ceará No Grau" />
        <meta name="keywords" content="notícias, Ceará, política, esportes, economia, tecnologia, saúde, jornal, portal" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          defaultTheme="light"
        >
          {children}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
