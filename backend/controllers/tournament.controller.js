import * as tournamentService from '../services/tournament.service.js';

export const registerTournament = async (req, res) => {
  try {
    const { tournamentName, sportType, registrationFee, location } = req.body;
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
      location,
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
    const tournaments = await tournamentService.getOrganiserTournaments(req.params.organiserId);
    
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

export const scheduleTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const scheduler = await tournamentService.generateSchedule(id);
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
