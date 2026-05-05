"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, User, Menu, X, Heart } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { CartDrawer } from "./CartDrawer";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/shop?sort=featured" },
    { name: "New Arrivals", href: "/shop?sort=newest" },
    { name: "Offers", href: "/shop?sort=discount" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-md py-4" 
            : "bg-gradient-to-b from-black/60 to-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden transition-colors ${isScrolled ? "text-primary" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center" aria-label="TheVastraHouse Home">
            <h1 className={`font-serif text-lg md:text-3xl tracking-widest font-bold transition-colors ${isScrolled ? "text-primary" : "text-white"}`}>
              THEVASTRAHOUSE
            </h1>
            <span className={`text-[8px] md:text-[10px] tracking-[0.3em] uppercase font-medium transition-colors ${isScrolled ? "text-secondary" : "text-white/80"}`}>
              Premium Ethnic Wear
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm uppercase tracking-widest transition-colors font-medium ${
                  isScrolled ? "text-foreground/80 hover:text-primary" : "text-white/90 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Icons (Desktop Only) */}
          <div className={`hidden md:flex items-center space-x-8 transition-colors ${isScrolled ? "text-primary" : "text-white"}`}>
            <button className="hover:text-secondary transition-colors" aria-label="Search products">
              <Search size={20} />
            </button>
            <Link href={isAuthenticated ? (user?.role === 'admin' ? "/admin" : "/dashboard") : "/login"} className="hover:text-secondary transition-colors">
              <User size={20} />
            </Link>
            <Link href="/wishlist" className="hover:text-secondary transition-colors relative" aria-label="Wishlist">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className={`absolute -top-2 -right-2 text-[10px] w-4 h-4 rounded-full flex items-center justify-center ${isScrolled ? "bg-secondary text-white" : "bg-white text-primary"}`}>
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hover:text-secondary transition-colors relative"
            >
              <ShoppingBag size={20} />
              {items.length > 0 && (
                <span className={`absolute -top-2 -right-2 text-[10px] w-4 h-4 rounded-full flex items-center justify-center ${isScrolled ? "bg-primary text-white" : "bg-white text-primary"}`}>
                  {items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              className="md:hidden fixed inset-0 top-[60px] bg-white z-[60] p-8"
            >
              <div className="flex flex-col space-y-8">
                {/* Search Bar in Menu */}
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input 
                    placeholder="Search our archive..."
                    className="w-full bg-cream/50 border-none p-4 pl-12 text-xs tracking-widest outline-none"
                  />
                </div>

                <div className="flex flex-col space-y-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-xl font-serif text-primary uppercase tracking-widest border-b border-accent pb-4"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                {/* Account & Shopping in Menu */}
                <div className="pt-8 grid grid-cols-2 gap-4">
                  <Link 
                    href={isAuthenticated ? "/dashboard" : "/login"}
                    className="flex flex-col items-center justify-center p-6 border border-accent bg-cream/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={24} className="text-primary mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Account</span>
                  </Link>
                  <button 
                    onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
                    className="flex flex-col items-center justify-center p-6 border border-accent bg-cream/20"
                  >
                    <div className="relative">
                      <ShoppingBag size={24} className="text-primary mb-2" />
                      {items.length > 0 && <span className="absolute -top-1 -right-1 bg-secondary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{items.length}</span>}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Cart</span>
                  </button>
                  <Link 
                    href="/wishlist"
                    className="flex flex-col items-center justify-center p-6 border border-accent bg-cream/20 col-span-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="relative">
                      <Heart size={24} className="text-primary mb-2" />
                      {wishlistItems.length > 0 && <span className="absolute -top-1 -right-1 bg-secondary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{wishlistItems.length}</span>}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Wishlist ({wishlistItems.length})</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
