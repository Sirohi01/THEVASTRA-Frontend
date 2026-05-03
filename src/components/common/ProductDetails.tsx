"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Heart, Share2, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

export function ProductDetails({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentVariant, setCurrentVariant] = useState<any>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { addProduct } = useRecentlyViewed();

  useEffect(() => {
    if (product) {
      addProduct(product);
      // Set default selections if available
      if (product.variants?.length > 0) {
        setSelectedSize(product.variants[0].size);
        setSelectedColor(product.variants[0].color);
      }
    }
  }, [product, addProduct]);

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
    
    const price = currentVariant ? currentVariant.price : product.basePrice;
    
    addItem({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: price,
      image: product.images[0].url,
      quantity: 1,
      variant: { size: selectedSize, color: selectedColor }
    });
    toast.success("Added to your bag");
  };

  const colors = Array.from(new Set(product.variants.map((v: any) => v.color)));
  // Only show sizes available for the selected color (or all if no color selected)
  const sizes = Array.from(new Set(
    product.variants
      .filter((v: any) => !selectedColor || v.color === selectedColor)
      .map((v: any) => v.size)
  ));

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
            <Image src={img.url} alt={product.name} fill className="object-cover" />
          </motion.div>
        ))}
      </div>

      {/* Details */}
      <div className="lg:col-span-5 flex flex-col">
        <div className="border-b border-accent pb-6">
          <p className="text-secondary tracking-[0.2em] uppercase text-xs font-bold mb-2">{product.category?.name}</p>
          <h1 className="text-4xl font-serif text-primary mb-4 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-4">
            <p className="text-2xl text-primary font-medium">₹{displayPrice.toLocaleString()}</p>
            {currentVariant?.discountPrice && (
                <p className="text-lg text-secondary line-through">₹{currentVariant.discountPrice.toLocaleString()}</p>
            )}
          </div>
          {currentVariant?.sku && (
              <p className="text-[10px] text-secondary mt-2 tracking-widest uppercase">SKU: {currentVariant.sku}</p>
          )}
        </div>

        <div className="py-8 space-y-8 border-b border-accent">
          {/* Color Selection */}
          {colors.length > 0 && (
            <div>
              <h3 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-primary">Select Color: <span className="font-normal text-secondary">{selectedColor || "None selected"}</span></h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color: any) => (
                  <button
                    key={color as string}
                    onClick={() => {
                        setSelectedColor(color as string);
                        // Reset size if not available for new color
                        const availableSizes = product.variants.filter((v: any) => v.color === color).map((v: any) => v.size);
                        if (!availableSizes.includes(selectedSize)) setSelectedSize("");
                    }}
                    className={`px-4 py-2 text-xs uppercase tracking-widest border transition-all ${selectedColor === color ? 'bg-primary text-white border-primary' : 'border-accent text-secondary hover:border-primary'}`}
                  >
                    {color as string}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-primary">Select Size: <span className="font-normal text-secondary">{selectedSize || "None selected"}</span></h3>
                <button className="text-[10px] uppercase tracking-widest text-secondary underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size: any) => (
                  <button
                    key={size as string}
                    onClick={() => setSelectedSize(size as string)}
                    className={`min-w-[3rem] h-12 px-3 text-xs uppercase border flex items-center justify-center transition-all ${selectedSize === size ? 'bg-primary text-white border-primary' : 'border-accent text-secondary hover:border-primary'}`}
                  >
                    {size as string}
                  </button>
                ))}
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
                    <button className="p-4 border border-accent hover:bg-accent/30 transition-colors">
                      <Heart size={20} className="text-primary" />
                    </button>
                    <button className="p-4 border border-accent hover:bg-accent/30 transition-colors">
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
