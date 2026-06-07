import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: { user: { select: { email: true } } }
    });

    if (!property || property.deleted_at) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ data: property });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'Superadmin') {
    return NextResponse.json({ error: 'Forbidden. Superadmin role required.' }, { status: 403 });
  }

  const { id } = await params;

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

    const property = await prisma.property.update({
      where: { id },
      data: {
        nama_property: body.nama_property,
        deskripsi: body.deskripsi !== undefined ? body.deskripsi : undefined,
        group: body.group || null,
        lebar: parseFloat(body.lebar),
        panjang: parseFloat(body.panjang),
        hadap: Array.isArray(body.hadap) ? body.hadap.join(', ') : body.hadap,
        tipe: body.tipe,
        tingkat: parseFloat(body.tingkat),
        price: parseFloat(body.price),
        carport: parseInt(body.carport) || 0,
        fasilitas: body.fasilitas !== undefined ? body.fasilitas : undefined,
        status: body.status,
        siap: body.siap,
        maps_link: body.maps_link || null,
        kawasan: Array.isArray(body.kawasan) ? body.kawasan.join(', ') : body.kawasan,
        unit: body.unit || null,
        image_url: body.image_url !== undefined ? body.image_url : undefined,
      },
    });

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Property',
        entityId: property.id,
        details: JSON.stringify(property),
        userId: session.userId,
        userEmail: user?.email || 'Unknown',
      }
    });

    return NextResponse.json({ success: true, data: property });
  } catch (error: any) {
    console.error('Error updating property:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'Superadmin') {
    return NextResponse.json({ error: 'Forbidden. Superadmin role required.' }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.property.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'Property',
        entityId: id,
        details: JSON.stringify({ id, deleted_at: new Date() }),
        userId: session.userId,
        userEmail: user?.email || 'Unknown',
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting property:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
