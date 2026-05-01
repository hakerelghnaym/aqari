import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Plus, X, Loader2 } from "lucide-react";
import { ASSIUT_DISTRICTS, RESIDENTIAL_TYPES, COMMERCIAL_TYPES, AMENITIES, BEDS_TYPE } from "@/lib/aqari-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CITIES = ["أسيوط", "القاهرة", "الجيزة", "الإسكندرية"];
const MAX_IMAGES = 6;

const AddProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"residential" | "commercial">("residential");
  const [status, setStatus] = useState<"sale" | "rent">("sale");
  const [rentPeriod, setRentPeriod] = useState<"day" | "month" | "year">("month");
  const [type, setType] = useState<string>("شقة");
  const [city, setCity] = useState("أسيوط");
  const [district, setDistrict] = useState(ASSIUT_DISTRICTS[0]);
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [bedsType, setBedsType] = useState<string>("غير محدد");
  const [isFurnished, setIsFurnished] = useState(false);

  const types = category === "residential" ? RESIDENTIAL_TYPES : COMMERCIAL_TYPES;

  const onPickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remain = MAX_IMAGES - imageFiles.length;
    const take = files.slice(0, remain);
    setImageFiles(p => [...p, ...take]);
    setImagePreviews(p => [...p, ...take.map(f => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeImage = (i: number) => {
    setImageFiles(s => s.filter((_, k) => k !== i));
    setImagePreviews(s => s.filter((_, k) => k !== i));
  };

  const toggleA = (a: string) =>
    setAmenities(s => (s.includes(a) ? s.filter(x => x !== a) : [...s, a]));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("يجب تسجيل الدخول أولاً"); navigate("/login"); return; }
    if (!title.trim()) { toast.error("أدخل عنوان الإعلان"); return; }
    if (!price || Number(price) <= 0) { toast.error("أدخل سعراً صحيحاً"); return; }
    if (imageFiles.length === 0) { toast.error("أضف صورة واحدة على الأقل"); return; }

    setSubmitting(true);
    try {
      // Upload images
      const urls: string[] = [];
      for (const file of imageFiles) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("property-images").upload(path, file);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("property-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }

      const insertPayload: any = {
        owner_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        category,
        status,
        rent_period: status === "rent" ? rentPeriod : null,
        type,
        city,
        district,
        address: address || null,
        price: Number(price),
        area: area ? Number(area) : null,
        bedrooms: category === "residential" ? bedrooms : 0,
        bathrooms: category === "residential" ? bathrooms : 0,
        beds_type: category === "residential" ? bedsType : null,
        is_furnished: isFurnished,
        amenities,
        images: urls,
        is_active: true,
      };

      const { error: insErr } = await supabase.from("properties").insert(insertPayload);
      if (insErr) throw insErr;

      toast.success("تم نشر العقار بنجاح ✅");
      navigate("/my-properties");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "حدث خطأ أثناء نشر العقار");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <AppHeader title="إضافة عقار جديد" />

      <form onSubmit={onSubmit} className="px-4 pt-4 space-y-5">
        {/* Images */}
        <Card title={`صور العقار (${imageFiles.length}/${MAX_IMAGES})`}>
          <div className="grid grid-cols-3 gap-2">
            {imageFiles.length < MAX_IMAGES && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted flex flex-col items-center justify-center cursor-pointer hover:bg-secondary transition-base">
                <Camera className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-[11px] text-muted-foreground">إضافة صورة</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={onPickImages} />
              </label>
            )}
            {imagePreviews.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                <img src={img} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 left-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Category & Status */}
        <Card title="التصنيف">
          <div className="grid grid-cols-2 gap-2">
            {(["residential", "commercial"] as const).map(c => (
              <button key={c} type="button" onClick={() => { setCategory(c); setType(c === "residential" ? RESIDENTIAL_TYPES[0] : COMMERCIAL_TYPES[0]); }}
                className={cn("h-11 rounded-xl text-sm font-bold transition-base", category === c ? "bg-primary text-primary-foreground" : "bg-muted")}>
                {c === "residential" ? "سكني" : "تجاري"}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["sale", "rent"] as const).map(s => (
              <button key={s} type="button" onClick={() => setStatus(s)}
                className={cn("h-10 rounded-xl text-sm font-bold transition-base", status === s ? "bg-accent text-accent-foreground" : "bg-muted")}>
                {s === "sale" ? "للبيع" : "للإيجار"}
              </button>
            ))}
          </div>
          {status === "rent" && (
            <div className="grid grid-cols-3 gap-2">
              {(["day", "month", "year"] as const).map(p => (
                <button key={p} type="button" onClick={() => setRentPeriod(p)}
                  className={cn("h-9 rounded-lg text-xs font-bold", rentPeriod === p ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  {p === "day" ? "يومي" : p === "month" ? "شهري" : "سنوي"}
                </button>
              ))}
            </div>
          )}
          <Field label="نوع العقار">
            <select value={type} onChange={e => setType(e.target.value)} className="w-full h-11 rounded-xl bg-muted border-0 px-3 text-sm text-right">
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
        </Card>

        <Card title="بيانات أساسية">
          <Field label="عنوان الإعلان"><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="مثال: شقة فاخرة بالحي الغربي" required /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="السعر (جنيه)"><Input type="number" min={0} value={price} onChange={e => setPrice(e.target.value)} placeholder="0" required /></Field>
            <Field label="المساحة (م²)"><Input type="number" min={0} value={area} onChange={e => setArea(e.target.value)} placeholder="0" /></Field>
          </div>

          {category === "residential" && (
            <>
              <Field label={`غرف النوم: ${bedrooms}`}>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <button key={n} type="button" onClick={() => setBedrooms(n)}
                      className={cn("flex-1 h-9 rounded-lg text-xs font-bold", bedrooms === n ? "bg-primary text-primary-foreground" : "bg-muted")}>
                      {n}{n === 6 ? "+" : ""}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label={`الحمامات: ${bathrooms}`}>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <button key={n} type="button" onClick={() => setBathrooms(n)}
                      className={cn("flex-1 h-9 rounded-lg text-xs font-bold", bathrooms === n ? "bg-primary text-primary-foreground" : "bg-muted")}>
                      {n}{n === 6 ? "+" : ""}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="نوع الأسرّة">
                <select value={bedsType} onChange={e => setBedsType(e.target.value)} className="w-full h-11 rounded-xl bg-muted border-0 px-3 text-sm text-right">
                  {BEDS_TYPE.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <label className="flex items-center justify-end gap-2 text-sm">
                <span>مفروش</span>
                <input type="checkbox" checked={isFurnished} onChange={e => setIsFurnished(e.target.checked)} className="w-4 h-4" />
              </label>
            </>
          )}
        </Card>

        <Card title="الموقع">
          <Field label="المحافظة">
            <select value={city} onChange={e => setCity(e.target.value)} className="w-full h-11 rounded-xl bg-muted border-0 px-3 text-sm text-right">
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="المنطقة / الحي">
            <select value={district} onChange={e => setDistrict(e.target.value)} className="w-full h-11 rounded-xl bg-muted border-0 px-3 text-sm text-right">
              {ASSIUT_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="العنوان التفصيلي"><Input value={address} onChange={e => setAddress(e.target.value)} placeholder="رقم الشارع، المبنى..." /></Field>
        </Card>

        <Card title="المرافق والمزايا">
          <div className="flex flex-wrap gap-2 justify-end">
            {AMENITIES.map(a => (
              <button key={a} type="button" onClick={() => toggleA(a)} className={cn("chip text-sm", amenities.includes(a) ? "chip-accent" : "chip-default")}>
                {amenities.includes(a) ? "✓ " : <Plus className="w-3 h-3" />}{a}
              </button>
            ))}
          </div>
        </Card>

        <Card title="الوصف">
          <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="اكتب وصفاً تفصيلياً عن العقار..." rows={4} className="resize-none" />
        </Card>

        <Button type="submit" disabled={submitting} className="w-full h-14 text-base font-bold bg-gradient-primary text-primary-foreground rounded-2xl">
          {submitting ? <><Loader2 className="w-5 h-5 animate-spin ml-2" /> جارٍ النشر...</> : "نشر العقار"}
        </Button>
      </form>
    </div>
  );
};

const Card = ({ title, children }: any) => (
  <div className="bg-card rounded-2xl p-4 shadow-card space-y-3">
    <h3 className="font-bold text-right">{title}</h3>
    {children}
  </div>
);
const Field = ({ label, children }: any) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium text-right block">{label}</Label>
    {children}
  </div>
);

export default AddProperty;
