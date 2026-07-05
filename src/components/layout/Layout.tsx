import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Footer } from '@/components/sections/Footer';

// ── Announcement Bar ──────────────────────────────────────────────────────────
const ANNOUNCEMENT = "10% OFF on Prepaid Orders  ✦  COD Available  ✦  Free Shipping on Orders Above ₹499  ✦  10% OFF on Prepaid Orders  ✦  COD Available  ✦  Free Shipping on Orders Above ₹499  ✦";

const AnnouncementBar = () => (
  <div className="bg-white text-black text-xs font-medium overflow-hidden sticky top-0 z-[60]" style={{ height: '32px' }}>
    <div className="flex whitespace-nowrap" style={{ animation: 'marquee-scroll 20s linear infinite' }}>
      <span className="inline-block px-8 py-2">{ANNOUNCEMENT}</span>
      <span className="inline-block px-8 py-2" aria-hidden="true">{ANNOUNCEMENT}</span>
    </div>
    <style>{`
      @keyframes marquee-scroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Announcement Bar — sticky top, all pages */}
      <AnnouncementBar />

      {/* Navigation */}
      <Navbar />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
