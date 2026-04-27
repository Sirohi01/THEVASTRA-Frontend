"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { toast } from "react-hot-toast";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore((state) => state.register);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-24 pb-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 md:p-12 shadow-2xl border border-accent rounded-sm"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif text-primary uppercase tracking-widest mb-2">Register</h1>
            <p className="text-secondary text-xs uppercase tracking-widest">Join the royal heritage</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="FIRST NAME"
                  required
                  className="w-full bg-transparent border-b border-accent py-3 text-xs tracking-widest focus:border-primary outline-none transition-colors"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="LAST NAME"
                  required
                  className="w-full bg-transparent border-b border-accent py-3 text-xs tracking-widest focus:border-primary outline-none transition-colors"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-accent" size={16} />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                required
                className="w-full bg-transparent border-b border-accent py-3 pl-8 text-xs tracking-widest focus:border-primary outline-none transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-accent" size={16} />
              <input
                type="password"
                placeholder="PASSWORD"
                required
                className="w-full bg-transparent border-b border-accent py-3 pl-8 text-xs tracking-widest focus:border-primary outline-none transition-colors"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full py-4 flex items-center justify-center gap-2"
                isLoading={isLoading}
              >
                Join The House <ArrowRight size={16} />
              </Button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] text-secondary tracking-widest uppercase">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
