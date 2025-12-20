"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowLeft, Eye, EyeOff, Github, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="size-5"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"
    />
  </svg>
);

// --- TYPE DEFINITIONS ---

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

type AuthMode = "signin" | "signup";
type AuthStep = "email" | "password";

interface AuthPageProps {
  mode?: AuthMode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  formPosition?: "left" | "right";
  isLoading?: boolean;
  onSignIn?: (email: string, password: string) => void;
  onSignUp?: (name: string, email: string, password: string) => void;
  onGoogleSignIn?: () => void;
  onGitHubSignIn?: () => void;
  onResetPassword?: () => void;
  onSwitchMode?: () => void;
}

// For backward compatibility
export interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
}

// --- SUB-COMPONENTS ---

const TestimonialCard = ({
  testimonial,
  delay,
}: {
  testimonial: Testimonial;
  delay: number;
}) => (
  <div
    style={{ animationDelay: delay.toString() + "ms" }}
    className={cn(
      "opacity-0 blur-xs animate-fade-slide-in flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64",
      {
        hidden: !testimonial,
        "hidden xl:flex": delay > 500,
        "hidden xl:hidden 2xl:flex": delay > 700,
      }
    )}
  >
    <Image
      src={testimonial.avatarSrc}
      width={40}
      height={40}
      className="object-cover w-10 h-10 rounded-2xl"
      alt="avatar"
    />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
      <p className="text-muted-foreground">{testimonial.handle}</p>
      <p className="mt-1 text-foreground/80">{testimonial.text}</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const AuthPage: React.FC<AuthPageProps> = ({
  mode = "signin",
  title,
  description,
  heroImageSrc,
  testimonials = [],
  formPosition = "right",
  isLoading = false,
  onSignIn,
  onSignUp,
  onGoogleSignIn,
  onGitHubSignIn,
  onResetPassword,
  onSwitchMode,
}) => {
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isSignUp = mode === "signup";

  const defaultTitle = isSignUp ? (
    <span className="font-light tracking-tighter text-foreground">
      Create Account
    </span>
  ) : (
    <span className="font-light tracking-tighter text-foreground">
      Welcome Back
    </span>
  );

  const defaultDescription = isSignUp
    ? "Join us and start your journey today"
    : "Access your account and continue your journey with us";

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setStep("password");
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      if (isSignUp) {
        onSignUp?.(name, email, password);
      } else {
        onSignIn?.(email, password);
      }
    }
  };

  const handleBack = () => {
    setStep("email");
    setPassword("");
    setName("");
  };

  const formSection = (
    <section className="flex items-center justify-center flex-1 p-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {step === "password" && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 transition-colors opacity-0 animate-fade-slide-up blur-xs text-muted-foreground hover:text-foreground w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
          )}

          <h1 className="text-4xl font-semibold leading-tight delay-100 opacity-0 animate-fade-slide-up blur-xs md:text-5xl">
            {title || defaultTitle}
          </h1>
          <p className="delay-200 opacity-0 animate-fade-slide-up blur-xs text-muted-foreground">
            {step === "password" ? (
              <span className="flex items-center gap-2">
                Signing in as{" "}
                <span className="font-medium text-foreground">{email}</span>
              </span>
            ) : (
              description || defaultDescription
            )}
          </p>

          {step === "email" ? (
            <>
              <form
                className={cn("space-y-5", {
                  hidden: !onSignIn && !onSignUp,
                })}
                onSubmit={handleEmailSubmit}
              >
                <div className="delay-300 opacity-0 animate-fade-slide-up blur-xs">
                  <label className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </label>
                  {/* <GlassInputWrapper> */}
                  <Input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.deo@acme.com"
                    className="w-full p-4 text-sm transition-colors border h-14 focus-visible:ring-0 rounded-2xl border-border bg-foreground/5 backdrop-blur-sm focus-within:border-violet-400/70 focus-within:bg-violet-500/10"
                    autoFocus
                  />
                  {/* </GlassInputWrapper> */}
                </div>

                <Button
                  type="submit"
                  className="h-14 animate-fade-slide-up opacity-0 blur-xs delay-[400] w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Continue
                </Button>
              </form>

              <div
                className={cn(
                  "relative flex items-center justify-center delay-500 opacity-0 animate-fade-slide-up blur-xs",
                  {
                    hidden:
                      (!onGoogleSignIn && !onGitHubSignIn) ||
                      (!isSignUp && !onSignIn) ||
                      (isSignUp && !onSignUp),
                  }
                )}
              >
                <span className="w-full border-t border-border"></span>
                <span className="absolute px-4 text-sm text-muted-foreground bg-background">
                  Or continue with
                </span>
              </div>

              <div className="flex flex-col gap-3 delay-700 opacity-0 animate-fade-slide-up blur-xs">
                <Button
                  variant="outline"
                  disabled={isLoading}
                  className={cn(
                    "flex items-center justify-center w-full gap-3 py-4 text-base transition-colors border h-14 border-border rounded-2xl",
                    {
                      hidden: !onGoogleSignIn,
                    }
                  )}
                  onClick={onGoogleSignIn}
                >
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  disabled={isLoading}
                  onClick={onGitHubSignIn}
                  className={cn(
                    "flex items-center justify-center w-full gap-3 py-4 text-base transition-colors border h-14 border-border rounded-2xl",
                    {
                      hidden: !onGitHubSignIn,
                    }
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Github className="size-5" />
                  )}
                  Continue with GitHub
                </Button>
              </div>

              <p className="text-sm text-center delay-700 opacity-0 animate-fade-slide-up blur-xs text-muted-foreground">
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onSwitchMode?.();
                      }}
                      className="transition-colors text-violet-400 hover:underline"
                    >
                      Sign In
                    </a>
                  </>
                ) : (
                  <>
                    New to our platform?{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onSwitchMode?.();
                      }}
                      className="transition-colors text-violet-400 hover:underline"
                    >
                      Create Account
                    </a>
                  </>
                )}
              </p>
            </>
          ) : (
            <form
              className={cn("space-y-5", {
                hidden: !onSignIn || !onSignUp,
              })}
              onSubmit={handlePasswordSubmit}
            >
              {isSignUp && (
                <div className="delay-100 opacity-0 animate-fade-slide-up blur-xs">
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-4 text-sm transition-colors border h-14 focus-visible:ring-0 rounded-2xl border-border bg-foreground/5 backdrop-blur-sm focus-within:border-violet-400/70 focus-within:bg-violet-500/10"
                    autoFocus={isSignUp}
                  />
                </div>
              )}
              <div
                className={
                  isSignUp
                    ? "delay-200 opacity-0 animate-fade-slide-up blur-xs"
                    : "delay-100 opacity-0 animate-fade-slide-up blur-xs"
                }
              >
                <label className="text-sm font-medium text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      isSignUp ? "Create a password" : "Your password"
                    }
                    className="w-full p-4 text-sm transition-colors border h-14 focus-visible:ring-0 rounded-2xl border-border bg-foreground/5 backdrop-blur-sm focus-within:border-violet-400/70 focus-within:bg-violet-500/10"
                    autoFocus={!isSignUp}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 flex items-center right-3"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 transition-colors text-muted-foreground hover:text-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 transition-colors text-muted-foreground hover:text-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between text-sm delay-200 opacity-0 animate-fade-slide-up blur-xs">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      className="accent-primary size-4"
                    />
                    <span className="text-foreground/90">
                      Keep me signed in
                    </span>
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onResetPassword?.();
                    }}
                    className="transition-colors hover:underline text-violet-400"
                  >
                    Reset password
                  </a>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 font-medium transition-colors delay-300 opacity-0 h-14 animate-fade-slide-up blur-xs rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );

  const heroSection = heroImageSrc && (
    <section className="relative flex-1 hidden m-4 md:block">
      <div
        className={cn(
          "absolute inset-0 opacity-0 rounded-3xl scale-95",
          formPosition === "right"
            ? "animate-slide-from-right"
            : "animate-slide-from-left"
        )}
        style={{
          backgroundImage: `url(${heroImageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {testimonials.length > 0 && (
        <div className="absolute flex justify-center w-full gap-4 px-8 -translate-x-1/2 bottom-8 left-1/2">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              delay={500 + index * 200}
            />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="flex flex-col w-screen h-dvh md:flex-row font-geist">
      {formPosition === "left" ? (
        <>
          {formSection}
          {heroSection}
        </>
      ) : (
        <>
          {heroSection}
          {formSection}
        </>
      )}
    </div>
  );
};

// Backward compatible SignInPage component
export const SignInPage: React.FC<SignInPageProps> = ({
  title,
  description,
  heroImageSrc,
  testimonials,
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
}) => {
  const handleSignIn = (email: string, password: string) => {
    // Create a synthetic form event for backward compatibility
    const form = document.createElement("form");
    const emailInput = document.createElement("input");
    emailInput.name = "email";
    emailInput.value = email;
    const passwordInput = document.createElement("input");
    passwordInput.name = "password";
    passwordInput.value = password;
    form.appendChild(emailInput);
    form.appendChild(passwordInput);

    const syntheticEvent = {
      preventDefault: () => {},
      currentTarget: form,
    } as React.FormEvent<HTMLFormElement>;

    onSignIn?.(syntheticEvent);
  };

  return (
    <AuthPage
      mode="signin"
      title={title}
      description={description}
      heroImageSrc={heroImageSrc}
      testimonials={testimonials}
      formPosition="right"
      onSignIn={handleSignIn}
      onGoogleSignIn={onGoogleSignIn}
      onResetPassword={onResetPassword}
      onSwitchMode={onCreateAccount}
    />
  );
};
