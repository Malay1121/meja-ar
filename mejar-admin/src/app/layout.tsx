import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MejaAR Admin - Restaurant Management Dashboard',
  description: 'Manage your restaurant\'s digital presence with MejaAR Admin Panel. Update menu items, customize your brand, and track performance.',
  keywords: ['restaurant management', 'menu management', 'AR dining', 'admin dashboard'],
  authors: [{ name: 'MejaAR Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}