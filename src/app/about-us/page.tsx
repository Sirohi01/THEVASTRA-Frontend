"use client";

import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/common/PageHeader";
import API from "@/services/api";
import { motion } from "framer-motion";

export default function AboutUsPage() {
  const { data } = useQuery({
    queryKey: ['cms-content', 'about-us'],
    queryFn: async () => {
      const { data } = await API.get('/cms/content/about-us');
      return data.content;
    }
  });

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PageHeader 
        title={data?.title || "Our Story"} 
        subtitle={data?.subtitle || "A heritage of craftsmanship, a journey of elegance."}
        image={data?.headerImage || "https://images.unsplash.com/photo-1594187043532-97417b0ef535"}
      />
      
      <div className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div 
              className="prose prose-luxury mx-auto text-foreground/80 leading-relaxed space-y-8 text-lg font-serif first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left"
              dangerouslySetInnerHTML={{ __html: data?.content || "<p>Loading our story...</p>" }}
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
