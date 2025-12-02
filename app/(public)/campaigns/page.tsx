import { getCampaigns } from "@/app/actions/campaign";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase } from "lucide-react";

export default async function CampaignsPage() {
  const result = await getCampaigns({ status: "ACTIVE" });

  if (!result.success || !result.campaigns) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          icon={Briefcase}
          title="No campaigns found"
          description="There are no active campaigns at the moment. Check back later!"
        />
      </div>
    );
  }

  const campaigns = result.campaigns;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Campaigns</h1>
        <p className="text-muted-foreground">
          Discover brand partnership opportunities
        </p>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No campaigns available"
          description="There are no active campaigns at the moment. Check back later!"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign: any) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
                  <StatusBadge status={campaign.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {campaign.description}
                </p>

                <div className="flex items-center gap-2">
                  <UserAvatar
                    src={campaign.brand.avatarUrl}
                    name={campaign.brand.name}
                    size="sm"
                  />
                  <span className="text-sm font-medium">{campaign.brand.name}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-2xl font-bold">
                      {campaign.currency} {campaign.budget.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Budget</p>
                  </div>
                  <Button asChild>
                    <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
                  </Button>
                </div>

                {campaign._count.applications > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {campaign._count.applications} application
                    {campaign._count.applications !== 1 ? "s" : ""}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


