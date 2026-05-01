import { AdminPageHeader, DataTable, StatCard } from "@/components/admin/AdminUI";
import { Megaphone, Eye, MousePointerClick, DollarSign } from "lucide-react";

const AdminAds = () => (
  <>
    <AdminPageHeader title="الإعلانات الممولة" />
    <div className="grid grid-cols-4 gap-3 mb-4">
      <StatCard label="إعلانات نشطة" value="36" icon={Megaphone} />
      <StatCard label="مشاهدات اليوم" value="84,210" icon={Eye} />
      <StatCard label="نقرات اليوم" value="3,124" icon={MousePointerClick} />
      <StatCard label="إيراد الإعلانات" value="ج 18,400" icon={DollarSign} accent />
    </div>
    <DataTable
      headers={["إجراءات", "الحالة", "النقرات", "المشاهدات", "المدة", "الباقة", "العقار", "#"]}
      rows={Array.from({ length: 6 }).map((_, i) => [
        <div key={i} className="flex gap-1">
          <button className="px-2 py-1 rounded bg-muted text-[10px]">إيقاف</button>
          <button className="px-2 py-1 rounded bg-destructive/10 text-destructive text-[10px]">إنهاء</button>
        </div>,
        i % 2 ? <span key={i} className="text-success">نشط</span> : <span key={i} className="text-muted-foreground">منتهي</span>,
        (i + 1) * 124,
        (i + 1) * 4200,
        `${7 + i} أيام`,
        ["عادية", "متقدمة", "VIP"][i % 3],
        `عقار ${i + 1}`,
        3000 + i,
      ])}
    />
  </>
);

export default AdminAds;
