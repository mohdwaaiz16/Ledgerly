-- FINAL SECURITY / RLS AUDIT MIGRATION

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 1. Companies Table Policies
-- Users can only read, update, or delete their own company.
DROP POLICY IF EXISTS "Users can view own company" ON public.companies;
CREATE POLICY "Users can view own company" ON public.companies
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own company" ON public.companies;
CREATE POLICY "Users can insert own company" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own company" ON public.companies;
CREATE POLICY "Users can update own company" ON public.companies
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own company" ON public.companies;
CREATE POLICY "Users can delete own company" ON public.companies
  FOR DELETE USING (auth.uid() = user_id);

-- 2. Ledgers Table Policies
-- Users can only access ledgers that belong to their own company
DROP POLICY IF EXISTS "Users can view own ledgers" ON public.ledgers;
CREATE POLICY "Users can view own ledgers" ON public.ledgers
  FOR SELECT USING (
    company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert own ledgers" ON public.ledgers;
CREATE POLICY "Users can insert own ledgers" ON public.ledgers
  FOR INSERT WITH CHECK (
    company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own ledgers" ON public.ledgers;
CREATE POLICY "Users can update own ledgers" ON public.ledgers
  FOR UPDATE USING (
    company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete own ledgers" ON public.ledgers;
CREATE POLICY "Users can delete own ledgers" ON public.ledgers
  FOR DELETE USING (
    company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
  );

-- 3. Transactions Table Policies
-- Users can only access transactions that belong to ledgers of their own company
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (
    ledger_id IN (
      SELECT id FROM public.ledgers WHERE company_id IN (
        SELECT id FROM public.companies WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
CREATE POLICY "Users can insert own transactions" ON public.transactions
  FOR INSERT WITH CHECK (
    ledger_id IN (
      SELECT id FROM public.ledgers WHERE company_id IN (
        SELECT id FROM public.companies WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
CREATE POLICY "Users can update own transactions" ON public.transactions
  FOR UPDATE USING (
    ledger_id IN (
      SELECT id FROM public.ledgers WHERE company_id IN (
        SELECT id FROM public.companies WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;
CREATE POLICY "Users can delete own transactions" ON public.transactions
  FOR DELETE USING (
    ledger_id IN (
      SELECT id FROM public.ledgers WHERE company_id IN (
        SELECT id FROM public.companies WHERE user_id = auth.uid()
      )
    )
  );
