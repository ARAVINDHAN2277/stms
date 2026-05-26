import crypto from 'crypto';

export class KnockoutScheduler {
  constructor(teamNames, startDate, endDate) {
    this.teamNames = teamNames;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  generateBracket() {
    const schedule = [];
    const numTeams = this.teamNames.length;
    
    // Find next power of 2
    let powerOf2 = 1;
    while (powerOf2 < numTeams) powerOf2 *= 2;
    
    const byes = powerOf2 - numTeams;
    const firstRoundMatchesCount = powerOf2 / 2;
    
    // Calculate total rounds
    const numRounds = Math.log2(powerOf2);
    
    // Distribute matches over date range
    const diffMs = Math.max(0, this.endDate.getTime() - this.startDate.getTime());
    const msPerRound = numRounds <= 1 ? 0 : diffMs / (numRounds - 1);
    
    // Node structure to build the tree
    // We'll create matches starting from the Final backwards to Round 1, or forwards.
    // Let's create an array of rounds, where each round is an array of matches.
    const rounds = [];
    for (let r = 0; r < numRounds; r++) {
      rounds.push([]);
      const matchesInThisRound = powerOf2 / Math.pow(2, r + 1);
      const matchDate = new Date(this.startDate.getTime() + r * msPerRound);
      
      let roundName = `Round ${r + 1}`;
      if (matchesInThisRound === 1) roundName = "Final";
      else if (matchesInThisRound === 2) roundName = "Semifinals";
      else if (matchesInThisRound === 4) roundName = "Quarterfinals";

      for (let m = 0; m < matchesInThisRound; m++) {
        rounds[r].push({
          id: crypto.randomUUID(),
          homeTeam: null,
          awayTeam: null,
          homeTeamName: 'TBD',
          awayTeamName: 'TBD',
          round: r + 1,
          roundName: roundName,
          matchDate: matchDate > this.endDate ? this.endDate : new Date(matchDate.getTime() + m * 60000),
          nextMatchId: null,
          venueName: 'Main Court',
          isBye: false
        });
      }
    }
    
    // Link matches
    for (let r = 0; r < numRounds - 1; r++) {
      for (let m = 0; m < rounds[r].length; m++) {
        const nextMatchIndex = Math.floor(m / 2);
        rounds[r][m].nextMatchId = rounds[r+1][nextMatchIndex].id;
      }
    }
    
    // Populate Round 1 with teams and byes
    // To distribute byes evenly, we put them at the end or alternate.
    let teamIndex = 0;
    for (let m = 0; m < rounds[0].length; m++) {
      // Home team
      if (teamIndex < this.teamNames.length) {
        rounds[0][m].homeTeamName = this.teamNames[teamIndex++];
      }
      
      // Away team
      // Check if we need to assign a bye. We have `byes` number of byes to distribute.
      // Easiest is to assign byes to the last `byes` matches of the first round.
      if (m >= rounds[0].length - byes) {
        rounds[0][m].awayTeamName = "BYE";
        rounds[0][m].isBye = true;
      } else {
        if (teamIndex < this.teamNames.length) {
          rounds[0][m].awayTeamName = this.teamNames[teamIndex++];
        }
      }
    }
    
    // Flatten rounds into schedule
    let matchCounter = 1;
    for (const round of rounds) {
      for (const match of round) {
        match.matchCounter = matchCounter++;
        schedule.push(match);
      }
    }
    
    return schedule;
  }
}

export function runKnockoutScheduler(playerNames, startDateStr, endDateStr) {
  const tournamentStart = startDateStr ? new Date(startDateStr) : new Date();
  const tournamentEnd = endDateStr
    ? new Date(endDateStr)
    : new Date(tournamentStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    
  const scheduler = new KnockoutScheduler(playerNames, tournamentStart, tournamentEnd);
  const schedule = scheduler.generateBracket();
  
  let scheduleText = "Knockout Bracket Generated:\n";
  for (const match of schedule) {
    scheduleText += `${match.roundName} (M${match.matchCounter}): ${match.homeTeamName} vs ${match.awayTeamName}\n`;
  }
  
  return { scheduleText, schedule };
}
