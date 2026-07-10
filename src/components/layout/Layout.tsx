import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Footer } from '@/components/sections/Footer';
import { OfferWidget } from '@/components/OfferWidget';

// ── Announcement Bar ──────────────────────────────────────────────────────────
const ANNOUNCEMENT = "10% OFF on Prepaid Orders  ✦  COD Available  ✦  Free Shipping on Orders Above ₹499  ✦  10% OFF on Prepaid Orders  ✦  COD Available  ✦  Free Shipping on Orders Above ₹499  ✦";

const AnnouncementBar = () => (
  <div className="bg-white text-black text-xs font-medium overflow-hidden relative z-[70]" style={{ height: '32px' }}>
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

      {/* ₹100 Off Widget — fixed left bottom, all pages */}
      <OfferWidget />

      {/* WhatsApp Button — fixed right bottom, all pages */}
      <a
        href="https://wa.me/919929337714?text=Hi%20BlackPotheads!%20I%20wanted%20to%20know%20more%20about%20your%20products%20and%20brand.%20Can%20you%20help%20me%3F"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 z-[999] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#20bd5a] transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 32 32" width="30" height="30" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.004 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.364.635 4.63 1.74 6.594L2.667 29.333l6.95-1.72A13.267 13.267 0 0016.004 29.333c7.368 0 13.329-5.969 13.329-13.333S23.372 2.667 16.004 2.667zm0 24c-2.18 0-4.22-.6-5.96-1.64l-.427-.253-4.127 1.02 1.04-4.013-.28-.44A10.596 10.596 0 015.333 16c0-5.88 4.786-10.667 10.671-10.667S26.675 10.12 26.675 16 21.889 26.667 16.004 26.667zm5.826-7.987c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-.987 1.253-.16.213-.32.24-.64.08-.32-.16-1.347-.493-2.56-1.573-.947-.84-1.587-1.88-1.773-2.2-.187-.32-.02-.493.14-.653.147-.14.32-.36.48-.547.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.26-.627-.52-.54-.72-.547h-.613c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.253 3.44 5.467 4.827.763.327 1.36.52 1.827.667.767.24 1.467.207 2.02.127.613-.093 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z"/>
        </svg>
      </a>
    </div>
  );
};
