"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user-sync";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  name?: string;
  bio?: string;
  niche?: string;
  avatarUrl?: string;
  socials?: unknown;
}) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { error: "Not authenticated" };
    }

    const user = await getOrCreateUser(clerkUser.id);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.niche !== undefined && { niche: data.niche }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.socials !== undefined && { socials: data.socials }),
      },
      select: {
        id: true,
        name: true,
        bio: true,
        niche: true,
        avatarUrl: true,
        socials: true,
        role: true,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        bio: true,
        niche: true,
        avatarUrl: true,
        socials: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            campaigns: true,
            applications: true,
          },
        },
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { error: "Failed to fetch user profile" };
  }
}



