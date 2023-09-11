import type { Metadata } from 'next';

import { ClerkProvider } from '@clerk/nextjs';
import { Open_Sans } from 'next/font/google';
import { ReactNode } from 'react';
import '@/styles/globals.css';

const inter = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Discord | Your place for communication',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
