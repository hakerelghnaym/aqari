import { AdminPageHeader } from "@/components/admin/AdminUI";
import { Send } from "lucide-react";

const AdminNotifications = () => (
  <>
    <AdminPageHeader title="إرسال إشعارات جماعية" />
    <div className="bg-card rounded-xl p-4 shadow-card max-w-2xl space-y-3">
      <label className="block">
        <span className="text-xs font-bold">العنوان</span>
        <input className="w-full h-10 px-3 rounded-lg bg-muted text-sm mt-1" placeholder="عنوان الإشعار" />
      </label>
      <label className="block">
        <span className="text-xs font-bold">المحتوى</span>
        <textarea className="w-full p-3 rounded-lg bg-muted text-sm mt-1 min-h-[100px]" placeholder="نص الإشعار..." />
      </label>
      <label className="block">
        <span className="text-xs font-bold">الجمهور المستهدف</span>
        <select className="w-full h-10 px-3 rounded-lg bg-muted text-sm mt-1">
          <option>كل المستخدمين</option>
          <option>مشتركو Pro</option>
          <option>الشركات</option>
          <option>عملاء نشطون آخر 30 يوم</option>
        </select>
      </label>
      <button className="h-11 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center gap-2">
        <Send className="w-4 h-4" /> إرسال الإشعار
      </button>
    </div>
  </>
);

export default AdminNotifications;
