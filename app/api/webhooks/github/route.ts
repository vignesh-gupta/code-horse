import { reviewPullRequest } from "@/modules/ai/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const event = req.headers.get("X-GitHub-Event");

    if (event === "ping") {
      return NextResponse.json({ message: "pong" });
    }

    if (event === "pull_request") {
      const { action, repository, number:prNumber } = body;

      const [owner, repoName] = repository.full_name.split("/");

      if (action === "opened" || action === "synchronize") {
        reviewPullRequest(owner, repoName, prNumber)
          .then(() =>
            console.log(`Pull request #${prNumber} reviewed successfully.`)
          )
          .catch((error) => {
            console.error(
              `Error reviewing pull request for ${repoName} #${prNumber}:`,
              error
            );
          });
      }
    }

    // Handle other webhook events here

    return NextResponse.json({ message: "Event received" });
  } catch (error) {
    console.error("Error handling GitHub webhook:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
