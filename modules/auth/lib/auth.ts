import db from "@/lib/db";
import { polarClient } from "@/modules/payment/config/polar";
import {
  SubscriptionStatus,
  SubscriptionTier,
  updateUserTier,
} from "@/modules/payment/lib/subscription";
import {
  checkout,
  polar,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ["repo"],
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "3a9d4387-250f-4031-bfe2-3e35027a21d5", // ID of Product from Polar Dashboard
              slug: "pro", // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
            },
          ],
          successUrl: "/success?checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true,
        }),
        portal({
          returnUrl:
            process.env.NEXT_PUBLIC_APP_URL ||
            "http://localhost:3000/dashboard",
        }),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onSubscriptionActive: async ({ data }) => {
            const { customerId } = data;

            const user = await db.user.findFirst({
              where: {
                polarCustomerId: customerId,
              },
            });

            if (!user) return;

            await updateUserTier(
              user.id,
              SubscriptionTier.PRO,
              SubscriptionStatus.ACTIVE,
              data.id
            );
          },
          onSubscriptionCanceled: async ({ data }) => {
            const { customerId } = data;

            const user = await db.user.findFirst({
              where: {
                polarCustomerId: customerId,
              },
            });

            if (!user) return;

            await updateUserTier(
              user.id,
              user.subscriptionTier,
              SubscriptionStatus.CANCELED
            );
          },
          onSubscriptionRevoked: async ({ data }) => {
            const { customerId } = data;

            const user = await db.user.findFirst({
              where: {
                polarCustomerId: customerId,
              },
            });

            if (!user) return;

            await updateUserTier(
              user.id,
              SubscriptionTier.FREE,
              SubscriptionStatus.EXPIRED
            );
          },
          onOrderPaid: async () => {},
          onCustomerCreated: async ({ data }) => {
            const user = await db.user.findUnique({
              where: { email: data.email },
            });

            if (!user) return;

            await db.user.update({
              where: { id: user.id },
              data: { polarCustomerId: data.id },
            });
          },
        }),
      ],
    }),
  ],
});
