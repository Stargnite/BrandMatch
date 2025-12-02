import { getCurrentUser } from "@/app/actions/user";
import { getUserProfile } from "@/app/actions/profile";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCampaigns } from "@/app/actions/campaign";

interface UserProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = await params;
  const currentUserResult = await getCurrentUser();

  if (!currentUserResult.success || !currentUserResult.user) {
    redirect("/sign-in");
  }

  const profileResult = await getUserProfile(userId);

  if (!profileResult.success || !profileResult.user) {
    notFound();
  }

  const user = profileResult.user;
  const isOwnProfile = currentUserResult.user.id === userId;
  const isBrand = user.role === "BRAND";

  // Fetch user's campaigns if they're a brand
  const campaigns =
    isBrand
      ? await getCampaigns({ brandId: userId }).then((r) =>
          r.success ? r.campaigns : []
        )
      : [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        {!isOwnProfile && (
          <Link
            href="/profile"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to my profile
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <UserAvatar src={user.avatarUrl} name={user.name} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <StatusBadge status={user.role} />
                  </div>
                  {user.bio && (
                    <p className="text-muted-foreground mb-2">{user.bio}</p>
                  )}
                  {user.niche && (
                    <p className="text-sm text-muted-foreground">
                      Niche: {user.niche}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {isBrand && campaigns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.slice(0, 5).map((campaign: any) => (
                    <Link
                      key={campaign.id}
                      href={`/campaigns/${campaign.id}`}
                      className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <h4 className="font-medium">{campaign.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {campaign.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isBrand ? (
                <div>
                  <p className="text-2xl font-bold">{user._count.campaigns}</p>
                  <p className="text-sm text-muted-foreground">Campaigns</p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold">{user._count.applications}</p>
                  <p className="text-sm text-muted-foreground">Applications</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {!isOwnProfile && (
            <Button className="w-full" asChild>
              <Link href={`/messages/${userId}`}>Send Message</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}



