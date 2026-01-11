import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lystr LeadGen Scout',
  description: 'AI-driven lead generation and qualification for Lystr Energy-as-a-Service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
