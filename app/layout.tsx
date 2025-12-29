import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendar Application',
  description: 'A comprehensive calendar application for managing events and appointments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
