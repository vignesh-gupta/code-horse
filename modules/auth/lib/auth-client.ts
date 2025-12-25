import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";

export const { signIn, signOut, useSession, signUp } = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [polarClient()],
});
