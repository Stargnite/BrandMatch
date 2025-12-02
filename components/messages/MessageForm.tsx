"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/app/actions/message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageFormProps {
  receiverId: string;
}

export function MessageForm({ receiverId }: MessageFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSending(true);
    const result = await sendMessage(receiverId, content);

    if (!result.error) {
      setContent("");
      router.refresh();
    }
    setIsSending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        rows={3}
        disabled={isSending}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSending || !content.trim()}>
          {isSending ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}



