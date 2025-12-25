"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { connectRepository } from "../actions";

export const useConnectRepository = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      githubId,
      owner,
      repo,
    }: {
      owner: string;
      repo: string;
      githubId: number;
    }) => {
      return await connectRepository(owner, repo, githubId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repositories"] });
      queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
      toast.success("Repository connected successfully");
    },
    onError: (error) => {
      if (error.name === "RateLimitError") {
        toast.error(error.message);
        return;
      }

      console.log("Failed to connect repo", error);
      toast.error("An error occurred while connecting the repository");
    },
  });
};
