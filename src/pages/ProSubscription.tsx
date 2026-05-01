import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Crown, Check, Zap, Star, Diamond } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type BillingCycle = "monthly" | "yearly";

const PLANS = [
  {
    id: "basic",
    title: "أساسي",
    icon: Zap,
    monthlyPrice: 100,
    yearlyPrice: 960, // ~20% off
    color: "bg-card",
    activeColor: "bg-primary text-primary-foreground",
    features: [
      "نشر حتى 5 عقارات",
      "ظهور في نتائج البحث",
      "دردشة مع المهتمين",
      "إحصائيات أساسية",
      "دعم عبر البريد",
    ],
  },
  {
    id: "pro",
    title: "برو",
    icon: Star,
    monthlyPrice: 300,
    yearlyPrice: 2880,
    color: "bg-card",
    activeColor: "bg-primary text-primary-foreground",
    badge: "الأكثر شيوعاً",
    features: [
      "نشر حتى 20 عقاراً",
      "ظهور مميز في البحث",
      "شارة Pro على ملفك",
      "إحصائيات تفصيلية",
      "منبه عقاري متقدم",
      "دعم فني مخصص",
      "إعلان ممول مجاني شهرياً",
    ],
  },
  {
    id: "elite",
    title: "إيليت",
    icon: Diamond,
    monthlyPrice: 600,
    yearlyPrice: 5760,
    color: "bg-card",
    activeColor: "bg-gradient-accent text-accent-foreground",
    badge: "للمحترفين",
    features: [
      "نشر عقارات غير محدود",
      "أولوية قصوى في البحث",
      "شارة Elite + توثيق",
      "لوحة تحليلات متكاملة",
      "إعلانات ممولة 3 شهرياً",
      "مدير حساب شخصي",
      "واجهة API للتكامل",
      "تقارير PDF شهرية",
    ],
  },
];

const ProSubscription = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [loading, setLoading] = useState(false);

  const plan = PLANS.find(p => p.id === selectedPlan)!;
  const price = cycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const cycleLabel = cycle === "monthly" ? "/ شهر" : "/ سنة";

  const handleActivate = async () => {
    if (!user) { toast.error("يرجى تسجيل الدخول أولاً"); return; }
    setLoading(true);
    await supabase.from("subscriptions").upsert({
      user_id: user.id,
      plan: selectedPlan,
      billing_cycle: cycle,
      price,
      started_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + (cycle === "monthly" ? 30 : 365) * 86400000).toISOString(),
      is_active: true,
    }, { onConflict: "user_id" });
    await supabase.from("profiles").update({ is_pro: true, pro_plan: selectedPlan }).eq("id", user.id);
    setLoading(false);
    toast.success(`تم تفعيل باقة ${plan.title} بنجاح! 🎉`);
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader title="اشتراك Pro" variant="primary" />
      <div className="bg-gradient-hero text-primary-foreground -mt-px px-5 pb-10 rounded-b-[2.5rem] text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-accent mx-auto flex items-center justify-center shadow-gold mb-3">
          <Crown className="w-10 h-10 text-accent-foreground" />
        </div>
        <h2 className="text-2xl font-extrabold">عقاري Pro</h2>
        <p className="text-sm opacity-80 mt-1">انطلق بأعمالك العقارية للمستوى التالي</p>

        {/* Billing toggle */}
        <div className="inline-flex mt-4 bg-white/10 rounded-full p-1 gap-1">
          {(["monthly","yearly"] as BillingCycle[]).map(c => (
            <button key={c} onClick={() => setCycle(c)}
              className={cn("px-4 py-1.5 rounded-full text-sm font-bold transition-base",
                cycle === c ? "bg-white text-primary" : "text-primary-foreground/80")}>
              {c === "monthly" ? "شهري" : "سنوي"}
              {c === "yearly" && <span className="mr-1 text-[10px] text-accent font-bold">وفر 20%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-10 space-y-3">
        {PLANS.map(p => {
          const isSelected = selectedPlan === p.id;
          const PlanIcon = p.icon;
          const thisPrice = cycle === "monthly" ? p.monthlyPrice : p.yearlyPrice;
          return (
            <button key={p.id} onClick={() => setSelectedPlan(p.id)}
              className={cn("w-full p-4 rounded-2xl text-right transition-base relative overflow-hidden",
                isSelected ? "bg-primary text-primary-foreground shadow-elevated ring-2 ring-accent" : "bg-card shadow-card")}>
              {p.badge && (
                <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {p.badge}
                </span>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                  isSelected ? "bg-accent/20" : "bg-muted")}>
                  <PlanIcon className={cn("w-5 h-5", isSelected ? "text-accent" : "text-muted-foreground")} />
                </div>
                <div>
                  <p className="font-extrabold text-base">{p.title}</p>
                  <p className={cn("text-2xl font-extrabold", isSelected ? "text-accent" : "text-primary")}>
                    {thisPrice} <span className="text-sm font-bold opacity-70">ج.م {cycleLabel}</span>
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-2 justify-end">
                    <span className={cn("text-[12px]", isSelected ? "text-primary-foreground/90" : "text-foreground")}>{f}</span>
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                      isSelected ? "bg-accent/20 text-accent" : "bg-success/15 text-success")}>
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </button>
          );
        })}

        <Button disabled={loading} onClick={handleActivate}
          className="w-full h-14 font-bold bg-gradient-accent text-accent-foreground rounded-2xl shadow-gold">
          {loading ? "جارٍ التفعيل…" : `تفعيل باقة ${plan.title} — ${price} ج.م ${cycleLabel}`}
        </Button>
      </div>
    </div>
  );
};

export default ProSubscription;
