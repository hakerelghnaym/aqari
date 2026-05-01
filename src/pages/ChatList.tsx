import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { ShieldCheck, MessageSquareText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import avatarFallback from "@/assets/avatar-1.jpg";

interface ChatPreview {
  id: string;
  other_id: string;
  other_name: string;
  other_avatar: string | null;
  other_verified: boolean;
  last_message: string;
  last_time: string | null;
  unread: number;
}

const ChatList = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data: rows } = await supabase
        .from("chats")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (!rows?.length) { setChats([]); setLoading(false); return; }

      const otherIds = rows.map(r => r.user1_id === user.id ? r.user2_id : r.user1_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, is_verified")
        .in("id", otherIds);

      const previews: ChatPreview[] = await Promise.all(
        rows.map(async (r) => {
          const otherId = r.user1_id === user.id ? r.user2_id : r.user1_id;
          const prof = profiles?.find(p => p.id === otherId);
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("chat_id", r.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          const { count: unread } = await supabase
            .from("messages")
            .select("id", { count: "exact", head: true })
            .eq("chat_id", r.id)
            .neq("sender_id", user.id)
            .neq("status", "seen");
          return {
            id: r.id,
            other_id: otherId,
            other_name: prof?.display_name || "مستخدم",
            other_avatar: prof?.avatar_url || null,
            other_verified: prof?.is_verified || false,
            last_message: lastMsg?.content || "ابدأ المحادثة",
            last_time: lastMsg?.created_at || r.updated_at,
            unread: unread || 0,
          };
        })
      );
      setChats(previews);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("chat-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "chats" }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const formatTime = (iso: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    const today = new Date();
    if (d.toDateString() === today.toDateString())
      return d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("ar-EG", { day: "2-digit", month: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <AppHeader title="الرسائل" />
      <div className="px-4 pt-3 space-y-2">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : chats.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <MessageSquareText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">لا توجد محادثات بعد</p>
          </div>
        ) : chats.map(t => (
          <Link key={t.id} to={`/chat/${t.other_id}`} className="bg-card rounded-2xl p-3 shadow-card flex items-center gap-3 justify-end hover:shadow-elevated transition-base">
            <div className="text-left shrink-0">
              <p className="text-xs text-muted-foreground">{formatTime(t.last_time)}</p>
              {t.unread > 0 && (
                <span className="inline-flex items-center justify-center mt-1 min-w-5 h-5 px-1.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold">{t.unread}</span>
              )}
            </div>
            <div className="flex-1 text-right min-w-0">
              <p className="font-bold flex items-center gap-1 justify-end">
                {t.other_name}
                {t.other_verified && <ShieldCheck className="w-4 h-4 text-success" />}
              </p>
              <p className="text-sm text-muted-foreground truncate">{t.last_message}</p>
            </div>
            <img src={t.other_avatar || avatarFallback} className="w-12 h-12 rounded-full object-cover" />
          </Link>
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default ChatList;
