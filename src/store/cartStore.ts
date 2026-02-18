import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types/product';
import { cartApi } from '@/lib/api';
import { toast } from 'sonner';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  isSyncing: boolean;
  addItem: (product: Product, size: string) => Promise<void>;
  removeItem: (productId: string, size: string) => Promise<void>;
  updateQuantity: (productId: string, size: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isSyncing: false,

      addItem: async (product, size) => {
        try {
          const token = localStorage.getItem('token');
          
          if (token) {
            // Sync with backend first to validate stock
            await cartApi.add({
              productId: product.id,
              quantity: 1,
              size: size,
            });
          }

          // Update UI after successful backend validation
          set((state) => {
            const existingItem = state.items.find(
              (item) => item.id === product.id && item.selectedSize === size
            );

            if (existingItem) {
              return {
                items: state.items.map((item) =>
                  item.id === product.id && item.selectedSize === size
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
              };
            }

            return {
              items: [...state.items, { ...product, quantity: 1, selectedSize: size }],
            };
          });

          toast.success('Added to cart');
        } catch (error: any) {
          console.error('Failed to add to cart:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to add to cart';
          toast.error(errorMessage);
          throw error;
        }
      },

      removeItem: async (productId, size) => {
        // Optimistically update UI
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === productId && item.selectedSize === size)
          ),
        }));

        // Sync with backend
        try {
          const token = localStorage.getItem('token');
          if (token) {
            await cartApi.remove(productId);
          }
        } catch (error: any) {
          console.error('Failed to sync cart removal with backend:', error);
        }
      },

      updateQuantity: async (productId, size, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(productId, size);
          return;
        }

        try {
          const token = localStorage.getItem('token');
          
          if (token) {
            // Sync with backend first to validate stock
            await cartApi.update({
              productId,
              quantity,
              size,
            });
          }

          // Update UI after successful backend validation
          set((state) => ({
            items: state.items.map((item) =>
              item.id === productId && item.selectedSize === size
                ? { ...item, quantity }
                : item
            ),
          }));

          // Don't show success toast for quantity updates to avoid spam
        } catch (error: any) {
          console.error('Failed to update cart:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to update cart';
          toast.error(errorMessage);
          
          // Revert to previous state by re-fetching from backend
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const response = await cartApi.get();
              const backendItems = response.cart.map((item: any) => ({
                id: item.product._id,
                name: item.product.name,
                price: item.priceSnapshot || item.product.price,
                image: item.product.images?.[0] || item.product.image,
                images: item.product.images || [],
                category: item.category,
                quantity: item.quantity,
                selectedSize: item.size,
                stock: item.product.stock,
              }));
              set({ items: backendItems });
            } catch (fetchError) {
              console.error('Failed to fetch cart after error:', fetchError);
            }
          }
          
          throw error;
        }
      },

      clearCart: async () => {
        set({ items: [] });
        
        // Sync with backend
        try {
          const token = localStorage.getItem('token');
          if (token) {
            await cartApi.clear();
          }
        } catch (error: any) {
          console.error('Failed to clear backend cart:', error);
        }
      },

      syncWithBackend: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        set({ isSyncing: true });
        try {
          // First, clear backend cart
          await cartApi.clear();
          
          // Then add all local items to backend
          const items = get().items;
          for (const item of items) {
            await cartApi.add({
              productId: item.id,
              quantity: item.quantity,
              size: item.selectedSize,
            });
          }
        } catch (error: any) {
          console.error('Failed to sync cart with backend:', error);
          toast.error('Failed to sync cart. Please try again.');
        } finally {
          set({ isSyncing: false });
        }
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
