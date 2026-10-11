import { CreateTransactionForm } from "@/components/wallet/create-transaction-form"

export default function NewTransactionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add Transaction</h1>
        <p className="text-muted-foreground">Record a new income or expense</p>
      </div>

      <CreateTransactionForm />
    </div>
  )
}
