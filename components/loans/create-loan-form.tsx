"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createLoan } from "@/lib/actions/loan-actions";
import { InstitutionSelector } from "@/components/wallet/institution-selector";
import type { BDInstitution } from "@/lib/data/bd-institutions";
import { Building2, User } from "lucide-react";

const currencies = ["BDT", "USD", "EUR", "GBP", "INR"];

export function CreateLoanForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<BDInstitution | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "bank_loan" as "bank_loan" | "personal_loan",
    lender_name: "",
    principal_amount: 0,
    outstanding_amount: 0,
    interest_rate: 0,
    monthly_payment: 0,
    start_date: new Date().toISOString().split("T")[0],
    due_date: "",
    currency: "BDT",
    status: "active" as "active" | "paid" | "overdue",
    notes: "",
    bank_institution: null as string | null,
    collateral: "",
  });

  const handleInstitutionChange = (_id: string, institution: BDInstitution) => {
    setSelectedInstitution(institution);
    setFormData((prev) => ({
      ...prev,
      bank_institution: institution.id,
      lender_name: institution.name,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createLoan({
        ...formData,
        due_date: formData.due_date || null,
        notes: formData.notes || null,
        bank_institution: formData.bank_institution,
        collateral: formData.collateral || null,
        outstanding_amount: formData.outstanding_amount || formData.principal_amount,
      });
      router.push("/dashboard/loans");
      router.refresh();
    } catch (error) {
      console.error("Failed to create loan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>New Loan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Loan Type */}
          <div className="space-y-2">
            <Label>Loan Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {(["bank_loan", "personal_loan"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, type: t, bank_institution: null, lender_name: "" }));
                    setSelectedInstitution(null);
                  }}
                  className={`flex items-center gap-3 rounded-xl border-2 p-3 transition-all text-left ${
                    formData.type === t
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  {t === "bank_loan" ? (
                    <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <User className="h-5 w-5 text-violet-500 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{t === "bank_loan" ? "Bank Loan" : "Personal Loan"}</p>
                    <p className="text-xs text-muted-foreground">
                      {t === "bank_loan" ? "From a financial institution" : "From a person or private lender"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bank Institution (for bank loans) */}
          {formData.type === "bank_loan" && (
            <div className="space-y-2">
              <Label>Select Bank / Institution</Label>
              <InstitutionSelector
                value={selectedInstitution?.id ?? null}
                onChange={handleInstitutionChange}
                type="bank"
              />
            </div>
          )}

          {/* Loan Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Loan Name</Label>
            <Input
              id="name"
              placeholder="e.g., Home Loan, Car Loan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Lender Name */}
          <div className="space-y-2">
            <Label htmlFor="lender_name">
              {formData.type === "bank_loan" ? "Bank / Lender Name" : "Lender Name (Person)"}
            </Label>
            <Input
              id="lender_name"
              placeholder={formData.type === "bank_loan" ? "e.g., BRAC Bank" : "e.g., John Doe"}
              value={formData.lender_name}
              onChange={(e) => setFormData({ ...formData, lender_name: e.target.value })}
              required
            />
          </div>

          {/* Amounts */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="principal">Principal Amount</Label>
              <Input
                id="principal"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.principal_amount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, principal_amount: Number.parseFloat(e.target.value) || 0 })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outstanding">Outstanding Amount</Label>
              <Input
                id="outstanding"
                type="number"
                step="0.01"
                min="0"
                placeholder="Same as principal if new"
                value={formData.outstanding_amount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, outstanding_amount: Number.parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          {/* Rate + EMI */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="interest_rate">Interest Rate (% per annum)</Label>
              <Input
                id="interest_rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g., 9.5"
                value={formData.interest_rate || ""}
                onChange={(e) => setFormData({ ...formData, interest_rate: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly_payment">Monthly EMI / Payment</Label>
              <Input
                id="monthly_payment"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.monthly_payment || ""}
                onChange={(e) =>
                  setFormData({ ...formData, monthly_payment: Number.parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          {/* Dates + Currency */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date (optional)</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(v: "active" | "paid" | "overdue") => setFormData({ ...formData, status: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Collateral (bank loan only) */}
          {formData.type === "bank_loan" && (
            <div className="space-y-2">
              <Label htmlFor="collateral">Collateral / Security (optional)</Label>
              <Input
                id="collateral"
                placeholder="e.g., Property, Vehicle, FDR"
                value={formData.collateral}
                onChange={(e) => setFormData({ ...formData, collateral: e.target.value })}
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about this loan..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Loan"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
