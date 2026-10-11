import { getTransfers } from "@/lib/actions/wallet-actions"
import { TransfersList } from "@/components/wallet/transfers-list"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeftRight, Banknote } from "lucide-react"
import Link from "next/link"

export default async function TransfersPage() {
  const transfers = await getTransfers()

  const totalTransferred = transfers.reduce((sum, t) => sum + Number(t.amount), 0)
  const totalFees = transfers.reduce((sum, t) => sum + Number(t.fee), 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transfers</h1>
          <p className="text-muted-foreground">Move money between your wallets</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/transfers/new">
            <Plus className="h-4 w-4 mr-2" />
            New Transfer
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Transfers</p>
              <p className="text-2xl font-bold text-foreground">{transfers.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
              <ArrowLeftRight className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Transferred</p>
              <p className="text-2xl font-bold text-foreground">${totalTransferred.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Banknote className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Fees Paid</p>
              <p className="text-2xl font-bold text-foreground">${totalFees.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <TransfersList transfers={transfers} />
    </div>
  )
}
