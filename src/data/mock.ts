import p1 from "@/assets/property-1.jpg";
import p2 from "@/assets/property-2.jpg";
import p3 from "@/assets/property-3.jpg";
import p4 from "@/assets/property-4.jpg";
import a1 from "@/assets/avatar-1.jpg";
import a2 from "@/assets/avatar-2.jpg";

export const avatars = { sara: a1, ahmed: a2 };

export type PropertyStatus = "for_sale" | "for_rent" | "sold" | "rented";

export interface Property {
  id: string;
  title: string;
  city: string;
  area: string;
  price: number;
  currency: string;
  beds: number;
  baths: number;
  rooms: number;
  size: number;
  rating: number;
  status: PropertyStatus;
  category: "residential" | "commercial";
  type: string;
  images: string[];
  description: string;
  amenities: string[];
  owner: { name: string; avatar: string; verified: boolean; role: string };
  views: number;
  likes: number;
}

export const properties: Property[] = [
  {
    id: "1",
    title: "فيلا فاخرة بإطلالة بانورامية",
    city: "القاهرة",
    area: "التجمع الخامس",
    price: 12.5,
    currency: "م ج",
    beds: 5,
    baths: 6,
    rooms: 5,
    size: 480,
    rating: 4.9,
    status: "for_sale",
    category: "residential",
    type: "فيلا",
    images: [p1, p2, p3, p4],
    description: "فيلا مستقلة بتشطيب فاخر، إطلالة مميزة، تصميم معماري حديث مع مساحات خضراء واسعة.",
    amenities: ["حمام سباحة", "حديقة خاصة", "جراج 3 سيارات", "أمن 24 ساعة", "مصعد", "تكييف مركزي"],
    owner: { name: "م. أحمد سامي", avatar: a2, verified: true, role: "مستشار عقاري معتمد" },
    views: 2840,
    likes: 312,
  },
  {
    id: "2",
    title: "شقة دوبلكس بتشطيب راقي",
    city: "الجيزة",
    area: "الشيخ زايد",
    price: 4.85,
    currency: "م ج",
    beds: 3,
    baths: 3,
    rooms: 4,
    size: 240,
    rating: 4.8,
    status: "for_sale",
    category: "residential",
    type: "شقة",
    images: [p2, p1, p3],
    description: "شقة دوبلكس بتشطيب فاخر، إطلالة على المدينة، مساحة واسعة وتقسيم مثالي.",
    amenities: ["مصعد", "أمن", "جراج", "تكييف"],
    owner: { name: "محمود ربيع", avatar: a1, verified: true, role: "وسيط عقاري" },
    views: 1520,
    likes: 184,
  },
  {
    id: "3",
    title: "استوديو حديث بمنطقة هادئة",
    city: "أسيوط",
    area: "أسيوط الجديدة",
    price: 850,
    currency: "ألف ج",
    beds: 1,
    baths: 1,
    rooms: 1,
    size: 65,
    rating: 4.6,
    status: "for_rent",
    category: "residential",
    type: "استوديو",
    images: [p3, p2],
    description: "استوديو مفروش بالكامل، تصميم عصري، قريب من جميع الخدمات.",
    amenities: ["مفروش", "إنترنت", "أمن"],
    owner: { name: "سارة محمد", avatar: a1, verified: false, role: "مالك" },
    views: 612,
    likes: 47,
  },
  {
    id: "4",
    title: "محل تجاري بموقع مميز",
    city: "القاهرة",
    area: "وسط البلد",
    price: 35,
    currency: "ألف/شهر",
    beds: 0,
    baths: 1,
    rooms: 0,
    size: 120,
    rating: 4.7,
    status: "for_rent",
    category: "commercial",
    type: "محل",
    images: [p4, p2],
    description: "محل تجاري بواجهة كبيرة، موقع حيوي، مناسب لجميع الأنشطة.",
    amenities: ["واجهة زجاجية", "تكييف", "موقف سيارات"],
    owner: { name: "م. أحمد سامي", avatar: a2, verified: true, role: "وسيط معتمد" },
    views: 980,
    likes: 88,
  },
];

export const myProperties: Property[] = [properties[0], properties[2]];

export interface ChatThread {
  id: string;
  user: { name: string; avatar: string; verified: boolean };
  lastMessage: string;
  time: string;
  unread: number;
}

export const chatThreads: ChatThread[] = [
  { id: "1", user: { name: "م. أحمد سامي", avatar: a2, verified: true }, lastMessage: "العقار متاح للمعاينة", time: "10:24", unread: 2 },
  { id: "2", user: { name: "محمود ربيع", avatar: a1, verified: true }, lastMessage: "شكراً لتواصلك", time: "أمس", unread: 0 },
  { id: "3", user: { name: "سارة محمد", avatar: a1, verified: false }, lastMessage: "موعد مناسب", time: "الإثنين", unread: 0 },
];

export const cities = [
  "أسيوط", "القاهرة", "الجيزة", "الإسكندرية", "المنصورة", "طنطا", "الفيوم", "أسوان"
];

export const districts = [
  "مصنع سيد", "حي غرب", "حي شرق", "منطقة فريال", "الأزهر", "الكورنيش",
  "كورنيش الإبراهيمية", "محطة أسيوط", "السادات", "الحمراء", "الوليدية",
  "قلته", "ديروت", "القوصية", "منفلوط", "أبنوب",
  "الفتح", "أبو تيج", "صدفا", "الغنايم",
  "ساحل سليم", "البداري", "أسيوط الجديدة"
];

export const propertyTypes = [
  { id: "all", label: "الكل", icon: "Building2" },
  { id: "apartment", label: "شقة", icon: "Building" },
  { id: "room", label: "غرفة", icon: "BedDouble" },
  { id: "studio", label: "استوديو", icon: "Sofa" },
  { id: "house", label: "بيت", icon: "Home" },
  { id: "other", label: "سكن آخر", icon: "Hotel" },
];

export const amenitiesList = [
  "حمام سباحة", "حديقة", "جراج", "مصعد", "أمن 24س", "تكييف مركزي",
  "إنترنت", "مفروش", "بلكونة", "غاز طبيعي", "أمن", "كاميرات مراقبة"
];

export const notifications = [
  { id: "1", title: "عرض جديد على عقارك", body: "تلقيت عرضاً بسعر 12 مليون", time: "منذ 5د", unread: true },
  { id: "2", title: "تم تأكيد حجز زيارة", body: "غداً الساعة 5 مساءً", time: "منذ ساعة", unread: true },
  { id: "3", title: "تحديث على المنبه", body: "3 عقارات جديدة تطابق بحثك", time: "منذ 3 ساعات", unread: false },
];
