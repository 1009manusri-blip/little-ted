import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/soundEffects';
import { fireCuteConfetti } from '../utils/confetti';
import { Heart, Sparkles, Shirt } from 'lucide-react';
import { PipCharacter } from './PipCharacter';

interface MascotProps {
  onPet?: () => void;
  happinessScore?: number;
}

export const Mascot: React.FC<MascotProps> = ({ onPet, happinessScore = 99 }) => {
  const [expression, setExpression] = useState<'happy' | 'sparkle' | 'sleepy' | 'giggle' | 'snack'>('happy');
  const [hat, setHat] = useState<'bow' | 'crown' | 'party' | 'angel' | 'glasses' | 'none'>('bow');
  const [speech, setSpeech] = useState<string>("hewwo, i'm ted! ♡");
  const [isWiggling, setIsWiggling] = useState(false);
  const [petCount, setPetCount] = useState(() => {
    try {
      return Number(localStorage.getItem('hax_ted_pets') || '64');
    } catch {
      return 64;
    }
  });

  const speeches = [
    "hewwo, i'm ted! ♡",
    "tiny teddy. big dreams. very important naps 🧸",
    "I'm a little dream maker who creates cozy things for sleepy friends ✨",
    "I collect tiny heart-shaped buttons in my dream pocket! ♡",
    "My little moon pillow is the coziest thing in the nursery 🌙",
    "Yaaawn... sometimes I fall asleep while testing a new lullaby 🎵💤",
    "I love building tall towers out of pastel toy blocks 🧱",
    "Writing a sweet new adventure in my dream notebook 📖",
    "Sending a warm marshmallow hug straight to you ♡"
  ];

  const handlePet = (e?: React.MouseEvent) => {
    soundManager.playGiggle();
    setIsWiggling(true);
    setExpression('giggle');
    const newCount = petCount + 1;
    setPetCount(newCount);
    try {
      localStorage.setItem('hax_ted_pets', String(newCount));
    } catch {
      // ignore
    }

    const randomQuote = speeches[Math.floor(Math.random() * speeches.length)];
    setSpeech(randomQuote);

    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      fireCuteConfetti({
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      });
    }

    if (onPet) onPet();

    setTimeout(() => {
      setIsWiggling(false);
      setExpression('happy');
    }, 1200);
  };

  const handleFeedStrawberry = () => {
    soundManager.playMunch();
    setExpression('snack');
    setSpeech("NOM NOM! Strawberry dream cakes give me bedtime sparkle! 🍓✨");
    setTimeout(() => {
      setExpression('happy');
    }, 1400);
  };

  const handleLullaby = () => {
    soundManager.playChime();
    soundManager.startLullaby('cloudy-cuddles');
    setExpression('sleepy');
    setSpeech("Yaaawn... Cloudy Cuddles is playing... cozy dreams of fluffy strawberry clouds... 🌙💤");
    setTimeout(() => {
      setExpression('happy');
    }, 2500);
  };

  const cycleHat = () => {
    soundManager.playPop();
    const hats: Array<'bow' | 'crown' | 'party' | 'angel' | 'glasses' | 'none'> = [
      'bow', 'crown', 'party', 'angel', 'glasses', 'none'
    ];
    const nextIdx = (hats.indexOf(hat) + 1) % hats.length;
    setHat(hats[nextIdx]);
    setExpression('sparkle');
    setSpeech(`Ooooh! New accessory: ${hats[nextIdx]}! So cozy and dreamy! ✨`);
    setTimeout(() => setExpression('happy'), 1000);
  };

  // Occasional random blink or sleepy twinkle
  useEffect(() => {
    const timer = setInterval(() => {
      setExpression(prev => prev === 'happy' ? 'sparkle' : 'happy');
      setTimeout(() => setExpression('happy'), 800);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      {/* Speech Bubble */}
      <div className="relative mb-3 max-w-[280px] sm:max-w-xs bg-[#FFFDF8] border-2 border-[#3B1B3C] rounded-2xl p-3 shadow-retro-plum-sm text-center">
        <p className="text-xs sm:text-sm font-semibold text-[#8B1E4B] leading-tight">
          {speech}
        </p>
        <div className="text-[10px] text-[#A2678A] font-retro mt-1 flex items-center justify-center gap-2">
          <span>💖 Loved {petCount} times</span>
          <span>·</span>
          <span>Dream Power: {happinessScore}%</span>
        </div>
        {/* Tail */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FFFDF8] border-r-2 border-b-2 border-[#3B1B3C] rotate-45" />
      </div>

      {/* Mascot Graphic (Ted the Dream Engineer Teddy) */}
      <div 
        onClick={handlePet}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePet(); }}
        aria-label="Pet Ted the Dream Maker"
        className={`relative cursor-pointer select-none transition-transform duration-200 ${
          isWiggling ? 'animate-wiggle scale-105' : 'hover:scale-105'
        }`}
      >
        <PipCharacter
          pose="default"
          expression={expression}
          hat={hat}
          size="lg"
        />

        {/* Floating Sparkle Pin */}
        <div className="absolute top-1 right-2 bg-[#FFE66D] text-[#3B1B3C] border border-[#3B1B3C] rounded-full p-1 shadow-retro-plum-sm animate-bounce-subtle">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Mascot Interaction Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <button
          onClick={() => handlePet()}
          className="btn-chunky px-2.5 py-1 text-xs font-semibold bg-[#FFD1E3] hover:bg-[#FFBFD7] text-[#8B1E4B] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-1 cursor-pointer"
          title="Pet Ted"
        >
          <Heart className="w-3.5 h-3.5 text-[#E11D48] fill-current" />
          <span>Pet Ted (+1)</span>
        </button>

        <button
          onClick={handleFeedStrawberry}
          className="btn-chunky px-2.5 py-1 text-xs font-semibold bg-[#FFE8EC] hover:bg-[#FFD6DF] text-[#9F1239] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-1 cursor-pointer"
          title="Feed Dream Strawberry"
        >
          <span>🍓 Sweet Treat</span>
        </button>

        <button
          onClick={handleLullaby}
          className="btn-chunky px-2.5 py-1 text-xs font-semibold bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-1 cursor-pointer"
          title="Play Dream Lullaby"
        >
          <span>🌙 Lullaby</span>
        </button>

        <button
          onClick={cycleHat}
          className="btn-chunky px-2.5 py-1 text-xs font-semibold bg-[#FEF9C3] hover:bg-[#FEF08A] text-[#854D0E] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-1 cursor-pointer"
          title="Change Ted's Hat"
        >
          <Shirt className="w-3.5 h-3.5" />
          <span className="capitalize">{hat}</span>
        </button>
      </div>
    </div>
  );
};
