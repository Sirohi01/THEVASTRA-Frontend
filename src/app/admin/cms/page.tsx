"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import API from "@/services/api";
import { Button } from "@/components/ui/Button";
import { FileText, Save, History } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminCMSPage() {
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState("about-us");
  const [content, setContent] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ['cms-content', selectedPage],
    queryFn: async () => {
      const { data } = await API.get(`/cms/content/${selectedPage}`);
      setContent(data.content?.body || "");
      return data.content;
    }
  });

  const updateMutation = useMutation({
    mutationFn: (newContent: string) => API.put(`/cms/content/${selectedPage}`, { body: newContent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-content'] });
      toast.success("Page content updated successfully");
    }
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-primary uppercase tracking-widest">Page Content Manager</h1>
        <div className="flex gap-2">
          {["about-us", "faq", "privacy-policy"].map(page => (
            <button
              key={page}
              onClick={() => setSelectedPage(page)}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border transition-colors ${selectedPage === page ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-accent hover:border-primary'}`}
            >
              {page.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-accent">
        <div className="flex items-center gap-3 mb-6 text-primary">
          <FileText size={20} />
          <h2 className="text-sm uppercase tracking-widest font-bold">Editing: {selectedPage}</h2>
        </div>

        {isLoading ? (
          <div className="h-64 bg-accent/20 animate-pulse rounded" />
        ) : (
          <div className="space-y-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 p-6 border border-accent focus:outline-none focus:border-primary font-mono text-sm leading-relaxed"
              placeholder="Enter page content in HTML or Markdown..."
            />
            <div className="flex justify-end gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <History size={18} /> Preview
              </Button>
              <Button 
                onClick={() => updateMutation.mutate(content)}
                isLoading={updateMutation.isPending}
                className="flex items-center gap-2"
              >
                <Save size={18} /> Save & Publish
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
