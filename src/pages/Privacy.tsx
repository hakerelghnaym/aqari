import { PageShell, SectionCard } from "@/components/PageShell";
import { Lock, Smartphone, Eye, Trash2 } from "lucide-react";

const Privacy = () => (
  <PageShell title="الخصوصية والأمان">
    <SectionCard>
      {[
        { icon: Lock, t: "تغيير كلمة المرور" },
        { icon: Smartphone, t: "الأجهزة المسجلة" },
        { icon: Eye, t: "التحكم بالظهور" },
      ].map(i => (
        <button key={i.t} className="w-full flex items-center justify-between py-2.5 border-b border-border last:border-0">
          <span className="text-muted-foreground">›</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold">{i.t}</span>
            <i.icon className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>
      ))}
    </SectionCard>
    <SectionCard title="إعدادات الخصوصية">
      {["إظهار رقم الهاتف للجمهور", "السماح بالرسائل من الجميع", "ظهور حالة الاتصال"].map(s => (
        <label key={s} className="flex items-center justify-between py-2 border-b border-border last:border-0">
          <input type="checkbox" defaultChecked className="accent-primary" />
          <span className="text-xs">{s}</span>
        </label>
      ))}
    </SectionCard>
    <button className="w-full h-11 rounded-lg bg-destructive/10 text-destructive font-bold text-sm flex items-center justify-center gap-2">
      <Trash2 className="w-4 h-4" /> حذف الحساب نهائياً
    </button>
  </PageShell>
);

export default Privacy;
