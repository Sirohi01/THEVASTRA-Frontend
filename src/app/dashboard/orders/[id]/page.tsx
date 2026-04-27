"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { OrderTimeline } from "@/components/common/OrderTimeline";
import API from "@/services/api";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";

export default function OrderTrackingDetailsPage() {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-track', id],
    queryFn: async () => {
      const { data } = await API.get(`/order/${id}`);
      return data.order;
    }
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center">Locating your package...</div>;
  if (!order) return <div className="h-screen flex items-center justify-center">Order not found</div>;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <Link href="/dashboard/orders" className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-secondary hover:text-primary mb-8">
          <ArrowLeft size={14} /> Back to Orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Status & Timeline */}
          <div className="lg:col-span-8">
            <div className="bg-cream p-8 border border-accent mb-8">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h1 className="text-2xl font-serif text-primary uppercase tracking-widest">Order Tracking</h1>
                  <p className="text-xs text-secondary mt-1">ID: {order._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-secondary">Estimated Delivery</p>
                  <p className="text-sm font-bold text-primary">Within 3-5 Days</p>
                </div>
              </div>
              
              <OrderTimeline status={order.orderStatus} />
            </div>

            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-widest font-bold text-primary">Items in this shipment</h3>
              {order.orderItems.map((item: any, i: number) => (
                <div key={i} className="flex gap-6 p-4 border border-accent items-center">
                  <div className="w-20 h-24 bg-accent relative flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm uppercase tracking-wider font-medium">{item.name}</h4>
                    <p className="text-xs text-secondary mt-1">Qty: {item.quantity}</p>
                    {item.variant && (
                      <p className="text-[10px] text-secondary uppercase mt-1">Size: {item.variant.size} | Color: {item.variant.color}</p>
                    )}
                  </div>
                  <p className="text-sm font-bold text-primary">₹{item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-6 border border-accent">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <MapPin size={18} />
                <h3 className="text-xs uppercase tracking-widest font-bold">Shipping Address</h3>
              </div>
              <div className="text-sm text-secondary space-y-1">
                <p className="font-bold text-primary">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.pincode}</p>
                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="p-6 border border-accent bg-cream">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <CreditCard size={18} />
                <h3 className="text-xs uppercase tracking-widest font-bold">Payment Info</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary">Method</span>
                  <span className="font-bold uppercase tracking-widest text-[10px]">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Status</span>
                  <span className={`font-bold uppercase tracking-widest text-[10px] ${order.isPaid ? 'text-green-700' : 'text-red-700'}`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <div className="pt-4 border-t border-accent flex justify-between">
                  <span className="text-secondary">Total Paid</span>
                  <span className="font-bold text-primary">₹{order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
