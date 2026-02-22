import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { BrandMarquee } from '@/components/sections/BrandMarquee';
import { StatsSection } from '@/components/sections/StatsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { LookbookSection } from '@/components/sections/LookbookSection';
import { AboutBrandSection } from '@/components/sections/AboutBrandSection';
import { CategoriesShowcase } from '@/components/sections/CategoriesShowcase';
import { TrendingSection } from '@/components/sections/TrendingSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { VideoSection } from '@/components/sections/VideoSection';
import { ScrollingText } from '@/components/sections/ScrollingText';
import { UpcomingDrop } from '@/components/sections/UpcomingDrop';
import { useEffect, useState, useRef } from 'react';
import { productApi } from '@/lib/api';
import { toast } from 'sonner';
import { Product, normalizeProduct, ApiProduct } from '@/types/product';

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

    // Pure white smoke palette — dark grey → mid grey → bright white
    vec3 darkGrey  = vec3(0.55, 0.55, 0.55);
    vec3 midGrey   = vec3(0.80, 0.80, 0.80);
    vec3 pureWhite = vec3(1.00, 1.00, 1.00);

    vec3 c1 = mix(darkGrey, midGrey,   clamp(ins * 2.0, 0.0, 1.0));
    vec3 c2 = mix(midGrey,  pureWhite, clamp(ins * 2.0 - 1.0, 0.0, 1.0));
    vec3 smokeColor = mix(c1, c2, clamp(ins, 0.0, 1.0));

    // Alpha: transparent at top, opaque at bottom
    float alpha = clamp(1.0 - gradient * 1.6, 0.0, 1.0);
    alpha *= clamp(ins + 0.2, 0.0, 1.0);

    fragColor = vec4(smokeColor, alpha);
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
const SmokeCanvas = ({ style }: { style?: React.CSSProperties }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
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
    const vpLoc   = gl.getUniformLocation(program, 'vp');
    const startTime = Date.now();

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
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
};

// ─── Index ────────────────────────────────────────────────────────────────────
const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const imageRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 80 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [180, -180]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-180, 180]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => { loadFeaturedProducts(); }, []);

  const loadFeaturedProducts = async () => {
    try {
      const data: any = await productApi.getFeatured(3);
      const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
      setFeaturedProducts(normalized);
    } catch (error: any) {
      toast.error('Failed to load featured products');
      console.error('Featured products error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">

      {/* ═══════════════════════════════════════════════════════════════════════
          3D ROTATING HERO
          z-5  → WebGL smoke BELOW image  (background smoke)
          z-10 → 3D rotating image
          z-20 → WebGL smoke ABOVE image  (foreground smoke)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] w-full overflow-hidden flex items-center justify-center bg-black"
        style={{ perspective: '1000px' }}
      >
        <div className="absolute inset-0 bg-black -z-10" />

        {/* ── WEBGL SMOKE BELOW IMAGE (z-5) ── */}
        {/* Covers bottom 40% of the hero, sits behind the image */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ height: '40%', zIndex: 5 }}
        >
          <SmokeCanvas />
        </div>

        {/* ── IMAGE (z-10) ── */}
        <motion.div
          ref={imageRef}
          className="relative w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl h-[50vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] mx-auto px-4 sm:px-0"
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d'}}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="relative w-full h-full bg-black"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src="/homeimg.jpeg"
              alt="Black Potheads"
              className="w-full h-full object-cover"
              style={{
                filter: 'brightness(1.2) contrast(1.4) saturate(1.1)',
                mixBlendMode: 'lighten',
              }}
            />
          </motion.div>

          {/* Orbital particles */}
          <motion.div
            className="absolute -inset-20 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* ── WEBGL SMOKE ABOVE IMAGE (z-20) ── */}
        {/* Covers bottom 25% only — thin foreground wisp layer over the image */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ height: '25%', zIndex: 20 }}
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
          <p className="text-white/60 text-sm uppercase tracking-[0.3em]">
            Move your cursor to explore
          </p>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="bg-background/90 backdrop-blur-sm py-3 overflow-hidden border-b border-border/30">
        <div className="animate-marquee whitespace-nowrap flex">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="mx-8 font-display text-lg tracking-wider text-muted-foreground">
              FREE SHIPPING ON ORDERS OVER $100 ✦ NEW DROPS EVERY FRIDAY ✦ BLACK POTHEADS ✦
            </span>
          ))}
        </div>
      </div>

      <BrandMarquee />
      <CategoriesShowcase />

      {/* Featured Products */}
      <section className="py-24 bg-background">
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
      </section>

      <ScrollingText />
      <TrendingSection />
      <VideoSection />
      <AboutBrandSection />
      <LookbookSection />
      <ProcessSection />
      <FeaturesSection />
      <UpcomingDrop />
      <StatsSection />
      <TestimonialsSection />
    </div>
  );
};

export default Index;