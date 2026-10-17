import React, { useState } from 'react';
import { PipCharacter } from './PipCharacter';
import { soundManager } from '../utils/soundEffects';
import { fireCuteConfetti } from '../utils/confetti';
import { Heart, Sparkles, Moon, Star } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [currentMood, setCurrentMood] = useState<'Eepy' | 'Curious' | 'Dreamy'>('Eepy');

  const moodMessages: Record<'Eepy' | 'Curious' | 'Dreamy', { message: string; sub: string; pose: 'sleeping-cloud' | 'pacifier' | 'star-hug' }> = {
    Eepy: {
      message: 'Eepy mode activated. Please deliver snacks, moon pillow, and a blanket. ♡',
      sub: 'Eyelids heavy, dreams loading at 99%...',
      pose: 'sleeping-cloud',
    },
    Curious: {
      message: 'Curious mode engaged! Ted is inspecting a new heart-shaped button under the nightlight.',
      sub: 'Testing toy block balance with great baby care 🍼',
      pose: 'pacifier',
    },
    Dreamy: {
      message: 'Dreamy mode floating by! Ted is sketching cloud castles in his tiny dream notebook.',
      sub: 'Sending warm lullaby ripples across the galaxy ✨',
      pose: 'star-hug',
    },
  };

  const handleMoodSelect = (mood: 'Eepy' | 'Curious' | 'Dreamy') => {
    soundManager.playPop();
    setCurrentMood(mood);
    fireCuteConfetti();
  };

  return (
    <section id="profile" className="py-16 px-4 sm:px-8 bg-[#FFF9FA] border-y-2 border-[#FFD6E8]">
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-8">
          <div className="inline-block px-3.5 py-1 bg-[#FFD6E8] text-[#8B1E4B] border border-[#3B1B3C] rounded-full text-xs font-retro font-bold mb-2 shadow-xs">
            NURSERY SCRAPBOOK · PAGE 01 🍼
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#751A3D] tracking-tight">
            all about little ted 🧸
          </h2>
          <p className="text-xs sm:text-sm text-[#8B3A62] mt-2 font-medium max-w-xl mx-auto italic">
            "I'm Ted, a tiny, sleepy teddy with a very big imagination. I love collecting stars, building little toys, and making bedtime magical for my sleepy friends."
          </p>
        </div>

        {/* Nursery Scrapbook Card */}
        <div className="card-hover relative bg-[#FFFDF9] border-3 border-[#3B1B3C] rounded-3xl p-6 sm:p-8 shadow-retro-plum-lg bg-notebook-pattern">
          {/* Decorative Washi Tape & Safety Pin */}
          <div className="absolute -top-3 left-8 w-24 h-6 bg-[#FFE66D]/85 border-t border-b border-[#3B1B3C]/30 rotate-[-3deg] pointer-events-none shadow-xs text-[10px] font-retro text-[#854D0E] flex items-center justify-center font-bold">
            TED'S FILE #001
          </div>
          <div className="sticker-hover absolute -top-3 right-8 w-8 h-8 rounded-full bg-[#FFD1E3] border-2 border-[#3B1B3C] flex items-center justify-center text-sm shadow-xs cursor-default">
            🧷
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Ted Character Graphic reflecting current mood */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="p-4 bg-white border-2 border-[#3B1B3C] rounded-3xl shadow-retro-plum-sm flex flex-col items-center w-full max-w-[220px] transition-transform duration-200 hover:scale-102">
                <PipCharacter
                  pose={moodMessages[currentMood].pose}
                  expression={currentMood === 'Eepy' ? 'sleepy' : currentMood === 'Curious' ? 'sparkle' : 'happy'}
                  size="md"
                />
                <span className="text-[11px] font-retro text-[#8B3A62] font-bold mt-1 bg-[#FFF0F5] px-2 py-0.5 rounded-full border border-[#FBCFE8] badge-pill-hover cursor-default">
                  mood: {currentMood.toLowerCase()} ♡
                </span>
              </div>
            </div>

            {/* Right: Baby Details in Sticker Labels */}
            <div className="md:col-span-7 flex flex-col space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="badge-pill-hover bg-white/90 p-2.5 rounded-2xl border-2 border-[#FFC2DB] shadow-xs cursor-default">
                  <span className="block text-[10px] font-retro text-[#8B1E4B] font-bold uppercase">Job</span>
                  <span className="font-extrabold text-[#751A3D] text-sm">Junior Dream Engineer 🌙</span>
                </div>

                <div className="badge-pill-hover bg-white/90 p-2.5 rounded-2xl border-2 border-[#FFC2DB] shadow-xs cursor-default">
                  <span className="block text-[10px] font-retro text-[#8B1E4B] font-bold uppercase">Home</span>
                  <span className="font-extrabold text-[#751A3D] text-sm">The Midnight Nursery 🧸</span>
                </div>

                <div className="badge-pill-hover bg-white/90 p-2.5 rounded-2xl border-2 border-[#FFC2DB] shadow-xs cursor-default">
                  <span className="block text-[10px] font-retro text-[#8B1E4B] font-bold uppercase">Favourite Thing</span>
                  <span className="font-extrabold text-[#751A3D] text-sm">Tiny stars ⭐</span>
                </div>

                <div className="badge-pill-hover bg-white/90 p-2.5 rounded-2xl border-2 border-[#FFC2DB] shadow-xs cursor-default">
                  <span className="block text-[10px] font-retro text-[#8B1E4B] font-bold uppercase">Favourite Activity</span>
                  <span className="font-extrabold text-[#751A3D] text-sm">Cloud naps ☁️</span>
                </div>

                <div className="sm:col-span-2 badge-pill-hover bg-white/90 p-2.5 rounded-2xl border-2 border-[#FFC2DB] shadow-xs cursor-default">
                  <span className="block text-[10px] font-retro text-[#8B1E4B] font-bold uppercase">Special Talent</span>
                  <span className="font-extrabold text-[#751A3D] text-sm">Making sleepy-time magic ✨</span>
                </div>
              </div>

              {/* Interactive Mood Selector */}
              <div className="mt-2 pt-3 border-t-2 border-dashed border-[#FFC2DB]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-retro font-bold text-[#751A3D]">
                    Change Ted's Mood:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {(['Eepy', 'Curious', 'Dreamy'] as const).map(mood => (
                      <button
                        key={mood}
                        onClick={() => handleMoodSelect(mood)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border-2 transition-all duration-200 cursor-pointer ${
                          currentMood === mood
                            ? 'bg-[#FFE66D] text-[#3B1B3C] border-[#3B1B3C] shadow-retro-plum-sm scale-105'
                            : 'bg-white text-[#8B3A62] border-[#FBCFE8] hover:bg-[#FFF0F5] hover:border-[#FFB3D1] hover:scale-102'
                        }`}
                      >
                        {mood === 'Eepy' ? '😴 Eepy' : mood === 'Curious' ? '🔍 Curious' : '✨ Dreamy'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Mood Message */}
                <div className="bg-[#FFF2F6] border-2 border-[#3B1B3C] rounded-2xl p-3 shadow-retro-plum-sm">
                  <p className="text-xs sm:text-sm font-bold text-[#8B1E4B]">
                    "{moodMessages[currentMood].message}"
                  </p>
                  <p className="text-[10px] text-[#A2678A] font-retro mt-0.5">
                    {moodMessages[currentMood].sub}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
