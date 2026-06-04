import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const [totalComplexes, totalRooms, complexes] = await Promise.all([
    prisma.hotelComplex.count(),
    prisma.hotelComplex.aggregate({ _sum: { rooms: true } }),
    prisma.hotelComplex.findMany({ include: { installations: true } }),
  ]);

  const withBoilers = new Set<number>();
  const withHeatPumps = new Set<number>();
  const withChillers = new Set<number>();
  const withPV = new Set<number>();

  for (const c of complexes) {
    for (const i of c.installations) {
      const type = (i.type || '').toLowerCase();
      const cat = i.category;
      if (type.includes('caldera')) withBoilers.add(c.id);
      if (type.includes('bomba de calor')) withHeatPumps.add(c.id);
      if (type.includes('enfriadora') || type.includes('chiller')) withChillers.add(c.id);
      if (type.includes('fotovolta')) withPV.add(c.id);
      if (cat === 'RENEWABLE' && type.includes('fv')) withPV.add(c.id);
    }
  }

  return NextResponse.json({
    totalComplexes,
    totalRooms: totalRooms._sum.rooms ?? 0,
    withBoilers: withBoilers.size,
    withHeatPumps: withHeatPumps.size,
    withChillers: withChillers.size,
    withPV: withPV.size,
  });
}
