import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Animated 3D Login — NTDESWEB FX',
  description: 'Pantalla de acceso interactiva con personaje 3D en Next.js, React Three Fiber y GSAP.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen overflow-x-hidden bg-[#07060b] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
