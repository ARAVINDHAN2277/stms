import * as tournamentService from '../services/tournament.service.js';

export const registerTournament = async (req, res) => {
  try {
    const { tournamentName, sportType, registrationFee, maxParticipants, location, venueName, stateDistrict, startDate, endDate, deadline } = req.body;
    const userId = req.user.id;

    if (!tournamentName || !sportType || registrationFee === undefined || !location || !location.lat || !location.lng) {
      return res.status(400).json({ message: "Missing required fields: tournamentName, sportType, registrationFee, location.lat, location.lng" });
    }
    
    if (isNaN(parseFloat(registrationFee)) || isNaN(parseFloat(location.lat)) || isNaN(parseFloat(location.lng))) {
      return res.status(400).json({ message: "Invalid numeric fields provided" });
    }

    const newTournament = await tournamentService.createTournament({
      tournamentName,
      sportType,
      registrationFee,
      maxParticipants,
      location,
      venueName,
      stateDistrict,
      startDate,
      endDate,
      deadline,
      organiserId: userId
    });

    // Format for frontend compatibility
    const frontendTournament = {
      ...newTournament,
      _id: newTournament.id,
      location: { lat: newTournament.latitude, lng: newTournament.longitude }
    };

    res.status(201).json({ message: "Tournament registered successfully Hello", tournament: frontendTournament });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrganiserTournaments = async (req, res) => {
  try {
    const organiserId = req.user.id;
    const tournaments = await tournamentService.getOrganiserTournaments(organiserId);
    
    // Map for frontend
    const mapped = tournaments.map(t => ({
      ...t,
      _id: t.id,
      location: { lat: t.latitude, lng: t.longitude }
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getActiveTournaments = async (req, res) => {
  try {
    const tournaments = await tournamentService.getActiveTournaments();
    const mapped = tournaments.map(t => ({
      ...t,
      _id: t.id,
      location: { lat: t.latitude, lng: t.longitude }
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTournamentById = async (req, res) => {
  try {
    const tournament = await tournamentService.getTournamentById(req.params.id);
    if (!tournament) return res.status(404).json({ message: "Tournament not found" });
    
    const mapped = {
      ...tournament,
      _id: tournament.id,
      location: { lat: tournament.latitude, lng: tournament.longitude }
    };
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNearbyTournaments = async (req, res) => {
  try {
    const { lat, lng, sport } = req.query;

    if (!lat || !lng || !sport) {
      return res.status(400).json({ message: "Missing required query parameters: lat, lng, sport" });
    }
    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
      return res.status(400).json({ message: "Invalid latitude or longitude" });
    }
    
    const nearby = await tournamentService.getNearbyTournaments({ 
      lat: parseFloat(lat), 
      lng: parseFloat(lng), 
      sport 
    });

    // Map for frontend
    const mapped = nearby.map(t => ({
      ...t,
      _id: t.id,
      location: { lat: t.latitude, lng: t.longitude }
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const registerForTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { playerId } = req.body;

    await tournamentService.registerPlayer(id, playerId);

    res.json({ message: 'Player registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const getPlayerRegistrations = async (req, res) => {
  try {
    const { playerId } = req.params;
    const registrations = await tournamentService.getPlayerRegistrations(playerId);
    
    // map tournament locations
    const mapped = registrations.map(reg => ({
      ...reg,
      tournament: {
        ...reg.tournament,
        _id: reg.tournament.id,
        location: { lat: reg.tournament.latitude, lng: reg.tournament.longitude }
      }
    }));
    
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const scheduleTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.body;
    const scheduler = await tournamentService.generateSchedule(id, format);
    res.json(scheduler);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTournamentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedTournament = await tournamentService.updateTournamentStatus(id, status);
    res.json({ message: "Tournament status updated", tournament: updatedTournament });
  } catch (err) {
    res.status(500).json({ message: "Error updating tournament status", error: err.message });
  }
};

export const updateParticipantStatus = async (req, res) => {
  try {
    const { id, registrationId } = req.params;
    const { status, paymentStatus } = req.body;

    const updatedRegistration = await tournamentService.updateRegistrationStatus(registrationId, status, paymentStatus);
    res.json({ message: "Participant status updated", registration: updatedRegistration });
  } catch (err) {
    res.status(500).json({ message: "Error updating participant status", error: err.message });
  }
};

export const updateMatchScore = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { homeTeamScore, awayTeamScore } = req.body;

    const updatedMatch = await tournamentService.updateMatchScore(matchId, homeTeamScore, awayTeamScore);
    res.json({ message: "Match score updated", match: updatedMatch });
  } catch (err) {
    res.status(500).json({ message: "Error updating match score", error: err.message });
  }
};

export const deleteTournament = async (req, res) => {
  try {
    await tournamentService.deleteTournament(req.params.id);
    res.json({ message: "Tournament deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting tournament", error: err.message });
  }
};
