import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/soundEffects';
import { fireCuteConfetti, fireHearts } from '../utils/confetti';
import { Gamepad2, Sparkles, Heart, Trophy, RefreshCw, Music } from 'lucide-react';

export const VirtualPetArcade: React.FC = () => {
  // Virtual Pet State
  const [petHappiness, setPetHappiness] = useState(88);
  const [petHunger, setPetHunger] = useState(90);
  const [petEnergy, setPetEnergy] = useState(85);
  const [petSparkles, setPetSparkles] = useState(92);
  const [petReaction, setPetReaction] = useState<string>("Mochi is super happy playing with you! 💖");

  // Mini-Game State (Star Catcher)
  const [gamePlaying, setGamePlaying] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('hax_star_high_score') || '120');
    } catch {
      return 120;
    }
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const basketXRef = useRef<number>(150);
  const starsRef = useRef<Array<{ x: number; y: number; speed: number; symbol: string; isHazard?: boolean }>>([]);
  const animFrameRef = useRef<number | null>(null);

  // Musical Bells notes
  const chimeNotes = [
    { label: 'Do', note: 'C5', freq: 523.25, color: '#FF70B8' },
    { label: 'Re', note: 'D5', freq: 587.33, color: '#FFA07A' },
    { label: 'Mi', note: 'E5', freq: 659.25, color: '#FFE66D' },
    { label: 'Fa', note: 'F5', freq: 698.46, color: '#A5F3C1' },
    { label: 'Sol', note: 'G5', freq: 783.99, color: '#83D9FF' },
    { label: 'La', note: 'A5', freq: 880.00, color: '#B99AFF' },
    { label: 'Ti', note: 'B5', freq: 987.77, color: '#FFB3D1' },
    { label: 'Do', note: 'C6', freq: 1046.50, color: '#FF5964' },
  ];

  // Pet Care Actions
  const handleFeedCake = () => {
    soundManager.playMunch();
    setPetHunger(prev => Math.min(100, prev + 15));
    setPetHappiness(prev => Math.min(100, prev + 8));
    setPetReaction("NOM NOM! Strawberry shortcake is Mochi's favorite! 🍓🎂");
    fireCuteConfetti();
  };

  const handleSingLullaby = () => {
    soundManager.playChime();
    setPetEnergy(prev => Math.min(100, prev + 20));
    setPetReaction("Mochi is feeling refreshed and so cozy! 🌙✨");
  };

  const handleBubbleBath = () => {
    soundManager.playPop();
    setPetSparkles(prev => Math.min(100, prev + 25));
    setPetReaction("Sparkly clean! Look at all the rainbow bubbles! 🛁🫧");
    fireHearts();
  };

  const handleTickle = () => {
    soundManager.playGiggle();
    setPetHappiness(prev => Math.min(100, prev + 12));
    setPetReaction("Teeheehee! That tickles so much! 🧸💖");
  };

  // Mini-Game Logic
  const startGame = () => {
    soundManager.playYay();
    setGamePlaying(true);
    setGameOver(false);
    setGameScore(0);
    starsRef.current = [];
    basketXRef.current = 150;
  };

  useEffect(() => {
    if (!gamePlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localScore = 0;
    let spawnTimer = 0;
    let running = true;

    const gameLoop = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background sky
      ctx.fillStyle = '#FFF8FC';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn falling items
      spawnTimer++;
      if (spawnTimer % 35 === 0) {
        const isHazard = Math.random() < 0.22;
        const symbols = isHazard ? ['⛈️'] : ['⭐', '🍓', '🍬', '✨', '💖'];
        const chosen = symbols[Math.floor(Math.random() * symbols.length)];
        starsRef.current.push({
          x: Math.random() * (canvas.width - 40) + 20,
          y: -20,
          speed: 2 + Math.random() * 2.5,
          symbol: chosen,
          isHazard,
        });
      }

      // Update and draw falling stars
      for (let i = starsRef.current.length - 1; i >= 0; i--) {
        const item = starsRef.current[i];
        item.y += item.speed;

        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.symbol, item.x, item.y);

        // Check collision with basket
        const basketY = canvas.height - 35;
        const dist = Math.hypot(item.x - basketXRef.current, item.y - basketY);

        if (dist < 32) {
          if (item.isHazard) {
            soundManager.playBoing();
            running = false;
            setGamePlaying(false);
            setGameOver(true);
            return;
          } else {
            soundManager.playPop();
            localScore += 10;
            setGameScore(localScore);
            starsRef.current.splice(i, 1);
            continue;
          }
        }

        // Remove out of bounds
        if (item.y > canvas.height + 20) {
          starsRef.current.splice(i, 1);
        }
      }

      // Draw Mochi's Basket / Catcher
      const bx = basketXRef.current;
      const by = canvas.height - 25;

      // Basket shadow
      ctx.fillStyle = '#3B1B3C';
      ctx.beginPath();
      ctx.roundRect(bx - 32, by - 12, 64, 26, 12);
      ctx.fill();

      // Basket inner
      ctx.fillStyle = '#FFE66D';
      ctx.beginPath();
      ctx.roundRect(bx - 30, by - 14, 60, 24, 10);
      ctx.fill();

      // Cute Bear Face on Basket
      ctx.fillStyle = '#3B1B3C';
      ctx.font = '16px serif';
      ctx.fillText('🧸', bx, by + 4);

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gamePlaying]);

  // Update high score
  useEffect(() => {
    if (gameScore > highScore) {
      setHighScore(gameScore);
      try {
        localStorage.setItem('hax_star_high_score', String(gameScore));
      } catch {
        // ignore
      }
    }
  }, [gameScore, highScore]);

  // Handle pointer tracking for basket
  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvasRef.current.width;
    basketXRef.current = Math.max(35, Math.min(canvasRef.current.width - 35, x));
  };

  return (
    <section id="pet" className="py-16 px-4 sm:px-8 bg-[#FFF9F6] border-b-2 border-[#FFD6E8]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 bg-[#FFD6E8] text-[#8B1E4B] border border-[#3B1B3C] rounded-full text-xs font-retro font-bold mb-2">
            EXHIBIT C // RETRO PLAYGROUND & ARCADE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#751A3D] tracking-tight">
            Baby Mochi's Virtual Nook & Arcade 🎮
          </h2>
          <p className="text-[#6B2848] text-sm sm:text-base font-medium mt-1">
            Care for your virtual pet, play the Star Catcher mini-game, and compose sweet chime melodies!
          </p>
        </div>

        {/* 2-Column Split: Virtual Pet Nook + Star Catcher Arcade */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Virtual Pet Care Nook */}
          <div className="lg:col-span-5 bg-white border-3 border-[#3B1B3C] rounded-3xl p-6 shadow-retro-plum-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#751A3D] uppercase font-retro">
                  Virtual Pet Vitals
                </span>
                <span className="text-xs text-[#8B3A62] font-semibold bg-[#FFF0F5] px-2.5 py-1 rounded-xl border border-[#FBCFE8]">
                  Level 5 Fluffy Baby
                </span>
              </div>

              {/* Status Reaction Box */}
              <div className="p-3 bg-[#FFF2F6] border-2 border-[#3B1B3C] rounded-2xl mb-5 shadow-retro-plum-sm text-center">
                <p className="text-xs sm:text-sm font-bold text-[#8B1E4B] leading-snug">
                  {petReaction}
                </p>
              </div>

              {/* Pet Meters */}
              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#751A3D] mb-1">
                    <span>💖 Happiness</span>
                    <span className="font-retro">{petHappiness}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#FFEBF2] rounded-full overflow-hidden border border-[#3B1B3C]">
                    <div
                      className="h-full bg-[#FF70B8] transition-all duration-300"
                      style={{ width: `${petHappiness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#751A3D] mb-1">
                    <span>🍓 Hunger</span>
                    <span className="font-retro">{petHunger}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#FFEBF2] rounded-full overflow-hidden border border-[#3B1B3C]">
                    <div
                      className="h-full bg-[#FF5964] transition-all duration-300"
                      style={{ width: `${petHunger}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#751A3D] mb-1">
                    <span>🌙 Energy</span>
                    <span className="font-retro">{petEnergy}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#FFEBF2] rounded-full overflow-hidden border border-[#3B1B3C]">
                    <div
                      className="h-full bg-[#83D9FF] transition-all duration-300"
                      style={{ width: `${petEnergy}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#751A3D] mb-1">
                    <span>✨ Sparkles</span>
                    <span className="font-retro">{petSparkles}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#FFEBF2] rounded-full overflow-hidden border border-[#3B1B3C]">
                    <div
                      className="h-full bg-[#FFE66D] transition-all duration-300"
                      style={{ width: `${petSparkles}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pet Action Buttons */}
            <div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={handleFeedCake}
                  className="btn-chunky py-2 px-3 text-xs font-bold bg-[#FFE8EC] hover:bg-[#FFD6DF] text-[#9F1239] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>🍓 Feed Cake</span>
                </button>
                <button
                  onClick={handleSingLullaby}
                  className="btn-chunky py-2 px-3 text-xs font-bold bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>🌙 Sing Lullaby</span>
                </button>
                <button
                  onClick={handleBubbleBath}
                  className="btn-chunky py-2 px-3 text-xs font-bold bg-[#FEF9C3] hover:bg-[#FEF08A] text-[#854D0E] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>🛁 Bubble Bath</span>
                </button>
                <button
                  onClick={handleTickle}
                  className="btn-chunky py-2 px-3 text-xs font-bold bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#6B21A8] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>🧸 Tickle (+Joy)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Star Catcher Arcade Game & Chimes */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Star Catcher Mini-Game */}
            <div className="bg-white border-3 border-[#3B1B3C] rounded-3xl p-5 sm:p-6 shadow-retro-plum-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-[#FF70B8]" />
                  <span className="text-sm font-extrabold text-[#751A3D]">Star Catcher DX</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-retro">
                  <span className="font-bold text-[#8B1E4B]">Score: {gameScore}</span>
                  <span className="text-[#A2678A] flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-[#FFE66D]" /> {highScore}
                  </span>
                </div>
              </div>

              {/* Game Screen Canvas */}
              <div className="relative border-2 border-[#3B1B3C] rounded-2xl overflow-hidden bg-[#FFF8FC] shadow-retro-plum-sm">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={260}
                  onPointerMove={handleCanvasPointerMove}
                  className="w-full h-[240px] sm:h-[260px] cursor-none touch-none block"
                />

                {/* Game Overlay when not playing */}
                {!gamePlaying && (
                  <div className="absolute inset-0 bg-[#FFF9FA]/85 backdrop-blur-2xs flex flex-col items-center justify-center p-4 text-center">
                    {gameOver ? (
                      <div className="animate-wiggle mb-2">
                        <span className="text-3xl">⛈️</span>
                        <h4 className="text-base font-extrabold text-[#9F1239] mt-1">Storm Cloud Caught!</h4>
                        <p className="text-xs text-[#751A3D]">You scored: {gameScore} points!</p>
                      </div>
                    ) : (
                      <div className="mb-2">
                        <span className="text-3xl">⭐</span>
                        <h4 className="text-base font-extrabold text-[#751A3D] mt-1">Ready to catch stars?</h4>
                        <p className="text-xs text-[#8B3A62]">
                          Move your basket to catch stars & candies. Avoid the storm clouds!
                        </p>
                      </div>
                    )}

                    <button
                      onClick={startGame}
                      className="btn-chunky mt-2 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-[#3B1B3C] bg-[#FFE66D] hover:bg-[#FFDE4D] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-2 cursor-pointer"
                    >
                      <span>{gameOver ? 'Play Again 🚀' : 'Start Mini-Game ⭐'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Melodic Chime Keyboard Toy */}
            <div className="bg-[#FFFDF9] border-3 border-[#3B1B3C] rounded-3xl p-5 shadow-retro-plum-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#8B1E4B]" />
                  <span className="text-xs font-bold text-[#751A3D] uppercase font-retro">
                    Mochi's Chime Bells (Web Audio Synth)
                  </span>
                </div>
                <span className="text-[11px] text-[#A2678A] font-retro">8-Note Pentatonic</span>
              </div>

              <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
                {chimeNotes.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundManager.playNote(item.freq);
                    }}
                    style={{ backgroundColor: item.color }}
                    className="h-20 sm:h-24 rounded-2xl border-2 border-[#3B1B3C] flex flex-col items-center justify-between py-2 shadow-retro-plum-sm hover:-translate-y-1 active:translate-y-1 transition-transform cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-[#3B1B3C]">{item.note}</span>
                    <span className="text-sm">🎵</span>
                    <span className="text-[11px] font-retro font-bold text-[#3B1B3C]">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
