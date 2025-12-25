"use server";

import db from "@/lib/db";
import { getCurrentSession } from "../auth/lib/utils";

export async function getReviews() {
  try {
    const session = await getCurrentSession();

    const reviews = await db.review.findMany({
      where: {
        repository: {
          userId: session.user.id,
        },
      },
      include: {
        repository: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}
