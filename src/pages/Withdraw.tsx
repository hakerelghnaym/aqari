import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const methods = [
  { id: "bank", name: "تحويل بنكي" },
  { id: "vodafone", name: "فودافون كاش" },
];

const Withdraw = () => {
  const navigate = useNavigate();
  const balance = 8250;
  const [method, setMethod] = useState("vodafone");
  const [amount, setAmount] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(amount);
    if (!n || n <= 0) return toast.error("أدخل مبلغاً صحيحاً");
    if (n > balance) return toast.error("الرصيد غير كافٍ");
    toast.success("تم تقديم طلب السحب — سيتم المراجعة خلال 24 ساعة");
    navigate("/account");
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader title="سحب رصيد" />
      <form onSubmit={onSubmit} className="px-4 pt-4 space-y-4">
        <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-4 text-center">
          <p className="text-xs opacity-70">الرصيد المتاح</p>
          <p className="text-3xl font-extrabold mt-1">{balance.toLocaleString()} ج</p>
        </div>

        <div>
          <h3 className="font-bold mb-2 text-right">طريقة السحب</h3>
          <div className="grid grid-cols-2 gap-3">
            {methods.map(m => (
              <button key={m.id} type="button" onClick={() => setMethod(m.id)}
                className={cn("h-14 rounded-2xl font-bold transition-base", method === m.id ? "bg-primary text-primary-foreground shadow-elevated" : "bg-card shadow-card")}>
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-card space-y-3">
          <Field label="مبلغ السحب">
            <Input value={amount} onChange={e=>setAmount(e.target.value)} type="number" placeholder="0" />
            <p className="text-[11px] text-muted-foreground mt-1 text-right">الحد الأقصى: {balance} ج</p>
          </Field>
          <Field label={method === "bank" ? "رقم الحساب البنكي / IBAN" : "رقم محفظة فودافون كاش"}>
            <Input placeholder={method === "bank" ? "EG..." : "01xxxxxxxxx"} />
          </Field>
          {method === "bank" && (
            <Field label="اسم البنك"><Input placeholder="مثال: CIB" /></Field>
          )}
        </div>

        <Button type="submit" className="w-full h-14 font-bold bg-gradient-primary text-primary-foreground rounded-2xl">
          تقديم طلب السحب
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

export default Withdraw;
