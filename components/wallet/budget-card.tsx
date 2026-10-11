import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Budget } from "@/lib/types/wallet"
import { cn } from "@/lib/utils"
import { Target, Calendar } from "lucide-react"

interface BudgetCardProps {
  budget: Budget
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const percentage = Math.min((Number(budget.spent) / Number(budget.amount)) * 100, 100)
  const remaining = Number(budget.amount) - Number(budget.spent)
  const isOverBudget = percentage >= 100
  const isWarning = percentage >= 80 && percentage < 100

  const daysLeft = Math.ceil((new Date(budget.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                isOverBudget ? "bg-destructive/10" : isWarning ? "bg-warning/10" : "bg-primary/10",
              )}
            >
              <Target
                className={cn(
                  "h-5 w-5",
                  isOverBudget ? "text-destructive" : isWarning ? "text-warning" : "text-primary",
                )}
              />
            </div>
            <div>
              <CardTitle className="text-base">{budget.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs capitalize">
                  {budget.period}
                </Badge>
                {budget.category && (
                  <Badge variant="outline" className="text-xs">
                    {budget.category.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">${Number(budget.spent).toLocaleString()} spent</span>
            <span className="font-medium">${Number(budget.amount).toLocaleString()}</span>
          </div>
          <Progress
            value={percentage}
            className={cn("h-2", isOverBudget && "[&>div]:bg-destructive", isWarning && "[&>div]:bg-warning")}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {daysLeft > 0 ? `${daysLeft} days left` : "Budget ended"}
          </div>
          <span className={cn("font-medium", remaining < 0 ? "text-destructive" : "text-success")}>
            {remaining >= 0 ? `$${remaining.toLocaleString()} left` : `$${Math.abs(remaining).toLocaleString()} over`}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
