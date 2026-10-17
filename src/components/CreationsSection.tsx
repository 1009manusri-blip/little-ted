import React, { useState, useEffect } from 'react';
import { PipCharacter } from './PipCharacter';
import { soundManager } from '../utils/soundEffects';
import { fireCuteConfetti, fireHearts } from '../utils/confetti';
import {
  Play,
  Pause,
  Square,
  Music,
  Lightbulb,
  Send,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { MusicBox3D } from './3d/MusicBox3D';
import { Nightlight3D } from './3d/Nightlight3D';
import { DreamDelivery3D } from './3d/DreamDelivery3D';

export const CreationsSection: React.FC = () => {
  // --- PROJECT 1: TED'S TINY LULLABY BOX (6 DISTINCT LULLABIES) ---
  const [isLullabyPlaying, setIsLullabyPlaying] = useState(soundManager.isLullabyPlaying());
  const [currentLullabyStep, setCurrentLullabyStep] = useState(0);
  const [selectedSongId, setSelectedSongId] = useState<string>(soundManager.getCurrentSongId());
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());

  const lullabies = soundManager.getLullabies();

  useEffect(() => {
    const unsubscribe = soundManager.subscribeLullaby((playing, step, songId) => {
      setIsLullabyPlaying(playing);
      setCurrentLullabyStep(step);
      if (songId) setSelectedSongId(songId);
    });
    return () => {
      unsubscribe();
      soundManager.stopLullaby();
    };
  }, []);

  const handleSelectSong = (songId: string) => {
    soundManager.playPop();
    setSelectedSongId(songId);
    soundManager.selectLullaby(songId);
    fireCuteConfetti();
  };

  const handleToggleLullaby = () => {
    const nowPlaying = soundManager.toggleLullaby();
    setIsLullabyPlaying(nowPlaying);
    if (nowPlaying) {
      fireCuteConfetti();
    }
  };

  const handleStopLullaby = () => {
    soundManager.stopLullaby();
    setIsLullabyPlaying(false);
  };

  const handleToggleMute = () => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) soundManager.playPop();
  };

  // --- PROJECT 2: THE NIGHTLIGHT COLLECTION ---
  const [activeNightlights, setActiveNightlights] = useState<Record<'star' | 'moon' | 'strawberry', boolean>>({
    star: true,
    moon: false,
    strawberry: false,
  });

  const toggleNightlight = (id: 'star' | 'moon' | 'strawberry') => {
    const nextState = !activeNightlights[id];
    soundManager.playLightClick(nextState);
    setActiveNightlights((prev) => ({ ...prev, [id]: nextState }));
    if (nextState) {
      fireHearts();
    }
  };

  const anyNightlightOn = Object.values(activeNightlights).some(Boolean);

  const nightlightsData = [
    {
      id: 'star' as const,
      name: 'Little Star Lantern',
      icon: '⭐',
      desc: 'Ted’s first invention crafted from a fallen baby star.',
      caption: 'twinkle twinkle to light up your pillow ♡',
      glowColor: '#FEF08A',
      lightColor: '#FDE047',
    },
    {
      id: 'moon' as const,
      name: 'Crescent Moon Lamp',
      icon: '🌙',
      desc: 'Cast in silver-cream light for sleepy forest critters.',
      caption: 'sweet moonbeams for peaceful dreamy sleep ♡',
      glowColor: '#FEF9C3',
      lightColor: '#FEF08A',
    },
    {
      id: 'strawberry' as const,
      name: 'Strawberry Bedside Lamp',
      icon: '🍓',
      desc: 'Infused with gentle strawberry scent & warm pink glow.',
      caption: 'this one keeps the bedtime monsters away ♡',
      glowColor: '#FFCCD5',
      lightColor: '#FF4D6D',
    },
  ];

  // --- PROJECT 3: DREAM DELIVERY ROUTES ---
  const [selectedDestination, setSelectedDestination] = useState<string>('strawberry');
  const [isDelivering, setIsDelivering] = useState(false);
  const [deliveredMessage, setDeliveredMessage] = useState<string>(
    "Delivery complete! Tonight you'll dream of strawberry clouds."
  );

  const destinations = [
    {
      id: 'strawberry',
      name: 'The Strawberry Cottage',
      icon: '🍓',
      message: "Delivery complete! Tonight you'll dream of strawberry clouds.",
    },
    {
      id: 'kitten',
      name: 'The Sleepy Kitten House',
      icon: '🐱',
      message: "Delivery complete! A little kitten adventure is waiting.",
    },
    {
      id: 'castle',
      name: 'The Cloud Castle',
      icon: '🏰',
      message: "Delivery complete! Your cloud castle is ready.",
    },
  ];

  const handleSelectDestination = (dest: typeof destinations[0]) => {
    soundManager.playChime();
    setSelectedDestination(dest.id);
    setIsDelivering(true);
    setDeliveredMessage(dest.message);

    setTimeout(() => {
      setIsDelivering(false);
      soundManager.playYay();
      fireCuteConfetti();
    }, 750);
  };

  // --- PROJECT 4: TED'S BEDTIME STORYBOOK ---
  const [storybookPage, setStorybookPage] = useState(0);

  const storybookPages = [
    {
      title: "Page 1: The Star That Couldn't Sleep",
      text: "High above the sleepy world, a tiny baby star was bouncing with too much sparkle. 'I want to sleep,' whispered the star, 'but my twinkle is too bright!'",
      scene: '⭐ Ted noticed the restless glitter from his cloud hammock.',
      illustration: 'star-hug' as const,
    },
    {
      title: 'Page 2: A Cloud Like Marshmallow',
      text: "Ted scooped up a handful of pink strawberry cloud fluff. 'Here,' Ted smiled softly. 'This will make the softest, quietest little pillow in the entire galaxy.'",
      scene: '☁️ The baby star snuggled into the warm cloud nest.',
      illustration: 'sleeping-cloud' as const,
    },
    {
      title: 'Page 3: Sweet Sleep at Last',
      text: "Ted wound up his bedside music box and hummed a sleepy lullaby. The star's sparkle softened into a warm golden ember, and sweet dreams drifted over all.",
      scene: "🌙 Ted tucked in the star and whispered 'Goodnight, little light.'",
      illustration: 'storybook' as const,
    },
  ];

  const handleNextPage = () => {
    soundManager.playPop();
    setStorybookPage((prev) => (prev + 1) % storybookPages.length);
  };

  const handlePrevPage = () => {
    soundManager.playPop();
    setStorybookPage((prev) => (prev - 1 + storybookPages.length) % storybookPages.length);
  };

  return (
    <section id="creations" className="py-20 px-4 sm:px-8 bg-[#FFF9F6] border-b-2 border-[#FFD6E8]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block px-3.5 py-1 bg-[#FFD6E8] text-[#8B1E4B] border border-[#3B1B3C] rounded-full text-xs font-retro font-bold mb-3 shadow-xs">
            NURSERY WORKSHOP · 4 LITTLE CREATIONS 🧸
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#751A3D] tracking-tight mb-2">
            things i made with my tiny hands ♡
          </h2>
          <p className="text-[#6B2848] text-base sm:text-lg font-medium">
            interactive 3D creations from a very little dream engineer.
          </p>
        </div>

        {/* --- PROJECT 1: TED'S TINY LULLABY BOX (3D) --- */}
        <div className="card-hover mb-14 bg-[#FFFDF9] border-3 border-[#3B1B3C] rounded-3xl p-6 sm:p-8 shadow-retro-plum-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: 3D Music Box */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative p-2 sm:p-4 bg-[#FFF2F6] border-2 border-[#3B1B3C] rounded-3xl shadow-retro-plum-sm w-full max-w-sm flex flex-col items-center transition-transform hover:scale-[1.01]">
                <div className="absolute -top-3 left-6 px-3 py-0.5 bg-[#FFD6E8] border-2 border-[#3B1B3C] rounded-full text-[10px] font-retro font-bold text-[#8B1E4B] z-10">
                  3D MUSIC BOX // 6 MELODIES 🎵
                </div>

                {/* 3D Music Box Canvas */}
                <MusicBox3D isPlaying={isLullabyPlaying} onTogglePlay={handleToggleLullaby} />

                {/* Playing Status Pill */}
                <div className="mt-2 flex items-center justify-center gap-2 text-xs font-retro font-bold text-[#8B1E4B]">
                  <span className={isLullabyPlaying ? 'animate-bounce text-[#FF70B8]' : 'text-gray-300'}>♪</span>
                  <span className={isLullabyPlaying ? 'animate-bounce delay-100 text-[#B99AFF]' : 'text-gray-300'}>♫</span>
                  <span className={isLullabyPlaying ? 'animate-bounce delay-200 text-[#FFE66D]' : 'text-gray-300'}>♪</span>
                  <span className="text-[11px] ml-1">
                    {isLullabyPlaying
                      ? `Playing Step #${(currentLullabyStep % 12) + 1}...`
                      : 'Music Box Resting'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Description & 6-Song Selector */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFEBF2] text-[#8B1E4B] border border-[#FBCFE8] rounded-xl text-xs font-retro font-bold mb-2">
                <Music className="w-3.5 h-3.5" />
                <span>Web Audio Synthesizer · 6 Bedside Lullabies</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#751A3D] mb-2">
                Ted's Tiny Lullaby Box 🎵
              </h3>

              <p className="text-sm sm:text-base text-[#6B2848] font-medium leading-relaxed mb-4">
                "Each song has a different mood and note sequence to help little dreamers drift to sleep."
              </p>

              {/* 6 Playable Song Selection Pills */}
              <div className="w-full mb-4">
                <span className="block text-xs font-bold text-[#751A3D] font-retro mb-2">
                  Choose from 6 Lullaby Compositions:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {lullabies.map((song) => {
                    const isSelected = selectedSongId === song.id;
                    return (
                      <button
                        key={song.id}
                        onClick={() => handleSelectSong(song.id)}
                        className={`p-2 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#FFE66D] border-[#3B1B3C] shadow-retro-plum-sm scale-102 font-bold text-[#3B1B3C]'
                            : 'bg-white border-[#FFD6E8] hover:bg-[#FFF5F8] hover:border-[#FFB3D1] hover:-translate-y-0.5 text-[#8B3A62]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-base group-hover:scale-110 transition-transform">{song.icon}</span>
                          <span className="text-xs font-extrabold truncate">{song.title}</span>
                        </div>
                        <span className="text-[9px] font-retro line-clamp-1 opacity-80">
                          {song.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Working Controls */}
              <div className="p-3.5 sm:p-4 bg-[#FFF8FA] border-2 border-[#FFC2DB] rounded-2xl w-full flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleToggleLullaby}
                    className={`btn-chunky px-4 py-2 text-xs sm:text-sm font-extrabold border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-1.5 cursor-pointer ${
                      isLullabyPlaying
                        ? 'bg-[#FF70B8] text-white hover:bg-[#FF599F]'
                        : 'bg-[#FFE66D] text-[#3B1B3C] hover:bg-[#FFDE4D]'
                    }`}
                  >
                    {isLullabyPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isLullabyPlaying ? 'Pause Lullaby' : 'Play Selected Lullaby'}</span>
                  </button>

                  {isLullabyPlaying && (
                    <button
                      onClick={handleStopLullaby}
                      className="btn-chunky px-3 py-2 text-xs font-bold bg-white text-[#9F1239] hover:bg-[#FFE8EC] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-1 cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop</span>
                    </button>
                  )}
                </div>

                {/* Mute Control */}
                <button
                  onClick={handleToggleMute}
                  className="p-2 rounded-xl border border-[#FBCFE8] bg-white hover:bg-[#FFF0F5] text-[#8B1E4B] shadow-sm flex items-center gap-1 text-xs font-bold cursor-pointer"
                  title={isMuted ? 'Unmute lullabies' : 'Mute lullabies'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-gray-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#E11D48]" />}
                  <span>{isMuted ? 'Muted' : 'Sound ON'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- PROJECT 2: THE NIGHTLIGHT COLLECTION (3D) --- */}
        <div
          className={`card-hover mb-14 border-3 border-[#3B1B3C] rounded-3xl p-6 sm:p-8 shadow-retro-plum-lg transition-colors duration-500 ${
            anyNightlightOn ? 'bg-[#FFF7ED] shadow-[0_0_40px_rgba(255,209,102,0.35)]' : 'bg-[#FFFDF9]'
          }`}
        >
          <div className="flex flex-col mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF9C3] text-[#854D0E] border border-[#FEF08A] rounded-xl text-xs font-retro font-bold mb-2 self-start">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>3D Bedside Shelf & Soft Point-Light Illumination</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#751A3D] mb-1">
              The Nightlight Collection 🌙
            </h3>

            <p className="text-base text-[#6B2848] font-medium leading-relaxed">
              "Little lights for little worries. Click any 3D lamp directly on the shelf or use the buttons below."
            </p>
          </div>

          {/* Genuine 3D Nightlight Shelf */}
          <div className="bg-[#FFF8FA] border-2 border-[#3B1B3C] rounded-3xl p-3 mb-6 shadow-retro-plum-sm transition-transform hover:scale-[1.01]">
            <Nightlight3D activeLamps={activeNightlights} onToggleLamp={toggleNightlight} />
          </div>

          {/* Gallery of 3 Unique Nightlight Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nightlightsData.map((lamp) => {
              const isOn = activeNightlights[lamp.id];
              return (
                <div
                  key={lamp.id}
                  onClick={() => toggleNightlight(lamp.id)}
                  style={{
                    borderColor: isOn ? '#3B1B3C' : '#FFD6E8',
                    backgroundColor: isOn ? lamp.glowColor : '#FFFFFF',
                  }}
                  className={`p-4 rounded-3xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs ${
                    isOn ? 'shadow-retro-plum-sm scale-[1.02]' : 'hover:scale-[1.02] hover:-translate-y-1 hover:border-[#FFB3D1]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl transition-transform hover:scale-125">{lamp.icon}</span>
                      <span
                        className={`text-[10px] font-retro font-bold px-2 py-0.5 rounded-full border ${
                          isOn
                            ? 'bg-[#3B1B3C] text-white border-[#3B1B3C]'
                            : 'bg-[#FFF0F5] text-[#8B3A62] border-[#FBCFE8]'
                        }`}
                      >
                        {isOn ? '● GLOWING' : '○ ASLEEP'}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-[#751A3D] mb-1">{lamp.name}</h4>
                    <p className="text-xs text-[#5C233E] leading-relaxed mb-3">{lamp.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-[#3B1B3C]/10 text-[11px] font-display font-bold text-[#8B1E4B]">
                    "{lamp.caption}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- PROJECT 3: DREAM DELIVERY ROUTES (3D DIORAMA) --- */}
        <div className="card-hover mb-14 bg-[#FFFDF9] border-3 border-[#3B1B3C] rounded-3xl p-6 sm:p-8 shadow-retro-plum-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: 3D Delivery Diorama */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full bg-[#FFF8FA] border-2 border-[#3B1B3C] rounded-3xl p-3 shadow-retro-plum-sm overflow-hidden select-none transition-transform hover:scale-[1.01]">
                <div className="absolute top-3 left-4 px-3 py-0.5 bg-[#83D9FF] border-2 border-[#3B1B3C] rounded-full text-[10px] font-retro font-bold text-[#0C4A6E] z-10">
                  3D DREAM DIORAMA ☁️
                </div>

                <DreamDelivery3D
                  destinations={destinations}
                  selectedId={selectedDestination}
                  onSelectDestination={handleSelectDestination}
                />
              </div>
            </div>

            {/* Right: Description & Dream Message */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] rounded-xl text-xs font-retro font-bold mb-2">
                <Send className="w-3.5 h-3.5" />
                <span>Rooftop Dispatch // 3D Delivery Arc</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#751A3D] mb-2">
                Dream Delivery Routes ☁️
              </h3>

              <p className="text-sm sm:text-base text-[#6B2848] font-medium leading-relaxed mb-4">
                "Every night, I fly across the rooftops in my dream bag, delivering tiny wishes to sleepy friends."
              </p>

              {/* Delivery Scroll Card */}
              <div className="w-full bg-[#FFF2F6] border-2 border-[#3B1B3C] rounded-2xl p-5 shadow-retro-plum-sm">
                <div className="text-[11px] font-retro font-bold text-[#8B1E4B] mb-1 flex items-center justify-between">
                  <span>DELIVERED DREAM SCROLL:</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#FBCFE8]">
                    {isDelivering ? 'Dispatching 3D Flight...' : 'Arrived ♡'}
                  </span>
                </div>

                <p className="text-base sm:text-lg font-bold text-[#751A3D] my-2 font-display leading-snug">
                  "{deliveredMessage}"
                </p>

                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#3B1B3C]/10">
                  {destinations.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleSelectDestination(d)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                        selectedDestination === d.id
                          ? 'bg-[#FFE66D] text-[#3B1B3C] border-[#3B1B3C] shadow-retro-plum-sm scale-105'
                          : 'bg-white text-[#8B3A62] border-[#FBCFE8] hover:bg-[#FFEBF2] hover:-translate-y-0.5 hover:shadow-xs'
                      }`}
                    >
                      <span>{d.icon}</span>
                      <span>{d.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- PROJECT 4: TED'S BEDTIME STORYBOOK (DIMENSIONAL BOOK) --- */}
        <div className="card-hover bg-[#FFFDF9] border-3 border-[#3B1B3C] rounded-3xl p-6 sm:p-8 shadow-retro-plum-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual: Dimensional Open Storybook */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative p-6 sm:p-8 bg-[#FFF8FA] border-2 border-[#3B1B3C] rounded-3xl shadow-retro-plum-sm w-full max-w-md flex flex-col items-center bg-notebook-pattern transition-transform hover:-translate-y-1">
                <div className="absolute -top-3 left-6 px-3 py-0.5 bg-[#FFD1E3] border-2 border-[#3B1B3C] rounded-full text-[10px] font-retro font-bold text-[#8B1E4B]">
                  PROJECT 04 // STORYBOOK 📖
                </div>

                {/* Ted in storybook or cloud pose */}
                <div className="my-2">
                  <PipCharacter
                    pose={storybookPages[storybookPage].illustration}
                    expression="happy"
                    size="lg"
                  />
                </div>

                <p className="text-xs font-retro font-bold text-[#8B3A62] bg-white px-3 py-1 rounded-xl border border-[#FBCFE8]">
                  {storybookPages[storybookPage].scene}
                </p>
              </div>
            </div>

            {/* Storybook Pages Reader */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF5FF] text-[#6B21A8] border border-[#E9D5FF] rounded-xl text-xs font-retro font-bold mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Bedtime Tales by Ted</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#751A3D] mb-3">
                Ted's Bedtime Storybook 📖
              </h3>

              <p className="text-base text-[#6B2848] font-medium leading-relaxed mb-5">
                "I write the tiniest bedtime stories for the sleepiest little dreamers."
              </p>

              {/* Story Page Container with Dimensional Book Styling */}
              <div className="w-full bg-[#FFFDF9] border-2 border-[#3B1B3C] rounded-2xl p-5 shadow-retro-plum-sm relative">
                <div className="flex items-center justify-between text-xs font-retro font-bold text-[#8B1E4B] mb-2">
                  <span>{storybookPages[storybookPage].title}</span>
                  <span className="bg-[#FFE66D] text-[#3B1B3C] px-2 py-0.5 rounded border border-[#3B1B3C]">
                    Page {storybookPage + 1} of 3
                  </span>
                </div>

                <p className="text-sm sm:text-base text-[#5C233E] font-medium leading-relaxed min-h-[90px] bg-[#FFF8FA] p-3 rounded-xl border border-[#FFD6E8]">
                  "{storybookPages[storybookPage].text}"
                </p>

                {/* Page Navigation Controls */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#3B1B3C]/10">
                  <button
                    onClick={handlePrevPage}
                    className="btn-chunky px-3 py-1.5 text-xs font-bold bg-white hover:bg-[#FFF0F5] text-[#8B1E4B] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((idx) => (
                      <span
                        key={idx}
                        className={`w-2.5 h-2.5 rounded-full border border-[#3B1B3C] transition-colors ${
                          storybookPage === idx ? 'bg-[#FF70B8] scale-125' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextPage}
                    className="btn-chunky px-3 py-1.5 text-xs font-bold bg-[#FFE66D] hover:bg-[#FFDE4D] text-[#3B1B3C] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next Page</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
