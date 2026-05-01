import { AdminPageHeader, StatCard } from "@/components/admin/AdminUI";
import { TrendingUp, Users, Eye, DollarSign } from "lucide-react";

const AdminAnalytics = () => (
  <>
    <AdminPageHeader title="الإحصائيات" subtitle="مؤشرات الأداء الرئيسية" />
    <div className="grid grid-cols-4 gap-3 mb-4">
      <StatCard label="مستخدمون نشطون شهرياً" value="48,210" icon={Users} accent />
      <StatCard label="مشاهدات العقارات" value="1.2M" icon={Eye} />
      <StatCard label="معدل التحويل" value="4.7%" icon={TrendingUp} />
      <StatCard label="ARPU" value="ج 38.2" icon={DollarSign} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="bg-card rounded-xl p-4 shadow-card">
        <h3 className="text-sm font-bold text-right mb-3">حركة المستخدمين (آخر 30 يوم)</h3>
        <div className="h-48 flex items-end gap-1">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="flex-1 bg-gradient-accent rounded-t" style={{ height: `${30 + Math.sin(i) * 30 + i * 1.2}%` }} />
          ))}
        </div>
      </div>
      <div className="bg-card rounded-xl p-4 shadow-card">
        <h3 className="text-sm font-bold text-right mb-3">الإيرادات الشهرية</h3>
        <div className="h-48 flex items-end gap-2">
          {["ينا","فبر","مار","أبر","ماي","يون","يول","أغس","سبت","أكت","نوف","ديس"].map((m, i) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-primary rounded-t" style={{ height: `${30 + i * 5}%` }} />
              <span className="text-[9px] text-muted-foreground">{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default AdminAnalytics;
