import React from 'react';

export const MarqueeBanner: React.FC = () => {
  const items = [
    "🌙 WELCOME TO TED'S DREAM MAKER PORTFOLIO ♡",
    "☁️ JUNIOR DREAM ENGINEER AT THE MIDNIGHT NURSERY",
    "⭐ COLLECTING TINY STARS & SLEEPY LULLABIES",
    "🧸 PET TED FOR FLUFFY BLESSINGS",
    "✨ BEDTIME STORIES ARE ALWAYS COMPLIMENTARY",
    "🍓 FRESH STRAWBERRY DREAMS READY FOR DELIVERY",
    "🎀 THERE'S ALWAYS ROOM FOR ONE MORE DREAM"
  ];

  return (
    <div className="bg-[#FFEDF4] border-b-2 border-[#FFC2DB] py-1.5 overflow-hidden select-none">
      <div className="animate-marquee whitespace-nowrap text-xs font-retro font-bold text-[#8B1E4B] flex items-center gap-8">
        {[...items, ...items, ...items].map((text, idx) => (
          <span key={idx} className="flex items-center gap-2">
            <span>{text}</span>
            <span className="text-[#FF70B8]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};
