import { PageShell } from "@/components/PageShell";
import { properties } from "@/data/mock";
import { MapPin, Layers } from "lucide-react";

const MapPage = () => (
  <PageShell title="الخريطة" subtitle="استعرض العقارات على الخريطة">
    <div className="relative bg-gradient-to-br from-muted to-secondary rounded-xl h-[60vh] overflow-hidden shadow-card">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      {properties.map((p, i) => (
        <div key={p.id} className="absolute" style={{ top: `${20 + i * 18}%`, right: `${15 + i * 15}%` }}>
          <div className="relative">
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded-lg text-[10px] font-bold shadow-elevated whitespace-nowrap">ج {p.price}</div>
            <MapPin className="w-5 h-5 text-accent mx-auto -mt-0.5" />
          </div>
        </div>
      ))}
      <button className="absolute top-3 left-3 w-9 h-9 bg-card rounded-lg shadow-card flex items-center justify-center"><Layers className="w-4 h-4" /></button>
    </div>
    <div className="bg-card rounded-xl p-3 shadow-card text-right">
      <p className="text-xs font-bold">{properties.length} عقار في النطاق</p>
      <p className="text-[10px] text-muted-foreground">اضغط على أيقونة لعرض التفاصيل</p>
    </div>
  </PageShell>
);

export default MapPage;
