-- ===== PROPERTIES: add countdown + sponsored columns =====
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS rent_available_after_days INTEGER,
  ADD COLUMN IF NOT EXISTS rent_countdown_set_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sponsored_until TIMESTAMPTZ;

-- ===== PROFILES: ensure is_pro + pro_plan exist =====
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS pro_plan TEXT;

-- ===== SUBSCRIPTIONS TABLE =====
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  price NUMERIC NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own subscriptions" ON public.subscriptions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ===== SPONSORED ADS TABLE =====
CREATE TABLE IF NOT EXISTS public.sponsored_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  duration_days INTEGER NOT NULL DEFAULT 7,
  placement TEXT NOT NULL DEFAULT 'home_top',
  goal TEXT NOT NULL DEFAULT 'views',
  price NUMERIC NOT NULL DEFAULT 0,
  budget NUMERIC,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  calls INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sponsored_ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own ads" ON public.sponsored_ads
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all ads" ON public.sponsored_ads
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ===== REVIEWS TABLE (if not exists) =====
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(owner_id, reviewer_id)
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id AND auth.uid() != owner_id);
CREATE POLICY "Reviewers can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);
CREATE POLICY "Reviewers can delete own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = reviewer_id);
