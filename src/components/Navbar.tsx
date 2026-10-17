import React from 'react';
import { Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface NavbarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  chaosMode: boolean;
  onToggleChaos: () => void;
  onTriggerSurprise: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMuted,
  onToggleMute,
  chaosMode,
  onToggleChaos,
  onTriggerSurprise,
  activeSection,
  onNavigate,
}) => {
  const handleNavClick = (id: string) => {
    soundManager.playPop();
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFF9F5]/94 backdrop-blur-md border-b-2 border-[#FFD1E3] px-3 sm:px-8 py-2.5 sm:py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-8">
        {/* Zone 1: Custom-Designed Kawaii Character Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="group flex items-center gap-2.5 p-1 sm:p-1.5 rounded-2xl bg-white/80 hover:bg-white border-2 border-[#3B1B3C] shadow-retro-plum-sm transition-all hover:scale-105 whitespace-nowrap shrink-0 cursor-pointer"
          title="Ted's Little Dreamland - Home"
        >
          {/* Mini Ted SVG Face Mascot Icon */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 relative shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
              {/* Ears */}
              <circle cx="26" cy="28" r="14" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3.5" />
              <circle cx="26" cy="28" r="8" fill="#FFC9D9" />
              <circle cx="74" cy="28" r="14" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3.5" />
              <circle cx="74" cy="28" r="8" fill="#FFC9D9" />
              {/* Head */}
              <circle cx="50" cy="56" r="34" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3.5" />
              {/* Cheeks */}
              <ellipse cx="32" cy="62" rx="6" ry="3.5" fill="#FF8CA3" opacity="0.75" />
              <ellipse cx="68" cy="62" rx="6" ry="3.5" fill="#FF8CA3" opacity="0.75" />
              {/* Snout */}
              <ellipse cx="50" cy="64" rx="14" ry="10" fill="#FFF2E2" stroke="#3B1B3C" strokeWidth="2" />
              {/* Nose */}
              <path d="M 46 59 C 46 56 54 56 54 59 C 54 62 50 63 50 63 C 50 63 46 62 46 59 Z" fill="#8B3A62" />
              {/* Smile */}
              <path d="M 46 66 Q 50 69 54 66" fill="none" stroke="#3B1B3C" strokeWidth="2" strokeLinecap="round" />
              {/* Eyes */}
              <circle cx="38" cy="50" r="3" fill="#3B1B3C" />
              <circle cx="37" cy="49" r="1" fill="#FFF" />
              <circle cx="62" cy="50" r="3" fill="#3B1B3C" />
              <circle cx="61" cy="49" r="1" fill="#FFF" />
              {/* Tiny yellow star pin on ear */}
              <polygon points="76,18 78,24 84,24 79,27 81,33 76,29 71,33 73,27 68,24 74,24" fill="#FFE66D" stroke="#3B1B3C" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Typography Lockup */}
          <div className="flex flex-col text-left leading-none pr-1">
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-xl font-extrabold tracking-tight text-[#751A3D] font-display">
                Ted's
              </span>
              <span className="text-xs sm:text-sm text-[#FF70B8] group-hover:rotate-12 transition-transform">
                ♡
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-retro font-bold text-[#A24269] tracking-wider uppercase mt-0.5">
              little dreamland
            </span>
          </div>
        </a>

        {/* Zone 2: Exactly 4 clean single-line nav links with playful hover effects */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-semibold">
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'profile', label: 'Meet Ted', icon: '🧸' },
            { id: 'creations', label: 'Creations', icon: '🎨' },
            { id: 'story', label: "Ted's Story", icon: '📖' },
          ].map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group relative px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#C41E3A] bg-[#FFEBF2] border border-[#FFCCD5] shadow-retro-plum-sm font-bold'
                    : 'text-[#8B3A62] hover:text-[#C41E3A] hover:bg-white/80 hover:-translate-y-0.5'
                }`}
              >
                <span className={`text-xs transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-125'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF70B8] animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Quick Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Audio Mute Button */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute gentle sounds" : "Mute sounds"}
            className="p-1.5 sm:p-2 rounded-xl border border-[#FBCFE8] bg-white hover:bg-[#FFF0F5] hover:scale-105 active:scale-95 text-[#8B1E4B] shadow-sm transition-all duration-200 cursor-pointer"
            title={isMuted ? "Unmute gentle sounds" : "Mute sounds"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-[#E11D48] transition-transform hover:scale-110" />}
          </button>

          {/* Dream Sparkles Mode Toggle */}
          <button
            onClick={onToggleChaos}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
              chaosMode 
                ? 'bg-[#FFE66D] border-[#3B1B3C] text-[#3B1B3C] shadow-retro-plum-sm animate-wiggle' 
                : 'bg-white border-[#FBCFE8] text-[#8B3A62] hover:bg-[#FFF5F8] hover:border-[#FFB3D1]'
            }`}
            title="Toggle Dream Sparkles"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF70B8] group-hover:rotate-12 transition-transform" />
            <span>{chaosMode ? 'Sparkles: ON' : 'Dream Sparkles'}</span>
          </button>

          {/* 1 Primary Action CTA Button */}
          <button
            onClick={onTriggerSurprise}
            className="btn-chunky px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold text-white bg-[#FF70B8] hover:bg-[#FF599F] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Dream Gift</span>
            <span className="hover-spin-star">✨</span>
          </button>
        </div>
      </div>

      {/* Mobile Touch-Friendly Sub Nav */}
      <div className="flex md:hidden items-center justify-around pt-2 border-t border-[#FFD6E8] mt-2 text-xs font-bold text-[#8B3A62]">
        {[
          { id: 'home', label: 'Home' },
          { id: 'profile', label: 'Meet Ted' },
          { id: 'creations', label: 'Creations' },
          { id: 'story', label: "Ted's Story" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`py-1 px-2 rounded-lg transition-colors ${
              activeSection === item.id ? 'text-[#C41E3A] bg-[#FFEBF2] border-b-2 border-[#FF70B8]' : 'hover:text-[#FF70B8]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
