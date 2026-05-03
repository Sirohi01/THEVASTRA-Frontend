"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/common/ProductCard";
import { PageHeader } from "@/components/common/PageHeader";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { SlidersHorizontal, ChevronDown, Search } from "lucide-react";

export default function ShopPage() {
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    sort: "newest",
    page: 1
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await API.get('/catalog/categories');
      return data.categories;
    }
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const { data } = await API.get('/catalog/products', { params: filters });
      return data;
    }
  });

  const { data: cmsData } = useQuery({
    queryKey: ['cms-content', 'shop'],
    queryFn: async () => {
      const { data } = await API.get('/cms/content/shop');
      return data.content;
    }
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PageHeader 
        title={cmsData?.title || "Our Archive"} 
        subtitle={cmsData?.subtitle || "Exquisite handcrafted ethnic masterpieces designed for the modern royalty."}
        image={cmsData?.headerImage || "https://images.unsplash.com/photo-1594187043532-97417b0ef535"}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Search & Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
           <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH PIECES..." 
              className="w-full bg-white border border-accent p-3 pl-10 text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary"
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Sort By:</span>
            <select 
              className="bg-transparent border-none text-[10px] uppercase tracking-widest font-bold focus:outline-none cursor-pointer"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="featured">Featured Pieces</option>
              <option value="newest">New Arrivals</option>
              <option value="discount">Special Offers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center gap-10 overflow-x-auto w-full mb-12 py-4 border-y border-accent no-scrollbar">
          <button 
            onClick={() => handleFilterChange('category', '')}
            className={`text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-all ${!filters.category ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}
          >
            All Pieces
          </button>
          {categoriesData?.map((cat: any) => (
            <button 
              key={cat._id}
              onClick={() => handleFilterChange('category', cat._id)}
              className={`text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-all ${filters.category === cat._id ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/4] bg-accent/30 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data?.products?.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Main Content Section from CMS */}
        {cmsData?.content && (
          <div className="mt-20 border-t border-accent pt-16 max-w-4xl mx-auto">
            <div 
              className="prose-luxury text-center"
              dangerouslySetInnerHTML={{ __html: cmsData.content }}
            />
          </div>
        )}

        {/* Pagination */}
        {data?.pages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-4 pb-20">
            <button 
              disabled={filters.page === 1}
              onClick={() => handleFilterChange('page', (filters.page - 1).toString())}
              className="px-6 py-2 border border-accent text-[10px] uppercase tracking-widest font-bold disabled:opacity-30"
            >
              Previous
            </button>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-secondary">
              Page {filters.page} of {data.pages}
            </span>
            <button 
              disabled={filters.page === data.pages}
              onClick={() => handleFilterChange('page', (filters.page + 1).toString())}
              className="px-6 py-2 border border-accent text-[10px] uppercase tracking-widest font-bold disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
