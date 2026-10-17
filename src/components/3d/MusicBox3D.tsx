import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLAvailable, create3DStar, PASTEL_COLORS } from './threeHelpers';
import { soundManager } from '../../utils/soundEffects';

interface MusicBox3DProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  className?: string;
}

export const MusicBox3D: React.FC<MusicBox3DProps> = ({
  isPlaying,
  onTogglePlay,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    spinningFigurine: THREE.Group;
    windingKey: THREE.Group;
    notes: THREE.Mesh[];
    clock: THREE.Clock;
    animId: number;
    playing: boolean;
  } | null>(null);

  // Sync isPlaying prop with animation state
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.playing = isPlaying;
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 2.8, 5.8);
    camera.lookAt(0, 0.6, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebglSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = 'pan-y';

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff6fa, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffae6, 1.6);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb99aff, 0.8);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // --- 1. 3D MUSIC BOX BODY ---
    const boxGroup = new THREE.Group();
    boxGroup.position.set(0, 0.2, 0);
    scene.add(boxGroup);

    // Base Box (Pastel pink porcelain with bevels)
    const baseGeo = new THREE.CylinderGeometry(1.4, 1.5, 0.8, 32);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xffd1e3,
      roughness: 0.35,
      metalness: 0.1,
    });
    const baseMesh = new THREE.Mesh(baseGeo, boxMat);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    boxGroup.add(baseMesh);

    // Golden Rim / Trim
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      roughness: 0.25,
      metalness: 0.7,
    });
    const rimGeo = new THREE.TorusGeometry(1.42, 0.06, 16, 32);
    rimGeo.rotateX(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, goldMat);
    rimMesh.position.y = 0.4;
    boxGroup.add(rimMesh);

    // Open Beveled Lid tilted back
    const lidGeo = new THREE.CylinderGeometry(1.45, 1.45, 0.12, 32);
    const lidMesh = new THREE.Mesh(lidGeo, boxMat);
    lidMesh.position.set(0, 0.9, -1.2);
    lidMesh.rotation.x = -Math.PI / 3;
    lidMesh.castShadow = true;
    boxGroup.add(lidMesh);

    // Little mirror on inner lid
    const mirrorGeo = new THREE.CircleGeometry(1.0, 24);
    const mirrorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.9,
    });
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    mirror.position.set(0, 0.92, -1.18);
    mirror.rotation.x = -Math.PI / 3;
    boxGroup.add(mirror);

    // --- 2. WINDING KEY ON THE SIDE ---
    const windingKey = new THREE.Group();
    windingKey.position.set(1.5, 0, 0);
    windingKey.rotation.z = Math.PI / 2;

    const stemGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16);
    const stem = new THREE.Mesh(stemGeo, goldMat);
    windingKey.add(stem);

    const wingGeo = new THREE.TorusGeometry(0.25, 0.06, 12, 24);
    wingGeo.scale(1, 0.6, 1);
    const wing = new THREE.Mesh(wingGeo, goldMat);
    wing.position.y = 0.22;
    wing.rotation.x = Math.PI / 2;
    windingKey.add(wing);

    boxGroup.add(windingKey);

    // --- 3. SPINNING TOP FIGURINE (Tiny 3D Teddy Figurine on pedestal) ---
    const spinningFigurine = new THREE.Group();
    spinningFigurine.position.set(0, 0.42, 0);
    boxGroup.add(spinningFigurine);

    // Velvet pedestal disk
    const pedestalGeo = new THREE.CylinderGeometry(0.65, 0.7, 0.08, 24);
    const velvetMat = new THREE.MeshStandardMaterial({
      color: 0xff70b8,
      roughness: 0.8,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, velvetMat);
    spinningFigurine.add(pedestal);

    // Miniature Golden Star / Bear Figurine
    const miniStar = create3DStar(0.65, 0.18, PASTEL_COLORS.starGold);
    miniStar.position.set(0, 0.7, 0);
    spinningFigurine.add(miniStar);

    // Tiny pink bow on the star
    const bowGeo = new THREE.SphereGeometry(0.12, 12, 10);
    const bowMesh = new THREE.Mesh(bowGeo, boxMat);
    bowMesh.position.set(0, 0.7, 0.15);
    spinningFigurine.add(bowMesh);

    // --- 4. FLOATING 3D MUSICAL NOTES ---
    const notes: THREE.Mesh[] = [];
    const noteColors = [0xff70b8, 0xb99aff, 0xffe66d, 0x83d9ff];

    for (let i = 0; i < 5; i++) {
      const noteGeo = new THREE.SphereGeometry(0.12, 12, 10);
      noteGeo.scale(1, 1.4, 0.5);
      const noteMat = new THREE.MeshStandardMaterial({
        color: noteColors[i % noteColors.length],
        roughness: 0.3,
        emissive: noteColors[i % noteColors.length],
        emissiveIntensity: 0.3,
      });
      const noteMesh = new THREE.Mesh(noteGeo, noteMat);
      noteMesh.position.set((Math.random() - 0.5) * 1.6, 0.8 + Math.random() * 1.5, (Math.random() - 0.5) * 1.2);
      noteMesh.visible = false;
      scene.add(noteMesh);
      notes.push(noteMesh);
    }

    const clock = new THREE.Clock();

    sceneRef.current = {
      renderer,
      scene,
      camera,
      spinningFigurine,
      windingKey,
      notes,
      clock,
      animId: 0,
      playing: isPlaying,
    };

    // Render loop
    const animate = () => {
      const state = sceneRef.current;
      if (!state) return;

      const delta = state.clock.getDelta();
      const time = state.clock.getElapsedTime();

      // Slow gentle wobble for music box
      boxGroup.rotation.y = Math.sin(time * 0.8) * 0.1;

      // When playing, spin the figurine and winding key!
      if (state.playing) {
        state.spinningFigurine.rotation.y += delta * 2.8;
        state.windingKey.rotation.y += delta * 4.2;

        // Animate floating notes
        state.notes.forEach((note, idx) => {
          note.visible = true;
          note.position.y += delta * (0.8 + idx * 0.1);
          note.position.x += Math.sin(time * 4 + idx) * 0.015;
          note.rotation.z += delta * 2;

          if (note.position.y > 3.2) {
            note.position.y = 0.6;
            note.position.x = (Math.random() - 0.5) * 1.4;
          }
        });
      } else {
        // Idle gentle coasting
        state.spinningFigurine.rotation.y += delta * 0.4;
        state.notes.forEach((note) => {
          note.visible = false;
        });
      }

      state.renderer.render(state.scene, state.camera);
      state.animId = requestAnimationFrame(animate);
    };

    sceneRef.current.animId = requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animId);
        resizeObserver.disconnect();
        sceneRef.current.renderer.dispose();
        sceneRef.current.scene.clear();
        sceneRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-[260px] sm:h-[300px] flex items-center justify-center select-none ${className}`}>
      {webglSupported ? (
        <div
          ref={containerRef}
          onClick={onTogglePlay}
          className="w-full h-full cursor-pointer hover:scale-105 transition-transform"
          title={isPlaying ? "Click to pause lullaby" : "Click to wind up & play lullaby ♡"}
        />
      ) : (
        /* Fallback 2D visual */
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFF0F5] rounded-3xl border-2 border-[#3B1B3C]">
          <span className="text-5xl mb-2 animate-bounce-subtle">🎵🧸</span>
          <span className="text-xs font-bold text-[#8B1E4B]">3D Music Box</span>
        </div>
      )}

      {/* Floating 3D status badge */}
      <div className="absolute top-2 right-2 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 bg-white/90 border border-[#3B1B3C] rounded-full shadow-retro-plum-sm text-[10px] font-retro font-bold text-[#751A3D]">
        <span className={isPlaying ? 'text-[#FF70B8] animate-spin' : 'text-gray-400'}>⚙️</span>
        <span>{isPlaying ? 'Winding & Playing...' : 'Click Box to Play'}</span>
      </div>
    </div>
  );
};
