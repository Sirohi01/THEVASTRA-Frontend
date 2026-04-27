"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import Link from "next/link";
import Image from "next/image";

export const Hero = () => {
  const [current, setCurrent] = useState(0);

  const { data: banners, isLoading } = useQuery({
    queryKey: ['hero-banners'],
    queryFn: async () => {
      const { data } = await API.get('/cms/banners');
      return data.banners;
    }
  });

  useEffect(() => {
    if (banners?.length > 1) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  if (isLoading || !banners || banners.length === 0) {
    return <div className="h-screen bg-accent animate-pulse" />;
  }

  return (
    <section className="relative h-[60vh] md:h-screen w-full overflow-hidden flex items-center pt-20 md:pt-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0">
            <Image 
              src={banners[current].imageUrl} 
              alt={banners[current].title}
              fill
              priority
              className="object-cover object-center transition-transform duration-[10000ms] scale-110" 
            />
            <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          key={current + "content"}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
        >
          <span className="text-secondary font-medium tracking-[0.4em] uppercase text-xs mb-4 block">
            {banners[current].subtitle || "Premium Ethnic Collection"}
          </span>
          <h1 className="text-5xl md:text-8xl text-white mb-6 leading-[1.1] font-serif">
            {banners[current].title.split(' ').map((word: string, i: number) => (
              <span key={i} className={i % 2 !== 0 ? "italic text-secondary" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link href={banners[current].link || "/shop"}>
              <Button size="lg">Explore Collection</Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-widest text-white/60 mb-2">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-[1px] h-12 bg-white/30"
        />
      </div>
    </section>
  );
};
