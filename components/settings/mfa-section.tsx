"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
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

interface MFASectionProps {
  enabled: boolean
}

export function MFASection({ enabled }: MFASectionProps) {
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [factorId, setFactorId] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [secret, setSecret] = useState("")
  const [verifyCode, setVerifyCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabling, setIsDisabling] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const startEnrollment = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "WalletBook Authenticator",
      })

      if (error) throw error

      setFactorId(data.id)
      setQrCode(data.totp.qr_code)
      setSecret(data.totp.secret)
      setIsEnrolling(true)
    } catch (error) {
      toast({ title: "Failed to start enrollment", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const verifyAndEnable = async () => {
    if (verifyCode.length !== 6) {
      toast({ title: "Enter a 6-digit code", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      })

      if (challengeError) throw challengeError

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verifyCode,
      })

      if (verifyError) throw verifyError

      toast({ title: "Two-factor authentication enabled" })
      setDialogOpen(false)
      setIsEnrolling(false)
      setVerifyCode("")
      router.refresh()
    } catch (error) {
      toast({ title: "Invalid code. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const disableMFA = async () => {
    setIsDisabling(true)
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors()
      const totpFactor = factors?.totp?.[0]

      if (totpFactor) {
        const { error } = await supabase.auth.mfa.unenroll({ factorId: totpFactor.id })
        if (error) throw error
      }

      toast({ title: "Two-factor authentication disabled" })
      router.refresh()
    } catch (error) {
      toast({ title: "Failed to disable MFA", variant: "destructive" })
    } finally {
      setIsDisabling(false)
    }
  }

  if (enabled) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
            <Check className="h-3 w-3 mr-1" />
            Enabled
          </Badge>
          <span className="text-sm text-muted-foreground">TOTP authenticator configured</span>
        </div>
        <Button variant="destructive" size="sm" onClick={disableMFA} disabled={isDisabling}>
          {isDisabling ? <Loader2 className="h-4 w-4 animate-spin" /> : "Disable"}
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-muted-foreground">
              <X className="h-3 w-3 mr-1" />
              Not enabled
            </Badge>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setDialogOpen(true)
              startEnrollment()
            }}
          >
            Enable
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set up Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </DialogDescription>
        </DialogHeader>

        {isLoading && !qrCode ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isEnrolling ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              {qrCode && (
                <div className="p-4 bg-white rounded-lg">
                  <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
                </div>
              )}
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Or enter this code manually:</p>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono break-all">{secret}</code>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verifyCode">Enter 6-digit code from your app</Label>
              <Input
                id="verifyCode"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest font-mono"
                maxLength={6}
              />
            </div>

            <Button onClick={verifyAndEnable} className="w-full" disabled={isLoading || verifyCode.length !== 6}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Verify and Enable
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
