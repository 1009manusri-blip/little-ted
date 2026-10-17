import React, { useState } from 'react';
import { PipCharacter } from './PipCharacter';
import { soundManager } from '../utils/soundEffects';
import { fireCuteConfetti, fireHearts } from '../utils/confetti';
import { Sparkles, Heart, Star, Mail } from 'lucide-react';

export const GoodbyeSection: React.FC = () => {
  const [starClicks, setStarClicks] = useState(0);
  const [easterEggUnlocked, setEasterEggUnlocked] = useState(false);

  const handleStarClick = (e: React.MouseEvent) => {
    soundManager.playPop();
    const nextClicks = starClicks + 1;
    setStarClicks(nextClicks);

    if (nextClicks >= 4 && !easterEggUnlocked) {
      soundManager.playYay();
      setEasterEggUnlocked(true);
      fireHearts();
      fireCuteConfetti();
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      fireCuteConfetti({
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      });
    }
  };

  return (
    <section id="goodbye" className="py-20 px-4 sm:px-8 bg-gradient-to-b from-[#FFF9FA] to-[#FFF1F6] overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-white border-3 border-[#3B1B3C] rounded-3xl p-8 sm:p-12 shadow-retro-plum-lg text-center bg-polka-pattern">
          {/* Secret Twinkling Easter Egg Star in Top Right */}
          <button
            onClick={handleStarClick}
            className={`absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-2xl border-2 border-[#3B1B3C] flex items-center justify-center text-base transition-transform hover:scale-125 cursor-pointer shadow-retro-plum-sm ${
              easterEggUnlocked
                ? 'bg-[#FFE66D] animate-wiggle'
                : 'bg-[#FFF9E6] hover:bg-[#FFE66D]'
            }`}
            title="A tiny twinkling bedtime star... click me!"
          >
            <span>⭐</span>
          </button>

          {/* Tiny decorative note */}
          <div className="inline-block px-3.5 py-1 bg-[#FFF0F5] text-[#8B1E4B] border border-[#FBCFE8] rounded-full text-xs font-retro font-bold mb-4">
            UNTIL TOMORROW'S SUNSET 🌙
          </div>

          {/* Main Goodbye Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#751A3D] mb-3 tracking-tight">
            Sweet dreams, little dreamer! ♡
          </h2>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#6B2848] font-bold mb-8 font-display">
            There's always room for one more dream.
          </p>

          {/* Ted Sleeping or Waving Illustration */}
          <div className="flex justify-center my-4">
            <div className="relative p-4 bg-[#FFF5F8] border-2 border-[#3B1B3C] rounded-3xl shadow-retro-plum-sm">
              <PipCharacter
                pose="sleeping-cloud"
                expression="sleepy"
                size="lg"
              />
            </div>
          </div>

          <p className="text-xs text-[#8B3A62] font-retro mt-4">
            Bedtime dispatch complete · All little critters are safe & sound 🧸
          </p>

          {/* Secret Easter Egg Modal / Banner when discovered */}
          {easterEggUnlocked && (
            <div className="mt-8 p-6 bg-[#FEFCE8] border-3 border-[#3B1B3C] rounded-3xl shadow-retro-plum animate-bounce-subtle text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFE66D] border-2 border-[#3B1B3C] flex items-center justify-center text-2xl shadow-sm mb-3">
                💌
              </div>

              <h3 className="text-lg font-extrabold text-[#751A3D] mb-1">
                Psst... Ted saved one extra dream just for you. ♡
              </h3>

              <p className="text-xs sm:text-sm text-[#713F12] max-w-md mx-auto leading-relaxed my-2 font-medium">
                May your pillow always stay cool, may you wake up smiling, and may your brightest wishes gently find their way into reality! ✨
              </p>

              <button
                onClick={() => {
                  soundManager.playYay();
                  fireHearts();
                }}
                className="btn-chunky mt-3 px-5 py-2 text-xs font-bold bg-[#FF70B8] text-white border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm cursor-pointer"
              >
                Keep This Dream Warm in My Heart 💖
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
