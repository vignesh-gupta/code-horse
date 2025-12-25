import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, GitBranch, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  disconnectAllRepositories,
  disconnectRepository,
  getConnectedRepositories,
} from "../actions";

const RepositoryList = () => {
  const queryClient = useQueryClient();

  const [disconnectAllAlert, setDisconnectAllAlert] = useState(false);
  const [deletingRepoId, setDeletingRepoId] = useState<string | null>(null);

  const { data: connectedRepos, isLoading } = useQuery({
    queryKey: ["connected-repositories"],
    queryFn: async () => await getConnectedRepositories(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: disconnectRepo, isPending: isDisconnecting } =
    useMutation({
      mutationFn: async (id: string) => await disconnectRepository(id),
      onSuccess: (result) => {
        if (!result.success) {
          toast.error(result.error || "Failed to disconnect repository");
          return;
        }

        queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
        queryClient.invalidateQueries({ queryKey: ["repositories"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        toast.success("Repository disconnected successfully");
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
      onSettled: () => {
        setDeletingRepoId(null);
      },
    });

  const { mutateAsync: disconnectAllRepo, isPending: isDisconnectingAll } =
    useMutation({
      mutationFn: async () => await disconnectAllRepositories(),
      onSuccess: (result) => {
        if (!result.success) {
          toast.error(result.error || "Failed to disconnect all repositories");
          return;
        }

        queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        toast.success("All repositories disconnected successfully");
        setDisconnectAllAlert(false);
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    });

  const handleDisconnectRepo = async (id: string) => {
    setDeletingRepoId(id);
    await disconnectRepo(id);
  };

  const handleDisconnectAll = async () => {
    await disconnectAllRepo();
  };

  if (isLoading) {
    return <RepositorySkeleton />;
  }

  if (!connectedRepos || connectedRepos.length === 0) {
    return <NoRepositories />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Connected Repositories</CardTitle>
          <CardDescription>
            Manage your connected GitHub Repositories
          </CardDescription>
        </div>
        <AlertDialog
          open={disconnectAllAlert}
          onOpenChange={setDisconnectAllAlert}
        >
          <AlertDialogTrigger
            render={
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 size-4" />
                Disconnect All
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disconnect All Repositories?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently disconnect
                all {connectedRepos.length} repositories from your account and
                remove all associated webhooks.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDisconnectingAll}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={handleDisconnectAll}
                disabled={isDisconnectingAll}
              >
                {isDisconnectingAll ? "Disconnecting..." : "Disconnect All"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {connectedRepos.map((repo) => (
            <div
              key={repo.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                  <GitBranch className="text-muted-foreground size-5" />
                </div>
                <div>
                  <p className="font-medium">{repo.fullName || repo.name}</p>
                  <p className="text-muted-foreground text-sm">
                    Connected{" "}
                    {new Date(repo.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  nativeButton={false}
                  render={
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <ExternalLink className="size-4" />
                  <span className="sr-only">Open repository</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDisconnectRepo(repo.id)}
                  disabled={isDisconnecting && deletingRepoId === repo.id}
                >
                  <Trash2 className="text-destructive size-4" />
                  <span className="sr-only">Disconnect repository</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RepositoryList;

const RepositorySkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle>Connected Repositories</CardTitle>
      <CardDescription>
        Manage your connected GitHub Repositories
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-20 rounded-md" />
        <Skeleton className="h-20 rounded-md" />
      </div>
    </CardContent>
  </Card>
);

const NoRepositories = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="space-y-1.5">
        <CardTitle>Connected Repositories</CardTitle>
        <CardDescription>
          Manage your connected GitHub Repositories
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <Empty className="p-10">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <GitBranch />
          </EmptyMedia>
          <EmptyTitle>No repositories connected</EmptyTitle>
          <EmptyDescription>
            Connect a repository to start tracking your contributions.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </CardContent>
  </Card>
);
