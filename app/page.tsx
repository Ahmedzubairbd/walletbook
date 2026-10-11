import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TrendingUp, ArrowLeftRight, Target, PiggyBank, BarChart3, Wallet } from "lucide-react"
import { WalletBookLogo } from "@/components/walletbook-logo"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <WalletBookLogo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Personal Finance Management
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
            Take Control of Your
            <span className="text-primary"> Financial Future</span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Track wallets, manage transfers, monitor expenses, and achieve your savings goals with powerful analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <Button asChild size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">
              <Link href="/auth/sign-up">Start Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto bg-transparent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
          <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Multi-Wallet Management</h3>
            <p className="text-sm text-muted-foreground">
              Track cash, bank accounts, credit cards, digital wallets, and investments all in one place.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 mb-4">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Income & Expense Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Categorize transactions, track spending patterns, and understand where your money goes.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10 mb-4">
              <ArrowLeftRight className="h-6 w-6 text-chart-2" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Smart Transfers</h3>
            <p className="text-sm text-muted-foreground">
              Move money between wallets with automatic fee tracking and balance updates.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10 mb-4">
              <Target className="h-6 w-6 text-warning" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Budget Control</h3>
            <p className="text-sm text-muted-foreground">
              Set weekly, monthly, or yearly budgets by category and stay on track with alerts.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 mb-4">
              <PiggyBank className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Savings Goals</h3>
            <p className="text-sm text-muted-foreground">
              Create goals, track progress, and celebrate when you reach your savings milestones.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Visualize your cash flow, track trends, and make informed financial decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <WalletBookLogo size="sm" />
            <p className="text-sm text-muted-foreground text-center">
              Your personal finance companion - Powered by NEXT Lab
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
