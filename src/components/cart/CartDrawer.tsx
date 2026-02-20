import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const CartDrawer = () => {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-2xl uppercase tracking-wider">Your Cart</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeCart}
                className="p-2 hover:text-primary transition-colors"
                aria-label="Close cart"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <ShoppingBag size={64} className="text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">Your cart is empty</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Add some items to get started
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.selectedSize}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 pb-6 border-b border-border"
                      >
                        {/* Image */}
                        <div className="w-24 h-24 bg-secondary overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm uppercase tracking-wider truncate">
                            {item.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mt-1">
                            Size: {item.selectedSize}
                          </p>
                          <p className="text-primary font-bold mt-1">₹{item.price}</p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mt-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={async () =>
                                await updateQuantity(item.id, item.selectedSize, item.quantity - 1)
                              }
                              className="w-8 h-8 border border-border flex items-center justify-center hover:border-primary transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </motion.button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={async () =>
                                await updateQuantity(item.id, item.selectedSize, item.quantity + 1)
                              }
                              className="w-8 h-8 border border-border flex items-center justify-center hover:border-primary transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </motion.button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={async () => await removeItem(item.id, item.selectedSize)}
                          className="text-gray-400 hover:text-gray-700 transition-colors self-start"
                          aria-label="Remove item"
                        >
                          <X size={18} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-6 border-t border-border space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground uppercase tracking-wider text-sm">
                    Subtotal
                  </span>
                  <span className="font-display text-2xl">₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
                <p className="text-center text-muted-foreground text-xs">
                  Shipping & taxes calculated at checkout
                </p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
