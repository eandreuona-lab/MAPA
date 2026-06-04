import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Ona Hotels',
  description: 'Mapa técnico de los complejos de Ona Hotels',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-16 flex items-center justify-center overflow-hidden">
              <img
                src="/logo_ona1.jpg"
                alt="Ona Hotels"
                className="max-h-full w-auto object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Ona Hotels</span>
              <span className="text-[11px] text-slate-400">
                Mapa técnico de los complejos de Ona Hotels
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-400">Depto. Técnico · Ingeniería · Energía</div>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}