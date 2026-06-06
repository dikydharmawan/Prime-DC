import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'Superadmin') {
    return NextResponse.json({ error: 'Forbidden. Superadmin role required.' }, { status: 403 });
  }

  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: 100, // Limit to recent 100 logs
    });

    return NextResponse.json({ data: logs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}
