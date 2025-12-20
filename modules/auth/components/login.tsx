"use client";

import { signIn } from "@/modules/auth/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthPage, Testimonial } from "./auth-page";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "Amazing platform! The user experience is seamless and the features are exactly what I needed.",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "This service has transformed how I work. Clean design, powerful features, and excellent support.",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Martinez",
    handle: "@davidcreates",
    text: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity.",
  },
];

const LoginUI = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "github",
      });
    } catch (error) {
      console.error("[LOGIN_ERR]", error);
      toast.error("Failed to sign in with GitHub. Please try again.");
    }
    setIsLoading(false);
  };

  const handleResetPassword = () => {
    // Navigate to reset password page or open modal
    console.log("Reset password clicked");
  };

  const handleSwitchToRegister = () => {
    router.push("/register");
  };

  return (
    <AuthPage
      mode="signin"
      heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
      testimonials={sampleTestimonials}
      formPosition="right"
      isLoading={isLoading}
      onGitHubSignIn={handleGitHubLogin}
      onResetPassword={handleResetPassword}
      onSwitchMode={handleSwitchToRegister}
    />
  );
};

export default LoginUI;
