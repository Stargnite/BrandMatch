"use client";

import { useState } from "react";
import { createApplication } from "@/app/actions/application";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

interface ApplicationFormProps {
  campaignId: string;
}

export function ApplicationForm({ campaignId }: ApplicationFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await createApplication(campaignId, message);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push(`/applications/${result.application?.id}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Apply for this Campaign</h3>
        <Textarea
          placeholder="Tell the brand why you're a great fit for this campaign..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          required
          minLength={50}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Minimum 50 characters
        </p>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button type="submit" disabled={isSubmitting || message.length < 50}>
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}



