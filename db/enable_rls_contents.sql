-- Enable Row Level Security and create policies for the `contents` table
-- Apply with psql or the supabase CLI:
-- psql "postgres://..." -f db/enable_rls_contents.sql
-- or
-- supabase db remote set <CONNECTION_STRING>
-- supabase db reset --project-ref <ref> --confirm

BEGIN;

-- Ensure the table exists before attempting to modify it
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contents') THEN
    RAISE NOTICE 'Enabling RLS and adding policies on public.contents';
  ELSE
    RAISE NOTICE 'Table public.contents not found; skip RLS enablement';
    RETURN;
  END IF;
END$$;

-- Turn on row level security
ALTER TABLE IF EXISTS public.contents ENABLE ROW LEVEL SECURITY;

-- Policy: allow authenticated users to SELECT their own rows
CREATE POLICY IF NOT EXISTS "Allow select for owners" ON public.contents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: allow authenticated users to INSERT rows where user_id matches their uid
CREATE POLICY IF NOT EXISTS "Allow insert for owners" ON public.contents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: allow authenticated users to UPDATE rows they own
CREATE POLICY IF NOT EXISTS "Allow update for owners" ON public.contents
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: allow authenticated users to DELETE rows they own
CREATE POLICY IF NOT EXISTS "Allow delete for owners" ON public.contents
  FOR DELETE
  USING (auth.uid() = user_id);

COMMIT;
