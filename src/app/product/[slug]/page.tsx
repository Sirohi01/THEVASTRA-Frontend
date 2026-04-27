"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import API from "@/services/api";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Heart, Share2, Truck, ShieldCheck, RotateCcw } from "lucide-react";

import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  try {
    const { data } = await API.get(`/catalog/products/${slug}`);
    const product = data.product;
    return {
      title: `${product.name} | TheVastraHouse Luxury`,
      description: product.description.slice(0, 160),
      openGraph: {
        images: [product.images[0]?.url],
      }
    };
  } catch (error) {
    return { title: "Product | TheVastraHouse" };
  }
}

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const addItem = useCartStore((state) => state.addItem);
  const { addProduct } = useRecentlyViewed();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await API.get(`/catalog/products/${slug}`);
      return data.product;
    }
  });

  useEffect(() => {
    if (product) {
      addProduct(product);
    }
  }, [product]);

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading Piece...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>;

  const handleAddToCart = () => {
    if (product.variants.length > 0 && (!selectedSize || !selectedColor)) {
      toast.error("Please select size and color");
      return;
    }
    addItem({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.basePrice,
      image: product.images[0].url,
      quantity: 1,
      variant: { size: selectedSize, color: selectedColor }
    });
    toast.success("Added to your bag");
  };

  const colors = Array.from(new Set(product.variants.map((v: any) => v.color)));
  const sizes = Array.from(new Set(product.variants.map((v: any) => v.size)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images.map((img: any) => img.url),
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "TheVastraHouse"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://thevastrahouse.com/product/${slug}`,
      "priceCurrency": "INR",
      "price": product.basePrice,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Gallery - Placeholder for multi-image slider */}
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
              <p className="text-2xl text-primary font-medium">₹{product.basePrice.toLocaleString()}</p>
            </div>

            <div className="py-8 space-y-8 border-b border-accent">
              {/* Color Selection */}
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold mb-4">Select Color: <span className="text-primary">{selectedColor}</span></h3>
                <div className="flex gap-3">
                  {colors.map((color: any) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs uppercase tracking-widest border transition-all ${selectedColor === color ? 'bg-primary text-white border-primary' : 'border-accent text-secondary hover:border-primary'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold">Select Size: <span className="text-primary">{selectedSize}</span></h3>
                  <button className="text-[10px] uppercase tracking-widest text-secondary underline">Size Guide</button>
                </div>
                <div className="flex gap-3">
                  {sizes.map((size: any) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 text-xs uppercase border flex items-center justify-center transition-all ${selectedSize === size ? 'bg-primary text-white border-primary' : 'border-accent text-secondary hover:border-primary'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button className="flex-1" size="lg" onClick={handleAddToCart}>Add to Bag</Button>
                <button className="p-4 border border-accent hover:bg-accent/30 transition-colors">
                  <Heart size={20} className="text-primary" />
                </button>
                <button className="p-4 border border-accent hover:bg-accent/30 transition-colors">
                  <Share2 size={20} className="text-primary" />
                </button>
              </div>
            </div>

            <div className="py-8 space-y-6">
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

            <div className="mt-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-primary">The Narrative</h3>
              <p className="text-secondary text-sm leading-relaxed">{product.description}</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
