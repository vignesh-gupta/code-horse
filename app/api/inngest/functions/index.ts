import db from "@/lib/db";
import { inngest } from "@/lib/inngest/client";
import { indexCodeBase } from "@/modules/ai/lib/rag";
import { getRepoFilesContent } from "@/modules/github/lib/github";

export const indexRepo = inngest.createFunction(
  { id: "index-repo" },
  { event: "repository.connected" },
  async ({ event, step }) => {
    const { owner, name, userId } = event.data;

    const files = await step.run("fetch-repo-files", async () => {
      const account = await db.account.findFirst({
        where: {
          userId,
          providerId: "github",
        },
      });

      if (!account?.accessToken) {
        throw new Error("GitHub account not connected");
      }

      return await getRepoFilesContent(owner, name, account.accessToken);
    });

    await step.run("index-codebase", async () => {
      await indexCodeBase(`${owner}/${name}`, files);
    });

    return {
      success: true,
      message: `Repository ${owner}/${name} indexed successfully.`,
    };
  }
);
