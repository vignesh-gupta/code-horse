import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // const body = await req.json();

    const event = req.headers.get("X-GitHub-Event");

    if (event === "ping") {
      return NextResponse.json({ message: "pong" });
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