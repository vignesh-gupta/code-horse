"use server";

import db from "@/lib/db";
import { inngest } from "@/lib/inngest/client";
import { getCurrentSession } from "@/modules/auth/lib/utils";
import { createWebhook, getRepositories } from "@/modules/github/lib/github";
import {
  canConnectRepo,
  incrementRepositoryCount,
} from "@/modules/payment/lib/subscription";

export const fetchRepositoryList = async (
  page: number = 1,
  perPage: number = 10
) => {
  const session = await getCurrentSession();

  const repos = await getRepositories(page, perPage);

  const connectedRepos = await db.repository.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const connectedRepoIds = new Set(connectedRepos.map((repo) => repo.githubId));

  return repos.map((repo) => ({
    ...repo,
    isConnected: connectedRepoIds.has(BigInt(repo.id)),
  }));
};

export const connectRepository = async (
  owner: string,
  name: string,
  githubId: number
) => {
  const session = await getCurrentSession();

  const canConnect = await canConnectRepo(session.user.id);

  if (!canConnect) {
    throw new Error(
      "Repository limit reached. Please upgrade your subscription to connect more repositories."
    );
  }

  const webhook = await createWebhook(owner, name);

  if (!webhook) {
    throw new Error("Failed to create webhook");
  }

  await db.repository.create({
    data: {
      userId: session.user.id,
      githubId: BigInt(githubId),
      owner,
      name,
      fullName: `${owner}/${name}`,
      url: `https://github.com/${owner}/${name}`,
    },
  });

  await incrementRepositoryCount(session.user.id);

  try {
    await inngest.send({
      name: "repository.connected",
      data: {
        owner,
        name,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error("Failed to send inngest event:", error);
  }

  return webhook;
};
