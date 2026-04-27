"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { toast } from "react-hot-toast";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back to TheVastraHouse!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 md:p-12 shadow-2xl border border-accent rounded-sm"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif text-primary uppercase tracking-widest mb-2">Sign In</h1>
            <p className="text-secondary text-xs uppercase tracking-widest">Access your premium archive</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={18} />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                required
                className="w-full bg-transparent border-b border-accent py-3 pl-10 text-xs tracking-widest focus:border-primary outline-none transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={18} />
              <input
                type="password"
                placeholder="PASSWORD"
                required
                className="w-full bg-transparent border-b border-accent py-3 pl-10 text-xs tracking-widest focus:border-primary outline-none transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-[10px] text-secondary hover:text-primary transition-colors tracking-widest uppercase font-bold">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-4 flex items-center justify-center gap-2"
              isLoading={isLoading}
            >
              Enter The House <ArrowRight size={16} />
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] text-secondary tracking-widest uppercase">
              New to TheVastraHouse?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
