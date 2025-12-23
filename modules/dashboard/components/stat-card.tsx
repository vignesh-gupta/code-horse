import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  number: number;
  isLoading: boolean;
};

const StatCard = ({
  title,
  description,
  icon: Icon,
  isLoading,
  number,
}: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="size-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {isLoading ? "..." : number.toLocaleString()}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default StatCard;
