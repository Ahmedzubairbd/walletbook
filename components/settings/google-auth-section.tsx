"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Check, X, Loader2 } from "lucide-react"

export function GoogleAuthSection() {
  const [isLinked, setIsLinked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    checkGoogleLink()
  }, [])

  const checkGoogleLink = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.app_metadata?.providers?.includes("google")) {
        setIsLinked(true)
      }
    } finally {
      setIsChecking(false)
    }
  }

  const linkGoogle = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.linkIdentity({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to link Google account"
      toast({ title: message, variant: "destructive" })
      setIsLoading(false)
    }
  }

  const unlinkGoogle = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const googleIdentity = user?.identities?.find((i) => i.provider === "google")

      if (googleIdentity) {
        const { error } = await supabase.auth.unlinkIdentity(googleIdentity)
        if (error) throw error
        setIsLinked(false)
        toast({ title: "Google account unlinked" })
      }
    } catch (error) {
      toast({ title: "Failed to unlink Google account", variant: "destructive" })
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {isLinked ? (
          <Badge variant="default" className="bg-blue-500/20 text-blue-500 border-blue-500/30">
            <Check className="h-3 w-3 mr-1" />
            Linked
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            <X className="h-3 w-3 mr-1" />
            Not linked
          </Badge>
        )}
      </div>
      <Button
        size="sm"
        variant={isLinked ? "destructive" : "default"}
        onClick={isLinked ? unlinkGoogle : linkGoogle}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isLinked ? "Unlink" : "Link Google"}
      </Button>
    </div>
  )
}
