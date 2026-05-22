import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Craftist Asset Exchange',
  description: 'Invite-only resale system for premium one-use scenic builds, props and event assets.',
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
