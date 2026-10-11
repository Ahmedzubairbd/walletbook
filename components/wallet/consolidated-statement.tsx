"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Minus,
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getCurrencySymbol, formatCurrency } from "@/lib/utils/currency"
import { StatementFilters } from "./statement-filters"
import type { Wallet as WalletType } from "@/lib/types/wallet"

interface StatementEntry {
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
}

interface StatementSummary {
  opening_balance: number
  total_income: number
  total_expense: number
  total_transfers_in: number
  total_transfers_out: number
  total_fees: number
  closing_balance: number
}

interface ConsolidatedStatementProps {
  entries: StatementEntry[]
  summary: StatementSummary
  wallets: WalletType[]
  onFilterChange: (filters: {
    startDate: string
    endDate: string
    walletId?: string
    type?: string
  }) => void
  dateRange: { start: string; end: string }
}

export function ConsolidatedStatement({
  entries,
  summary,
  wallets,
  onFilterChange,
  dateRange,
}: ConsolidatedStatementProps) {
  const [filteredEntries, setFilteredEntries] = useState(entries)
  const statementRef = useRef<HTMLDivElement>(null)

  const handleFilter = (filters: {
    startDate: string
    endDate: string
    walletId?: string
    type?: string
  }) => {
    onFilterChange(filters)

    let filtered = entries

    if (filters.walletId) {
      filtered = filtered.filter((e) => e.wallet_id === filters.walletId)
    }

    if (filters.type) {
      if (filters.type === "transfer") {
        filtered = filtered.filter((e) => e.type === "transfer_in" || e.type === "transfer_out")
      } else {
        filtered = filtered.filter((e) => e.type === filters.type)
      }
    }

    setFilteredEntries(filtered)
  }

  const handleExport = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>WalletBook Statement</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #1a1a1a; }
            h1 { font-size: 24px; margin-bottom: 8px; }
            .subtitle { color: #666; margin-bottom: 24px; }
            .summary { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 32px; }
            @media (min-width: 640px) { .summary { grid-template-columns: repeat(4, 1fr); } }
            .summary-card { padding: 16px; background: #f5f5f5; border-radius: 8px; }
            .summary-card .label { font-size: 12px; color: #666; }
            .summary-card .value { font-size: 20px; font-weight: 600; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e5e5; }
            th { background: #f5f5f5; font-weight: 600; }
            .income { color: #22c55e; }
            .expense { color: #ef4444; }
            .transfer { color: #3b82f6; }
            .fee { color: #f59e0b; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>WalletBook Consolidated Statement</h1>
          <p class="subtitle">${dateRange.start} to ${dateRange.end}</p>
          
          <div class="summary">
            <div class="summary-card">
              <div class="label">Opening Balance</div>
              <div class="value">৳${summary.opening_balance.toLocaleString()}</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Income</div>
              <div class="value income">+৳${summary.total_income.toLocaleString()}</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Expense</div>
              <div class="value expense">-৳${summary.total_expense.toLocaleString()}</div>
            </div>
            <div class="summary-card">
              <div class="label">Closing Balance</div>
              <div class="value">৳${summary.closing_balance.toLocaleString()}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Wallet</th>
                <th>Category</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filteredEntries
                .map(
                  (entry) => `
                <tr>
                  <td>${new Date(entry.date).toLocaleDateString()}</td>
                  <td class="${entry.type.includes("income") ? "income" : entry.type.includes("expense") ? "expense" : entry.type.includes("transfer") ? "transfer" : "fee"}">${entry.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</td>
                  <td>${entry.description}</td>
                  <td>${entry.wallet_name}</td>
                  <td>${entry.category || "-"}</td>
                  <td style="text-align: right;" class="${entry.type === "income" || entry.type === "transfer_in" ? "income" : "expense"}">
                    ${entry.type === "income" || entry.type === "transfer_in" ? "+" : "-"}৳${entry.amount.toLocaleString()}
                  </td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(content)
    printWindow.document.close()
    printWindow.print()
  }

  const getEntryIcon = (type: string) => {
    switch (type) {
      case "income":
        return <ArrowDownLeft className="h-4 w-4 text-success" />
      case "expense":
        return <ArrowUpRight className="h-4 w-4 text-destructive" />
      case "transfer_in":
        return <ArrowDownLeft className="h-4 w-4 text-primary" />
      case "transfer_out":
        return <ArrowUpRight className="h-4 w-4 text-primary" />
      case "fee":
        return <Minus className="h-4 w-4 text-warning" />
      default:
        return null
    }
  }

  const getEntryBadge = (type: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      income: { label: "Income", className: "bg-success/10 text-success" },
      expense: { label: "Expense", className: "bg-destructive/10 text-destructive" },
      transfer_in: { label: "Transfer In", className: "bg-primary/10 text-primary" },
      transfer_out: { label: "Transfer Out", className: "bg-primary/10 text-primary" },
      fee: { label: "Fee", className: "bg-warning/10 text-warning" },
    }
    const v = variants[type] || { label: type, className: "" }
    return <Badge className={v.className}>{v.label}</Badge>
  }

  return (
    <div className="space-y-6" ref={statementRef}>
      <StatementFilters wallets={wallets} onFilter={handleFilter} onExport={handleExport} />

      {/* Summary Cards - Responsive grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Wallet className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">Opening Balance</p>
                <p className="text-lg font-semibold truncate">{formatCurrency(summary.opening_balance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">Total Income</p>
                <p className="text-lg font-semibold text-success truncate">+{formatCurrency(summary.total_income)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">Total Expense</p>
                <p className="text-lg font-semibold text-destructive truncate">
                  -{formatCurrency(summary.total_expense + summary.total_fees)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">Closing Balance</p>
                <p className="text-lg font-semibold truncate">{formatCurrency(summary.closing_balance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfers Summary */}
      {(summary.total_transfers_in > 0 || summary.total_transfers_out > 0) && (
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Internal Transfers:</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">In:</span>{" "}
                <span className="font-medium text-success">+{formatCurrency(summary.total_transfers_in)}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Out:</span>{" "}
                <span className="font-medium text-destructive">-{formatCurrency(summary.total_transfers_out)}</span>
              </div>
              {summary.total_fees > 0 && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Fees:</span>{" "}
                  <span className="font-medium text-warning">-{formatCurrency(summary.total_fees)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statement Table */}
      <Card className="border-border bg-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Statement Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No transactions in selected period</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[80px]">Date</TableHead>
                    <TableHead className="w-[120px]">Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Description</TableHead>
                    <TableHead className="hidden md:table-cell">Wallet</TableHead>
                    <TableHead className="hidden lg:table-cell">Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-muted-foreground text-xs sm:text-sm">
                        {new Date(entry.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "hidden sm:flex h-7 w-7 items-center justify-center rounded-lg",
                              entry.type === "income" && "bg-success/10",
                              entry.type === "expense" && "bg-destructive/10",
                              (entry.type === "transfer_in" || entry.type === "transfer_out") && "bg-primary/10",
                              entry.type === "fee" && "bg-warning/10",
                            )}
                          >
                            {getEntryIcon(entry.type)}
                          </div>
                          {getEntryBadge(entry.type)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div>
                          <p className="font-medium truncate max-w-[200px]">{entry.description}</p>
                          {entry.related_wallet && (
                            <p className="text-xs text-muted-foreground">
                              {entry.type === "transfer_in" ? "From" : "To"}: {entry.related_wallet}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="truncate max-w-[100px]">
                          {entry.wallet_name}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {entry.category || "—"}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-semibold text-sm",
                          (entry.type === "income" || entry.type === "transfer_in") && "text-success",
                          (entry.type === "expense" || entry.type === "transfer_out") && "text-destructive",
                          entry.type === "fee" && "text-warning",
                        )}
                      >
                        {entry.type === "income" || entry.type === "transfer_in" ? "+" : "-"}
                        {getCurrencySymbol(entry.currency)}
                        {entry.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
