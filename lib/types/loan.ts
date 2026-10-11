export interface Loan {
  id: string;
  user_id: string;
  name: string;
  type: "bank_loan" | "personal_loan";
  lender_name: string;
  principal_amount: number;
  outstanding_amount: number;
  interest_rate: number;
  monthly_payment: number;
  start_date: string;
  due_date: string | null;
  currency: string;
  status: "active" | "paid" | "overdue";
  notes: string | null;
  bank_institution: string | null;
  collateral: string | null;
  created_at: string;
  updated_at: string;
}
