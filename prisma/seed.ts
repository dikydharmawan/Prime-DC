import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const superadminEmail = 'superadmin@primeproperty.com';
  const superadminPassword = 'Password123!';

  const existingUser = await prisma.user.findUnique({
    where: { email: superadminEmail },
  });

  if (!existingUser) {
    const password_hash = await bcrypt.hash(superadminPassword, 10);
    await prisma.user.create({
      data: {
        email: superadminEmail,
        password_hash,
        role: 'Superadmin',
      },
    });
    console.log(`Created Superadmin user: ${superadminEmail}`);
  } else {
    console.log(`Superadmin user already exists: ${superadminEmail}`);
  }

  const adminEmail = 'admin@primeproperty.com';
  const adminPassword = 'Password123!';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const password_hash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password_hash,
        role: 'Admin',
      },
    });
    console.log(`Created Admin user: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
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
