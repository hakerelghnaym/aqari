import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, Lock, User } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("admin@aqari.com");
  const [pwd, setPwd] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwd) { toast.error("ادخل كلمة المرور"); return; }
    toast.success("تم تسجيل الدخول كأدمن");
    setTimeout(() => navigate("/admin"), 500);
  };

  return (
    <div className="fixed inset-0 bg-gradient-hero text-primary-foreground flex items-center justify-center p-6 overflow-auto" dir="rtl">
      <div className="w-full max-w-sm bg-card text-foreground rounded-2xl p-6 shadow-elevated">
        <div className="flex flex-col items-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center shadow-gold mb-2">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-lg font-extrabold">لوحة تحكم الأدمن</h1>
          <p className="text-xs text-muted-foreground mt-1">دخول مخصص للمشرفين فقط</p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="text-xs font-bold">البريد الإلكتروني</span>
            <div className="relative mt-1">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={email} onChange={e => setEmail(e.target.value)} className="w-full h-11 pr-9 pl-3 rounded-lg bg-muted text-sm text-right" />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-bold">كلمة المرور</span>
            <div className="relative mt-1">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type={show ? "text" : "password"} value={pwd} onChange={e => setPwd(e.target.value)} className="w-full h-11 pr-9 pl-9 rounded-lg bg-muted text-sm text-right" />
              <button type="button" onClick={() => setShow(s => !s)} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-muted-foreground">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </label>

          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" className="accent-primary" /> تذكرني على هذا الجهاز
          </label>

          <button type="submit" className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            دخول إلى لوحة التحكم
          </button>
          <button type="button" onClick={() => navigate("/")} className="w-full h-11 rounded-lg bg-muted text-foreground font-bold text-sm border border-border">
            دخول كمستخدم
          </button>
        </form>

        <p className="text-[10px] text-center text-muted-foreground mt-4">© عقاري — منطقة محمية</p>
      </div>
    </div>
  );
};

export default AdminLogin;
