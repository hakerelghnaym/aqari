import { AdminPageHeader } from "@/components/admin/AdminUI";

const AdminSettings = () => (
  <>
    <AdminPageHeader title="إعدادات المنصة" />
    <div className="bg-card rounded-xl p-4 shadow-card max-w-2xl space-y-4">
      {[
        { l: "اسم المنصة", v: "عقاري" },
        { l: "البريد الرسمي", v: "info@aqari.com" },
        { l: "رقم الدعم", v: "+20 100 000 0000" },
        { l: "نسبة العمولة (%)", v: "5" },
        { l: "الحد الأدنى للسحب (ج)", v: "100" },
      ].map(f => (
        <label key={f.l} className="block">
          <span className="text-xs font-bold">{f.l}</span>
          <input defaultValue={f.v} className="w-full h-10 px-3 rounded-lg bg-muted text-sm mt-1 text-right" />
        </label>
      ))}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs">وضع الصيانة</span>
        <input type="checkbox" className="w-5 h-5 accent-primary" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs">تفعيل التسجيل بحساب جديد</span>
        <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
      </div>
      <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-bold">حفظ التغييرات</button>
    </div>
  </>
);

export default AdminSettings;
