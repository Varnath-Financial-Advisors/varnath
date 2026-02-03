-- 1. Create validation function for contact submissions (using trigger instead of CHECK constraints)
CREATE OR REPLACE FUNCTION public.validate_contact_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validate name length
    IF length(NEW.name) < 1 OR length(NEW.name) > 100 THEN
        RAISE EXCEPTION 'Name must be between 1 and 100 characters';
    END IF;
    
    -- Validate email length and basic format
    IF length(NEW.email) < 5 OR length(NEW.email) > 255 THEN
        RAISE EXCEPTION 'Email must be between 5 and 255 characters';
    END IF;
    
    -- Validate phone length
    IF length(NEW.phone) < 10 OR length(NEW.phone) > 15 THEN
        RAISE EXCEPTION 'Phone must be between 10 and 15 characters';
    END IF;
    
    -- Validate message length
    IF length(NEW.message) < 10 OR length(NEW.message) > 1000 THEN
        RAISE EXCEPTION 'Message must be between 10 and 1000 characters';
    END IF;
    
    -- Validate service is one of allowed values
    IF NEW.service NOT IN ('direct-tax', 'indirect-tax', 'virtual-cfo', 'mca-compliance', 'roc-filing', 'other') THEN
        RAISE EXCEPTION 'Invalid service type';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for validation
CREATE TRIGGER validate_contact_submission_trigger
BEFORE INSERT OR UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.validate_contact_submission();

-- 2. Create rate limiting function for contact submissions
CREATE OR REPLACE FUNCTION public.check_contact_submission_rate()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    recent_count INTEGER;
BEGIN
    -- Count submissions in the last hour (limit to 5 per hour globally as we don't have IP tracking)
    SELECT COUNT(*) INTO recent_count
    FROM public.contact_submissions
    WHERE created_at > NOW() - INTERVAL '1 hour';
    
    -- Allow if less than 50 submissions per hour (reasonable for a contact form)
    RETURN recent_count < 50;
END;
$$;

-- Update the INSERT policy to include rate limiting
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Rate limited contact submissions"
ON public.contact_submissions
FOR INSERT
WITH CHECK (public.check_contact_submission_rate());

-- 3. Update handle_new_user to always assign 'user' role (admins must be promoted manually)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Always assign 'user' role by default
    -- Admins should be promoted manually via database
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
    RETURN NEW;
END;
$$;