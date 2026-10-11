import { StatCard } from "@/components/wallet/stat-card"
import { OverviewChart } from "@/components/wallet/overview-chart"
import { WalletCard } from "@/components/wallet/wallet-card"
import { RecentTransactions } from "@/components/wallet/recent-transactions"
import { BudgetProgress } from "@/components/wallet/budget-progress"
import {
  getDashboardStats,
  getWallets,
  getTransactions,
  getBudgets,
  getMonthlyData,
} from "@/lib/actions/wallet-actions"
import { Wallet, TrendingUp, TrendingDown, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils/currency"

export default async function DashboardPage() {
  const [stats, wallets, transactions, budgets, monthlyData] = await Promise.all([
    getDashboardStats(),
    getWallets(),
    getTransactions(5),
    getBudgets(),
    getMonthlyData(),
  ])

  const fmt = (value: number) => formatCurrency(value, "BDT", true)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your financial overview.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/dashboard/transactions/new">Add Transaction</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/transfers/new">New Transfer</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={fmt(stats.totalBalance)}
          change={`${stats.walletCount} wallets`}
          icon={Wallet}
        />
        <StatCard
          title="Income (This Month)"
          value={fmt(stats.totalIncome)}
          change={stats.netFlow >= 0 ? `+${fmt(stats.netFlow)} net` : `${fmt(stats.netFlow)} net`}
          changeType={stats.netFlow >= 0 ? "positive" : "negative"}
          icon={TrendingUp}
          iconColor="bg-success/10"
        />
        <StatCard
          title="Expenses (This Month)"
          value={fmt(stats.totalExpense)}
          icon={TrendingDown}
          iconColor="bg-destructive/10"
        />
        <StatCard
          title="Budget Used"
          value={`${stats.budgetUsage.toFixed(0)}%`}
          change={stats.budgetUsage > 80 ? "Over budget warning" : "Within budget"}
          changeType={stats.budgetUsage > 80 ? "negative" : "positive"}
          icon={Target}
        />
      </div>

      {/* Charts and Wallets */}
      <div className="grid gap-6 lg:grid-cols-3">
        <OverviewChart data={monthlyData} />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Your Wallets</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/wallets">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {wallets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">No wallets yet</p>
                <Button size="sm" asChild>
                  <Link href="/dashboard/wallets/new">Create Wallet</Link>
                </Button>
              </div>
            ) : (
              wallets.slice(0, 4).map((wallet) => <WalletCard key={wallet.id} wallet={wallet} />)
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transactions and Budgets */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentTransactions transactions={transactions} />
        <BudgetProgress budgets={budgets} />
      </div>
    </div>
  )
}
