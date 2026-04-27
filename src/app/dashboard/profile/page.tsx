"use client";

import { useAuthStore } from "@/store/authStore";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { User, MapPin, Phone, Mail, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import API from "@/services/api";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  const handleUpdateProfile = async () => {
    try {
      await API.put("/auth/profile", profileData); // Need to create this endpoint
      updateUser(profileData);
      setIsEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <main className="min-h-screen bg-cream/20">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif text-primary mb-10 uppercase tracking-widest">Personal Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="md:col-span-1 bg-white p-8 border border-accent">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-6">
                <User size={32} />
              </div>
              {isEditing ? (
                <div className="space-y-4">
                  <input 
                    className="w-full border border-accent p-2 text-sm focus:outline-none" 
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  />
                  <input 
                    className="w-full border border-accent p-2 text-sm focus:outline-none" 
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  />
                  <Button size="sm" className="w-full" onClick={handleUpdateProfile}>Save</Button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-primary uppercase tracking-wider">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-xs text-secondary mt-2 flex items-center gap-2">
                    <Mail size={14} /> {user?.email}
                  </p>
                  <button onClick={() => setIsEditing(true)} className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary underline mt-4">Edit Profile</button>
                </>
              )}
            </div>

            {/* Address Book */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest font-bold text-primary flex items-center gap-2">
                  <MapPin size={16} /> Saved Addresses
                </h3>
                <Button variant="outline" size="sm" className="text-[10px]">
                  <Plus size={14} className="mr-1" /> Add New
                </Button>
              </div>

              {/* Placeholder for Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 border border-accent border-l-4 border-l-primary relative">
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase text-primary">Default</span>
                  <p className="text-sm font-bold mb-2">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-secondary leading-relaxed">
                    123, Luxury Suites, Sector 45<br />
                    Near Golden Temple, Amritsar<br />
                    Punjab - 143001
                  </p>
                  <p className="text-xs text-secondary mt-3 flex items-center gap-2 font-medium">
                    <Phone size={12} /> +91 98765 43210
                  </p>
                  <div className="flex gap-4 mt-6">
                    <button className="text-[10px] uppercase tracking-widest font-bold text-secondary hover:text-primary">Edit</button>
                    <button className="text-[10px] uppercase tracking-widest font-bold text-red-700">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
