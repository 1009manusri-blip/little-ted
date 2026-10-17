import { Project, StickerDefinition, GuestbookEntry, WebBadge } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'BaoBao AI: Kindness Companion',
    tagline: 'A generative mood pet that responds with warm hugs & cozy poems',
    category: 'Cute AI',
    creator: 'Yuki & Kiki',
    creatorAvatar: '🐱',
    likes: 342,
    featured: true,
    demoType: 'interactive',
    previewColor: '#FFF0F5',
    emoji: '🥟',
    description: 'BaoBao is a tiny steaming dumpling companion who converts stressful thoughts into whimsical pastel haikus. Features local sentiment analysis, cozy soundscapes, and heart bubbles.',
    techStack: ['Gemini Flash', 'Web Audio API', 'React', 'Canvas'],
    toyActionText: 'Receive a Warm Bao Blessing'
  },
  {
    id: 'proj-2',
    title: 'PastelPalette 3000',
    tagline: 'Retro color harmony extractor for early-2000s personal shrines',
    category: 'Web Tools',
    creator: 'RetroPixel_Dan',
    creatorAvatar: '👾',
    likes: 218,
    featured: false,
    demoType: 'interactive',
    previewColor: '#F0F9FF',
    emoji: '🎨',
    description: 'Upload or generate nostalgic web palettes like Bubblegum Cyber, Strawberry Milk 98, and Neon Lavender Dream. One-click CSS copy with retro hex codes.',
    techStack: ['ColorJS', 'Tailwind', 'SVG Filters'],
    toyActionText: 'Generate Kawaii Palette'
  },
  {
    id: 'proj-3',
    title: 'ChibiStar Catcher DX',
    tagline: 'Catch falling sweet treats before the bedtime rain starts!',
    category: 'Mini Games',
    creator: 'Mimi Studios',
    creatorAvatar: '🐰',
    likes: 489,
    featured: true,
    demoType: 'toy',
    previewColor: '#FEFCE8',
    emoji: '⭐',
    description: 'An arcade rhythm-reaction game designed with retro 8-bit sound effects. Catch golden stars and strawberry mochi while dodging grumpy storm clouds.',
    techStack: ['HTML5 Canvas', 'Web Audio Synth', 'RequestAnimationFrame'],
    toyActionText: 'Launch Star Arcade'
  },
  {
    id: 'proj-4',
    title: 'Tamagotchi Memory Vault',
    tagline: 'Save your digital pets on a virtual floppy disk forever',
    category: 'Pixel Toys',
    creator: 'ChronoBaby',
    creatorAvatar: '🧸',
    likes: 195,
    featured: false,
    demoType: 'interactive',
    previewColor: '#FAF5FF',
    emoji: '💾',
    description: 'A pixelated memory card emulator where you can design custom virtual pets, feed them pixel cookies, and export them as retro 88x31 animated badges.',
    techStack: ['IndexedDB', 'Pixel Rendering', 'Web Worker'],
    toyActionText: 'Create Virtual Floppy'
  },
  {
    id: 'proj-5',
    title: 'Lullaby Cloud Synthesizer',
    tagline: 'Interactive pentatonic music box that creates dreamy chime loops',
    category: 'Web Tools',
    creator: 'Aria Bells',
    creatorAvatar: '🌸',
    likes: 310,
    featured: false,
    demoType: 'toy',
    previewColor: '#F0FDF4',
    emoji: '🔔',
    description: 'Compose sweet melodic chime loops on an 8-note crystal marimba. Includes sleep timer mode, rain sound layer, and automatic harmonic chord generator.',
    techStack: ['Web Audio API', 'OscillatorNodes', 'BiquadFilter'],
    toyActionText: 'Play Chime Keys'
  },
  {
    id: 'proj-6',
    title: 'StickerSwap Webring 2000',
    tagline: 'Decentralized retro badge & sticker trading club for web wanderers',
    category: 'Pixel Toys',
    creator: 'Captain Kawaii',
    creatorAvatar: '🍓',
    likes: 276,
    featured: false,
    demoType: 'interactive',
    previewColor: '#FFF1F2',
    emoji: '💌',
    description: 'Remember the webrings of 1999? This platform lets personal site owners embed interactive sticker-dispensing widgets and trade rare holographic stamps.',
    techStack: ['Web Components', 'LocalStorage', 'CSS Hologram FX'],
    toyActionText: 'Dispense Rare Stamp'
  }
];

export const STICKER_LIBRARY: StickerDefinition[] = [
  { id: 'stk-bear', label: 'Teddy Bear', symbol: '🧸', category: 'animals' },
  { id: 'stk-bunny', label: 'White Bunny', symbol: '🐰', category: 'animals' },
  { id: 'stk-cat', label: 'Kitty', symbol: '🐱', category: 'animals' },
  { id: 'stk-chick', label: 'Baby Chick', symbol: '🐥', category: 'animals' },
  { id: 'stk-frog', label: 'Pastel Frog', symbol: '🐸', category: 'animals' },
  { id: 'stk-bow', label: 'Pink Bow', symbol: '🎀', category: 'y2k' },
  { id: 'stk-heart-sparkle', label: 'Sparkle Heart', symbol: '💖', category: 'y2k' },
  { id: 'stk-candy', label: 'Sweet Candy', symbol: '🍬', category: 'sweets' },
  { id: 'stk-lollipop', label: 'Swirl Pop', symbol: '🍭', category: 'sweets' },
  { id: 'stk-strawberry', label: 'Strawberry', symbol: '🍓', category: 'sweets' },
  { id: 'stk-milk', label: 'Pink Milk Box', symbol: '🥛', category: 'sweets' },
  { id: 'stk-cake', label: 'Birthday Cake', symbol: '🎂', category: 'sweets' },
  { id: 'stk-star', label: 'Smiling Star', symbol: '⭐', category: 'stars' },
  { id: 'stk-sparkles', label: 'Glitter Burst', symbol: '✨', category: 'stars' },
  { id: 'stk-rainbow', label: 'Tiny Rainbow', symbol: '🌈', category: 'stars' },
  { id: 'stk-cherry', label: 'Twin Cherries', symbol: '🍒', category: 'sweets' },
  { id: 'stk-gameboy', label: 'Pocket Game', symbol: '🎮', category: 'y2k' },
  { id: 'stk-floppy', label: 'Floppy Disk', symbol: '💾', category: 'y2k' },
  { id: 'stk-flower', label: 'Blossom', symbol: '🌸', category: 'stars' },
  { id: 'stk-sparkle-heart', label: 'Love Letter', symbol: '💌', category: 'y2k' },
  { id: 'stk-butterfly', label: 'Pastel Butterfly', symbol: '🦋', category: 'animals' },
  { id: 'stk-ribbon', label: 'Ribbon', symbol: '🎗️', category: 'y2k' },
  { id: 'stk-gem', label: 'Shiny Jewel', symbol: '💎', category: 'stars' },
  { id: 'stk-sunflower', label: 'Sunflower', symbol: '🌻', category: 'stars' },
];

export const INITIAL_GUESTBOOK: GuestbookEntry[] = [
  {
    id: 'gb-1',
    name: 'Princess Bubbles',
    location: 'Cyber Dreamland',
    message: 'OMG THIS IS THE CUTEST SITE IN THE WHOLE INTERNET!! 💖 I placed 20 stickers on my screen and I am never closing this tab! <3',
    timestamp: 'Just now',
    color: 'pink',
    stamp: '🎀',
    claps: 42
  },
  {
    id: 'gb-2',
    name: 'Neo_Hacker_99',
    location: 'Tokyo, JP',
    message: 'Came for the hackathon showcase, stayed for the Mochi teddy petting simulator. Certified 10/10 early web nostalgic excellence! 🧸',
    timestamp: '14 mins ago',
    color: 'lavender',
    stamp: '💾',
    claps: 29
  },
  {
    id: 'gb-3',
    name: 'StrawbBerryShortcake',
    location: 'Cloud 9',
    message: 'The chime synthesizer gave me instant serotonin! Keep building joyful whimsical websites, the world needs more pink! 🍓✨',
    timestamp: '1 hour ago',
    color: 'yellow',
    stamp: '🍓',
    claps: 37
  },
  {
    id: 'gb-4',
    name: 'PixelWizard',
    location: 'Geocities Archive',
    message: 'Netscape 4.0 approved! Your 88x31 badges are gorgeous. Bookmarking in my favorites folder forever! 🌸',
    timestamp: '3 hours ago',
    color: 'mint',
    stamp: '⭐',
    claps: 18
  }
];

export const RETRO_BADGES: WebBadge[] = [
  {
    id: 'b1',
    title: 'HAX.BABY 2000',
    sub: 'OFFICIAL CERTIFIED',
    bgColor: '#FF70B8',
    textColor: '#FFFFFF',
    borderColor: '#3B1B3C',
    icon: '🎀',
    clicks: 142
  },
  {
    id: 'b2',
    title: 'MADE W/ CRAYONS',
    sub: '100% HAND CRAFTED',
    bgColor: '#FFE66D',
    textColor: '#4A2035',
    borderColor: '#3B1B3C',
    icon: '🖍️',
    clicks: 98
  },
  {
    id: 'b3',
    title: 'NO AI SLOP',
    sub: 'PURE KAWAII SOUL',
    bgColor: '#A5F3C1',
    textColor: '#064E3B',
    borderColor: '#3B1B3C',
    icon: '✨',
    clicks: 215
  },
  {
    id: 'b4',
    title: 'NETSCAPE READY',
    sub: 'VIEW AT 800x600',
    bgColor: '#83D9FF',
    textColor: '#0C4A6E',
    borderColor: '#3B1B3C',
    icon: '🌐',
    clicks: 74
  },
  {
    id: 'b5',
    title: 'STRAWBERRY MILK',
    sub: 'HIGH CALCIUM JOY',
    bgColor: '#FFCCD5',
    textColor: '#9F1239',
    borderColor: '#3B1B3C',
    icon: '🥛',
    clicks: 163
  },
  {
    id: 'b6',
    title: 'BEST OF THE WEB',
    sub: 'Y2K WEB AWARD',
    bgColor: '#B99AFF',
    textColor: '#2E1065',
    borderColor: '#3B1B3C',
    icon: '🏆',
    clicks: 188
  }
];

export const RANDOM_SURPRISES = [
  {
    title: 'Warm Ted Bear-Hug! 🧸',
    text: 'Ted wrapped you in a giant pastel blanket of pure positivity and sweet dreams. You are doing amazing!',
    sticker: '🧸',
    actionType: 'hearts'
  },
  {
    title: 'Lucky Strawberry Fortune! 🍓',
    text: 'Today is your luckiest day! An unexpected delightful bug fix or creative idea will pop into your mind.',
    sticker: '🍓',
    actionType: 'confetti'
  },
  {
    title: 'Secret Kawaii Dance Party! 💃',
    text: 'All the pixel bunnies on the page just started tap-dancing! Serotonin level boosted to 9999%!',
    sticker: '🐰',
    actionType: 'yay'
  },
  {
    title: 'Golden Starlight Shower! ⭐',
    text: 'You wished upon the smiling retro star! A rain of glitter candy has been dispatched to your day.',
    sticker: '⭐',
    actionType: 'confetti'
  },
  {
    title: 'Rare Holographic Ribbon! 🎀',
    text: 'You discovered the rarest badge in the toybox! Badge added to your digital scrapbook.',
    sticker: '🎀',
    actionType: 'hearts'
  }
];
