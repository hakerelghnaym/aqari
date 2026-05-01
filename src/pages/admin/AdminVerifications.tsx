import { AdminPageHeader, DataTable } from "@/components/admin/AdminUI";

const AdminVerifications = () => (
  <>
    <AdminPageHeader title="طلبات التوثيق" />
    <DataTable
      headers={["إجراءات", "المستندات", "النوع", "تاريخ الطلب", "المستخدم", "#"]}
      rows={Array.from({ length: 6 }).map((_, i) => [
        <div key={i} className="flex gap-1">
          <button className="px-2 py-1 rounded bg-success/10 text-success text-[10px]">قبول</button>
          <button className="px-2 py-1 rounded bg-destructive/10 text-destructive text-[10px]">رفض</button>
        </div>,
        <button key={`d${i}`} className="text-accent text-[10px] underline">عرض المستندات</button>,
        i % 2 ? "وسيط معتمد" : "مالك",
        `2026-04-${10 + i}`,
        `مستخدم ${i + 1}`,
        8000 + i,
      ])}
    />
  </>
);

export default AdminVerifications;
