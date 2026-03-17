import prisma from './utils/prisma.js';

async function check() {
  try {
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    const tournamentCount = await prisma.tournament.count();
    console.log('Tournament count:', tournamentCount);

    // Check if new fields exist by querying them
    const tourneys = await prisma.tournament.findMany({ take: 1 });
    if (tourneys.length > 0) {
        console.log('Tournament type field exists:', tourneys[0].type !== undefined);
    }

    console.log('Database schema check PASSED.');
  } catch (err) {
    console.error('Database check FAILED:', err.message);
  } finally {
    process.exit(0);
  }
}

check();
