"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateApplicationStatus } from "@/app/actions/application";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ApplicationActionsProps {
  applicationId: string;
}

export function ApplicationActions({ applicationId }: ApplicationActionsProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusUpdate(status: "ACCEPTED" | "REJECTED") {
    setIsProcessing(true);
    setError(null);

    const result = await updateApplicationStatus(applicationId, status);

    if (result.error) {
      setError(result.error);
      setIsProcessing(false);
    } else {
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button
            onClick={() => handleStatusUpdate("ACCEPTED")}
            disabled={isProcessing}
            className="flex-1"
          >
            Accept Application
          </Button>
          <Button
            onClick={() => handleStatusUpdate("REJECTED")}
            disabled={isProcessing}
            variant="destructive"
            className="flex-1"
          >
            Reject Application
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

