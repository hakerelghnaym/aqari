import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import avatarFallback from "@/assets/avatar-1.jpg";

const EditAccount = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [photo, setPhoto] = useState<string>(avatarFallback);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setName(data.display_name || "");
        setPhone(data.phone || "");
        setBio(data.bio || "");
        setCity(data.city || "");
        if (data.avatar_url) setPhoto(data.avatar_url);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      let avatar_url: string | undefined;
      if (photoFile) {
        const ext = photoFile.name.split(".").pop() || "jpg";
        const path = `${user.id}/avatar-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("avatars").upload(path, photoFile, { upsert: true });
        if (upErr) throw upErr;
        avatar_url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      }
      const { error } = await supabase.from("profiles").update({
        display_name: name.trim() || null,
        phone: phone.trim() || null,
        bio: bio.trim() || null,
        city: city.trim() || null,
        ...(avatar_url ? { avatar_url } : {}),
      }).eq("id", user.id);
      if (error) throw error;
      toast.success("تم حفظ التعديلات");
      navigate(-1);
    } catch (err: any) {
      toast.error(err.message || "تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader title="تعديل الحساب" />
      <form onSubmit={onSave} className="px-4 pt-6 space-y-5">
        <div className="flex justify-center">
          <label className="relative cursor-pointer">
            <img src={photo} className="w-28 h-28 rounded-3xl object-cover ring-4 ring-accent/30" />
            <div className="absolute bottom-1 left-1 w-9 h-9 rounded-full bg-accent flex items-center justify-center">
              <Camera className="w-4 h-4 text-accent-foreground" />
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0]; if (f) { setPhotoFile(f); setPhoto(URL.createObjectURL(f)); }
            }} />
          </label>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-card space-y-4">
          <Field label="الاسم"><Input value={name} onChange={e => setName(e.target.value)} placeholder="اسمك الكامل" /></Field>
          <Field label="رقم الهاتف"><Input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="01xxxxxxxxx" /></Field>
          <Field label="المدينة"><Input value={city} onChange={e => setCity(e.target.value)} placeholder="مثال: أسيوط" /></Field>
          <Field label="نبذة عنك (تظهر في ملفك العام)">
            <Textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} maxLength={300} placeholder="اكتب نبذة قصيرة عنك تظهر للمستخدمين..." className="resize-none" />
            <p className="text-[10px] text-muted-foreground text-left">{bio.length}/300</p>
          </Field>
        </div>

        <Button type="submit" disabled={saving} className="w-full h-14 font-bold bg-gradient-primary text-primary-foreground rounded-2xl">
          {saving ? <><Loader2 className="w-5 h-5 animate-spin ml-2" /> جارٍ الحفظ...</> : "حفظ"}
        </Button>
      </form>
    </div>
  );
};

const Field = ({ label, children }: any) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium block text-right">{label}</Label>
    {children}
  </div>
);

export default EditAccount;
