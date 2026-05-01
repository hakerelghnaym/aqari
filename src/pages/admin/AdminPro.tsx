import { AdminPageHeader, DataTable, StatCard } from "@/components/admin/AdminUI";
import { Crown, TrendingUp, Users } from "lucide-react";

const AdminPro = () => (
  <>
    <AdminPageHeader title="اشتراكات Pro" />
    <div className="grid grid-cols-3 gap-3 mb-4">
      <StatCard label="مشتركو Pro" value="412" icon={Crown} accent />
      <StatCard label="إيراد شهري" value="ج 82,400" icon={TrendingUp} />
      <StatCard label="معدل التجديد" value="78%" icon={Users} />
    </div>
    <DataTable
      headers={["إجراءات", "تاريخ الانتهاء", "تاريخ البداية", "الباقة", "المستخدم", "#"]}
      rows={Array.from({ length: 8 }).map((_, i) => [
        <button key={i} className="px-2 py-1 rounded bg-muted text-[10px]">تفاصيل</button>,
        `2026-${5 + (i % 6)}-15`,
        `2026-${1 + (i % 4)}-15`,
        ["شهري", "ربع سنوي", "سنوي"][i % 3],
        `Pro ${i + 1}`,
        4000 + i,
      ])}
    />
  </>
);

export default AdminPro;
