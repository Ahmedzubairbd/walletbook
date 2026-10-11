"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Wallet } from "@/lib/types/wallet"
import { WalletIcon, Building2, CreditCard, Smartphone, PiggyBank, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils/currency"

const walletIcons = {
  cash: WalletIcon,
  bank: Building2,
  credit_card: CreditCard,
  digital: Smartphone,
  savings: PiggyBank,
  investment: TrendingUp,
}

interface WalletCardProps {
  wallet: Wallet
  onClick?: () => void
}

export function WalletCard({ wallet, onClick }: WalletCardProps) {
  const Icon = walletIcons[wallet.type] || WalletIcon

  return (
    <Card
      className={cn("cursor-pointer transition-all hover:border-primary/50", onClick && "hover:shadow-lg")}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${wallet.color}20` }}
          >
            <Icon className="h-5 w-5" style={{ color: wallet.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{wallet.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{wallet.type.replace("_", " ")}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(Number(wallet.balance), wallet.currency)}
            </p>
            <p className="text-xs text-muted-foreground">{wallet.currency}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
