import { PageShell, SectionCard } from "@/components/PageShell";
import { Briefcase, Building, Phone, Mail, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const packages = [
  { name: "Premium", price: "ج 4,999/شهر", features: ["50 عقار مميز", "إعلانات ممولة 5", "حساب موثق", "دعم 24/7"] },
  { name: "Business", price: "ج 9,999/شهر", features: ["200 عقار مميز", "إعلانات ممولة 20", "حساب موثق", "مدير حساب مخصص", "تقارير تفصيلية"], best: true },
  { name: "Enterprise", price: "حسب الاتفاق", features: ["عقارات غير محدودة", "إعلانات غير محدودة", "API مخصص", "تكامل CRM", "فريق مبيعات"] },
];

const Companies = () => {
  const [pkg, setPkg] = useState("Business");
  return (
    <PageShell title="تعاقد شركات" subtitle="باقات للمطورين العقاريين">
      <SectionCard>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center"><Briefcase className="w-4 h-4" /></div>
          <div className="flex-1 text-right">
            <h3 className="text-sm font-bold">انضم لشبكة الشركات الموثقة</h3>
            <p className="text-[10px] text-muted-foreground">حلول متكاملة لشركات التطوير العقاري والوسطاء</p>
          </div>
        </div>
      </SectionCard>

      <div className="space-y-2">
        {packages.map(p => (
          <button
            key={p.name}
            onClick={() => setPkg(p.name)}
            className={`w-full text-right rounded-xl p-3 transition-base ${pkg === p.name ? "bg-primary text-primary-foreground" : "bg-card"} ${p.best ? "ring-2 ring-accent" : ""}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              {p.best && <span className="text-[9px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full font-bold">الأكثر طلباً</span>}
              <div>
                <span className="font-extrabold text-sm">{p.name}</span>
                <p className="text-xs opacity-80">{p.price}</p>
              </div>
            </div>
            <ul className="space-y-1">
              {p.features.map(f => (
                <li key={f} className="flex items-center gap-1.5 justify-end text-[11px]">
                  <span>{f}</span>
                  <CheckCircle2 className="w-3 h-3 text-accent" />
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <SectionCard title="تواصل مع فريق المبيعات">
        <div className="space-y-2">
          <input placeholder="اسم الشركة" className="w-full h-10 px-3 rounded-lg bg-muted text-sm text-right" />
          <input placeholder="اسم المسؤول" className="w-full h-10 px-3 rounded-lg bg-muted text-sm text-right" />
          <div className="relative"><Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input placeholder="رقم الهاتف" className="w-full h-10 pr-9 px-3 rounded-lg bg-muted text-sm text-right" /></div>
          <div className="relative"><Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input placeholder="البريد" className="w-full h-10 pr-9 px-3 rounded-lg bg-muted text-sm text-right" /></div>
          <div className="relative"><Building className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input placeholder="عدد العقارات" className="w-full h-10 pr-9 px-3 rounded-lg bg-muted text-sm text-right" /></div>
          <textarea placeholder="رسالتك..." className="w-full p-3 rounded-lg bg-muted text-sm text-right min-h-[80px]" />
          <button onClick={() => toast.success("تم إرسال طلبك، سنتواصل معك قريباً")} className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-bold text-sm">إرسال الطلب</button>
        </div>
      </SectionCard>
    </PageShell>
  );
};

export default Companies;
