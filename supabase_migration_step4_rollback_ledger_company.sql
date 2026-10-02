-- Rollback ledger company details snapshot
ALTER TABLE public.ledgers
DROP COLUMN IF EXISTS company_name,
DROP COLUMN IF EXISTS company_address,
DROP COLUMN IF EXISTS company_email,
DROP COLUMN IF EXISTS company_gst_number,
DROP COLUMN IF EXISTS company_phone,
DROP COLUMN IF EXISTS company_pan,
DROP COLUMN IF EXISTS company_logo_url,
DROP COLUMN IF EXISTS company_website,
DROP COLUMN IF EXISTS company_state,
DROP COLUMN IF EXISTS company_pincode;

-- RLS and other dependencies remain unchanged.
