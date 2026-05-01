import { AdminPageHeader, DataTable } from "@/components/admin/AdminUI";
import { Search, Plus } from "lucide-react";

const rows = Array.from({ length: 8 }).map((_, i) => [
  <div key={i} className="flex gap-1">
    <button className="px-2 py-1 rounded bg-muted text-[10px]">عرض</button>
    <button className="px-2 py-1 rounded bg-destructive/10 text-destructive text-[10px]">حظر</button>
  </div>,
  i % 3 === 0 ? <span key={`s${i}`} className="text-accent font-bold">موثق</span> : <span key={`s${i}`} className="text-muted-foreground">عادي</span>,
  `2026-04-${10 + i}`,
  `+20 100 000 ${i}${i}${i}${i}`,
  `user${i}@aqari.com`,
  `مستخدم رقم ${i + 1}`,
]);

const AdminUsers = () => (
  <>
    <AdminPageHeader
      title="المستخدمون"
      subtitle="12,480 مستخدم"
      action={
        <div className="flex gap-2">
          <button className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1"><Plus className="w-4 h-4" /> إضافة</button>
          <div className="relative">
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input placeholder="بحث..." className="h-9 pr-8 pl-3 rounded-lg bg-card text-xs w-56" />
          </div>
        </div>
      }
    />
    <DataTable headers={["إجراءات", "الحالة", "الانضمام", "الهاتف", "البريد", "الاسم"]} rows={rows} />
  </>
);

export default AdminUsers;
