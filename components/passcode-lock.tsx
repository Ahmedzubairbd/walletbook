"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Delete, Lock } from "lucide-react"
import { verifyPasscode, getProfile } from "@/lib/actions/profile-actions"
import { cn } from "@/lib/utils"
import { WalletBookLogo } from "@/components/walletbook-logo"

const LOCK_TIMEOUT = 5 * 60 * 1000 // 5 minutes

export function PasscodeLock({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(false)
  const [passcodeEnabled, setPasscodeEnabled] = useState(false)
  const [enteredCode, setEnteredCode] = useState("")
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkPasscode = async () => {
      try {
        const profile = await getProfile()
        if (profile?.passcode_enabled) {
          setPasscodeEnabled(true)
          const lockTime = localStorage.getItem("walletbook_lock_time")
          const lastActivity = localStorage.getItem("walletbook_last_activity")

          if (lockTime) {
            setIsLocked(true)
          } else if (lastActivity) {
            const elapsed = Date.now() - Number.parseInt(lastActivity)
            if (elapsed > LOCK_TIMEOUT) {
              setIsLocked(true)
              localStorage.setItem("walletbook_lock_time", Date.now().toString())
            }
          }
        }
      } finally {
        setIsLoading(false)
      }
    }
    checkPasscode()
  }, [])

  useEffect(() => {
    if (!passcodeEnabled || isLocked) return

    const updateActivity = () => {
      localStorage.setItem("walletbook_last_activity", Date.now().toString())
    }

    const events = ["mousedown", "keydown", "scroll", "touchstart"]
    events.forEach((event) => window.addEventListener(event, updateActivity))
    updateActivity()

    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem("walletbook_last_activity")
      if (lastActivity) {
        const elapsed = Date.now() - Number.parseInt(lastActivity)
        if (elapsed > LOCK_TIMEOUT) {
          setIsLocked(true)
          localStorage.setItem("walletbook_lock_time", Date.now().toString())
        }
      }
    }, 30000)

    return () => {
      events.forEach((event) => window.removeEventListener(event, updateActivity))
      clearInterval(interval)
    }
  }, [passcodeEnabled, isLocked])

  const handleNumberPress = useCallback(
    (num: string) => {
      if (enteredCode.length < 6) {
        setEnteredCode((prev) => prev + num)
        setError("")
      }
    },
    [enteredCode],
  )

  const handleDelete = useCallback(() => {
    setEnteredCode((prev) => prev.slice(0, -1))
    setError("")
  }, [])

  const handleVerify = useCallback(async () => {
    if (enteredCode.length !== 6) return

    setIsVerifying(true)
    setError("")

    try {
      const valid = await verifyPasscode(enteredCode)
      if (valid) {
        setIsLocked(false)
        localStorage.removeItem("walletbook_lock_time")
        localStorage.setItem("walletbook_last_activity", Date.now().toString())
        setEnteredCode("")
      } else {
        setError("Incorrect passcode")
        setEnteredCode("")
      }
    } catch {
      setError("Verification failed")
      setEnteredCode("")
    } finally {
      setIsVerifying(false)
    }
  }, [enteredCode])

  useEffect(() => {
    if (enteredCode.length === 6) {
      handleVerify()
    }
  }, [enteredCode, handleVerify])

  if (isLoading) {
    return <div className="min-h-screen bg-background" />
  }

  if (!passcodeEnabled || !isLocked) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <WalletBookLogo size="lg" showText={false} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">WalletBook</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your passcode to unlock</p>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                i < enteredCode.length ? "bg-primary border-primary" : "border-muted-foreground/30",
              )}
            />
          ))}
        </div>

        {error && <p className="text-center text-sm text-destructive">{error}</p>}

        <div className="grid grid-cols-3 gap-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((key) => {
            if (key === "") return <div key="empty" />
            if (key === "del") {
              return (
                <Button
                  key="del"
                  variant="ghost"
                  size="lg"
                  className="h-16 text-xl rounded-full"
                  onClick={handleDelete}
                  disabled={isVerifying}
                >
                  <Delete className="h-6 w-6" />
                </Button>
              )
            }
            return (
              <Button
                key={key}
                variant="ghost"
                size="lg"
                className="h-16 text-2xl font-semibold rounded-full hover:bg-muted"
                onClick={() => handleNumberPress(key)}
                disabled={isVerifying}
              >
                {key}
              </Button>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>App locked for security</span>
        </div>
      </div>
    </div>
  )
}
