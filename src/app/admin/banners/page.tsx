"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import API from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon, Upload } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminBannersPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newBanner, setNewBanner] = useState({ title: "", subtitle: "", link: "", type: "hero", image: "" });

  const { data: banners, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      const { data } = await API.get('/cms/banners?admin=true');
      return data.banners;
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => API.post('/cms/banners', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      toast.success("Banner added successfully");
      setIsAdding(false);
      setNewBanner({ title: "", subtitle: "", link: "", type: "hero", image: "" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (confirm("Are you sure you want to remove this banner?")) {
        return API.delete(`/cms/banners/${id}`);
      }
      return Promise.reject("Cancelled");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      toast.success("Banner removed");
    }
  });

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewBanner({ ...newBanner, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) return <AdminLayout>Loading Banners...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-primary">HOMEPAGE BANNERS</h1>
        <Button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2">
          {isAdding ? "Cancel" : <><Plus size={18} /> Add Banner</>}
        </Button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-accent mb-8 max-w-2xl">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="text-xs uppercase tracking-widest font-bold mb-2 block">Banner Image</label>
              <div className="border-2 border-dashed border-accent rounded-lg p-8 text-center cursor-pointer hover:bg-accent/10 transition-colors relative">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                {newBanner.image ? (
                  <img src={newBanner.image} className="h-40 mx-auto object-cover rounded" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload size={32} className="text-secondary mb-2" />
                    <p className="text-xs text-secondary font-medium">Click or drag to upload high-res banner</p>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest font-bold mb-2 block">Title</label>
                <input 
                  type="text" 
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
                  className="w-full border border-accent p-3 text-sm focus:outline-none focus:border-primary" 
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-bold mb-2 block">Type</label>
                <select 
                  value={newBanner.type}
                  onChange={(e) => setNewBanner({...newBanner, type: e.target.value})}
                  className="w-full border border-accent p-3 text-sm focus:outline-none"
                >
                  <option value="hero">Hero Banner</option>
                  <option value="promotional">Promotional</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-bold mb-2 block">Redirect Link (URL)</label>
              <input 
                type="text" 
                value={newBanner.link}
                onChange={(e) => setNewBanner({...newBanner, link: e.target.value})}
                placeholder="/shop?category=..."
                className="w-full border border-accent p-3 text-sm focus:outline-none focus:border-primary" 
              />
            </div>
            <Button 
              onClick={() => createMutation.mutate(newBanner)} 
              isLoading={createMutation.isPending}
            >
              Upload & Publish Banner
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {banners?.map((banner: any) => (
          <div key={banner._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 group">
            <div className="relative h-56 bg-accent">
              <img src={banner.imageUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={() => deleteMutation.mutate(banner._id)}
                  className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-secondary">{banner.type}</p>
                <h3 className="text-sm font-serif text-primary mt-1">{banner.title}</h3>
              </div>
              <LinkIcon size={16} className="text-accent" />
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
