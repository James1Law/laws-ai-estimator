import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Law's AI Voyage Estimator",
  description: 'AI-powered commercial shipping voyage cost estimation tool. Get instant estimates for cargo transport, fuel costs, port fees, and TCE calculations.',
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  )
}
