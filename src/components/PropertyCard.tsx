import { Link } from "react-router-dom";
import { Heart, MapPin, Bed, Bath, Maximize2, ShieldCheck, Phone, MessageCircle, Share2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/store/favorites";
import { formatPrice, PERIOD_LABEL } from "@/lib/format";
import propFallback from "@/assets/property-1.jpg";
import avatarFallback from "@/assets/avatar-1.jpg";
import { toast } from "sonner";

interface OwnerProfile {
  display_name?: string | null;
  avatar_url?: string | null;
  is_verified?: boolean | null;
  rating?: number | null;
}
interface PropertyRow {
  id: string;
  owner_id?: string;
  title: string;
  city: string;
  district?: string | null;
  area?: any;
  price: number;
  status?: "sale" | "rent" | "for_sale" | "for_rent" | "sold" | "rented";
  rent_period?: "day" | "month" | "year" | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  baths?: number;
  rooms?: number;
  size?: number;
  images?: string[] | null;
  profiles?: OwnerProfile | null;
  owner?: { name?: string; avatar?: string; verified?: boolean; rating?: number } | null;
  currency?: string;
  // countdown fields for rent
  rent_available_after_days?: number | null;
  rent_countdown_set_at?: string | null;
}

interface PropertyCardProps {
  property: PropertyRow;
  variant?: "default" | "carousel";
}

function getRatingStars(rating: number | null | undefined) {
  const r = Math.round(rating ?? 0);
  return r;
}

function formatSmartPrice(price: number) {
  const digits = Math.round(price).toString().length;
  if (digits >= 7) {
    const m = (price / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return { value: m, suffix: "M" };
  }
  return { value: price.toLocaleString("en-US"), suffix: "ج.م" };
}

export const PropertyCard = ({ property: p, variant = "default" }: PropertyCardProps) => {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(p.id);
  const owner = p.profiles ?? {};
  const img = (p.images && p.images.length ? p.images[0] : propFallback) as string;
  const avatar = owner.avatar_url || p.owner?.avatar || avatarFallback;
  const ownerName = owner.display_name || p.owner?.name || "مالك العقار";
  const verified = owner.is_verified ?? p.owner?.verified ?? false;
  const ownerRating = owner.rating ?? p.owner?.rating ?? null;
  const isRent = p.status === "rent" || p.status === "for_rent";
  const period = isRent && p.rent_period ? PERIOD_LABEL[p.rent_period] : "";
  const statusBadge = !isRent
    ? { label: "للبيع", cls: "bg-success text-success-foreground" }
    : { label: "للإيجار", cls: "bg-accent text-accent-foreground" };
  const ownerLink = p.owner_id ? `/user/${p.owner_id}` : "/account";
  const smartPrice = formatSmartPrice(p.price);

  // Rent countdown
  let countdownText: string | null = null;
  if (isRent && p.rent_available_after_days != null && p.rent_countdown_set_at) {
    const setAt = new Date(p.rent_countdown_set_at).getTime();
    const daysElapsed = Math.floor((Date.now() - setAt) / 86400000);
    const daysLeft = p.rent_available_after_days - daysElapsed;
    if (daysLeft > 0) {
      countdownText = `متاح للإيجار بعد ${daysLeft} ${daysLeft === 1 ? "يوم" : "أيام"}`;
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const url = `${window.location.origin}/property/${p.id}`;
    const text = `🏠 شاهد هذا العقار على تطبيق عقاري:\n${p.title}\n${p.city}${p.district ? " • " + p.district : ""}\nالسعر: ${smartPrice.value} ${smartPrice.suffix}${period}\n${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: p.title, text, url });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("تم نسخ رابط العقار");
      }
    } catch { /* user cancelled */ }
  };

  return (
    <article className={cn(
      "bg-card rounded-3xl overflow-hidden shadow-card animate-fade-in-up",
      variant === "carousel" && "shrink-0 w-[88%] snap-center"
    )}>
      {/* Owner header */}
      <div className="flex items-center justify-between p-2">
        {/* Rating stars (replaces share icon) */}
        <div className="flex items-center gap-0.5">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className={cn("w-3 h-3", i <= getRatingStars(ownerRating) ? "fill-accent text-accent" : "text-muted-foreground")} />
          ))}
        </div>
        <Link to={ownerLink} className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs font-bold leading-tight flex items-center gap-1 justify-end">
              {ownerName}
              {verified && <ShieldCheck className="w-3 h-3 text-success" />}
              {verified && <span className="text-[10px] text-success font-bold">موثق</span>}
            </p>
          </div>
          <img src={avatar} alt={ownerName} className="w-8 h-8 rounded-full object-cover ring-2 ring-accent/30" />
        </Link>
      </div>

      {/* Image */}
      <Link to={`/property/${p.id}`} className="block relative aspect-[16/8.8] overflow-hidden mx-2 rounded-2xl">
        <img src={img} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
        <span className={cn("absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold", statusBadge.cls)}>
          {statusBadge.label}
        </span>
        <button
          onClick={(e) => { e.preventDefault(); toggle(p.id); }}
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-spring hover:scale-110"
        >
          <Heart className={cn("w-4 h-4", fav ? "fill-destructive text-destructive" : "text-foreground")} />
        </button>
      </Link>

      {/* Body */}
      <div className="p-3 pt-2 space-y-2">
        {/* Title row */}
        <div className="text-right">
          <h3 className="font-bold text-sm leading-tight truncate">{p.title}</h3>
          <p className="text-[12px] text-muted-foreground flex items-center gap-1 mt-0.5 justify-end">
            <span className="truncate">{p.district || ""}{p.district && " • "}{p.city}</span>
            <MapPin className="w-3 h-3 shrink-0" />
          </p>
        </div>

        {/* Stats row: beds | baths | size | price on left */}
        <div className="flex items-center justify-between gap-2 border-y border-border py-1.5">
          {/* Price — right side of left */}
          <div className="flex items-baseline gap-1 text-primary font-extrabold text-sm">
            <span>{smartPrice.value}</span>
            <span className="text-[10px] font-bold text-muted-foreground">{smartPrice.suffix}{period}</span>
          </div>
          {/* Stats */}
          <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {p.bathrooms ?? p.baths ?? 0}</span>
            <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {p.bedrooms ?? p.rooms ?? 0}</span>
            {(p.area || p.size) ? <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> {p.area ?? p.size}م²</span> : null}
          </div>
        </div>

        {/* Actions row — share | countdown (rent only) | contact */}
        <div className="flex items-center justify-between gap-2">
          <button onClick={handleShare} className="chip chip-default text-[11px] !py-1">
            <Share2 className="w-3.5 h-3.5" /> مشاركة
          </button>

          {/* Countdown badge in center — rent only */}
          {countdownText && (
            <span className="inline-flex items-center gap-1 bg-accent/15 text-accent border border-accent/30 px-2.5 py-1 rounded-full text-[10px] font-bold leading-tight text-center">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
              {countdownText}
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <a href="tel:+201000000000" className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center transition-base hover:scale-110">
              <Phone className="w-3.5 h-3.5" />
            </a>
            <Link to={p.owner_id ? `/chat/${p.owner_id}` : "/chats"} className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-base hover:scale-110">
              <MessageCircle className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
