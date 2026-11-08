
-- Users can view photos stored in their own folder.
CREATE POLICY "Users can view their own wonder photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'wonder-photos'
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Users can upload photos only to their own folder.
CREATE POLICY "Users can upload their own wonder photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'wonder-photos'
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Users can delete photos only from their own folder.
CREATE POLICY "Users can delete their own wonder photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'wonder-photos'
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);
