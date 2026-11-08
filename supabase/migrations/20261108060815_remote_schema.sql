CREATE TABLE "public"."wonders" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"     uuid                     NOT NULL,
  "category"    text                     NOT NULL,
  "title"       text                     NOT NULL,
  "description" text,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "wonders_category_check" CHECK ((category = ANY (ARRAY['pet'::text, 'plant'::text, 'adventure'::text, 'creation'::text]))),
  CONSTRAINT "wonders_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."wonders"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."wonders"
  ADD CONSTRAINT "wonders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE POLICY "Users can create their own wonders" ON "public"."wonders"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users can delete their own wonders" ON "public"."wonders"
  FOR DELETE
  TO "authenticated"
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can update their own wonders" ON "public"."wonders"
  FOR UPDATE
  TO "authenticated"
  USING ((auth.uid() = user_id))
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users can view their own wonders" ON "public"."wonders"
  FOR SELECT
  TO "authenticated"
  USING ((auth.uid() = user_id));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."wonders" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."wonders" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."wonders" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."wonders" TO "service_role";

