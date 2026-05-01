import { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, Share2, Flag, X, MapPin, Bed, Bath, Maximize2, Star, ShieldCheck, Eye, ChevronRight, Phone, MessageCircle, Calendar } from "lucide-react";
import { properties } from "@/data/mock";
import { useFavorites } from "@/store/favorites";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const p = properties.find(x => x.id === id) || properties[0];
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(p.id);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top header floating */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur px-4 py-3 flex items-center justify-between border-b border-border">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center">
          <ChevronRight className="w-5 h-5" />
        </button>
        <h1 className="font-bold">تفاصيل العقار</h1>
        <button onClick={() => toggle(p.id)} className="w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center">
          <Heart className={cn("w-5 h-5", fav && "fill-destructive text-destructive")} />
        </button>
      </div>

      {/* Header info */}
      <div className="px-5 pt-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="text-left">
            <p className="text-xs text-muted-foreground">السعر</p>
            <p className="text-2xl font-extrabold text-primary">{p.price} <span className="text-sm">{p.currency}</span></p>
          </div>
          <div className="flex-1 text-right">
            <h2 className="text-lg font-extrabold leading-tight">{p.title}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end mt-1">
              <MapPin className="w-3.5 h-3.5" /> {p.area} • {p.city}
            </p>
          </div>
        </div>

        {/* Owner */}
        <Link
          to={`/user/${encodeURIComponent(p.owner.name)}`}
          className="flex items-center justify-end gap-3 bg-card rounded-2xl p-3 shadow-card transition-base hover:shadow-elevated active:scale-[0.99]"
          aria-label={`عرض صفحة ${p.owner.name}`}
        >
          <div className="text-right">
            <p className="font-bold text-sm flex items-center gap-1 justify-end">
              {p.owner.name}
              {p.owner.verified && <ShieldCheck className="w-4 h-4 text-success" />}
            </p>
            <p className="text-xs text-muted-foreground">{p.owner.role}</p>
          </div>
          <img src={p.owner.avatar} alt={p.owner.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-accent/30" />
        </Link>
      </div>

      {/* Carousel */}
      <div className="mt-5">
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-[15%] pb-2">
          {p.images.map((img, i) => (
            <button key={i} onClick={() => setLightbox(i)} className="shrink-0 w-[70%] aspect-[4/3] rounded-2xl overflow-hidden snap-center shadow-card">
              <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-3 px-5 mt-5">
        {[
          { icon: Heart, label: "أعجبني", action: () => toggle(p.id), active: fav },
          { icon: Share2, label: "مشاركة", action: () => { navigator.clipboard?.writeText(window.location.href); toast.success("تم نسخ الرابط"); } },
          { icon: Flag, label: "إبلاغ", action: () => toast.info("تم استلام البلاغ") },
        ].map((a, i) => (
          <button key={i} onClick={a.action} className="bg-card rounded-2xl p-3 flex flex-col items-center gap-1 shadow-card transition-base hover:scale-105">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", a.active ? "bg-destructive/10 text-destructive" : "bg-accent-soft text-accent-foreground")}>
              <a.icon className={cn("w-5 h-5", a.active && "fill-destructive")} />
            </div>
            <span className="text-xs font-medium">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="mt-6 px-5">
        <TabsList className="w-full grid grid-cols-4 bg-secondary h-12 rounded-2xl p-1">
          <TabsTrigger value="details" className="rounded-xl">التفاصيل</TabsTrigger>
          <TabsTrigger value="amenities" className="rounded-xl">المزايا</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-xl">إحصائيات</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-xl">تقييمات</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4 space-y-4">
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <h4 className="font-bold mb-2 text-right">الوصف</h4>
            <p className="text-sm text-muted-foreground leading-relaxed text-right">{p.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Spec icon={Bed} label="غرف" value={`${p.rooms}`} />
            <Spec icon={Bath} label="حمامات" value={`${p.baths}`} />
            <Spec icon={Maximize2} label="المساحة" value={`${p.size}م²`} />
          </div>
        </TabsContent>

        <TabsContent value="amenities" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {p.amenities.map(a => (
              <div key={a} className="bg-card rounded-xl p-3 text-sm font-medium shadow-card flex items-center gap-2 justify-end">
                <span>{a}</span>
                <ShieldCheck className="w-4 h-4 text-success" />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-4 grid grid-cols-3 gap-3">
          <Spec icon={Eye} label="مشاهدات" value={`${p.views}`} />
          <Spec icon={Heart} label="إعجاب" value={`${p.likes}`} />
          <Spec icon={Star} label="التقييم" value={`${p.rating}`} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-4 space-y-3">
          {[1,2].map(i => (
            <div key={i} className="bg-card rounded-2xl p-4 shadow-card">
              <div className="flex items-center justify-end gap-2 mb-2">
                <div className="text-right">
                  <p className="font-bold text-sm">عميل سعيد</p>
                  <div className="flex gap-0.5 justify-end">{Array.from({length:5}).map((_,k)=><Star key={k} className="w-3 h-3 fill-accent text-accent" />)}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-muted" />
              </div>
              <p className="text-sm text-muted-foreground text-right">عقار رائع وموقع متميز، تجربة ممتازة!</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-card border-t border-border p-4 z-40 flex items-center gap-2">
        <Button onClick={() => navigate(`/book-visit/${p.id}`)} variant="outline" className="flex-1 h-12 rounded-xl">
          <Calendar className="w-4 h-4 ml-2" /> حجز زيارة
        </Button>
        <a href="tel:+201000000000" className="w-12 h-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
          <Phone className="w-5 h-5" />
        </a>
        <Button onClick={() => navigate(`/chat/${p.owner.name}`)} className="flex-1 h-12 rounded-xl bg-gradient-primary text-primary-foreground">
          <MessageCircle className="w-4 h-4 ml-2" /> دردشة
        </Button>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center animate-scale-in">
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur text-white flex items-center justify-center z-10">
            <X className="w-6 h-6" />
          </button>
          <div className="w-full overflow-x-auto flex snap-x snap-mandatory">
            {p.images.map((img, i) => (
              <div key={i} className="shrink-0 w-full h-screen flex items-center justify-center snap-center p-4">
                <img src={img} alt="" className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Spec = ({ icon: Icon, label, value }: any) => (
  <div className="bg-card rounded-2xl p-3 text-center shadow-card">
    <Icon className="w-5 h-5 mx-auto text-accent mb-1" />
    <p className="text-lg font-extrabold">{value}</p>
    <p className="text-[11px] text-muted-foreground">{label}</p>
  </div>
);

export default PropertyDetails;
