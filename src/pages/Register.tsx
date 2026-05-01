import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Lock, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error("الرجاء إدخال جميع البيانات");
    if (form.password.length < 6) return toast.error("كلمة السر 6 أحرف على الأقل");
    if (form.password !== form.confirm) return toast.error("كلمتا السر غير متطابقتين");
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: form.name, phone: form.phone },
      },
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("تم إنشاء الحساب! تحقق من بريدك لتأكيد الحساب");
    navigate("/login");
  };

  const signUpWithGoogle = async () => {
    setGoogleBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) { toast.error(error.message); setGoogleBusy(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-10 pb-16 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl" />
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center mb-3 shadow-gold">
            <UserPlus className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold">إنشاء حساب جديد</h1>
          <p className="text-primary-foreground/80 mt-1 text-sm">انضم إلى عقاري في دقائق</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex-1 px-6 -mt-5 pb-10 space-y-4">
        {/* Google first */}
        <button
          type="button"
          disabled={googleBusy}
          onClick={signUpWithGoogle}
          className="w-full h-14 rounded-2xl bg-card border border-border shadow-card flex items-center justify-center gap-3 text-sm font-bold transition-base hover:bg-muted disabled:opacity-60"
        >
          {googleBusy ? (
            <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          التسجيل بحساب Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">أو بالبريد الإلكتروني</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="bg-card rounded-3xl shadow-elevated p-5 space-y-3">
          <Field label="الاسم الكامل" icon={User}>
            <Input value={form.name} onChange={update("name")} placeholder="مثال: محمد أحمد علي" className="h-11 pr-11" />
          </Field>
          <Field label="البريد الإلكتروني" icon={Mail}>
            <Input value={form.email} onChange={update("email")} type="email" placeholder="example@mail.com" className="h-11 pr-11" />
          </Field>
          <Field label="رقم الهاتف" icon={Phone}>
            <Input value={form.phone} onChange={update("phone")} type="tel" inputMode="tel" placeholder="01xxxxxxxxx" className="h-11 pr-11" />
          </Field>
          <Field label="كلمة السر" icon={Lock}>
            <Input value={form.password} onChange={update("password")} type="password" placeholder="6 أحرف على الأقل" className="h-11 pr-11" />
          </Field>
          <Field label="تأكيد كلمة السر" icon={Lock}>
            <Input value={form.confirm} onChange={update("confirm")} type="password" placeholder="••••••••" className="h-11 pr-11" />
          </Field>
        </div>

        <Button disabled={busy} type="submit"
          className="w-full h-14 text-base font-bold bg-gradient-primary text-primary-foreground shadow-elevated">
          {busy ? "جارٍ إنشاء الحساب…" : "إنشاء الحساب"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          لديك حساب؟ <Link to="/login" className="text-accent font-bold">تسجيل الدخول</Link>
        </p>
      </form>
    </div>
  );
};

const Field = ({ label, icon: Icon, children }: any) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-bold">{label}</Label>
    <div className="relative">
      <Icon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      {children}
    </div>
  </div>
);

export default Register;
