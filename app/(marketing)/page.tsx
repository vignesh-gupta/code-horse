import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Bot,
  Check,
  Code2,
  GitBranch,
  GitPullRequest,
  Github,
  MessageSquare,
  Shield,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";

// --- ANIMATED CODE BLOCK ---
const CodeBlock = ({ className }: { className?: string }) => {
  const codeLines = [
    { type: "comment", text: "// AI-powered code review in action" },
    { type: "keyword", text: "async function" },
    { type: "function", text: " reviewPullRequest" },
    { type: "punctuation", text: "(pr: PullRequest) {" },
    { type: "indent", text: "  const analysis = await " },
    { type: "ai", text: "codeHorse" },
    { type: "method", text: ".analyze(pr);" },
    { type: "indent", text: "  " },
    { type: "keyword", text: "return" },
    { type: "indent", text: " {" },
    { type: "property", text: "    suggestions: " },
    { type: "value", text: "analysis.improvements," },
    { type: "property", text: "    security: " },
    { type: "value", text: "analysis.vulnerabilities," },
    { type: "property", text: "    performance: " },
    { type: "value", text: "analysis.optimizations" },
    { type: "indent", text: "  };" },
    { type: "punctuation", text: "}" },
  ];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50 bg-zinc-950/80 backdrop-blur-xl p-6 font-mono text-sm",
        className
      )}
    >
      {/* Window controls */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-4 text-xs text-muted-foreground">
          review.ts — CodeHorse
        </span>
      </div>

      {/* Code content */}
      <div className="space-y-1">
        {codeLines.map((line, i) => (
          <div
            key={i}
            className="opacity-0 animate-fade-slide-up"
            style={{
              animationDelay: `${i * 80}ms`,
              animationFillMode: "forwards",
            }}
          >
            <span
              className={cn({
                "text-zinc-500": line.type === "comment",
                "text-purple-400": line.type === "keyword",
                "text-yellow-300": line.type === "function",
                "text-zinc-400":
                  line.type === "punctuation" || line.type === "indent",
                "text-orange-400": line.type === "ai",
                "text-blue-400": line.type === "method",
                "text-cyan-400": line.type === "property",
                "text-green-400": line.type === "value",
              })}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
    </div>
  );
};

// --- FEATURE CARD ---
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) => (
  <div
    className="group relative p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:bg-card/60 opacity-0 animate-fade-slide-up"
    style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
  >
    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

// --- HOW IT WORKS STEP ---
const StepCard = ({
  number,
  title,
  description,
  delay = 0,
}: {
  number: number;
  title: string;
  description: string;
  delay?: number;
}) => (
  <div
    className="relative flex gap-4 opacity-0 animate-fade-slide-up"
    style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
  >
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-mono font-bold text-primary">
        {number}
      </div>
      {number < 3 && <div className="w-0.5 h-full bg-border mt-2" />}
    </div>
    <div className="pb-8">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </div>
);

// --- PRICING CARD ---
const PricingCard = ({
  name,
  price,
  description,
  features,
  popular = false,
  delay = 0,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  delay?: number;
}) => (
  <div
    className={cn(
      "relative p-8 rounded-2xl border backdrop-blur-xl opacity-0 animate-fade-slide-up",
      popular ? "border-primary bg-primary/5" : "border-border/50 bg-card/40"
    )}
    style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
  >
    {popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
        Most Popular
      </div>
    )}
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <div className="flex items-baseline justify-center gap-1 mb-2">
        <span className="text-4xl font-bold">{price}</span>
        {price !== "Custom" && (
          <span className="text-muted-foreground">/mo</span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <ul className="space-y-3 mb-8">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-primary shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button
      className={cn(
        "w-full h-12 rounded-xl",
        popular ? "" : "bg-secondary hover:bg-secondary/80"
      )}
    >
      Get Started
    </Button>
  </div>
);

// --- TESTIMONIAL CARD ---
const TestimonialCard = ({
  quote,
  author,
  role,
  company,
  delay = 0,
}: {
  quote: string;
  author: string;
  role: string;
  company: string;
  delay?: number;
}) => (
  <div
    className="p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl opacity-0 animate-fade-slide-up"
    style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
  >
    <p className="text-sm leading-relaxed mb-4 text-foreground/80">
      &ldquo;{quote}&rdquo;
    </p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
        {author[0]}
      </div>
      <div>
        <p className="text-sm font-medium">{author}</p>
        <p className="text-xs text-muted-foreground">
          {role} at {company}
        </p>
      </div>
    </div>
  </div>
);

// --- NAVBAR ---
const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Terminal className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-semibold tracking-tight">CodeHorse</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <a
          href="#features"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Features
        </a>
        <a
          href="#how-it-works"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          How it Works
        </a>
        <a
          href="#pricing"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Pricing
        </a>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Docs
        </a>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm" className="rounded-xl">
            Get Started
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  </nav>
);

// --- FOOTER ---
const Footer = () => (
  <footer className="border-t border-border/50 bg-card/20">
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">CodeHorse</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            AI-powered code review that helps teams ship better code, faster.
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-4">Product</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Changelog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Integrations
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-4">Resources</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                API Reference
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Support
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-4">Company</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} CodeHorse. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// --- MAIN LANDING PAGE ---
export default async function LandingPage() {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Reviews",
      description:
        "Our advanced AI analyzes your code for bugs, security issues, and best practices in seconds.",
    },
    {
      icon: GitPullRequest,
      title: "PR Integration",
      description:
        "Seamlessly integrates with GitHub, GitLab, and Bitbucket. Comments directly on your PRs.",
    },
    {
      icon: Shield,
      title: "Security Scanning",
      description:
        "Detect vulnerabilities, exposed secrets, and security anti-patterns before they reach production.",
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description:
        "Get actionable suggestions within seconds of pushing code. No more waiting for human reviewers.",
    },
    {
      icon: Code2,
      title: "Code Quality",
      description:
        "Enforce coding standards, detect code smells, and suggest refactoring opportunities automatically.",
    },
    {
      icon: MessageSquare,
      title: "Smart Comments",
      description:
        "Contextual, actionable comments that explain issues and provide code suggestions.",
    },
  ];

  const testimonials = [
    {
      quote:
        "CodeHorse has transformed our code review process. What used to take hours now takes minutes.",
      author: "Sarah Chen",
      role: "Engineering Lead",
      company: "Vercel",
    },
    {
      quote:
        "The AI catches bugs that human reviewers miss. It's like having an extra senior engineer on every PR.",
      author: "Marcus Johnson",
      role: "CTO",
      company: "Stripe",
    },
    {
      quote:
        "We've reduced our review cycle time by 70%. The ROI was obvious within the first week.",
      author: "Emily Rodriguez",
      role: "VP Engineering",
      company: "Linear",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-mono">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl opacity-50" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-card/40 backdrop-blur-xl text-sm mb-6 opacity-0 animate-fade-slide-up"
                style={{ animationFillMode: "forwards" }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span>AI-Powered Code Reviews</span>
              </div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 opacity-0 animate-fade-slide-up"
                style={{
                  animationDelay: "100ms",
                  animationFillMode: "forwards",
                }}
              >
                Ship better code,{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                  faster
                </span>
              </h1>
              <p
                className="text-lg text-muted-foreground mb-8 max-w-lg opacity-0 animate-fade-slide-up"
                style={{
                  animationDelay: "200ms",
                  animationFillMode: "forwards",
                }}
              >
                CodeHorse is an AI agent that reviews your pull requests,
                catches bugs, suggests improvements, and comments directly on
                your code — in seconds.
              </p>
              <div
                className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-slide-up"
                style={{
                  animationDelay: "300ms",
                  animationFillMode: "forwards",
                }}
              >
                <Link href="/register">
                  <Button size="lg" className="h-14 px-8 rounded-2xl text-base">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 rounded-2xl text-base"
                >
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                </Button>
              </div>
              <div
                className="mt-8 flex items-center gap-6 text-sm text-muted-foreground opacity-0 animate-fade-slide-up"
                style={{
                  animationDelay: "400ms",
                  animationFillMode: "forwards",
                }}
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Free 14-day trial
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  No credit card required
                </div>
              </div>
            </div>
            <div
              className="opacity-0 animate-fade-slide-up"
              style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
            >
              <CodeBlock />
            </div>
          </div>

          {/* Social proof */}
          <div
            className="mt-20 text-center opacity-0 animate-fade-slide-up"
            style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
          >
            <p className="text-sm text-muted-foreground mb-6">
              Trusted by engineering teams at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-muted-foreground/60">
              {[
                "Vercel",
                "Stripe",
                "Linear",
                "Notion",
                "Figma",
                "Supabase",
              ].map((company) => (
                <span key={company} className="text-lg font-medium">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 opacity-0 animate-fade-slide-up"
              style={{ animationFillMode: "forwards" }}
            >
              Everything you need for{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                better code reviews
              </span>
            </h2>
            <p
              className="text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-slide-up"
              style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
            >
              CodeHorse brings AI-powered intelligence to every pull request,
              helping your team ship higher quality code with less effort.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={200 + i * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-card/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4 opacity-0 animate-fade-slide-up"
                style={{ animationFillMode: "forwards" }}
              >
                Set up in{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                  minutes
                </span>
              </h2>
              <p
                className="text-muted-foreground mb-10 opacity-0 animate-fade-slide-up"
                style={{
                  animationDelay: "100ms",
                  animationFillMode: "forwards",
                }}
              >
                Get AI code reviews on every PR with just a few clicks. No
                complex setup required.
              </p>
              <div className="space-y-2">
                <StepCard
                  number={1}
                  title="Install the GitHub App"
                  description="Connect CodeHorse to your GitHub organization or repository in one click."
                  delay={200}
                />
                <StepCard
                  number={2}
                  title="Configure your preferences"
                  description="Set your review rules, focus areas, and comment style to match your team's workflow."
                  delay={300}
                />
                <StepCard
                  number={3}
                  title="Get AI reviews on every PR"
                  description="CodeHorse automatically reviews new pull requests and comments with suggestions."
                  delay={400}
                />
              </div>
            </div>
            <div
              className="relative opacity-0 animate-fade-slide-up"
              style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
            >
              {/* Mock PR comment */}
              <div className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        codehorse[bot]
                      </span>
                      <span className="text-xs text-muted-foreground">
                        commented just now
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                      <p className="text-sm mb-3">
                        <span className="text-yellow-500">⚠️</span> Potential
                        memory leak detected in this useEffect hook.
                      </p>
                      <div className="p-3 rounded-lg bg-zinc-950/80 font-mono text-xs text-zinc-400 mb-3">
                        <code>
                          <span className="text-purple-400">useEffect</span>
                          {"(() => {"}
                          <br />
                          {"  "}
                          <span className="text-blue-400">subscribe</span>
                          {"(handler);"}
                          <br />
                          {"  "}
                          <span className="text-green-400">
                            {"// Missing cleanup"}
                          </span>
                          <br />
                          {"});"}
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Consider adding a cleanup function to unsubscribe when
                        the component unmounts.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-14">
                  <Button size="sm" variant="ghost" className="text-xs">
                    👍 Helpful
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs">
                    Apply suggestion
                  </Button>
                </div>
              </div>
              {/* Decoration */}
              <div className="absolute -z-10 top-8 left-8 right-8 bottom-0 rounded-2xl border border-border/30 bg-card/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "10M+", label: "Lines reviewed" },
              { value: "50K+", label: "Bugs caught" },
              { value: "2.5K+", label: "Teams using" },
              { value: "70%", label: "Faster reviews" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl opacity-0 animate-fade-slide-up"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-card/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 opacity-0 animate-fade-slide-up"
              style={{ animationFillMode: "forwards" }}
            >
              Loved by{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                engineering teams
              </span>
            </h2>
            <p
              className="text-muted-foreground opacity-0 animate-fade-slide-up"
              style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
            >
              See what developers are saying about CodeHorse
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard
                key={testimonial.author}
                {...testimonial}
                delay={200 + i * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 opacity-0 animate-fade-slide-up"
              style={{ animationFillMode: "forwards" }}
            >
              Simple,{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                transparent pricing
              </span>
            </h2>
            <p
              className="text-muted-foreground opacity-0 animate-fade-slide-up"
              style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
            >
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Starter"
              price="$0"
              description="Perfect for side projects"
              features={[
                "Up to 5 repositories",
                "100 reviews/month",
                "Basic AI suggestions",
                "GitHub integration",
                "Community support",
              ]}
              delay={200}
            />
            <PricingCard
              name="Pro"
              price="$49"
              description="For growing teams"
              features={[
                "Unlimited repositories",
                "Unlimited reviews",
                "Advanced AI analysis",
                "Security scanning",
                "Custom rules",
                "Priority support",
              ]}
              popular
              delay={300}
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              description="For large organizations"
              features={[
                "Everything in Pro",
                "Self-hosted option",
                "SSO & SAML",
                "Dedicated support",
                "Custom integrations",
                "SLA guarantee",
              ]}
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative p-12 rounded-3xl border border-border/50 bg-linear-to-br from-primary/10 via-card/60 to-secondary/10 backdrop-blur-xl text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-size-[2rem_2rem]" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-sm mb-6">
                <GitBranch className="w-4 h-4 text-primary" />
                <span>Ready to transform your workflow?</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Start shipping better code today
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of developers who use CodeHorse to catch bugs,
                improve code quality, and ship faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="h-14 px-8 rounded-2xl text-base">
                    Get Started for Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 rounded-2xl text-base"
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
