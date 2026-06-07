import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  
  const search = searchParams.get('search');
  const kawasan = searchParams.get('kawasan')?.split(',').filter(Boolean);
  const lebarMin = searchParams.get('lebar_min');
  const hadap = searchParams.get('hadap')?.split(',').filter(Boolean);
  const hargaMax = searchParams.get('harga_max');
  const tipe = searchParams.get('tipe');
  const status = searchParams.get('status');
  const siap = searchParams.get('siap')?.split(',').filter(Boolean);
  const carport = searchParams.get('carport');
  
  // Sorting
  const sort = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') || 'desc';

  // Pagination
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const skip = (page - 1) * limit;

  const where: Prisma.PropertyWhereInput = {
    deleted_at: null,
  };

  if (search) {
    where.OR = [
      { nama_property: { contains: search } },
      { group: { contains: search } },
      { kawasan: { contains: search } },
    ];
  }

  if (kawasan && kawasan.length > 0) {
    where.kawasan = { in: kawasan };
  }

  if (lebarMin) {
    where.lebar = { gte: parseFloat(lebarMin) };
  }

  if (hadap && hadap.length > 0) {
    // For string includes, Prisma SQLite doesn't have native array intersection, 
    // so we use OR to check if the string contains any of the requested 'hadap' values.
    where.OR = where.OR || [];
    const hadapConditions = hadap.map(h => ({ hadap: { contains: h } }));
    if (where.OR.length > 0) {
      where.AND = [{ OR: where.OR }, { OR: hadapConditions }];
      delete where.OR;
    } else {
      where.OR = hadapConditions;
    }
  }

  if (hargaMax) {
    where.price = { lte: parseFloat(hargaMax) };
  }

  if (tipe && tipe !== 'Semua') {
    where.tipe = tipe;
  }

  if (status && status !== 'Semua') {
    where.status = status;
  }

  if (siap && siap.length > 0) {
    where.siap = { in: siap };
  }

  if (carport && carport !== 'Semua') {
    where.carport = carport === 'Ya' ? { gt: 0 } : 0;
  }

  try {
    const [data, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'Superadmin') {
    return NextResponse.json({ error: 'Forbidden. Superadmin role required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.nama_property || body.nama_property.length < 3 || body.nama_property.length > 100) {
      return NextResponse.json({ error: 'Nama property must be 3-100 characters.' }, { status: 400 });
    }
    if (body.lebar <= 0 || body.panjang <= 0) {
      return NextResponse.json({ error: 'Lebar and Panjang must be > 0.' }, { status: 400 });
    }
    if (!body.price || isNaN(Number(body.price))) {
      return NextResponse.json({ error: 'Valid price is required.' }, { status: 400 });
    }

    const property = await prisma.property.create({
      data: {
        nama_property: body.nama_property,
        deskripsi: body.deskripsi || null,
        group: body.group || null,
        lebar: parseFloat(body.lebar),
        panjang: parseFloat(body.panjang),
        hadap: Array.isArray(body.hadap) ? body.hadap.join(', ') : body.hadap,
        tipe: body.tipe,
        tingkat: parseFloat(body.tingkat),
        price: parseFloat(body.price),
        carport: parseInt(body.carport) || 0,
        fasilitas: body.fasilitas || null,
        status: body.status,
        siap: body.siap,
        maps_link: body.maps_link || null,
        kawasan: Array.isArray(body.kawasan) ? body.kawasan.join(', ') : body.kawasan,
        unit: body.unit || null,
        image_url: body.image_url || null,
        created_by: session.userId,
      },
    });

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Property',
        entityId: property.id,
        details: JSON.stringify(property),
        userId: session.userId,
        userEmail: user?.email || 'Unknown',
      }
    });

    return NextResponse.json({ success: true, data: property }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: error.message || 'Failed to create property' }, { status: 500 });
  }
}
