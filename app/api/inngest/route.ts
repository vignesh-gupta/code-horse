import { inngest } from "@/lib/inngest/client";
import { serve } from "inngest/next";
import { helloWorld } from "./functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld, // <-- This is where you'll always add all your functions
  ],
});
