import { getCurrentUser } from "@/app/actions/user";
import { getCampaigns } from "@/app/actions/campaign";
import { getApplications } from "@/app/actions/application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, FileText, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const userResult = await getCurrentUser();
  if (!userResult.success || !userResult.user) {
    return <div>Please sign in to view your dashboard.</div>;
  }

  const user = userResult.user;
  const isCreator = user.role === "CREATOR";
  const isBrand = user.role === "BRAND";

  // Fetch relevant data based on role
  const [campaignsResult, applicationsResult] = await Promise.all([
    isBrand ? getCampaigns({ brandId: user.id }) : getCampaigns({ status: "ACTIVE" }),
    getApplications(),
  ]);

  type Campaign = {
    id: string;
    title: string;
    description: string;
    budget: number;
    currency: string;
    status: string;
    brand: { id: string; name: string; avatarUrl: string | null };
    _count: { applications: number };
  };
  type Application = {
    id: string;
    status: string;
    message: string;
    createdAt: Date;
    creator: { id: string; name: string; avatarUrl: string | null; bio: string | null };
    campaign: { id: string; title: string; budget: number; currency: string; brand?: { avatarUrl: string | null } };
  };

  const campaigns: Campaign[] = campaignsResult.success
    ? (campaignsResult.campaigns as Campaign[])
    : [];
  const applications: Application[] = applicationsResult.success
    ? (applicationsResult.applications as Application[])
    : [];

  const myCampaigns = isBrand ? campaigns : [];
  const availableCampaigns = isCreator ? campaigns.slice(0, 5) : [];
  const myApplications = isCreator ? applications : [];
  const receivedApplications = isBrand
    ? applications.filter((app: Application) => app.status === "PENDING")
    : [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your {isCreator ? "applications" : "campaigns"} today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {isBrand && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {myCampaigns.filter((c: Campaign) => c.status === "ACTIVE").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {myCampaigns.length} total campaigns
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{receivedApplications.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting your review</p>
              </CardContent>
            </Card>
          </>
        )}
        {isCreator && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myApplications.length}</div>
                <p className="text-xs text-muted-foreground">
                  {myApplications.filter((a: Application) => a.status === "PENDING").length} pending
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Campaigns</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableCampaigns.length}</div>
                <p className="text-xs text-muted-foreground">New opportunities</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {isBrand && myCampaigns.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Campaigns</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/campaigns/my-campaigns">View all</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {myCampaigns.slice(0, 3).map((campaign: Campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaigns/${campaign.id}`}
                  className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{campaign.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {campaign.description}
                      </p>
                    </div>
                    <StatusBadge status={campaign.status} />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {campaign._count.applications} applications
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}

        {isCreator && availableCampaigns.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Available Campaigns</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/campaigns">View all</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableCampaigns.map((campaign: Campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaigns/${campaign.id}`}
                  className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{campaign.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {campaign.description}
                      </p>
                    </div>
                    <StatusBadge status={campaign.status} />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <UserAvatar
                      src={campaign.brand.avatarUrl}
                      name={campaign.brand.name}
                      size="sm"
                    />
                    <span className="text-sm text-muted-foreground">
                      {campaign.brand.name}
                    </span>
                    <span className="text-sm font-medium ml-auto">
                      {campaign.currency} {campaign.budget.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}

        {applications.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {isCreator ? "My Applications" : "Recent Applications"}
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/applications">View all</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {applications.slice(0, 3).map((application: Application) => (
                <Link
                  key={application.id}
                  href={`/applications/${application.id}`}
                  className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {isCreator
                          ? application.campaign.title
                          : application.creator.name}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {application.message}
                      </p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

