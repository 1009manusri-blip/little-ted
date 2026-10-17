import React, { useState, useEffect } from 'react';
import { GuestbookEntry } from '../types';
import { INITIAL_GUESTBOOK } from '../data/initialData';
import { soundManager } from '../utils/soundEffects';
import { fireCuteConfetti } from '../utils/confetti';
import { Heart, Send, Sparkles, MessageSquareHeart } from 'lucide-react';

export const GuestbookSection: React.FC = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>(() => {
    try {
      const saved = localStorage.getItem('hax_guestbook_entries');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_GUESTBOOK;
  });

  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState<'pink' | 'lavender' | 'yellow' | 'mint' | 'blue'>('pink');
  const [selectedStamp, setSelectedStamp] = useState('🎀');
  const [errorMessage, setErrorMessage] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hax_guestbook_entries', JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries]);

  const stamps = ['🎀', '🧸', '🍓', '⭐', '💾', '🐱', '🌸', '🍭'];

  const colorStyles = {
    pink: 'bg-[#FFF0F5] border-[#FFC2DB] text-[#751A3D]',
    lavender: 'bg-[#F5F0FF] border-[#DDD0FF] text-[#4A1D6E]',
    yellow: 'bg-[#FEFCE8] border-[#FEF08A] text-[#713F12]',
    mint: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#14532D]',
    blue: 'bg-[#F0F9FF] border-[#BAE6FD] text-[#0C4A6E]',
  };

  const handleClap = (id: string, e: React.MouseEvent) => {
    soundManager.playPop();
    setEntries(prev =>
      prev.map(item => (item.id === id ? { ...item, claps: item.claps + 1 } : item))
    );
    const rect = e.currentTarget.getBoundingClientRect();
    fireCuteConfetti({
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) {
      setErrorMessage('Please write your name and a sweet note! 💖');
      return;
    }

    soundManager.playYay();
    fireCuteConfetti();

    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      name: author.trim(),
      location: location.trim() || 'Internet Wanderer',
      message: message.trim(),
      timestamp: 'Just now',
      color: selectedColor,
      stamp: selectedStamp,
      claps: 1,
    };

    setEntries(prev => [newEntry, ...prev]);
    setAuthor('');
    setLocation('');
    setMessage('');
    setErrorMessage('');
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 2500);
  };

  return (
    <section id="guestbook" className="py-16 px-4 sm:px-8 bg-[#FFF8FA] border-b-2 border-[#FFD6E8]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-block px-3 py-1 bg-[#FFD6E8] text-[#8B1E4B] border border-[#3B1B3C] rounded-full text-xs font-retro font-bold mb-2">
            EXHIBIT D // SIGN THE Y2K GUESTBOOK
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#751A3D] tracking-tight">
            Digital Guestbook 💌
          </h2>
          <p className="text-[#6B2848] text-sm sm:text-base font-medium mt-1">
            Leave a cute note in our community scrapbook! Persists locally in your browser so your memories stay warm.
          </p>
        </div>

        {/* 2-Column Layout: Form on Left, Notes on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sign Form */}
          <div className="lg:col-span-5 bg-white border-3 border-[#3B1B3C] rounded-3xl p-6 shadow-retro-plum-lg">
            <h3 className="text-base font-extrabold text-[#751A3D] mb-1 flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-[#FF70B8]" />
              <span>Leave Your Mark</span>
            </h3>
            <p className="text-xs text-[#8B3A62] mb-4">
              Pick a pastel paper color & your favorite sticker stamp!
            </p>

            {errorMessage && (
              <div className="mb-3 p-2 bg-[#FEE2E2] border border-[#F87171] text-[#991B1B] text-xs font-semibold rounded-xl">
                {errorMessage}
              </div>
            )}

            {justSubmitted && (
              <div className="mb-3 p-2 bg-[#DCFCE7] border border-[#22C55E] text-[#15803D] text-xs font-semibold rounded-xl text-center">
                ✨ Your message has been pasted into the scrapbook!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#751A3D] mb-1">Your Name / Handle</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  placeholder="e.g. Sailor Moon 99"
                  className="w-full px-3 py-2 text-xs bg-[#FFFDF9] border-2 border-[#FFC2DB] focus:border-[#FF70B8] focus:outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#751A3D] mb-1">Where are you visiting from?</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Planet Kawaii / Kyoto"
                  className="w-full px-3 py-2 text-xs bg-[#FFFDF9] border-2 border-[#FFC2DB] focus:border-[#FF70B8] focus:outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#751A3D] mb-1">Your Cute Message</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Leave a sweet thought, cheer, or early-web memory..."
                  className="w-full px-3 py-2 text-xs bg-[#FFFDF9] border-2 border-[#FFC2DB] focus:border-[#FF70B8] focus:outline-none rounded-xl"
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-xs font-bold text-[#751A3D] mb-1.5 font-retro">Paper Color:</label>
                <div className="flex items-center gap-2">
                  {(['pink', 'lavender', 'yellow', 'mint', 'blue'] as const).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        soundManager.playPop();
                        setSelectedColor(c);
                      }}
                      className={`w-7 h-7 rounded-xl border-2 transition-transform cursor-pointer ${
                        c === 'pink' ? 'bg-[#FFD1E3]' :
                        c === 'lavender' ? 'bg-[#E9D5FF]' :
                        c === 'yellow' ? 'bg-[#FEF08A]' :
                        c === 'mint' ? 'bg-[#BBF7D0]' : 'bg-[#BAE6FD]'
                      } ${selectedColor === c ? 'border-[#3B1B3C] scale-110 shadow-retro-plum-sm' : 'border-transparent'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Stamp Picker */}
              <div>
                <label className="block text-xs font-bold text-[#751A3D] mb-1.5 font-retro">Sticker Stamp:</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {stamps.map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        soundManager.playPop();
                        setSelectedStamp(st);
                      }}
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center text-sm cursor-pointer transition-all ${
                        selectedStamp === st
                          ? 'bg-[#FFE66D] border-[#3B1B3C] scale-105 shadow-retro-plum-sm'
                          : 'bg-[#FFF8FA] border-[#FBCFE8] hover:bg-[#FFEBF2]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn-chunky w-full py-2.5 text-xs font-extrabold text-[#3B1B3C] bg-[#FFE66D] hover:bg-[#FFDF4D] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Note to Guestbook</span>
              </button>
            </form>
          </div>

          {/* Right Column: Display of Notes */}
          <div className="lg:col-span-7 space-y-4 max-h-[560px] overflow-y-auto pr-1">
            {entries.map(entry => (
              <div
                key={entry.id}
                className={`relative p-5 border-2 border-[#3B1B3C] rounded-3xl shadow-retro-plum-sm transition-transform hover:-translate-y-0.5 ${
                  colorStyles[entry.color] || colorStyles.pink
                }`}
              >
                {/* Stamp Icon */}
                <div className="absolute top-4 right-4 text-2xl drop-shadow-xs">
                  {entry.stamp}
                </div>

                {/* Header */}
                <div className="mb-2">
                  <h4 className="text-sm font-extrabold text-[#3B1B3C]">{entry.name}</h4>
                  <div className="text-[10px] font-retro text-[#753356] flex items-center gap-2">
                    <span>📍 {entry.location}</span>
                    <span>·</span>
                    <span>{entry.timestamp}</span>
                  </div>
                </div>

                {/* Message */}
                <p className="text-xs leading-relaxed font-medium mb-3 pr-8 whitespace-pre-wrap">
                  {entry.message}
                </p>

                {/* Bottom Bar / Reaction */}
                <div className="flex items-center justify-between border-t border-[#3B1B3C]/15 pt-2">
                  <span className="text-[10px] font-retro text-[#8B3A62]">
                    Verified Guestbook Entry
                  </span>

                  <button
                    onClick={e => handleClap(entry.id, e)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-white/80 hover:bg-white text-[#E11D48] border border-[#3B1B3C]/30 rounded-xl transition-transform active:scale-90 cursor-pointer"
                    title="Send love"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span className="tabular-nums">{entry.claps}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
