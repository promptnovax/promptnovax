-- ============================================
-- PNX WAITLIST TABLE - COMPLETE SETUP
-- ============================================
-- 
-- INSTRUCTIONS:
-- 1. Go to: https://supabase.com/dashboard/project/gzixgybxsqnbmecwlrat/sql/new
-- 2. Copy and paste this ENTIRE file
-- 3. Click "Run" to execute
-- 4. Verify in Table Editor that 'waitlist' table exists
-- 
-- This script is safe to run multiple times - it won't create duplicates
-- ============================================

-- Step 1: Create waitlist table (if not exists)
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'notified')),
    notified_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist(status);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies (if they exist) - This prevents "already exists" errors
DROP POLICY IF EXISTS "Allow public inserts" ON public.waitlist;
DROP POLICY IF EXISTS "Allow anon inserts" ON public.waitlist;
DROP POLICY IF EXISTS "Allow authenticated inserts" ON public.waitlist;
DROP POLICY IF EXISTS "Users can read own data" ON public.waitlist;
DROP POLICY IF EXISTS "Service role full access" ON public.waitlist;
DROP POLICY IF EXISTS "Allow public waitlist signups" ON public.waitlist;
DROP POLICY IF EXISTS "Public insert access" ON public.waitlist;

-- Step 5: Create policies for anonymous inserts (for coming soon page)
CREATE POLICY "Allow anon inserts" ON public.waitlist
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Step 6: Allow authenticated users to insert
CREATE POLICY "Allow authenticated inserts" ON public.waitlist
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Step 7: Allow service role full access (for admin operations)
CREATE POLICY "Service role full access" ON public.waitlist
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Step 8: Create function to get waitlist stats (optional, for admin dashboard)
CREATE OR REPLACE FUNCTION public.get_waitlist_stats()
RETURNS TABLE (
    total_count BIGINT,
    pending_count BIGINT,
    confirmed_count BIGINT,
    notified_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_count,
        COUNT(*) FILTER (WHERE status = 'pending')::BIGINT as pending_count,
        COUNT(*) FILTER (WHERE status = 'confirmed')::BIGINT as confirmed_count,
        COUNT(*) FILTER (WHERE status = 'notified')::BIGINT as notified_count
    FROM public.waitlist;
END;
$$;

-- Step 9: Grant execute permission on function
GRANT EXECUTE ON FUNCTION public.get_waitlist_stats() TO authenticated, anon;

-- Step 9.5: Create function to mark all waitlist users as notified (for launch day)
CREATE OR REPLACE FUNCTION public.notify_waitlist_launch()
RETURNS TABLE (
    total_notified BIGINT,
    notification_status TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    notified_count BIGINT;
BEGIN
    -- Update all pending users to 'notified' status and set notified_at timestamp
    UPDATE public.waitlist
    SET 
        status = 'notified',
        notified_at = NOW()
    WHERE status = 'pending';
    
    GET DIAGNOSTICS notified_count = ROW_COUNT;
    
    RETURN QUERY
    SELECT 
        notified_count as total_notified,
        'success'::TEXT as notification_status;
    
    RAISE NOTICE '✅ Launch notifications triggered for % users', notified_count;
END;
$$;

-- Grant execute permission on notification function
GRANT EXECUTE ON FUNCTION public.notify_waitlist_launch() TO authenticated, anon;

-- Step 10: Add comment to table
COMMENT ON TABLE public.waitlist IS 'PNX Coming Soon waitlist - stores email addresses of users who joined the waitlist';

-- Step 11: Verify table creation (this will show the table structure)
DO $$
BEGIN
    RAISE NOTICE '✅ Waitlist table setup completed successfully!';
    RAISE NOTICE '📊 Table: public.waitlist';
    RAISE NOTICE '🔒 RLS: Enabled';
    RAISE NOTICE '📝 Policies: Created for anon, authenticated, and service_role';
END $$;

-- Optional: View table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'waitlist'
ORDER BY ordinal_position;
