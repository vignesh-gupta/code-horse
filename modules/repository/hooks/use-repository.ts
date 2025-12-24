"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchRepositoryList } from "../actions";

export const useRepository = () => {
  return useInfiniteQuery({
    queryKey: ["repositories"],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchRepositoryList(pageParam, 12);
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
};
