import { getBudgets } from "@/lib/actions/wallet-actions"
import { BudgetCard } from "@/components/wallet/budget-card"
import { Button } from "@/components/ui/button"
import { Plus, Target } from "lucide-react"
import Link from "next/link"

export default async function BudgetsPage() {
  const budgets = await getBudgets()

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0)
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent), 0)
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Budgets</h1>
          <p className="text-muted-foreground">Track your spending limits</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/budgets/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Budget
          </Link>
        </Button>
      </div>

      {/* Overall Summary */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <Target className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Overall Budget Usage</p>
            <p className="text-3xl font-bold text-foreground">{overallPercentage.toFixed(0)}%</p>
          </div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${totalSpent.toLocaleString()} spent</span>
          <span>${totalBudget.toLocaleString()} total budget</span>
        </div>
      </div>

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <Target className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No budgets yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Create budgets to track your spending</p>
          <Button asChild>
            <Link href="/dashboard/budgets/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Budget
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
        </div>
      )}
    </div>
  )
}
