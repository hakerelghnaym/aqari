import { Link } from "react-router-dom";
import { StatCard, QuickAction } from "@/components/admin/AdminUI";
import {
  Users, Building2, DollarSign, Calendar, FileText, Wallet, ShieldCheck,
  Plus, Check, X, Crown, Megaphone, Flag, Bell, BarChart3, MessageSquare,
  Briefcase, Settings
} from "lucide-react";

const Dashboard = () => (
  <div>
    {/* Hero block (dark) */}
    <section className="bg-gradient-hero text-primary-foreground px-4 pt-4 pb-7 rounded-b-[1.75rem]">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shadow-gold">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-right">
          <p className="text-[11px] opacity-70">لوحة الأدمن</p>
          <h1 className="text-lg font-extrabold">مرحباً، م. خالد</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <StatCard label="إيداعات اليوم" value="420K" hint="+24%" icon={DollarSign} />
        <StatCard label="حجوزات الزيارة" value="38" hint="+12" icon={Calendar} />
        <StatCard label="المستخدمون" value="2,140" hint="+86" icon={Users} />
        <StatCard label="عقارات نشطة" value="312" hint="+5" icon={Building2} />
      </div>
    </section>

    {/* Quick actions — round buttons centered (matches reference) */}
    <section className="px-4 -mt-4 relative z-10">
      <div className="bg-card rounded-2xl shadow-elevated p-3">
        <div className="grid grid-cols-4 gap-2">
          <QuickAction to="/admin/properties" label="إضافة عقار" icon={Plus} accent />
          <QuickAction to="/admin/verifications" label="مراجعات" icon={ShieldCheck} />
          <QuickAction to="/admin/payments" label="السحوبات" icon={Wallet} />
          <QuickAction to="/admin/content" label="تقارير" icon={FileText} />
        </div>
      </div>
    </section>

    {/* Pending verifications */}
    <section className="px-4 mt-4">
      <div className="bg-card rounded-2xl shadow-card p-3">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-extrabold text-accent">12</span>
          <h3 className="text-sm font-extrabold">طلبات توثيق معلقة</h3>
        </div>
        <div className="space-y-2">
          {[
            { name: "محمد أحمد", time: "منذ 5 د", initial: "م" },
            { name: "فاطمة علي", time: "منذ 20 د", initial: "ف" },
            { name: "خالد حسن", time: "منذ ساعة", initial: "خ" },
          ].map((u, i) => (
            <div key={i} className="bg-muted/50 rounded-xl p-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center hover:bg-success/30 transition-base">
                  <Check className="w-4 h-4 text-success" />
                </button>
                <button className="w-8 h-8 rounded-full bg-destructive/15 flex items-center justify-center hover:bg-destructive/25 transition-base">
                  <X className="w-4 h-4 text-destructive" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs font-bold leading-tight">{u.name}</p>
                  <p className="text-[10px] text-muted-foreground">{u.time}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {u.initial}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Recent deposits/visits */}
    <section className="px-4 mt-3">
      <div className="bg-card rounded-2xl shadow-card p-3">
        <div className="flex items-center justify-between mb-2.5">
          <Link to="/admin/payments" className="text-[11px] font-bold text-accent">الكل</Link>
          <h3 className="text-sm font-extrabold">آخر إيداعات الزيارة (500ج)</h3>
        </div>
        <div className="space-y-2">
          {[
            { name: "سارة م.", property: "فيلا التجمع", status: "مقبوض", color: "success" },
            { name: "أحمد ع.", property: "شقة الزايد", status: "قيد المراجعة", color: "accent" },
            { name: "محمد ك.", property: "استوديو أسيوط", status: "مقبوض", color: "success" },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between border-b border-border last:border-0 pb-2 last:pb-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                r.color === "success" ? "bg-success/15 text-success" : "bg-accent/15 text-accent-foreground"
              }`}>{r.status}</span>
              <div className="text-right text-xs">
                <span className="text-muted-foreground">{r.property} • </span>
                <span className="font-bold">{r.name}</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-1.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* All sections grid (round buttons styled like the central row) */}
    <section className="px-4 mt-4">
      <h3 className="text-sm font-extrabold text-right mb-2.5">جميع الأقسام</h3>
      <div className="bg-card rounded-2xl shadow-card p-3">
        <div className="grid grid-cols-4 gap-3">
          <QuickAction to="/admin/users" label="المستخدمون" icon={Users} />
          <QuickAction to="/admin/properties" label="العقارات" icon={Building2} />
          <QuickAction to="/admin/bookings" label="الحجوزات" icon={Calendar} />
          <QuickAction to="/admin/payments" label="المدفوعات" icon={Wallet} />
          <QuickAction to="/admin/ads" label="الإعلانات" icon={Megaphone} />
          <QuickAction to="/admin/pro" label="Pro" icon={Crown} accent />
          <QuickAction to="/admin/companies" label="الشركات" icon={Briefcase} />
          <QuickAction to="/admin/reports" label="البلاغات" icon={Flag} />
          <QuickAction to="/admin/notifications" label="الإشعارات" icon={Bell} />
          <QuickAction to="/admin/messages" label="الرسائل" icon={MessageSquare} />
          <QuickAction to="/admin/verifications" label="التوثيق" icon={ShieldCheck} />
          <QuickAction to="/admin/analytics" label="إحصائيات" icon={BarChart3} />
          <QuickAction to="/admin/content" label="المحتوى" icon={FileText} />
          <QuickAction to="/admin/settings" label="الإعدادات" icon={Settings} />
        </div>
      </div>
    </section>

    <div className="h-6" />
  </div>
);

export default Dashboard;
