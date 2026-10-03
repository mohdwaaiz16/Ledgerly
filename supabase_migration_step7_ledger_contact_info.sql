-- Add contact and tax information to ledgers
ALTER TABLE public.ledgers
ADD COLUMN gst_no TEXT,
ADD COLUMN email TEXT,
ADD COLUMN state TEXT,
ADD COLUMN address TEXT,
ADD COLUMN phone TEXT;
