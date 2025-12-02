"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCampaign, updateCampaign } from "@/app/actions/campaign";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CampaignFormProps {
  campaignId?: string;
  initialData?: {
    title: string;
    description: string;
    budget: number;
    currency: string;
    deliverables: unknown;
  };
}

export function CampaignForm({ campaignId, initialData }: CampaignFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    budget: initialData?.budget?.toString() || "",
    currency: initialData?.currency || "USD",
    deliverables: initialData?.deliverables
      ? JSON.stringify(initialData.deliverables, null, 2)
      : "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let deliverables: unknown;
      if (formData.deliverables.trim()) {
        deliverables = JSON.parse(formData.deliverables);
      } else {
        deliverables = [];
      }

      const data = {
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        currency: formData.currency,
        deliverables,
      };

      let result;
      if (campaignId) {
        result = await updateCampaign(campaignId, data);
      } else {
        result = await createCampaign(data);
      }

      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else {
        router.push(
          campaignId
            ? `/campaigns/${campaignId}`
            : `/campaigns/${result.campaign?.id}`
        );
        router.refresh();
      }
    } catch (err) {
      setError("Invalid JSON format for deliverables");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
          placeholder="e.g., Instagram Campaign for Tech Product"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          rows={6}
          placeholder="Describe the campaign, requirements, and what you're looking for..."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="budget">Budget *</Label>
          <Input
            id="budget"
            type="number"
            step="0.01"
            min="0"
            value={formData.budget}
            onChange={(e) =>
              setFormData({ ...formData, budget: e.target.value })
            }
            required
            placeholder="1000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency *</Label>
          <select
            id="currency"
            value={formData.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliverables">Deliverables (JSON format)</Label>
        <Textarea
          id="deliverables"
          value={formData.deliverables}
          onChange={(e) =>
            setFormData({ ...formData, deliverables: e.target.value })
          }
          rows={4}
          placeholder='["1 Instagram post", "3 Instagram stories", "1 Reel"]'
        />
        <p className="text-xs text-muted-foreground">
          Enter deliverables as a JSON array, e.g., ["Post 1", "Post 2"]
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : campaignId
            ? "Update Campaign"
            : "Create Campaign"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}



