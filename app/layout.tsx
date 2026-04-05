import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css'; // Global styles
import MagnifyingCursor from '@/components/MagnifyingCursor';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'HostelNexus | Smart Hostel Management',
  description: 'Hackathon-winning solution for smart hostel management using AI and IoT.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-slate-950 text-slate-50" suppressHydrationWarning>
        <MagnifyingCursor />
        {children}
      </body>
    </html>
  );
}
