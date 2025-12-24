"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import RepositoryCard from "@/modules/repository/components/repository-card";
import { RepositorySkeleton } from "@/modules/repository/components/repository-skeleton";
import { useRepository } from "@/modules/repository/hooks/use-repository";
import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const RepositoryPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const observerTarget = useRef(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRepository();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage({ cancelRefetch: true });
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredRepositories = useMemo(() => {
    if (!data) return [];

    const allRepositories = data?.pages.flatMap((page) => page) || [];

    return allRepositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        repo.full_name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [data, debouncedSearch]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">
            Manage and view your GitHub repositories.
          </p>
        </div>
        <RepositorySkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
        <p className="text-muted-foreground">
          Manage and view your GitHub repositories.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          type="text"
          placeholder="Search repositories..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 m-0.5">
        {filteredRepositories.map((repo) => (
          <RepositoryCard key={repo.id} {...repo} />
        ))}
      </div>
      <div ref={observerTarget} className="py-4">
        {isFetchingNextPage && <RepositorySkeleton count={5} />}
        {!hasNextPage && !isLoading && (
          <p className="text-center text-muted-foreground">
            No more repositories.
          </p>
        )}
      </div>
    </div>
  );
};

export default RepositoryPage;
