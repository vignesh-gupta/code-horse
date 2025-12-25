"use server";

import db from "@/lib/db";
import {
  SubscriptionTier,
  SubscriptionStatus,
} from "@/lib/generated/prisma/enums";

export { SubscriptionTier, SubscriptionStatus };

export type UserLimit = {
  tier: SubscriptionTier;
  repositories: {
    current: number;
    limit: number | null; // null means unlimited
    canAdd: boolean;
  };
  reviews: {
    [repoId: string]: {
      current: number;
      limit: number | null;
      canAdd: boolean;
    };
  };
};

export const TIER_LIMITS = {
  FREE: {
    repositories: 5,
    reviewsPerRepository: 5,
  },
  PRO: {
    repositories: null,
    reviewsPerRepository: null,
  },
} as const;

export async function getUserTier(userId: string): Promise<SubscriptionTier> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true },
  });

  return user?.subscriptionTier || SubscriptionTier.FREE;
}

export async function getUserUsage(userId: string) {
  let usage = await db.userUsage.findUnique({
    where: { userId },
  });

  if (!usage) {
    usage = await db.userUsage.create({
      data: { userId },
    });
  }
  return usage;
}

export async function canConnectRepo(userId: string) {
  const tier = await getUserTier(userId);

  if (tier === SubscriptionTier.PRO) return true; // Pro users have no limits

  const usage = await getUserUsage(userId);
  const limit = TIER_LIMITS.FREE.repositories;

  return limit === null || usage.repositoryCount < limit;
}

export async function canCreateReview(userId: string, repositoryId: string) {
  const tier = await getUserTier(userId);
  if (tier === SubscriptionTier.PRO) return true; // Pro users have no limits

  const usage = await getUserUsage(userId);
  const limit = TIER_LIMITS.FREE.reviewsPerRepository;

  const reviewCount =
    (usage.reviewCount as Record<string, number> | null) ?? {};
  const currentReviews = reviewCount[repositoryId] || 0;

  return limit === null || currentReviews < limit;
}

export async function incrementRepositoryCount(userId: string) {
  await db.userUsage.upsert({
    where: { userId },
    create: {
      userId,
      repositoryCount: 1,
    },
    update: {
      repositoryCount: {
        increment: 1,
      },
    },
  });
}

export async function decrementRepositoryCount(userId: string) {
  const usage = await getUserUsage(userId);

  await db.userUsage.update({
    where: { userId },
    data: {
      repositoryCount: Math.max(0, usage.repositoryCount - 1),
    },
  });
}

export async function incrementReviewCount(
  userId: string,
  repositoryId: string
) {
  const usage = await getUserUsage(userId);
  const reviewCount = usage.reviewCount as Record<string, number>;

  reviewCount[repositoryId] = (reviewCount[repositoryId] || 0) + 1;

  await db.userUsage.update({
    where: { userId },
    data: {
      reviewCount,
    },
  });
}

export async function getRemainingLimits(userId: string): Promise<UserLimit> {
  const tier = await getUserTier(userId);
  const usage = await getUserUsage(userId);
  const reviewCount = usage.reviewCount as Record<string, number>;

  const limits: UserLimit = {
    tier,
    repositories: {
      current: usage.repositoryCount,
      limit: TIER_LIMITS[tier].repositories,
      canAdd:
        TIER_LIMITS[tier].repositories === null ||
        usage.repositoryCount < TIER_LIMITS[tier].repositories,
    },
    reviews: {},
  };

  const repositories = await db.repository.findMany({
    where: { userId },
    select: { id: true },
  });

  // Calculate review limits per repository
  for (const repo of repositories) {
    const currentReviews = reviewCount[repo.id] || 0;
    limits.reviews[repo.id] = {
      current: currentReviews,
      limit: TIER_LIMITS[tier].reviewsPerRepository,
      canAdd:
        TIER_LIMITS[tier].reviewsPerRepository === null ||
        currentReviews < TIER_LIMITS[tier].reviewsPerRepository,
    };
  }

  return limits;
}

export async function updateUserTier(
  userId: string,
  tier: SubscriptionTier,
  status: SubscriptionStatus,
  polarId?: string
) {
  await db.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: tier,
      subscriptionStatus: status,
      polarSubscriptionId: polarId,
    },
  });
}
