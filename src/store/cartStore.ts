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
        // Optimistically update UI
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

        // Sync with backend
        try {
          const token = localStorage.getItem('token');
          if (token) {
            await cartApi.add({
              productId: product.id,
              quantity: 1,
              size: size,
            });
          }
        } catch (error: any) {
          console.error('Failed to sync cart with backend:', error);
          // Don't show error to user, cart still works locally
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

        // Optimistically update UI
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId && item.selectedSize === size
              ? { ...item, quantity }
              : item
          ),
        }));

        // Sync with backend
        try {
          const token = localStorage.getItem('token');
          if (token) {
            await cartApi.update({
              productId,
              quantity,
            });
          }
        } catch (error: any) {
          console.error('Failed to sync cart update with backend:', error);
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
