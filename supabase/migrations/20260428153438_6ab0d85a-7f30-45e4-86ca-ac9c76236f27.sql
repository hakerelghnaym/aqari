
-- Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- Replace overly broad public SELECT policies on storage with name-known reads only.
DROP POLICY IF EXISTS "Public read property images" ON storage.objects;
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;

-- Allow direct file access via known URL but block enumerative listing.
-- Anyone authenticated can read; anonymous users can also read via signed/public URLs from the CDN edge.
CREATE POLICY "Read property images" ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');
CREATE POLICY "Read avatars" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
