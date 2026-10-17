import React, { useState } from 'react';
import { RANDOM_SURPRISES } from '../data/initialData';
import { soundManager } from '../utils/soundEffects';
import { fireCuteConfetti, fireHearts } from '../utils/confetti';
import { Sparkles, Dices, Heart } from 'lucide-react';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SurpriseModal: React.FC<SurpriseModalProps> = ({ isOpen, onClose }) => {
  const [surpriseIndex, setSurpriseIndex] = useState(0);

  if (!isOpen) return null;

  const current = RANDOM_SURPRISES[surpriseIndex];

  const handleNextSurprise = () => {
    soundManager.playYay();
    const next = (surpriseIndex + 1) % RANDOM_SURPRISES.length;
    setSurpriseIndex(next);
    if (RANDOM_SURPRISES[next].actionType === 'hearts') {
      fireHearts();
    } else {
      fireCuteConfetti();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-[#FFFDF9] border-3 border-[#3B1B3C] rounded-3xl p-6 shadow-retro-plum-lg text-center animate-bounce-subtle">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#FFE66D] border-2 border-[#3B1B3C] font-bold text-xs text-[#3B1B3C] flex items-center justify-center shadow-retro-plum-sm hover:scale-105"
        >
          ✕
        </button>

        {/* Sticker Illustration */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FFF0F5] border-2 border-[#3B1B3C] flex items-center justify-center text-4xl shadow-retro-plum-sm mb-4">
          {current.sticker}
        </div>

        {/* Surprise Title */}
        <h3 className="text-lg font-extrabold text-[#751A3D] mb-2 leading-tight">
          {current.title}
        </h3>

        {/* Surprise Text */}
        <p className="text-xs text-[#5C233E] leading-relaxed mb-6 bg-[#FFF2F6] p-3 rounded-2xl border border-[#FBCFE8]">
          {current.text}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleNextSurprise}
            className="btn-chunky px-4 py-2 text-xs font-bold bg-[#FFE66D] hover:bg-[#FFDF4D] text-[#3B1B3C] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Another Surprise</span>
          </button>

          <button
            onClick={onClose}
            className="btn-chunky px-4 py-2 text-xs font-bold bg-[#FF70B8] hover:bg-[#FF599F] text-white border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm cursor-pointer"
          >
            <span>Thank You! 💖</span>
          </button>
        </div>
      </div>
    </div>
  );
};
