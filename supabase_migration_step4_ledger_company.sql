-- Add company fields to the ledgers table
ALTER TABLE public.ledgers
ADD COLUMN company_name TEXT,
ADD COLUMN company_address TEXT,
ADD COLUMN company_email TEXT,
ADD COLUMN company_gst_number TEXT,
ADD COLUMN company_phone TEXT,
ADD COLUMN company_pan TEXT,
ADD COLUMN company_logo_url TEXT,
ADD COLUMN company_website TEXT,
ADD COLUMN company_state TEXT,
ADD COLUMN company_pincode TEXT;

-- Backfill existing ledgers with data from their parent company
UPDATE public.ledgers l
SET 
  company_name = c.company_name,
  company_address = c.address,
  company_email = c.email,
  company_gst_number = c.gst_number,
  company_phone = c.phone,
  company_pan = c.pan,
  company_logo_url = c.logo_url,
  company_website = c.website,
  company_state = c.state,
  company_pincode = c.pincode
FROM public.companies c
WHERE l.company_id = c.id;

-- Make the essential fields NOT NULL for future integrity
ALTER TABLE public.ledgers
ALTER COLUMN company_name SET NOT NULL,
ALTER COLUMN company_address SET NOT NULL,
ALTER COLUMN company_email SET NOT NULL;

-- Note: RLS policies on 'ledgers' remain unchanged as they still rely on 'company_id'
