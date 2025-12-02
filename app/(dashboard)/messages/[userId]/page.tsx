import { getCurrentUser } from "@/app/actions/user";
import { getMessages } from "@/app/actions/message";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { MessageForm } from "@/components/messages/MessageForm";
import Link from "next/link";

interface ConversationPageProps {
  params: Promise<{ userId: string }>;
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { userId } = await params;
  const userResult = await getCurrentUser();

  if (!userResult.success || !userResult.user) {
    redirect("/sign-in");
  }

  const messagesResult = await getMessages(userId);

  if (!messagesResult.success || !messagesResult.partner) {
    notFound();
  }

  type Message = {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: Date;
    sender: { id: string; name: string; avatarUrl: string | null };
    receiver: { id: string; name: string; avatarUrl: string | null };
  };

  const messages: Message[] = messagesResult.messages
    ? (messagesResult.messages as Message[])
    : [];
  const { partner } = messagesResult;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/messages"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to messages
        </Link>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserAvatar src={partner.avatarUrl} name={partner.name} size="md" />
            <div>
              <CardTitle>{partner.name}</CardTitle>
              {partner.bio && (
                <p className="text-sm text-muted-foreground">{partner.bio}</p>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message: Message) => {
                const isSent = message.senderId === userResult.user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-2 max-w-[80%] ${
                        isSent ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <UserAvatar
                        src={isSent ? undefined : message.sender.avatarUrl}
                        name={message.sender.name}
                        size="sm"
                      />
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isSent
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            isSent
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <MessageForm receiverId={userId} />
    </div>
  );
}

