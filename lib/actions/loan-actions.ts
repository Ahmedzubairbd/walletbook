"use server";

// Run this SQL in your Supabase SQL editor to create the loans table:
// CREATE TABLE loans (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
//   name text NOT NULL,
//   type text NOT NULL CHECK (type IN ('bank_loan', 'personal_loan')),
//   lender_name text NOT NULL,
//   principal_amount decimal(15,2) NOT NULL DEFAULT 0,
//   outstanding_amount decimal(15,2) NOT NULL DEFAULT 0,
//   interest_rate decimal(5,2) NOT NULL DEFAULT 0,
//   monthly_payment decimal(15,2) NOT NULL DEFAULT 0,
//   start_date date NOT NULL,
//   due_date date,
//   currency text NOT NULL DEFAULT 'BDT',
//   status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paid', 'overdue')),
//   notes text,
//   bank_institution text,
//   collateral text,
//   created_at timestamptz DEFAULT now(),
//   updated_at timestamptz DEFAULT now()
// );
// ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Users can manage their own loans" ON loans
//   FOR ALL USING (auth.uid() = user_id);

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Loan } from "@/lib/types/loan";

export async function getLoans(): Promise<Loan[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("loans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getLoan(id: string): Promise<Loan | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("loans").select("*").eq("id", id).eq("user_id", user.id).single();

  if (error) return null;
  return data;
}

export async function createLoan(loan: Omit<Loan, "id" | "user_id" | "created_at" | "updated_at">): Promise<Loan> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("loans")
    .insert({ ...loan, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/dashboard/loans");
  return data;
}

export async function updateLoan(id: string, updates: Partial<Loan>): Promise<Loan> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("loans")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/dashboard/loans");
  return data;
}

export async function deleteLoan(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("loans").delete().eq("id", id).eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/dashboard/loans");
}
