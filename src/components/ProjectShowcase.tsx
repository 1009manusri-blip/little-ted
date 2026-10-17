import React, { useState } from 'react';
import { Project } from '../types';
import { soundManager } from '../utils/soundEffects';
import { fireCuteConfetti } from '../utils/confetti';
import { Heart, Sparkles, Plus, Search, ExternalLink, Play, Check } from 'lucide-react';

interface ProjectShowcaseProps {
  projects: Project[];
  onAddProject: (project: Project) => void;
  onOpenArcade: () => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  projects,
  onAddProject,
  onOpenArcade,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likesState, setLikesState] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('hax_project_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modal states
  const [activeToyProject, setActiveToyProject] = useState<Project | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Submit form state
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCategory, setNewCategory] = useState<'Cute AI' | 'Pixel Toys' | 'Web Tools' | 'Mini Games'>('Cute AI');
  const [newCreator, setNewCreator] = useState('');
  const [newEmoji, setNewEmoji] = useState('🎀');
  const [newDescription, setNewDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Interactive toy mini-states for modals
  const [toyBlessing, setToyBlessing] = useState<string | null>(null);
  const [generatedPalette, setGeneratedPalette] = useState<string[]>(['#FF70B8', '#FFE66D', '#B99AFF', '#83D9FF', '#FFF8E8']);
  const [paletteCopied, setPaletteCopied] = useState(false);

  const categories = ['All', 'Cute AI', 'Pixel Toys', 'Web Tools', 'Mini Games'];

  const filteredProjects = projects.filter((project) => {
    const matchesCat = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.creator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    soundManager.playPop();
    const current = likesState[id] !== undefined ? likesState[id] : 0;
    const updated = { ...likesState, [id]: current + 1 };
    setLikesState(updated);
    try {
      localStorage.setItem('hax_project_likes', JSON.stringify(updated));
    } catch {
      // ignore
    }

    const rect = e.currentTarget.getBoundingClientRect();
    fireCuteConfetti({
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight
    });
  };

  const handleOpenToy = (project: Project) => {
    soundManager.playChime();
    if (project.id === 'proj-3') {
      onOpenArcade();
      return;
    }
    setActiveToyProject(project);
    setToyBlessing(null);
  };

  const handleGenerateBlessing = () => {
    soundManager.playYay();
    const blessings = [
      "🌸 'May your code compile on the first try and your tea never go cold!'",
      "🍓 'You possess an infinite well of creative sunshine. Keep sharing your sparkle!'",
      "🧸 'A gentle reminder: rest is also part of creating wonderful things.'",
      "✨ 'Your kindness today will bounce back to you like a warm sugar cookie!'"
    ];
    setToyBlessing(blessings[Math.floor(Math.random() * blessings.length)]);
    fireCuteConfetti();
  };

  const handleShufflePalette = () => {
    soundManager.playPop();
    const palettes = [
      ['#FF82A9', '#FFD1E3', '#FFF0F5', '#A5F3C1', '#321747'],
      ['#B99AFF', '#83D9FF', '#FFE66D', '#FF70B8', '#FFF8E8'],
      ['#FF5964', '#FFE169', '#93E1D8', '#AA998F', '#2E1065'],
      ['#FAD2E1', '#C5DEDD', '#DBE7E4', '#F0E6EF', '#4A1D36']
    ];
    setGeneratedPalette(palettes[Math.floor(Math.random() * palettes.length)]);
    setPaletteCopied(false);
  };

  const handleCopyPalette = () => {
    soundManager.playChime();
    navigator.clipboard.writeText(generatedPalette.join(', '));
    setPaletteCopied(true);
    setTimeout(() => setPaletteCopied(false), 2000);
  };

  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTagline.trim() || !newCreator.trim() || !newDescription.trim()) {
      setFormError('Please fill out all fields with cute details! 🎀');
      return;
    }

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      tagline: newTagline.trim(),
      category: newCategory,
      creator: newCreator.trim(),
      creatorAvatar: newEmoji,
      likes: 1,
      demoType: 'interactive',
      previewColor: '#FFF0F5',
      emoji: newEmoji,
      description: newDescription.trim(),
      techStack: ['React', 'Kawaii Engine'],
      toyActionText: 'Launch Project'
    };

    onAddProject(newProj);
    soundManager.playYay();
    fireCuteConfetti();
    setSubmitSuccess(true);

    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setNewTitle('');
      setNewTagline('');
      setNewCreator('');
      setNewDescription('');
      setFormError('');
    }, 1500);
  };

  return (
    <section id="hacks" className="py-16 px-4 sm:px-8 bg-[#FFF9FA] border-y-2 border-[#FFD6E8]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-block px-3 py-1 bg-[#FFD6E8] text-[#8B1E4B] border border-[#3B1B3C] rounded-full text-xs font-retro font-bold mb-2">
              EXHIBIT A // HACKATHON CREATIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#751A3D] tracking-tight">
              Cute Hacks & Digital Toys 🧸
            </h2>
            <p className="text-[#6B2848] text-sm sm:text-base font-medium mt-1">
              Real functional web experiments created for the Y2K Kawaii Hackathon. Click any toy to interact!
            </p>
          </div>

          {/* Submit Action Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              setIsSubmitModalOpen(true);
            }}
            className="btn-chunky px-4 py-2 text-sm font-bold bg-[#FFE66D] hover:bg-[#FFDF4D] text-[#3B1B3C] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Submit a Cute Hack</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 p-3 bg-white border-2 border-[#FFD6E8] rounded-2xl shadow-sm">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundManager.playPop();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#FF70B8] text-white border-2 border-[#3B1B3C] shadow-retro-plum-sm'
                    : 'bg-[#FFF0F5] text-[#8B3A62] hover:bg-[#FFE2EC] border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A2678A]" />
            <input
              type="text"
              placeholder="Search cute projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold bg-[#FFF9FA] border border-[#FBCFE8] focus:border-[#FF70B8] focus:outline-none rounded-xl text-[#4A1D36] placeholder-[#B47C9C]"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const addedLikes = likesState[project.id] || 0;
            const totalLikes = project.likes + addedLikes;

            return (
              <div
                key={project.id}
                className="group relative bg-[#FFFDF9] border-2 border-[#FFC2DB] rounded-3xl p-5 shadow-retro-pink hover:shadow-retro-pink-lg transition-all flex flex-col justify-between"
              >
                {/* Top Row: Category & Like Button */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="text-[11px] font-retro font-bold text-[#8B3A62] bg-[#FFEBF2] px-2.5 py-0.5 rounded-lg border border-[#FBCFE8]">
                    {project.category}
                  </div>

                  <button
                    onClick={(e) => handleLike(project.id, e)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-white hover:bg-[#FFE8EC] text-[#E11D48] border border-[#FBCFE8] rounded-xl transition-transform active:scale-90 cursor-pointer"
                    title="Give heart"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span className="tabular-nums">{totalLikes}</span>
                  </button>
                </div>

                {/* Card Main Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-11 h-11 rounded-2xl bg-[#FFF0F5] border-2 border-[#3B1B3C] flex items-center justify-center text-2xl shadow-retro-plum-sm">
                      {project.emoji}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#751A3D] group-hover:text-[#FF70B8] transition-colors leading-tight">
                        {project.title}
                      </h3>
                      <div className="text-[11px] text-[#A2678A] flex items-center gap-1.5 mt-0.5">
                        <span>by {project.creator}</span>
                        <span>{project.creatorAvatar}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#5C233E] leading-relaxed mb-3">
                    {project.description}
                  </p>

                  {/* Tech Stack tags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-retro text-[#753356] bg-[#F5EDF3] px-2 py-0.5 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Action */}
                <button
                  onClick={() => handleOpenToy(project)}
                  className="btn-chunky w-full py-2.5 text-xs font-extrabold text-[#3B1B3C] bg-[#FFD6E8] hover:bg-[#FFC4DC] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#8B1E4B]" />
                  <span>{project.toyActionText || 'Try Toy Demo'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="p-12 text-center bg-white border-2 border-dashed border-[#FFC2DB] rounded-3xl">
            <p className="text-3xl mb-2">🧸</p>
            <p className="text-base font-bold text-[#751A3D]">No cute hacks match your search!</p>
            <p className="text-xs text-[#8B3A62] mt-1">Try another category or submit your own project above.</p>
          </div>
        )}
      </div>

      {/* Interactive Toy Modal */}
      {activeToyProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FFFDF9] border-3 border-[#3B1B3C] rounded-3xl p-6 shadow-retro-plum-lg">
            <button
              onClick={() => setActiveToyProject(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFE66D] border-2 border-[#3B1B3C] font-bold text-sm text-[#3B1B3C] flex items-center justify-center shadow-retro-plum-sm hover:scale-105"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl p-2 bg-[#FFF0F5] border-2 border-[#3B1B3C] rounded-2xl shadow-retro-plum-sm">
                {activeToyProject.emoji}
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#751A3D]">{activeToyProject.title}</h3>
                <p className="text-xs text-[#8B3A62]">By {activeToyProject.creator} {activeToyProject.creatorAvatar}</p>
              </div>
            </div>

            <p className="text-xs text-[#5C233E] mb-5 leading-relaxed bg-[#FFF2F6] p-3 rounded-xl border border-[#FBCFE8]">
              {activeToyProject.description}
            </p>

            {/* Toy Specific Interactivity */}
            {activeToyProject.id === 'proj-1' && (
              <div className="text-center p-4 bg-[#FFF8FA] border-2 border-dashed border-[#FFC2DB] rounded-2xl mb-4">
                <p className="text-xs font-bold text-[#8B1E4B] mb-3">
                  Click the button below to get an instant comforting warm poem from BaoBao!
                </p>
                {toyBlessing && (
                  <div className="p-3 bg-white border-2 border-[#3B1B3C] rounded-xl mb-3 text-xs font-medium text-[#751A3D] shadow-retro-plum-sm animate-wiggle">
                    {toyBlessing}
                  </div>
                )}
                <button
                  onClick={handleGenerateBlessing}
                  className="btn-chunky px-4 py-2 text-xs font-bold bg-[#FF70B8] text-white border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm cursor-pointer"
                >
                  🌸 Give Me a Warm Bao Blessing
                </button>
              </div>
            )}

            {activeToyProject.id === 'proj-2' && (
              <div className="p-4 bg-[#FFF8FA] border-2 border-dashed border-[#FFC2DB] rounded-2xl mb-4">
                <p className="text-xs font-bold text-[#8B1E4B] mb-2 text-center">
                  Live Early-2000s Web Palette Generator
                </p>
                <div className="flex items-center justify-center gap-2 my-3">
                  {generatedPalette.map((col, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 rounded-xl border-2 border-[#3B1B3C] flex items-center justify-center text-[9px] font-retro font-bold shadow-retro-plum-sm transition-transform hover:scale-110"
                      style={{ backgroundColor: col }}
                      title={col}
                    >
                      <span className="bg-black/30 text-white px-1 rounded">{col}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={handleShufflePalette}
                    className="btn-chunky px-3 py-1.5 text-xs font-bold bg-[#FFE66D] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm cursor-pointer"
                  >
                    🎲 Shuffle Palette
                  </button>
                  <button
                    onClick={handleCopyPalette}
                    className="btn-chunky px-3 py-1.5 text-xs font-bold bg-[#83D9FF] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm flex items-center gap-1 cursor-pointer"
                  >
                    {paletteCopied ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{paletteCopied ? 'Copied HEX!' : 'Copy HEX Codes'}</span>
                  </button>
                </div>
              </div>
            )}

            {(activeToyProject.id === 'proj-4' || activeToyProject.id === 'proj-6') && (
              <div className="p-5 text-center bg-[#FFF8FA] border-2 border-[#3B1B3C] rounded-2xl mb-4 shadow-retro-plum-sm">
                <p className="text-3xl mb-2">{activeToyProject.emoji}</p>
                <p className="text-xs font-bold text-[#751A3D] mb-1">Virtual Floppy Badge Dispensed!</p>
                <p className="text-[11px] font-retro text-[#8B3A62] bg-white p-2 rounded-lg border border-[#FBCFE8]">
                  ID: #Y2K-{Math.floor(1000 + Math.random() * 9000)}-KAWAII-VALIDATED
                </p>
              </div>
            )}

            {activeToyProject.id === 'proj-5' && (
              <div className="p-4 text-center bg-[#FFF8FA] border-2 border-[#3B1B3C] rounded-2xl mb-4">
                <p className="text-xs font-bold text-[#8B1E4B] mb-2">Tap Crystal Chime Notes</p>
                <div className="flex items-center justify-center gap-1.5">
                  {[261.63, 293.66, 329.63, 392.00, 440.00, 523.25].map((freq, i) => (
                    <button
                      key={i}
                      onClick={() => soundManager.playNote(freq)}
                      className="w-10 h-14 bg-[#FFD1E3] hover:bg-[#FFB3D1] border-2 border-[#3B1B3C] rounded-xl text-xs font-bold text-[#751A3D] shadow-retro-plum-sm active:scale-95 flex flex-col items-center justify-end pb-1.5"
                    >
                      <span>{'♪'}</span>
                      <span className="text-[9px]">{i + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveToyProject(null)}
              className="btn-chunky w-full py-2 text-xs font-bold bg-[#FFD6E8] text-[#751A3D] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm"
            >
              Close Toy Box
            </button>
          </div>
        </div>
      )}

      {/* Submit Project Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#FFFDF9] border-3 border-[#3B1B3C] rounded-3xl p-6 shadow-retro-plum-lg">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFE66D] border-2 border-[#3B1B3C] font-bold text-sm text-[#3B1B3C] flex items-center justify-center shadow-retro-plum-sm hover:scale-105"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-[#751A3D] mb-1">
              Submit Your Cute Hack 🎀
            </h3>
            <p className="text-xs text-[#8B3A62] mb-4">
              Add your retro web experiment to the live showcase gallery!
            </p>

            {formError && (
              <div className="mb-3 p-2 bg-[#FEE2E2] border border-[#F87171] text-[#991B1B] text-xs font-semibold rounded-xl">
                {formError}
              </div>
            )}

            {submitSuccess ? (
              <div className="p-6 text-center bg-[#DCFCE7] border-2 border-[#22C55E] rounded-2xl animate-bounce-subtle">
                <p className="text-3xl mb-2">🎉</p>
                <p className="text-sm font-bold text-[#15803D]">Hack Submitted Successfully!</p>
                <p className="text-xs text-[#166534] mt-1">Your project is now visible in the live gallery!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProject} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#751A3D] mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Strawberry Cloud Shuffler"
                    className="w-full px-3 py-2 text-xs bg-white border-2 border-[#FFC2DB] focus:border-[#FF70B8] focus:outline-none rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#751A3D] mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-white border-2 border-[#FFC2DB] focus:border-[#FF70B8] focus:outline-none rounded-xl"
                    >
                      <option value="Cute AI">Cute AI</option>
                      <option value="Pixel Toys">Pixel Toys</option>
                      <option value="Web Tools">Web Tools</option>
                      <option value="Mini Games">Mini Games</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#751A3D] mb-1">Emoji Icon</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={newEmoji}
                      onChange={(e) => setNewEmoji(e.target.value)}
                      className="w-full px-3 py-2 text-xs text-center bg-white border-2 border-[#FFC2DB] focus:border-[#FF70B8] focus:outline-none rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#751A3D] mb-1">Creator Name</label>
                  <input
                    type="text"
                    required
                    value={newCreator}
                    onChange={(e) => setNewCreator(e.target.value)}
                    placeholder="e.g. Luna & Ted"
                    className="w-full px-3 py-2 text-xs bg-white border-2 border-[#FFC2DB] focus:border-[#FF70B8] focus:outline-none rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#751A3D] mb-1">Tagline</label>
                  <input
                    type="text"
                    required
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    placeholder="Short sweet summary"
                    className="w-full px-3 py-2 text-xs bg-white border-2 border-[#FFC2DB] focus:border-[#FF70B8] focus:outline-none rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#751A3D] mb-1">Description</label>
                  <textarea
                    required
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Tell us what this cute tool does..."
                    className="w-full px-3 py-2 text-xs bg-white border-2 border-[#FFC2DB] focus:border-[#FF70B8] focus:outline-none rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-chunky w-full py-2.5 text-xs font-extrabold text-[#3B1B3C] bg-[#FFE66D] hover:bg-[#FFDE4D] border-2 border-[#3B1B3C] rounded-xl shadow-retro-plum-sm mt-2 cursor-pointer"
                >
                  Publish to Gallery 🚀
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
