import { AppHeader } from "@/components/AppHeader";
import { notifications } from "@/data/mock";
import { Bell } from "lucide-react";

const Notifications = () => (
  <div className="min-h-screen bg-background pb-10">
    <AppHeader title="الإشعارات" />
    <div className="px-4 pt-3 space-y-2">
      {notifications.map(n => (
        <div key={n.id} className={`rounded-2xl p-3 flex items-start gap-3 ${n.unread ? "bg-accent-soft" : "bg-card shadow-card"}`}>
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1 text-right">
            <p className="font-bold text-sm">{n.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
          </div>
          {n.unread && <span className="w-2 h-2 rounded-full bg-accent mt-2" />}
        </div>
      ))}
    </div>
  </div>
);

export default Notifications;
