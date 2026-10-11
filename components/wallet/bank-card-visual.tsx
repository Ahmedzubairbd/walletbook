"use client"

import type { BDInstitution } from "@/lib/data/bd-institutions"
import { cn } from "@/lib/utils"

interface BankCardVisualProps {
  institution: BDInstitution | null
  walletName: string
  cardNumber?: string
  holderName?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function BankCardVisual({
  institution,
  walletName,
  cardNumber,
  holderName,
  size = "md",
  className,
}: BankCardVisualProps) {
  const primary = institution?.primaryColor || "#1a1f71"
  const secondary = institution?.secondaryColor || "#2e3a9e"

  const sizeClasses = {
    sm: "w-48 h-28 text-[10px]",
    md: "w-72 h-44 text-xs",
    lg: "w-80 h-48 text-sm",
  }

  const masked = cardNumber ? `•••• •••• •••• ${cardNumber.slice(-4)}` : "•••• •••• •••• ••••"

  return (
    <div
      className={cn("relative rounded-2xl overflow-hidden shadow-xl flex-shrink-0", sizeClasses[size], className)}
      style={{
        background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 60%, ${primary}cc 100%)`,
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-8 -right-8 rounded-full opacity-20"
        style={{
          width: size === "sm" ? 80 : 120,
          height: size === "sm" ? 80 : 120,
          backgroundColor: institution?.textColor || "#ffffff",
        }}
      />
      <div
        className="absolute -bottom-6 -left-6 rounded-full opacity-10"
        style={{
          width: size === "sm" ? 60 : 90,
          height: size === "sm" ? 60 : 90,
          backgroundColor: institution?.textColor || "#ffffff",
        }}
      />

      {/* Card Content */}
      <div className="relative h-full flex flex-col justify-between p-4" style={{ color: institution?.textColor || "#ffffff" }}>
        {/* Top row: institution name + chip */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold tracking-wide opacity-90" style={{ fontSize: size === "sm" ? 10 : 13 }}>
              {institution ? institution.shortName : "BANK"}
            </p>
            {institution && size !== "sm" && (
              <p className="opacity-60 mt-0.5" style={{ fontSize: 9 }}>
                {institution.name}
              </p>
            )}
          </div>
          {/* Chip */}
          <div
            className="rounded"
            style={{
              width: size === "sm" ? 20 : 28,
              height: size === "sm" ? 15 : 20,
              backgroundColor: "#d4a843",
              opacity: 0.9,
            }}
          />
        </div>

        {/* Card number */}
        <div>
          <p className="font-mono tracking-widest opacity-80" style={{ fontSize: size === "sm" ? 9 : 12 }}>
            {masked}
          </p>
        </div>

        {/* Bottom row: holder + wallet name + network */}
        <div className="flex items-end justify-between">
          <div>
            <p className="opacity-50 uppercase" style={{ fontSize: 7 }}>
              Card Holder
            </p>
            <p className="font-semibold truncate max-w-[120px]" style={{ fontSize: size === "sm" ? 9 : 11 }}>
              {holderName || walletName}
            </p>
          </div>
          {/* Network logo placeholder */}
          {institution?.type === "card_network" && (
            <div className="flex items-center gap-0.5">
              <div className="rounded-full opacity-80" style={{ width: 16, height: 16, backgroundColor: "#eb001b" }} />
              <div className="rounded-full opacity-80 -ml-2" style={{ width: 16, height: 16, backgroundColor: "#f79e1b" }} />
            </div>
          )}
          {institution?.type === "mfs" && (
            <div
              className="rounded-full flex items-center justify-center text-white font-bold"
              style={{ width: 20, height: 20, backgroundColor: "rgba(255,255,255,0.2)", fontSize: 7 }}
            >
              MFS
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
