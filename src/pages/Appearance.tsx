import { PageShell, SectionCard } from "@/components/PageShell";
import { Sun, Moon, Monitor } from "lucide-react";
import { useState } from "react";

const Appearance = () => {
  const [m, setM] = useState("light");
  const items = [
    { id: "light", l: "فاتح", icon: Sun },
    { id: "dark", l: "داكن", icon: Moon },
    { id: "system", l: "النظام", icon: Monitor },
  ];
  return (
    <PageShell title="المظهر">
      <SectionCard>
        <div className="grid grid-cols-3 gap-2">
          {items.map(it => (
            <button key={it.id} onClick={() => setM(it.id)} className={`p-3 rounded-lg flex flex-col items-center gap-1.5 ${m === it.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              <it.icon className="w-5 h-5" />
              <span className="text-xs font-bold">{it.l}</span>
            </button>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="حجم الخط">
        <input type="range" min="80" max="120" defaultValue="100" className="w-full accent-accent" />
        <div className="flex justify-between text-[10px] text-muted-foreground"><span>صغير</span><span>عادي</span><span>كبير</span></div>
      </SectionCard>
    </PageShell>
  );
};

export default Appearance;
