import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

const MiniBracketPreview = () => {
  const [stage, setStage] = useState(0); // 0: Start, 1: Round 1 Finish, 2: Final Finish

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const Match = ({ p1, p2, winner, active }) => (
    <div className={`p-3 border ${active ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/5 bg-white/2'} rounded-sm transition-all duration-700`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-[10px] font-black uppercase tracking-widest ${winner === 1 ? 'text-emerald-400' : 'text-gray-400'}`}>
          {p1}
        </span>
        {winner === 1 && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />}
      </div>
      <div className="flex justify-between items-center">
        <span className={`text-[10px] font-black uppercase tracking-widest ${winner === 2 ? 'text-emerald-400' : 'text-gray-400'}`}>
          {p2}
        </span>
        {winner === 2 && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />}
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-4 py-8 px-4 glass rounded-sm border-purple-500/20 max-w-lg mx-auto overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-2 opacity-20">
         <Trophy className="w-20 h-20 text-purple-500" />
      </div>
      
      {/* Round 1 */}
      <div className="flex flex-col gap-8 flex-1 z-10">
        <Match 
          p1="Viper" 
          p2="Ghost" 
          winner={stage >= 1 ? 1 : null} 
          active={stage === 0}
        />
        <Match 
          p1="Titan" 
          p2="Apex" 
          winner={stage >= 1 ? 2 : null} 
          active={stage === 0}
        />
      </div>

      {/* Connection Line */}
      <div className="w-8 flex flex-col justify-center items-center gap-1 opacity-20">
         <div className="w-full h-px bg-purple-500" />
      </div>

      {/* Final */}
      <div className="flex-1 flex items-center z-10">
        <Match 
          p1={stage >= 1 ? "Viper" : "---"} 
          p2={stage >= 1 ? "Apex" : "---"} 
          winner={stage >= 2 ? 1 : null} 
          active={stage === 1}
        />
      </div>

      {/* Trophy Section */}
      <div className={`w-12 h-12 flex items-center justify-center transition-all duration-1000 ${stage >= 3 ? 'scale-125 opacity-100' : 'scale-50 opacity-0'}`}>
         <div className="relative">
            <Trophy className="w-8 h-8 text-yellow-500 filter drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
            <div className="absolute inset-0 bg-yellow-500/20 blur-xl animate-pulse" />
         </div>
      </div>
    </div>
  );
};

export default MiniBracketPreview;
