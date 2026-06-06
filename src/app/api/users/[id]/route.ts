import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'Superadmin') {
    return NextResponse.json({ error: 'Forbidden. Superadmin role required.' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { is_active, role, password } = body;

    // Fetch user first to make sure they exist
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 });
    }

    // Prevent Superadmin from disabling or changing their own account role
    if (session.userId === id) {
      if (is_active === false) {
        return NextResponse.json({ error: 'Anda tidak dapat menonaktifkan akun Anda sendiri.' }, { status: 400 });
      }
      if (role && role !== targetUser.role) {
        return NextResponse.json({ error: 'Anda tidak dapat mengubah role Anda sendiri.' }, { status: 400 });
      }
    }

    const updateData: any = {};
    if (typeof is_active === 'boolean') {
      updateData.is_active = is_active;
    }
    if (role) {
      if (role !== 'Admin' && role !== 'Superadmin') {
        return NextResponse.json({ error: 'Role tidak valid.' }, { status: 400 });
      }
      updateData.role = role;
    }
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password minimal 6 karakter.' }, { status: 400 });
      }
      updateData.password_hash = await bcrypt.hash(password, 10);
      // Reset attempts and lockout when password is reset
      updateData.login_attempts = 0;
      updateData.locked_until = null;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        is_active: true,
      },
    });

    // Audit Log
    const currentUser = await prisma.user.findUnique({ where: { id: session.userId } });
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'User',
        entityId: id,
        details: JSON.stringify({
          email: updatedUser.email,
          updated_fields: Object.keys(updateData).filter(k => k !== 'password_hash'),
        }),
        userId: session.userId,
        userEmail: currentUser?.email || 'Unknown',
      },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}
