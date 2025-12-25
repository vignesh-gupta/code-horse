"use server";

import db from "@/lib/db";
import { inngest } from "@/lib/inngest/client";
import {
  canCreateReview,
  incrementReviewCount,
} from "../payment/lib/subscription";
import { RateLimitError } from "@/lib/error";

export async function reviewPullRequest(
  owner: string,
  name: string,
  prNumber: number
) {
  try {
    const repository = await db.repository.findFirst({
      where: {
        owner,
        name,
      },
      include: {
        user: {
          include: {
            accounts: {
              where: {
                providerId: "github",
              },
            },
          },
        },
      },
    });

    if (!repository) {
      throw new Error("Repository not found");
    }

    const canReview = await canCreateReview(repository.userId, repository.id);

    if (!canReview) {
      throw new RateLimitError(
        "Review limit reached. Please upgrade your subscription to get more reviews."
      );
    }

    await inngest.send({
      name: "pr.review.requested",
      data: {
        owner,
        name,
        prNumber,
        userId: repository.userId,
      },
    });

    await incrementReviewCount(repository.userId, repository.id);

    return {
      success: true,
      message: "Review Queued",
    };
  } catch (error) {
    try {
      const repo = await db.repository.findFirst({
        where: {
          owner,
          name,
        },
      });

      if (!repo) {
        throw new Error("Repository not found for logging error");
      }

      await db.review.create({
        data: {
          repositoryId: repo.id,
          prNumber,
          prTitle: "Failed to fetch PR",
          prUrl: `https://github.com/${owner}/${name}/pull/${prNumber}`,
          review: `Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          status: "failed",
        },
      });
    } catch (error) {
      console.error("Error logging PR review failure:", error);
    }
  }
}
