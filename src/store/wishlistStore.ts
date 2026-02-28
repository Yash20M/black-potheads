import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  wishlistIds: Set<string>;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  syncWishlist: (productIds: string[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: new Set<string>(),
      
      addToWishlist: (productId: string) => {
        set((state) => {
          const newWishlistIds = new Set(state.wishlistIds);
          newWishlistIds.add(productId);
          return { wishlistIds: newWishlistIds };
        });
      },
      
      removeFromWishlist: (productId: string) => {
        set((state) => {
          const newWishlistIds = new Set(state.wishlistIds);
          newWishlistIds.delete(productId);
          return { wishlistIds: newWishlistIds };
        });
      },
      
      isInWishlist: (productId: string) => {
        return get().wishlistIds.has(productId);
      },
      
      clearWishlist: () => {
        set({ wishlistIds: new Set<string>() });
      },

      syncWishlist: (productIds: string[]) => {
        set({ wishlistIds: new Set(productIds) });
      },
    }),
    {
      name: 'wishlist-storage',
      // Custom storage to handle Set serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              wishlistIds: new Set(state.wishlistIds || []),
            },
          };
        },
        setItem: (name, value) => {
          const str = JSON.stringify({
            state: {
              ...value.state,
              wishlistIds: Array.from(value.state.wishlistIds),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
