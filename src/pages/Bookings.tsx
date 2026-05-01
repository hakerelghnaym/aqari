import { AppHeader } from "@/components/AppHeader";
import { Calendar, MapPin, Clock } from "lucide-react";
import { properties } from "@/data/mock";

const bookings = [
  { id: 1, status: "confirmed", date: "غداً 5:00 م", property: properties[0] },
  { id: 2, status: "pending", date: "الإثنين 12:00 م", property: properties[1] },
  { id: 3, status: "completed", date: "20 أبريل", property: properties[2] },
];

const labels: any = {
  confirmed: { txt: "مؤكد", cls: "bg-success/15 text-success" },
  pending: { txt: "بانتظار التأكيد", cls: "bg-accent-soft text-accent-foreground" },
  completed: { txt: "مكتمل", cls: "bg-muted text-muted-foreground" },
};

const Bookings = () => (
  <div className="min-h-screen bg-background pb-10">
    <AppHeader title="حجوزاتي" />
    <div className="px-4 pt-4 space-y-3">
      {bookings.map(b => (
        <div key={b.id} className="bg-card rounded-2xl p-3 shadow-card">
          <div className="flex gap-3">
            <img src={b.property.images[0]} className="w-20 h-20 rounded-xl object-cover" />
            <div className="flex-1 text-right">
              <div className="flex items-start justify-between gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${labels[b.status].cls}`}>{labels[b.status].txt}</span>
                <h3 className="font-bold text-sm">{b.property.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1"><MapPin className="w-3 h-3" /> {b.property.area}</p>
              <p className="text-xs flex items-center gap-1 justify-end mt-2 text-accent font-bold"><Clock className="w-3 h-3" /> {b.date}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Bookings;
