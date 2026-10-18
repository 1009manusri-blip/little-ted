import React, { useState } from 'react';
import { Mascot } from './Mascot';
import { TedHeroScene } from './3d/TedHeroScene';
import { soundManager } from '../utils/soundEffects';
import { fireCuteConfetti, fireHearts } from '../utils/confetti';
import { Heart, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onPeekCreations: () => void;
  onMyStory: () => void;
  isNightMode?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPeekCreations,
  onMyStory,
  isNightMode = false,
}) => {
  const [starClicks, setStarClicks] = useState(0);
  const [showSecretDream, setShowSecretDream] = useState(false);

  const handleEasterEggStarClick = () => {
    soundManager.playPop();
    const next = starClicks + 1;
    setStarClicks(next);
    if (next >= 4) {
      soundManager.playYay();
      setShowSecretDream(true);
      fireCuteConfetti();
      fireHearts();
    }
  };
  return (
    <section id="home" className="relative pt-8 pb-16 px-4 sm:px-8 bg-gradient-to-b from-[#FFF9F5] via-[#FFF1F6] to-[#FFF9F5] overflow-hidden">
      {/* Floating Nursery Decorations (Clouds, Stars, Baby Bottle, Heart Button) */}
      <div className="absolute top-6 left-6 sm:left-14 opacity-75 animate-float pointer-events-none select-none text-2xl sm:text-3xl">
        ☁️
      </div>
      <div className="absolute top-16 right-8 sm:right-24 opacity-80 animate-float-slow pointer-events-none select-none text-2xl sm:text-3xl">
        ⭐
      </div>
      <div className="absolute bottom-8 left-10 opacity-75 animate-bounce-subtle pointer-events-none select-none text-2xl sm:text-3xl">
        🧸
      </div>
      <div className="absolute bottom-12 right-12 opacity-80 animate-float pointer-events-none select-none text-2xl sm:text-3xl">
        🌙
      </div>
      <div className="absolute top-1/2 left-4 sm:left-8 opacity-65 animate-wiggle pointer-events-none select-none text-xl">
        🎀
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Soft Nursery Header Pill */}
        <div className="flex items-center justify-center sm:justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-[#3B1B3C] rounded-full shadow-retro-plum-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF70B8] animate-ping" />
            <span className="text-xs font-retro font-bold text-[#8B1E4B]">
              THE MIDNIGHT NURSERY · TED'S WORKSHOP 🧸
            </span>
          </div>
        </div>

        {/* Hero 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Supporting Heading, Intro & Two Main Buttons */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-[#751A3D] leading-[1.1] tracking-tight mb-2 text-balance">
              hewwo, i'm ted! <br />
              <span className="relative inline-block text-[#FF5964]">
                ted's little dreamland ♡
                <svg className="absolute -bottom-1 left-0 w-full h-3.5 text-[#FF70B8] opacity-80" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Supporting Tagline */}
            <p className="text-base sm:text-xl font-bold text-[#A24269] mb-3 font-display">
              tiny teddy. big dreams. very important naps.
            </p>

            {/* Short Description */}
            <p className="text-sm sm:text-base text-[#6B2848] font-medium leading-relaxed mb-8 max-w-xl">
              I'm a little dream maker who creates cozy things for sleepy friends, one tiny idea at a time.
            </p>

            {/* Two Cute Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
              {/* Button 1: explore my creations ♡ */}
              <button
                onClick={() => {
                  soundManager.playPop();
                  onPeekCreations();
                }}
                className="btn-chunky px-6 py-3.5 text-sm sm:text-base font-extrabold text-[#8B1E4B] bg-[#FFD6E8] hover:bg-[#FFC4DC] border-3 border-[#3B1B3C] rounded-2xl shadow-retro-plum flex items-center gap-2 cursor-pointer"
              >
                <Heart className="w-5 h-5 text-[#E11D48] fill-current" />
                <span>explore my creations ♡</span>
              </button>

              {/* Button 2: my little story ☁️ */}
              <button
                onClick={() => {
                  soundManager.playChime();
                  onMyStory();
                }}
                className="btn-chunky px-6 py-3.5 text-sm sm:text-base font-extrabold text-[#3B1B3C] bg-[#FFE66D] hover:bg-[#FFDE4D] border-3 border-[#3B1B3C] rounded-2xl shadow-retro-plum flex items-center gap-2 cursor-pointer"
              >
                <span>my little story ☁️</span>
              </button>
            </div>

            {/* Ted's quirky baby tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-retro text-[#8B3A62]">
              <span className="badge-pill-hover bg-[#FFF0F5] px-2.5 py-1 rounded-xl border border-[#FBCFE8] cursor-default">♡ Heart Button Collector</span>
              <span className="badge-pill-hover bg-[#FFF0F5] px-2.5 py-1 rounded-xl border border-[#FBCFE8] cursor-default">🌙 Moon Pillow Sleeper</span>
              <span className="badge-pill-hover bg-[#FFF0F5] px-2.5 py-1 rounded-xl border border-[#FBCFE8] cursor-default">🎵 6 Bedside Lullabies</span>
            </div>
          </div>

          {/* Right Column: 3D Ted & Animated Nursery Scene */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="card-hover relative p-2 sm:p-4 bg-[#FFF8FA] border-3 border-[#3B1B3C] rounded-3xl shadow-retro-plum-lg bg-polka-pattern w-full max-w-md flex flex-col items-center">
              {/* Corner Baby Decorations (Left Star is Hidden Easter Egg Trigger!) */}
              <button
                onClick={handleEasterEggStarClick}
                className="star-spin-hover absolute -top-3 -left-3 w-8 h-8 bg-[#FFE66D] hover:bg-[#FFDF4D] border-2 border-[#3B1B3C] rounded-full flex items-center justify-center text-xs shadow-sm font-bold z-20 cursor-pointer"
                title="A tiny twinkling star near Ted's cloud... click me! ⭐"
              >
                ⭐
              </button>
              <div className="sticker-hover absolute -top-3 -right-3 w-8 h-8 bg-[#83D9FF] border-2 border-[#3B1B3C] rounded-full flex items-center justify-center text-xs shadow-sm font-bold z-20 pointer-events-none">
                🧸
              </div>

              {/* Handwritten Note near Ted */}
              <div className="absolute -bottom-4 right-2 sm:-right-4 bg-[#FFF8D6] border-2 border-[#3B1B3C] rounded-2xl px-3.5 py-1.5 shadow-retro-plum-sm rotate-2 z-20 pointer-events-none">
                <p className="text-xs font-display font-extrabold text-[#854D0E] whitespace-nowrap">
                  professional napper since forever ♡
                </p>
              </div>

              {/* Little Animated Sleeping Cloud Companion Badge */}
              <div className="absolute -top-6 right-6 bg-white/90 border-2 border-[#3B1B3C] rounded-full px-3 py-1 shadow-sm flex items-center gap-1.5 animate-bounce-subtle text-xs font-bold text-[#8B1E4B] z-20 pointer-events-none">
                <span>☁️</span>
                <span className="text-[11px] font-retro">3D Nursery World ✨</span>
              </div>

              {/* Genuine 3D Ted Nursery Experience */}
              <TedHeroScene isNightMode={isNightMode} />
            </div>
          </div>
        </div>
      </div>

      {/* Secret Easter Egg Dream Modal */}
      {showSecretDream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-[#FFFDF9] border-3 border-[#3B1B3C] rounded-3xl p-6 shadow-retro-plum-lg text-center animate-bounce-subtle">
            <button
              onClick={() => setShowSecretDream(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#FFE66D] border-2 border-[#3B1B3C] font-bold text-xs text-[#3B1B3C] flex items-center justify-center shadow-retro-plum-sm hover:scale-105 cursor-pointer"
            >
              ✕
            </button>
            <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FFF0F5] border-2 border-[#3B1B3C] flex items-center justify-center text-3xl shadow-retro-plum-sm mb-3">
              ⭐✨🧸
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#751A3D] mb-2 leading-tight">
              Psst... Ted saved one extra dream just for you. ♡
            </h3>
            <p className="text-xs text-[#5C233E] leading-relaxed mb-5 bg-[#FFF2F6] p-3 rounded-2xl border border-[#FBCFE8]">
              May your pillow stay cool, your nightlights glow softly, and tomorrow bring you sweet surprises!
            </p>
            <button
              onClick={() => {
                soundManager.playYay();
                fireHearts();
                setShowSecretDream(false);
              }}
              className="btn-chunky px-5 py-2.5 text-xs font-bold bg-[#FF70B8] hover:bg-[#FF599F] text-white border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm cursor-pointer"
            >
              Keep This Dream Warm in My Heart 💖
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
