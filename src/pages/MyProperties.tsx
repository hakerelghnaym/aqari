import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Search, SlidersHorizontal, Pencil, Trash2, Tag, MapPin, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const tabs = ["الكل", "للبيع", "للإيجار", "تم البيع", "تم الإيجار"];
const RENT_DAYS_OPTIONS = [1, 3, 7, 14, 30, 60, 90, 180, 365];

const MyProperties = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [active, setActive] = useState("الكل");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdownOpen, setCountdownOpen] = useState(false);
  const [pendingPropId, setPendingPropId] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState(30);
  const [settingCountdown, setSettingCountdown] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProperties = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    setProperties(data || []);
    setLoading(false);
  };

  useEffect(() => { loadProperties(); }, [user]);

  const filteredProps = properties.filter(p => {
    if (active === "الكل") return true;
    if (active === "للبيع") return p.status === "for_sale" || p.status === "sale";
    if (active === "للإيجار") return p.status === "for_rent" || p.status === "rent";
    if (active === "تم البيع") return p.status === "sold";
    if (active === "تم الإيجار") return p.status === "rented";
    return true;
  });

  const handleStatusChange = async (propId: string, newStatus: string) => {
    if (newStatus === "rented") {
      setPendingPropId(propId);
      setSelectedDays(30);
      setCountdownOpen(true);
      return;
    }
    const { error } = await supabase
      .from("properties")
      .update({ status: newStatus, rent_available_after_days: null, rent_countdown_set_at: null })
      .eq("id", propId);
    if (error) { toast.error(error.message); return; }
    toast.success("تم تحديث الحالة");
    loadProperties();
  };

  const confirmCountdown = async () => {
    if (!pendingPropId) return;
    setSettingCountdown(true);
    const { error } = await supabase
      .from("properties")
      .update({ status: "rented", rent_available_after_days: selectedDays, rent_countdown_set_at: new Date().toISOString() })
      .eq("id", pendingPropId);
    setSettingCountdown(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`تم التأجير — العداد: ${selectedDays} يوم`);
    setCountdownOpen(false);
    setPendingPropId(null);
    loadProperties();
  };

  const handleDelete = async (propId: string) => {
    setDeleting(true);
    const { error } = await supabase.from("properties").delete().eq("id", propId);
    setDeleting(false);
    setDeleteId(null);
    if (error) { toast.error(error.message); return; }
    toast.success("تم حذف العقار");
    loadProperties();
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = { for_sale: "للبيع", sale: "للبيع", for_rent: "للإيجار", rent: "للإيجار", sold: "تم البيع", rented: "تم الإيجار" };
    return map[status] || status;
  };

  const getStatusActions = (prop: any) => {
    const isRent = ["for_rent", "rent", "rented"].includes(prop.status);
    if (isRent) return [
      { label: "متاح للإيجار", value: "for_rent" },
      { label: "تم التأجير", value: "rented" },
      { label: "تحويل للبيع", value: "for_sale" },
    ];
    return [
      { label: "متاح للبيع", value: "for_sale" },
      { label: "تم البيع", value: "sold" },
      { label: "تحويل للإيجار", value: "for_rent" },
    ];
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <AppHeader title="عقاري" rightAction={
        <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <Search className="w-5 h-5" />
        </button>
      } />
      <div className="px-4 pt-3">
        <div className="flex gap-2 items-center mb-4">
          <button className="h-11 px-4 rounded-full bg-primary text-primary-foreground flex items-center gap-2 text-sm font-bold">
            <SlidersHorizontal className="w-4 h-4" /> تصفية
          </button>
          <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map(t => (
              <button key={t} onClick={() => setActive(t)} className={cn("chip whitespace-nowrap shrink-0", active === t ? "chip-active" : "chip-default")}>{t}</button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : filteredProps.length === 0 ? (
          <p className="text-center py-16 text-sm text-muted-foreground">لا توجد عقارات في هذه الفئة</p>
        ) : (
          <div className="space-y-4">
            {filteredProps.map(p => (
              <article key={p.id} className="bg-card rounded-2xl overflow-hidden shadow-card">
                <div className="flex gap-3 p-3">
                  <img src={p.images?.[0] || "/placeholder.svg"} className="w-28 h-28 rounded-xl object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                  <div className="flex-1 text-right">
                    <div className="flex items-start justify-between gap-2">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                        (p.status === "for_sale" || p.status === "sale") ? "bg-success/15 text-success" :
                        (p.status === "for_rent" || p.status === "rent") ? "bg-accent/15 text-accent" :
                        "bg-muted text-muted-foreground"
                      )}>{getStatusLabel(p.status)}</span>
                      <h3 className="font-bold leading-tight text-right">{p.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1">
                      <MapPin className="w-3 h-3" /> {p.district || p.city}
                    </p>
                    <p className="text-lg font-extrabold text-primary mt-1">{Number(p.price).toLocaleString("en-US")} ج.م</p>
                    <div className="flex gap-3 text-[11px] text-muted-foreground mt-1 justify-end">
                      <span>👁 {p.views_count || 0}</span>
                    </div>
                    {p.rent_available_after_days != null && p.rent_countdown_set_at && (() => {
                      const elapsed = Math.floor((Date.now() - new Date(p.rent_countdown_set_at).getTime()) / 86400000);
                      const left = p.rent_available_after_days - elapsed;
                      if (left <= 0) return null;
                      return (
                        <div className="flex justify-end mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full font-bold">
                            <Clock className="w-2.5 h-2.5" /> متاح بعد {left} {left === 1 ? "يوم" : "أيام"}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div className="grid grid-cols-3 border-t border-border">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-11 flex items-center justify-center gap-1.5 text-xs font-bold text-accent border-l border-border">
                        <Tag className="w-4 h-4" /> تمييز
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {getStatusActions(p).map(s => (
                        <DropdownMenuItem key={s.value} onClick={() => handleStatusChange(p.id, s.value)}>{s.label}</DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button onClick={() => navigate(`/edit-property/${p.id}`)} className="h-11 flex items-center justify-center gap-1.5 text-xs font-bold text-primary border-l border-border">
                    <Pencil className="w-4 h-4" /> تعديل
                  </button>
                  <button onClick={() => setDeleteId(p.id)} className="h-11 flex items-center justify-center gap-1.5 text-xs font-bold text-destructive">
                    <Trash2 className="w-4 h-4" /> حذف
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Dialog open={countdownOpen} onOpenChange={setCountdownOpen}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-right text-base font-extrabold">تحديد مدة انتهاء الإيجار</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <p className="text-sm text-muted-foreground text-right">سيظهر عداد تنازلي للزوار يوضح متى سيكون العقار متاحاً للإيجار مجدداً.</p>
            <p className="text-xs font-bold text-right text-foreground">العقار متاح للإيجار بعد:</p>
            <div className="grid grid-cols-3 gap-2">
              {RENT_DAYS_OPTIONS.map(d => (
                <button key={d} onClick={() => setSelectedDays(d)}
                  className={cn("p-2.5 rounded-xl text-center transition-base border",
                    selectedDays === d ? "bg-primary text-primary-foreground border-primary shadow-elevated" : "bg-muted border-transparent text-foreground")}>
                  <p className="text-base font-extrabold">{d}</p>
                  <p className="text-[10px]">{d === 1 ? "يوم" : "أيام"}</p>
                </button>
              ))}
            </div>
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-center">
              <p className="text-sm font-bold text-accent">متاح للإيجار بعد {selectedDays} {selectedDays === 1 ? "يوم" : "أيام"}</p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setCountdownOpen(false)} className="flex-1 rounded-xl">إلغاء</Button>
            <Button disabled={settingCountdown} onClick={confirmCountdown} className="flex-1 rounded-xl bg-primary text-primary-foreground font-bold">
              {settingCountdown ? <Loader2 className="w-4 h-4 animate-spin" /> : "تأكيد التأجير"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-right text-base font-extrabold">حذف العقار</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground text-right py-2">هل أنت متأكد؟ لا يمكن التراجع عن هذه الخطوة.</p>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1 rounded-xl">إلغاء</Button>
            <Button disabled={deleting} onClick={() => deleteId && handleDelete(deleteId)} className="flex-1 rounded-xl bg-destructive text-destructive-foreground font-bold">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default MyProperties;
