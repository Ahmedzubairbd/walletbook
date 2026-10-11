"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createSavingsGoal, getWallets } from "@/lib/actions/wallet-actions"
import type { Wallet } from "@/lib/types/wallet"

const colors = ["#10b981", "#2dd4bf", "#6366f1", "#8b5cf6", "#ec4899", "#f97316", "#eab308"]

export function CreateSavingsForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [wallets, setWallets] = useState<Wallet[]>([])

  const [formData, setFormData] = useState({
    name: "",
    target_amount: 0,
    current_amount: 0,
    deadline: "",
    wallet_id: null as string | null,
    icon: "piggy-bank",
    color: "#10b981",
  })

  useEffect(() => {
    const loadWallets = async () => {
      const walletsData = await getWallets()
      setWallets(walletsData.filter((w) => w.type === "savings"))
    }
    loadWallets()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || formData.target_amount <= 0) return

    setLoading(true)
    try {
      await createSavingsGoal({
        ...formData,
        deadline: formData.deadline || null,
      })
      router.push("/dashboard/savings")
      router.refresh()
    } catch (error) {
      console.error("Failed to create savings goal:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Savings Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              placeholder="e.g., Emergency Fund"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="target">Target Amount</Label>
              <Input
                id="target"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.target_amount || ""}
                onChange={(e) => setFormData({ ...formData, target_amount: Number.parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current">Current Savings</Label>
              <Input
                id="current"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.current_amount || ""}
                onChange={(e) => setFormData({ ...formData, current_amount: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deadline">Target Date (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Linked Savings Wallet (Optional)</Label>
              <Select
                value={formData.wallet_id || "none"}
                onValueChange={(value) => setFormData({ ...formData, wallet_id: value === "none" ? null : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No linked wallet</SelectItem>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all"
                  style={{
                    backgroundColor: color,
                    ringColor: formData.color === color ? color : "transparent",
                  }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Goal"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
