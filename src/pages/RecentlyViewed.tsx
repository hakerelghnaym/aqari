import { AppHeader } from "@/components/AppHeader";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data/mock";

const RecentlyViewed = () => (
  <div className="min-h-screen bg-background pb-10">
    <AppHeader title="شوهد مؤخراً" />
    <div className="px-4 pt-4 space-y-4">
      {properties.slice().reverse().map(p => <PropertyCard key={p.id} property={p} />)}
    </div>
  </div>
);

export default RecentlyViewed;
