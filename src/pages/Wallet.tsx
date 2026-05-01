import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine, ArrowUp, ArrowDown } from "lucide-react";

const txs = [
  { id: 1, type: "in", title: "إيداع — فودافون كاش", amount: 1500, date: "اليوم 10:24" },
  { id: 2, type: "out", title: "اشتراك Pro", amount: 199, date: "أمس" },
  { id: 3, type: "in", title: "إيداع — انستاباي", amount: 3000, date: "20 أبريل" },
];

const Wallet = () => (
  <div className="min-h-screen bg-background pb-10">
    <AppHeader title="المحفظة" variant="primary" />
    <div className="bg-gradient-hero -mt-px text-primary-foreground px-5 pt-2 pb-12 rounded-b-[2.5rem] relative overflow-hidden">
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl" />
      <div className="relative text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-accent mx-auto flex items-center justify-center shadow-gold mb-3">
          <WalletIcon className="w-8 h-8 text-accent-foreground" />
        </div>
        <p className="text-sm text-primary-foreground/70">الرصيد الحالي</p>
        <p className="text-4xl font-extrabold mt-1">8,250 <span className="text-base">ج</span></p>
      </div>
    </div>

    <div className="px-4 -mt-6 grid grid-cols-2 gap-3 relative z-10">
      <Link to="/deposit" className="bg-card rounded-2xl p-4 shadow-elevated text-center">
        <ArrowDownToLine className="w-6 h-6 mx-auto text-success mb-1" />
        <p className="font-bold">إيداع</p>
      </Link>
      <Link to="/withdraw" className="bg-card rounded-2xl p-4 shadow-elevated text-center">
        <ArrowUpFromLine className="w-6 h-6 mx-auto text-destructive mb-1" />
        <p className="font-bold">سحب</p>
      </Link>
    </div>

    <div className="px-4 mt-6">
      <h3 className="font-bold mb-3 text-right">آخر العمليات</h3>
      <div className="space-y-2">
        {txs.map(t => (
          <div key={t.id} className="bg-card rounded-2xl p-3 shadow-card flex items-center justify-between">
            <span className={`font-bold ${t.type === "in" ? "text-success" : "text-destructive"}`}>
              {t.type === "in" ? "+" : "-"}{t.amount} ج
            </span>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.date}</p>
              </div>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${t.type === "in" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                {t.type === "in" ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Wallet;
