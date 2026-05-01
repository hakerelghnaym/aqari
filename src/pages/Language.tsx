import { PageShell, SectionCard } from "@/components/PageShell";
import { Check } from "lucide-react";
import { useState } from "react";

const langs = [
  { id: "ar", name: "العربية", native: "العربية" },
  { id: "en", name: "English", native: "الإنجليزية" },
  { id: "fr", name: "Français", native: "الفرنسية" },
];

const Language = () => {
  const [v, setV] = useState("ar");
  return (
    <PageShell title="اللغة">
      <SectionCard>
        {langs.map(l => (
          <button key={l.id} onClick={() => setV(l.id)} className="w-full flex items-center justify-between py-2 border-b border-border last:border-0">
            {v === l.id && <Check className="w-4 h-4 text-accent" />}
            <div className="text-right ms-auto">
              <p className="text-sm font-bold">{l.name}</p>
              <p className="text-[10px] text-muted-foreground">{l.native}</p>
            </div>
          </button>
        ))}
      </SectionCard>
    </PageShell>
  );
};

export default Language;
