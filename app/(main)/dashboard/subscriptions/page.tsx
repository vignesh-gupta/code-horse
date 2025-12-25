"use client";

import PageHeader from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
  SubscriptionStatus,
  SubscriptionTier,
} from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { checkout, customer } from "@/modules/auth/lib/auth-client";
import {
  getSubscriptionData,
  syncSubscriptionStatus,
} from "@/modules/payment/actions";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  CreditCard,
  Crown,
  ExternalLink,
  FolderGit2,
  Loader2,
  MessageSquare,
  RefreshCw,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PLAN_FEATURES = {
  FREE: [
    { name: "Connect up to 5 repositories", included: true },
    { name: "5 AI reviews per repository", included: true },
    { name: "Basic code reviews", included: true },
    { name: "Community support", included: true },
    { name: "Advanced analytics", included: false },
    { name: "Priority support", included: false },
  ],
  PRO: [
    { name: "Connect unlimited repositories", included: true },
    { name: "Unlimited AI reviews per repository", included: true },
    { name: "Advanced code reviews", included: true },
    { name: "Email support", included: true },
    { name: "Advanced analytics", included: true },
    { name: "Priority support", included: true },
  ],
};

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with AI reviews",
    tier: SubscriptionTier.FREE,
    icon: Zap,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For professional developers and teams",
    tier: SubscriptionTier.PRO,
    icon: Crown,
    popular: true,
  },
];

const SubscriptionPage = () => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["subscription-status"],
    queryFn: async () => await getSubscriptionData(),
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (success === "true") {
      const sync = async () => {
        try {
          await syncSubscriptionStatus();
          refetch();
        } catch (error) {
          console.error("Failed to sync subscription after checkout:", error);
        }
      };

      sync();
    }
  }, [success, refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spinner className="w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Subscription" description="Failed to load plans" />
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading your subscription data. Please try again
            <Button
              variant="outline"
              className="ml-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Subscription"
          description="Please sign in to view subscription options"
        />
      </div>
    );
  }

  const currentTier = data.user.subscriptionTier || SubscriptionTier.FREE;
  const isPro = currentTier === SubscriptionTier.PRO;
  const isActive = data.user.subscriptionStatus === SubscriptionStatus.ACTIVE;
  const limit = data.limit;

  // Calculate total reviews across all repositories
  const totalReviews = limit
    ? Object.values(limit.reviews).reduce((acc, r) => acc + r.current, 0)
    : 0;
  const totalReviewLimit = limit
    ? Object.keys(limit.reviews).length *
      (limit.tier === SubscriptionTier.PRO ? Infinity : 5)
    : 0;

  const handleSync = async () => {
    setSyncLoading(true);
    try {
      const result = await syncSubscriptionStatus();
      if (result.success) {
        toast.success("Subscription status synced successfully");
        refetch();
      } else {
        toast.error(result.message || "Failed to sync subscription status");
      }
    } catch {
      toast.error("Failed to sync subscription status");
    } finally {
      setSyncLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setCheckoutLoading(true);

      await checkout({
        slug: "pro",
      });
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      await customer.portal();
    } catch {
      toast.error("Failed to open customer portal");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          title="Subscription"
          description="Manage your subscription plan and usage"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={syncLoading}
        >
          {syncLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Sync Status
        </Button>
      </div>

      {/* Success/Canceled Alerts */}
      {success === "true" && (
        <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
          <Check className="size-4 text-green-600" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your subscription has been updated successfully. Changes may take a
            few minutes to reflect.
          </AlertDescription>
        </Alert>
      )}

      {canceled === "true" && (
        <Alert className="border-yellow-600 bg-yellow-50 dark:bg-yellow-950">
          <X className="size-4 text-yellow-600" />
          <AlertTitle>Checkout Canceled</AlertTitle>
          <AlertDescription>
            Your checkout was canceled. No charges were made.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Usage Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Current Usage
              </CardTitle>
              <CardDescription>
                Track your repository and review usage
              </CardDescription>
            </div>
            <Badge variant={isPro ? "default" : "secondary"}>
              {isPro ? (
                <>
                  <Crown className="w-3 h-3 mr-1" />
                  Pro Plan
                </>
              ) : (
                "Free Plan"
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Repositories Usage */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FolderGit2 className="w-4 h-4 text-muted-foreground" />
                Connected Repositories
              </div>
              {limit && (
                <>
                  <Progress
                    value={
                      limit.repositories.limit
                        ? (limit.repositories.current /
                            limit.repositories.limit) *
                          100
                        : 0
                    }
                    className={cn({
                      hidden: isPro,
                    })}
                  >
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <ProgressLabel>
                        {limit.repositories.current} /{" "}
                        {limit.repositories.limit ?? "∞"}
                      </ProgressLabel>
                      <ProgressValue />
                    </div>
                  </Progress>
                  {!isPro && limit.repositories.limit && (
                    <p className="text-xs text-muted-foreground">
                      {limit.repositories.limit - limit.repositories.current}{" "}
                      repositories remaining
                    </p>
                  )}
                  {isPro && (
                    <p className="text-xs text-muted-foreground">
                      Unlimited repositories with Pro plan
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Reviews Usage */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                AI Reviews Used
              </div>
              {limit && (
                <>
                  <Progress
                    value={
                      totalReviewLimit > 0
                        ? (totalReviews / totalReviewLimit) * 100
                        : 0
                    }
                    className={cn({
                      hidden: isPro,
                    })}
                  >
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <ProgressLabel>
                        {totalReviews} {!isPro && `/ ${totalReviewLimit}`}{" "}
                        {isPro && "reviews"}
                      </ProgressLabel>
                      {!isPro && <ProgressValue />}
                    </div>
                  </Progress>
                  {!isPro && (
                    <p className="text-xs text-muted-foreground">
                      5 reviews per repository on Free plan
                    </p>
                  )}
                  {isPro && (
                    <p className="text-xs text-muted-foreground">
                      Unlimited reviews with Pro plan
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Choose Your Plan</h2>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
          {PLANS.map((plan) => {
            const isCurrentPlan = plan.tier === currentTier;
            const features = PLAN_FEATURES[plan.tier];
            const Icon = plan.icon;

            return (
              <Card
                key={plan.id}
                className={cn("relative overflow-visible", {
                  "border-primary shadow-lg ring-1 ring-primary":
                    plan.popular && !isCurrentPlan,
                  "bg-muted/50": isCurrentPlan,
                })}
              >
                {plan.popular && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="default" className="px-3">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-lg ${
                          plan.popular
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <CardTitle>{plan.name}</CardTitle>
                    </div>
                    {isCurrentPlan && (
                      <Badge variant="secondary">Current Plan</Badge>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="pb-4">
                  <div className="mb-6">
                    <span className="text-4xl font-bold font-mono">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      /{plan.period}
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/50 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={
                            feature.included ? "" : "text-muted-foreground/50"
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  {plan.tier === SubscriptionTier.FREE ? (
                    isCurrentPlan ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleManageSubscription}
                        disabled={portalLoading}
                      >
                        {portalLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CreditCard className="w-4 h-4 mr-2" />
                        )}
                        Manage Subscription
                      </Button>
                    )
                  ) : isCurrentPlan && isActive ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                    >
                      {portalLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ExternalLink className="w-4 h-4 mr-2" />
                      )}
                      Manage Subscription
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleUpgrade}
                      disabled={checkoutLoading}
                    >
                      {checkoutLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      Upgrade to Pro
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions for Pro Users */}
      {isPro && isActive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Billing & Subscription
            </CardTitle>
            <CardDescription>
              Manage your billing details, update payment methods, or cancel
              your subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              disabled={portalLoading}
            >
              {portalLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4 mr-2" />
              )}
              Open Billing Portal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionPage;
