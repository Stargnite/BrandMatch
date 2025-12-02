import { getCurrentUser } from "@/app/actions/user";
import { getConversations } from "@/app/actions/message";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export default async function MessagesPage() {
  const userResult = await getCurrentUser();

  if (!userResult.success || !userResult.user) {
    redirect("/sign-in");
  }

  const conversationsResult = await getConversations();
  const conversations = conversationsResult.success
    ? conversationsResult.conversations
    : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-1">Your conversations</p>
      </div>

      {conversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="Start a conversation by messaging a creator or brand"
        />
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => {
            if (!conversation.latestMessage) return null;

            const isSent = conversation.latestMessage.senderId === userResult.user?.id;
            const partner = conversation.partner;

            return (
              <Link
                key={conversation.partnerId}
                href={`/messages/${conversation.partnerId}`}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <UserAvatar
                        src={partner.avatarUrl}
                        name={partner.name}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold truncate">{partner.name}</h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(
                              conversation.latestMessage!.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {isSent && "You: "}
                          {conversation.latestMessage!.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}



