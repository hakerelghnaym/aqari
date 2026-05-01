import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

const OtpVerify = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { phone?: string } };
  const phone = state?.phone || "01xxxxxxxxx";
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...code]; next[i] = d; setCode(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  const onConfirm = () => {
    if (code.some(c => !c)) return toast.error("أدخل الكود كاملاً");
    toast.success("تم تفعيل الحساب بنجاح");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-8 pb-10 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl" />
        <div className="relative text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-accent flex items-center justify-center mx-auto mb-3 shadow-gold">
            <MessageCircle className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-xl font-extrabold">تأكيد الكود</h1>
          <p className="text-primary-foreground/80 mt-1 text-xs">أدخل الكود المرسل عبر واتساب إلى</p>
          <p className="text-accent font-bold mt-1 text-sm" dir="ltr">{phone}</p>
        </div>
      </div>

      <div className="flex-1 px-6 -mt-6 pb-10">
        <div className="bg-card rounded-3xl shadow-elevated p-6 space-y-6">
          <div className="flex items-center gap-2 justify-center" dir="ltr">
            {code.map((c, i) => (
              <input
                key={i}
                ref={el => refs.current[i] = el}
                value={c}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !c && i > 0) refs.current[i-1]?.focus(); }}
                inputMode="numeric"
                maxLength={1}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-muted border-2 border-border focus:border-accent focus:outline-none transition-base"
              />
            ))}
          </div>

          <div className="text-center">
            {seconds > 0 ? (
              <p className="text-sm text-muted-foreground">إعادة الإرسال خلال <span className="font-bold text-primary">{seconds}</span> ثانية</p>
            ) : (
              <button onClick={() => { setSeconds(60); toast.success("تم إعادة الإرسال"); }} className="text-accent font-bold text-sm">
                إعادة إرسال الكود
              </button>
            )}
          </div>

          <Button onClick={onConfirm} className="w-full h-14 text-base font-bold bg-gradient-primary text-primary-foreground shadow-elevated">
            تأكيد
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
