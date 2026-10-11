import type React from "react"
import { SidebarNav } from "@/components/wallet/sidebar-nav"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PasscodeLock } from "@/components/passcode-lock"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <PasscodeLock>
      <div className="min-h-screen bg-background">
        <SidebarNav />
        <main className="pt-14 lg:pt-0 lg:pl-64 transition-all duration-300 min-h-screen">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </PasscodeLock>
  )
}
