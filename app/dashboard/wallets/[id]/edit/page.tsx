import { getWallet } from "@/lib/actions/wallet-actions"
import { EditWalletForm } from "@/components/wallet/edit-wallet-form"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function EditWalletPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = await getWallet(id)

  if (!wallet) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/wallets"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Wallets
        </Link>
      </div>
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Edit Wallet</h1>
        <p className="text-muted-foreground">Update your wallet details</p>
      </div>
      <EditWalletForm wallet={wallet} />
    </div>
  )
}
