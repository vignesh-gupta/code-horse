"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return session;
};
export const requireUnAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("[requiredUnAuth]", session);

  if (session?.user) {
    redirect("/");
  }

  return session;
};

export const getCurrentSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
};
