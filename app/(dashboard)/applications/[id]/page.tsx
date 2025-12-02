import { getCurrentUser } from "@/app/actions/user";
import { getApplication, updateApplicationStatus } from "@/app/actions/application";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ApplicationActions } from "@/components/applications/ApplicationActions";

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const { id } = await params;
  const userResult = await getCurrentUser();

  if (!userResult.success || !userResult.user) {
    redirect("/sign-in");
  }

  const applicationResult = await getApplication(id);

  if (!applicationResult.success || !applicationResult.application) {
    notFound();
  }

  const application = applicationResult.application;
  const isCreator = userResult.user.role === "CREATOR";
  const isBrand = userResult.user.role === "BRAND";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/applications"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to applications
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {isCreator
                      ? application.campaign.title
                      : `Application from ${application.creator.name}`}
                  </CardTitle>
                  <StatusBadge status={application.status} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Application Message</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {application.message}
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Applied on {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {isBrand && application.status === "PENDING" && (
            <ApplicationActions applicationId={application.id} />
          )}
        </div>

        <div className="space-y-6">
          {isCreator && (
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">{application.campaign.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {application.campaign.description}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {application.campaign.currency}{" "}
                    {application.campaign.budget.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Budget</p>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/campaigns/${application.campaign.id}`}>
                    View Campaign
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {isBrand && (
            <Card>
              <CardHeader>
                <CardTitle>Creator Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    src={application.creator.avatarUrl}
                    name={application.creator.name}
                    size="lg"
                  />
                  <div>
                    <h4 className="font-semibold">{application.creator.name}</h4>
                    {application.creator.niche && (
                      <p className="text-sm text-muted-foreground">
                        {application.creator.niche}
                      </p>
                    )}
                  </div>
                </div>
                {application.creator.bio && (
                  <p className="text-sm text-muted-foreground">
                    {application.creator.bio}
                  </p>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/profile/${application.creator.id}`}>
                    View Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/messages/${application.creator.id}`}>
                    Send Message
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}



