import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  hideNav?: boolean;
}

export const PageShell = ({ title, subtitle, children, hideNav }: Props) => (
  <div className="min-h-screen bg-background pb-28">
    <AppHeader title={title} subtitle={subtitle} />
    <div className="px-3 py-3 space-y-3">{children}</div>
    {!hideNav && <BottomNav />}
  </div>
);

export const SectionCard = ({ title, children }: { title?: string; children: ReactNode }) => (
  <div className="bg-card rounded-xl p-3 shadow-card">
    {title && <h3 className="text-xs font-bold mb-2 text-right">{title}</h3>}
    {children}
  </div>
);
