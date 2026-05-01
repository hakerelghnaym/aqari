import { PageShell, SectionCard } from "@/components/PageShell";
import { Building2 } from "lucide-react";

const About = () => (
  <PageShell title="عن التطبيق">
    <div className="text-center py-4">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-accent flex items-center justify-center shadow-gold mb-2">
        <Building2 className="w-8 h-8 text-accent-foreground" />
      </div>
      <h2 className="text-lg font-extrabold">عقاري</h2>
      <p className="text-[11px] text-muted-foreground">الإصدار 1.0.0</p>
    </div>
    <SectionCard>
      <p className="text-xs text-right leading-relaxed">عقاري منصة عقارية ذكية تجمع بين الباحثين عن العقارات وملاكها ووسطائها بكل سهولة وأمان، مع أدوات قوية للنشر والتسويق وإدارة الحجوزات والمدفوعات.</p>
    </SectionCard>
    <SectionCard title="فريقنا">
      <p className="text-xs text-right">© 2026 عقاري. جميع الحقوق محفوظة.</p>
    </SectionCard>
  </PageShell>
);

export default About;
