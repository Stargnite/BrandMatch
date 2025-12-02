import { getCampaign } from "@/app/actions/campaign";
import { getCurrentUser } from "@/app/actions/user";
import { createApplication } from "@/app/actions/application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/campaigns/ApplicationForm";

interface CampaignPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignDetailPage({ params }: CampaignPageProps) {
  const { id } = await params;
  const result = await getCampaign(id);

  if (!result.success || !result.campaign) {
    notFound();
  }

  const campaign = result.campaign;
  const userResult = await getCurrentUser();
  const isAuthenticated = userResult.success && userResult.user;
  const isCreator = userResult.success && userResult.user?.role === "CREATOR";
  const isOwner = userResult.success && userResult.user?.id === campaign.brand.id;

  const deliverables = Array.isArray(campaign.deliverables)
    ? campaign.deliverables
    : typeof campaign.deliverables === "object" && campaign.deliverables !== null
    ? Object.entries(campaign.deliverables)
    : [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/campaigns"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to campaigns
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{campaign.title}</CardTitle>
              <StatusBadge status={campaign.status} />
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/campaigns/${id}/edit`}>Edit</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/applications?campaign=${id}`}>
                    Manage Applications
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Brand Info */}
          <div className="flex items-center gap-3 pb-4 border-b">
            <UserAvatar
              src={campaign.brand.avatarUrl}
              name={campaign.brand.name}
              size="md"
            />
            <div>
              <p className="font-medium">{campaign.brand.name}</p>
              {campaign.brand.bio && (
                <p className="text-sm text-muted-foreground">{campaign.brand.bio}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {campaign.description}
            </p>
          </div>

          {/* Budget */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Budget</h3>
              <p className="text-2xl font-bold">
                {campaign.currency} {campaign.budget.toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Applications</h3>
              <p className="text-2xl font-bold">{campaign._count.applications}</p>
            </div>
          </div>

          {/* Deliverables */}
          {deliverables.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Deliverables</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {deliverables.map((item: any, index: number) => {
                  const label = Array.isArray(item) ? item[1] : item;
                  return <li key={index}>{String(label)}</li>;
                })}
              </ul>
            </div>
          )}

          {/* Application Form */}
          {isCreator && campaign.status === "ACTIVE" && (
            <div className="pt-6 border-t">
              <ApplicationForm campaignId={campaign.id} />
            </div>
          )}

          {!isAuthenticated && campaign.status === "ACTIVE" && (
            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                Sign in as a creator to apply for this campaign
              </p>
              <Button asChild>
                <Link href="/sign-in">Sign In to Apply</Link>
              </Button>
            </div>
          )}

          {campaign.status !== "ACTIVE" && (
            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                This campaign is no longer accepting applications.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


