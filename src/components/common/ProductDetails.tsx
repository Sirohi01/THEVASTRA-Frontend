"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Heart, Share2, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useWishlistStore } from "@/store/wishlistStore";

export function ProductDetails({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentVariant, setCurrentVariant] = useState<any>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addProduct } = useRecentlyViewed();

  useEffect(() => {
    if (product) {
      addProduct(product);
    }
  }, [product?._id, addProduct]);

  // Set initial selections ONLY ONCE when product loads
  useEffect(() => {
    if (product && !selectedSize && !selectedColor) {
      if (product.variants?.length > 0) {
        setSelectedSize(product.variants[0].size);
        setSelectedColor(product.variants[0].color);
      }
    }
  }, [product]);

  useEffect(() => {
    if (selectedSize && selectedColor) {
      const variant = product.variants.find(
        (v: any) => v.size === selectedSize && v.color === selectedColor
      );
      setCurrentVariant(variant);
    }
  }, [selectedSize, selectedColor, product.variants]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }
    
    const price = currentVariant 
      ? (currentVariant.discountPrice || currentVariant.price) 
      : product.basePrice;
    
    const originalPrice = currentVariant ? currentVariant.price : product.basePrice;
    
    addItem({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: price,
      originalPrice: originalPrice,
      image: product.images[0].url,
      quantity: 1,
      variant: { size: selectedSize, color: selectedColor }
    });
    toast.success("Added to your bag");
  };

  const handleToggleWishlist = () => {
    const price = currentVariant 
      ? (currentVariant.discountPrice || currentVariant.price) 
      : product.basePrice;
    
    const originalPrice = currentVariant ? currentVariant.price : product.basePrice;

    const isAdding = !isInWishlist(product._id);

    toggleWishlist({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: price,
      originalPrice: originalPrice,
      image: product.images[0].url,
      categoryName: product.category?.name
    });

    if (isAdding) {
      toast.success("Added to wishlist");
    } else {
      toast.success("Removed from wishlist");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at TheVastraHouse`,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("Error sharing:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  const allColors = Array.from(new Set(product.variants.map((v: any) => v.color)));
  const allSizes = Array.from(new Set(product.variants.map((v: any) => v.size)));

  // Helper to check if a combination exists
  const isCombinationAvailable = (size: string, color: string) => {
    return product.variants.some((v: any) => v.size === size && v.color === color && v.stock > 0);
  };

  const displayPrice = currentVariant ? currentVariant.price : product.basePrice;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Gallery */}
      <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
        {product.images.map((img: any, i: number) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={i}
            className={`relative aspect-[3/4] bg-accent ${i === 0 ? 'md:col-span-2' : ''}`}
          >
            <Image 
              src={img.url} 
              alt={product.name} 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
              className="object-cover" 
            />
          </motion.div>
        ))}
      </div>

      {/* Details */}
      <div className="lg:col-span-5 flex flex-col">
        <div className="border-b border-accent pb-6">
          <p className="text-secondary tracking-[0.2em] uppercase text-xs font-bold mb-2">{product.category?.name}</p>
          <h1 className="text-4xl font-serif text-primary mb-4 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-4">
            <p className="text-2xl text-primary font-medium">₹{(currentVariant?.discountPrice || displayPrice).toLocaleString()}</p>
            {currentVariant?.discountPrice > 0 && (
              <p className="text-lg text-secondary line-through opacity-50 font-light">₹{currentVariant.price.toLocaleString()}</p>
            )}
          </div>
          {currentVariant?.sku && (
              <p className="text-[10px] text-secondary mt-2 tracking-widest uppercase">SKU: {currentVariant.sku}</p>
          )}
        </div>

        <div className="py-8 space-y-8 border-b border-accent">
          {/* Color Selection */}
          {allColors.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Color: <span className="text-secondary font-medium ml-2">{selectedColor || "Select Color"}</span></h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {allColors.map((color: any) => {
                  const available = product.variants.some((v: any) => v.color === color && (selectedSize ? v.size === selectedSize : true));
                  return (
                    <button
                      key={color as string}
                      onClick={() => setSelectedColor(color as string)}
                      className={`h-12 px-6 text-[10px] uppercase tracking-widest font-bold border transition-all duration-300 ${
                        selectedColor === color 
                        ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                        : 'border-accent text-secondary hover:border-primary bg-white'
                      } ${!available ? 'opacity-30' : 'opacity-100'}`}
                    >
                      {color as string}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {allSizes.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Size: <span className="text-secondary font-medium ml-2">{selectedSize || "Select Size"}</span></h3>
                <button className="text-[10px] uppercase tracking-widest text-secondary/60 hover:text-primary transition-colors border-b border-accent/50 pb-0.5">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {allSizes.map((size: any) => {
                  const available = product.variants.some((v: any) => v.size === size && (selectedColor ? v.color === selectedColor : true));
                  return (
                    <button
                      key={size as string}
                      onClick={() => setSelectedSize(size as string)}
                      className={`min-w-[3.5rem] h-12 px-4 text-[10px] uppercase tracking-widest font-bold border transition-all duration-300 ${
                        selectedSize === size 
                        ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                        : 'border-accent text-secondary hover:border-primary bg-white'
                      } ${!available ? 'opacity-30 line-through' : 'opacity-100'}`}
                    >
                      {size as string}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 pt-4">
            {currentVariant && currentVariant.stock === 0 ? (
                <div className="bg-red-50 text-red-700 p-4 text-center text-xs uppercase tracking-widest font-bold border border-red-100">
                    Out of Stock
                </div>
            ) : (
                <div className="flex gap-4">
                    <Button className="flex-1" size="lg" onClick={handleAddToCart}>Add to Bag</Button>
                    <button 
                      onClick={handleToggleWishlist}
                      className={`p-4 border transition-colors ${isInWishlist(product._id) ? 'bg-primary text-white border-primary' : 'border-accent hover:bg-accent/30'}`}
                    >
                      <Heart size={20} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                    </button>
                    <button 
                      onClick={handleShare}
                      className="p-4 border border-accent hover:bg-accent/30 transition-colors"
                    >
                      <Share2 size={20} className="text-primary" />
                    </button>
                </div>
            )}
          </div>
        </div>

        <div className="py-8 space-y-6 border-b border-accent">
          <div className="flex items-center gap-4 text-sm">
            <Truck size={20} className="text-secondary" />
            <span className="text-secondary uppercase tracking-widest text-[10px] font-bold">Free Shipping on orders above ₹5,000</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <ShieldCheck size={20} className="text-secondary" />
            <span className="text-secondary uppercase tracking-widest text-[10px] font-bold">100% Authentic Premium Quality</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <RotateCcw size={20} className="text-secondary" />
            <span className="text-secondary uppercase tracking-widest text-[10px] font-bold">Easy 7-day Returns</span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-primary">The Narrative</h3>
          <p className="text-secondary text-sm leading-relaxed">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
