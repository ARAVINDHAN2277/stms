import prisma from '../utils/prismaClient.js';
import { runScheduler } from '../RoundRobinScheduler.js';
import { runKnockoutScheduler } from '../KnockoutScheduler.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';

export const createTournament = async ({ tournamentName, sportType, registrationFee, maxParticipants, location, venueName, stateDistrict, startDate, endDate, deadline, organiserId, format }) => {
  const newTournament = await prisma.tournament.create({
    data: {
      tournamentName,
      sportType,
      registrationFee: Number(registrationFee),
      maxParticipants: maxParticipants ? Number(maxParticipants) : null,
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
        orderBy: {
          matchDate: 'asc'
        },
        include: {
          homeTeam: true,
          awayTeam: true
        }
      }
    }
  });
};

export const getActiveTournaments = async () => {
  return await prisma.tournament.findMany({
    where: { 
      status: { 
        in: ['REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'LIVE', 'COMPLETED'] 
      } 
    },
    orderBy: { createdAt: 'desc' }
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

export const getPlayerRegistrations = async (playerId) => {
  return await prisma.registration.findMany({
    where: { userId: playerId },
    include: {
      tournament: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const generateSchedule = async (tournamentId, format) => {
  if (format) {
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { format }
    });
  }

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

  let scheduleText, schedule;
  if (tournament.format === 'KNOCKOUT') {
    const result = runKnockoutScheduler(playerNames, tournament.startDate, tournament.endDate);
    scheduleText = result.scheduleText;
    schedule = result.schedule;
  } else {
    const result = runScheduler(playerNames, tournament.startDate, tournament.endDate);
    scheduleText = result.scheduleText;
    schedule = result.schedule;
  }

  const uniquePdfName = `schedule-${tournamentId}-${Date.now()}.pdf`;
  generateSchedulePDF(scheduleText, uniquePdfName);

  // Map scheduler team names back to user IDs
  const usernameToId = new Map(users.map(u => [u.username, u.id]));

  // Create matches in DB
  if (schedule && schedule.length > 0) {
    if (tournament.format === 'KNOCKOUT') {
      // Knockout schedule already has UUIDs in memory so we can link them
      const matchData = schedule.map(match => ({
        id: match.id,
        tournamentId: tournamentId,
        homeTeamId: match.homeTeamName !== 'TBD' && match.homeTeamName !== 'BYE' ? usernameToId.get(match.homeTeamName) : null,
        awayTeamId: match.awayTeamName !== 'TBD' && match.awayTeamName !== 'BYE' ? usernameToId.get(match.awayTeamName) : null,
        round: match.round,
        roundName: match.roundName,
        nextMatchId: match.nextMatchId,
        status: match.isBye ? "COMPLETED" : "SCHEDULED",
        matchDate: match.matchDate,
        venueName: match.venueName,
        notes: match.isBye ? "BYE" : null
      }));

      // Create in DB
      await prisma.match.createMany({
        data: matchData
      });
      
      // Auto-advance byes
      for (const match of matchData) {
        if (match.status === 'COMPLETED' && match.nextMatchId) {
          const winnerId = match.homeTeamId || match.awayTeamId; // Whoever actually exists
          if (winnerId) {
            // Update the next match with this winner
            const nextMatch = matchData.find(m => m.id === match.nextMatchId);
            if (nextMatch) {
              const roundMatches = matchData.filter(m => m.round === match.round);
              const matchIndex = roundMatches.findIndex(m => m.id === match.id);
              
              if (matchIndex !== -1) {
                if (matchIndex % 2 === 0) {
                  await prisma.match.update({ where: { id: nextMatch.id }, data: { homeTeamId: winnerId } });
                  nextMatch.homeTeamId = winnerId;
                } else {
                  await prisma.match.update({ where: { id: nextMatch.id }, data: { awayTeamId: winnerId } });
                  nextMatch.awayTeamId = winnerId;
                }
              }
            }
          }
        }
      }
    } else {
      // Round Robin
      const matchData = schedule.map(match => {
        let homeTeamId = null;
        let awayTeamId = null;
        
        // For standard matches, they are Match objects with getHomeTeamName()
        // For the Final match, we explicitly hacked roundName to "Final", or we check if name is TBD.
        if (match.roundName === "Final") {
           // It's the final match
        } else {
           homeTeamId = usernameToId.get(match.getHomeTeamName());
           awayTeamId = usernameToId.get(match.getAwayTeamName());
        }
        
        return {
          tournamentId: tournamentId,
          homeTeamId: homeTeamId,
          awayTeamId: awayTeamId,
          round: match.getRound ? match.getRound() : match.round,
          roundName: match.roundName || null,
          status: "SCHEDULED",
          matchDate: match.getMatchDate ? match.getMatchDate() : match.matchDate,
          venueName: match.getVenue ? match.getVenue() : match.venueName,
          travelDistance: match.getTravelDistance ? match.getTravelDistance() : 0
        };
      });

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
  const homeScore = parseInt(homeTeamScore);
  const awayScore = parseInt(awayTeamScore);
  
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { tournament: true }
  });

  if (!match) throw new Error("Match not found");
  
  let winnerId = null;
  if (homeScore > awayScore) winnerId = match.homeTeamId;
  else if (awayScore > homeScore) winnerId = match.awayTeamId;

  const updatedMatch = await prisma.match.update({
    where: { id: matchId },
    data: {
      homeTeamScore: homeScore,
      awayTeamScore: awayScore,
      winnerId: winnerId,
      status
    }
  });

  // Auto advance winner if Knockout
  if (match.tournament.format === 'KNOCKOUT' && match.nextMatchId && winnerId) {
    const nextMatch = await prisma.match.findUnique({ where: { id: match.nextMatchId } });
    if (nextMatch) {
      // Find whether this match is an even or odd slot in its round
      const roundMatches = await prisma.match.findMany({
        where: { tournamentId: match.tournamentId, round: match.round },
        orderBy: { matchDate: 'asc' }
      });
      
      const matchIndex = roundMatches.findIndex(m => m.id === match.id);
      
      if (matchIndex !== -1) {
        if (matchIndex % 2 === 0) {
          await prisma.match.update({ where: { id: nextMatch.id }, data: { homeTeamId: winnerId } });
        } else {
          await prisma.match.update({ where: { id: nextMatch.id }, data: { awayTeamId: winnerId } });
        }
      } else {
         // Fallback if not found for some reason
         if (!nextMatch.homeTeamId) {
            await prisma.match.update({ where: { id: nextMatch.id }, data: { homeTeamId: winnerId } });
         } else if (!nextMatch.awayTeamId && nextMatch.homeTeamId !== winnerId) {
            await prisma.match.update({ where: { id: nextMatch.id }, data: { awayTeamId: winnerId } });
         }
      }
    }
  } else if (match.tournament.format === 'ROUND_ROBIN') {
    // Check if this was the last league match
    // All matches except the "Final" match
    const allMatches = await prisma.match.findMany({
      where: { tournamentId: match.tournamentId }
    });
    
    const leagueMatches = allMatches.filter(m => m.roundName !== "Final");
    const allLeagueDone = leagueMatches.every(m => m.status === "COMPLETED" || m.id === matchId);
    const finalMatch = allMatches.find(m => m.roundName === "Final");
    
    if (allLeagueDone && finalMatch && (!finalMatch.homeTeamId || !finalMatch.awayTeamId)) {
      // Calculate standings
      const points = {};
      for (const m of leagueMatches) {
         let mHomeScore = m.id === matchId ? homeScore : m.homeTeamScore;
         let mAwayScore = m.id === matchId ? awayScore : m.awayTeamScore;
         if (mHomeScore !== null && mAwayScore !== null) {
            if (!points[m.homeTeamId]) points[m.homeTeamId] = 0;
            if (!points[m.awayTeamId]) points[m.awayTeamId] = 0;
            
            if (mHomeScore > mAwayScore) points[m.homeTeamId] += 3;
            else if (mAwayScore > mHomeScore) points[m.awayTeamId] += 3;
            else {
              points[m.homeTeamId] += 1;
              points[m.awayTeamId] += 1;
            }
         }
      }
      
      const sortedTeams = Object.keys(points).sort((a, b) => points[b] - points[a]);
      if (sortedTeams.length >= 2) {
        await prisma.match.update({
          where: { id: finalMatch.id },
          data: {
            homeTeamId: sortedTeams[0],
            awayTeamId: sortedTeams[1]
          }
        });
      }
    }
  }

  return updatedMatch;
};

export const deleteTournament = async (tournamentId) => {
  return await prisma.tournament.delete({
    where: { id: tournamentId }
  });
};
