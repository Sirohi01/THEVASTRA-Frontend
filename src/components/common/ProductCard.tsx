"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";

import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: any;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const hasDiscount = product.variants?.[0]?.discountPrice > 0;
    const price = hasDiscount ? product.variants[0].discountPrice : product.basePrice;
    const originalPrice = hasDiscount ? product.variants[0].price : product.basePrice;

    addItem({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: price,
      originalPrice: originalPrice,
      image: product.images[0]?.url,
      quantity: 1
    });
    toast.success("Added to bag");
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const hasDiscount = product.variants?.[0]?.discountPrice > 0;
    const price = hasDiscount ? product.variants[0].discountPrice : product.basePrice;
    const originalPrice = hasDiscount ? product.variants[0].price : product.basePrice;

    toggleWishlist({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: price,
      originalPrice: originalPrice,
      image: product.images[0]?.url
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-accent">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]?.url || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isNewArrival && (
            <span className="bg-primary text-white text-[8px] font-bold px-2 py-1 uppercase tracking-widest shadow-lg">New Arrival</span>
          )}
          {product.variants?.[0]?.discountPrice > 0 && (
            <span className="bg-secondary text-white text-[8px] font-bold px-2 py-1 uppercase tracking-widest shadow-lg">
              {Math.round(((product.basePrice - product.variants[0].discountPrice) / product.basePrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 flex gap-2 z-20">
          {product.variants?.length > 0 ? (
            <Link href={product.slug ? `/product/${product.slug}` : '#'} className="flex-1">
              <button className="w-full bg-primary text-white py-2 text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 shadow-xl">
                Select Size
              </button>
            </Link>
          ) : (
            <button 
              onClick={handleAddToCart}
              disabled={!product.slug}
              className="flex-1 bg-primary text-white py-2 text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 shadow-xl disabled:opacity-50"
            >
              <ShoppingBag size={14} /> Add to Bag
            </button>
          )}
          <button 
            onClick={handleToggleWishlist}
            className={`p-2 transition-colors shadow-xl ${isInWishlist(product._id) ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-secondary hover:text-white'}`}
          >
            <Heart size={16} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-start">
        <div className="max-w-[70%]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-1 opacity-80">
            {product.category?.name}
          </p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-serif text-primary hover:text-secondary transition-colors truncate">
              {product.name}
            </h3>
            {product.variants?.[0]?.sku && (
              <p className="text-[9px] text-secondary/50 mt-1 uppercase tracking-widest">SKU: {product.variants[0].sku}</p>
            )}
          </Link>
        </div>
        <div className="text-right">
          {product.variants?.[0]?.discountPrice > 0 ? (
            <div className="flex flex-col items-end">
              <p className="text-sm font-bold text-primary">₹{product.variants[0].discountPrice.toLocaleString()}</p>
              <p className="text-[10px] text-secondary line-through opacity-50">₹{product.variants[0].price.toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-sm font-bold text-primary">
              ₹{product.basePrice?.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
