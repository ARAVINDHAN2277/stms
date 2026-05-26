import React from 'react';

const BracketTree = ({ matches }) => {
  if (!matches || matches.length === 0) return null;

  // Group matches by round (1-indexed based on creation)
  const roundsMap = {};
  matches.forEach(match => {
    if (!roundsMap[match.round]) roundsMap[match.round] = [];
    roundsMap[match.round].push(match);
  });

  const rounds = Object.keys(roundsMap).sort((a, b) => parseInt(a) - parseInt(b)).map(k => roundsMap[k]);

  return (
    <div className="overflow-x-auto py-8">
      <div className="flex justify-start min-w-max gap-12 px-4">
        {rounds.map((roundMatches, roundIndex) => (
          <div key={roundIndex} className="flex flex-col justify-around min-w-[240px] space-y-6">
            <h4 className="text-center font-bold text-navy-dark mb-4 border-b border-warm-border pb-2 uppercase tracking-wide text-sm">
              {roundMatches[0]?.roundName || `Round ${roundIndex + 1}`}
            </h4>
            {roundMatches.map((match, matchIndex) => (
              <div key={match.id || matchIndex} className="relative flex flex-col justify-center h-full">
                <div className="bg-white border border-warm-border rounded-lg shadow-sm overflow-hidden z-10 w-full">
                  
                  {/* Home Team */}
                  <div className={`px-4 py-2 flex justify-between items-center border-b border-warm-border ${match.winnerId && match.winnerId === match.homeTeamId ? 'bg-primary/5' : ''}`}>
                    <span className={`font-medium truncate ${match.winnerId && match.winnerId === match.homeTeamId ? 'text-primary font-bold' : 'text-navy-dark'}`}>
                      {match.homeTeam?.username || (match.notes === 'BYE' ? 'BYE' : 'TBD')}
                    </span>
                    <span className="font-bold text-sm">
                      {match.homeTeamScore !== null ? match.homeTeamScore : '-'}
                    </span>
                  </div>

                  {/* Away Team */}
                  <div className={`px-4 py-2 flex justify-between items-center ${match.winnerId && match.winnerId === match.awayTeamId ? 'bg-primary/5' : ''}`}>
                    <span className={`font-medium truncate ${match.winnerId && match.winnerId === match.awayTeamId ? 'text-primary font-bold' : 'text-navy-dark'}`}>
                      {match.awayTeam?.username || (match.notes === 'BYE' && !match.awayTeamId ? 'BYE' : 'TBD')}
                    </span>
                    <span className="font-bold text-sm">
                      {match.awayTeamScore !== null ? match.awayTeamScore : '-'}
                    </span>
                  </div>

                </div>

                {/* Connecting Lines */}
                {roundIndex < rounds.length - 1 && (
                  <>
                    <div className="absolute right-[-24px] top-1/2 w-6 h-[2px] bg-warm-border" />
                    {matchIndex % 2 === 0 ? (
                      <div className="absolute right-[-24px] top-1/2 w-[2px] h-[calc(50%+1.5rem)] bg-warm-border" />
                    ) : (
                      <div className="absolute right-[-24px] bottom-1/2 w-[2px] h-[calc(50%+1.5rem)] bg-warm-border" />
                    )}
                  </>
                )}
                
                {roundIndex > 0 && (
                  <div className="absolute left-[-24px] top-1/2 w-6 h-[2px] bg-warm-border" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BracketTree;
