import { AdminPageHeader, DataTable } from "@/components/admin/AdminUI";

const AdminReports = () => (
  <>
    <AdminPageHeader title="البلاغات" subtitle="مراجعة بلاغات المستخدمين" />
    <DataTable
      headers={["إجراءات", "الحالة", "التاريخ", "السبب", "ضد", "من", "#"]}
      rows={Array.from({ length: 8 }).map((_, i) => [
        <div key={i} className="flex gap-1">
          <button className="px-2 py-1 rounded bg-success/10 text-success text-[10px]">حل</button>
          <button className="px-2 py-1 rounded bg-destructive/10 text-destructive text-[10px]">حذف</button>
        </div>,
        i % 2 ? <span key={i} className="text-accent">جديد</span> : <span key={i} className="text-success">محلول</span>,
        `2026-04-${10 + i}`,
        ["محتوى مخالف", "إعلان مكرر", "سعر وهمي", "صور مسروقة"][i % 4],
        `عقار/مستخدم ${i + 1}`,
        `مستخدم ${i + 1}`,
        6000 + i,
      ])}
    />
  </>
);

export default AdminReports;
