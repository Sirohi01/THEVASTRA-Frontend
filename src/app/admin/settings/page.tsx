"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import API from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Settings as SettingsIcon, Save, MapPin, Phone, Mail, Globe } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    siteName: "",
    footerDescription: "",
    address: "",
    phone: "",
    email: "",
    socialLinks: { instagram: "", facebook: "", twitter: "" }
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data } = await API.get('/admin/settings');
      return data.settings;
    }
  });

  useEffect(() => {
    if (data) setSettings(data);
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (newSettings: any) => API.put('/admin/settings', newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      toast.success("Site settings updated!");
    }
  });

  if (isLoading) return <AdminLayout>Loading Settings...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-primary uppercase tracking-widest">Site Configurations</h1>
        <Button 
          onClick={() => updateMutation.mutate(settings)}
          isLoading={updateMutation.isPending}
          className="flex items-center gap-2"
        >
          <Save size={18} /> Update All Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branding & Contact */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-accent space-y-6">
          <div className="flex items-center gap-3 mb-4 text-primary">
            <SettingsIcon size={20} />
            <h2 className="text-sm uppercase tracking-widest font-bold">General Branding</h2>
          </div>
          
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">Site Name</label>
            <input 
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              className="w-full border border-accent p-3 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">Footer Bio</label>
            <textarea 
              value={settings.footerDescription}
              onChange={(e) => setSettings({...settings, footerDescription: e.target.value})}
              className="w-full border border-accent p-3 text-sm focus:outline-none focus:border-primary h-24"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-accent space-y-6">
          <div className="flex items-center gap-3 mb-4 text-primary">
            <MapPin size={20} />
            <h2 className="text-sm uppercase tracking-widest font-bold">Store Location & Contact</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">Physical Address</label>
              <input 
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
                className="w-full border border-accent p-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">Support Phone</label>
                <input 
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="w-full border border-accent p-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">Support Email</label>
                <input 
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className="w-full border border-accent p-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
