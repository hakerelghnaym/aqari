import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, MapPin, ChevronDown, Moon, Sun, Loader2, Home as HomeIcon, Store, Tag } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/hero-villa.jpg";
import avatarFallback from "@/assets/avatar-1.jpg";
import { ASSIUT_DISTRICTS, RESIDENTIAL_TYPES, COMMERCIAL_TYPES } from "@/lib/aqari-data";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BASE_TOTAL = 100329;

const Index = () => {
  const { dark, toggle } = useTheme();
  const { user } = useAuth();

  const [city, setCity] = useState("أسيوط");
  const [district, setDistrict] = useState("الكل");
  // merged: "residential" | "commercial"
  const [category, setCategory] = useState<"residential" | "commercial">("residential");
  // merged: "sale" | "rent"
  const [status, setStatus] = useState<"sale" | "rent">("sale");
  const [activeType, setActiveType] = useState<string>("الكل");
  const [locationName, setLocationName] = useState<string>(() => localStorage.getItem("aqari_location_name") || "جارٍ تحديد الموقع…");
  const [properties, setProperties] = useState<any[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [totalCount, setTotalCount] = useState(BASE_TOTAL);

  // Geolocation — ask every time home opens, but save result.
  // If user taps location name, re-ask.
  const requestLocation = () => {
    if (!navigator.geolocation) { setLocationName("غير متاح"); return; }
    setLocationName("جارٍ تحديد الموقع…");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=ar`);
          const d = await r.json();
          const name = d.address?.city || d.address?.town || d.address?.village || d.address?.state || "موقعك";
          setLocationName(name);
          localStorage.setItem("aqari_location_name", name);
          localStorage.setItem("aqari_location_lat", String(pos.coords.latitude));
          localStorage.setItem("aqari_location_lng", String(pos.coords.longitude));
        } catch { setLocationName("موقعك الحالي"); }
      },
      () => setLocationName("لم يُسمح بالموقع"),
      { timeout: 8000 }
    );
  };

  useEffect(() => { requestLocation(); }, []);

  // Fetch real count of properties + base
  useEffect(() => {
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("is_active", true)
      .then(({ count }) => { if (count !== null) setTotalCount(BASE_TOTAL + count); });
  }, []);

  // Fetch properties live
  useEffect(() => {
    const fetchProps = async () => {
      setLoadingProps(true);
      let q = supabase
        .from("properties")
        .select("*, profiles!properties_owner_id_fkey(display_name, avatar_url, is_verified, rating)")
        .eq("is_active", true)
        .eq("category", category)
        .eq("status", status)
        .order("created_at", { ascending: false });
      if (district !== "الكل") q = q.eq("district", district);
      if (activeType !== "الكل") q = q.eq("type", activeType);
      const { data, error } = await q.limit(50);
      if (!error) setProperties(data || []);
      setLoadingProps(false);
    };
    fetchProps();
    const channel = supabase.channel("properties-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "properties" }, fetchProps)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [category, status, activeType, district]);

  const types = useMemo(
    () => ["الكل", ...(category === "residential" ? RESIDENTIAL_TYPES : COMMERCIAL_TYPES)],
    [category]
  );

  useEffect(() => { setActiveType("الكل"); }, [category]);

  const formattedTotal = totalCount.toLocaleString("en-US");

  return (
    <div className="min-h-screen bg-background pb-28">
      <section className="relative h-[58vh] min-h-[460px] overflow-hidden text-primary-foreground">
        <img src={heroImg} alt="عقار مميز" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-primary/85" />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-4">
          <Link to="/notifications" className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
          </Link>

          <div className="text-center">
            <p className="text-[11px] text-primary-foreground/70">الموقع</p>
            {/* Tap to re-request location */}
            <button onClick={requestLocation} className="text-sm font-bold flex items-center gap-1 justify-center">
              <MapPin className="w-3.5 h-3.5 text-accent" /> {locationName}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={toggle} className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center" aria-label="تبديل المظهر">
              {dark ? <Sun className="w-4 h-4 text-accent" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to={user ? "/account" : "/login"}>
              <img src={avatarFallback} alt="حسابي" className="w-10 h-10 rounded-full object-cover ring-2 ring-accent/40" />
            </Link>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 px-5 mt-4 text-right">
          <p className="text-[13px] text-primary-foreground/80 mb-1">اكتشف</p>
          <h1 className="text-3xl font-extrabold leading-tight">
            عقار أحلامك<br/>ينتظرك
          </h1>
        </div>

        {/* Floating glass form */}
        <div className="absolute bottom-0 inset-x-0 z-10 px-4 pb-4">
          <div className="flex justify-center mb-2">
            <span className="inline-flex items-center gap-1.5 bg-success/20 backdrop-blur text-white border border-success/40 px-3 py-1 rounded-full text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-success" /> {formattedTotal} عقاراً متاح للبيع والإيجار
            </span>
          </div>

          <div className="bg-white/12 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 space-y-2">
            {/* City / District */}
            <div className="grid grid-cols-2 gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="bg-white/10 hover:bg-white/15 transition-base rounded-xl px-3 py-2 text-right">
                  <p className="text-[10px] text-primary-foreground/70">المحافظة</p>
                  <div className="flex items-center justify-between">
                    <ChevronDown className="w-3.5 h-3.5 text-primary-foreground/70" />
                    <span className="text-[12px] font-bold">{city}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {["أسيوط", "القاهرة", "الجيزة", "الإسكندرية"].map(c => (
                    <DropdownMenuItem key={c} onClick={() => setCity(c)}>{c}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="bg-white/10 hover:bg-white/15 transition-base rounded-xl px-3 py-2 text-right">
                  <p className="text-[10px] text-primary-foreground/70">المدينة</p>
                  <div className="flex items-center justify-between">
                    <ChevronDown className="w-3.5 h-3.5 text-primary-foreground/70" />
                    <span className="text-[12px] font-bold truncate">{district}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
                  <DropdownMenuItem onClick={() => setDistrict("الكل")}>الكل</DropdownMenuItem>
                  {ASSIUT_DISTRICTS.map(d => (
                    <DropdownMenuItem key={d} onClick={() => setDistrict(d)}>{d}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Row 1: merged category toggle (position of old "تجارية") + merged status toggle (position of old "سكنية") */}
            <div className="grid grid-cols-2 gap-2">
              {/* Merged category button — cycles residential ↔ commercial */}
              <button
                onClick={() => setCategory(c => c === "residential" ? "commercial" : "residential")}
                className={cn(
                  "h-10 rounded-full flex items-center justify-center gap-1.5 text-[12px] font-bold transition-base",
                  category === "commercial" ? "bg-accent text-accent-foreground shadow-gold" : "bg-white/10 text-primary-foreground"
                )}
              >
                {category === "residential" ? <HomeIcon className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                {category === "residential" ? "عقارات سكنية" : "عقارات تجارية"}
              </button>

              {/* Merged status button — cycles للبيع ↔ للإيجار */}
              <button
                onClick={() => setStatus(s => s === "sale" ? "rent" : "sale")}
                className={cn(
                  "h-10 rounded-full flex items-center justify-center gap-1.5 text-[12px] font-bold transition-base",
                  status === "rent" ? "bg-primary-foreground text-primary" : "bg-white/10 text-primary-foreground"
                )}
              >
                <Tag className="w-4 h-4" />
                {status === "sale" ? "للبيع" : "للإيجار"}
              </button>
            </div>

            {/* Types row (scrollable) */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pt-0.5">
              {types.map(t => {
                const active = activeType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={cn(
                      "shrink-0 inline-flex items-center px-3 h-8 rounded-full text-[11px] font-bold transition-base whitespace-nowrap",
                      active ? "bg-card text-foreground" : "bg-white/10 text-primary-foreground"
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-4 pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-muted-foreground">{properties.length} عقار</span>
          <h3 className="text-sm font-extrabold">
            {category === "residential" ? "عقارات سكنية" : "عقارات تجارية"} • {status === "sale" ? "للبيع" : "للإيجار"}
          </h3>
        </div>

        {loadingProps ? (
          <div className="py-10 flex justify-center text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            لا توجد عقارات تطابق بحثك حالياً.
            <div className="mt-2">
              <Link to="/add-property" className="text-accent font-bold">أضف أول عقار</Link>
            </div>
          </div>
        ) : (
          <div className={cn(
            "-mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2",
            properties.length === 1 && "justify-center"
          )}>
            {properties.map(p => (
              <PropertyCard key={p.id} property={p} variant="carousel" />
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </div>
  );
};

export default Index;
