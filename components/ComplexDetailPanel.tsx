'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

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
  url: string;
  title?: string | null;
}

interface ComplexDetail {
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
  latitude: number;
  longitude: number;
  constructionYear?: number | null;
  lastRenovationYear?: number | null;
  director?: string | null;
  technicalManager?: string | null;
  maintenanceManager?: string | null;
  phone?: string | null;
  email?: string | null;
  images: {
    id: number;
    url: string;
    title?: string | null;
  }[];
  installations: Installation[];
}

interface Props {
  complex: ComplexDetail | null;
  onClose: () => void;
}

const statusLabel: Record<string, string> = {
  ACTIVE: 'Activo',
  TEMPORARILY_CLOSED: 'Cerrado temporalmente',
  UNDER_RENOVATION: 'En reforma',
  INACTIVE: 'Baja',
};

export function ComplexDetailPanel({ complex, onClose }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const images = complex?.images ?? [];
  const installations = complex?.installations ?? [];

  const selectedImage =
    selectedImageIndex !== null ? images[selectedImageIndex] ?? null : null;

  const hasMultipleImages = images.length > 1;

  const goPrev = () => {
    if (!images.length || selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
  };

  const goNext = () => {
    if (!images.length || selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      if (event.key === 'Escape') {
        setSelectedImageIndex(null);
      }

      if (event.key === 'ArrowLeft') {
        goPrev();
      }

      if (event.key === 'ArrowRight') {
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, images.length]);

  useEffect(() => {
    setSelectedImageIndex(null);
  }, [complex?.id]);

  if (!complex) return null;

  return (
    <>
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/85"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute left-0 top-[-44px] rounded bg-white/10 px-3 py-1 text-sm text-white backdrop-blur">
                {selectedImageIndex! + 1} / {images.length}
              </div>

              <button
                type="button"
                onClick={() => setSelectedImageIndex(null)}
                className="absolute right-0 top-[-44px] rounded bg-white/10 px-3 py-1 text-sm text-white backdrop-blur hover:bg-white/20"
              >
                Cerrar
              </button>

              <div className="relative flex max-h-[88vh] min-h-[60vh] items-center justify-center overflow-hidden rounded-xl bg-slate-950 shadow-2xl">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title || complex.name}
                  className="max-h-[88vh] w-auto max-w-full object-contain"
                />

                {hasMultipleImages && (
                  <>
                    <button
  type="button"
  onClick={goPrev}
  className="absolute left-4 flex h-16 w-16 items-center justify-center rounded-full bg-black/55 text-4xl font-light text-white backdrop-blur hover:bg-black/75"
>
  ‹
</button>

<button
  type="button"
  onClick={goNext}
  className="absolute right-4 flex h-16 w-16 items-center justify-center rounded-full bg-black/55 text-4xl font-light text-white backdrop-blur hover:bg-black/75"
>
  ›
</button>
                  </>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <div className="text-sm text-slate-200">
                  {selectedImage.title || 'Sin título'}
                </div>
                {hasMultipleImages && (
                  <div className="text-xs text-slate-400">
                    Usa las flechas del teclado para navegar
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <aside className="flex h-full w-full flex-col border-l border-slate-800 bg-slate-950/95 backdrop-blur md:w-96 xl:w-[420px]">
        <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{complex.name}</span>
            <span className="text-[11px] text-slate-400">
              {complex.hotelChain} · {complex.internalCode}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:text-slate-100"
          >
            Cerrar
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-auto p-3">
          {images.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Fotografías
              </h3>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className="group relative h-20 w-32 flex-shrink-0 overflow-hidden rounded border border-slate-800 bg-slate-900"
                  >
                    <Image
                      src={img.url}
                      alt={img.title || complex.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-slate-500">
                Haz clic en una imagen para ampliarla.
              </p>
            </section>
          )}

          <section className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Información general
            </h3>
            <p className="text-xs text-slate-300">
              {complex.address}, {complex.city} ({complex.province}) · {complex.region} ·{' '}
              {complex.country}
            </p>
            <p className="text-xs text-slate-300">Habitaciones: {complex.rooms}</p>
            <p className="text-xs text-slate-300">
              Estado: {statusLabel[complex.status] || complex.status}
            </p>
            <p className="text-[11px] text-slate-400">
              Coordenadas: {complex.latitude.toFixed(5)}, {complex.longitude.toFixed(5)}
            </p>
          </section>

          <section className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Contacto
            </h3>
            {complex.technicalManager && (
              <p className="text-xs text-slate-300">
                Director: {complex.director ?? '—'}
              </p>
            )}
            {complex.maintenanceManager && (
              <p className="text-xs text-slate-300">
                Resp. mantenimiento: {complex.maintenanceManager}
              </p>
            )}
            {(complex.phone || complex.email) && (
              <p className="text-xs text-slate-300">
                {complex.phone && <span className="mr-2">Tel: {complex.phone}</span>}
                {complex.email && <span>Email: {complex.email}</span>}
              </p>
            )}
          </section>

          <section className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Inventario técnico
            </h3>

            <div className="max-h-64 space-y-1 overflow-auto pr-1">
              {installations.map((inst) => (
                <div
                  key={inst.id}
                  className="rounded border border-slate-800 bg-slate-900/60 px-2 py-1"
                >
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{inst.category}</span>
                    <span>{inst.status ?? 'N/D'}</span>
                  </div>

                  <div className="text-xs text-slate-100">
                    {inst.type}
                    {inst.manufacturer ? ` · ${inst.manufacturer}` : ''}
                    {inst.model ? ` ${inst.model}` : ''}
                  </div>

                  <div className="text-[11px] text-slate-400">
                    {inst.powerHeating ? (
                      <span className="mr-2">P calorífica: {inst.powerHeating} kW</span>
                    ) : null}
                    {inst.powerCooling ? (
                      <span className="mr-2">P frigorífica: {inst.powerCooling} kW</span>
                    ) : null}
                    {inst.year ? <span>Año: {inst.year}</span> : null}
                  </div>
                </div>
              ))}

              {installations.length === 0 && (
                <p className="text-xs text-slate-400">Sin instalaciones registradas.</p>
              )}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}