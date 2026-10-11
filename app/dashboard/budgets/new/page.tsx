import { CreateBudgetForm } from "@/components/wallet/create-budget-form"

export default function NewBudgetPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Budget</h1>
        <p className="text-muted-foreground">Set spending limits to stay on track</p>
      </div>

      <CreateBudgetForm />
    </div>
  )
}
