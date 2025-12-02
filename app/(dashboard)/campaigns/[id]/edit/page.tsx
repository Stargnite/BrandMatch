import { getCurrentUser } from "@/app/actions/user";
import { getCampaign } from "@/app/actions/campaign";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignForm } from "@/components/campaigns/CampaignForm";

interface EditCampaignPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCampaignPage({ params }: EditCampaignPageProps) {
  const { id } = await params;
  const userResult = await getCurrentUser();

  if (!userResult.success || !userResult.user) {
    redirect("/sign-in");
  }

  if (userResult.user.role !== "BRAND") {
    redirect("/dashboard");
  }

  const campaignResult = await getCampaign(id);

  if (!campaignResult.success || !campaignResult.campaign) {
    notFound();
  }

  const campaign = campaignResult.campaign;

  if (campaign.brand.id !== userResult.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Campaign</h1>
        <p className="text-muted-foreground mt-1">
          Update your campaign details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignForm
            campaignId={campaign.id}
            initialData={{
              title: campaign.title,
              description: campaign.description,
              budget: campaign.budget,
              currency: campaign.currency,
              deliverables: campaign.deliverables,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

