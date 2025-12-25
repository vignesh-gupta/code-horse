"use server";

import db from "@/lib/db";
import {
  SubscriptionStatus,
  SubscriptionTier,
} from "@/lib/generated/prisma/enums";
import { SubscriptionData } from "@/lib/types";
import { getCurrentSession } from "../auth/lib/utils";
import { polarClient } from "./config/polar";
import { getRemainingLimits, updateUserTier } from "./lib/subscription";

export async function getSubscriptionData(): Promise<SubscriptionData> {
  const session = await getCurrentSession();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { user: null, limit: null };
  }

  const limit = await getRemainingLimits(user.id);

  return { user, limit };
}

export async function syncSubscriptionStatus() {
  const session = await getCurrentSession();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.polarCustomerId) {
    return { success: false, message: "No Polar customer ID found" };
  }

  try {
    // Fetch subscriptions from Polar
    const result = await polarClient.subscriptions.list({
      customerId: user.polarCustomerId,
    });

    const subscriptions = result.result?.items || [];

    // Find the most relevant subscription (active or most recent)
    const activeSub = subscriptions.find((sub) => sub.status === "active");
    const latestSub = subscriptions[0]; // Assuming API returns sorted or we should sort

    if (!activeSub && !latestSub) {
      return { success: true, status: "NO_SUBSCRIPTION" };
    }

    if (activeSub) {
      await updateUserTier(
        user.id,
        SubscriptionTier.PRO,
        SubscriptionStatus.ACTIVE,
        activeSub.id
      );
      return { success: true, status: SubscriptionStatus.ACTIVE };
    }

    if (latestSub) {
      // If latest is canceled/expired
      const status =
        latestSub.status === "canceled"
          ? SubscriptionStatus.CANCELED
          : SubscriptionStatus.EXPIRED;
      // Only downgrade if we are sure it's not active
      if (latestSub.status !== "active") {
        await updateUserTier(
          user.id,
          SubscriptionTier.FREE,
          status,
          latestSub.id
        );
      }
    }

    return { success: true, status: "NO_SUBSCRIPTION" };
  } catch (error) {
    console.error("Failed to sync subscription:", error);
    return { success: false, error: "Failed to sync with Polar" };
  }
}


