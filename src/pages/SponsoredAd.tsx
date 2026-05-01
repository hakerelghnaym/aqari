import { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Megaphone, TrendingUp, Eye, MousePointer, Star, Target,
  BarChart3, Clock, CheckCircle2, Loader2, Calendar, Users,
  ArrowUpRight, Zap, Globe, Building2, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const DURATIONS = [
  { d: 3, p: 99, label: "3 أيام", desc: "تجريبي" },
  { d: 7, p: 199, label: "7 أيام", desc: "الأكثر شيوعاً", hot: true },
  { d: 14, p: 349, label: "14 يوم", desc: "نتائج قوية" },
  { d: 30, p: 599, label: "30 يوم", desc: "أقصى أداء" },
];

const PLACEMENTS = [
  { id: "home_top", label: "أعلى الرئيسية", icon: Star, reach: "15,000+", desc: "أعلى ظهوراً" },
  { id: "search_results", label: "نتائج البحث", icon: Target, reach: "8,000+", desc: "مستهدف" },
  { id: "similar_props", label: "عقارات مشابهة", icon: Building2, reach: "5,000+", desc: "مهتمون فعلاً" },
  { id: "all", label: "جميع المواضع", icon: Globe, reach: "25,000+", desc: "أوسع انتشار", premium: true },
];

const GOALS = [
  { id: "views", label: "زيادة المشاهدات", icon: Eye },
  { id: "calls", label: "زيادة الاتصالات", icon: MousePointer },
  { id: "both", label: "كليهما", icon: Zap },
];

const SponsoredAd = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"create" | "dashboard">("create");
  const [properties, setProperties] = useState<any[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [selectedProp, setSelectedProp] = useState<string>("");
  const [selectedDur, setSelectedDur] = useState(7);
  const [selectedPlacement, setSelectedPlacement] = useState("home_top");
  const [selectedGoal, setSelectedGoal] = useState("views");
  const [budget, setBudget] = useState("");
  const [activating, setActivating] = useState(false);
  const [activeAds, setActiveAds] = useState<any[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("properties").select("id, title, city, district, images, price")
      .eq("owner_id", user.id).eq("is_active", true)
      .then(({ data }) => { setProperties(data || []); if (data?.length) setSelectedProp(data[0].id); setLoadingProps(false); });

    loadAds();
  }, [user]);

  const loadAds = async () => {
    if (!user) return;
    setLoadingAds(true);
    const { data } = await supabase.from("sponsored_ads")
      .select("*, properties(title, city, images)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setActiveAds(data || []);
    setLoadingAds(false);
  };

  const durInfo = DURATIONS.find(d => d.d === selectedDur)!;
  const placement = PLACEMENTS.find(p => p.id === selectedPlacement)!;
  const totalPrice = durInfo.p + (selectedPlacement === "all" ? 200 : 0);

  const handleActivate = async () => {
    if (!user) { navigate("/login"); return; }
    if (!selectedProp) { toast.error("اختر عقاراً أولاً"); return; }
    setActivating(true);
    const now = new Date();
    const expires = new Date(now.getTime() + selectedDur * 86400000);
    const { error } = await supabase.from("sponsored_ads").insert({
      user_id: user.id,
      property_id: selectedProp,
      duration_days: selectedDur,
      placement: selectedPlacement,
      goal: selectedGoal,
      price: totalPrice,
      budget: budget ? Number(budget) : totalPrice,
      status: "active",
      started_at: now.toISOString(),
      expires_at: expires.toISOString(),
      impressions: 0,
      clicks: 0,
      calls: 0,
    });
    setActivating(false);
    if (error) { toast.error(error.message); return; }
    await supabase.from("properties").update({ is_sponsored: true, sponsored_until: expires.toISOString() }).eq("id", selectedProp);
    toast.success("🎉 تم تفعيل الإعلان الممول بنجاح!");
    setStep("dashboard");
    loadAds();
  };

  const getDaysLeft = (expiresAt: string) => {
    const left = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000);
    return left > 0 ? left : 0;
  };

  const getStatusColor = (status: string, expiresAt: string) => {
    if (status !== "active") return "text-muted-foreground bg-muted";
    return getDaysLeft(expiresAt) > 0 ? "text-success bg-success/10" : "text-destructive bg-destructive/10";
  };
  const getStatusLabel = (status: string, expiresAt: string) => {
    if (status !== "active") return "موقف";
    return getDaysLeft(expiresAt) > 0 ? "نشط" : "منتهي";
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader title="إعلان ممول" />

      {/* Header banner */}
      <div className="mx-4 mt-4 bg-gradient-primary text-primary-foreground rounded-2xl p-4 flex items-center gap-3">
        <Megaphone className="w-10 h-10 text-accent shrink-0" />
        <div className="flex-1 text-right">
          <h3 className="font-bold">روّج لعقارك — نظام إعلانات متكامل</h3>
          <p className="text-xs opacity-70 mt-0.5">استهدف المهتمين وزد مشاهداتك حتى 10x</p>
        </div>
        <TrendingUp className="w-6 h-6 text-accent shrink-0" />
      </div>

      {/* Tabs */}
      <div className="flex mx-4 mt-4 bg-muted rounded-xl p-1 gap-1">
        {[{ id: "create", label: "إنشاء إعلان" }, { id: "dashboard", label: "لوحة الإعلانات" }].map(t => (
          <button key={t.id} onClick={() => setStep(t.id as any)}
            className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-base",
              step === t.id ? "bg-card shadow-card text-foreground" : "text-muted-foreground")}>
            {t.label}
          </button>
        ))}
      </div>

      {step === "create" && (
        <div className="px-4 pt-4 space-y-5">
          {/* Step 1: Choose property */}
          <div>
            <h3 className="font-bold text-right mb-2 flex items-center gap-2 justify-end"><Building2 className="w-4 h-4" /> ١. اختر العقار</h3>
            {loadingProps ? (
              <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
            ) : properties.length === 0 ? (
              <div className="bg-card rounded-2xl p-4 text-center text-sm text-muted-foreground">
                لا توجد عقارات نشطة. <button className="text-primary font-bold" onClick={() => navigate("/add-property")}>أضف عقاراً</button>
              </div>
            ) : (
              <div className="space-y-2">
                {properties.map(p => (
                  <button key={p.id} onClick={() => setSelectedProp(p.id)}
                    className={cn("w-full p-3 rounded-2xl flex items-center gap-3 transition-base text-right",
                      selectedProp === p.id ? "bg-primary text-primary-foreground ring-2 ring-accent" : "bg-card shadow-card")}>
                    <img src={p.images?.[0] || "/placeholder.svg"} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-sm">{p.title}</p>
                      <p className="text-xs opacity-70">{p.district || p.city}</p>
                      <p className="text-sm font-extrabold mt-0.5">{Number(p.price).toLocaleString("en-US")} ج.م</p>
                    </div>
                    {selectedProp === p.id && <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Placement */}
          <div>
            <h3 className="font-bold text-right mb-2 flex items-center gap-2 justify-end"><Target className="w-4 h-4" /> ٢. موضع الإعلان</h3>
            <div className="grid grid-cols-2 gap-2">
              {PLACEMENTS.map(pl => {
                const PlIcon = pl.icon;
                return (
                  <button key={pl.id} onClick={() => setSelectedPlacement(pl.id)}
                    className={cn("p-3 rounded-2xl text-right transition-base relative",
                      selectedPlacement === pl.id ? "bg-primary text-primary-foreground ring-2 ring-accent" : "bg-card shadow-card")}>
                    {pl.premium && <span className="absolute top-2 left-2 text-[9px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full font-bold">+200 ج</span>}
                    <PlIcon className={cn("w-5 h-5 mb-1", selectedPlacement === pl.id ? "text-accent" : "text-muted-foreground")} />
                    <p className="text-xs font-bold">{pl.label}</p>
                    <p className={cn("text-[10px] mt-0.5", selectedPlacement === pl.id ? "text-primary-foreground/70" : "text-muted-foreground")}>{pl.desc}</p>
                    <p className={cn("text-[11px] font-extrabold mt-1", selectedPlacement === pl.id ? "text-accent" : "text-primary")}>
                      👁 {pl.reach} وصول
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Goal */}
          <div>
            <h3 className="font-bold text-right mb-2 flex items-center gap-2 justify-end"><Zap className="w-4 h-4" /> ٣. هدف الإعلان</h3>
            <div className="grid grid-cols-3 gap-2">
              {GOALS.map(g => {
                const GIcon = g.icon;
                return (
                  <button key={g.id} onClick={() => setSelectedGoal(g.id)}
                    className={cn("p-3 rounded-2xl text-center transition-base",
                      selectedGoal === g.id ? "bg-primary text-primary-foreground ring-2 ring-accent" : "bg-card shadow-card")}>
                    <GIcon className={cn("w-5 h-5 mx-auto mb-1", selectedGoal === g.id ? "text-accent" : "text-muted-foreground")} />
                    <p className="text-xs font-bold">{g.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Duration */}
          <div>
            <h3 className="font-bold text-right mb-2 flex items-center gap-2 justify-end"><Calendar className="w-4 h-4" /> ٤. المدة</h3>
            <div className="grid grid-cols-4 gap-2">
              {DURATIONS.map(({ d, p, label, desc, hot }) => (
                <button key={d} onClick={() => setSelectedDur(d)}
                  className={cn("p-3 rounded-2xl text-center transition-base relative",
                    selectedDur === d ? "bg-accent text-accent-foreground shadow-gold" : "bg-card shadow-card")}>
                  {hot && <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[8px] font-bold rounded-full flex items-center justify-center">🔥</span>}
                  <p className="text-sm font-extrabold">{label}</p>
                  <p className={cn("text-[9px] mt-0.5", selectedDur === d ? "text-accent-foreground/70" : "text-muted-foreground")}>{desc}</p>
                  <p className="text-xs font-bold mt-1">{p} ج.م</p>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-right text-sm mb-3">ملخص الإعلان</h4>
            {[
              { label: "الموضع", value: placement.label },
              { label: "الوصول المتوقع", value: placement.reach + " مشاهدة" },
              { label: "المدة", value: durInfo.label },
              { label: "السعر الأساسي", value: durInfo.p + " ج.م" },
              selectedPlacement === "all" ? { label: "رسوم المواضع المتعددة", value: "+200 ج.م" } : null,
            ].filter(Boolean).map(item => (
              <div key={item!.label} className="flex items-center justify-between">
                <span className="font-bold text-accent">{item!.value}</span>
                <span className="text-sm opacity-80">{item!.label}</span>
              </div>
            ))}
            <div className="border-t border-white/20 pt-2 flex items-center justify-between">
              <span className="text-xl font-extrabold text-accent">{totalPrice} ج.م</span>
              <span className="text-sm font-bold">الإجمالي</span>
            </div>
          </div>

          <Button disabled={activating || !selectedProp} onClick={handleActivate}
            className="w-full h-14 font-bold bg-gradient-accent text-accent-foreground rounded-2xl shadow-gold text-base">
            {activating ? <><Loader2 className="w-5 h-5 animate-spin ml-2" /> جارٍ التفعيل…</> : `تفعيل الإعلان — ${totalPrice} ج.م`}
          </Button>
        </div>
      )}

      {step === "dashboard" && (
        <div className="px-4 pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <button onClick={loadAds} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-right">إعلاناتي</h3>
          </div>

          {loadingAds ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : activeAds.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 text-center space-y-3 shadow-card">
              <Megaphone className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">لا توجد إعلانات بعد</p>
              <Button onClick={() => setStep("create")} className="bg-primary text-primary-foreground rounded-xl font-bold px-6">
                أنشئ إعلانك الأول
              </Button>
            </div>
          ) : (
            <>
              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Eye, label: "إجمالي المشاهدات", value: activeAds.reduce((s, a) => s + (a.impressions || 0), 0).toLocaleString("en-US") },
                  { icon: MousePointer, label: "إجمالي النقرات", value: activeAds.reduce((s, a) => s + (a.clicks || 0), 0).toLocaleString("en-US") },
                  { icon: Users, label: "إجمالي الاتصالات", value: activeAds.reduce((s, a) => s + (a.calls || 0), 0).toLocaleString("en-US") },
                ].map(stat => {
                  const StatIcon = stat.icon;
                  return (
                    <div key={stat.label} className="bg-card rounded-xl p-2.5 shadow-card text-center">
                      <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-1">
                        <StatIcon className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <p className="text-base font-extrabold leading-none">{stat.value}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Ad cards */}
              <div className="space-y-3">
                {activeAds.map(ad => {
                  const prop = (ad as any).properties;
                  const daysLeft = getDaysLeft(ad.expires_at);
                  const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : "0.0";
                  const statusColor = getStatusColor(ad.status, ad.expires_at);
                  const statusLabel = getStatusLabel(ad.status, ad.expires_at);
                  const placementLabel = PLACEMENTS.find(p => p.id === ad.placement)?.label || ad.placement;

                  return (
                    <div key={ad.id} className="bg-card rounded-2xl shadow-card overflow-hidden">
                      <div className="flex items-center gap-3 p-3">
                        <img src={prop?.images?.[0] || "/placeholder.svg"} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                        <div className="flex-1 text-right">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", statusColor)}>{statusLabel}</span>
                            <h4 className="font-bold text-sm">{prop?.title || "العقار"}</h4>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{placementLabel}</p>
                          <div className="flex items-center gap-1 justify-end mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[11px] text-muted-foreground">
                              {daysLeft > 0 ? `${daysLeft} يوم متبقي` : "انتهى"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-4 border-t border-border">
                        {[
                          { label: "مشاهدات", value: (ad.impressions || 0).toLocaleString("en-US"), icon: Eye },
                          { label: "نقرات", value: (ad.clicks || 0).toLocaleString("en-US"), icon: MousePointer },
                          { label: "CTR", value: ctr + "%", icon: ArrowUpRight },
                          { label: "اتصالات", value: (ad.calls || 0).toLocaleString("en-US"), icon: Users },
                        ].map((s, i) => {
                          const SIcon = s.icon;
                          return (
                            <div key={i} className="p-2 text-center border-l border-border last:border-l-0">
                              <SIcon className="w-3 h-3 text-muted-foreground mx-auto mb-0.5" />
                              <p className="text-sm font-extrabold leading-none">{s.value}</p>
                              <p className="text-[9px] text-muted-foreground mt-0.5">{s.label}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Progress bar */}
                      {ad.status === "active" && (
                        <div className="px-3 pb-3 pt-1">
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                            <span>{new Date(ad.expires_at).toLocaleDateString("ar-EG")}</span>
                            <span>انتهاء الإعلان</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                              style={{ width: `${Math.max(5, (daysLeft / ad.duration_days) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SponsoredAd;
