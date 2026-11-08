
CREATE TABLE public.wonder_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wonder_id uuid NOT NULL
    REFERENCES public.wonders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL
    REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX wonder_photos_wonder_id_idx
ON public.wonder_photos(wonder_id);

ALTER TABLE public.wonder_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wonder photos"
ON public.wonder_photos
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add photos to their own wonders"
ON public.wonder_photos
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.wonders
    WHERE id = wonder_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own wonder photos"
ON public.wonder_photos
FOR DELETE TO authenticated
USING (auth.uid() = user_id);
