-- Company Profile System

CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  address TEXT NOT NULL,
  email TEXT NOT NULL,
  gst_number TEXT NULL,
  phone TEXT NULL,
  pan TEXT NULL,
  logo_url TEXT NULL,
  website TEXT NULL,
  state TEXT NULL,
  pincode TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create Policies for RLS
CREATE POLICY "Users can view their own companies" 
  ON public.companies FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own companies" 
  ON public.companies FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies" 
  ON public.companies FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own companies" 
  ON public.companies FOR DELETE 
  USING (auth.uid() = user_id);

-- Optional: Create an index for faster lookups by user_id
CREATE INDEX idx_companies_user_id ON public.companies(user_id);
