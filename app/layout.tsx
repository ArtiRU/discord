import type { Metadata } from 'next';

import { SocketProvider } from '@/providers/socket-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import ModalProvider from '@/providers/modal-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { Open_Sans } from 'next/font/google';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';

const inter = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Discord | Your place for communication',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning lang="en">
        <body className={cn(inter.className, 'bg-white dark:bg-[#313338]')}>
          <ThemeProvider
            storageKey="discord-theme"
            enableSystem={false}
            defaultTheme="dark"
            attribute="class"
          >
            <SocketProvider>
              <ModalProvider />
              {children}
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
