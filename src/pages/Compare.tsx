import { PageShell } from "@/components/PageShell";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data/mock";
import { useState } from "react";
import { Scale, X } from "lucide-react";

const Compare = () => {
  const [selected, setSelected] = useState<string[]>([properties[0].id, properties[1].id]);
  const items = properties.filter(p => selected.includes(p.id));
  return (
    <PageShell title="مقارنة عقارات">
      <div className="bg-card rounded-xl p-3 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-bold">قارن حتى 4 عقارات</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {items.map(p => (
            <div key={p.id} className="bg-muted rounded-lg p-2 relative">
              <button onClick={() => setSelected(s => s.filter(x => x !== p.id))} className="absolute top-1 left-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                <X className="w-3 h-3" />
              </button>
              <img src={p.images[0]} className="w-full h-20 rounded object-cover mb-1.5" />
              <p className="text-[11px] font-bold text-right">{p.title}</p>
              <ul className="text-[10px] text-right space-y-0.5 mt-1.5">
                <li>السعر: ج {p.price}</li>
                <li>المساحة: {p.size} م²</li>
                <li>غرف: {p.beds} | حمام: {p.baths}</li>
                <li>التقييم: {p.rating} ⭐</li>
                <li>المدينة: {p.city}</li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-xs font-bold text-right mt-2">إضافة عقار للمقارنة</h3>
      <div className="space-y-3">
        {properties.filter(p => !selected.includes(p.id)).map(p => (
          <div key={p.id} onClick={() => setSelected(s => [...s, p.id].slice(0, 4))}>
            <PropertyCard property={p} />
          </div>
        ))}
      </div>
    </PageShell>
  );
};

export default Compare;
