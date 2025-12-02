"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user-sync";
import { revalidatePath } from "next/cache";

export async function sendMessage(receiverId: string, content: string) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { error: "Not authenticated" };
    }

    const user = await getOrCreateUser(clerkUser.id);

    if (user.id === receiverId) {
      return { error: "Cannot send message to yourself" };
    }

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    revalidatePath(`/messages/${receiverId}`);
    revalidatePath("/messages");

    return { success: true, message };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }
}

export async function getConversations() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { error: "Not authenticated" };
    }

    const user = await getOrCreateUser(clerkUser.id);

    // Get all unique conversation partners
    const sentMessages = await prisma.message.findMany({
      where: { senderId: user.id },
      select: { receiverId: true },
      distinct: ["receiverId"],
    });

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: user.id },
      select: { senderId: true },
      distinct: ["senderId"],
    });

    const partnerIds = [
      ...new Set([
        ...sentMessages.map((m: { receiverId: string }) => m.receiverId),
        ...receivedMessages.map((m: { senderId: string }) => m.senderId),
      ]),
    ];

    // Get latest message for each conversation
    const conversations = await Promise.all(
      partnerIds.map(async (partnerId) => {
        const latestMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: user.id, receiverId: partnerId },
              { senderId: partnerId, receiverId: user.id },
            ],
          },
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        });

        const partner =
          latestMessage?.senderId === user.id
            ? latestMessage.receiver
            : latestMessage?.sender;

        return {
          partnerId: partner?.id || partnerId,
          partner: partner || { id: partnerId, name: "Unknown", avatarUrl: null },
          latestMessage,
        };
      })
    );

    // Sort by latest message time
    conversations.sort((a, b) => {
      if (!a.latestMessage) return 1;
      if (!b.latestMessage) return -1;
      return (
        b.latestMessage.createdAt.getTime() -
        a.latestMessage.createdAt.getTime()
      );
    });

    return { success: true, conversations };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return { error: "Failed to fetch conversations" };
  }
}

export async function getMessages(userId: string) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { error: "Not authenticated" };
    }

    const user = await getOrCreateUser(clerkUser.id);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: userId },
          { senderId: userId, receiverId: user.id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get partner info
    const partner = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        bio: true,
      },
    });

    return { success: true, messages, partner };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { error: "Failed to fetch messages" };
  }
}

