import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { 
  Sun, Moon, Sunset, Layers, RotateCcw, Eye, ChevronDown, 
  ChevronUp, Compass, Maximize2, Sparkles, Building, Glasses,
  Smartphone, MapPin, X, ArrowLeft
} from 'lucide-react';

interface ThreePropertyViewerProps {
  currentLang: 'en' | 'ar';
  propertyTitle?: string;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const ThreePropertyViewer: React.FC<ThreePropertyViewerProps> = ({
  currentLang,
  propertyTitle = 'The Travertine Sanctuary',
  onClose,
  isEmbedded = false
}) => {
  const isAr = currentLang === 'ar';
  const mountRef = useRef<HTMLDivElement>(null);
  
  // HUD controls state
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [lightingPreset, setLightingPreset] = useState<'sunset' | 'daylight' | 'twilight'>('sunset');
  const [explodedLevel, setExplodedLevel] = useState(0); // 0 to 1
  const [cameraPreset, setCameraPreset] = useState<'aerial' | 'pool' | 'terrace' | 'front'>('pool');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isVRMode, setIsVRMode] = useState(false);
  const [vrLocation, setVrLocation] = useState<'pool' | 'living' | 'terrace'>('pool');

  // Mutable refs for Three.js animation loop
  const stateRef = useRef({
    exploded: 0,
    targetExploded: 0,
    targetCamPos: new THREE.Vector3(18, 12, 22),
    targetLookAt: new THREE.Vector3(0, 3, 0),
    currentLookAt: new THREE.Vector3(0, 3, 0),
    autoRotate: true,
    lightingMode: 'sunset',
    isVRMode: false,
    vrOrientation: new THREE.Euler(0, 0, 0, 'YXZ'),
    stereoCamera: new THREE.StereoCamera()
  });

  useEffect(() => {
    stateRef.current.targetExploded = explodedLevel;
  }, [explodedLevel]);

  useEffect(() => {
    stateRef.current.autoRotate = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    stateRef.current.lightingMode = lightingPreset;
  }, [lightingPreset]);

  useEffect(() => {
    stateRef.current.isVRMode = isVRMode;
  }, [isVRMode]);

  // Set camera targets
  useEffect(() => {
    if (isVRMode) return; // In VR mode, position is controlled by VR location hotspots

    if (cameraPreset === 'aerial') {
      stateRef.current.targetCamPos.set(24, 28, 28);
      stateRef.current.targetLookAt.set(0, 2, 0);
    } else if (cameraPreset === 'pool') {
      stateRef.current.targetCamPos.set(16, 8, 20);
      stateRef.current.targetLookAt.set(0, 3, 0);
    } else if (cameraPreset === 'terrace') {
      stateRef.current.targetCamPos.set(8, 11, 14);
      stateRef.current.targetLookAt.set(-2, 6, 0);
    } else if (cameraPreset === 'front') {
      stateRef.current.targetCamPos.set(0, 6, 26);
      stateRef.current.targetLookAt.set(0, 4, 0);
    }
  }, [cameraPreset, isVRMode]);

  // VR Mode Toggle Handler
  const toggleVRMode = () => {
    const nextVR = !isVRMode;
    setIsVRMode(nextVR);
    stateRef.current.isVRMode = nextVR;

    if (nextVR) {
      setIsAutoRotating(false);
      stateRef.current.autoRotate = false;
      // Position camera at eye-level inside the residence
      stateRef.current.targetCamPos.set(4, 2.2, 12);
      stateRef.current.targetLookAt.set(4, 2.2, 0);

      // Request device orientation permission for mobile iOS 13+ devices
      if (typeof (window as any).DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        (DeviceOrientationEvent as any).requestPermission()
          .then((perm: string) => {
            console.log('DeviceOrientation permission:', perm);
          })
          .catch(() => {});
      }

      // Attempt fullscreen for immersive mobile experience
      if (mountRef.current?.requestFullscreen) {
        mountRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setCameraPreset('pool');
    }
  };

  // VR Location Hotspots
  const handleTeleportVR = (spot: 'pool' | 'living' | 'terrace') => {
    setVrLocation(spot);
    if (spot === 'pool') {
      stateRef.current.targetCamPos.set(4, 2.2, 12);
      stateRef.current.targetLookAt.set(4, 2.2, 0);
    } else if (spot === 'living') {
      stateRef.current.targetCamPos.set(-4, 2.2, 3);
      stateRef.current.targetLookAt.set(-4, 2.2, 8);
    } else if (spot === 'terrace') {
      stateRef.current.targetCamPos.set(0, 6.8, 4);
      stateRef.current.targetLookAt.set(0, 6.8, 10);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(lightingPreset === 'twilight' ? 0x121419 : lightingPreset === 'daylight' ? 0xF2EFE9 : 0x2A201B);
    scene.fog = new THREE.FogExp2(scene.background.getHex(), 0.015);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(20, 14, 24);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Studio Environment PMREM
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xFDF9F2, 0x332B25, 0.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xFFE4C4, 2.2);
    dirLight.position.set(24, 30, 18);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -22;
    dirLight.shadow.camera.right = 22;
    dirLight.shadow.camera.top = 22;
    dirLight.shadow.camera.bottom = -22;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);

    // Warm Interior & Pool Accent Lights
    const interiorLight1 = new THREE.PointLight(0xFF9E40, 1.8, 18);
    interiorLight1.position.set(0, 4, 0);
    scene.add(interiorLight1);

    const poolLight = new THREE.PointLight(0x40E0D0, 1.5, 12);
    poolLight.position.set(5, 0.5, 8);
    scene.add(poolLight);

    // 4. Procedural Procedural Texture Generation (Travertine & Wood)
    const createProceduralTravertine = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#E5DEC9';
      ctx.fillRect(0, 0, 512, 512);

      // Subtle horizontal linear grain
      ctx.fillStyle = '#D6CCB2';
      for (let y = 0; y < 512; y += 4) {
        if (Math.random() > 0.4) {
          ctx.fillRect(0, y, 512, Math.random() * 2 + 1);
        }
      }
      // Subtle porous pores
      ctx.fillStyle = '#BDB296';
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillRect(x, y, Math.random() * 3 + 1, Math.random() * 1.5);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const travertineTexture = createProceduralTravertine();

    // 5. Materials Library (PBR)
    const travertineMat = new THREE.MeshStandardMaterial({
      map: travertineTexture,
      roughness: 0.65,
      metalness: 0.05,
      color: 0xF5EFE4
    });

    const darkTravertineMat = new THREE.MeshStandardMaterial({
      color: 0x383430,
      roughness: 0.7,
      metalness: 0.1
    });

    const architecturalGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      thickness: 0.8
    });

    const brushedBronzeMat = new THREE.MeshStandardMaterial({
      color: 0xA67C52,
      metalness: 0.88,
      roughness: 0.25
    });

    const woodDeckMat = new THREE.MeshStandardMaterial({
      color: 0x6E5642,
      roughness: 0.6,
      metalness: 0.05
    });

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x1A5B6E,
      roughness: 0.15,
      metalness: 0.2,
      transparent: true,
      opacity: 0.88
    });

    // 6. Architectural Building Hierarchy
    const rootVillaGroup = new THREE.Group();
    scene.add(rootVillaGroup);

    // Ground & Terrain Podium
    const podiumGeo = new THREE.BoxGeometry(38, 1, 34);
    const podiumMesh = new THREE.Mesh(podiumGeo, travertineMat);
    podiumMesh.position.set(0, -0.5, 0);
    podiumMesh.receiveShadow = true;
    rootVillaGroup.add(podiumMesh);

    // Swimming Pool Basin & Water Plane
    const poolBasinGeo = new THREE.BoxGeometry(16, 1.4, 8);
    const poolBasin = new THREE.Mesh(poolBasinGeo, darkTravertineMat);
    poolBasin.position.set(4, 0.2, 9);
    poolBasin.receiveShadow = true;
    rootVillaGroup.add(poolBasin);

    const waterGeo = new THREE.PlaneGeometry(15.4, 7.4);
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(4, 0.7, 9);
    rootVillaGroup.add(waterMesh);

    // Teak Sun Deck Around Pool
    const deckGeo = new THREE.BoxGeometry(18, 0.1, 3);
    const deckMesh = new THREE.Mesh(deckGeo, woodDeckMat);
    deckMesh.position.set(4, 0.75, 14);
    deckMesh.receiveShadow = true;
    rootVillaGroup.add(deckMesh);

    // Loungers on Deck
    for (let i = -4; i <= 4; i += 4) {
      const loungerGroup = new THREE.Group();
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 2.4), woodDeckMat);
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.15, 2.3), new THREE.MeshStandardMaterial({ color: 0xFDFBF7, roughness: 0.8 }));
      cushion.position.y = 0.15;
      loungerGroup.add(base, cushion);
      loungerGroup.position.set(i + 4, 0.85, 14);
      rootVillaGroup.add(loungerGroup);
    }

    // --- LEVEL 1 (GROUND FLOOR GROUP) ---
    const level1Group = new THREE.Group();
    rootVillaGroup.add(level1Group);

    // Main living room solid travertine wing
    const wing1Geo = new THREE.BoxGeometry(14, 4.2, 12);
    const wing1 = new THREE.Mesh(wing1Geo, travertineMat);
    wing1.position.set(-5, 2.1, 0);
    wing1.castShadow = true;
    wing1.receiveShadow = true;
    level1Group.add(wing1);

    // Floor-to-ceiling glass panoramic wall
    const glassWallGeo = new THREE.PlaneGeometry(12, 3.8);
    const glassWall = new THREE.Mesh(glassWallGeo, architecturalGlassMat);
    glassWall.position.set(-5, 2.1, 6.01);
    level1Group.add(glassWall);

    // Bronze Mullions
    for (let x = -10; x <= 0; x += 3) {
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.8, 0.15), brushedBronzeMat);
      mullion.position.set(x, 2.1, 6.02);
      level1Group.add(mullion);
    }

    // Dining & Gallery Pavilion wing
    const wing2Geo = new THREE.BoxGeometry(8, 4.2, 10);
    const wing2 = new THREE.Mesh(wing2Geo, travertineMat);
    wing2.position.set(7, 2.1, -1);
    wing2.castShadow = true;
    wing2.receiveShadow = true;
    level1Group.add(wing2);

    // --- LEVEL 2 (UPPER SUITE GROUP) ---
    const level2Group = new THREE.Group();
    rootVillaGroup.add(level2Group);

    // Cantilevered Upper Master Suite
    const upperSuiteGeo = new THREE.BoxGeometry(16, 3.8, 9);
    const upperSuite = new THREE.Mesh(upperSuiteGeo, travertineMat);
    upperSuite.position.set(0, 6.1, 2);
    upperSuite.castShadow = true;
    upperSuite.receiveShadow = true;
    level2Group.add(upperSuite);

    // Upper Balcony Glass Railing
    const upperGlassRail = new THREE.Mesh(new THREE.BoxGeometry(15.8, 1.1, 0.08), architecturalGlassMat);
    upperGlassRail.position.set(0, 7.5, 6.5);
    level2Group.add(upperGlassRail);

    // Bronze Handrail Cap
    const handrail = new THREE.Mesh(new THREE.BoxGeometry(16, 0.08, 0.12), brushedBronzeMat);
    handrail.position.set(0, 8.05, 6.5);
    level2Group.add(handrail);

    // --- LEVEL 3 (ROOF CANOPY) ---
    const roofGroup = new THREE.Group();
    rootVillaGroup.add(roofGroup);

    const roofOverhangGeo = new THREE.BoxGeometry(19, 0.4, 12);
    const roofOverhang = new THREE.Mesh(roofOverhangGeo, darkTravertineMat);
    roofOverhang.position.set(0, 8.2, 2);
    roofOverhang.castShadow = true;
    roofGroup.add(roofOverhang);

    // Minimalist Landscape
    const createProceduralTree = (x: number, z: number, scale: number = 1) => {
      const treeGroup = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3 * scale, 0.45 * scale, 3 * scale, 8),
        new THREE.MeshStandardMaterial({ color: 0x4A3B32, roughness: 0.9 })
      );
      trunk.position.y = 1.5 * scale;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x4A5843, roughness: 0.85 });
      const f1 = new THREE.Mesh(new THREE.SphereGeometry(1.6 * scale, 7, 7), foliageMat);
      f1.position.set(0, 3.4 * scale, 0);
      f1.scale.set(1.4, 0.9, 1.2);
      f1.castShadow = true;

      const f2 = new THREE.Mesh(new THREE.SphereGeometry(1.2 * scale, 6, 6), foliageMat);
      f2.position.set(0.8 * scale, 3.7 * scale, -0.4 * scale);
      f2.castShadow = true;

      treeGroup.add(f1, f2);
      treeGroup.position.set(x, 0, z);
      return treeGroup;
    };

    rootVillaGroup.add(createProceduralTree(-14, 8, 1.2));
    rootVillaGroup.add(createProceduralTree(-15, -4, 1.0));
    rootVillaGroup.add(createProceduralTree(15, 6, 1.1));

    // Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(42, 38);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.51;
    scene.add(shadowPlane);

    // 7. Interactive Drag & Mobile Gyroscope / Device Orientation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = new THREE.Spherical().setFromVector3(camera.position);

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      spherical.theta -= deltaX * 0.006;
      spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, spherical.phi - deltaY * 0.006));
      camera.position.setFromSpherical(spherical);
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(8, Math.min(65, spherical.radius + e.deltaY * 0.04));
      camera.position.setFromSpherical(spherical);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Touch support for mobile / tablet
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        spherical.theta -= deltaX * 0.008;
        spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, spherical.phi - deltaY * 0.008));
        camera.position.setFromSpherical(spherical);
      }
    };
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });

    // Mobile Gyroscope / DeviceOrientation Handler for VR Mode
    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (!stateRef.current.isVRMode) return;
      if (e.alpha !== null && e.beta !== null && e.gamma !== null) {
        const alpha = THREE.MathUtils.degToRad(e.alpha);
        const beta = THREE.MathUtils.degToRad(e.beta - 90);
        const gamma = THREE.MathUtils.degToRad(-e.gamma);
        stateRef.current.vrOrientation.set(beta, alpha, gamma, 'YXZ');
      }
    };
    window.addEventListener('deviceorientation', onDeviceOrientation);

    // 8. Render Animation Loop with Exponential Damping & Stereoscopic VR
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth Exploded View Interpolation
      const state = stateRef.current;
      state.exploded = THREE.MathUtils.damp(state.exploded, state.targetExploded, 4, delta);
      level2Group.position.y = state.exploded * 3.5;
      roofGroup.position.y = state.exploded * 7.0;

      // Gentle water ripple simulation
      waterMesh.position.y = 0.7 + Math.sin(time * 2.5) * 0.03;

      // Camera Position damping
      if (state.isVRMode) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, state.targetCamPos.x, 3, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, state.targetCamPos.y, 3, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, state.targetCamPos.z, 3, delta);
        
        // If device has orientation data, use it; otherwise look at target
        if (state.vrOrientation.x !== 0 || state.vrOrientation.y !== 0) {
          camera.rotation.copy(state.vrOrientation);
        } else {
          camera.lookAt(state.targetLookAt);
        }
      } else {
        if (!isDragging) {
          if (state.autoRotate) {
            spherical.theta += 0.25 * delta;
            camera.position.setFromSpherical(spherical);
          } else {
            camera.position.x = THREE.MathUtils.damp(camera.position.x, state.targetCamPos.x, 3, delta);
            camera.position.y = THREE.MathUtils.damp(camera.position.y, state.targetCamPos.y, 3, delta);
            camera.position.z = THREE.MathUtils.damp(camera.position.z, state.targetCamPos.z, 3, delta);
            spherical.setFromVector3(camera.position);
          }
        }
        state.currentLookAt.x = THREE.MathUtils.damp(state.currentLookAt.x, state.targetLookAt.x, 4, delta);
        state.currentLookAt.y = THREE.MathUtils.damp(state.currentLookAt.y, state.targetLookAt.y, 4, delta);
        state.currentLookAt.z = THREE.MathUtils.damp(state.currentLookAt.z, state.targetLookAt.z, 4, delta);
        camera.lookAt(state.currentLookAt);
      }

      // Dynamic Lighting Presets
      if (state.lightingMode === 'sunset') {
        dirLight.color.setHex(0xFFB07C);
        dirLight.intensity = 2.4;
        hemiLight.color.setHex(0xFCE6D4);
        scene.background = new THREE.Color(0x281F1A);
      } else if (state.lightingMode === 'daylight') {
        dirLight.color.setHex(0xFFFFFF);
        dirLight.intensity = 2.8;
        hemiLight.color.setHex(0xEDF2F7);
        scene.background = new THREE.Color(0xF0EDE6);
      } else if (state.lightingMode === 'twilight') {
        dirLight.color.setHex(0x5A7090);
        dirLight.intensity = 0.9;
        hemiLight.color.setHex(0x1A2533);
        scene.background = new THREE.Color(0x0E1318);
      }
      if (scene.fog && scene.background instanceof THREE.Color) {
        scene.fog.color.copy(scene.background);
      }

      // STEREOSCOPIC VR DUAL-EYE RENDERING OR MONO STANDARD RENDERING
      const w = container.clientWidth;
      const h = container.clientHeight;

      if (state.isVRMode) {
        renderer.autoClear = false;
        renderer.clear();
        state.stereoCamera.aspect = 0.5 * (w / h);
        state.stereoCamera.eyeSep = 0.064; // 64mm average interpupillary distance
        state.stereoCamera.update(camera);

        // Left Eye (Left half screen)
        renderer.setScissorTest(true);
        renderer.setScissor(0, 0, Math.floor(w / 2), h);
        renderer.setViewport(0, 0, Math.floor(w / 2), h);
        renderer.render(scene, state.stereoCamera.cameraL);

        // Right Eye (Right half screen)
        renderer.setScissor(Math.floor(w / 2), 0, Math.ceil(w / 2), h);
        renderer.setViewport(Math.floor(w / 2), 0, Math.ceil(w / 2), h);
        renderer.render(scene, state.stereoCamera.cameraR);

        renderer.setScissorTest(false);
      } else {
        renderer.setScissorTest(false);
        renderer.setViewport(0, 0, w, h);
        renderer.render(scene, camera);
      }
    };

    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      travertineTexture.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-[#1E1B18] border border-[#E5E0D8] ${
      isVRMode ? 'fixed inset-0 z-[100] rounded-none border-none h-screen w-screen' : isEmbedded ? 'h-[500px]' : 'h-[620px]'
    }`}>
      
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* VR STEREOSCOPIC OVERLAY (Only visible in VR Mode) */}
      {isVRMode && (
        <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between">
          
          {/* Central Divider Line with Cardboard alignment notch */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-white/20 flex flex-col items-center justify-center">
            <div className="w-3 h-3 rounded-full border border-white/40 bg-black/60 -my-1.5" />
          </div>

          {/* Dual Gaze Reticles for Left & Right Eye */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-white/60 pointer-events-none" />
          <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-white/60 pointer-events-none" />

          {/* Top Bar for VR Mode: Exit Button & Gyro indicator */}
          <div className="p-4 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs">
              <Smartphone className="w-3.5 h-3.5 text-[#C28E5C] animate-pulse" />
              <span>{isAr ? 'وضع VR التفاعلي مفعل (حرك الهاتف للاستكشاف)' : 'Mobile VR Active · Rotate Phone 360°'}</span>
            </div>

            <button
              onClick={toggleVRMode}
              className="flex items-center gap-1.5 bg-[#C28E5C] hover:bg-[#A66B38] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg transition-colors cursor-pointer pointer-events-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isAr ? 'خروج من VR' : 'Exit VR'}</span>
            </button>
          </div>

          {/* Bottom VR Teleportation Hotspots for both eyes */}
          <div className="p-4 flex justify-between pointer-events-auto">
            {/* Left Eye Nav */}
            <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-lg border border-white/10 text-[11px] text-white">
              <span className="text-[#C28E5C] font-semibold px-1">{isAr ? 'انتقال:' : 'Hop:'}</span>
              <button
                onClick={() => handleTeleportVR('pool')}
                className={`px-2 py-0.5 rounded cursor-pointer ${vrLocation === 'pool' ? 'bg-[#C28E5C] text-white' : 'hover:bg-white/10'}`}
              >
                Pool
              </button>
              <button
                onClick={() => handleTeleportVR('living')}
                className={`px-2 py-0.5 rounded cursor-pointer ${vrLocation === 'living' ? 'bg-[#C28E5C] text-white' : 'hover:bg-white/10'}`}
              >
                Living
              </button>
              <button
                onClick={() => handleTeleportVR('terrace')}
                className={`px-2 py-0.5 rounded cursor-pointer ${vrLocation === 'terrace' ? 'bg-[#C28E5C] text-white' : 'hover:bg-white/10'}`}
              >
                Terrace
              </button>
            </div>

            {/* Right Eye Nav */}
            <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-lg border border-white/10 text-[11px] text-white">
              <span className="text-[#C28E5C] font-semibold px-1">{isAr ? 'انتقال:' : 'Hop:'}</span>
              <button
                onClick={() => handleTeleportVR('pool')}
                className={`px-2 py-0.5 rounded cursor-pointer ${vrLocation === 'pool' ? 'bg-[#C28E5C] text-white' : 'hover:bg-white/10'}`}
              >
                Pool
              </button>
              <button
                onClick={() => handleTeleportVR('living')}
                className={`px-2 py-0.5 rounded cursor-pointer ${vrLocation === 'living' ? 'bg-[#C28E5C] text-white' : 'hover:bg-white/10'}`}
              >
                Living
              </button>
              <button
                onClick={() => handleTeleportVR('terrace')}
                className={`px-2 py-0.5 rounded cursor-pointer ${vrLocation === 'terrace' ? 'bg-[#C28E5C] text-white' : 'hover:bg-white/10'}`}
              >
                Terrace
              </button>
            </div>
          </div>

        </div>
      )}

      {/* STANDARD HUD OVERLAY (When NOT in VR Mode) */}
      {!isVRMode && (
        <>
          {/* Top Bar Spec & Identity (Top-Left) */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-[#1E1B18]/80 text-[#FBF9F5] px-4 py-2 rounded-lg border border-[#332F2B] pointer-events-auto">
            <Building className="w-4 h-4 text-[#C28E5C]" />
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#C28E5C]">
                {isAr ? 'مجسم معماري ثلاثي الأبعاد (PBR)' : 'Studio 3D PBR Spatial Model'}
              </span>
              <p className="text-[11px] text-[#A8A196]">{propertyTitle}</p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-[#1E1B18]/80 hover:bg-[#1E1B18] text-white rounded-lg border border-[#332F2B] cursor-pointer"
              title="Exit 3D View"
            >
              <span className="text-xs font-semibold">{isAr ? 'إغلاق' : 'Close 3D'}</span>
            </button>
          )}

          {/* Zero-Occlusion Collapsible Bottom Control Dock */}
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 transition-transform duration-300 pointer-events-auto w-[94%] max-w-[890px]"
            style={{
              transform: `translateX(-50%) translateY(${isControlsCollapsed ? 'calc(100% - 32px)' : '0px'})`
            }}
          >
            {/* Toggle Collapse/Expand Drawer Button */}
            <div className="flex justify-center mb-1">
              <button
                onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
                className="px-3 py-1 bg-[#1E1B18] hover:bg-[#2A2622] text-[#FBF9F5] text-[11px] font-medium rounded-t-md border-t border-x border-[#3A3530] flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                {isControlsCollapsed ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-[#C28E5C]" />
                    <span>{isAr ? 'إظهار لوحة التحكم ثلاثية الأبعاد' : 'Show 3D Architectural Controls'}</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 text-[#C28E5C]" />
                    <span>{isAr ? 'إخفاء لوحة التحكم' : 'Collapse Controls'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Horizontal Control Dock Card */}
            <div className="bg-[#1E1B18]/90 text-[#FBF9F5] rounded-xl p-3.5 border border-[#3A3530] shadow-2xl flex flex-wrap items-center justify-between gap-4">
              
              {/* Camera Presets */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#8B5E3C] uppercase tracking-wider mr-1">
                  {isAr ? 'الزاوية:' : 'View:'}
                </span>
                {(['pool', 'aerial', 'terrace', 'front'] as const).map((cam) => (
                  <button
                    key={cam}
                    onClick={() => {
                      setCameraPreset(cam);
                      setIsAutoRotating(false);
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded capitalize transition-colors cursor-pointer ${
                      cameraPreset === cam
                        ? 'bg-[#C28E5C] text-white font-semibold'
                        : 'bg-[#2A2622] text-[#D6CEBE] hover:bg-[#38332E]'
                    }`}
                  >
                    {cam}
                  </button>
                ))}
              </div>

              {/* Exploded Floor Separation Slider */}
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#C28E5C]" />
                <span className="text-[11px] font-semibold text-[#D6CEBE] whitespace-nowrap">
                  {isAr ? 'تفكيك الطوابق:' : 'Explode Levels:'}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={explodedLevel}
                  onChange={(e) => setExplodedLevel(parseFloat(e.target.value))}
                  className="w-24 accent-[#C28E5C] cursor-pointer"
                />
              </div>

              {/* Lighting Mode Selector */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLightingPreset('sunset')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    lightingPreset === 'sunset' ? 'bg-[#C28E5C] text-white' : 'bg-[#2A2622] text-[#A8A196] hover:text-white'
                  }`}
                  title="Golden Hour / Sunset"
                >
                  <Sunset className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLightingPreset('daylight')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    lightingPreset === 'daylight' ? 'bg-[#C28E5C] text-white' : 'bg-[#2A2622] text-[#A8A196] hover:text-white'
                  }`}
                  title="Architectural Studio Daylight"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLightingPreset('twilight')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    lightingPreset === 'twilight' ? 'bg-[#C28E5C] text-white' : 'bg-[#2A2622] text-[#A8A196] hover:text-white'
                  }`}
                  title="Evening Ambient Glow"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* VR Mode Toggle Button (The feature requested!) */}
              <button
                onClick={toggleVRMode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8B5E3C] hover:bg-[#A66B38] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer ring-1 ring-white/20"
                title={isAr ? 'وضع الواقع الافتراضي VR (مخصص للهواتف ونظارات VR)' : 'Toggle Immersive VR Mode (Mobile & VR Headsets)'}
              >
                <Glasses className="w-4 h-4 text-white" />
                <span>{isAr ? 'وضع VR للهاتف' : 'Mobile VR'}</span>
              </button>

              {/* Auto-Rotate Toggle */}
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  isAutoRotating ? 'bg-[#C28E5C] text-white' : 'bg-[#2A2622] text-[#D6CEBE]'
                }`}
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                <span>{isAutoRotating ? (isAr ? 'دوران تلقائي' : 'Orbiting') : (isAr ? 'ثابت' : 'Paused')}</span>
              </button>

            </div>
          </div>
        </>
      )}

    </div>
  );
};
