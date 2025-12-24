"use server";

import db from "@/lib/db";
import { getCurrentSession } from "@/modules/auth/lib/utils";
import { deleteWebhook } from "@/modules/github/lib/github";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
  try {
    const session = await getCurrentSession();

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function updateUserProfile(data: {
  name?: string;
  email?: string;
}) {
  try {
    const session = await getCurrentSession();

    const updatedUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    revalidatePath("/dashboard/settings", "page");

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      error: "Failed to update user profile.",
    };
  }
}

export async function getConnectedRepositories() {
  try {
    const session = await getCurrentSession();

    const repositories = await db.repository.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        fullName: true,
        url: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return repositories;
  } catch (error) {
    console.error("Error fetching connected repositories:", error);
    return [];
  }
}

export async function disconnectRepository(repoId: string) {
  try {
    const session = await getCurrentSession();

    const repo = await db.repository.findFirst({
      where: {
        id: repoId,
        userId: session.user.id,
      },
    });

    if (!repo) {
      throw new Error("Repository not found or not authorized");
    }

    await Promise.allSettled([
      deleteWebhook(repo.owner, repo.name),
      db.repository.deleteMany({
        where: {
          id: repoId,
          userId: session.user.id,
        },
      }),
    ]);

    revalidatePath("/dashboard/repository", "page");
    revalidatePath("/dashboard/settings", "page");

    return { success: true };
  } catch (error) {
    console.error("Error disconnecting repository:", error);
    return { success: false, error: "Failed to disconnect repository." };
  }
}

export async function disconnectAllRepositories() {
  try {
    const session = await getCurrentSession();
    const repositories = await db.repository.findMany({
      where: {
        userId: session.user.id,
      },
    });

    const data = await Promise.all(
      repositories.map((repo) => deleteWebhook(repo.owner, repo.name))
    );

    const deletedRepos = data.flatMap((result, index) => {
      return result.success ? [repositories[index].id] : [];
    });

    await db.repository.deleteMany({
      where: {
        id: { in: deletedRepos },
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/repository", "page");
    revalidatePath("/dashboard/settings", "page");

    if (deletedRepos.length !== repositories.length) {
      throw new Error("Some repositories could not be disconnected");
    }

    return { success: true };
  } catch (error) {
    console.error("Error disconnecting all repositories:", error);
    return { success: false, error: "Failed to disconnect all repositories." };
  }
}
