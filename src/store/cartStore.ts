import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  variant?: {
    size: string;
    color: string;
  };
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variant?: { size: string, color: string }) => void;
  updateQuantity: (id: string, variant: { size: string, color: string } | undefined, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find(item => 
          item._id === newItem._id && 
          item.variant?.size === newItem.variant?.size && 
          item.variant?.color === newItem.variant?.color
        );
        
        if (existingItem) {
          set({
            items: items.map(item =>
              (item._id === newItem._id && 
               item.variant?.size === newItem.variant?.size && 
               item.variant?.color === newItem.variant?.color)
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, newItem] });
        }
      },
      removeItem: (id, variant) => set({ 
        items: get().items.filter(item => 
          !(item._id === id && 
            item.variant?.size === variant?.size && 
            item.variant?.color === variant?.color)
        ) 
      }),
      updateQuantity: (id, variant, quantity) =>
        set({
          items: get().items.map(item =>
            (item._id === id && 
             item.variant?.size === variant?.size && 
             item.variant?.color === variant?.color) 
            ? { ...item, quantity } : item
          ),
        }),
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
