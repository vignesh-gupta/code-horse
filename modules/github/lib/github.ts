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
    sort: "updated",
    direction: "desc",
    page,
    per_page: perPage,
  });

  return data;
}


export type GitHubRepository = Awaited<ReturnType<typeof getRepositories>>[number];