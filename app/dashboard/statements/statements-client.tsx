"use client"

import { useState, useTransition } from "react"
import { ConsolidatedStatement } from "@/components/wallet/consolidated-statement"
import { getConsolidatedStatement } from "@/lib/actions/wallet-actions"
import type { Wallet } from "@/lib/types/wallet"

interface StatementsClientProps {
  initialEntries: Array<{
    id: string
    date: string
    type: "income" | "expense" | "transfer_in" | "transfer_out" | "fee"
    description: string
    wallet_name: string
    wallet_id: string
    category?: string
    amount: number
    currency: string
    related_wallet?: string
  }>
  initialSummary: {
    opening_balance: number
    total_income: number
    total_expense: number
    total_transfers_in: number
    total_transfers_out: number
    total_fees: number
    closing_balance: number
  }
  wallets: Wallet[]
  initialDateRange: { start: string; end: string }
}

export function StatementsClient({ initialEntries, initialSummary, wallets, initialDateRange }: StatementsClientProps) {
  const [entries, setEntries] = useState(initialEntries)
  const [summary, setSummary] = useState(initialSummary)
  const [dateRange, setDateRange] = useState(initialDateRange)
  const [isPending, startTransition] = useTransition()

  const handleFilterChange = async (filters: {
    startDate: string
    endDate: string
    walletId?: string
    type?: string
  }) => {
    startTransition(async () => {
      const newStatement = await getConsolidatedStatement(filters.startDate, filters.endDate)
      setEntries(newStatement.combined)
      setSummary(newStatement.summary)
      setDateRange({ start: filters.startDate, end: filters.endDate })
    })
  }

  return (
    <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
      <ConsolidatedStatement
        entries={entries}
        summary={summary}
        wallets={wallets}
        onFilterChange={handleFilterChange}
        dateRange={dateRange}
      />
    </div>
  )
}
