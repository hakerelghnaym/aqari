import { Link, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import {
  Settings, ShieldCheck, Heart, Calendar, Eye, Bell, Building2,
  Bell as BellAlert, Crown, MessageSquare, Megaphone, Wallet as WalletIcon,
  ChevronLeft, ArrowDownToLine, ArrowUpFromLine, LogOut, Briefcase,
  HelpCircle, FileText, Info, Gift, Star, Map, Scale, Languages,
  Moon, Share2, Lock
} from "lucide-react";
import { avatars } from "@/data/mock";
import { toast } from "sonner";

const items = [
  { to: "/bookings", label: "حجوزاتي", icon: Calendar, count: 0 },
  { to: "/recently-viewed", label: "شوهد مؤخراً", icon: Eye },
  { to: "/my-properties", label: "إدارة العقارات", icon: Building2 },
  { to: "/property-alert", label: "منبه عقاري", icon: BellAlert },
  { to: "/pro", label: "تفعيل اشتراك Pro", icon: Crown, accent: true },
  { to: "/sponsored", label: "تفعيل إعلان ممول", icon: Megaphone },
  { to: "/companies", label: "تعاقد شركات", icon: Briefcase, accent: true },
  { to: "/chats", label: "الدردشة", icon: MessageSquare },
  { to: "/compare", label: "مقارنة عقارات", icon: Scale },
  { to: "/map", label: "الخريطة", icon: Map },
  { to: "/invite", label: "ادعُ صديقاً", icon: Share2 },
  { to: "/language", label: "اللغة", icon: Languages },
  { to: "/appearance", label: "المظهر", icon: Moon },
  { to: "/privacy", label: "الخصوصية والأمان", icon: Lock },
  { to: "/help", label: "المساعدة والدعم", icon: HelpCircle },
  { to: "/terms", label: "الشروط والأحكام", icon: FileText },
  { to: "/about", label: "عن التطبيق", icon: Info },
];

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Account = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    toast.success("تم تسجيل الخروج بنجاح");
    setTimeout(() => navigate("/welcome"), 400);
  };
  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="bg-gradient-hero text-primary-foreground rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
        <div className="relative">
          <AppHeader title="حسابي" variant="primary" showBack={false}
            rightAction={<button onClick={() => navigate("/edit-account")} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"><Settings className="w-4 h-4" /></button>}
          />
          <div className="px-4 pb-4 flex items-center gap-3" dir="rtl">
            <div className="relative">
              <img src={profile?.avatar_url || avatars.sara} alt="profile" className="w-14 h-14 rounded-2xl object-cover ring-2 ring-accent/30" />
            </div>
            <div className="text-right">
              <h2 className="text-base font-extrabold">{profile?.display_name || user?.email?.split("@")[0] || "ضيف"}</h2>
              <p className="text-[11px] text-primary-foreground/70">{user?.email || "—"}</p>
              {profile?.is_verified && (
                <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-accent/20 backdrop-blur rounded-full text-[10px]">
                  <ShieldCheck className="w-3 h-3 text-accent" /> حساب موثق
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Wallet (lowered, sits just below the dark hero) */}
      <div className="px-3 mt-3 relative z-10">
        <div className="bg-card rounded-2xl p-3.5 shadow-elevated">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-muted-foreground">الرصيد المتاح</span>
            <div className="flex items-center gap-1.5 text-sm font-bold">
              <span>المحفظة</span>
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <WalletIcon className="w-4 h-4 text-accent-foreground" />
              </div>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-primary text-right mb-2.5">8,250 <span className="text-sm">ج</span></p>
          <div className="flex gap-2">
            <Link to="/withdraw" className="flex-1 h-10 rounded-lg bg-secondary text-secondary-foreground font-bold text-sm flex items-center justify-center gap-1.5">
              <ArrowUpFromLine className="w-4 h-4" /> سحب
            </Link>
            <Link to="/deposit" className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-1.5">
              <ArrowDownToLine className="w-4 h-4" /> إيداع
            </Link>
          </div>
        </div>
      </div>

      {/* Menu — RTL: icon+label on the RIGHT, chevron+count on the LEFT */}
      <div className="px-3 mt-3 space-y-1.5">
        {items.map(it => (
          <Link key={it.to} to={it.to} className="bg-card rounded-xl p-3 shadow-card flex items-center justify-between hover:shadow-elevated transition-base">
            {/* Right side: icon + label (start in RTL) */}
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${it.accent ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"}`}>
                <it.icon className="w-4 h-4" />
              </div>
              <span className={`text-sm font-medium ${it.accent ? "text-accent font-bold" : ""}`}>{it.label}</span>
            </div>
            {/* Left side: badge + chevron */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              {it.count !== undefined && (
                <span className="text-[11px] font-bold bg-muted px-1.5 py-0.5 rounded-full min-w-[20px] text-center">{it.count}</span>
              )}
              <ChevronLeft className="w-4 h-4" />
            </div>
          </Link>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-destructive/10 text-destructive rounded-xl p-3.5 flex items-center justify-center gap-2 font-bold text-sm hover:bg-destructive/15 transition-base"
        >
          <LogOut className="w-4 h-4" /> تسجيل الخروج
        </button>

        <p className="text-center text-[11px] text-muted-foreground pt-2">الإصدار 1.0.0 — عقاري ©</p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Account;
