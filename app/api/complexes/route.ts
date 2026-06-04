import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get('q')?.trim() || '';
  const status = searchParams.get('status')?.trim() || '';
  const technology = searchParams.get('technology')?.trim() || '';
  const region = searchParams.get('region')?.trim() || '';
  const province = searchParams.get('province')?.trim() || '';

  const complexes = await prisma.hotelComplex.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null },
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { internalCode: { contains: q, mode: 'insensitive' } },
              { city: { contains: q, mode: 'insensitive' } },
              { province: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(status ? { status: status as any } : {}),
      ...(region ? { region: { contains: region, mode: 'insensitive' } } : {}),
      ...(province ? { province: { contains: province, mode: 'insensitive' } } : {}),
      ...(technology
        ? {
            installations: {
              some: {
                type: {
                  contains: technology,
                  mode: 'insensitive',
                },
              },
            },
          }
        : {}),
    },
    include: {
      images: true,
      installations: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return NextResponse.json({ complexes });
}