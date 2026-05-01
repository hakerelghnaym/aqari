import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import avatarFallback from "@/assets/avatar-1.jpg";

const AllReviews = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data: prof } = await supabase.from("profiles").select("display_name").eq("id", id).maybeSingle();
      setProfileName(prof?.display_name || "المالك");
      const { data: revs } = await supabase.from("reviews").select("*").eq("owner_id", id).order("created_at", { ascending: false });
      if (revs?.length) {
        const ids = revs.map((r: any) => r.reviewer_id);
        const { data: reviewers } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", ids);
        setReviews(revs.map((r: any) => ({ ...r, reviewer: reviewers?.find((x: any) => x.id === r.reviewer_id) })));
      } else setReviews([]);
      setLoading(false);
    };
    load();
  }, [id]);

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div className="min-h-screen bg-background pb-8">
      <AppHeader title={`تقييمات ${profileName}`} />
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="px-3 pt-3 space-y-3">
          {/* Avg */}
          <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3 justify-center">
            <div className="text-center">
              <p className="text-4xl font-extrabold text-primary">{avg}</p>
              <div className="flex items-center gap-0.5 justify-center mt-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= Math.round(Number(avg)) ? "text-accent fill-accent" : "text-muted"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{reviews.length} تقييم</p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground">لا توجد تقييمات بعد</p>
          ) : reviews.map(r => (
            <div key={r.id} className="bg-card rounded-xl p-3 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "text-accent fill-accent" : "text-muted"}`} />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs font-bold">{r.reviewer?.display_name || "مستخدم"}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString("ar-EG")}</p>
                  </div>
                  <img src={r.reviewer?.avatar_url || avatarFallback} className="w-9 h-9 rounded-full object-cover" />
                </div>
              </div>
              {r.comment && <p className="text-xs text-muted-foreground text-right leading-relaxed">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllReviews;
