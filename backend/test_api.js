import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();

async function main() {
  const siva = await prisma.user.findFirst({ where: { username: 'siva' } });
  
  if (!siva) {
    console.log("Siva not found");
    return;
  }
  
  const token = jwt.sign({ id: siva.id, role: siva.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
  const response = await fetch(`http://localhost:5000/api/tournaments/organiser/${siva.id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const data = await response.json();
  console.log("API Response Status:", response.status);
  console.log("API Data length:", data.length);
  if (data.length === 0) console.log("Data is empty:", data);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
