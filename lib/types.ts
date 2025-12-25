import { SubscriptionTier, User } from "./generated/prisma/browser";

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

export type SubscriptionData = {
  user: User | null;
  limit: UserLimit | null;
};
