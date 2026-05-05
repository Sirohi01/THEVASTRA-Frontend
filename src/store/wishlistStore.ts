import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (item) => {
        const items = get().items;
        const exists = items.find(i => i._id === item._id);
        if (exists) {
          set({ items: items.filter(i => i._id !== item._id) });
        } else {
          set({ items: [...items, item] });
        }
      },
      isInWishlist: (id) => get().items.some(i => i._id === id),
    }),
    { name: 'wishlist-storage' }
  )
);
