import { Roboto } from 'next/font/google';
import './globals.css';
import Sidebar from '@/shared/layout/sidebar/sidebar';
import { Toaster } from '@/shared/ui/toast';
import { QueryProvider } from '@/shared/lib/providers';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap'
});

export const metadata = {
  title: 'Admin CRM | Panel de Administración',
  description:
    'Panel administrativo CRM para la gestión de clientes, tickets, usuarios y soporte técnico',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1
  },
  themeColor: '#6f42c1'
};

// Definimos las páginas que no requieren autenticación
const publicPages = ['/login', '/register', '/forgot-password'];

export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <body className={`${roboto.variable} font-sans antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
