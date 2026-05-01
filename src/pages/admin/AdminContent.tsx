import { AdminPageHeader } from "@/components/admin/AdminUI";

const pages = ["الشروط والأحكام", "سياسة الخصوصية", "عن التطبيق", "الأسئلة الشائعة", "الدعم الفني"];

const AdminContent = () => (
  <>
    <AdminPageHeader title="المحتوى والصفحات" subtitle="تحرير محتوى الصفحات الثابتة" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {pages.map(p => (
        <div key={p} className="bg-card rounded-xl p-4 shadow-card">
          <h3 className="text-sm font-bold text-right mb-2">{p}</h3>
          <p className="text-xs text-muted-foreground text-right mb-3">آخر تعديل: منذ 3 أيام</p>
          <button className="w-full h-9 rounded-lg bg-primary text-primary-foreground text-xs font-bold">تحرير</button>
        </div>
      ))}
    </div>
  </>
);

export default AdminContent;
