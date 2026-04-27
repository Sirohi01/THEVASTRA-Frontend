"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/common/ProductCard";
import { Button } from "@/components/ui/Button";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
          <h1 className="text-4xl font-serif text-primary uppercase tracking-widest">My Wishlist</h1>
          <span className="text-xs text-secondary/60">({items.length} Items)</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-cream border border-accent">
            <Heart size={48} className="mx-auto text-accent mb-4" />
            <p className="text-secondary uppercase tracking-widest text-sm mb-6">Your heart list is empty</p>
            <Button size="lg" onClick={() => window.location.href = '/shop'}>Explore Collections</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((product) => (
              <ProductCard key={product._id} product={{ ...product, images: [{ url: product.image }] }} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
