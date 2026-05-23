import prisma from '../utils/prismaClient.js';

export const updateMatchScore = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { homeTeamScore, awayTeamScore, winnerId, status } = req.body;

    // Optional basic validation
    if (homeTeamScore !== undefined && isNaN(parseInt(homeTeamScore))) {
      return res.status(400).json({ message: "Invalid home team score" });
    }
    if (awayTeamScore !== undefined && isNaN(parseInt(awayTeamScore))) {
      return res.status(400).json({ message: "Invalid away team score" });
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        homeTeamScore: homeTeamScore !== undefined ? parseInt(homeTeamScore) : undefined,
        awayTeamScore: awayTeamScore !== undefined ? parseInt(awayTeamScore) : undefined,
        winnerId: winnerId || undefined,
        status: status || undefined
      }
    });

    res.json({ message: "Match score updated successfully", match: updatedMatch });
  } catch (error) {
    res.status(500).json({ message: "Error updating match score", error: error.message });
  }
};

export const updateMatchSchedule = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { matchDate, matchTime, venueName, status, notes } = req.body;

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        matchDate: matchDate ? new Date(matchDate) : undefined,
        matchTime: matchTime ? new Date(matchTime) : undefined,
        venueName: venueName || undefined,
        status: status || undefined,
        notes: notes || undefined
      }
    });

    res.json({ message: "Match schedule updated successfully", match: updatedMatch });
  } catch (error) {
    res.status(500).json({ message: "Error updating match schedule", error: error.message });
  }
};
