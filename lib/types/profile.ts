export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  currency: string
  timezone: string
  profile_completed: boolean
  mfa_enabled: boolean
  passcode_enabled: boolean
  passcode_hash: string | null
  created_at: string
  updated_at: string
}

export interface SecuritySettings {
  mfa_enabled: boolean
  passcode_enabled: boolean
  has_google_linked: boolean
  has_passkey: boolean
}
