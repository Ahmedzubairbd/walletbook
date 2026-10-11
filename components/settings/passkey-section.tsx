"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Check, X, Loader2, Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Passkey {
  id: string
  friendly_name: string | null
  created_at: string
}

export function PasskeySection() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [passkeyName, setPasskeyName] = useState("")
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadPasskeys()
  }, [])

  const loadPasskeys = async () => {
    try {
      const { data } = await supabase.auth.mfa.listFactors()
      const webauthnFactors = data?.all?.filter((f) => f.factor_type === "webauthn") || []
      setPasskeys(
        webauthnFactors.map((f) => ({
          id: f.id,
          friendly_name: f.friendly_name,
          created_at: f.created_at,
        })),
      )
    } finally {
      setIsChecking(false)
    }
  }

  const addPasskey = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.mfa.enroll({
        factorType: "webauthn",
        friendlyName: passkeyName || "WalletBook Passkey",
      })

      if (error) throw error

      toast({ title: "Passkey added successfully" })
      setDialogOpen(false)
      setPasskeyName("")
      loadPasskeys()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to add passkey"
      toast({ title: message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const removePasskey = async (id: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: id })
      if (error) throw error

      toast({ title: "Passkey removed" })
      loadPasskeys()
    } catch (error) {
      toast({ title: "Failed to remove passkey", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="flex items-center justify-center py-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {passkeys.length > 0 ? (
            <Badge variant="default" className="bg-purple-500/20 text-purple-500 border-purple-500/30">
              <Check className="h-3 w-3 mr-1" />
              {passkeys.length} passkey{passkeys.length > 1 ? "s" : ""}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              <X className="h-3 w-3 mr-1" />
              No passkeys
            </Badge>
          )}
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Passkey
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a Passkey</DialogTitle>
              <DialogDescription>
                Use your device's biometrics or security key to sign in without a password.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passkeyName">Passkey Name (optional)</Label>
                <Input
                  id="passkeyName"
                  value={passkeyName}
                  onChange={(e) => setPasskeyName(e.target.value)}
                  placeholder="e.g., MacBook Pro, iPhone"
                />
              </div>
              <Button onClick={addPasskey} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Register Passkey
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {passkeys.length > 0 && (
        <div className="space-y-2">
          {passkeys.map((passkey) => (
            <div key={passkey.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">{passkey.friendly_name || "Unnamed Passkey"}</p>
                <p className="text-xs text-muted-foreground">
                  Added {new Date(passkey.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => removePasskey(passkey.id)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
