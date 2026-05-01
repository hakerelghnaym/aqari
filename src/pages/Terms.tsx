import { PageShell, SectionCard } from "@/components/PageShell";

const Terms = () => (
  <PageShell title="الشروط والأحكام">
    <SectionCard>
      <div className="text-right text-[12px] leading-relaxed space-y-3">
        <p>مرحباً بك في تطبيق عقاري. باستخدامك للتطبيق فإنك توافق على الشروط التالية...</p>
        <h4 className="font-bold">1. الاستخدام</h4>
        <p>يلتزم المستخدم بتقديم بيانات صحيحة، وعدم نشر محتوى مخالف.</p>
        <h4 className="font-bold">2. العقارات</h4>
        <p>يتحمل ناشر العقار مسؤولية صحة بياناته وصوره.</p>
        <h4 className="font-bold">3. المدفوعات</h4>
        <p>تخضع جميع المدفوعات لسياسة المنصة وعمولاتها المعلنة.</p>
        <h4 className="font-bold">4. التعديل</h4>
        <p>يحق للمنصة تعديل هذه الشروط في أي وقت.</p>
      </div>
    </SectionCard>
  </PageShell>
);

export default Terms;
