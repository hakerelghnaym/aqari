import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  leftAction?: ReactNode;
  variant?: "default" | "primary";
  className?: string;
}

export const AppHeader = ({
  title, subtitle, showBack = true, onBack, rightAction, leftAction,
  variant = "default", className,
}: AppHeaderProps) => {
  const navigate = useNavigate();
  const isPrimary = variant === "primary";

  return (
    <header className={cn(
      "sticky top-0 z-40 px-3 py-2.5 flex items-center gap-2",
      isPrimary ? "bg-gradient-hero text-primary-foreground" : "bg-card border-b border-border",
      className
    )}>
      {showBack && (
        <button
          onClick={() => onBack ? onBack() : navigate(-1)}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-base",
            isPrimary ? "hover:bg-white/10" : "hover:bg-muted"
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
      <div className="flex-1 text-center">
        <h1 className={cn("font-bold", subtitle ? "text-sm" : "text-base")}>{title}</h1>
        {subtitle && <p className={cn("text-[11px] mt-0.5", isPrimary ? "text-primary-foreground/70" : "text-muted-foreground")}>{subtitle}</p>}
      </div>
      <div className="w-8 h-8 flex items-center justify-center">
        {rightAction || leftAction}
      </div>
    </header>
  );
};
