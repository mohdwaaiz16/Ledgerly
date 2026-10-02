-- Add new ledger-specific information fields
ALTER TABLE public.ledgers
ADD COLUMN ledger_type TEXT DEFAULT 'General',
ADD COLUMN account_reference TEXT,
ADD COLUMN opening_balance NUMERIC DEFAULT 0,
ADD COLUMN opening_balance_type TEXT DEFAULT 'Debit',
ADD COLUMN currency TEXT DEFAULT 'INR (₹)',
ADD COLUMN description TEXT,
ADD COLUMN status TEXT DEFAULT 'Active';

-- Update existing records to have defaults (though DEFAULT takes care of future ones, for existing ones we explicitly set them)
UPDATE public.ledgers
SET 
  ledger_type = 'General',
  opening_balance = 0,
  opening_balance_type = 'Debit',
  currency = 'INR (₹)',
  status = 'Active'
WHERE ledger_type IS NULL;
