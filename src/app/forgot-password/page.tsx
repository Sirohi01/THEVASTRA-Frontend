"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import API from "@/services/api";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      toast.success("Recovery link sent to your email!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-40 pb-20 flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif text-primary uppercase tracking-widest mb-4">Recover Account</h1>
            <p className="text-secondary text-xs uppercase tracking-widest leading-loose">
              Enter your registered email to receive a recovery link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">Email Address</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-accent p-4 text-xs uppercase tracking-widest focus:outline-none focus:border-primary transition-all"
                placeholder="YOUR@EMAIL.COM"
              />
            </div>

            <Button className="w-full py-4" type="submit" isLoading={loading}>
              Send Recovery Link
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary hover:text-primary transition-colors">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
