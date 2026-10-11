import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Budget } from "@/lib/types/wallet"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrencySymbol } from "@/lib/utils/currency"

interface BudgetProgressProps {
  budgets: Budget[]
}

export function BudgetProgress({ budgets }: BudgetProgressProps) {
  const symbol = getCurrencySymbol("BDT")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Budget Overview</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/budgets">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No budgets set up yet</p>
          ) : (
            budgets.slice(0, 4).map((budget) => {
              const percentage = Math.min((Number(budget.spent) / Number(budget.amount)) * 100, 100)
              const isOverBudget = percentage >= 100
              const isWarning = percentage >= 80 && percentage < 100

              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{budget.name}</span>
                    <span
                      className={cn(
                        "text-muted-foreground",
                        isOverBudget && "text-destructive",
                        isWarning && "text-warning",
                      )}
                    >
                      {symbol}
                      {Number(budget.spent).toLocaleString()} / {symbol}
                      {Number(budget.amount).toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className={cn("h-2", isOverBudget && "[&>div]:bg-destructive", isWarning && "[&>div]:bg-warning")}
                  />
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
