'use client';

interface Props {
  query: string;
  onQueryChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  technology: string;
  onTechnologyChange: (v: string) => void;
}

const technologies = [
  '',
  'caldera',
  'termo',
  'bomba de calor',
  'split',
  'vrf',
  'enfriadora',
  'fotovoltaica',
  'solar térmica',
];

export function FiltersBar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  technology,
  onTechnologyChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 items-center mb-3">
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Buscar por nombre, código, ciudad, provincia"
        className="flex-1 min-w-[180px] rounded border border-slate-700 bg-slate-900/70 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded border border-slate-700 bg-slate-900/70 px-2 py-1 text-sm"
      >
        <option value="">Estado: todos</option>
        <option value="ACTIVE">Activos</option>
        <option value="UNDER_RENOVATION">En reforma</option>
        <option value="TEMPORARILY_CLOSED">Cerrados temporalmente</option>
        <option value="INACTIVE">Baja</option>
      </select>
      <select
        value={technology}
        onChange={(e) => onTechnologyChange(e.target.value)}
        className="rounded border border-slate-700 bg-slate-900/70 px-2 py-1 text-sm"
      >
        <option value="">Tecnología: todas</option>
        {technologies.map((t) => (
          <option key={t} value={t}>
            {t || 'Todas las tecnologías'}
          </option>
        ))}
      </select>
    </div>
  );
}
