import { getSavingsGoals } from "@/lib/actions/wallet-actions"
import { SavingsCard } from "@/components/wallet/savings-card"
import { Button } from "@/components/ui/button"
import { Plus, PiggyBank } from "lucide-react"
import Link from "next/link"

export default async function SavingsPage() {
  const goals = await getSavingsGoals()

  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0)
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.current_amount), 0)
  const overallPercentage = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0
  const completedGoals = goals.filter(
    (g) => g.is_completed || Number(g.current_amount) >= Number(g.target_amount),
  ).length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Savings Goals</h1>
          <p className="text-muted-foreground">Track your savings progress</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/savings/new">
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Link>
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <PiggyBank className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Saved</p>
              <p className="text-2xl font-bold text-success">${totalSaved.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <PiggyBank className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Target Total</p>
              <p className="text-2xl font-bold text-foreground">${totalTarget.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
              <PiggyBank className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Goals Completed</p>
              <p className="text-2xl font-bold text-foreground">
                {completedGoals} / {goals.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <PiggyBank className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No savings goals yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Create goals to track your savings progress</p>
          <Button asChild>
            <Link href="/dashboard/savings/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <SavingsCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  )
}
