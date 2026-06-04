# Facility Map – Gestión técnica de complejos hoteleros

Aplicación web GIS basada en Next.js + TypeScript + Tailwind + Mapbox, orientada a departamentos técnicos, de ingeniería, mantenimiento y energía.

## Puesta en marcha rápida

1. Crea una base de datos PostgreSQL con extensión PostGIS y define `DATABASE_URL` en `.env`.
2. Define `NEXT_PUBLIC_MAPBOX_TOKEN` en `.env` con un token válido de Mapbox.
3. Instala dependencias:

```bash
npm install
```

4. Ejecuta migraciones e inicializa Prisma:

```bash
npx prisma migrate dev --name init
```

5. Levanta el entorno de desarrollo:

```bash
npm run dev
```

A partir de aquí puedes cargar complejos (vía Prisma Studio, seeds o API) y visualizarlos en el mapa con filtros, panel de detalle e indicadores globales.
