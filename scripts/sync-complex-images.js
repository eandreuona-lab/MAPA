const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const COMPLEXES_DIR = path.join(process.cwd(), 'public', 'complexes');
const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function main() {
  const entries = fs.readdirSync(COMPLEXES_DIR, { withFileTypes: true });
  const folders = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

  const complexes = await prisma.hotelComplex.findMany({
    where: {
      internalCode: { in: folders },
    },
    select: {
      id: true,
      internalCode: true,
      name: true,
    },
  });

  const complexesByCode = new Map(
    complexes.map((complex) => [complex.internalCode, complex])
  );

  for (const folder of folders) {
    const complex = complexesByCode.get(folder);

    if (!complex) {
      console.log(`No existe complejo en BD para carpeta: ${folder}`);
      continue;
    }

    const folderPath = path.join(COMPLEXES_DIR, folder);

    const files = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => VALID_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, 'es'));

    await prisma.complexImage.deleteMany({
      where: { complexId: complex.id },
    });

    if (files.length === 0) {
      console.log(`Sin imágenes: ${folder}`);
      continue;
    }

    const data = files.map((fileName, index) => ({
      complexId: complex.id,
      url: `/complexes/${folder}/${fileName}`,
      title: `Foto ${index + 1}`,
      category: 'general',
    }));

    await prisma.complexImage.createMany({
      data,
    });

    console.log(`OK: ${folder} -> ${files.length} imágenes`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });