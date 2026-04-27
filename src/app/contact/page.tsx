"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import API from "@/services/api";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const { data: cms } = useQuery({
    queryKey: ['cms-content', 'contact'],
    queryFn: async () => {
      const { data } = await API.get('/cms/content/contact');
      return data.content;
    }
  });

  const { data: settings } = useQuery({
    queryKey: ['public-settings'],
    queryFn: async () => {
      const { data } = await API.get('/public-settings');
      return data.settings;
    }
  });

  const inquiryMutation = useMutation({
    mutationFn: (data: any) => API.post('/cms/inquiries', data),
    onSuccess: () => {
      toast.success("Inquiry sent successfully. We'll get back to you soon!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: () => {
      toast.error("Failed to send inquiry. Please try again.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("Please fill in all required fields.");
    }
    inquiryMutation.mutate(formData);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PageHeader 
        title={cms?.title || "Concierge"} 
        subtitle={cms?.subtitle || "We are at your service for bespoke inquiries and personal styling."}
        image={cms?.headerImage || "https://images.unsplash.com/photo-1594187043532-97417b0ef535"}
      />
      
      <div className="py-24 bg-cream/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              {/* Contact Form */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 md:p-12 shadow-2xl border border-accent"
              >
                <h2 className="text-3xl font-serif text-primary mb-8 uppercase tracking-widest">Send an Inquiry</h2>
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="FULL NAME" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full border-b border-accent py-4 text-[10px] tracking-[0.2em] uppercase focus:border-primary outline-none transition-colors" 
                      />
                    </div>
                    <div className="relative">
                      <input 
                        type="email" 
                        placeholder="EMAIL ADDRESS" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full border-b border-accent py-4 text-[10px] tracking-[0.2em] uppercase focus:border-primary outline-none transition-colors" 
                      />
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="SUBJECT" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full border-b border-accent py-4 text-[10px] tracking-[0.2em] uppercase focus:border-primary outline-none transition-colors" 
                  />
                  <textarea 
                    placeholder="YOUR MESSAGE" 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full border-b border-accent py-4 text-[10px] tracking-[0.2em] uppercase focus:border-primary outline-none h-40 resize-none" 
                  />
                  <Button 
                    type="submit"
                    isLoading={inquiryMutation.isPending}
                    className="w-full py-5 text-xs tracking-[0.3em]"
                  >
                    Send Message
                  </Button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-12 py-8"
              >
                <div className="flex gap-8">
                  <div className="w-14 h-14 bg-primary text-white flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-3 text-primary">The Atelier</h3>
                    <p className="text-secondary text-sm leading-relaxed tracking-wide whitespace-pre-line">
                      {settings?.address || "123 Fashion Street, Sector 12,\nNew Delhi, India - 110001"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-8">
                  <div className="w-14 h-14 bg-primary text-white flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-3 text-primary">Direct Inquiries</h3>
                    <p className="text-secondary text-sm tracking-wide">{settings?.phone || "+91 98765 43210"}</p>
                  </div>
                </div>

                <div className="flex gap-8">
                  <div className="w-14 h-14 bg-primary text-white flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-3 text-primary">Email Support</h3>
                    <p className="text-secondary text-sm tracking-wide">{settings?.email || "concierge@thevastrahouse.com"}</p>
                  </div>
                </div>

                <div className="flex gap-8">
                  <div className="w-14 h-14 bg-primary text-white flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-3 text-primary">Atelier Hours</h3>
                    <p className="text-secondary text-sm tracking-wide">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                    <p className="text-secondary text-sm tracking-wide">Sunday: 11:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
