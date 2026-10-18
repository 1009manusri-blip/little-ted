# Ted's Little Dreamland ♡ 🧸✨

> **"tiny teddy. big dreams. very important naps."**

Welcome to **Ted's Little Dreamland ♡**, an interactive 3D character portfolio created for the **haX.baby** hackathon. 

Ted is an adorable, sleepy, and gentle teddy bear who serves as a **Junior Dream Engineer** at the Midnight Nursery. He crafts cozy nightlights, composes gentle lullabies, writes bedtime stories, and delivers magical dreams to sleepy creatures across the treetops.

---

## 🎀 The Six Mandatory Hackathon Requirements

1. **WHAT TED IS**:
   - Comprehensive character introduction in the nursery scrapbook section.
   - Details: Job (Junior Dream Engineer), Home (The Midnight Nursery), Favourite Thing (Tiny stars), Favourite Activity (Cloud naps), Special Talent (Making sleepy-time magic).
   - Interactive mood selector with three distinct modes: **Eepy 😴**, **Curious 🔍**, and **Dreamy ✨** that updates Ted's expression, pose, and status message.

2. **WHAT TED DOES (4 Interactive Creations)**:
   - **Project A — Ted's Tiny Lullaby Box 🎵**: A 3D interactive music box with a spinning golden star figurine and rotating winding key. Offers **6 genuinely distinct synthesized lullabies**:
     1. *Cloudy Cuddles* ☁️ (sine pentatonic, floaty slow tempo)
     2. *Sleepy Star* ⭐ (triangle waveform, bright bell-like high melody)
     3. *Moonbeam Waltz* 🌙 (3/4 waltz rhythm, down-beat bass & light floats)
     4. *Strawberry Dreams* 🍓 (playful bounce in F major)
     5. *Little Bunny's Nap* 🐰 (rocking cradle soothing rhythm)
     6. *Midnight Humming* ✨ (minimal, quiet lower register notes)
     Includes song picker pills, Play, Pause, Stop, current-note progress indicator, and master mute toggle.
   - **Project B — The Nightlight Collection 🌙**: 3D nursery shelf displaying three distinct lamps:
     - *Little Star Lantern* ⭐
     - *Crescent Moon Lamp* 🌙
     - *Strawberry Bedside Lamp* 🍓
     Interactive toggles dynamically illuminate Three.js point lights and emissive glows, casting soft ambient lighting across the room with individual captions.
   - **Project C — Dream Delivery Routes ☁️**: Interactive 3D dream-delivery diorama featuring Ted's dispatch station and three rooftop destinations:
     - *The Strawberry Cottage* 🍓
     - *The Sleepy Kitten House* 🐱
     - *The Cloud Castle* 🏰
     Selecting a destination sends a 3D flying winged star along an animated parabolic flight trajectory, triggering unique dream messages upon arrival.
   - **Project D — Ted's Bedtime Storybook 📖**: Interactive 3-page illustrated picture book with dimensional styling following Ted helping a lost baby star find sweet sleep.

3. **TED'S ORIGIN STORY**:
   - Dedicated 3-scene picture book memory sequence (under 150 words per scene):
     - **Scene 1: The Little Star**: How a tiny tumbling star landed beside Ted's moon pillow.
     - **Scene 2: A Tiny Idea**: Discovering that sleepy forest creatures needed lights, songs, and dreams.
     - **Scene 3: The Midnight Nursery**: Ted becoming the nursery's youngest Dream Engineer.

4. **IMMERSION & VISITOR REACTIVITY**:
   - Visitor can drag to rotate/inspect 3D Ted on desktop and mobile.
   - Ted smoothly tracks pointer movement with head tilt and gaze.
   - Clicking Ted triggers a joyful bounce, giggle sound effect, and bursting 3D hearts.
   - Interactive 3D lamps, 3D music box, 3D diorama, and responsive audio feedback.

5. **MOBILE RESPONSIVENESS**:
   - Responsive layouts tested across 320px, 375px, 430px mobile, tablet, and desktop viewports.
   - Touch controls use `touch-action: pan-y` so vertical scrolling is never blocked by WebGL canvases.
   - WebGL capability detection with automatic graceful fallback to layered 2.5D SVG/CSS illustrations if WebGL is unavailable.

6. **HIDDEN EASTER EGG**:
   - Twinkling golden star near Ted's 3D cloud platform (and on the nursery postcard). Clicking it 4 times reveals:
     > *"Psst... Ted saved one extra dream just for you. ♡"*
     Accompanied by a joyful confetti and floating hearts shower!

---

## 🛠️ 3D & Audio Technology

- **Three.js (r182+)**: Procedural 3D geometries (`SphereGeometry`, `ExtrudeGeometry` with bevels, `CylinderGeometry`, `TorusGeometry`, `BoxGeometry`) for Ted's plush body, fluffy clouds, faceted stars, crescent moons, music box, nightlights, and dream diorama.
- **PBR Materials (`MeshStandardMaterial`)**: Soft velvet roughness, metallic accents, and emissive lighting.
- **Web Audio API**: 100% synthesized procedural sound effects and 6 lullaby compositions (no external audio files, zero network latency, zero broken asset links).
- **canvas-confetti**: Pastel confetti explosions and heart showers.
- **Tailwind CSS 4**: Retro-kawaii palette, chunky offset box-shadows (`shadow-retro-plum`), and polka dot / notebook paper backgrounds.

---

## 📁 Project Structure

```
├── index.html                  # HTML entry point with metadata & Google Fonts
├── metadata.json               # AI Studio applet capabilities
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite bundler configuration
├── server.ts                   # Express server with Vite middlewares & Gemini API
└── src/
    ├── App.tsx                 # Root application component
    ├── index.css               # Global retro-kawaii typography & CSS layers
    ├── main.tsx                # React DOM entry point
    ├── components/
    │   ├── TedChatWidget.tsx       # "Talk to Ted ♡" AI-powered character chatbot
    │   ├── 3d/
    │   │   ├── threeHelpers.ts     # Procedural 3D mesh generators & WebGL detection
    │   │   ├── TedHeroScene.tsx    # 3D interactive Hero scene with Ted & nursery props
    │   │   ├── MusicBox3D.tsx      # 3D interactive Music Box with spinning figurine
    │   │   ├── Nightlight3D.tsx    # 3D bedside shelf with real point lights
    │   │   └── DreamDelivery3D.tsx # 3D diorama with parabolic flight delivery routes
    │   ├── AboutSection.tsx        # Character introduction & interactive mood scrapbook
    │   ├── CreationsSection.tsx    # 4 interactive creative projects
    │   ├── StorySection.tsx        # 3-scene origin story
    │   ├── GrowthChartSection.tsx  # Interactive nursery measurement wall
    │   ├── TinyNoteSection.tsx     # Postcard & Easter egg trigger
    │   ├── HeroSection.tsx         # Hero banner with 3D Ted & primary CTAs
    │   ├── Mascot.tsx              # Fallback 2D mascot with wardrobe & reactions
    │   ├── Navbar.tsx              # Sticky header with kawaii character brand logo
    │   ├── MarqueeBanner.tsx       # Retro scrolling announcement banner
    │   └── Footer.tsx              # Clean footer with site navigation
    ├── data/
    │   └── initialData.ts          # Seed data for projects, surprises, and stickers
    └── utils/
        ├── soundEffects.ts         # Web Audio API engine & 6 lullaby compositions
        └── confetti.ts             # Pastel confetti & heart particle emitters
```

---

## 🚀 Installation & Development

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Starts the local development server at `http://localhost:3000`.

### Production Build
```bash
npm run build
```
Generates optimized static assets in the `dist/` directory.

### Type Check & Linting
```bash
npm run lint
```
Runs TypeScript verification (`tsc --noEmit`).

---

## 🧸 Asset & Design Credits
- **Design & Concept**: Original character "Ted" and "Ted's Little Dreamland ♡" designed for haX.baby.
- **Icons**: Lucide React.
- **Audio & Geometry**: 100% procedurally synthesized in code using the Web Audio API and Three.js.
