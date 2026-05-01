import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Home as HomeIcon, Store, Tag, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ASSIUT_DISTRICTS, RESIDENTIAL_TYPES, COMMERCIAL_TYPES } from "@/lib/aqari-data";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const PRICE_OPTIONS = [
  { label: "أي سعر", min: 0, max: 0 },
  { label: "أقل من 500 ألف", min: 0, max: 500000 },
  { label: "500 ألف – مليون", min: 500000, max: 1000000 },
  { label: "1 – 3 مليون", min: 1000000, max: 3000000 },
  { label: "أكثر من 3 مليون", min: 3000000, max: 0 },
];

const PropertyAlert = () => {
  const { user } = useAuth();
  const [active, setActive] = useState(true);
  const [category, setCategory] = useState<"residential" | "commercial">("residential");
  const [status, setStatus] = useState<"sale" | "rent">("sale");
  const [district, setDistrict] = useState("الكل");
  const [activeType, setActiveType] = useState("الكل");
  const [priceRange, setPriceRange] = useState(PRICE_OPTIONS[0]);
  const [saving, setSaving] = useState(false);

  const types = ["الكل", ...(category === "residential" ? RESIDENTIAL_TYPES : COMMERCIAL_TYPES)];

  useEffect(() => { setActiveType("الكل"); }, [category]);

  const handleSave = async () => {
    setSaving(true);
    if (user) {
      await supabase.from("property_alerts").upsert({
        user_id: user.id,
        category,
        status,
        district: district === "الكل" ? null : district,
        property_type: activeType === "الكل" ? null : activeType,
        min_price: priceRange.min || null,
        max_price: priceRange.max || null,
        is_active: active,
        notify_hours: 1,
        notify_count: 4,
      }, { onConflict: "user_id" });
    }
    setSaving(false);
    toast.success("تم حفظ المنبه — ستصلك إشعارات كل ساعة (4 مرات)");
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader title="منبه عقاري" />
      <div className="px-4 pt-4 space-y-4">
        {/* Status banner */}
        <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-5 flex items-center gap-4">
          <Bell className="w-10 h-10 text-accent" />
          <div className="flex-1 text-right">
            <h3 className="font-bold">{active ? "المنبه نشط" : "المنبه متوقف"}</h3>
            <p className="text-xs opacity-70">سيتم إشعارك عند توفر عقار يطابق معاييرك • 4 مرات / ساعة</p>
          </div>
          <Switch checked={active} onCheckedChange={setActive} />
        </div>

        {/* Filters */}
        <div className="bg-card rounded-2xl p-4 shadow-card space-y-4">
          <h3 className="font-bold text-right text-sm">حدد مواصفات العقار المطلوب</h3>

          {/* Category toggle */}
          <div>
            <p className="text-xs text-muted-foreground text-right mb-2">نوع العقار</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setCategory("residential")}
                className={cn("h-10 rounded-full flex items-center justify-center gap-1.5 text-[13px] font-bold transition-base",
                  category === "residential" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                <HomeIcon className="w-4 h-4" /> سكني
              </button>
              <button onClick={() => setCategory("commercial")}
                className={cn("h-10 rounded-full flex items-center justify-center gap-1.5 text-[13px] font-bold transition-base",
                  category === "commercial" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                <Store className="w-4 h-4" /> تجاري
              </button>
            </div>
          </div>

          {/* Status toggle */}
          <div>
            <p className="text-xs text-muted-foreground text-right mb-2">الغرض</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setStatus("sale")}
                className={cn("h-10 rounded-full flex items-center justify-center gap-1.5 text-[13px] font-bold transition-base",
                  status === "sale" ? "bg-accent text-accent-foreground shadow-gold" : "bg-muted text-foreground")}>
                <Tag className="w-4 h-4" /> للبيع
              </button>
              <button onClick={() => setStatus("rent")}
                className={cn("h-10 rounded-full flex items-center justify-center gap-1.5 text-[13px] font-bold transition-base",
                  status === "rent" ? "bg-accent text-accent-foreground shadow-gold" : "bg-muted text-foreground")}>
                <Tag className="w-4 h-4" /> للإيجار
              </button>
            </div>
          </div>

          {/* District */}
          <div>
            <p className="text-xs text-muted-foreground text-right mb-2">المنطقة</p>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full bg-muted rounded-xl px-4 py-3 text-right flex items-center justify-between">
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                <span className="font-bold text-sm">{district}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-72 overflow-y-auto">
                <DropdownMenuItem onClick={() => setDistrict("الكل")}>الكل</DropdownMenuItem>
                {ASSIUT_DISTRICTS.map(d => (
                  <DropdownMenuItem key={d} onClick={() => setDistrict(d)}>{d}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Property types scrollable chips */}
          <div>
            <p className="text-xs text-muted-foreground text-right mb-2">تصنيف العقار</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {types.map(t => (
                <button key={t} onClick={() => setActiveType(t)}
                  className={cn("shrink-0 px-3 h-8 rounded-full text-[12px] font-bold transition-base whitespace-nowrap",
                    activeType === t ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <p className="text-xs text-muted-foreground text-right mb-2">نطاق السعر</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {PRICE_OPTIONS.map(opt => (
                <button key={opt.label} onClick={() => setPriceRange(opt)}
                  className={cn("shrink-0 px-3 h-8 rounded-full text-[11px] font-bold transition-base whitespace-nowrap",
                    priceRange.label === opt.label ? "bg-accent text-accent-foreground shadow-gold" : "bg-muted text-foreground")}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button disabled={saving} onClick={handleSave}
          className="w-full h-14 font-bold bg-gradient-primary text-primary-foreground rounded-2xl">
          {saving ? "جارٍ الحفظ…" : "حفظ المنبه"}
        </Button>
      </div>
    </div>
  );
};

export default PropertyAlert;
