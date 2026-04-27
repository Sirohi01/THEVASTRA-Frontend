"use client";

import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/common/PageHeader";
import API from "@/services/api";
import { motion } from "framer-motion";

export default function ShippingReturnsPage() {
  const { data } = useQuery({
    queryKey: ['cms-content', 'shipping-returns'],
    queryFn: async () => {
      const { data } = await API.get('/cms/content/shipping-returns');
      return data.content;
    }
  });

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PageHeader 
        title={data?.title || "Shipping & Returns"} 
        subtitle={data?.subtitle || "Seamless global delivery and effortless returns for our esteemed clients."}
        image={data?.headerImage || "https://images.unsplash.com/photo-1583391733956-6c78276477e2"}
      />
      
      <div className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div 
              className="prose prose-luxury mx-auto text-foreground/80 leading-relaxed space-y-8 text-sm font-serif"
              dangerouslySetInnerHTML={{ __html: data?.content || "<p>Loading policy details...</p>" }}
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
