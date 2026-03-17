import prisma from './utils/prisma.js';

async function checkUser() {
  const email = 'siva@gmail.com';
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    console.log(`User with email ${email} ALREADY EXISTS.`);
    console.log('User data:', JSON.stringify(user, null, 2));
  } else {
    console.log(`User with email ${email} DOES NOT exist.`);
  }
  process.exit(0);
}

checkUser();
