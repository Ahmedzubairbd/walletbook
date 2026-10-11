import { getTransactions } from "@/lib/actions/wallet-actions"
import { TransactionsTable } from "@/components/wallet/transactions-table"
import { Button } from "@/components/ui/button"
import { Plus, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default async function TransactionsPage() {
  const transactions = await getTransactions()

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">Track all your income and expenses</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/transactions/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <ArrowDownLeft className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold text-success">+${totalIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <ArrowUpRight className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-destructive">-${totalExpense.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${totalIncome - totalExpense >= 0 ? "bg-success/10" : "bg-destructive/10"}`}
            >
              {totalIncome - totalExpense >= 0 ? (
                <ArrowDownLeft className="h-5 w-5 text-success" />
              ) : (
                <ArrowUpRight className="h-5 w-5 text-destructive" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Flow</p>
              <p
                className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? "text-success" : "text-destructive"}`}
              >
                {totalIncome - totalExpense >= 0 ? "+" : ""}${(totalIncome - totalExpense).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <TransactionsTable transactions={transactions} />
    </div>
  )
}
