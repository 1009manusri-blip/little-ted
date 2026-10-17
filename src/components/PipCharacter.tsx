import React from 'react';

export type PipPose = 
  | 'default'
  | 'pacifier'
  | 'music-box'
  | 'nightlight'
  | 'sleeping-cloud'
  | 'star-hug'
  | 'dream-bag'
  | 'storybook'
  | 'blocks'
  | 'lantern'
  | 'waving';

interface PipCharacterProps {
  pose?: PipPose;
  expression?: 'happy' | 'sparkle' | 'sleepy' | 'giggle' | 'snack' | 'curious';
  hat?: 'bow' | 'crown' | 'party' | 'angel' | 'glasses' | 'nightcap' | 'none';
  nightlightActive?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const PipCharacter: React.FC<PipCharacterProps> = ({
  pose = 'default',
  expression = 'happy',
  hat = 'bow',
  nightlightActive = false,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    xs: 'w-16 h-16 sm:w-20 sm:h-20',
    sm: 'w-24 h-24 sm:w-28 sm:h-28',
    md: 'w-40 h-40 sm:w-48 sm:h-48',
    lg: 'w-48 h-48 sm:w-56 sm:h-56',
    xl: 'w-56 h-56 sm:w-64 sm:h-64',
  };

  return (
    <div className={`relative select-none ${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_8px_0_rgba(59,27,60,0.12)]">
        {/* --- BACKGROUND PROPS DEPENDING ON POSE --- */}

        {/* Fluffy Sleeping Cloud Base for 'sleeping-cloud' or 'storybook' on clouds */}
        {(pose === 'sleeping-cloud' || pose === 'storybook') && (
          <g transform="translate(0, 115)">
            <ellipse cx="60" cy="55" rx="42" ry="26" fill="#FFFFFF" stroke="#3B1B3C" strokeWidth="2.5" />
            <ellipse cx="100" cy="45" rx="52" ry="32" fill="#FFFFFF" stroke="#3B1B3C" strokeWidth="2.5" />
            <ellipse cx="145" cy="55" rx="40" ry="26" fill="#FFFFFF" stroke="#3B1B3C" strokeWidth="2.5" />
            <ellipse cx="100" cy="58" rx="78" ry="28" fill="#FFF5F8" />
            {/* Tiny pastel stars on cloud */}
            <circle cx="68" cy="55" r="2.5" fill="#FFE66D" />
            <circle cx="132" cy="52" r="3" fill="#FF70B8" />
            <circle cx="100" cy="62" r="2" fill="#83D9FF" />
          </g>
        )}

        {/* Angel Wings if Hat is Angel */}
        {(hat === 'angel') && (
          <g className="animate-bounce-subtle">
            <path d="M 45 90 C 20 60 15 110 50 115 C 30 130 55 140 70 120 Z" fill="#FFFFFF" stroke="#3B1B3C" strokeWidth="2.5" />
            <path d="M 155 90 C 180 60 185 110 150 115 C 170 130 145 140 130 120 Z" fill="#FFFFFF" stroke="#3B1B3C" strokeWidth="2.5" />
          </g>
        )}

        {/* --- TED'S CORE ANATOMY (THE SAME ADORABLE TEDDY BEAR) --- */}

        {/* Left Ear */}
        <circle cx="55" cy="55" r="26" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3" />
        <circle cx="55" cy="55" r="15" fill="#FFC9D9" />

        {/* Right Ear */}
        <circle cx="145" cy="55" r="26" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3" />
        <circle cx="145" cy="55" r="15" fill="#FFC9D9" />

        {/* Body */}
        <ellipse cx="100" cy="145" rx="55" ry="48" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3" />
        {/* Belly */}
        <ellipse cx="100" cy="150" rx="36" ry="32" fill="#FFF2E2" />
        {/* Belly Heart */}
        <path d="M 100 145 C 96 138 88 138 88 147 C 88 155 100 162 100 162 C 100 162 112 155 112 147 C 112 138 104 138 100 145 Z" fill="#FF8FB1" />

        {/* Baby Starry Satchel for 'dream-bag' */}
        {pose === 'dream-bag' && (
          <g>
            {/* Cross-body strap */}
            <path d="M 60 115 L 140 160" stroke="#FF70B8" strokeWidth="4" strokeLinecap="round" />
            {/* Tiny dream pouch */}
            <rect x="120" y="142" width="30" height="26" rx="6" fill="#FFE66D" stroke="#3B1B3C" strokeWidth="2" />
            <polygon points="120,142 135,152 150,142" fill="#FFD166" stroke="#3B1B3C" strokeWidth="1.5" />
            <circle cx="135" cy="155" r="2.5" fill="#FF5964" />
          </g>
        )}

        {/* Cozy Blanket for 'sleeping-cloud' */}
        {pose === 'sleeping-cloud' && (
          <g>
            <path
              d="M 48 138 Q 100 128 152 138 L 146 178 Q 100 186 54 178 Z"
              fill="#FFD6E8"
              stroke="#3B1B3C"
              strokeWidth="2.5"
            />
            {/* Blanket patch dots & stitch marks */}
            <circle cx="75" cy="156" r="3" fill="#FFF" />
            <circle cx="100" cy="158" r="3" fill="#FFE66D" />
            <circle cx="125" cy="156" r="3" fill="#83D9FF" />
          </g>
        )}

        {/* Paws */}
        {pose === 'star-hug' ? (
          <g>
            <ellipse cx="62" cy="138" rx="15" ry="18" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="2.5" transform="rotate(35 62 138)" />
            <ellipse cx="138" cy="138" rx="15" ry="18" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="2.5" transform="rotate(-35 138 138)" />
          </g>
        ) : pose === 'nightlight' ? (
          <g>
            <ellipse cx="45" cy="140" rx="16" ry="20" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3" transform="rotate(25 45 140)" />
            <ellipse cx="152" cy="125" rx="16" ry="18" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3" transform="rotate(-30 152 125)" />
          </g>
        ) : pose === 'storybook' ? (
          <g>
            <ellipse cx="65" cy="142" rx="14" ry="16" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="2.5" transform="rotate(25 65 142)" />
            <ellipse cx="135" cy="142" rx="14" ry="16" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="2.5" transform="rotate(-25 135 142)" />
          </g>
        ) : pose === 'waving' ? (
          <g>
            <ellipse cx="45" cy="140" rx="16" ry="20" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3" transform="rotate(25 45 140)" />
            <ellipse cx="160" cy="105" rx="16" ry="20" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3" transform="rotate(-45 160 105)" />
          </g>
        ) : (
          <g>
            <ellipse cx="45" cy="140" rx="16" ry="20" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3" transform="rotate(25 45 140)" />
            <ellipse cx="155" cy="135" rx="16" ry="20" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3" transform="rotate(-20 155 135)" />
          </g>
        )}

        {/* Feet */}
        {pose !== 'sleeping-cloud' && (
          <g>
            <ellipse cx="72" cy="184" rx="20" ry="14" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3" />
            <ellipse cx="72" cy="184" rx="11" ry="8" fill="#FFC9D9" />
            <ellipse cx="128" cy="184" rx="20" ry="14" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3" />
            <ellipse cx="128" cy="184" rx="11" ry="8" fill="#FFC9D9" />
          </g>
        )}

        {/* STAR HUG SPECIAL ASSET: Large golden smiling star held in lap */}
        {pose === 'star-hug' && (
          <g transform="translate(100, 142)">
            <polygon
              points="0,-32 10,-10 32,-8 16,10 20,32 0,20 -20,32 -16,10 -32,-8 -10,-10"
              fill="#FFE66D"
              stroke="#3B1B3C"
              strokeWidth="2.5"
            />
            <circle cx="-9" cy="5" r="4" fill="#FF8CA3" opacity="0.7" />
            <circle cx="9" cy="5" r="4" fill="#FF8CA3" opacity="0.7" />
            <circle cx="-6" cy="0" r="2.5" fill="#3B1B3C" />
            <circle cx="6" cy="0" r="2.5" fill="#3B1B3C" />
            <path d="M -4 6 Q 0 10 4 6" fill="none" stroke="#3B1B3C" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* Head */}
        <ellipse cx="100" cy="95" rx="60" ry="50" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3" />

        {/* Cheeks */}
        <ellipse cx="65" cy="108" rx="12" ry="7" fill="#FF8CA3" opacity="0.65" />
        <ellipse cx="135" cy="108" rx="12" ry="7" fill="#FF8CA3" opacity="0.65" />

        {/* Snout */}
        <ellipse cx="100" cy="106" rx="24" ry="18" fill="#FFF2E2" stroke="#3B1B3C" strokeWidth="2" />
        {/* Nose */}
        <path d="M 94 99 C 94 95 106 95 106 99 C 106 104 100 106 100 106 C 100 106 94 104 94 99 Z" fill="#8B3A62" />

        {/* Mouth or Pacifier */}
        {pose === 'pacifier' ? (
          <g transform="translate(100, 114)">
            {/* Baby Pacifier */}
            <circle cx="0" cy="0" r="10" fill="#83D9FF" stroke="#3B1B3C" strokeWidth="2" />
            <circle cx="0" cy="0" r="5" fill="#FFE66D" />
            <path d="M -6 4 Q 0 14 6 4" fill="none" stroke="#3B1B3C" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ) : pose === 'sleeping-cloud' || expression === 'sleepy' ? (
          <path d="M 95 109 Q 100 112 105 109" fill="none" stroke="#3B1B3C" strokeWidth="2" strokeLinecap="round" />
        ) : expression === 'giggle' ? (
          <path d="M 92 108 Q 100 119 108 108 Z" fill="#FF5E85" stroke="#3B1B3C" strokeWidth="2" />
        ) : (
          <g>
            <path d="M 100 106 L 100 111" stroke="#3B1B3C" strokeWidth="2" />
            <path d="M 93 111 Q 97 115 100 111 Q 103 115 107 111" fill="none" stroke="#3B1B3C" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* Eyes */}
        {pose === 'sleeping-cloud' || expression === 'sleepy' ? (
          <g>
            <path d="M 68 90 Q 76 96 84 90" fill="none" stroke="#3B1B3C" strokeWidth="3" strokeLinecap="round" />
            <path d="M 116 90 Q 124 96 132 90" fill="none" stroke="#3B1B3C" strokeWidth="3" strokeLinecap="round" />
            <text x="145" y="60" fontSize="14" fontWeight="bold" fill="#B99AFF" fontFamily="monospace">zZZ</text>
          </g>
        ) : expression === 'sparkle' || pose === 'nightlight' ? (
          <g>
            <path d="M 75 88 L 77 82 L 79 88 L 85 90 L 79 92 L 77 98 L 75 92 L 69 90 Z" fill="#3B1B3C" />
            <path d="M 125 88 L 127 82 L 129 88 L 135 90 L 129 92 L 127 98 L 125 92 L 119 90 Z" fill="#3B1B3C" />
          </g>
        ) : (
          <g>
            <ellipse cx="76" cy="88" rx="6.5" ry="8" fill="#3B1B3C" />
            <circle cx="74" cy="85" r="2.5" fill="#FFFFFF" />
            <circle cx="78" cy="90" r="1.2" fill="#FFFFFF" />

            <ellipse cx="124" cy="88" rx="6.5" ry="8" fill="#3B1B3C" />
            <circle cx="122" cy="85" r="2.5" fill="#FFFFFF" />
            <circle cx="126" cy="90" r="1.2" fill="#FFFFFF" />
          </g>
        )}

        {/* --- FRONT ASSETS FOR SPECIFIC POSES --- */}

        {/* 1. MUSIC BOX for 'music-box' */}
        {pose === 'music-box' && (
          <g transform="translate(140, 130)">
            <rect x="0" y="10" width="46" height="36" rx="8" fill="#FFCCD5" stroke="#3B1B3C" strokeWidth="2.5" />
            <rect x="4" y="14" width="38" height="28" rx="5" fill="#FFF0F5" />
            <circle cx="23" cy="28" r="8" fill="#FF70B8" stroke="#3B1B3C" strokeWidth="1.5" />
            <text x="19" y="32" fontSize="11" fill="#FFFFFF" fontWeight="bold">♪</text>
            <path d="M 46 22 L 54 22 L 54 12" fill="none" stroke="#FFE66D" strokeWidth="3" strokeLinecap="round" />
            <circle cx="54" cy="12" r="3.5" fill="#FF70B8" stroke="#3B1B3C" strokeWidth="1.5" />
            <g className="animate-float">
              <text x="10" y="-8" fontSize="16" fill="#FF70B8">♫</text>
              <text x="32" y="-18" fontSize="13" fill="#B99AFF">♪</text>
            </g>
          </g>
        )}

        {/* 2. GLOWING NIGHTLIGHT for 'nightlight' */}
        {pose === 'nightlight' && (
          <g transform="translate(155, 95)">
            {nightlightActive && (
              <circle
                cx="15"
                cy="15"
                r="38"
                fill="url(#star-glow)"
                opacity="0.9"
                className="animate-pulse"
              />
            )}
            <path d="M 15 2 L 15 -10" stroke="#FFE66D" strokeWidth="3" strokeLinecap="round" />
            <polygon
              points="15,0 20,10 31,11 23,19 25,30 15,24 5,30 7,19 -1,11 10,10"
              fill={nightlightActive ? '#FFF475' : '#FFE66D'}
              stroke="#3B1B3C"
              strokeWidth="2.5"
            />
            <circle cx="11" cy="14" r="1.8" fill="#3B1B3C" />
            <circle cx="19" cy="14" r="1.8" fill="#3B1B3C" />
            <path d="M 13 17 Q 15 19 17 17" fill="none" stroke="#3B1B3C" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* 3. STORYBOOK for 'storybook' */}
        {pose === 'storybook' && (
          <g transform="translate(100, 148)">
            {/* Open pastel storybook */}
            <path d="M -35 0 C -15 -8 0 0 0 0 C 0 0 15 -8 35 0 L 32 25 C 15 18 0 24 0 24 C 0 24 -15 18 -32 25 Z" fill="#FFF8E8" stroke="#3B1B3C" strokeWidth="2.5" />
            <path d="M 0 0 L 0 24" stroke="#3B1B3C" strokeWidth="2" />
            {/* Book cover spine */}
            <path d="M -37 2 C -15 -6 0 2 0 2 C 0 2 15 -6 37 2 L 34 27 C 15 20 0 26 0 26 C 0 26 -15 20 -34 27 Z" fill="#FFB3D1" stroke="#3B1B3C" strokeWidth="2" />
            {/* Tiny stars on book page */}
            <text x="-24" y="16" fontSize="9" fill="#FF70B8">★</text>
            <text x="14" y="16" fontSize="9" fill="#FFE66D">★</text>
          </g>
        )}

        {/* 4. PASTEL TOY BLOCKS for 'blocks' */}
        {pose === 'blocks' && (
          <g transform="translate(40, 150)">
            <rect x="0" y="0" width="22" height="22" rx="4" fill="#FFD1E3" stroke="#3B1B3C" strokeWidth="2" />
            <text x="6" y="16" fontSize="14" fontWeight="bold" fill="#8B1E4B">A</text>

            <rect x="25" y="-5" width="22" height="22" rx="4" fill="#FFE66D" stroke="#3B1B3C" strokeWidth="2" />
            <text x="31" y="11" fontSize="14" fontWeight="bold" fill="#854D0E">B</text>

            <rect x="14" y="-28" width="22" height="22" rx="4" fill="#83D9FF" stroke="#3B1B3C" strokeWidth="2" />
            <text x="20" y="-12" fontSize="14" fontWeight="bold" fill="#0C4A6E">C</text>
          </g>
        )}

        {/* 5. LANTERN for 'lantern' */}
        {pose === 'lantern' && (
          <g transform="translate(150, 100)">
            <path d="M 5 0 L 15 -14 L 20 -14" fill="none" stroke="#3B1B3C" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="0" y="0" width="22" height="28" rx="5" fill="#FFE66D" stroke="#3B1B3C" strokeWidth="2" />
            <circle cx="11" cy="14" r="5" fill="#FFF8E8" />
            <path d="M 11 9 L 11 19 M 6 14 L 16 14" stroke="#FFA726" strokeWidth="1.5" />
          </g>
        )}

        {/* HATS & BABY ACCESSORIES */}
        {hat === 'bow' && pose !== 'sleeping-cloud' && (
          <g transform="translate(100, 48)">
            <path d="M 0 0 C -22 -14 -22 14 0 0 Z" fill="#FF70B8" stroke="#3B1B3C" strokeWidth="2.5" />
            <path d="M 0 0 C 22 -14 22 14 0 0 Z" fill="#FF70B8" stroke="#3B1B3C" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="6" fill="#FFE66D" stroke="#3B1B3C" strokeWidth="2" />
          </g>
        )}

        {/* Sleeping Baby Nightcap */}
        {(pose === 'sleeping-cloud' || hat === 'nightcap') && (
          <g transform="translate(70, 32)">
            <path
              d="M 10 35 Q 25 5 70 20 Q 55 50 15 42 Z"
              fill="#B99AFF"
              stroke="#3B1B3C"
              strokeWidth="2.5"
            />
            <circle cx="70" cy="20" r="8" fill="#FFFFFF" stroke="#3B1B3C" strokeWidth="2" />
            <ellipse cx="25" cy="40" rx="20" ry="6" fill="#FFFFFF" stroke="#3B1B3C" strokeWidth="2" />
          </g>
        )}

        {/* Radial Gradient Def for Nightlight Glow */}
        <defs>
          <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE66D" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FFD166" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFE66D" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

export const TedCharacter = PipCharacter;
export type TedCharacterProps = PipCharacterProps;
export type TedPose = PipPose;

