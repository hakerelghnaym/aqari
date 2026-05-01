import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { PropertyCard } from "@/components/PropertyCard";
import { BottomNav } from "@/components/BottomNav";
import { properties } from "@/data/mock";
import { cn } from "@/lib/utils";

const sorts = [
  { id: "newest", label: "الأحدث" },
  { id: "price_desc", label: "السعر ↓" },
  { id: "price_asc", label: "السعر ↑" },
  { id: "views", label: "الأكثر مشاهدة" },
];

const Search = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState("newest");

  return (
    <div className="min-h-screen bg-background pb-32">
      <AppHeader title="نتائج البحث" subtitle="أسيوط" rightAction={
        <button onClick={() => navigate("/filters")} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      } />

      <div className="px-4 pt-3 space-y-3">
        <div className="relative">
          <SearchIcon className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="ابحث عن مدينة أو حي..." className="w-full h-12 pr-11 rounded-2xl bg-muted border-0 text-sm text-right" />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {sorts.map(s => (
            <button key={s.id} onClick={() => setSort(s.id)} className={cn("chip whitespace-nowrap shrink-0", sort === s.id ? "chip-active" : "chip-default")}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {properties.map(p => <PropertyCard key={p.id} property={p} />)}
      </div>

      <BottomNav />
    </div>
  );
};

export default Search;
