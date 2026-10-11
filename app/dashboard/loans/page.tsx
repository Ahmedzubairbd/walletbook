import { getLoans } from "@/lib/actions/loan-actions"
import { LoanCard } from "@/components/loans/loan-card"
import { Button } from "@/components/ui/button"
import { Plus, Landmark, Building2, User } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/currency"
import type { Loan } from "@/lib/types/loan"

export default async function LoansPage() {
  const loans = await getLoans()

  const activeLoans = loans.filter((l: Loan) => l.status !== "paid")
  const bankLoans = loans.filter((l: Loan) => l.type === "bank_loan")
  const personalLoans = loans.filter((l: Loan) => l.type === "personal_loan")

  const totalOutstanding = activeLoans.reduce((sum: number, l: Loan) => sum + Number(l.outstanding_amount), 0)
  const totalMonthly = activeLoans.reduce((sum: number, l: Loan) => sum + Number(l.monthly_payment), 0)

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Loans</h1>
          <p className="text-muted-foreground">Track your bank loans and personal borrowings</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/loans/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Loan
          </Link>
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 lg:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 flex-shrink-0">
              <Landmark className="h-5 w-5 text-red-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Total Outstanding</p>
              <p className="text-xl font-bold text-foreground truncate">{formatCurrency(totalOutstanding)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 lg:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 flex-shrink-0">
              <Building2 className="h-5 w-5 text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Monthly Payment</p>
              <p className="text-xl font-bold text-foreground truncate">{formatCurrency(totalMonthly)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 lg:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Active Loans</p>
              <p className="text-xl font-bold text-foreground">{activeLoans.length}</p>
            </div>
          </div>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-4">
          <Landmark className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No loans yet</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Track your bank loans and personal borrowings
          </p>
          <Button asChild>
            <Link href="/dashboard/loans/new">
              <Plus className="h-4 w-4 mr-2" />
              Add First Loan
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {bankLoans.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Bank Loans</h2>
                <span className="text-sm text-muted-foreground">({bankLoans.length})</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {bankLoans.map((loan: Loan) => (
                  <LoanCard key={loan.id} loan={loan} />
                ))}
              </div>
            </div>
          )}

          {personalLoans.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Personal Loans</h2>
                <span className="text-sm text-muted-foreground">({personalLoans.length})</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {personalLoans.map((loan: Loan) => (
                  <LoanCard key={loan.id} loan={loan} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
