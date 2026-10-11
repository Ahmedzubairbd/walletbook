// Currency formatting utility with BDT as default

export const currencySymbols: Record<string, string> = {
  BDT: "৳",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
  CAD: "C$",
  AUD: "A$",
}

export function formatCurrency(value: number, currency = "BDT", compact = false): string {
  const symbol = currencySymbols[currency] || currency

  if (compact) {
    if (Math.abs(value) >= 10000000) return `${symbol}${(value / 10000000).toFixed(1)}Cr`
    if (Math.abs(value) >= 100000) return `${symbol}${(value / 100000).toFixed(1)}L`
    if (Math.abs(value) >= 1000) return `${symbol}${(value / 1000).toFixed(1)}K`
  }

  return `${symbol}${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function getCurrencySymbol(currency = "BDT"): string {
  return currencySymbols[currency] || currency
}
