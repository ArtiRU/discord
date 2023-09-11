import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import {ReactNode} from "react";

const inter = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Discord | Your place for communication'
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
