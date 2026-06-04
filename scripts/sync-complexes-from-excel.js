const path = require('path');
const XLSX = require('xlsx');
const { PrismaClient, ComplexStatus } = require('@prisma/client');

const prisma = new PrismaClient();

const EXCEL_PATH = path.join(process.cwd(), 'plantilla_complejos_instalaciones.xlsx');

function cleanString(value) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text === '' ? null : text;
}

function cleanNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const normalized = String(value).trim().replace(',', '.');
  const number = Number(normalized);
  return Number.isNaN(number) ? null : number;
}

function mapStatus(value) {
  const text = cleanString(value);

  if (!text) return ComplexStatus.ACTIVE;

  const normalized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

  if (normalized === 'operativo') return ComplexStatus.ACTIVE;
  if (normalized === 'activo') return ComplexStatus.ACTIVE;
  if (normalized === 'cerrado temporalmente') return ComplexStatus.TEMPORARILY_CLOSED;
  if (normalized === 'temporalmente cerrado') return ComplexStatus.TEMPORARILY_CLOSED;
  if (normalized === 'en reforma') return ComplexStatus.UNDER_RENOVATION;
  if (normalized === 'en renovacion') return ComplexStatus.UNDER_RENOVATION;
  if (normalized === 'inactivo') return ComplexStatus.INACTIVE;

  throw new Error(`Status no reconocido en Excel: ${value}`);
}

async function main() {
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets['Complejos'];

  if (!sheet) {
    throw new Error('No existe la hoja "Complejos" en el Excel');
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

  let processed = 0;

  for (const row of rows) {
    const internalCode = cleanString(row.internalCode);

    if (!internalCode) {
      console.log('Fila ignorada sin internalCode');
      continue;
    }

    const data = {
      externalId: cleanString(row.externalId),
      internalCode,
      name: cleanString(row.name),
      hotelChain: cleanString(row.hotelChain),
      address: cleanString(row.address),
      city: cleanString(row.city),
      province: cleanString(row.province),
      region: cleanString(row.region),
      country: cleanString(row.country),
      latitude: cleanNumber(row.latitude),
      longitude: cleanNumber(row.longitude),
      rooms: cleanNumber(row.rooms),
      constructionYear: cleanNumber(row.constructionYear),
      lastRenovationYear: cleanNumber(row.lastRenovationYear),
      status: mapStatus(row.status),
      director: cleanString(row.Director),
      maintenanceManager: cleanString(row.maintenanceManager),
      phone: cleanString(row.phone),
      email: cleanString(row.email),
    };

    await prisma.hotelComplex.upsert({
      where: { internalCode },
      update: data,
      create: data,
    });

    processed += 1;
    console.log(`OK: ${internalCode}`);
  }

  console.log(`Sincronización completada: ${processed} complejos procesados`);
}

main()
  .catch((error) => {
    console.error('Error sincronizando complejos desde Excel:');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });