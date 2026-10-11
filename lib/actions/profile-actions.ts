"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Profile } from "@/lib/types/profile"

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    // Profile might not exist yet, create it
    if (error.code === "PGRST116") {
      const { data: newProfile } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || null,
        })
        .select()
        .single()
      return newProfile
    }
    return null
  }
  return data
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", user.id)
    .select()
    .single()

  if (error) throw error
  revalidatePath("/dashboard/profile")
  revalidatePath("/dashboard/settings")
  return data
}

export async function updatePasscode(passcode: string): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  // Simple hash for demo - in production use bcrypt on server
  const passcodeHash = Buffer.from(passcode).toString("base64")

  const { error } = await supabase
    .from("profiles")
    .update({
      passcode_hash: passcodeHash,
      passcode_enabled: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) throw error
  revalidatePath("/dashboard/settings")
  return true
}

export async function verifyPasscode(passcode: string): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase.from("profiles").select("passcode_hash").eq("id", user.id).single()

  if (!data?.passcode_hash) return false

  const inputHash = Buffer.from(passcode).toString("base64")
  return inputHash === data.passcode_hash
}

export async function disablePasscode(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from("profiles")
    .update({
      passcode_hash: null,
      passcode_enabled: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) throw error
  revalidatePath("/dashboard/settings")
  return true
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserFactors() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.mfa.listFactors()
  if (error) return { totp: [], phone: [] }
  return data
}
