"use client";

import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { getContributionStats } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GitGraphIcon } from "lucide-react";

import { ActivityCalendar } from "react-activity-calendar";

const ContributionGraph = () => {
  const { theme } = useTheme();

  const { data, isLoading } = useQuery({
    queryKey: ["contribution-graph"],
    queryFn: async () => await getContributionStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return <Skeleton className="h-50 w-full rounded-md" />;
  }

  if (!data || !data.contributions.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <GitGraphIcon />
          </EmptyMedia>
          <EmptyTitle>No Contributions Found</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 p-4">
      <p className="font-semibold text-muted-foreground">
        <span className="font-semibold text-foreground">
          {data.totalContributions}
        </span>{" "}
        contributions in the last year
      </p>

      <div className="w-full overflow-x-auto">
        <div className="flex justify-center min-w-max px-4">
          <ActivityCalendar
            data={data.contributions}
            colorScheme={theme === "dark" ? "dark" : "light"}
            blockSize={11}
            blockMargin={4}
            fontSize={14}
            showWeekdayLabels
            showMonthLabels
            theme={{
              light: ["hsl(0,0%,92%)", "hsl(142,71%,45%)"],
              dark: ["#161b22", "hsl(142,71%,45%)"],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
