"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Wallet, Transaction, Transfer, Budget, SavingsGoal, Category, DashboardStats } from "@/lib/types/wallet"

export async function getWallets(): Promise<Wallet[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createWallet(
  wallet: Omit<Wallet, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<Wallet> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("wallets")
    .insert({ ...wallet, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  revalidatePath("/dashboard")
  return data
}

export async function updateWallet(id: string, updates: Partial<Wallet>): Promise<Wallet> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("wallets")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  revalidatePath("/dashboard")
  return data
}

export async function deleteWallet(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("wallets").update({ is_active: false }).eq("id", id)

  if (error) throw error
  revalidatePath("/dashboard")
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase.from("categories").select("*").eq("user_id", user.id).order("name")

  if (error) throw error
  return data || []
}

export async function createCategory(category: Omit<Category, "id" | "user_id" | "created_at">): Promise<Category> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("categories")
    .insert({ ...category, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  revalidatePath("/dashboard")
  return data
}

export async function getTransactions(limit?: number): Promise<Transaction[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from("transactions")
    .select("*, wallet:wallets(*), category:categories(*)")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createTransaction(
  transaction: Omit<Transaction, "id" | "user_id" | "created_at">,
): Promise<Transaction> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Create transaction
  const { data, error } = await supabase
    .from("transactions")
    .insert({ ...transaction, user_id: user.id })
    .select()
    .single()

  if (error) throw error

  // Update wallet balance
  const balanceChange = transaction.type === "income" ? transaction.amount : -transaction.amount
  await supabase
    .rpc("update_wallet_balance", {
      wallet_id: transaction.wallet_id,
      amount_change: balanceChange,
    })
    .catch(() => {
      // Fallback: manual update
      supabase
        .from("wallets")
        .select("balance")
        .eq("id", transaction.wallet_id)
        .single()
        .then(({ data: wallet }) => {
          if (wallet) {
            supabase
              .from("wallets")
              .update({ balance: wallet.balance + balanceChange })
              .eq("id", transaction.wallet_id)
          }
        })
    })

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  return data
}

export async function getTransfers(limit?: number): Promise<Transfer[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from("transfers")
    .select("*, from_wallet:wallets!from_wallet_id(*), to_wallet:wallets!to_wallet_id(*)")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createTransfer(transfer: Omit<Transfer, "id" | "user_id" | "created_at">): Promise<Transfer> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("transfers")
    .insert({ ...transfer, user_id: user.id })
    .select()
    .single()

  if (error) throw error

  // Update source wallet (deduct amount + fee if fee comes from source)
  const feeFromSource = transfer.fee_wallet_id === transfer.from_wallet_id || !transfer.fee_wallet_id
  const sourceDeduction = feeFromSource ? transfer.amount + transfer.fee : transfer.amount

  await supabase
    .from("wallets")
    .select("balance")
    .eq("id", transfer.from_wallet_id)
    .single()
    .then(({ data: wallet }) => {
      if (wallet) {
        supabase
          .from("wallets")
          .update({ balance: wallet.balance - sourceDeduction })
          .eq("id", transfer.from_wallet_id)
      }
    })

  // Update destination wallet
  await supabase
    .from("wallets")
    .select("balance")
    .eq("id", transfer.to_wallet_id)
    .single()
    .then(({ data: wallet }) => {
      if (wallet) {
        supabase
          .from("wallets")
          .update({ balance: wallet.balance + transfer.amount })
          .eq("id", transfer.to_wallet_id)
      }
    })

  // If fee comes from separate wallet
  if (transfer.fee_wallet_id && transfer.fee_wallet_id !== transfer.from_wallet_id && transfer.fee > 0) {
    await supabase
      .from("wallets")
      .select("balance")
      .eq("id", transfer.fee_wallet_id)
      .single()
      .then(({ data: wallet }) => {
        if (wallet) {
          supabase
            .from("wallets")
            .update({ balance: wallet.balance - transfer.fee })
            .eq("id", transfer.fee_wallet_id)
        }
      })
  }

  revalidatePath("/dashboard")
  revalidatePath("/transfers")
  return data
}

export async function getBudgets(): Promise<Budget[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("budgets")
    .select("*, category:categories(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createBudget(budget: Omit<Budget, "id" | "user_id" | "created_at" | "spent">): Promise<Budget> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("budgets")
    .insert({ ...budget, user_id: user.id, spent: 0 })
    .select()
    .single()

  if (error) throw error
  revalidatePath("/dashboard")
  revalidatePath("/budgets")
  return data
}

export async function getSavingsGoals(): Promise<SavingsGoal[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("savings_goals")
    .select("*, wallet:wallets(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createSavingsGoal(
  goal: Omit<SavingsGoal, "id" | "user_id" | "created_at" | "is_completed">,
): Promise<SavingsGoal> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("savings_goals")
    .insert({ ...goal, user_id: user.id, is_completed: false })
    .select()
    .single()

  if (error) throw error
  revalidatePath("/dashboard")
  revalidatePath("/savings")
  return data
}

export async function updateSavingsGoal(id: string, updates: Partial<SavingsGoal>): Promise<SavingsGoal> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("savings_goals").update(updates).eq("id", id).select().single()

  if (error) throw error
  revalidatePath("/dashboard")
  revalidatePath("/savings")
  return data
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return {
      totalBalance: 0,
      totalIncome: 0,
      totalExpense: 0,
      netFlow: 0,
      walletCount: 0,
      budgetUsage: 0,
      savingsProgress: 0,
    }

  // Get wallets
  const { data: wallets } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", user.id)
    .eq("is_active", true)

  const totalBalance = wallets?.reduce((sum, w) => sum + Number(w.balance), 0) || 0
  const walletCount = wallets?.length || 0

  // Get this month's transactions
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: transactions } = await supabase
    .from("transactions")
    .select("type, amount")
    .eq("user_id", user.id)
    .gte("date", startOfMonth.toISOString().split("T")[0])

  const totalIncome =
    transactions?.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0) || 0
  const totalExpense =
    transactions?.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0) || 0

  // Get budgets
  const { data: budgets } = await supabase.from("budgets").select("amount, spent").eq("user_id", user.id)

  const totalBudget = budgets?.reduce((sum, b) => sum + Number(b.amount), 0) || 0
  const totalSpent = budgets?.reduce((sum, b) => sum + Number(b.spent), 0) || 0
  const budgetUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  // Get savings goals
  const { data: savingsGoals } = await supabase
    .from("savings_goals")
    .select("target_amount, current_amount")
    .eq("user_id", user.id)
    .eq("is_completed", false)

  const totalTarget = savingsGoals?.reduce((sum, g) => sum + Number(g.target_amount), 0) || 0
  const totalSaved = savingsGoals?.reduce((sum, g) => sum + Number(g.current_amount), 0) || 0
  const savingsProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  return {
    totalBalance,
    totalIncome,
    totalExpense,
    netFlow: totalIncome - totalExpense,
    walletCount,
    budgetUsage,
    savingsProgress,
  }
}

export async function getMonthlyData() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const months = []
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

    const { data: transactions } = await supabase
      .from("transactions")
      .select("type, amount")
      .eq("user_id", user.id)
      .gte("date", date.toISOString().split("T")[0])
      .lte("date", endDate.toISOString().split("T")[0])

    const income = transactions?.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0) || 0
    const expense = transactions?.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0) || 0

    months.push({
      month: date.toLocaleString("default", { month: "short" }),
      income,
      expense,
    })
  }

  return months
}

export async function getConsolidatedStatement(
  startDate?: string,
  endDate?: string,
): Promise<{
  transactions: (Transaction & { entry_type: "transaction" })[]
  transfers: (Transfer & { entry_type: "transfer" })[]
  combined: Array<{
    id: string
    date: string
    type: "income" | "expense" | "transfer_in" | "transfer_out" | "fee"
    description: string
    wallet_name: string
    wallet_id: string
    category?: string
    amount: number
    balance_after?: number
    currency: string
    related_wallet?: string
  }>
  summary: {
    opening_balance: number
    total_income: number
    total_expense: number
    total_transfers_in: number
    total_transfers_out: number
    total_fees: number
    closing_balance: number
  }
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      transactions: [],
      transfers: [],
      combined: [],
      summary: {
        opening_balance: 0,
        total_income: 0,
        total_expense: 0,
        total_transfers_in: 0,
        total_transfers_out: 0,
        total_fees: 0,
        closing_balance: 0,
      },
    }
  }

  // Default to current month if no dates provided
  const now = new Date()
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const start = startDate || defaultStart.toISOString().split("T")[0]
  const end = endDate || defaultEnd.toISOString().split("T")[0]

  // Get all wallets
  const { data: wallets } = await supabase.from("wallets").select("*").eq("user_id", user.id).eq("is_active", true)

  const walletMap = new Map(wallets?.map((w) => [w.id, w]) || [])

  // Get transactions in date range
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, wallet:wallets(*), category:categories(*)")
    .eq("user_id", user.id)
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: true })

  // Get transfers in date range
  const { data: transfers } = await supabase
    .from("transfers")
    .select("*, from_wallet:wallets!from_wallet_id(*), to_wallet:wallets!to_wallet_id(*)")
    .eq("user_id", user.id)
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: true })

  // Build combined entries
  const combined: Array<{
    id: string
    date: string
    type: "income" | "expense" | "transfer_in" | "transfer_out" | "fee"
    description: string
    wallet_name: string
    wallet_id: string
    category?: string
    amount: number
    balance_after?: number
    currency: string
    related_wallet?: string
  }> = []

  // Add transactions
  transactions?.forEach((t) => {
    combined.push({
      id: t.id,
      date: t.date,
      type: t.type as "income" | "expense",
      description: t.description || (t.type === "income" ? "Income" : "Expense"),
      wallet_name: t.wallet?.name || "Unknown",
      wallet_id: t.wallet_id,
      category: t.category?.name,
      amount: Number(t.amount),
      currency: t.wallet?.currency || "BDT",
    })
  })

  // Add transfers (each transfer creates 2-3 entries)
  transfers?.forEach((tr) => {
    // Outgoing from source wallet
    combined.push({
      id: `${tr.id}-out`,
      date: tr.date,
      type: "transfer_out",
      description: tr.description || `Transfer to ${tr.to_wallet?.name}`,
      wallet_name: tr.from_wallet?.name || "Unknown",
      wallet_id: tr.from_wallet_id,
      amount: Number(tr.amount),
      currency: tr.from_wallet?.currency || "BDT",
      related_wallet: tr.to_wallet?.name,
    })

    // Incoming to destination wallet
    combined.push({
      id: `${tr.id}-in`,
      date: tr.date,
      type: "transfer_in",
      description: tr.description || `Transfer from ${tr.from_wallet?.name}`,
      wallet_name: tr.to_wallet?.name || "Unknown",
      wallet_id: tr.to_wallet_id,
      amount: Number(tr.amount),
      currency: tr.to_wallet?.currency || "BDT",
      related_wallet: tr.from_wallet?.name,
    })

    // Fee entry if applicable
    if (tr.fee > 0) {
      const feeWallet = tr.fee_wallet_id ? walletMap.get(tr.fee_wallet_id) : tr.from_wallet
      combined.push({
        id: `${tr.id}-fee`,
        date: tr.date,
        type: "fee",
        description: `Transfer fee`,
        wallet_name: feeWallet?.name || "Unknown",
        wallet_id: tr.fee_wallet_id || tr.from_wallet_id,
        amount: Number(tr.fee),
        currency: feeWallet?.currency || "BDT",
      })
    }
  })

  // Sort by date
  combined.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Calculate summary
  const totalBalance = wallets?.reduce((sum, w) => sum + Number(w.balance), 0) || 0
  const totalIncome = combined.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0)
  const totalExpense = combined.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)
  const totalTransfersIn = combined.filter((e) => e.type === "transfer_in").reduce((sum, e) => sum + e.amount, 0)
  const totalTransfersOut = combined.filter((e) => e.type === "transfer_out").reduce((sum, e) => sum + e.amount, 0)
  const totalFees = combined.filter((e) => e.type === "fee").reduce((sum, e) => sum + e.amount, 0)

  // Estimate opening balance
  const netChange = totalIncome - totalExpense - totalFees
  const openingBalance = totalBalance - netChange

  return {
    transactions: (transactions || []).map((t) => ({ ...t, entry_type: "transaction" as const })),
    transfers: (transfers || []).map((t) => ({ ...t, entry_type: "transfer" as const })),
    combined,
    summary: {
      opening_balance: openingBalance,
      total_income: totalIncome,
      total_expense: totalExpense,
      total_transfers_in: totalTransfersIn,
      total_transfers_out: totalTransfersOut,
      total_fees: totalFees,
      closing_balance: totalBalance,
    },
  }
}

export async function getWallet(id: string): Promise<Wallet | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase.from("wallets").select("*").eq("id", id).eq("user_id", user.id).single()

  if (error) return null
  return data
}

export async function getTransaction(id: string): Promise<Transaction | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("transactions")
    .select("*, wallet:wallets(*), category:categories(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) return null
  return data
}

export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Get original transaction to calculate balance diff
  const { data: original } = await supabase.from("transactions").select("*").eq("id", id).single()

  if (!original) throw new Error("Transaction not found")

  const { data, error } = await supabase
    .from("transactions")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw error

  // Recalculate wallet balance if amount or type changed
  if (updates.amount !== undefined || updates.type !== undefined) {
    const oldChange = original.type === "income" ? original.amount : -original.amount
    const newAmount = updates.amount ?? original.amount
    const newType = updates.type ?? original.type
    const newChange = newType === "income" ? newAmount : -newAmount
    const balanceDiff = newChange - oldChange

    if (balanceDiff !== 0) {
      const { data: wallet } = await supabase.from("wallets").select("balance").eq("id", original.wallet_id).single()

      if (wallet) {
        await supabase
          .from("wallets")
          .update({ balance: wallet.balance + balanceDiff })
          .eq("id", original.wallet_id)
      }
    }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/transactions")
  return data
}

export async function deleteTransaction(id: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Get transaction to reverse balance
  const { data: transaction } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!transaction) throw new Error("Transaction not found")

  // Delete transaction
  const { error } = await supabase.from("transactions").delete().eq("id", id).eq("user_id", user.id)

  if (error) throw error

  // Reverse balance change
  const balanceChange = transaction.type === "income" ? -transaction.amount : transaction.amount
  const { data: wallet } = await supabase.from("wallets").select("balance").eq("id", transaction.wallet_id).single()

  if (wallet) {
    await supabase
      .from("wallets")
      .update({ balance: wallet.balance + balanceChange })
      .eq("id", transaction.wallet_id)
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/transactions")
}

export async function getTransfer(id: string): Promise<Transfer | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("transfers")
    .select("*, from_wallet:wallets!from_wallet_id(*), to_wallet:wallets!to_wallet_id(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) return null
  return data
}

export async function deleteTransfer(id: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Get transfer to reverse balances
  const { data: transfer } = await supabase.from("transfers").select("*").eq("id", id).eq("user_id", user.id).single()

  if (!transfer) throw new Error("Transfer not found")

  // Delete transfer
  const { error } = await supabase.from("transfers").delete().eq("id", id).eq("user_id", user.id)

  if (error) throw error

  // Reverse from_wallet (add back amount)
  const { data: fromWallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("id", transfer.from_wallet_id)
    .single()

  if (fromWallet) {
    const feeFromSource = transfer.fee_wallet_id === transfer.from_wallet_id || !transfer.fee_wallet_id
    const amountToRestore = feeFromSource ? transfer.amount + transfer.fee : transfer.amount
    await supabase
      .from("wallets")
      .update({ balance: fromWallet.balance + amountToRestore })
      .eq("id", transfer.from_wallet_id)
  }

  // Reverse to_wallet (deduct amount)
  const { data: toWallet } = await supabase.from("wallets").select("balance").eq("id", transfer.to_wallet_id).single()

  if (toWallet) {
    await supabase
      .from("wallets")
      .update({ balance: toWallet.balance - transfer.amount })
      .eq("id", transfer.to_wallet_id)
  }

  // Reverse fee wallet if separate
  if (transfer.fee_wallet_id && transfer.fee_wallet_id !== transfer.from_wallet_id && transfer.fee > 0) {
    const { data: feeWallet } = await supabase
      .from("wallets")
      .select("balance")
      .eq("id", transfer.fee_wallet_id)
      .single()

    if (feeWallet) {
      await supabase
        .from("wallets")
        .update({ balance: feeWallet.balance + transfer.fee })
        .eq("id", transfer.fee_wallet_id)
    }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/transfers")
}

export async function getBudget(id: string): Promise<Budget | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("budgets")
    .select("*, category:categories(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) return null
  return data
}

export async function updateBudget(id: string, updates: Partial<Budget>): Promise<Budget> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("budgets").update(updates).eq("id", id).select().single()

  if (error) throw error
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/budgets")
  return data
}

export async function deleteBudget(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("budgets").delete().eq("id", id)

  if (error) throw error
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/budgets")
}

export async function getSavingsGoal(id: string): Promise<SavingsGoal | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("savings_goals")
    .select("*, wallet:wallets(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) return null
  return data
}

export async function deleteSavingsGoal(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("savings_goals").delete().eq("id", id)

  if (error) throw error
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/savings")
}
