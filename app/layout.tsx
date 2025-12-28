import type { Metadata } from 'next'
import './globals.css'
import { ReduxProvider } from '@/components/providers/ReduxProvider'

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Admin Panel',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
