import type { Transfer } from "@/lib/types/wallet"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Banknote } from "lucide-react"

interface TransfersListProps {
  transfers: Transfer[]
}

export function TransfersList({ transfers }: TransfersListProps) {
  if (transfers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
        <ArrowRight className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No transfers yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transfers.map((transfer) => (
        <Card key={transfer.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="truncate">{transfer.from_wallet?.name || "Unknown"}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{transfer.to_wallet?.name || "Unknown"}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(transfer.date).toLocaleDateString()}
                  {transfer.description && ` • ${transfer.description}`}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-foreground">${Number(transfer.amount).toLocaleString()}</p>
                {Number(transfer.fee) > 0 && (
                  <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                    <Banknote className="h-3 w-3" />${Number(transfer.fee).toLocaleString()} fee
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
