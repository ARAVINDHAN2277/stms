import prisma from './utils/prisma.js';
import bcrypt from 'bcryptjs';

async function testCreate() {
  try {
    const username = 'siva';
    const email = 'siva@gmail.com';
    const password = 'password123';
    const role = 'player';
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ 
      data: { username, email, password: hashedPassword, role } 
    });
    console.log('User created successfully:', user.id);
  } catch (err) {
    console.error('Error creating user:', err);
  } finally {
    process.exit(0);
  }
}

testCreate();
