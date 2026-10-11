import { getTransaction, getWallets, getCategories } from "@/lib/actions/wallet-actions"
import { EditTransactionForm } from "@/components/wallet/edit-transaction-form"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [transaction, wallets, categories] = await Promise.all([getTransaction(id), getWallets(), getCategories()])

  if (!transaction) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/transactions"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Transactions
        </Link>
      </div>
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Edit Transaction</h1>
        <p className="text-muted-foreground">Update transaction details</p>
      </div>
      <EditTransactionForm transaction={transaction} wallets={wallets} categories={categories} />
    </div>
  )
}
