# عقاري — منصة العقارات الذكية 🏠

تطبيق ويب متكامل (PWA قابل للتثبيت على الهاتف) لإدارة وعرض العقارات السكنية والتجارية، مع قاعدة بيانات حقيقية، مصادقة، رفع صور، شات لحظي، ولوحة تحكم Admin.

---

## ✨ المميزات

- **مصادقة كاملة** (تسجيل / دخول) عبر Supabase Auth
- **قاعدة بيانات حقيقية** للعقارات، الملفات الشخصية، المفضلة، التقييمات، الشات، التنبيهات
- **رفع صور حقيقي** (حتى 6 صور لكل عقار) إلى Supabase Storage
- **فلترة متقدمة**: 23 حي بأسيوط + سكني/تجاري + بيع/إيجار + الأنواع
- **تحديد موقع المستخدم** تلقائياً
- **الوضع الداكن** قابل للتبديل ومحفوظ
- **شات لحظي** بحالات (مُرسل / مُسلَّم / مقروء)
- **مشاركة العقار** عبر تطبيقات الجوال
- **لوحة Admin** كاملة لإدارة كل شيء
- **PWA**: قابل للتثبيت على شاشة الهاتف الرئيسية كتطبيق

---

## 🚀 تشغيل المشروع محلياً

### المتطلبات
- Node.js 18+ أو Bun

### الخطوات
```bash
# 1) فك ضغط المشروع
unzip aqari-app.zip
cd aqari-app

# 2) تثبيت الحزم
npm install
# أو
bun install

# 3) تشغيل خادم التطوير
npm run dev
# يفتح على http://localhost:8080
```

---

## 🔐 إعداد متغيرات البيئة

ملف `.env` موجود مسبقاً بالقيم الحالية. إذا أردت ربطه بمشروع Supabase آخر:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

---

## 🗄️ قاعدة البيانات

كل ملفات الترحيل (Migrations) موجودة في `supabase/migrations/`. عند ربط مشروع Supabase جديد، شغّل:

```bash
npx supabase link --project-ref <PROJECT_ID>
npx supabase db push
```

### الجداول الأساسية:
- `profiles` — بيانات المستخدمين والنبذة والتقييم
- `user_roles` — أدوار (admin / user) — منفصلة لمنع تصعيد الصلاحيات
- `properties` — العقارات بكل تفاصيلها
- `favorites` — المفضلة
- `reviews` — تقييمات الملاك
- `chats` + `messages` — الشات اللحظي
- `property_alerts` — تنبيهات العقارات
- `recently_viewed` — المشاهدات الأخيرة

### Storage Buckets:
- `property-images` — صور العقارات (عام)
- `avatars` — صور المستخدمين (عام)

---

## 📱 تثبيت التطبيق على الهاتف (PWA)

بعد رفع التطبيق على استضافة (Vercel / Netlify / Lovable):

### Android (Chrome):
1. افتح رابط الموقع
2. اضغط على القائمة (⋮) → **"إضافة إلى الشاشة الرئيسية"**
3. سيظهر التطبيق بأيقونته الخاصة كأي تطبيق عادي

### iOS (Safari):
1. افتح الرابط في Safari
2. اضغط زر **المشاركة** → **"أضف إلى الشاشة الرئيسية"**

> ⚠️ ملاحظة: تثبيت PWA يعمل فقط على نسخة الإنتاج (HTTPS)، وليس داخل محرر Lovable.

---

## 🌐 الرفع على استضافة

### الخيار الأسهل: Lovable Hosting
1. افتح المشروع في Lovable
2. اضغط **Publish** → سيُنشر تلقائياً على `your-app.lovable.app`
3. يمكنك ربط دومين خاص من إعدادات المشروع

### Vercel / Netlify:
```bash
npm run build
# ثم ارفع مجلد dist/
```

---

## 👤 إنشاء حساب Admin

بعد تسجيل أول حساب من صفحة `/register`، شغّل في SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'admin')
ON CONFLICT DO NOTHING;
```

ثم سجّل دخول من `/admin/login`.

---

## 🛠️ التقنيات المستخدمة

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Supabase (Postgres + Auth + Storage + Realtime)
- **UI**: shadcn/ui + lucide-react
- **State**: React Query + Context
- **Forms**: React Hook Form + Zod

---

## 📞 الدعم

لأي مشكلة، تواصل معنا. كل التطبيق حقيقي وليس Demo — كل زر، كل خانة، كل صفحة متصلة بقاعدة البيانات الفعلية.

**صنع بـ ❤️ في Lovable**
