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
import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState, Suspense, memo } from 'react';
import { toast } from 'sonner';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ─── WebGL Smoke Fragment Shader ──────────────────────────────────────────────
// Replace only the FRAGMENT_SHADER constant in your Index.tsx with this:

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

    // Fire palette — dark red → bright orange → yellow-white
    vec3 darkRed    = vec3(0.4, 0.05, 0.0);   // Deep dark red/black
    vec3 brightRed  = vec3(0.9, 0.15, 0.05);  // Bright red-orange
    vec3 orange     = vec3(1.0, 0.5, 0.1);    // Bright orange
    vec3 yellowWhite = vec3(1.0, 0.9, 0.6);   // Yellow-white hot

    // Create fire gradient with multiple color stops
    vec3 c1 = mix(darkRed, brightRed, clamp(ins * 1.5, 0.0, 1.0));
    vec3 c2 = mix(brightRed, orange, clamp(ins * 2.0 - 0.5, 0.0, 1.0));
    vec3 c3 = mix(orange, yellowWhite, clamp(ins * 2.0 - 1.0, 0.0, 1.0));
    vec3 smokeColor = mix(mix(c1, c2, clamp(ins * 2.0, 0.0, 1.0)), c3, clamp(ins - 0.5, 0.0, 1.0));

    // Alpha: transparent at top, more opaque at bottom for fire effect
    float alpha = clamp(1.0 - gradient * 1.2, 0.0, 1.0);
    alpha *= clamp(ins + 0.4, 0.0, 1.0);
    // Add intensity variation for flickering fire effect
    alpha *= 0.85 + 0.15 * sin(time * 2.0 + ins * 10.0);

    // ─── HOT COAL EMBERS ───
    // Create floating orange/red particles that rise through the smoke
    vec3 finalColor = smokeColor;
    float emberAlpha = alpha;
    
    // Generate multiple ember particles spread across entire width (reduced from 20 to 12)
    for(int i = 0; i < 12; i++) {
        float fi = float(i);
        
        // Each ember has unique position and timing
        float emberSeed = fi * 0.618;
        
        // Spread embers across full width with better distribution
        float emberX = fract(sin(emberSeed * 12.9898) * 43758.5453);
        // Add multiple columns of embers
        float columnOffset = floor(fi / 4.0) * 0.2;
        emberX = fract(emberX + columnOffset);
        
        float emberSpeed = 0.06 + fract(sin(emberSeed * 78.233) * 43758.5453) * 0.10;
        float emberSize = 0.01 + fract(sin(emberSeed * 45.164) * 43758.5453) * 0.018;
        
        // Ember rises from bottom, loops when reaching top
        float emberY = fract((time * emberSpeed) + emberSeed);
        
        // Add horizontal drift with wider range
        float drift = sin(time * 0.4 + emberSeed * 6.28) * 0.15;
        
        // Map to screen space with aspect ratio correction
        float aspectRatio = vp.x / vp.y;
        vec2 emberPos = vec2((emberX * 2.0 - 1.0) * aspectRatio + drift, emberY * 2.0 - 1.0);
        
        // Distance from current pixel to ember
        float dist = length(p - emberPos);
        
        // Create glowing ember with soft falloff
        float ember = smoothstep(emberSize * 3.0, 0.0, dist);
        
        // Pulsing glow effect
        float pulse = 0.7 + 0.3 * sin(time * 3.0 + emberSeed * 6.28);
        ember *= pulse;
        
        // Hot coal color gradient: deep red → bright orange → yellow center
        vec3 emberCore = vec3(1.0, 0.9, 0.3);    // Bright yellow-white
        vec3 emberMid = vec3(1.0, 0.4, 0.1);     // Bright orange
        vec3 emberOuter = vec3(0.8, 0.1, 0.0);   // Deep red
        
        float emberGradient = smoothstep(emberSize * 2.0, 0.0, dist);
        vec3 emberColor = mix(emberOuter, emberMid, emberGradient);
        emberColor = mix(emberColor, emberCore, pow(emberGradient, 2.0));
        
        // Fade embers at top and bottom
        float fadeFactor = smoothstep(0.0, 0.15, emberY) * smoothstep(1.0, 0.85, emberY);
        ember *= fadeFactor;
        
        // Add glow halo around ember
        float glow = smoothstep(emberSize * 6.0, emberSize * 2.0, dist) * 0.3;
        ember = max(ember, glow);
        
        // Blend ember into scene
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
      antialias: false, // Disable for performance
      powerPreference: 'high-performance'
    });
    if (!gl) return;

    // Compile shader helper
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

    // Enable alpha blending so transparent parts show through
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const timeLoc = gl.getUniformLocation(program, 'time');
    const vpLoc = gl.getUniformLocation(program, 'vp');
    const startTime = Date.now();

    const resize = () => {
      // Use lower resolution for better performance
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
      <p className="text-white text-sm font-medium tracking-widest">LOADING EXPERIENCE</p>
    </div>
  </div>
));

// ─── 3D Skull Model Component ────────────────────────────────────────────────
const SkullModel = memo(({ isMobile, isUserInteracting }: { isMobile: boolean; isUserInteracting: boolean }) => {
  const { scene } = useGLTF('/Skull_Resize4.glb');
  const meshRef = useRef<THREE.Group>(null);

  // Center the model geometry properly
  useEffect(() => {
    if (scene) {
      // Calculate bounding box and center, then translate geometry
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      // Traverse all meshes and center their geometry
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) {
            mesh.geometry.translate(-center.x, -center.y, -center.z);
          }
        }
      });
      // Reset scene position to origin
      scene.position.set(0, 0, 0);
    }
  }, [scene]);

  // Auto-rotation when user is not interacting
  useFrame(() => {
    if (!meshRef.current || isUserInteracting) return;
    
    // Slow automatic rotation on Y-axis
    meshRef.current.rotation.y += 0.003;
  });

  // Responsive positioning and scaling - CENTERED & BIGGER
  const scale = isMobile ? 5 : 5;
  const positionX = 0; // Center horizontally
  const positionY = isMobile ? -0.5 : 0;

  return (
    <primitive 
      ref={meshRef} 
      object={scene} 
      scale={scale}
      position={[positionX, positionY, 0]}
    />
  );
});

// ─── Index ────────────────────────────────────────────────────────────────────
const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [skullLoading, setSkullLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide skull loader after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setSkullLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => { loadFeaturedProducts(); }, []);

  const loadFeaturedProducts = async () => {
    try {
      const data: any = await productApi.getFeatured(3);
      const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
      setFeaturedProducts(normalized);

      // Sync wishlist from API response
      const wishlistIds = data.products
        .filter((p: ApiProduct) => p.in_wishlist)
        .map((p: ApiProduct) => p._id);
      if (wishlistIds.length > 0) {
        useWishlistStore.getState().syncWishlist(wishlistIds);
      }
    } catch (error: any) {
      toast.error('Failed to load featured products');
      console.error('Featured products error:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Force multiple resize events to ensure canvas gets correct dimensions
    const triggerResize = () => {
      window.dispatchEvent(new Event('resize'));
    };
    
    // Trigger immediately
    triggerResize();
    
    // Trigger after a short delay
    const timer1 = setTimeout(triggerResize, 100);
    const timer2 = setTimeout(triggerResize, 300);
    const timer3 = setTimeout(triggerResize, 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black w-full overflow-x-hidden">
      <SEO
        title="BLACK POTHEADS - Premium Printed T-Shirts | Streetwear India"
        description="Shop premium printed t-shirts online in India. Unique Shiva, psychedelic, gothic & streetwear designs. Free shipping, COD available. 7-day returns. Order now!"
        keywords="printed t-shirts india, streetwear india, graphic tees, shiva t-shirts, psychedelic clothing, gothic tees, premium cotton tshirts, online tshirt shopping india, blackpotheads, rick and morty tshirts, chakra clothing"
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
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
          },
          "paymentAccepted": "Cash, Credit Card, Debit Card, UPI, Net Banking",
          "currenciesAccepted": "INR",
          "openingHours": "Mo-Su 00:00-23:59",
          "telephone": "+91-XXXXXXXXXX",
          "email": "support@blackpotheads.com"
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          3D ROTATING HERO WITH SKULL MODEL
          z-5  → WebGL smoke BELOW model  (background smoke)
          z-10 → 3D rotating skull model
          z-20 → WebGL smoke ABOVE model  (foreground smoke)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative h-screen overflow-hidden flex items-center justify-center bg-black"
        style={{ 
          width: '100vw',
          marginLeft: '50%',
          transform: 'translateX(-50%)',
          left: 0,
          right: 0
        }}
      >
        <div className="absolute inset-0 bg-black -z-10" />

        {/* Skull Loading Spinner */}
        {skullLoading && <LoadingSpinner />}

        {/* ── WEBGL SMOKE BELOW MODEL (z-5) ── */}
        {/* Covers bottom 50% of the hero, sits behind the model */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ 
            height: '50%', 
            zIndex: 5,
            maskImage: 'linear-gradient(to top, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent 100%)'
          }}
        >
          <SmokeCanvas />
        </div>

        {/* ── 3D SKULL MODEL (z-10) ── */}
        <motion.div
          className="relative w-full h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[80vh] mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ zIndex: 10 }}
        >
    
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 1000 }}
            style={{ width: '100%', height: '100%' }}
            gl={{ 
              alpha: true, 
              antialias: true,
              powerPreference: 'high-performance'
            }}
            dpr={[1, 1.5]} // Limit pixel ratio for performance
            frameloop="always"
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ff4400" />
            <pointLight position={[0, 5, 0]} intensity={0.8} color="#ff6600" />
            <Suspense fallback={null}>
              <Center>
                <SkullModel isMobile={isMobile} isUserInteracting={isUserInteracting} />
              </Center>
            </Suspense>
            
            {/* OrbitControls for free mouse movement */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              rotateSpeed={0.5}
              dampingFactor={0.05}
              enableDamping={true}
              onStart={() => setIsUserInteracting(true)}
              onEnd={() => setIsUserInteracting(false)}
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
            />
          </Canvas>
          

          {/* Orbital par<tticles - reduced count */}
          {/* <motion.div
            className="absolute -inset-20 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </motion.div> */}
        </motion.div>

        {/* ── WEBGL SMOKE ABOVE MODEL (z-20) ── */}
        {/* Covers bottom 35% only — thin foreground wisp layer over the model */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ 
            height: '35%', 
            zIndex: 20,
            maskImage: 'linear-gradient(to top, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent 100%)'
          }}
        >
          <SmokeCanvas />
        </div>

        {/* Instruction Text */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center hidden md:block"
          style={{ zIndex: 30 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >

        </motion.div>
      </section>

      {/* Marquee */}


      <BrandMarquee />
      <CategoriesShowcase />
      <CollabSection />

      {/* Featured Products */}
      {/* <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
          >
            <div>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 60 }}
                viewport={{ once: true }}
                className="h-1 bg-primary mb-6"
              />
              <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">Just Dropped</span>
              <h2 className="font-display text-5xl md:text-6xl">NEW ARRIVALS</h2>
            </div>
            <Button variant="minimal" asChild>
              <Link to="/shop">View All Products <ArrowRight size={18} /></Link>
            </Button>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Loading featured products...</div>
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">No featured products available</div>
            ) : (
              featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            )}
          </div>
        </div>
      </section> */}

      <ScrollingText />
      <TrendingSection />
      <AboutBrandSection />
      <ProcessSection />
    </div>
  );
};

export default Index;