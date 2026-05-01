import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, Home, PlusSquare, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "القائمة", icon: Home },
  { to: "/favorites", label: "أعجبني", icon: Heart },
  { to: "/add-property", label: "إضافة", icon: PlusSquare, highlight: true },
  { to: "/my-properties", label: "عقاري", icon: Building2 },
  { to: "/account", label: "حسابي", icon: User },
];

// Typewriter hook — types and deletes letter by letter, no caret
const useTypewriter = (word: string) => {
  const [text, setText] = useState("");
  useEffect(() => {
    let i = 0;
    let dir: 1 | -1 = 1;
    const tick = () => {
      i += dir;
      if (i > word.length) { dir = -1; i = word.length; }
      if (i < 0) { dir = 1; i = 0; }
      setText(word.slice(0, i));
    };
    const id = setInterval(tick, 280);
    return () => clearInterval(id);
  }, [word]);
  return text;
};

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-50">
      <div className="bg-card border-t border-border shadow-elevated px-2 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around">
          {items.map(({ to, label, icon: Icon, highlight }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={() =>
                cn(
                  "flex flex-col items-center gap-0.5 px-1.5 py-1 min-w-[48px] transition-base relative",
                  highlight && "-mt-5",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {highlight ? (
                    <div className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center shadow-gold transition-spring",
                      "bg-gradient-accent text-accent-foreground",
                      isActive && "scale-110"
                    )}>
                      <Icon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <Icon className={cn("w-5 h-5 transition-base", isActive ? "text-primary" : "text-muted-foreground")} strokeWidth={isActive ? 2.5 : 2} />
                  )}
                  <span className={cn(
                    "text-[10px] font-medium transition-base min-h-[14px]",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {label}
                  </span>
                  {isActive && !highlight && (
                    <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-accent" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
