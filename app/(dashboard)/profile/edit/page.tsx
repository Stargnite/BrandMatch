import { getCurrentUser } from "@/app/actions/user";
import { getUserProfile } from "@/app/actions/profile";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function EditProfilePage() {
  const userResult = await getCurrentUser();

  if (!userResult.success || !userResult.user) {
    redirect("/sign-in");
  }

  const profileResult = await getUserProfile(userResult.user.id);
  if (!profileResult.success || !profileResult.user) {
    redirect("/dashboard");
  }

  const user = profileResult.user;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <p className="text-muted-foreground mt-1">Update your profile information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            initialData={{
              name: user.name,
              bio: user.bio || "",
              niche: user.niche || "",
              avatarUrl: user.avatarUrl || "",
              socials: user.socials,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}



