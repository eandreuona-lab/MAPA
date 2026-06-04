'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
  totalComplexes: number;
  totalRooms: number;
  withBoilers: number;
  withHeatPumps: number;
  withChillers: number;
  withPV: number;
}

export function DashboardSummary() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  if (!stats) return null;

  const cards = [
    { label: 'Complejos', value: stats.totalComplexes },
    { label: 'Habitaciones', value: stats.totalRooms },
    { label: 'Con calderas', value: stats.withBoilers },
    { label: 'Con bombas de calor', value: stats.withHeatPumps },
    { label: 'Con plantas enfriadoras', value: stats.withChillers },
    { label: 'Con fotovoltaica', value: stats.withPV },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 mb-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded border border-slate-800 bg-slate-900/60 px-3 py-2 flex flex-col"
        >
          <span className="text-[11px] text-slate-400">{c.label}</span>
          <span className="text-lg font-semibold">{c.value.toLocaleString('es-ES')}</span>
        </div>
      ))}
    </div>
  );
}
