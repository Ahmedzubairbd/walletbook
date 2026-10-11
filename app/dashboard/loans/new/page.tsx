import { CreateLoanForm } from "@/components/loans/create-loan-form"

export default function NewLoanPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Add New Loan</h1>
        <p className="text-muted-foreground">Track a bank loan or personal borrowing</p>
      </div>
      <CreateLoanForm />
    </div>
  )
}
