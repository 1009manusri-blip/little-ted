import React, { useState, useEffect } from 'react';
import { X, Sparkles, Heart, RefreshCw, Bookmark, Copy, Check, BookOpen, Layers } from 'lucide-react';
import { INTRUSIVE_THOUGHTS, IntrusiveThought } from '../data/intrusiveThoughts';
import { soundManager } from '../utils/soundEffects';
import { fireCuteConfetti, fireHearts } from '../utils/confetti';

interface IntrusiveThoughtsModalProps {
  // Allow optional controlled state or standalone floating mode
  isOpen?: boolean;
  onClose?: () => void;
}

export const IntrusiveThoughtsModal: React.FC<IntrusiveThoughtsModalProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (controlledOnClose && !open) {
      controlledOnClose();
    } else {
      setInternalIsOpen(open);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * INTRUSIVE_THOUGHTS.length));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFlipping, setIsFlipping] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('ted_favorite_thoughts');
      return saved ? JSON.parse(saved) : [1, 10, 12];
    } catch {
      return [1, 10, 12];
    }
  });

  const [relatableCounts, setRelatableCounts] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('ted_relatable_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [hasCopied, setHasCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'archive'>('card');

  const currentThought = INTRUSIVE_THOUGHTS[currentIndex] || INTRUSIVE_THOUGHTS[0];

  const filteredThoughts = selectedCategory === 'all'
    ? INTRUSIVE_THOUGHTS
    : INTRUSIVE_THOUGHTS.filter((t) => t.category === selectedCategory);

  const handleNextThought = () => {
    soundManager.playPop();
    setIsFlipping(true);

    setTimeout(() => {
      let pool = filteredThoughts;
      if (pool.length <= 1) {
        pool = INTRUSIVE_THOUGHTS;
      }
      // Pick a random thought different from current
      const nextCandidates = pool.filter((t) => t.id !== currentThought.id);
      const chosen = nextCandidates.length > 0
        ? nextCandidates[Math.floor(Math.random() * nextCandidates.length)]
        : pool[0];

      const newIdx = INTRUSIVE_THOUGHTS.findIndex((t) => t.id === chosen.id);
      setCurrentIndex(newIdx !== -1 ? newIdx : 0);
      setIsFlipping(false);
      soundManager.playChime();
    }, 140);
  };

  const handleToggleFavorite = (thought: IntrusiveThought) => {
    soundManager.playGiggle();
    setFavorites((prev) => {
      const isFav = prev.includes(thought.id);
      const next = isFav ? prev.filter((id) => id !== thought.id) : [...prev, thought.id];
      try {
        localStorage.setItem('ted_favorite_thoughts', JSON.stringify(next));
      } catch {
        // ignore
      }
      if (!isFav) {
        fireHearts();
      }
      return next;
    });
  };

  const handleRelatableClick = (thought: IntrusiveThought) => {
    soundManager.playYay();
    fireCuteConfetti();
    setRelatableCounts((prev) => {
      const current = prev[thought.id] || thought.relatableBase;
      const next = { ...prev, [thought.id]: current + 1 };
      try {
        localStorage.setItem('ted_relatable_counts', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleCopy = () => {
    soundManager.playPop();
    const textToCopy = `“${currentThought.thought}” — ted's brain at ${currentThought.time} 🧸💭`;
    navigator.clipboard?.writeText(textToCopy).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2200);
    });
  };

  const isFavorite = favorites.includes(currentThought.id);
  const currentRelatableCount = relatableCounts[currentThought.id] || currentThought.relatableBase;

  return (
    <>
      {/* 1. TINY FLOATING ICON (BOTTOM-RIGHT) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center group">
          {/* Cute hover tooltip */}
          <div className="absolute right-full mr-3 px-3 py-1.5 bg-[#FFF2F6] border-2 border-[#3B1B3C] rounded-2xl shadow-retro-plum-sm text-xs font-retro font-bold text-[#8B1E4B] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap hidden sm:flex items-center gap-1.5 z-50">
            <span>pssst… ted has thoughts 💭</span>
          </div>

          <button
            onClick={() => {
              soundManager.playPop();
              setIsOpen(true);
            }}
            className="btn-chunky relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#FFFDF7] hover:bg-[#FFEBF2] border-3 border-[#3B1B3C] rounded-full shadow-retro-plum cursor-pointer transition-all hover:scale-105 active:scale-95"
            title="listen to my intrusive thoughts 💭"
            aria-label="listen to my intrusive thoughts"
          >
            {/* Thought Doodle Icon */}
            <div className="w-8 h-8 rounded-full bg-[#FFE66D] border-2 border-[#3B1B3C] flex items-center justify-center text-base shadow-xs shrink-0 animate-bounce-subtle">
              💭
            </div>

            {/* Playful Label */}
            <div className="flex flex-col text-left pr-1">
              <span className="text-xs sm:text-sm font-extrabold text-[#751A3D] font-display leading-tight flex items-center gap-1">
                <span>listen to my intrusive thoughts</span>
                <span className="text-[#FF70B8] group-hover:rotate-12 transition-transform">✨</span>
              </span>
              <span className="text-[10px] text-[#A24269] font-retro font-bold">ted's brain at 3:07 am 🌙</span>
            </div>

            {/* Tiny Floating Sparkle */}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF70B8] border-2 border-[#3B1B3C] rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF70B8] border-2 border-[#3B1B3C] rounded-full" />
          </button>
        </div>
      )}

      {/* 2. TED'S SECRET NOTEBOOK MODAL */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ted's secret notebook of intrusive thoughts"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/55 backdrop-blur-xs animate-in fade-in duration-200"
        >
          {/* Notebook Binder Container */}
          <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-[#FFFDF7] border-4 border-[#3B1B3C] rounded-3xl shadow-[8px_8px_0px_#3B1B3C] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Spiral Binder Ring Header Bar */}
            <div className="bg-[#FFE4EC] border-b-3 border-[#3B1B3C] px-4 py-2 flex items-center justify-between shrink-0 relative select-none">
              {/* Fake notebook binder spirals */}
              <div className="hidden sm:flex items-center gap-4 text-[#3B1B3C]/40 text-xs font-mono font-bold">
                <span>◯───◯</span>
                <span>◯───◯</span>
                <span>◯───◯</span>
                <span>◯───◯</span>
                <span>◯───◯</span>
              </div>

              {/* Pink Sticker Close Button */}
              <button
                onClick={() => {
                  soundManager.playPop();
                  setIsOpen(false);
                }}
                className="ml-auto w-8 h-8 rounded-full bg-[#FF70B8] hover:bg-[#FF4D94] border-2 border-[#3B1B3C] text-white font-extrabold flex items-center justify-center text-sm shadow-retro-plum-sm cursor-pointer transition-transform hover:scale-110 active:scale-90"
                aria-label="Close Ted's notebook"
                title="Close notebook sticker"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Notebook Cover Title & Sticky Note */}
            <div className="bg-[#FFF9FA] border-b-2 border-[#FFD6E8] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-start gap-3">
                {/* Ted Mascot Doodle Face */}
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] border-2 border-[#3B1B3C] p-1 shadow-retro-plum-sm shrink-0 flex items-center justify-center text-2xl">
                  🧸
                </div>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-[#751A3D] font-display tracking-tight leading-none">
                      ted's brain at 3:07 am
                    </h2>
                    <span className="text-xs">💭</span>
                  </div>
                  <p className="text-xs font-display font-bold text-[#A24269] mt-1">
                    private thoughts. unfortunately, you can read them.
                  </p>
                </div>
              </div>

              {/* Taped Sticky Note: "mommy said to use my inside voice..." */}
              <div className="relative bg-[#FFF9C4] border-2 border-[#3B1B3C] rounded-xl px-3 py-1.5 shadow-retro-plum-sm rotate-1 sm:rotate-2 self-start sm:self-auto max-w-xs">
                {/* Washi tape effect */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-[#FFCCD5]/80 border border-[#3B1B3C]/20 -rotate-2" />
                <p className="text-[11px] font-display font-extrabold text-[#78350F] leading-tight italic">
                  “mommy said to use my inside voice. this is my inside voice.” 🧸
                </p>
              </div>
            </div>

            {/* Category Filter Chips & View Mode Switch */}
            <div className="px-4 py-2 bg-[#FFF3F7] border-b border-[#FFCCD5] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'all', label: 'all thoughts ✨' },
                  { id: '3am logic', label: '3am logic 🌙' },
                  { id: 'drama', label: 'pure drama 🎭' },
                  { id: 'food nonsense', label: 'food nonsense 🍪' },
                  { id: 'overthinking', label: 'overthinking 🌀' },
                  { id: 'teddy secrets', label: 'teddy secrets 🤫' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundManager.playPop();
                      setSelectedCategory(cat.id);
                    }}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#FF70B8] text-white border-2 border-[#3B1B3C] shadow-retro-plum-sm'
                        : 'bg-white text-[#8B1E4B] border border-[#FBCFE8] hover:bg-[#FFEBF2]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  soundManager.playPop();
                  setViewMode(viewMode === 'card' ? 'archive' : 'card');
                }}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-[#FFE66D] border-2 border-[#3B1B3C] rounded-xl text-[11px] font-retro font-bold text-[#3B1B3C] shadow-retro-plum-sm cursor-pointer flex items-center gap-1 shrink-0"
              >
                {viewMode === 'card' ? (
                  <>
                    <Layers className="w-3 h-3" />
                    <span>all entries ({filteredThoughts.length})</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3 h-3" />
                    <span>single card view</span>
                  </>
                )}
              </button>
            </div>

            {/* Notebook Main Content Area (Lined paper aesthetic) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-notebook-pattern bg-white/70 flex flex-col justify-between min-h-[290px]">
              {viewMode === 'card' ? (
                /* SINGLE DIARY ENTRY CARD */
                <div
                  className={`relative flex flex-col justify-between h-full bg-[#FFFDF9] border-3 border-[#3B1B3C] rounded-3xl p-5 sm:p-7 shadow-retro-plum transition-all duration-150 ${
                    isFlipping ? 'opacity-40 scale-95 rotate-1' : 'opacity-100 scale-100 rotate-0'
                  }`}
                >
                  {/* Decorative Washi Tape on card corners */}
                  <div className="absolute -top-3 left-6 w-12 h-4 bg-[#FFC2DB]/90 border border-[#3B1B3C] -rotate-3 rounded-xs pointer-events-none" />
                  <div className="absolute -top-3 right-6 w-12 h-4 bg-[#FFE66D]/90 border border-[#3B1B3C] rotate-3 rounded-xs pointer-events-none" />

                  {/* Thought Header: Counter & Time stamp */}
                  <div className="flex items-center justify-between text-xs font-retro font-bold text-[#8B3A62] pb-3 border-b-2 border-dashed border-[#FFCCD5]">
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">{currentThought.doodle}</span>
                      <span>thought #{String(currentThought.id).padStart(2, '0')} from ted's questionable brain</span>
                    </span>
                    <span className="bg-[#FFEBF2] px-2.5 py-0.5 rounded-full border border-[#FFCCD5] text-[10px]">
                      {currentThought.time}
                    </span>
                  </div>

                  {/* Main Thought Text */}
                  <div className="my-6 sm:my-8 text-center flex flex-col items-center justify-center">
                    <p className="text-xl sm:text-2xl font-extrabold text-[#5C1D38] font-display leading-snug tracking-tight max-w-lg select-text">
                      “{currentThought.thought}”
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-retro text-[#A2678A]">
                      <span>category: {currentThought.category}</span>
                      <span>•</span>
                      <span>scrawled in pink glitter gel pen</span>
                    </div>
                  </div>

                  {/* Interactive Buttons (Relatable, Favorite, Copy) */}
                  <div className="pt-3 border-t-2 border-dashed border-[#FFCCD5] flex flex-wrap items-center justify-between gap-2.5">
                    {/* Relatable Reaction Button */}
                    <button
                      onClick={() => handleRelatableClick(currentThought)}
                      className="px-3.5 py-1.5 bg-[#FFF0F5] hover:bg-[#FFE0EC] border-2 border-[#3B1B3C] rounded-2xl text-xs font-bold text-[#8B1E4B] shadow-retro-plum-sm cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                      title="Click if this thought hits a little too close to home"
                    >
                      <span>😭 this one is unfortunately relatable</span>
                      <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-retro border border-[#3B1B3C]/20 font-bold">
                        {currentRelatableCount}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Heart Favorite Button */}
                      <button
                        onClick={() => handleToggleFavorite(currentThought)}
                        className={`p-2 rounded-2xl border-2 border-[#3B1B3C] shadow-retro-plum-sm cursor-pointer transition-transform hover:scale-110 active:scale-95 flex items-center gap-1 text-xs font-bold ${
                          isFavorite ? 'bg-[#FF70B8] text-white' : 'bg-white hover:bg-[#FFF0F5] text-[#8B1E4B]'
                        }`}
                        title={isFavorite ? 'Saved in Ted\'s favorite diary pages' : 'Save to favorites'}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>

                      {/* Copy Thought Button */}
                      <button
                        onClick={handleCopy}
                        className="p-2 bg-white hover:bg-[#FFE66D] border-2 border-[#3B1B3C] rounded-2xl text-[#3B1B3C] shadow-retro-plum-sm cursor-pointer transition-transform hover:scale-110 active:scale-95 flex items-center gap-1 text-xs font-bold"
                        title="Copy to clipboard"
                      >
                        {hasCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ARCHIVE BROWSER VIEW (Read all thoughts) */
                <div className="space-y-3.5 max-h-[380px] pr-1">
                  {filteredThoughts.map((t) => {
                    const isFav = favorites.includes(t.id);
                    const count = relatableCounts[t.id] || t.relatableBase;
                    return (
                      <div
                        key={t.id}
                        className="bg-[#FFFDF9] border-2 border-[#3B1B3C] rounded-2xl p-3.5 shadow-retro-plum-sm flex flex-col gap-2 hover:bg-[#FFF9FB] transition-colors"
                      >
                        <div className="flex items-center justify-between text-[11px] font-retro text-[#8B3A62]">
                          <span className="font-bold flex items-center gap-1">
                            <span>{t.doodle}</span>
                            <span>#{String(t.id).padStart(2, '0')}</span>
                            <span className="text-[#A24269]">· {t.category}</span>
                          </span>
                          <span>{t.time}</span>
                        </div>
                        <p className="text-sm font-extrabold text-[#5C1D38] font-display leading-snug">
                          “{t.thought}”
                        </p>
                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <button
                            onClick={() => handleRelatableClick(t)}
                            className="text-[#8B1E4B] hover:text-[#C41E3A] font-bold cursor-pointer"
                          >
                            😭 relatable ({count})
                          </button>
                          <button
                            onClick={() => handleToggleFavorite(t)}
                            className={`flex items-center gap-1 font-bold cursor-pointer ${
                              isFav ? 'text-[#FF70B8]' : 'text-gray-400 hover:text-[#FF70B8]'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                            <span>{isFav ? 'favorite' : 'fav'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Controls Bar: "another thought, unfortunately ↻" */}
            <div className="p-3.5 sm:p-4 bg-[#FFF5F8] border-t-3 border-[#3B1B3C] flex items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] font-retro text-[#8B3A62] font-bold hidden sm:inline">
                ted's brain capacity: 100% full of nonsense 🧠
              </span>

              {/* Main Action Button */}
              <button
                onClick={handleNextThought}
                className="btn-chunky w-full sm:w-auto px-6 py-3 bg-[#FFE66D] hover:bg-[#FFDF4D] border-3 border-[#3B1B3C] rounded-2xl text-sm sm:text-base font-extrabold text-[#3B1B3C] shadow-retro-plum flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <span>another thought, unfortunately</span>
                <span className="text-lg transition-transform group-hover:rotate-180">↻</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IntrusiveThoughtsModal;
