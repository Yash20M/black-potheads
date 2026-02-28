import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag, Menu, X, Search, User, Heart } from 'lucide-react';
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
  const skullRotate = useTransform(scrollY, [0, 500], [0, 180]);
  const glowOpacity = useTransform(scrollY, [0, 200, 400], [0.2, 1, 0.2]);

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b',
        isHomePage 
          ? 'bg-black/90 border-gray-800' 
          : 'bg-white/90 border-gray-200'
      )}
    >
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo with image */}
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
                  src={isHomePage ? "/logo.png" : "/white_logo.png"}
                  alt="Black Potheads Logo" 
                  className="w-full h-full object-contain max-h-14"
                />
              </motion.div>
              <img 
                src={isHomePage ? "/logo.png" : "/white_logo.png"}
                alt="Black Potheads Logo" 
                className="w-full h-full object-contain relative z-10 max-h-14"
              />
            </motion.div>
            
            {/* Animated Brand Name with Fancy Font */}
            <motion.div 
              className="hidden sm:block relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <span 
                className={cn(
                  'text-xl sm:text-2xl md:text-3xl lg:text-2xl tracking-[0.15em] font-bold',
                  'relative inline-block',
                  isHomePage ? 'text-white' : 'text-black'
                )}
                style={{
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  textShadow: isHomePage 
                    ? '2px 2px 4px rgba(0,0,0,0.3)' 
                    : '2px 2px 4px rgba(255,255,255,0.3)',
                  letterSpacing: '0.1em'
                }}
              >
                BLACKPOTHEADS
              </span>
              
              {/* Subtle animated accent line */}
              <motion.div
                className={cn(
                  'absolute -bottom-1 left-0 h-[2px]',
                  isHomePage ? 'bg-white' : 'bg-black'
                )}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
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
                    ? isHomePage ? 'text-white' : 'text-black'
                    : isHomePage ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 h-0.5 transition-all duration-300',
                    isHomePage ? 'bg-white' : 'bg-black',
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
                  className={cn(
                    'p-1.5 sm:p-2 transition-colors relative',
                    isHomePage ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
                  )}
                  aria-label="Wishlist"
                >
                  <Heart size={18} className="sm:w-5 sm:h-5" />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        'absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs flex items-center justify-center font-bold',
                        isHomePage ? 'bg-white text-black' : 'bg-black text-white'
                      )}
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
                  className={cn(
                    'p-1.5 sm:p-2 transition-colors',
                    isHomePage ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
                  )}
                  aria-label="Profile"
                >
                  <User size={18} className="sm:w-5 sm:h-5" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className={cn(
                  'text-[10px] sm:text-xs uppercase tracking-wider px-2 py-1 sm:px-3 sm:py-1 border transition-colors',
                  isHomePage 
                    ? 'border-white text-white hover:bg-white hover:text-black' 
                    : 'border-black text-black hover:bg-black hover:text-white'
                )}
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'text-xs uppercase tracking-wider px-3 py-1 border transition-colors',
                    isHomePage 
                      ? 'border-white text-white hover:bg-white hover:text-black' 
                      : 'border-black text-black hover:bg-black hover:text-white'
                  )}
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'text-xs uppercase tracking-wider px-3 py-1 transition-colors',
                    isHomePage 
                      ? 'bg-white text-black hover:bg-gray-200' 
                      : 'bg-black text-white hover:bg-gray-800'
                  )}
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
            className={cn(
              'p-1.5 sm:p-2 transition-colors relative',
              isHomePage ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
            )}
            aria-label="Cart"
          >
            <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cn(
                  'absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs flex items-center justify-center font-bold',
                  isHomePage ? 'bg-white text-black' : 'bg-black text-white'
                )}
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
            className={cn(
              'p-1.5 sm:p-2 md:hidden',
              isHomePage ? 'text-white' : 'text-black'
            )}
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
          'md:hidden overflow-hidden border-b',
          isHomePage 
            ? 'bg-black border-gray-800' 
            : 'bg-white border-gray-200',
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
                className={cn(
                  'text-xl sm:text-2xl font-display uppercase tracking-wider py-2 border-b block',
                  isHomePage 
                    ? 'text-white border-gray-800' 
                    : 'text-black border-gray-200'
                )}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          
          {user ? (
            <>
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                <div className={cn(
                  'text-xl sm:text-2xl font-display uppercase tracking-wider py-2 border-b flex items-center justify-between',
                  isHomePage 
                    ? 'text-white border-gray-800' 
                    : 'text-black border-gray-200'
                )}>
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className={cn(
                      'text-xs sm:text-sm px-2 py-1',
                      isHomePage ? 'bg-white text-black' : 'bg-black text-white'
                    )}>
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <div className={cn(
                  'text-xl sm:text-2xl font-display uppercase tracking-wider py-2 border-b',
                  isHomePage 
                    ? 'text-white border-gray-800' 
                    : 'text-black border-gray-200'
                )}>
                  Profile
                </div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className={cn(
                  'text-xl sm:text-2xl font-display uppercase tracking-wider py-2 border-b text-left',
                  isHomePage 
                    ? 'text-white border-gray-800' 
                    : 'text-black border-gray-200'
                )}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <div className={cn(
                  'text-xl sm:text-2xl font-display uppercase tracking-wider py-2 border-b',
                  isHomePage 
                    ? 'text-white border-gray-800' 
                    : 'text-black border-gray-200'
                )}>
                  Login
                </div>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <div className={cn(
                  'text-xl sm:text-2xl font-display uppercase tracking-wider py-2 border-b',
                  isHomePage 
                    ? 'text-white border-gray-800' 
                    : 'text-black border-gray-200'
                )}>
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
