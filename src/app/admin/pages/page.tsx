"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import API from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Save, FileText, Layout, Upload } from "lucide-react";
import { toast } from "react-hot-toast";

const EDITABLE_PAGES = [
  { key: 'shop', name: 'Shop / Catalog' },
  { key: 'about-us', name: 'About Our Story' },
  { key: 'contact', name: 'Contact Information' },
  { key: 'shipping-returns', name: 'Shipping & Returns' },
  { key: 'privacy-policy', name: 'Privacy Policy' },
];

export default function AdminPagesCMS() {
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState(EDITABLE_PAGES[0].key);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    headerImage: ""
  });

  const { isLoading } = useQuery({
    queryKey: ['cms-content', selectedPage],
    queryFn: async () => {
      try {
        const { data } = await API.get(`/cms/content/${selectedPage}`);
        setFormData({
          title: data.content.title,
          subtitle: data.content.subtitle || "",
          content: data.content.content,
          headerImage: data.content.headerImage || ""
        });
        return data.content;
      } catch (e) {
        setFormData({ title: "", subtitle: "", content: "", headerImage: "" });
        return null;
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => API.post('/cms/content', { ...data, key: selectedPage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-content'] });
      toast.success("Page content updated successfully");
    }
  });

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, headerImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-primary uppercase tracking-widest">Page CMS Manager</h1>
        <p className="text-secondary text-[10px] uppercase tracking-widest font-bold mt-2">Customize your brand story across the site</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Selector */}
        <div className="lg:col-span-1 space-y-2">
          {EDITABLE_PAGES.map((page) => (
            <button
              key={page.key}
              onClick={() => setSelectedPage(page.key)}
              className={`w-full text-left p-4 text-[10px] uppercase tracking-widest font-bold transition-all border ${
                selectedPage === page.key 
                  ? "bg-primary text-white border-primary" 
                  : "bg-white text-secondary border-accent hover:border-primary"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText size={14} />
                {page.name}
              </div>
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3 bg-white p-8 border border-accent rounded-xl shadow-sm">
          <div className="space-y-8">
            {/* Header Banner Section */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block text-secondary flex items-center gap-2">
                <Layout size={14} /> Page Header Banner
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="border-2 border-dashed border-accent rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-cream/30 transition-all relative overflow-hidden"
                >
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                  {formData.headerImage ? (
                    <img src={formData.headerImage} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload size={24} className="text-secondary mb-2" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Upload Header Shot</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest mb-1 block">Banner Title</label>
                    <input 
                      className="w-full border border-accent p-3 text-sm focus:border-primary outline-none"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. About Our Heritage"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest mb-1 block">Banner Subtitle</label>
                    <input 
                      className="w-full border border-accent p-3 text-sm focus:border-primary outline-none"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                      placeholder="Optional short tagline..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Section */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block text-secondary">Main Page Content</label>
              <textarea 
                className="w-full border border-accent p-6 text-sm focus:border-primary outline-none h-96 resize-none leading-relaxed"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Write your page content here..."
              />
              <p className="mt-2 text-[10px] text-secondary italic">Note: Content supports plain text. For rich layouts, we'll format this into sections.</p>
            </div>

            <Button 
              onClick={() => updateMutation.mutate(formData)}
              className="w-full py-4 flex items-center justify-center gap-2"
              isLoading={updateMutation.isPending}
            >
              <Save size={18} /> Update Page Configuration
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
