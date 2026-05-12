import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Cloud-Lift | Plataforma de Despliegue Moderna',
  description: 'Despliega y gestiona tus aplicaciones web con facilidad. La plataforma en la nube pensada para desarrolladores.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased text-slate-300 bg-[#020617]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
