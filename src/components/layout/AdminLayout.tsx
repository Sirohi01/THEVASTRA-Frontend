"use client";
import { useEffect } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Users, 
  Image as ImageIcon, 
  Ticket, 
  Settings,
  LogOut,
  Layout,
  MessageSquare
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Products", icon: Package, href: "/admin/products" },
  { name: "Categories", icon: Layers, href: "/admin/categories" },
  { name: "Orders", icon: ShoppingBag, href: "/admin/orders" },
  { name: "Pages", icon: Layout, href: "/admin/pages" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Banners", icon: ImageIcon, href: "/admin/banners" },
  { name: "Coupons", icon: Ticket, href: "/admin/coupons" },
  { name: "Inquiries", icon: MessageSquare, href: "/admin/inquiries" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.replace('/login');
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-serif tracking-widest border-b border-white/20 pb-4">VASTRA ADMIN</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? "bg-secondary text-white" : "hover:bg-white/10"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/70 hover:text-white w-full transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">
            {menuItems.find(i => i.href === pathname)?.name || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Administrator</span>
            <div className="w-8 h-8 rounded-full bg-secondary" />
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
