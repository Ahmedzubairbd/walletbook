import { getProfile, getUserFactors } from "@/lib/actions/profile-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Shield, Key, Smartphone, Fingerprint } from "lucide-react"
import { MFASection } from "@/components/settings/mfa-section"
import { PasscodeSection } from "@/components/settings/passcode-section"
import { GoogleAuthSection } from "@/components/settings/google-auth-section"
import { PasskeySection } from "@/components/settings/passkey-section"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function SettingsPage() {
  const [profile, factors] = await Promise.all([getProfile(), getUserFactors()])
  const hasMFA = factors.totp && factors.totp.length > 0

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and security settings</p>
      </div>

      {/* Profile Quick Link */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Profile Settings</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/profile">Edit Profile</Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Security Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Security</h2>
        </div>

        {/* MFA/TOTP */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Smartphone className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security with TOTP</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MFASection enabled={hasMFA} />
          </CardContent>
        </Card>

        {/* Google Auth */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <div>
                <CardTitle className="text-lg">Google Account</CardTitle>
                <CardDescription>Link your Google account for easy sign-in</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <GoogleAuthSection />
          </CardContent>
        </Card>

        {/* Passkey */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Fingerprint className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Passkey</CardTitle>
                <CardDescription>Use biometrics or security key to sign in</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PasskeySection />
          </CardContent>
        </Card>

        {/* App Passcode */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Key className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <CardTitle className="text-lg">App Passcode</CardTitle>
                <CardDescription>Set a PIN to lock the app when you leave</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PasscodeSection enabled={profile?.passcode_enabled || false} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
