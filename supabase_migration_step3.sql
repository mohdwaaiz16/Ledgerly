-- Ledgers Table
CREATE TABLE public.ledgers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  ledger_name TEXT NOT NULL,
  from_date DATE,
  to_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ledger_id UUID NOT NULL REFERENCES public.ledgers(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  particulars TEXT NOT NULL,
  voucher_type TEXT,
  voucher_number TEXT,
  debit NUMERIC(15,2) DEFAULT 0,
  credit NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ledgers_company_id ON public.ledgers(company_id);
CREATE INDEX idx_transactions_ledger_id ON public.transactions(ledger_id);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date);

-- Enable RLS
ALTER TABLE public.ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies for ledgers
-- Users can only access ledgers whose company belongs to them
CREATE POLICY "Users can view their own ledgers" 
  ON public.ledgers FOR SELECT 
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own ledgers" 
  ON public.ledgers FOR INSERT 
  WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own ledgers" 
  ON public.ledgers FOR UPDATE 
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()))
  WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own ledgers" 
  ON public.ledgers FOR DELETE 
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));


-- Policies for transactions
-- Users can only access transactions whose ledger's company belongs to them
CREATE POLICY "Users can view their own transactions" 
  ON public.transactions FOR SELECT 
  USING (ledger_id IN (SELECT id FROM public.ledgers WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can insert their own transactions" 
  ON public.transactions FOR INSERT 
  WITH CHECK (ledger_id IN (SELECT id FROM public.ledgers WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can update their own transactions" 
  ON public.transactions FOR UPDATE 
  USING (ledger_id IN (SELECT id FROM public.ledgers WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())))
  WITH CHECK (ledger_id IN (SELECT id FROM public.ledgers WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can delete their own transactions" 
  ON public.transactions FOR DELETE 
  USING (ledger_id IN (SELECT id FROM public.ledgers WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())));
