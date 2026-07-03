// SkullHero — loaded lazily so Three.js does NOT block the main bundle
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState, Suspense, memo } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// ─── 3D Skull Model ───────────────────────────────────────────────────────────
const SkullModel = memo(({ onLoad, rotX, rotY }: {
  onLoad: () => void;
  rotX: React.MutableRefObject<number>;
  rotY: React.MutableRefObject<number>;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [offset, setOffset] = useState<[number, number, number]>([0, 0, 0]);
  const { scene } = useGLTF('/Skull_Resize4.glb') as any;

  useEffect(() => {
    if (!scene) return;
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    setOffset([-center.x, -center.y, -center.z]);
    onLoad();
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = rotX.current;
    groupRef.current.rotation.y = rotY.current;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={5} position={offset} />
    </group>
  );
});

useGLTF.preload('/Skull_Resize4.glb');

// ─── SkullHero ────────────────────────────────────────────────────────────────
const SkullHero = () => {
  const [skullLoaded, setSkullLoaded] = useState(false);

  const rotX = useRef(0);
  const rotY = useRef(0);
  const velX = useRef(0);
  const velY = useRef(0);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const autoRotating = useRef(true);
  const autoResumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Auto-rotation loop
  useEffect(() => {
    const tick = () => {
      if (autoRotating.current && !isDragging.current) {
        rotY.current += 0.004;
      } else if (!isDragging.current) {
        velX.current *= 0.92;
        velY.current *= 0.92;
        rotX.current += velX.current;
        rotY.current += velY.current;
        if (Math.abs(velX.current) < 0.0001 && Math.abs(velY.current) < 0.0001) {
          autoRotating.current = true;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    autoRotating.current = false;
    velX.current = 0;
    velY.current = 0;
    lastPos.current = { x: e.clientX, y: e.clientY };
    if (autoResumeTimer.current) clearTimeout(autoResumeTimer.current);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    const sensitivity = window.innerWidth < 768 ? 0.030 : 0.008;
    velY.current = dx * sensitivity;
    velX.current = dy * sensitivity;
    rotY.current += velY.current;
    rotX.current += velX.current;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = () => {
    isDragging.current = false;
    autoResumeTimer.current = setTimeout(() => {
      autoRotating.current = true;
      velX.current = 0;
      velY.current = 0;
    }, 2000);
  };

  return (
    <section className="relative h-screen overflow-hidden flex items-center justify-center bg-black">
      <div
        ref={canvasRef}
        className="relative w-full h-[55vh] sm:h-[65vh] md:h-[80vh] transition-opacity duration-700"
        style={{ zIndex: 10, cursor: isDragging.current ? 'grabbing' : 'grab', opacity: skullLoaded ? 1 : 0 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 1000 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance', stencil: false, depth: true }}
          dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
          frameloop="always"
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ff4400" />
          <pointLight position={[0, 5, 0]} intensity={0.8} color="#ff6600" />
          <Suspense fallback={null}>
            <SkullModel onLoad={() => setSkullLoaded(true)} rotX={rotX} rotY={rotY} />
          </Suspense>
        </Canvas>
      </div>

      {/* Bottom text + scroll arrow — visible immediately */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 z-20 pointer-events-none">
        <p className="text-white text-sm tracking-[0.3em] uppercase font-light">
          Swipe up to enter the den
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default SkullHero;
