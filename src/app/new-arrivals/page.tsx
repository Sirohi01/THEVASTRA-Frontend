"use client";

import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/common/ProductCard";
import API from "@/services/api";

export default function NewArrivalsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: async () => {
      const { data } = await API.get('/catalog/products', { params: { sort: 'newest', limit: 20 } });
      return data;
    }
  });

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="mb-12">
          <p className="text-secondary tracking-[0.4em] uppercase text-[10px] font-bold mb-2">Just Landed</p>
          <h1 className="text-5xl font-serif text-primary uppercase">New Arrivals</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="aspect-[3/4] bg-accent animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {data?.products?.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
