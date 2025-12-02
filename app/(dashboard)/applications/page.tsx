import { getCurrentUser } from "@/app/actions/user";
import { getApplications } from "@/app/actions/application";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";

export default async function ApplicationsPage() {
  const userResult = await getCurrentUser();

  if (!userResult.success || !userResult.user) {
    redirect("/sign-in");
  }

  const applicationsResult = await getApplications();
  type Application = {
    id: string;
    status: string;
    message: string;
    createdAt: Date;
    creator: { id: string; name: string; avatarUrl: string | null; bio: string | null };
    campaign: { id: string; title: string; budget: number; currency: string; brand?: { avatarUrl: string | null } };
  };
  const applications: Application[] = applicationsResult.success
    ? (applicationsResult.applications as Application[])
    : [];

  const isCreator = userResult.user.role === "CREATOR";
  const isBrand = userResult.user.role === "BRAND";

  const pending = applications.filter((a) => a.status === "PENDING");
  const accepted = applications.filter((a) => a.status === "ACCEPTED");
  const rejected = applications.filter((a) => a.status === "REJECTED");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-muted-foreground mt-1">
          {isCreator
            ? "Track your campaign applications"
            : "Review applications to your campaigns"}
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description={
            isCreator
              ? "Start applying to campaigns to see your applications here"
              : "Applications to your campaigns will appear here"
          }
          action={
            isCreator
              ? {
                  label: "Browse Campaigns",
                  href: "/campaigns",
                }
              : undefined
          }
        />
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Pending</h2>
              <div className="space-y-4">
                {pending.map((application: Application) => (
                  <Card key={application.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <UserAvatar
                            src={
                              isCreator
                                ? application.campaign.brand?.avatarUrl
                                : application.creator.avatarUrl
                            }
                            name={
                              isCreator
                                ? application.campaign.title
                                : application.creator.name
                            }
                            size="md"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">
                                {isCreator
                                  ? application.campaign.title
                                  : application.creator.name}
                              </h3>
                              <StatusBadge status={application.status} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {application.message}
                            </p>
                            {isBrand && (
                              <p className="text-sm text-muted-foreground">
                                Budget: {application.campaign.currency}{" "}
                                {application.campaign.budget.toLocaleString()}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              Applied {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" asChild>
                          <Link href={`/applications/${application.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {accepted.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Accepted</h2>
              <div className="space-y-4">
                {accepted.map((application: Application) => (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <UserAvatar
                            src={
                              isCreator
                                ? application.campaign.brand?.avatarUrl
                                : application.creator.avatarUrl
                            }
                            name={
                              isCreator
                                ? application.campaign.title
                                : application.creator.name
                            }
                            size="md"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">
                                {isCreator
                                  ? application.campaign.title
                                  : application.creator.name}
                              </h3>
                              <StatusBadge status={application.status} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {application.message}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" asChild>
                          <Link href={`/applications/${application.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {rejected.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Rejected</h2>
              <div className="space-y-4">
                {rejected.map((application: Application) => (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <UserAvatar
                            src={
                              isCreator
                                ? application.campaign.brand?.avatarUrl
                                : application.creator.avatarUrl
                            }
                            name={
                              isCreator
                                ? application.campaign.title
                                : application.creator.name
                            }
                            size="md"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">
                                {isCreator
                                  ? application.campaign.title
                                  : application.creator.name}
                              </h3>
                              <StatusBadge status={application.status} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {application.message}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" asChild>
                          <Link href={`/applications/${application.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
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

