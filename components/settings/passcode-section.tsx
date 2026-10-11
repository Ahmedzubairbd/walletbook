"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePasscode, disablePasscode } from "@/lib/actions/profile-actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Check, X, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PasscodeSectionProps {
  enabled: boolean
}

export function PasscodeSection({ enabled }: PasscodeSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [passcode, setPasscode] = useState("")
  const [confirmPasscode, setConfirmPasscode] = useState("")
  const [step, setStep] = useState<"enter" | "confirm">("enter")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handlePasscodeInput = (value: string, isConfirm: boolean) => {
    const digits = value.replace(/\D/g, "").slice(0, 6)
    if (isConfirm) {
      setConfirmPasscode(digits)
    } else {
      setPasscode(digits)
    }
  }

  const handleNext = () => {
    if (passcode.length !== 6) {
      setError("Please enter a 6-digit passcode")
      return
    }
    setError("")
    setStep("confirm")
  }

  const handleSetPasscode = async () => {
    if (passcode !== confirmPasscode) {
      setError("Passcodes don't match")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await updatePasscode(passcode)
      toast({ title: "App passcode enabled" })
      setDialogOpen(false)
      resetForm()
      router.refresh()
    } catch {
      setError("Failed to set passcode")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisablePasscode = async () => {
    setIsLoading(true)
    try {
      await disablePasscode()
      toast({ title: "App passcode disabled" })
      router.refresh()
    } catch {
      toast({ title: "Failed to disable passcode", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setPasscode("")
    setConfirmPasscode("")
    setStep("enter")
    setError("")
  }

  if (enabled) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-amber-500/20 text-amber-500 border-amber-500/30">
            <Check className="h-3 w-3 mr-1" />
            Enabled
          </Badge>
          <span className="text-sm text-muted-foreground">6-digit PIN configured</span>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change App Passcode</DialogTitle>
                <DialogDescription>
                  {step === "enter" ? "Enter your new 6-digit passcode" : "Confirm your new passcode"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {step === "enter" ? (
                  <>
                    <div className="space-y-2">
                      <Label>New Passcode</Label>
                      <Input
                        type="password"
                        value={passcode}
                        onChange={(e) => handlePasscodeInput(e.target.value, false)}
                        placeholder="Enter 6 digits"
                        className="text-center text-2xl tracking-widest font-mono"
                        maxLength={6}
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button onClick={handleNext} className="w-full" disabled={passcode.length !== 6}>
                      Next
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Confirm Passcode</Label>
                      <Input
                        type="password"
                        value={confirmPasscode}
                        onChange={(e) => handlePasscodeInput(e.target.value, true)}
                        placeholder="Re-enter 6 digits"
                        className="text-center text-2xl tracking-widest font-mono"
                        maxLength={6}
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setStep("enter")} className="flex-1">
                        Back
                      </Button>
                      <Button
                        onClick={handleSetPasscode}
                        className="flex-1"
                        disabled={isLoading || confirmPasscode.length !== 6}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="destructive" size="sm" onClick={handleDisablePasscode} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Disable"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open)
        if (!open) resetForm()
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-muted-foreground">
            <X className="h-3 w-3 mr-1" />
            Not enabled
          </Badge>
        </div>
        <DialogTrigger asChild>
          <Button size="sm">Enable</Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set App Passcode</DialogTitle>
          <DialogDescription>
            {step === "enter" ? "Create a 6-digit passcode to lock your app" : "Confirm your passcode"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {step === "enter" ? (
            <>
              <div className="space-y-2">
                <Label>Passcode</Label>
                <Input
                  type="password"
                  value={passcode}
                  onChange={(e) => handlePasscodeInput(e.target.value, false)}
                  placeholder="Enter 6 digits"
                  className="text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={handleNext} className="w-full" disabled={passcode.length !== 6}>
                Next
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Confirm Passcode</Label>
                <Input
                  type="password"
                  value={confirmPasscode}
                  onChange={(e) => handlePasscodeInput(e.target.value, true)}
                  placeholder="Re-enter 6 digits"
                  className="text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("enter")} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleSetPasscode}
                  className="flex-1"
                  disabled={isLoading || confirmPasscode.length !== 6}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enable Passcode"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
