import { inngest } from "@/lib/inngest/client";
import { serve } from "inngest/next";
import { indexRepo } from "./functions";
import { generateReview } from "./functions/review";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [indexRepo, generateReview],
});
