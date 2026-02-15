import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag, Menu, X, Search, User, Skull, Heart } from 'lucide-react';
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
  { label: 'Contact', href: '/contact' },
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

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border"
    >
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo with skull */}
        <motion.div style={{ scale: logoScale }}>
          <Link to="/" className="flex items-center gap-2">
            <motion.div style={{ rotate: skullRotate }} className="relative">
              <motion.div
                style={{ opacity: glowOpacity }}
                className="absolute inset-0 blur-md"
              >
                <Skull size={28} className="text-primary" />
              </motion.div>
              <Skull size={28} className="text-foreground relative z-10" />
            </motion.div>
            <span className="font-display text-2xl tracking-wider">BLACK POTHEADS</span>
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
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300',
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
            className="p-2 hover:text-primary transition-colors"
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
                  className="p-2 hover:text-primary transition-colors relative"
                  aria-label="Wishlist"
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold"
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
                  className="p-2 hover:text-primary transition-colors"
                  aria-label="Profile"
                >
                  <User size={20} />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="text-xs uppercase tracking-wider px-3 py-1 border border-border hover:border-primary transition-colors"
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
                  className="text-xs uppercase tracking-wider px-3 py-1 border border-border hover:border-primary transition-colors"
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs uppercase tracking-wider px-3 py-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
            className="p-2 hover:text-primary transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold"
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
            className="p-2 md:hidden"
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
          'md:hidden overflow-hidden bg-background border-b border-border',
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
                className="text-2xl font-display uppercase tracking-wider py-2 border-b border-border block"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          
          {user ? (
            <>
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                <div className="text-2xl font-display uppercase tracking-wider py-2 border-b border-border flex items-center justify-between">
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="text-sm bg-primary text-primary-foreground px-2 py-1">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <div className="text-2xl font-display uppercase tracking-wider py-2 border-b border-border">
                  Profile
                </div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="text-2xl font-display uppercase tracking-wider py-2 border-b border-border text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <div className="text-2xl font-display uppercase tracking-wider py-2 border-b border-border">
                  Login
                </div>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <div className="text-2xl font-display uppercase tracking-wider py-2 border-b border-border">
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
