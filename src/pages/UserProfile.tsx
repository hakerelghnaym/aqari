import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ShieldCheck, Star, MapPin, MessageSquare, Building2, CheckCircle2, Eye, Award, Loader2, Send } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { PropertyCard } from "@/components/PropertyCard";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import avatarFallback from "@/assets/avatar-1.jpg";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  is_verified: boolean;
  rating: number | null;
  created_at: string;
}

interface Review {
  id: string;
  reviewer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer?: { display_name: string | null; avatar_url: string | null };
}

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [props, setProps] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalViews: 0, sales: 0 });

  // review form
  const [myRating, setMyRating] = useState(5);
  const [myComment, setMyComment] = useState("");
  const [posting, setPosting] = useState(false);

  const loadAll = async () => {
    if (!id) return;
    setLoading(true);
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    setProfile(prof as Profile | null);

    const { data: properties } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    setProps(properties || []);

    const totalViews = (properties || []).reduce((s, p: any) => s + (p.views_count || 0), 0);
    setStats({ totalViews, sales: 0 });

    const { data: revs } = await supabase
      .from("reviews")
      .select("*")
      .eq("owner_id", id)
      .order("created_at", { ascending: false });
    if (revs?.length) {
      const reviewerIds = revs.map(r => r.reviewer_id);
      const { data: reviewers } = await supabase
        .from("profiles").select("id, display_name, avatar_url").in("id", reviewerIds);
      setReviews(revs.map(r => ({
        ...r,
        reviewer: reviewers?.find(x => x.id === r.reviewer_id) || undefined,
      })) as Review[]);
    } else setReviews([]);

    setLoading(false);
  };

  useEffect(() => { loadAll(); }, [id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me) { navigate("/login"); return; }
    if (!id || me.id === id) { toast.error("لا يمكنك تقييم نفسك"); return; }
    setPosting(true);
    const { error } = await supabase.from("reviews").insert({
      owner_id: id, reviewer_id: me.id, rating: myRating, comment: myComment.trim() || null,
    });
    setPosting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("تم نشر تقييمك");
    setMyComment(""); setMyRating(5);
    loadAll();
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );
  if (!profile) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
      المستخدم غير موجود
    </div>
  );

  const joined = new Date(profile.created_at).toLocaleDateString("ar-EG", { month: "long", year: "numeric" });
  const isMyProfile = me?.id === profile.id;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-hero text-primary-foreground rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
        <div className="relative">
          <AppHeader title="الملف الشخصي" variant="primary" />
          <div className="px-4 pb-5 flex items-start gap-3" dir="rtl">
            <div className="relative">
              <img src={profile.avatar_url || avatarFallback} className="w-20 h-20 rounded-2xl object-cover ring-2 ring-accent/40" />
              {profile.is_verified && (
                <span className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-success flex items-center justify-center ring-2 ring-primary">
                  <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                </span>
              )}
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center gap-1.5 justify-start">
                <h2 className="text-base font-extrabold">{profile.display_name || "مستخدم"}</h2>
                {profile.is_verified && <ShieldCheck className="w-4 h-4 text-accent" />}
              </div>
              {profile.city && (
                <p className="text-[11px] text-primary-foreground/70 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-accent" /> {profile.city}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] bg-accent/20 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 text-accent fill-accent" />
                  <span className="font-bold">{avgRating}</span>
                  <span className="opacity-70">({reviews.length})</span>
                </span>
                <span className="text-[10px] bg-success/20 text-success px-2 py-0.5 rounded-full font-bold">
                  انضم {joined}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-3 mt-3 grid grid-cols-3 gap-2">
        <Stat icon={Award} label="بيعات" value={stats.sales} />
        <Stat icon={Building2} label="عقارات" value={props.length} />
        <Stat icon={Eye} label="مشاهدات" value={stats.totalViews.toLocaleString("en-US")} />
      </div>

      {/* Action */}
      {!isMyProfile && (
        <div className="px-3 mt-3">
          <Link to={`/chat/${profile.id}`} className="h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-1.5 shadow-elevated">
            <MessageSquare className="w-4 h-4" /> مراسلة
          </Link>
        </div>
      )}

      {/* Bio */}
      {profile.bio && (
        <div className="px-3 mt-3">
          <div className="bg-card rounded-xl p-3 shadow-card">
            <h3 className="text-sm font-extrabold mb-1 text-right">نبذة</h3>
            <p className="text-xs text-muted-foreground text-right leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
          </div>
        </div>
      )}

      {/* Listings */}
      <div className="px-3 mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-muted-foreground">{props.length} عقار</span>
          <h3 className="text-sm font-extrabold">عقارات نشرها</h3>
        </div>
        {props.length === 0 ? (
          <p className="text-center py-6 text-xs text-muted-foreground">لم يقم بنشر عقارات بعد</p>
        ) : (
          <div className="-mx-1 px-1 flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
            {props.map(p => <PropertyCard key={p.id} property={p} variant="carousel" />)}
          </div>
        )}
      </div>

      {/* Add Review */}
      {!isMyProfile && me && (
        <div className="px-3 mt-3">
          <form onSubmit={submitReview} className="bg-card rounded-xl p-3 shadow-card space-y-2">
            <h3 className="text-sm font-extrabold text-right">قيّم هذا المالك</h3>
            <div className="flex items-center gap-1 justify-end">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setMyRating(n)}>
                  <Star className={cn("w-6 h-6", n <= myRating ? "text-accent fill-accent" : "text-muted")} />
                </button>
              ))}
            </div>
            <Textarea value={myComment} onChange={e => setMyComment(e.target.value)} rows={2} placeholder="اكتب تعليقاً (اختياري)..." className="resize-none text-right text-sm" />
            <Button type="submit" disabled={posting} className="w-full h-10 bg-primary text-primary-foreground rounded-xl text-sm">
              {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 ml-1.5" /> نشر التقييم</>}
            </Button>
          </form>
        </div>
      )}

      {/* Reviews */}
      <div className="px-3 mt-3">
        <div className="flex items-center justify-between mb-2">
          <Link to={`/user/${id}/reviews`} className="text-[11px] text-primary font-bold">عرض الكل</Link>
          <h3 className="text-sm font-extrabold">تقييمات العملاء ({reviews.length})</h3>
        </div>
        {reviews.length === 0 ? (
          <p className="text-center py-6 text-xs text-muted-foreground">لا توجد تقييمات بعد</p>
        ) : (
          <div className="space-y-2">
            {reviews.slice(0, 3).map(r => (
              <div key={r.id} className="bg-card rounded-xl p-3 shadow-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < r.rating ? "text-accent fill-accent" : "text-muted"}`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-xs font-bold">{r.reviewer?.display_name || "مستخدم"}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                    <img src={r.reviewer?.avatar_url || avatarFallback} className="w-8 h-8 rounded-full object-cover" />
                  </div>
                </div>
                {r.comment && (
                  <p className="text-xs text-muted-foreground text-right leading-relaxed">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }: any) => (
  <div className="bg-card rounded-xl p-2.5 shadow-card text-center">
    <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center mx-auto mb-1">
      <Icon className="w-4 h-4" />
    </div>
    <p className="text-base font-extrabold leading-none">{value}</p>
    <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
  </div>
);

export default UserProfile;
