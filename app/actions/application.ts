"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user-sync";
import { revalidatePath } from "next/cache";

export async function createApplication(campaignId: string, message: string) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { error: "Not authenticated" };
    }

    const user = await getOrCreateUser(clerkUser.id);
    if (user.role !== "CREATOR") {
      return { error: "Only creators can apply to campaigns" };
    }

    // Check if campaign exists and is active
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return { error: "Campaign not found" };
    }

    if (campaign.status !== "ACTIVE") {
      return { error: "Campaign is not accepting applications" };
    }

    // Check if user already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        campaignId,
        creatorId: user.id,
      },
    });

    if (existingApplication) {
      return { error: "You have already applied to this campaign" };
    }

    const application = await prisma.application.create({
      data: {
        message,
        campaignId,
        creatorId: user.id,
        status: "PENDING",
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        campaign: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    revalidatePath(`/campaigns/${campaignId}`);
    revalidatePath("/applications");
    revalidatePath("/dashboard");

    return { success: true, application };
  } catch (error) {
    console.error("Error creating application:", error);
    return { error: "Failed to create application" };
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "PENDING" | "ACCEPTED" | "REJECTED"
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { error: "Not authenticated" };
    }

    const user = await getOrCreateUser(clerkUser.id);
    if (user.role !== "BRAND") {
      return { error: "Only brands can update application status" };
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        campaign: true,
      },
    });

    if (!application) {
      return { error: "Application not found" };
    }

    if (application.campaign.brandId !== user.id) {
      return { error: "Unauthorized" };
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        campaign: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    revalidatePath(`/applications/${applicationId}`);
    revalidatePath("/applications");
    revalidatePath("/dashboard");

    return { success: true, application: updatedApplication };
  } catch (error) {
    console.error("Error updating application status:", error);
    return { error: "Failed to update application status" };
  }
}

export async function getApplications(filters?: {
  creatorId?: string;
  campaignId?: string;
  status?: "PENDING" | "ACCEPTED" | "REJECTED";
}) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { error: "Not authenticated" };
    }

    const user = await getOrCreateUser(clerkUser.id);

    // If creator, show their applications
    // If brand, show applications to their campaigns
    const where: {
      creatorId?: string;
      campaignId?: string;
      status?: "PENDING" | "ACCEPTED" | "REJECTED";
      campaign?: { brandId?: string };
    } = {};

    if (user.role === "CREATOR") {
      where.creatorId = user.id;
    } else if (user.role === "BRAND") {
      where.campaign = { brandId: user.id };
    }

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.campaignId) {
      where.campaignId = filters.campaignId;
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true,
          },
        },
        campaign: {
          select: {
            id: true,
            title: true,
            budget: true,
            currency: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, applications };
  } catch (error) {
    console.error("Error fetching applications:", error);
    return { error: "Failed to fetch applications" };
  }
}

export async function getApplication(applicationId: string) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { error: "Not authenticated" };
    }

    const user = await getOrCreateUser(clerkUser.id);

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true,
            niche: true,
          },
        },
        campaign: {
          include: {
            brand: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      return { error: "Application not found" };
    }

    // Check authorization
    if (
      user.role === "CREATOR" &&
      application.creatorId !== user.id
    ) {
      return { error: "Unauthorized" };
    }

    if (
      user.role === "BRAND" &&
      application.campaign.brandId !== user.id
    ) {
      return { error: "Unauthorized" };
    }

    return { success: true, application };
  } catch (error) {
    console.error("Error fetching application:", error);
    return { error: "Failed to fetch application" };
  }
}

