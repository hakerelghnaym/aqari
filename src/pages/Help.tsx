import { PageShell, SectionCard } from "@/components/PageShell";
import { Phone, Mail, MessageSquare, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "كيف أضيف عقار؟", a: "اضغط على زر + في شريط التنقل، ثم املأ بيانات العقار وارفع الصور." },
  { q: "كيف أوثّق حسابي؟", a: "من صفحة حسابي > الخصوصية > طلب توثيق، وارفع المستندات المطلوبة." },
  { q: "كيف أسحب رصيدي؟", a: "من المحفظة > سحب، اختر الطريقة وأدخل البيانات." },
  { q: "ما الفرق بين Pro والإعلان الممول؟", a: "Pro اشتراك شهري لمزايا دائمة، الإعلان الممول لتمييز عقار محدد فترة." },
];

const Help = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PageShell title="المساعدة والدعم">
      <SectionCard title="تواصل معنا">
        <div className="grid grid-cols-3 gap-2">
          <button className="bg-muted rounded-lg p-3 flex flex-col items-center gap-1"><Phone className="w-4 h-4 text-accent" /><span className="text-[10px] font-bold">اتصال</span></button>
          <button className="bg-muted rounded-lg p-3 flex flex-col items-center gap-1"><MessageSquare className="w-4 h-4 text-accent" /><span className="text-[10px] font-bold">واتساب</span></button>
          <button className="bg-muted rounded-lg p-3 flex flex-col items-center gap-1"><Mail className="w-4 h-4 text-accent" /><span className="text-[10px] font-bold">بريد</span></button>
        </div>
      </SectionCard>
      <SectionCard title="الأسئلة الشائعة">
        {faqs.map((f, i) => (
          <div key={i} className="border-b border-border last:border-0 py-2">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between">
              <ChevronDown className={`w-4 h-4 transition-base ${open === i ? "rotate-180" : ""}`} />
              <span className="text-xs font-bold text-right">{f.q}</span>
            </button>
            {open === i && <p className="text-[11px] text-muted-foreground text-right mt-2">{f.a}</p>}
          </div>
        ))}
      </SectionCard>
    </PageShell>
  );
};

export default Help;
