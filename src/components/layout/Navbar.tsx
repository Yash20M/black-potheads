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
  { label: 'About', href: '/about' },
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
          <Link to="/" className="flex items-center gap-3">
            <motion.div 
              style={{ rotate: skullRotate }} 
              className="relative w-16 h-16 flex items-center justify-center"
            >
              <motion.div
                style={{ opacity: glowOpacity }}
                className="absolute inset-0 blur-md"
              >
                <img 
                  src={isHomePage ? "/logo.png" : "/white_logo.png"}
                  alt="Black Potheads Logo" 
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <img 
                src={isHomePage ? "/logo.png" : "/white_logo.png"}
                alt="Black Potheads Logo" 
                className="w-full h-full object-contain relative z-10"
              />
            </motion.div>
            <span className={cn(
              'font-display text-2xl tracking-wider',
              isHomePage ? 'text-white' : 'text-black'
            )}>
              BLACK POTHEADS
            </span>
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
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'p-2 transition-colors',
              isHomePage ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
            )}
            aria-label="Search"
          >
            <Search size={20} />
          </motion.button>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/wishlist">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'p-2 transition-colors relative',
                    isHomePage ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
                  )}
                  aria-label="Wishlist"
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        'absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center font-bold',
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
                    'p-2 transition-colors',
                    isHomePage ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
                  )}
                  aria-label="Profile"
                >
                  <User size={20} />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className={cn(
                  'text-xs uppercase tracking-wider px-3 py-1 border transition-colors',
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
              'p-2 transition-colors relative',
              isHomePage ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
            )}
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cn(
                  'absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center font-bold',
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
              'p-2 md:hidden',
              isHomePage ? 'text-white' : 'text-black'
            )}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
        <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
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
                  'text-2xl font-display uppercase tracking-wider py-2 border-b block',
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
                  'text-2xl font-display uppercase tracking-wider py-2 border-b flex items-center justify-between',
                  isHomePage 
                    ? 'text-white border-gray-800' 
                    : 'text-black border-gray-200'
                )}>
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className={cn(
                      'text-sm px-2 py-1',
                      isHomePage ? 'bg-white text-black' : 'bg-black text-white'
                    )}>
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <div className={cn(
                  'text-2xl font-display uppercase tracking-wider py-2 border-b',
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
                  'text-2xl font-display uppercase tracking-wider py-2 border-b text-left',
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
                  'text-2xl font-display uppercase tracking-wider py-2 border-b',
                  isHomePage 
                    ? 'text-white border-gray-800' 
                    : 'text-black border-gray-200'
                )}>
                  Login
                </div>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <div className={cn(
                  'text-2xl font-display uppercase tracking-wider py-2 border-b',
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
