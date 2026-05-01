import { AdminPageHeader, DataTable, StatCard } from "@/components/admin/AdminUI";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, CreditCard } from "lucide-react";

const AdminPayments = () => (
  <>
    <AdminPageHeader title="المدفوعات والمحافظ" subtitle="مراقبة الحركات المالية" />
    <div className="grid grid-cols-4 gap-3 mb-4">
      <StatCard label="إجمالي الإيرادات" value="ج 482,300" icon={Wallet} accent />
      <StatCard label="إيداعات اليوم" value="ج 24,500" icon={ArrowDownToLine} />
      <StatCard label="سحوبات معلقة" value="ج 12,800" icon={ArrowUpFromLine} />
      <StatCard label="عمليات اليوم" value="184" icon={CreditCard} />
    </div>
    <DataTable
      headers={["إجراءات", "الحالة", "الطريقة", "المبلغ", "النوع", "المستخدم", "#"]}
      rows={Array.from({ length: 8 }).map((_, i) => [
        <div key={i} className="flex gap-1">
          <button className="px-2 py-1 rounded bg-success/10 text-success text-[10px]">اعتماد</button>
          <button className="px-2 py-1 rounded bg-destructive/10 text-destructive text-[10px]">رفض</button>
        </div>,
        i % 2 ? <span key={i} className="text-accent">معلق</span> : <span key={i} className="text-success">مكتمل</span>,
        i % 2 ? "فودافون كاش" : "انستاباي",
        `ج ${(i + 1) * 150}`,
        i % 2 ? "إيداع" : "سحب",
        `مستخدم ${i + 1}`,
        2000 + i,
      ])}
    />
  </>
);

export default AdminPayments;
