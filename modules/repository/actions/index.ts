"use server";

import db from "@/lib/db";
import { getCurrentSession } from "@/modules/auth/lib/utils";
import { getRepositories } from "@/modules/github/lib/github";

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
