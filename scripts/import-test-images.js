const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const complexes = await prisma.hotelComplex.findMany({
    where: {
      internalCode: {
        in: ['ONA-CAT6', 'ONA-CAT26'],
      },
    },
    select: {
      id: true,
      internalCode: true,
      name: true,
    },
  });

  const byCode = Object.fromEntries(
    complexes.map((c) => [c.internalCode, c])
  );

const imagesToCreate = [
  { code: 'ONA-CAT6', url: '/complexes/ONA-CAT6/calapi-1.jpg', title: 'Foto 1' },
  { code: 'ONA-CAT6', url: '/complexes/ONA-CAT6/calapi-2.jpg', title: 'Foto 2' },
  { code: 'ONA-CAT6', url: '/complexes/ONA-CAT6/calapi-3.jpg', title: 'Foto 3' },
  { code: 'ONA-CAT6', url: '/complexes/ONA-CAT6/calapi-4.jpg', title: 'Foto 4' },
  { code: 'ONA-CAT6', url: '/complexes/ONA-CAT6/calapi-5.jpg', title: 'Foto 5' },
  { code: 'ONA-CAT6', url: '/complexes/ONA-CAT6/calapi-6.jpg', title: 'Foto 6' },

  { code: 'ONA-CAT26', url: '/complexes/ONA-CAT26/palamos-1.jpg', title: 'Foto 1' },
  { code: 'ONA-CAT26', url: '/complexes/ONA-CAT26/palamos-2.jpg', title: 'Foto 2' },
  { code: 'ONA-CAT26', url: '/complexes/ONA-CAT26/palamos-3.jpg', title: 'Foto 3' },
  { code: 'ONA-CAT26', url: '/complexes/ONA-CAT26/palamos-4.jpg', title: 'Foto 4' },
  { code: 'ONA-CAT26', url: '/complexes/ONA-CAT26/palamos-5.jpg', title: 'Foto 5' },
];

  for (const code of ['ONA-CAT6', 'ONA-CAT26']) {
    const complex = byCode[code];
    if (!complex) {
      console.log(`No encontrado: ${code}`);
      continue;
    }

    await prisma.complexImage.deleteMany({
      where: { complexId: complex.id },
    });

    const rows = imagesToCreate
      .filter((img) => img.code === code)
      .map((img) => ({
        complexId: complex.id,
        url: img.url,
        title: img.title,
        category: 'general',
      }));

    if (rows.length > 0) {
      await prisma.complexImage.createMany({
        data: rows,
      });
    }

    console.log(`OK: ${code} -> ${rows.length} imágenes`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });