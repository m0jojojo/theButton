/**
 * One-off: create an administrator directly in the database.
 *
 *   DATABASE_URL="<target>" npx tsx scripts/create-admin.ts <email> <password> [name]
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const [email, password, name = 'Admin'] = process.argv.slice(2);
  if (!email || !password) {
    throw new Error('Usage: create-admin.ts <email> <password> [name]');
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    console.log(`User ${existing.email} already exists (role: ${existing.role}) - nothing to do.`);
    return;
  }

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      passwordHash: await bcrypt.hash(password, 10),
      role: 'admin',
    },
  });

  console.log(`Created admin: ${user.email} (id ${user.id})`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
