import { AdminPageHeader, DataTable, StatCard } from "@/components/admin/AdminUI";
import { Briefcase, Building, Handshake } from "lucide-react";

const AdminCompanies = () => (
  <>
    <AdminPageHeader title="تعاقد الشركات" subtitle="إدارة العقود مع شركات التطوير العقاري" />
    <div className="grid grid-cols-3 gap-3 mb-4">
      <StatCard label="شركات متعاقدة" value="48" icon={Briefcase} accent />
      <StatCard label="مشاريع نشطة" value="184" icon={Building} />
      <StatCard label="عقود قيد المراجعة" value="12" icon={Handshake} />
    </div>
    <DataTable
      headers={["إجراءات", "الحالة", "نهاية العقد", "بداية العقد", "الباقة", "المسؤول", "الشركة", "#"]}
      rows={Array.from({ length: 6 }).map((_, i) => [
        <div key={i} className="flex gap-1">
          <button className="px-2 py-1 rounded bg-muted text-[10px]">عقد</button>
          <button className="px-2 py-1 rounded bg-success/10 text-success text-[10px]">مراسلة</button>
        </div>,
        i % 2 ? <span key={i} className="text-success">نشط</span> : <span key={i} className="text-accent">قيد المراجعة</span>,
        `2027-01-${10 + i}`,
        `2026-01-${10 + i}`,
        ["Enterprise", "Business", "Premium"][i % 3],
        `م. مدير ${i + 1}`,
        ["شركة العمار", "بناء الإسكندرية", "تطوير القاهرة", "إعمار العاصمة"][i % 4],
        5000 + i,
      ])}
    />
  </>
);

export default AdminCompanies;
