import db from "@/lib/db";
import { getCurrentSession } from "@/modules/auth/lib/utils";
import { Octokit } from "octokit";

export const getGitHubToken = async () => {
  const session = await getCurrentSession();

  const account = await db.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
  });

  if (!account?.accessToken) {
    throw new Error("GitHub account not linked");
  }

  return account.accessToken;
};

export const getOctokitInstance = async () => {
  const token = await getGitHubToken();
  return new Octokit({ auth: token });
};

export const fetchUserContributions = async (userName: string) => {
  const octokit = await getOctokitInstance();

  const query = `
    query($userName: String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  type ContributionData = {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              date: string;
              contributionCount: number;
              color: string;
            }[];
          }[];
        };
      };
    };
  };

  try {
    const response = (await octokit.graphql(query, {
      userName,
    })) as ContributionData;

    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("Failed fetching user's contribution", error);
    throw new Error("Failed to fetch contributions from GitHub");
  }
};

export async function getRepositories(page: number = 1, perPage: number = 10) {
  const octokit = await getOctokitInstance();

  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    visibility: "all",
    sort: "pushed",
    direction: "desc",
    page,
    per_page: perPage,
  });

  return data;
}

export type GitHubRepository = Awaited<
  ReturnType<typeof getRepositories>
>[number];

export async function createWebhook(owner: string, repo: string) {
  const octokit = await getOctokitInstance();

  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/github`;

  const { data: hooks } = await octokit.rest.repos.listWebhooks({
    owner,
    repo,
  });

  const existingHook = hooks.find((hook) => hook.config.url === webhookUrl);

  if (existingHook) {
    return existingHook;
  }

  const { data } = await octokit.rest.repos.createWebhook({
    owner,
    repo,
    config: {
      url: webhookUrl,
      content_type: "json",
    },
    events: ["pull_request"],
  });

  return data;
}

export async function deleteWebhook(owner: string, repo: string) {
  const octokit = await getOctokitInstance();

  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/github`;

  try {
    const { data: hooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    const existingHook = hooks.find((hook) => hook.config.url === webhookUrl);

    if (!existingHook) {
      return {
        success: true,
        repo,
      };
    }

    await octokit.rest.repos.deleteWebhook({
      owner,
      repo,
      hook_id: existingHook.id,
    });

    return {
      success: true,
      repo,
    };
  } catch (error) {
    console.error("Failed to delete webhook", error);
    return {
      success: false,
      error: "Failed to delete webhook",
      repo,
    };
  }
}

export async function getRepoFilesContent(
  owner: string,
  repo: string,
  token: string,
  path: string = ""
): Promise<{ path: string; content: string }[]> {
  const octokit = new Octokit({ auth: token });
  const { data } = await octokit.rest.repos.getContent({
    owner,
    path,
    repo,
  });

  if (!Array.isArray(data)) {
    if (data.type === "file" && data.content) {
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return [{ path: data.path, content }];
    }
    return [];
  }

  const files: { path: string; content: string }[] = [];

  for (const item of data) {
    if (item.type === "file") {
      const { data: fileContent } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: item.path,
      });

      if (
        !Array.isArray(fileContent) &&
        fileContent.type === "file" &&
        fileContent.content
      ) {
        // Filter out non-code files based like images, binaries, etc.

        if (
          !item.name.match(
            /\.(png|jpg|jpeg|gif|bmp|svg|ico|exe|dll|bin|class|jar|zip|tar|gz|mp3|mp4|mov|avi|wmv|flv|mkv)$/i
          )
        ) {
          const content = Buffer.from(fileContent.content, "base64").toString(
            "utf-8"
          );
          files.push({ path: item.path, content });
        }
      }
    } else if (item.type === "dir") {
      const subDirFiles = await getRepoFilesContent(
        owner,
        repo,
        token,
        item.path
      );

      files.push(...subDirFiles);
    }
  }

  return files;
}

export async function getPullRequestDiff(
  owner: string,
  repo: string,
  prNumber: number,
  token: string
) {
  const octokit = new Octokit({ auth: token });

  const { data: pr } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  const { data: diff } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
    mediaType: {
      format: "diff",
    },
  });

  return {
    title: pr.title,
    description: pr.body || "",
    diff: diff as unknown as string,
    repoId: pr.base.repo.id,
  };
}

export async function postReviewComment(
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
  review: string
) {
  const octokit: Octokit = new Octokit({ auth: token });

  return await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: `## 🤖 AI Code Review\n\n${review}\n\n---\n*Powered  by CodeHorse*`,
  });
}
