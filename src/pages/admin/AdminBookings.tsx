import { AdminPageHeader, DataTable, StatCard } from "@/components/admin/AdminUI";
import { Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";

const AdminBookings = () => (
  <>
    <AdminPageHeader title="الحجوزات" subtitle="إدارة جميع حجوزات المعاينة" />
    <div className="grid grid-cols-4 gap-3 mb-4">
      <StatCard label="الإجمالي" value="847" icon={Calendar} />
      <StatCard label="مؤكد" value="612" icon={CheckCircle2} />
      <StatCard label="قيد الانتظار" value="180" icon={Clock} />
      <StatCard label="ملغي" value="55" icon={XCircle} />
    </div>
    <DataTable
      headers={["إجراءات", "الحالة", "الموعد", "العقار", "الزائر", "#"]}
      rows={Array.from({ length: 6 }).map((_, i) => [
        <div key={i} className="flex gap-1">
          <button className="px-2 py-1 rounded bg-success/10 text-success text-[10px]">قبول</button>
          <button className="px-2 py-1 rounded bg-destructive/10 text-destructive text-[10px]">رفض</button>
        </div>,
        i % 2 ? <span key={i} className="text-accent">قيد الانتظار</span> : <span key={i} className="text-success">مؤكد</span>,
        `2026-05-${i + 1} 17:00`,
        `عقار ${i + 1}`,
        `زائر ${i + 1}`,
        1000 + i,
      ])}
    />
  </>
);

export default AdminBookings;
