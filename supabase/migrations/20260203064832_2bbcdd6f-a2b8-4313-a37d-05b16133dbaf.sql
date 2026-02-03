-- Fix the validate_contact_submission function to set search_path
CREATE OR REPLACE FUNCTION public.validate_contact_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
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