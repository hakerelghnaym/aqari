import { PageShell, SectionCard } from "@/components/PageShell";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

const Invite = () => {
  const code = "AQARI-SARA-2026";
  return (
    <PageShell title="ادعُ صديقاً">
      <div className="bg-gradient-hero text-primary-foreground rounded-xl p-4 text-center shadow-elevated">
        <p className="text-xs opacity-80">احصل على ج 50 عن كل صديق ينضم</p>
        <p className="text-2xl font-extrabold mt-1">شارك واربح 🎁</p>
      </div>
      <SectionCard title="كود الإحالة الخاص بك">
        <div className="flex items-center gap-2">
          <button onClick={() => { navigator.clipboard.writeText(code); toast.success("تم النسخ"); }} className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center"><Copy className="w-4 h-4" /></button>
          <code className="flex-1 bg-muted rounded-lg h-10 flex items-center justify-center font-bold text-sm">{code}</code>
        </div>
      </SectionCard>
      <button className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2">
        <Share2 className="w-4 h-4" /> مشاركة الآن
      </button>
      <SectionCard title="إحصائياتك">
        <div className="grid grid-cols-3 text-center">
          <div><p className="text-xl font-extrabold text-accent">8</p><p className="text-[10px]">مدعوون</p></div>
          <div><p className="text-xl font-extrabold text-accent">5</p><p className="text-[10px]">مفعّلون</p></div>
          <div><p className="text-xl font-extrabold text-accent">ج 250</p><p className="text-[10px]">أرباحك</p></div>
        </div>
      </SectionCard>
    </PageShell>
  );
};

export default Invite;
