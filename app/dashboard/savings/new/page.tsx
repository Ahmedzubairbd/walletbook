import { CreateSavingsForm } from "@/components/wallet/create-savings-form"

export default function NewSavingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">New Savings Goal</h1>
        <p className="text-muted-foreground">Set a target to save towards</p>
      </div>

      <CreateSavingsForm />
    </div>
  )
}
