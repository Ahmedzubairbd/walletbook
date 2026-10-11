import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/lib/types/wallet"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrencySymbol } from "@/lib/utils/currency"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/transactions">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No transactions yet</p>
          ) : (
            transactions.map((transaction) => {
              const currency = transaction.wallet?.currency || "BDT"
              const symbol = getCurrencySymbol(currency)

              return (
                <div key={transaction.id} className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      transaction.type === "income" ? "bg-success/10" : "bg-destructive/10",
                    )}
                  >
                    {transaction.type === "income" ? (
                      <ArrowDownLeft className="h-5 w-5 text-success" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {transaction.description || transaction.category?.name || "Transaction"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.wallet?.name} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      transaction.type === "income" ? "text-success" : "text-destructive",
                    )}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {symbol}
                    {Number(transaction.amount).toLocaleString()}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
