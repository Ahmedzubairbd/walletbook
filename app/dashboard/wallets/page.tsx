import { getWallets } from "@/lib/actions/wallet-actions"
import { WalletDetailsCard } from "@/components/wallet/wallet-details-card"
import { Button } from "@/components/ui/button"
import { Plus, Wallet } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/currency"

export default async function WalletsPage() {
  const wallets = await getWallets()

  const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0)

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Wallets</h1>
          <p className="text-muted-foreground">Manage all your wallets and accounts</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/wallets/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Wallet
          </Link>
        </Button>
      </div>

      {/* Summary Card - Responsive */}
      <div className="rounded-xl border border-border bg-card p-4 lg:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
            <Wallet className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Total Balance Across All Wallets</p>
            <p className="text-2xl lg:text-4xl font-bold text-foreground truncate">{formatCurrency(totalBalance)}</p>
          </div>
        </div>
      </div>

      {/* Wallets Grid - Responsive */}
      {wallets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 lg:py-16 px-4">
          <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No wallets yet</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Create your first wallet to start tracking your finances
          </p>
          <Button asChild>
            <Link href="/dashboard/wallets/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Wallet
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {wallets.map((wallet) => (
            <WalletDetailsCard key={wallet.id} wallet={wallet} />
          ))}
        </div>
      )}
    </div>
  )
}
