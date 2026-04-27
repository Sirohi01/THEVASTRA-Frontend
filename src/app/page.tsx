"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/common/Hero";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['featured-categories'],
    queryFn: async () => {
      const { data } = await API.get('/catalog/categories');
      return data.categories;
    }
  });

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      {/* Dynamic Featured Collections */}
      <section className="py-24 bg-cream overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16 text-center">
            <p className="text-secondary tracking-[0.4em] uppercase text-[10px] font-bold mb-4">The Heritage Archive</p>
            <h2 className="text-4xl md:text-6xl text-primary font-serif uppercase leading-tight">Timeless Collections</h2>
            <div className="w-24 h-[1px] bg-secondary mt-6" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3].map(i => <div key={i} className="h-[500px] bg-accent animate-pulse rounded-sm" />)
            ) : (
              categories?.slice(0, 3).map((category: any) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={category._id} 
                  className="group relative overflow-hidden h-[500px] md:h-[600px] cursor-pointer"
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-700 z-10" />
                  <img 
                    src={category.image || "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2070&auto=format&fit=crop"} 
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-8 text-center">
                    <h3 className="text-white text-3xl font-serif tracking-widest uppercase mb-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                      {category.name}
                    </h3>
                    <Link href={`/shop?category=${category._id}`}>
                      <button className="text-white border border-white px-8 py-3 uppercase text-[10px] tracking-[0.3em] font-bold opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 hover:bg-white hover:text-primary">
                        View Pieces
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Brand Promise */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-6 text-secondary">
                <span className="text-2xl font-serif">01</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Handcrafted Excellence</h3>
              <p className="text-secondary text-sm leading-relaxed max-w-xs">
                Each piece is a masterpiece, crafted by master artisans using centuries-old techniques.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-6 text-secondary">
                <span className="text-2xl font-serif">02</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Sustainable Luxury</h3>
              <p className="text-secondary text-sm leading-relaxed max-w-xs">
                Committed to conscious fashion, using organic silks and ethically sourced materials.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-6 text-secondary">
                <span className="text-2xl font-serif">03</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Royal Heritage</h3>
              <p className="text-secondary text-sm leading-relaxed max-w-xs">
                Designs that celebrate the regality of Indian culture while embracing modern silhouettes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-secondary tracking-[0.4em] uppercase text-[10px] font-bold mb-2">The Latest Drops</p>
              <h2 className="text-4xl font-serif text-primary uppercase">New Arrivals</h2>
            </div>
            <Link href="/new-arrivals" className="text-[10px] font-bold uppercase tracking-widest border-b border-primary text-primary hover:text-secondary transition-colors">
              Explore All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Products will be rendered here by a separate component or fetched here */}
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] bg-white animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
