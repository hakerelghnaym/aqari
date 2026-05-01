import { PageShell, SectionCard } from "@/components/PageShell";
import { Gift, Star, Users, Trophy } from "lucide-react";

const Rewards = () => (
  <PageShell title="نقاط ومكافآت">
    <div className="bg-gradient-hero text-primary-foreground rounded-xl p-4 shadow-elevated text-center">
      <Trophy className="w-8 h-8 text-accent mx-auto mb-1" />
      <p className="text-[11px] opacity-80">رصيد نقاطك</p>
      <p className="text-3xl font-extrabold">2,480</p>
      <p className="text-[10px] opacity-70">= ج 248 عند الاستبدال</p>
    </div>
    <SectionCard title="طرق ربح النقاط">
      {[
        { icon: Star, t: "تقييم عقار", p: "+10" },
        { icon: Users, t: "دعوة صديق", p: "+200" },
        { icon: Gift, t: "إتمام أول حجز", p: "+500" },
      ].map(it => (
        <div key={it.t} className="flex items-center justify-between py-2 border-b border-border last:border-0">
          <span className="text-accent font-bold text-xs">{it.p}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs">{it.t}</span>
            <it.icon className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      ))}
    </SectionCard>
    <button className="w-full h-11 rounded-lg bg-accent text-accent-foreground font-bold text-sm">استبدال النقاط</button>
  </PageShell>
);

export default Rewards;
