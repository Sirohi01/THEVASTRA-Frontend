"use client";

import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import API from "@/services/api";
import { motion } from "framer-motion";
import { Package, ChevronRight, Truck, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function MyOrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data } = await API.get('/order/myorders');
      return data.orders;
    }
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading your history...</div>;

  return (
    <main className="min-h-screen bg-cream/30">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-3xl font-serif text-primary mb-10 uppercase tracking-widest">My Orders</h1>
        
        <div className="space-y-6">
          {data?.length === 0 ? (
            <div className="bg-white p-12 text-center border border-accent">
              <Package size={48} className="mx-auto text-accent mb-4" />
              <p className="text-secondary uppercase tracking-widest text-sm">You haven't placed any orders yet.</p>
              <Link href="/shop" className="text-primary underline mt-4 inline-block text-xs uppercase tracking-widest">Start Shopping</Link>
            </div>
          ) : (
            data?.map((order: any) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={order._id} 
                className="bg-white border border-accent hover:border-primary transition-colors p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-primary text-white'}`}>
                        {order.orderStatus}
                      </span>
                      <span className="text-xs text-secondary">Ordered on {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      {order.orderItems.map((item: any, i: number) => (
                        <div key={i} className="flex-shrink-0 w-16 h-20 bg-accent relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end justify-between">
                    <div className="text-right">
                      <p className="text-xs text-secondary uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="text-xl font-serif text-primary">₹{order.totalPrice.toLocaleString()}</p>
                    </div>
                    <Link 
                      href={`/dashboard/orders/${order._id}`}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-primary hover:gap-4 transition-all mt-4 md:mt-0"
                    >
                      Track Order <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
