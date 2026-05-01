import { PageShell, SectionCard } from "@/components/PageShell";
import { Star } from "lucide-react";

const reviews = [
  { id: 1, p: "فيلا التجمع", r: 5, t: "تجربة ممتازة، مالك متعاون والعقار مطابق للوصف." },
  { id: 2, p: "شقة الشيخ زايد", r: 4, t: "موقع جيد لكن بحاجة لبعض التحسينات." },
];

const MyReviews = () => (
  <PageShell title="تقييماتي">
    {reviews.map(rv => (
      <SectionCard key={rv.id}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < rv.r ? "fill-accent text-accent" : "text-muted"}`} />)}</div>
          <p className="text-xs font-bold">{rv.p}</p>
        </div>
        <p className="text-[11px] text-muted-foreground text-right">{rv.t}</p>
      </SectionCard>
    ))}
  </PageShell>
);

export default MyReviews;
