"use client";

import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";
import API from "@/services/api";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from "recharts";

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const { data } = await API.get('/admin/stats');
      return data;
    }
  });

  const { data: pendingOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-pending-orders'],
    queryFn: async () => {
      const { data } = await API.get('/order/all', { params: { orderStatus: 'Processing' } });
      return data.orders;
    }
  });

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const chartData = dashboardData?.salesByMonth?.map((item: any) => ({
    name: monthNames[item._id - 1],
    revenue: item.revenue
  })) || [];

  const stats = dashboardData?.stats;

  const summaryCards = [
    { label: "Total Revenue", value: `₹${stats?.totalRevenue?.toLocaleString() || '0'}`, icon: IndianRupee, trend: "+12.5%", positive: true },
    { label: "Total Orders", value: stats?.totalOrders || '0', icon: ShoppingBag, trend: "+8.2%", positive: true },
    { label: "New Customers", value: stats?.newCustomers || '0', icon: Users, trend: "+5.4%", positive: true },
    { label: "Pending Shipments", value: stats?.pendingOrders || '0', icon: Clock, trend: "-1.2%", positive: false },
  ];

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-2xl font-serif text-primary uppercase tracking-widest">Business Analytics</h1>
        <p className="text-secondary text-[10px] uppercase tracking-widest font-bold mt-2">Live overview of your ethnic empire</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-accent">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-cream rounded-lg text-primary">
                <card.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${card.positive ? 'text-green-600' : 'text-red-600'}`}>
                {card.trend} {card.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-secondary mb-1">{card.label}</p>
            <h3 className="text-2xl font-serif text-primary">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-accent">
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-8">Revenue Forecast</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3E5D8" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#8B4513' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#8B4513' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#FFF8F0' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5D5C5', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#540B0E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Sidepanel */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-accent">
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-8">Pending Shipments</h3>
          <div className="space-y-6">
            {pendingOrders?.length === 0 ? (
              <div className="py-12 text-center text-secondary text-[10px] uppercase font-bold tracking-widest">
                All clear! No pending orders.
              </div>
            ) : (
              pendingOrders?.slice(0, 5).map((order: any) => (
                <div key={order._id} className="flex items-center justify-between pb-4 border-b border-accent/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center text-primary">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">ORD-{order._id.slice(-4).toUpperCase()}</p>
                      <p className="text-[10px] text-secondary uppercase tracking-widest">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-primary">₹{order.totalPrice.toLocaleString()}</p>
                    <p className="text-[10px] text-primary/60 uppercase tracking-widest">{order.orderStatus}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/admin/orders">
            <button className="w-full mt-8 py-3 bg-primary text-white text-[10px] uppercase tracking-widest font-bold hover:bg-secondary transition-all">
              Manage All Orders
            </button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
