import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data/mock";
import { useFavorites } from "@/store/favorites";
import { HeartOff } from "lucide-react";

const Favorites = () => {
  const { ids } = useFavorites();
  const list = properties.filter(p => ids.includes(p.id));

  return (
    <div className="min-h-screen bg-background pb-32">
      <AppHeader title="عقاراتي المفضلة" />
      <div className="px-4 pt-4 space-y-4">
        {list.length ? list.map(p => <PropertyCard key={p.id} property={p} />) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
              <HeartOff className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">لا يوجد عقارات في المفضلة بعد</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Favorites;
