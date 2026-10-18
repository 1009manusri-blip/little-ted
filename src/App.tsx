/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MarqueeBanner } from './components/MarqueeBanner';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CreationsSection } from './components/CreationsSection';
import { GrowthChartSection } from './components/GrowthChartSection';
import { StorySection } from './components/StorySection';
import { TinyNoteSection } from './components/TinyNoteSection';
import { SurpriseModal } from './components/SurpriseModal';
import { SparkleCursor } from './components/SparkleCursor';
import { Footer } from './components/Footer';
import { TedChatWidget } from './components/TedChatWidget';
import { soundManager } from './utils/soundEffects';
import { fireCuteConfetti } from './utils/confetti';

export default function App() {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [chaosMode, setChaosMode] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Master audio toggle
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playPop();
    }
  };

  // Sparkles mode toggle
  const handleToggleChaos = () => {
    soundManager.playYay();
    const newChaos = !chaosMode;
    setChaosMode(newChaos);
    if (newChaos) {
      document.body.classList.add('chaos-mode');
      fireCuteConfetti();
    } else {
      document.body.classList.remove('chaos-mode');
    }
  };

  // Trigger surprise gift modal
  const handleTriggerSurprise = () => {
    soundManager.playYay();
    fireCuteConfetti();
    setIsSurpriseOpen(true);
  };

  // Smooth scroll to sections
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // IntersectionObserver to update active navigation tab on scroll
  useEffect(() => {
    const sectionIds = ['home', 'profile', 'creations', 'story', 'note'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 180;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col font-body ${chaosMode ? 'chaos-glow' : ''}`}>
      {/* Sparkle Cursor for desktop */}
      <SparkleCursor />

      {/* Top Bar with 4 Links */}
      <Navbar
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        chaosMode={chaosMode}
        onToggleChaos={handleToggleChaos}
        onTriggerSurprise={handleTriggerSurprise}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Retro Marquee Announcement */}
      <MarqueeBanner />

      {/* Main Content Sections (Strict 1-7 Natural Flow) */}
      <main className="flex-1">
        {/* 1. HERO — TED'S LITTLE INTRODUCTION */}
        <HeroSection
          onPeekCreations={() => scrollToSection('creations')}
          onMyStory={() => scrollToSection('story')}
        />

        {/* 2. BABY PROFILE — ALL ABOUT LITTLE TED 🍼 */}
        <AboutSection />

        {/* 3. TINY CREATIONS — 4 INTERACTIVE SHOWCASES ♡ */}
        <CreationsSection />

        {/* 4. GROWTH CHART — LOOK HOW MUCH I'VE GROWN! 📏 */}
        <GrowthChartSection />

        {/* 5. ORIGIN STORY — HOW THIS TINY DREAM MAKER BEGAN 📖 */}
        <StorySection />

        {/* 6. TINY NOTE — A TINY NOTE FOR YOU & HIDDEN SURPRISE 💌 */}
        <TinyNoteSection />
      </main>

      {/* Surprise Gift Modal */}
      <SurpriseModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
      />

      {/* 7. FOOTER */}
      <Footer onNavigate={scrollToSection} />

      {/* 8. TALK TO TED ♡ FLOATING AI CHATBOT */}
      <TedChatWidget />
    </div>
  );
}
