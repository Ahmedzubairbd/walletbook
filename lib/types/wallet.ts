export interface Wallet {
  id: string
  user_id: string
  name: string
  type: "cash" | "bank" | "credit_card" | "digital" | "savings" | "investment"
  currency: string
  balance: number
  icon: string
  color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  type: "income" | "expense"
  icon: string
  color: string
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  wallet_id: string
  category_id: string | null
  type: "income" | "expense"
  amount: number
  description: string | null
  date: string
  created_at: string
  wallet?: Wallet
  category?: Category
}

export interface Transfer {
  id: string
  user_id: string
  from_wallet_id: string
  to_wallet_id: string
  amount: number
  fee: number
  fee_wallet_id: string | null
  description: string | null
  date: string
  created_at: string
  from_wallet?: Wallet
  to_wallet?: Wallet
  fee_wallet?: Wallet
}

export interface Budget {
  id: string
  user_id: string
  category_id: string | null
  name: string
  amount: number
  spent: number
  period: "weekly" | "monthly" | "yearly"
  start_date: string
  end_date: string
  created_at: string
  category?: Category
}

export interface SavingsGoal {
  id: string
  user_id: string
  wallet_id: string | null
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
  icon: string
  color: string
  is_completed: boolean
  created_at: string
  wallet?: Wallet
}

export interface DashboardStats {
  totalBalance: number
  totalIncome: number
  totalExpense: number
  netFlow: number
  walletCount: number
  budgetUsage: number
  savingsProgress: number
}
