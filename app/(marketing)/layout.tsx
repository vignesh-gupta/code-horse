import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CodeHorse - AI-Powered Code Reviews",
  description:
    "CodeHorse is an AI agent that reviews your pull requests, catches bugs, suggests improvements, and comments directly on your code — in seconds.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
