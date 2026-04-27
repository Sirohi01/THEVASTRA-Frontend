"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[150px] md:text-[200px] font-serif text-accent/20 leading-none">404</span>
          <div className="-mt-12 md:-mt-20">
            <h1 className="text-3xl md:text-5xl font-serif text-primary uppercase tracking-widest mb-6">Lost in Elegance</h1>
            <p className="text-secondary mb-10 max-w-md mx-auto text-sm md:text-base">
              The piece you are looking for has been moved or is currently in our archives. 
              Let's get you back to the collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg">Explore Shop</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg">Home Page</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
