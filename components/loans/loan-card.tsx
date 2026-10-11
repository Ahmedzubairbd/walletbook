"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Building2, User, MoreVertical, Trash2, Calendar, TrendingDown, Percent } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { deleteLoan } from "@/lib/actions/loan-actions";
import { getInstitutionById } from "@/lib/data/bd-institutions";
import { useRouter } from "next/navigation";
import type { Loan } from "@/lib/types/loan";

interface LoanCardProps {
  loan: Loan;
}

const statusConfig = {
  active: { label: "Active", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  paid: { label: "Paid", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export function LoanCard({ loan }: LoanCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const institution = loan.bank_institution ? getInstitutionById(loan.bank_institution) : null;
  const paidAmount = loan.principal_amount - loan.outstanding_amount;
  const progressPercent =
    loan.principal_amount > 0 ? Math.min(100, (paidAmount / loan.principal_amount) * 100) : 0;
  const status = statusConfig[loan.status];

  const handleDelete = async () => {
    if (!confirm("Delete this loan?")) return;
    setDeleting(true);
    try {
      await deleteLoan(loan.id);
      router.refresh();
    } catch {
      setDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Top color bar — institution color or type color */}
      <div
        className="h-1.5"
        style={{
          background: institution
            ? `linear-gradient(90deg, ${institution.primaryColor}, ${institution.secondaryColor})`
            : loan.type === "bank_loan"
              ? "linear-gradient(90deg, #1a3a6c, #2e86c1)"
              : "linear-gradient(90deg, #7c3aed, #a78bfa)",
        }}
      />

      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 min-w-0">
            {/* Institution badge */}
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{
                background: institution
                  ? `linear-gradient(135deg, ${institution.primaryColor}, ${institution.secondaryColor})`
                  : loan.type === "bank_loan"
                    ? "#1a3a6c"
                    : "#7c3aed",
              }}
            >
              {institution ? (
                institution.shortName.slice(0, 3)
              ) : loan.type === "bank_loan" ? (
                <Building2 className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">{loan.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{loan.lender_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge
              className={status.className}
              variant="outline"
            >
              {status.label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-destructive" onClick={handleDelete} disabled={deleting}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Type badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {loan.type === "bank_loan" ? "Bank Loan" : "Personal Loan"}
          </Badge>
          {institution && (
            <Badge variant="outline" className="text-xs">
              {institution.name}
            </Badge>
          )}
        </div>

        {/* Outstanding amount */}
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Outstanding Amount</p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(loan.outstanding_amount, loan.currency)}
          </p>
          <p className="text-xs text-muted-foreground">
            of {formatCurrency(loan.principal_amount, loan.currency)} principal
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Paid: {formatCurrency(paidAmount, loan.currency)}</span>
            <span>{progressPercent.toFixed(0)}% done</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="flex items-center gap-2">
            <Percent className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Interest Rate</p>
              <p className="text-sm font-medium">{loan.interest_rate}% p.a.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Monthly EMI</p>
              <p className="text-sm font-medium">{formatCurrency(loan.monthly_payment, loan.currency)}</p>
            </div>
          </div>
        </div>

        {/* Due date */}
        {loan.due_date && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-3">
            <Calendar className="h-3.5 w-3.5" />
            <span>Due: {new Date(loan.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
