// RoundRobinScheduler.js
class Location {
    constructor(latitude, longitude, name) {
      this.latitude = latitude;
      this.longitude = longitude;
      this.name = name;
    }
  
    getLatitude() { return this.latitude; }
    getLongitude() { return this.longitude; }
    getName() { return this.name; }
  
    // Calculate distance between two locations using Haversine formula (in kilometers)
    distanceTo(other) {
      const EARTH_RADIUS_KM = 6371;
      
      const lat1Rad = Math.toRadians(this.latitude);
      const lat2Rad = Math.toRadians(other.latitude);
      const lon1Rad = Math.toRadians(this.longitude);
      const lon2Rad = Math.toRadians(other.longitude);
      
      const dLat = lat2Rad - lat1Rad;
      const dLon = lon2Rad - lon1Rad;
      
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      
      return EARTH_RADIUS_KM * c;
    }
  }
  
  class Match {
    constructor(homeTeam, awayTeam, round, homeTeamName, awayTeamName, 
                venue, matchDate, travelDistance) {
      this.homeTeam = homeTeam;
      this.awayTeam = awayTeam;
      this.round = round;
      this.homeTeamName = homeTeamName;
      this.awayTeamName = awayTeamName;
      this.venue = venue;
      this.matchDate = matchDate;
      this.travelDistance = travelDistance;  // Travel distance for away team
    }
    
    toString() {
      const formatter = new Intl.DateTimeFormat('en-US', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      return `Round ${this.round} (${formatter.format(this.matchDate)}): ${this.homeTeamName} vs ${this.awayTeamName} at ${this.venue} (Travel distance: ${this.travelDistance.toFixed(2)} km)`;
    }
    
    getHomeTeam() { return this.homeTeam; }
    getAwayTeam() { return this.awayTeam; }
    getRound() { return this.round; }
    setRound(round) { this.round = round; }
    getHomeTeamName() { return this.homeTeamName; }
    getAwayTeamName() { return this.awayTeamName; }
    getVenue() { return this.venue; }
    getMatchDate() { return this.matchDate; }
    getTravelDistance() { return this.travelDistance; }
  }
  
  class RoundRobinScheduler {
    constructor(teamNames, includeReverseFixtures, venues, teamLocations, startDate, endDate) {
      this.numTeams = teamNames.length;
      this.includeReverseFixtures = includeReverseFixtures;
      this.teamNames = new Map();
      this.venues = venues;
      this.teamLocations = teamLocations;
      this.startDate = startDate;
      this.endDate = endDate;
      
      // Calculate total round groups (concurrent match slots)
      const totalTeams = teamNames.length + teamNames.length % 2;
      this.numRoundGroups = totalTeams - 1;
      
      // Evenly distribute round groups across the date range
      const diffMs = Math.max(0, endDate.getTime() - startDate.getTime());
      this.msPerRound = this.numRoundGroups <= 1 ? 0 : diffMs / (this.numRoundGroups - 1);
      
      for (let i = 0; i < teamNames.length; i++) {
        this.teamNames.set(i + 1, teamNames[i]);
      }
    }
    
    getTeamName(teamNumber) {
      return this.teamNames.has(teamNumber) ? this.teamNames.get(teamNumber) : `Team ${teamNumber}`;
    }
    
    getVenue(teamNumber) {
      return this.venues.has(teamNumber) ? this.venues.get(teamNumber) : `${this.getTeamName(teamNumber)} Home Ground`;
    }
    
    getTeamLocation(teamNumber) {
      return this.teamLocations.has(teamNumber) ? 
        this.teamLocations.get(teamNumber) : 
        new Location(0, 0, `${this.getTeamName(teamNumber)} Location`);
    }
    
    calculateTravelDistance(homeTeam, awayTeam) {
      const homeLocation = this.getTeamLocation(homeTeam);
      const awayLocation = this.getTeamLocation(awayTeam);
      return awayLocation.distanceTo(homeLocation);
    }
    
    // roundGroup is 0-indexed (0 = first group of matches, last = final group)
    getDateForRoundGroup(roundGroup) {
      const result = new Date(this.startDate.getTime() + roundGroup * this.msPerRound);
      // Clamp to endDate
      if (result > this.endDate) return new Date(this.endDate);
      return result;
    }
    
    // Method to generate optimal schedule using simulated annealing
    generateOptimizedSchedule(iterations, initialTemperature) {
      let currentSchedule = this.generateInitialSchedule();
      let currentCost = this.calculateTotalDistance(currentSchedule);
      
      let bestSchedule = [...currentSchedule];
      let bestCost = currentCost;
      
      let temperature = initialTemperature;
      
      for (let i = 0; i < iterations; i++) {
        // Create a neighbor solution by swapping two matches within the same round
        let newSchedule = [...currentSchedule];
        this.performRandomSwap(newSchedule);
        
        let newCost = this.calculateTotalDistance(newSchedule);
        
        // Decide whether to accept the new solution
        if (this.acceptNewSolution(currentCost, newCost, temperature)) {
          currentSchedule = newSchedule;
          currentCost = newCost;
          
          if (newCost < bestCost) {
            bestSchedule = [...newSchedule];
            bestCost = newCost;
          }
        }
        
        // Cool down the temperature
        temperature *= 0.99;
      }
      
      console.log(`Optimization complete. Initial total distance: ${this.calculateTotalDistance(this.generateInitialSchedule())} km`);
      console.log(`Optimized total distance: ${bestCost} km`);
      
      return bestSchedule;
    }
    
    acceptNewSolution(currentCost, newCost, temperature) {
      if (newCost < currentCost) {
        return true;
      }
      
      const acceptanceProbability = Math.exp((currentCost - newCost) / temperature);
      return Math.random() < acceptanceProbability;
    }
    
    performRandomSwap(schedule) {
      // Group matches by round
      const roundToMatches = new Map();
      for (const match of schedule) {
        if (!roundToMatches.has(match.getRound())) {
          roundToMatches.set(match.getRound(), []);
        }
        roundToMatches.get(match.getRound()).push(match);
      }
      
      // Select a random round
      const rounds = Array.from(roundToMatches.keys());
      const randomRound = rounds[Math.floor(Math.random() * rounds.length)];
      const matchesInRound = roundToMatches.get(randomRound);
      
      if (matchesInRound.length < 2) {
        return; // Cannot swap if there's only one match in the round
      }
      
      // Select two random matches to swap
      const index1 = Math.floor(Math.random() * matchesInRound.length);
      let index2;
      do {
        index2 = Math.floor(Math.random() * matchesInRound.length);
      } while (index1 === index2);
      
      // Find the indices in the original schedule
      const scheduleIndex1 = schedule.indexOf(matchesInRound[index1]);
      const scheduleIndex2 = schedule.indexOf(matchesInRound[index2]);
      
      // Swap home and away teams
      const match1 = schedule[scheduleIndex1];
      const match2 = schedule[scheduleIndex2];
      
      // Create new matches with swapped teams but keeping original venues
      const newMatch1 = new Match(
        match2.getHomeTeam(),
        match1.getAwayTeam(),
        match1.getRound(),
        this.getTeamName(match2.getHomeTeam()),
        this.getTeamName(match1.getAwayTeam()),
        this.getVenue(match2.getHomeTeam()),
        match1.getMatchDate(),
        this.calculateTravelDistance(match2.getHomeTeam(), match1.getAwayTeam())
      );
      
      const newMatch2 = new Match(
        match1.getHomeTeam(),
        match2.getAwayTeam(),
        match2.getRound(),
        this.getTeamName(match1.getHomeTeam()),
        this.getTeamName(match2.getAwayTeam()),
        this.getVenue(match1.getHomeTeam()),
        match2.getMatchDate(),
        this.calculateTravelDistance(match1.getHomeTeam(), match2.getAwayTeam())
      );
      
      schedule[scheduleIndex1] = newMatch1;
      schedule[scheduleIndex2] = newMatch2;
    }
    
    calculateTotalDistance(schedule) {
      return schedule.reduce((sum, match) => sum + match.getTravelDistance(), 0);
    }
    
    generateInitialSchedule() {
      // Step 1: Collect all pairings using round-robin rotation (no dates yet)
      const pairings = [];
      const totalTeams = this.numTeams + this.numTeams % 2;
      const teams = Array(totalTeams).fill(0).map((_, i) => i < this.numTeams ? i + 1 : 0);
      
      const numRoundGroups = totalTeams - 1;
      for (let roundGroup = 0; roundGroup < numRoundGroups; roundGroup++) {
        for (let i = 0; i < totalTeams / 2; i++) {
          const team1 = teams[i];
          const team2 = teams[totalTeams - 1 - i];
          if (team1 !== 0 && team2 !== 0) {
            pairings.push({ team1, team2 });
          }
        }
        this.rotateArray(teams);
      }
      
      // Step 2: Distribute pairings evenly across the date range
      const totalMatches = pairings.length;
      const diffMs = Math.max(0, this.endDate - this.startDate);
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // inclusive day count

      const schedule = pairings.map((pairing, index) => {
        // Spread matches proportionally: floor(index * (diffDays+1) / totalMatches)
        const dayOffset = diffDays === 0 ? 0 : Math.min(
          Math.floor(index * (diffDays + 1) / totalMatches),
          diffDays
        );
        const matchDate = new Date(this.startDate);
        matchDate.setDate(matchDate.getDate() + dayOffset);

        return new Match(
          pairing.team1,
          pairing.team2,
          index + 1,
          this.getTeamName(pairing.team1),
          this.getTeamName(pairing.team2),
          'Main Court',
          matchDate,
          0
        );
      });

      // Append Final Match
      const finalMatchDate = new Date(this.endDate);
      const finalMatch = new Match(
        null,
        null,
        schedule.length + 1,
        'TBD',
        'TBD',
        'Main Court',
        finalMatchDate,
        0
      );
      finalMatch.roundName = "Final";
      schedule.push(finalMatch);

      return schedule;
    }
    
    rotateArray(teams) {
      const lastTeam = teams[teams.length - 1];
      for (let i = teams.length - 1; i > 1; i--) {
        teams[i] = teams[i - 1];
      }
      teams[1] = lastTeam;
    }
    
    printSchedule(schedule) {
      const roundMap = new Map();
      for (const match of schedule) {
        if (!roundMap.has(match.getRound())) {
          roundMap.set(match.getRound(), []);
        }
        roundMap.get(match.getRound()).push(match);
      }
      
      const formatter = new Intl.DateTimeFormat('en-US', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      
      // Sort the rounds
      const sortedRounds = Array.from(roundMap.keys()).sort((a, b) => a - b);
      let scheduleText = '';
      //console.log(scheduleText+"\nTournament Schedule:");
      for (const round of sortedRounds) {
        const roundMatches = roundMap.get(round);
        if (roundMatches.length > 0) {
          const roundDate = roundMatches[0].getMatchDate();
          console.log(`\nRound ${round} (${formatter.format(roundDate)}):`);
          scheduleText += `\nRound ${round} (${formatter.format(roundDate)}):\n`;
          for (const match of roundMatches) {
            console.log(`  ${match.getHomeTeamName()} vs ${match.getAwayTeamName()} at ${match.getVenue()} (Travel: ${match.getTravelDistance().toFixed(2)} km)`);
            scheduleText += `  ${match.getHomeTeamName()} vs ${match.getAwayTeamName()} at ${match.getVenue()} (Travel: ${match.getTravelDistance().toFixed(2)} km)\n`;
          }
        }
      }
      
      console.log("\nSchedule Statistics:");
      console.log(`Total teams: ${this.numTeams}`);
      console.log(`Total rounds: ${roundMap.size}`);
      console.log(`Total matches: ${schedule.length}`);
      console.log(`Start date: ${formatter.format(this.startDate)}`);
      
      // Find the end date
      let endDate = this.startDate;
      for (const match of schedule) {
        if (match.getMatchDate() > endDate) {
          endDate = match.getMatchDate();
        }
      }
      console.log(`End date: ${formatter.format(endDate)}`);
      console.log(`Total travel distance: ${this.calculateTotalDistance(schedule).toFixed(2)} km`);
      console.log("hello")
      console.log(scheduleText);
      return scheduleText;
    }
    
  }
  
  // Helper function to add toRadians to Math
  Math.toRadians = function(degrees) {
    return degrees * Math.PI / 180;
  };
  
  function verifySchedule(schedule, scheduler) {
    console.log("\nSchedule Verification:");
    
    // Check matches per team
    const matchesPerTeam = new Map();
    const distancePerTeam = new Map();
    
    for (const match of schedule) {
      matchesPerTeam.set(
        match.getHomeTeam(), 
        (matchesPerTeam.get(match.getHomeTeam()) || 0) + 1
      );
      matchesPerTeam.set(
        match.getAwayTeam(), 
        (matchesPerTeam.get(match.getAwayTeam()) || 0) + 1
      );
      
      // Track travel distance per team (away teams travel)
      distancePerTeam.set(
        match.getAwayTeam(), 
        (distancePerTeam.get(match.getAwayTeam()) || 0) + match.getTravelDistance()
      );
    }
    
    let balanced = true;
    const expectedMatches = scheduler.includeReverseFixtures ? 
      (scheduler.numTeams - 1) * 2 : 
      (scheduler.numTeams - 1);
      
    for (let team = 1; team <= scheduler.numTeams; team++) {
      const matches = matchesPerTeam.get(team) || 0;
      const distance = distancePerTeam.get(team) || 0;
      console.log(`${scheduler.getTeamName(team)} plays ${matches} matches and travels ${distance.toFixed(2)} km`);
      if (matches !== expectedMatches) {
        balanced = false;
      }
    }
    
    // Check venue usage
    const venueUsage = new Map();
    for (const match of schedule) {
      venueUsage.set(
        match.getVenue(), 
        (venueUsage.get(match.getVenue()) || 0) + 1
      );
    }
    
    console.log("\nVenue Usage:");
    for (const [venue, count] of venueUsage.entries()) {
      console.log(`${venue}: ${count} matches`);
    }
    
    // Check date distribution
    const dateDistribution = new Map();
    for (const match of schedule) {
      const dateStr = match.getMatchDate().toISOString().split('T')[0]; // Get the date part
      dateDistribution.set(
        dateStr, 
        (dateDistribution.get(dateStr) || 0) + 1
      );
    }
    
    console.log("\nMatch Date Distribution:");
    const formatter = new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    // Sort dates
    const sortedDates = Array.from(dateDistribution.keys()).sort();
    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      console.log(`${formatter.format(date)}: ${dateDistribution.get(dateStr)} matches`);
    }
    
    console.log("\nTravel Distance Analysis:");
    const totalDistance = schedule.reduce((sum, match) => sum + match.getTravelDistance(), 0);
    const avgDistance = totalDistance / schedule.length;
    const maxDistance = Math.max(...schedule.map(match => match.getTravelDistance()));
    const minDistance = Math.min(...schedule.map(match => match.getTravelDistance()));
    
    console.log(`Total travel distance: ${totalDistance.toFixed(2)} km`);
    console.log(`Average travel distance per match: ${avgDistance.toFixed(2)} km`);
    console.log(`Maximum travel distance: ${maxDistance.toFixed(2)} km`);
    console.log(`Minimum travel distance: ${minDistance.toFixed(2)} km`);
    
    console.log(`Schedule is ${balanced ? "balanced" : "not balanced"}`);
  }
  
  // Example usage
  function runScheduler(playerNames, startDateStr, endDateStr) {
    const teamNames = playerNames;
    
    // Parse tournament date bounds — fall back gracefully if missing
    const tournamentStart = startDateStr ? new Date(startDateStr) : new Date();
    const tournamentEnd = endDateStr
      ? new Date(endDateStr)
      : new Date(tournamentStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    const venues = new Map();
    const teamLocations = new Map();
    
    const scheduler = new RoundRobinScheduler(
      teamNames, false, venues, teamLocations, tournamentStart, tournamentEnd);
      
    const schedule = scheduler.generateInitialSchedule();
    const scheduleText = scheduler.printSchedule(schedule);
    
    return { scheduleText, schedule };
  }
  
export {
  Location,
  Match,
  RoundRobinScheduler,
  verifySchedule,
  runScheduler
};