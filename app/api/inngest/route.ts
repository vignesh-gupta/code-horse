import { inngest } from "@/lib/inngest/client";
import { serve } from "inngest/next";
import { indexRepo } from "./functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [indexRepo],
});
