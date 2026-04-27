"use client";

import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  image?: string;
}

export const PageHeader = ({ title, subtitle, image }: PageHeaderProps) => {
  return (
    <section className="relative w-full aspect-[2/1] md:aspect-[3/1] min-h-[300px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src={image || "https://images.unsplash.com/photo-1583391733956-6c78276477e2"} 
          alt={title}
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-primary/30 mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-secondary tracking-[0.5em] uppercase text-[10px] font-bold mb-4">TheVastraHouse</p>
          <h1 className="text-4xl md:text-6xl font-serif text-white uppercase tracking-widest leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/80 text-xs uppercase tracking-widest mt-6 max-w-md mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};
