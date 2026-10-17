export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'Cute AI' | 'Pixel Toys' | 'Web Tools' | 'Mini Games';
  creator: string;
  creatorAvatar: string;
  likes: number;
  featured?: boolean;
  demoType: 'interactive' | 'embed' | 'toy';
  previewColor: string;
  emoji: string;
  description: string;
  techStack: string[];
  toyActionText?: string;
}

export interface PlacedSticker {
  id: string;
  stickerId: string;
  symbol: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface StickerDefinition {
  id: string;
  label: string;
  symbol: string;
  category: 'animals' | 'sweets' | 'y2k' | 'stars';
}

export interface GuestbookEntry {
  id: string;
  name: string;
  location?: string;
  message: string;
  timestamp: string;
  color: 'pink' | 'lavender' | 'yellow' | 'mint' | 'blue';
  stamp: string;
  claps: number;
}

export interface PetStatus {
  happiness: number; // 0-100
  hunger: number;    // 0-100
  energy: number;    // 0-100
  sparkles: number;  // 0-100
  mood: 'happy' | 'sparkle' | 'sleepy' | 'snack' | 'giggle' | 'party';
  hat: 'none' | 'bow' | 'crown' | 'party' | 'angel' | 'glasses';
  level: number;
}

export interface WebBadge {
  id: string;
  title: string;
  sub: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: string;
  clicks: number;
}
