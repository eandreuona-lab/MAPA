'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ComplexOnMap } from '../components/MapView';
import { DashboardSummary } from '../components/DashboardSummary';
import { FiltersBar } from '../components/FiltersBar';
import { ComplexDetailPanel } from '../components/ComplexDetailPanel';

const DynamicMapView = dynamic(
  () => import('../components/MapView').then((m) => m.MapView),
  { ssr: false }
);

interface Installation {
  id: number;
  category: string;
  type: string;
  manufacturer?: string | null;
  model?: string | null;
  powerHeating?: number | null;
  powerCooling?: number | null;
  year?: number | null;
  status?: string | null;
}

interface ComplexImage {
  id: number;
  url: string | null;
  title?: string | null;
}

interface ComplexApi {
  id: number;
  name: string;
  internalCode: string;
  hotelChain: string;
  address: string;
  city: string;
  province: string;
  region: string;
  country: string;
  rooms: number;
  status: string;
  latitude: number | null;
  longitude: number | null;
  constructionYear?: number | null;
  lastRenovationYear?: number | null;
  director?: string | null;
  maintenanceManager?: string | null;
  phone?: string | null;
  email?: string | null;
  images: ComplexImage[];
  installations: Installation[];
}

export default function HomePage() {
  const [complexes, setComplexes] = useState<ComplexApi[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [technology, setTechnology] = useState('');

  const fetchData = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (status) params.set('status', status);
    if (technology) params.set('technology', technology);

    fetch('/api/complexes?' + params.toString())
      .then((r) => r.json())
      .then((data) => setComplexes(data.complexes ?? []))
      .catch(() => setComplexes([]));
  }, [query, status, technology]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const complexesOnMap: ComplexOnMap[] = useMemo(
    () =>
      complexes
        .filter(
          (c) =>
            c.latitude !== null &&
            c.longitude !== null &&
            !Number.isNaN(Number(c.latitude)) &&
            !Number.isNaN(Number(c.longitude))
        )
        .map((c) => ({
          id: c.id,
          name: c.name,
          latitude: Number(c.latitude),
          longitude: Number(c.longitude),
          rooms: c.rooms ?? 0,
          city: c.city,
          province: c.province,
          mainImage: c.images?.[0]?.url ?? undefined,
        })),
    [complexes]
  );

  const selected = useMemo(
    () => complexes.find((c) => c.id === selectedId) ?? null,
    [complexes, selectedId]
  );

    const selectedDetail = useMemo(
    () =>
      selected &&
      selected.latitude !== null &&
      selected.longitude !== null
        ? {
            ...selected,
            latitude: selected.latitude,
            longitude: selected.longitude,
            images: selected.images
              .filter(
                (image): image is ComplexImage & { url: string } =>
                  image.url !== null
              )
              .map((image) => ({
                ...image,
                url: image.url,
              })),
          }
        : null,
    [selected]
  );

  useEffect(() => {
    if (selectedId && !complexes.some((c) => c.id === selectedId)) {
      setSelectedId(null);
    }
  }, [complexes, selectedId]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-3 pt-3">
        <DashboardSummary />
        <FiltersBar
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
          technology={technology}
          onTechnologyChange={setTechnology}
        />
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="min-h-0 flex-1">
          <DynamicMapView
            complexes={complexesOnMap}
            onSelect={(id) => setSelectedId(id)}
          />
        </div>

        <ComplexDetailPanel
          complex={selectedDetail}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
}