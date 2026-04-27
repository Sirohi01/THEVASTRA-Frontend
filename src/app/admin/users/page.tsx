"use client";

import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import API from "@/services/api";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function AdminUsers() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await API.get('/admin/users'); // I'll need to ensure this endpoint exists
      return data.users;
    }
  });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-primary uppercase tracking-widest">User Management</h1>
        <p className="text-secondary text-[10px] uppercase tracking-widest font-bold mt-2">Manage your luxury client base</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-accent overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream border-b border-accent">
            <tr>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-secondary">User</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-secondary">Role</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-secondary">Joined</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-secondary">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent">
            {isLoading ? (
              [1, 2, 3].map(i => <tr key={i} className="animate-pulse h-16 bg-white" />)
            ) : (
              users?.map((user: any) => (
                <tr key={user._id} className="hover:bg-cream/20 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-secondary">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.role === 'admin' ? 'bg-primary text-white' : 'bg-accent text-secondary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6 text-xs text-secondary">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-6">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                      Active
                    </span>
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
