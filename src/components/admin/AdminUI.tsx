import { ReactNode } from "react";
import { Link } from "react-router-dom";

export const AdminPageHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) => (
  <div className="flex items-end justify-between mb-3 px-4 pt-4">
    <div>{action}</div>
    <div className="text-right">
      <h1 className="text-base font-extrabold">{title}</h1>
      {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

/* Compact dark navy stat card — slightly smaller per design feedback */
export const StatCard = ({ label, value, hint, icon: Icon }: { label: string; value: string | number; hint?: string; icon: any; accent?: boolean }) => (
  <div className="rounded-xl p-2.5 bg-primary text-primary-foreground shadow-elevated relative overflow-hidden">
    <div className="absolute -top-5 -left-5 w-16 h-16 bg-accent/10 rounded-full blur-2xl" />
    <div className="flex items-center justify-between mb-1.5 relative">
      <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-accent" />
      </div>
      {hint && <span className="text-[9px] text-accent font-bold">{hint}</span>}
    </div>
    <p className="text-lg font-extrabold text-right relative leading-none">{value}</p>
    <p className="text-[10px] opacity-70 text-right mt-1 relative">{label}</p>
  </div>
);

/* Round white quick-action button used on dashboard grid */
export const QuickAction = ({ to, label, icon: Icon, accent }: { to: string; label: string; icon: any; accent?: boolean }) => (
  <Link to={to} className="flex flex-col items-center gap-1.5 group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-card transition-spring group-active:scale-95 ${
      accent ? "bg-accent text-accent-foreground" : "bg-card text-foreground"
    }`}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-[11px] font-bold text-foreground">{label}</span>
  </Link>
);

export const DataTable = ({ headers, rows }: { headers: string[]; rows: (string | ReactNode)[][] }) => (
  <div className="bg-card rounded-2xl shadow-card overflow-x-auto mx-4">
    <table className="w-full text-xs">
      <thead className="bg-muted/50">
        <tr>{headers.map((h, i) => <th key={i} className="px-3 py-2 text-right font-bold whitespace-nowrap">{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t border-border hover:bg-muted/30">
            {r.map((c, j) => <td key={j} className="px-3 py-2 text-right whitespace-nowrap">{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
