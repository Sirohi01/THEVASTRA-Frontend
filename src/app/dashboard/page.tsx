"use client";

import { useAuthStore } from "@/store/authStore";
import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { Package, User, Heart, MapPin, ChevronRight, LogOut, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const { data: summary, isLoading } = useQuery({
    queryKey: ['profile-summary'],
    queryFn: async () => {
      const { data } = await API.get('/auth/profile/summary');
      return data.summary;
    },
    enabled: !!user
  });

  if (!user) {
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const stats = [
    { label: "My Orders", icon: Package, link: "/dashboard/orders", count: `${summary?.orderCount || 0} Pieces` },
    { label: "Wishlist", icon: Heart, link: "/wishlist", count: `${summary?.wishlistCount || 0} Items` },
    { label: "Addresses", icon: MapPin, link: "/dashboard/profile", count: `${summary?.addressCount || 0} Saved` },
  ];

  return (
    <main className="min-h-screen bg-cream/30">
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div>
                <h1 className="text-4xl font-serif text-primary uppercase tracking-tight">Welcome, {user.firstName}</h1>
                <p className="text-secondary text-[10px] uppercase tracking-widest font-bold mt-2">
                  Member since {new Date(user.createdAt || Date.now()).getFullYear()}
                </p>
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <button className="mt-4 bg-primary text-white px-6 py-2 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-secondary transition-all">
                      Go to Admin Panel
                    </button>
                  </Link>
                )}
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-red-700 hover:text-red-900 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Stats Grid */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <Link key={i} href={stat.link}>
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="bg-white p-8 border border-accent hover:border-primary transition-all group"
                    >
                      <stat.icon className="text-secondary group-hover:text-primary transition-colors mb-4" size={24} />
                      <p className="text-[10px] uppercase tracking-widest font-bold text-secondary mb-1">{stat.label}</p>
                      <p className="text-xl font-serif text-primary">
                        {isLoading ? "..." : stat.count}
                      </p>
                    </motion.div>
                  </Link>
                ))}

                {/* Recent Activity / Content */}
                <div className="md:col-span-3 bg-white p-8 border border-accent">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Recent Orders</h3>
                    <Link href="/dashboard/orders" className="text-[10px] uppercase tracking-widest font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1">
                      View All <ChevronRight size={14} />
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {summary?.recentOrders?.length === 0 ? (
                      <div className="py-12 text-center bg-gray-50 border border-dashed border-accent rounded-lg">
                        <ShoppingBag size={32} className="mx-auto text-accent mb-3" />
                        <p className="text-[10px] uppercase tracking-widest font-bold text-secondary">You haven't placed any orders yet.</p>
                        <Link href="/shop" className="text-primary text-[10px] uppercase font-bold mt-4 inline-block underline">Start Shopping</Link>
                      </div>
                    ) : (
                      summary?.recentOrders?.map((order: any) => (
                        <div key={order._id} className="flex items-center justify-between p-4 border border-accent/50 hover:bg-cream/20 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-16 bg-accent/20 overflow-hidden">
                              {order.items[0]?.product?.images[0]?.url && (
                                <img src={order.items[0].product.images[0].url} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-primary">#ORD-{order._id.slice(-6).toUpperCase()}</p>
                              <p className="text-[10px] text-secondary uppercase tracking-widest truncate max-w-[200px]">
                                {order.items[0]?.product?.name} {order.items.length > 1 ? `+ ${order.items.length - 1} more` : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-primary">₹{order.totalAmount.toLocaleString()}</p>
                            <p className={`text-[10px] uppercase tracking-widest font-bold ${
                              order.orderStatus === 'Delivered' ? 'text-green-600' : 'text-secondary'
                            }`}>
                              {order.orderStatus}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Account Shortcut Sidebar */}
              <div className="space-y-6">
                <div className="bg-primary text-white p-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Account Settings</h3>
                  <div className="space-y-4">
                    <Link href="/dashboard/profile" className="flex items-center justify-between group">
                      <span className="text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform underline-offset-4 group-hover:underline">Edit Profile</span>
                      <ChevronRight size={14} className="text-secondary" />
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center justify-between group">
                      <span className="text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform underline-offset-4 group-hover:underline">Address Book</span>
                      <ChevronRight size={14} className="text-secondary" />
                    </Link>
                    <Link href="/wishlist" className="flex items-center justify-between group">
                      <span className="text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform underline-offset-4 group-hover:underline">My Wishlist</span>
                      <ChevronRight size={14} className="text-secondary" />
                    </Link>
                  </div>
                </div>

                <div className="bg-white p-8 border border-accent">
                   <h3 className="text-[10px] uppercase tracking-widest font-bold text-primary mb-4">Concierge Support</h3>
                   <p className="text-xs text-secondary leading-relaxed mb-6">Need assistance with your order or personal styling?</p>
                   <Link href="/contact">
                    <button className="w-full py-3 border border-primary text-primary text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-all">Contact Us</button>
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
