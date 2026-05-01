import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const times = ["10:00 ص", "12:00 م", "2:00 م", "4:00 م", "6:00 م", "8:00 م"];

const BookVisit = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return toast.error("اختر التاريخ والوقت");
    toast.success("تم إرسال طلب الزيارة — في انتظار التأكيد");
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader title="حجز زيارة" />
      <form onSubmit={submit} className="px-4 pt-6 space-y-5">
        <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-5 text-center">
          <Calendar className="w-10 h-10 mx-auto mb-2 text-accent" />
          <h3 className="font-bold">حدد ميعاد المعاينة</h3>
          <p className="text-xs opacity-70 mt-1">سيتم إرسال الطلب للمالك للتأكيد</p>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-card space-y-4">
          <div>
            <Label className="text-xs font-medium block text-right mb-1.5">التاريخ</Label>
            <Input type="date" value={date} onChange={e=>setDate(e.target.value)} className="h-12" />
          </div>
          <div>
            <Label className="text-xs font-medium block text-right mb-2"><Clock className="w-3 h-3 inline ml-1" /> الوقت</Label>
            <div className="grid grid-cols-3 gap-2">
              {times.map(t => (
                <button key={t} type="button" onClick={() => setTime(t)}
                  className={cn("h-11 rounded-xl text-sm font-medium transition-base", time === t ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-secondary")}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium block text-right mb-1.5">ملاحظات (اختياري)</Label>
            <Input placeholder="أي تفاصيل إضافية..." />
          </div>
        </div>

        <Button type="submit" className="w-full h-14 font-bold bg-gradient-primary text-primary-foreground rounded-2xl">
          إرسال الطلب
        </Button>
      </form>
    </div>
  );
};

export default BookVisit;
