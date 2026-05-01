import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Upload } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const methods = [
  { id: "vodafone", name: "فودافون كاش", number: "01012345678", color: "bg-destructive" },
  { id: "instapay", name: "انستاباي", number: "user@instapay", color: "bg-primary" },
];

const Deposit = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("vodafone");
  const [proof, setProof] = useState<string | null>(null);

  const copy = (n: string) => { navigator.clipboard?.writeText(n); toast.success("تم نسخ الرقم"); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("تم إرسال طلب الإيداع — سيتم المراجعة قريباً");
    navigate("/account");
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader title="إيداع رصيد" />
      <form onSubmit={onSubmit} className="px-4 pt-4 space-y-4">
        <div>
          <h3 className="font-bold mb-2 text-right">اختر طريقة الدفع</h3>
          <div className="grid grid-cols-2 gap-3">
            {methods.map(m => (
              <button type="button" key={m.id} onClick={() => setMethod(m.id)}
                className={cn("p-4 rounded-2xl text-right transition-base", method === m.id ? "bg-primary text-primary-foreground shadow-elevated" : "bg-card shadow-card")}>
                <div className={cn("w-10 h-10 rounded-full mb-2", m.color)} />
                <p className="font-bold">{m.name}</p>
              </button>
            ))}
          </div>
        </div>

        {methods.filter(m => m.id === method).map(m => (
          <div key={m.id} className="bg-card rounded-2xl p-4 shadow-card">
            <p className="text-xs text-muted-foreground mb-1 text-right">رقم محفظة الاستلام</p>
            <div className="flex items-center justify-between gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => copy(m.number)} className="gap-1">
                <Copy className="w-3.5 h-3.5" /> نسخ
              </Button>
              <p className="font-bold text-lg" dir="ltr">{m.number}</p>
            </div>
          </div>
        ))}

        <div className="bg-card rounded-2xl p-4 shadow-card space-y-3">
          <Field label="رقم محفظة التحويل (الخاص بك)"><Input placeholder="01xxxxxxxxx" /></Field>
          <Field label="مبلغ الإيداع"><Input type="number" placeholder="0" /></Field>
          <div>
            <Label className="text-xs font-medium block text-right mb-1.5">إثبات الدفع (لقطة شاشة)</Label>
            <label className="block w-full h-32 rounded-xl border-2 border-dashed border-border bg-muted flex items-center justify-center cursor-pointer overflow-hidden">
              {proof ? <img src={proof} className="w-full h-full object-cover" /> : (
                <div className="text-center text-muted-foreground">
                  <Upload className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-sm">اضغط لرفع الصورة</p>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0]; if (f) setProof(URL.createObjectURL(f));
              }} />
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full h-14 font-bold bg-gradient-primary text-primary-foreground rounded-2xl">
          إرسال
        </Button>
      </form>
    </div>
  );
};

const Field = ({ label, children }: any) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium text-right block">{label}</Label>
    {children}
  </div>
);

export default Deposit;
