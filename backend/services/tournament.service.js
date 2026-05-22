import prisma from '../utils/prismaClient.js';
import { runScheduler } from '../RoundRobinScheduler.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';

export const createTournament = async ({ tournamentName, sportType, registrationFee, location, organiserId }) => {
  const newTournament = await prisma.tournament.create({
    data: {
      tournamentName,
      sportType,
      registrationFee: Number(registrationFee),
      latitude: location.lat,
      longitude: location.lng,
      organiserId,
    }
  });
  return newTournament;
};

export const getOrganiserTournaments = async (organiserId) => {
  return await prisma.tournament.findMany({
    where: { organiserId }
  });
};

export const getNearbyTournaments = async ({ lat, lng, sport }) => {
  const radiusInKm = 50;
  const earthRadius = 6371;

  const tournaments = await prisma.tournament.findMany({
    where: { sportType: sport }
  });

  const nearby = tournaments.filter(t => {
    const dLat = (t.latitude - lat) * (Math.PI / 180);
    const dLng = (t.longitude - lng) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat * (Math.PI / 180)) *
      Math.cos(t.latitude * (Math.PI / 180)) *
      Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance <= radiusInKm;
  });

  return nearby;
};

export const registerPlayer = async (tournamentId, playerId) => {
  const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
  if (!tournament) throw new Error('Tournament not found');

  try {
    await prisma.registration.create({
      data: {
        tournamentId,
        userId: playerId
      }
    });
  } catch (error) {
    if (error.code === 'P2002') { 
       // Already registered, ignore
    } else {
       throw error;
    }
  }
};

export const generateSchedule = async (tournamentId) => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      registrations: {
        include: {
          user: true
        }
      }
    }
  });

  if (!tournament) throw new Error('Tournament not found');

  const users = tournament.registrations.map(reg => reg.user);
  const playerNames = users.map(user => user.username);
  
  if (playerNames.length === 0) {
    throw new Error('No players registered');
  }

  const schedulerText = runScheduler(playerNames);
  generateSchedulePDF(schedulerText);

  return schedulerText;
};

function generateSchedulePDF(scheduleText, fileName = 'schedule.pdf') {
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(fileName);
  doc.pipe(writeStream);

  doc.fontSize(12).text(scheduleText, {
    width: 410,
    align: 'left'
  });

  doc.end();

  writeStream.on('finish', () => {
    console.log(`PDF saved to ${fileName}`);
  });
}
