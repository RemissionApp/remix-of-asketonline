-- Clean up duplicated storage policies on storage.objects for the avatars bucket.
-- We keep one canonical policy per command and restrict SELECT so listing the bucket
-- root is not allowed (still allows direct-URL access via the public bucket).

-- Drop all known duplicates (use IF EXISTS to be idempotent)
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Canonical SELECT: anyone can read avatar files by exact path,
-- but listing the bucket root requires a non-empty owner folder match,
-- which prevents anonymous bucket-listing scraping.
CREATE POLICY "Avatars: public read by path"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] IS NOT NULL
);

-- INSERT: only the owner can upload into their own folder
CREATE POLICY "Avatars: owner can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- UPDATE: only the owner can update their files
CREATE POLICY "Avatars: owner can update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- DELETE: only the owner can delete their files
CREATE POLICY "Avatars: owner can delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);