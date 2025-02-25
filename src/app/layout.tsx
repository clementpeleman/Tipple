
import { ThemeToggle } from "@/components/theme-toggle";
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import { cn, constructMetadata } from "@/lib/utils";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { Metadata, Viewport } from "next";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

export const metadata: Metadata = constructMetadata({});

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased w-full mx-auto scroll-smooth"
        )}
      >
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
            <Providers>
              <Toaster />
                {children}
              </Providers>
            <ThemeToggle />
        </NuqsAdapter>
      </body>
    </html>
  );
}
