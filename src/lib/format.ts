// Egyptian-style price formatting per spec
// 3 digits      -> "123 جنيه"
// 4-6 digits    -> "1,000 ألف جنيه" / "100,000 ألف جنيه"
// 7+ digits     -> "1,000,000 M جنيه"
export function formatPrice(price: number | string | null | undefined): { value: string; suffix: string } {
  const n = Number(price ?? 0);
  if (!isFinite(n) || n <= 0) return { value: "0", suffix: "جنيه" };
  const s = Math.round(n).toString();
  const len = s.length;
  const withCommas = Number(s).toLocaleString("en-US");
  if (len <= 3) return { value: withCommas, suffix: "جنيه" };
  if (len <= 6) return { value: withCommas, suffix: "ألف جنيه" };
  return { value: withCommas, suffix: "M جنيه" };
}

export const PERIOD_LABEL: Record<string, string> = {
  day: "/ اليوم",
  month: "/ الشهر",
  year: "/ السنة",
};
