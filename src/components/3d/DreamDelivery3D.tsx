import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLAvailable, create3DStar, createFluffyCloudMesh, PASTEL_COLORS } from './threeHelpers';
import { soundManager } from '../../utils/soundEffects';
import { fireCuteConfetti } from '../../utils/confetti';

interface Destination {
  id: string;
  name: string;
  icon: string;
  message: string;
}

interface DreamDelivery3DProps {
  destinations: Destination[];
  selectedId: string;
  onSelectDestination: (dest: Destination) => void;
  className?: string;
}

export const DreamDelivery3D: React.FC<DreamDelivery3DProps> = ({
  destinations,
  selectedId,
  onSelectDestination,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    carrierGroup: THREE.Group;
    deliveryStar: THREE.Mesh;
    landmarks: Record<string, THREE.Group>;
    clock: THREE.Clock;
    animId: number;
    delivering: boolean;
    deliveryProgress: number;
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
  } | null>(null);

  // Trigger 3D flight animation when selectedId changes
  useEffect(() => {
    if (sceneRef.current && sceneRef.current.landmarks[selectedId]) {
      const targetMesh = sceneRef.current.landmarks[selectedId];
      sceneRef.current.endPos.copy(targetMesh.position);
      sceneRef.current.endPos.y += 0.8;
      sceneRef.current.deliveryProgress = 0;
      sceneRef.current.delivering = true;
    }
  }, [selectedId]);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 440;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    // Tilted isometric-like perspective for cozy toy diorama
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 5.2, 7.5);
    camera.lookAt(0, 0.4, 0);

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
    const ambientLight = new THREE.AmbientLight(0xfff5f8, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbf0, 1.8);
    sunLight.position.set(4, 7, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // --- 1. FLOATING DIORAMA CLOUD ISLAND BASE ---
    const island = createFluffyCloudMesh(6.8, 1.5, 4.8, 0xfffcfd);
    island.position.set(0, -0.4, 0);
    scene.add(island);

    // --- 2. DESTINATION 1: STRAWBERRY COTTAGE (LEFT: X=-2.2, Z=0.5) ---
    const cottageGroup = new THREE.Group();
    cottageGroup.position.set(-2.2, 0.35, 0.6);
    cottageGroup.name = 'strawberry';
    scene.add(cottageGroup);

    // House walls
    const wallGeo = new THREE.BoxGeometry(1.2, 0.8, 1.0);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xfff0f5, roughness: 0.5 });
    const walls = new THREE.Mesh(wallGeo, wallMat);
    walls.castShadow = true;
    cottageGroup.add(walls);

    // Strawberry Roof (cone)
    const roofGeo = new THREE.ConeGeometry(1.0, 0.9, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xff4d6d, roughness: 0.4 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 0.85;
    roof.castShadow = true;
    cottageGroup.add(roof);

    // Green leafy chimney
    const chimGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.4, 8);
    const chimMat = new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.6 });
    const chim = new THREE.Mesh(chimGeo, chimMat);
    chim.position.set(0.35, 1.1, 0);
    cottageGroup.add(chim);

    // --- 3. DESTINATION 2: SLEEPY KITTEN HOUSE (CENTER-RIGHT: X=0.2, Z=-1.2) ---
    const kittenGroup = new THREE.Group();
    kittenGroup.position.set(0.2, 0.35, -1.2);
    kittenGroup.name = 'kitten';
    scene.add(kittenGroup);

    // Cozy blue cottage
    const kWallMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.5 });
    const kWalls = new THREE.Mesh(wallGeo, kWallMat);
    kWalls.castShadow = true;
    kittenGroup.add(kWalls);

    // Kitten Roof with little ears
    const kRoofMat = new THREE.MeshStandardMaterial({ color: 0xb99aff, roughness: 0.4 });
    const kRoof = new THREE.Mesh(roofGeo, kRoofMat);
    kRoof.position.y = 0.85;
    kittenGroup.add(kRoof);

    // Ear 1
    const earGeo = new THREE.ConeGeometry(0.18, 0.28, 4);
    const leftEar = new THREE.Mesh(earGeo, kRoofMat);
    leftEar.position.set(-0.35, 1.25, 0.15);
    kittenGroup.add(leftEar);

    // Ear 2
    const rightEar = new THREE.Mesh(earGeo, kRoofMat);
    rightEar.position.set(0.35, 1.25, 0.15);
    kittenGroup.add(rightEar);

    // --- 4. DESTINATION 3: CLOUD CASTLE (RIGHT: X=2.3, Z=0.4) ---
    const castleGroup = new THREE.Group();
    castleGroup.position.set(2.3, 0.35, 0.4);
    castleGroup.name = 'castle';
    scene.add(castleGroup);

    // Castle Base
    const cBaseGeo = new THREE.CylinderGeometry(0.8, 0.85, 0.9, 16);
    const cMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.4 });
    const cBase = new THREE.Mesh(cBaseGeo, cMat);
    cBase.castShadow = true;
    castleGroup.add(cBase);

    // Spire
    const spireGeo = new THREE.ConeGeometry(0.9, 1.2, 16);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0xffd1e3, roughness: 0.3 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.y = 1.0;
    spire.castShadow = true;
    castleGroup.add(spire);

    // Star Flag on top
    const starFlag = create3DStar(0.25, 0.08, 0xffe66d);
    starFlag.position.set(0, 1.7, 0);
    castleGroup.add(starFlag);

    // --- 5. TED'S DISPATCH CLOUD BASE (FRONT-CENTER: X=0, Z=1.6) ---
    const dispatchBase = createFluffyCloudMesh(1.8, 0.6, 1.4, 0xfff0f5);
    dispatchBase.position.set(0, 0.2, 1.6);
    scene.add(dispatchBase);

    // Mini star post on dispatch base
    const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 12);
    const postMat = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.3 });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(0, 0.65, 1.6);
    scene.add(post);

    // --- 6. FLYING 3D DREAM DELIVERY STAR / ENVELOPE ---
    const carrierGroup = new THREE.Group();
    carrierGroup.position.set(0, 1.1, 1.6);
    scene.add(carrierGroup);

    const deliveryStar = create3DStar(0.4, 0.12, 0xffe66d);
    carrierGroup.add(deliveryStar);

    // Tiny pink wings on the star
    const wingGeo = new THREE.SphereGeometry(0.15, 8, 8);
    wingGeo.scale(1.4, 0.4, 0.1);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const lWing = new THREE.Mesh(wingGeo, wingMat);
    lWing.position.set(-0.35, 0, 0);
    lWing.rotation.z = 0.3;
    carrierGroup.add(lWing);

    const rWing = new THREE.Mesh(wingGeo, wingMat);
    rWing.position.set(0.35, 0, 0);
    rWing.rotation.z = -0.3;
    carrierGroup.add(rWing);

    // Raycaster for clicking landmarks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);

      const targets = [
        { group: cottageGroup, id: 'strawberry' },
        { group: kittenGroup, id: 'kitten' },
        { group: castleGroup, id: 'castle' },
      ];

      for (const t of targets) {
        if (raycaster.intersectObjects(t.group.children, true).length > 0) {
          const dest = destinations.find((d) => d.id === t.id);
          if (dest) onSelectDestination(dest);
          break;
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    const clock = new THREE.Clock();

    sceneRef.current = {
      renderer,
      scene,
      camera,
      carrierGroup,
      deliveryStar,
      landmarks: {
        strawberry: cottageGroup,
        kitten: kittenGroup,
        castle: castleGroup,
      },
      clock,
      animId: 0,
      delivering: false,
      deliveryProgress: 0,
      startPos: new THREE.Vector3(0, 1.1, 1.6),
      endPos: new THREE.Vector3(-2.2, 1.2, 0.6),
    };

    // Render loop
    const animate = () => {
      const state = sceneRef.current;
      if (!state) return;

      const delta = state.clock.getDelta();
      const time = state.clock.getElapsedTime();

      // Slow island floating
      island.position.y = -0.4 + Math.sin(time * 0.8) * 0.04;

      // Handle delivery flight along parabolic bezier arc
      if (state.delivering) {
        state.deliveryProgress += delta * 1.4;

        if (state.deliveryProgress >= 1) {
          state.deliveryProgress = 1;
          state.delivering = false;
          soundManager.playYay();
          fireCuteConfetti();
        }

        const t = state.deliveryProgress;
        // Parabolic arc interpolation
        state.carrierGroup.position.lerpVectors(state.startPos, state.endPos, t);
        state.carrierGroup.position.y += Math.sin(t * Math.PI) * 1.8;

        state.deliveryStar.rotation.z += delta * 8;
        state.deliveryStar.rotation.y += delta * 6;
      } else {
        // Idle hover
        state.deliveryStar.rotation.z += delta * 1.2;
        state.carrierGroup.position.y += Math.sin(time * 2.5) * 0.003;
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
          title="Click any landmark in the 3D diorama to dispatch dream delivery! ♡"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#FFF0F5] rounded-3xl border-2 border-[#3B1B3C]">
          <span className="text-4xl">🍓🐱🏰</span>
        </div>
      )}

      {/* Floating Diorama Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1.5 px-3 py-1 bg-white/90 border border-[#3B1B3C] rounded-full shadow-retro-plum-sm text-[10px] font-retro font-bold text-[#751A3D] whitespace-nowrap">
        <span>☁️</span>
        <span>Click landmarks to fly Ted's star delivery!</span>
      </div>
    </div>
  );
};
