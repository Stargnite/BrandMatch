import { getCurrentUser } from "@/app/actions/user";
import { getCampaigns } from "@/app/actions/campaign";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase, Plus } from "lucide-react";

export default async function MyCampaignsPage() {
  const userResult = await getCurrentUser();

  if (!userResult.success || !userResult.user) {
    redirect("/sign-in");
  }

  if (userResult.user.role !== "BRAND") {
    redirect("/dashboard");
  }

  const campaignsResult = await getCampaigns({ brandId: userResult.user.id });
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
  const campaigns: Campaign[] =
    campaignsResult.success && campaignsResult.campaigns
      ? (campaignsResult.campaigns as Campaign[])
      : [];

  const activeCampaigns = campaigns.filter((c: Campaign) => c.status === "ACTIVE");
  const closedCampaigns = campaigns.filter((c: Campaign) => c.status === "CLOSED");
  const completedCampaigns = campaigns.filter((c: Campaign) => c.status === "COMPLETED");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            Manage your brand campaigns
          </p>
        </div>
        <Button asChild>
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No campaigns yet"
          description="Create your first campaign to start connecting with creators"
          action={{
            label: "Create Campaign",
            href: "/campaigns/new",
          }}
        />
      ) : (
        <div className="space-y-8">
          {activeCampaigns.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Active</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeCampaigns.map((campaign: Campaign) => (
                  <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
                        <StatusBadge status={campaign.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {campaign.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold">
                            {campaign.currency} {campaign.budget.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {campaign._count.applications} applications
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/campaigns/${campaign.id}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {closedCampaigns.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Closed</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {closedCampaigns.map((campaign: Campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
                        <StatusBadge status={campaign.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/campaigns/${campaign.id}`}>View</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {completedCampaigns.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Completed</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedCampaigns.map((campaign: Campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
                        <StatusBadge status={campaign.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/campaigns/${campaign.id}`}>View</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

