import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { cities, districts, amenitiesList } from "@/data/mock";
import { Home, Store, Building, BedDouble, Sofa, Hotel, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const types = [
  { id: "all", label: "الكل", icon: Building2 },
  { id: "apt", label: "شقة", icon: Building },
  { id: "room", label: "غرفة", icon: BedDouble },
  { id: "studio", label: "استوديو", icon: Sofa },
  { id: "house", label: "بيت", icon: Home },
  { id: "other", label: "سكن آخر", icon: Hotel },
];

const Filters = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("أسيوط");
  const [district, setDistrict] = useState("مصنع سيد");
  const [category, setCategory] = useState<"residential"|"commercial">("residential");
  const [type, setType] = useState("apt");
  const [beds, setBeds] = useState(3);
  const [baths, setBaths] = useState(2);
  const [amenities, setAmenities] = useState<string[]>(["حمام سباحة", "أمن 24س", "جراج"]);

  const toggleA = (a: string) => setAmenities(s => s.includes(a) ? s.filter(x=>x!==a) : [...s, a]);

  return (
    <div className="min-h-screen bg-background pb-28">
      <AppHeader title="الفلاتر المتقدمة" rightAction={
        <button className="text-sm text-accent font-bold">إعادة</button>
      } />

      <div className="px-4 pt-4 space-y-6">
        {/* المحافظة */}
        <Section title="المحافظة">
          <div className="flex gap-2 flex-wrap justify-end">
            {cities.slice(0,5).map(c => (
              <button key={c} onClick={() => setCity(c)} className={cn("chip", city === c ? "chip-active" : "chip-default")}>
                {c}
              </button>
            ))}
            <button className="chip border-2 border-dashed border-border bg-transparent text-muted-foreground">يضيف الأدمن باقي المحافظات</button>
          </div>
        </Section>

        {/* المدينة */}
        <Section title="المدينة">
          <div className="flex gap-2 flex-wrap justify-end">
            {districts.map(d => (
              <button key={d} onClick={() => setDistrict(d)} className={cn("chip text-sm", district === d ? "chip-active" : "chip-default")}>
                {d}
              </button>
            ))}
          </div>
        </Section>

        {/* التصنيف */}
        <Section title="التصنيف">
          <div className="flex gap-3">
            <button onClick={() => setCategory("residential")} className={cn("flex-1 h-14 rounded-full font-bold flex items-center justify-center gap-2 transition-base", category === "residential" ? "bg-primary text-primary-foreground shadow-elevated" : "bg-card shadow-card")}>
              <Home className="w-5 h-5" /> عقارات سكنية
            </button>
            <button onClick={() => setCategory("commercial")} className={cn("flex-1 h-14 rounded-full font-bold flex items-center justify-center gap-2 transition-base", category === "commercial" ? "bg-primary text-primary-foreground shadow-elevated" : "bg-card shadow-card")}>
              <Store className="w-5 h-5" /> عقارات تجارية
            </button>
          </div>
        </Section>

        {/* نوع العقار */}
        <Section title="نوع العقار (سكني)">
          <div className="grid grid-cols-3 gap-2">
            {types.map(t => (
              <button key={t.id} onClick={() => setType(t.id)} className={cn("h-12 rounded-full font-medium text-sm flex items-center justify-center gap-1.5 transition-base", type === t.id ? "bg-accent text-accent-foreground shadow-gold" : "bg-card shadow-card")}>
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>
        </Section>

        {/* غرف وحمامات */}
        <div className="grid grid-cols-2 gap-4">
          <Section title="غرف النوم">
            <NumberPills value={beds} onChange={setBeds} />
          </Section>
          <Section title="الحمامات">
            <NumberPills value={baths} onChange={setBaths} />
          </Section>
        </div>

        {/* المرافق */}
        <Section title="المرافق">
          <div className="flex gap-2 flex-wrap justify-end">
            {amenitiesList.map(a => (
              <button key={a} onClick={() => toggleA(a)} className={cn("chip text-sm", amenities.includes(a) ? "chip-accent" : "chip-default")}>
                {amenities.includes(a) ? "✓ " : ""}{a}
              </button>
            ))}
          </div>
        </Section>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-card border-t border-border p-4 z-40">
        <Button onClick={() => navigate("/search")} className="w-full h-14 text-base font-bold bg-gradient-primary text-primary-foreground rounded-2xl">
          عرض 124 نتيجة
        </Button>
      </div>
    </div>
  );
};

const Section = ({ title, children }: any) => (
  <div>
    <h3 className="text-sm font-bold mb-3 text-right">{title}</h3>
    {children}
  </div>
);

const NumberPills = ({ value, onChange }: { value: number; onChange: (n:number)=>void }) => (
  <div className="flex gap-1.5 justify-end" dir="ltr">
    {[1,2,3,"+4"].map((n, i) => {
      const v = typeof n === "number" ? n : 4;
      const active = value === v || (n === "+4" && value >= 4);
      return (
        <button key={i} onClick={() => onChange(v)} className={cn("w-10 h-10 rounded-full text-sm font-bold transition-base", active ? "bg-primary text-primary-foreground" : "bg-card shadow-card")}>
          {n}
        </button>
      );
    })}
  </div>
);

export default Filters;
