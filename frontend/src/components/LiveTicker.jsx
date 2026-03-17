import React from 'react';

const LiveTicker = () => {
  const telemetry = [
    "● Live Tournament: Neo-Tokyo Invitational",
    "● 1,240 Players Online",
    "● Match Scheduled: Squad Alpha vs Team Bravo",
    "● Grid Maintenance Complete",
    "● Prize Pool Updated: $50,000",
    "● New Squad Formed: Velocity Syndicate",
    "● Tournament Registration Peak: 400 registrations/min",
    "● Latency: 12ms (Global Edge)",
  ];

  return (
    <div className="h-10 bg-white/5 border-y border-white/5 flex items-center overflow-hidden whitespace-nowrap relative z-20">
      <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#0a0a0c] to-transparent z-10" />
      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#0a0a0c] to-transparent z-10" />
      
      <div className="animate-marquee flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
        {telemetry.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
        {/* Repeat for seamless loop */}
        {telemetry.map((item, index) => (
          <span key={`repeat-${index}`}>{item}</span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LiveTicker;
