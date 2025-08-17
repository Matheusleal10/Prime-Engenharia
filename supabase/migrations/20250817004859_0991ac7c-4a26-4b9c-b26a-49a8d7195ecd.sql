-- Fix RLS: block anonymous inserts and allow only authenticated users
-- 1) Drop permissive anonymous insert policy
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

-- 2) Allow only authenticated users to insert leads
CREATE POLICY "Authenticated users can insert leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

-- Keep existing SELECT policy as-is
