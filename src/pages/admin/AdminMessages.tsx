import { AdminPageHeader, DataTable, StatCard } from "@/components/admin/AdminUI";
import { MessageSquare, AlertTriangle, Eye } from "lucide-react";

const AdminMessages = () => (
  <>
    <AdminPageHeader title="مراقبة الرسائل" subtitle="رسائل تم الإبلاغ عنها أو تحتوي مفاتيح حظر" />
    <div className="grid grid-cols-3 gap-3 mb-4">
      <StatCard label="رسائل اليوم" value="12,840" icon={MessageSquare} />
      <StatCard label="مبلّغ عنها" value="38" icon={AlertTriangle} />
      <StatCard label="مراجعات معلقة" value="9" icon={Eye} />
    </div>
    <DataTable
      headers={["إجراء", "الوقت", "محتوى", "إلى", "من", "#"]}
      rows={Array.from({ length: 6 }).map((_, i) => [
        <button key={i} className="px-2 py-1 rounded bg-muted text-[10px]">عرض المحادثة</button>,
        `${10 + i}:24`,
        "تواصل خارجي مشتبه...",
        `مستخدم ${i + 5}`,
        `مستخدم ${i + 1}`,
        7000 + i,
      ])}
    />
  </>
);

export default AdminMessages;
