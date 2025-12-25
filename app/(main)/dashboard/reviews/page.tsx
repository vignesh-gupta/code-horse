"use client";

import PageHeader from "@/components/page-header";
import { getReviews } from "@/modules/review/actions";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { ExternalLink, GitPullRequest, FileText, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ReviewPage = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => await getReviews(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Review History"
          description="View all the AI code reviews for connected repositories"
        />
        <ReviewListSkeleton />
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col gap-y-4 min-h-full">
        <PageHeader
          title="Review History"
          description="View all the AI code reviews for connected repositories"
        />
        <ReviewEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Review History"
        description="View all the AI code reviews for connected repositories"
      />
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewPage;

type ReviewWithRepository = Awaited<ReturnType<typeof getReviews>>[number];

const ReviewCard = ({ review }: { review: ReviewWithRepository }) => {
  const statusColors = {
    pending: "secondary",
    completed: "default",
    failed: "destructive",
  } as const;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <GitPullRequest className="size-4 text-muted-foreground" />
            <CardTitle className="line-clamp-1">{review.prTitle}</CardTitle>
            <Badge variant={statusColors[review.status]}>{review.status}</Badge>
          </div>
          <CardDescription className="flex items-center gap-4">
            <span className="font-medium text-foreground">
              {review.repository.fullName}
            </span>
            <span>PR #{review.prNumber}</span>
          </CardDescription>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2">
          <Clock className="size-3" />
          <span>
            {formatDistanceToNow(new Date(review.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="max-h-60 overflow-y-auto whitespace-pre-wrap wrap-break-word font-mono text-sm bg-accent/40 p-4 rounded-md mb-4">
          {review.review.length > 300
            ? review.review.substring(0, 300) + "..."
            : review.review}
        </pre>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={
            <a href={review.prUrl} target="_blank" rel="noopener noreferrer" />
          }
        >
          <ExternalLink className="size-4" />
          View on GitHub
        </Button>
      </CardContent>
    </Card>
  );
};

const ReviewListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="flex items-center gap-1.5 pt-2">
            <Skeleton className="size-3 rounded" />
            <Skeleton className="h-3 w-24" />
          </div>
        </CardHeader>
      </Card>
    ))}
  </div>
);

const ReviewEmptyState = () => (
  <Empty className="border bg-accent/10 flex-1">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <FileText className="size-5" />
      </EmptyMedia>
      <EmptyTitle>No reviews yet</EmptyTitle>
      <EmptyDescription>
        When you connect repositories and receive pull requests, AI code reviews
        will appear here.
      </EmptyDescription>
    </EmptyHeader>

    <EmptyContent>
      <Button
        nativeButton={false}
        render={
          <a href="/dashboard/repositories">
            <GitPullRequest className="size-4" />
            Connect Repositories
          </a>
        }
      />
    </EmptyContent>
  </Empty>
);
