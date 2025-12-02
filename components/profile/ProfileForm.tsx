"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  initialData: {
    name: string;
    bio?: string | null;
    niche?: string | null;
    avatarUrl?: string | null;
    socials?: unknown;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    bio: initialData.bio || "",
    niche: initialData.niche || "",
    avatarUrl: initialData.avatarUrl || "",
    socials: initialData.socials
      ? JSON.stringify(initialData.socials, null, 2)
      : "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let socials: unknown = null;
      if (formData.socials.trim()) {
        socials = JSON.parse(formData.socials);
      }

      const result = await updateProfile({
        name: formData.name,
        bio: formData.bio || undefined,
        niche: formData.niche || undefined,
        avatarUrl: formData.avatarUrl || undefined,
        socials,
      });

      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else {
        router.push("/profile");
        router.refresh();
      }
    } catch (err) {
      setError("Invalid JSON format for social links");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="niche">Niche</Label>
        <Input
          id="niche"
          value={formData.niche}
          onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
          placeholder="e.g., Tech, Fashion, Food"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatarUrl">Avatar URL</Label>
        <Input
          id="avatarUrl"
          type="url"
          value={formData.avatarUrl}
          onChange={(e) =>
            setFormData({ ...formData, avatarUrl: e.target.value })
          }
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="socials">Social Links (JSON format)</Label>
        <Textarea
          id="socials"
          value={formData.socials}
          onChange={(e) =>
            setFormData({ ...formData, socials: e.target.value })
          }
          rows={4}
          placeholder='{"instagram": "https://instagram.com/username", "twitter": "https://twitter.com/username"}'
        />
        <p className="text-xs text-muted-foreground">
          Enter social links as JSON object
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}



