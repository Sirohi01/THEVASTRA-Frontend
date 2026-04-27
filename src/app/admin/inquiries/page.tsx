"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import API from "@/services/api";
import { Trash2, Mail, User, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminInquiries() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => {
      const { data } = await API.get('/cms/inquiries');
      return data.inquiries;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => API.delete(`/cms/inquiries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast.success("Inquiry removed");
    }
  });

  if (isLoading) return <AdminLayout><div className="animate-pulse h-96 bg-accent/20 rounded-xl" /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-primary uppercase tracking-widest">Customer Inquiries</h1>
          <p className="text-secondary text-[10px] uppercase tracking-widest font-bold mt-2">Manage messages from your clientele</p>
        </div>
        <div className="bg-primary/5 px-4 py-2 border border-primary/20 rounded-lg">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">{data?.length || 0} Total Messages</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data?.length === 0 ? (
          <div className="bg-white p-20 text-center border border-accent rounded-xl">
            <MessageSquare size={48} className="mx-auto text-accent mb-4" />
            <p className="text-secondary uppercase tracking-widest text-xs font-bold">No inquiries found yet.</p>
          </div>
        ) : (
          data?.map((inquiry: any) => (
            <div key={inquiry._id} className="bg-white border border-accent rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-primary uppercase tracking-widest">{inquiry.name}</h3>
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">{inquiry.email}</p>
                    </div>
                    <span className="ml-auto md:ml-4 px-3 py-1 bg-green-50 text-green-600 text-[8px] uppercase tracking-widest font-bold border border-green-200 rounded-full flex items-center gap-1">
                      <CheckCircle size={10} /> New
                    </span>
                  </div>
                  
                  <div className="bg-cream/20 p-6 rounded-lg border border-accent/50">
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2">Subject: {inquiry.subject || "No Subject"}</p>
                    <p className="text-sm text-primary leading-relaxed">{inquiry.message}</p>
                  </div>

                  <div className="flex items-center gap-6 text-[10px] text-secondary font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Clock size={12} /> Received: {new Date(inquiry.createdAt).toLocaleString()}</span>
                    <span className="flex items-center gap-2"><Mail size={12} /> {inquiry.email}</span>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 justify-end">
                  <a href={`mailto:${inquiry.email}`} className="flex-1 md:flex-none">
                    <button className="w-full bg-primary text-white p-3 text-[10px] uppercase tracking-widest font-bold hover:bg-secondary transition-all flex items-center justify-center gap-2">
                      <Mail size={14} /> Reply
                    </button>
                  </a>
                  <button 
                    onClick={() => { if(confirm('Are you sure?')) deleteMutation.mutate(inquiry._id) }}
                    className="flex-1 md:flex-none p-3 border border-red-200 text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
