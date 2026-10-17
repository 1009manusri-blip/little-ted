import React from 'react';
import { soundManager } from '../utils/soundEffects';

interface FooterProps {
  onNavigate: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#FFF4F8] border-t-2 border-[#FFD6E8] py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Note */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-extrabold text-[#751A3D]">ted's little dreamland ♡</span>
            <span>🍼</span>
          </div>
          <p className="text-xs text-[#8B3A62]">
            Junior Dream Engineer at the Midnight Nursery. Made with 💖, crayons & warm lullabies.
          </p>
          <p className="text-[10px] text-[#A2678A] font-retro mt-1">
            haX.baby Character Portfolio · Best viewed with sweet dreams.
          </p>
        </div>

        {/* Four Clean Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-[#8B3A62]">
          <button
            onClick={() => {
              soundManager.playPop();
              onNavigate('home');
            }}
            className="hover:text-[#FF70B8] transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              onNavigate('profile');
            }}
            className="hover:text-[#FF70B8] transition-colors cursor-pointer"
          >
            Meet Ted
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              onNavigate('creations');
            }}
            className="hover:text-[#FF70B8] transition-colors cursor-pointer"
          >
            Creations
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              onNavigate('story');
            }}
            className="hover:text-[#FF70B8] transition-colors cursor-pointer"
          >
            Ted's Story
          </button>
        </div>
      </div>
    </footer>
  );
};
