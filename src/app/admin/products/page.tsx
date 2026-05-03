"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import API from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Plus, Edit, Trash2, Search, X, Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    basePrice: 0,
    image: "",
    isFeatured: false,
    isNewArrival: false,
    variants: [{ size: "", color: "", stock: 0, sku: "", price: 0 }]
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data } = await API.get('/catalog/products?limit=50');
      return data.products;
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await API.get('/catalog/categories');
      return data.categories;
    }
  });

  const upsertMutation = useMutation({
    mutationFn: (data: any) => editingProduct 
      ? API.put(`/catalog/products/${editingProduct._id}`, data)
      : API.post('/catalog/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success(editingProduct ? "Product updated" : "Product added");
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => API.delete(`/catalog/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success("Product deleted successfully");
    }
  });

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: "", color: "", stock: 0, sku: "", price: formData.basePrice }]
    });
  };

  const removeVariant = (index: number) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const openModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category?._id || "",
        basePrice: product.basePrice,
        image: product.images[0]?.url || "",
        isFeatured: product.isFeatured || false,
        isNewArrival: product.isNewArrival || false,
        variants: product.variants?.length > 0 ? product.variants : [{ size: "Standard", color: "Default", stock: 0, sku: "", price: product.basePrice }]
      });
    } else {
      setEditingProduct(null);
      setFormData({ 
        name: "", 
        description: "", 
        category: "", 
        basePrice: 0, 
        image: "", 
        isFeatured: false,
        isNewArrival: false,
        variants: [{ size: "", color: "", stock: 0, sku: "", price: 0 }] 
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  if (isLoading) return <AdminLayout>Loading Luxury Archive...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search our pieces..." 
            className="w-full pl-10 pr-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus size={18} /> Add New Piece
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-accent overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream border-b border-accent">
            <tr>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-secondary">Product</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-secondary">Category</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-secondary">Base Price</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-secondary">Stock</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-secondary text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent">
            {products?.map((product: any) => {
              const totalStock = product.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
              return (
                <tr key={product._id} className="hover:bg-cream/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-16 bg-accent/20 rounded overflow-hidden">
                        {product.images[0]?.url && <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{product.name}</p>
                        <p className="text-[10px] text-secondary uppercase tracking-widest">
                          {product.variants?.length || 0} Variants
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-secondary uppercase tracking-widest">{product.category?.name}</td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">₹{product.basePrice.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${totalStock > 5 ? 'text-green-700' : 'text-red-700'}`}>
                      {totalStock} Total Left
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(product)} className="p-2 text-secondary hover:text-primary transition-colors">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => { if(confirm("Are you sure?")) deleteMutation.mutate(product._id); }}
                        className="p-2 text-secondary hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-4xl p-8 rounded-xl shadow-2xl relative overflow-y-auto max-h-[90vh]"
          >
            <button onClick={closeModal} className="absolute right-6 top-6 text-secondary hover:text-primary">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-serif text-primary uppercase tracking-widest mb-8">
              {editingProduct ? 'Edit Masterpiece' : 'Add New Masterpiece'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-4 space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">Product Name</label>
                  <input 
                    className="w-full border border-accent p-3 text-sm focus:border-primary outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">Category</label>
                  <select 
                    className="w-full border border-accent p-3 text-sm focus:border-primary outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Collection</option>
                    {categories?.map((cat: any) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">Base Price (₹)</label>
                      <input 
                        type="number"
                        className="w-full border border-accent p-3 text-sm focus:border-primary outline-none"
                        value={formData.basePrice}
                        onChange={(e) => setFormData({...formData, basePrice: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-6 py-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-primary"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">Mark as Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-primary"
                        checked={formData.isNewArrival}
                        onChange={(e) => setFormData({...formData, isNewArrival: e.target.checked})}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">New Arrival</span>
                    </label>
                  </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">Piece Imagery</label>
                  <div className="border-2 border-dashed border-accent rounded-lg p-6 text-center cursor-pointer hover:bg-cream/30 transition-all relative">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                    {formData.image ? (
                      <div className="relative h-32 w-full">
                        <img src={formData.image} className="h-full w-full object-contain rounded" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload size={24} className="text-secondary mb-2" />
                        <p className="text-[8px] font-bold uppercase tracking-widest text-secondary">Upload Shot</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">Description</label>
                  <textarea 
                    className="w-full border border-accent p-3 text-sm focus:border-primary outline-none h-24 resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="md:col-span-8 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] block">Variants (Sizes & Colors)</label>
                    <div className="flex gap-2">
                      <div className="flex gap-1 border-r border-accent pr-2 mr-2">
                        {['S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                          <button 
                            key={sz}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                variants: [...formData.variants, { size: sz, color: "", stock: 0, sku: "", price: formData.basePrice }]
                              });
                            }}
                            className="px-2 py-1 bg-cream text-[8px] font-bold border border-accent hover:border-primary transition-colors"
                          >
                            + {sz}
                          </button>
                        ))}
                      </div>
                      <button onClick={addVariant} className="text-[10px] uppercase tracking-widest font-bold text-primary flex items-center gap-1 hover:underline">
                        <Plus size={12} /> Custom Variant
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                    {formData.variants.map((variant, index) => (
                      <div key={index} className="grid grid-cols-5 gap-2 p-3 bg-cream/30 border border-accent rounded-lg relative group/variant">
                        <div>
                          <label className="text-[8px] font-bold uppercase mb-1 block">Size</label>
                          <input 
                            placeholder="S, M, L..."
                            className="w-full border border-accent p-2 text-xs outline-none focus:border-primary"
                            value={variant.size}
                            onChange={(e) => updateVariant(index, 'size', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-bold uppercase mb-1 block">Color</label>
                          <input 
                            placeholder="Red, Gold..."
                            className="w-full border border-accent p-2 text-xs outline-none focus:border-primary"
                            value={variant.color}
                            onChange={(e) => updateVariant(index, 'color', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-bold uppercase mb-1 block">Price</label>
                          <input 
                            type="number"
                            className="w-full border border-accent p-2 text-xs outline-none focus:border-primary"
                            value={variant.price}
                            onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-bold uppercase mb-1 block">Stock</label>
                          <input 
                            type="number"
                            className="w-full border border-accent p-2 text-xs outline-none focus:border-primary"
                            value={variant.stock}
                            onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                          />
                        </div>
                        <div className="relative">
                          <label className="text-[8px] font-bold uppercase mb-1 block">SKU</label>
                          <input 
                            className="w-full border border-accent p-2 text-xs outline-none focus:border-primary uppercase"
                            value={variant.sku}
                            onChange={(e) => updateVariant(index, 'sku', e.target.value.toUpperCase())}
                          />
                          {formData.variants.length > 1 && (
                            <button 
                              onClick={() => removeVariant(index)}
                              className="absolute -right-1 -top-1 bg-red-100 text-red-600 rounded-full p-0.5 opacity-0 group-hover/variant:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => upsertMutation.mutate(formData)} 
                  className="w-full py-4 text-xs tracking-widest mt-6"
                  isLoading={upsertMutation.isPending}
                >
                  {editingProduct ? 'Save Changes' : 'Publish Masterpiece'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
