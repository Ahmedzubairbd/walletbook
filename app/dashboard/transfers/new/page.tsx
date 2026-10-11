import { Suspense } from "react"
import { CreateTransferForm } from "@/components/wallet/create-transfer-form"

export default function NewTransferPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">New Transfer</h1>
        <p className="text-muted-foreground">Transfer money between your wallets</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <CreateTransferForm />
      </Suspense>
    </div>
  )
}
