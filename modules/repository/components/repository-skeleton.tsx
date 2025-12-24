import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RepositorySkeletonCard = () => {
  return (
    <Card className="hover:shadow-md transition-shadow justify-between">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>
            <Skeleton className="h-5 w-32" />
          </CardTitle>
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-8 w-24 ml-auto" />
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2 min-h-10">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardDescription>
      </CardContent>

      <CardFooter className="flex gap-4 items-center">
        <Skeleton className="h-5 w-12" />
      </CardFooter>
    </Card>
  );
};

export const RepositorySkeleton = ({ count = 9 }: { count?: number }) => {
  return (
    <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      {Array.from({ length: count }).map((_, index) => (
        <RepositorySkeletonCard key={index} />
      ))}
    </div>
  );
};
