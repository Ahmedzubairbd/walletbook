"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createWallet } from "@/lib/actions/wallet-actions";
import { Wallet, Building2, CreditCard, Smartphone, PiggyBank, TrendingUp } from "lucide-react";
import { InstitutionSelector } from "@/components/wallet/institution-selector";
import { BankCardVisual } from "@/components/wallet/bank-card-visual";
import type { BDInstitution } from "@/lib/data/bd-institutions";

const walletTypes = [
  { value: "cash", label: "Cash", icon: Wallet },
  { value: "bank", label: "Bank Account", icon: Building2 },
  { value: "credit_card", label: "Credit Card", icon: CreditCard },
  { value: "digital", label: "Digital Wallet", icon: Smartphone },
  { value: "savings", label: "Savings Account", icon: PiggyBank },
  { value: "investment", label: "Investment", icon: TrendingUp },
];

const colors = ["#2dd4bf", "#6366f1", "#8b5cf6", "#ec4899", "#f97316", "#eab308", "#22c55e", "#06b6d4"];

const currencies = ["BDT", "USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD"];

const INSTITUTION_TYPES: Record<string, "bank" | "mfs" | "card_network" | "all"> = {
  bank: "bank",
  credit_card: "all",
  digital: "mfs",
};

export function CreateWalletForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<BDInstitution | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "bank" as "cash" | "bank" | "credit_card" | "digital" | "savings" | "investment",
    currency: "BDT",
    balance: 0,
    color: "#2dd4bf",
    icon: "wallet",
    is_active: true,
    notes: "",
  });

  const showInstitution = ["bank", "credit_card", "digital"].includes(formData.type);

  const handleTypeChange = (value: typeof formData.type) => {
    setFormData({ ...formData, type: value });
    setSelectedInstitution(null);
    setCardNumber("");
    setHolderName("");
  };

  const handleInstitutionChange = (id: string, institution: BDInstitution) => {
    setSelectedInstitution(institution);
    setFormData((prev) => ({
      ...prev,
      color: institution.primaryColor,
      notes: JSON.stringify({
        institution_id: id,
        card_number_last4: cardNumber,
        holder_name: holderName,
      }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const submitData = {
      ...formData,
      notes: selectedInstitution
        ? JSON.stringify({
            institution_id: selectedInstitution.id,
            card_number_last4: cardNumber,
            holder_name: holderName,
          })
        : formData.notes,
    };
    try {
      await createWallet(submitData);
      router.push("/dashboard/wallets");
      router.refresh();
    } catch (error) {
      console.error("Failed to create wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Wallet Name</Label>
            <Input
              id="name"
              placeholder="e.g., Main Checking Account"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Wallet Type</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {walletTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Institution selector for bank/card/digital wallets */}
          {showInstitution && (
            <div className="space-y-3">
              <Label>
                {formData.type === "bank"
                  ? "Select Bank"
                  : formData.type === "credit_card"
                    ? "Select Card Network / Bank"
                    : "Select MFS Provider"}
              </Label>
              <InstitutionSelector
                value={selectedInstitution?.id ?? null}
                onChange={handleInstitutionChange}
                type={INSTITUTION_TYPES[formData.type] ?? "all"}
              />

              {/* Card visual preview */}
              {selectedInstitution && (
                <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">Card Preview</p>
                  <BankCardVisual
                    institution={selectedInstitution}
                    walletName={formData.name || "My Wallet"}
                    cardNumber={cardNumber}
                    holderName={holderName}
                    size="md"
                  />
                  <div className="grid gap-3 w-full sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor="card_number">Last 4 Digits (optional)</Label>
                      <Input
                        id="card_number"
                        placeholder="e.g., 1234"
                        maxLength={4}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="holder_name">Cardholder Name (optional)</Label>
                      <Input
                        id="holder_name"
                        placeholder="e.g., John Doe"
                        value={holderName}
                        onChange={(e) => setHolderName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="balance">Initial Balance</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.balance || ""}
              onChange={(e) => setFormData({ ...formData, balance: Number.parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all"
                  style={{
                    backgroundColor: color,
                    outline: formData.color === color ? `2px solid ${color}` : "none",
                    outlineOffset: "2px",
                  }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Wallet"}
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
