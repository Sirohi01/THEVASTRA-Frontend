"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { Button } from "../ui/Button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-accent flex justify-between items-center">
              <h2 className="text-xl uppercase tracking-widest text-primary font-serif">Your Bag</h2>
              <button onClick={onClose} className="p-2 hover:bg-accent/30 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                  <ShoppingBag size={64} className="text-accent" />
                  <p className="text-sm uppercase tracking-widest">Your bag is empty</p>
                  <Button onClick={onClose} variant="outline" size="sm">Start Shopping</Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item._id} className="flex gap-4 pb-6 border-b border-accent/30">
                    <div className="relative w-24 h-32 bg-accent">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm uppercase tracking-wider text-primary font-medium">{item.name}</h3>
                        <p className="text-xs text-secondary mt-1">₹{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-accent">
                          <button 
                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-accent/20"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 hover:bg-accent/20"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item._id)} className="text-red-800 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-cream border-t border-accent">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs uppercase tracking-widest font-medium">Subtotal</span>
                  <span className="text-lg font-serif text-primary">₹{getTotal().toLocaleString()}</span>
                </div>
                <Button className="w-full" size="lg">Proceed to Checkout</Button>
                <p className="text-[10px] text-center text-secondary mt-4 uppercase tracking-tighter">
                  Shipping and taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
