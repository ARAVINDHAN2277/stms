import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const siva = await prisma.user.findFirst({ where: { username: 'siva' } });
  console.log('Siva:', siva);
  
  if (siva) {
    const tournaments = await prisma.tournament.findMany({ where: { organiserId: siva.id } });
    console.log('Tournaments by Siva ID:', tournaments.length);
  }
  
  const allTournaments = await prisma.tournament.findMany();
  console.log('All Tournaments organisers:', allTournaments.map(t => ({ name: t.tournamentName, organiserId: t.organiserId })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
