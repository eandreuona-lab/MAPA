const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const path = require('path');

const prisma = new PrismaClient();
const filePath = path.join(__dirname, '..', 'plantilla_complejos_instalaciones.xlsx');

function clean(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
}

function toFloat(v) {
  const s = clean(v);
  if (!s) return null;
  const n = Number(String(s).replace(',', '.'));
  return Number.isNaN(n) ? null : n;
}

function toInt(v) {
  const s = clean(v);
  if (!s) return null;
  const n = parseInt(Number(s), 10);
  return Number.isNaN(n) ? null : n;
}

function mapStatus(v) {
  const s = String(clean(v) || '').toUpperCase();
  if (s.includes('RENOV')) return 'UNDER_RENOVATION';
  if (s.includes('TEMP')) return 'TEMPORARILY_CLOSED';
  if (s.includes('INACT')) return 'INACTIVE';
  return 'ACTIVE';
}

function mapCategory(v) {
  const s = String(clean(v) || '').toUpperCase();
  if (['DHW', 'HVAC', 'COOLING', 'VENTILATION', 'RENEWABLE'].includes(s)) return s;
  return null;
}

async function main() {
  const wb = XLSX.readFile(filePath);

  const complexesSheet = wb.Sheets['Complejos'];
  const installationsSheet = wb.Sheets['Instalaciones'];

  if (!complexesSheet || !installationsSheet) {
    throw new Error('No se encontraron las hojas "Complejos" e "Instalaciones"');
  }

  const complexRows = XLSX.utils.sheet_to_json(complexesSheet, { defval: null });
  const installationRows = XLSX.utils.sheet_to_json(installationsSheet, { header: 1, defval: null, blankRows: false });

  const complexes = [];
  const installations = [];

  for (const row of complexRows) {
    const internalCode = clean(row.internalCode);
    const name = clean(row.name);

    if (!internalCode || !name) continue;

    complexes.push({
      externalId: clean(row.externalId),
      internalCode,
      name,
      hotelChain: clean(row.hotelChain),
      address: clean(row.address),
      city: clean(row.city),
      province: clean(row.province),
      region: clean(row.region),
      country: clean(row.country),
      latitude: toFloat(row.latitude),
      longitude: toFloat(row.longitude),
      rooms: toInt(row.rooms),
      constructionYear: toInt(row.constructionYear),
      lastRenovationYear: toInt(row.lastRenovationYear),
      status: mapStatus(row.status),
      director: clean(row.Director),
      maintenanceManager: clean(row.maintenanceManager),
      phone: clean(row.phone),
      email: clean(row.email),
    });
  }

  for (let i = 1; i < installationRows.length; i++) {
    const r = installationRows[i];
    if (!r || !r.length) continue;

    const complexInternalCode = clean(r[0]);
    const category = mapCategory(r[1]);

    if (!complexInternalCode || !category) continue;

    installations.push({
      complexInternalCode,
      category,
      type: clean(r[2]),
      manufacturer: clean(r[3]),
      model: clean(r[4]),
      powerHeating: toFloat(r[5]),
      powerCooling: toFloat(r[6]),
      pvPowerKw: toFloat(r[7]),
      refrigerant: clean(r[8]),
      year: toInt(r[9]),
      status: clean(r[10]),
      metadata: clean(r[11]) ? { notes: clean(r[11]) } : null,
    });
  }

  for (const c of complexes) {
    await prisma.hotelComplex.upsert({
      where: { internalCode: c.internalCode },
      update: c,
      create: c,
    });
  }

  await prisma.technicalInstallation.deleteMany();

  for (const i of installations) {
    const complex = await prisma.hotelComplex.findUnique({
      where: { internalCode: i.complexInternalCode },
    });

    if (!complex) continue;

    await prisma.technicalInstallation.create({
      data: {
        complexId: complex.id,
        category: i.category,
        type: i.type,
        manufacturer: i.manufacturer,
        model: i.model,
        powerHeating: i.powerHeating,
        powerCooling: i.powerCooling,
        pvPowerKw: i.pvPowerKw,
        refrigerant: i.refrigerant,
        year: i.year,
        status: i.status,
        metadata: i.metadata,
      },
    });
  }

  console.log(`Complejos importados: ${complexes.length}`);
  console.log(`Instalaciones detectadas: ${installations.length}`);
  console.log('Importación completada');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });