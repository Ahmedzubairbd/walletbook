"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SavingsGoal } from "@/lib/types/wallet"
import { PiggyBank, Calendar, Plus, Check } from "lucide-react"
import { updateSavingsGoal } from "@/lib/actions/wallet-actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface SavingsCardProps {
  goal: SavingsGoal
}

export function SavingsCard({ goal }: SavingsCardProps) {
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [addAmount, setAddAmount] = useState(0)
  const [loading, setLoading] = useState(false)

  const percentage = Math.min((Number(goal.current_amount) / Number(goal.target_amount)) * 100, 100)
  const remaining = Number(goal.target_amount) - Number(goal.current_amount)
  const isCompleted = goal.is_completed || percentage >= 100

  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  const handleAddFunds = async () => {
    if (addAmount <= 0) return
    setLoading(true)
    try {
      const newAmount = Number(goal.current_amount) + addAmount
      await updateSavingsGoal(goal.id, {
        current_amount: newAmount,
        is_completed: newAmount >= Number(goal.target_amount),
      })
      setShowAddFunds(false)
      setAddAmount(0)
    } catch (error) {
      console.error("Failed to add funds:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-1.5" style={{ backgroundColor: goal.color }} />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${goal.color}20` }}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" style={{ color: goal.color }} />
              ) : (
                <PiggyBank className="h-5 w-5" style={{ color: goal.color }} />
              )}
            </div>
            <div>
              <CardTitle className="text-base">{goal.name}</CardTitle>
              {goal.wallet && <p className="text-xs text-muted-foreground mt-1">Linked to {goal.wallet.name}</p>}
            </div>
          </div>
          {isCompleted && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-success/10 text-success">Completed</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">${Number(goal.current_amount).toLocaleString()} saved</span>
            <span className="font-medium">${Number(goal.target_amount).toLocaleString()}</span>
          </div>
          <Progress value={percentage} className="h-2" style={{ ["--progress-color" as string]: goal.color }} />
          <p className="text-xs text-muted-foreground text-center">{percentage.toFixed(0)}% complete</p>
        </div>

        <div className="flex items-center justify-between">
          {daysLeft !== null && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {daysLeft > 0 ? `${daysLeft} days left` : "Past deadline"}
            </div>
          )}
          {!daysLeft && <div />}

          {!isCompleted && (
            <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                  <Plus className="h-3 w-3" />
                  Add Funds
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add to {goal.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Current: ${Number(goal.current_amount).toLocaleString()} / $
                      {Number(goal.target_amount).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Remaining: ${remaining.toLocaleString()}</p>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Amount to add"
                    value={addAmount || ""}
                    onChange={(e) => setAddAmount(Number.parseFloat(e.target.value) || 0)}
                  />
                  <Button onClick={handleAddFunds} disabled={loading || addAmount <= 0} className="w-full">
                    {loading ? "Adding..." : "Add Funds"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
