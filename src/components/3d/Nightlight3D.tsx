import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLAvailable, create3DStar, createCrescentMoon } from './threeHelpers';
import { soundManager } from '../../utils/soundEffects';

interface Nightlight3DProps {
  activeLamps: Record<'star' | 'moon' | 'strawberry', boolean>;
  onToggleLamp: (id: 'star' | 'moon' | 'strawberry') => void;
  className?: string;
}

export const Nightlight3D: React.FC<Nightlight3DProps> = ({
  activeLamps,
  onToggleLamp,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    lamps: {
      star: { group: THREE.Group; light: THREE.PointLight; mat: THREE.MeshStandardMaterial };
      moon: { group: THREE.Group; light: THREE.PointLight; mat: THREE.MeshStandardMaterial };
      strawberry: { group: THREE.Group; light: THREE.PointLight; mat: THREE.MeshStandardMaterial };
    };
    clock: THREE.Clock;
    animId: number;
  } | null>(null);

  // Sync prop changes to 3D lighting & material emissiveness
  useEffect(() => {
    if (sceneRef.current) {
      const { lamps } = sceneRef.current;

      // Star Lamp
      lamps.star.light.intensity = activeLamps.star ? 3.5 : 0.05;
      lamps.star.mat.emissiveIntensity = activeLamps.star ? 0.95 : 0.1;

      // Moon Lamp
      lamps.moon.light.intensity = activeLamps.moon ? 3.0 : 0.05;
      lamps.moon.mat.emissiveIntensity = activeLamps.moon ? 0.9 : 0.1;

      // Strawberry Lamp
      lamps.strawberry.light.intensity = activeLamps.strawberry ? 3.2 : 0.05;
      lamps.strawberry.mat.emissiveIntensity = activeLamps.strawberry ? 0.85 : 0.1;
    }
  }, [activeLamps]);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 2.2, 5.8);
    camera.lookAt(0, 0.5, 0);

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

    // Ambient room light (soft dim nursery at bedtime)
    const ambientLight = new THREE.AmbientLight(0xffeff5, 0.7);
    scene.add(ambientLight);

    // Nursery Wooden Nightstand Shelf
    const shelfGeo = new THREE.BoxGeometry(5.2, 0.35, 2.2);
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0xffe8d6,
      roughness: 0.6,
      metalness: 0.05,
    });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(0, -0.18, 0);
    shelf.receiveShadow = true;
    scene.add(shelf);

    // --- 1. STAR LANTERN (LEFT) ---
    const starGroup = new THREE.Group();
    starGroup.position.set(-1.6, 0.1, 0);
    scene.add(starGroup);

    // Base Stand
    const standGeo = new THREE.CylinderGeometry(0.35, 0.42, 0.15, 20);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.3, metalness: 0.5 });
    const starStand = new THREE.Mesh(standGeo, goldMat);
    starGroup.add(starStand);

    const stemGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 16);
    const starStem = new THREE.Mesh(stemGeo, goldMat);
    starStem.position.y = 0.35;
    starGroup.add(starStem);

    // Glowing Star Body
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xffe66d,
      emissive: 0xffd166,
      emissiveIntensity: activeLamps.star ? 0.95 : 0.1,
      roughness: 0.3,
    });
    const starMesh = create3DStar(0.55, 0.22, 0xffe66d);
    starMesh.material = starMat;
    starMesh.position.y = 0.95;
    starGroup.add(starMesh);

    const starLight = new THREE.PointLight(0xffe66d, activeLamps.star ? 3.5 : 0.05, 6);
    starLight.position.set(0, 0.95, 0.3);
    starGroup.add(starLight);

    // --- 2. CRESCENT MOON LAMP (CENTER) ---
    const moonGroup = new THREE.Group();
    moonGroup.position.set(0, 0.1, 0);
    scene.add(moonGroup);

    // Cloud Pedestal
    const moonPedGeo = new THREE.CylinderGeometry(0.5, 0.55, 0.15, 24);
    const cloudPedMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    const moonPed = new THREE.Mesh(moonPedGeo, cloudPedMat);
    moonGroup.add(moonPed);

    // Glowing Moon Body
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfde047,
      emissiveIntensity: activeLamps.moon ? 0.9 : 0.1,
      roughness: 0.3,
    });
    const moonMesh = createCrescentMoon(0.7);
    moonMesh.material = moonMat;
    moonMesh.position.set(0, 0.85, 0);
    moonMesh.rotation.z = 0.2;
    moonGroup.add(moonMesh);

    const moonLight = new THREE.PointLight(0xfef08a, activeLamps.moon ? 3.0 : 0.05, 6);
    moonLight.position.set(0, 0.85, 0.3);
    moonGroup.add(moonLight);

    // --- 3. STRAWBERRY LAMP (RIGHT) ---
    const strawGroup = new THREE.Group();
    strawGroup.position.set(1.6, 0.1, 0);
    scene.add(strawGroup);

    // Pedestal
    const strawPed = new THREE.Mesh(standGeo, goldMat);
    strawGroup.add(strawPed);

    // Glowing Strawberry Body
    const strawGeo = new THREE.SphereGeometry(0.55, 24, 20);
    strawGeo.scale(0.9, 1.25, 0.9);
    const strawMat = new THREE.MeshStandardMaterial({
      color: 0xff4d6d,
      emissive: 0xff70b8,
      emissiveIntensity: activeLamps.strawberry ? 0.85 : 0.1,
      roughness: 0.4,
    });
    const strawMesh = new THREE.Mesh(strawGeo, strawMat);
    strawMesh.position.y = 0.75;
    strawGroup.add(strawMesh);

    // Green leafy cap
    const leafGeo = new THREE.ConeGeometry(0.3, 0.2, 5);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.7 });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.y = 1.35;
    strawGroup.add(leaf);

    const strawLight = new THREE.PointLight(0xff4d6d, activeLamps.strawberry ? 3.2 : 0.05, 6);
    strawLight.position.set(0, 0.85, 0.3);
    strawGroup.add(strawLight);

    // Raycaster for clicking 3D lamps directly
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);

      // Check intersections
      if (raycaster.intersectObjects(starGroup.children, true).length > 0) {
        onToggleLamp('star');
      } else if (raycaster.intersectObjects(moonGroup.children, true).length > 0) {
        onToggleLamp('moon');
      } else if (raycaster.intersectObjects(strawGroup.children, true).length > 0) {
        onToggleLamp('strawberry');
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    const clock = new THREE.Clock();

    sceneRef.current = {
      renderer,
      scene,
      camera,
      lamps: {
        star: { group: starGroup, light: starLight, mat: starMat },
        moon: { group: moonGroup, light: moonLight, mat: moonMat },
        strawberry: { group: strawGroup, light: strawLight, mat: strawMat },
      },
      clock,
      animId: 0,
    };

    const animate = () => {
      const state = sceneRef.current;
      if (!state) return;

      const delta = state.clock.getDelta();
      const time = state.clock.getElapsedTime();

      // Subtle breathing float on lamps
      starMesh.rotation.y += delta * 0.5;
      moonMesh.rotation.y += delta * 0.4;
      strawMesh.rotation.y += delta * 0.35;

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
        renderer.domElement.removeEventListener('click', handleCanvasClick);
        sceneRef.current.renderer.dispose();
        sceneRef.current.scene.clear();
        sceneRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-[280px] sm:h-[320px] select-none ${className}`}>
      {webglSupported ? (
        <div
          ref={containerRef}
          className="w-full h-full cursor-pointer"
          title="Click any 3D nightlight to toggle its glow ♡"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#FFF0F5] rounded-3xl border-2 border-[#3B1B3C]">
          <span className="text-4xl">⭐🌙🍓</span>
        </div>
      )}

      {/* Floating 3D Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1.5 px-3 py-1 bg-white/90 border border-[#3B1B3C] rounded-full shadow-retro-plum-sm text-[10px] font-retro font-bold text-[#751A3D] whitespace-nowrap">
        <span>💡</span>
        <span>Click any 3D lamp directly on the shelf to switch on/off</span>
      </div>
    </div>
  );
};
