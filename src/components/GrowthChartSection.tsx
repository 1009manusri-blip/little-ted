import React, { useState } from 'react';
import { soundManager } from '../utils/soundEffects';
import { fireCuteConfetti } from '../utils/confetti';
import { Sparkles, Star, Ruler, Award, Heart } from 'lucide-react';
import { PipCharacter } from './PipCharacter';

export const GrowthChartSection: React.FC = () => {
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);

  const milestones = [
    {
      height: '70 cm',
      title: 'Promoted to Junior Dream Engineer! 🎓',
      desc: 'Earned the official Midnight Nursery star satchel and honorary sleeping cap.',
      sticker: '🧸',
      color: '#FEF08A',
      tag: 'Current Milestone ♡',
    },
    {
      height: '55 cm',
      title: 'First nightlight invented ✨',
      desc: 'Crafted the little star lantern so friends wouldn’t fear the dark.',
      sticker: '💡',
      color: '#BAE6FD',
      tag: 'Bedtime Safety',
    },
    {
      height: '40 cm',
      title: 'First dream delivered ☁️',
      desc: 'Flew a tiny warm envelope to a kitten sleeping in a teacup.',
      sticker: '💌',
      color: '#FFD1E3',
      tag: 'First Flight',
    },
    {
      height: '25 cm',
      title: 'First lullaby composed 🎵',
      desc: 'Wound up the nursery music box and hummed along in key of C.',
      sticker: '🎶',
      color: '#E9D5FF',
      tag: 'Sleepy Melody',
    },
    {
      height: '10 cm',
      title: 'First star collected ⭐',
      desc: 'A tiny tumbling star landed in Ted’s cloud crib. True love at first twinkle.',
      sticker: '⭐',
      color: '#BBF7D0',
      tag: 'Where It Began',
    },
  ];

  const handleMilestoneClick = (idx: number, e: React.MouseEvent) => {
    soundManager.playPop();
    setActiveMilestone(idx);
    const rect = e.currentTarget.getBoundingClientRect();
    fireCuteConfetti({
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    });
  };

  return (
    <section className="py-16 px-4 sm:px-8 bg-[#FFF8FA] border-b-2 border-[#FFD6E8]">
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-block px-3.5 py-1 bg-[#FFD6E8] text-[#8B1E4B] border border-[#3B1B3C] rounded-full text-xs font-retro font-bold mb-2 shadow-xs">
            NURSERY MEASUREMENT WALL 📏
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#751A3D] tracking-tight">
            look how much i've grown! ♡
          </h2>
          <p className="text-xs sm:text-sm text-[#8B3A62] mt-1 font-medium">
            Fictional milestones taped to the nursery wall with love and strawberry stickers.
          </p>
        </div>

        {/* Growth Chart Container */}
        <div className="card-hover relative bg-[#FFFDF9] border-3 border-[#3B1B3C] rounded-3xl p-6 sm:p-8 shadow-retro-plum-lg bg-grid-pattern">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Growth Ruler Graphic */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <div className="relative w-28 bg-[#FFE66D]/40 border-2 border-[#3B1B3C] rounded-2xl p-3 flex flex-col justify-between h-[360px] shadow-retro-plum-sm transition-transform hover:scale-102">
                {/* Ruler Markings */}
                {[70, 60, 50, 40, 30, 20, 10].map(val => (
                  <div key={val} className="flex items-center justify-between border-b border-[#3B1B3C]/30 pb-0.5">
                    <span className="text-[10px] font-retro font-extrabold text-[#751A3D]">{val}</span>
                    <span className="w-4 h-0.5 bg-[#3B1B3C]" />
                  </div>
                ))}

                {/* Ted standing beside ruler */}
                <div className="absolute -right-10 bottom-2 pointer-events-none">
                  <PipCharacter pose="default" expression="happy" size="sm" />
                </div>
              </div>
            </div>

            {/* Right: Milestone cards along chart */}
            <div className="md:col-span-8 space-y-3">
              {milestones.map((m, idx) => {
                const isSelected = activeMilestone === idx;
                return (
                  <div
                    key={m.title}
                    onClick={(e) => handleMilestoneClick(idx, e)}
                    style={{ borderColor: isSelected ? '#3B1B3C' : '#FFD6E8' }}
                    className={`p-3.5 bg-white border-2 rounded-2xl shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected ? 'ring-2 ring-[#FF70B8] scale-[1.02] shadow-retro-plum-sm' : 'hover:-translate-y-1 hover:shadow-retro-plum-sm hover:border-[#FFB3D1]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-[#FFF0F5] border border-[#3B1B3C] flex items-center justify-center text-lg shadow-xs">
                        {m.sticker}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-[#751A3D]">{m.title}</h4>
                          <span className="text-[9px] font-retro font-bold text-[#8B3A62] bg-[#FFF2F6] px-1.5 py-0.5 rounded border border-[#FBCFE8]">
                            {m.tag}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B2848] mt-0.5">{m.desc}</p>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-xl text-xs font-retro font-bold bg-[#FFF8FA] border border-[#3B1B3C] shrink-0 text-[#751A3D]">
                      {m.height}
                    </div>
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
