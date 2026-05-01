import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import heroImg from "@/assets/hero-villa.jpg";

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

const Welcome = () => {
  const navigate = useNavigate();
  const typed = useTypewriter("عقاري");
  return (
    <div className="fixed inset-0 overflow-hidden bg-primary" dir="rtl">
      {/* Full-bleed hero image */}
      <img
        src={heroImg}
        alt="عقاري — منصة العقارات"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark gradient overlay (top transparent, bottom solid navy) */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/60 to-primary" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col text-primary-foreground px-6 pt-10 pb-10">
        {/* spacer to push content down */}
        <div className="flex-1" />

        {/* Brand */}
        <div className="flex items-center gap-3 justify-start mb-5 animate-fade-in-up">
          <div className="w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-gold order-first">
            <Building2 className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight min-w-[1ch]">{typed || "\u00A0"}</h1>
        </div>

        {/* Tagline */}
        <p className="text-center text-lg font-bold leading-relaxed mb-2 animate-fade-in-up">
          عقارك القادم <span className="text-accent">يبدأ من هنا.</span>
        </p>
        <p className="text-center text-sm text-primary-foreground/80 leading-relaxed mb-8 max-w-xs mx-auto animate-fade-in-up">
          منصة بيع العقارات الأولى — اكتشف، احجز زيارتك، وادفع بأمان.
        </p>

        {/* CTAs */}
        <div className="space-y-3 animate-fade-in-up">
          <button
            onClick={() => navigate("/register")}
            className="w-full h-14 rounded-full bg-accent text-accent-foreground font-extrabold text-base shadow-gold active:scale-[0.98] transition-spring"
          >
            ابدأ الآن
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-primary-foreground font-bold text-base active:scale-[0.98] transition-spring"
          >
            لدي حساب
          </button>
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-1.5 mt-7">
          <span className="w-2 h-2 rounded-full bg-white/30" />
          <span className="w-6 h-2 rounded-full bg-accent" />
          <span className="w-2 h-2 rounded-full bg-white/30" />
        </div>

        {/* Admin entry */}
        <button
          onClick={() => navigate("/admin/login")}
          className="mt-4 text-center text-[11px] text-primary-foreground/60 hover:text-accent underline-offset-4 hover:underline"
        >
          دخول الأدمن
        </button>
      </div>
    </div>
  );
};

export default Welcome;
