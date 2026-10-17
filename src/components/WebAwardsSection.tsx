import React, { useState } from 'react';
import { RETRO_BADGES } from '../data/initialData';
import { soundManager } from '../utils/soundEffects';
import { fireCuteConfetti } from '../utils/confetti';
import { Award, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

interface WebAwardsSectionProps {
  onWebringClick: (dir: 'prev' | 'random' | 'next') => void;
}

export const WebAwardsSection: React.FC<WebAwardsSectionProps> = ({ onWebringClick }) => {
  const [badgeClicks, setBadgeClicks] = useState<Record<string, number>>({});
  const [unlockedEggs, setUnlockedEggs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hax_unlocked_eggs');
      return saved ? JSON.parse(saved) : ['egg-1'];
    } catch {
      return ['egg-1'];
    }
  });

  const eggsList = [
    { id: 'egg-1', title: 'Joined the Kawaii Web', desc: 'Visited haX.baby website' },
    { id: 'egg-2', title: 'Mochi Hugger', desc: 'Pet Mochi the Teddy Bear' },
    { id: 'egg-3', title: 'Sticker Master', desc: 'Stamped stickers on the scrapbook' },
    { id: 'egg-4', title: 'Star Catcher Ace', desc: 'Scored points in the arcade' },
    { id: 'egg-5', title: 'Chime Virtuoso', desc: 'Played a sweet chime note' },
  ];

  const handleBadgeClick = (id: string, e: React.MouseEvent) => {
    soundManager.playPop();
    setBadgeClicks(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    const rect = e.currentTarget.getBoundingClientRect();
    fireCuteConfetti({
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight
    });
  };

  return (
    <section className="py-14 px-4 sm:px-8 bg-[#FFF2F7] border-b-2 border-[#FFD6E8]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-block px-3 py-1 bg-white text-[#8B1E4B] border border-[#3B1B3C] rounded-full text-xs font-retro font-bold mb-2 shadow-xs">
            RETRO INTERNET ARTIFACTS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#751A3D]">
            88x31 Badges & Web Awards 🏆
          </h2>
          <p className="text-xs sm:text-sm text-[#8B3A62] mt-1">
            Certified compliant with early-2000s personal site standards. Click any badge for good luck!
          </p>
        </div>

        {/* 88x31 Pixel Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {RETRO_BADGES.map(badge => {
            const clicks = badgeClicks[badge.id] || 0;
            return (
              <div
                key={badge.id}
                onClick={e => handleBadgeClick(badge.id, e)}
                style={{
                  backgroundColor: badge.bgColor,
                  color: badge.textColor,
                  borderColor: badge.borderColor,
                }}
                className="relative h-14 border-2 rounded-xl p-1.5 flex items-center justify-between shadow-retro-plum-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer select-none"
              >
                <div className="text-xl pl-1">{badge.icon}</div>
                <div className="flex flex-col text-right leading-none pr-1">
                  <span className="text-[10px] font-retro font-extrabold tracking-tighter">
                    {badge.title}
                  </span>
                  <span className="text-[8px] font-retro opacity-90 mt-0.5">
                    {badge.sub}
                  </span>
                </div>
                {clicks > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#FF5964] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#3B1B3C]">
                    {clicks}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Webring & Secret Eggs 2-Column Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Cute Webring Box */}
          <div className="bg-white border-2 border-[#3B1B3C] rounded-2xl p-4 shadow-retro-plum-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 bg-[#FFF0F5] border border-[#3B1B3C] rounded-xl">
                🌐
              </span>
              <div>
                <h4 className="text-xs font-bold text-[#751A3D]">CuteWeb Ring Member #402</h4>
                <p className="text-[11px] text-[#8B3A62]">Connecting joyful retro sites since 2000</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onWebringClick('prev')}
                className="px-2.5 py-1 text-xs font-bold bg-[#FFE66D] border border-[#3B1B3C] rounded-lg shadow-xs hover:bg-[#FFDF4D]"
              >
                « Prev
              </button>
              <button
                onClick={() => onWebringClick('random')}
                className="px-2.5 py-1 text-xs font-bold bg-[#FFD1E3] border border-[#3B1B3C] rounded-lg shadow-xs hover:bg-[#FFBFD7]"
              >
                🎲 Random
              </button>
              <button
                onClick={() => onWebringClick('next')}
                className="px-2.5 py-1 text-xs font-bold bg-[#83D9FF] border border-[#3B1B3C] rounded-lg shadow-xs hover:bg-[#70CDF7]"
              >
                Next »
              </button>
            </div>
          </div>

          {/* Secret Easter Egg Tracker */}
          <div className="bg-white border-2 border-[#3B1B3C] rounded-2xl p-4 shadow-retro-plum-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#751A3D] font-retro flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF70B8]" />
                <span>Easter Egg Discoveries</span>
              </span>
              <span className="text-[10px] font-retro text-[#8B3A62] bg-[#FFF0F5] px-2 py-0.5 rounded-md border border-[#FBCFE8]">
                {unlockedEggs.length} / 5 Found
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {eggsList.map(egg => {
                const isFound = unlockedEggs.includes(egg.id);
                return (
                  <div
                    key={egg.id}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border ${
                      isFound
                        ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                        : 'bg-[#F3F4F6] text-[#9CA3AF] border-gray-200'
                    }`}
                    title={egg.desc}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{egg.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
