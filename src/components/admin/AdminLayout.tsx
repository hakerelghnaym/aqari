import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, Calendar, Wallet, Megaphone,
  Crown, Briefcase, Flag, Bell, Settings, LogOut, MessageSquare,
  ShieldCheck, BarChart3, FileText, Menu, X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navItems = [
  { to: "/admin", label: "نظرة عامة", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "المستخدمون", icon: Users },
  { to: "/admin/properties", label: "العقارات", icon: Building2 },
  { to: "/admin/bookings", label: "الحجوزات", icon: Calendar },
  { to: "/admin/payments", label: "المدفوعات", icon: Wallet },
  { to: "/admin/ads", label: "الإعلانات الممولة", icon: Megaphone },
  { to: "/admin/pro", label: "اشتراكات Pro", icon: Crown },
  { to: "/admin/companies", label: "تعاقد الشركات", icon: Briefcase },
  { to: "/admin/reports", label: "البلاغات", icon: Flag },
  { to: "/admin/notifications", label: "الإشعارات", icon: Bell },
  { to: "/admin/messages", label: "الرسائل", icon: MessageSquare },
  { to: "/admin/verifications", label: "طلبات التوثيق", icon: ShieldCheck },
  { to: "/admin/analytics", label: "الإحصائيات", icon: BarChart3 },
  { to: "/admin/content", label: "المحتوى والصفحات", icon: FileText },
  { to: "/admin/settings", label: "الإعدادات", icon: Settings },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const logout = () => { toast.success("تم تسجيل خروج الأدمن"); navigate("/admin/login"); };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => setOpen(true)} className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="text-[11px] opacity-70">عقاري</p>
            <p className="text-sm font-extrabold">لوحة الأدمن</p>
          </div>
          <button onClick={logout} className="w-9 h-9 rounded-lg bg-destructive/30 flex items-center justify-center">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="pb-20">
        <Outlet />
      </main>

      {/* Drawer */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setOpen(false)} />
          <aside className="fixed top-0 right-0 bottom-0 w-72 bg-primary text-primary-foreground z-50 p-3 overflow-y-auto animate-fade-in-up">
            <div className="flex items-center justify-between mb-4 px-1">
              <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
              <p className="text-sm font-extrabold">القائمة</p>
            </div>
            <nav className="space-y-1">
              {navItems.map(it => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition-base",
                    isActive ? "bg-accent text-accent-foreground font-bold" : "hover:bg-white/10"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <it.icon className="w-4 h-4" />
                    <span>{it.label}</span>
                  </span>
                </NavLink>
              ))}
            </nav>
          </aside>
        </>
      )}
    </div>
  );
};

export default AdminLayout;
