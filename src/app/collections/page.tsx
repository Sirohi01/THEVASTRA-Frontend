"use client";

import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import API from "@/services/api";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CollectionsPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await API.get('/catalog/categories');
      return data.categories;
    }
  });

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="mb-16">
          <p className="text-secondary tracking-[0.4em] uppercase text-[10px] font-bold mb-2">Heritage & Craft</p>
          <h1 className="text-5xl font-serif text-primary uppercase">Our Collections</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="aspect-video bg-accent animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories?.map((cat: any, i: number) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                key={cat._id}
                className="group relative aspect-video overflow-hidden bg-accent"
              >
                <img 
                  src={cat.image?.url || `https://images.unsplash.com/photo-1594187043532-97417b0ef535?q=80&w=2070&auto=format&fit=crop`}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h2 className="text-3xl font-serif uppercase tracking-widest mb-4">{cat.name}</h2>
                  <Link 
                    href={`/shop?category=${cat._id}`}
                    className="px-6 py-2 border border-white text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all"
                  >
                    Explore
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
