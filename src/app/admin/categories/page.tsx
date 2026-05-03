"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import API from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Trash2, Tag, X, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", description: "", image: "" });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await API.get('/catalog/categories');
      return data.categories;
    }
  });

  const upsertMutation = useMutation({
    mutationFn: (data: any) => editingCategory 
      ? API.put(`/catalog/categories/${editingCategory._id}`, data)
      : API.post('/catalog/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsAdding(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "", image: "" });
      toast.success(editingCategory ? "Category updated" : "Category added");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => API.delete(`/catalog/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success("Category removed");
    }
  });

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (cat: any) => {
    setEditingCategory(cat);
    setFormData({ 
      name: cat.name, 
      description: cat.description || "", 
      image: cat.image?.url || "" 
    });
    setIsAdding(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif text-primary uppercase tracking-widest">Collection Categories</h1>
          <p className="text-secondary text-[10px] uppercase tracking-widest font-bold mt-2">Manage your luxury product groupings</p>
        </div>
        <Button onClick={() => { setIsAdding(true); setEditingCategory(null); setFormData({ name: "", description: "", image: "" }); }} className="flex items-center gap-2">
          <Plus size={18} /> New Collection
        </Button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-xl border border-primary/20 mb-8 shadow-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              {editingCategory ? 'Edit Collection' : 'Create New Collection'}
            </h3>
            <button onClick={() => { setIsAdding(false); setEditingCategory(null); }} className="text-secondary hover:text-primary">
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-1">
                <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block">Collection Image</label>
                <div className="border-2 border-dashed border-accent rounded-lg p-4 text-center cursor-pointer hover:bg-cream/30 transition-all relative h-32 flex items-center justify-center">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                    {formData.image ? (
                        <div className="relative h-full w-full">
                            <img src={formData.image} className="h-full w-full object-contain rounded" alt="Preview" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Upload size={24} className="text-secondary mb-2" />
                            <p className="text-[8px] font-bold uppercase tracking-widest text-secondary">Upload Image</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block">Collection Name</label>
                  <input 
                    placeholder="e.g., Banarasi Archive"
                    className="w-full border border-accent p-3 text-sm outline-none focus:border-primary transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block">Brief Description</label>
                  <textarea 
                    placeholder="Describe the aesthetic..."
                    className="w-full border border-accent p-3 text-sm outline-none focus:border-primary transition-all h-20"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => upsertMutation.mutate(formData)} isLoading={upsertMutation.isPending}>
              {editingCategory ? 'Update Collection' : 'Save Collection'}
            </Button>
            <Button variant="outline" onClick={() => { setIsAdding(false); setEditingCategory(null); }}>Discard</Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-accent overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream border-b border-accent">
            <tr>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-secondary">Image</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-secondary">Collection Name</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-secondary">Description</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-secondary text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent">
            {isLoading ? (
              [1, 2, 3].map(i => <tr key={i} className="animate-pulse h-16 bg-white" />)
            ) : (
              categories?.map((cat: any) => (
                <tr key={cat._id} className="hover:bg-cream/20 transition-colors group">
                  <td className="p-6">
                    {cat.image?.url ? (
                        <div className="relative w-12 h-12 rounded overflow-hidden border border-accent">
                            <Image src={cat.image.url} alt={cat.name} fill className="object-cover" />
                        </div>
                    ) : (
                        <Tag className="text-secondary" size={18} />
                    )}
                  </td>
                  <td className="p-6 font-serif text-primary font-bold tracking-wide">{cat.name}</td>
                  <td className="p-6 text-xs text-secondary italic">"{cat.description || 'No description'}"</td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(cat)} className="text-secondary hover:text-primary transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => { if(confirm("Remove this collection?")) deleteMutation.mutate(cat._id); }}
                        className="text-secondary hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
