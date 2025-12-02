"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { syncUserToDatabase, getOrCreateUser } from "@/lib/user-sync";

/**
 * Helper to fetch the full Clerk user inside a Server Action
 * currentUser() does NOT work in server actions
 */
async function getClerkUser() {
  const { userId } = await auth();

  if (!userId) return null;

  // Fetch full user profile
  const client = await clerkClient();
  return await client.users.getUser(userId);
}

/**
 * Server action to sync the current user to the database
 */
export async function syncCurrentUser() {
  try {
    const clerkUser = await getClerkUser();

    if (!clerkUser) {
      return { error: "Not authenticated" };
    }

    const user = await syncUserToDatabase(clerkUser.id, {
      id: clerkUser.id,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error syncing current user:", error);
    return { error: "Failed to sync user" };
  }
}

/**
 * Server action to get the current user from database
 */
export async function getCurrentUser() {
  try {
    const clerkUser = await getClerkUser();

    if (!clerkUser) {
      return { error: "Not authenticated" };
    }

    const user = await getOrCreateUser(clerkUser.id);

    return { success: true, user };
  } catch (error) {
    console.error("Error getting current user:", error);
    return { error: "Failed to get user" };
  }
}





// "use server";

// import { currentUser } from "@clerk/nextjs/server";
// import { syncUserToDatabase, getOrCreateUser } from "@/lib/user-sync";

// /**
//  * Server action to sync the current user to the database
//  * Call this after authentication to ensure user exists in DB
//  */
// export async function syncCurrentUser() {
//   try {
//     const clerkUser = await currentUser();

//     if (!clerkUser) {
//       return { error: "Not authenticated" };
//     }

//     const user = await syncUserToDatabase(clerkUser.id, {
//       id: clerkUser.id,
//       firstName: clerkUser.firstName,
//       lastName: clerkUser.lastName,
//       imageUrl: clerkUser.imageUrl,
//     });

//     return { success: true, user };
//   } catch (error) {
//     console.error("Error syncing current user:", error);
//     return { error: "Failed to sync user" };
//   }
// }

// /**
//  * Server action to get the current user from database
//  */
// export async function getCurrentUser() {
//   try {
//     const clerkUser = await currentUser();

//     if (!clerkUser) {
//       return { error: "Not authenticated" };
//     }

//     const user = await getOrCreateUser(clerkUser.id);

//     return { success: true, user };
//   } catch (error) {
//     console.error("Error getting current user:", error);
//     return { error: "Failed to get user" };
//   }
// }

