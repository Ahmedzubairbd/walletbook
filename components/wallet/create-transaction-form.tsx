"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createTransaction, getWallets, getCategories, createCategory } from "@/lib/actions/wallet-actions"
import type { Wallet, Category } from "@/lib/types/wallet"
import { Plus, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function CreateTransactionForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    wallet_id: "",
    category_id: null as string | null,
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const loadData = async () => {
      const [walletsData, categoriesData] = await Promise.all([getWallets(), getCategories()])
      setWallets(walletsData)
      setCategories(categoriesData)
      if (walletsData.length > 0) {
        setFormData((prev) => ({ ...prev, wallet_id: walletsData[0].id }))
      }
    }
    loadData()
  }, [])

  const filteredCategories = categories.filter((c) => c.type === formData.type)

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return
    try {
      const newCategory = await createCategory({
        name: newCategoryName,
        type: formData.type,
        icon: "circle",
        color: "#6366f1",
      })
      setCategories([...categories, newCategory])
      setFormData({ ...formData, category_id: newCategory.id })
      setNewCategoryName("")
      setShowNewCategory(false)
    } catch (error) {
      console.error("Failed to create category:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.wallet_id || formData.amount <= 0) return

    setLoading(true)
    try {
      await createTransaction(formData)
      router.push("/dashboard/transactions")
      router.refresh()
    } catch (error) {
      console.error("Failed to create transaction:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type Toggle */}
          <Tabs
            value={formData.type}
            onValueChange={(v) => setFormData({ ...formData, type: v as "income" | "expense", category_id: null })}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense" className="gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Expense
              </TabsTrigger>
              <TabsTrigger value="income" className="gap-2">
                <ArrowDownLeft className="h-4 w-4" />
                Income
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="text-2xl h-14"
              value={formData.amount || ""}
              onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Wallet</Label>
              <Select
                value={formData.wallet_id}
                onValueChange={(value) => setFormData({ ...formData, wallet_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.name} (${Number(wallet.balance).toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.category_id || ""}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value || null })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={showNewCategory} onOpenChange={setShowNewCategory}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>New {formData.type} Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Category Name</Label>
                        <Input
                          placeholder="e.g., Groceries"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleCreateCategory} className="w-full">
                        Create Category
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a note..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : `Add ${formData.type === "income" ? "Income" : "Expense"}`}
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
