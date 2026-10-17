import React, { useState } from 'react';
import { PipCharacter } from './PipCharacter';
import { soundManager } from '../utils/soundEffects';
import { fireCuteConfetti, fireHearts } from '../utils/confetti';
import { Heart, Sparkles, Send, Star } from 'lucide-react';

export const TinyNoteSection: React.FC = () => {
  const [loveCount, setLoveCount] = useState(0);
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleSendLove = (e: React.MouseEvent) => {
    soundManager.playYay();
    setLoveCount(prev => prev + 1);
    const rect = e.currentTarget.getBoundingClientRect();
    fireHearts();
  };

  const handleEasterEggClick = () => {
    soundManager.playPop();
    const next = easterEggClicks + 1;
    setEasterEggClicks(next);
    if (next >= 4 && !showEasterEgg) {
      soundManager.playYay();
      setShowEasterEgg(true);
      fireCuteConfetti();
      fireHearts();
    }
  };

  return (
    <section id="note" className="py-20 px-4 sm:px-8 bg-gradient-to-b from-[#FFF9FA] to-[#FFF1F6] overflow-hidden">
      <div className="max-w-3xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-8">
          <div className="inline-block px-3.5 py-1 bg-[#FFD6E8] text-[#8B1E4B] border border-[#3B1B3C] rounded-full text-xs font-retro font-bold mb-2 shadow-xs">
            NURSERY POSTCARD · DELIVERED WITH LOVE 💌
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#751A3D] tracking-tight">
            a tiny note for you ♡
          </h2>
        </div>

        {/* Pastel Letter Postcard */}
        <div className="card-hover relative bg-[#FFFDF9] border-3 border-[#3B1B3C] rounded-3xl p-8 sm:p-12 shadow-retro-plum-lg bg-polka-pattern">
          {/* Postcard Stamps & Corner Bow */}
          <div className="sticker-hover absolute top-4 left-6 text-2xl cursor-default">
            🎀
          </div>
          <div className="absolute top-4 right-6 flex items-center gap-2">
            <span className="text-xs font-retro text-[#A2678A]">AIR MAIL · CLOUD 9</span>
            {/* Hidden Easter Egg Trigger (Twinkling Teddy Sticker) */}
            <button
              onClick={handleEasterEggClick}
              className={`w-9 h-9 rounded-2xl border-2 border-[#3B1B3C] flex items-center justify-center text-lg transition-transform hover:scale-125 cursor-pointer shadow-retro-plum-sm ${
                showEasterEgg ? 'bg-[#FFE66D] animate-wiggle' : 'bg-[#FFF0F5] hover:bg-[#FFE66D]'
              }`}
              title="A tiny mysterious teddy sticker... 🧸"
            >
              <span>🧸</span>
            </button>
          </div>

          {/* Letter Body */}
          <div className="my-4 max-w-lg mx-auto bg-white/90 p-6 sm:p-8 rounded-3xl border-2 border-[#FFC2DB] shadow-xs transition-transform hover:scale-[1.01]">
            <p className="text-sm sm:text-base text-[#751A3D] font-display font-bold mb-3 leading-relaxed">
              dear little dreamer,
            </p>

            <p className="text-sm sm:text-base text-[#5C233E] font-medium leading-relaxed mb-4">
              i hope you find a little magic today, a cozy place to rest, and at least one reason to smile.
            </p>

            <p className="text-sm sm:text-base text-[#751A3D] font-bold mb-5">
              don't forget to take your naps!
            </p>

            <div className="flex items-center justify-between border-t border-[#3B1B3C]/10 pt-4">
              <div>
                <p className="text-sm text-[#8B1E4B] font-display font-extrabold">
                  lots of tiny love,
                </p>
                <p className="text-lg text-[#FF5964] font-display font-extrabold">
                  ted ♡
                </p>
              </div>

              {/* Ted Sticker on Postcard */}
              <div className="w-16 h-16 pointer-events-none">
                <PipCharacter pose="star-hug" expression="sparkle" size="xs" />
              </div>
            </div>
          </div>

          {/* Interactive Button */}
          <div className="flex flex-col items-center justify-center mt-6">
            <button
              onClick={handleSendLove}
              className="btn-chunky px-6 py-3 text-sm sm:text-base font-extrabold text-white bg-[#FF70B8] hover:bg-[#FF599F] border-3 border-[#3B1B3C] rounded-2xl shadow-retro-plum flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-current text-white" />
              <span>send me a little love ♡</span>
            </button>

            {loveCount > 0 && (
              <p className="text-xs sm:text-sm font-bold text-[#8B1E4B] mt-3 animate-bounce-subtle">
                Ted received your warm hug! His little cheeks are blushing pink! 💖 ({loveCount} hugs sent)
              </p>
            )}
          </div>

          {/* Hidden Easter Egg Reveal Banner */}
          {showEasterEgg && (
            <div className="mt-8 p-6 bg-[#FEFCE8] border-3 border-[#3B1B3C] rounded-3xl shadow-retro-plum animate-bounce-subtle text-center">
              <div className="text-3xl mb-2">✨💌✨</div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#751A3D] mb-1">
                pssst... ted saved one extra dream just for you. ♡
              </h3>
              <p className="text-xs sm:text-sm text-[#713F12] max-w-md mx-auto leading-relaxed my-2 font-medium">
                May your pillow always stay cool, your nightlights glow softly, and tomorrow bring you sweet surprises!
              </p>
              <button
                onClick={() => {
                  soundManager.playYay();
                  fireHearts();
                }}
                className="btn-chunky mt-2 px-5 py-2 text-xs font-bold bg-[#FF70B8] text-white border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm cursor-pointer"
              >
                Keep This Dream Warm Forever 💖
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
