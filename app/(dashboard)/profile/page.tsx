import { getCurrentUser } from "@/app/actions/user";
import { getUserProfile } from "@/app/actions/profile";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { getCampaigns } from "@/app/actions/campaign";
import { getApplications } from "@/app/actions/application";

export default async function ProfilePage() {
  const userResult = await getCurrentUser();

  if (!userResult.success || !userResult.user) {
    redirect("/sign-in");
  }

  const profileResult = await getUserProfile(userResult.user.id);
  if (!profileResult.success || !profileResult.user) {
    redirect("/dashboard");
  }

  const user = profileResult.user;
  const isBrand = user.role === "BRAND";

  // Fetch user's campaigns or applications
  const [campaignsResult, applicationsResult] = await Promise.all([
    isBrand ? getCampaigns({ brandId: user.id }) : Promise.resolve({ success: false, campaigns: [] }),
    !isBrand ? getApplications() : Promise.resolve({ success: false, applications: [] }),
  ]);

  const campaigns = isBrand && campaignsResult.success ? campaignsResult.campaigns : [];
  const applications = !isBrand && applicationsResult.success ? applicationsResult.applications : [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button variant="outline" asChild>
            <Link href="/profile/edit">Edit Profile</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <UserAvatar
                  src={user.avatarUrl}
                  name={user.name}
                  size="lg"
                />
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
                <CardTitle>My Campaigns</CardTitle>
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
                  {campaigns.length > 5 && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/campaigns/my-campaigns">View All Campaigns</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {!isBrand && applications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application: any) => (
                    <Link
                      key={application.id}
                      href={`/applications/${application.id}`}
                      className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{application.campaign.title}</h4>
                        <StatusBadge status={application.status} />
                      </div>
                    </Link>
                  ))}
                  {applications.length > 5 && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/applications">View All Applications</Link>
                    </Button>
                  )}
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
                <>
                  <div>
                    <p className="text-2xl font-bold">{user._count.campaigns}</p>
                    <p className="text-sm text-muted-foreground">Campaigns</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-2xl font-bold">{user._count.applications}</p>
                    <p className="text-sm text-muted-foreground">Applications</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}



