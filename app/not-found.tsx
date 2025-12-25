import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Empty className="max-w-md border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestion className="size-6" />
          </EmptyMedia>
          <EmptyTitle className="text-2xl">Page Not Found</EmptyTitle>
          <EmptyDescription>
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The
            page might have been moved, deleted, or never existed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link href="/" />}>
            Go back home
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
