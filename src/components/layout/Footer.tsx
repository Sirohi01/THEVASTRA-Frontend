"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Globe, Send, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";

export const Footer = () => {
  const { data } = useQuery({
    queryKey: ['public-settings'],
    queryFn: async () => {
      const { data } = await API.get('/public-settings');
      return data.settings;
    }
  });

  const settings = data || {
    footerDescription: "Elevating Indian heritage through premium handcrafted ethnic wear. Designed for the modern royalty.",
    address: "123 Fashion Street, Sector 12, New Delhi, India",
    phone: "+91 98765 43210",
    email: "concierge@thevastrahouse.com"
  };

  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl tracking-widest uppercase">{settings.siteName || "THEVASTRAHOUSE"}</h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              {settings.footerDescription}
            </p>
            <div className="flex space-x-4 text-secondary">
              <Globe size={20} className="cursor-pointer hover:text-white transition-colors" />
              <Send size={20} className="cursor-pointer hover:text-white transition-colors" />
              <MessageCircle size={20} className="cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Collections</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Pieces</Link></li>
              <li><Link href="/collections" className="hover:text-white transition-colors">The Silk Archive</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-white transition-colors">Just Landed</Link></li>
              <li><Link href="/offers" className="hover:text-white transition-colors">Exclusive Offers</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Support</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/about-us" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Inquiries</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-secondary flex-shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-secondary" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-secondary" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-widest text-white/40">
            © 2026 {settings.siteName?.toUpperCase() || "THEVASTRAHOUSE"}. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-white/40 font-bold">
            <span>SECURE PAYMENTS</span>
            <span>WORLDWIDE SHIPPING</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
