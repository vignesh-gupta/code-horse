import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitHubRepository } from "@/modules/github/lib/github";
import { ExternalLink, Star } from "lucide-react";
import { useState } from "react";

const RepositoryCard = (
  repo: GitHubRepository & {
    isConnected?: boolean;
  }
) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (repo: GitHubRepository) => {};

  return (
    <Card className="hover:shadow-md transition-shadow justify-between">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">{repo.name}</CardTitle>
          <Badge variant="outline">{repo.language || "Unknown"}</Badge>
          {repo.isConnected && <Badge variant="secondary">Connected</Badge>}
        </div>

        <Button
          onClick={() => handleConnect(repo)}
          disabled={isConnecting || repo.isConnected}
          variant={repo.isConnected ? "outline" : "default"}
        >
          {isConnecting
            ? "Connecting..."
            : repo.isConnected
            ? "Connected"
            : "Connect"}
        </Button>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2 min-h-10">
          {repo.description}
        </CardDescription>
      </CardContent>

      <CardFooter className="flex gap-4 items-center">
        <p className="text-muted-foreground">
          <Star className="inline mr-1 size-4 " />
          {repo.stargazers_count}
        </p>
        <a
          className="text-muted-foreground"
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="inline mr-0.5 size-4 " />
          {repo.full_name}
        </a>
      </CardFooter>
    </Card>
  );
};

export default RepositoryCard;
