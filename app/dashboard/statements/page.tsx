import { getConsolidatedStatement, getWallets } from "@/lib/actions/wallet-actions"
import { StatementsClient } from "./statements-client"

export default async function StatementsPage() {
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]

  const [statement, wallets] = await Promise.all([getConsolidatedStatement(startDate, endDate), getWallets()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Consolidated Statement</h1>
        <p className="text-muted-foreground">View all wallet transactions in one unified statement</p>
      </div>

      <StatementsClient
        initialEntries={statement.combined}
        initialSummary={statement.summary}
        wallets={wallets}
        initialDateRange={{ start: startDate, end: endDate }}
      />
    </div>
  )
}
