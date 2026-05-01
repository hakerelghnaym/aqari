import { AdminPageHeader, DataTable } from "@/components/admin/AdminUI";
import { properties } from "@/data/mock";

const AdminProperties = () => (
  <>
    <AdminPageHeader title="العقارات" subtitle={`${properties.length * 800} عقار`} />
    <DataTable
      headers={["إجراءات", "الحالة", "السعر", "النوع", "المدينة", "العنوان", "#"]}
      rows={properties.map(p => [
        <div key={p.id} className="flex gap-1">
          <button className="px-2 py-1 rounded bg-muted text-[10px]">مراجعة</button>
          <button className="px-2 py-1 rounded bg-destructive/10 text-destructive text-[10px]">حذف</button>
        </div>,
        <span key={`s${p.id}`} className="text-success font-bold">{p.status}</span>,
        `ج ${p.price}`,
        p.type,
        p.city,
        p.title,
        p.id,
      ])}
    />
  </>
);

export default AdminProperties;
