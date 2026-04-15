import { AboutBrandSection } from '@/components/sections/AboutBrandSection';
import { BrandMarquee } from '@/components/sections/BrandMarquee';
import { CategoriesShowcase } from '@/components/sections/CategoriesShowcase';
import { CollabSection } from '@/components/sections/CollabSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { ScrollingText } from '@/components/sections/ScrollingText';
import { TrendingSection } from '@/components/sections/TrendingSection';
import { SEO } from '@/components/SEO';
import { productApi } from '@/lib/api';
import { useWishlistStore } from '@/store/wishlistStore';
import { ApiProduct, Product, normalizeProduct } from '@/types/product';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState, Suspense, memo } from 'react';
import { toast } from 'sonner';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ─── WebGL Smoke Fragment Shader ──────────────────────────────────────────────
const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform float time;
uniform vec2 vp;
in vec2 uv;
out vec4 fragColor;

float rand(vec2 p) {
    return fract(sin(dot(p.xy, vec2(1., 300.))) * 43758.5453123);
}
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = rand(i);
    float b = rand(i + vec2(1.0, 0.0));
    float c = rand(i + vec2(0.0, 1.0));
    float d = rand(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
            (c - a) * u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
#define OCTAVES 5
float fbm(vec2 p) {
    float value = 0.;
    float amplitude = .4;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(p);
        p *= 2.;
        amplitude *= .4;
    }
    return value;
}

void main() {
    vec2 p = uv.xy;
    p.x *= vp.x / vp.y;

    float gradient = mix(p.y * .2 + .1, p.y * 1.2 + .9, fbm(p));
    float speed = 0.15;
    float details = 6.;
    float force = .9;
    float shift = .5;

    vec2 fast = vec2(p.x, p.y - time * speed) * details;
    float ns_a = fbm(fast);
    float ns_b = force * fbm(fast + ns_a + time) - shift;
    float nns = force * fbm(vec2(ns_a, ns_b));
    float ins = fbm(vec2(ns_b, ns_a));

    vec3 darkRed    = vec3(0.4, 0.05, 0.0);
    vec3 brightRed  = vec3(0.9, 0.15, 0.05);
    vec3 orange     = vec3(1.0, 0.5, 0.1);
    vec3 yellowWhite = vec3(1.0, 0.9, 0.6);

    vec3 c1 = mix(darkRed, brightRed, clamp(ins * 1.5, 0.0, 1.0));
    vec3 c2 = mix(brightRed, orange, clamp(ins * 2.0 - 0.5, 0.0, 1.0));
    vec3 c3 = mix(orange, yellowWhite, clamp(ins * 2.0 - 1.0, 0.0, 1.0));
    vec3 smokeColor = mix(mix(c1, c2, clamp(ins * 2.0, 0.0, 1.0)), c3, clamp(ins - 0.5, 0.0, 1.0));

    float alpha = clamp(1.0 - gradient * 1.2, 0.0, 1.0);
    alpha *= clamp(ins + 0.4, 0.0, 1.0);
    alpha *= 0.85 + 0.15 * sin(time * 2.0 + ins * 10.0);

    vec3 finalColor = smokeColor;
    float emberAlpha = alpha;

    for(int i = 0; i < 12; i++) {
        float fi = float(i);
        float emberSeed = fi * 0.618;
        float emberX = fract(sin(emberSeed * 12.9898) * 43758.5453);
        float columnOffset = floor(fi / 4.0) * 0.2;
        emberX = fract(emberX + columnOffset);
        float emberSpeed = 0.06 + fract(sin(emberSeed * 78.233) * 43758.5453) * 0.10;
        float emberSize = 0.01 + fract(sin(emberSeed * 45.164) * 43758.5453) * 0.018;
        float emberY = fract((time * emberSpeed) + emberSeed);
        float drift = sin(time * 0.4 + emberSeed * 6.28) * 0.15;
        float aspectRatio = vp.x / vp.y;
        vec2 emberPos = vec2((emberX * 2.0 - 1.0) * aspectRatio + drift, emberY * 2.0 - 1.0);
        float dist = length(p - emberPos);
        float ember = smoothstep(emberSize * 3.0, 0.0, dist);
        float pulse = 0.7 + 0.3 * sin(time * 3.0 + emberSeed * 6.28);
        ember *= pulse;
        vec3 emberCore = vec3(1.0, 0.9, 0.3);
        vec3 emberMid = vec3(1.0, 0.4, 0.1);
        vec3 emberOuter = vec3(0.8, 0.1, 0.0);
        float emberGradient = smoothstep(emberSize * 2.0, 0.0, dist);
        vec3 emberColor = mix(emberOuter, emberMid, emberGradient);
        emberColor = mix(emberColor, emberCore, pow(emberGradient, 2.0));
        float fadeFactor = smoothstep(0.0, 0.15, emberY) * smoothstep(1.0, 0.85, emberY);
        ember *= fadeFactor;
        float glow = smoothstep(emberSize * 6.0, emberSize * 2.0, dist) * 0.3;
        ember = max(ember, glow);
        finalColor = mix(finalColor, emberColor, ember * 0.9);
        emberAlpha = max(emberAlpha, ember * 0.8);
    }

    fragColor = vec4(finalColor, emberAlpha);
}
`;

const VERTEX_SHADER = `#version 300 es
precision mediump float;
const vec2 positions[6] = vec2[6](
    vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(-1.0, 1.0),
    vec2(-1.0,  1.0), vec2(1.0, -1.0), vec2( 1.0, 1.0)
);
out vec2 uv;
void main() {
    uv = positions[gl_VertexID];
    gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
}`;

// ─── WebGL Smoke Canvas Component ────────────────────────────────────────────
const SmokeCanvas = memo(({ style }: { style?: React.CSSProperties }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });
    if (!gl) return;

    const compileShader = (src: string, type: number) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const program = gl.createProgram()!;
    const vs = compileShader(VERTEX_SHADER, gl.VERTEX_SHADER);
    const fs = compileShader(FRAGMENT_SHADER, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const timeLoc = gl.getUniformLocation(program, 'time');
    const vpLoc = gl.getUniformLocation(program, 'vp');
    const startTime = Date.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const render = () => {
      gl.uniform1f(timeLoc, (Date.now() - startTime) / 1000);
      gl.uniform2fv(vpLoc, [canvas.width, canvas.height]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'block',
        ...style,
      }}
    />
  );
});

// ─── Loading Spinner Component ────────────────────────────────────────────────
const LoadingSpinner = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white border-r-white animate-spin" />
        <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-orange-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
    </div>
  </div>
));

// ─── 3D Skull Model ───────────────────────────────────────────────────────────
// Uses Euler XYZ rotation directly on the group — no OrbitControls.
// This gives true 360° on ALL axes (vertical + horizontal).
// Drag state is passed in via refs to avoid re-renders.
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
    // Read bounding box WITHOUT mutating geometry
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

// ─── Index ────────────────────────────────────────────────────────────────────
const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [skullLoading, setSkullLoading] = useState(true);

  // ── Rotation state (refs = no re-renders, direct to useFrame) ──
  const rotX = useRef(0);          // vertical rotation (full 360°)
  const rotY = useRef(0);          // horizontal rotation (full 360°)
  const velX = useRef(0);          // inertia velocity X
  const velY = useRef(0);          // inertia velocity Y
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const autoRotating = useRef(true);
  const autoResumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // ── Auto-rotation loop (runs outside React/Three) ──
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const tick = () => {
      if (autoRotating.current && !isDragging.current) {
        rotY.current += 0.004;
      } else if (!isDragging.current) {
        // Apply inertia
        velX.current *= 0.92;
        velY.current *= 0.92;
        rotX.current += velX.current;
        rotY.current += velY.current;
        // Resume auto-rotate when inertia dies
        if (Math.abs(velX.current) < 0.0001 && Math.abs(velY.current) < 0.0001) {
          autoRotating.current = true;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Pointer drag handlers ──
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
    // Resume auto-rotate after 2s of no interaction
    autoResumeTimer.current = setTimeout(() => {
      autoRotating.current = true;
      velX.current = 0;
      velY.current = 0;
    }, 2000);
  };

  const handleModelLoad = () => setSkullLoading(false);

  useEffect(() => { loadFeaturedProducts(); }, []);

  const loadFeaturedProducts = async () => {
    try {
      const data: any = await productApi.getFeatured(3);
      const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
      setFeaturedProducts(normalized);
      const wishlistIds = data.products
        .filter((p: ApiProduct) => p.in_wishlist)
        .map((p: ApiProduct) => p._id);
      if (wishlistIds.length > 0) {
        useWishlistStore.getState().syncWishlist(wishlistIds);
      }
    } catch (error: any) {
      toast.error('Failed to load featured products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black w-full overflow-x-hidden">
      <SEO
        title="Blackpotheads - Psy Clothing | Premium Streetwear Brand"
        description="Buy psychedelic t-shirts & streetwear in India. Shop unique Shiva, gothic & trippy printed tees at Blackpotheads. Premium quality. Free shipping, COD & easy returns."
        keywords="printed t-shirts india, streetwear india, graphic tees, Psychedelic streetwear, Trippy streetwear, shiva t-shirts, psychedelic clothing, gothic tees, premium cotton tshirts, online tshirt shopping india, blackpotheads, rick and morty tshirts, chakra clothing"
        url="https://blackpotheads.com/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "BLACK POTHEADS",
          "description": "Premium printed t-shirts and streetwear brand in India",
          "url": "https://blackpotheads.com",
          "logo": "https://blackpotheads.com/logo.png",
          "image": "https://blackpotheads.com/homeimg.jpeg",
          "priceRange": "₹₹",
          "address": { "@type": "PostalAddress", "addressCountry": "IN" },
          "paymentAccepted": "Cash, Credit Card, Debit Card, UPI, Net Banking",
          "currenciesAccepted": "INR",
          "openingHours": "Mo-Su 00:00-23:59",
          "telephone": "+91-XXXXXXXXXX",
          "email": "support@blackpotheads.com"
        }}
      />

      {/* ── 3D SKULL HERO ── */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center bg-black">

        {skullLoading && <LoadingSpinner />}

        {/* welcome.webp — sits in the bottom fog area, behind smoke */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: '50%', zIndex: 4,
            maskImage: 'linear-gradient(to top, black 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 50%, transparent 100%)'
          }}>
          {/* Mobile image */}
          <img src="/welcome-mobile.webp" alt="" className="block md:hidden w-full h-full object-cover opacity-50" />
          {/* Desktop image */}
          <img src="/welcome.webp" alt="" className="hidden md:block w-full h-full object-cover opacity-50" />
        </div>

        {/* Smoke background */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: '50%', zIndex: 5,
            maskImage: 'linear-gradient(to top, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent 100%)'
          }}>
          <SmokeCanvas />
        </div>

        {/* Drag surface + Canvas */}
        <div
          ref={canvasRef}
          className="relative w-full h-[55vh] sm:h-[65vh] md:h-[80vh]"
          style={{ zIndex: 10, cursor: isDragging.current ? 'grabbing' : 'grab' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 1000 }}
            style={{ width: '100%', height: '100%' }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance', stencil: false, depth: true }}
            dpr={[1, 1.5]}
            frameloop="always"
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ff4400" />
            <pointLight position={[0, 5, 0]} intensity={0.8} color="#ff6600" />
            <Suspense fallback={null}>
              <SkullModel onLoad={handleModelLoad} rotX={rotX} rotY={rotY} />
            </Suspense>
          </Canvas>
        </div>
      </section>

      <BrandMarquee />
      <CategoriesShowcase />
      <CollabSection />
      <ScrollingText />
      <TrendingSection />
      <AboutBrandSection />
      <ProcessSection />
    </div>
  );
};

export default Index;