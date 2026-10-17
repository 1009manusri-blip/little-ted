import React from 'react';
import { PipCharacter } from './PipCharacter';
import { Star, Moon, BookOpen } from 'lucide-react';

export const StorySection: React.FC = () => {
  const scenes = [
    {
      number: 'SCENE ONE',
      title: 'THE LITTLE STAR',
      text: "One sleepy night, a tiny star tumbled beside Ted's moon pillow. Ted gave it a cuddle and discovered that even the smallest things could hold a little magic.",
      pose: 'star-hug' as const,
      expression: 'sparkle' as const,
      color: '#FFF8FA',
      borderColor: '#FFC2DB',
      badgeColor: '#FFE66D',
      icon: '⭐',
      quote: "A baby star that smelled like sweet starlight.",
    },
    {
      number: 'SCENE TWO',
      title: 'A TINY IDEA',
      text: "The next evening, Ted heard little creatures struggling to fall asleep. With a notebook full of tiny ideas, a music box, and a pocket full of stars, Ted decided to help.",
      pose: 'nightlight' as const,
      expression: 'curious' as const,
      color: '#FAF5FF',
      borderColor: '#E9D5FF',
      badgeColor: '#B99AFF',
      icon: '🌙',
      quote: "Listening to sleepy sighs across the treetops.",
    },
    {
      number: 'SCENE THREE',
      title: 'THE MIDNIGHT NURSERY',
      text: "Armed with cozy nightlights, gentle lullabies, and a very tiny dream bag, Ted became the Midnight Nursery's youngest Dream Engineer. Every night, Ted creates something small to make bedtime magical.",
      pose: 'dream-bag' as const,
      expression: 'happy' as const,
      color: '#FFFDF5',
      borderColor: '#FEF08A',
      badgeColor: '#A5F3C1',
      icon: '🧸',
      quote: "Ready for nightly cloud delivery duty ♡",
    },
  ];

  return (
    <section id="story" className="py-20 px-4 sm:px-8 bg-[#FFF9FA] border-b-2 border-[#FFD6E8]">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#FFD6E8] text-[#8B1E4B] border border-[#3B1B3C] rounded-full text-xs font-retro font-bold mb-3 shadow-xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>PICTURE BOOK ORIGIN TALE 📖</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#751A3D] tracking-tight mb-2">
            how this tiny dream maker began ♡
          </h2>
          <p className="text-[#6B2848] text-sm sm:text-base font-medium">
            Turn the pages of Ted's illustrated baby memory book.
          </p>
        </div>

        {/* 3 Scrapbook Scenes in Vertical Sequence */}
        <div className="space-y-10 relative">
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-0.5 border-l-2 border-dashed border-[#FFC2DB] -z-0" />

          {scenes.map((scene, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={scene.number}
                className="card-hover relative z-10 bg-[#FFFDF9] border-3 border-[#3B1B3C] rounded-3xl p-6 sm:p-8 shadow-retro-plum-lg bg-polka-pattern"
              >
                <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Illustration */}
                  <div className={`md:col-span-5 flex justify-center ${isEven ? 'md:order-2' : ''}`}>
                    <div
                      style={{ backgroundColor: scene.color }}
                      className="p-5 border-2 border-[#3B1B3C] rounded-3xl shadow-retro-plum-sm flex flex-col items-center justify-center w-full max-w-[240px]"
                    >
                      <PipCharacter
                        pose={scene.pose}
                        expression={scene.expression}
                        size="md"
                      />
                      <span className="text-[11px] font-retro text-[#8B3A62] mt-2 font-bold italic text-center">
                        {scene.quote}
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <div className={`md:col-span-7 flex flex-col items-start text-left ${isEven ? 'md:order-1' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-lg border border-[#3B1B3C] text-[10px] font-retro font-bold bg-[#FFE66D] text-[#3B1B3C] shadow-xs">
                        {scene.number}
                      </span>
                      <span className="text-base">{scene.icon}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#751A3D] mb-3">
                      {scene.title}
                    </h3>

                    <p className="text-sm sm:text-base text-[#5C233E] font-medium leading-relaxed bg-white/90 p-4 rounded-2xl border border-[#FBCFE8]">
                      "{scene.text}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
