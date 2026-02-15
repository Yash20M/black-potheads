import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Footer } from '@/components/sections/Footer';
import { CustomCursor } from '@/components/layout/CustomCursor';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
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
