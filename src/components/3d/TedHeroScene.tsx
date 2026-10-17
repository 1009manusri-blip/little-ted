import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  isWebGLAvailable,
  createTedMesh,
  createFluffyCloudMesh,
  create3DStar,
  createCrescentMoon,
  createToyBlock,
  PASTEL_COLORS,
} from './threeHelpers';
import { soundManager } from '../../utils/soundEffects';
import { fireHearts } from '../../utils/confetti';
import { Mascot } from '../Mascot';

interface TedHeroSceneProps {
  onPet?: () => void;
  className?: string;
}

export const TedHeroScene: React.FC<TedHeroSceneProps> = ({ onPet, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [petNotice, setPetNotice] = useState<string | null>(null);

  // References for runtime animation & interaction
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    ted: ReturnType<typeof createTedMesh>;
    stars: THREE.Mesh[];
    cloudPlatform: THREE.Group;
    moon: THREE.Mesh;
    blocks: THREE.Group[];
    heartParticles: THREE.Mesh[];
    animId: number;
    clock: THREE.Clock;
    targetRotationY: number;
    currentRotationY: number;
    targetHeadTilt: { x: number; y: number };
    bounceOffset: number;
    bounceVelocity: number;
    isDragging: boolean;
    previousMouseX: number;
  } | null>(null);

  const triggerTedReaction = useCallback(() => {
    soundManager.playGiggle();
    fireHearts();
    if (onPet) onPet();

    if (sceneRef.current) {
      sceneRef.current.bounceVelocity = 0.22;
      sceneRef.current.ted.setExpression('giggle');

      // Spawn 3D hearts burst
      for (let i = 0; i < 6; i++) {
        const heartGeo = new THREE.SphereGeometry(0.15, 12, 10);
        heartGeo.scale(1, 1.2, 0.6);
        const heartMat = new THREE.MeshStandardMaterial({
          color: PASTEL_COLORS.strawberryRed,
          roughness: 0.3,
          emissive: PASTEL_COLORS.bowPink,
          emissiveIntensity: 0.4,
        });
        const heart = new THREE.Mesh(heartGeo, heartMat);
        heart.position.set(
          (Math.random() - 0.5) * 1.5,
          2.5 + Math.random() * 0.8,
          0.8 + Math.random() * 0.6
        );
        sceneRef.current.scene.add(heart);
        sceneRef.current.heartParticles.push(heart);
      }

      setTimeout(() => {
        if (sceneRef.current) {
          sceneRef.current.ted.setExpression('happy');
        }
      }, 1600);
    }

    setPetNotice('Ted giggles with sweet dreams! 💖');
    setTimeout(() => setPetNotice(null), 2500);
  }, [onPet]);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 420;
    const height = container.clientHeight || 460;

    // --- 1. THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 9.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // Clear existing canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Apply touch-action so mobile vertical scrolling isn't blocked
    renderer.domElement.style.touchAction = 'pan-y';
    renderer.domElement.style.outline = 'none';

    // --- 2. NURSERY LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xfff5f8, 1.4);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffeef5, 0xe0d7ff, 0.8);
    scene.add(hemiLight);

    // Warm Directional Key Light
    const keyLight = new THREE.DirectionalLight(0xfffdf2, 1.8);
    keyLight.position.set(4, 7, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Soft Rim Light from behind
    const rimLight = new THREE.DirectionalLight(0xb99aff, 0.9);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // Subtle front warm fill
    const fillLight = new THREE.PointLight(0xffd1e3, 0.8, 10);
    fillLight.position.set(0, 1.5, 3.5);
    scene.add(fillLight);

    // --- 3. SOFT CONTACT SHADOW ON CLOUD ---
    const shadowGeo = new THREE.PlaneGeometry(3.6, 2.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x5c233e,
      transparent: true,
      opacity: 0.14,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, 0.22, 0);
    scene.add(contactShadow);

    // --- 4. CLOUD PLATFORM ---
    const cloudPlatform = createFluffyCloudMesh(4.8, 1.3, 3.4, PASTEL_COLORS.cloudWhite);
    cloudPlatform.position.set(0, -0.4, 0);
    scene.add(cloudPlatform);

    // --- 5. 3D TED MESH ---
    const ted = createTedMesh();
    ted.group.position.set(0, 0.35, 0);
    scene.add(ted.group);

    // --- 6. FLOATING NURSERY PROPS ---
    // Floating Crescent Moon
    const moon = createCrescentMoon(0.9);
    moon.position.set(2.8, 4.2, -1.2);
    moon.rotation.z = 0.3;
    moon.rotation.y = -0.4;
    scene.add(moon);

    // Floating Stars around Ted
    const stars: THREE.Mesh[] = [];
    const starConfigs = [
      { x: -2.8, y: 3.8, z: -0.5, size: 0.42, rotSpeed: 0.015 },
      { x: -2.2, y: 1.6, z: 1.2, size: 0.28, rotSpeed: -0.02 },
      { x: 2.4, y: 2.2, z: 0.8, size: 0.32, rotSpeed: 0.018 },
      { x: 1.8, y: 4.8, z: -1.5, size: 0.25, rotSpeed: -0.01 },
      { x: 0.2, y: 5.4, z: -2.0, size: 0.48, rotSpeed: 0.012 },
    ];

    starConfigs.forEach((cfg) => {
      const star = create3DStar(cfg.size, cfg.size * 0.35, PASTEL_COLORS.starGold);
      star.position.set(cfg.x, cfg.y, cfg.z);
      scene.add(star);
      stars.push(star);
    });

    // Pastel Alphabet Toy Blocks (T, E, D)
    const blocks: THREE.Group[] = [];
    const blockT = createToyBlock(0.65, 0xffd1e3, 'T');
    blockT.position.set(-2.2, 0.0, 1.4);
    blockT.rotation.set(0.1, 0.3, -0.05);
    scene.add(blockT);
    blocks.push(blockT);

    const blockE = createToyBlock(0.55, 0xffe66d, 'E');
    blockE.position.set(-1.8, 0.6, 1.2);
    blockE.rotation.set(-0.1, -0.2, 0.15);
    scene.add(blockE);
    blocks.push(blockE);

    const blockD = createToyBlock(0.6, 0x83d9ff, 'D');
    blockD.position.set(2.2, 0.0, 1.1);
    blockD.rotation.set(0.05, -0.4, 0.1);
    scene.add(blockD);
    blocks.push(blockD);

    // Small background floating cloud
    const bgCloud = createFluffyCloudMesh(2.5, 0.8, 1.8, 0xfff9fc);
    bgCloud.position.set(-3.2, 4.6, -3.5);
    scene.add(bgCloud);

    // --- 7. POINTER & INTERACTION CONTROLS ---
    const clock = new THREE.Clock();

    sceneRef.current = {
      renderer,
      scene,
      camera,
      ted,
      stars,
      cloudPlatform,
      moon,
      blocks,
      heartParticles: [],
      animId: 0,
      clock,
      targetRotationY: 0,
      currentRotationY: 0,
      targetHeadTilt: { x: 0, y: 0 },
      bounceOffset: 0,
      bounceVelocity: 0,
      isDragging: false,
      previousMouseX: 0,
    };

    // Pointer move listener on canvas
    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (sceneRef.current) {
        if (sceneRef.current.isDragging) {
          const deltaX = e.clientX - sceneRef.current.previousMouseX;
          sceneRef.current.targetRotationY += deltaX * 0.012;
          sceneRef.current.previousMouseX = e.clientX;
        } else {
          // Subtle head gaze tracking pointer
          sceneRef.current.targetHeadTilt.x = THREE.MathUtils.clamp(y * 0.25, -0.2, 0.2);
          sceneRef.current.targetHeadTilt.y = THREE.MathUtils.clamp(x * 0.45, -0.4, 0.4);
        }
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (sceneRef.current) {
        sceneRef.current.isDragging = true;
        sceneRef.current.previousMouseX = e.clientX;
      }
    };

    const handlePointerUp = () => {
      if (sceneRef.current) {
        sceneRef.current.isDragging = false;
      }
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // Resize observer
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

    // --- 8. ANIMATION LOOP ---
    const animate = () => {
      const state = sceneRef.current;
      if (!state) return;

      const delta = state.clock.getDelta();
      const time = state.clock.getElapsedTime();

      // Smooth Ted rotation towards target (with soft return to center if not dragging)
      if (!state.isDragging) {
        state.targetRotationY = THREE.MathUtils.damp(state.targetRotationY, 0, 1.8, delta);
      }
      state.currentRotationY = THREE.MathUtils.damp(
        state.currentRotationY,
        state.targetRotationY,
        8,
        delta
      );
      state.ted.group.rotation.y = state.currentRotationY;

      // Gentle breathing & floating idle motion
      const floatY = Math.sin(time * 1.6) * 0.12;
      const breatheScale = 1 + Math.sin(time * 2.2) * 0.02;

      // Spring bounce physics when clicked/petted
      state.bounceVelocity -= state.bounceOffset * 28 * delta;
      state.bounceVelocity *= Math.exp(-6 * delta);
      state.bounceOffset += state.bounceVelocity;

      state.ted.group.position.y = 0.35 + floatY + state.bounceOffset;
      state.ted.body.scale.set(breatheScale, breatheScale, breatheScale);

      // Smooth head tilt towards pointer
      state.ted.head.rotation.x = THREE.MathUtils.damp(
        state.ted.head.rotation.x,
        state.targetHeadTilt.x,
        6,
        delta
      );
      state.ted.head.rotation.y = THREE.MathUtils.damp(
        state.ted.head.rotation.y,
        state.targetHeadTilt.y,
        6,
        delta
      );

      // Little arm wiggle while floating
      state.ted.leftArm.rotation.z = 0.35 + Math.sin(time * 1.8) * 0.08;
      state.ted.rightArm.rotation.z = -0.35 - Math.sin(time * 1.8 + 0.5) * 0.08;

      // Cloud platform slow bobbing
      state.cloudPlatform.position.y = -0.4 + Math.sin(time * 1.2 + 1) * 0.04;

      // Floating Stars orbit & twinkle
      state.stars.forEach((star, idx) => {
        star.rotation.z += 0.015 * (idx % 2 === 0 ? 1 : -1);
        star.rotation.y += 0.01;
        star.position.y += Math.sin(time * 2 + idx) * 0.003;
      });

      // Crescent Moon float & tilt
      state.moon.position.y = 4.2 + Math.sin(time * 1.4) * 0.1;
      state.moon.rotation.z = 0.3 + Math.sin(time * 0.8) * 0.05;

      // Floating blocks bobbing
      state.blocks.forEach((blk, idx) => {
        blk.position.y = (idx === 1 ? 0.6 : 0.0) + Math.sin(time * 1.5 + idx) * 0.02;
      });

      // Update Heart Particles
      for (let i = state.heartParticles.length - 1; i >= 0; i--) {
        const hp = state.heartParticles[i];
        hp.position.y += delta * 1.6;
        hp.position.x += Math.sin(time * 6 + i) * delta * 0.5;
        hp.scale.multiplyScalar(0.97);

        if (hp.scale.x < 0.1 || hp.position.y > 5.5) {
          state.scene.remove(hp);
          hp.geometry.dispose();
          state.heartParticles.splice(i, 1);
        }
      }

      state.renderer.render(state.scene, state.camera);
      state.animId = requestAnimationFrame(animate);
    };

    sceneRef.current.animId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animId);
        resizeObserver.disconnect();
        canvas.removeEventListener('pointermove', handlePointerMove);
        canvas.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointerup', handlePointerUp);

        sceneRef.current.renderer.dispose();
        sceneRef.current.scene.clear();
        sceneRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`relative w-full h-[380px] sm:h-[440px] flex items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D WebGL Canvas Container */}
      {webglSupported ? (
        <div
          ref={containerRef}
          onClick={triggerTedReaction}
          className="w-full h-full cursor-grab active:cursor-grabbing transition-transform"
          title="Drag to inspect 3D Ted! Click to play ♡"
        />
      ) : (
        /* Fallback if WebGL is unavailable */
        <div className="w-full h-full flex items-center justify-center p-4">
          <Mascot onPet={triggerTedReaction} />
        </div>
      )}

      {/* Floating 3D Interaction Hint Badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center gap-1.5 px-3 py-1 bg-white/85 border border-[#3B1B3C] rounded-full shadow-retro-plum-sm text-[10px] font-retro font-bold text-[#8B1E4B] whitespace-nowrap">
        <span>✨</span>
        <span>Drag to rotate 3D Ted · Click to pet ♡</span>
      </div>

      {/* Live Pet Reaction Floating Notice */}
      {petNotice && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 bg-[#FFF2F6] border-2 border-[#3B1B3C] rounded-2xl shadow-retro-plum text-xs font-bold text-[#8B1E4B] animate-bounce-subtle pointer-events-none">
          {petNotice}
        </div>
      )}
    </div>
  );
};
