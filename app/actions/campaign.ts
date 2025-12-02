"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user-sync";
import { revalidatePath } from "next/cache";

export async function createCampaign(data: {
  title: string;
  description: string;
  budget: number;
  currency: string;
  deliverables: unknown;
}) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { error: "Not authenticated" };
    }

    const user = await getOrCreateUser(clerkUser.id);
    if (user.role !== "BRAND") {
      return { error: "Only brands can create campaigns" };
    }

    const campaign = await prisma.campaign.create({
      data: {
        title: data.title,
        description: data.description,
        budget: data.budget,
        currency: data.currency,
        deliverables: data.deliverables,
        brandId: user.id,
        status: "ACTIVE",
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    revalidatePath("/campaigns");
    revalidatePath("/dashboard");
    revalidatePath("/campaigns/my-campaigns");

    return { success: true, campaign };
  } catch (error) {
    console.error("Error creating campaign:", error);
    return { error: "Failed to create campaign" };
  }
}

export async function updateCampaign(
  campaignId: string,
  data: {
    title?: string;
    description?: string;
    budget?: number;
    currency?: string;
    deliverables?: unknown;
    status?: "ACTIVE" | "CLOSED" | "COMPLETED";
  }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { error: "Not authenticated" };
    }

    const user = await getOrCreateUser(clerkUser.id);

    // Check ownership
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!existingCampaign) {
      return { error: "Campaign not found" };
    }

    if (existingCampaign.brandId !== user.id) {
      return { error: "Unauthorized" };
    }

    const campaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.description ? { description: data.description } : {}),
        ...(data.budget !== undefined ? { budget: data.budget } : {}),
        ...(data.currency ? { currency: data.currency } : {}),
        ...(data.deliverables ? { deliverables: data.deliverables } : {}),
        ...(data.status ? { status: data.status } : {}),
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    revalidatePath(`/campaigns/${campaignId}`);
    revalidatePath("/campaigns");
    revalidatePath("/campaigns/my-campaigns");
    revalidatePath("/dashboard");

    return { success: true, campaign };
  } catch (error) {
    console.error("Error updating campaign:", error);
    return { error: "Failed to update campaign" };
  }
}

export async function deleteCampaign(campaignId: string) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { error: "Not authenticated" };
    }

    const user = await getOrCreateUser(clerkUser.id);

    const existingCampaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!existingCampaign) {
      return { error: "Campaign not found" };
    }

    if (existingCampaign.brandId !== user.id) {
      return { error: "Unauthorized" };
    }

    await prisma.campaign.delete({
      where: { id: campaignId },
    });

    revalidatePath("/campaigns");
    revalidatePath("/campaigns/my-campaigns");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return { error: "Failed to delete campaign" };
  }
}

export async function getCampaigns(filters?: {
  status?: "ACTIVE" | "CLOSED" | "COMPLETED";
  brandId?: string;
}) {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.brandId && { brandId: filters.brandId }),
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, campaigns };
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return { error: "Failed to fetch campaigns" };
  }
}

export async function getCampaign(campaignId: string) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!campaign) {
      return { error: "Campaign not found" };
    }

    return { success: true, campaign };
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return { error: "Failed to fetch campaign" };
  }
}

