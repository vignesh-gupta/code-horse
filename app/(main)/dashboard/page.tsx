"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getDashboardStats,
  getMonthlyActivity,
} from "@/modules/dashboard/actions";
import ContributionGraph from "@/modules/dashboard/components/contribution-graph";
import StatCard from "@/modules/dashboard/components/stat-card";
import { useQuery } from "@tanstack/react-query";
import { GitBranch, GitCommit, GitPullRequest, Sparkles } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COMMIT_COLOR = "#3b82f6";
const PR_COLOR = "#8b5cf6";
const REVIEW_COLOR = "#10b981";

const DashboardPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => await getDashboardStats(),
    refetchOnWindowFocus: false,
  });

  const { data: monthlyActivity, isLoading: isMonthlyActivityLoading } =
    useQuery({
      queryKey: ["monthly-activity"],
      queryFn: async () => await getMonthlyActivity(),
      refetchOnWindowFocus: false,
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="to-muted-foreground">
          Overview of your coding activity and AI reviews
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Repositories"
          description="Connected Repositories"
          icon={GitBranch}
          isLoading={isLoading}
          number={stats?.totalRepos || 0}
        />

        <StatCard
          title="Total Commits"
          description="In the last year"
          icon={GitCommit}
          isLoading={isLoading}
          number={stats?.totalCommits || 0}
        />

        <StatCard
          title="Pull Requests"
          description="All Time"
          icon={GitPullRequest}
          isLoading={isLoading}
          number={stats?.totalPRs || 0}
        />

        <StatCard
          title="AI Reviews"
          description="In the last year"
          icon={Sparkles}
          isLoading={isLoading}
          number={stats?.totalReviews || 0}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Contribution Activity</CardTitle>
            <CardDescription>
              Visualizing your coding frequency over the last year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContributionGraph />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
            <CardDescription>
              Proportion of commits, pull requests, and AI reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 w-full rounded-md" />
            ) : (
              <ChartContainer
                config={{
                  commits: {
                    label: "Commits",
                    color: COMMIT_COLOR,
                  },
                  prs: {
                    label: "Pull Requests",
                    color: PR_COLOR,
                  },
                  reviews: {
                    label: "AI Reviews",
                    color: REVIEW_COLOR,
                  },
                }}
                className="mx-auto aspect-square max-h-62.5"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Pie
                    data={[
                      {
                        label: "commits",
                        value: stats?.totalCommits || 0,
                        fill: COMMIT_COLOR,
                      },
                      {
                        label: "prs",
                        value: stats?.totalPRs || 0,
                        fill: PR_COLOR,
                      },
                      {
                        label: "reviews",
                        value: stats?.totalReviews || 0,
                        fill: REVIEW_COLOR,
                      },
                    ]}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={60}
                  />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>
              Monthly breakdown of commits, pull requests, and reviews (last 6
              months)
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isMonthlyActivityLoading ? (
              <Skeleton className="h-80 w-full rounded-md" />
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyActivity ?? []}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />
                    <YAxis />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                      }}
                      itemStyle={{
                        color: "var(--foreground)",
                      }}
                    />

                    <Legend />

                    <Bar
                      dataKey="commits"
                      radius={[4, 4, 0, 0]}
                      fill={COMMIT_COLOR}
                    />
                    <Bar dataKey="prs" radius={[4, 4, 0, 0]} fill={PR_COLOR} />
                    <Bar
                      dataKey="reviews"
                      fill={REVIEW_COLOR}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
