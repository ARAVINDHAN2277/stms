import prisma from './utils/prisma.js';

async function cleanup() {
  const email = 'siva@gmail.com';
  await prisma.user.deleteMany({ where: { email } });
  console.log(`Deleted user ${email} if existed.`);
  process.exit(0);
}

cleanup();
