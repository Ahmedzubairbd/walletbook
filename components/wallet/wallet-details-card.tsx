"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Wallet } from "@/lib/types/wallet"
import {
  WalletIcon,
  Building2,
  CreditCard,
  Smartphone,
  PiggyBank,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash2,
  ArrowLeftRight,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { deleteWallet } from "@/lib/actions/wallet-actions"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/currency"

const walletIcons = {
  cash: WalletIcon,
  bank: Building2,
  credit_card: CreditCard,
  digital: Smartphone,
  savings: PiggyBank,
  investment: TrendingUp,
}

interface WalletDetailsCardProps {
  wallet: Wallet
}

export function WalletDetailsCard({ wallet }: WalletDetailsCardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const Icon = walletIcons[wallet.type] || WalletIcon

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this wallet?")) return
    setDeleting(true)
    try {
      await deleteWallet(wallet.id)
      router.refresh()
    } catch (error) {
      console.error("Failed to delete wallet:", error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-2" style={{ backgroundColor: wallet.color }} />
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${wallet.color}20` }}
          >
            <Icon className="h-6 w-6" style={{ color: wallet.color }} />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg truncate">{wallet.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="secondary" className="text-xs capitalize">
                {wallet.type.replace("_", " ")}
              </Badge>
              <span className="text-xs text-muted-foreground">{wallet.currency}</span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/wallets/${wallet.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/transfers/new?from=${wallet.id}`}>
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Transfer
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={handleDelete} disabled={deleting}>
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="text-2xl lg:text-3xl font-bold text-foreground">
          {formatCurrency(Number(wallet.balance), wallet.currency)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated {new Date(wallet.updated_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}
