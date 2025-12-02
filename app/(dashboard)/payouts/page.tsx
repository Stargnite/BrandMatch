import { getCurrentUser } from "@/app/actions/user";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { DollarSign } from "lucide-react";

export default async function PayoutsPage() {
  const userResult = await getCurrentUser();

  if (!userResult.success || !userResult.user) {
    redirect("/sign-in");
  }

  if (userResult.user.role !== "CREATOR") {
    redirect("/dashboard");
  }

  const payoutsResult = await prisma.payout.findMany({
    where: {
      creatorId: userResult.user.id,
    },
    include: {
      campaign: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  type Payout = {
    id: string;
    amount: number;
    currency: string;
    status: string;
    schematicPaymentId: string | null;
    createdAt: Date;
    campaign: { id: string; title: string };
  };

  const payouts: Payout[] = payoutsResult as Payout[];

  const totalEarnings = payouts
    .filter((p: Payout) => p.status === "SUCCESS")
    .reduce((sum: number, p: Payout) => sum + p.amount, 0);

  const pendingPayouts = payouts.filter((p: Payout) => p.status === "PENDING");
  const successfulPayouts = payouts.filter((p: Payout) => p.status === "SUCCESS");
  const failedPayouts = payouts.filter((p: Payout) => p.status === "FAILED");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Payouts</h1>
        <p className="text-muted-foreground mt-1">Your payment history</p>
      </div>

      {payouts.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No payouts yet"
          description="Your completed campaign payments will appear here"
        />
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-2xl font-bold">
                    ${totalEarnings.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingPayouts.length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{successfulPayouts.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {payouts.map((payout: Payout) => (
              <Card key={payout.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{payout.campaign.title}</h3>
                        <StatusBadge status={payout.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {payout.currency} {payout.amount.toLocaleString()}
                      </p>
                      {payout.schematicPaymentId && (
                        <p className="text-xs text-muted-foreground">
                          ID: {payout.schematicPaymentId}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

