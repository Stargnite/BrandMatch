import { getCurrentUser } from "@/app/actions/user";
import { redirect } from "next/navigation";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewCampaignPage() {
  const userResult = await getCurrentUser();

  if (!userResult.success || !userResult.user) {
    redirect("/sign-in");
  }

  if (userResult.user.role !== "BRAND") {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Campaign</h1>
        <p className="text-muted-foreground mt-1">
          Post a new opportunity for creators
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignForm />
        </CardContent>
      </Card>
    </div>
  );
}



