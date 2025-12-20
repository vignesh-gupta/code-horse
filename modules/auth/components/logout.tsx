"use client";

import { PropsWithChildren } from "react";
import { signOut } from "../lib/auth-client";
import { useRouter } from "next/navigation";

const Logout = ({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) => {
  const router = useRouter();

  return (
    <span
      className={className}
      onClick={() =>
        signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/login");
            },
          },
        })
      }
    >
      {children}
    </span>
  );
};

export default Logout;
