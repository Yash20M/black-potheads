import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminNotificationStore {
  pendingOrdersCount: number;
  lastCheckedTime: number;
  setPendingOrdersCount: (count: number) => void;
  markOrdersAsViewed: () => void;
  updateLastCheckedTime: () => void;
}

export const useAdminNotificationStore = create<AdminNotificationStore>()(
  persist(
    (set) => ({
      pendingOrdersCount: 0,
      lastCheckedTime: Date.now(),

      setPendingOrdersCount: (count) => set({ pendingOrdersCount: count }),

      markOrdersAsViewed: () => set({ pendingOrdersCount: 0, lastCheckedTime: Date.now() }),

      updateLastCheckedTime: () => set({ lastCheckedTime: Date.now() }),
    }),
    {
      name: 'admin-notification-storage',
    }
  )
);
