import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'CivicConnect — Smart City Resident Services Portal',
  description:
    'CivicConnect empowers residents to submit civic requests, apply for permits, stay informed with city announcements, and track city analytics — all in one unified portal.',
  keywords: ['smart city', 'civic services', 'resident portal', 'permits', 'city government'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
