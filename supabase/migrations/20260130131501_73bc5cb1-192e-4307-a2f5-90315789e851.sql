-- Explicitly deny all SELECT access to contact_submissions
-- This table contains sensitive PII and should only be accessed via backend service role
CREATE POLICY "No public read access to contact submissions"
ON public.contact_submissions
FOR SELECT
USING (false);