import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag, Menu, X, Search, User, Heart, Package } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Contact Us', href: '/contact' },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const { user, logout } = useAuthStore();
  const { wishlistIds } = useWishlistStore();
  const totalItems = getTotalItems();
  const wishlistCount = wishlistIds.size;
  const location = useLocation();

  const { scrollY } = useScroll();
  const logoScale = useTransform(scrollY, [0, 200], [1, 0.85]);
  // Continuous rotation: 1 full rotation (360deg) per 1000px of scroll
  const skullRotate = useTransform(scrollY, (value) => value * 0.36);
  const glowOpacity = useTransform(scrollY, [0, 200, 400], [0.2, 1, 0.2]);

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800"
    >
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo with image and animated text */}
        <motion.div style={{ scale: logoScale }}>
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <motion.div 
              style={{ rotate: skullRotate }} 
              className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-14 lg:h-14 flex items-center justify-center"
            >
              <motion.div
                style={{ opacity: glowOpacity }}
                className="absolute inset-0 blur-md"
              >
                <img 
                  src="/logo.png"
                  alt="Black Potheads Logo" 
                  className="w-full h-full object-contain max-h-14"
                />
              </motion.div>
              <img 
                src="/logo.png"
                alt="Black Potheads Logo" 
                className="w-full h-full object-contain relative z-10 max-h-14"
              />
            </motion.div>
            
            {/* Animated Brand Name */}
            <motion.div 
              className="hidden sm:block relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <span 
                className="text-xl sm:text-2xl md:text-3xl lg:text-2xl tracking-[0.15em] font-bold relative inline-block text-white"
                style={{
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '0.1em'
                }}
              >
                {'BLACKPOTHEADS'.split('').map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.4 + index * 0.04,
                    }}
                    className="inline-block"
                    // whileHover={{ 
                    //   scale: 1.15, 
                    //   color: '#ff0000',
                    //   textShadow: '0 0 10px rgba(255,0,0,0.8)',
                    //   transition: { duration: 0.2 }
                    // }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
              
              {/* Animated accent line */}
              <motion.div
                className="absolute -bottom-1 left-0 h-[2px] bg-white"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 1.2 }}
              />
            </motion.div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <motion.div key={link.label} whileHover={{ y: -2 }}>
              <Link
                to={link.href}
                className={cn(
                  'text-sm uppercase tracking-widest transition-colors relative group',
                  location.pathname === link.href
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300',
                    location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  )}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/wishlist">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 sm:p-2 transition-colors relative text-white hover:text-gray-300"
                  aria-label="Wishlist"
                >
                  <Heart size={18} className="sm:w-5 sm:h-5" />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs flex items-center justify-center font-bold bg-white text-black"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>
              <Link to="/profile">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 sm:p-2 transition-colors text-white hover:text-gray-300"
                  aria-label="Profile"
                >
                  <User size={18} className="sm:w-5 sm:h-5" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="text-[10px] sm:text-xs uppercase tracking-wider px-2 py-1 sm:px-3 sm:py-1 border border-white text-white hover:bg-white hover:text-black transition-colors"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/track-order">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 sm:p-2 transition-colors relative text-white hover:text-gray-300"
                  aria-label="Track Order"
                  title="Track Order"
                >
                  <Package size={18} className="sm:w-5 sm:h-5" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs uppercase tracking-wider px-3 py-1 border border-white text-white hover:bg-white hover:text-black transition-colors"
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs uppercase tracking-wider px-3 py-1 bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  Register
                </motion.button>
              </Link>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCart}
            className="p-1.5 sm:p-2 transition-colors relative text-white hover:text-gray-300"
            aria-label="Cart"
          >
            <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs flex items-center justify-center font-bold bg-white text-black"
              >
                {totalItems}
              </motion.span>
            )}
          </motion.button>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 sm:p-2 md:hidden text-white"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={22} className="sm:w-6 sm:h-6" /> : <Menu size={22} className="sm:w-6 sm:h-6" />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          'md:hidden overflow-hidden border-b bg-black border-gray-800',
          !isMenuOpen && 'pointer-events-none'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.label}
              initial={{ x: -20, opacity: 0 }}
              animate={isMenuOpen ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-xl sm:text-2xl font-display uppercase tracking-wider py-2 border-b block text-white border-gray-800"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          
          {user ? (
            <>
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                <div className="text-xl sm:text-2xl font-display uppercase tracking-wider py-2 border-b flex items-center justify-between text-white border-gray-800">
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="text-xs sm:text-sm px-2 py-1 bg-white text-black">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <div className="text-xl sm:text-2xl font-display uppercase tracking-wider py-2 border-b text-white border-gray-800">
                  Profile
                </div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="text-xl sm:text-2xl font-display uppercase tracking-wider py-2 border-b text-left text-white border-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/track-order" onClick={() => setIsMenuOpen(false)}>
                <div className="text-xl sm:text-2xl font-display uppercase tracking-wider py-2 border-b flex items-center gap-2 text-white border-gray-800">
                  <Package size={20} />
                  Track Order
                </div>
              </Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <div className="text-xl sm:text-2xl font-display uppercase tracking-wider py-2 border-b text-white border-gray-800">
                  Login
                </div>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <div className="text-xl sm:text-2xl font-display uppercase tracking-wider py-2 border-b text-white border-gray-800">
                  Register
                </div>
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </motion.header>
  );
};
