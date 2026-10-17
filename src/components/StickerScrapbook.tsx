import React, { useState, useRef, useEffect } from 'react';
import { PlacedSticker, StickerDefinition } from '../types';
import { STICKER_LIBRARY } from '../data/initialData';
import { soundManager } from '../utils/soundEffects';
import { fireCuteConfetti } from '../utils/confetti';
import { RotateCw, Trash2, Sparkles, Download, Shuffle, Undo } from 'lucide-react';

export const StickerScrapbook: React.FC = () => {
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>(() => {
    try {
      const saved = localStorage.getItem('hax_placed_stickers');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default cute starting layout
    return [
      { id: '1', stickerId: 'stk-bear', symbol: '🧸', x: 22, y: 35, rotation: -6, scale: 1.3 },
      { id: '2', stickerId: 'stk-bow', symbol: '🎀', x: 38, y: 22, rotation: 12, scale: 1.1 },
      { id: '3', stickerId: 'stk-strawberry', symbol: '🍓', x: 65, y: 30, rotation: 8, scale: 1.2 },
      { id: '4', stickerId: 'stk-star', symbol: '⭐', x: 78, y: 65, rotation: -14, scale: 1.2 },
      { id: '5', stickerId: 'stk-milk', symbol: '🥛', x: 45, y: 70, rotation: 5, scale: 1.1 }
    ];
  });

  const [selectedStickerSymbol, setSelectedStickerSymbol] = useState<string>('🎀');
  const [activePlacedId, setActivePlacedId] = useState<string | null>(null);
  const [scrapbookPattern, setScrapbookPattern] = useState<'grid' | 'polka' | 'notebook' | 'cream'>('grid');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'animals' | 'sweets' | 'y2k' | 'stars'>('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragTargetIdRef = useRef<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hax_placed_stickers', JSON.stringify(placedStickers));
    } catch {
      // ignore
    }
  }, [placedStickers]);

  const filteredStickers = categoryFilter === 'all' 
    ? STICKER_LIBRARY 
    : STICKER_LIBRARY.filter(s => s.category === categoryFilter);

  // Add sticker to canvas by click
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Boundary check
    if (x < 5 || x > 95 || y < 5 || y > 95) return;

    soundManager.playStickerTap();

    const newSticker: PlacedSticker = {
      id: `stk-${Date.now()}-${Math.random()}`,
      stickerId: 'custom',
      symbol: selectedStickerSymbol,
      x: Math.round(x),
      y: Math.round(y),
      rotation: Math.floor(Math.random() * 24) - 12,
      scale: 1.1
    };

    setPlacedStickers(prev => [...prev, newSticker]);
    setActivePlacedId(newSticker.id);
  };

  const handleStickerPointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    soundManager.playPop();
    setActivePlacedId(id);
    dragTargetIdRef.current = id;
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragTargetIdRef.current || !canvasRef.current) return;
    isDraggingRef.current = true;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    setPlacedStickers(prev =>
      prev.map(stk => (stk.id === dragTargetIdRef.current ? { ...stk, x, y } : stk))
    );
  };

  const handlePointerUp = () => {
    dragTargetIdRef.current = null;
  };

  const handleRotateActive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePlacedId) return;
    soundManager.playPop();
    setPlacedStickers(prev =>
      prev.map(stk =>
        stk.id === activePlacedId ? { ...stk, rotation: (stk.rotation + 25) % 360 } : stk
      )
    );
  };

  const handleDeleteActive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePlacedId) return;
    soundManager.playBoing();
    setPlacedStickers(prev => prev.filter(stk => stk.id !== activePlacedId));
    setActivePlacedId(null);
  };

  const handleRandomScatter = () => {
    soundManager.playYay();
    fireCuteConfetti();
    const count = 8;
    const newBatch: PlacedSticker[] = [];
    for (let i = 0; i < count; i++) {
      const randomSticker = STICKER_LIBRARY[Math.floor(Math.random() * STICKER_LIBRARY.length)];
      newBatch.push({
        id: `scatter-${Date.now()}-${i}`,
        stickerId: randomSticker.id,
        symbol: randomSticker.symbol,
        x: Math.floor(15 + Math.random() * 70),
        y: Math.floor(15 + Math.random() * 70),
        rotation: Math.floor(Math.random() * 40) - 20,
        scale: 0.9 + Math.random() * 0.4
      });
    }
    setPlacedStickers(newBatch);
  };

  const handleClearCanvas = () => {
    soundManager.playBoing();
    setPlacedStickers([]);
    setActivePlacedId(null);
  };

  const handleDownloadCollage = () => {
    soundManager.playChime();
    setDownloadSuccess(true);
    fireCuteConfetti();
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <section id="stickers" className="py-16 px-4 sm:px-8 bg-[#FFF4F8] border-b-2 border-[#FFD6E8]">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-block px-3 py-1 bg-[#FFD6E8] text-[#8B1E4B] border border-[#3B1B3C] rounded-full text-xs font-retro font-bold mb-2">
              EXHIBIT B // VIRTUAL SCRAPBOOK
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#751A3D] tracking-tight">
              Interactive Sticker Scrapbook 🎨
            </h2>
            <p className="text-[#6B2848] text-sm sm:text-base font-medium mt-1">
              Select any sticker from the tray and click on the canvas to stamp it! Drag to reposition.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRandomScatter}
              className="btn-chunky px-3 py-2 text-xs font-bold bg-[#FFE66D] hover:bg-[#FFDF4D] text-[#3B1B3C] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Scatter Random</span>
            </button>

            <button
              onClick={handleClearCanvas}
              className="btn-chunky px-3 py-2 text-xs font-bold bg-white hover:bg-[#FFE8EC] text-[#9F1239] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              onClick={handleDownloadCollage}
              className="btn-chunky px-3 py-2 text-xs font-bold bg-[#83D9FF] hover:bg-[#70CDF7] text-[#0C4A6E] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? 'Collage Saved! 🎀' : 'Save Scrapbook'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Layout: Sticker Selector & Scrapbook Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Sticker Tray */}
          <div className="lg:col-span-4 bg-white border-3 border-[#3B1B3C] rounded-3xl p-5 shadow-retro-plum-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#751A3D] uppercase font-retro">Sticker Library</span>
              <span className="text-xs text-[#8B3A62] font-semibold bg-[#FFF0F5] px-2 py-0.5 rounded-lg border border-[#FBCFE8]">
                Active: {selectedStickerSymbol}
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1 text-[11px] font-bold">
              {(['all', 'animals', 'sweets', 'y2k', 'stars'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    soundManager.playPop();
                    setCategoryFilter(cat);
                  }}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                    categoryFilter === cat
                      ? 'bg-[#FF70B8] text-white'
                      : 'bg-[#FFF0F5] text-[#8B3A62] hover:bg-[#FFE2EC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sticker Grid */}
            <div className="grid grid-cols-4 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
              {filteredStickers.map(stk => (
                <button
                  key={stk.id}
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedStickerSymbol(stk.symbol);
                  }}
                  className={`relative p-2 rounded-2xl border-2 transition-transform flex flex-col items-center justify-center text-2xl aspect-square cursor-pointer ${
                    selectedStickerSymbol === stk.symbol
                      ? 'bg-[#FFD1E3] border-[#3B1B3C] scale-105 shadow-retro-plum-sm'
                      : 'bg-[#FFFDF9] border-[#FFC2DB] hover:bg-[#FFF2F6] hover:scale-102'
                  }`}
                  title={stk.label}
                >
                  <span>{stk.symbol}</span>
                </button>
              ))}
            </div>

            {/* Paper Pattern Switcher */}
            <div className="mt-5 pt-4 border-t-2 border-dashed border-[#FFC2DB]">
              <span className="block text-xs font-bold text-[#751A3D] mb-2 font-retro">
                Paper Background:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'grid', label: 'Grid' },
                  { id: 'polka', label: 'Polka' },
                  { id: 'notebook', label: 'Lined' },
                  { id: 'cream', label: 'Plain' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      soundManager.playPop();
                      setScrapbookPattern(p.id as any);
                    }}
                    className={`py-1 text-[11px] font-bold rounded-lg border text-center ${
                      scrapbookPattern === p.id
                        ? 'bg-[#3B1B3C] text-[#FFE66D] border-[#3B1B3C]'
                        : 'bg-[#FFF8FA] text-[#8B3A62] border-[#FBCFE8] hover:bg-[#FFEBF2]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Scrapbook Canvas */}
          <div className="lg:col-span-8 flex flex-col">
            <div
              ref={canvasRef}
              onClick={handleCanvasClick}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`relative w-full h-[460px] sm:h-[500px] border-3 border-[#3B1B3C] rounded-3xl shadow-retro-plum-lg overflow-hidden cursor-crosshair select-none transition-colors ${
                scrapbookPattern === 'grid'
                  ? 'bg-[#FFFDF9] bg-grid-pattern'
                  : scrapbookPattern === 'polka'
                  ? 'bg-[#FFF9FB] bg-polka-pattern'
                  : scrapbookPattern === 'notebook'
                  ? 'bg-[#FFFDF9] bg-notebook-pattern'
                  : 'bg-[#FFF8F2]'
              }`}
            >
              {/* Paper Washi Tape Accents on Corners */}
              <div className="absolute top-2 left-6 w-16 h-5 bg-[#FFE66D]/80 border-t border-b border-[#3B1B3C]/30 rotate-[-4deg] pointer-events-none shadow-xs" />
              <div className="absolute top-2 right-6 w-16 h-5 bg-[#FF80B2]/80 border-t border-b border-[#3B1B3C]/30 rotate-[6deg] pointer-events-none shadow-xs" />

              {/* Instructions Watermark Note */}
              <div className="absolute bottom-3 left-4 text-[11px] font-retro text-[#A2678A] pointer-events-none bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[#FBCFE8]">
                ✎ Tap canvas to stamp · Drag stickers to move
              </div>

              {/* Placed Stickers */}
              {placedStickers.map(stk => {
                const isSelected = activePlacedId === stk.id;
                return (
                  <div
                    key={stk.id}
                    onPointerDown={e => handleStickerPointerDown(stk.id, e)}
                    style={{
                      left: `${stk.x}%`,
                      top: `${stk.y}%`,
                      transform: `translate(-50%, -50%) rotate(${stk.rotation}deg) scale(${stk.scale})`,
                    }}
                    className={`absolute select-none cursor-grab active:cursor-grabbing text-3xl sm:text-4xl transition-transform ${
                      isSelected ? 'ring-2 ring-[#FF70B8] rounded-xl' : ''
                    }`}
                  >
                    <span className="drop-shadow-[0_4px_3px_rgba(59,27,60,0.2)] inline-block">
                      {stk.symbol}
                    </span>

                    {/* Quick Floating Controls for Active Sticker */}
                    {isSelected && (
                      <div className="absolute -top-7 -right-7 flex items-center gap-1 bg-[#3B1B3C] p-1 rounded-lg shadow-md z-10 pointer-events-auto">
                        <button
                          onClick={handleRotateActive}
                          className="p-1 hover:bg-[#FF70B8] text-white rounded text-[10px]"
                          title="Rotate Sticker"
                        >
                          <RotateCw className="w-3 h-3" />
                        </button>
                        <button
                          onClick={handleDeleteActive}
                          className="p-1 hover:bg-[#FF5964] text-white rounded text-[10px]"
                          title="Remove Sticker"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
