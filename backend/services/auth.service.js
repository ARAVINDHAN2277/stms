import prisma from '../utils/prismaClient.js';
import bcrypt from 'bcryptjs';

export const registerUser = async ({ username, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: role
    }
  });

  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
};

export const getUserById = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data
  });
};
