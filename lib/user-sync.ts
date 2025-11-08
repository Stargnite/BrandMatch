import { prisma } from "@/lib/db";

interface ClerkUserData {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}

type UserRole = "CREATOR" | "BRAND" | "ADMIN";

/**
 * Syncs a Clerk user to the Prisma database
 * Creates a new user if they don't exist, updates if they do
 */
export async function syncUserToDatabase(
  clerkId: string,
  clerkUserData: ClerkUserData
): Promise<{ id: string; role: UserRole }> {
  const name =
    [clerkUserData.firstName, clerkUserData.lastName]
      .filter(Boolean)
      .join(" ") || "User";

  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {
      name,
      avatarUrl: clerkUserData.imageUrl || null,
      updatedAt: new Date(),
    },
    create: {
      clerkId,
      name,
      avatarUrl: clerkUserData.imageUrl || null,
      role: "CREATOR", // Default role
    },
  });

  return { id: user.id, role: user.role as UserRole };
}

/**
 * Gets or creates a user in the database from Clerk ID
 * Useful for server-side operations
 */
export async function getOrCreateUser(clerkId: string): Promise<{
  id: string;
  role: UserRole;
  name: string;
  avatarUrl: string | null;
}> {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: {
      id: true,
      role: true,
      name: true,
      avatarUrl: true,
    },
  });

  if (user) {
    return {
      ...user,
      role: user.role as UserRole,
    };
  }

  // If user doesn't exist, we need to fetch from Clerk
  // This should typically be handled by webhooks, but this is a fallback
  throw new Error(
    `User with clerkId ${clerkId} not found. Please ensure webhooks are configured.`
  );
}

