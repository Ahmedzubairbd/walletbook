import { getProfile, getCurrentUser } from "@/lib/actions/profile-actions"
import { ProfileForm } from "@/components/settings/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import Image from "next/image"

export default async function ProfilePage() {
  const [profile, user] = await Promise.all([getProfile(), getCurrentUser()])

  const initials = (profile?.full_name || "")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and photo</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-border bg-muted flex-shrink-0">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt="Profile"
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10">
                  {initials ? (
                    <span className="text-lg font-bold text-primary">{initials}</span>
                  ) : (
                    <User className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              )}
            </div>
            <div>
              <CardTitle>{profile?.full_name || "Your Profile"}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} email={user?.email || ""} />
        </CardContent>
      </Card>
    </div>
  )
}
