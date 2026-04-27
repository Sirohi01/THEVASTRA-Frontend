"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Package, Truck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import API from "@/services/api";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/order/${id}`);
        setOrder(data.order);
      } catch (err) {
        console.error(err);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (!order) return <div className="h-screen flex items-center justify-center">Loading confirmation...</div>;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-40 pb-20 container mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-green-600 mb-6"
        >
          <CheckCircle2 size={80} />
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Order Placed Successfully!</h1>
        <p className="text-secondary tracking-widest uppercase text-xs mb-12">
          Your order ID is: <span className="text-primary font-bold">{id}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-16">
          <div className="bg-cream p-8 border border-accent flex flex-col items-center">
            <Package className="text-primary mb-4" />
            <h3 className="text-xs uppercase tracking-widest font-bold mb-2">Processing</h3>
            <p className="text-xs text-secondary">Your order is being hand-packed with care.</p>
          </div>
          <div className="bg-cream p-8 border border-accent flex flex-col items-center">
            <Truck className="text-primary mb-4" />
            <h3 className="text-xs uppercase tracking-widest font-bold mb-2">Shipping Soon</h3>
            <p className="text-xs text-secondary">Expected delivery within 5-7 business days.</p>
          </div>
          <div className="bg-cream p-8 border border-accent flex flex-col items-center">
            <ArrowRight className="text-primary mb-4" />
            <h3 className="text-xs uppercase tracking-widest font-bold mb-2">Updates</h3>
            <p className="text-xs text-secondary">We'll email you with tracking updates.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={() => router.push('/shop')}>Continue Shopping</Button>
          <Button variant="outline" size="lg" onClick={() => router.push(`/dashboard/orders/${id}`)}>Track Order</Button>
        </div>
      </div>
    </main>
  );
}
