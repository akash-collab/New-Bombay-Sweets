import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'New Bombay Sweets - Authentic Indian Sweets & Snacks in Dhanbad',
  description: 'New Bombay Sweets offers authentic Indian sweets, Bengali delicacies, fresh snacks, and savory chaat in Dhanbad, Jharkhand. Visit us for traditional taste and quality.',
  keywords: 'Indian sweets, Bengali sweets, mithai, Dhanbad sweets shop, snacks, namkeen, chaat, samosa, kaju katli, gulab jamun, rasgulla',
  authors: [{ name: 'New Bombay Sweets' }],
  openGraph: {
    title: 'New Bombay Sweets - Authentic Indian Sweets in Dhanbad',
    description: 'Experience authentic Indian sweets and savories in Dhanbad. Fresh, traditional, and delicious.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}