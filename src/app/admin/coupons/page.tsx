"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import API from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Plus, Ticket, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminCoupons() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: 0, type: "percentage" });

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const { data } = await API.get('/coupon');
      return data.coupons;
    }
  });

  const addMutation = useMutation({
    mutationFn: (coupon: any) => API.post('/coupon', coupon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      setIsAdding(false);
      setNewCoupon({ code: "", discount: 0, type: "percentage" });
      toast.success("Coupon created!");
    }
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif text-primary uppercase tracking-widest">Coupons & Offers</h1>
          <p className="text-secondary text-[10px] uppercase tracking-widest font-bold mt-2">Manage your promotional archive</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus size={18} /> New Coupon
        </Button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-primary/20 mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input 
              placeholder="COUPON CODE"
              className="w-full border border-accent p-3 text-xs tracking-widest outline-none focus:border-primary uppercase"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
            />
            <input 
              type="number"
              placeholder="DISCOUNT VALUE"
              className="w-full border border-accent p-3 text-xs tracking-widest outline-none focus:border-primary"
              value={newCoupon.discount}
              onChange={(e) => setNewCoupon({...newCoupon, discount: Number(e.target.value)})}
            />
             <select 
              className="w-full border border-accent p-3 text-xs tracking-widest outline-none focus:border-primary"
              value={newCoupon.type}
              onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => addMutation.mutate(newCoupon)} isLoading={addMutation.isPending}>Save Coupon</Button>
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-32 bg-white animate-pulse border border-accent" />)
        ) : (
          coupons?.map((coupon: any) => (
            <div key={coupon._id} className="bg-white p-6 rounded-xl border border-accent flex justify-between items-center hover:border-primary transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Ticket size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-widest text-primary uppercase">{coupon.code}</h3>
                  <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                    {coupon.discount}{coupon.type === 'percentage' ? '%' : '₹'} OFF
                  </p>
                </div>
              </div>
              <button className="text-secondary hover:text-red-700 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
