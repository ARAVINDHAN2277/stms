import prisma from '../utils/prismaClient.js';
import { runScheduler } from '../RoundRobinScheduler.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';

export const createTournament = async ({ tournamentName, sportType, registrationFee, location, venueName, stateDistrict, startDate, endDate, deadline, organiserId }) => {
  const newTournament = await prisma.tournament.create({
    data: {
      tournamentName,
      sportType,
      registrationFee: Number(registrationFee),
      latitude: location.lat,
      longitude: location.lng,
      venueName,
      stateDistrict,
      startDate,
      endDate,
      deadline,
      organiserId,
    }
  });
  return newTournament;
};

export const getOrganiserTournaments = async (organiserId) => {
  return await prisma.tournament.findMany({
    where: { organiserId },
    include: {
      registrations: true
    }
  });
};

export const getTournamentById = async (tournamentId) => {
  return await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      registrations: {
        include: {
          user: true
        }
      },
      matches: {
        include: {
          homeTeam: true,
          awayTeam: true
        }
      }
    }
  });
};

export const getNearbyTournaments = async ({ lat, lng, sport }) => {
  const radiusInKm = 50;
  const earthRadius = 6371;

  const kmInLat = 111;
  const kmInLng = 111 * Math.cos(lat * Math.PI / 180);

  const latDelta = radiusInKm / kmInLat;
  const lngDelta = radiusInKm / kmInLng;

  const tournaments = await prisma.tournament.findMany({
    where: { 
      sportType: sport,
      latitude: { gte: lat - latDelta, lte: lat + latDelta },
      longitude: { gte: lng - lngDelta, lte: lng + lngDelta }
    }
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

  const { scheduleText, schedule } = runScheduler(playerNames);
  const uniquePdfName = `schedule-${tournamentId}-${Date.now()}.pdf`;
  generateSchedulePDF(scheduleText, uniquePdfName);

  // Map scheduler team names back to user IDs
  const usernameToId = new Map(users.map(u => [u.username, u.id]));

  // Create matches in DB
  if (schedule && schedule.length > 0) {
    const matchData = schedule.map(match => ({
      tournamentId: tournamentId,
      homeTeamId: usernameToId.get(match.getHomeTeamName()),
      awayTeamId: usernameToId.get(match.getAwayTeamName()),
      round: match.getRound(),
      status: "SCHEDULED",
      matchDate: match.getMatchDate(),
      venueName: match.getVenue(),
      travelDistance: match.getTravelDistance()
    })).filter(m => m.homeTeamId && m.awayTeamId); // Only create if both players found

    if (matchData.length > 0) {
      await prisma.match.createMany({
        data: matchData
      });
    }
  }

  return { scheduleText, pdfPath: uniquePdfName };
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

export const updateTournamentStatus = async (tournamentId, status) => {
  return await prisma.tournament.update({
    where: { id: tournamentId },
    data: { status }
  });
};

export const updateRegistrationStatus = async (registrationId, status, paymentStatus) => {
  return await prisma.registration.update({
    where: { id: registrationId },
    data: {
      status: status || undefined,
      paymentStatus: paymentStatus || undefined
    }
  });
};

export const updateMatchScore = async (matchId, homeTeamScore, awayTeamScore) => {
  let status = "COMPLETED";
  return await prisma.match.update({
    where: { id: matchId },
    data: {
      homeTeamScore: parseInt(homeTeamScore),
      awayTeamScore: parseInt(awayTeamScore),
      status
    }
  });
};

export const deleteTournament = async (tournamentId) => {
  return await prisma.tournament.delete({
    where: { id: tournamentId }
  });
};
