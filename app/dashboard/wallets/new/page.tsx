import { CreateWalletForm } from "@/components/wallet/create-wallet-form"

export default function NewWalletPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add New Wallet</h1>
        <p className="text-muted-foreground">Create a new wallet to track your money</p>
      </div>

      <CreateWalletForm />
    </div>
  )
}
