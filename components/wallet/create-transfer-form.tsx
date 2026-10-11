"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { createTransfer, getWallets } from "@/lib/actions/wallet-actions"
import type { Wallet } from "@/lib/types/wallet"
import { ArrowRight, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function CreateTransferForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [includeFee, setIncludeFee] = useState(false)
  const [feeFromSeparateWallet, setFeeFromSeparateWallet] = useState(false)

  const [formData, setFormData] = useState({
    from_wallet_id: searchParams.get("from") || "",
    to_wallet_id: "",
    amount: 0,
    fee: 0,
    fee_wallet_id: null as string | null,
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const loadWallets = async () => {
      const walletsData = await getWallets()
      setWallets(walletsData)
      if (!formData.from_wallet_id && walletsData.length > 0) {
        setFormData((prev) => ({ ...prev, from_wallet_id: walletsData[0].id }))
      }
    }
    loadWallets()
  }, [formData.from_wallet_id])

  const fromWallet = wallets.find((w) => w.id === formData.from_wallet_id)
  const toWallet = wallets.find((w) => w.id === formData.to_wallet_id)
  const feeWallet = wallets.find((w) => w.id === formData.fee_wallet_id)

  const totalDeduction = formData.amount + (includeFee && !feeFromSeparateWallet ? formData.fee : 0)
  const hasInsufficientFunds = fromWallet && totalDeduction > Number(fromWallet.balance)
  const hasInsufficientFeeWallet = feeFromSeparateWallet && feeWallet && formData.fee > Number(feeWallet.balance)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.from_wallet_id || !formData.to_wallet_id || formData.amount <= 0) return
    if (hasInsufficientFunds || hasInsufficientFeeWallet) return

    setLoading(true)
    try {
      await createTransfer({
        ...formData,
        fee: includeFee ? formData.fee : 0,
        fee_wallet_id: includeFee && feeFromSeparateWallet ? formData.fee_wallet_id : null,
      })
      router.push("/dashboard/transfers")
      router.refresh()
    } catch (error) {
      console.error("Failed to create transfer:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>New Transfer</CardTitle>
        <CardDescription>Move money between your wallets</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* From/To Wallets */}
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Label>From Wallet</Label>
              <Select
                value={formData.from_wallet_id}
                onValueChange={(value) => setFormData({ ...formData, from_wallet_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {wallets
                    .filter((w) => w.id !== formData.to_wallet_id)
                    .map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{wallet.name}</span>
                          <span className="text-muted-foreground ml-2">${Number(wallet.balance).toLocaleString()}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted mt-6">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex-1 space-y-2">
              <Label>To Wallet</Label>
              <Select
                value={formData.to_wallet_id}
                onValueChange={(value) => setFormData({ ...formData, to_wallet_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {wallets
                    .filter((w) => w.id !== formData.from_wallet_id)
                    .map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{wallet.name}</span>
                          <span className="text-muted-foreground ml-2">${Number(wallet.balance).toLocaleString()}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Transfer Amount</Label>
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

          {/* Fee Section */}
          <div className="space-y-4 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Include Transfer Fee</Label>
                <p className="text-sm text-muted-foreground">Add a fee for this transfer (bank charges, etc.)</p>
              </div>
              <Switch checked={includeFee} onCheckedChange={setIncludeFee} />
            </div>

            {includeFee && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fee">Fee Amount</Label>
                  <Input
                    id="fee"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.fee || ""}
                    onChange={(e) => setFormData({ ...formData, fee: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Deduct fee from different wallet</Label>
                    <p className="text-sm text-muted-foreground">By default, fee is deducted from source wallet</p>
                  </div>
                  <Switch checked={feeFromSeparateWallet} onCheckedChange={setFeeFromSeparateWallet} />
                </div>

                {feeFromSeparateWallet && (
                  <div className="space-y-2">
                    <Label>Fee Wallet</Label>
                    <Select
                      value={formData.fee_wallet_id || ""}
                      onValueChange={(value) => setFormData({ ...formData, fee_wallet_id: value || null })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select wallet for fee" />
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
                )}
              </>
            )}
          </div>

          {/* Warnings */}
          {hasInsufficientFunds && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Insufficient funds in source wallet. Available: ${Number(fromWallet?.balance).toLocaleString()}
              </AlertDescription>
            </Alert>
          )}

          {hasInsufficientFeeWallet && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Insufficient funds in fee wallet. Available: ${Number(feeWallet?.balance).toLocaleString()}
              </AlertDescription>
            </Alert>
          )}

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

          {/* Summary */}
          {fromWallet && toWallet && formData.amount > 0 && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <h4 className="font-medium text-sm">Transfer Summary</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transfer Amount</span>
                  <span>${formData.amount.toLocaleString()}</span>
                </div>
                {includeFee && formData.fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span>${formData.fee.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-border pt-1 flex justify-between font-medium">
                  <span>Total from {fromWallet.name}</span>
                  <span>
                    ${(formData.amount + (includeFee && !feeFromSeparateWallet ? formData.fee : 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={
                loading ||
                hasInsufficientFunds ||
                hasInsufficientFeeWallet ||
                !formData.from_wallet_id ||
                !formData.to_wallet_id
              }
              className="flex-1"
            >
              {loading ? "Processing..." : "Complete Transfer"}
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
